/**
 * KSHYOVRATA — catalogue types
 *
 * These mirror §6 of the build brief. Fields the client has not yet supplied
 * are typed `| null` rather than omitted, so the schema is complete on day one
 * and filling the gaps is a data change, not a migration.
 *
 * `npm run build` prints a report of every null disclosure field — see
 * lib/catalogue.ts → auditDisclosureGaps().
 */

export type Category = 'necklace' | 'earrings' | 'set';
export type Finish = 'gold' | 'rose-gold';
export type Motif = 'butterfly' | 'floral' | 'geometric' | 'celestial';

export type Occasion =
  | 'daily'
  | 'office'
  | 'party'
  | 'wedding'
  | 'festive'
  | 'gifting';

export type ProductImage = {
  /** Re-hosted under /public/products. We never hotlink Amazon's CDN. */
  url: string;
  alt: string;
  width: number;
  height: number;
};

export type Dimensions = {
  l: number;
  w: number;
  h: number;
  unit: 'mm' | 'cm';
  /**
   * Amazon reports package dimensions for some SKUs and item dimensions for
   * others. Being explicit stops us publishing a 45 cm "necklace" that is
   * actually a 45 cm box.
   */
  basis: 'item' | 'package';
};

export type Product = {
  slug: string;
  /** Unified scheme: KSH-<CAT>-<MOTIF>-<NNN>. See SKU_MIGRATION. */
  sku: string;
  /** Preserved so site and marketplace sales reconcile in one report. */
  asin: string;

  title: string;
  /** Keyword-stuffed marketplace original. Reference and <meta> only. */
  amazonTitle: string;
  shortDescription: string;
  longDescription: string[];
  bullets: string[];

  category: Category;
  finish: Finish;
  motif: Motif;
  occasions: Occasion[];

  price: number;
  mrp: number;

  images: ProductImage[];

  weightGrams: number;
  dimensions: Dimensions;
  includedComponents: string[];
  /** Rendered verbatim. Fixes Amazon's confusing "2.0 Pack" for earrings. */
  netQuantity: string;

  /* --- Disclosure fields — CLIENT MUST SUPPLY (brief §12) ----------------- */
  baseMetal: string | null;
  plating: string | null;
  platingMicrons: number | null;
  stoneType: string | null;
  nickelFree: boolean | null;
  leadFree: boolean | null;
  antiTarnish: boolean | null;
  careInstructions: string | null;

  /* --- Legal (Legal Metrology / E-Commerce Rules 2020) -------------------- */
  hsnCode: string;
  countryOfOrigin: 'India';
  manufacturer: string;
  packer: string;

  /* --- Merchandising ------------------------------------------------------ */
  inStock: boolean;
  isNew: boolean;
  siteExclusive: boolean;
  /** Drives "Complete the look". Slug of the companion piece. */
  pairsWith: string | null;
  listedOn: string;
  featuredRank: number;
};

export type CartLine = {
  slug: string;
  quantity: number;
  giftWrap: boolean;
};

export type Collection = {
  handle: string;
  title: string;
  /** Short line used on the collection tile. */
  tagline: string;
  description: string;
  /** Longer editorial intro shown at the top of the collection page. */
  intro: string;
  seoTitle: string;
  seoDescription: string;
  filter: (p: Product) => boolean;
  /** Product slug whose first image fronts the collection tile. */
  coverSlug: string;
};

export type JournalPost = {
  slug: string;
  title: string;
  /** The descriptive query this post is written to answer. */
  targetQuery: string;
  excerpt: string;
  publishedAt: string;
  readingMinutes: number;
  body: JournalBlock[];
  relatedSlugs: string[];
};

export type JournalBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'note'; text: string };
