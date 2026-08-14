import type { NextConfig } from 'next';
import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

const nextConfig: NextConfig = {
  reactStrictMode: true,

  // There is an unrelated lockfile further up the user's home directory; pin
  // the trace root to this project so builds don't walk outside it.
  outputFileTracingRoot: __dirname,

  images: {
    // Local catalogue imagery is re-hosted in /public/products — we never
    // hotlink Amazon's CDN. With COMMERCE_BACKEND=wix, product images come
    // from Wix Media instead, so that host has to be allowed here.
    remotePatterns: [
      { protocol: 'https', hostname: 'static.wixstatic.com' },
      { protocol: 'https', hostname: '**.wixstatic.com' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 420, 640, 828, 1080, 1280, 1600],
    imageSizes: [64, 96, 128, 200, 320, 420],
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
        ],
      },
      {
        source: '/products/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      // Legacy / convenience routes so no inbound link 404s.
      { source: '/products/:slug', destination: '/product/:slug', permanent: true },

      // There is no account system — checkout is guest-only and orders are
      // looked up by order number. Anything that ever pointed at an account
      // area lands on the thing people were actually after.
      { source: '/account', destination: '/track-order', permanent: true },
      { source: '/account/:path*', destination: '/track-order', permanent: true },
      { source: '/login', destination: '/track-order', permanent: true },
      { source: '/register', destination: '/track-order', permanent: true },

      { source: '/collections', destination: '/shop', permanent: true },
      { source: '/blog', destination: '/journal', permanent: true },
      { source: '/blog/:slug', destination: '/journal/:slug', permanent: true },

      // With CONTENT_BACKEND=wix the journal URLs are Wix's slugs, which are
      // longer than the hand-written ones the local journal shipped with.
      // These map the old paths onto the new so nothing that was ever linked
      // or indexed breaks. Safe to keep with either backend.
      ...Object.entries({
        'keep-gold-plated-jewellery-from-tarnishing':
          'how-to-keep-gold-plated-jewellery-from-tarnishing',
        'what-skin-friendly-actually-means':
          'what-skin-friendly-actually-means-in-fashion-jewellery',
        'gold-vs-rose-gold-skin-tone': 'gold-vs-rose-gold-which-suits-your-skin-tone',
        'chain-length-guide-indian-necklines': 'chain-length-guide-for-indian-necklines',
        'style-a-butterfly-pendant': 'how-to-style-a-butterfly-pendant-ethnic-and-western',
        'everyday-office-jewellery-capsule': 'everyday-office-jewellery-the-five-piece-capsule',
        'jewellery-gifts-under-1000': 'jewellery-gifts-under-1000-that-don-t-look-cheap',
        'festive-jewellery-edit':
          'festive-jewellery-edit-diwali-karwa-chauth-and-raksha-bandhan',
      }).map(([from, to]) => ({
        source: `/journal/${from}`,
        destination: `/journal/${to}`,
        permanent: true,
      })),
    ];
  },
};

// Exposes the Worker bindings declared in wrangler.jsonc to `next dev`, so the
// contact and newsletter routes hit the same EMAIL binding locally as in
// production. `"remote": true` on the send_email binding is what sends dev
// mail through the real service rather than a local stub.
initOpenNextCloudflareForDev();

export default nextConfig;
