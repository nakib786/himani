import type { Metadata } from 'next';
import Link from 'next/link';

import { LogoAmazon } from '@/components/brand/Motifs';
import { PageHero } from '@/components/ui/PageHero';
import { ContactForm } from './ContactForm';
import { COMMERCE, PENDING_CLIENT_DATA, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Contact & Grievance Redressal',
  description:
    'Get in touch with Kshyovrata about an order, a return or a product question. Customer care details and our named Grievance Officer under the Consumer Protection (E-Commerce) Rules 2020.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Contact"
        title="Talk to a person"
        lede="A small house means your message is read by someone who can actually do something about it."
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Contact', href: '/contact' },
        ]}
      />

      <div className="shell section-tight">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

          <aside className="lg:col-span-5">
            {/* ---- Customer care ---- */}
            <section className="border-t border-rule pt-5">
              <h2 className="eyebrow eyebrow-ink">Customer care</h2>
              <dl className="mt-5 flex flex-col gap-4">
                <div>
                  <dt className="caption text-fg-mute">Email</dt>
                  <dd className="body-sm mt-1">
                    <a
                      href={`mailto:${PENDING_CLIENT_DATA.customerCareEmail}`}
                      className="link-rule text-fg"
                    >
                      {PENDING_CLIENT_DATA.customerCareEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="caption text-fg-mute">Phone</dt>
                  <dd className="body-sm mt-1 text-fg">
                    {PENDING_CLIENT_DATA.customerCarePhone}
                  </dd>
                </div>
                <div>
                  <dt className="caption text-fg-mute">Hours</dt>
                  <dd className="body-sm mt-1">{PENDING_CLIENT_DATA.customerCareHours}</dd>
                </div>
              </dl>
            </section>

            {/* ---- Grievance officer (E-Commerce Rules 2020) ---- */}
            <section className="mt-10 border border-rule-strong p-6 md:p-8">
              <h2 className="eyebrow eyebrow-ink">Grievance Officer</h2>
              <p className="caption mt-3">
                Named under the Consumer Protection (E-Commerce) Rules, 2020.
              </p>
              <dl className="mt-5 flex flex-col gap-4">
                <div>
                  <dt className="caption text-fg-mute">Officer</dt>
                  <dd className="body-sm mt-1 text-fg">
                    {PENDING_CLIENT_DATA.grievanceOfficerName}
                  </dd>
                </div>
                <div>
                  <dt className="caption text-fg-mute">Email</dt>
                  <dd className="body-sm mt-1">
                    <a
                      href={`mailto:${PENDING_CLIENT_DATA.grievanceOfficerEmail}`}
                      className="link-rule text-fg"
                    >
                      {PENDING_CLIENT_DATA.grievanceOfficerEmail}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="caption text-fg-mute">Response time</dt>
                  <dd className="body-sm mt-1">
                    Acknowledged within 48 hours, resolved within{' '}
                    {PENDING_CLIENT_DATA.grievanceResponseSlaDays} working days.
                  </dd>
                </div>
                <div>
                  <dt className="caption text-fg-mute">Registered entity</dt>
                  <dd className="body-sm mt-1">
                    {PENDING_CLIENT_DATA.legalEntity}
                    <br />
                    {PENDING_CLIENT_DATA.registeredAddress}
                  </dd>
                </div>
              </dl>
            </section>

            {/* ---- Quick answers ---- */}
            <section className="mt-10">
              <h2 className="eyebrow eyebrow-ink">Before you write</h2>
              <ul className="mt-5 flex flex-col gap-3">
                <li>
                  <Link href="/track-order" className="link-nav body-sm text-fg-soft">
                    Where is my order?
                  </Link>
                </li>
                <li>
                  <Link href="/policies/returns" className="link-nav body-sm text-fg-soft">
                    How do I return something? ({COMMERCE.returnWindowDays} days)
                  </Link>
                </li>
                <li>
                  <Link href="/care" className="link-nav body-sm text-fg-soft">
                    How do I stop it tarnishing?
                  </Link>
                </li>
                <li>
                  <Link href="/size-guide" className="link-nav body-sm text-fg-soft">
                    What length is the chain?
                  </Link>
                </li>
                <li>
                  <a
                    href={SITE.amazonStorefront}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label="I ordered on Amazon, not here"
                    className="link-nav body-sm text-fg-soft"
                  >
                    {/* Set inline mid-sentence rather than as a leading badge:
                        this is the one outbound link in a column of internal
                        ones, and anything in front of it would break the left
                        edge the other questions share. Height is in `em` and
                        the baseline is nudged so the wordmark's lowercase
                        matches the x-height of the sentence around it. */}
                    I ordered on{' '}
                    <LogoAmazon className="inline-block h-[0.97em] w-auto align-[-0.41em]" />,
                    not here
                  </a>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </>
  );
}
