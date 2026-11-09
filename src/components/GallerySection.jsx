import React, { useState } from 'react';
import { ArrowUpLeft, SlidersHorizontal } from 'lucide-react';
import { INVITATIONS_DATA } from '../data/invitations';
import { toPersianDigits } from '../utils/numbers';
import Reveal from './Reveal';
import Picture from './Picture';

const FILTERS = [
  { id: 'all', label: 'همه' },
  { id: 'wedding', label: 'عروسی' },
  { id: 'memorial', label: 'یادبود' },
  { id: 'general', label: 'نمایشگاه' },
  { id: 'opening', label: 'افتتاحیه' },
  { id: 'festival', label: 'مناسبت‌ها' },
  { id: 'birthday', label: 'تولد' },
];

const CATEGORY_LABEL = {
  wedding: 'عروسی و عقد',
  memorial: 'ترحیم و یادبود',
  general: 'نمایشگاه و عمومی',
  opening: 'افتتاحیهٔ تجاری',
  festival: 'جشن‌ها و مناسبت‌ها',
  birthday: 'تولد و جشن اختصاصی',
};

const ALL = Object.values(INVITATIONS_DATA);

export default function GallerySection({ onNavigate = () => {} }) {
  const [filter, setFilter] = useState('all');
  const [active, setActive] = useState(0);

  const cards = filter === 'all' ? ALL : ALL.filter((card) => card.category === filter);
  const activeCard = cards[active] || cards[0];

  const countFor = (id) =>
    id === 'all' ? ALL.length : ALL.filter((card) => card.category === id).length;

  const isMemorial = activeCard?.category === 'memorial';

  return (
    <section id="gallery" className="shell py-20 md:py-28">
      <Reveal className="grid grid-cols-1 items-end gap-6 border-b border-line pb-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-5">نمایشگاه · آرشیو</p>
          <h2 className="display-section max-w-2xl text-ink">
            نمونه‌ها را ورق بزنید،
            <span className="text-ink-muted"> حس هر مناسبت را ببینید.</span>
          </h2>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <p className="max-w-xs text-xs leading-[2] text-ink-muted">
            هر کارت یک دنیای مستقل است؛ از پالت رنگ و تایپوگرافی تا ریتم باز شدن پاکت.
          </p>
        </div>
      </Reveal>

      <div className="flex items-center gap-3 border-b border-line py-3">
        <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
        <div
          role="toolbar"
          aria-label="فیلتر دسته‌بندی نمونه‌ها"
          className="flex flex-1 items-center gap-6 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {FILTERS.map((item) => {
            const isActive = filter === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setFilter(item.id);
                  setActive(0);
                }}
                aria-pressed={isActive}
                className={`relative shrink-0 whitespace-nowrap pb-1 font-body text-[12px] transition-colors ${
                  isActive ? 'text-ink' : 'text-ink-subtle hover:text-ink'
                }`}
              >
                {item.label}
                <span className="mr-1.5 text-[9px] text-ink-subtle">
                  {toPersianDigits(countFor(item.id))}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 right-0 h-px bg-gold transition-all duration-500 ${
                    isActive ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {toPersianDigits(cards.length)} کارت نمایش داده شد.
      </p>

      {!activeCard ? (
        <p className="py-16 text-center text-sm text-ink-subtle">نمونه‌ای در این دسته یافت نشد.</p>
      ) : (
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Index list — right column in RTL */}
          <Reveal className="lg:col-span-7">
            <div className="border-b border-line">
              {cards.map((card, index) => {
                const isCurrent = index === active;
                const memorialCard = card.category === 'memorial';
                return (
                  <button
                    key={card.slug}
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onFocus={() => setActive(index)}
                    onClick={() => onNavigate(card.slug)}
                    aria-label={`مشاهدهٔ ${card.title}`}
                    className={`group relative flex w-full items-center gap-4 border-t border-line py-5 text-right transition-colors duration-300 sm:gap-6 sm:py-6 ${
                      isCurrent ? 'bg-gold/[0.045]' : 'hover:bg-surface/60'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 right-0 w-[2px] transition-transform duration-500 ${
                        isCurrent ? 'scale-y-100' : 'scale-y-0'
                      } ${memorialCard ? 'bg-olive' : 'bg-gold'}`}
                    />

                    <span
                      className={`latin w-7 shrink-0 pr-3 text-[11px] transition-colors ${
                        isCurrent ? (memorialCard ? 'text-olive' : 'text-gold-deep') : 'text-ink-subtle'
                      }`}
                    >
                      {toPersianDigits(String(index + 1).padStart(2, '0'))}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-[10px] tracking-[0.14em] ${
                          memorialCard ? 'text-olive' : 'text-ink-subtle'
                        }`}
                      >
                        {CATEGORY_LABEL[card.category] || card.categoryTitle}
                      </span>
                      <span
                        className={`mt-1.5 block font-display text-lg font-medium leading-snug transition-colors duration-300 sm:text-xl md:text-2xl ${
                          isCurrent
                            ? memorialCard
                              ? 'text-olive'
                              : 'text-gold-deep'
                            : 'text-ink'
                        }`}
                      >
                        {card.title}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        isCurrent ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100'
                      } ${
                        isCurrent
                          ? memorialCard
                            ? 'border-olive bg-olive text-cream'
                            : 'border-gold bg-gold text-cream'
                          : memorialCard
                            ? 'border-olive/40 text-olive'
                            : 'border-line-strong text-ink-muted group-hover:border-gold group-hover:text-gold'
                      }`}
                    >
                      <ArrowUpLeft className="h-4 w-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          </Reveal>

          {/* Live preview — left column in RTL */}
          <Reveal className="order-first lg:order-none lg:col-span-5" delay={100}>
            <div className="lg:sticky lg:top-24">
              <figure className="relative border border-line bg-surface p-3 shadow-soft">
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-[2px] ${
                    isMemorial ? 'bg-olive' : 'bg-gold'
                  }`}
                />
                <div className="relative h-[240px] overflow-hidden bg-surface-2 sm:h-[320px] lg:h-[420px]">
                  <Picture
                    key={activeCard.slug}
                    src={activeCard.coverImage}
                    alt={activeCard.title}
                    width="720"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full animate-fade-in object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15120e]/65 via-[#15120e]/10 to-transparent" />

                  <span className="absolute right-4 top-4 border border-cream/30 bg-[#15120e]/35 px-2.5 py-1 text-[9px] tracking-[0.14em] text-cream/90 backdrop-blur-sm">
                    {toPersianDigits(String(active + 1).padStart(2, '0'))} / {toPersianDigits(String(cards.length).padStart(2, '0'))}
                  </span>

                  {isMemorial && (
                    <span className="absolute left-4 top-4 border border-olive/50 bg-olive/25 px-2.5 py-1 text-[9px] tracking-[0.12em] text-cream backdrop-blur-sm">
                      بدون طلا
                    </span>
                  )}

                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream">
                    <span className="latin block text-[9px] text-cream/65">Selected work</span>
                    <span className="mt-1.5 block font-display text-xl leading-snug">
                      {activeCard.title}
                    </span>
                    <span className="mt-1 block text-[10px] text-cream/70">
                      {CATEGORY_LABEL[activeCard.category] || activeCard.categoryTitle}
                    </span>
                  </figcaption>
                </div>

                <div className="flex items-center justify-between gap-4 px-1 pt-3 text-[10px] text-ink-subtle">
                  <span className="latin tracking-[0.18em]">Diba Atelier</span>
                  <button
                    type="button"
                    onClick={() => onNavigate(activeCard.slug)}
                    className="inline-flex items-center gap-1.5 text-ink transition-colors hover:text-gold-deep"
                  >
                    مشاهدهٔ کارت
                    <ArrowUpLeft className="h-3 w-3" aria-hidden="true" />
                  </button>
                </div>
              </figure>

              <p className="mt-4 hidden text-center text-[10px] leading-[1.9] text-ink-subtle lg:block lg:text-right">
                برای پیش‌نمایش، روی هر سطر حرکت کنید.
              </p>
            </div>
          </Reveal>
        </div>
      )}
    </section>
  );
}
