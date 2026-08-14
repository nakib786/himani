import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import { RuleDot } from '@/components/brand/Motifs';
import { JsonLd } from '@/components/seo/JsonLd';
import { PageHero } from '@/components/ui/PageHero';
import { Prose } from '@/components/ui/Prose';
import { POLICIES, getPolicy } from '@/lib/policies';
import { formatDate } from '@/lib/format';
import { breadcrumbLd } from '@/lib/seo';

export async function generateStaticParams() {
  return POLICIES.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) return { title: 'Not found' };

  return {
    title: policy.seoTitle,
    description: policy.seoDescription,
    alternates: { canonical: `/policies/${policy.slug}` },
  };
}

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const policy = getPolicy(slug);
  if (!policy) notFound();

  const crumbs = [
    { name: 'Home', href: '/' },
    { name: policy.title, href: `/policies/${policy.slug}` },
  ];

  return (
    <>
      <JsonLd data={breadcrumbLd(crumbs)} />

      <PageHero
        index="01"
        eyebrow="Policies"
        title={policy.title}
        lede={policy.intro}
        crumbs={crumbs}
      />

      <div className="shell section-tight">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-8">
            <p className="caption border-b border-rule pb-4">
              Last updated <time dateTime={policy.updated}>{formatDate(policy.updated)}</time>
            </p>
            <div className="mt-10">
              <Prose blocks={policy.body} />
            </div>
          </div>

          <aside className="lg:col-span-3 lg:col-start-10">
            <div className="lg:sticky lg:top-24">
              <h2 className="eyebrow eyebrow-ink border-t border-rule pt-4">All policies</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {POLICIES.map((item) => (
                  <li key={item.slug}>
                    <Link
                      href={`/policies/${item.slug}`}
                      aria-current={item.slug === policy.slug ? 'page' : undefined}
                      className={
                        item.slug === policy.slug
                          ? 'body-sm text-fg'
                          : 'link-nav body-sm text-fg-soft'
                      }
                    >
                      {item.title}
                    </Link>
                  </li>
                ))}
              </ul>

              <h2 className="eyebrow eyebrow-ink mt-10 border-t border-rule pt-4">Ask us</h2>
              <p className="caption mt-4">
                Anything here that is not clear, we would rather explain than have you guess.
              </p>
              <Link href="/contact" className="btn btn-secondary btn-sm mt-5">
                Contact us
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-20">
          <RuleDot />
        </div>
      </div>
    </>
  );
}
