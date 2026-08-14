'use client';

import { useState } from 'react';
import { formatPrice, formatShortDate } from '@/lib/format';
import { COMMERCE } from '@/lib/site';

type Result = {
  ok: true;
  city: string;
  state: string;
  delivery: { minDays: number; maxDays: number; earliest: string; latest: string };
  cod: { available: boolean; capped: number; fee: number };
};

export function DeliveryEstimator() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'done' | 'error'>('idle');
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState('');

  return (
    <div className="mt-8 border-t border-rule pt-6">
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          const pincode = String(new FormData(e.currentTarget).get('pincode') ?? '').trim();
          setStatus('checking');
          setError('');
          try {
            const res = await fetch(`/api/pincode?pincode=${encodeURIComponent(pincode)}`);
            const data = await res.json();
            if (!res.ok || !data.ok) throw new Error(data.message ?? 'Please try again.');
            setResult(data as Result);
            setStatus('done');
          } catch (err) {
            setResult(null);
            setStatus('error');
            setError(err instanceof Error ? err.message : 'Please try again.');
          }
        }}
      >
        <label htmlFor="pincode" className="eyebrow">
          Delivery &amp; COD
        </label>
        <div className="mt-3 flex items-end gap-3">
          <input
            id="pincode"
            name="pincode"
            inputMode="numeric"
            pattern="[1-9][0-9]{5}"
            maxLength={6}
            required
            placeholder="6-digit PIN code"
            className="field flex-1"
            autoComplete="postal-code"
          />
          <button type="submit" className="btn btn-ghost btn-sm shrink-0">
            {status === 'checking' ? 'Checking' : 'Check'}
          </button>
        </div>
      </form>

      <div aria-live="polite" className="mt-4">
        {status === 'error' ? <p className="caption text-error">{error}</p> : null}

        {status === 'done' && result ? (
          <dl className="flex flex-col gap-2">
            <div className="flex justify-between gap-4">
              <dt className="caption">Delivering to</dt>
              <dd className="caption text-right text-fg">
                {result.city}, {result.state}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="caption">Estimated arrival</dt>
              <dd className="caption text-right text-fg">
                {formatShortDate(new Date(result.delivery.earliest))} –{' '}
                {formatShortDate(new Date(result.delivery.latest))}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="caption">Cash on delivery</dt>
              <dd className="caption text-right text-fg">
                Available up to {formatPrice(result.cod.capped)} · {formatPrice(result.cod.fee)}{' '}
                fee
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="caption">Shipping</dt>
              <dd className="caption text-right text-fg">
                Free above {formatPrice(COMMERCE.freeShippingThreshold)}
              </dd>
            </div>
          </dl>
        ) : null}

        {status === 'idle' ? (
          <p className="caption">
            Free shipping above {formatPrice(COMMERCE.freeShippingThreshold)} · Cash on delivery
            available · {COMMERCE.returnWindowDays}-day returns
          </p>
        ) : null}
      </div>
    </div>
  );
}
