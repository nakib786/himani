# Kshyovrata — E-Commerce Site Build Brief & AI Prompt

**Client:** Kshyovrata (fashion / imitation jewellery, India)
**Prepared:** 13 August 2026
**Current channel:** Amazon.in only (5 live SKUs) · **Goal:** own D2C storefront

> **How to use this file**
> - **Part 1** is the research — everything verified live from Amazon.in and Instagram on 13 Aug 2026. Read it so you know what's real vs. assumed.
> - **Part 2** is the actual build prompt. Copy from `--- BEGIN PROMPT ---` to `--- END PROMPT ---` and paste into Claude Code, Cursor, v0, Lovable, or hand it to a developer as a spec.
> - **Part 3** is raw data (product JSON, image URLs) the builder will need.
> - **Part 4** is the list of things only the client can answer. Get these before launch.

---

# PART 1 — RESEARCH FINDINGS

## 1.1 Brand snapshot

| | |
|---|---|
| **Brand name** | Kshyovrata (Amazon byline: `Brand: Kshyovrata`) |
| **Legal seller** | SIYA JEWELLER — Amazon Seller ID `A1FG3ELIO27VH0` |
| **Manufacturer of record** | Siya Jeweller (4 of 5 SKUs) · "Fashion Jewelry Co." (1 SKU — inconsistent, see §1.5) |
| **Country of origin** | India |
| **Category** | Jewellery › Women › Necklaces / Earrings (fashion / imitation jewellery) |
| **Amazon storefront** | https://www.amazon.in/s?k=Kshyovrata |
| **Instagram** | https://www.instagram.com/kshyovrata/ — 19 followers, 4 posts, 0 following |
| **Age of brand** | First listing went live **28 July 2026**. Newest listing **13 August 2026** (today). Instagram first post **11 Aug 2026**. This is a ~2-week-old brand. |
| **Price band** | ₹399 – ₹899 (MRP ₹699 – ₹1,499) |
| **Reviews / ratings** | **Zero across all 5 SKUs.** No social proof exists yet. |

### Positioning language already in market

From the Instagram bio and creatives — this is the brand's own voice, reuse it:

- `✦ Curated Elegance, Timelessly Yours`
- `Fine Jewellery • Gifts • Select Finds`
- `Elevated details for every occasion`
- `TIMELESS ELEGANCE — Discover signature elegance by Kshyovrata`
- `EVERY MOMENT. EVERY DETAIL. TIMELESS BEAUTY. CRAFTED TO LAST. MADE TO BE YOU.`
- `You can't buy happiness, but you can buy jewellery — and that's pretty close`

From the logo lockup: `KSHYOVRATA` / `— COMMERCE • TRUST • GROWTH —`

⚠️ **Tension to resolve:** the logo tagline *"Commerce • Trust • Growth"* reads corporate/B2B. The Instagram voice *"Curated Elegance, Timelessly Yours"* reads luxury D2C and matches the product. **Recommendation: lead the website with the Instagram positioning.** Keep "Commerce • Trust • Growth" only inside the logo mark itself (and optionally on an About/corporate page), never as the site's hero headline.

### Logo & visual identity (from supplied asset)

- **Monogram:** interlocked `K H M` serif letterforms overlaid on two thin crescent arcs
- **Celestial motifs:** small crescent moon + scattered stars (upper right), a rising **sunburst** (lower centre)
- **Wordmark:** high-contrast Didone/transitional serif, all-caps, very wide letterspacing (~0.25em)
- **Strapline:** `— COMMERCE • TRUST • GROWTH —` in light letterspaced sans/serif caps with flanking rules
- **Palette:** pure black on white. Strictly monochrome. No colour anywhere in the identity.

The celestial motif set (moon · stars · sun) is a genuine asset — it maps directly onto the product line (**Sunburst** studs, **Butterfly** wing pieces) and gives the site a repeatable decorative language. Use it.

---

## 1.2 Live Amazon catalogue — all 5 SKUs

| # | Product | ASIN | Price | MRP | Disc | SKU code | Listed | Wt |
|---|---|---|---|---|---|---|---|---|
| 1 | Gold Plated **Butterfly Pendant Necklace** | `B0HBZNHDBL` | ₹399 | ₹699 | 43% | `BUTTERFLY-001` | 28 Jul 2026 | 5 g |
| 2 | Rose Gold **Hexagon Crystal Necklace Set** | `B0HCR3QVJJ` | ₹899 | ₹1,499 | 40% | `JS-GP-001` | 3 Aug 2026 | 20 g |
| 3 | Gold-Plated **Butterfly Wing Statement Earrings** | `B0HF41FLT6` | ₹399 | ₹799 | 50% | `KSH-BE-001` | 13 Aug 2026 | 5 g |
| 4 | Gold Plated **Floral Crystal Necklace Set** | `B0HCRFQG5B` | ₹799 | ₹1,299 | 38% | `JS-GP-002` | 3 Aug 2026 | 20 g |
| 5 | Gold **Sunburst Stud Earrings** | `B0HDCRYMVH` | ₹399 | ₹899 | 56% | `Gse-001` | 7 Aug 2026 | 5 g |

**Category split:** 3 necklaces (2 of which are sets with matching earrings) + 2 earrings.
**Finish split:** 4 gold-plated + 1 rose-gold-plated.
**Motif split:** 2 butterfly · 1 hexagon/geometric · 1 floral · 1 sunburst/celestial.

Full titles, bullets, descriptions and image URLs for every SKU are in **Part 3**.

### Recurring product claims (consistent across the catalogue — these become the site's trust pillars)

Every listing repeats the same five promises. Turn these into a reusable icon row / product-page module:

1. **Lightweight** — comfortable for all-day wear
2. **Skin-friendly** — no irritation
3. **Premium polished finish** — gold / rose-gold plated
4. **Versatile** — pairs with both ethnic and western outfits
5. **Gift-ready** — packaged for gifting; birthdays, anniversaries, Valentine's, Diwali, Raksha Bandhan

Occasion vocabulary used repeatedly: *daily wear, office, party, wedding, festive, brunch, date night, anniversary, birthday*. These are ready-made collection filters.

---

## 1.3 Instagram findings

- Handle `@kshyovrata` — **19 followers, 4 posts, launched 11 Aug 2026**. Effectively zero audience.
- Bio link currently points to the **Amazon search URL** (`www.amazon.in/s?k=Kshyovrata`) — not a storefront, not a brand page. **This should become the new site's homepage on launch day.**
- Content mix so far: 2 static posts + 2 Reels. Themes are typographic brand cards ("TIMELESS ELEGANCE", "EVERY MOMENT. EVERY DETAIL.") and quote cards, plus product/model shots (jewellery, makeup, rings, bangles).
- Creative style is consistent with the logo: black-and-white typography, serif, celestial framing.
- ⚠️ Some Reel overlays show the wordmark stuttering/duplicating (`KSHYOVRATA KSHYOV RAT`) — likely an animation artefact. Worth a note to whoever makes the creatives.

**Implication for the site:** there is no traffic to inherit. The site cannot depend on social. It must be built to win **Google search** and to convert **paid traffic and Amazon-package inserts** from day one.

---

## 1.4 Competitive context (Amazon "related products" observed on the listings)

Direct shelf competitors surfacing against these SKUs: **YouBella, ACCESSHER, MEENAZ, SALTY, SANNIDHI, Elina, EziKart.**

Their pricing on comparable butterfly/pendant pieces: **₹179 – ₹499**, with discounts advertised at **70–89% off MRP**, and review counts in the **hundreds to 1,145+**.

**What this means:**
- Kshyovrata at ₹399–₹899 sits at the **upper end** of this shelf while having **zero reviews**. On Amazon that is a hard place to be.
- Competing on discount depth is a losing game — they're already at 89% off.
- The D2C site is therefore the **strategically correct move**: it's where brand, story, packaging, photography and repeat-purchase economics can justify the price. **The site must look meaningfully more premium than the Amazon shelf.** That is its entire job.

---

## 1.5 Problems found in the current listings — fix these before/while porting to the site

These are real defects found in the live Amazon data. Do **not** copy them across.

| # | Issue | Where | Fix |
|---|---|---|---|
| 1 | Product description contains raw prompt/tooling artefacts — the literal text *"Gold Sunburst Stud Earrings for Women & Girls – Amazon SEO Product Description"* and unrendered markdown `**bold**` markers | SKU 5 `B0HDCRYMVH` | Rewrite clean. Fix on Amazon too. |
| 2 | Manufacturer listed as **"Fashion Jewelry Co."** instead of Siya Jeweller; Packer shown as *"Contact Packer For Details"* | SKU 5 `B0HDCRYMVH` | Legal Metrology requires a real packer name & address. Correct on Amazon. |
| 3 | **No material is stated anywhere** on any SKU — no "brass", "alloy", "stainless steel", "cubic zirconia", no plating micron thickness | All 5 | Critical. See below. |
| 4 | "Skin-friendly" claimed but **no nickel-free / lead-free / hypoallergenic / anti-tarnish** substantiation | All 5 | Either substantiate or soften the claim. |
| 5 | Earrings listed as `Net Quantity: 2.0 Pack` | SKUs 3, 5 | Should read "1 Pair". Confusing at a glance. |
| 6 | SKU codes are inconsistent: `BUTTERFLY-001`, `JS-GP-001`, `KSH-BE-001`, `Gse-001` | All | Adopt one scheme before the site's catalogue is built. Proposed in the prompt. |
| 7 | Inconsistent brand prefix in titles — some start "Kshyovrata", some "KSHYOVRATA", two start with no brand at all | All 5 | Every site title leads with the brand. |
| 8 | Zero reviews, zero UGC | All 5 | Review-capture flow is a launch requirement, not a phase-2 nicety. |

**On #3 (material) — this is the single biggest gap.** For jewellery D2C in India, shoppers filter on material and tarnish resistance. Missing specs kill conversion and drive returns. The client must supply, per SKU: base metal, plating type + thickness, stone type, nickel/lead status, and care instructions. The site build should treat these as required catalogue fields.

---

# PART 2 — THE BUILD PROMPT

Copy everything between the markers.

--- BEGIN PROMPT ---

## Project

Design and build the D2C e-commerce website for **Kshyovrata**, an Indian fashion-jewellery brand currently selling only on Amazon.in. The site launches with 5 SKUs, must look meaningfully more premium than the Amazon marketplace shelf it's escaping, and must be architected to scale to 100+ SKUs without a rebuild.

**Primary market:** India. Currency ₹ INR. Ship pan-India. Plan for NRI/international as a later phase.
**Primary device:** mobile (assume 75%+ of traffic). Design mobile-first, then desktop.

---

## 1. Brand & positioning

**Name:** Kshyovrata
**Lead positioning (use this everywhere):** *Curated Elegance, Timelessly Yours*
**Supporting lines (rotate in hero/section headers):**
- Fine Jewellery • Gifts • Select Finds
- Elevated details for every occasion
- Every moment. Every detail. Timeless beauty.
- Crafted to last. Made to be you.

**Do NOT** use "Commerce • Trust • Growth" as a site headline — it's part of the logo lockup only, and reads corporate rather than luxury. It may appear inside the logo image and optionally on the About page.

**Brand character:** understated luxury, celestial, feminine, minimal. Think Mejuri / Ana Luisa / Giva rather than a marketplace jewellery seller. Restraint over decoration. Whitespace is the primary design material.

**Audience:** women 18–35 in Indian metros and tier-2 cities. Buying for themselves for daily/office/party wear, and buying as gifts. Price-sensitive but aspirational — they want pieces that *look* far more expensive than ₹399–₹899.

---

## 2. Design system

Derive everything from the supplied logo (black serif monogram `KHM` over thin crescent arcs, with a crescent moon, scattered stars, and a rising sunburst; wide-letterspaced `KSHYOVRATA` wordmark).

### Colour — strictly monochrome + one warm metallic accent

```
--ink:        #0A0A0A   /* primary text, logo, buttons */
--ink-soft:   #4A4A4A   /* secondary text */
--ink-mute:   #8A8A8A   /* captions, meta, disabled */
--paper:      #FFFFFF   /* product imagery background, cards */
--bone:       #FAF8F5   /* page background — warm off-white, NOT pure white */
--line:       #E8E4DE   /* hairline rules, dividers, borders */
--gold:       #B8975A   /* accent ONLY: sale price, sunburst motif, hover underline */
--gold-soft:  #EDE3D0   /* accent wash for badges/backgrounds */
--success:    #2E6B4F
--error:      #A63A2E
```

Rules: gold is an accent, never a fill for large areas. Never introduce a second colour. Never use pure `#000` on pure `#FFF` for body copy — use `--ink` on `--bone`.

### Typography

- **Display / headings:** a high-contrast Didone-adjacent serif — **Cormorant Garamond** or **Playfair Display**. Headings in ALL CAPS with `letter-spacing: 0.18em–0.25em` to echo the wordmark. Light weights (300/400) at large sizes.
- **Body / UI:** a quiet geometric or neutral sans — **Jost**, **Inter**, or **Karla**. Weight 300–400. `letter-spacing: 0.02em`.
- **Prices:** body sans, tabular figures.
- Load via `next/font` (self-hosted, no CDN). Max 2 families, 3 weights total.

### Motifs & decoration

Build a small reusable SVG set extracted from the logo language and use it as the site's connective tissue:
- **Thin crescent arc** — section dividers, hero framing, card corners
- **Crescent moon + stars** — empty states, loading, "new arrival" badge, footer flourish
- **Sunburst rays** — bestseller badge, the Sunburst product's own PDP, order-confirmation success state
- **Hairline rules with a centred dot** (`— • —`) — the logo's strapline device; use as the standard section separator

All motifs: `stroke: currentColor`, `stroke-width: 1`, no fills. Both themes.

### Layout & motion

- Generous whitespace. Section padding: `96px` mobile / `160px` desktop.
- Max content width `1280px`; editorial text blocks max `65ch`.
- Product grid: 2-up mobile, 3-up tablet, 4-up desktop. Portrait 4:5 image ratio.
- Motion: slow and minimal — `400–600ms`, `cubic-bezier(0.16, 1, 0.3, 1)`. Fade-and-rise on scroll. No bounce, no parallax, no carousel auto-advance faster than 6s. Respect `prefers-reduced-motion`.
- Buttons: sharp or 2px radius only. Primary = solid `--ink`, white caps text, letterspaced. Secondary = 1px `--ink` outline. No shadows, no gradients.

---

## 3. Information architecture

```
/                          Home
/shop                      All products (filter + sort)
/collections/necklaces
/collections/earrings
/collections/sets          (the 2 necklace+earring sets)
/collections/gifting       (gift-ready framing — every SKU qualifies)
/collections/new           (recency-sorted)
/product/[slug]            PDP
/cart
/checkout                  (multi-step or provider-hosted)
/order/[id]                Order confirmation + tracking
/account                   Login, orders, addresses, wishlist
/about                     Brand story
/care                      Jewellery care & material guide
/size-guide                Chain lengths, earring dimensions
/contact
/track-order               Guest order tracking by order ID + phone
/journal                   Blog (SEO engine — see §8)
/policies/shipping
/policies/returns
/policies/privacy
/policies/terms
/policies/refunds
```

**Navigation (sticky, transparent over hero, solid on scroll):**
`SHOP` · `NECKLACES` · `EARRINGS` · `SETS` · `GIFTING` · `JOURNAL` — with logo centred on desktop, hamburger + centred logo + cart on mobile.
Right side: search · account · cart (with item-count badge).

**Announcement bar** above nav, dismissible, rotating:
`Free shipping on orders above ₹599` · `Gift-ready packaging on every order` · `Easy 10-day returns`

---

## 4. Page-by-page requirements

### Home
1. **Hero** — full-bleed lifestyle image or a typographic hero on `--bone` with the crescent-arc motif. Headline: *Curated Elegance, Timelessly Yours*. Single CTA: `SHOP THE COLLECTION`.
2. **Trust strip** — 4 hairline-separated items with motif icons: `Skin-Friendly` · `Lightweight, All-Day Wear` · `Gift-Ready Packaging` · `10-Day Easy Returns`
3. **Shop by category** — 3 editorial tiles: Necklaces / Earrings / Sets.
4. **Featured products** — 4-up grid, the full catalogue.
5. **Shop by occasion** — Daily & Office · Party & Festive · Wedding · Gifting. (Taken directly from the brand's own occasion vocabulary.)
6. **Brand story block** — short, image-left/text-right. Links to `/about`.
7. **Instagram strip** — 4–6 tiles linking to `@kshyovrata`. *Build this as a component that gracefully hides when the feed is empty or the account has fewer than 6 posts — it currently has 4.*
8. **Newsletter** — email capture, offer 10% off first order. Single field + submit, no modal on first visit (modal only on exit-intent after 20s).

### Product listing (`/shop`, `/collections/*`)
- Filters: Category · Price · Finish (Gold / Rose Gold) · Occasion · Motif (Butterfly / Floral / Geometric / Celestial)
- Sort: Featured · Price ↑ · Price ↓ · Newest
- Card: portrait image with hover-swap to second image, brand-cased title, price with strikethrough MRP + `-43%` in `--gold`, quick-add on hover (desktop only).
- Filters must be URL-driven (`?finish=gold&sort=price-asc`) so they're shareable and indexable.

### Product detail page (PDP)
Left/top — gallery: 5–7 images, zoom on hover (desktop), swipe (mobile), thumbnail rail. Support video slot.

Right/bottom:
- Brand eyebrow `KSHYOVRATA`
- H1 product title
- Price, MRP strikethrough, discount %, `Inclusive of all taxes`
- Rating (hide entirely until first review exists — do not render an empty 5-star skeleton)
- `ADD TO CART` (primary) + `BUY NOW` (secondary)
- Delivery estimator: pincode input → estimated delivery date + COD availability
- Accordion sections:
  - **Details** — the 5 marketing bullets
  - **Materials & Specifications** — base metal, plating, plating thickness, stone, weight, dimensions, nickel-free status, country of origin, SKU *(client to supply — see §12)*
  - **Care Instructions**
  - **Shipping & Returns**
- Trust icon row (same 4 as home)
- **Gift options** — checkbox for gift wrap + gift message textarea
- **Complete the look** — for necklace sets, cross-sell the matching earrings; for singles, cross-sell the set
- **You may also like** — 4 products
- Reviews section with photo upload; empty state reads *"Be the first to review this piece"* — never fake reviews or seed placeholder ratings.

### Cart & checkout
- Slide-over cart drawer (not a separate page) with free-shipping progress bar toward ₹599.
- Checkout: guest checkout **on by default**; account optional. Steps: Contact → Address → Delivery → Payment.
- Address form with **pincode auto-fill** for city/state.
- Order summary always visible; show GST-inclusive pricing.

---

## 5. Commerce platform & stack

**Recommended (primary):**
- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS v4
- **Commerce backend:** **Shopify Basic** used headlessly via the Storefront API
- **Hosting:** Vercel
- **Images:** Shopify CDN via `next/image`, AVIF/WebP, blur placeholders

*Why:* Shopify handles inventory, orders, tax, payments, and abandoned-cart natively so a non-technical owner can run the shop, while Next.js delivers the couture front end that Shopify themes can't. Total ops cost stays low with 5 SKUs.

**Acceptable alternatives** if the client prefers zero-code ops: a heavily customised **Shopify Dawn** theme, or **Wix Studio Stores**. Both are lower ceiling on design — note the trade-off rather than silently accepting it.

**India-specific integrations (all required):**
- **Payments: Razorpay** — UPI, cards, netbanking, wallets, EMI. UPI must be the visually first option; it dominates Indian checkout.
- **COD** — non-negotiable for this category and price band. Mitigate RTO with: ₹49 non-refundable COD fee OR ₹20 prepaid discount, an OTP/WhatsApp order confirmation step, and a COD cap of ₹2,000.
- **Shipping: Shiprocket** (aggregates Delhivery, Bluedart, Ecom Express) — rate calc, label generation, tracking webhooks.
- **Notifications: WhatsApp Business API** (via Interakt/Wati/Gupshup) for order confirmation, shipping, delivery, and abandoned-cart. In India WhatsApp outperforms email dramatically.
- **Email:** Resend or Shopify Email for receipts and newsletter.
- **Analytics:** GA4 + Meta Pixel + Google Merchant Center feed.

---

## 6. Data model

Build the catalogue with these fields, even where data is currently missing — leave them nullable and surface them in the CMS/admin so the client can fill them in:

```ts
type Product = {
  slug: string;
  sku: string;              // see naming scheme below
  asin?: string;            // preserve the Amazon ASIN for reconciliation
  title: string;            // site title, always leads with the brand
  amazonTitle: string;      // keyword-stuffed original, kept for reference only
  shortDescription: string;
  longDescription: string;
  bullets: string[];        // the 5 marketing claims
  category: 'necklace' | 'earrings' | 'set';
  finish: 'gold' | 'rose-gold';
  motif: 'butterfly' | 'floral' | 'geometric' | 'celestial';
  occasions: string[];      // daily, office, party, wedding, festive, gifting
  price: number;            // INR
  mrp: number;              // INR
  images: { url: string; alt: string; }[];
  weightGrams: number;
  dimensions: { l: number; w: number; h: number; unit: 'mm' | 'cm' };
  includedComponents: string[];

  // REQUIRED FIELDS — currently missing from all Amazon data, client must supply
  baseMetal: string | null;         // e.g. "Brass alloy"
  plating: string | null;           // e.g. "18K gold plating"
  platingMicrons: number | null;
  stoneType: string | null;         // e.g. "Cubic zirconia"
  nickelFree: boolean | null;
  leadFree: boolean | null;
  antiTarnish: boolean | null;
  careInstructions: string | null;

  hsnCode: string;          // imitation jewellery — confirm with client's CA
  countryOfOrigin: 'India';
  inStock: boolean;
  isNew: boolean;
};
```

**Adopt a single SKU scheme** (the current ones are inconsistent):
`KSH-<CAT>-<MOTIF>-<NNN>` → e.g. `KSH-NCK-BFY-001`, `KSH-EAR-SUN-001`, `KSH-SET-HEX-001`.
Keep a mapping table to the old codes (`BUTTERFLY-001`, `JS-GP-001`, `JS-GP-002`, `KSH-BE-001`, `Gse-001`) and to ASINs.

---

## 7. Product content — rewrite, don't copy-paste

The Amazon copy is keyword-stuffed for marketplace search and reads badly on a brand site. Rewrite every title and description in the brand voice while keeping the factual claims.

**Title pattern:** `<Motif> <Type>` — short, evocative, human.
- `Gold Plated Butterfly Pendant Necklace for Women & Girls, Adjustable Chain, Lightweight, Skin-Friendly, Minimalist Open Butterfly Design, Premium Polished Finish, Fashion Jewellery Gift` → **"Papillon Pendant Necklace"** or **"Butterfly Outline Pendant"**
- `Gold Sunburst Stud Earrings...Korean Style Minimalist...` → **"Sunburst Studs"**
- `Rose Gold Plated Geometric Hexagon Crystal Necklace Set...` → **"Hexa Crystal Necklace Set"**
- `Gold Plated Floral Crystal Necklace Set...` → **"Fleur Crystal Necklace Set"**
- `Gold-Plated Butterfly Wing Statement Earrings...` → **"Butterfly Wing Statement Earrings"**

Keep the SEO-heavy phrasing in `<meta>` tags and structured data, not in the visible H1.

**Three defects in the source copy must be fixed and not carried over:**
1. SKU `B0HDCRYMVH` description contains the literal string *"Amazon SEO Product Description"* and unrendered `**` markdown. Rewrite from scratch.
2. Earring quantity reads `2.0 Pack` — render as **"1 Pair"**.
3. `B0HDCRYMVH` lists manufacturer as "Fashion Jewelry Co." while every other SKU says "Siya Jeweller". Use one consistent manufacturer of record.

---

## 8. SEO — this is the highest-stakes part of the build

The brand has **no domain authority, no backlinks, no reviews, and a name almost nobody can spell**. Organic search will not arrive by accident.

**Technical:**
- SSG/ISR for all product and collection pages
- `Product`, `Offer`, `AggregateRating` (once reviews exist), `BreadcrumbList`, `Organization`, `WebSite` + `SearchAction` JSON-LD
- Unique title/meta/OG per page; OG image generated per product
- `sitemap.xml`, `robots.txt`, canonical URLs, `hreflang` ready for `en-IN`
- Core Web Vitals targets: **LCP < 2.0s, CLS < 0.05, INP < 200ms** on 4G mobile
- Google Merchant Center product feed for Shopping/Free Listings

**Brand-name handling (important):** "Kshyovrata" is hard to spell and will be mistyped. Handle explicitly:
- Add a pronunciation line on `/about`
- Add `Organization.alternateName` in JSON-LD
- Buy and 301-redirect likely misspell domains (`kshyovrata.com`, `.in`, `kshovrata.com`, `kshyovrat.com`)
- Target the descriptive queries people actually type: *butterfly pendant necklace India*, *rose gold necklace set under 1000*, *sunburst stud earrings*, *gold plated jewellery gift for her*

**`/journal` content plan** — 8 launch posts targeting real Indian search demand:
1. How to Style a Butterfly Pendant — Ethnic and Western
2. Gold vs Rose Gold: Which Suits Your Skin Tone?
3. How to Keep Gold-Plated Jewellery from Tarnishing
4. Jewellery Gifts Under ₹1000 That Don't Look Cheap
5. Everyday Office Jewellery: The 5-Piece Capsule
6. What "Skin-Friendly" Actually Means in Fashion Jewellery
7. Chain Length Guide for Indian Necklines
8. Festive Jewellery Edit: Diwali, Karwa Chauth, Raksha Bandhan

---

## 9. Amazon → D2C migration strategy

Build these mechanisms into the site; they are the bridge off the marketplace.

- **Keep both channels live.** Amazon is discovery, the site is margin. Do not delist.
- **Package insert** — every Amazon order ships with a card: QR to the site + *"15% off your next order at kshyovrata.com — code AMAZON15"*. Build the coupon.
- **Site-exclusive incentive** — first-order 10% off, free shipping above ₹599, gift wrap free on site (paid or unavailable on Amazon).
- **Price parity, value differential** — hold the same headline prices, but make the site the better deal via bundling, gifting, and free shipping. Never undercut Amazon's listed price directly (it damages the Amazon Buy Box).
- **Site-exclusive SKUs** — reserve new launches for the site for 2–4 weeks before they hit Amazon. Build a `siteExclusive: boolean` flag and an `EXCLUSIVE` badge.
- **Reviews** — post-delivery WhatsApp + email asking for a photo review with a ₹100 credit incentive. This is the top priority post-launch; the catalogue currently has **zero reviews anywhere**.
- Keep `asin` on every product so Amazon and site sales can be reconciled in one report.

---

## 10. India legal & compliance (must ship with the site)

- **Consumer Protection (E-Commerce) Rules, 2020** — display legal entity name, registered address, customer-care contact, and a named **Grievance Officer** with email and response SLA. Put these in the footer and on `/contact`.
- **Legal Metrology (Packaged Commodities) Rules** — per product, display: manufacturer/packer name & address, net quantity, MRP inclusive of all taxes, month/year of manufacture, consumer-care contact.
- **GST** — display prices inclusive of tax with an `Inclusive of all taxes` note. Store an HSN code per product (imitation jewellery falls under **HSN 7117** — *confirm the applicable rate with the client's CA before launch; do not hard-code an assumed rate*). Offer GST invoice capture at checkout for business buyers.
- **Policies** — Shipping, Returns/Refunds (match or beat Amazon's 10-day window), Privacy, Terms. Written in plain English, linked in the footer and at checkout.
- **DPDP Act 2023** — cookie consent banner defaulting to essential-only, a privacy policy covering data collection/retention, and a data-deletion request path.
- **Accessibility** — WCAG 2.1 AA: 4.5:1 contrast (verify the `--gold` accent against `--bone` and darken if it fails), full keyboard navigation, visible focus rings, alt text on every product image, labelled forms.

---

## 11. Build phases

**Phase 1 — Launch (weeks 1–4)**
Home, Shop, 5 PDPs, cart, Razorpay + COD checkout, Shiprocket, all policy pages, WhatsApp order notifications, GA4 + Pixel, `/about`, `/care`, `/contact`, `/track-order`.

**Phase 2 — Growth (weeks 5–8)**
Accounts + order history, wishlist, reviews with photos, `/journal` + first 8 posts, abandoned-cart recovery, newsletter automation, Instagram feed, Merchant Center feed, gift wrap + gift messaging.

**Phase 3 — Scale (months 3–6)**
Gift cards, bundles & "shop the set", loyalty/referral, size/chain-length guide with visual comparison, Hindi language toggle, international shipping for NRI, subscription/drop model if the range expands.

---

## 12. Blockers — data the client must supply before launch

Do not invent values for these. Flag them, build the fields, leave them empty, and chase the client:

1. **Materials per SKU** — base metal, plating type, plating thickness (microns), stone type
2. **Nickel-free / lead-free / hypoallergenic status** — currently "skin-friendly" is claimed with nothing behind it
3. **Anti-tarnish treatment** — yes/no, and expected plating life
4. **Care instructions** — official brand version
5. **Legal entity details** — registered name, address, GSTIN, HSN code confirmation, grievance officer name/email
6. **Domain** — confirm `kshyovrata.com` availability and purchase misspell variants
7. **Photography** — the Amazon images are usable but are marketplace-grade. Budget for a proper shoot: model/lifestyle shots, macro detail, packaging, and a flat-lay set on `--bone`. The site's premium positioning depends on this more than on any code.
8. **Packaging photos** — "gift-ready packaging" is claimed on every listing but never shown
9. **Brand story** — founder, origin, meaning and pronunciation of "Kshyovrata". The name looks Sanskrit-derived; if it has a real meaning it is a strong story asset and should anchor `/about`. Get the actual answer — do not fabricate an etymology.
10. **Return/refund window** — confirm the site policy (recommend matching Amazon's 10 days minimum)

---

## 13. Assets

- **Logo:** supplied — black serif `KHM` monogram over crescent arcs with moon, stars, and sunburst; wordmark `KSHYOVRATA` above `— COMMERCE • TRUST • GROWTH —`. Produce SVG, plus horizontal / stacked / monogram-only / favicon lockups, and a white knockout version.
- **Product images:** currently on Amazon's CDN. Hi-res URLs are listed in the appendix of the brief. **Download and re-host** — do not hotlink Amazon's CDN in production.
- **Instagram:** https://www.instagram.com/kshyovrata/ (4 posts as of 13 Aug 2026 — the feed component must handle a sparse feed gracefully)

---

## Deliverables

1. Working Next.js application, fully responsive, all Phase 1 pages
2. Complete design system as Tailwind tokens + documented components
3. Product catalogue seeded with all 5 SKUs (rewritten copy, images re-hosted)
4. Working checkout — Razorpay + COD, integrated with Shiprocket
5. All compliance pages populated with real client data
6. Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO (mobile)
7. A README covering how to add a product, change prices, and run a sale — written for a non-technical owner
8. A written list of every field left empty pending client input (§12)

--- END PROMPT ---

---

# PART 3 — RAW PRODUCT DATA

All data verified live on amazon.in, 13 August 2026.

> **Image URLs:** Amazon serves size variants via a suffix. Replace the suffix with `._SL1600_.jpg` for the largest available version — e.g.
> `https://m.media-amazon.com/images/I/31F9K9SjsSL._SL1600_.jpg`
> **Re-host these. Do not hotlink Amazon's CDN in production.**

---

### 1. Gold Plated Butterfly Pendant Necklace

- **ASIN:** `B0HBZNHDBL` · **SKU:** `BUTTERFLY-001` · **Listed:** 28 Jul 2026
- **Price:** ₹399 (MRP ₹699, −43%)
- **URL:** https://www.amazon.in/dp/B0HBZNHDBL
- **Specs:** 2.5 × 2.5 × 0.3 cm · 5 g · 1 Count · Generic name: Pendant Necklace · Origin: India · Mfr/Packer: Siya Jeweller

**Full Amazon title:**
> Kshyovrata Gold Plated Butterfly Pendant Necklace for Women & Girls, Adjustable Chain, Lightweight, Skin-Friendly, Minimalist Open Butterfly Design, Premium Polished Finish, Fashion Jewellery Gift

**Bullets:**
- ELEGANT BUTTERFLY PENDANT: Features a sleek open-outline butterfly design with a smooth, polished gold-plated finish for a modern minimalist look.
- ADJUSTABLE CHAIN: Comes with a delicate box-link chain that can be adjusted to suit your preferred neckline length for a comfortable, personalised fit.
- SKIN-FRIENDLY AND LIGHTWEIGHT: Crafted with skin-safe materials and a feather-light construction, making it comfortable for all-day everyday wear.
- VERSATILE STYLING: Pairs effortlessly with casual, office, and festive outfits, suitable for both daily wear and special occasions like parties and celebrations.
- PERFECT GIFT CHOICE: Presented in a gift-ready packaging, this timeless fashion jewellery piece is an ideal gift for women and girls on birthdays, anniversaries, and Valentine's Day.

**Image IDs:** `51en2ljOZLL` (main) · `31F9K9SjsSL` · `416NHfcglpL` · `41Hdz7i7CCL` · `41zUAlZsnpL` · `41It2m60ISL` · `41N5J40DJeL` · `51QpPUMfYiL`

---

### 2. Rose Gold Plated Geometric Hexagon Crystal Necklace Set

- **ASIN:** `B0HCR3QVJJ` · **SKU:** `JS-GP-001` · **Listed:** 3 Aug 2026
- **Price:** ₹899 (MRP ₹1,499, −40%)
- **URL:** https://www.amazon.in/dp/B0HCR3QVJJ
- **Specs:** 15 × 15 × 3.5 cm · 20 g · 1 Count · Includes: 1 Pendant Necklace + 1 Pair Earrings · Generic name: Jewelry Set

**Full Amazon title:**
> Rose Gold Plated Geometric Hexagon Crystal Necklace Set for Women & Girls | Adjustable Slider Chain with Matching Drop Earrings | Lightweight Fashion Jewellery for Party, Office & Daily Wear

**Bullets:**
- ELEGANT HEXAGON DESIGN: Features open geometric hexagon links adorned with sparkling crystal accents in a stunning rose gold plated finish.
- ADJUSTABLE SLIDER CHAIN: The necklace comes with a convenient slider chain closure, allowing you to customise the fit for a comfortable and secure wear.
- COMPLETE JEWELLERY SET: Includes a matching pair of drop earrings with hexagon and circle motifs, creating a coordinated and polished look.
- LIGHTWEIGHT & SKIN FRIENDLY: Crafted with a lightweight construction and premium finish, this set is comfortable for all-day wear without causing irritation.
- VERSATILE OCCASION WEAR: Suitable for daily wear, office, parties, weddings, and festive occasions; pairs beautifully with both ethnic and western outfits.

**Image IDs:** `61XwjeudfhL` (main) · `41J3mUKCrAL` · `41QCBuV-NmL` · `41L8Z0H3IaL` · `41oZNrgxMUL` · `41pso2bUwuL` · `51EnSUst6HL`

---

### 3. Gold-Plated Butterfly Wing Statement Earrings

- **ASIN:** `B0HF41FLT6` · **SKU:** `KSH-BE-001` · **Listed:** 13 Aug 2026 *(newest)*
- **Price:** ₹399 (MRP ₹799, −50%)
- **URL:** https://www.amazon.in/dp/B0HF41FLT6
- **Specs:** 1 × 3.5 × 6.5 cm · 5 g · listed as "2.0 Pack" (= 1 pair) · Generic name: Stud Earrings

**Full Amazon title:**
> KSHYOVRATA Gold-Plated Butterfly Wing Statement Earrings for Women and Girls, Elegant Lightweight Trendy Fashion Jewellery for Party, Wedding, Festive and Special Occasion Wear

**Bullets:**
- ELEGANT BUTTERFLY DESIGN: These stunning statement earrings feature an intricate openwork wing pattern inspired by butterfly wings, crafted with a luxurious polished gold-tone finish.
- LIGHTWEIGHT & COMFORTABLE: The delicate cut-out design creates an airy, skin-friendly feel, making these earrings comfortable enough for all-day wear without weighing down your ears.
- VERSATILE STYLING: Perfect for both ethnic and western outfits, these earrings effortlessly elevate your look for parties, weddings, festive occasions, date nights, and everyday fashion.
- SECURE CLOSURE: Designed with a reliable secure closure to keep the earrings firmly in place throughout the day, ensuring worry-free wear at any occasion.
- IDEAL GIFT CHOICE: A thoughtful and beautiful gift for women and girls on birthdays, anniversaries, festivals, and other special occasions, presented in an elegant style.

**Image IDs:** `61otXTWZ8KL` (main) · `41i6b-Fd3xL` · `41NJLbRK4ZL` · `41bThdq8pHL` · `41Jig0SjxPL` · `515kqP+15lL`

---

### 4. Gold Plated Floral Crystal Necklace Set

- **ASIN:** `B0HCRFQG5B` · **SKU:** `JS-GP-002` · **Listed:** 3 Aug 2026
- **Price:** ₹799 (MRP ₹1,299, −38%)
- **URL:** https://www.amazon.in/dp/B0HCRFQG5B
- **Specs:** 45 × 15 × 2.5 cm · 20 g · Includes: 1 Pendant Necklace + 1 Pair Stud Earrings · Generic name: Jewelry Set

**Full Amazon title:**
> Gold Plated Floral Crystal Necklace Set for Women & Girls with Matching Stud Earrings | Elegant Flower Design Pendant Necklace | Lightweight Fashion Jewellery for Party, Wedding & Daily Wear

**Bullets:**
- ELEGANT FLORAL DESIGN: Features beautiful flower-inspired motifs with sparkling crystal accents and a polished gold finish for a graceful, eye-catching look.
- COMPLETE JEWELLERY SET: Includes a stunning multi-flower necklace and a pair of matching floral stud earrings, offering a perfectly coordinated ensemble.
- LIGHTWEIGHT & COMFORTABLE: Crafted with a lightweight construction and skin-friendly materials, ensuring all-day comfort whether worn at work or special occasions.
- VERSATILE STYLING: Complements both ethnic and western outfits, making it ideal for weddings, parties, festivals, anniversaries, birthdays, and everyday wear.
- THOUGHTFUL GIFT CHOICE: A graceful and stylish gift option for women, girls, bridesmaids, and loved ones on any special occasion.

*(No long description present on this listing — one must be written.)*

**Image IDs:** `61a7sZhTv8L` (main) · `41KyDHW32SL` · `41mbKfNBl9L` · `41PZywpSvOL` · `41opBfpzmnL` · `51Xds2nkaSL` · `51fmAwcr0vL`

---

### 5. Gold Sunburst Stud Earrings

- **ASIN:** `B0HDCRYMVH` · **SKU:** `Gse-001` · **Listed:** 7 Aug 2026
- **Price:** ₹399 (MRP ₹899, −56%)
- **URL:** https://www.amazon.in/dp/B0HDCRYMVH
- **Specs:** 1.5 × 1.5 × 1.5 cm · 5 g · "2.0 Pack" (= 1 pair) · Generic name: Stud Earrings
- ⚠️ **Manufacturer listed as "Fashion Jewelry Co." · Packer: "Contact Packer For Details"** — inconsistent with the other 4 SKUs and non-compliant with Legal Metrology labelling.
- ⚠️ **Description contains the literal phrase "Amazon SEO Product Description" and unrendered `**` markdown.** Must be rewritten on both Amazon and the site.

**Full Amazon title:**
> Gold Sunburst Stud Earrings for Women & Girls, Trendy Statement Sun Shape Earrings, Lightweight Fashion Jewelry, Korean Style Minimalist Gold Plated Earrings for Party, Casual & Daily Wear, Gift

**Bullets:**
- ELEGANT SUNBURST DESIGN: These gold stud earrings feature a unique radiant sun design with a premium polished finish.
- LIGHTWEIGHT & COMFORTABLE: Designed for all-day wear, these studs are light on the ears without causing any discomfort.
- VERSATILE STYLING: Complements both ethnic and western outfits, making them a perfect accessory for any occasion.
- IDEAL GIFT CHOICE: A thoughtful gift for birthdays, anniversaries, Valentine's Day, and festive celebrations for women and girls.
- TRENDY FASHION JEWELLERY: These modern sunburst studs are a stylish addition to any jewellery collection.

**Image IDs:** `61dgs1a9NgL` (main) · `414rWvgLmAL` · `41CPYvnrcVL` · `41tk5HolGpL` · `41HKgj3nCvL` · `41QkteJs+rL` · `51XbY6HFT-L`

---

# PART 4 — OPEN QUESTIONS FOR THE CLIENT

Send this list as-is. Nothing here can be answered from public data.

1. **Materials** — for each of the 5 SKUs: base metal, plating type, plating thickness in microns, stone type. *(Currently stated nowhere. This is the biggest catalogue gap.)*
2. **Skin-safety substantiation** — is the range nickel-free? Lead-free? Any test reports? *"Skin-friendly" is claimed on every listing with nothing supporting it.*
3. **Anti-tarnish** — treated or not, and expected plating life. Drives the care guide and the returns policy.
4. **Legal entity** — registered business name, address, GSTIN, HSN code confirmation, and the named Grievance Officer with email (required by the E-Commerce Rules 2020).
5. **Domain** — is `kshyovrata.com` secured? Which misspell variants should be bought and redirected?
6. **Photography budget** — the Amazon images are marketplace-grade. A proper shoot (model, macro, packaging, flat-lay) is the single highest-leverage spend for the premium positioning.
7. **Packaging** — "gift-ready packaging" is claimed on all 5 listings but never photographed. What does it actually look like?
8. **Brand name** — what does "Kshyovrata" mean, and how is it pronounced? If there's a real origin it should anchor the About page. *(Not inventing one.)*
9. **Roadmap** — how many SKUs in the next 6 months, and in which categories? Determines whether the IA needs rings, bracelets, anklets from day one.
10. **Positioning call** — confirm the site leads with *"Curated Elegance, Timelessly Yours"* rather than the logo's *"Commerce • Trust • Growth"*.
11. **Returns window** — confirm the site policy. Recommend matching or beating Amazon's 10 days.
12. **Amazon strategy** — confirm both channels stay live, and that site-exclusive launches are acceptable.

---

## Sources

- [Kshyovrata on Amazon.in (search)](https://www.amazon.in/s?k=Kshyovrata)
- [Seller storefront — SIYA JEWELLER](https://www.amazon.in/s?me=A1FG3ELIO27VH0)
- [B0HBZNHDBL](https://www.amazon.in/dp/B0HBZNHDBL) · [B0HCR3QVJJ](https://www.amazon.in/dp/B0HCR3QVJJ) · [B0HF41FLT6](https://www.amazon.in/dp/B0HF41FLT6) · [B0HCRFQG5B](https://www.amazon.in/dp/B0HCRFQG5B) · [B0HDCRYMVH](https://www.amazon.in/dp/B0HDCRYMVH)
- [@kshyovrata on Instagram](https://www.instagram.com/kshyovrata/)
