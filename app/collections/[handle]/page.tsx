import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { RuleDot } from '@/components/brand/Motifs';
import { ProductGrid } from '@/components/product/ProductGrid';
import { JsonLd } from '@/components/seo/JsonLd';
import { COLLECTIONS } from '@/lib/catalogue';
import { commerce } from '@/lib/commerce';
import { breadcrumbLd, itemListLd } from '@/lib/seo';

export const revalidate = 3600;

export async function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ handle: c.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const collection = await commerce.getCollection(handle);
  if (!collection) return { title: 'Not found' };

  return {
    title: collection.seoTitle,
    description: collection.seoDescription,
    alternates: { canonical: `/collections/${collection.handle}` },
    openGraph: {
      title: collection.seoTitle,
      description: collection.seoDescription,
      url: `/collections/${collection.handle}`,
    },
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const collection = await commerce.getCollection(handle);
  if (!collection) notFound();

  const products = await commerce.listCollectionProducts(handle);

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: collection.title, href: `/collections/${collection.handle}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbLd(crumbs),
          itemListLd(products, `/collections/${collection.handle}`),
        ]}
      />

      {/* Espresso opening band — see PageHero for why every page needs one. */}
      <header data-ground="dark" data-grain>
        <div className="shell pt-10 pb-16 md:pt-14 md:pb-24">
          <div className="flex items-baseline gap-4 border-t border-rule pt-5">
            <span className="index-num">
              {String(products.length).padStart(2, '0')}
            </span>
            <span className="eyebrow">{collection.tagline}</span>
          </div>

          <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between md:gap-16">
            <h1 className="display-lg max-w-[12ch] overflow-hidden">
              <span className="unmask block">{collection.title}</span>
            </h1>
            <p className="body-lg max-w-[46ch] md:text-right">{collection.intro}</p>
          </div>
        </div>
      </header>

      <div className="shell pb-16 md:pb-24">
        <div className="pt-14 md:pt-20">
          <ProductGrid products={products} priorityCount={2} />
        </div>

        <div className="mt-20">
          <RuleDot />
        </div>
      </div>
    </>
  );
}
