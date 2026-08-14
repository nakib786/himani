import 'server-only';
import { getCloudflareContext } from '@opennextjs/cloudflare';

/**
 * Transactional email, delivered by the Cloudflare Email Sending binding
 * declared as `send_email` in wrangler.jsonc. No API key and no third-party
 * provider — the Worker talks to Cloudflare directly.
 *
 * Two things have to be true before a send succeeds:
 *
 *   1. The sender domain is onboarded:
 *        npx wrangler email sending enable kshyovrata.com
 *      Cloudflare returns E_SENDER_NOT_VERIFIED until this is done.
 *   2. `from` and `to` are different addresses. Cloudflare rejects a message
 *      that is addressed to its own sender.
 *
 * Callers get a result object rather than an exception, so a route can decide
 * whether a failed send is worth surfacing to the visitor. Nothing here ever
 * reports success for a message that was not accepted.
 */

type EmailAddress = { email: string; name?: string };

type SendEmailBinding = {
  send(message: {
    to: string | string[];
    from: string | EmailAddress;
    replyTo?: string;
    subject: string;
    html?: string;
    text?: string;
  }): Promise<{ messageId?: string }>;
};

type EmailEnv = {
  EMAIL?: SendEmailBinding;
  CARE_INBOX?: string;
  CONTACT_EMAIL_FROM?: string;
};

const DEFAULT_FROM = 'noreply@kshyovrata.com';
const SENDER_NAME = 'Kshyovrata';

export type SendResult =
  | { ok: true; messageId?: string }
  | { ok: false; reason: string };

function readEnv(): EmailEnv {
  try {
    return (getCloudflareContext().env ?? {}) as EmailEnv;
  } catch {
    // Thrown outside a Worker request context — plain `next build`, or a unit
    // test. Treated the same as a missing binding.
    return {};
  }
}

/** Recipients for anything that should reach a human at Kshyovrata. */
export function careInbox(env: EmailEnv = readEnv()): string[] {
  return (env.CARE_INBOX ?? '')
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);
}

export async function sendEmail(message: {
  to: string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<SendResult> {
  const env = readEnv();
  const binding = env.EMAIL;

  if (!binding?.send) {
    // Local `next dev` without remote bindings, or the binding was dropped
    // from wrangler.jsonc. Log enough to recover the submission by hand.
    console.error('[email] EMAIL binding unavailable; message not sent', {
      to: message.to,
      subject: message.subject,
    });
    return { ok: false, reason: 'EMAIL binding unavailable' };
  }

  const to = message.to.filter(Boolean);
  if (to.length === 0) {
    console.error('[email] no recipients configured (CARE_INBOX is empty)');
    return { ok: false, reason: 'No recipients configured' };
  }

  const from = (env.CONTACT_EMAIL_FROM ?? DEFAULT_FROM).trim() || DEFAULT_FROM;

  // Cloudflare rejects from === to outright; catching it here gives a clearer
  // log line than the runtime error does.
  if (to.some((recipient) => recipient.toLowerCase() === from.toLowerCase())) {
    console.error('[email] sender and recipient are the same address', { from, to });
    return { ok: false, reason: 'Sender and recipient must differ' };
  }

  try {
    const response = await binding.send({
      to,
      from: { email: from, name: SENDER_NAME },
      ...(message.replyTo ? { replyTo: message.replyTo } : {}),
      subject: message.subject,
      text: message.text,
      // A text part always goes out alongside the HTML — some clients only
      // render text, and text-less mail scores worse with spam filters.
      ...(message.html ? { html: message.html } : {}),
    });
    return { ok: true, messageId: response?.messageId };
  } catch (error) {
    const code = (error as { code?: string })?.code;
    console.error('[email] send failed', {
      code,
      message: (error as Error)?.message,
      to,
      subject: message.subject,
    });
    return { ok: false, reason: code ?? 'send failed' };
  }
}

/** Escapes interpolated values so submitted text cannot inject markup. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
