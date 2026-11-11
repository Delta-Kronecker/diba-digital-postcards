import React from 'react';
import { Star } from 'lucide-react';
import Picture from './Picture';

export default function Testimonial() {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="relative border-y border-line bg-surface lg:overflow-hidden">
      <div className="shell grid grid-cols-1 lg:grid-cols-12 lg:items-stretch lg:gap-0">
        {/* the quote sits in the readable column, aligned to the page shell */}
        <div className="order-2 py-20 md:py-28 lg:order-none lg:col-span-7 lg:py-32 lg:pe-16 xl:pe-24">
          <p className="mb-8 flex items-center gap-3 text-xs text-ink-subtle">
            <span className="tabular-nums text-gold-deep">۰۵</span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
            روایت مهمان
          </p>

          <blockquote className="relative">
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-14 select-none font-latin text-[9rem] leading-none text-gold/20"
            >
              “
            </span>
            <p className="display-section !text-[clamp(1.75rem,3.6vw,3rem)] !leading-[1.55] text-ink">
              وقتی پاکت را باز کردم، احساس کردم یک نامهٔ واقعی به دستم رسیده؛
              نه یک لینک.
            </p>
          </blockquote>

          <div className="mt-12 flex items-center gap-4 border-t border-line pt-6">
            <span className="flex size-11 items-center justify-center rounded-full border border-gold/40 font-display text-sm text-gold-deep">
              س
            </span>
            <div>
              <p className="font-display text-sm text-ink">سارا طباطبایی</p>
              <p className="mt-1 text-xs text-ink-subtle">مهمان دعوتنامهٔ عروسی، خرداد ۱۴۰۵</p>
            </div>
            <span
              className="ms-auto hidden items-center gap-1 text-gold-deep sm:flex"
              role="img"
              aria-label="امتیاز پنج از پنج"
            >
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} className="size-3.5 fill-current" aria-hidden="true" />
              ))}
            </span>
          </div>
        </div>

        {/* the photograph runs off the outer edge of the page — a full-bleed
            column, so the story reads as a place rather than a framed picture */}
        <figure className="relative order-1 min-h-[360px] overflow-hidden bg-surface-2 lg:order-none lg:col-span-5 lg:min-h-full lg:me-[calc(-1*max(2.5rem,(100vw-84rem)/2+2.5rem))] xl:me-[calc(-1*max(3.5rem,(100vw-84rem)/2+3.5rem))]">
          <Picture
            src={`${base}images/wedding-hall.jpg`}
            alt="فضای تالار در شب مراسم عروسی"
            width="600"
            height="720"
            loading="lazy"
            decoding="async"
            className="h-[360px] w-full object-cover lg:absolute lg:inset-0 lg:h-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-scrim/60 via-transparent to-transparent" />
          <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream lg:p-10">
            <span lang="en" className="latin block text-xs text-cream/70">A wedding, remembered</span>
            <span className="mt-1 block font-display text-lg lg:text-xl">تالار اسپیناس پالاس</span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
