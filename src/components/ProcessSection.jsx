import React from 'react';
import { PenLine, Sparkles, Send } from 'lucide-react';
import SectionMark from './SectionMark';
import WaxSeal from './WaxSeal';

const STEPS = [
  {
    number: '۰۱',
    icon: PenLine,
    title: 'روایت شما را می‌شنویم',
    text: 'نام‌ها، تاریخ، مکان و حسِی که می‌خواهید منتقل شود؛ همهٔ مواد اولیهٔ طراحی.',
  },
  {
    number: '۰۲',
    icon: Sparkles,
    title: 'کارت را دست‌ساز می‌کنیم',
    text: 'تایپوگرافی، پالت رنگ، مهر موم و ریتم انیمیشن، اختصاصی برای مناسبت شما.',
  },
  {
    number: '۰۳',
    icon: Send,
    title: 'لینک، آمادهٔ ارسال است',
    text: 'یک لینک سبک و سریع؛ بدون اپلیکیشن، روی هر گوشی و با ثبت پاسخ مهمانان.',
  },
];

export default function ProcessSection() {
  return (
    <section className="paper-sheet border-y border-line bg-surface">
      <div className="shell grid grid-cols-1 gap-14 section-y lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <SectionMark number="۰۳" className="mb-4">فرایند سفارش</SectionMark>
          <h2 className="display-section max-w-sm text-ink">
            سه حرکت،
            <span className="block text-ink-muted">یک اثر ماندگار.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-[2] text-ink-muted">
            هر پروژه از یک گفت‌وگوی کوتاه شروع می‌شود و با یک کارت آمادهٔ ارسال
            پایان می‌یابد. بدون قالب‌های آماده، بدون جزئیات تکراری.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <WaxSeal className="size-12 shadow-seal" ringClassName="size-8 text-sm" />
            <div>
              <p className="font-display text-sm text-ink">استودیو دیبا</p>
              <p lang="en" className="latin mt-1 text-xs text-ink-subtle">Tehran, Since 2015</p>
            </div>
          </div>
        </div>

        {/* One rule per boundary. The old `last:border-b` sat on a row that was
            always its parent's only child, so every row matched it and each
            boundary drew two hairlines on top of each other. */}
        <div className="lg:col-span-7 divide-y divide-line border-y border-line">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === STEPS.length - 1;
            return (
              <div
                key={step.number}
                className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 py-9"
              >
                {/* item 49 — "سه حرکت" is a sequence, and nothing joined the three
                    numerals. The rule is drawn in the gap between one numeral and
                    the next (`py-9` leaves 73 px of air), never across a glyph, and
                    it is `pointer-events-none` so nothing is covered. */}
                <span className="relative flex justify-center">
                  {/* `/75` measured 3.58:1 light / 3.46:1 dark. Below the item's
                      4.5:1 bar, so the alpha is adjusted: `/95` clears it in both
                      themes while keeping the numeral quieter than the title, and
                      the hover still intensifies to the full token. */}
                  <span className="font-display text-3xl font-medium leading-none tabular-nums text-gold-deep/95 transition-colors duration-base group-hover:text-gold-deep md:text-4xl">
                    {step.number}
                  </span>
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute start-1/2 top-full mt-2 h-14 w-px -translate-x-1/2 bg-line"
                    />
                  )}
                </span>
                <div>
                  <h3 className="font-display text-2xl font-medium text-ink transition-colors duration-base group-hover:text-gold-deep md:text-3xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-[2] text-ink-muted">{step.text}</p>
                </div>
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-subtle transition-colors duration-base group-hover:border-gold group-hover:text-gold">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
