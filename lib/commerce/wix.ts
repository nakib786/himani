/**
 * Wix Stores adapter — Catalog V3.
 *
 * Verified against the live site (Kshyovrata, Wix Stores Catalog V3): all five
 * SKUs are published there with slugs, prices, compare-at prices and image
 * galleries matching `lib/catalogue.ts`.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHAT WIX OWNS, AND WHAT IT DOES NOT
 * ─────────────────────────────────────────────────────────────────────────────
 * Wix is the source of truth for the things a shop owner edits daily:
 *
 *     title · description · price · compare-at price · images · stock
 *
 * It is NOT the source of truth for the fields in §6/§12 of the brief that Wix
 * has no native home for — motif, finish, occasions, base metal, plating
 * microns, HSN code, packer, net quantity, and the rest of the disclosure set.
 * Those stay in `lib/catalogue.ts`, keyed by slug, and are merged over the Wix
 * response in `fromWix()`.
 *
 * This overlay is deliberate. Legal Metrology and disclosure text should not
 * silently blank out because someone edited a product in the Wix dashboard and
 * missed a custom field. A Wix product with no local entry is skipped and
 * logged rather than published with empty disclosure copy.
 *
 * Slugs are the join key AND the site's URLs, so renaming a product slug in
 * Wix changes a live URL and breaks the overlay. Change both together.
 */

import {
  COLLECTIONS,
  PRODUCTS,
  getCollectionProducts,
  getRelated,
} from '../catalogue';
import { toImage, wixFetch, type WixImage } from '../wix/client';
import type { Collection, Product } from '../types';
import type { CommerceAdapter, ProductQuery, SortKey } from './index';

/**
 * Fields Catalog V3 omits unless asked for by name. `MEDIA_ITEMS_INFO` is what
 * turns a single hero image into the gallery the product page needs.
 */
const PRODUCT_FIELDS = ['MEDIA_ITEMS_INFO', 'PLAIN_DESCRIPTION'] as const;

const TAG = 'wix-products';

/* -------------------------------------------------------------------------- */
/*  Wix response shapes — only the fields we actually read                     */
/* -------------------------------------------------------------------------- */

type WixMediaItem = { image?: WixImage; altText?: string };

type WixProduct = {
  name?: string;
  slug?: string;
  visible?: boolean;
  plainDescription?: string;
  media?: {
    main?: WixMediaItem;
    itemsInfo?: { items?: WixMediaItem[] };
  };
  actualPriceRange?: { minValue?: { amount?: string } };
  compareAtPriceRange?: { minValue?: { amount?: string } };
  inventory?: {
    availabilityStatus?: 'IN_STOCK' | 'OUT_OF_STOCK' | 'PARTIALLY_OUT_OF_STOCK';
  };
};

/* -------------------------------------------------------------------------- */
/*  Mapping                                                                    */
/* -------------------------------------------------------------------------- */

/** Wix money arrives as a decimal string. Our prices are whole rupees. */
function toRupees(amount: string | undefined, fallback: number): number {
  if (!amount) return fallback;
  const n = Number(amount);
  return Number.isFinite(n) ? Math.round(n) : fallback;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const overlayBySlug = new Map(PRODUCTS.map((p) => [p.slug, p]));

/** Slugs already warned about, so ISR regeneration doesn't spam the log. */
const warned = new Set<string>();

function fromWix(wix: WixProduct): Product | null {
  const slug = wix.slug;
  if (!slug) return null;

  const base = overlayBySlug.get(slug);
  if (!base) {
    if (!warned.has(slug)) {
      warned.add(slug);
      console.warn(
        `[commerce/wix] Wix product "${wix.name ?? slug}" (slug: ${slug}) has no ` +
          'entry in lib/catalogue.ts, so its material and legal disclosure fields ' +
          'are unknown. Skipping it. Add the slug to the catalogue to publish it.',
      );
    }
    return null;
  }

  const altBase = wix.name ?? base.title;
  const main = wix.media?.main;
  const items = wix.media?.itemsInfo?.items ?? [];

  // Wix repeats the main image as the first gallery item — de-duplicate by URL.
  const seen = new Set<string>();
  const images = [main, ...items]
    .map((item) => toImage(item?.image, altBase, item?.altText))
    .filter((img): img is NonNullable<typeof img> => {
      if (!img || seen.has(img.url)) return false;
      seen.add(img.url);
      return true;
    });

  const price = toRupees(wix.actualPriceRange?.minValue?.amount, base.price);
  const mrp = toRupees(wix.compareAtPriceRange?.minValue?.amount, base.mrp);

  return {
    ...base,

    // ---- Wix is authoritative for these ----
    title: wix.name?.trim() || base.title,
    shortDescription: wix.plainDescription
      ? stripHtml(wix.plainDescription).slice(0, 200)
      : base.shortDescription,
    price,
    // Wix leaves compare-at empty when a product isn't discounted. Collapsing
    // mrp onto price is what tells the UI there is no saving to advertise —
    // it must never render as a struck-through ₹0 beside the live price.
    mrp: mrp > price ? mrp : price,
    images: images.length > 0 ? images : base.images,
    inStock: wix.inventory?.availabilityStatus !== 'OUT_OF_STOCK' && wix.visible !== false,
  };
}

/* -------------------------------------------------------------------------- */
/*  Catalogue reads                                                            */
/* -------------------------------------------------------------------------- */

async function fetchAllProducts(): Promise<Product[]> {
  // Five SKUs today, and the brief's ceiling is "past 100 without a rebuild".
  // One 100-item page covers that; paginate here when the catalogue outgrows it.
  const json = await wixFetch<{ products?: WixProduct[] }>(
    '/stores/v3/products/search',
    {
      method: 'POST',
      body: { search: { cursorPaging: { limit: 100 } }, fields: PRODUCT_FIELDS },
      tag: TAG,
    },
  );

  return (json.products ?? []).map(fromWix).filter((p): p is Product => p !== null);
}

/* -------------------------------------------------------------------------- */
/*  Query helpers — same semantics as the local adapter                        */
/* -------------------------------------------------------------------------- */

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

/**
 * Collections stay local.
 *
 * A `Collection` carries an editorial intro, SEO copy and a `filter` predicate
 * — it is a piece of the site's writing, not a row in a store dashboard. The
 * curation order comes from the catalogue; the product data comes from Wix.
 */
function collectionProducts(handle: string, all: Product[]): Product[] {
  if (!COLLECTIONS.some((c) => c.handle === handle)) return [];
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  return getCollectionProducts(handle)
    .map((p) => bySlug.get(p.slug))
    .filter((p): p is Product => Boolean(p));
}

/* -------------------------------------------------------------------------- */

export const wixAdapter: CommerceAdapter = {
  backend: 'wix',

  async listProducts(query = {}) {
    const all = await fetchAllProducts();
    const base = query.collection ? collectionProducts(query.collection, all) : all;
    return sortProducts(
      base.filter((p) => matches(p, query)),
      query.sort,
    );
  },

  async getProduct(slug) {
    const query = PRODUCT_FIELDS.map((f) => `fields=${f}`).join('&');
    const json = await wixFetch<{ product?: WixProduct }>(
      `/stores/v3/products/slug/${encodeURIComponent(slug)}?${query}`,
      { method: 'GET', tag: TAG },
    ).catch(() => null);

    if (!json?.product) return null;
    return fromWix(json.product);
  },

  async listCollections(): Promise<Collection[]> {
    return COLLECTIONS;
  },

  async getCollection(handle) {
    return COLLECTIONS.find((c) => c.handle === handle) ?? null;
  },

  async listCollectionProducts(handle) {
    return collectionProducts(handle, await fetchAllProducts());
  },

  async getRelatedProducts(slug, limit = 4) {
    const all = await fetchAllProducts();
    const bySlug = new Map(all.map((p) => [p.slug, p]));
    return getRelated(slug, limit)
      .map((p) => bySlug.get(p.slug))
      .filter((p): p is Product => Boolean(p));
  },

  async resolveCart(slugs) {
    const all = await fetchAllProducts();
    const bySlug = new Map(all.map((p) => [p.slug, p]));
    return slugs.map((s) => bySlug.get(s)).filter((p): p is Product => Boolean(p));
  },

  async listProductSlugs() {
    return (await fetchAllProducts()).map((p) => p.slug);
  },
};
