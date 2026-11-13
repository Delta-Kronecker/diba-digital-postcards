import React from 'react';
import { ArrowUpLeft, Play } from 'lucide-react';
import Picture from './Picture';

export default function Hero({ onNavigate = () => {} }) {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="relative overflow-hidden bg-ink-band text-cream">
      {/* a single pool of light, so the dark field has depth instead of flatness */}
      <div aria-hidden="true" className="hero-light" />
      {/* and a soft fall at the corners, so the field has edges */}
      <div aria-hidden="true" className="band-vignette" />

      {/* faint oversized wordmark. It used to run at 16rem from the physical
          left — behind the photograph at 1280/1366/1440 (30,246 / 25,078 /
          20,163 px² of overlap). At 9rem it sits entirely in the empty band
          under the plate at every one of those widths, and `-end-10` puts it on
          the figure's side in either direction. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 bottom-0 hidden select-none font-latin text-[9rem] leading-none text-cream/[0.05] xl:block"
      >
        Diba
      </span>

      <div className="shell relative grid grid-cols-1 items-center gap-16 py-20 lg:grid-cols-12 lg:gap-12 lg:py-28">
        <div className="lg:col-span-6 lg:pe-8">
          <p className="flex animate-reveal-up items-center gap-3 text-xs text-cream/60">
            <span className="size-1 rounded-full bg-gold" aria-hidden="true" />
            آتلیهٔ دعوت دیجیتال · تهران
            <span aria-hidden="true" className="h-px w-10 bg-gold/50" />
            <span lang="en" className="latin text-cream/65">Est. 2015</span>
          </p>

          <h1 className="display-hero mt-7 animate-reveal-up text-cream [animation-delay:80ms]">
            دعوتی که
            <span className="mt-1 block text-gold-soft">به خاطره بدل میشود.</span>
          </h1>

          <p className="mt-7 max-w-xl animate-reveal-up text-base leading-[2] text-cream/70 [animation-delay:160ms]">
            کارتپستال و دعوتنامههای دیجیتال فاخر، با حس اصیل گشودن پاکت؛
            مهر موم برجسته، تایپوگرافی فارسی، موسیقی اختصاصی و ثبت حضور آنلاین.
          </p>

          <div className="mt-10 flex animate-reveal-up flex-wrap items-center gap-x-8 gap-y-4 [animation-delay:240ms]">
            <button
              type="button"
              onClick={() => onNavigate('wedding-amir-sara')}
              className="btn btn-cream"
            >
              گشودن یک دعوتنامه
              <ArrowUpLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="link-underline link-underline-cream before:absolute before:inset-x-0 before:-inset-y-2 before:content-['']"
            >
              <Play className="size-3.5 text-gold" aria-hidden="true" />
              تماشای گالری نمونهها
            </button>
          </div>

          <dl className="mt-12 grid max-w-xl animate-reveal-up grid-cols-3 border-y border-cream/15 [animation-delay:320ms] sm:mt-16">
            {[
              ['۶', 'دستهٔ تخصصی'],
              ['۱۳', 'تصویر آتلیه'],
              ['۱۰۰٪', 'واکنشگرا و در دسترس'],
            ].map(([value, label], i) => (
              <div
                key={label}
                className={`py-5 ${i !== 0 ? 'border-s border-cream/15 ps-6' : 'pe-6'}`}
              >
                <dt className="font-display text-2xl font-medium text-cream md:text-3xl">
                  {value}
                </dt>
                <dd className="mt-1 text-xs text-cream/60">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-[520px] animate-reveal-up [animation-delay:180ms]">
            {/* offset keyline */}
            <span
              aria-hidden="true"
              className="absolute -start-4 -top-4 bottom-10 end-10 border border-gold/35"
            />
            <figure className="arch relative aspect-[4/5] overflow-hidden border border-cream/15 bg-surface-2 shadow-lift">
              <Picture
                src={`${base}images/wedding-cover.jpg`}
                alt="جزئیات گلآرایی و دعوتنامهٔ عروسی دیبا"
                width="520"
                height="650"
                fetchPriority="high"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-scrim/70 via-scrim/5 to-transparent" />
              {/* a single soft pass of light across the plate, once, on load */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-cream/20 to-transparent motion-reduce:hidden"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-7 text-cream">
                <span>
                  <span lang="en" className="latin block text-xs text-cream/90">
                    The wedding collection
                  </span>
                  <span className="mt-1 block font-display text-xl">عروسی امیر و سارا</span>
                </span>
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cream/40 backdrop-blur-sm">
                  <ArrowUpLeft className="size-4" aria-hidden="true" />
                </span>
              </figcaption>
            </figure>

            {/* wax seal */}
            <div
              aria-hidden="true"
              className="absolute -end-6 top-12 animate-float-soft motion-reduce:animate-none"
            >
              <div className="flex size-24 rotate-[-8deg] items-center justify-center rounded-full border border-seal-line/50 bg-[radial-gradient(circle_at_34%_30%,var(--color-seal-a),var(--color-foil)_55%,var(--color-seal-d))] shadow-seal-lg">
                <span className="flex size-16 items-center justify-center rounded-full border border-seal-cream/40 font-display text-2xl text-seal-ink">
                  د
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-cream/55">
          <span>تهران، با ارسال دیجیتال به سراسر ایران</span>
          <span lang="en" className="latin">Handcrafted digital invitations</span>
        </div>
      </div>
    </section>
  );
}
