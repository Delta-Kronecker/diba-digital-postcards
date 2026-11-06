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

      {/* Hero Section - Moment of Open Redesign */}
      <section className="relative py-24 md:py-36 px-6 md:px-8 max-w-5xl mx-auto text-center overflow-hidden">
        
        {/* Background Ambient Accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Tag */}
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-900/10 text-amber-900 font-medium text-xs mb-8 tracking-wide">
          <Sparkles className="w-4 h-4 text-amber-700" />
          نسل جدید دعوت‌نامه‌ها و کارت‌پستال‌های دیجیتال دیبا
        </div>

        {/* Editorial Grand Heading (Estedad Light/Regular for refined typography) */}
        <h1 className="text-4xl md:text-6xl font-normal font-estedad tracking-tight text-stone-900 mb-6 leading-[1.2] max-w-4xl mx-auto">
          هنرِ فاخرِ دعوت در عصر دیجیتال؛
          <span className="block mt-3 font-semibold text-amber-800">
            با حسِ اصیلِ گشودنِ پاکت‌ نامه‌ها
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-stone-600 text-base md:text-lg font-vazir max-w-2xl mx-auto mb-12 leading-relaxed">
          تجربه‌ای متمایز با انیمیشن‌های سه‌بعدی باز شدن پاکت، مهر موم متالیک، موسیقی اختصاصی و ثبت هوشمند حضور و پیام.
        </p>

        {/* Single Primary Action CTA (Moment of Open) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('wedding-amir-sara')}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-amber-900 text-amber-50 font-semibold font-vazir text-sm shadow-xl hover:bg-amber-800 active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <Heart className="w-4 h-4 text-amber-300" />
            گشودن دعوت‌نامه نمونه
            <ArrowLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('gallery')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-stone-200/80 text-stone-800 font-medium font-vazir text-sm border border-stone-300 hover:bg-stone-300/80 transition-all flex items-center justify-center gap-2"
          >
            مشاهده گالری نمایشگاه
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
