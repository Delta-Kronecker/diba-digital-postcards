import React, { useEffect, useState } from 'react';
import {
  Check,
  ChevronDown,
  Eye,
  Music,
  Palette,
  RefreshCw,
  Sliders,
  Sparkles,
  Type,
} from 'lucide-react';
import ThreeDEnvelope from './3DEnvelope';
import AudioPlayer from './AudioPlayer';

const ENVELOPE_COLORS = [
  { id: 'ivory', name: 'عاجی', hex: '#EFE6D7', dark: false },
  { id: 'charcoal', name: 'زغالی', hex: '#2A2825', dark: true },
  { id: 'rose', name: 'رز', hex: '#EAE1DF', dark: false },
  { id: 'sage', name: 'زیتونی', hex: '#DFE3DD', dark: false },
];

const FOIL_COLORS = [
  { id: 'champagne', name: 'شامپاینی', hex: '#B49A70', dark: false },
  { id: 'rosegold', name: 'رزگلد', hex: '#B76E79', dark: true },
  { id: 'silver', name: 'نقره‌ای', hex: '#9FA5A8', dark: false },
  { id: 'olive', name: 'زیتونی', hex: '#687567', dark: true },
];

const SEALS = ['A & S', 'دیبا', '۱۴۰۶', 'ART', 'مهر'];

const TRACKS = [
  { id: 'synth-romantic', name: 'والس عاشقانه، عروسی' },
  { id: 'synth-soothing', name: 'نوای آرام، یادبود' },
  { id: 'synth-classical', name: 'پیانو کلاسیک، هنری' },
  { id: 'synth-modern', name: 'سینث مدرن، افتتاحیه' },
  { id: 'synth-festive', name: 'جشن و سرور، نوروز' },
];

const STORAGE_KEY = 'diba_customizer_v1';
const DEFAULTS = {
  envelopeBg: '#EFE6D7',
  foilColor: '#B49A70',
  sealText: 'A & S',
  audioTrack: 'synth-romantic',
  namesText: 'امیرحسین و سارا',
};

function readSavedConfig() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
}

function pickColor(value, palette, fallback) {
  return palette.some((color) => color.hex === value) ? value : fallback;
}

function pickTrack(value) {
  return TRACKS.some((track) => track.id === value) ? value : DEFAULTS.audioTrack;
}

function pickText(value, fallback, maxLength) {
  return typeof value === 'string' && value.trim() !== '' ? value.slice(0, maxLength) : fallback;
}

const FIELD =
  'h-11 w-full border border-line bg-canvas/50 px-3 text-base text-ink placeholder:text-ink-subtle focus:border-gold focus:outline-none sm:text-sm';

const SELECT_FIELD =
  'h-11 w-full appearance-none border border-line bg-canvas/50 ps-3 pe-10 text-base text-ink focus:border-gold focus:outline-none sm:text-sm';

/* The chip carries the check itself, in whichever ink reads on its own colour. */
function ColorSwatch({ color, selected }) {
  return (
    <span
      className="flex size-6 items-center justify-center rounded-full border border-black/10"
      style={{ backgroundColor: color.hex }}
      aria-hidden="true"
    >
      {selected && (
        <Check className={`size-3 ${color.dark ? 'text-cream' : 'text-seal-ink'}`} strokeWidth={3} />
      )}
    </span>
  );
}

export default function DemoCustomizer() {
  const [envelopeBg, setEnvelopeBg] = useState(() => {
    const saved = readSavedConfig();
    return pickColor(saved?.envelopeBg, ENVELOPE_COLORS, DEFAULTS.envelopeBg);
  });
  const [sealText, setSealText] = useState(() => {
    const saved = readSavedConfig();
    return pickText(saved?.sealText, DEFAULTS.sealText, 8);
  });
  const [foilColor, setFoilColor] = useState(() => {
    const saved = readSavedConfig();
    return pickColor(saved?.foilColor, FOIL_COLORS, DEFAULTS.foilColor);
  });
  const [audioTrack, setAudioTrack] = useState(() => {
    const saved = readSavedConfig();
    return pickTrack(saved?.audioTrack);
  });
  const [namesText, setNamesText] = useState(() => {
    const saved = readSavedConfig();
    return pickText(saved?.namesText, DEFAULTS.namesText, 32);
  });
  const [isCardOpen, setIsCardOpen] = useState(false);

  const envelopeName = ENVELOPE_COLORS.find((c) => c.hex === envelopeBg)?.name ?? 'سفارشی';
  const foilName = FOIL_COLORS.find((c) => c.hex === foilColor)?.name ?? 'سفارشی';
  const trackName = TRACKS.find((t) => t.id === audioTrack)?.name ?? '—';

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ envelopeBg, foilColor, sealText, audioTrack, namesText })
      );
    } catch {
      // Private browsing or a full quota must never break the customizer.
    }
  }, [envelopeBg, foilColor, sealText, audioTrack, namesText]);

  const reset = () => {
    setEnvelopeBg(DEFAULTS.envelopeBg);
    setFoilColor(DEFAULTS.foilColor);
    setSealText(DEFAULTS.sealText);
    setAudioTrack(DEFAULTS.audioTrack);
    setNamesText(DEFAULTS.namesText);
    setIsCardOpen(false);
  };

  return (
    <section className="shell">
      <div className="grid grid-cols-1 items-end gap-6 border-b border-line pb-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1 className="display-section max-w-2xl text-ink">
            کارت خود را همین‌جا
            <span className="text-ink-muted"> شکل بدهید.</span>
          </h1>
        </div>
        <p className="max-w-sm text-xs leading-[2] text-ink-muted lg:col-span-4 lg:justify-self-end">
          پالت پاکت، مهر موم، رنگ متالیک و موسیقی را تغییر دهید و نتیجه را
          بلافاصله روی پاکت زنده ببینید.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        {/* controls */}
        <div className="border border-line bg-surface p-6 sm:p-8 lg:col-span-5">
          <div className="flex items-center justify-between border-b border-line pb-4">
            <span className="flex items-center gap-2 text-xs text-ink-muted">
              <Sliders className="size-3.5 text-gold" aria-hidden="true" />
              تنظیمات کارت
            </span>
            <button
              type="button"
              onClick={reset}
              title="بازنشانی"
              className="relative flex size-8 items-center justify-center border border-line text-ink-muted transition-colors after:absolute after:-inset-1.5 after:content-[''] hover:border-line-strong hover:text-ink"
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              <span className="sr-only">بازنشانی تنظیمات</span>
            </button>
          </div>
          <p className="mt-3 text-xs leading-[1.8] text-ink-subtle" role="status">
            تغییرات شما به‌صورت خودکار در همین مرورگر ذخیره می‌شود.
          </p>

          <div className="mt-6 flex flex-col gap-7">
            <fieldset>
              <legend className="mb-3 flex items-center gap-2 text-xs text-ink-muted">
                <Palette className="size-3.5 text-gold" aria-hidden="true" />
                رنگ پاکت
              </legend>
              <div className="grid grid-cols-4 gap-2">
                {ENVELOPE_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setEnvelopeBg(color.hex)}
                    aria-pressed={envelopeBg === color.hex}
                    className={`flex flex-col items-center gap-2 border p-2.5 text-xs transition-colors ${
                      envelopeBg === color.hex
                        ? 'border-gold bg-gold/5 text-ink'
                        : 'border-line text-ink-subtle hover:border-line-strong'
                    }`}
                  >
                    <ColorSwatch color={color} selected={envelopeBg === color.hex} />
                    {color.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="mb-3 flex items-center gap-2 text-xs text-ink-muted">
                <Sparkles className="size-3.5 text-gold" aria-hidden="true" />
                رنگ متالیک
              </legend>
              <div className="grid grid-cols-4 gap-2">
                {FOIL_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => setFoilColor(color.hex)}
                    aria-pressed={foilColor === color.hex}
                    className={`flex flex-col items-center gap-2 border p-2.5 text-xs transition-colors ${
                      foilColor === color.hex
                        ? 'border-gold bg-gold/5 text-ink'
                        : 'border-line text-ink-subtle hover:border-line-strong'
                    }`}
                  >
                    <ColorSwatch color={color} selected={foilColor === color.hex} />
                    {color.name}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor="seal-text" className="mb-3 flex items-center gap-2 text-xs text-ink-muted">
                <Type className="size-3.5 text-gold" aria-hidden="true" />
                متن مهر موم
              </label>
              <div className="mb-2 flex flex-wrap gap-1.5">
                {SEALS.map((seal) => (
                  <button
                    key={seal}
                    type="button"
                    onClick={() => setSealText(seal)}
                    aria-pressed={sealText === seal}
                    className={`border px-3 py-1.5 text-xs transition-colors ${
                      sealText === seal ? 'border-ink bg-ink text-canvas' : 'border-line text-ink-muted hover:border-line-strong'
                    }`}
                  >
                    {seal}
                  </button>
                ))}
              </div>
              <input
                id="seal-text"
                type="text"
                value={sealText}
                onChange={(e) => setSealText(e.target.value)}
                maxLength={8}
                autoComplete="off"
                enterKeyHint="done"
                className={FIELD}
                placeholder="متن دلخواه…"
              />
            </div>

            <div>
              <label htmlFor="names-text" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <Type className="size-3.5 text-gold" aria-hidden="true" />
                نام‌های روی کارت
              </label>
              <input
                id="names-text"
                type="text"
                value={namesText}
                onChange={(e) => setNamesText(e.target.value)}
                maxLength={32}
                autoComplete="off"
                enterKeyHint="done"
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="audio-track" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <Music className="size-3.5 text-gold" aria-hidden="true" />
                موسیقی
              </label>
              <div className="relative">
                <select
                  id="audio-track"
                  value={audioTrack}
                  onChange={(e) => setAudioTrack(e.target.value)}
                  className={SELECT_FIELD}
                >
                  {TRACKS.map((track) => (
                    <option key={track.id} value={track.id}>
                      {track.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-ink-subtle"
                  aria-hidden="true"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsCardOpen((v) => !v)}
              className="btn btn-ink w-full"
            >
              <Eye className="size-4" aria-hidden="true" />
              {isCardOpen ? 'بستن پاکت' : 'پیش‌نمایش گشودن کارت'}
            </button>
          </div>
        </div>

        {/* live preview — a studio table, not a flat field */}
        <div className="studio-table relative flex flex-col overflow-hidden border border-line lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface/60 px-5 py-4">
            <span className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
              پیش‌نمایش زنده
            </span>
            <AudioPlayer trackType={audioTrack} trackTitle="پیش‌نمایش موسیقی" accentColor={foilColor} />
          </div>

          <div className="relative flex-1 px-4 py-5 sm:px-8">
            <p className="sr-only" aria-live="polite">
              پاکت {envelopeBg}، مهر {sealText}، متالیک {foilColor}
            </p>

            <ThreeDEnvelope
              isOpen={isCardOpen}
              onOpen={() => setIsCardOpen(true)}
              openLabel="گشودن پاکت سفارشی"
              sealText={sealText}
              accent={foilColor}
              metal
              paper={envelopeBg}
            >
              <div className="border border-paper-line bg-paper p-8 text-center text-paper-ink sm:p-12">
                <span lang="en" className="latin text-xs text-paper-ink-muted">Your custom invitation</span>
                <h2 className="mt-4 font-display text-3xl font-medium" style={{ color: `color-mix(in srgb, ${foilColor} 82%, var(--color-paper-ink))` }}>
                  {namesText}
                </h2>
                <p className="mx-auto mt-3 max-w-sm text-xs leading-[2] text-paper-ink-muted">
                  این پیش‌نمایش زندهٔ تنظیمات شماست؛ رنگ پاکت، مهر و موسیقی
                  بلافاصله اعمال می‌شوند.
                </p>
                <div className="mx-auto mt-6 flex max-w-xs items-center justify-center gap-4 border-t border-paper-line pt-4 text-xs text-paper-ink-muted">
                  <span>مهر: {sealText}</span>
                  <span className="h-3 w-px bg-paper-line" />
                  <span>متالیک: {foilColor}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCardOpen(false)}
                  className="mt-7 border-b border-paper-gold pb-1 text-xs text-paper-gold-deep"
                >
                  بستن دوباره
                </button>
              </div>
            </ThreeDEnvelope>
          </div>

          {/* The running spec sheet: what this invitation is made of, right now. */}
          <dl className="relative grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-4">
            {[
              { k: 'رنگ پاکت', v: envelopeName, dot: envelopeBg },
              { k: 'رنگ متالیک', v: foilName, dot: foilColor },
              { k: 'متن مهر', v: sealText },
              { k: 'موسیقی', v: trackName },
            ].map((spec) => (
              <div key={spec.k} className="bg-surface px-4 py-3.5">
                <dt className="flex items-center gap-2 text-xs text-ink-subtle">
                  {spec.dot && (
                    <span
                      className="size-2.5 shrink-0 rounded-full border border-black/10"
                      style={{ backgroundColor: spec.dot }}
                      aria-hidden="true"
                    />
                  )}
                  {spec.k}
                </dt>
                <dd className="mt-1.5 truncate font-display text-sm text-ink">{spec.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
