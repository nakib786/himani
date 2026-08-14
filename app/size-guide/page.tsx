import type { Metadata } from 'next';
import Link from 'next/link';

import { RuleDot } from '@/components/brand/Motifs';
import { PageHero } from '@/components/ui/PageHero';
import { commerce } from '@/lib/commerce';

export const metadata: Metadata = {
  title: 'Size Guide — Chain Lengths & Earring Dimensions',
  description:
    'Necklace chain length guide for Indian necklines, plus exact earring dimensions for every Kshyovrata piece. Which length sits where, and what each piece measures.',
  alternates: { canonical: '/size-guide' },
};

const CHAIN_LENGTHS = [
  {
    inches: '14–16″',
    name: 'Choker to collar',
    sits: 'At the base of the neck',
    goesWith: 'Boat necks, high necks, closed collars',
  },
  {
    inches: '16–18″',
    name: 'Princess',
    sits: 'On the collarbone or just below',
    goesWith: 'Most necklines. The default for a single pendant',
  },
  {
    inches: '20–22″',
    name: 'Matinee',
    sits: 'A few inches below the collarbone',
    goesWith: 'Kurtas, deeper V-necks, layering over a shorter chain',
  },
  {
    inches: '24″+',
    name: 'Opera',
    sits: 'At or below the sternum',
    goesWith: 'Sarees, long jackets, high-neck blouses',
  },
];

export default async function SizeGuidePage() {
  const products = await commerce.listProducts({ sort: 'featured' });

  return (
    <>
      <PageHero
        index="01"
        eyebrow="Fit"
        title="Where it will actually sit"
        lede="Both of our necklaces adjust, so the question is less which size to buy and more where you want the piece to land. Here is what each length does."
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Size guide', href: '/size-guide' },
        ]}
      />

      <div className="shell section-tight">
        {/* ---- Chain lengths ---- */}
        <section>
          <h2 className="eyebrow eyebrow-ink">Chain lengths</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[36rem] border-collapse text-left">
              <thead>
                <tr className="border-t border-b border-rule">
                  <th scope="col" className="caption py-3 pr-4 font-normal">
                    Length
                  </th>
                  <th scope="col" className="caption py-3 pr-4 font-normal">
                    Called
                  </th>
                  <th scope="col" className="caption py-3 pr-4 font-normal">
                    Sits
                  </th>
                  <th scope="col" className="caption py-3 font-normal">
                    Works with
                  </th>
                </tr>
              </thead>
              <tbody>
                {CHAIN_LENGTHS.map((row) => (
                  <tr key={row.inches} className="border-b border-rule">
                    <td className="tabular py-4 pr-4 text-[0.875rem] text-fg">
                      {row.inches}
                    </td>
                    <td className="body-sm py-4 pr-4 text-fg">{row.name}</td>
                    <td className="body-sm py-4 pr-4">{row.sits}</td>
                    <td className="body-sm py-4">{row.goesWith}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mt-4">
            Our necklaces use an adjustable box-link chain or a slider closure, so they cover
            the princess-to-matinee range without a clasp to fasten.
          </p>
        </section>

        {/* ---- Measured pieces ---- */}
        <section className="mt-16">
          <h2 className="eyebrow eyebrow-ink">Every piece, measured</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-left">
              <thead>
                <tr className="border-t border-b border-rule">
                  <th scope="col" className="caption py-3 pr-4 font-normal">
                    Piece
                  </th>
                  <th scope="col" className="caption py-3 pr-4 font-normal">
                    Dimensions
                  </th>
                  <th scope="col" className="caption py-3 pr-4 font-normal">
                    Weight
                  </th>
                  <th scope="col" className="caption py-3 font-normal">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.slug} className="border-b border-rule">
                    <td className="py-4 pr-4">
                      <Link
                        href={`/product/${product.slug}`}
                        className="link-nav body-sm text-fg"
                      >
                        {product.title}
                      </Link>
                    </td>
                    <td className="tabular py-4 pr-4 text-[0.8125rem] text-fg-soft">
                      {product.dimensions.l} × {product.dimensions.w} × {product.dimensions.h}{' '}
                      {product.dimensions.unit}
                      {product.dimensions.basis === 'package' ? (
                        <span className="caption block">packaged</span>
                      ) : null}
                    </td>
                    <td className="tabular py-4 pr-4 text-[0.8125rem] text-fg-soft">
                      {product.weightGrams} g
                    </td>
                    <td className="body-sm py-4">{product.netQuantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="caption mt-4">
            Where a row is marked “packaged”, the figure is the shipping carton rather than
            the jewellery — we have asked our manufacturer for item-level dimensions on those
            two sets and will replace them as soon as we have them.
          </p>
        </section>

        <div className="mt-20">
          <RuleDot />
        </div>
      </div>
    </>
  );
}
