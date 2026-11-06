import React, { useState } from 'react';
import { Moon, MapPin, Calendar, Clock, Share2, CheckCircle2, Image as ImageIcon, Send, ArrowRight, Copy } from 'lucide-react';
import { INVITATIONS_DATA } from '../data/invitations';
import ThreeDEnvelope from '../components/3DEnvelope';
import CountdownTimer from '../components/CountdownTimer';
import AudioPlayer from '../components/AudioPlayer';
import RSVPModal from '../components/RSVPModal';
import PhotoLightbox from '../components/PhotoLightbox';
import ThemeToggle from '../components/ThemeToggle';

export default function MemorialViewer({ onNavigate = () => {} }) {
  const data = INVITATIONS_DATA['memorial-haj-reza'];
  const [isOpen, setIsOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copiedToast, setCopiedToast] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 3000);
  };

  const openLightboxAt = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] dark:bg-[#121212] dark:text-stone-100 font-vazir relative selection:bg-emerald-100">
      
      {/* Top Floating Action Bar */}
      <div className="sticky top-0 z-40 w-full bg-[var(--color-canvas)]/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-stone-300 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-xs font-vazir text-stone-700 hover:text-stone-900 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به صفحه اصلی
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AudioPlayer trackType={data.audioTrack.type} trackTitle={data.audioTrack.title} accentColor="#687567" />

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-vazir transition-all"
            title="کپی لینک اختصاصی کارت"
          >
            <Copy className="w-3.5 h-3.5 text-stone-700 dark:text-stone-300" />
            کپی لینک
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-stone-100 px-5 py-2.5 rounded-full text-xs font-vazir shadow-2xl border border-stone-700 flex items-center gap-2 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          لینک کارت ترحیم در حافظه کپی شد
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        {/* Envelope / Fade Cover Reveal */}
        <ThreeDEnvelope
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          sealText={data.theme.sealText}
          category={data.category}
          accentColor={data.theme.accentColor}
          hasGold={false} // ZERO GOLD MANDATE
          title={data.categoryTitle}
        >
          {/* Opened Content Card */}
          <div className="relative bg-[#F6F1E9] rounded-3xl p-6 md:p-12 shadow-xl border border-stone-300/80 text-center space-y-8 overflow-hidden">
            
            {/* Top Sage Accent Line (Zero Gold) */}
            <div className="h-1.5 w-full absolute top-0 left-0 right-0 bg-[#687567]" />

            {/* Subtitle / Religious Opening */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-[#687567] font-vazir block font-bold">
                {data.subtitle}
              </span>
              <div className="flex items-center justify-center gap-2 text-stone-500 my-2">
                <Moon className="w-4 h-4 text-[#687567]" />
                <span className="h-0.5 w-16 bg-stone-300" />
                <Moon className="w-4 h-4 text-[#687567]" />
              </div>
            </div>

            {/* Deceased Name - Dignified Sober Estedad Scale */}
            <div className="space-y-3 py-4">
              <h1 className="text-3xl md:text-5xl font-bold font-estedad tracking-tight text-stone-900">
                {data.deceasedName}
              </h1>
              <p className="text-xs font-vazir text-stone-600">
                با نهایت تأسف و تأثر از طرف {data.family}
              </p>
            </div>

            {/* Condolence Poem */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-stone-200/50 border border-stone-300 text-stone-700 italic text-xs font-vazir leading-relaxed">
              « {data.poem} »
            </div>

            {/* Live Countdown Timer (Sage Green accent, zero gold) */}
            <CountdownTimer targetDate={data.targetDate} accentColor="#687567" hasGold={false} />

            {/* Event Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              
              <div className="p-5 rounded-2xl bg-stone-100/90 border border-stone-300/70 space-y-2">
                <div className="flex items-center gap-2 text-[#687567] text-xs font-bold font-vazir">
                  <Calendar className="w-4 h-4" />
                  زمان برگزاری مراسم یادبود
                </div>
                <div className="text-stone-900 font-vazir text-sm font-semibold">
                  {data.datePersian}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-stone-100/90 border border-stone-300/70 space-y-2">
                <div className="flex items-center gap-2 text-[#687567] text-xs font-bold font-vazir">
                  <MapPin className="w-4 h-4" />
                  محل انعقاد مجلس
                </div>
                <div className="text-stone-900 font-vazir text-sm font-semibold">
                  {data.venue}
                </div>
                <div className="text-stone-600 font-vazir text-xs">
                  {data.address}
                </div>
              </div>

            </div>

            {/* Memory Gallery Lightbox */}
            <div className="space-y-4 pt-4 border-t border-stone-300">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-vazir text-stone-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-[#687567]" />
                  تصاویر و آلبوم یادبود
                </span>
                <span className="text-[11px] font-vazir text-stone-500">
                  جهت مشاهده بزرگ‌تر کلیک کنید
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {data.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => openLightboxAt(idx)}
                    className="relative group h-36 rounded-xl overflow-hidden border border-stone-300 shadow-sm transition-transform hover:scale-105"
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover grayscale opacity-90 group-hover:grayscale-0 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* RSVP Modal Button */}
            <div className="pt-6">
              <button
                onClick={() => setIsRsvpOpen(true)}
                className="w-full md:w-auto px-10 py-4 rounded-2xl font-vazir font-bold text-sm text-white bg-[#687567] hover:bg-[#576356] shadow-lg active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
              >
                <Send className="w-4 h-4" />
                تأیید حضور و ارسال پیام تسلیت به خانواده
              </button>
            </div>

          </div>
        </ThreeDEnvelope>

      </main>

      {/* RSVP Modal */}
      <RSVPModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        eventSlug={data.slug}
        eventTitle={data.title}
        category={data.category}
        accentColor="#687567"
        hasGold={false}
      />

      {/* Photo Lightbox */}
      <PhotoLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={data.images}
        initialIndex={lightboxIndex}
      />

    </div>
  );
}
