import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, MessageSquare, Send, User, X } from 'lucide-react';
import { INVITATIONS_DATA } from '../data/invitations';
import ThreeDEnvelope from '../components/3DEnvelope';
import AudioPlayer from '../components/AudioPlayer';
import RSVPModal from '../components/RSVPModal';
import PhotoLightbox from '../components/PhotoLightbox';
import ViewerBar from '../components/ViewerBar';
import InvitationCard from '../components/InvitationCard';
import { useScrollLock } from '../hooks/useScrollLock';

export default function MemorialViewer({ onNavigate = () => {} }) {
  const data = INVITATIONS_DATA['memorial-haj-reza'];
  const [isOpen, setIsOpen] = useState(false);
  const [isRsvpOpen, setIsRsvpOpen] = useState(false);
  const [isCondolenceOpen, setIsCondolenceOpen] = useState(false);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  useScrollLock(isCondolenceOpen);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2600);
    } catch {
      // Clipboard access can be denied; do not show a false success message.
    }
  };

  const openLightboxAt = (index) => {
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  useEffect(() => {
    if (!isCondolenceOpen) return undefined;
    triggerRef.current = document.activeElement;
    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector('input, textarea, button')?.focus();
    }, 60);
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsCondolenceOpen(false);
      }
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll('button, input, textarea, [href]');
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
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', onKey);
      triggerRef.current?.focus?.();
    };
  }, [isCondolenceOpen]);

  return (
    <div data-theme="memorial" className="min-h-dvh bg-canvas font-body text-ink">
      <ViewerBar onNavigate={onNavigate} onCopy={handleCopyLink} copied={copied} />

      {copied && (
        <div className="fixed left-1/2 top-20 z-toast flex -translate-x-1/2 items-center gap-2 border border-line bg-ink px-5 py-2.5 text-xs text-canvas shadow-lift">
          <CheckCircle2 className="size-3.5" aria-hidden="true" />
          لینک یادبود در حافظه کپی شد
        </div>
      )}

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-14">
        {/* Same naming gap as the wedding stage; the hairlines resolve through the
            memorial scope, so the mark stays green — zero gold, by construction. */}
        <div className="mb-6 text-center">
          {!isOpen && <h1 className="sr-only">مراسم یادبود زنده‌یاد حاج رضا تهرانی</h1>}
          <p className="flex items-center justify-center gap-3 text-xs text-ink-subtle">
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
            <span>{data.categoryTitle}</span>
            <span aria-hidden="true" className="h-px w-8 bg-gold/50" />
          </p>
        </div>

        <ThreeDEnvelope
          isOpen={isOpen}
          onOpen={() => setIsOpen(true)}
          openLabel="گشودن پاکت یادبود"
          sealText="یاد"
          accent="var(--color-sage)"
          metal={false}
          motion="gentle"
        >
          <InvitationCard
            data={data}
            variant="memorial"
            audio={<AudioPlayer trackType={data.audioTrack.type} trackTitle={data.audioTrack.title} accentColor="var(--color-gold)" />}
            onRsvp={() => setIsRsvpOpen(true)}
            onCondolence={() => setIsCondolenceOpen(true)}
            onLightbox={openLightboxAt}
            onCopy={handleCopyLink}
            copied={copied}
          />
        </ThreeDEnvelope>
      </div>

      <RSVPModal
        isOpen={isRsvpOpen}
        onClose={() => setIsRsvpOpen(false)}
        eventSlug={data.slug}
        eventTitle={data.title}
        category={data.category}
        accentColor="var(--color-gold)"
        hasGold={false}
      />

      {isCondolenceOpen && (
        <div className="fixed inset-0 z-modal flex justify-center overflow-y-auto overscroll-contain bg-scrim/70 safe-overlay backdrop-blur-sm">
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="condolence-title"
            className="relative my-auto w-full max-w-lg border border-line bg-surface p-6 sm:p-8"
          >
            <span aria-hidden="true" className="absolute inset-x-0 top-0 h-[2px] bg-sage" />
            <button
              type="button"
              onClick={() => setIsCondolenceOpen(false)}
              aria-label="بستن پنجره"
              className="absolute end-4 top-4 flex size-9 items-center justify-center border border-line text-ink-muted hover:border-line-strong hover:text-ink"
            >
              <X className="size-4" aria-hidden="true" />
            </button>

            <div className="text-center">
              <p lang="en" className="latin text-xs text-sage">Condolences</p>
              <h2 id="condolence-title" className="mt-3 font-display text-xl text-ink">
                دفتر یادبود
              </h2>
              <p className="mt-2 text-xs leading-[1.9] text-ink-subtle">
                پیام شما با احترام به خانوادهٔ داغدار ابلاغ می‌شود.
              </p>
            </div>

            {sent ? (
              <div className="mt-7 text-center" aria-live="polite">
                <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-sage/10 text-sage">
                  <CheckCircle2 className="size-6" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-lg text-ink">پیام شما ثبت شد</h3>
                <p className="mx-auto mt-2 max-w-sm text-xs leading-[2] text-ink-muted">
                  با تشکر از {name} گرامی؛ پیام تسلیت شما در دفتر یادبود ثبت گردید.
                </p>
                <button
                  type="button"
                  onClick={() => setIsCondolenceOpen(false)}
                  className="btn mt-6 !py-3 !text-xs text-cream"
                  style={{ backgroundColor: 'var(--color-gold)', borderColor: 'var(--color-gold)' }}
                >
                  بستن
                </button>
              </div>
            ) : (
              <form
                className="mt-6 flex flex-col gap-5 text-start"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!name.trim() || !message.trim()) return;
                  setSent(true);
                }}
              >
                <div>
                  <label htmlFor="condolence-name" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                    <User className="size-3.5 text-sage" aria-hidden="true" />
                    نام و نام خانوادگی
                  </label>
                  <input
                    id="condolence-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="مثال: رضا مهدوی"
                    className="h-11 w-full border border-line bg-canvas/40 px-4 text-base text-ink placeholder:text-ink-subtle focus:border-sage focus:outline-none sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="condolence-text" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                    <MessageSquare className="size-3.5 text-sage" aria-hidden="true" />
                    متن تسلیت
                  </label>
                  <textarea
                    id="condolence-text"
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="مصیبت وارده را به خانوادهٔ محترم تسلیت عرض می‌نماییم…"
                    className="w-full border border-line bg-canvas/40 px-4 py-3 text-base leading-relaxed text-ink placeholder:text-ink-subtle focus:border-sage focus:outline-none sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="btn w-full text-cream"
                  style={{ backgroundColor: 'var(--color-gold)', borderColor: 'var(--color-gold)' }}
                >
                  <Send className="size-4" aria-hidden="true" />
                  ارسال پیام تسلیت
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <PhotoLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        images={data.images}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
