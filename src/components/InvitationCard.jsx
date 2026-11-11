import React from 'react';
import { Calendar, Image as ImageIcon, MapPin, MessageSquare, Send, Share2 } from 'lucide-react';
import CountdownTimer from './CountdownTimer';
import Ornament from './Ornament';
import Picture from './Picture';

export default function InvitationCard({
  data,
  variant = 'general',
  audio = null,
  onRsvp,
  onCondolence,
  onLightbox,
  onCopy,
  copied,
}) {
  const isMemorial = variant === 'memorial';
  const isWedding = variant === 'wedding';

  const paper = isMemorial ? 'bg-surface' : 'bg-surface';
  const accentText = isMemorial ? 'text-sage' : 'text-gold-deep';
  const accentBg = isMemorial ? 'bg-sage-solid text-cream' : 'bg-ink text-canvas';
  const accentBorder = isMemorial ? 'border-sage/45' : 'border-gold/45';

  const names = isWedding
    ? `${data.groomName} و ${data.brideName}`
    : isMemorial
      ? data.deceasedName
      : data.title;

  return (
    <article
      data-theme={isMemorial ? 'memorial' : undefined}
      className={`paper-sheet relative mx-auto w-full max-w-3xl border border-line ${paper} px-5 py-10 text-center shadow-lift sm:px-10 md:px-16 md:py-16`}
    >
      {/* inner frame */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-3 border border-line" />
      {/* four corner rules, the way a letterpress plate is keyed to its sheet */}
      <span aria-hidden="true" className={`pointer-events-none absolute start-6 top-6 size-3 border-s border-t ${accentBorder}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute end-6 top-6 size-3 border-e border-t ${accentBorder}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-6 start-6 size-3 border-s border-b ${accentBorder}`} />
      <span aria-hidden="true" className={`pointer-events-none absolute bottom-6 end-6 size-3 border-e border-b ${accentBorder}`} />
      {/* top hairline */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{
          background: isMemorial
            ? 'var(--color-sage)'
            : 'linear-gradient(90deg, transparent, var(--color-gold) 18%, var(--color-gold-soft) 50%, var(--color-gold) 82%, transparent)',
        }}
      />

      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <span lang="en" className={`latin text-xs ${isMemorial ? 'text-sage' : 'text-gold-deep'}`}>
            {isMemorial ? 'In loving memory' : isWedding ? 'The wedding of' : 'You are invited'}
          </span>
          <span className={`text-xs ${accentText}`}>{data.categoryTitle}</span>
        </div>

        <div className="relative mx-auto mt-7 flex size-14 items-center justify-center rounded-full border border-line bg-canvas/60">
          <span aria-hidden="true" className={`absolute inset-[3px] rounded-full border ${accentBorder}`} />
          <span className={`font-display text-lg ${accentText}`}>د</span>
        </div>

        <p className="mt-6 text-xs text-ink-subtle">
          {isMemorial ? data.subtitle : isWedding ? 'به نام عشق' : data.subtitle}
        </p>

        <h1 className="mt-3 font-display text-[clamp(1.9rem,5vw,3.4rem)] font-medium leading-[1.2] text-ink">
          {names}
        </h1>

        <p className="mx-auto mt-3 max-w-md text-xs leading-[2] text-ink-muted">
          {isMemorial
            ? `از طرف ${data.family}`
            : isWedding
              ? `به همراه خانواده‌های ${data.parents}`
              : data.hostNames
                ? `میزبان: ${data.hostNames}`
                : ''}
        </p>

        <div className="mx-auto mt-7 flex max-w-xs items-center justify-center gap-4 text-gold/70" aria-hidden="true">
          <span className="h-px w-14 bg-line" />
          <Ornament className="size-3.5" />
          <span className="h-px w-14 bg-line" />
        </div>

        {data.poem && (
          <blockquote className="mx-auto mt-7 max-w-lg border-y border-line px-6 py-5">
            <p className="text-xs leading-[2.1] text-ink-muted">{data.poem}</p>
          </blockquote>
        )}

        <CountdownTimer
          targetDate={data.targetDate}
          accentColor={isMemorial ? 'var(--color-gold)' : 'var(--color-gold-deep)'}
          hasGold={!isMemorial}
        />

        <div className="grid grid-cols-1 gap-4 text-start sm:grid-cols-2">
          <div className="border border-line bg-canvas/40 p-5">
            <p className={`flex items-center gap-2 text-xs ${accentText}`}>
              <Calendar className="size-3.5" aria-hidden="true" />
              زمان مراسم
            </p>
            <p className="mt-3 font-display text-sm leading-relaxed text-ink">{data.datePersian}</p>
          </div>

          <div className="border border-line bg-canvas/40 p-5">
            <p className={`flex items-center gap-2 text-xs ${accentText}`}>
              <MapPin className="size-3.5" aria-hidden="true" />
              مکان مراسم
            </p>
            <p className="mt-3 font-display text-sm leading-relaxed text-ink">{data.venue}</p>
            <p className="mt-1 text-xs leading-[1.9] text-ink-muted">{data.address}</p>
          </div>
        </div>

        {audio && (
          <div className="mt-6 flex items-center justify-between gap-4 border border-line px-4 py-3">
            <div className="text-start">
              <p className="text-xs text-ink-subtle">موسیقی اختصاصی</p>
              <p className="mt-0.5 text-xs text-ink-muted">{data.audioTrack.title}</p>
            </div>
            <div className="flex items-center">{audio}</div>
          </div>
        )}

        <div className="mt-8 border-t border-line pt-6">
          <div className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-2 text-xs text-ink-subtle">
              <ImageIcon className="size-3.5" aria-hidden="true" />
              {isMemorial ? 'آلبوم یادبود' : 'آلبوم تصاویر'}
            </span>
            <span className="text-xs text-ink-subtle">برای بزرگ‌نمایی انتخاب کنید</span>
          </div>

          <div className={`mt-4 grid gap-3 ${data.images.length > 2 ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {data.images.map((image, index) => (
              <button
                key={image.id}
                type="button"
                onClick={() => onLightbox(index)}
                className="group relative h-28 overflow-hidden bg-surface-2 sm:h-36"
                aria-label={`${image.title}، بزرگ‌نمایی`}
              >
                <Picture
                  src={image.url}
                  alt=""
                  width="400"
                  height="300"
                  loading="lazy"
                  decoding="async"
                  className={`h-full w-full object-cover ${
                    isMemorial ? 'grayscale-[35%] group-hover:grayscale-0' : ''
                  }`}
                />
                <span className="absolute inset-0 bg-scrim/25 transition-colors duration-base group-hover:bg-scrim/10" />
                <span className="absolute bottom-2 start-2 bg-scrim/45 px-2 py-1 text-xs text-cream/90 backdrop-blur-sm">
                  {image.title}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button type="button" onClick={onRsvp} className={`btn ${accentBg} w-full sm:w-auto`}>
            <Send className="size-4" aria-hidden="true" />
            {isMemorial ? 'تأیید حضور در مراسم' : 'اعلام حضور و ثبت پیام'}
          </button>

          {isMemorial && (
            <button type="button" onClick={onCondolence} className="btn btn-outline w-full sm:w-auto">
              <MessageSquare className="size-4" aria-hidden="true" />
              ارسال پیام تسلیت
            </button>
          )}

          <button
            type="button"
            onClick={onCopy}
            className="link-underline !text-xs !text-ink-muted"
          >
            <Share2 className="size-3.5" aria-hidden="true" />
            {copied ? 'لینک کپی شد' : 'اشتراک‌گذاری دعوت'}
          </button>
        </div>

        <p className="mt-8 text-xs text-ink-subtle">
          {isMemorial ? 'با احترام، آتلیهٔ دیبا' : 'طراحی‌شده در آتلیهٔ دیبا'}
        </p>
      </div>
    </article>
  );
}
