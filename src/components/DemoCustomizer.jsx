import React, { useState } from 'react';
import { Sliders, Sparkles, Check, RefreshCw, Eye, Music, Palette, Type } from 'lucide-react';
import ThreeDEnvelope from './3DEnvelope';
import AudioPlayer from './AudioPlayer';

export default function DemoCustomizer({ onSelectCard = () => {} }) {
  const [envelopeBg, setEnvelopeBg] = useState('#EFE9DF');
  const [sealText, setSealText] = useState('A & S');
  const [foilColor, setFoilColor] = useState('#B49A70');
  const [audioTrack, setAudioTrack] = useState('synth-romantic');
  const [pattern, setPattern] = useState('dots');
  const [titleText, setTitleText] = useState('دعوت‌نامه اختصاصی دیبا');
  const [namesText, setNamesText] = useState('امیرحسین و سارا');
  const [isCardOpen, setIsCardOpen] = useState(false);

  const envelopeColors = [
    { id: 'ivory', name: 'عاجی گرم', hex: '#EFE9DF' },
    { id: 'charcoal', name: 'زغالی فاخر', hex: '#2A2825' },
    { id: 'rose', name: 'رزشاین ملایم', hex: '#EAE1DF' },
    { id: 'sage', name: 'سبز مقتدر', hex: '#DFE3DD' },
  ];

  const foilOptions = [
    { id: 'champagne', name: 'طلای شامپاینی', hex: '#B49A70' },
    { id: 'rosegold', name: 'رز گلد', hex: '#B76E79' },
    { id: 'silver', name: 'نقره‌ای متالیک', hex: '#9FA5A8' },
    { id: 'sage', name: 'سبز زیتونی', hex: '#687567' },
  ];

  const sealPresets = ['A & S', 'دیبا', 'طلا', '۱۴۰۴', 'ART', 'مهر'];

  const tracks = [
    { id: 'synth-romantic', name: 'والس عاشقانه (عروسی)' },
    { id: 'synth-soothing', name: 'نوای آرام (ترحیم)' },
    { id: 'synth-classical', name: 'پیانو کلاسیک (هنری)' },
    { id: 'synth-modern', name: 'مدرن سینث (افتتاحیه)' },
    { id: 'synth-festive', name: 'جشن و سرور (نوروز)' },
  ];

  return (
    <div id="customizer" className="w-full py-16 px-4 md:px-8 bg-stone-900 text-stone-100 rounded-3xl my-12 border border-amber-900/30 relative overflow-hidden shadow-2xl">
      {/* Background ambient lighting */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-vazir mb-3">
            <Sliders className="w-3.5 h-3.5" />
            استودیو زنده سفارشی‌سازی کارت
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-estedad text-white mb-3">
            کارت‌دعوت خود را لحظه‌ای طراحی و شخصی‌سازی کنید
          </h2>
          <p className="text-sm font-vazir text-stone-300 leading-relaxed">
            رنگ پاکت، نوع مهر موم متالیک، رنگ طلاکوب، تایپوگرافی و موزیک زمینه را تغییر داده و خروجی زنده را مشاهده فرمایید.
          </p>
        </div>

        {/* Main Grid: Controls on Left (in RTL right), Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Controls Column (5 cols) */}
          <div className="lg:col-span-5 bg-stone-950/70 backdrop-blur-xl p-6 md:p-8 rounded-2xl border border-stone-800 space-y-6 text-right">
            
            {/* Control 1: Envelope Color */}
            <div>
              <label className="block text-xs font-vazir text-stone-400 mb-2.5 flex items-center gap-2">
                <Palette className="w-3.5 h-3.5 text-amber-400" />
                رنگ پایه پاکت دیجیتال
              </label>
              <div className="grid grid-cols-4 gap-2">
                {envelopeColors.map((color) => (
                  <button
                    key={color.id}
                    onClick={() => setEnvelopeBg(color.hex)}
                    className={`p-2 rounded-xl border text-xs font-vazir flex flex-col items-center gap-1.5 transition-all ${
                      envelopeBg === color.hex ? 'border-amber-400 bg-amber-950/40 text-amber-200' : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border border-stone-600 shadow-inner" style={{ backgroundColor: color.hex }} />
                    <span className="text-[10px]">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Control 2: Foil Accent Color */}
            <div>
              <label className="block text-xs font-vazir text-stone-400 mb-2.5 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                رنگ افکت متالیک طلاکوب
              </label>
              <div className="grid grid-cols-4 gap-2">
                {foilOptions.map((foil) => (
                  <button
                    key={foil.id}
                    onClick={() => setFoilColor(foil.hex)}
                    className={`p-2 rounded-xl border text-xs font-vazir flex flex-col items-center gap-1.5 transition-all ${
                      foilColor === foil.hex ? 'border-amber-400 bg-amber-950/40 text-amber-200' : 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    <span className="w-5 h-5 rounded-full border border-stone-600 shadow-inner" style={{ backgroundColor: foil.hex }} />
                    <span className="text-[10px]">{foil.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Control 3: Seal Stamp Text */}
            <div>
              <label className="block text-xs font-vazir text-stone-400 mb-2.5 flex items-center gap-2">
                <Type className="w-3.5 h-3.5 text-amber-400" />
                متن روی مهر موم برجسته
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {sealPresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setSealText(preset)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-vazir transition-all ${
                      sealText === preset ? 'bg-amber-600 text-stone-950 font-bold' : 'bg-stone-900 text-stone-300 border border-stone-800 hover:border-stone-700'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
              <input
                type="text"
                value={sealText}
                onChange={(e) => setSealText(e.target.value)}
                maxLength={8}
                placeholder="متن دلخواه مهر..."
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 font-vazir focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Control 4: Music Track */}
            <div>
              <label className="block text-xs font-vazir text-stone-400 mb-2.5 flex items-center gap-2">
                <Music className="w-3.5 h-3.5 text-amber-400" />
                موسیقی متن سینث دیجیتال
              </label>
              <select
                value={audioTrack}
                onChange={(e) => setAudioTrack(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-xs text-stone-200 font-vazir focus:outline-none focus:border-amber-500"
              >
                {tracks.map((tr) => (
                  <option key={tr.id} value={tr.id}>{tr.name}</option>
                ))}
              </select>
            </div>

            {/* Reset / Preview CTAs */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setEnvelopeBg('#EFE9DF');
                  setFoilColor('#B49A70');
                  setSealText('A & S');
                  setAudioTrack('synth-romantic');
                  setIsCardOpen(false);
                }}
                className="p-2.5 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700 transition-colors"
                title="بازنشانی به حالت پیش‌فرض"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsCardOpen(!isCardOpen)}
                className="flex-1 py-3 rounded-xl bg-gold-foil text-stone-950 font-vazir font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:brightness-105 active:scale-95 transition-all"
              >
                <Eye className="w-4 h-4" />
                {isCardOpen ? 'بستن پاکت' : 'پیش‌نمایش سه‌بعدی گشودن کارت'}
              </button>
            </div>

          </div>

          {/* Live Interactive Preview Area (7 cols) */}
          <div className="lg:col-span-7 bg-stone-950/40 rounded-2xl p-6 border border-stone-800 flex flex-col items-center justify-center min-h-[460px] relative">
            <div className="w-full flex items-center justify-between mb-4">
              <span className="text-xs text-stone-400 font-vazir">پیش‌نمایش زنده سفارش</span>
              <AudioPlayer trackType={audioTrack} trackTitle="پیش‌نمایش موزیک" accentColor={foilColor} />
            </div>

            <ThreeDEnvelope
              isOpen={isCardOpen}
              onOpen={() => setIsCardOpen(true)}
              sealText={sealText}
              accentColor={foilColor}
              hasGold={true}
              title={titleText}
            >
              {/* Inside Card View when open */}
              <div 
                className="p-8 rounded-2xl shadow-2xl text-center space-y-4 border border-amber-900/30 text-stone-900 transition-all"
                style={{ background: '#F6F1E9' }}
              >
                <span className="text-xs uppercase tracking-widest text-stone-500 font-vazir block">
                  دعوت‌نامه سفارشی‌سازی شده
                </span>
                <h3 
                  className="text-3xl font-bold font-estedad"
                  style={{ color: foilColor }}
                >
                  {namesText}
                </h3>
                <p className="text-sm font-vazir text-stone-600 max-w-md mx-auto leading-relaxed">
                  این پیش‌نمایش زنده تنظیمات شماست. تمامی تغییرات رنگ، مهر موم و موسیقی فوراً بر روی دمو اعمال گشتند.
                </p>
                <div className="pt-4 border-t border-stone-300/60 flex justify-center gap-4 text-xs font-vazir text-stone-500">
                  <span>مهر: {sealText}</span>
                  <span>|</span>
                  <span>رنگ متالیک: {foilColor}</span>
                </div>
              </div>
            </ThreeDEnvelope>

          </div>

        </div>

      </div>
    </div>
  );
}
