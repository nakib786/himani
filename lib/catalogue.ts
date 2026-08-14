import type { Collection, Occasion, Product } from './types';

/**
 * KSHYOVRATA — the catalogue
 *
 * Five SKUs, ported from Amazon.in with every title and description rewritten
 * in brand voice (brief §7). The marketplace copy is preserved in
 * `amazonTitle` for <meta> and reconciliation, never shown as an H1.
 *
 * THREE SOURCE DEFECTS FIXED HERE (brief §7):
 *   1. B0HDCRYMVH's description contained the literal string "Amazon SEO
 *      Product Description" and unrendered `**` markdown — rewritten from
 *      scratch below.
 *   2. Earrings reported "Net Quantity: 2.0 Pack" — rendered as "1 pair".
 *   3. B0HDCRYMVH listed the manufacturer as "Fashion Jewelry Co." while the
 *      other four say "Siya Jeweller" — normalised to Siya Jeweller across
 *      the catalogue. This must also be corrected on the Amazon listing.
 *
 * A FOURTH, JUDGEMENT-CALL CHANGE — the "skin-friendly" claim
 * ------------------------------------------------------------------
 * Every Amazon listing claims "skin-friendly" with no nickel-free, lead-free
 * or hypoallergenic substantiation behind it (brief §1.5 #4, §12 #2). Making
 * an unsupported dermatological claim on a brand's own storefront is a
 * different risk from repeating one on a marketplace. Until the client
 * supplies test data, the site describes what is observable and verifiable —
 * a smooth polished finish, no rough edges, negligible weight — and does not
 * assert skin safety. Restore the claim the moment §12 #2 is answered.
 */

/** Old marketplace codes → the unified scheme. Keep for reconciliation. */
export const SKU_MIGRATION: Record<string, string> = {
  'BUTTERFLY-001': 'KSH-NCK-BFY-001',
  'JS-GP-001': 'KSH-SET-HEX-001',
  'KSH-BE-001': 'KSH-EAR-BFY-001',
  'JS-GP-002': 'KSH-SET-FLR-001',
  'Gse-001': 'KSH-EAR-SUN-001',
};

const MANUFACTURER = 'Siya Jeweller';

/** Imitation jewellery. Rate to be confirmed by the client's CA (§10). */
const HSN = '7117';

/**
 * IMAGE CURATION — 15 of the 35 Amazon images are deliberately not used.
 *
 * Auditing all 35 re-hosted files found three kinds of asset:
 *   · real photography  — white-background plates, travertine/marble flat-lays
 *                         and model shots. 20 files. These ship.
 *   · feature callouts  — marketplace A+ graphics with text baked into the
 *                         pixels ("Skin Friendly Comfort", "Adjustable Chain",
 *                         "Anti Tarnish", "Water Resistant"). 10 files.
 *   · care guide        — one per SKU, same artwork throughout. 5 files.
 *
 * The callout graphics are excluded for three reasons: they are marketplace
 * furniture and instantly undercut the premium positioning the site exists to
 * establish; the text in them is unreadable to screen readers and untranslatable;
 * and they assert exactly the skin-safety and anti-tarnish claims that §12 of
 * the brief says are unsubstantiated. Shipping them would contradict the
 * softened copy elsewhere in this file.
 *
 * The care-guide artwork is likewise not shown as a product image, but its
 * content is genuine brand copy and is reproduced as real text on /care and in
 * `careInstructions` below.
 *
 * Only image 01 of each SKU is full resolution (1254px). Everything else is
 * 500px, which is thin for a 4:5 plate on a retina screen. This is the
 * strongest possible argument for the photography budget in §12.7.
 */
function img(slug: string, n: number, alt: string, width = 500, height = 500) {
  return {
    url: `/products/${slug}/${String(n).padStart(2, '0')}.jpg`,
    alt,
    width,
    height,
  };
}

/** Full-resolution hero plate — image 01 of every SKU. */
function imgHero(slug: string, alt: string) {
  return img(slug, 1, alt, 1254, 1254);
}

/**
 * The house care instructions.
 *
 * Transcribed from the brand's own "Jewelry Care Guide" artwork, which ships
 * on every one of the five Amazon listings. This is the client's own wording,
 * not invented for this build — which answers open question §12.4. Worth
 * confirming with them that it is current before launch.
 */
export const BRAND_CARE = {
  principles: [
    {
      title: 'Keep dry',
      detail: 'Remove jewellery before bathing, swimming, or exercising.',
    },
    {
      title: 'Avoid chemicals',
      detail: 'Keep away from perfume, lotion, hairspray, and cleaning products.',
    },
    {
      title: 'Clean gently',
      detail: 'Use a soft, lint-free cloth to wipe your jewellery after use to maintain shine.',
    },
    {
      title: 'Store safely',
      detail: 'Store in a jewellery box or soft pouch to prevent scratches and tangling.',
    },
  ],
  cleaningSteps: [
    'Prepare a bowl with lukewarm water and a few drops of mild dish soap.',
    'Soak your jewellery for two to three minutes.',
    'Gently brush with a soft toothbrush to remove any dirt.',
    'Rinse with clean water and pat dry with a soft cloth.',
  ],
  notes: [
    'Avoid exposing jewellery to harsh chemicals or extreme temperatures.',
    'Not suitable for swimming or showering.',
    'Regular care will help maintain its brilliance and longevity.',
  ],
} as const;

const CARE_SUMMARY =
  'Keep dry and away from perfume, lotion and hairspray. Wipe with a soft, lint-free cloth after wearing, and store in a pouch or box so nothing scratches or tangles. Not suitable for swimming or showering.';

/* ========================================================================== */

export const PRODUCTS: Product[] = [
  /* ------------------------------------------------------------------ 01 -- */
  {
    slug: 'papillon-pendant-necklace',
    sku: 'KSH-NCK-BFY-001',
    asin: 'B0HBZNHDBL',

    title: 'Papillon Pendant Necklace',
    amazonTitle:
      'Kshyovrata Gold Plated Butterfly Pendant Necklace for Women & Girls, Adjustable Chain, Lightweight, Minimalist Open Butterfly Design, Premium Polished Finish, Fashion Jewellery Gift',
    shortDescription:
      'An open-outline butterfly on a fine box-link chain. Small enough for a shirt collar, quiet enough for every day.',
    longDescription: [
      'The butterfly is drawn rather than filled — one continuous outline, polished to a soft gold, so it catches light without ever raising its voice. It hangs from a fine box-link chain that adjusts to the length you want, which means it sits neatly under a collar or just above an open neckline depending on the day.',
      'At five grams this is the kind of piece you put on in the morning and stop noticing by ten. Wear it alone for the restraint of it, or let it be the shortest layer under something longer.',
    ],
    bullets: [
      'Open-outline butterfly pendant with a polished gold-plated finish',
      'Fine box-link chain, adjustable to your preferred neckline length',
      'Five grams in total — light enough to wear from morning to night',
      'Sits comfortably with both ethnic and western dress',
      'Arrives gift-ready — no additional wrapping needed',
    ],

    category: 'necklace',
    finish: 'gold',
    motif: 'butterfly',
    occasions: ['daily', 'office', 'party', 'festive', 'gifting'],

    price: 399,
    mrp: 699,

    images: [
      imgHero(
        'papillon-pendant-necklace',
        'Papillon pendant necklace — an open-outline gold butterfly on a fine box-link chain',
      ),
      img(
        'papillon-pendant-necklace',
        3,
        'Papillon pendant necklace worn at an open neckline, the butterfly resting just below the collarbone',
      ),
      img(
        'papillon-pendant-necklace',
        2,
        'Papillon pendant necklace laid flat, showing the full length of the box-link chain',
      ),
      img(
        'papillon-pendant-necklace',
        5,
        'Papillon pendant necklace arranged with dried flowers and deep red fabric',
        505,
        757,
      ),
      img(
        'papillon-pendant-necklace',
        7,
        'Papillon pendant necklace resting on a travertine block in daylight',
      ),
    ],

    weightGrams: 5,
    dimensions: { l: 2.5, w: 2.5, h: 0.3, unit: 'cm', basis: 'item' },
    includedComponents: ['1 pendant necklace with adjustable chain'],
    netQuantity: '1 necklace',

    baseMetal: null,
    plating: null,
    platingMicrons: null,
    stoneType: null,
    nickelFree: null,
    leadFree: null,
    antiTarnish: null,
    careInstructions: CARE_SUMMARY,

    hsnCode: HSN,
    countryOfOrigin: 'India',
    manufacturer: MANUFACTURER,
    packer: MANUFACTURER,

    inStock: true,
    isNew: false,
    siteExclusive: false,
    pairsWith: 'papillon-wing-earrings',
    listedOn: '2026-07-28',
    featuredRank: 2,
  },

  /* ------------------------------------------------------------------ 02 -- */
  {
    slug: 'hexa-crystal-necklace-set',
    sku: 'KSH-SET-HEX-001',
    asin: 'B0HCR3QVJJ',

    title: 'Hexa Crystal Necklace Set',
    amazonTitle:
      'Kshyovrata Rose Gold Plated Geometric Hexagon Crystal Necklace Set for Women & Girls | Adjustable Slider Chain with Matching Drop Earrings | Lightweight Fashion Jewellery for Party, Office & Daily Wear',
    shortDescription:
      'Open hexagons set with crystal, in rose gold. Necklace and matching drop earrings.',
    longDescription: [
      'Geometry does the work here. Open hexagon links run along the chain, each holding a small crystal that picks up light as you move — and because the links are cut open rather than cast solid, the piece stays light despite its scale.',
      'A slider closure means there is no fixed length: draw it in for a high neckline, let it out for something open. The matching drop earrings set the same hexagon against a plain circle, so the pair reads as considered rather than merely matching.',
    ],
    bullets: [
      'Open hexagon links with crystal accents, rose-gold plated throughout',
      'Slider chain — set the length yourself, no clasp to fasten',
      'Includes the matching hexagon-and-circle drop earrings',
      'Scaled for occasion wear without the weight that usually comes with it',
      'Arrives gift-ready as a complete set',
    ],

    category: 'set',
    finish: 'rose-gold',
    motif: 'geometric',
    occasions: ['office', 'party', 'wedding', 'festive', 'gifting'],

    price: 899,
    mrp: 1499,

    images: [
      imgHero(
        'hexa-crystal-necklace-set',
        'Hexa crystal necklace set — rose gold hexagon necklace with its matching drop earrings',
      ),
      img(
        'hexa-crystal-necklace-set',
        4,
        'Hexa crystal necklace set worn, the hexagon links sitting along the collarbone with the drop earrings',
      ),
      img(
        'hexa-crystal-necklace-set',
        2,
        'Hexa crystal necklace set laid flat, showing the slider chain and its rose gold finish',
      ),
      img(
        'hexa-crystal-necklace-set',
        3,
        'Hexa crystal necklace set arranged on travertine with dried gypsophila',
      ),
    ],

    weightGrams: 20,
    dimensions: { l: 15, w: 15, h: 3.5, unit: 'cm', basis: 'package' },
    includedComponents: ['1 pendant necklace with slider chain', '1 pair drop earrings'],
    netQuantity: '1 necklace + 1 pair earrings',

    baseMetal: null,
    plating: null,
    platingMicrons: null,
    stoneType: null,
    nickelFree: null,
    leadFree: null,
    antiTarnish: null,
    careInstructions: CARE_SUMMARY,

    hsnCode: HSN,
    countryOfOrigin: 'India',
    manufacturer: MANUFACTURER,
    packer: MANUFACTURER,

    inStock: true,
    isNew: false,
    siteExclusive: false,
    pairsWith: 'fleur-crystal-necklace-set',
    listedOn: '2026-08-03',
    featuredRank: 1,
  },

  /* ------------------------------------------------------------------ 03 -- */
  {
    slug: 'papillon-wing-earrings',
    sku: 'KSH-EAR-BFY-001',
    asin: 'B0HF41FLT6',

    title: 'Papillon Wing Earrings',
    amazonTitle:
      'KSHYOVRATA Gold-Plated Butterfly Wing Statement Earrings for Women and Girls, Elegant Lightweight Trendy Fashion Jewellery for Party, Wedding, Festive and Special Occasion Wear',
    shortDescription:
      'Openwork wings, pierced rather than cast. Statement scale at five grams the pair.',
    longDescription: [
      'The wing is pierced with a fine openwork pattern, which is the whole reason a 6.5 cm earring can feel like nothing at all — most of its surface is air. Polished gold-tone throughout, on a secure closure that holds through a long evening.',
      'This is the loud piece in an otherwise quiet outfit. Hair up, nothing at the neck, and let them do the talking.',
    ],
    bullets: [
      'Openwork butterfly-wing earrings in a polished gold-tone finish',
      'A 6.5 cm drop at five grams the pair — statement scale, negligible weight',
      'Secure closure designed to hold through a full evening',
      'Reads equally well against a saree and against a plain shift dress',
      'Arrives gift-ready — no additional wrapping needed',
    ],

    category: 'earrings',
    finish: 'gold',
    motif: 'butterfly',
    occasions: ['party', 'wedding', 'festive', 'gifting'],

    price: 399,
    mrp: 799,

    images: [
      imgHero(
        'papillon-wing-earrings',
        'Papillon wing earrings — a pair of gold openwork butterfly wings, shown facing each other',
      ),
      img(
        'papillon-wing-earrings',
        4,
        'Papillon wing earrings resting on a travertine block, the openwork casting shadows',
      ),
      img(
        'papillon-wing-earrings',
        2,
        'Papillon wing earrings shown flat, the full openwork vein pattern visible across both wings',
      ),
    ],

    weightGrams: 5,
    dimensions: { l: 6.5, w: 3.5, h: 1, unit: 'cm', basis: 'item' },
    includedComponents: ['1 pair statement earrings'],
    netQuantity: '1 pair',

    baseMetal: null,
    plating: null,
    platingMicrons: null,
    stoneType: null,
    nickelFree: null,
    leadFree: null,
    antiTarnish: null,
    careInstructions: CARE_SUMMARY,

    hsnCode: HSN,
    countryOfOrigin: 'India',
    manufacturer: MANUFACTURER,
    packer: MANUFACTURER,

    inStock: true,
    isNew: true,
    siteExclusive: false,
    pairsWith: 'papillon-pendant-necklace',
    listedOn: '2026-08-13',
    featuredRank: 3,
  },

  /* ------------------------------------------------------------------ 04 -- */
  {
    slug: 'fleur-crystal-necklace-set',
    sku: 'KSH-SET-FLR-001',
    asin: 'B0HCRFQG5B',

    title: 'Fleur Crystal Necklace Set',
    amazonTitle:
      'Kshyovrata Gold Plated Floral Crystal Necklace Set for Women & Girls with Matching Stud Earrings | Elegant Flower Design Pendant Necklace | Lightweight Fashion Jewellery for Party, Wedding & Daily Wear',
    shortDescription:
      'A cluster of crystal-set flowers, with matching studs. The dressed-up option.',
    longDescription: [
      'Several flowers rather than one. They cluster along the front of the necklace, each petal group holding a crystal, so the piece has actual depth to it instead of lying flat against the skin. Gold plated and polished throughout.',
      'The matching studs take a single flower from that cluster and leave it there, which is the right amount of repetition. Made for weddings and the long evenings around them.',
    ],
    bullets: [
      'Multi-flower necklace with crystal-set petals in a polished gold finish',
      'Includes the matching single-flower stud earrings',
      'Built up in layers, so the front has depth rather than only sparkle',
      'Sits well against a saree and against a plain neckline alike',
      'Arrives gift-ready as a complete set',
    ],

    category: 'set',
    finish: 'gold',
    motif: 'floral',
    occasions: ['party', 'wedding', 'festive', 'gifting'],

    price: 799,
    mrp: 1299,

    images: [
      imgHero(
        'fleur-crystal-necklace-set',
        'Fleur crystal necklace set — a cluster of crystal-set gold flowers with matching stud earrings',
      ),
      img(
        'fleur-crystal-necklace-set',
        4,
        'Fleur crystal necklace set worn, the flower cluster sitting in a V at the neckline with matching studs',
      ),
      img(
        'fleur-crystal-necklace-set',
        2,
        'Fleur crystal necklace set laid flat, showing all seven flowers and the chain',
      ),
      img(
        'fleur-crystal-necklace-set',
        5,
        'Fleur crystal necklace set arranged on white marble',
      ),
    ],

    weightGrams: 20,
    dimensions: { l: 45, w: 15, h: 2.5, unit: 'cm', basis: 'package' },
    includedComponents: ['1 pendant necklace', '1 pair stud earrings'],
    netQuantity: '1 necklace + 1 pair earrings',

    baseMetal: null,
    plating: null,
    platingMicrons: null,
    stoneType: null,
    nickelFree: null,
    leadFree: null,
    antiTarnish: null,
    careInstructions: CARE_SUMMARY,

    hsnCode: HSN,
    countryOfOrigin: 'India',
    manufacturer: MANUFACTURER,
    packer: MANUFACTURER,

    inStock: true,
    isNew: false,
    siteExclusive: false,
    pairsWith: 'hexa-crystal-necklace-set',
    listedOn: '2026-08-03',
    featuredRank: 4,
  },

  /* ------------------------------------------------------------------ 05 -- */
  {
    slug: 'sunburst-studs',
    sku: 'KSH-EAR-SUN-001',
    asin: 'B0HDCRYMVH',

    title: 'Sunburst Studs',
    amazonTitle:
      'Kshyovrata Gold Sunburst Stud Earrings for Women & Girls, Statement Sun Shape Earrings, Lightweight Fashion Jewellery, Minimalist Gold Plated Earrings for Party, Casual & Daily Wear, Gift',
    shortDescription:
      'A small radiating sun, 1.5 cm across. The stud you stop thinking about.',
    longDescription: [
      'Rays cut outward from a raised centre and take a polish on every edge, so the earring catches light from any angle. The effect is closer to a struck coin than to a set stone — which is precisely why it goes with everything.',
      'At 1.5 cm they are large enough to be seen across a table and small enough to wear to work every day of the week. This is also the piece the house borrowed its sun for.',
    ],
    bullets: [
      'Radiating sunburst studs, 1.5 cm across, in a polished gold-plated finish',
      'Flat enough to sleep in, quiet enough for the office',
      'Sold as one pair',
      'The everyday stud — no occasion required',
      'Arrives gift-ready — no additional wrapping needed',
    ],

    category: 'earrings',
    finish: 'gold',
    motif: 'celestial',
    occasions: ['daily', 'office', 'party', 'festive', 'gifting'],

    price: 399,
    mrp: 899,

    images: [
      imgHero(
        'sunburst-studs',
        'Sunburst studs — a pair of gold earrings with rays radiating from an open centre',
      ),
      img(
        'sunburst-studs',
        4,
        'Sunburst stud worn on the ear, the rays fanning out against dark hair',
      ),
      img(
        'sunburst-studs',
        2,
        'Sunburst studs shown flat on white, both earrings side by side',
      ),
      img(
        'sunburst-studs',
        5,
        'Sunburst studs resting on a weathered travertine surface',
      ),
    ],

    weightGrams: 5,
    dimensions: { l: 1.5, w: 1.5, h: 1.5, unit: 'cm', basis: 'item' },
    includedComponents: ['1 pair stud earrings'],
    netQuantity: '1 pair',

    baseMetal: null,
    plating: null,
    platingMicrons: null,
    stoneType: null,
    nickelFree: null,
    leadFree: null,
    antiTarnish: null,
    careInstructions: CARE_SUMMARY,

    hsnCode: HSN,
    countryOfOrigin: 'India',
    manufacturer: MANUFACTURER,
    packer: MANUFACTURER,

    inStock: true,
    isNew: false,
    siteExclusive: false,
    pairsWith: 'papillon-pendant-necklace',
    listedOn: '2026-08-07',
    featuredRank: 5,
  },
];

/* ========================================================================== */
/* Collections                                                                */
/* ========================================================================== */

export const COLLECTIONS: Collection[] = [
  {
    handle: 'necklaces',
    title: 'Necklaces',
    tagline: 'Pendants and sets, adjustable to your neckline',
    description: 'Adjustable pendants and crystal-set pieces in gold and rose gold.',
    intro:
      'Every necklace in the house adjusts — a slider or an extension chain — because a fixed 18 inches suits one neckline and fights every other one.',
    seoTitle: 'Gold Plated Necklaces for Women — Pendants & Necklace Sets',
    seoDescription:
      'Adjustable gold and rose-gold plated necklaces and necklace sets for women, ₹399–₹899. Butterfly, floral and hexagon designs. Free shipping over ₹599, 10-day returns, pan-India delivery.',
    filter: (p) => p.category === 'necklace' || p.category === 'set',
    coverSlug: 'hexa-crystal-necklace-set',
  },
  {
    handle: 'earrings',
    title: 'Earrings',
    tagline: 'Studs for the week, statements for the evening',
    description: 'Studs and statement drops, from 1.5 cm to 6.5 cm.',
    intro:
      'Two ends of the same idea: a stud small enough to forget, and a drop large enough to be the only thing you wear.',
    seoTitle: 'Gold Plated Earrings for Women — Studs & Statement Drops',
    seoDescription:
      'Gold plated stud and statement earrings for women from ₹399. Sunburst studs and openwork butterfly wing drops, lightweight for all-day wear. Free shipping over ₹599, pan-India delivery.',
    filter: (p) => p.category === 'earrings',
    coverSlug: 'sunburst-studs',
  },
  {
    handle: 'sets',
    title: 'Sets',
    tagline: 'Necklace and earrings, considered together',
    description: 'Necklace and matching earrings, designed as one piece.',
    intro:
      'A set should echo, not repeat. Both of ours take one motif from the necklace and let the earrings restate it at a different scale.',
    seoTitle: 'Necklace Sets with Matching Earrings — Gold & Rose Gold',
    seoDescription:
      'Necklace sets with matching earrings in gold and rose gold plating, ₹799–₹899. Floral and hexagon crystal designs for weddings, parties and festive wear. 10-day returns.',
    filter: (p) => p.category === 'set',
    coverSlug: 'fleur-crystal-necklace-set',
  },
  {
    handle: 'gifting',
    title: 'Gifting',
    tagline: 'Every piece arrives ready to give',
    description: 'The full range, packaged to be handed over as it arrives.',
    intro:
      'Nothing here needs wrapping. Every order ships in gift-ready packaging, and you can add a handwritten message at checkout at no cost.',
    seoTitle: 'Jewellery Gifts for Her Under ₹1000 — Gift-Ready Packaging',
    seoDescription:
      'Gold plated jewellery gifts for her from ₹399, every piece gift-ready as it ships. Necklaces, earrings and sets for birthdays, anniversaries, Diwali and Raksha Bandhan.',
    filter: () => true,
    coverSlug: 'papillon-pendant-necklace',
  },
  {
    handle: 'new',
    title: 'New Arrivals',
    tagline: 'The most recent additions',
    description: 'Most recently added to the house.',
    intro: 'Newest first. The house is young — this list is still short, and that is honest.',
    seoTitle: 'New Arrivals — Latest Gold Plated Jewellery',
    seoDescription:
      'The newest gold plated necklaces, earrings and sets from Kshyovrata. Fresh designs from ₹399 with free shipping over ₹599 and 10-day returns across India.',
    filter: () => true,
    coverSlug: 'papillon-wing-earrings',
  },
];

/* ========================================================================== */
/* Vocabulary                                                                 */
/* ========================================================================== */

export const OCCASION_LABELS: Record<Occasion, string> = {
  daily: 'Daily',
  office: 'Office',
  party: 'Party',
  wedding: 'Wedding',
  festive: 'Festive',
  gifting: 'Gifting',
};

export const FINISH_LABELS: Record<string, string> = {
  gold: 'Gold',
  'rose-gold': 'Rose Gold',
};

export const MOTIF_LABELS: Record<string, string> = {
  butterfly: 'Butterfly',
  floral: 'Floral',
  geometric: 'Geometric',
  celestial: 'Celestial',
};

export const CATEGORY_LABELS: Record<string, string> = {
  necklace: 'Necklace',
  earrings: 'Earrings',
  set: 'Set',
};

/**
 * The four promises shown on the home page and every PDP.
 *
 * NOTE: the brief's first pillar was "Skin-Friendly". It is replaced with a
 * finish claim we can actually stand behind — see the header of this file.
 */
export const TRUST_PILLARS = [
  {
    mark: 'feather',
    title: 'Lightweight',
    detail: 'Five to twenty grams. Made to be worn all day, not endured.',
  },
  {
    mark: 'skin',
    title: 'Polished, Snag-Free',
    detail: 'Every edge finished by hand so nothing catches on fabric or hair.',
  },
  {
    mark: 'gift',
    title: 'Gift-Ready',
    detail: 'Packaged to be handed over exactly as it arrives.',
  },
  {
    mark: 'return',
    title: '10-Day Returns',
    detail: 'Changed your mind? Send it back within ten days of delivery.',
  },
] as const;

/* ========================================================================== */
/* Queries                                                                    */
/* ========================================================================== */

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getCollection(handle: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.handle === handle);
}

export function getCollectionProducts(handle: string): Product[] {
  const collection = getCollection(handle);
  if (!collection) return [];
  const items = PRODUCTS.filter(collection.filter);
  if (handle === 'new') {
    return [...items].sort((a, b) => b.listedOn.localeCompare(a.listedOn));
  }
  return [...items].sort((a, b) => a.featuredRank - b.featuredRank);
}

export function getFeatured(): Product[] {
  return [...PRODUCTS].sort((a, b) => a.featuredRank - b.featuredRank);
}

export function getRelated(slug: string, limit = 4): Product[] {
  const product = getProductBySlug(slug);
  if (!product) return [];
  const scored = PRODUCTS.filter((p) => p.slug !== slug).map((p) => ({
    p,
    // Prefer a shared motif, then a shared finish, then a shared occasion.
    score:
      (p.motif === product.motif ? 4 : 0) +
      (p.finish === product.finish ? 2 : 0) +
      p.occasions.filter((o) => product.occasions.includes(o)).length,
  }));
  return scored
    .sort((a, b) => b.score - a.score || a.p.featuredRank - b.p.featuredRank)
    .slice(0, limit)
    .map((s) => s.p);
}

export function discountPercent(product: Product): number {
  return Math.round(((product.mrp - product.price) / product.mrp) * 100);
}

/**
 * Every disclosure field the client still owes us (brief §12).
 * Called by scripts/audit-disclosures.mjs and surfaced in the README.
 */
export function auditDisclosureGaps(): { sku: string; title: string; missing: string[] }[] {
  const required = [
    'baseMetal',
    'plating',
    'platingMicrons',
    'stoneType',
    'nickelFree',
    'leadFree',
    'antiTarnish',
    'careInstructions',
  ] as const;

  return PRODUCTS.map((p) => ({
    sku: p.sku,
    title: p.title,
    missing: required.filter((f) => p[f] === null),
  })).filter((r) => r.missing.length > 0);
}
