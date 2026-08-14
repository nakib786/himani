import { NextResponse } from 'next/server';
import { PENDING_CLIENT_DATA } from '@/lib/site';
import { careInbox, escapeHtml, sendEmail } from '@/lib/email';

/**
 * Contact form handler.
 *
 * Delivered to the care inbox through the Cloudflare Email Sending binding —
 * see lib/email.ts for the prerequisites. `replyTo` is set to the visitor so
 * answering the notification answers the customer.
 *
 * ── BEFORE LAUNCH ───────────────────────────────────────────────────────────
 * Add rate limiting (Workers KV or the Rate Limiting binding) — this endpoint
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

  const lines = [
    `Name:   ${name}`,
    `Email:  ${email}`,
    `Topic:  ${topic}`,
    ...(orderId ? [`Order:  ${orderId}`] : []),
    '',
    message,
  ];

  const sent = await sendEmail({
    to: careInbox(),
    replyTo: email,
    subject: `[${topic}] ${name}`,
    text: lines.join('\n'),
    html: `<pre style="font:14px/1.6 ui-monospace,monospace;white-space:pre-wrap">${escapeHtml(
      lines.join('\n'),
    )}</pre>`,
  });

  if (!sent.ok) {
    // Say so rather than pretending the message landed. The address below is
    // the same inbox, reached without going through this endpoint.
    return NextResponse.json(
      {
        ok: false,
        message: `We could not deliver your message just now. Please email ${PENDING_CLIENT_DATA.customerCareEmail} directly and we will pick it up from there.`,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    message: `We have your message about “${topic.toLowerCase()}” and will reply to ${email} within one working day. If it is urgent, ${PENDING_CLIENT_DATA.customerCareEmail} reaches the same inbox.`,
  });
}
