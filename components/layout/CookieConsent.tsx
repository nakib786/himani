'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Cookie consent — DPDP Act 2023 (brief §10).
 *
 * Defaults to essential-only: nothing beyond strictly necessary storage runs
 * until the visitor actively accepts. "Decline" is a real button of equal
 * weight, not a buried link — a pre-ticked or hard-to-refuse banner is not
 * consent under the Act.
 *
 * Analytics scripts (GA4, Meta Pixel) must be gated on the value this writes:
 *   localStorage.ksh_consent === 'all'
 */
const KEY = 'ksh_consent';

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!window.localStorage.getItem(KEY)) {
        // Let the page settle before asking. Never on first paint.
        const t = window.setTimeout(() => setVisible(true), 1200);
        return () => window.clearTimeout(t);
      }
    } catch {
      /* no-op */
    }
  }, []);

  const decide = (value: 'essential' | 'all') => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* no-op */
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent('ksh:consent', { detail: value }));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-[80] border-t border-rule bg-bg"
    >
      <div className="shell flex flex-col gap-5 py-5 md:flex-row md:items-center md:justify-between md:gap-10">
        <p className="body-sm max-w-[62ch]">
          We use strictly necessary cookies to run the shop. With your consent we would also
          like to use analytics cookies to understand what people look at. You can decline and
          nothing changes about your shopping.{' '}
          <Link href="/policies/privacy" className="link-rule text-fg">
            Privacy policy
          </Link>
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => decide('essential')}
            className="btn btn-secondary btn-sm"
          >
            Essential only
          </button>
          <button type="button" onClick={() => decide('all')} className="btn btn-primary btn-sm">
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
