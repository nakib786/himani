import {
  MARK_EMBLEM,
  MARK_ORNAMENT,
  MARK_SUN,
  MARK_VIEWBOX,
} from './logoPaths';

/**
 * KSHYOVRATA — logo system
 *
 * The mark is the brand's own artwork (`assets/KshyovrataLogo`), traced to
 * outlines: an interlocked `KHM` serif monogram swept through by a single
 * tapering crescent, with a crescent moon and three stars in the upper right
 * and a rising sun at the foot. Under it sits the wide-letterspaced
 * `KSHYOVRATA` wordmark and the flanked strapline `— COMMERCE · TRUST ·
 * GROWTH —`.
 *
 * The strapline stays inside the lockup only, per §1.1 of the brief. It is
 * never used as a site headline.
 *
 * NOTE ON SMALL SIZES: the moon, stars and sun are hairline ornaments that
 * turn to noise much below 48px, so the favicon (app/icon.svg) carries the
 * emblem alone. Everywhere the mark is drawn on the page — header and footer
 * alike — it is the complete artwork.
 */

/* -------------------------------------------------------------------------- */

type MarkProps = {
  className?: string;
  /** Render the celestial ornaments. Off for dense UI (nav, favicon). */
  ornament?: boolean;
  title?: string;
};

/**
 * The monogram mark. The emblem's bounding box contains the ornaments, so the
 * framing is identical whether or not they are drawn — a header logo and a
 * footer logo line up on the same optical centre.
 */
export function Monogram({ className, ornament = true, title }: MarkProps) {
  return (
    <svg
      viewBox={MARK_VIEWBOX}
      fill="currentColor"
      fillRule="evenodd"
      className={className}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : 'true'}
      aria-label={title}
    >
      {title ? <title>{title}</title> : null}
      <path d={MARK_EMBLEM} />
      {ornament ? (
        <>
          <path d={MARK_ORNAMENT} />
          <path d={MARK_SUN} />
        </>
      ) : null}
    </svg>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The wordmark is set as live HTML text, not an image: it stays crisp at every
 * zoom level, is selectable, is read correctly by screen readers, and costs
 * zero bytes over the font we already load. Cormorant Garamond at the
 * `.wordmark` tracking matches the drawn wordmark in the master artwork.
 */
export function Wordmark({
  className,
  as: Tag = 'span',
}: {
  className?: string;
  as?: 'span' | 'h1' | 'div';
}) {
  return <Tag className={`wordmark ${className ?? ''}`}>Kshyovrata</Tag>;
}

/* -------------------------------------------------------------------------- */

/** Stacked lockup — used on /about, the footer, and order confirmation. */
export function LogoLockup({
  className,
  strapline = true,
}: {
  className?: string;
  strapline?: boolean;
}) {
  return (
    <div className={`flex flex-col items-center ${className ?? ''}`}>
      <Monogram className="h-16 w-auto text-fg" />
      <Wordmark className="mt-5 text-[1.05rem] text-fg" />
      {strapline ? (
        <div
          className="mt-3 flex w-full max-w-[15rem] items-center gap-2.5 text-fg-mute"
          aria-hidden="true"
        >
          <span className="h-px flex-1 bg-current" />
          <span className="text-[0.5rem] uppercase tracking-[0.24em] whitespace-nowrap">
            Commerce · Trust · Growth
          </span>
          <span className="h-px flex-1 bg-current" />
        </div>
      ) : null}
    </div>
  );
}

/**
 * Horizontal lockup — the header. Emblem left, wordmark right.
 *
 * The emblem is the same complete mark the footer lockup carries — crescent,
 * stars and rising sun included — so the header is not a reduced sibling of
 * the real logo. That costs height: the ornaments only hold together from
 * roughly 40px up, which is why the mark runs taller here than the wordmark
 * beside it would suggest.
 *
 * Sized down at phone widths: the header row is a symmetric three-column grid,
 * so the lockup has to clear both the menu button and the search + bag cluster
 * on a 375px viewport. `.wordmark-compact` pulls the tracking in over the same
 * breakpoint — it has to be CSS rather than a `tracking-*` utility, since
 * `.wordmark` is unlayered and outranks any Tailwind utility on the element.
 */
export function LogoHorizontal({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 sm:gap-3 ${className ?? ''}`}>
      <Monogram className="h-10 w-auto shrink-0 sm:h-12" />
      <Wordmark className="wordmark-compact whitespace-nowrap text-[0.6rem] sm:text-[0.95rem]" />
    </span>
  );
}
