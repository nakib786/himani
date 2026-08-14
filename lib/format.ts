/**
 * Formatting helpers.
 *
 * Prices use the Indian digit grouping (1,23,456) via en-IN, and are rendered
 * with `font-variant-numeric: tabular-nums` (see .tabular in globals.css) so
 * they align in a column down a product grid.
 */

const inr = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

export function formatPrice(paise: number): string {
  return inr.format(paise);
}

/** For JSON-LD and <meta> — a bare decimal, no symbol, no grouping. */
export function priceValue(amount: number): string {
  return amount.toFixed(2);
}

const dateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'Asia/Kolkata',
});

export function formatDate(iso: string): string {
  return dateFmt.format(new Date(`${iso}T00:00:00+05:30`));
}

const shortDateFmt = new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  timeZone: 'Asia/Kolkata',
});

export function formatShortDate(date: Date): string {
  return shortDateFmt.format(date);
}

/** Two-digit editorial index: 01, 02, 03. */
export function idx(n: number): string {
  return String(n).padStart(2, '0');
}

export function cx(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}
