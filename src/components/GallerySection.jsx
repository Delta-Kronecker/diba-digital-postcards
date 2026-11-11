import React, { useState } from 'react';
import { ArrowUpLeft, SlidersHorizontal } from 'lucide-react';
import { INVITATIONS_DATA } from '../data/invitations';
import { toPersianDigits } from '../utils/numbers';
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
      <div className="grid grid-cols-1 items-end gap-6 border-b border-line pb-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="mb-4 flex items-center gap-3 text-xs text-ink-subtle">
            <span className="tabular-nums text-gold-deep">۰۴</span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
            گالری نمونهها
          </p>
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
      </div>

      <div className="flex items-center gap-3 border-b border-line py-3">
        <SlidersHorizontal className="size-3.5 shrink-0 text-ink-subtle" aria-hidden="true" />
        <div
          role="toolbar"
          aria-label="فیلتر دسته‌بندی نمونه‌ها"
          className="flex flex-1 flex-wrap items-center gap-x-6 gap-y-1 py-1"
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
                className={`group relative shrink-0 whitespace-nowrap pb-1 font-body text-xs transition-colors ${
                  isActive ? 'text-ink' : 'text-ink-subtle hover:text-ink'
                }`}
              >
                {item.label}
                <span className="ms-1.5 text-xs text-ink-subtle">
                  {toPersianDigits(countFor(item.id))}
                </span>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 start-0 h-px origin-right scale-x-0 bg-gold transition-transform duration-slow ${
                    isActive ? 'scale-x-100' : 'group-hover:scale-x-100'
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
          {/* Index list, right column in RTL */}
          <div className="lg:col-span-7">
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
                    className={`group relative flex w-full items-center gap-4 border-t border-line py-5 text-start transition-colors duration-base sm:gap-6 sm:py-6 ${
                      isCurrent ? 'bg-gold/[0.045]' : 'hover:bg-surface/60'
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute inset-y-0 start-0 w-[2px] transition-transform duration-slow ${
                        isCurrent ? 'scale-y-100' : 'scale-y-0'
                      } ${memorialCard ? 'bg-sage' : 'bg-gold'}`}
                    />

                    <span
                      className={`w-8 shrink-0 ps-3 text-xs tabular-nums transition-colors ${
                        isCurrent ? (memorialCard ? 'text-sage' : 'text-gold-deep') : 'text-ink-subtle'
                      }`}
                    >
                      {toPersianDigits(String(index + 1).padStart(2, '0'))}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-xs ${
                          memorialCard ? 'text-sage' : 'text-ink-subtle'
                        }`}
                      >
                        {CATEGORY_LABEL[card.category] || card.categoryTitle}
                      </span>
                      <span
                        className={`mt-1.5 block font-display text-lg font-medium leading-snug transition-colors duration-base sm:text-xl md:text-2xl ${
                          isCurrent
                            ? memorialCard
                              ? 'text-sage'
                              : 'text-gold-deep'
                            : 'text-ink'
                        }`}
                      >
                        {card.title}
                      </span>
                    </span>

                    <span
                      aria-hidden="true"
                      className={`flex size-10 shrink-0 items-center justify-center rounded-full border transition-colors duration-base ${
                        isCurrent ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0 sm:group-hover:translate-x-0 sm:group-hover:opacity-100'
                      } ${
                        isCurrent
                          ? memorialCard
                            ? 'border-sage bg-sage-solid text-cream'
                            : 'border-gold bg-gold-solid text-cream'
                          : memorialCard
                            ? 'border-sage/40 text-sage'
                            : 'border-line-strong text-ink-muted group-hover:border-gold group-hover:text-gold'
                      }`}
                    >
                      <ArrowUpLeft className="size-4" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Live preview, left column in RTL */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <figure className="relative border border-line bg-surface p-3">
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-0 top-0 h-[2px] ${
                    isMemorial ? 'bg-sage' : 'bg-gold'
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
                  <div className="absolute inset-0 bg-gradient-to-t from-scrim/80 via-scrim/25 to-transparent" />

                  <span className="absolute start-4 top-4 border border-cream/30 bg-scrim/35 px-2.5 py-1 text-xs tabular-nums text-cream/90 backdrop-blur-sm">
                    {toPersianDigits(String(active + 1).padStart(2, '0'))} / {toPersianDigits(String(cards.length).padStart(2, '0'))}
                  </span>

                  {isMemorial && (
                    <span className="absolute end-4 top-4 border border-sage/50 bg-sage/25 px-2.5 py-1 text-xs text-cream backdrop-blur-sm">
                      بدون طلا
                    </span>
                  )}

                  <figcaption className="absolute inset-x-0 bottom-0 p-5 text-cream">
                    <span lang="en" className="latin block text-xs text-cream/80">Selected work</span>
                    <span className="mt-1.5 block font-display text-xl leading-snug">
                      {activeCard.title}
                    </span>
                    <span className="mt-1 block text-xs text-cream/85">
                      {CATEGORY_LABEL[activeCard.category] || activeCard.categoryTitle}
                    </span>
                  </figcaption>
                </div>

                <div className="flex items-center justify-between gap-4 px-1 pt-3 text-xs text-ink-subtle">
                  <span lang="en" className="latin">Diba Atelier</span>
                  <button
                    type="button"
                    onClick={() => onNavigate(activeCard.slug)}
                    className="-mt-1.5 inline-flex items-center gap-1.5 border-b border-line-strong pt-1.5 pb-0.5 text-ink transition-colors hover:border-gold hover:text-gold-deep"
                  >
                    مشاهدهٔ کارت
                    <ArrowUpLeft className="size-3" aria-hidden="true" />
                  </button>
                </div>
              </figure>

              <p className="mt-4 hidden text-center text-xs leading-[1.9] text-ink-subtle lg:block lg:text-start">
                برای پیش‌نمایش، روی هر سطر حرکت کنید.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
