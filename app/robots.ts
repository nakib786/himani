import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Transactional and personal routes carry nothing worth indexing and
        // would only create duplicate thin pages.
        disallow: ['/cart', '/checkout', '/order/', '/api/'],
      },
    ],
    sitemap: new URL('/sitemap.xml', SITE.url).toString(),
    host: SITE.url,
  };
}
