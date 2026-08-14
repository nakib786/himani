import Link from 'next/link';
import { cx } from '@/lib/format';

/**
 * The standard section head.
 *
 * Left-aligned, always. An index numeral sits on a hairline above the title,
 * the way a printed catalogue numbers its plates — this is the single biggest
 * departure from the centred-headline-with-a-pill-badge arrangement that every
 * generated storefront ships with.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  lede,
  action,
  className,
}: {
  /** Two-digit plate number, e.g. "02". */
  index?: string;
  eyebrow: string;
  title: string;
  lede?: string;
  action?: { label: string; href: string };
  className?: string;
}) {
  return (
    <header className={cx('w-full', className)}>
      <div className="flex items-baseline gap-4 border-t border-rule pt-4">
        {index ? <span className="index-num">{index}</span> : null}
        <span className="eyebrow">{eyebrow}</span>
        {action ? (
          <Link
            href={action.href}
            className="link-nav caption ml-auto hidden shrink-0 uppercase tracking-[0.18em] text-fg sm:inline-block"
          >
            {action.label}
          </Link>
        ) : null}
      </div>

      <div className="mt-7 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16">
        <h2 className="display-md max-w-[18ch] text-fg">{title}</h2>
        {lede ? <p className="body-lg max-w-[42ch] md:text-right">{lede}</p> : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="link-rule caption mt-6 inline-block uppercase tracking-[0.18em] text-fg sm:hidden"
        >
          {action.label}
        </Link>
      ) : null}
    </header>
  );
}
