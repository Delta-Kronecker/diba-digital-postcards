import React from 'react';
import { ArrowUpLeft, Mail, Phone } from 'lucide-react';
import Ornament from './Ornament';
import Picture from './Picture';
import SectionMark from './SectionMark';

export default function FinalCTA({ onNavigate = () => {} }) {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="relative isolate overflow-hidden bg-ink-band py-24 text-cream md:py-32">
      {/* one photograph held far back: the closing band is a place, not a colour */}
      <Picture
        src={`${base}images/wedding-flowers.jpg`}
        alt=""
        aria-hidden="true"
        width="1600"
        height="900"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover opacity-45"
      />
      {/* item 69 — the photo used to sit at 30 % under an 80–85 % ink wash, so the
          band read as a flat fill. The wash now opens at the top (55 %) so the
          flowers stay legible there, stays heavy where the copy sits (88 %), and
          closes fully at the seam with the footer. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink-band/55 via-ink-band/88 to-ink-band"
      />
      {/* the same corner fall as the hero, so both dark bands share one surface */}
      <span aria-hidden="true" className="band-vignette -z-10" />

      <div className="shell relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <Ornament className="mx-auto mb-8 size-6 text-gold" />
          <SectionMark number="۰۶" tone="dark" align="center"><span lang="en" className="latin">Begin your invitation</span></SectionMark>
          <h2 className="display-section mt-5 text-cream">
            دعوتِ بعدیِ شما،
            <span className="block text-gold-soft">یک اثر هنری باشد.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-lg text-sm leading-[2] text-cream/60">
            کافی است نام‌ها، تاریخ و حال‌وهوای مراسم را بگویید؛ بقیهٔ روایت را
            ما با تایپوگرافی، رنگ و حرکت می‌سازیم.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <button type="button" onClick={() => onNavigate('customizer')} className="btn btn-cream">
              شروع طراحی اختصاصی
              <ArrowUpLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="btn border-cream/25 bg-transparent text-cream hover:border-cream/60 hover:bg-cream/5"
            >
              دیدن نمونه‌ها
            </button>
          </div>

          <div className="mx-auto mt-16 flex max-w-2xl flex-wrap items-center justify-center gap-x-10 border-t border-cream/15 pt-8 text-xs text-cream/65">
            <a href="mailto:hello@diba.studio" className="inline-flex min-h-11 items-center justify-center gap-2 hover:text-cream">
              <Mail className="size-3.5 text-gold" aria-hidden="true" />
              hello@diba.studio
            </a>
            <a href="tel:+982122000000" className="inline-flex min-h-11 items-center justify-center gap-2 hover:text-cream" dir="ltr">
              <Phone className="size-3.5 text-gold" aria-hidden="true" />
              +98 21 2200 0000
            </a>
            <span className="inline-flex min-h-11 items-center justify-center gap-2">
              تهران، خیابان فرشته
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
