'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';

import { useCart } from '@/components/cart/CartProvider';
import { MarkShield, MoonStars } from '@/components/brand/Motifs';
import { cx, formatPrice, formatShortDate } from '@/lib/format';
import { COMMERCE } from '@/lib/site';

/* -------------------------------------------------------------------------- */

type Step = 'contact' | 'address' | 'delivery' | 'payment';

const STEPS: { key: Step; label: string }[] = [
  { key: 'contact', label: 'Contact' },
  { key: 'address', label: 'Address' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'payment', label: 'Payment' },
];

/**
 * Payment methods, UPI first.
 *
 * That order is not cosmetic — UPI is the dominant rail in Indian e-commerce,
 * and burying it under card fields costs conversions at this price point
 * (brief §5).
 */
const PAYMENT_METHODS = [
  { key: 'upi', label: 'UPI', note: 'GPay, PhonePe, Paytm, any UPI app', prepaid: true },
  { key: 'card', label: 'Card', note: 'Credit, debit and EMI', prepaid: true },
  { key: 'netbanking', label: 'Netbanking', note: 'All major banks', prepaid: true },
  { key: 'wallet', label: 'Wallet', note: 'Paytm, Amazon Pay, Mobikwik', prepaid: true },
  {
    key: 'cod',
    label: 'Cash on delivery',
    note: `${formatPrice(COMMERCE.codFee)} handling fee · up to ${formatPrice(COMMERCE.codCap)}`,
    prepaid: false,
  },
] as const;

type PaymentKey = (typeof PAYMENT_METHODS)[number]['key'];

/* -------------------------------------------------------------------------- */

export function CheckoutFlow() {
  const { lines, subtotal, savings, hydrated, giftMessage } = useCart();

  const [step, setStep] = useState<Step>('contact');
  const [payment, setPayment] = useState<PaymentKey>('upi');
  const [pinLookup, setPinLookup] = useState<{ city: string; state: string } | null>(null);
  const [pinError, setPinError] = useState('');
  const [eta, setEta] = useState<{ earliest: string; latest: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitNote, setSubmitNote] = useState('');
  const [gstInvoice, setGstInvoice] = useState(false);

  const codBlocked = subtotal > COMMERCE.codCap;
  const effectivePayment: PaymentKey = codBlocked && payment === 'cod' ? 'upi' : payment;
  const isPrepaid = effectivePayment !== 'cod';

  const totals = useMemo(() => {
    const shipping =
      subtotal >= COMMERCE.freeShippingThreshold ? 0 : COMMERCE.standardShipping;
    const codFee = isPrepaid ? 0 : COMMERCE.codFee;
    const prepaidDiscount = isPrepaid ? COMMERCE.prepaidDiscount : 0;
    const total = Math.max(0, subtotal + shipping + codFee - prepaidDiscount);
    return { shipping, codFee, prepaidDiscount, total };
  }, [subtotal, isPrepaid]);

  if (!hydrated) {
    return (
      <div className="border-t border-rule py-24">
        <p className="caption text-center">Loading your bag…</p>
      </div>
    );
  }

  if (lines.length === 0) {
    return (
      <div className="flex flex-col items-center border-t border-rule py-24 text-center">
        <MoonStars className="h-8 w-11 text-fg-mute" />
        <p className="display-md mt-6 text-fg">There is nothing to check out</p>
        <Link href="/shop" className="btn btn-primary mt-8">
          Shop the collection
        </Link>
      </div>
    );
  }

  async function lookupPincode(value: string) {
    setPinError('');
    setPinLookup(null);
    setEta(null);
    if (!/^[1-9][0-9]{5}$/.test(value)) return;
    try {
      const res = await fetch(`/api/pincode?pincode=${value}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.message);
      setPinLookup({ city: data.city, state: data.state });
      setEta({ earliest: data.delivery.earliest, latest: data.delivery.latest });
    } catch (err) {
      setPinError(err instanceof Error ? err.message : 'Could not check that PIN code.');
    }
  }

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  return (
    <div className="grid gap-12 lg:grid-cols-[1fr_22rem] lg:gap-16">
      {/* ═══ Form ═══════════════════════════════════════════════════════════ */}
      <div>
        {/* Stepper */}
        <ol className="flex flex-wrap gap-x-6 gap-y-2 border-t border-rule pt-4">
          {STEPS.map((s, i) => (
            <li key={s.key} className="flex items-center gap-2">
              <span
                className={cx(
                  'index-num',
                  i <= stepIndex && 'text-fg',
                )}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => i < stepIndex && setStep(s.key)}
                disabled={i > stepIndex}
                aria-current={i === stepIndex ? 'step' : undefined}
                className={cx(
                  'text-[0.625rem] tracking-[0.2em] uppercase transition-colors duration-400',
                  i === stepIndex ? 'text-fg' : 'text-fg-mute',
                  i < stepIndex && 'cursor-pointer hover:text-fg',
                )}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ol>

        <form
          className="mt-10"
          onSubmit={async (e) => {
            e.preventDefault();
            if (step !== 'payment') {
              const order: Step[] = ['contact', 'address', 'delivery', 'payment'];
              setStep(order[order.indexOf(step) + 1]);
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }

            /* ────────────────────────────────────────────────────────────────
               RAZORPAY INTEGRATION POINT
               ────────────────────────────────────────────────────────────────
               Payment is deliberately not faked. To make this live:

               1. POST the cart server-side to /api/checkout, which must
                  re-price every line from the catalogue (never trust the
                  client's totals) and create a Razorpay order:
                    const rzp = new Razorpay({ key_id, key_secret });
                    const order = await rzp.orders.create({
                      amount: totalInPaise, currency: 'INR', receipt: orderId,
                    });
               2. Load checkout.js and open it with the returned order_id,
                  with `config.display.blocks` ordering UPI first.
               3. Verify the signature in /api/razorpay/webhook using
                  crypto.createHmac('sha256', webhookSecret) — mark paid only
                  on the verified webhook, never on the browser callback.
               4. For COD, skip Razorpay and send an OTP/WhatsApp confirmation
                  before creating the order (brief §5 RTO mitigation).
               5. On success, push the order to Shiprocket and redirect to
                  /order/[id].
               ──────────────────────────────────────────────────────────────── */
            setSubmitting(true);
            await new Promise((r) => setTimeout(r, 600));
            setSubmitting(false);
            setSubmitNote(
              isPrepaid
                ? 'Payment is not connected yet — Razorpay credentials are pending from the client. Everything up to this point is real: the order is priced, the address is validated and the delivery window is live. See the integration notes in app/checkout/CheckoutFlow.tsx.'
                : 'Cash on delivery is not connected yet — the OTP confirmation step and Shiprocket order push are pending. See the integration notes in app/checkout/CheckoutFlow.tsx.',
            );
          }}
        >
          {/* ── Contact ── */}
          {step === 'contact' ? (
            <fieldset>
              <legend className="display-md text-fg">How do we reach you?</legend>
              <p className="body-sm mt-3">
                Order updates go out over WhatsApp and email. No account required.
              </p>

              <div className="mt-8 flex flex-col gap-7">
                <div>
                  <label htmlFor="co-email" className="caption">
                    Email
                  </label>
                  <input
                    id="co-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    className="field mt-1"
                  />
                </div>
                <div>
                  <label htmlFor="co-phone" className="caption">
                    Mobile number
                  </label>
                  <input
                    id="co-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    required
                    autoComplete="tel"
                    placeholder="10 digits"
                    className="field mt-1"
                  />
                  <p className="caption mt-2">
                    Used for delivery updates and, for cash on delivery, to confirm the order.
                  </p>
                </div>
              </div>
            </fieldset>
          ) : null}

          {/* ── Address ── */}
          {step === 'address' ? (
            <fieldset>
              <legend className="display-md text-fg">Where is it going?</legend>

              <div className="mt-8 flex flex-col gap-7">
                <div className="grid gap-7 sm:grid-cols-2">
                  <div>
                    <label htmlFor="co-first" className="caption">
                      First name
                    </label>
                    <input
                      id="co-first"
                      name="firstName"
                      required
                      autoComplete="given-name"
                      className="field mt-1"
                    />
                  </div>
                  <div>
                    <label htmlFor="co-last" className="caption">
                      Last name
                    </label>
                    <input
                      id="co-last"
                      name="lastName"
                      required
                      autoComplete="family-name"
                      className="field mt-1"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="co-address1" className="caption">
                    Flat, house, building
                  </label>
                  <input
                    id="co-address1"
                    name="address1"
                    required
                    autoComplete="address-line1"
                    className="field mt-1"
                  />
                </div>

                <div>
                  <label htmlFor="co-address2" className="caption">
                    Area, street, landmark
                  </label>
                  <input
                    id="co-address2"
                    name="address2"
                    autoComplete="address-line2"
                    className="field mt-1"
                  />
                </div>

                <div className="grid gap-7 sm:grid-cols-3">
                  <div>
                    <label htmlFor="co-pin" className="caption">
                      PIN code
                    </label>
                    <input
                      id="co-pin"
                      name="pincode"
                      inputMode="numeric"
                      pattern="[1-9][0-9]{5}"
                      maxLength={6}
                      required
                      autoComplete="postal-code"
                      className="field mt-1"
                      onChange={(e) => {
                        const v = e.target.value.trim();
                        if (v.length === 6) void lookupPincode(v);
                        else {
                          setPinLookup(null);
                          setEta(null);
                        }
                      }}
                    />
                  </div>
                  <div>
                    <label htmlFor="co-city" className="caption">
                      City
                    </label>
                    <input
                      id="co-city"
                      name="city"
                      required
                      autoComplete="address-level2"
                      className="field mt-1"
                      value={pinLookup?.city ?? ''}
                      onChange={(e) =>
                        setPinLookup((p) => ({ city: e.target.value, state: p?.state ?? '' }))
                      }
                    />
                  </div>
                  <div>
                    <label htmlFor="co-state" className="caption">
                      State
                    </label>
                    <input
                      id="co-state"
                      name="state"
                      required
                      autoComplete="address-level1"
                      className="field mt-1"
                      value={pinLookup?.state ?? ''}
                      onChange={(e) =>
                        setPinLookup((p) => ({ city: p?.city ?? '', state: e.target.value }))
                      }
                    />
                  </div>
                </div>

                <div aria-live="polite">
                  {pinError ? <p className="caption text-error">{pinError}</p> : null}
                  {pinLookup ? (
                    <p className="caption text-success">
                      Delivering to {pinLookup.city}, {pinLookup.state}
                    </p>
                  ) : (
                    <p className="caption">City and state fill in from your PIN code.</p>
                  )}
                </div>

                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={gstInvoice}
                    onChange={(e) => setGstInvoice(e.target.checked)}
                    className="mt-1 h-3.5 w-3.5 shrink-0 accent-[color:var(--color-ink)]"
                  />
                  <span className="body-sm">I need a GST invoice</span>
                </label>

                {gstInvoice ? (
                  <div className="grid gap-7 sm:grid-cols-2">
                    <div>
                      <label htmlFor="co-gstin" className="caption">
                        GSTIN
                      </label>
                      <input id="co-gstin" name="gstin" className="field mt-1" required />
                    </div>
                    <div>
                      <label htmlFor="co-business" className="caption">
                        Registered business name
                      </label>
                      <input
                        id="co-business"
                        name="businessName"
                        className="field mt-1"
                        required
                      />
                    </div>
                  </div>
                ) : null}
              </div>
            </fieldset>
          ) : null}

          {/* ── Delivery ── */}
          {step === 'delivery' ? (
            <fieldset>
              <legend className="display-md text-fg">When would you like it?</legend>

              <div className="mt-8 border-t border-rule">
                <label className="flex cursor-pointer items-start gap-4 border-b border-rule py-5">
                  <input
                    type="radio"
                    name="shipping"
                    defaultChecked
                    className="mt-1.5 h-3.5 w-3.5 shrink-0 accent-[color:var(--color-ink)]"
                  />
                  <span className="flex-1">
                    <span className="flex items-baseline justify-between gap-4">
                      <span className="body-sm text-fg">Standard delivery</span>
                      <span className="tabular caption text-fg">
                        {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
                      </span>
                    </span>
                    <span className="caption mt-1 block">
                      {eta
                        ? `Arriving ${formatShortDate(new Date(eta.earliest))} – ${formatShortDate(new Date(eta.latest))}`
                        : 'Two to seven working days, depending on your PIN code'}
                    </span>
                  </span>
                </label>
              </div>

              {giftMessage ? (
                <div className="mt-8 border border-rule-strong p-5">
                  <p className="eyebrow eyebrow-ink">Your gift message</p>
                  <p className="body-sm mt-3 italic">“{giftMessage}”</p>
                  <Link href="/cart" className="link-rule caption mt-3 inline-block uppercase">
                    Edit
                  </Link>
                </div>
              ) : null}
            </fieldset>
          ) : null}

          {/* ── Payment ── */}
          {step === 'payment' ? (
            <fieldset>
              <legend className="display-md text-fg">How would you like to pay?</legend>

              <div className="mt-8 border-t border-rule">
                {PAYMENT_METHODS.map((method) => {
                  const disabled = method.key === 'cod' && codBlocked;
                  return (
                    <label
                      key={method.key}
                      className={cx(
                        'flex items-start gap-4 border-b border-rule py-5',
                        disabled ? 'cursor-not-allowed opacity-45' : 'cursor-pointer',
                      )}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.key}
                        checked={effectivePayment === method.key}
                        disabled={disabled}
                        onChange={() => setPayment(method.key)}
                        className="mt-1.5 h-3.5 w-3.5 shrink-0 accent-[color:var(--color-ink)]"
                      />
                      <span className="flex-1">
                        <span className="flex items-baseline justify-between gap-4">
                          <span className="body-sm text-fg">{method.label}</span>
                          {method.prepaid ? (
                            <span className="tabular caption text-accent">
                              −{formatPrice(COMMERCE.prepaidDiscount)}
                            </span>
                          ) : null}
                        </span>
                        <span className="caption mt-1 block">
                          {disabled
                            ? `Not available above ${formatPrice(COMMERCE.codCap)}`
                            : method.note}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>

              <p className="caption mt-5 flex items-start gap-2.5">
                <MarkShield className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Payments are processed by Razorpay. We never see or store your card details.
              </p>

              {submitNote ? (
                <div
                  role="status"
                  className="mt-6 border border-rule-strong bg-bg-lift p-5"
                >
                  <p className="eyebrow eyebrow-ink">Payment not yet connected</p>
                  <p className="body-sm mt-3">{submitNote}</p>
                </div>
              ) : null}
            </fieldset>
          ) : null}

          {/* ── Controls ── */}
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {step === 'payment'
                ? submitting
                  ? 'Placing order'
                  : `Pay ${formatPrice(totals.total)}`
                : 'Continue'}
            </button>
            {stepIndex > 0 ? (
              <button
                type="button"
                onClick={() => setStep(STEPS[stepIndex - 1].key)}
                className="link-rule caption uppercase"
              >
                Back
              </button>
            ) : (
              <Link href="/cart" className="link-rule caption uppercase">
                Back to bag
              </Link>
            )}
          </div>
        </form>
      </div>

      {/* ═══ Summary ════════════════════════════════════════════════════════ */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="border-t border-rule pt-4">
          <h2 className="eyebrow eyebrow-ink">Your order</h2>

          <ul className="mt-6 flex flex-col gap-4">
            {lines.map((line) => (
              <li key={line.slug} className="flex gap-4">
                <div className="relative w-16 shrink-0 bg-[color:var(--plate-bg)]">
                  <Image
                    src={line.image}
                    alt={line.imageAlt}
                    width={160}
                    height={200}
                    sizes="64px"
                    className="aspect-4/5 h-auto w-full object-contain"
                  />
                  <span className="tabular absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-fg px-1 text-[0.5625rem] text-bg">
                    {line.quantity}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="body-sm truncate text-fg">{line.title}</p>
                  <p className="caption mt-0.5">{line.netQuantity}</p>
                  {line.giftWrap ? <p className="caption mt-0.5">Gift wrapped</p> : null}
                </div>
                <p className="tabular shrink-0 text-[0.8125rem] text-fg">
                  {formatPrice(line.price * line.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <dl className="mt-7 flex flex-col gap-2.5 border-t border-rule pt-5">
            <div className="flex justify-between gap-4">
              <dt className="caption">Subtotal</dt>
              <dd className="tabular caption text-fg">{formatPrice(subtotal)}</dd>
            </div>
            {savings > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="caption">Discount</dt>
                <dd className="tabular caption text-accent">−{formatPrice(savings)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between gap-4">
              <dt className="caption">Shipping</dt>
              <dd className="tabular caption text-fg">
                {totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}
              </dd>
            </div>
            {totals.prepaidDiscount > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="caption">Prepaid discount</dt>
                <dd className="tabular caption text-accent">
                  −{formatPrice(totals.prepaidDiscount)}
                </dd>
              </div>
            ) : null}
            {totals.codFee > 0 ? (
              <div className="flex justify-between gap-4">
                <dt className="caption">COD handling</dt>
                <dd className="tabular caption text-fg">{formatPrice(totals.codFee)}</dd>
              </div>
            ) : null}
          </dl>

          <div className="mt-5 flex items-baseline justify-between gap-4 border-t border-rule pt-5">
            <span className="eyebrow eyebrow-ink">Total</span>
            <span className="tabular text-[1.125rem] text-fg">
              {formatPrice(totals.total)}
            </span>
          </div>
          <p className="caption mt-2">Inclusive of all taxes</p>
        </div>
      </aside>
    </div>
  );
}
