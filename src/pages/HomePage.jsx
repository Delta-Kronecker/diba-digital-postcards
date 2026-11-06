import React from 'react';
import { Sparkles, ArrowLeft, Heart, Moon, ShieldCheck, Zap, Layers, Sliders } from 'lucide-react';
import Navbar from '../components/Navbar';
import CategorySpread from '../components/CategorySpread';
import InteractiveShowcase from '../components/InteractiveShowcase';
import ExhibitionGallery from '../components/ExhibitionGallery';
import DemoCustomizer from '../components/DemoCustomizer';
import Footer from '../components/Footer';

export default function HomePage({ currentRoute = 'home', onNavigate = () => {} }) {
  return (
    <div className="min-h-screen bg-[#F6F1E9] text-[#25231F] font-vazir flex flex-col selection:bg-amber-200">
      
      {/* Navbar */}
      <Navbar currentRoute={currentRoute} onNavigate={onNavigate} />

      {/* Hero Section */}
      <section className="relative py-20 md:py-28 px-6 md:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        
        {/* Background Ambient SVG Geometric Accents */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-gold-foil text-stone-950 font-semibold text-xs mb-6 shadow-sm animate-in fade-in slide-in-from-bottom-3 duration-500">
          <Sparkles className="w-4 h-4 text-stone-900" />
          نسل جدید دعوت‌نامه‌ها و کارت‌پستال‌های دیجیتال
        </div>

        {/* Editorial Grand Heading (Estedad) */}
        <h1 className="text-4xl md:text-7xl font-extrabold font-estedad tracking-tight text-stone-900 mb-6 leading-[1.15] max-w-5xl mx-auto">
          هنرِ فاخرِ دعوت در عصر دیجیتال؛
          <span className="block mt-2 text-gold-foil">
            با حسِ گشودنِ پاکت‌های کلاسیک
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-stone-600 text-base md:text-xl font-vazir max-w-3xl mx-auto mb-10 leading-relaxed">
          دیبا جایگزین مجلل دعوت‌نامه‌های کاغذی است؛ با انیمیشن‌های سه‌بعدی باز شدن پاکت، مهر موم متالیک، پخش آنلاین موسیقی و ثبت هوشمند پاسخ مدعوین.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('wedding-amir-sara')}
            className="px-8 py-4 rounded-2xl bg-gold-foil text-stone-950 font-bold font-vazir text-sm shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center gap-3"
          >
            <Heart className="w-4 h-4 text-rose-950" />
            مشاهده نمونه اصلی عروسی (P0)
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('memorial-haj-reza')}
            className="px-8 py-4 rounded-2xl bg-[#687567] text-white font-bold font-vazir text-sm shadow-xl hover:bg-[#576356] active:scale-95 transition-all flex items-center gap-3"
          >
            <Moon className="w-4 h-4 text-stone-200" />
            مشاهده نمونه ترحیم (Zero Gold)
          </button>

          <button
            onClick={() => onNavigate('customizer')}
            className="px-6 py-4 rounded-2xl bg-stone-200/80 text-stone-800 font-semibold font-vazir text-sm border border-stone-300 hover:bg-stone-300/80 transition-all flex items-center gap-2"
          >
            <Sliders className="w-4 h-4 text-amber-800" />
            استودیو شخصی‌سازی
          </button>
        </div>



      </section>

      {/* Section 1: 6 Category Spreads */}
      <CategorySpread onNavigate={onNavigate} />

      {/* Section 2: Interactive Showcase */}
      <InteractiveShowcase onNavigate={onNavigate} />

      {/* Section 3: Exhibition Gallery with Filter Chips */}
      <ExhibitionGallery onNavigate={onNavigate} />

      {/* Section 4: Live Demo Customizer */}
      <DemoCustomizer onNavigate={onNavigate} />

      {/* Footer */}
      <Footer onNavigate={onNavigate} />

    </div>
  );
}
