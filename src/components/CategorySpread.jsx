import React from 'react';
import { Heart, Moon, Building2, Mail, PartyPopper, Gift, ArrowLeft, Sparkles, CheckCircle } from 'lucide-react';

export default function CategorySpread({ onNavigate = () => {} }) {
  const spreads = [
    {
      id: 'wedding-amir-sara',
      categoryId: 'wedding',
      title: 'عروسی و عقد',
      subtitle: 'حس واقعی گشودن پاکت با مهر موم برجسته، موزیک اختصاصی و آلبوم تصاویر',
      tag: 'دسته‌بندی اصلی P0',
      badge: 'پرطرفدارترین',
      accentColor: '#B49A70',
      dustyRose: '#A77D80',
      hasGold: true,
      image: `${import.meta.env.BASE_URL}images/wedding-cover.jpg`,
      icon: Heart,
      features: ['انیمیشن 3D باز شدن پاکت', 'تایمر معکوس زنده', 'موزیک سینث رومانتیک', 'فرم RSVP آنلاین'],
    },
    {
      id: 'memorial-haj-reza',
      categoryId: 'memorial',
      title: 'ترحیم و یادبود',
      subtitle: 'وقار، آرامش و احترام کامل بدون طلا با طیف رنگی سبز زیتونی و آشکارسازی آرام',
      tag: 'دسته‌بندی اصلی P0',
      badge: 'بدون طلا (Zero Gold)',
      accentColor: '#687567',
      hasGold: false, // MANDATE ZERO GOLD
      image: `${import.meta.env.BASE_URL}images/memorial-cover.jpg`,
      icon: Moon,
      features: ['ترکیب رنگ وقارآمیز Sage Green', 'انیمیشن محو آرام (Fade Reveal)', 'نوای ملایم تسلیت', 'ثبت یادداشت تسلیت'],
    },
    {
      id: 'general-gallery-opening',
      categoryId: 'general',
      title: 'عمومی و نمایشگاه',
      subtitle: 'طراحی مینیمال و معماری‌محور برای گالری‌های هنری، همایش‌ها و پیام‌های رسمی',
      tag: 'دسته‌بندی استاندارد',
      badge: 'مینیمال اصیل',
      accentColor: '#B49A70',
      hasGold: true,
      image: `${import.meta.env.BASE_URL}images/general-cover.jpg`,
      icon: Building2,
      features: ['قاب متالیک طلاکوب', 'آلبوم آثار نمایشگاه', 'تایمر برگزاری', 'اشتراک‌گذاری آسان'],
    },
    {
      id: 'opening-tech-hub',
      categoryId: 'opening',
      title: 'افتتاحیه و رویداد تجاری',
      subtitle: 'کارت‌های باوقار و فاخر شرکتی با تم سرمایه‌گذاری، روبان افتتاحیه و نقشه موقعیت',
      tag: 'دسته‌بندی تجاری',
      badge: 'سازمانی و فاخر',
      accentColor: '#B49A70',
      hasGold: true,
      image: `${import.meta.env.BASE_URL}images/opening-cover.jpg`,
      icon: Mail,
      features: ['دیزاین مشکی-طلایی فاخر', 'ثبت‌نام مدعوین رسمی', 'آدرس‌دهی دقیق venue', 'موزیک مدرن سازمانی'],
    },
    {
      id: 'festival-nowruz-1404',
      categoryId: 'festival',
      title: 'جشن‌ها و مناسبت‌های ملی',
      subtitle: 'تبریک عید نوروز و مناسبت‌های ملی با گرما و نشاط ایرانی و رنگ‌های گرم',
      tag: 'مناسبتی و اعیاد',
      badge: 'نوروز ۱۴۰۴',
      accentColor: '#A77D80',
      hasGold: true,
      image: `${import.meta.env.BASE_URL}images/festival-cover.jpg`,
      icon: PartyPopper,
      features: ['نقش و نگارهای اصیل ایرانی', 'تایمر تحویل سال', 'نواهای شاد سنتی', 'ارسال گروهی'],
    },
    {
      id: 'birthday-aria-10',
      categoryId: 'birthday',
      title: 'تولد و جشن اختصاصی',
      subtitle: 'دعوت‌نامه‌های شاد و هیجان‌انگیز تولد با تایمر معکوس، تم جشن و ثبت آرزوها',
      tag: 'جشن شخصی',
      badge: 'شاد و متمایز',
      accentColor: '#A77D80',
      hasGold: true,
      image: `${import.meta.env.BASE_URL}images/birthday-cover.jpg`,
      icon: Gift,
      features: ['دیزاین شاد و باکیفیت', 'پخش اهنگ تولد', 'فرم ثبت کادو و حضور', 'گالری خاطرات'],
    },
  ];

  return (
    <section id="categories" className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      
      {/* Section Title */}
      <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-900/10 border border-amber-900/20 text-amber-900 text-xs font-vazir">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          ۶ دسته‌بندی تخصصی کارت‌های دیجیتال
        </div>
        <h2 className="text-3xl md:text-5xl font-bold font-estedad text-stone-900 tracking-tight">
          تجربه‌ای متفاوت برای هر مناسبت ارزشمند
        </h2>
        <p className="text-stone-600 text-sm md:text-base font-vazir leading-relaxed">
          هر دسته‌بندی با هویت بصری مستقل، پالایش رنگ اختصاصی و انیمیشن‌های ویژه باز شدن پاکت طراحی گردیده است.
        </p>
      </div>

      {/* 6 Grid Spreads */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {spreads.map((spread) => {
          const Icon = spread.icon;
          return (
            <div
              key={spread.id}
              className="group relative bg-[#F6F1E9] rounded-3xl border border-stone-300/80 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden flex flex-col justify-between p-6 hover:-translate-y-1.5"
            >
              {/* Top Accent Hairline */}
              <div 
                className="absolute top-0 left-0 right-0 h-1.5 transition-all duration-300"
                style={{
                  background: spread.hasGold
                    ? 'linear-gradient(135deg, #B49A70 0%, #E6D5B8 50%, #B49A70 100%)'
                    : spread.accentColor
                }}
              />

              {/* Cover Image with Glass Overlay */}
              <div className="relative w-full h-52 rounded-2xl overflow-hidden mb-6 border border-stone-200 shadow-inner">
                <img
                  src={spread.image}
                  alt={spread.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-3 right-3">
                  <span className="px-3 py-1 rounded-full text-[11px] font-vazir font-semibold text-stone-900 bg-amber-100/90 backdrop-blur shadow-sm">
                    {spread.badge}
                  </span>
                </div>

                {/* Category Icon */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2 text-white">
                  <div className="w-8 h-8 rounded-full bg-stone-900/70 backdrop-blur border border-amber-400/40 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-amber-300" />
                  </div>
                  <span className="text-xs font-vazir font-medium text-stone-200">
                    {spread.tag}
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="space-y-3 text-right flex-1">
                <h3 className="text-2xl font-normal font-estedad text-stone-900 group-hover:text-amber-800 transition-colors">
                  {spread.title}
                </h3>
                <p className="text-xs text-stone-600 font-vazir leading-relaxed">
                  {spread.subtitle}
                </p>
              </div>

              {/* View Card CTA Button */}
              <div className="pt-4 border-t border-stone-200/80">
                <button
                  onClick={() => onNavigate(spread.id)}
                  className="w-full py-3 rounded-xl font-vazir font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-95 group-hover:shadow-lg"
                  style={{
                    background: spread.hasGold
                      ? 'linear-gradient(135deg, #B49A70 0%, #E6D5B8 50%, #B49A70 100%)'
                      : spread.accentColor,
                    color: spread.hasGold ? '#25231F' : '#FFF'
                  }}
                >
                  مشاهده کارت نمونه {spread.title}
                  <ArrowLeft className="w-4 h-4" />
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </section>
  );
}
