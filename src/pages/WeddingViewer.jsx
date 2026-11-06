import React, { useState } from 'react';
import { Sparkles, Heart, MapPin, Calendar, Clock, Share2, CheckCircle2, Image as ImageIcon, Send, ArrowRight, Copy, Volume2 } from 'lucide-react';
import { INVITATIONS_DATA } from '../data/invitations';
import ThreeDEnvelope from '../components/3DEnvelope';
import CountdownTimer from '../components/CountdownTimer';
import AudioPlayer from '../components/AudioPlayer';
import RSVPModal from '../components/RSVPModal';
import PhotoLightbox from '../components/PhotoLightbox';
import ThemeToggle from '../components/ThemeToggle';

export default function WeddingViewer({ onNavigate = () => {} }) {
  const data = INVITATIONS_DATA['wedding-amir-sara'];
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
    <div className="min-h-screen bg-[var(--color-canvas)] text-[var(--color-ink)] dark:bg-[#121212] dark:text-stone-100 font-vazir relative selection:bg-amber-200">
      
      {/* Top Floating Action Bar */}
      <div className="sticky top-0 z-40 w-full bg-[var(--color-canvas)]/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-amber-900/15 dark:border-stone-800 px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-xs font-vazir text-stone-700 hover:text-amber-800 transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          بازگشت به صفحه اصلی
        </button>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <AudioPlayer trackType={data.audioTrack.type} trackTitle={data.audioTrack.title} />

          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-200/80 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-vazir transition-all"
            title="کپی لینک اختصاصی کارت"
          >
            <Copy className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400" />
            کپی لینک
          </button>
        </div>
      </div>

      {/* Copied Link Toast */}
      {copiedToast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-stone-900 text-amber-300 px-5 py-2.5 rounded-full text-xs font-vazir shadow-2xl border border-amber-500/40 flex items-center gap-2 animate-in fade-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          لینک کارت با موفقیت در حافظه کپی شد
        </div>
      )}

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        {/* Envelope & Card Open Animation Stage */}
        <ThreeDEnvelope
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          sealText={data.theme.sealText}
          category={data.category}
          accentColor={data.theme.accentColor}
          hasGold={data.theme.hasGold}
          title={data.categoryTitle}
        >
          {/* Opened Invitation Main Card Content */}
          <div className="relative bg-[#F6F1E9] rounded-3xl p-6 md:p-12 shadow-2xl border border-amber-900/20 text-center space-y-8 overflow-hidden">
            
            {/* Top Foil Border Styling */}
            <div className="h-1.5 w-full absolute top-0 left-0 right-0 bg-gold-foil" />

            {/* Corner Botanical SVG Decorative Ornaments */}
            <div className="absolute top-4 right-4 w-16 h-16 opacity-20 text-amber-800 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C60 30, 70 40, 100 50 C70 60, 60 70, 50 100 C40 70, 30 60, 0 50 C30 40, 40 30, 50 0 Z" />
              </svg>
            </div>
            <div className="absolute top-4 left-4 w-16 h-16 opacity-20 text-amber-800 pointer-events-none transform rotate-90">
              <svg viewBox="0 0 100 100" fill="currentColor">
                <path d="M50 0 C60 30, 70 40, 100 50 C70 60, 60 70, 50 100 C40 70, 30 60, 0 50 C30 40, 40 30, 50 0 Z" />
              </svg>
            </div>

            {/* Header / Subtitle */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-amber-800 font-vazir block font-medium">
                {data.subtitle}
              </span>
              <div className="flex items-center justify-center gap-2 text-rose-800/80 my-2">
                <Heart className="w-4 h-4 fill-rose-800/20" />
                <span className="h-0.5 w-16 bg-amber-800/30" />
                <Heart className="w-4 h-4 fill-rose-800/20" />
              </div>
            </div>

            {/* Principal Names - Estedad Scale */}
            <div className="space-y-3 py-4">
              <h1 className="text-4xl md:text-6xl font-extrabold font-estedad tracking-tight text-gold-foil">
                {data.groomName} <span className="text-stone-400 font-light">&</span> {data.brideName}
              </h1>
              <p className="text-xs font-vazir text-stone-500">
                به همراه خانواده‌های {data.parents}
              </p>
            </div>

            {/* Romantic Poem Quote */}
            <div className="max-w-md mx-auto p-4 rounded-2xl bg-amber-900/5 border border-amber-900/15 text-stone-700 italic text-xs font-vazir leading-relaxed">
              « {data.poem} »
            </div>

            {/* Countdown Timer Component */}
            <CountdownTimer targetDate={data.targetDate} accentColor={data.theme.accentColor} hasGold={true} />

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
              
              {/* Date & Time Box */}
              <div className="p-5 rounded-2xl bg-stone-100/80 border border-stone-300/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold font-vazir">
                  <Calendar className="w-4 h-4" />
                  زمان برگزاری مراسم
                </div>
                <div className="text-stone-800 font-vazir text-sm font-semibold">
                  {data.datePersian}
                </div>
              </div>

              {/* Location Box */}
              <div className="p-5 rounded-2xl bg-stone-100/80 border border-stone-300/60 space-y-2">
                <div className="flex items-center gap-2 text-amber-800 text-xs font-bold font-vazir">
                  <MapPin className="w-4 h-4" />
                  مکان برگزاری
                </div>
                <div className="text-stone-800 font-vazir text-sm font-semibold">
                  {data.venue}
                </div>
                <div className="text-stone-600 font-vazir text-xs">
                  {data.address}
                </div>
              </div>

            </div>

            {/* Photo Lightbox Gallery Preview */}
            <div className="space-y-4 pt-4 border-t border-stone-300/70">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-vazir text-stone-800 flex items-center gap-1.5">
                  <ImageIcon className="w-4 h-4 text-amber-700" />
                  آلبوم تصاویر و خاطرات
                </span>
                <span className="text-[11px] font-vazir text-stone-500">
                  برای بزرگ‌نمایی کلیک کنید
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {data.images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => openLightboxAt(idx)}
                    className="relative group h-28 md:h-36 rounded-xl overflow-hidden border border-stone-300/80 shadow-sm hover:shadow-md transition-transform hover:scale-105"
                  >
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white/80 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* RSVP CTA Button */}
            <div className="pt-6">
              <button
                onClick={() => setIsRsvpOpen(true)}
                className="w-full md:w-auto px-10 py-4 rounded-2xl font-vazir font-bold text-sm text-stone-950 bg-gold-foil shadow-xl hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-3 mx-auto"
              >
                <Send className="w-4 h-4 text-stone-900" />
                اعلام حضور و ثبت پیام برای زوج (RSVP)
              </button>
            </div>

          </div>
        </ThreeDEnvelope>

      </main>

      {/* RSVP Modal Component */}
      <RSVPModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        eventSlug={data.slug}
        eventTitle={data.title}
        category={data.category}
        accentColor={data.theme.accentColor}
        hasGold={data.theme.hasGold}
      />

      {/* Photo Lightbox Component */}
      <PhotoLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={data.images}
        initialIndex={lightboxIndex}
      />

    </div>
  );
}
