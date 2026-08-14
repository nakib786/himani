'use client';

import { useState } from 'react';

export function TrackForm() {
  const [state, setState] = useState<'idle' | 'checking' | 'error'>('idle');
  const [message, setMessage] = useState('');

  return (
    <form
      className="border-t border-rule pt-5"
      onSubmit={async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget).entries());
        setState('checking');
        try {
          const res = await fetch('/api/track-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          });
          const json = (await res.json()) as { ok?: boolean; message?: string };
          setState('error');
          setMessage(json.message ?? 'We could not find that order.');
        } catch {
          setState('error');
          setMessage('Something went wrong. Please try again in a moment.');
        }
      }}
    >
      <h2 className="eyebrow eyebrow-ink">Find your order</h2>

      <div className="mt-7 flex flex-col gap-7">
        <div>
          <label htmlFor="orderId" className="caption">
            Order number
          </label>
          <input
            id="orderId"
            name="orderId"
            required
            placeholder="KSH-00000"
            className="field mt-1"
            autoComplete="off"
          />
        </div>
        <div>
          <label htmlFor="phone" className="caption">
            Mobile number used on the order
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            required
            placeholder="10 digits"
            className="field mt-1"
            autoComplete="tel"
          />
        </div>
      </div>

      <button type="submit" className="btn btn-primary mt-8" disabled={state === 'checking'}>
        {state === 'checking' ? 'Looking' : 'Track order'}
      </button>

      <div aria-live="polite" className="mt-5">
        {state === 'error' ? (
          <p className="body-sm border border-rule-strong p-4">{message}</p>
        ) : null}
      </div>
    </form>
  );
}
