/**
 * KSHYOVRATA — commerce adapter
 *
 * WHY THIS LAYER EXISTS
 * ---------------------
 * The brief (§Project) requires the site to scale past 100 SKUs "without a
 * rebuild". Wiring a store's API directly into pages would make that a
 * rebuild: every page would end up knowing about cursors, money types and
 * one vendor's product schema.
 *
 * So no page, component or route in this codebase imports `lib/catalogue`
 * directly. Everything goes through the `CommerceAdapter` contract below.
 *
 * The store is live on Wix: with `COMMERCE_BACKEND=wix` the eight methods are
 * served from Wix Stores Catalog V3 (`wix.ts`). With `local` they come from
 * the committed catalogue — no network, instant builds, useful offline and in
 * CI. Switching between them changes no page and no component. That is the
 * entire point of this layer.
 *
 * The contract is intentionally async and cursor-free at the call site: the
 * local adapter returns resolved promises, the Wix one does real fetches with
 * `next: { revalidate }` for ISR.
 */

import type { Collection, Product } from '../types';
import { localAdapter } from './local';
import { wixAdapter } from './wix';

export type ProductQuery = {
  collection?: string;
  category?: string[];
  finish?: string[];
  motif?: string[];
  occasion?: string[];
  maxPrice?: number;
  minPrice?: number;
  sort?: SortKey;
  search?: string;
};

export type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: 'featured', label: 'Featured' },
  { key: 'newest', label: 'Newest' },
  { key: 'price-asc', label: 'Price, low to high' },
  { key: 'price-desc', label: 'Price, high to low' },
];

export interface CommerceAdapter {
  readonly backend: string;
  listProducts(query?: ProductQuery): Promise<Product[]>;
  getProduct(slug: string): Promise<Product | null>;
  listCollections(): Promise<Collection[]>;
  getCollection(handle: string): Promise<Collection | null>;
  listCollectionProducts(handle: string): Promise<Product[]>;
  getRelatedProducts(slug: string, limit?: number): Promise<Product[]>;
  /** Resolve cart lines to full products — the drawer only stores slugs. */
  resolveCart(slugs: string[]): Promise<Product[]>;
  /** Every SKU slug, for generateStaticParams and the sitemap. */
  listProductSlugs(): Promise<string[]>;
}

/**
 * Backend selection, driven by COMMERCE_BACKEND. See `.env.example`.
 *
 *   local  the five launch SKUs from lib/catalogue.ts (default)
 *   wix    Wix Stores Catalog V3 — lib/commerce/wix.ts
 *
 * An unrecognised value falls back to `local` with a warning rather than
 * throwing: a typo in a Vercel env var should not take the storefront down.
 */
function selectAdapter(): CommerceAdapter {
  const backend = process.env.COMMERCE_BACKEND?.trim().toLowerCase();

  switch (backend) {
    case 'wix':
      return wixAdapter;
    case undefined:
    case '':
    case 'local':
      return localAdapter;
    default:
      console.warn(
        `[commerce] COMMERCE_BACKEND="${backend}" is not a known backend ` +
          '(local | wix). Falling back to the local catalogue.',
      );
      return localAdapter;
  }
}

export const commerce: CommerceAdapter = selectAdapter();

export type { Product, Collection };
