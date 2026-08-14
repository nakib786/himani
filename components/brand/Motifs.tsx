/**
 * KSHYOVRATA — motif set
 *
 * Every mark here is drawn geometry: thin strokes, `currentColor`, no fills
 * except where a shape is too small to read as an outline (the moon, the
 * stars). There are no icon fonts and no emoji anywhere in this codebase —
 * emoji render differently per OS, ignore theme, and cannot take a hover state.
 *
 * The vocabulary comes from the logo: the crescent, a moon, scattered stars,
 * a rising sunburst, and the strapline's `— • —` rule. These are the motif
 * set, not the mark itself — the mark lives in `Logo.tsx` as traced artwork.
 */

import { AMAZON_VIEWBOX, AMAZON_WORDMARK } from './amazonWordmark';

type MotifProps = {
  className?: string;
  strokeWidth?: number;
};

/* -------------------------------------------------------------------------- */
/* Primitives                                                                  */
/* -------------------------------------------------------------------------- */

/** A four-pointed sparkle. Concave sides via quadratics through the centre. */
export function starPath(cx: number, cy: number, r: number): string {
  return [
    `M ${cx} ${cy - r}`,
    `Q ${cx} ${cy} ${cx + r} ${cy}`,
    `Q ${cx} ${cy} ${cx} ${cy + r}`,
    `Q ${cx} ${cy} ${cx - r} ${cy}`,
    `Q ${cx} ${cy} ${cx} ${cy - r}`,
    'Z',
  ].join(' ');
}

/** Waxing crescent: a major outer arc under-cut by a major inner arc. */
export function crescentPath(
  cx: number,
  cy: number,
  r: number,
  cut = 0.89,
): string {
  // Chord endpoints sit at ±60° so the horns stay open rather than closing
  // into a ring.
  const dx = r * Math.sin(Math.PI / 3);
  const dy = r * Math.cos(Math.PI / 3);
  const x = cx + dy;
  const yTop = cy - dx;
  const yBot = cy + dx;
  const inner = r * cut;
  return [
    `M ${x.toFixed(2)} ${yTop.toFixed(2)}`,
    `A ${r} ${r} 0 1 0 ${x.toFixed(2)} ${yBot.toFixed(2)}`,
    `A ${inner.toFixed(2)} ${inner.toFixed(2)} 0 1 1 ${x.toFixed(2)} ${yTop.toFixed(2)}`,
    'Z',
  ].join(' ');
}

/* -------------------------------------------------------------------------- */
/* Structural motifs                                                           */
/* -------------------------------------------------------------------------- */

/**
 * Thin crescent arc — used to frame the hero and to cap section corners.
 * Deliberately open: it is a fragment of a circle, never a closed ring.
 */
export function CrescentArc({ className, strokeWidth = 1 }: MotifProps) {
  return (
    <svg
      viewBox="0 0 200 100"
      fill="none"
      aria-hidden="true"
      className={className}
      preserveAspectRatio="none"
    >
      <path
        d="M 2 98 A 120 120 0 0 1 198 98"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

/**
 * The strapline device from the logo: — • —
 * Standard separator between sections.
 */
export function RuleDot({ className }: MotifProps) {
  return (
    <div
      className={`flex items-center gap-3 text-[color:var(--color-line-strong)] ${className ?? ''}`}
      aria-hidden="true"
    >
      <span className="h-px flex-1 bg-current" />
      <svg viewBox="0 0 8 8" className="h-1.5 w-1.5 shrink-0" fill="currentColor">
        <circle cx="4" cy="4" r="2.4" />
      </svg>
      <span className="h-px flex-1 bg-current" />
    </div>
  );
}

/** Moon with scattered stars — empty states, "new arrival", footer flourish. */
export function MoonStars({ className }: MotifProps) {
  return (
    <svg viewBox="0 0 64 48" fill="none" aria-hidden="true" className={className}>
      <path d={crescentPath(22, 24, 13)} fill="currentColor" />
      <path d={starPath(46, 14, 5)} fill="currentColor" />
      <path d={starPath(54, 28, 3.2)} fill="currentColor" />
      <path d={starPath(41, 34, 2.4)} fill="currentColor" />
    </svg>
  );
}

/**
 * Rising sunburst — bestseller badge, the Sunburst PDP, order confirmation.
 * Rays are struck from a centre below the baseline so the sun reads as rising.
 */
export function Sunburst({
  className,
  strokeWidth = 1,
  rays = 11,
}: MotifProps & { rays?: number }) {
  const cx = 32;
  const cy = 30;
  const inner = 11;
  const outer = 19;

  const spokes = Array.from({ length: rays }, (_, i) => {
    // Spread across a half-turn only: a horizon, not a full star.
    const theta = (Math.PI * (i + 0.5)) / rays;
    return {
      x1: cx + inner * Math.cos(theta),
      y1: cy - inner * Math.sin(theta),
      x2: cx + outer * Math.cos(theta),
      y2: cy - outer * Math.sin(theta),
    };
  });

  return (
    <svg viewBox="0 0 64 34" fill="none" aria-hidden="true" className={className}>
      {/* The sun's own edge */}
      <path
        d={`M ${cx + 7} ${cy} A 7 7 0 0 0 ${cx - 7} ${cy}`}
        stroke="currentColor"
        strokeWidth={strokeWidth}
      />
      {/* The horizon it rises from */}
      <path d={`M 4 ${cy} H ${cx - 10}`} stroke="currentColor" strokeWidth={strokeWidth} />
      <path d={`M ${cx + 10} ${cy} H 60`} stroke="currentColor" strokeWidth={strokeWidth} />
      {spokes.map((s, i) => (
        <path
          key={i}
          d={`M ${s.x1.toFixed(2)} ${s.y1.toFixed(2)} L ${s.x2.toFixed(2)} ${s.y2.toFixed(2)}`}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Trust-pillar marks                                                          */
/*                                                                             */
/* Four thin-line marks on a shared 24×24 grid. These replace the icon-card    */
/* grid that every generated storefront ships with — they sit inline on a      */
/* hairline rule, not inside bordered boxes with drop shadows.                 */
/* -------------------------------------------------------------------------- */

const iconBase = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
};

/** Skin-friendly — a crescent held inside an open circle. */
export function MarkSkin({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <circle cx="12" cy="12" r="9.25" />
      <path d="M14.6 7.2a5.4 5.4 0 0 0 0 9.6 5.4 5.4 0 1 1 0-9.6Z" />
    </svg>
  );
}

/** Lightweight — a form resting on air, barely touching the line. */
export function MarkFeather({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M4 18.5c3.4-9 8.6-13 15.2-13.2C19 11.9 15.2 16.6 8.4 17.6" />
      <path d="M4 20.2h12" />
      <path d="M11.4 12.4c2.2-1 4.3-1.5 6.4-1.6" />
    </svg>
  );
}

/** Gift-ready — a box, a ribbon, and a star above it. */
export function MarkGift({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <rect x="3.75" y="9.5" width="16.5" height="11" />
      <path d="M12 9.5v11" />
      <path d="M3.75 14.2h16.5" />
      <path d="M12 9.5C10.2 6.6 8.6 5.4 7.4 6.2c-1.1.8-.6 2.4 1 3.3" />
      <path d="M12 9.5c1.8-2.9 3.4-4.1 4.6-3.3 1.1.8.6 2.4-1 3.3" />
      <path d={starPath(20.6, 4.2, 2.1)} fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Easy returns — an open circuit that comes back on itself. */
export function MarkReturn({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M20.4 12a8.4 8.4 0 1 1-2.9-6.35" />
      <path d="M20.9 3.4v4.6h-4.6" />
    </svg>
  );
}

/** Secure / trusted payment — used in the footer and checkout rail. */
export function MarkShield({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M12 2.9 4.4 6v6.1c0 4.3 3.1 7.7 7.6 9 4.5-1.3 7.6-4.7 7.6-9V6L12 2.9Z" />
      <path d="M8.9 12.1 11.2 14.4 15.4 10" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Interface marks                                                             */
/* -------------------------------------------------------------------------- */

export function IconBag({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M4.6 7.6h14.8l-1.1 12.6H5.7L4.6 7.6Z" />
      <path d="M8.9 9.8V6.6a3.1 3.1 0 0 1 6.2 0v3.2" />
    </svg>
  );
}

export function IconSearch({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <circle cx="10.9" cy="10.9" r="6.9" />
      <path d="M15.9 15.9 20.6 20.6" />
    </svg>
  );
}

export function IconClose({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M5.6 5.6 18.4 18.4M18.4 5.6 5.6 18.4" />
    </svg>
  );
}

export function IconMenu({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M3.4 7.4h17.2M3.4 12h17.2M3.4 16.6h17.2" />
    </svg>
  );
}

export function IconChevron({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M8.4 4.8 15.6 12l-7.2 7.2" />
    </svg>
  );
}

export function IconPlus({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M12 4.6v14.8M4.6 12h14.8" />
    </svg>
  );
}

export function IconMinus({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M4.6 12h14.8" />
    </svg>
  );
}

export function IconArrowRight({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      <path d="M3.6 12h16.8M14.4 6l6 6-6 6" />
    </svg>
  );
}

/**
 * Track order — a van under a dropped pin, bridged by a dashed route.
 *
 * The three-part composition (vehicle, journey, destination) is the standard
 * reading for parcel tracking; drawn here in the house vocabulary — hairline,
 * `currentColor`, one 24-unit grid — so it sits beside the search and bag
 * glyphs instead of importing a second icon language into the header.
 *
 * The route arcs OVER the cab rather than through it: the cab occupies the
 * grid from x10.6 y13.6 down, and a straight line between van and pin would
 * cut across it. The dash pattern is deliberately coarse for the size — at the
 * header's 18px the gaps are under a pixel, and anything finer greys out.
 */
export function IconTrackOrder({ className }: MotifProps) {
  return (
    <svg {...iconBase} className={className}>
      {/* Van — box body, cab, wheels sitting into the body line. */}
      <path d="M2.4 11.8h8.2v5.8H2.4z" />
      <path d="M10.6 13.6h2.9l2.6 2.7v1.3h-5.5z" />
      <circle cx="5.6" cy="18.9" r="1.4" />
      <circle cx="13.4" cy="18.9" r="1.4" />
      {/* Route. */}
      <path d="M6.4 11.5C7.6 7.4 13.4 6 17.2 9.6" strokeDasharray="1.6 1.8" />
      {/* Pin. */}
      <path d="M17.4 10.1c1.9-2.4 3.1-3.9 3.1-5.4a3.1 3.1 0 0 0-6.2 0c0 1.5 1.2 3 3.1 5.4Z" />
      <circle cx="17.4" cy="4.7" r="1.15" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/* Third-party marks                                                           */
/*                                                                             */
/* The two places we exist off this site. These are the real marks, not our    */
/* own line vocabulary applied to someone else's brand — a link that says      */
/* "we are on Amazon" is only worth a logo if the logo is the one people       */
/* already recognise. So they break the hairline rule above on purpose:        */
/* Instagram sits at its own glyph weight, and Amazon is the full wordmark.    */
/*                                                                             */
/* What they do NOT bring is colour. Both take `currentColor`. Instagram's     */
/* gradient tile and Amazon's orange would be the only foreign brand colour    */
/* anywhere on the page, and on the espresso footer they would read as ad      */
/* units sitting in our own furniture. In ink they belong to the page.         */
/*                                                                             */
/* Both are decorative — every link that carries one keeps a text label or an  */
/* `aria-label`, so the accessible name never depends on the artwork.          */
/* -------------------------------------------------------------------------- */

/**
 * Instagram — the camera glyph: rounded tile, lens, flash dot.
 *
 * Drawn at Instagram's own proportions and weight rather than our hairline,
 * so it carries the same optical mass as the Amazon wordmark beside it.
 */
export function IconInstagram({ className }: MotifProps) {
  return (
    <svg {...iconBase} strokeWidth={1.9} className={className}>
      <rect x="2.95" y="2.95" width="18.1" height="18.1" rx="5.15" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="17.35" cy="6.65" r="1.15" fill="currentColor" stroke="none" />
    </svg>
  );
}

/**
 * Amazon — the wordmark and its a→z smile, in ink.
 *
 * Geometry and the reasoning behind the two edits live in `amazonWordmark.ts`.
 *
 * Two things to know when placing it:
 *
 *   - It is a ~3.1:1 lockup, so pair a height class with `w-auto`. Never the
 *     square `h-4 w-4` the marks above take.
 *   - Its box is not its optical centre. The smile hangs below the letters, so
 *     the lettering sits ~18% of the height above the middle of the viewBox —
 *     dropped into a `flex items-center` row it rides visibly high against the
 *     text beside it. Add `translate-y-[18%]` in those rows. Set inline in a
 *     sentence instead, use `align-[-0.41em]` with an `em` height.
 */
export function LogoAmazon({ className }: MotifProps) {
  return (
    <svg
      viewBox={AMAZON_VIEWBOX}
      fill="currentColor"
      fillRule="evenodd"
      clipRule="evenodd"
      aria-hidden="true"
      className={className}
    >
      {AMAZON_WORDMARK.map((d) => (
        <path key={d.slice(0, 24)} d={d} />
      ))}
    </svg>
  );
}
