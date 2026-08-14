/**
 * KSHYOVRATA — single source of truth for site-wide constants.
 *
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │  ⚠  EVERYTHING UNDER `PENDING_CLIENT_DATA` IS A PLACEHOLDER.             │
 * │     It MUST be replaced before the site goes live. Several of these      │
 * │     fields are legally required in India:                                │
 * │       · Consumer Protection (E-Commerce) Rules 2020 — legal entity,      │
 * │         registered address, customer care, named Grievance Officer       │
 * │       · Legal Metrology (Packaged Commodities) Rules — packer name       │
 * │         and address, consumer-care contact                               │
 * │     Nothing here has been invented from thin air beyond the obvious      │
 * │     address shapes; the real values are listed as open questions in      │
 * │     OPEN-QUESTIONS.md and must come from the client.                     │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

export const SITE = {
  name: 'Kshyovrata',
  /** Used in JSON-LD so misspellings still resolve to the brand. */
  alternateNames: ['Kshyovrata Jewellery', 'Kshovrata', 'Kshyovrat', 'Kshyo Vrata'],
  tagline: 'Curated Elegance, Timelessly Yours',
  description:
    'Gold and rose-gold plated fine fashion jewellery, designed in India. Necklaces, earrings and sets from ₹399, every piece gift-ready. Free shipping over ₹599.',
  /** Change once the domain is confirmed — drives canonicals, sitemap and OG. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kshyovrata.com',
  locale: 'en-IN',
  currency: 'INR',
  amazonStorefront: 'https://www.amazon.in/s?k=Kshyovrata',
  instagram: 'https://www.instagram.com/kshyovrata/',
  instagramHandle: '@kshyovrata',
} as const;

/** Supporting lines, rotated through section headers. Brief §1. */
export const SUPPORTING_LINES = [
  'Fine Jewellery · Gifts · Select Finds',
  'Elevated details for every occasion',
  'Every moment. Every detail. Timeless beauty.',
  'Crafted to last. Made to be you.',
] as const;

export const COMMERCE = {
  freeShippingThreshold: 599,
  /** Flat rate below the free-shipping threshold. Confirm against Shiprocket's
   *  actual slab pricing before launch — this is a placeholder business rule. */
  standardShipping: 49,
  returnWindowDays: 10,
  codFee: 49,
  codCap: 2000,
  prepaidDiscount: 20,
  firstOrderDiscountPercent: 10,
  /** Printed on the card inserted into every Amazon parcel. Brief §9. */
  amazonInsertCode: 'AMAZON15',
  amazonInsertDiscountPercent: 15,
} as const;

export const ANNOUNCEMENTS = [
  `Free shipping on orders above ₹${COMMERCE.freeShippingThreshold}`,
  'Gift-ready packaging on every order',
  `Easy ${COMMERCE.returnWindowDays}-day returns`,
] as const;

export const NAV = [
  { label: 'Shop', href: '/shop' },
  { label: 'Necklaces', href: '/collections/necklaces' },
  { label: 'Earrings', href: '/collections/earrings' },
  { label: 'Sets', href: '/collections/sets' },
  { label: 'Gifting', href: '/collections/gifting' },
  { label: 'Journal', href: '/journal' },
] as const;

export const FOOTER_NAV = [
  {
    title: 'Shop',
    links: [
      { label: 'All Jewellery', href: '/shop' },
      { label: 'Necklaces', href: '/collections/necklaces' },
      { label: 'Earrings', href: '/collections/earrings' },
      { label: 'Sets', href: '/collections/sets' },
      { label: 'Gifting', href: '/collections/gifting' },
      { label: 'New Arrivals', href: '/collections/new' },
    ],
  },
  {
    title: 'The House',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'Jewellery Care', href: '/care' },
      { label: 'Size Guide', href: '/size-guide' },
      { label: 'Contact', href: '/contact' },
    ],
  },
  {
    title: 'Help',
    links: [
      { label: 'Track Your Order', href: '/track-order' },
      { label: 'Shipping', href: '/policies/shipping' },
      { label: 'Returns & Refunds', href: '/policies/returns' },
      { label: 'Privacy', href: '/policies/privacy' },
      { label: 'Terms', href: '/policies/terms' },
    ],
  },
] as const;

/* ========================================================================== */
/*  ⚠  PLACEHOLDERS — REPLACE BEFORE LAUNCH                                   */
/* ========================================================================== */

export const PENDING_CLIENT_DATA = {
  /** Registered name of the selling entity. Amazon seller reads SIYA JEWELLER. */
  legalEntity: 'Siya Jeweller',
  /** REQUIRED by the E-Commerce Rules 2020 and Legal Metrology. */
  registeredAddress: '[REGISTERED ADDRESS — PENDING CLIENT]',
  gstin: '[GSTIN — PENDING CLIENT]',
  /** REQUIRED: a *named* individual, not a role mailbox. */
  grievanceOfficerName: '[GRIEVANCE OFFICER NAME — PENDING CLIENT]',
  grievanceOfficerEmail: 'grievance@kshyovrata.com',
  grievanceResponseSlaDays: 3,
  customerCareEmail: 'care@kshyovrata.com',
  customerCarePhone: '[CUSTOMER CARE PHONE — PENDING CLIENT]',
  customerCareHours: 'Monday to Saturday, 10am – 6pm IST',
} as const;

/** True when any legally required field is still a placeholder. */
export function hasUnresolvedLegalData(): boolean {
  return Object.values(PENDING_CLIENT_DATA).some(
    (v) => typeof v === 'string' && v.startsWith('['),
  );
}
