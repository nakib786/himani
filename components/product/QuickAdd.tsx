'use client';

import { useCart } from '@/components/cart/CartProvider';
import type { Product } from '@/lib/types';

/** The only interactive part of a product card. Kept tiny on purpose. */
export function QuickAdd({ product }: { product: Product }) {
  const { add } = useCart();

  return (
    <button
      type="button"
      className="btn btn-primary btn-sm btn-block"
      onClick={(e) => {
        // The card's stretched link sits below this button in the stacking
        // order, but stop the event anyway so a future wrapper can't navigate.
        e.stopPropagation();
        add({
          slug: product.slug,
          title: product.title,
          price: product.price,
          mrp: product.mrp,
          image: product.images[0].url,
          imageAlt: product.images[0].alt,
          netQuantity: product.netQuantity,
        });
      }}
    >
      Add to bag
      <span className="sr-only"> — {product.title}</span>
    </button>
  );
}
