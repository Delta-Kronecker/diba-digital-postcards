import React, { useState, useEffect, useRef } from 'react';
import { X, Check, AlertCircle, Loader2, User, Users, MessageSquare, Send, Calendar } from 'lucide-react';
import { useScrollLock } from '../hooks/useScrollLock';

export default function RSVPModal({
  isOpen = false,
  onClose = () => {},
  eventSlug = 'wedding-amir-sara',
  eventTitle = 'جشن پیوند امیر و سارا',
  category = 'wedding',
  accentColor = 'var(--color-gold)',
  hasGold = true,
}) {
  const [fullName, setFullName] = useState('');
  const [attending, setAttending] = useState('yes');
  const [guestCount, setGuestCount] = useState(1);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const dialogRef = useRef(null);
  const triggerRef = useRef(null);
  const nameRef = useRef(null);

  const isMemorial = category === 'memorial';

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return undefined;
    triggerRef.current = document.activeElement;

    let saved = null;
    try {
      saved = window.localStorage.getItem(`ponisha_rsvp_${eventSlug}`);
    } catch {
      saved = null;
    }
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setFullName(parsed.fullName || '');
        setAttending(parsed.attending || 'yes');
        setGuestCount(parsed.guestCount || 1);
        setNotes(parsed.notes || '');
        setSubmitted(true);
      } catch {
        setSubmitted(false);
      }
    } else {
      setSubmitted(false);
    }
    setSubmitting(false);

    const timer = window.setTimeout(() => {
      dialogRef.current?.querySelector('input, select, textarea, button')?.focus();
    }, 60);

    return () => window.clearTimeout(timer);
  }, [isOpen, eventSlug]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const nodes = dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
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
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen) triggerRef.current?.focus?.();
  }, [isOpen]);

  if (!isOpen) return null;

  const submit = (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('لطفاً نام و نام خانوادگی خود را وارد کنید.');
      window.requestAnimationFrame(() => {
        nameRef.current?.focus();
      });
      return;
    }
    if (submitting) return;
    setSubmitting(true);
    // The write is synchronous, so the busy state is yielded one frame to paint
    // rather than faked with a delay. It is real: the button is disabled and
    // aria-busy is announced while the commit happens.
    window.setTimeout(() => {
      try {
        localStorage.setItem(
          `ponisha_rsvp_${eventSlug}`,
          JSON.stringify({
            fullName: fullName.trim(),
            attending,
            guestCount,
            notes: notes.trim(),
            submittedAt: new Date().toISOString(),
          })
        );
      } catch (err) {
        console.warn('LocalStorage save failed:', err);
      }
      setError('');
      setSubmitting(false);
      setSubmitted(true);
    }, 0);
  };

  const accent = isMemorial ? 'var(--color-gold)' : accentColor;

  const accentInk = (() => {
    const match = /^#?([0-9a-f]{6})$/i.exec(String(accent).trim());
    if (!match) return '#fffdf7';
    const int = parseInt(match[1], 16);
    const channel = (value) => {
      const c = value / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    };
    const luminance =
      0.2126 * channel((int >> 16) & 255) +
      0.7152 * channel((int >> 8) & 255) +
      0.0722 * channel(int & 255);
    return luminance > 0.18 ? '#191612' : '#fffdf7';
  })();

  const selectable = (active) =>
    active
      ? isMemorial
        ? 'border-sage bg-sage-solid text-cream'
        : 'border-ink bg-ink text-canvas'
      : 'border-line bg-canvas/40 text-ink-muted hover:border-line-strong';

  return (
    <div
      className="fixed inset-0 z-modal flex items-center justify-center overflow-y-auto overscroll-contain bg-scrim/70 safe-overlay backdrop-blur-sm"
      role="presentation"
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="rsvp-title"
        data-theme={isMemorial ? 'memorial' : undefined}
        className="relative my-8 w-full max-w-lg border border-line bg-surface p-6 sm:p-9"
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[2px]"
          style={{ background: isMemorial ? 'var(--color-sage)' : 'var(--color-gold)' }}
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="بستن پنجره"
          className="absolute end-4 top-4 flex min-h-11 min-w-11 items-center justify-center border border-line text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
        >
          <X className="size-4" aria-hidden="true" />
        </button>

        <div className="text-center">
          <p lang="en" className={`latin text-xs ${isMemorial ? 'text-sage' : 'text-gold-deep'}`}>
            {isMemorial ? 'Attendance' : 'R S V P'}
          </p>
          <h2 id="rsvp-title" className="mt-3 font-display text-xl font-medium leading-snug text-ink sm:text-2xl">
            {eventTitle}
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-[1.9] text-ink-subtle">
            در نسخهٔ نمایشی، پاسخ شما فقط روی همین دستگاه ذخیره می‌شود.
          </p>
        </div>

        {submitted ? (
          <div className="mt-8 text-center" aria-live="polite">
            <span className={`mx-auto flex size-14 items-center justify-center rounded-full ${isMemorial ? 'bg-sage/10 text-sage' : 'bg-gold/10 text-gold-deep'}`}>
              <Check className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-4 font-display text-lg text-ink">پاسخ شما ذخیره شد</h3>
            <p className="mx-auto mt-2 max-w-sm text-xs leading-[2] text-ink-muted">
              با تشکر از {fullName} عزیز؛ پاسخ فقط روی همین دستگاه ذخیره می‌شود و برای میزبان ارسال نمی‌شود.
            </p>

            <dl className="mt-6 flex flex-col gap-2 border-y border-line py-4 text-start text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-ink-subtle">وضعیت حضور</dt>
                <dd className="text-ink">
                  {attending === 'yes' ? 'با کمال میل شرکت می‌کنم' : 'امکان حضور ندارم'}
                </dd>
              </div>
              {attending === 'yes' && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-subtle">تعداد نفرات</dt>
                  <dd className="text-ink">{guestCount} نفر</dd>
                </div>
              )}
              {notes && (
                <div className="flex justify-between gap-4">
                  <dt className="text-ink-subtle">پیام</dt>
                  <dd className="max-w-[65%] text-start text-ink">{notes}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex items-center justify-center gap-3">
              <button type="button" onClick={() => setSubmitted(false)} className="btn btn-outline !py-3 !text-xs">
                ویرایش پاسخ
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn !py-3 !text-xs"
                style={{ backgroundColor: accent, borderColor: accent, color: accentInk }}
              >
                تأیید و بستن
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 flex flex-col gap-5 text-start" noValidate>
            <div>
              <label htmlFor="rsvp-name" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <User className="size-3.5 text-gold" aria-hidden="true" />
                نام و نام خانوادگی
              </label>
              <input
                id="rsvp-name"
                type="text"
                ref={nameRef}
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (error && e.target.value.trim()) setError('');
                }}
                onBlur={() => {
                  if (error && fullName.trim()) setError('');
                }}
                placeholder="مثال: علی رضایی"
                autoComplete="name"
                aria-invalid={!!error}
                aria-describedby={error ? 'rsvp-name-error' : undefined}
                className="h-11 w-full border border-line bg-canvas/40 px-4 text-base text-ink placeholder:text-ink-subtle focus:border-gold focus:outline-none sm:text-sm"
              />
              {error && (
                <p
                  id="rsvp-name-error"
                  role="alert"
                  className="mt-2 flex items-center gap-2 border border-danger/40 bg-danger/5 px-3 py-2 text-xs text-danger"
                >
                  <AlertCircle className="size-3.5 shrink-0" aria-hidden="true" />
                  {error}
                </p>
              )}
            </div>

            <fieldset>
              <legend className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <Calendar className="size-3.5 text-gold" aria-hidden="true" />
                آیا در مراسم شرکت می‌کنید؟
              </legend>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button type="button" onClick={() => setAttending('yes')} aria-pressed={attending === 'yes'} className={`border px-4 py-3 text-xs transition-colors ${selectable(attending === 'yes')}`}>
                  با کمال میل شرکت می‌کنم
                </button>
                <button type="button" onClick={() => setAttending('no')} aria-pressed={attending === 'no'} className={`border px-4 py-3 text-xs transition-colors ${selectable(attending === 'no')}`}>
                  متأسفانه حضور ندارم
                </button>
              </div>
            </fieldset>

            {attending === 'yes' && (
              <div>
                <label htmlFor="rsvp-guests" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                  <Users className="size-3.5 text-gold" aria-hidden="true" />
                  تعداد نفرات همراه
                </label>
                <select
                  id="rsvp-guests"
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="h-11 w-full border border-line bg-canvas/40 px-4 text-base text-ink focus:border-gold focus:outline-none sm:text-sm"
                >
                  <option value={1}>۱ نفر، فقط خودم</option>
                  <option value={2}>۲ نفر</option>
                  <option value={3}>۳ نفر</option>
                  <option value={4}>۴ نفر</option>
                  <option value={5}>۵ نفر یا بیشتر</option>
                </select>
              </div>
            )}

            <div>
              <label htmlFor="rsvp-notes" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <MessageSquare className="size-3.5 text-gold" aria-hidden="true" />
                {isMemorial ? 'پیام تسلیت برای خانواده' : 'پیام تبریک یا یادداشت'}
              </label>
              <textarea
                id="rsvp-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder={isMemorial ? 'تسلیت صمیمانهٔ خود را بنویسید…' : 'تبریک یا هر پیام دلخواه…'}
                className="w-full border border-line bg-canvas/40 px-4 py-3 text-base leading-relaxed text-ink placeholder:text-ink-subtle focus:border-gold focus:outline-none sm:text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting || undefined}
              className="btn w-full"
              style={{ backgroundColor: accent, borderColor: accent, color: accentInk }}
            >
              {submitting ? (
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
              ) : (
                <Send className="size-4" aria-hidden="true" />
              )}
              {submitting ? 'در حال ثبت…' : 'ثبت نهایی پاسخ'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
