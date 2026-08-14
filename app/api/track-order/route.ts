import { NextResponse } from 'next/server';
import { PENDING_CLIENT_DATA } from '@/lib/site';

/**
 * Guest order tracking.
 *
 * ── BEFORE LAUNCH ───────────────────────────────────────────────────────────
 * Two calls replace the stub below:
 *
 *   1. Look the order up by id + phone in the commerce backend
 *      (Wix eCommerce Orders API, server-side only), so we only ever expose an
 *      order to someone who already knows both fields.
 *   2. Fetch live status from Shiprocket:
 *      GET https://apiv2.shiprocket.in/v1/external/courier/track/awb/{awb}
 *      with a bearer token from /v1/external/auth/login.
 *
 * Shiprocket also posts status changes to a webhook — persist those and this
 * endpoint becomes a database read rather than a third-party round trip.
 *
 * Deliberately NOT implemented as a fake: an order-tracking page that invents
 * a status is worse than one that tells you where to look.
 */

export async function POST(request: Request) {
  let orderId = '';
  let phone = '';

  try {
    const body = (await request.json()) as { orderId?: unknown; phone?: unknown };
    orderId = typeof body.orderId === 'string' ? body.orderId.trim().slice(0, 40) : '';
    phone = typeof body.phone === 'string' ? body.phone.replace(/\D/g, '').slice(-10) : '';
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }

  if (!orderId) {
    return NextResponse.json(
      { ok: false, message: 'Please enter your order number.' },
      { status: 400 },
    );
  }

  if (phone.length !== 10) {
    return NextResponse.json(
      { ok: false, message: 'Please enter the 10-digit mobile number used on the order.' },
      { status: 400 },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      pending: true,
      message: `Live tracking goes live with our courier integration. In the meantime, email ${PENDING_CLIENT_DATA.customerCareEmail} with order ${orderId} and we will send you the current status the same working day.`,
    },
    { status: 503 },
  );
}
