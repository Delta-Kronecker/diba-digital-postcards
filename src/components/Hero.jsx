import React from 'react';
import { ArrowUpLeft, Play } from 'lucide-react';
import Picture from './Picture';

export default function Hero({ onNavigate = () => {} }) {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="paper-grain relative overflow-hidden border-b border-line">
      {/* faint oversized wordmark */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 bottom-0 hidden select-none font-latin text-[16rem] leading-none text-ink/[0.035] xl:block"
      >
        Diba
      </span>

      <div className="shell relative grid grid-cols-1 items-center gap-14 py-16 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-7 lg:pl-6">
          <p className="eyebrow animate-reveal-up">آتلیهٔ دعوت دیجیتال · از ۱۳۹۴</p>

          <h1 className="display-hero mt-6 animate-reveal-up [animation-delay:80ms]">
            دعوتی که{' '}
            <span className="mt-1 block">
              به <span className="text-gold-foil">خاطره</span> بدل می‌شود.
            </span>
          </h1>

          <p className="mt-7 max-w-xl animate-reveal-up text-[15px] leading-[2] text-ink-muted [animation-delay:160ms]">
            کارت‌پستال و دعوت‌نامه‌های دیجیتال فاخر، با حس اصیل گشودن پاکت؛
            مهر موم برجسته، تایپوگرافی فارسی، موسیقی اختصاصی و ثبت حضور آنلاین.
          </p>

          <div className="mt-10 flex animate-reveal-up flex-wrap items-center gap-x-8 gap-y-4 [animation-delay:240ms]">
            <button
              type="button"
              onClick={() => onNavigate('wedding-amir-sara')}
              className="btn btn-ink"
            >
              گشودن یک دعوت‌نامه
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="link-underline"
            >
              <Play className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              تماشای گالری نمونه‌ها
            </button>
          </div>

          <dl className="mt-14 grid max-w-xl animate-reveal-up grid-cols-3 border-y border-line [animation-delay:320ms]">
            {[
              ['۶', 'دستهٔ تخصصی'],
              ['۲۴۰+', 'دعوت ساخته‌شده'],
              ['۴٫۹', 'از ۵ رضایت مهمان'],
            ].map(([value, label], i) => (
              <div
                key={label}
                className={`py-5 ${i !== 0 ? 'border-r border-line pr-6' : 'pl-6'}`}
              >
                <dt className="font-display text-2xl font-medium text-ink md:text-3xl">{value}</dt>
                <dd className="mt-1 text-[11px] text-ink-subtle">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-5">
          <div className="relative mx-auto max-w-[440px] animate-reveal-up [animation-delay:180ms]">
            {/* offset frame */}
            <span
              aria-hidden="true"
              className="absolute -right-3 -top-3 bottom-6 left-6 border border-gold/40"
            />
            <figure className="arch relative overflow-hidden border border-line bg-surface-2 shadow-lift">
              <Picture
                src={`${base}images/wedding-cover.jpg`}
                alt="جزئیات گل‌آرایی و دعوت‌نامهٔ عروسی دیبا"
                width="440"
                height="560"
                fetchPriority="high"
                className="h-[420px] w-full object-cover sm:h-[500px] lg:h-[560px]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#161310]/55 via-transparent to-transparent" />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-cream">
                <div>
                  <span className="latin block text-[9px] text-cream/70">Collection No. 01</span>
                  <span className="mt-1 block font-display text-lg">عروسی امیر و سارا</span>
                </div>
                <span className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/40">
                  <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
                </span>
              </figcaption>
            </figure>

            {/* wax seal */}
            <div
              aria-hidden="true"
              className="absolute -left-5 top-10 flex h-20 w-20 rotate-[-8deg] items-center justify-center rounded-full border border-[#8b6d3f]/50 bg-[radial-gradient(circle_at_34%_30%,#d8c19a,#b08b52_55%,#7c5c2c)] shadow-[0_18px_35px_-18px_rgba(0,0,0,0.65)]"
            >
              <span className="flex h-14 w-14 items-center justify-center rounded-full border border-[#f6ecd8]/40 font-display text-xl text-[#3b2a12]">
                د
              </span>
            </div>

            {/* small overlapping card */}
            <div className="absolute -bottom-8 -right-4 hidden w-52 border border-line bg-surface p-5 shadow-soft sm:block">
              <span className="latin text-[9px] text-ink-subtle">The moment of opening</span>
              <p className="mt-2 font-display text-base leading-snug text-ink">
                هر پاکت، یک تجربهٔ دست‌ساز.
              </p>
              <span className="mt-3 block h-px w-10 bg-gold" />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-4 text-[10px] text-ink-subtle">
          <span>تهران — ارسال دیجیتال به سراسر ایران</span>
          <span className="latin tracking-[0.28em]">Handcrafted digital invitations</span>
        </div>
      </div>
    </section>
  );
}
