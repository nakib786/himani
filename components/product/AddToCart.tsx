'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useCart } from '@/components/cart/CartProvider';
import { IconMinus, IconPlus } from '@/components/brand/Motifs';
import type { Product } from '@/lib/types';

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);

  const snapshot = {
    slug: product.slug,
    title: product.title,
    price: product.price,
    mrp: product.mrp,
    image: product.images[0].url,
    imageAlt: product.images[0].alt,
    netQuantity: product.netQuantity,
  };

  if (!product.inStock) {
    return (
      <div className="mt-8">
        <button type="button" className="btn btn-primary btn-block" disabled>
          Sold out
        </button>
        <p className="caption mt-3 text-center">
          Join the letter below and we will tell you when it returns.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-stretch gap-3">
        <div className="flex shrink-0 items-center border border-fg">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-3"
            aria-label="Reduce quantity"
            disabled={quantity <= 1}
          >
            <IconMinus className="h-3.5 w-3.5" />
          </button>
          <span className="tabular w-8 text-center text-[0.875rem]" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(10, q + 1))}
            className="px-3 py-3"
            aria-label="Increase quantity"
            disabled={quantity >= 10}
          >
            <IconPlus className="h-3.5 w-3.5" />
          </button>
        </div>

        <button
          type="button"
          className="btn btn-primary flex-1"
          onClick={() => add(snapshot, quantity)}
        >
          Add to bag
        </button>
      </div>

      <button
        type="button"
        className="btn btn-secondary btn-block mt-3"
        onClick={() => {
          add(snapshot, quantity);
          router.push('/checkout');
        }}
      >
        Buy it now
      </button>
    </div>
  );
}
