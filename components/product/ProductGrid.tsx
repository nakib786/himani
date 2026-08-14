import { Reveal } from '@/components/ui/Reveal';
import { ProductCard } from './ProductCard';
import type { Product } from '@/lib/types';
import { cx } from '@/lib/format';

/**
 * 2-up mobile, 3-up tablet, then 3- or 4-up desktop (brief §2).
 * Column gaps are wide and row gaps wider — the grid should breathe like a
 * catalogue spread, not tile like a search results page.
 *
 * `columns` exists because the widest desktop count depends on what else is on
 * the page. Full-bleed pages give each of four columns ~272px. The shop page
 * spends 15rem on its filter sidebar first, and four columns of the remainder
 * are ~190px — too narrow for a plate and a caption, so it asks for three.
 */
const COLUMN_CLASSES = {
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
} as const;

/** Kept in step with COLUMN_CLASSES so the optimiser fetches the right width. */
const COLUMN_SIZES = {
  3: '(min-width: 1024px) 24vw, (min-width: 640px) 31vw, 46vw',
  4: '(min-width: 1024px) 22vw, (min-width: 640px) 31vw, 46vw',
} as const;

export function ProductGrid({
  products,
  startIndex = 1,
  priorityCount = 2,
  columns = 4,
  className,
}: {
  products: Product[];
  /** Plate numbering offset, so /shop can number continuously. */
  startIndex?: number;
  /** How many images get fetchpriority=high. Keep at or below the fold count. */
  priorityCount?: number;
  /** Widest desktop column count. See COLUMN_CLASSES. */
  columns?: 3 | 4;
  className?: string;
}) {
  return (
    <ul
      className={cx(
        'grid gap-x-5 gap-y-12 sm:gap-x-7 lg:gap-x-8 lg:gap-y-16',
        COLUMN_CLASSES[columns],
        className,
      )}
    >
      {products.map((product, i) => (
        <Reveal as="li" key={product.slug} index={Math.min(i, 3)}>
          <ProductCard
            product={product}
            index={startIndex + i}
            priority={i < priorityCount}
            sizes={COLUMN_SIZES[columns]}
          />
        </Reveal>
      ))}
    </ul>
  );
}
