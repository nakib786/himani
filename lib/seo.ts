import { discountPercent } from './catalogue';
import { priceValue } from './format';
import { COMMERCE, PENDING_CLIENT_DATA, SITE } from './site';
import type { JournalPost, Product } from './types';

/**
 * Structured data.
 *
 * §8 of the brief calls SEO "the highest-stakes part of the build": no domain
 * authority, no backlinks, no reviews, and a brand name almost nobody can
 * spell. Two things follow —
 *
 *   1. `alternateName` carries the likely misspellings so Google can reconcile
 *      them to one entity.
 *   2. `AggregateRating` is emitted ONLY when real reviews exist. Emitting a
 *      rating with zero reviews is a structured-data violation and risks a
 *      manual action; there are no reviews yet, so there is no rating.
 */

export function absoluteUrl(path = '/'): string {
  return new URL(path, SITE.url).toString();
}

export function organizationLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': absoluteUrl('/#organization'),
    name: SITE.name,
    alternateName: [...SITE.alternateNames],
    url: SITE.url,
    logo: absoluteUrl('/logo.svg'),
    description: SITE.description,
    slogan: SITE.tagline,
    sameAs: [SITE.instagram, SITE.amazonStorefront],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer service',
        email: PENDING_CLIENT_DATA.customerCareEmail,
        areaServed: 'IN',
        availableLanguage: ['en', 'hi'],
      },
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'IN',
    },
  };
}

export function websiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': absoluteUrl('/#website'),
    url: SITE.url,
    name: SITE.name,
    inLanguage: SITE.locale,
    publisher: { '@id': absoluteUrl('/#organization') },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: absoluteUrl('/shop?q={search_term_string}'),
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function productLd(product: Product) {
  const url = absoluteUrl(`/product/${product.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${url}#product`,
    name: product.title,
    description: product.shortDescription,
    sku: product.sku,
    gtin: undefined,
    image: product.images.map((i) => absoluteUrl(i.url)),
    brand: { '@type': 'Brand', name: SITE.name },
    manufacturer: { '@type': 'Organization', name: product.manufacturer },
    countryOfOrigin: product.countryOfOrigin,
    material: product.baseMetal ?? undefined,
    weight: {
      '@type': 'QuantitativeValue',
      value: product.weightGrams,
      unitCode: 'GRM',
    },
    category: product.category === 'set' ? 'Jewelry Set' : product.category,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: SITE.currency,
      price: priceValue(product.price),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': absoluteUrl('/#organization') },
      priceValidUntil: `${new Date().getFullYear() + 1}-12-31`,
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        applicableCountry: 'IN',
        returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: COMMERCE.returnWindowDays,
        returnMethod: 'https://schema.org/ReturnByMail',
        returnFees: 'https://schema.org/FreeReturn',
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: '0',
          currency: SITE.currency,
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 7,
            unitCode: 'DAY',
          },
        },
      },
    },
    // No aggregateRating and no review array: the catalogue genuinely has zero
    // reviews. These get added the moment the first real one lands.
  };
}

export function breadcrumbLd(trail: { name: string; href: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((crumb, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.href),
    })),
  };
}

export function itemListLd(products: Product[], path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    url: absoluteUrl(path),
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(`/product/${p.slug}`),
      name: p.title,
    })),
  };
}

export function articleLd(post: JournalPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    author: { '@id': absoluteUrl('/#organization') },
    publisher: { '@id': absoluteUrl('/#organization') },
    mainEntityOfPage: absoluteUrl(`/journal/${post.slug}`),
    inLanguage: SITE.locale,
  };
}

/** Convenience for <meta> descriptions built off a product. */
export function productMetaDescription(product: Product): string {
  const off = discountPercent(product);
  return `${product.shortDescription} ₹${product.price} (MRP ₹${product.mrp}, ${off}% off). ${product.netQuantity}. Free shipping over ₹${COMMERCE.freeShippingThreshold}, ${COMMERCE.returnWindowDays}-day returns, delivered across India.`;
}
