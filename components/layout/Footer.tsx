import Link from 'next/link';
import { LogoLockup } from '@/components/brand/Logo';
import { IconInstagram, LogoAmazon, MarkShield, RuleDot } from '@/components/brand/Motifs';
import { WatermarkStars } from '@/components/brand/WatermarkStars';
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
                className="link-rule caption !inline-flex w-fit items-center gap-2.5 uppercase tracking-[0.18em] text-fg"
              >
                <IconInstagram className="h-[1.15rem] w-[1.15rem] shrink-0" />
                Instagram {SITE.instagramHandle}
              </a>
              {/* The wordmark finishes the sentence rather than prefixing it —
                  "Also on [amazon]" — so the logo is the destination itself and
                  not a bullet in front of a label repeating it. */}
              <a
                href={SITE.amazonStorefront}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Also on Amazon.in"
                className="link-rule caption !inline-flex w-fit items-center gap-2.5 uppercase tracking-[0.18em] text-fg"
              >
                Also on
                <LogoAmazon className="h-[1.15rem] w-auto shrink-0 translate-y-[18%]" />
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
      <div className="shell pb-2 [container-type:inline-size]" aria-hidden="true">
        {/* The letterforms are stretched 25% on the vertical axis rather than
            set 25% larger: the type size is tuned so the word measures exactly
            one shell wide, and growing the font would push the K and the A
            past the clip. Origin is the baseline, so the extra height grows
            upward and the space above has to absorb it.

            That space is in cqw, not rem, because the word itself is: at 15.8cqw
            it is ~190px tall on a desktop shell but only ~53px on a 375px
            phone, so a flat top padding that breathes on desktop opens a gap
            taller than the word on mobile. The inner div carries it because a
            container cannot size its own padding from its own cq units. */}
        {/* The stars are painted after the word, so they cross in front of it
            rather than behind — at 40% the watermark is too faint to occlude
            anything convincingly. */}
        <div className="relative pt-[5.5cqw]">
          <span className="text-watermark block w-full origin-bottom scale-y-125 text-center text-[15.8cqw] leading-[0.8] font-normal tracking-[0.06em] -me-[0.06em] uppercase [font-family:var(--font-display)] select-none">
            Kshyovrata
          </span>
          <WatermarkStars />
        </div>
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
