import React from 'react';
import { Sparkles, Heart, Moon, Building2, Gift, PartyPopper, Mail } from 'lucide-react';

export default function Footer({ onNavigate = () => {} }) {
  const categories = [
    { id: 'wedding-amir-sara', label: 'عروسی و عقد (P0)', icon: Heart },
    { id: 'memorial-haj-reza', label: 'ترحیم و یادبود (P0 - Zero Gold)', icon: Moon },
    { id: 'general-gallery-opening', label: 'نمایشگاه و عمومی', icon: Building2 },
    { id: 'opening-tech-hub', label: 'افتتاحیه تجاری', icon: Mail },
    { id: 'festival-nowruz-1404', label: 'جشن‌ها و مناسبت‌ها', icon: PartyPopper },
    { id: 'birthday-aria-10', label: 'تولد و جشن اختصاصی', icon: Gift },
  ];

  return (
    <footer className="bg-[#25231F] text-stone-200 border-t border-amber-900/30 pt-16 pb-12 font-vazir relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-stone-800">
          
          {/* Col 1: Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold-foil p-0.5 flex items-center justify-center">
                <div className="w-full h-full bg-[#25231F] rounded-[10px] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                </div>
              </div>
              <span className="text-2xl font-bold font-estedad text-stone-100">دیبا</span>
            </div>
            <p className="text-sm text-stone-400 leading-relaxed max-w-md">
              پلتفرم استودیو طراحی کارت‌پستال‌ها و دعوت‌نامه‌های دیجیتال مجلل. ترکیبی هوشمندانه از ظرافت چاپ کلاسیک، تایپوگرافی اصیل ایرانی و انیمیشن‌های سه‌بعدی پیشرفته.
            </p>
            <div className="pt-2 text-xs text-amber-400/80">
              طراحی شده مطابق استانداردهای بین‌المللی تایپوگرافی دیجیتال (Estedad & Vazirmatn)
            </div>
          </div>

          {/* Col 2: Category Viewers */}
          <div>
            <h4 className="text-sm font-bold font-estedad text-stone-100 mb-4 tracking-wider uppercase text-amber-400/90">
              نمونه کارت‌ها (Viewers)
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              {categories.map((cat) => {
                const Icon = cat.icon;
                return (
                  <li key={cat.id}>
                    <button
                      onClick={() => onNavigate(cat.id)}
                      className="flex items-center gap-2 hover:text-amber-300 transition-colors text-right"
                    >
                      <Icon className="w-3.5 h-3.5 text-amber-500/70" />
                      {cat.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Features & Studio */}
          <div>
            <h4 className="text-sm font-bold font-estedad text-stone-100 mb-4 tracking-wider uppercase text-amber-400/90">
              بخش‌های دموی پلتفرم
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-300">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-300 transition-colors">
                  صفحه اصلی و ویژگی‌ها
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('customizer')} className="hover:text-amber-300 transition-colors">
                  استودیو سفارشی‌سازی زنده
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('gallery')} className="hover:text-amber-300 transition-colors">
                  گالری و فیلترهای موضوعی
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('wedding-amir-sara')} className="hover:text-amber-300 transition-colors">
                  انیمیشن پاکت سه‌بعدی و مهر موم
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('memorial-haj-reza')} className="hover:text-amber-300 transition-colors">
                  قالب وقارآمیز ترحیم (Zero Gold)
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div>
            © ۱۴۰۴ دیبا (Ponisha) — تمامی حقوق برای دمو دیجیتال محفوظ است.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-stone-400">100% RTL & Accessible</span>
            <span className="text-stone-400">Responsive Desktop & Mobile</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
