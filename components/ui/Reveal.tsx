import type { CSSProperties, ReactNode } from 'react';
import { cx } from '@/lib/format';

/**
 * Rise-on-scroll.
 *
 * This used to be a client component driving an IntersectionObserver and a
 * `data-in` flag. It is now a plain server component: the whole effect is a
 * native CSS scroll-driven animation (`animation-timeline: view()`), which
 * runs on the compositor, ships no JavaScript, and needs no observer.
 *
 * Progressive by default — the animation lives inside
 * `@supports (animation-timeline: view())`, so on a browser without support
 * the element is simply visible. Nothing is ever hidden waiting for a script.
 *
 * `index` staggers a row. It shifts the scroll range rather than adding a
 * time delay, because a view() timeline has no notion of elapsed time.
 */
export function Reveal({
  children,
  index = 0,
  className,
  as: Tag = 'div',
  variant = 'rise',
}: {
  children: ReactNode;
  /** Position in a row or grid. Keep under ~6 or the last item lags visibly. */
  index?: number;
  className?: string;
  as?: 'div' | 'section' | 'li' | 'article' | 'header';
  /** `rise` for blocks, `unmask` for headlines that wipe up from a baseline. */
  variant?: 'rise' | 'unmask';
}) {
  return (
    <Tag className={cx(variant, className)} style={{ '--i': index } as CSSProperties}>
      {children}
    </Tag>
  );
}
