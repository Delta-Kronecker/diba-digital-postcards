import React from 'react';
import Reveal from './Reveal';
import Picture from './Picture';

export default function Testimonial() {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="border-y border-line bg-surface">
      <div className="shell grid grid-cols-1 items-center gap-14 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-7">
          <p className="eyebrow mb-8">از مهمانان</p>

          <blockquote className="relative">
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-10 select-none font-latin text-[7rem] leading-none text-gold/20"
            >
              “
            </span>
            <p className="display-section !text-[clamp(1.6rem,3.2vw,2.7rem)] !leading-[1.6] text-ink">
              وقتی پاکت را باز کردم، احساس کردم یک نامهٔ واقعی به دستم رسیده؛
              نه یک لینک.
            </p>
          </blockquote>

          <div className="mt-10 flex items-center gap-4 border-t border-line pt-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 font-display text-sm text-gold">
              س
            </span>
            <div>
              <p className="font-display text-sm text-ink">سارا طباطبایی</p>
              <p className="mt-1 text-[11px] text-ink-subtle">مهمان دعوت‌نامهٔ عروسی · خرداد ۱۴۰۵</p>
            </div>
            <span className="mr-auto hidden items-center gap-1 text-gold sm:flex" role="img" aria-label="امتیاز پنج از پنج">
              {'★★★★★'.split('').map((star, i) => (
                <span key={i} aria-hidden="true" className="text-xs">
                  {star}
                </span>
              ))}
            </span>
          </div>
        </Reveal>

        <Reveal className="lg:col-span-5" delay={100}>
          <figure className="relative">
            <span aria-hidden="true" className="absolute -bottom-3 -right-3 left-6 top-6 border border-gold/35" />
            <div className="relative overflow-hidden bg-surface-2">
              <Picture
                src={`${base}images/wedding-hall.jpg`}
                alt="فضای تالار در شب مراسم عروسی"
                width="600"
                height="720"
                loading="lazy"
                decoding="async"
                className="h-[360px] w-full object-cover lg:h-[440px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#15120e]/45 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 p-6 text-cream">
                <span className="latin block text-[9px] text-cream/70">A wedding, remembered</span>
                <span className="mt-1 block font-display text-lg">تالار اسپیناس پالاس</span>
              </figcaption>
            </div>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
