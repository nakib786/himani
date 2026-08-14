import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { CheckoutFlow } from './CheckoutFlow';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Kshyovrata order.',
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        index="02"
        eyebrow="Checkout"
        title="Almost yours"
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Bag', href: '/cart' },
          { name: 'Checkout', href: '/checkout' },
        ]}
      />
      <div className="shell pt-12 pb-20 md:pb-28">
        <CheckoutFlow />
      </div>
    </>
  );
}
