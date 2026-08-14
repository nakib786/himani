import Image from 'next/image';
import Link from 'next/link';
import { discountPercent } from '@/lib/catalogue';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/lib/types';
import { MoonStars } from '@/components/brand/Motifs';
import { QuickAdd } from './QuickAdd';

/**
 * Product card.
 *
 * A white plate on the bone page, with the caption sitting under a hairline —
 * no card border, no rounded corner, no drop shadow anywhere. The tile reads
 * as a plate in a printed catalogue rather than a UI card.
 *
 * Two structural rules keep it that way:
 *
 *   1. The link is on the TITLE and stretched over the card with ::after, so
 *      the whole tile is clickable while a screen reader announces the product
 *      name. That also lets the quick-add button be a real sibling rather than
 *      a <button> nested inside an <a>, which is invalid HTML.
 *   2. Quick-add is positioned inside the plate, so it can only ever cover
 *      photography — never the name and price underneath.
 *
 * The card is a server component; only the quick-add button ships JS.
 */
export function ProductCard({
  product,
  index,
  priority = false,
  sizes = '(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw',
}: {
  product: Product;
  /** 1-based plate number shown in the corner. */
  index?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const off = discountPercent(product);
  const [primary, secondary] = product.images;

  return (
    <article className="card group flex h-full flex-col">
      <div className="plate">
        <Image
          src={primary.url}
          alt={primary.alt}
          width={primary.width}
          height={primary.height}
          sizes={sizes}
          priority={priority}
          className="plate-main"
        />
        {secondary ? (
          <Image
            src={secondary.url}
            alt=""
            width={secondary.width}
            height={secondary.height}
            sizes={sizes}
            aria-hidden="true"
            className="plate-alt"
          />
        ) : null}

        {/* Plate number, bottom-left, like a catalogue caption. */}
        {typeof index === 'number' ? (
          <span className="index-num absolute bottom-3 left-3 z-10">
            {String(index).padStart(2, '0')}
          </span>
        ) : null}

        {/* Badges. Stroked motif + caps text — never a coloured pill. */}
        <div className="absolute top-3 left-3 z-10 flex flex-col items-start gap-2">
          {product.isNew ? (
            <span className="flex items-center gap-1.5 bg-[color:var(--plate-bg)]/90 px-2 py-1 text-[0.5625rem] uppercase tracking-[0.2em] text-fg">
              <MoonStars className="h-2.5 w-3.5" />
              New
            </span>
          ) : null}
          {product.siteExclusive ? (
            <span className="bg-fg px-2 py-1 text-[0.5625rem] uppercase tracking-[0.2em] text-bg">
              Exclusive
            </span>
          ) : null}
        </div>

        {/* Pointer devices only — never occupies space on touch. */}
        <div className="plate-action">
          <QuickAdd product={product} />
        </div>
      </div>

      {/* Caption block under a hairline. Title, then meta, then the price row
          pinned to the bottom so prices align across a row of cards. */}
      <div className="mt-4 flex flex-1 flex-col border-t border-rule pt-3.5">
        <h3 className="card-title text-fg transition-colors duration-500 group-hover:text-accent">
          <Link href={`/product/${product.slug}`} className="card-link focus-visible:outline-offset-4">
            {product.title}
          </Link>
        </h3>

        <p className="caption mt-1.5 truncate">
          {product.netQuantity}
          <span className="mx-1.5 text-fg-mute">·</span>
          {product.finish === 'rose-gold' ? 'Rose gold' : 'Gold'}
        </p>

        <p className="mt-auto flex flex-wrap items-baseline gap-x-2.5 gap-y-1 pt-3 leading-none">
          <span className="tabular text-[0.9375rem] text-fg">{formatPrice(product.price)}</span>
          {/* Only claim a saving when there is one. With a live backend an
              undiscounted product has mrp === price. */}
          {off > 0 ? (
            <>
              <span className="strike tabular text-[0.75rem]">{formatPrice(product.mrp)}</span>
              <span className="tabular text-[0.6875rem] text-accent">−{off}%</span>
            </>
          ) : null}
        </p>
      </div>
    </article>
  );
}
