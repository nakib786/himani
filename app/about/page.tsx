import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { LogoLockup } from '@/components/brand/Logo';
import { MoonStars, RuleDot, Sunburst } from '@/components/brand/Motifs';
import { PageHero } from '@/components/ui/PageHero';
import { Reveal } from '@/components/ui/Reveal';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About the House',
  description:
    'Kshyovrata is an Indian fine fashion jewellery house making gold and rose-gold plated pieces designed to be worn daily. How the name is said, what we make, and what we will not claim.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="The House"
        title="Jewellery that behaves like it costs more"
        lede="Kshyovrata makes gold and rose-gold plated pieces in India, priced between ₹399 and ₹899, and designed so that wearing them on an ordinary Tuesday is the entire point."
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'About', href: '/about' },
        ]}
      />

      {/* ---- Pronunciation ------------------------------------------------
          Brief §8 asks for a pronunciation line, because the name will be
          mistyped and mis-said. This is a phonetic reading of the spelling,
          NOT a claim about the name's origin or meaning — see the note in
          OPEN-QUESTIONS.md. No etymology is invented here. */}
      <section className="shell section-tight">
        <div className="grid gap-10 md:grid-cols-12 md:gap-16">
          <div className="md:col-span-5">
            <p className="eyebrow">How to say it</p>
            <p className="display-lg mt-5 text-fg">
              kshyo<span className="text-fg-mute">·</span>vra
              <span className="text-fg-mute">·</span>ta
            </p>
          </div>
          <div className="md:col-span-7">
            <p className="body-lg measure">
              Four syllables, stress on the second. It is not an easy name, and we are not
              going to pretend otherwise — but it is ours, and it is on the box.
            </p>
            <p className="body-lg measure mt-4">
              If you found us by typing something close and hoping, that worked on purpose.
            </p>
          </div>
        </div>
      </section>

      <div className="shell">
        <RuleDot />
      </div>

      {/* ---- Story ---- */}
      <section className="shell section">
        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-5">
            <div className="plate">
              <Image
                src="/products/sunburst-studs/05.jpg"
                alt="Sunburst studs resting on a weathered travertine surface"
                width={500}
                height={500}
                sizes="(min-width: 768px) 40vw, 100vw"
              />
            </div>
          </Reveal>

          <Reveal className="md:col-span-7" index={1}>
            <p className="eyebrow">Where this started</p>
            <h2 className="display-md mt-5 max-w-[20ch] text-fg">
              A shelf we decided to walk off
            </h2>

            <div className="measure mt-6 flex flex-col gap-4">
              <p className="body-lg">
                Kshyovrata launched on Amazon in July 2026 and, like every new jewellery
                seller there, landed on a shelf where the competition advertises 89% off and
                counts its reviews in the thousands. You can win that fight by cutting price
                until nothing is left, or you can stop fighting it.
              </p>
              <p className="body-lg">
                This site is the second option. Same pieces, same prices — but the finish,
                the packaging, the photographs and the answers to your questions are all
                here, where we control them. The marketplace stays open, because that is
                where people find us. This is where we would rather you stayed.
              </p>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <Sunburst className="h-8 w-16 text-accent" />
                <h3 className="display-sm mt-4 text-fg">What we make</h3>
                <p className="body-sm mt-2">
                  Five pieces. Butterflies drawn as outlines, hexagons cut hollow, a sun with
                  rays struck one at a time. Nothing solid where it could be open, because
                  weight is what makes jewellery come off at lunchtime.
                </p>
              </div>
              <div>
                <MoonStars className="h-8 w-11 text-accent" />
                <h3 className="display-sm mt-4 text-fg">What we will not claim</h3>
                <p className="body-sm mt-2">
                  We are not printing a nickel-free badge we cannot evidence, or a
                  plating-life figure nobody has measured. When our manufacturer confirms
                  those numbers, they go on every product page. Until then, they are absent
                  rather than invented.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---- Identity ---- */}
      <section className="border-y border-rule bg-bg-lift">
        <div className="shell section-tight">
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <LogoLockup />
            </div>
            <div className="md:col-span-8">
              <p className="eyebrow">The mark</p>
              <h2 className="display-md mt-5 max-w-[20ch] text-fg">
                A moon, some stars, and a sun coming up
              </h2>
              <p className="body-lg measure mt-5">
                The house mark holds a serif monogram inside two open crescents, with a
                crescent moon and scattered stars above and a rising sunburst below. Those
                three motifs are not decoration borrowed from a template — they are the
                pieces themselves. The Sunburst studs are the sun. The line is drawn in
                black on white and stays that way.
              </p>
              <p className="caption mt-5">
                The strapline inside the mark reads Commerce · Trust · Growth. It belongs to
                the business, not to the jewellery, which is why you will not find it
                anywhere else on this site.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---- Elsewhere ---- */}
      <section className="shell section-tight">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow">Find us elsewhere</p>
            <p className="body-lg mt-3 max-w-[40ch]">
              Nineteen followers and four posts, at the time of writing. Come in early.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-secondary"
            >
              Instagram
            </a>
            <a
              href={SITE.amazonStorefront}
              target="_blank"
              rel="noreferrer noopener"
              className="btn btn-ghost"
            >
              Amazon.in
            </a>
            <Link href="/shop" className="btn btn-primary">
              Shop the range
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
