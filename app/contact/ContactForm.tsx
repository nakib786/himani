'use client';

import { useState } from 'react';
import { PENDING_CLIENT_DATA } from '@/lib/site';

const TOPICS = [
  'An order I placed',
  'A return or refund',
  'A product question',
  'Materials and skin sensitivity',
  'Wholesale or press',
  'Something else',
];

/**
 * Contact form.
 *
 * Posts to /api/contact, which validates and — until an email provider is
 * connected — records the submission server-side and returns the customer-care
 * address so nobody's message disappears into a void. See the route for the
 * Resend wiring instructions.
 */
export function ContactForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  if (state === 'done') {
    return (
      <div className="border border-rule-strong p-8">
        <h2 className="display-md text-fg">Thank you</h2>
        <p className="body-lg mt-4">{message}</p>
        <button
          type="button"
          className="btn btn-secondary mt-7"
          onClick={() => setState('idle')}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      className="border-t border-rule pt-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const data = Object.fromEntries(new FormData(form).entries());
        setState('sending');
        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const json = (await res.json()) as { ok?: boolean; message?: string };
          if (!res.ok || !json.ok) throw new Error(json.message ?? 'Please try again.');
          setMessage(json.message ?? 'We will be in touch shortly.');
          setState('done');
          form.reset();
        } catch (err) {
          setState('error');
          setMessage(err instanceof Error ? err.message : 'Please try again.');
        }
      }}
    >
      <h2 className="eyebrow eyebrow-ink">Send a message</h2>

      <div className="mt-7 flex flex-col gap-7">
        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="name" className="caption">
              Your name
            </label>
            <input id="name" name="name" required autoComplete="name" className="field mt-1" />
          </div>
          <div>
            <label htmlFor="contact-email" className="caption">
              Email
            </label>
            <input
              id="contact-email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="field mt-1"
            />
          </div>
        </div>

        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="orderId" className="caption">
              Order number — optional
            </label>
            <input id="orderId" name="orderId" className="field mt-1" placeholder="KSH-…" />
          </div>
          <div>
            <label htmlFor="topic" className="caption">
              What is it about?
            </label>
            <select id="topic" name="topic" className="field mt-1" defaultValue={TOPICS[0]}>
              {TOPICS.map((topic) => (
                <option key={topic} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="message" className="caption">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            required
            maxLength={2000}
            className="field mt-1 resize-none"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-8" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending' : 'Send message'}
      </button>

      <p aria-live="polite" className="caption mt-4">
        {state === 'error' ? (
          <span className="text-error">
            {message} You can also email{' '}
            <a
              href={`mailto:${PENDING_CLIENT_DATA.customerCareEmail}`}
              className="link-rule text-fg"
            >
              {PENDING_CLIENT_DATA.customerCareEmail}
            </a>
            .
          </span>
        ) : (
          'We reply within one working day, usually sooner.'
        )}
      </p>
    </form>
  );
}
