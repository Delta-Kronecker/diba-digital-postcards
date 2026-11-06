import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Image as ImageIcon } from 'lucide-react';

export default function PhotoLightbox({
  isOpen = false,
  onClose = () => {},
  images = [],
  initialIndex = 0
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 md:p-8 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300"
    >
      {/* Header bar */}
      <div className="w-full max-w-6xl flex items-center justify-between z-10 text-white">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-amber-400" />
          <span className="text-sm font-vazir text-stone-300">
            گالری تصاویر ({currentIndex + 1} از {images.length})
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 transition-colors"
          aria-label="بستن گالری"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div 
        onClick={(e) => e.stopPropagation()}
        className="relative my-auto w-full max-w-5xl h-[65vh] flex items-center justify-center overflow-hidden rounded-2xl border border-stone-800 shadow-2xl"
      >
        <img
          src={currentImage.url}
          alt={currentImage.title || 'تصویر گالری'}
          className="max-w-full max-h-full object-contain transition-all duration-500 rounded-lg select-none"
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute right-4 p-3 rounded-full bg-stone-950/60 hover:bg-amber-600 text-white backdrop-blur border border-stone-700/50 transition-all active:scale-95"
              title="تصویر قبلی"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <button
              onClick={handleNext}
              className="absolute left-4 p-3 rounded-full bg-stone-950/60 hover:bg-amber-600 text-white backdrop-blur border border-stone-700/50 transition-all active:scale-95"
              title="تصویر بعدی"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </>
        )}

        {/* Image Title Badge */}
        {currentImage.title && (
          <div className="absolute bottom-4 inset-x-0 mx-auto w-max px-6 py-2 rounded-full bg-stone-950/80 backdrop-blur text-stone-200 text-xs font-vazir border border-stone-700/40">
            {currentImage.title}
          </div>
        )}
      </div>

      {/* Thumbnails strip */}
      {images.length > 1 && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="flex items-center gap-3 p-2 bg-stone-900/80 backdrop-blur rounded-2xl border border-stone-800 max-w-xl overflow-x-auto"
        >
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                currentIndex === idx ? 'border-amber-400 scale-105 shadow-md' : 'border-transparent opacity-50 hover:opacity-100'
              }`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
