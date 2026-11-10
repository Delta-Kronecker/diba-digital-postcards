import React from 'react';
import { PenLine, Sparkles, Send } from 'lucide-react';

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
    <section className="border-y border-line bg-surface">
      <div className="shell grid grid-cols-1 gap-14 py-20 md:py-28 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <p className="mb-4 flex items-center gap-3 text-xs text-ink-subtle">
            <span className="tabular-nums text-gold-deep">۰۳</span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
            فرایند سفارش
          </p>
          <h2 className="display-section max-w-sm text-ink">
            سه حرکت،
            <span className="block text-ink-muted">یک اثر ماندگار.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-[2] text-ink-muted">
            هر پروژه از یک گفت‌وگوی کوتاه شروع می‌شود و با یک کارت آمادهٔ ارسال
            پایان می‌یابد. بدون قالب‌های آماده، بدون جزئیات تکراری.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 font-display text-lg text-gold-deep">
              د
            </span>
            <div>
              <p className="font-display text-sm text-ink">استودیو دیبا</p>
              <p lang="en" className="latin mt-1 text-xs text-ink-subtle">Tehran, Since 2015</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={step.number}>
                <div className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 border-t border-line py-9 last:border-b">
                  <span className="font-display text-3xl font-medium leading-none tabular-nums text-gold-deep/75 transition-colors duration-base group-hover:text-gold-deep md:text-4xl">
                    {step.number}
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-medium text-ink transition-colors duration-base group-hover:text-gold-deep md:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-md text-sm leading-[2] text-ink-muted">{step.text}</p>
                  </div>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line text-ink-subtle transition-colors duration-base group-hover:border-gold group-hover:text-gold">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
