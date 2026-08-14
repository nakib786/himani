'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';

import { formatPrice, idx } from '@/lib/format';
import type { ProductImage } from '@/lib/types';

/**
 * The hero plate, cycling the range.
 *
 * TWO DESIGN COMMITMENTS, both taken from gestures the page already makes:
 *
 * 1. The frames WIPE, they do not cross-fade. The headline four lines directly
 *    above wipe up from their own baselines (`unmask` in globals.css), so a
 *    frame arriving by the same vertical wipe reads as one more line of the
 *    same sentence. A fade would have been the generic choice and would have
 *    belonged to no other motion on the site. One direction throughout — no
 *    left/right sliding, and no Ken Burns zoom, because `drift` already owns
 *    the scroll axis of this exact plate.
 *
 * 2. The control is an INDEX, not a dot row. Five numerals on a hairline, in
 *    the same `index-num` face the section headers (01–04) and the product
 *    gallery counter already use — and the hairline over the active numeral
 *    fills left to right across the dwell, so the rule IS the timer. Nothing
 *    here needs a dot, a ring, an arrow or a progress bar.
 *
 * The timer stops whenever it would be running unwatched: pointer on the card,
 * keyboard focus inside it, hero scrolled off, tab in the background. Under
 * `prefers-reduced-motion` it never starts, and the index becomes a plain
 * five-way picker.
 */

/** How long a piece holds before the next wipes over it. */
const DWELL_MS = 5500;

/** Horizontal travel, in px, before a touch counts as a swipe rather than a tap. */
const SWIPE_PX = 48;

export type HeroSlide = {
  slug: string;
  title: string;
  price: number;
  image: ProductImage;
};

export function HeroSlideshow({ slides }: { slides: HeroSlide[] }) {
  const count = slides.length;

  /* `from` is the frame being replaced. It has to stay in the tree, unclipped
     and one layer down, or the incoming frame wipes over the plate's bare
     ground and the show flashes on every advance. */
  const [{ at, from }, setSlide] = useState({ at: 0, from: -1 });

  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [awake, setAwake] = useState(true);
  const [reduce, setReduce] = useState(false);

  const root = useRef<HTMLDivElement>(null);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const swiped = useRef(false);

  const paused = reduce || hover || focus || !awake;
  const current = slides[at];

  const go = useCallback((next: number) => {
    setSlide((s) => (next === s.at ? s : { at: next, from: s.at }));
  }, []);

  /* A timeout keyed on `at` rather than a standing interval: picking a numeral
     restarts the dwell from that frame, which is what the filling rule under
     it is promising. */
  useEffect(() => {
    if (paused || count < 2) return;
    const timer = setTimeout(() => go((at + 1) % count), DWELL_MS);
    return () => clearTimeout(timer);
  }, [at, count, go, paused]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  /* Off-screen and background-tab are the same condition as far as the timer is
     concerned — nobody is watching — so both feed one flag. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let onScreen = true;
    const sync = () => setAwake(onScreen && !document.hidden);
    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        sync();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  return (
    <div
      ref={root}
      className="card group"
      style={{ '--dwell': `${DWELL_MS}ms` } as CSSProperties}
      data-holding={paused ? 'true' : 'false'}
      // `aria-roledescription` is dropped on an element whose role is generic,
      // which a bare div is — hence the explicit role. `group` rather than
      // `region`: this is a hero widget, not another landmark on the page.
      role="group"
      aria-roledescription="carousel"
      aria-label="Featured pieces"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setFocus(true)}
      onBlur={(e) => {
        // focusout fires when moving between the numerals too; only release the
        // timer when focus has actually left the card.
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocus(false);
      }}
      onTouchStart={(e) => {
        const t = e.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      }}
      onTouchEnd={(e) => {
        const start = touch.current;
        touch.current = null;
        if (!start || count < 2) return;
        const t = e.changedTouches[0];
        const dx = t.clientX - start.x;
        const dy = t.clientY - start.y;
        // Horizontal intent only, and nothing is preventDefault-ed, so a
        // vertical drag scrolls the page exactly as it did before.
        if (Math.abs(dx) < SWIPE_PX || Math.abs(dx) < Math.abs(dy) * 1.5) return;
        swiped.current = true;
        go((at + (dx < 0 ? 1 : count - 1)) % count);
      }}
      onClickCapture={(e) => {
        // A swipe that lands on the plate still emits a click on some mobile
        // browsers. Swallow that one so a flick never navigates.
        if (!swiped.current) return;
        swiped.current = false;
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <Link href={`/product/${current.slug}`} className="block">
        <div className="plate plate-square drift">
          {slides.map((slide, i) => (
            <Image
              key={slide.slug}
              src={slide.image.url}
              alt={slide.image.alt}
              width={slide.image.width}
              height={slide.image.height}
              // The first frame is the LCP candidate and takes the whole
              // priority hint. The rest are eager but explicitly LOW priority:
              // left lazy they never resolved — a clipped frame does not read
              // as visible — and the first advance wiped in an empty box. Low
              // priority keeps them queued behind the frame that is on screen.
              {...(i === 0
                ? { priority: true, fetchPriority: 'high' as const }
                : { loading: 'eager' as const, fetchPriority: 'low' as const })}
              sizes="(min-width: 768px) 48vw, 100vw"
              className="slide-frame"
              data-state={i === at ? 'on' : i === from ? 'under' : 'off'}
              // Every frame is in the tree at once; without this a screen
              // reader would read all five alt texts as one run of prose.
              aria-hidden={i !== at}
            />
          ))}
        </div>

        {/* The rule is structural and stays put — only the line of type wipes,
            so the plate and its caption arrive as one object. `key` remounts
            the row, which is what replays the animation. */}
        <div className="mt-3 overflow-hidden border-t border-rule pt-3">
          <div key={at} className="slide-meta flex items-baseline justify-between gap-4">
            <span className="caption transition-colors duration-500 group-hover:text-accent">
              {current.title}
            </span>
            <span className="tabular caption">{formatPrice(current.price)}</span>
          </div>
        </div>
      </Link>

      {count > 1 ? (
        <div
          className="mt-1 grid gap-x-2 md:gap-x-3"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          {slides.map((slide, i) => (
            <button
              key={slide.slug}
              type="button"
              className="slide-tick"
              aria-current={i === at}
              onClick={() => go(i)}
            >
              <span className="index-num">{idx(i + 1)}</span>
              <span className="sr-only">
                {slide.title} — piece {i + 1} of {count}
              </span>
            </button>
          ))}
        </div>
      ) : null}

      {/* Silent while it rotates on its own; speaks once the rotation has been
          stopped by a pointer, by focus, or by a reduced-motion preference. */}
      <p aria-live={paused ? 'polite' : 'off'} className="sr-only">
        {current.title}, {idx(at + 1)} of {idx(count)}
      </p>
    </div>
  );
}
