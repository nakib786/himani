import type { MetadataRoute } from 'next';
import { COLLECTIONS } from '@/lib/catalogue';
import { commerce } from '@/lib/commerce';
import { content } from '@/lib/content';
import { POLICIES } from '@/lib/policies';
import { SITE } from '@/lib/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, posts] = await Promise.all([
    commerce.listProducts(),
    content.listPosts(),
  ]);
  const now = new Date();

  const url = (path: string) => new URL(path, SITE.url).toString();

  return [
    { url: url('/'), lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: url('/shop'), lastModified: now, changeFrequency: 'weekly', priority: 0.9 },

    ...COLLECTIONS.map((c) => ({
      url: url(`/collections/${c.handle}`),
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),

    ...products.map((p) => ({
      url: url(`/product/${p.slug}`),
      lastModified: new Date(p.listedOn),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),

    { url: url('/journal'), lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    ...posts.map((post) => ({
      url: url(`/journal/${post.slug}`),
      lastModified: new Date(post.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),

    ...['/about', '/care', '/size-guide', '/contact', '/track-order'].map((path) => ({
      url: url(path),
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),

    ...POLICIES.map((p) => ({
      url: url(`/policies/${p.slug}`),
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    })),
  ];
}
