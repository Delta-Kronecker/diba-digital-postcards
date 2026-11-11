import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';
import Picture from './Picture';

export default function PhotoLightbox({
  isOpen = false,
  onClose = () => {},
  images = [],
  initialIndex = 0,
}) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  useScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement;
      setCurrentIndex(initialIndex);
      const timer = window.setTimeout(() => closeRef.current?.focus(), 60);
      return () => window.clearTimeout(timer);
    }
    triggerRef.current?.focus?.();
    return undefined;
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setCurrentIndex((p) => (p - 1 + images.length) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setCurrentIndex((p) => (p + 1) % images.length);
      }
      if (e.key === 'Home') {
        e.preventDefault();
        setCurrentIndex(0);
      }
      if (e.key === 'End') {
        e.preventDefault();
        setCurrentIndex(images.length - 1);
      }
      if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])');
        if (!nodes?.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, images.length, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex] || images[0];
  const next = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };
  const prev = (e) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label="گالری تصاویر"
      className="fixed inset-0 z-overlay flex flex-col bg-scrim-deep/96 backdrop-blur-lg safe-y"
    >
      <div className="flex items-center justify-between gap-4 border-b border-cream/12 px-5 py-4 text-cream md:px-8">
        <div aria-live="polite">
          <p lang="en" className="latin text-xs text-cream/60">Gallery</p>
          <p className="mt-1 font-display text-sm text-cream">{currentImage.title || 'تصویر'}</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs tabular-nums text-cream/65" dir="ltr">
            {currentIndex + 1} / {images.length}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="بستن گالری"
            className="flex min-h-11 min-w-11 items-center justify-center border border-cream/20 text-cream transition-colors hover:border-cream/50"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center p-4 md:p-10" onClick={onClose} role="presentation">
        <figure
          className="relative flex h-full max-h-full w-full max-w-5xl items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Picture
            src={currentImage.url}
            alt={currentImage.title || 'تصویر گالری'}
            className="max-h-[68dvh] w-auto max-w-full select-none object-contain shadow-photo"
            loading="eager"
            decoding="async"
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                aria-label="تصویر قبلی"
                className="absolute start-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-cream/25 bg-scrim-deep/50 text-cream backdrop-blur-md transition-colors hover:border-gold hover:text-gold md:start-4"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={next}
                aria-label="تصویر بعدی"
                className="absolute end-2 top-1/2 flex size-11 -translate-y-1/2 items-center justify-center border border-cream/25 bg-scrim-deep/50 text-cream backdrop-blur-md transition-colors hover:border-gold hover:text-gold md:end-4"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>
            </>
          )}
        </figure>
      </div>

      {images.length > 1 && (
        <div className="flex items-center justify-center gap-2 border-t border-cream/12 px-4 py-4" role="tablist" aria-label="تصاویر کوچک">
          {images.map((image, index) => (
            <button
              key={image.id || index}
              type="button"
              onClick={() => setCurrentIndex(index)}
              role="tab"
              aria-selected={currentIndex === index}
              aria-label={image.title || `تصویر ${index + 1}`}
              className={`relative h-12 w-16 overflow-hidden border-2 transition-colors sm:h-14 sm:w-20 ${
                currentIndex === index
                  ? 'border-gold opacity-100'
                  : 'border-transparent opacity-40 hover:opacity-80'
              }`}
            >
              <Picture src={image.url} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
