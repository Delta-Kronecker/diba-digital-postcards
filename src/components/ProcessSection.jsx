import React from 'react';
import { PenLine, Sparkles, Send } from 'lucide-react';
import Reveal from './Reveal';

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
        <Reveal className="lg:col-span-5">
          <p className="eyebrow mb-6">روش آتلیه</p>
          <h2 className="display-section max-w-sm text-ink">
            سه حرکت،
            <span className="block text-ink-muted">یک اثر ماندگار.</span>
          </h2>
          <p className="mt-6 max-w-sm text-sm leading-[2] text-ink-muted">
            هر پروژه از یک گفت‌وگوی کوتاه شروع می‌شود و با یک کارت آمادهٔ ارسال
            پایان می‌یابد. بدون قالب‌های آماده، بدون جزئیات تکراری.
          </p>

          <div className="mt-12 flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/50 font-display text-lg text-gold">
              د
            </span>
            <div>
              <p className="font-display text-sm text-ink">استودیو دیبا</p>
              <p className="latin mt-1 text-[9px] text-ink-subtle">Tehran · Since 2015</p>
            </div>
          </div>
        </Reveal>

        <div className="lg:col-span-7">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <Reveal key={step.number} delay={i * 80}>
                <div className="group grid grid-cols-[auto_1fr_auto] items-start gap-6 border-t border-line py-8 last:border-b">
                  <span className="latin pt-1 text-lg text-gold-deep">{step.number}</span>
                  <div>
                    <h3 className="font-display text-xl font-medium text-ink transition-colors group-hover:text-gold-deep md:text-2xl">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-md text-xs leading-[2] text-ink-muted">{step.text}</p>
                  </div>
                  <Icon className="mt-1 h-5 w-5 text-ink-subtle transition-colors group-hover:text-gold" aria-hidden="true" />
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
