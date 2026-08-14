import { COMMERCE, PENDING_CLIENT_DATA, SITE } from './site';
import type { JournalBlock } from './types';

/**
 * Policy pages.
 *
 * Written in plain English, per §10 of the brief. Where a figure comes from a
 * business rule it is interpolated from lib/site.ts so the policy can never
 * drift out of step with what checkout actually charges.
 *
 * ⚠ These are drafted to be complete and readable, and they reflect the
 * business rules implemented in this build. They are NOT legal advice and have
 * not been reviewed by a lawyer. Have the client's counsel or CA read them
 * before launch — particularly the GST wording and the DPDP Act commitments.
 */

export type Policy = {
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  updated: string;
  intro: string;
  body: JournalBlock[];
};

const UPDATED = '2026-08-13';

const ENTITY = `${PENDING_CLIENT_DATA.legalEntity}, ${PENDING_CLIENT_DATA.registeredAddress}`;

export const POLICIES: Policy[] = [
  /* ------------------------------------------------------------------------ */
  {
    slug: 'shipping',
    title: 'Shipping',
    seoTitle: 'Shipping Policy — Delivery Times & Charges',
    seoDescription: `Free shipping above ₹${COMMERCE.freeShippingThreshold} across India. Dispatch in 1–2 working days, delivery in 2–7 days. Cash on delivery available up to ₹${COMMERCE.codCap}.`,
    updated: UPDATED,
    intro: `We ship across India. Orders above ₹${COMMERCE.freeShippingThreshold} ship free; below that a flat ₹${COMMERCE.standardShipping} applies.`,
    body: [
      { type: 'h2', text: 'Dispatch' },
      {
        type: 'p',
        text: 'Orders placed before 2pm IST on a working day are usually dispatched the same day. Everything else goes out within one to two working days. We do not dispatch on Sundays or national holidays.',
      },
      { type: 'h2', text: 'Delivery times' },
      {
        type: 'list',
        items: [
          'Metro cities: two to four working days from dispatch',
          'Other cities and towns: four to seven working days from dispatch',
          'Remote PIN codes may take longer; the courier will contact you directly',
        ],
      },
      {
        type: 'p',
        text: 'The estimate shown on a product page and at checkout comes from a live PIN code lookup. It is an estimate, not a guarantee — couriers occasionally run late, and we will tell you if yours does.',
      },
      { type: 'h2', text: 'Charges' },
      {
        type: 'list',
        items: [
          `Orders of ₹${COMMERCE.freeShippingThreshold} and above: free`,
          `Orders below ₹${COMMERCE.freeShippingThreshold}: flat ₹${COMMERCE.standardShipping}`,
          `Cash on delivery: an additional ₹${COMMERCE.codFee} handling fee, non-refundable`,
          `Prepaid orders: ₹${COMMERCE.prepaidDiscount} off, applied at checkout`,
        ],
      },
      { type: 'h2', text: 'Cash on delivery' },
      {
        type: 'p',
        text: `Available on orders up to ₹${COMMERCE.codCap}. We confirm cash-on-delivery orders by phone or WhatsApp before dispatch. If we cannot reach you after two attempts across two days, the order is cancelled and nothing is charged.`,
      },
      { type: 'h2', text: 'Tracking' },
      {
        type: 'p',
        text: 'You get a tracking link over WhatsApp and email as soon as the parcel is picked up. You can also track it with your order number and mobile number on our track-order page — no account needed.',
      },
      { type: 'h2', text: 'If something goes wrong' },
      {
        type: 'p',
        text: `If your parcel is marked delivered and you do not have it, or it arrives damaged, tell us within 48 hours at ${PENDING_CLIENT_DATA.customerCareEmail}. Photographs of the package help. We will chase the courier and replace or refund the order.`,
      },
      { type: 'note', text: `Shipped by ${ENTITY}.` },
    ],
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: 'returns',
    title: 'Returns',
    seoTitle: `Returns Policy — ${COMMERCE.returnWindowDays}-Day Easy Returns`,
    seoDescription: `Return any Kshyovrata piece within ${COMMERCE.returnWindowDays} days of delivery, unworn and in its packaging. Free reverse pickup across India.`,
    updated: UPDATED,
    intro: `You have ${COMMERCE.returnWindowDays} days from delivery to change your mind. The piece needs to come back unworn and in the packaging it arrived in.`,
    body: [
      { type: 'h2', text: 'What you can return' },
      {
        type: 'p',
        text: `Anything, within ${COMMERCE.returnWindowDays} days of delivery, as long as it is unworn, undamaged, and in its original packaging with any tags still attached. For hygiene reasons we can only accept earrings back if the sealed backing is intact.`,
      },
      { type: 'h2', text: 'How to start one' },
      {
        type: 'list',
        items: [
          `Email ${PENDING_CLIENT_DATA.customerCareEmail} with your order number and what you would like to return`,
          'We reply the same working day with a pickup slot',
          'Keep the piece in its packaging; the courier collects from your address',
          'Free reverse pickup wherever our courier partners operate',
        ],
      },
      { type: 'h2', text: 'Faulty or wrong items' },
      {
        type: 'p',
        text: 'If a piece arrives damaged, or is not what you ordered, tell us within 48 hours with a photograph. We replace it or refund it in full, including any shipping you paid, and we arrange the pickup at our cost.',
      },
      { type: 'h2', text: 'Exchanges' },
      {
        type: 'p',
        text: 'We do not run a separate exchange process. Return the piece for a refund and place a new order — it is faster than holding stock against a swap.',
      },
      { type: 'h2', text: 'Refund timing' },
      {
        type: 'p',
        text: 'See our refunds policy for how and when the money reaches you.',
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: 'refunds',
    title: 'Refunds',
    seoTitle: 'Refunds Policy — How and When You Get Your Money Back',
    seoDescription:
      'Refunds are issued to the original payment method within 5–7 working days of the returned item passing inspection. Cash on delivery orders are refunded by bank transfer.',
    updated: UPDATED,
    intro:
      'Once a returned piece reaches us and passes a quick inspection, the money goes back the way it came.',
    body: [
      { type: 'h2', text: 'Inspection' },
      {
        type: 'p',
        text: 'We check returned pieces within two working days of receiving them. If a piece has been worn, altered or damaged, we will contact you with photographs before making any decision, and send it back to you at no charge if you would rather keep it.',
      },
      { type: 'h2', text: 'How the money comes back' },
      {
        type: 'list',
        items: [
          'Prepaid orders (UPI, card, netbanking, wallet): refunded to the original payment method within five to seven working days of inspection',
          'Cash on delivery orders: refunded by bank transfer — we will ask for your account details, and never for a card number, OTP or UPI PIN',
          `The ₹${COMMERCE.codFee} cash-on-delivery handling fee is not refundable, since the courier has already been paid for it`,
          'Shipping charges are refunded only where the return is our fault',
        ],
      },
      { type: 'h2', text: 'Cancellations' },
      {
        type: 'p',
        text: 'You can cancel any order before it is dispatched by emailing us — prepaid orders are refunded in full with no deduction. Once a parcel is with the courier it has to come back as a return.',
      },
      {
        type: 'note',
        text: 'Nobody from Kshyovrata will ever ask you for an OTP, a UPI PIN, a card number or a screen-sharing app to process a refund. If someone does, it is not us.',
      },
    ],
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: 'privacy',
    title: 'Privacy',
    seoTitle: 'Privacy Policy — What We Collect and Why',
    seoDescription:
      'What data Kshyovrata collects, why we collect it, how long we keep it, and how to have it deleted. Written to the Digital Personal Data Protection Act, 2023.',
    updated: UPDATED,
    intro:
      'Written to the Digital Personal Data Protection Act, 2023. Short version: we collect what an order needs, we do not sell it, and you can have it deleted.',
    body: [
      { type: 'h2', text: 'What we collect' },
      {
        type: 'list',
        items: [
          'Your name, email, phone number and delivery address — to fulfil and deliver your order',
          'Your order history — to handle returns, refunds and support',
          'Your PIN code, when you check delivery — sent to the India Post public lookup and not stored against you',
          'GSTIN and business name, only if you ask for a GST invoice',
          'Analytics about how the site is used — only if you accept analytics cookies',
        ],
      },
      {
        type: 'p',
        text: 'We never see your card details, UPI ID or bank credentials. Those go directly to our payment processor.',
      },
      { type: 'h2', text: 'Cookies' },
      {
        type: 'p',
        text: 'Strictly necessary cookies keep your bag and your session working; those cannot be turned off without breaking the shop. Analytics cookies are off until you accept them, and declining changes nothing about how you can shop here.',
      },
      { type: 'h2', text: 'Who we share it with' },
      {
        type: 'list',
        items: [
          'Our courier partners, to deliver your parcel — name, address, phone number',
          'Our payment processor, to take payment',
          'Our messaging and email providers, to send you order updates',
          'Government authorities, where the law requires it',
        ],
      },
      { type: 'p', text: 'We do not sell your personal data. We do not rent it either.' },
      { type: 'h2', text: 'How long we keep it' },
      {
        type: 'p',
        text: 'Order records are kept for eight years, because tax law requires it. Marketing contact details are kept until you unsubscribe. Analytics data is retained for fourteen months.',
      },
      { type: 'h2', text: 'Your rights' },
      {
        type: 'list',
        items: [
          'Ask for a copy of the personal data we hold about you',
          'Ask us to correct anything that is wrong',
          'Ask us to erase it, where we are not legally required to keep it',
          'Withdraw consent for marketing or analytics at any time',
          'Nominate someone to exercise these rights on your behalf',
        ],
      },
      {
        type: 'p',
        text: `Write to ${PENDING_CLIENT_DATA.grievanceOfficerEmail} and we will respond within ${PENDING_CLIENT_DATA.grievanceResponseSlaDays} working days. If you are not satisfied, you may complain to the Data Protection Board of India.`,
      },
      { type: 'note', text: `Data fiduciary: ${ENTITY}.` },
    ],
  },

  /* ------------------------------------------------------------------------ */
  {
    slug: 'terms',
    title: 'Terms',
    seoTitle: 'Terms & Conditions',
    seoDescription: `The terms on which ${SITE.name} sells through this website, including pricing, taxes, orders and governing law.`,
    updated: UPDATED,
    intro: `These terms govern your use of ${SITE.url} and any order you place through it.`,
    body: [
      { type: 'h2', text: 'Who you are buying from' },
      {
        type: 'p',
        text: `This website is operated by ${ENTITY}. Kshyovrata is the brand under which it sells.`,
      },
      { type: 'h2', text: 'Prices and taxes' },
      {
        type: 'list',
        items: [
          'All prices are in Indian Rupees and inclusive of GST',
          'Our products are imitation jewellery, classified under HSN 7117',
          'The MRP shown is the maximum retail price; the price you pay is the one displayed at checkout',
          'We may change prices at any time, but never after you have placed an order',
        ],
      },
      { type: 'h2', text: 'Orders' },
      {
        type: 'p',
        text: 'An order is an offer to buy. It is accepted when we dispatch it. If a piece turns out to be unavailable, or a price was listed in error, we may cancel before dispatch and refund you in full — we will tell you why.',
      },
      { type: 'h2', text: 'Product images and descriptions' },
      {
        type: 'p',
        text: 'We photograph our pieces as accurately as we can, but screens render colour differently and gold plating photographs warmer than it looks in daylight. Minor variation is normal and is not a defect. Where we do not yet have verified material specifications, we say so rather than estimate.',
      },
      { type: 'h2', text: 'Acceptable use' },
      {
        type: 'p',
        text: 'Do not scrape, resell, or copy the content of this site without permission. Our photographs, copy and brand marks belong to us.',
      },
      { type: 'h2', text: 'Liability' },
      {
        type: 'p',
        text: 'Our liability for any order is limited to the amount you paid for it. Nothing in these terms limits your rights under the Consumer Protection Act, 2019.',
      },
      { type: 'h2', text: 'Governing law' },
      {
        type: 'p',
        text: 'These terms are governed by Indian law, and the courts of the jurisdiction in which our registered office sits will have exclusive jurisdiction.',
      },
      { type: 'h2', text: 'Grievance redressal' },
      {
        type: 'p',
        text: `Under the Consumer Protection (E-Commerce) Rules, 2020, our Grievance Officer is ${PENDING_CLIENT_DATA.grievanceOfficerName}, reachable at ${PENDING_CLIENT_DATA.grievanceOfficerEmail}. Complaints are acknowledged within 48 hours and resolved within ${PENDING_CLIENT_DATA.grievanceResponseSlaDays} working days.`,
      },
    ],
  },
];

export function getPolicy(slug: string): Policy | undefined {
  return POLICIES.find((p) => p.slug === slug);
}
