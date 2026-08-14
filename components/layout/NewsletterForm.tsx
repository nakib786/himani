'use client';

import { useState } from 'react';
import { COMMERCE } from '@/lib/site';
import { IconArrowRight } from '@/components/brand/Motifs';

/**
 * Email capture.
 *
 * Single field, inline, no modal on first visit (brief §4). There is no
 * exit-intent popup in this build either — an interstitial is the fastest way
 * to make a premium storefront feel like a coupon site.
 *
 * WIRING: POST to /api/newsletter, which currently validates and logs. Connect
 * it to Resend (or Wix Email Marketing) — see app/api/newsletter/route.ts.
 */
export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [message, setMessage] = useState('');

  return (
    <form
      className="w-full"
      onSubmit={async (e) => {
        e.preventDefault();
        const form = e.currentTarget;
        const email = String(new FormData(form).get('email') ?? '').trim();
        if (!email) return;

        setState('sending');
        try {
          const res = await fetch('/api/newsletter', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
          });
          const data = (await res.json()) as { ok?: boolean; message?: string };
          if (!res.ok || !data.ok) throw new Error(data.message ?? 'Something went wrong');
          setState('done');
          setMessage(data.message ?? 'Check your inbox for your code.');
          form.reset();
        } catch (err) {
          setState('error');
          setMessage(err instanceof Error ? err.message : 'Something went wrong');
        }
      }}
    >
      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor={compact ? 'email-footer' : 'email-main'} className="sr-only">
            Email address
          </label>
          <input
            id={compact ? 'email-footer' : 'email-main'}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="Your email address"
            className="field"
            aria-describedby={compact ? 'newsletter-note-footer' : 'newsletter-note-main'}
          />
        </div>
        <button
          type="submit"
          className="btn btn-secondary btn-sm shrink-0"
          disabled={state === 'sending'}
        >
          {state === 'sending' ? 'Sending' : 'Join'}
          <IconArrowRight className="h-3 w-3" />
        </button>
      </div>

      <p
        id={compact ? 'newsletter-note-footer' : 'newsletter-note-main'}
        className="caption mt-3"
      >
        {COMMERCE.firstOrderDiscountPercent}% off your first order. Occasional letters, never
        more than one a fortnight. Unsubscribe whenever you like.
      </p>

      <p
        aria-live="polite"
        className={
          state === 'error' ? 'caption mt-2 text-error' : 'caption mt-2 text-success'
        }
      >
        {state === 'done' || state === 'error' ? message : ''}
      </p>
    </form>
  );
}
