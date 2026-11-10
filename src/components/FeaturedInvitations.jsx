import React from 'react';
import { ArrowUpLeft, Sparkles } from 'lucide-react';
import Picture from './Picture';
import { toPersianDigits } from '../utils/numbers';

const BASE = import.meta.env.BASE_URL;

const ITEMS = [
  {
    id: 'wedding-amir-sara',
    index: '۰۱',
    category: 'عروسی و عقد',
    title: 'امیرحسین و سارا',
    description: 'پاکت مهر موم، آلبوم خاطرات، شمارش معکوس و ثبت حضور مهمانان.',
    image: `${BASE}images/wedding-cover.jpg`,
    alt: 'دعوت‌نامهٔ عروسی با گل‌آرایی و پاکت مهر موم',
    note: 'مجموعهٔ ویژه',
    lead: true,
    imageHeight: 'h-[380px] sm:h-[480px] lg:h-[600px]',
  },
  {
    id: 'memorial-haj-reza',
    index: '۰۲',
    category: 'ترحیم و یادبود',
    title: 'حاج رضا تهرانی',
    description: 'وقار، آرامش و آشکارسازی ملایم؛ بدون هیچ نشانهٔ طلایی.',
    image: `${BASE}images/memorial-cover.jpg`,
    alt: 'دعوت‌نامهٔ یادبود با فضایی آرام و سبز زیتونی',
    note: 'زیرو گلد',
    memorial: true,
    span: 'md:col-span-5',
    imageHeight: 'h-[340px] sm:h-[440px] lg:h-[520px]',
  },
  {
    id: 'general-gallery-opening',
    index: '۰۳',
    category: 'عمومی و نمایشگاه',
    title: 'گشایش گالری آرک',
    description: 'قاب مینیمال، آلبوم آثار و دعوت رسمی افتتاحیه.',
    image: `${BASE}images/general-cover.jpg`,
    alt: 'دعوت‌نامهٔ نمایشگاه هنری با طراحی مینیمال',
    span: 'md:col-span-7',
    imageHeight: 'h-[340px] sm:h-[440px] lg:h-[520px]',
  },
  {
    id: 'opening-tech-hub',
    index: '۰۴',
    category: 'افتتاحیهٔ تجاری',
    title: 'هاب فناوری آفتاب',
    description: 'رویداد شرکتی با نقشهٔ مسیر و ثبت‌نام مدعوین.',
    image: `${BASE}images/opening-cover.jpg`,
    alt: 'دعوت‌نامهٔ افتتاحیهٔ تجاری با فضای رسمی',
    span: 'md:col-span-4',
    imageHeight: 'h-[300px] sm:h-[360px] lg:h-[400px]',
  },
  {
    id: 'festival-nowruz-1404',
    index: '۰۵',
    category: 'جشن‌ها و مناسبت‌ها',
    title: 'نوروز ۱۴۰۴',
    description: 'نقش‌های ایرانی، رنگ گرم و تبریک گروهی.',
    image: `${BASE}images/festival-cover.jpg`,
    alt: 'کارت‌پستال نوروزی با نقش‌های ایرانی',
    span: 'md:col-span-4',
    imageHeight: 'h-[300px] sm:h-[360px] lg:h-[400px]',
  },
  {
    id: 'birthday-aria-10',
    index: '۰۶',
    category: 'تولد و جشن اختصاصی',
    title: 'تولد ده‌سالگی آریا',
    description: 'دعوت شاد با تایمر، آلبوم خاطرات و دفتر آرزوها.',
    image: `${BASE}images/birthday-cover.jpg`,
    alt: 'دعوت‌نامهٔ تولد با تم جشن و رنگ‌های شاد',
    note: 'سفارشی',
    span: 'md:col-span-4',
    imageHeight: 'h-[300px] sm:h-[360px] lg:h-[400px]',
  },
];

function CardArrow({ memorial }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors duration-base ${
        memorial
          ? 'border-sage/40 text-sage group-hover:bg-sage group-hover:text-cream'
          : 'border-line-strong text-ink-muted group-hover:border-gold group-hover:bg-gold group-hover:text-cream'
      }`}
    >
      <ArrowUpLeft className="h-4 w-4 transition-transform duration-base ease-out-expo group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" />
    </span>
  );
}

export default function FeaturedInvitations({ onNavigate = () => {} }) {
  return (
    <section id="collection" className="shell py-20 md:py-28">
      <div className="grid grid-cols-1 items-end gap-6 border-b border-line pb-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="mb-4 flex items-center gap-3 text-xs text-ink-subtle">
            <span className="tabular-nums text-gold-deep">۰۱</span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
            مجموعهٔ منتخب
          </p>
          <h2 className="display-section max-w-2xl text-ink">
            برای هر مناسبت،
            <span className="text-ink-muted"> یک زبانِ بصری تازه.</span>
          </h2>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <button type="button" onClick={() => onNavigate('gallery')} className="link-underline">
            <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
            مشاهدهٔ همهٔ نمونه‌ها
          </button>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12">
        {ITEMS.map((item, i) => {
          if (item.lead) {
            return (
              <div key={item.id} className="md:col-span-12">
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className="media-zoom group relative block w-full overflow-hidden border border-line bg-surface-2 text-start"
                >
                  <Picture
                    src={item.image}
                    alt={item.alt}
                    width="1600"
                    height="900"
                    loading="lazy"
                    decoding="async"
                    className={`w-full object-cover ${item.imageHeight}`}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-gradient-to-t from-scrim/90 via-scrim/60 to-scrim/15"
                  />

                  <span className="absolute start-4 top-4 border border-cream/30 bg-scrim/55 px-2.5 py-1 font-body text-xs tabular-nums text-cream/90 backdrop-blur-md">
                    {item.index} / {toPersianDigits(String(ITEMS.length).padStart(2, '0'))}
                  </span>

                  <span className="absolute end-4 top-4 border border-gold/40 bg-scrim/55 px-2.5 py-1 text-xs text-gold-soft backdrop-blur-md">
                    {item.note}
                  </span>

                  <span className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-6 p-6 text-cream sm:p-8 md:p-10">
                    <span className="max-w-xl">
                      <span className="block text-xs text-cream/90">{item.category}</span>
                      <span className="mt-2 block font-display text-3xl font-medium leading-tight sm:text-4xl md:text-5xl">
                        {item.title}
                      </span>
                      <span className="mt-3 block max-w-md text-xs leading-[2] text-cream/85">
                        {item.description}
                      </span>
                    </span>
                    <span className="inline-flex shrink-0 items-center gap-3 text-xs font-medium text-cream">
                      مشاهدهٔ کارت
                      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/40 backdrop-blur-sm transition-transform duration-base ease-out-expo group-hover:-translate-x-0.5 group-hover:-translate-y-0.5">
                        <ArrowUpLeft className="h-4 w-4" />
                      </span>
                    </span>
                  </span>
                </button>
              </div>
            );
          }

          return (
            <div key={item.id} className={item.span}>
              <button
                type="button"
                onClick={() => onNavigate(item.id)}
                className="group block w-full text-start"
              >
                <div className={`media-zoom relative overflow-hidden bg-surface-2 ${item.imageHeight}`}>
                  <Picture
                    src={item.image}
                    alt={item.alt}
                    width="800"
                    height="1000"
                    loading={i < 2 ? 'eager' : 'lazy'}
                    decoding="async"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-scrim/35 via-transparent to-transparent opacity-70 transition-opacity duration-slow group-hover:opacity-90" />

                  <span className="absolute start-4 top-4 border border-cream/30 bg-scrim/60 px-2.5 py-1 font-body text-xs text-cream/90 backdrop-blur-md">
                    {item.index}
                  </span>

                  {item.note && (
                    <span
                      className={`absolute end-4 top-4 border px-2.5 py-1 text-xs backdrop-blur-md ${
                        item.memorial
                          ? 'border-sage/40 bg-scrim/60 text-cream'
                          : 'border-gold/40 bg-scrim/60 text-gold-soft'
                      }`}
                    >
                      {item.note}
                    </span>
                  )}
                </div>

                <div className="rule-engage mt-5 flex items-start justify-between gap-4 border-t border-line pt-4">
                  <div>
                    <p className={`text-xs ${item.memorial ? 'text-sage' : 'text-ink-subtle'}`}>
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-medium text-ink transition-colors duration-base group-hover:text-gold-deep">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-[1.9] text-ink-muted">{item.description}</p>
                  </div>
                  <CardArrow memorial={item.memorial} />
                </div>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
