import type { Metadata } from 'next';
import { PageHero } from '@/components/ui/PageHero';
import { CartPageContent } from './CartPageContent';

export const metadata: Metadata = {
  title: 'Your Bag',
  description: 'Review the pieces in your bag before checking out.',
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <>
      <PageHero
        index="01"
        eyebrow="Checkout"
        title="Your bag"
        crumbs={[
          { name: 'Home', href: '/' },
          { name: 'Bag', href: '/cart' },
        ]}
      />
      <div className="shell pt-12 pb-20 md:pb-28">
        <CartPageContent />
      </div>
    </>
  );
}
