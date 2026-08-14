import { NextResponse } from 'next/server';
import { COMMERCE } from '@/lib/site';
import { careInbox, escapeHtml, sendEmail } from '@/lib/email';

/**
 * Newsletter signup.
 *
 * The address is delivered to the care inbox through the Cloudflare Email
 * Sending binding, so every signup reaches a person who can add it to the list
 * and issue the welcome code.
 *
 * ── BEFORE LAUNCH ───────────────────────────────────────────────────────────
 * This is a notification, not a subscription system. Push the address into a
 * real list and issue the first-order discount from the Wix Coupons API (or
 * Razorpay offers) so codes are single-use, then send the welcome mail from
 * here instead of by hand.
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

  const sent = await sendEmail({
    to: careInbox(),
    replyTo: email,
    subject: `Newsletter signup: ${email}`,
    text: `${email} asked to join the Kshyovrata list.`,
    html: `<p>${escapeHtml(email)} asked to join the Kshyovrata list.</p>`,
  });

  if (!sent.ok) {
    return NextResponse.json(
      { ok: false, message: 'We could not add you just now. Please try again shortly.' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `You are on the list. Your ${COMMERCE.firstOrderDiscountPercent}% code is on its way.`,
  });
}
