import React from 'react';
import { ArrowUpLeft, Play } from 'lucide-react';
import Picture from './Picture';
import { imageSize } from '../utils/imageSize';
import WaxSeal from './WaxSeal';

/* The opening plate of the suite.
 *
 * What changed and why:
 *
 * 1. The metric row is gone. Three figures about the *build* — six categories,
 *    thirteen photographs, "100% responsive" — were standing where a proof of
 *    craft belongs, and they are the clearest template tell the page had.
 * 2. The photograph is now a tipped-in plate: a cream mount, a hairline, crop
 *    marks at the corners and a museum caption. It is the page's single arch,
 *    and the arch is not repeated anywhere else in the suite.
 * 3. The folio (`۰۱ / ۰۶`) sits in the outer margin, so the band declares
 *    itself part of a numbered suite instead of floating as a hero.
 * 4. The standfirst is a `.lede` at 17–19px rather than 16px, and the entrance
 *    is one orchestrated sequence of five beats rather than four stacked
 *    `animate-reveal-up` classes.
 */
export default function Hero({ onNavigate = () => {} }) {
  const base = import.meta.env.BASE_URL;

  return (
    <section className="relative overflow-hidden bg-ink-band text-cream">
      {/* a single pool of light, so the dark field has depth instead of flatness */}
      <div aria-hidden="true" className="hero-light" />
      {/* and a soft fall at the corners, so the field has edges */}
      <div aria-hidden="true" className="band-vignette" />

      {/* faint oversized wordmark, held clear of the plate at every width */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -end-10 bottom-0 hidden select-none font-latin text-[9rem] leading-none text-cream/[0.05] xl:block"
      >
        Diba
      </span>

      <div className="shell relative grid grid-cols-1 items-center gap-14 py-16 sm:py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
        <div className="lg:col-span-6 lg:pe-10">
          {/* the folio line: number, rule, and what this plate is */}
          <p className="flex animate-reveal-up items-center gap-3 text-xs text-cream/60">
            <span className="font-display tabular-nums text-gold-soft">۰۱</span>
            <span aria-hidden="true" className="h-px w-10 bg-gold/50" />
            <span>آتلیهٔ دعوت دیجیتال · تهران</span>
            <span aria-hidden="true" className="h-px w-6 bg-cream/20" />
            <span lang="en" className="latin text-cream/55">Est. 2015</span>
          </p>

          <h1 className="display-hero mt-8 animate-reveal-up text-cream [animation-delay:90ms]">
            دعوتی که
            <span className="mt-2 block text-gold-soft">به خاطره بدل می‌شود.</span>
          </h1>

          <p className="lede mt-8 max-w-[32rem] animate-reveal-up text-cream/72 [animation-delay:180ms] md:text-cream/75">
            کارت‌پستال و دعوت‌نامه‌های دیجیتال فاخر، با حس اصیل گشودن پاکت؛
            مهر موم برجسته، تایپوگرافی فارسی، موسیقی اختصاصی و ثبت حضور آنلاین.
          </p>

          <div className="mt-11 flex animate-reveal-up flex-wrap items-center gap-x-9 gap-y-5 [animation-delay:270ms]">
            <button
              type="button"
              onClick={() => onNavigate('wedding-amir-sara')}
              className="btn btn-cream"
            >
              گشودن یک دعوت‌نامه
              <ArrowUpLeft className="size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="link-underline link-underline-cream before:absolute before:inset-x-0 before:-inset-y-2 before:content-['']"
            >
              <Play className="size-3.5 text-gold" aria-hidden="true" />
              تماشای گالری نمونه‌ها
            </button>
          </div>

          {/* the colophon line: what the suite contains, in prose, not in figures */}
          <p className="mt-14 max-w-md animate-reveal-up border-t border-cream/15 pt-5 text-xs leading-[1.9] text-cream/55 [animation-delay:360ms]">
            شش مجموعهٔ تخصصی، از عروسی و یادبود تا افتتاحیه و نوروز؛ هر یک با
            پالت، تایپوگرافی و ریتم باز شدنِ اختصاصی خود.
          </p>
        </div>

        <div className="relative lg:col-span-6">
          <div className="relative mx-auto max-w-[540px] animate-reveal-up [animation-delay:200ms]">
            {/* Plate I — a tipped-in photograph on its mount */}
            <div className="plate-mount crop-marks">
              <span className="crop" aria-hidden="true" />
              <span className="crop" aria-hidden="true" />
              <span className="crop" aria-hidden="true" />
              <span className="crop" aria-hidden="true" />

              <figure className="relative aspect-[4/5] overflow-hidden bg-surface-2">
                <Picture
                  src={`${base}images/wedding-cover.jpg`}
                  alt="جزئیات گل‌آرایی و دعوت‌نامهٔ عروسی دیبا"
                  {...imageSize('wedding-cover.jpg')}
                  sizes="(min-width:1024px) 540px, min(100vw - 3rem, 540px)"
                  fetchPriority="high"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-scrim/65 via-scrim/5 to-transparent" />

                {/* a single soft pass of light across the plate, once, on load */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 left-0 w-1/3 animate-sheen bg-gradient-to-r from-transparent via-cream/20 to-transparent motion-reduce:hidden"
                />

                <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-6 text-cream">
                  <span>
                    <span lang="en" className="latin block text-xs text-cream/85">
                      Plate I · The wedding collection
                    </span>
                    <span className="mt-2 block font-display text-xl leading-snug">
                      عروسی امیر و سارا
                    </span>
                  </span>
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-cream/40 backdrop-blur-sm">
                    <ArrowUpLeft className="size-4" aria-hidden="true" />
                  </span>
                </figcaption>
              </figure>

              {/* the museum label, under the plate, on the mount */}
              <p className="plate-caption mt-3 flex items-baseline justify-between gap-4 text-cream/55">
                <span lang="en" className="latin">Wedding suite, 1405</span>
                <span className="font-display tabular-nums text-gold-soft/80">۱ / ۶</span>
              </p>
            </div>

            {/* wax seal, pressed onto the mount's outer corner */}
            <div
              aria-hidden="true"
              className="absolute -end-5 top-10 animate-float-soft motion-reduce:animate-none sm:-end-7"
            >
              <WaxSeal
                className="size-24 rotate-[-8deg] shadow-seal-lg"
                ringClassName="size-16 text-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/12">
        <div className="shell flex flex-wrap items-center justify-between gap-2 py-4 text-xs text-cream/50">
          <span>تهران، با ارسال دیجیتال به سراسر ایران</span>
          <span lang="en" className="latin">Handcrafted digital invitations</span>
        </div>
      </div>
    </section>
  );
}