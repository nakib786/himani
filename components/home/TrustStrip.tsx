import {
  MarkFeather,
  MarkGift,
  MarkReturn,
  MarkSkin,
} from '@/components/brand/Motifs';
import { TRUST_PILLARS } from '@/lib/catalogue';
import { cx } from '@/lib/format';

const MARKS = {
  feather: MarkFeather,
  skin: MarkSkin,
  gift: MarkGift,
  return: MarkReturn,
} as const;

/**
 * The four promises.
 *
 * A single hairline-ruled row — not four bordered cards with drop shadows and
 * an icon centred on top of each. The rules ARE the structure; the marks are
 * 1px strokes at 20px, the same weight as the rules they sit between.
 */
export function TrustStrip({ compact = false }: { compact?: boolean }) {
  return (
    <ul
      className={cx(
        'grid grid-cols-2 border-t border-rule md:grid-cols-4',
        compact && 'text-[0.8125rem]',
      )}
    >
      {TRUST_PILLARS.map((pillar) => {
        const Mark = MARKS[pillar.mark];
        return (
          <li
            key={pillar.title}
            className={cx(
              'flex flex-col gap-3 border-r border-b border-rule py-6 pr-4 md:border-b-0 md:py-9',
              '[&:nth-child(2n)]:border-r-0 md:[&:nth-child(2n)]:border-r md:last:border-r-0',
              'md:pl-7 md:first:pl-0',
            )}
          >
            <Mark className={cx('shrink-0 text-fg', compact ? 'h-4 w-4' : 'h-5 w-5')} />
            <div>
              <p className="text-[0.6875rem] tracking-[0.2em] text-fg uppercase">
                {pillar.title}
              </p>
              {!compact ? <p className="caption mt-2 max-w-[26ch]">{pillar.detail}</p> : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
