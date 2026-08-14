import { NextResponse } from 'next/server';
import { COMMERCE } from '@/lib/site';

/**
 * Pincode lookup.
 *
 * Resolves an Indian PIN code to its post office, district and state using the
 * Government of India's public India Post API. Proxied through this route
 * rather than called from the browser so there is no CORS dependency and the
 * response can be cached at the edge.
 *
 * ── BEFORE LAUNCH ───────────────────────────────────────────────────────────
 * The delivery window returned here is a *generic* estimate derived from
 * distance-agnostic handling and transit assumptions. Replace `estimateDays()`
 * with a live Shiprocket serviceability call
 * (GET /v1/external/courier/serviceability) once the account exists — that
 * returns real courier ETAs and real COD serviceability per pincode, which is
 * the only trustworthy source for both numbers.
 */

type IndiaPostResponse = {
  Status: string;
  PostOffice?: { Name: string; District: string; State: string }[];
}[];

/** Metro and adjacent circles clear faster; everything else gets the wider band. */
const FAST_PREFIXES = ['11', '40', '56', '60', '70', '50', '38', '41', '20', '12'];

function estimateDays(pincode: string): { min: number; max: number } {
  const fast = FAST_PREFIXES.some((p) => pincode.startsWith(p));
  return fast ? { min: 2, max: 4 } : { min: 4, max: 7 };
}

function addBusinessDays(from: Date, days: number): Date {
  const date = new Date(from);
  let added = 0;
  while (added < days) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() !== 0) added += 1; // Couriers work Saturdays, not Sundays.
  }
  return date;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pincode = (searchParams.get('pincode') ?? '').trim();

  if (!/^[1-9][0-9]{5}$/.test(pincode)) {
    return NextResponse.json(
      { ok: false, message: 'Enter a valid 6-digit PIN code.' },
      { status: 400 },
    );
  }

  try {
    const upstream = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
      // PIN code data is effectively static; cache it hard.
      next: { revalidate: 60 * 60 * 24 * 30 },
      headers: { Accept: 'application/json' },
    });

    if (!upstream.ok) throw new Error(`Upstream responded ${upstream.status}`);

    const data = (await upstream.json()) as IndiaPostResponse;
    const record = data?.[0];
    const office = record?.PostOffice?.[0];

    if (record?.Status !== 'Success' || !office) {
      return NextResponse.json(
        { ok: false, message: 'We could not find that PIN code. Please check and try again.' },
        { status: 404 },
      );
    }

    const { min, max } = estimateDays(pincode);
    const now = new Date();

    return NextResponse.json({
      ok: true,
      pincode,
      city: office.District,
      state: office.State,
      office: office.Name,
      delivery: {
        minDays: min,
        maxDays: max,
        earliest: addBusinessDays(now, min).toISOString(),
        latest: addBusinessDays(now, max).toISOString(),
      },
      cod: {
        // Serviceability is assumed until Shiprocket is wired — see the note
        // at the top of this file. The cap is a real business rule.
        available: true,
        capped: COMMERCE.codCap,
        fee: COMMERCE.codFee,
      },
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: 'We could not check that right now. Delivery is 2–7 days across India.',
      },
      { status: 502 },
    );
  }
}
