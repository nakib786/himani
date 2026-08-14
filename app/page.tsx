import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

import { IconArrowRight, RuleDot } from '@/components/brand/Motifs';
import { TrustStrip } from '@/components/home/TrustStrip';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { commerce } from '@/lib/commerce';
import { formatPrice } from '@/lib/format';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: `${SITE.name} — ${SITE.tagline}`,
  description: SITE.description,
  alternates: { canonical: '/' },
};

const CATEGORY_TILES = [
  { handle: 'necklaces', label: 'Necklaces', note: 'Adjustable, every one' },
  { handle: 'earrings', label: 'Earrings', note: 'Studs to statements' },
  { handle: 'sets', label: 'Sets', note: 'Necklace and earrings' },
];

const OCCASIONS = [
  {
    key: 'daily',
    title: 'Daily & Office',
    line: 'Small, flat, forgettable in the best way.',
    href: '/shop?occasion=daily&occasion=office',
  },
  {
    key: 'party',
    title: 'Party & Festive',
    line: 'For the evenings that want one loud piece.',
    href: '/shop?occasion=party&occasion=festive',
  },
  {
    key: 'wedding',
    title: 'Wedding',
    line: 'Sets that hold their own against a saree.',
    href: '/shop?occasion=wedding',
  },
  {
    key: 'gifting',
    title: 'Gifting',
    line: 'Everything arrives ready to hand over.',
    href: '/collections/gifting',
  },
];

/** Runs the marquee under the hero. Observable facts only — nothing here
 *  makes a material or dermatological claim the brand cannot evidence. */
const MARQUEE = [
  'Made in India',
  'Gold & rose-gold plated',
  '5–20 grams',
  'Gift-ready packaging',
  'Free shipping over ₹599',
  '10-day returns',
];

export default async function HomePage() {
  const featured = await commerce.listProducts({ sort: 'featured' });
  const hero = featured.find((p) => p.slug === 'papillon-wing-earrings') ?? featured[0];
  const heroImage = hero.images[0];

  // Resolved up front — an async callback inside .map() returns an array of
  // promises, which React will not render.
  const tiles = await Promise.all(
    CATEGORY_TILES.map(async (tile) => ({
      ...tile,
      items: await commerce.listCollectionProducts(tile.handle),
    })),
  );

  return (
    <>
      {/* ══ 01 · HERO — ESPRESSO ═══════════════════════════════════════════
          The headline is set in Italiana at up to 11rem and stepped across
          four lines, each indented further than the last, so the block reads
          as a descending stair rather than a centred slab. Every line is its
          own overflow-hidden window with a masked child, which is what lets
          them wipe up from their baselines instead of fading in. */}
      {/* overflow-x-clip, not overflow-hidden: `hidden` would make this
          section a scroll container and deactivate the view() timelines on
          the masked headline inside it. */}
      <section data-ground="dark" data-grain className="relative overflow-x-clip">
        <div className="shell relative pt-14 md:pt-20">
          {/* Spine, running up the left gutter */}
          <span className="spine absolute top-28 left-4 hidden xl:block">
            Est. 2026 — Made in India
          </span>

          <p className="eyebrow">Fine Jewellery · Gifts · Select Finds</p>

          <h1 className="display-xl mt-8 md:mt-10">
            <span className="block overflow-hidden">
              <span className="unmask block">Curated</span>
            </span>
            <span className="block overflow-hidden">
              <span className="unmask block pl-[8vw] text-accent md:pl-[14vw]">Elegance</span>
            </span>
            <span className="block overflow-hidden">
              <span className="unmask block">Timelessly</span>
            </span>
            <span className="block overflow-hidden">
              <span className="unmask block pl-[16vw] md:pl-[26vw]">Yours</span>
            </span>
          </h1>

          <div className="mt-12 grid gap-10 border-t border-rule pt-8 md:mt-16 md:grid-cols-12 md:gap-8">
            <div className="md:col-span-5">
              <p className="body-lg max-w-[42ch]">
                Gold and rose-gold plated pieces built to be worn, not saved for later.
                Five to twenty grams, finished by hand, and priced so that wearing them
                daily is the point.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link href="/shop" className="btn btn-primary">
                  Shop the collection
                </Link>
                <Link href="/collections/gifting" className="link-rule caption uppercase">
                  Or find a gift
                </Link>
              </div>
            </div>

            <div className="md:col-span-6 md:col-start-7">
              <Link href={`/product/${hero.slug}`} className="card group block">
                <div className="plate plate-square drift">
                  <Image
                    src={heroImage.url}
                    alt={heroImage.alt}
                    width={heroImage.width}
                    height={heroImage.height}
                    priority
                    fetchPriority="high"
                    sizes="(min-width: 768px) 48vw, 100vw"
                  />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-4 border-t border-rule pt-3">
                  <span className="caption transition-colors duration-500 group-hover:text-accent">
                    {hero.title}
                  </span>
                  <span className="tabular caption">{formatPrice(hero.price)}</span>
                </div>
              </Link>
            </div>
          </div>

          {/* ── Marquee: the only continuous motion on the site ── */}
          <div className="marquee mt-14 border-t border-rule py-5 md:mt-20">
            {/* Two identical tracks; the animation translates exactly -50%, so
                the loop seam lands where the copy begins and is invisible. */}
            {[0, 1].map((track) => (
              <div key={track} className="marquee-track" aria-hidden={track === 1}>
                {MARQUEE.map((item) => (
                  <span
                    key={item}
                    className="flex shrink-0 items-center gap-3.5 text-[0.625rem] font-medium tracking-[0.2em] text-fg-mute uppercase"
                  >
                    <span className="h-1 w-1 shrink-0 rounded-full bg-accent" />
                    {item}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 02 · CATEGORIES — GALLERY ══════════════════════════════════════ */}
      <section data-ground="light" className="shell section">
        <SectionHeader
          index="01"
          eyebrow="The Collection"
          title="Three ways in"
          lede="Five pieces at launch. Small on purpose — everything here earned its place."
          action={{ label: 'View all', href: '/shop' }}
        />

        <div className="mt-14 grid gap-x-6 gap-y-12 sm:grid-cols-3 md:mt-20">
          {tiles.map(({ items, ...tile }, i) => {
            const cover = items[0];
            return (
              <Reveal key={tile.handle} index={i}>
                <Link href={`/collections/${tile.handle}`} className="card group block">
                  {/* Square, not plate-tall: these covers are product cutouts,
                      and a portrait crop would clip the wider necklaces. */}
                  <div className="plate">
                    <Image
                      src={cover.images[0].url}
                      alt={cover.images[0].alt}
                      width={cover.images[0].width}
                      height={cover.images[0].height}
                      sizes="(min-width: 640px) 33vw, 100vw"
                      className="plate-main"
                    />
                    {cover.images[1] ? (
                      <Image
                        src={cover.images[1].url}
                        alt=""
                        width={cover.images[1].width}
                        height={cover.images[1].height}
                        sizes="(min-width: 640px) 33vw, 100vw"
                        aria-hidden="true"
                        className="plate-alt"
                      />
                    ) : null}
                  </div>
                  <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-rule pt-3.5">
                    <h3 className="display-md transition-colors duration-500 group-hover:text-accent">
                      {tile.label}
                    </h3>
                    <span className="index-num">{String(items.length).padStart(2, '0')}</span>
                  </div>
                  <p className="caption mt-2">{tile.note}</p>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* ══ 03 · TRUST ════════════════════════════════════════════════════ */}
      <section data-ground="light" className="shell">
        <TrustStrip />
      </section>

      {/* ══ 04 · FEATURED ═════════════════════════════════════════════════ */}
      <section data-ground="light" className="shell section">
        <SectionHeader
          index="02"
          eyebrow="Every Piece"
          title="The full house"
          lede="Nothing is hidden behind a filter. This is all of it."
        />
        <div className="mt-14 md:mt-20">
          <ProductGrid products={featured} priorityCount={0} />
        </div>
      </section>

      {/* ══ 05 · OCCASIONS — ESPRESSO ══════════════════════════════════════
          A list, not a card grid. Each row is a full-width hairline band whose
          numeral and arrow travel on hover. */}
      <section data-ground="dark" data-grain className="section">
        <div className="shell">
          <SectionHeader index="03" eyebrow="By Occasion" title="What is it for?" />

          <ul className="mt-12 border-t border-rule md:mt-16">
            {OCCASIONS.map((occasion, i) => (
              <Reveal as="li" key={occasion.key} index={i}>
                <Link
                  href={occasion.href}
                  className="group flex items-baseline gap-5 border-b border-rule py-7 md:gap-10 md:py-10"
                >
                  <span className="index-num shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="display-md min-w-0 flex-1 transition-colors duration-500 group-hover:text-accent">
                    {occasion.title}
                  </span>
                  <span className="caption hidden max-w-[34ch] flex-1 md:block">
                    {occasion.line}
                  </span>
                  <IconArrowRight className="h-4 w-4 shrink-0 text-fg-mute transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:translate-x-2 group-hover:text-accent" />
                </Link>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* ══ 06 · STORY — ESPRESSO ═════════════════════════════════════════
          Runs straight on from the occasions band with no seam, so the two
          read as one long dark chapter between the gallery sections. */}
      <section data-ground="dark" data-grain className="section-tight">
        <div className="shell">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <Reveal className="md:col-span-5">
              <div className="plate plate-tall plate-lifestyle drift">
                <Image
                  src="/products/papillon-pendant-necklace/05.jpg"
                  alt="The Papillon pendant photographed with dried flowers and deep red fabric"
                  width={505}
                  height={757}
                  sizes="(min-width: 768px) 40vw, 100vw"
                />
              </div>
            </Reveal>

            <Reveal className="md:col-span-7" index={1}>
              <p className="eyebrow">The House</p>
              <h2 className="display-lg mt-6 max-w-[14ch]">
                Jewellery that behaves like it costs more
              </h2>
              <div className="measure mt-8 flex flex-col gap-4">
                <p className="body-lg">
                  Kshyovrata began on a marketplace shelf, competing on discount depth
                  against sellers going 89% off. That is a race worth losing.
                </p>
                <p className="body-lg">
                  So this is the other thing instead: a small, edited range where the
                  finish, the weight and the packaging are the argument. Open-outline
                  butterflies. A sun with rays cut one by one. Hexagons left hollow so the
                  piece stays light. Details you notice on the second look, which is the
                  only look that matters.
                </p>
              </div>
              <Link href="/about" className="link-rule caption mt-9 inline-block uppercase">
                Read the full story
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ 07 · INSTAGRAM — GALLERY ══════════════════════════════════════
          Brief §4.7: build the strip so it hides gracefully below six posts.
          @kshyovrata has four. Rather than render two empty tiles or pad the
          row with product shots pretending to be UGC, the component degrades
          to a single quiet invitation — and becomes a grid the moment the feed
          is worth showing. Wire it to the Instagram Basic Display API and
          swap the branch on `posts.length >= 6`. */}
      <section data-ground="light" className="shell section-tight">
        <div className="flex flex-col items-center text-center">
          <span className="index-num">04</span>
          <p className="display-md mt-6 max-w-[20ch]">The feed is four posts old</p>
          <p className="body-sm mt-4 max-w-[44ch]">
            We would rather show you an honest empty room than six tiles of stock imagery.
            Come and watch it fill up.
          </p>
          <a
            href={SITE.instagram}
            target="_blank"
            rel="noreferrer noopener"
            className="btn btn-secondary mt-9"
          >
            Follow {SITE.instagramHandle}
          </a>
        </div>

        <div className="mt-16">
          <RuleDot />
        </div>
      </section>
    </>
  );
}
