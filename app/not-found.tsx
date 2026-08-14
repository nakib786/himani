import Link from 'next/link';
import { MoonStars, RuleDot } from '@/components/brand/Motifs';

export default function NotFound() {
  return (
    <div className="shell section flex flex-col items-center text-center">
      <MoonStars className="h-10 w-14 text-fg-mute" />
      <p className="index-num mt-8">404</p>
      <h1 className="display-lg mt-4 max-w-[16ch] text-fg">
        This page has gone somewhere else
      </h1>
      <p className="body-lg mt-5 max-w-[44ch]">
        The link may be old, or the piece may have moved. The house is small — you will find
        it quickly from here.
      </p>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <Link href="/shop" className="btn btn-primary">
          Shop everything
        </Link>
        <Link href="/" className="btn btn-secondary">
          Back to the home page
        </Link>
      </div>

      <div className="mt-16 w-full max-w-md">
        <RuleDot />
      </div>
    </div>
  );
}
