import type { Metadata } from 'next';
import Link from 'next/link';

import { RuleDot } from '@/components/brand/Motifs';
import { PageHero } from '@/components/ui/PageHero';
import { BRAND_CARE } from '@/lib/catalogue';
import { PENDING_CLIENT_DATA } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Jewellery Care & Material Guide',
  description:
    'How to keep gold-plated jewellery from tarnishing: what to keep it away from, how to clean it safely, and how to store it. The official Kshyovrata care guide.',
  alternates: { canonical: '/care' },
};

export default function CarePage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Care"
        title="Keeping plated jewellery looking new"
        lede="Plating is a surface. Treat it like one and it lasts a long time; put it through perfume, chlorine and a hot shower and it will not. Everything below is the difference."
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Care', href: '/care' },
        ]}
      />

      <div className="shell section-tight">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            {/* ---- Principles ---- */}
            <section>
              <h2 className="eyebrow eyebrow-ink">The four rules</h2>
              <ol className="mt-6 border-t border-rule">
                {BRAND_CARE.principles.map((principle, i) => (
                  <li
                    key={principle.title}
                    className="flex gap-5 border-b border-rule py-6 md:gap-8"
                  >
                    <span className="index-num shrink-0 pt-1">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="display-sm text-fg">{principle.title}</h3>
                      <p className="body-sm mt-2">{principle.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {/* ---- Cleaning ---- */}
            <section className="mt-16">
              <h2 className="eyebrow eyebrow-ink">Cleaning, step by step</h2>
              <ol className="mt-6 border-t border-rule">
                {BRAND_CARE.cleaningSteps.map((step, i) => (
                  <li key={step} className="flex gap-5 border-b border-rule py-5 md:gap-8">
                    <span className="index-num shrink-0 pt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="body-sm">{step}</p>
                  </li>
                ))}
              </ol>
              <p className="caption mt-5">
                Do this only when the piece actually needs it. A dry wipe after wearing does
                more for plating over a year than a monthly soak.
              </p>
            </section>
          </div>

          {/* ---- Notes ---- */}
          <aside className="lg:col-span-5">
            <div className="border border-rule-strong p-6 md:p-8">
              <h2 className="eyebrow eyebrow-ink">Worth knowing</h2>
              <ul className="mt-5 flex flex-col gap-4">
                {BRAND_CARE.notes.map((note) => (
                  <li key={note} className="flex gap-3">
                    <span
                      className="mt-2.5 h-px w-3 shrink-0 bg-rule-strong"
                      aria-hidden="true"
                    />
                    <span className="body-sm">{note}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 border border-rule-strong p-6 md:p-8">
              <h2 className="eyebrow eyebrow-ink">On materials</h2>
              <p className="body-sm mt-4">
                We are finalising verified base-metal, plating-thickness and nickel-content
                figures with our manufacturer. Rather than publish an estimate, we are
                leaving those fields empty until they are confirmed — and then they will
                appear on every product page.
              </p>
              <p className="body-sm mt-4">
                If you have a nickel sensitivity and need an answer before you order, write
                to us and we will tell you exactly what our supplier has confirmed, and what
                they have not.
              </p>
              <a
                href={`mailto:${PENDING_CLIENT_DATA.customerCareEmail}`}
                className="link-rule caption mt-5 inline-block uppercase text-fg"
              >
                {PENDING_CLIENT_DATA.customerCareEmail}
              </a>
            </div>

            <div className="mt-8">
              <Link href="/journal/keep-gold-plated-jewellery-from-tarnishing" className="btn btn-secondary btn-block">
                Read: why plating tarnishes
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
