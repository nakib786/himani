'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/components/cart/CartProvider';
import { IconMinus, IconPlus, MoonStars } from '@/components/brand/Motifs';
import { formatPrice } from '@/lib/format';
import { COMMERCE } from '@/lib/site';

export function CartPageContent() {
  const {
    lines,
    subtotal,
    savings,
    hydrated,
    remove,
    setQuantity,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
  } = useCart();

  if (!hydrated) {
    return (
      <div className="border-t border-rule py-24">
        <p className="caption text-center">Loading your bag…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center border-t border-rule py-24 text-center">
        <MoonStars className="h-8 w-11 text-fg-mute" />
        <p className="display-md mt-6 text-fg">Your bag is empty</p>
        <p className="body-sm mt-3 max-w-[38ch]">
          Every piece is gift-ready, and shipping is free over{' '}
          {formatPrice(COMMERCE.freeShippingThreshold)}.
        </p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Shop the collection
        </Link>
      </div>
    );
  }

  const remaining = Math.max(0, COMMERCE.freeShippingThreshold - subtotal);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
      {/* ---- Lines ---- */}
      <div>
        <ul className="border-t border-rule">
          {lines.map((line) => (
            <li key={line.slug} className="border-b border-rule py-6">
              <div className="flex gap-5">
                <Link href={`/product/${line.slug}`} className="w-24 shrink-0 bg-[color:var(--plate-bg)] sm:w-32">
                  <Image
                    src={line.image}
                    alt={line.imageAlt}
                    width={320}
                    height={400}
                    sizes="(min-width: 640px) 128px, 96px"
                    className="aspect-4/5 h-auto w-full object-contain"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Link href={`/product/${line.slug}`}>
                        <h2 className="display-sm text-fg">{line.title}</h2>
                      </Link>
                      <p className="caption mt-1.5">{line.netQuantity}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="tabular text-[0.9375rem] text-fg">
                        {formatPrice(line.price * line.quantity)}
                      </p>
                      {line.mrp > line.price ? (
                        <p className="strike tabular mt-1 text-[0.75rem]">
                          {formatPrice(line.mrp * line.quantity)}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center border border-rule-strong">
                      <button
                        type="button"
                        onClick={() => setQuantity(line.slug, line.quantity - 1)}
                        className="p-2"
                        aria-label={`Reduce quantity of ${line.title}`}
                      >
                        <IconMinus className="h-3 w-3" />
                      </button>
                      <span className="tabular w-8 text-center text-[0.8125rem]">
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(line.slug, line.quantity + 1)}
                        className="p-2"
                        aria-label={`Increase quantity of ${line.title}`}
                      >
                        <IconPlus className="h-3 w-3" />
                      </button>
                    </div>

                    <label className="flex cursor-pointer items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={line.giftWrap}
                        onChange={(e) => setGiftWrap(line.slug, e.target.checked)}
                        className="h-3.5 w-3.5 accent-[color:var(--color-ink)]"
                      />
                      <span className="caption">Gift wrap — free</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => remove(line.slug)}
                      className="link-rule caption"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-8">
          <label htmlFor="gift-message-page" className="eyebrow">
            Gift message — optional
          </label>
          <textarea
            id="gift-message-page"
            rows={3}
            maxLength={240}
            value={giftMessage}
            onChange={(e) => setGiftMessage(e.target.value)}
            placeholder="We will write this by hand onto the card that ships with your order."
            className="field field-boxed mt-3 resize-none"
          />
          <p className="caption mt-1.5 text-right">
            <span className="tabular">{giftMessage.length}</span>/240
          </p>
        </div>
      </div>

      {/* ---- Summary ---- */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border-t border-rule pt-4">
          <h2 className="eyebrow eyebrow-ink">Summary</h2>

          <dl className="mt-6 flex flex-col gap-3">
            <div className="flex justify-between gap-4">
              <dt className="body-sm">Subtotal</dt>
              <dd className="tabular body-sm text-fg">{formatPrice(subtotal)}</dd>
            </div>
            {savings > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="body-sm">You save</dt>
                <dd className="tabular body-sm text-accent">−{formatPrice(savings)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="body-sm">Shipping</dt>
              <dd className="body-sm text-fg">
                {remaining > 0 ? 'Calculated at checkout' : 'Free'}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex justify-between gap-4 border-t border-rule pt-5">
            <span className="eyebrow eyebrow-ink">Total</span>
            <span className="tabular text-[1.125rem] text-fg">{formatPrice(subtotal)}</span>
          </div>
          <p className="caption mt-2">Inclusive of all taxes</p>

          {remaining > 0 ? (
            <p className="caption mt-4 border border-rule-strong p-3">
              Add <span className="tabular text-fg">{formatPrice(remaining)}</span> more for
              free shipping.
            </p>
          ) : null}

          <Link href="/checkout" className="btn btn-primary btn-block mt-6">
            Proceed to checkout
          </Link>
          <Link href="/shop" className="link-rule caption mx-auto mt-4 block w-fit uppercase">
            Continue shopping
          </Link>
        </div>
      </aside>
    </div>
  );
}
