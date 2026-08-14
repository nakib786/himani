import type { Metadata } from 'next';
import Link from 'next/link';

import { MoonStars, RuleDot } from '@/components/brand/Motifs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { Filters, type ActiveFilters } from '@/components/shop/Filters';
import { JsonLd } from '@/components/seo/JsonLd';
import { commerce, type SortKey } from '@/lib/commerce';
import { breadcrumbLd, itemListLd } from '@/lib/seo';

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const SORT_KEYS: SortKey[] = ['featured', 'price-asc', 'price-desc', 'newest'];

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function readFilters(params: Record<string, string | string[] | undefined>): ActiveFilters {
  const sortRaw = typeof params.sort === 'string' ? params.sort : 'featured';
  const maxPriceRaw = typeof params.maxPrice === 'string' ? Number(params.maxPrice) : NaN;

  return {
    category: toArray(params.category),
    finish: toArray(params.finish),
    motif: toArray(params.motif),
    occasion: toArray(params.occasion),
    maxPrice: Number.isFinite(maxPriceRaw) ? maxPriceRaw : undefined,
    sort: SORT_KEYS.includes(sortRaw as SortKey) ? sortRaw : 'featured',
    q: typeof params.q === 'string' ? params.q : undefined,
  };
}

function facetCount(f: ActiveFilters): number {
  return (
    (f.category.length ? 1 : 0) +
    (f.finish.length ? 1 : 0) +
    (f.motif.length ? 1 : 0) +
    (f.occasion.length ? 1 : 0) +
    (f.maxPrice ? 1 : 0)
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams;
}): Promise<Metadata> {
  const active = readFilters(await searchParams);
  const facets = facetCount(active);

  return {
    title: 'Shop All Jewellery',
    description:
      'The full Kshyovrata range — gold and rose-gold plated necklaces, earrings and sets from ₹399. Free shipping above ₹599, 10-day returns, delivered across India.',
    alternates: { canonical: '/shop' },
    // A single facet is a genuinely useful landing page. Stacked facets create
    // near-duplicate thin pages, so they stay crawlable but out of the index.
    robots:
      facets > 1 || active.q
        ? { index: false, follow: true }
        : { index: true, follow: true },
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const active = readFilters(params);

  const products = await commerce.listProducts({
    category: active.category,
    finish: active.finish,
    motif: active.motif,
    occasion: active.occasion,
    maxPrice: active.maxPrice,
    sort: active.sort as SortKey,
    search: active.q,
  });

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
  ];

  return (
    <>
      <JsonLd data={[breadcrumbLd(crumbs), itemListLd(products, '/shop')]} />

      {/* Espresso opening band. Every page needs one: the sticky header is
          permanently dark-ground and transparent until scrolled, so a page
          that began on bone would render cream nav text on a near-white
          field. */}
      <header data-ground="dark" data-grain>
        <div className="shell pt-10 pb-16 md:pt-14 md:pb-24">
          <div className="flex items-baseline gap-4 border-t border-rule pt-5">
            <span className="index-num">00</span>
            <span className="eyebrow">
              {active.q ? `Search — “${active.q}”` : 'The Complete Range'}
            </span>
          </div>
          <h1 className="display-lg mt-8 max-w-[14ch] overflow-hidden">
            <span className="unmask block">
              {active.q ? 'Search results' : 'Everything we make'}
            </span>
          </h1>
          {!active.q ? (
            <p className="body-lg measure mt-7">
              Five pieces. Two finishes. Four motifs. The range is small because every
              addition has to justify itself against what is already here.
            </p>
          ) : null}
        </div>
      </header>

      <div className="shell pt-14 pb-16 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-[15rem_1fr] lg:gap-14">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <Filters base="/shop" active={active} resultCount={products.length} />
          </div>

          <div>
            {products.length > 0 ? (
              <ProductGrid products={products} priorityCount={2} columns={3} />
            ) : (
              <div className="flex flex-col items-center border-t border-rule py-24 text-center">
                <MoonStars className="h-7 w-9 text-fg-mute" />
                <p className="display-md mt-6 text-fg">Nothing matches that</p>
                <p className="body-sm mt-3 max-w-[40ch]">
                  With five pieces in the house, a narrow filter empties the room quickly.
                  Try loosening one.
                </p>
                <Link href="/shop" className="btn btn-secondary mt-8">
                  Show everything
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="mt-20">
          <RuleDot />
        </div>
      </div>
    </>
  );
}
