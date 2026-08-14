import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { TrackForm } from './TrackForm';
import { COMMERCE, SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Track Your Order',
  description:
    'Track a Kshyovrata order with your order number and mobile number. No account needed.',
  alternates: { canonical: '/track-order' },
};

export default function TrackOrderPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Orders"
        title="Where is it?"
        lede="Your order number and the mobile number you used. No account, no password."
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Track order', href: '/track-order' },
        ]}
      />

      <div className="shell section-tight">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <TrackForm />
          </div>

          <aside className="lg:col-span-5 lg:col-start-8">
            <div className="border-t border-rule pt-5">
              <h2 className="eyebrow eyebrow-ink">What to expect</h2>
              <ol className="mt-6 border-t border-rule">
                {[
                  {
                    title: 'Confirmed',
                    detail:
                      'Straight after you order. You get a WhatsApp message and an email.',
                  },
                  {
                    title: 'Dispatched',
                    detail: 'Within one to two working days, with a tracking link.',
                  },
                  {
                    title: 'Out for delivery',
                    detail: 'Two to seven days from dispatch, depending on your PIN code.',
                  },
                  {
                    title: 'Delivered',
                    detail: `Your ${COMMERCE.returnWindowDays}-day return window starts here.`,
                  },
                ].map((step, i) => (
                  <li key={step.title} className="flex gap-5 border-b border-rule py-5">
                    <span className="index-num shrink-0 pt-0.5">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div>
                      <h3 className="body-sm text-fg">{step.title}</h3>
                      <p className="caption mt-1">{step.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="mt-10 border border-rule-strong p-6">
              <h2 className="eyebrow eyebrow-ink">Ordered on Amazon?</h2>
              <p className="body-sm mt-3">
                Orders placed through the marketplace are tracked in your Amazon account, not
                here.
              </p>
              <a
                href={SITE.amazonStorefront}
                target="_blank"
                rel="noreferrer noopener"
                className="link-rule caption mt-4 inline-block uppercase text-fg"
              >
                Go to Amazon.in
              </a>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
