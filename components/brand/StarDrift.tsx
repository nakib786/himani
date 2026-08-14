import type { CSSProperties } from 'react';
import { starPath } from './Motifs';

/**
 * KSHYOVRATA — star drift
 *
 * The four-pointed sparkle from the logo's celestial cluster, set loose across
 * a target. Three independent motions per star, each on its own element so
 * they compose instead of fighting over one `transform`:
 *
 *   .star        travels the full width of the field, edge to edge
 *   .star-bob    zig-zags on the vertical axis (linear + alternate, so the
 *                turns are sharp corners rather than eased swells)
 *   .star-glyph  twinkles — opacity, scale and a little rotation
 *
 * Lanes alternate direction: odd lanes run left-to-right, even lanes run
 * right-to-left. Read together, the two streams circulate around the target
 * rather than parading past it in one direction.
 *
 * Every duration is a prime-ish number of seconds and no two are equal, so the
 * field never resolves into a visible repeating pattern. Delays are NEGATIVE:
 * the animations start mid-cycle, so the stars are already spread out on first
 * paint instead of queueing up at one edge.
 *
 * Two fields, tuned to very different boxes — see the notes on each below.
 */

type Star = {
  /** Vertical position, as a percentage of the field. Unique — used as key. */
  lane: string;
  /** `r` runs left-to-right, `l` runs right-to-left. */
  dir: 'r' | 'l';
  /** One edge-to-edge crossing. */
  cross: string;
  /** Negative — see note above. */
  delay: string;
  /** Half-period of the zig-zag. */
  bobDur: string;
  /** Vertical amplitude of the zig-zag. */
  bob: string;
  twinkle: string;
  size: string;
};

/* -------------------------------------------------------------------------- */
/* Footer watermark                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Sizes and travel are `clamp(rem, cqw, rem)` because the wordmark itself is
 * sized in `cqw` — a fixed-rem star would loom over the ~53px mobile word and
 * vanish against the ~190px desktop one.
 */

const SIZE_LG = 'clamp(0.45rem, 1.1cqw, 1rem)';
const SIZE_MD = 'clamp(0.36rem, 0.85cqw, 0.78rem)';
const SIZE_SM = 'clamp(0.28rem, 0.6cqw, 0.55rem)';

const BOB_LG = 'clamp(0.5rem, 2.2cqw, 2.2rem)';
const BOB_MD = 'clamp(0.38rem, 1.6cqw, 1.6rem)';
const BOB_SM = 'clamp(0.3rem, 1.1cqw, 1.1rem)';

const WATERMARK_STARS: Star[] = [
  { lane: '8%', dir: 'r', cross: '17s', delay: '-2s', bobDur: '2.3s', bob: BOB_MD, twinkle: '2.9s', size: SIZE_MD },
  { lane: '24%', dir: 'l', cross: '23s', delay: '-9s', bobDur: '1.7s', bob: BOB_LG, twinkle: '2.1s', size: SIZE_LG },
  { lane: '41%', dir: 'r', cross: '13s', delay: '-6s', bobDur: '2.9s', bob: BOB_SM, twinkle: '3.7s', size: SIZE_SM },
  { lane: '57%', dir: 'l', cross: '19s', delay: '-13s', bobDur: '2.1s', bob: BOB_MD, twinkle: '2.5s', size: SIZE_MD },
  { lane: '71%', dir: 'r', cross: '27s', delay: '-4s', bobDur: '1.9s', bob: BOB_LG, twinkle: '3.1s', size: SIZE_LG },
  { lane: '86%', dir: 'l', cross: '15s', delay: '-11s', bobDur: '2.7s', bob: BOB_SM, twinkle: '2.3s', size: SIZE_SM },
  { lane: '96%', dir: 'r', cross: '21s', delay: '-17s', bobDur: '2.5s', bob: BOB_MD, twinkle: '3.3s', size: SIZE_MD },
];

/* -------------------------------------------------------------------------- */
/* Header lockup                                                               */
/* -------------------------------------------------------------------------- */

/**
 * The header field is the same choreography at roughly a tenth the scale, and
 * it is deliberately quieter than the footer's — four stars rather than seven,
 * a dimmer twinkle peak, and amplitudes small enough that nothing leaves the
 * header row. This one sits in a sticky bar that is on screen the entire
 * session, beside the nav; the footer watermark is a destination you arrive
 * at. Motion that reads as a flourish down there reads as a distraction up
 * here if it is given the same weight.
 *
 * Fixed rem, not cqw: the lockup is a fixed 40/48px tall, so the stars have no
 * container size to track.
 */
const LOCKUP_STARS: Star[] = [
  { lane: '12%', dir: 'r', cross: '13s', delay: '-3s', bobDur: '1.9s', bob: '0.3rem', twinkle: '2.7s', size: '0.34rem' },
  { lane: '38%', dir: 'l', cross: '17s', delay: '-8s', bobDur: '2.3s', bob: '0.22rem', twinkle: '2.1s', size: '0.26rem' },
  { lane: '64%', dir: 'r', cross: '11s', delay: '-5s', bobDur: '1.6s', bob: '0.34rem', twinkle: '3.1s', size: '0.4rem' },
  { lane: '88%', dir: 'l', cross: '15s', delay: '-12s', bobDur: '2.7s', bob: '0.26rem', twinkle: '2.4s', size: '0.3rem' },
];

/* -------------------------------------------------------------------------- */

function StarField({ stars, field }: { stars: Star[]; field: 'watermark' | 'lockup' }) {
  return (
    <div className="star-field" data-field={field} aria-hidden="true">
      {stars.map((star) => (
        <span
          key={star.lane}
          className="star"
          data-dir={star.dir}
          style={
            {
              '--lane': star.lane,
              '--cross': star.cross,
              '--delay': star.delay,
              '--bob-dur': star.bobDur,
              '--bob': star.bob,
              '--twinkle': star.twinkle,
              '--size': star.size,
            } as CSSProperties
          }
        >
          <span className="star-bob">
            <svg viewBox="0 0 24 24" className="star-glyph" fill="currentColor">
              <path d={starPath(12, 12, 12)} />
            </svg>
          </span>
        </span>
      ))}
    </div>
  );
}

/** Stars over the oversized footer wordmark. */
export function WatermarkStars() {
  return <StarField stars={WATERMARK_STARS} field="watermark" />;
}

/** Stars over the header lockup. */
export function LockupStars() {
  return <StarField stars={LOCKUP_STARS} field="lockup" />;
}
