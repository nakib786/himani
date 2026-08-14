/**
 * Local catalogue adapter.
 *
 * Serves the five launch SKUs straight from `lib/catalogue.ts`. Everything is
 * pure and synchronous under the hood, wrapped in promises to match the
 * contract the Wix adapter satisfies.
 */

import {
  COLLECTIONS,
  PRODUCTS,
  getCollectionProducts,
  getRelated,
} from '../catalogue';
import type { Collection, Product } from '../types';
import type { CommerceAdapter, ProductQuery, SortKey } from './index';

function sortProducts(items: Product[], sort: SortKey = 'featured'): Product[] {
  const out = [...items];
  switch (sort) {
    case 'price-asc':
      return out.sort((a, b) => a.price - b.price || a.featuredRank - b.featuredRank);
    case 'price-desc':
      return out.sort((a, b) => b.price - a.price || a.featuredRank - b.featuredRank);
    case 'newest':
      return out.sort(
        (a, b) => b.listedOn.localeCompare(a.listedOn) || a.featuredRank - b.featuredRank,
      );
    case 'featured':
    default:
      return out.sort((a, b) => a.featuredRank - b.featuredRank);
  }
}

function matches(p: Product, q: ProductQuery): boolean {
  if (q.category?.length && !q.category.includes(p.category)) return false;
  if (q.finish?.length && !q.finish.includes(p.finish)) return false;
  if (q.motif?.length && !q.motif.includes(p.motif)) return false;
  if (q.occasion?.length && !q.occasion.some((o) => p.occasions.includes(o as never))) {
    return false;
  }
  if (typeof q.minPrice === 'number' && p.price < q.minPrice) return false;
  if (typeof q.maxPrice === 'number' && p.price > q.maxPrice) return false;

  if (q.search) {
    const needle = q.search.trim().toLowerCase();
    if (needle) {
      const haystack = [
        p.title,
        p.shortDescription,
        p.motif,
        p.finish,
        p.category,
        p.sku,
        ...p.occasions,
        ...p.bullets,
      ]
        .join(' ')
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }
  }
  return true;
}

export const localAdapter: CommerceAdapter = {
  backend: 'local',

  async listProducts(query = {}) {
    const base = query.collection ? getCollectionProducts(query.collection) : PRODUCTS;
    return sortProducts(
      base.filter((p) => matches(p, query)),
      query.sort,
    );
  },

  async getProduct(slug) {
    return PRODUCTS.find((p) => p.slug === slug) ?? null;
  },

  async listCollections(): Promise<Collection[]> {
    return COLLECTIONS;
  },

  async getCollection(handle) {
    return COLLECTIONS.find((c) => c.handle === handle) ?? null;
  },

  async listCollectionProducts(handle) {
    return getCollectionProducts(handle);
  },

  async getRelatedProducts(slug, limit = 4) {
    return getRelated(slug, limit);
  },

  async resolveCart(slugs) {
    return slugs
      .map((s) => PRODUCTS.find((p) => p.slug === s))
      .filter((p): p is Product => Boolean(p));
  },

  async listProductSlugs() {
    return PRODUCTS.map((p) => p.slug);
  },
};
