import React from 'react';

const ITEMS = [
  'عروسی و عقد',
  'ترحیم و یادبود',
  'افتتاحیهٔ تجاری',
  'نوروز و مناسبت‌ها',
  'تولد و جشن',
  'نمایشگاه و گالری',
];

export default function MarqueeBand() {
  const row = [...ITEMS, ...ITEMS];

  return (
    <section aria-label="دسته‌بندی‌های آتلیه" className="overflow-hidden border-b border-line bg-ink-band py-4 text-cream">
      <p className="sr-only">{ITEMS.join('، ')}</p>
      <div className="marquee-mask" aria-hidden="true">
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {row.map((item, i) => (
                <span key={`${copy}-${i}`} className="flex items-center">
                  <span className="whitespace-nowrap px-6 font-body text-xs text-cream/75">
                    {item}
                  </span>
                  <span className="size-1 rotate-45 bg-gold/70" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
