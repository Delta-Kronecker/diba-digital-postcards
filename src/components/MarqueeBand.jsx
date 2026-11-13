import React from 'react';

const ITEMS = [
  'عروسی و عقد',
  'ترحیم و یادبود',
  'افتتاحیهٔ تجاری',
  'نوروز و مناسبتها',
  'تولد و جشن',
  'نمایشگاه و گالری',
];

/* The same six, in the atelier's second language. The counter-row is the page's
   depth, not a second message, so it says the same thing more quietly instead of
   repeating the Persian at lower contrast. */
const ITEMS_LATIN = [
  'Weddings',
  'Memorials',
  'Corporate openings',
  'Nowruz & occasions',
  'Birthdays',
  'Exhibitions',
];

function Row({ items, reverse = false, quiet = false }) {
  const doubled = [...items, ...items];

  return (
    <div className={`marquee-track${reverse ? ' marquee-track-reverse' : ''}`}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 items-center">
          {doubled.map((item, i) => (
            <span key={`${copy}-${i}`} className="flex items-center">
              <span
                lang={quiet ? 'en' : undefined}
                className={`whitespace-nowrap px-6 text-xs ${
                  quiet ? 'font-latin text-cream/55' : 'font-body text-cream/75'
                }`}
              >
                {item}
              </span>
              <span className={quiet ? 'size-1 rotate-45 bg-gold/40' : 'size-1.5 rotate-45 bg-gold/70'} />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

export default function MarqueeBand() {
  return (
    <section
      aria-label="دستهبندیهای آتلیه"
      className="marquee-band overflow-hidden border-y border-gold/20 bg-ink-band py-4 text-cream"
    >
      <p className="sr-only">{ITEMS.join('، ')}</p>
      <div className="marquee-mask" aria-hidden="true">
        <Row items={ITEMS} />
      </div>
      <div className="marquee-mask mt-3" aria-hidden="true">
        <Row items={ITEMS_LATIN} reverse quiet />
      </div>
    </section>
  );
}
