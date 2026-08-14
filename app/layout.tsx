import type { Metadata, Viewport } from 'next';
import { Instrument_Sans, Italiana } from 'next/font/google';
import './globals.css';

import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CookieConsent } from '@/components/layout/CookieConsent';
import { PointerStars } from '@/components/brand/PointerStars';
import { JsonLd } from '@/components/seo/JsonLd';
import { organizationLd, websiteLd } from '@/lib/seo';
import { SITE } from '@/lib/site';

/**
 * Fonts are self-hosted by next/font at build time — no CDN request, no
 * layout shift, `display: swap` with a metric-matched fallback.
 *
 * ITALIANA stands in for The Seasons (Cape Arcona), which the logo artwork
 * uses. The Seasons ships with Canva, and Canva's licence does not cover
 * extracting the file to self-host on a website — so the closest free face
 * with the same tall, narrow, hairline-contrast character is used instead.
 * If a web licence for The Seasons is ever bought, swap it in here with
 * `next/font/local` and delete this import; nothing else has to change.
 *
 * Italiana is single-weight with no true italic, which is exactly why the
 * type scale confines it to display sizes. Below ~28px it is replaced by
 * Instrument Sans rather than being faux-bolded or faux-italicised.
 */
const italiana = Italiana({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-italiana',
  display: 'swap',
});

const instrument = Instrument_Sans({
  subsets: ['latin'],
  // Variable: 400 body, 500 for eyebrows/labels, 600 for the rare emphasis.
  weight: ['400', '500', '600'],
  variable: '--font-instrument',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — ${SITE.tagline}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  keywords: [
    'gold plated jewellery',
    'fashion jewellery India',
    'butterfly pendant necklace',
    'rose gold necklace set',
    'sunburst stud earrings',
    'jewellery gift for her',
    'imitation jewellery online',
  ],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  alternates: {
    canonical: '/',
    languages: { 'en-IN': '/' },
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  category: 'shopping',
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  // The document opens on the espresso band, so the browser chrome matches it.
  themeColor: '#14100B',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${italiana.variable} ${instrument.variable}`}>
      {/* `data-ground` is the site's one theming switch: it sets --bg, --fg,
          --rule and --accent for everything beneath it.

          The BODY is espresso and MAIN is the gallery ground, which looks
          inverted until you follow the sticky header. That header is
          transparent until scrolled, and it sits in flow ABOVE <main> — so
          whatever body paints is what shows through it. With a bone body the
          header's cream text landed on near-white and vanished. Espresso body
          + bone main means the strip behind the header is always dark, and
          page content still defaults to light.

          Reveal animations are pure CSS scroll-driven, so nothing is hidden
          behind a JS class and no `.js` bootstrap script is needed. */}
      <body data-ground="dark">
        <CartProvider>
          <a href="#main" className="skip-link">
            Skip to content
          </a>
          <AnnouncementBar />
          <Header />
          <main id="main" data-ground="light">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <CookieConsent />
          {/* Last child, so its fixed layer stacks above the drawers and the
              consent sheet without needing a z-index arms race. */}
          <PointerStars />
        </CartProvider>

        <JsonLd data={[organizationLd(), websiteLd()]} />
      </body>
    </html>
  );
}
