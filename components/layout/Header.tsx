'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { LogoHorizontal } from '@/components/brand/Logo';
import {
  IconBag,
  IconClose,
  IconMenu,
  IconSearch,
  IconTrackOrder,
  RuleDot,
} from '@/components/brand/Motifs';
import { useCart } from '@/components/cart/CartProvider';
import { cx } from '@/lib/format';
import { NAV } from '@/lib/site';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { count, open, hydrated } = useCart();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInput = useRef<HTMLInputElement>(null);

  /* Every page opens on an espresso band, so the header is always dark-ground:
     transparent while it sits over that band, then filling to solid espresso
     once it starts travelling over the gallery sections underneath. Keeping
     one ground for both states avoids the mid-scroll colour flip that a
     ground-sensing header would produce over alternating bands. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* Any navigation closes whatever is open. */
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  /* `menu` is separate from `locked` on purpose. The cart drawer sets `locked`
     too, and the announcement bar keys off this — hiding the bar when the cart
     opens would shift the page up 40px behind the overlay for no reason. */
  useEffect(() => {
    document.body.dataset.locked = menuOpen ? 'true' : 'false';
    document.body.dataset.menu = menuOpen ? 'open' : 'closed';
  }, [menuOpen]);

  useEffect(() => {
    if (searchOpen) searchInput.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setMenuOpen(false);
      setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(`${href}/`));

  return (
    <header
      data-ground="dark"
      data-topo="off"
      className={cx(
        'sticky top-0 z-50 transition-colors duration-500',
        scrolled || menuOpen ? 'border-b border-rule' : 'bg-transparent',
      )}
    >
      <div className="shell">
        <div className="grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 md:h-20">
          {/* ---- Left: nav (desktop) / menu toggle (mobile) ---- */}
          <div className="flex items-center gap-7">
            {/* The breakpoint is lg, not md: six nav items plus the wordmark
                plus the utility cluster overflow a ~800px row, which pushed
                the bag button off the right edge. Below 1024px the nav lives
                in the drawer instead. */}
            <button
              type="button"
              className="-ml-1.5 p-1.5 lg:hidden"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            >
              {menuOpen ? <IconClose className="h-5 w-5" /> : <IconMenu className="h-5 w-5" />}
            </button>

            <nav aria-label="Primary" className="hidden lg:block">
              <ul className="flex items-center gap-6">
                {NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={isActive(item.href) ? 'page' : undefined}
                      className="link-nav text-[0.625rem] tracking-[0.2em] uppercase"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* ---- Centre: logo ---- */}
          <Link href="/" className="justify-self-center" aria-label="Kshyovrata — home">
            <LogoHorizontal className="text-fg" />
          </Link>

          {/* ---- Right: search, account, bag ---- */}
          <div className="-mr-2 flex items-center justify-end">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className="icon-btn"
              aria-expanded={searchOpen}
              aria-controls="site-search"
              aria-label="Search"
            >
              <IconSearch className="h-[1.15rem] w-[1.15rem]" />
            </button>

            {/* There are no accounts — checkout is guest-only and orders are
                looked up by order number. This slot used to be spelled out
                because the obvious glyph for it, a person, promised a sign-in
                that does not exist; a van under a dropped pin has no such
                problem — it says tracking and nothing else — so the row is now
                three even glyphs rather than two and a word. `title` carries
                the label on hover for anyone who reads it as a truck.

                Below lg this lives in the drawer instead, keeping the row to
                search and bag. The display utility sits on the wrapper: on the
                link itself it would lose to `.icon-btn`, which sets
                `display: inline-flex` unlayered and so outranks it. */}
            <span className="hidden lg:block">
              <Link
                href="/track-order"
                className="icon-btn"
                aria-label="Track your order"
                title="Track your order"
              >
                <IconTrackOrder className="h-[1.15rem] w-[1.15rem]" />
              </Link>
            </span>

            {/* The count is a tabular numeral beside the glyph rather than a
                filled badge — same device as the plate numbers and prices.
                The slot is always rendered so hydration doesn't shift the row. */}
            <button
              type="button"
              onClick={open}
              className="icon-btn"
              aria-label={
                hydrated && count > 0
                  ? `Open your bag — ${count} item${count === 1 ? '' : 's'}`
                  : 'Open your bag'
              }
            >
              <IconBag className="h-[1.15rem] w-[1.15rem]" />
              <span
                className="bag-count tabular"
                data-empty={hydrated && count > 0 ? 'false' : 'true'}
                aria-hidden="true"
              >
                {hydrated && count > 0 ? count : 0}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* ---- Search ---- */}
      {searchOpen ? (
        <div id="site-search" className="border-t border-rule bg-bg">
          <form
            className="shell flex items-center gap-4 py-5"
            onSubmit={(e) => {
              e.preventDefault();
              const q = new FormData(e.currentTarget).get('q');
              const value = typeof q === 'string' ? q.trim() : '';
              router.push(value ? `/shop?q=${encodeURIComponent(value)}` : '/shop');
              setSearchOpen(false);
            }}
          >
            <label htmlFor="q" className="sr-only">
              Search the collection
            </label>
            <IconSearch className="h-4 w-4 shrink-0 text-fg-mute" />
            <input
              ref={searchInput}
              id="q"
              name="q"
              type="search"
              placeholder="Butterfly, rose gold, studs…"
              className="field flex-1 border-b-0 py-0"
              autoComplete="off"
            />
            <button type="submit" className="btn btn-secondary btn-sm shrink-0">
              Search
            </button>
          </form>
        </div>
      ) : null}

      {/* ---- Mobile menu ---- */}
      {menuOpen ? (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto border-t border-rule bg-bg md:top-20 lg:hidden"
        >
          <nav aria-label="Mobile" className="shell py-8">
            <ul className="flex flex-col">
              {NAV.map((item, i) => (
                <li key={item.href} className="border-b border-rule">
                  <Link
                    href={item.href}
                    className="flex items-baseline gap-4 py-5"
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    <span className="index-num">{String(i + 1).padStart(2, '0')}</span>
                    <span className="display-md text-fg">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10">
              <RuleDot />
            </div>

            <ul className="mt-8 flex flex-col gap-4">
              {[
                { label: 'Track Your Order', href: '/track-order' },
                { label: 'Jewellery Care', href: '/care' },
                { label: 'About the House', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ].map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-rule caption uppercase tracking-[0.18em] text-fg"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
