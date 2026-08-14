'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useCart } from './CartProvider';
import { IconClose, IconMinus, IconPlus, MoonStars } from '@/components/brand/Motifs';
import { cx, formatPrice } from '@/lib/format';
import { COMMERCE } from '@/lib/site';

export function CartDrawer() {
  const {
    lines,
    count,
    subtotal,
    savings,
    isOpen,
    close,
    remove,
    setQuantity,
    setGiftWrap,
    giftMessage,
    setGiftMessage,
    lastAction,
  } = useCart();

  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const restoreFocus = useRef<HTMLElement | null>(null);

  /* Move focus in on open, hand it back on close. */
  useEffect(() => {
    if (isOpen) {
      restoreFocus.current = document.activeElement as HTMLElement;
      // Wait a frame so the panel is painted before we focus into it.
      const id = window.requestAnimationFrame(() => closeButton.current?.focus());
      return () => window.cancelAnimationFrame(id);
    }
    restoreFocus.current?.focus?.();
  }, [isOpen]);

  /* Keep Tab inside the drawer while it is open. */
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panel.current) return;
      const focusables = panel.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const remaining = Math.max(0, COMMERCE.freeShippingThreshold - subtotal);
  const progress =
    subtotal <= 0 ? 0 : Math.min(100, (subtotal / COMMERCE.freeShippingThreshold) * 100);

  return (
    <>
      {/* Announce adds without stealing focus. */}
      <div aria-live="polite" className="sr-only">
        {lastAction}
      </div>

      {/* Scrim */}
      <div
        className={cx(
          'fixed inset-0 z-[60] bg-espresso/45 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={close}
        aria-hidden="true"
      />

      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Your bag"
        aria-hidden={!isOpen}
        className={cx(
          'fixed top-0 right-0 z-[70] flex h-dvh w-full max-w-[27rem] flex-col bg-bg transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]',
          isOpen ? 'translate-x-0' : 'pointer-events-none translate-x-full',
        )}
      >
        {/* ---- Head ---- */}
        <div className="flex items-center justify-between border-b border-rule px-5 py-5 sm:px-7">
          <h2 className="eyebrow eyebrow-ink">
            Your Bag
            {count > 0 ? <span className="tabular ml-2 text-fg-mute">({count})</span> : null}
          </h2>
          <button
            ref={closeButton}
            type="button"
            onClick={close}
            className="-mr-2 p-2"
            aria-label="Close bag"
          >
            <IconClose className="h-5 w-5" />
          </button>
        </div>

        {lines.length === 0 ? (
          /* ---- Empty state — the moon-and-stars motif, per brief §2 ---- */
          <div className="flex flex-1 flex-col items-center justify-center px-8 text-center">
            <MoonStars className="h-8 w-11 text-fg-mute" />
            <p className="display-sm mt-6 text-fg">Nothing here yet</p>
            <p className="body-sm mt-2 max-w-[28ch]">
              Every piece is gift-ready, and shipping is free over{' '}
              {formatPrice(COMMERCE.freeShippingThreshold)}.
            </p>
            <Link href="/shop" onClick={close} className="btn btn-primary mt-8">
              Shop the collection
            </Link>
          </div>
        ) : (
          <>
            {/* ---- Free shipping progress ---- */}
            <div className="border-b border-rule px-5 py-4 sm:px-7">
              <p className="caption">
                {remaining > 0 ? (
                  <>
                    <span className="tabular text-fg">{formatPrice(remaining)}</span> away from
                    free shipping
                  </>
                ) : (
                  <span className="text-success">Free shipping unlocked</span>
                )}
              </p>
              <div
                className="mt-2.5 h-px w-full bg-rule"
                role="progressbar"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Progress towards free shipping"
              >
                <div
                  className={cx(
                    'h-px transition-[width] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]',
                    remaining > 0 ? 'bg-fg' : 'bg-success',
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* ---- Lines ---- */}
            <ul className="flex-1 overflow-y-auto px-5 sm:px-7">
              {lines.map((line) => (
                <li key={line.slug} className="border-b border-rule py-5">
                  <div className="flex gap-4">
                    <Link
                      href={`/product/${line.slug}`}
                      onClick={close}
                      className="w-20 shrink-0 bg-[color:var(--plate-bg)]"
                    >
                      <Image
                        src={line.image}
                        alt={line.imageAlt}
                        width={200}
                        height={250}
                        sizes="80px"
                        className="aspect-4/5 h-auto w-full object-contain"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <Link href={`/product/${line.slug}`} onClick={close} className="min-w-0">
                          <p className="display-sm truncate text-fg">{line.title}</p>
                          <p className="caption mt-1">{line.netQuantity}</p>
                        </Link>
                        <p className="tabular shrink-0 text-[0.875rem] text-fg">
                          {formatPrice(line.price * line.quantity)}
                        </p>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-3">
                        <div className="flex items-center border border-rule-strong">
                          <button
                            type="button"
                            onClick={() => setQuantity(line.slug, line.quantity - 1)}
                            className="p-1.5"
                            aria-label={`Reduce quantity of ${line.title}`}
                          >
                            <IconMinus className="h-3 w-3" />
                          </button>
                          <span className="tabular w-7 text-center text-[0.75rem]">
                            {line.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => setQuantity(line.slug, line.quantity + 1)}
                            className="p-1.5"
                            aria-label={`Increase quantity of ${line.title}`}
                          >
                            <IconPlus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => remove(line.slug)}
                          className="link-rule caption"
                        >
                          Remove
                          <span className="sr-only"> {line.title}</span>
                        </button>
                      </div>

                      <label className="mt-3 flex cursor-pointer items-center gap-2.5">
                        <input
                          type="checkbox"
                          checked={line.giftWrap}
                          onChange={(e) => setGiftWrap(line.slug, e.target.checked)}
                          className="h-3.5 w-3.5 shrink-0 accent-[color:var(--color-ink)]"
                        />
                        <span className="caption">Add gift wrap — free</span>
                      </label>
                    </div>
                  </div>
                </li>
              ))}

              {/* ---- Gift message ---- */}
              <li className="py-5">
                <label htmlFor="gift-message" className="eyebrow">
                  Gift message — optional
                </label>
                <textarea
                  id="gift-message"
                  rows={3}
                  maxLength={240}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Handwritten onto the card that ships with your order."
                  className="field field-boxed mt-2.5 resize-none text-[0.8125rem]"
                />
                <p className="caption mt-1.5 text-right">
                  <span className="tabular">{giftMessage.length}</span>/240
                </p>
              </li>
            </ul>

            {/* ---- Foot ---- */}
            <div className="border-t border-rule px-5 py-5 sm:px-7">
              <div className="flex items-baseline justify-between">
                <span className="eyebrow eyebrow-ink">Subtotal</span>
                <span className="tabular text-[1.0625rem] text-fg">
                  {formatPrice(subtotal)}
                </span>
              </div>
              {savings > 0 ? (
                <p className="caption mt-1.5 text-right text-accent">
                  You save <span className="tabular">{formatPrice(savings)}</span>
                </p>
              ) : null}
              <p className="caption mt-1 text-right">
                Inclusive of all taxes · Shipping calculated at checkout
              </p>

              <Link href="/checkout" onClick={close} className="btn btn-primary btn-block mt-5">
                Checkout
              </Link>
              <button
                type="button"
                onClick={close}
                className="link-rule caption mx-auto mt-4 block"
              >
                Continue shopping
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
