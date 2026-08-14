import Link from 'next/link';

/**
 * The opening band for every page that is not the homepage.
 *
 * It is an ESPRESSO band, and that is structural rather than decorative: the
 * sticky header is permanently dark-ground and fades from transparent to
 * solid on scroll, which only reads correctly if every page begins on dark.
 * Content below returns to the gallery ground, so each page runs
 * dark head → light body → dark footer.
 */
export function PageHero({
  eyebrow,
  title,
  lede,
  index = '00',
  crumbs,
}: {
  eyebrow: string;
  title: string;
  lede?: string;
  index?: string;
  crumbs?: { name: string; href: string }[];
}) {
  return (
    <header data-ground="dark" data-grain>
      <div className="shell pt-10 pb-16 md:pt-14 md:pb-24">
        {crumbs ? (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2">
              {crumbs.map((crumb, i) => (
                <li key={crumb.href} className="flex items-center gap-2">
                  {i > 0 ? (
                    <span className="caption text-fg-mute" aria-hidden="true">
                      /
                    </span>
                  ) : null}
                  {i === crumbs.length - 1 ? (
                    <span className="caption" aria-current="page">
                      {crumb.name}
                    </span>
                  ) : (
                    <Link href={crumb.href} className="link-nav caption">
                      {crumb.name}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <div className="flex items-baseline gap-4 border-t border-rule pt-5">
          <span className="index-num">{index}</span>
          <span className="eyebrow">{eyebrow}</span>
        </div>

        <h1 className="display-lg mt-8 max-w-[15ch] overflow-hidden">
          <span className="unmask block">{title}</span>
        </h1>

        {lede ? <p className="body-lg measure mt-7">{lede}</p> : null}
      </div>
    </header>
  );
}
