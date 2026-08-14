import Link from 'next/link';
import { LogoLockup } from '@/components/brand/Logo';
import { MarkShield, RuleDot } from '@/components/brand/Motifs';
import { NewsletterForm } from './NewsletterForm';
import { COMMERCE, FOOTER_NAV, PENDING_CLIENT_DATA, SITE } from '@/lib/site';

/**
 * Footer.
 *
 * Also carries the disclosures required by the Consumer Protection
 * (E-Commerce) Rules 2020: legal entity, registered address, customer care and
 * a named Grievance Officer with a response SLA. Values marked [PENDING] come
 * from lib/site.ts and must be replaced before launch.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-ground="dark" data-grain className="overflow-x-clip">
      {/* ---- Newsletter ---- */}
      <div className="shell section-tight">
        <div className="grid gap-10 md:grid-cols-[1fr_auto] md:items-end md:gap-20">
          <div>
            <p className="eyebrow">The Letter</p>
            <h2 className="display-md mt-5 max-w-[16ch] text-fg">
              First look, first pieces, {COMMERCE.firstOrderDiscountPercent}% off your first
              order.
            </h2>
          </div>
          <div className="w-full md:max-w-sm">
            <NewsletterForm compact />
          </div>
        </div>
      </div>

      <div className="shell">
        <RuleDot />
      </div>

      {/* ---- Navigation ---- */}
      <div className="shell py-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_repeat(3,1fr)] md:gap-10">
          <div>
            <LogoLockup className="!items-start" strapline={false} />
            <p className="body-sm mt-6 max-w-[30ch]">{SITE.tagline}.</p>
            <div className="mt-6 flex flex-col gap-2">
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer noopener"
                className="link-rule caption uppercase tracking-[0.18em] text-fg"
              >
                Instagram {SITE.instagramHandle}
              </a>
              <a
                href={SITE.amazonStorefront}
                target="_blank"
                rel="noreferrer noopener"
                className="link-rule caption uppercase tracking-[0.18em] text-fg"
              >
                Also on Amazon.in
              </a>
            </div>
          </div>

          {FOOTER_NAV.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h2 className="eyebrow">{column.title}</h2>
              <ul className="mt-5 flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="link-nav body-sm text-fg-soft">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      {/* ---- Statutory disclosures ---- */}
      <div className="border-t border-rule">
        <div className="shell py-10">
          <h2 className="eyebrow">Seller &amp; Grievance Redressal</h2>
          <div className="mt-5 grid gap-x-10 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <p className="caption text-fg-mute">Legal entity</p>
              <p className="caption mt-1 text-fg-soft">{PENDING_CLIENT_DATA.legalEntity}</p>
            </div>
            <div>
              <p className="caption text-fg-mute">Registered address</p>
              <p className="caption mt-1 text-fg-soft">
                {PENDING_CLIENT_DATA.registeredAddress}
              </p>
            </div>
            <div>
              <p className="caption text-fg-mute">Customer care</p>
              <p className="caption mt-1 text-fg-soft">
                <a href={`mailto:${PENDING_CLIENT_DATA.customerCareEmail}`} className="link-rule">
                  {PENDING_CLIENT_DATA.customerCareEmail}
                </a>
                <br />
                {PENDING_CLIENT_DATA.customerCareHours}
              </p>
            </div>
            <div>
              <p className="caption text-fg-mute">Grievance Officer</p>
              <p className="caption mt-1 text-fg-soft">
                {PENDING_CLIENT_DATA.grievanceOfficerName}
                <br />
                <a
                  href={`mailto:${PENDING_CLIENT_DATA.grievanceOfficerEmail}`}
                  className="link-rule"
                >
                  {PENDING_CLIENT_DATA.grievanceOfficerEmail}
                </a>
                <br />
                Response within {PENDING_CLIENT_DATA.grievanceResponseSlaDays} working days
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ---- Oversized wordmark ----
           The brand name set at viewport width and clipped by the footer's
           own overflow, so it reads as a watermark the page is printed on
           rather than another line of navigation. Decorative: the accessible
           name is already carried by the lockup above. */}
      <div className="shell pt-10 pb-2" aria-hidden="true">
        <span className="text-watermark block w-full text-center text-[19vw] leading-[0.8] font-normal tracking-[0.06em] uppercase [font-family:var(--font-display)] select-none">
          Kshyovrata
        </span>
      </div>

      {/* ---- Base ---- */}
      <div className="border-t border-rule">
        <div className="shell flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <p className="caption">
            © {year} {SITE.name}. Made in India.
          </p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="caption flex items-center gap-2">
              <MarkShield className="h-3.5 w-3.5" />
              Secure payment via UPI, cards, netbanking &amp; COD
            </span>
            <Link href="/policies/terms" className="link-nav caption">
              Terms
            </Link>
            <Link href="/policies/privacy" className="link-nav caption">
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
