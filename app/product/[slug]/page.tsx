import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { MoonStars, RuleDot, Sunburst } from '@/components/brand/Motifs';
import { TrustStrip } from '@/components/home/TrustStrip';
import { AddToCart } from '@/components/product/AddToCart';
import { DeliveryEstimator } from '@/components/product/DeliveryEstimator';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGallery } from '@/components/product/ProductGallery';
import { JsonLd } from '@/components/seo/JsonLd';
import { Reveal } from '@/components/ui/Reveal';
import { BRAND_CARE, CATEGORY_LABELS, discountPercent } from '@/lib/catalogue';
import { commerce } from '@/lib/commerce';
import { formatPrice } from '@/lib/format';
import { breadcrumbLd, productLd, productMetaDescription } from '@/lib/seo';
import { COMMERCE, PENDING_CLIENT_DATA, SITE } from '@/lib/site';
import type { Product } from '@/lib/types';

export const revalidate = 3600;

export async function generateStaticParams() {
  const slugs = await commerce.listProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) return { title: 'Not found' };

  return {
    title: product.title,
    description: productMetaDescription(product),
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      type: 'website',
      title: `${product.title} · ${SITE.name}`,
      description: product.shortDescription,
      url: `/product/${product.slug}`,
      images: [
        {
          url: product.images[0].url,
          width: product.images[0].width,
          height: product.images[0].height,
          alt: product.images[0].alt,
        },
      ],
    },
    other: {
      // The marketplace title carries the long-tail keywords without ever
      // being shown to a human.
      'product:amazon_title': product.amazonTitle,
    },
  };
}

/** Accordion built on <details> — keyboard accessible and works without JS. */
function Panel({
  title,
  children,
  open = false,
}: {
  title: string;
  children: React.ReactNode;
  open?: boolean;
}) {
  return (
    <details className="group border-b border-rule" open={open}>
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 [&::-webkit-details-marker]:hidden">
        <span className="eyebrow eyebrow-ink">{title}</span>
        <span className="relative h-3 w-3 shrink-0" aria-hidden="true">
          <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-fg" />
          <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-fg transition-transform duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] group-open:rotate-90" />
        </span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  );
}

function SpecRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between gap-6 border-b border-rule py-2.5 last:border-b-0">
      <dt className="caption shrink-0">{label}</dt>
      <dd className="caption text-right text-fg">{value}</dd>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await commerce.getProduct(slug);
  if (!product) notFound();

  const [related, companion] = await Promise.all([
    commerce.getRelatedProducts(product.slug, 4),
    product.pairsWith ? commerce.getProduct(product.pairsWith) : Promise.resolve(null),
  ]);

  const off = discountPercent(product);
  const isCelestial = product.motif === 'celestial';

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Shop', href: '/shop' },
    { name: product.title, href: `/product/${product.slug}` },
  ];

  return (
    <>
      <JsonLd data={[productLd(product), breadcrumbLd(crumbs)]} />

      {/* ---- Breadcrumb ----
           A slim espresso band rather than a full hero: every other page
           opens dark for the sticky header's sake, and this keeps that rhythm
           without pushing the product itself below the fold. */}
      <div data-ground="dark" data-grain>
        <nav aria-label="Breadcrumb" className="shell py-5">
          <ol className="flex flex-wrap items-center gap-2">
            {crumbs.map((crumb, i) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {i > 0 ? (
                  <span className="caption text-fg-mute" aria-hidden="true">
                    /
                  </span>
                ) : null}
                {i === crumbs.length - 1 ? (
                  <span className="caption" aria-current="page">
                    {crumb.name}
                  </span>
                ) : (
                  <Link href={crumb.href} className="link-nav caption">
                    {crumb.name}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
      </div>

      {/* ---- Main ---- */}
      <div className="shell pt-10 pb-16 md:pt-14 md:pb-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} title={product.title} />

          <div className="lg:pt-4">
            <p className="eyebrow">{SITE.name}</p>

            <h1 className="display-lg mt-4 text-fg">{product.title}</h1>

            <p className="body-lg mt-5 max-w-[44ch]">{product.shortDescription}</p>

            {/* Price */}
            <div className="mt-7 flex flex-wrap items-baseline gap-x-4 gap-y-2">
              <span className="tabular text-[1.5rem] leading-none text-fg">
                {formatPrice(product.price)}
              </span>
              <span className="strike tabular text-[0.9375rem]">
                {formatPrice(product.mrp)}
              </span>
              <span className="tabular text-[0.8125rem] text-accent">−{off}%</span>
            </div>
            <p className="caption mt-2">Inclusive of all taxes · {product.netQuantity}</p>

            {/* Reviews: nothing is rendered until a real one exists. Brief §4. */}

            <AddToCart product={product} />

            <DeliveryEstimator />

            {/* Accordions */}
            <div className="mt-10 border-t border-rule">
              <Panel title="Details" open>
                <ul className="flex flex-col gap-2.5">
                  {product.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span
                        className="mt-2.5 h-px w-3 shrink-0 bg-rule-strong"
                        aria-hidden="true"
                      />
                      <span className="body-sm">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <div className="measure mt-5 flex flex-col gap-3">
                  {product.longDescription.map((para) => (
                    <p key={para.slice(0, 40)} className="body-sm">
                      {para}
                    </p>
                  ))}
                </div>
              </Panel>

              <Panel title="Materials & Specifications">
                <dl>
                  <SpecRow label="Category" value={CATEGORY_LABELS[product.category]} />
                  <SpecRow
                    label="Finish"
                    value={product.finish === 'rose-gold' ? 'Rose gold plated' : 'Gold plated'}
                  />
                  <SpecRow label="Net quantity" value={product.netQuantity} />
                  <SpecRow label="In the box" value={product.includedComponents.join(' · ')} />
                  <SpecRow label="Weight" value={`${product.weightGrams} g`} />
                  <SpecRow
                    label={
                      product.dimensions.basis === 'package'
                        ? 'Package dimensions'
                        : 'Dimensions'
                    }
                    value={`${product.dimensions.l} × ${product.dimensions.w} × ${product.dimensions.h} ${product.dimensions.unit}`}
                  />
                  <SpecRow label="Country of origin" value={product.countryOfOrigin} />
                  <SpecRow label="Manufacturer & packer" value={product.manufacturer} />
                  <SpecRow label="HSN code" value={product.hsnCode} />
                  <SpecRow label="SKU" value={product.sku} />
                </dl>

                {/* Honest treatment of the disclosure gap. We do not print a
                    row of em-dashes, and we do not invent a base metal. */}
                {product.baseMetal === null ? (
                  <div className="mt-5 border border-rule-strong p-4">
                    <p className="caption text-fg">Full material disclosure</p>
                    <p className="caption mt-2">
                      We are finalising verified base-metal, plating-thickness and
                      nickel-content figures with our manufacturer, and will publish them
                      here rather than estimate them. If you need those details before
                      ordering, write to{' '}
                      <a
                        href={`mailto:${PENDING_CLIENT_DATA.customerCareEmail}`}
                        className="link-rule text-fg"
                      >
                        {PENDING_CLIENT_DATA.customerCareEmail}
                      </a>{' '}
                      and we will answer with what our supplier has confirmed.
                    </p>
                  </div>
                ) : null}
              </Panel>

              <Panel title="Care">
                <p className="body-sm">{product.careInstructions}</p>
                <ul className="mt-4 flex flex-col gap-2.5">
                  {BRAND_CARE.principles.map((principle) => (
                    <li key={principle.title} className="flex gap-3">
                      <span
                        className="mt-2.5 h-px w-3 shrink-0 bg-rule-strong"
                        aria-hidden="true"
                      />
                      <span className="body-sm">
                        <span className="text-fg">{principle.title}.</span>{' '}
                        {principle.detail}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link href="/care" className="link-rule caption mt-5 inline-block uppercase">
                  Full care guide
                </Link>
              </Panel>

              <Panel title="Shipping & Returns">
                <ul className="flex flex-col gap-2.5">
                  <li className="body-sm">
                    Free shipping on orders above{' '}
                    {formatPrice(COMMERCE.freeShippingThreshold)}. Dispatched in one to two
                    working days.
                  </li>
                  <li className="body-sm">
                    Cash on delivery available up to {formatPrice(COMMERCE.codCap)}, with a{' '}
                    {formatPrice(COMMERCE.codFee)} handling fee. Prepaid orders get{' '}
                    {formatPrice(COMMERCE.prepaidDiscount)} off.
                  </li>
                  <li className="body-sm">
                    {COMMERCE.returnWindowDays}-day returns from delivery, provided the piece
                    is unworn and in its packaging.
                  </li>
                </ul>
                <div className="mt-5 flex gap-5">
                  <Link href="/policies/shipping" className="link-rule caption uppercase">
                    Shipping
                  </Link>
                  <Link href="/policies/returns" className="link-rule caption uppercase">
                    Returns
                  </Link>
                </div>
              </Panel>
            </div>

            <div className="mt-10">
              <TrustStrip compact />
            </div>
          </div>
        </div>
      </div>

      {/* ---- Complete the look ---- */}
      {companion ? (
        <section className="border-y border-rule bg-bg-lift">
          <div className="shell section-tight">
            <div className="flex items-baseline gap-4 border-t border-rule pt-4">
              <span className="index-num">04</span>
              <span className="eyebrow">Complete the look</span>
            </div>
            <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-center md:gap-14">
              <div className="md:col-span-4 lg:col-span-3">
                <ProductCard product={companion} />
              </div>
              <div className="md:col-span-8 lg:col-span-6">
                {isCelestial ? (
                  <Sunburst className="h-8 w-16 text-accent" />
                ) : (
                  <MoonStars className="h-7 w-9 text-accent" />
                )}
                <h2 className="display-md mt-5 max-w-[18ch] text-fg">
                  {product.category === 'set'
                    ? 'The other set, for the other kind of evening'
                    : `Wears well with the ${companion.title}`}
                </h2>
                <p className="body-lg measure mt-4">{companion.shortDescription}</p>
                <Link
                  href={`/product/${companion.slug}`}
                  className="btn btn-secondary mt-7 inline-flex"
                >
                  View the piece
                </Link>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ---- Reviews ---- */}
      <section className="shell section-tight">
        <div className="flex items-baseline gap-4 border-t border-rule pt-4">
          <span className="index-num">05</span>
          <span className="eyebrow">Reviews</span>
        </div>
        <div className="mt-12 flex flex-col items-center py-8 text-center">
          <MoonStars className="h-7 w-9 text-fg-mute" />
          <p className="display-md mt-6 text-fg">Be the first to review this piece</p>
          <p className="body-sm mt-3 max-w-[46ch]">
            There are no reviews yet — not curated ones, not seeded ones, none. When you have
            worn it for a week, tell us honestly how it held up.
          </p>
          <Link href="/contact" className="btn btn-secondary mt-8">
            Write a review
          </Link>
        </div>
      </section>

      {/* ---- You may also like ---- */}
      {related.length > 0 ? (
        <section className="shell section-tight">
          <div className="flex items-baseline gap-4 border-t border-rule pt-4">
            <span className="index-num">06</span>
            <span className="eyebrow">You may also like</span>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-x-5 gap-y-12 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-8">
            {related.map((item: Product, i: number) => (
              <Reveal as="li" key={item.slug} index={Math.min(i, 5)}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </ul>
          <div className="mt-16">
            <RuleDot />
          </div>
        </section>
      ) : null}
    </>
  );
}
