'use client';

import { useEffect, useState } from 'react';
import { ANNOUNCEMENTS } from '@/lib/site';
import { IconClose } from '@/components/brand/Motifs';

const ROTATE_MS = 6500; // Brief §2: nothing auto-advances faster than 6s.
const KEY = 'ksh_announce_dismissed';

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    try {
      if (window.sessionStorage.getItem(KEY) === '1') setVisible(false);
    } catch {
      /* no-op */
    }
  }, []);

  useEffect(() => {
    if (!visible || paused) return;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) return;

    const t = window.setInterval(() => {
      setI((n) => (n + 1) % ANNOUNCEMENTS.length);
    }, ROTATE_MS);
    return () => window.clearInterval(t);
  }, [visible, paused]);

  if (!visible) return null;

  return (
    /* The document opens on the espresso band and this bar is the top of it —
       no separate fill, so the page reads as one continuous dark field down
       to the fold rather than a stack of stripes. */
    <div
      data-ground="dark"
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="shell flex h-10 items-center justify-center">
        {/* Polite, not assertive — this must never interrupt a screen reader
            mid-sentence while someone is shopping. */}
        <p
          key={i}
          aria-live="polite"
          className="text-center text-[0.625rem] font-medium tracking-[0.2em] text-fg-mute uppercase"
        >
          {ANNOUNCEMENTS[i]}
        </p>
      </div>

      <button
        type="button"
        onClick={() => {
          setVisible(false);
          try {
            window.sessionStorage.setItem(KEY, '1');
          } catch {
            /* no-op */
          }
        }}
        className="absolute top-1/2 right-3 -translate-y-1/2 p-1.5 text-fg-mute transition-colors duration-300 hover:text-accent sm:right-6"
        aria-label="Dismiss announcements"
      >
        <IconClose className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
