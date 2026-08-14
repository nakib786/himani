'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/format';
import type { ProductImage } from '@/lib/types';

/**
 * Product gallery.
 *
 * One DOM tree serves both breakpoints: a scroll-snap track gives real swipe
 * on touch, and the thumbnail rail scrolls that same track on desktop. No
 * duplicated markup, no carousel library, and it degrades to a plain
 * horizontally-scrollable strip of images with JavaScript off.
 *
 * Desktop pointer devices additionally get cursor-tracked magnification —
 * these are 1.5cm objects and the detail is the entire proposition.
 */
export function ProductGallery({
  images,
  title,
}: {
  images: ProductImage[];
  title: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState<{ on: boolean; x: number; y: number }>({
    on: false,
    x: 50,
    y: 50,
  });

  /* Track which frame is centred as the user swipes. */
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const index = Math.round(el.scrollLeft / el.clientWidth);
        setActive(Math.max(0, Math.min(images.length - 1, index)));
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [images.length]);

  const goTo = useCallback((index: number) => {
    const el = track.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: 'smooth' });
    setActive(index);
  }, []);

  return (
    <div className="flex flex-col gap-4 lg:flex-row-reverse lg:items-start lg:gap-6">
      {/* ---- Frames ---- */}
      <div className="min-w-0 flex-1">
        <div
          ref={track}
          className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain"
          role="group"
          aria-roledescription="carousel"
          aria-label={`${title} — image gallery`}
        >
          {images.map((image, i) => (
            <div
              key={image.url}
              className="w-full shrink-0 snap-center"
              role="group"
              aria-roledescription="slide"
              aria-label={`Image ${i + 1} of ${images.length}`}
            >
              <div
                className="plate cursor-zoom-in"
                onMouseEnter={() => setZoom((z) => ({ ...z, on: true }))}
                onMouseLeave={() => setZoom({ on: false, x: 50, y: 50 })}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setZoom({
                    on: true,
                    x: ((e.clientX - r.left) / r.width) * 100,
                    y: ((e.clientY - r.top) / r.height) * 100,
                  });
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  priority={i === 0}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  sizes="(min-width: 1024px) 46vw, 100vw"
                  className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] [@media(hover:none)]:!transform-none"
                  style={
                    zoom.on && i === active
                      ? {
                          transform: 'scale(1.75)',
                          transformOrigin: `${zoom.x}% ${zoom.y}%`,
                        }
                      : undefined
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Frame counter — replaces dot indicators, matches the editorial numbering. */}
        <div className="mt-3 flex items-center justify-between border-t border-rule pt-3 lg:hidden">
          <span className="index-num">
            {String(active + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </span>
          <span className="caption">Swipe for more</span>
        </div>
      </div>

      {/* ---- Thumbnails ---- */}
      {images.length > 1 ? (
        <ul className="no-scrollbar hidden shrink-0 gap-3 lg:flex lg:w-20 lg:flex-col">
          {images.map((image, i) => (
            <li key={image.url}>
              <button
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Show image ${i + 1} of ${images.length}`}
                aria-current={i === active}
                className={cx(
                  'block w-full border bg-[color:var(--plate-bg)] transition-colors duration-400',
                  i === active ? 'border-fg' : 'border-rule hover:border-rule-strong',
                )}
              >
                <Image
                  src={image.url}
                  alt=""
                  width={image.width}
                  height={image.height}
                  sizes="80px"
                  className="aspect-4/5 h-auto w-full object-contain"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
