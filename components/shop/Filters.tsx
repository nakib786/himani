import Link from 'next/link';
import {
  CATEGORY_LABELS,
  FINISH_LABELS,
  MOTIF_LABELS,
  OCCASION_LABELS,
} from '@/lib/catalogue';
import { SORT_OPTIONS } from '@/lib/commerce';
import { cx } from '@/lib/format';

/**
 * Filters and sort.
 *
 * Every control is an <a>. Selections live entirely in the query string, so
 * a filtered view is shareable, crawlable, back-button-correct, and ships no
 * JavaScript at all. The brief asked for URL-driven filters (§4); making them
 * links rather than a client-side store is what actually delivers that.
 */

export type ActiveFilters = {
  category: string[];
  finish: string[];
  motif: string[];
  occasion: string[];
  maxPrice?: number;
  sort: string;
  q?: string;
};

const PRICE_BANDS = [
  { label: 'Under ₹500', value: 499 },
  { label: 'Under ₹1,000', value: 999 },
];

/** Toggle one value inside a repeated query param. */
function toggleUrl(
  base: string,
  active: ActiveFilters,
  key: 'category' | 'finish' | 'motif' | 'occasion',
  value: string,
): string {
  const params = new URLSearchParams();
  const groups = { category: active.category, finish: active.finish, motif: active.motif, occasion: active.occasion };

  for (const [groupKey, values] of Object.entries(groups)) {
    const next =
      groupKey === key
        ? values.includes(value)
          ? values.filter((v) => v !== value)
          : [...values, value]
        : values;
    for (const v of next) params.append(groupKey, v);
  }

  if (active.maxPrice) params.set('maxPrice', String(active.maxPrice));
  if (active.sort && active.sort !== 'featured') params.set('sort', active.sort);
  if (active.q) params.set('q', active.q);

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function scalarUrl(
  base: string,
  active: ActiveFilters,
  key: 'maxPrice' | 'sort',
  value: string | number | undefined,
): string {
  const params = new URLSearchParams();
  for (const v of active.category) params.append('category', v);
  for (const v of active.finish) params.append('finish', v);
  for (const v of active.motif) params.append('motif', v);
  for (const v of active.occasion) params.append('occasion', v);

  const maxPrice = key === 'maxPrice' ? value : active.maxPrice;
  const sort = key === 'sort' ? value : active.sort;

  if (maxPrice) params.set('maxPrice', String(maxPrice));
  if (sort && sort !== 'featured') params.set('sort', String(sort));
  if (active.q) params.set('q', active.q);

  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function Chip({
  href,
  selected,
  children,
}: {
  href: string;
  selected: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      aria-pressed={selected}
      className={cx(
        'inline-flex items-center border px-3 py-1.5 text-[0.625rem] tracking-[0.16em] uppercase transition-colors duration-400',
        selected
          ? 'border-fg bg-fg text-bg'
          : 'border-rule-strong text-fg-soft hover:border-fg hover:text-fg',
      )}
    >
      {children}
    </Link>
  );
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-rule py-5">
      <h3 className="eyebrow">{title}</h3>
      <div className="mt-3.5 flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

export function Filters({
  base,
  active,
  resultCount,
}: {
  base: string;
  active: ActiveFilters;
  resultCount: number;
}) {
  const hasAny =
    active.category.length +
      active.finish.length +
      active.motif.length +
      active.occasion.length >
      0 || Boolean(active.maxPrice);

  return (
    <aside aria-label="Filter and sort" className="border-t border-rule">
      <Group title="Category">
        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
          <Chip
            key={value}
            href={toggleUrl(base, active, 'category', value)}
            selected={active.category.includes(value)}
          >
            {label}
          </Chip>
        ))}
      </Group>

      <Group title="Finish">
        {Object.entries(FINISH_LABELS).map(([value, label]) => (
          <Chip
            key={value}
            href={toggleUrl(base, active, 'finish', value)}
            selected={active.finish.includes(value)}
          >
            {label}
          </Chip>
        ))}
      </Group>

      <Group title="Motif">
        {Object.entries(MOTIF_LABELS).map(([value, label]) => (
          <Chip
            key={value}
            href={toggleUrl(base, active, 'motif', value)}
            selected={active.motif.includes(value)}
          >
            {label}
          </Chip>
        ))}
      </Group>

      <Group title="Occasion">
        {Object.entries(OCCASION_LABELS).map(([value, label]) => (
          <Chip
            key={value}
            href={toggleUrl(base, active, 'occasion', value)}
            selected={active.occasion.includes(value)}
          >
            {label}
          </Chip>
        ))}
      </Group>

      <Group title="Price">
        {PRICE_BANDS.map((band) => (
          <Chip
            key={band.value}
            href={scalarUrl(
              base,
              active,
              'maxPrice',
              active.maxPrice === band.value ? undefined : band.value,
            )}
            selected={active.maxPrice === band.value}
          >
            {band.label}
          </Chip>
        ))}
      </Group>

      <Group title="Sort">
        {SORT_OPTIONS.map((option) => (
          <Chip
            key={option.key}
            href={scalarUrl(base, active, 'sort', option.key)}
            selected={active.sort === option.key}
          >
            {option.label}
          </Chip>
        ))}
      </Group>

      <div className="flex items-center justify-between gap-4 py-5">
        <p className="caption">
          <span className="tabular text-fg">{resultCount}</span>{' '}
          {resultCount === 1 ? 'piece' : 'pieces'}
        </p>
        {hasAny ? (
          <Link href={base} className="link-rule caption uppercase">
            Clear all
          </Link>
        ) : null}
      </div>
    </aside>
  );
}
