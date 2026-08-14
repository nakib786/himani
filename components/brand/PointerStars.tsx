'use client';

import { useEffect, useRef } from 'react';
import { starPath } from './Motifs';

/**
 * KSHYOVRATA — pointer stars
 *
 * The same four-pointed sparkle as the header and footer drifts, now shed by
 * the pointer itself: a star-shaped cursor on mouse, a burst under the finger
 * on touch. Three notes on how, since none of it is obvious:
 *
 * IT IS NOT REACT STATE. Particles are created and destroyed through the DOM
 * directly. Holding two dozen short-lived particles in state would re-render
 * this subtree on every animation frame for the entire session.
 *
 * THE LAYER MUST NEVER CARRY `data-ground`. An earlier pass wrote the ground
 * under the pointer onto this element so `var(--accent)` would re-resolve per
 * band. It does — and `@layer base { [data-ground] { background-color: var(--bg) } }`
 * also paints that ground, opaque, across a fixed full-screen element. The
 * whole page went blank on the first mouse move. The stars are plain white
 * now, matching the header and footer drifts, so there is nothing to detect:
 * a dark halo in the CSS keeps them legible on the bone bands.
 *
 * THE NATIVE CURSOR IS HIDDEN FROM JS, NOT CSS. `[data-cursor]` is set on
 * <html> after this mounts, so a JS failure leaves a normal arrow rather than
 * a page with no pointer at all.
 */

const STAR = starPath(12, 12, 12);

/** Live particle ceiling. A fast circular mouse gesture will hit this. */
const MAX_LIVE = 28;
/** Pointer travel between trail stars. Touch is denser — a drag is slower. */
const TRAIL_GAP = 55;
const DRAG_GAP = 34;
/** Stars thrown by a click or a tap. */
const TAP_BURST = 7;
/** Frames between hit-tests. elementFromPoint is cheap but not free. */
const TARGET_EVERY = 8;

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export function PointerStars() {
  const layerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const cursor = cursorRef.current;
    if (!layer || !cursor) return;

    /* Reduced motion opts out of the whole thing — cursor included. A custom
       cursor is a moving object the user did not ask for. */
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');

    let live = 0;
    let travelled = 0;
    let lastX = 0;
    let lastY = 0;
    let x = 0;
    let y = 0;
    let queued = false;
    let frames = 0;

    /* ---- particles ---- */

    const spawn = (atX: number, atY: number, spread = 1) => {
      if (live >= MAX_LIVE) return;
      live += 1;

      const star = document.createElement('span');
      star.className = 'pointer-star';
      star.style.left = `${atX}px`;
      star.style.top = `${atY}px`;
      star.style.setProperty('--size', `${rand(5, 11).toFixed(1)}px`);
      star.style.setProperty('--dx', `${rand(-26, 26) * spread}px`);
      // Biased upward: stars fall away from the pointer, not with it.
      star.style.setProperty('--dy', `${rand(-38, -6) * spread}px`);
      star.style.setProperty('--spin', `${rand(-140, 140)}deg`);
      star.style.animationDuration = `${rand(900, 1500).toFixed(0)}ms`;

      star.addEventListener(
        'animationend',
        () => {
          star.remove();
          live -= 1;
        },
        { once: true },
      );

      layer.appendChild(star);
    };

    const burst = (atX: number, atY: number) => {
      for (let i = 0; i < TAP_BURST; i += 1) spawn(atX, atY, 1.6);
    };

    /* ---- cursor ---- */

    /* The cursor has to answer what the arrow used to: is this clickable, is
       this typable. Over a text field it becomes a caret bar, because hiding
       the I-beam on a search box with no replacement is a real regression, not
       a stylistic one. */
    const readTarget = () => {
      const el = document.elementFromPoint(x, y);

      if (el?.closest('input, textarea, [contenteditable="true"]')) {
        cursor.dataset.over = 'text';
      } else if (el?.closest('a, button, label, summary, select, [role="button"]')) {
        cursor.dataset.over = 'hit';
      } else {
        cursor.dataset.over = 'idle';
      }
    };

    const draw = () => {
      queued = false;
      cursor.style.translate = `${x}px ${y}px`;
      frames += 1;
      if (fine.matches && frames % TARGET_EVERY === 0) readTarget();
    };

    const schedule = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(draw);
    };

    /* ---- events ---- */

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;

      if (!layer.dataset.active) {
        layer.dataset.active = 'true';
        lastX = x;
        lastY = y;
      }

      const gap = e.pointerType === 'touch' ? DRAG_GAP : TRAIL_GAP;
      travelled += Math.hypot(x - lastX, y - lastY);
      lastX = x;
      lastY = y;

      if (travelled >= gap) {
        travelled = 0;
        spawn(x, y);
      }

      // Nothing to move on touch — the finger is already there, and the
      // per-frame hit-test would be work for a cursor nobody can see.
      if (e.pointerType === 'touch') return;
      schedule();
    };

    const onDown = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      burst(x, y);
    };

    const onLeave = () => {
      delete layer.dataset.active;
    };

    const applyFine = () => {
      if (fine.matches) {
        document.documentElement.dataset.cursor = 'star';
      } else {
        delete document.documentElement.dataset.cursor;
      }
    };

    applyFine();
    fine.addEventListener('change', applyFine);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown, { passive: true });
    document.addEventListener('pointerleave', onLeave);

    return () => {
      fine.removeEventListener('change', applyFine);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
      delete document.documentElement.dataset.cursor;
      layer.replaceChildren();
    };
  }, []);

  return (
    <div ref={layerRef} className="pointer-layer" aria-hidden="true">
      <div ref={cursorRef} className="pointer-cursor">
        <svg viewBox="0 0 24 24" className="pointer-cursor-star" fill="currentColor">
          <path d={STAR} />
        </svg>
        {/* The true hotspot. The sparkle around it is soft-edged, so without
            this the pointer has no precise point to aim with. */}
        <span className="pointer-cursor-dot" />
        <span className="pointer-cursor-caret" />
      </div>
    </div>
  );
}
