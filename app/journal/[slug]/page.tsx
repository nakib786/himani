import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RuleDot } from '@/components/brand/Motifs';
import { ProductCard } from '@/components/product/ProductCard';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { Prose } from '@/components/ui/Prose';
import { commerce } from '@/lib/commerce';
import { formatDate } from '@/lib/format';
import { content } from '@/lib/content';
import { articleLd, breadcrumbLd } from '@/lib/seo';

export async function generateStaticParams() {
  return (await content.listPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await content.getPost(slug);
  if (!post) return { title: 'Not found' };

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: `/journal/${post.slug}` },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: `/journal/${post.slug}`,
      publishedTime: post.publishedAt,
    },
  };
}

export default async function JournalPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await content.getPost(slug);
  if (!post) notFound();

  const [related, allSlugs] = await Promise.all([
    content.getRelatedPosts(slug),
    content.listPostSlugs(),
  ]);
  const products = await commerce.listProducts({ sort: 'featured' });
  const picks = products.slice(0, 3);

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: 'Journal', href: '/journal' },
    { name: post.title, href: `/journal/${post.slug}` },
  ];

  return (
    <>
      <JsonLd data={[articleLd(post), breadcrumbLd(crumbs)]} />

      <PageHero
        index={String(allSlugs.indexOf(post.slug) + 1).padStart(2, '0')}
        eyebrow="Journal"
        title={post.title}
        crumbs={crumbs}
      />

      <article className="shell section-tight">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 border-b border-rule pb-4">
              <p className="caption">
                <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
              </p>
              <p className="caption">
                <span className="tabular">{post.readingMinutes}</span> min read
              </p>
            </div>

            <p className="body-lg measure mt-8 text-fg">{post.excerpt}</p>

            <div className="mt-10">
              <Prose blocks={post.body} />
            </div>

            {related.length > 0 ? (
              <nav aria-label="Related reading" className="mt-16 border-t border-rule pt-6">
                <h2 className="eyebrow eyebrow-ink">Read next</h2>
                <ul className="mt-5 flex flex-col gap-3">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/journal/${item.slug}`}
                        className="link-nav body-lg text-fg-soft"
                      >
                        {item.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ) : null}
          </div>

          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="lg:sticky lg:top-24">
              <h2 className="eyebrow eyebrow-ink border-t border-rule pt-4">From the shop</h2>
              <ul className="mt-6 flex flex-col gap-8">
                {picks.map((product) => (
                  <li key={product.slug}>
                    <ProductCard product={product} sizes="(min-width: 1024px) 20vw, 40vw" />
                  </li>
                ))}
              </ul>
              <Link href="/shop" className="btn btn-secondary btn-sm btn-block mt-8">
                See everything
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-20">
          <RuleDot />
        </div>
      </article>
    </>
  );
}
