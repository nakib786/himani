import type { Metadata } from 'next';
import Link from 'next/link';

import { RuleDot } from '@/components/brand/Motifs';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { content } from '@/lib/content';
import { formatDate } from '@/lib/format';

export const metadata: Metadata = {
  title: 'The Journal',
  description:
    'Practical writing on fashion jewellery: how to stop gold plating tarnishing, what "skin-friendly" really means, chain lengths for Indian necklines, and gifting under ₹1000.',
  alternates: { canonical: '/journal' },
};

export default async function JournalPage() {
  const posts = await content.listPosts();

  return (
    <>
      <PageHero
        index="01"
        eyebrow="The Journal"
        title="Answers, not filler"
        lede="Eight pieces on the questions people actually ask about fashion jewellery — including the one about skin safety that most sellers would rather not answer."
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Journal', href: '/journal' },
        ]}
      />

      <div className="shell section-tight">
        <ul className="border-t border-rule">
          {posts.map((post, i) => (
            <Reveal as="li" key={post.slug} index={Math.min(i, 5)}>
              <Link
                href={`/journal/${post.slug}`}
                className="group grid gap-4 border-b border-rule py-8 md:grid-cols-12 md:gap-8 md:py-10"
              >
                <div className="flex items-baseline gap-4 md:col-span-1">
                  <span className="index-num">{String(i + 1).padStart(2, '0')}</span>
                </div>

                <div className="md:col-span-7">
                  <h2 className="display-md text-fg transition-colors duration-500 group-hover:text-accent">
                    {post.title}
                  </h2>
                  <p className="body-sm mt-3 max-w-[54ch]">{post.excerpt}</p>
                </div>

                <div className="md:col-span-4 md:text-right">
                  <p className="caption">
                    <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
                  </p>
                  <p className="caption mt-1">
                    <span className="tabular">{post.readingMinutes}</span> min read
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </ul>

        <div className="mt-20">
          <RuleDot />
        </div>
      </div>
    </>
  );
}
