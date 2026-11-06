import React, { useState } from 'react';
import { Sparkles, Play, Shield, Smartphone, HeartHandshake, CheckCircle2 } from 'lucide-react';
import ThreeDEnvelope from './3DEnvelope';
import AudioPlayer from './AudioPlayer';

export default function InteractiveShowcase({ onNavigate = () => {} }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="bg-[#25231F] text-stone-100 rounded-3xl p-8 md:p-12 border border-amber-900/30 relative overflow-hidden shadow-2xl">
        
        {/* Glow */}
        <div className="absolute top-10 right-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Description */}
          <div className="lg:col-span-5 space-y-6 text-right">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-vazir">
              <Sparkles className="w-3.5 h-3.5" />
              ویترین تجربه تعاملی
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold font-estedad leading-tight text-white">
              تجربه «لحظه گشودن» با انیمیشن فیزیک‌محور سه‌بعدی
            </h2>

            <p className="text-sm font-vazir text-stone-300 leading-relaxed">
              مهمان شما پس از باز کردن لینک اختصاصی، ابتدا با یک پاکت دست‌ساز دیجیتال مواجه می‌شود. با لمس مهر موم برجسته، انیمیشن باز شدن لبه پاکت اجرا شده و کارت اصلی نمایان می‌گردد.
            </p>

            <div className="space-y-3 pt-2 font-vazir text-xs text-stone-300">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>انیمیشن سه‌بعدی واقعی با CSS Perspective 1000px</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>طراحی کاملاً واکنش‌گرا (Responsive) روی تمامی گوشی‌ها</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>قابلیت پخش موزیک زمینه سینث با آنالیزر صوتی</span>
              </div>
            </div>

            <div className="pt-4 flex gap-4">
              <button
                onClick={() => onNavigate('wedding-amir-sara')}
                className="px-6 py-3 rounded-xl bg-gold-foil text-stone-950 text-xs font-vazir font-bold shadow-lg hover:brightness-105 transition-all"
              >
                تست کامل با کارت عروسی (P0)
              </button>
            </div>
          </div>

          {/* Interactive Envelope Demo Stage */}
          <div className="lg:col-span-7 bg-stone-900/60 rounded-2xl p-6 border border-stone-800 flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs font-vazir text-stone-400">امتحان کنید: روی مهر کلیک کنید</span>
              <AudioPlayer trackType="synth-romantic" trackTitle="والس عشق" />
            </div>

            <ThreeDEnvelope
              isOpen={isOpen}
              onOpen={() => setIsOpen(true)}
              sealText="P & D"
              title="پیش‌نمایش تعاملی ویترین"
            >
              <div className="p-8 rounded-2xl bg-[#F6F1E9] text-stone-900 text-center space-y-4 border border-amber-700/30">
                <span className="text-xs uppercase tracking-widest text-amber-800 font-vazir font-bold">
                  لحظه گشودن پاکت
                </span>
                <h3 className="text-2xl font-bold font-estedad text-stone-900">
                  شما وارد کارت دعوت دیجیتال شدید
                </h3>
                <p className="text-xs font-vazir text-stone-600 max-w-sm mx-auto leading-relaxed">
                  تمامی جزئیات، آلبوم تصاویر، تایمر معکوس و فرم اعلام حضور با گرافیک فاخر در اختیارتان قرار می‌گیرد.
                </p>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-stone-200 text-stone-800 text-xs font-vazir hover:bg-stone-300"
                >
                  بستن مجدد پاکت
                </button>
              </div>
            </ThreeDEnvelope>
          </div>

        </div>

      </div>
    </section>
  );
}
