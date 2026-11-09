import React from 'react';
import { ArrowUpLeft, Sparkles } from 'lucide-react';
import Reveal from './Reveal';
import Picture from './Picture';

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
    span: 'md:col-span-7',
    imageHeight: 'h-[340px] sm:h-[440px] lg:h-[520px]',
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
    span: 'md:col-span-4',
    imageHeight: 'h-[300px] sm:h-[360px] lg:h-[400px]',
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
    span: 'md:col-span-12',
    imageHeight: 'h-[280px] sm:h-[340px]',
    wide: true,
  },
];

function CardArrow({ memorial }) {
  return (
    <span
      aria-hidden="true"
      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
        memorial
          ? 'border-olive/40 text-olive group-hover:bg-olive group-hover:text-cream'
          : 'border-line-strong text-ink-muted group-hover:border-gold group-hover:bg-gold group-hover:text-cream'
      }`}
    >
      <ArrowUpLeft className="h-4 w-4" />
    </span>
  );
}

export default function FeaturedInvitations({ onNavigate = () => {} }) {
  return (
    <section id="collection" className="shell py-20 md:py-28">
      <Reveal className="grid grid-cols-1 items-end gap-6 border-b border-line pb-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <p className="eyebrow mb-5">مجموعهٔ آتلیه</p>
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
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-12">
        {ITEMS.map((item, i) => {
          if (item.wide) {
            return (
              <Reveal key={item.id} className="md:col-span-12" delay={40}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  className="group grid w-full grid-cols-1 items-center gap-8 border-y border-line py-8 text-right md:grid-cols-12 md:gap-12 md:py-10"
                >
                  <div className="media-zoom relative overflow-hidden bg-surface-2 md:col-span-7">
                    <Picture
                      src={item.image}
                      alt={item.alt}
                      width="960"
                      height="540"
                      loading="lazy"
                      decoding="async"
                      className="h-[280px] w-full object-cover sm:h-[340px]"
                    />
                  </div>
                  <div className="md:col-span-5">
                    <div className="flex items-center justify-between gap-4">
                      <span className="latin text-[10px] text-ink-subtle">{item.index} / 06</span>
                      <span className="rounded-full border border-gold/40 px-3 py-1 text-[9px] tracking-[0.14em] text-gold-deep">
                        {item.note}
                      </span>
                    </div>
                    <p className="mt-6 text-[10px] tracking-[0.16em] text-ink-subtle">{item.category}</p>
                    <h3 className="mt-2 font-display text-3xl font-medium text-ink md:text-4xl">{item.title}</h3>
                    <p className="mt-3 max-w-sm text-xs leading-[2] text-ink-muted">{item.description}</p>
                    <span className="mt-8 inline-flex items-center gap-3 text-xs font-medium text-ink">
                      مشاهدهٔ کارت
                      <CardArrow />
                    </span>
                  </div>
                </button>
              </Reveal>
            );
          }

          return (
            <Reveal key={item.id} className={item.span} delay={i > 1 ? 60 : 0}>
              <button
                type="button"
                onClick={() => onNavigate(item.id)}
                className="group block w-full text-right"
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#15120e]/35 via-transparent to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />

                  <span className="absolute right-4 top-4 border border-cream/30 bg-[#15120e]/60 px-2.5 py-1 font-body text-[10px] text-cream/90 backdrop-blur-md">
                    {item.index}
                  </span>

                  {item.note && (
                    <span
                      className={`absolute left-4 top-4 border px-2.5 py-1 text-[9px] tracking-[0.12em] backdrop-blur-md ${
                        item.memorial
                          ? 'border-olive/40 bg-[#15120e]/60 text-cream'
                          : 'border-gold/40 bg-[#15120e]/60 text-gold-soft'
                      }`}
                    >
                      {item.note}
                    </span>
                  )}
                </div>

                <div className="mt-5 flex items-start justify-between gap-4 border-t border-line pt-4">
                  <div>
                    <p className={`text-[10px] tracking-[0.16em] ${item.memorial ? 'text-olive' : 'text-ink-subtle'}`}>
                      {item.category}
                    </p>
                    <h3 className="mt-2 font-display text-2xl font-medium text-ink transition-colors duration-300 group-hover:text-gold-deep">
                      {item.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-[11px] leading-[1.9] text-ink-muted">{item.description}</p>
                  </div>
                  <CardArrow memorial={item.memorial} />
                </div>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
