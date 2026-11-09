import React from 'react';
import { ArrowUpLeft, Mail, Phone } from 'lucide-react';
import Reveal from './Reveal';
import Ornament from './Ornament';

export default function FinalCTA({ onNavigate = () => {} }) {
  return (
    <section className="paper-grain relative overflow-hidden bg-ink-band py-20 text-cream md:py-28">
      <div className="shell relative z-10">
        <Reveal className="mx-auto max-w-4xl text-center">
          <Ornament className="mx-auto mb-8 h-6 w-6 text-gold" />
          <p className="latin text-[10px] text-cream/65">Begin your invitation</p>
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
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="btn border-cream/25 bg-transparent text-cream hover:border-cream/60 hover:bg-cream/5"
            >
              دیدن نمونه‌ها
            </button>
          </div>

          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-4 border-t border-cream/15 pt-8 text-[11px] text-cream/65 sm:grid-cols-3">
            <a href="mailto:hello@diba.studio" className="inline-flex items-center justify-center gap-2 hover:text-cream">
              <Mail className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              hello@diba.studio
            </a>
            <a href="tel:+982122000000" className="inline-flex items-center justify-center gap-2 hover:text-cream" dir="ltr">
              <Phone className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              +98 21 2200 0000
            </a>
            <span className="inline-flex items-center justify-center gap-2">
              تهران، خیابان فرشته
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
