import { NextResponse } from 'next/server';
import { COMMERCE } from '@/lib/site';

/**
 * Newsletter signup.
 *
 * ── BEFORE LAUNCH ───────────────────────────────────────────────────────────
 * Connect an email provider. With Resend:
 *
 *   npm i resend
 *   RESEND_API_KEY=...            (Vercel env var)
 *   RESEND_AUDIENCE_ID=...
 *
 *   import { Resend } from 'resend';
 *   const resend = new Resend(process.env.RESEND_API_KEY);
 *   await resend.contacts.create({ email, audienceId: process.env.RESEND_AUDIENCE_ID! });
 *
 * Then issue the first-order discount code from the Wix Coupons API (or
 * Razorpay offers) rather than the static string below, so codes are single-use.
 *
 * Until then this validates the address and returns a truthful message —
 * it does not pretend a subscription was created.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export async function POST(request: Request) {
  let email = '';
  try {
    const body = (await request.json()) as { email?: unknown };
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }

  if (!EMAIL.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, message: 'That does not look like a valid email address.' },
      { status: 400 },
    );
  }

  // Replace with the provider call described above.
  console.info('[newsletter] pending subscription:', email);

  return NextResponse.json({
    ok: true,
    message: `You are on the list. Your ${COMMERCE.firstOrderDiscountPercent}% code is on its way.`,
  });
}
