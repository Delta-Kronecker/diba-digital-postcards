import React, { useState } from 'react';
import { ArrowUpLeft, Check } from 'lucide-react';
import ThreeDEnvelope from './3DEnvelope';
import AudioPlayer from './AudioPlayer';

const STEPS = [
  {
    number: '۰۱',
    title: 'مهر را لمس کنید',
    text: 'مهمان با یک پاکت دست‌ساز و مهر موم برجسته روبه‌رو می‌شود؛ اولین لحظهٔ تجربه.',
  },
  {
    number: '۰۲',
    title: 'پاکت گشوده می‌شود',
    text: 'لبهٔ پاکت با فیزیک نرم باز می‌شود و کارت اصلی آرام بالا می‌آید.',
  },
  {
    number: '۰۳',
    title: 'دعوت، زنده می‌شود',
    text: 'موسیقی، شمارش معکوس، آلبوم تصاویر و فرم حضور، همه در یک جریان.',
  },
];

export default function OpeningExperience({ onNavigate = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="relative overflow-hidden bg-ink-band py-20 text-cream md:py-28">
      <div className="light-beam-container opacity-60" aria-hidden="true">
        <div className="light-beam" />
        <div className="light-beam-2" />
      </div>

      <div className="shell relative z-10">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="flex items-center gap-3 text-xs text-cream/60">
              <span className="tabular-nums text-gold-soft">۰۲</span>
              <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
              تجربهٔ گشودن پاکت
            </p>
            <h2 className="display-section mt-6 text-cream">
              تجربه‌ای که با
              <span className="text-gold-soft"> یک لمس </span>
              آغاز می‌شود.
            </h2>
            <p className="mt-6 max-w-md text-sm leading-[2] text-cream/65">
              پاکت دیجیتال دیبا یک صفحهٔ ساده نیست؛ یک مراسم کوچک است. از مهر موم
              تا باز شدن کارت، هر مرحله با ریتم و جزئیات طراحی شده تا مهمان احساس
              کند دعوتی شخصی در دست دارد.
            </p>

            <ol className="mt-10 border-t border-cream/15">
              {STEPS.map((step) => (
                <li key={step.number} className="flex gap-5 border-b border-cream/15 py-5">
                  <span className="mt-0.5 text-xs tabular-nums text-gold-soft">{step.number}</span>
                  <div>
                    <h3 className="font-display text-base text-cream">{step.title}</h3>
                    <p className="mt-1 text-xs leading-[1.95] text-cream/65">{step.text}</p>
                  </div>
                </li>
              ))}
            </ol>

            <button
              type="button"
              onClick={() => onNavigate('wedding-amir-sara')}
              className="btn btn-cream mt-9"
            >
              تجربهٔ کامل کارت عروسی
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="lg:col-span-7">
            <div className="relative border border-cream/15 bg-cream/[0.03] p-5 sm:p-8">
              {/* corner ticks */}
              {['-right-px -top-px', '-left-px -top-px', '-right-px -bottom-px', '-left-px -bottom-px'].map(
                (pos) => (
                  <span
                    key={pos}
                    aria-hidden="true"
                    className={`absolute h-3 w-3 border border-gold/70 ${pos}`}
                  />
                )
              )}

              <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-cream/12 pb-4">
                <span className="flex items-center gap-2 text-xs text-cream/65">
                  <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                  پیش‌نمایش زندهٔ پاکت
                </span>
                <AudioPlayer
                  trackType="synth-romantic"
                  trackTitle="والس عشق"
                  accentColor="var(--color-gold)"
                  onDark
                />
              </div>

              <ThreeDEnvelope
                isOpen={isOpen}
                onOpen={() => setIsOpen(true)}
                sealText="د"
                title="دعوت‌نامهٔ اختصاصی دیبا"
                accentColor="#b08b52"
                hasGold
                showBeams={false}
              >
                <div className="border border-paper-line bg-paper p-8 text-center text-paper-ink sm:p-10">
                  <span lang="en" className="latin block text-xs text-paper-ink-muted">The card is open</span>
                  <h3 className="mt-4 font-display text-2xl font-medium sm:text-3xl">
                    شما وارد دعوت شده‌اید
                  </h3>
                  <p className="mx-auto mt-3 max-w-sm text-xs leading-[2] text-paper-ink-muted">
                    همهٔ جزئیات مراسم، آلبوم تصاویر، شمارش معکوس و فرم اعلام حضور
                    در همین کارت در دسترس شماست.
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="mt-7 inline-flex items-center gap-2 border-b border-paper-gold pb-1 text-xs text-paper-gold-deep"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    بستن دوبارهٔ پاکت
                  </button>
                </div>
              </ThreeDEnvelope>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
