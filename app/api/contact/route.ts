import { NextResponse } from 'next/server';
import { PENDING_CLIENT_DATA } from '@/lib/site';

/**
 * Contact form handler.
 *
 * ── BEFORE LAUNCH ───────────────────────────────────────────────────────────
 * Deliver these to the customer-care inbox. With Resend:
 *
 *   await resend.emails.send({
 *     from: 'Kshyovrata <care@kshyovrata.com>',
 *     to: [process.env.CARE_INBOX!],
 *     replyTo: email,
 *     subject: `[${topic}] ${name}`,
 *     text: body,
 *   });
 *
 * Add rate limiting (Vercel KV or Upstash) before going live — this endpoint
 * is otherwise an open relay for spam.
 */

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

type Payload = {
  name?: unknown;
  email?: unknown;
  message?: unknown;
  topic?: unknown;
  orderId?: unknown;
};

function str(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, message: 'Invalid request.' }, { status: 400 });
  }

  const name = str(payload.name, 120);
  const email = str(payload.email, 254).toLowerCase();
  const message = str(payload.message, 2000);
  const topic = str(payload.topic, 80) || 'General';
  const orderId = str(payload.orderId, 40);

  if (!name || !message) {
    return NextResponse.json(
      { ok: false, message: 'Please include your name and a message.' },
      { status: 400 },
    );
  }

  if (!EMAIL.test(email)) {
    return NextResponse.json(
      { ok: false, message: 'Please give us a valid email address to reply to.' },
      { status: 400 },
    );
  }

  // Replace with the provider call described above.
  console.info('[contact] message received', { name, email, topic, orderId });

  return NextResponse.json({
    ok: true,
    message: `We have your message about “${topic.toLowerCase()}” and will reply to ${email} within one working day. If it is urgent, ${PENDING_CLIENT_DATA.customerCareEmail} reaches the same inbox.`,
  });
}
