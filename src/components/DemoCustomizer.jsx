import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Braces,
  Calendar,
  Check,
  ChevronDown,
  Copy,
  Eye,
  EyeOff,
  MapPin,
  Music,
  Palette,
  Redo2,
  RefreshCw,
  Sliders,
  Sparkles,
  Type,
  Undo2,
  Wand2,
} from 'lucide-react';
import ThreeDEnvelope from './3DEnvelope';
import AudioPlayer from './AudioPlayer';
import SectionMark from './SectionMark';
import { toPersianDigits } from '../utils/numbers';

/* The two palettes of the studio.
 *
 * A7 — the envelope's light sage and the metallic sage shared one label, so the
 * running spec sheet could name two different colours «زیتونی» in the same row
 * set. The envelope tile keeps its `sage` id and its hex and takes its own name;
 * the metallic finish keeps the label it is known by. Both vocabularies are now
 * disjoint: {عاجی، زغالی، رز، مریمی} and {شامپاینی، رزگلد، نقرهای، زیتونی}. */
const ENVELOPE_COLORS = [
  { id: 'ivory', name: 'عاجی', hex: '#EFE6D7', dark: false },
  { id: 'charcoal', name: 'زغالی', hex: '#2A2825', dark: true },
  { id: 'rose', name: 'رز', hex: '#EAE1DF', dark: false },
  { id: 'sage', name: 'مریمی', hex: '#DFE3DD', dark: false },
];

const FOIL_COLORS = [
  { id: 'champagne', name: 'شامپاینی', hex: '#B49A70', dark: false },
  { id: 'rosegold', name: 'رزگلد', hex: '#B76E79', dark: true },
  { id: 'silver', name: 'نقرهای', hex: '#9FA5A8', dark: false },
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
const HISTORY_LIMIT = 30;
const MAX_SEAL = 8;
const MAX_NAMES = 32;
const MAX_LINE = 64;

const DEFAULTS = {
  envelopeBg: '#EFE6D7',
  foilColor: '#B49A70',
  sealText: 'A & S',
  audioTrack: 'synth-romantic',
  namesText: 'امیرحسین و سارا',
  dateText: 'جمعه ۲۸ خرداد ۱۴۰۶ - ساعت ۱۹:۰۰',
  venueText: 'تالار مجلل اسپیناس پالاس',
  metal: true,
};

/* B1 — a preset is a whole plan in one press: the same five-plus ingredients the
 * site's own routes carry, so the studio opens on a starting point instead of a
 * grid of independent controls. */
const PRESETS = [
  {
    id: 'wedding',
    name: 'عروسی',
    config: {
      envelopeBg: '#EFE6D7',
      foilColor: '#B49A70',
      sealText: 'A & S',
      audioTrack: 'synth-romantic',
      metal: true,
      namesText: 'امیرحسین و سارا',
      dateText: 'جمعه ۲۸ خرداد ۱۴۰۶ - ساعت ۱۹:۰۰',
      venueText: 'تالار مجلل اسپیناس پالاس',
    },
  },
  {
    id: 'memorial',
    name: 'یادبود',
    config: {
      envelopeBg: '#2A2825',
      foilColor: '#9FA5A8',
      sealText: 'یادبود',
      audioTrack: 'synth-soothing',
      metal: false,
      namesText: 'یادبود حاج رضا',
      dateText: 'پنجشنبه ۳۰ اردیبهشت ۱۴۰۶ - ساعت ۱۵:۰۰',
      venueText: 'مسجد جامع شهرک غرب',
    },
  },
  {
    id: 'opening',
    name: 'افتتاحیه',
    config: {
      envelopeBg: '#DFE3DD',
      foilColor: '#B76E79',
      sealText: 'ART',
      audioTrack: 'synth-modern',
      metal: true,
      namesText: 'افتتاحیهٔ گالری آرک',
      dateText: 'شنبه ۱۹ تیر ۱۴۰۶ - ساعت ۱۷:۰۰',
      venueText: 'فرهنگسرای نیاوران',
    },
  },
];

/* B3 — the plan travels as query parameters. The router reads the hash, never
 * the search string, so the link can carry a whole plan without touching
 * navigation. */
const SHARE_PARAMS = {
  env: 'envelopeBg',
  foil: 'foilColor',
  seal: 'sealText',
  trk: 'audioTrack',
  nm: 'namesText',
  dt: 'dateText',
  vn: 'venueText',
};

function readShareParams(params) {
  const patch = {};
  for (const [key, field] of Object.entries(SHARE_PARAMS)) {
    if (params.has(key)) patch[field] = params.get(key);
  }
  if (params.has('mt')) patch.metal = params.get('mt') === '1';
  return patch;
}

const FIELD =
  'h-11 w-full border border-line bg-canvas/50 px-3 text-base text-ink placeholder:text-ink-subtle focus:border-gold focus:outline-none sm:text-sm';

const SELECT_FIELD =
  'h-11 w-full appearance-none border border-line bg-canvas/50 ps-3 pe-10 text-base text-ink focus:border-gold focus:outline-none sm:text-sm';

const ICON_BUTTON =
  'chip-target relative flex size-9 shrink-0 items-center justify-center border border-line text-ink-muted transition-colors enabled:hover:border-line-strong enabled:hover:text-ink disabled:cursor-not-allowed disabled:opacity-40';

/* ---------- reading a plan ---------- */

function readStored() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function pickColor(value, palette, fallback) {
  return palette.some((color) => color.hex === value) ? value : fallback;
}

function pickTrack(value, fallback = DEFAULTS.audioTrack) {
  return TRACKS.some((track) => track.id === value) ? value : fallback;
}

function pickText(value, fallback, maxLength) {
  return typeof value === 'string' && value.trim() !== '' ? value.slice(0, maxLength) : fallback;
}

/* Every entry point — storage, a share link, a preset — runs through this, so a
 * hand-edited value can never reach the envelope. */
function normalize(raw, fallback = DEFAULTS) {
  return {
    envelopeBg: pickColor(raw?.envelopeBg, ENVELOPE_COLORS, fallback.envelopeBg),
    foilColor: pickColor(raw?.foilColor, FOIL_COLORS, fallback.foilColor),
    sealText: pickText(raw?.sealText, fallback.sealText, MAX_SEAL),
    audioTrack: pickTrack(raw?.audioTrack, fallback.audioTrack),
    namesText: pickText(raw?.namesText, fallback.namesText, MAX_NAMES),
    dateText: pickText(raw?.dateText, fallback.dateText, MAX_LINE),
    venueText: pickText(raw?.venueText, fallback.venueText, MAX_LINE),
    metal: typeof raw?.metal === 'boolean' ? raw.metal : fallback.metal,
  };
}

/* A11 — one read of the plan, not five. This also resolves the share link and
 * decides what (if anything) the restored state should announce (A22). */
function readBootConfig() {
  const config = normalize(readStored());

  const params = new URLSearchParams(window.location.search);
  const patch = readShareParams(params);
  const hasShare = Object.keys(patch).length > 0;
  const merged = hasShare ? normalize({ ...config, ...patch }, config) : config;

  const restored = Object.keys(DEFAULTS).some((key) => merged[key] !== DEFAULTS[key]);
  const notice = hasShare
    ? 'طرح اشتراک‌گذاشته‌شده بارگذاری شد.'
    : restored
      ? 'تنظیمات قبلی بازیابی شد.'
      : '';

  return { config: merged, notice };
}

/* ---------- B11: the names' contrast on the sheet ---------- */
/* The card paints its names with `color-mix(in srgb, <foil> 82%, paper-ink)` on
 * `--color-paper`. This reproduces that mix so the studio can state the ratio it
 * actually ships, instead of leaving it to be discovered in an audit. */

const PAPER_RGB = [247, 242, 232];
const PAPER_INK_RGB = [25, 22, 18];

function hexToRgb(hex) {
  const match = /^#?([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const int = parseInt(match[1], 16);
  return [(int >> 16) & 255, (int >> 8) & 255, int & 255];
}

function channelLuminance(channel) {
  const value = channel / 255;
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b);
}

function contrastRatio(a, b) {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const hi = Math.max(la, lb);
  const lo = Math.min(la, lb);
  return (hi + 0.05) / (lo + 0.05);
}

function namesInk(foilHex) {
  const foil = hexToRgb(foilHex);
  if (!foil) return PAPER_INK_RGB;
  return foil.map((channel, index) => Math.round(channel * 0.82 + PAPER_INK_RGB[index] * 0.18));
}

function contrastLevel(ratio) {
  if (ratio >= 7) return { label: 'AAA', low: false };
  if (ratio >= 4.5) return { label: 'AA', low: false };
  if (ratio >= 3) return { label: 'AA برای متن بزرگ', low: false };
  return { label: 'زیر حد', low: true };
}

function nameOf(palette, hex) {
  return palette.find((color) => color.hex === hex)?.name ?? 'سفارشی';
}

/* What each field sounds like when it changes. The announcement names the thing
 * that moved rather than reciting the whole plan, so a change to the names is
 * still a change to the announcement. */
const FIELD_ANNOUNCE = {
  envelopeBg: (plan) => `پاکت ${nameOf(ENVELOPE_COLORS, plan.envelopeBg)}`,
  foilColor: (plan) => `متالیک ${nameOf(FOIL_COLORS, plan.foilColor)}`,
  sealText: (plan) => `مهر ${plan.sealText.trim() || 'بی‌واژه'}`,
  audioTrack: (plan) => `موسیقی ${TRACKS.find((track) => track.id === plan.audioTrack)?.name ?? '—'}`,
  namesText: (plan) => `نام‌ها ${plan.namesText.trim() || 'خالی'}`,
  dateText: (plan) => `تاریخ ${plan.dateText.trim() || 'خالی'}`,
  venueText: (plan) => `نشانی ${plan.venueText.trim() || 'خالی'}`,
  metal: (plan) => (plan.metal ? 'پرداخت فلزی' : 'پرداخت مات'),
};

function samePlan(a, b) {
  return Object.keys(DEFAULTS).every((key) => a[key] === b[key]);
}

function announce(previous, next) {
  const parts = Object.keys(FIELD_ANNOUNCE)
    .filter((key) => next[key] !== previous[key])
    .map((key) => FIELD_ANNOUNCE[key](next));
  return parts.length ? `ذخیره شد؛ ${parts.join('، ')}` : 'ذخیره شد.';
}

/* The chip carries the check itself, in whichever ink reads on its own colour.
 * A16 — that rim is a fixed 10% black: the swatch is a *material* sample, so it
 * keeps one appearance in both themes. A `line` token would invert on a colour
 * that never does. */
function ColorSwatch({ color, selected }) {
  return (
    <span
      className="flex size-6 items-center justify-center rounded-full border border-black/10"
      style={{ backgroundColor: color.hex }}
      aria-hidden="true"
    >
      {selected && (
        <Check
          className={`size-3 [stroke-width:3] ${color.dark ? 'text-cream' : 'text-seal-ink'}`}
          strokeWidth={3}
        />
      )}
    </span>
  );
}

/* A17 — two exclusive four-way choices were eight `aria-pressed` buttons with no
 * group and no arrow keys. They are now real radio groups: one tab stop, arrows
 * (and Home/End) that move the selection the way the reading direction runs. */
function ColorChoices({ Icon, label, colors, value, onChange }) {
  const groupRef = useRef(null);
  const selectedIndex = colors.findIndex((color) => color.hex === value);
  const activeIndex = selectedIndex === -1 ? 0 : selectedIndex;

  const onKeyDown = (event) => {
    const last = colors.length - 1;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const forwards =
      event.key === 'ArrowDown' || (rtl ? event.key === 'ArrowLeft' : event.key === 'ArrowRight');
    const backwards =
      event.key === 'ArrowUp' || (rtl ? event.key === 'ArrowRight' : event.key === 'ArrowLeft');

    let index = activeIndex;
    if (forwards) index = activeIndex === last ? 0 : activeIndex + 1;
    else if (backwards) index = activeIndex === 0 ? last : activeIndex - 1;
    else if (event.key === 'Home') index = 0;
    else if (event.key === 'End') index = last;
    else return;

    event.preventDefault();
    onChange(colors[index].hex);
    groupRef.current?.querySelectorAll('[role="radio"]')[index]?.focus();
  };

  return (
    <fieldset>
      {/* A18 — `legend` + flex is a cross-browser weak spot; the flex moves to an
          inner span, so the icon and the label keep their gap everywhere. */}
      <legend className="mb-3 text-xs text-ink-muted">
        <span className="flex items-center gap-2">
          <Icon className="size-3.5 text-gold" aria-hidden="true" />
          {label}
        </span>
      </legend>
      <div
        ref={groupRef}
        role="radiogroup"
        aria-label={label}
        onKeyDown={onKeyDown}
        className="grid grid-cols-4 gap-2"
      >
        {colors.map((color, index) => {
          const selected = color.hex === value;
          return (
            <button
              key={color.id}
              type="button"
              role="radio"
              aria-checked={selected}
              tabIndex={index === activeIndex ? 0 : -1}
              onClick={() => onChange(color.hex)}
              className={`flex flex-col items-center gap-2 border p-2.5 text-xs transition-colors ${
                selected
                  ? 'border-gold bg-gold/5 text-ink'
                  : 'border-line text-ink-subtle hover:border-line-strong'
              }`}
            >
              <ColorSwatch color={color} selected={selected} />
              {color.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export default function DemoCustomizer() {
  const boot = useMemo(() => readBootConfig(), []);
  const [config, setConfig] = useState(boot.config);
  const [history, setHistory] = useState({ past: [], future: [] });
  const [isCardOpen, setIsCardOpen] = useState(false);
  const [status, setStatus] = useState('');

  /* The plan as it stands; effects read it without listing every field. */
  const configRef = useRef(config);
  configRef.current = config;
  /* The plan already written to storage and already in the history stack. */
  const committedRef = useRef(boot.config);
  /* Set by undo/redo, so restoring a step does not record itself. */
  const suppressRef = useRef(false);
  const statusTimerRef = useRef(0);
  /* When the visible note was last written. The debounced save line is generic
     and frequent; a copy/undo/restore line is specific and rare, so the generic
     one waits its turn instead of wiping the answer to the press just made. */
  const statusAtRef = useRef(0);

  const flashStatus = useCallback((message, priority = false) => {
    const now = Date.now();
    if (!priority && now - statusAtRef.current < 1200) return;
    statusAtRef.current = now;
    setStatus(message);
    window.clearTimeout(statusTimerRef.current);
    statusTimerRef.current = window.setTimeout(() => setStatus(''), 3600);
  }, []);

  /* A9/A22 — the restored plan announces itself once, after mount, so the live
     region truly speaks it rather than carrying it at load. */
  useEffect(() => {
    if (!boot.notice) return undefined;
    flashStatus(boot.notice, true);
    return () => window.clearTimeout(statusTimerRef.current);
  }, [boot.notice, flashStatus]);

  /* A8/A10/B10 — one debounced burst per edit session: it writes storage once,
     pushes one undo step, and speaks the plan once, in names rather than hexes. */
  useEffect(() => {
    if (suppressRef.current) {
      suppressRef.current = false;
      committedRef.current = configRef.current;
      persist(configRef.current);
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const previous = committedRef.current;
      const next = configRef.current;
      /* A press that lands on the value already set is not a step, a write, or a
         thing to say. */
      if (samePlan(previous, next)) return;
      committedRef.current = next;
      setHistory((stack) => ({
        past: [...stack.past, previous].slice(-HISTORY_LIMIT),
        future: [],
      }));
      persist(next);
      flashStatus(announce(previous, next));
    }, 420);

    return () => window.clearTimeout(timer);
  }, [config, flashStatus]);

  useEffect(() => () => window.clearTimeout(statusTimerRef.current), []);

  const update = useCallback((patch) => {
    setConfig((current) => ({ ...current, ...patch }));
  }, []);

  const undo = useCallback(() => {
    if (!history.past.length) return;
    const previous = history.past[history.past.length - 1];
    suppressRef.current = true;
    setHistory({
      past: history.past.slice(0, -1),
      future: [committedRef.current, ...history.future].slice(0, HISTORY_LIMIT),
    });
    setConfig(previous);
    flashStatus('به طرح پیشین بازگشتید.', true);
  }, [history, flashStatus]);

  const redo = useCallback(() => {
    if (!history.future.length) return;
    const next = history.future[0];
    suppressRef.current = true;
    setHistory({
      past: [...history.past, committedRef.current].slice(-HISTORY_LIMIT),
      future: history.future.slice(1),
    });
    setConfig(next);
    flashStatus('طرح بعدی بازگردانده شد.', true);
  }, [history, flashStatus]);

  const applyPreset = useCallback(
    (preset) => {
      setConfig((current) => {
        const next = { ...current, ...preset.config };
        /* The names are the one field a preset must not overwrite: once they are
           no longer the studio's own default, they are the visitor's. */
        if (current.namesText !== DEFAULTS.namesText) next.namesText = current.namesText;
        return next;
      });
      setIsCardOpen(false);
    },
    []
  );

  const reset = useCallback(() => {
    setConfig({ ...DEFAULTS });
    setIsCardOpen(false);
  }, []);

  /* B14 — layout-independent physical keys, so the shortcuts work on a Persian
     keyboard too, and never while a field has the cursor. */
  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      const target = event.target;
      const tag = target?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target?.isContentEditable) return;

      if (event.code === 'KeyO') {
        event.preventDefault();
        setIsCardOpen((open) => !open);
      } else if (event.code === 'KeyZ' && event.shiftKey) {
        event.preventDefault();
        redo();
      } else if (event.code === 'KeyZ') {
        event.preventDefault();
        undo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [undo, redo]);

  const copyShareLink = useCallback(async () => {
    const url = new URL(window.location.href);
    url.hash = '#customizer';
    url.search = '';
    for (const [key, field] of Object.entries(SHARE_PARAMS)) {
      url.searchParams.set(key, configRef.current[field]);
    }
    url.searchParams.set('mt', configRef.current.metal ? '1' : '0');
    try {
      await navigator.clipboard.writeText(url.toString());
      flashStatus('لینک طرح کپی شد.', true);
    } catch {
      flashStatus('کپی نشد؛ دسترسی به حافظه ممکن نشد.', true);
    }
  }, [flashStatus]);

  const copyJson = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(configRef.current, null, 2));
      flashStatus('کد طرح (JSON) کپی شد.', true);
    } catch {
      flashStatus('کپی نشد؛ دسترسی به حافظه ممکن نشد.', true);
    }
  }, [flashStatus]);

  const envelopeName =
    ENVELOPE_COLORS.find((color) => color.hex === config.envelopeBg)?.name ?? 'سفارشی';
  const foilName = FOIL_COLORS.find((color) => color.hex === config.foilColor)?.name ?? 'سفارشی';
  const trackName = TRACKS.find((track) => track.id === config.audioTrack)?.name ?? '—';

  const trimmedSeal = config.sealText.trim();
  const trimmedNames = config.namesText.trim();
  const trimmedDate = config.dateText.trim();
  const trimmedVenue = config.venueText.trim();
  /* A19 — an empty field still has to render something meaningful. */
  const sealLabel = trimmedSeal || 'بی‌واژه';
  const displayNames = trimmedNames || 'نام‌های شما';

  const activePreset =
    PRESETS.find((preset) =>
      ['envelopeBg', 'foilColor', 'sealText', 'audioTrack', 'metal', 'dateText', 'venueText'].every(
        (key) => preset.config[key] === config[key]
      )
    )?.id ?? null;

  const contrast = useMemo(() => {
    const raw = contrastRatio(namesInk(config.foilColor), PAPER_RGB);
    /* Rounded down, so the number can never claim a step the pair does not reach. */
    const shown = Math.floor(raw * 10) / 10;
    return { shown, level: contrastLevel(shown) };
  }, [config.foilColor]);
  const ratioText = `${toPersianDigits(contrast.shown.toFixed(1)).replace('.', '٫')} : ۱`;

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  return (
    <section className="shell">
      <div className="grid grid-cols-1 items-end gap-6 border-b border-line pb-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <SectionMark number="۰۷" className="mb-4">استودیو طراحی</SectionMark>
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
        {/* controls — A13: on a phone the preview leads, and the DOM keeps the
            controls first so the `lg` grid still places them on the right. */}
        <div className="order-2 border border-line bg-surface p-6 sm:p-8 lg:order-none lg:col-span-5">
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-b border-line pb-4">
            <span className="flex items-center gap-2 text-xs text-ink-muted">
              <Sliders className="size-3.5 text-gold" aria-hidden="true" />
              تنظیمات کارت
            </span>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={undo}
                disabled={!canUndo}
                aria-label="واگرد"
                aria-keyshortcuts="Z"
                title="واگرد (Z)"
                className={ICON_BUTTON}
              >
                <Undo2 className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={redo}
                disabled={!canRedo}
                aria-label="ازنو"
                aria-keyshortcuts="Shift+Z"
                title="ازنو (Shift+Z)"
                className={ICON_BUTTON}
              >
                <Redo2 className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={reset}
                aria-label="بازنشانی تنظیمات"
                className="relative flex items-center gap-1.5 border border-line px-2.5 py-1.5 text-xs text-ink-muted transition-colors after:absolute after:-inset-2 after:content-[''] hover:border-line-strong hover:text-ink"
              >
                <RefreshCw className="size-3.5 shrink-0" aria-hidden="true" />
                بازنشانی
              </button>
            </div>
          </div>

          <p className="mt-3 text-xs leading-[1.8] text-ink-subtle">
            تغییرات شما به‌صورت خودکار در همین مرورگر ذخیره می‌شود.
          </p>
          {/* A9 — a real, transient status node. `truncate` keeps it one line and
              the text is still whole for a screen reader. */}
          <p role="status" className="mt-1.5 min-w-0 truncate text-xs text-ink-muted">
            {status || '\u00a0'}
          </p>

          <div className="mt-6 flex flex-col gap-7">
            <div>
              <span className="mb-3 flex items-center gap-2 text-xs text-ink-muted">
                <Wand2 className="size-3.5 text-gold" aria-hidden="true" />
                قالب‌های آماده
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    aria-pressed={activePreset === preset.id}
                    className={`chip-target relative border px-3 py-1.5 text-xs transition-colors ${
                      activePreset === preset.id
                        ? 'border-gold bg-gold/5 text-ink'
                        : 'border-line text-ink-muted hover:border-line-strong'
                    }`}
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <ColorChoices
              Icon={Palette}
              label="رنگ پاکت"
              colors={ENVELOPE_COLORS}
              value={config.envelopeBg}
              onChange={(hex) => update({ envelopeBg: hex })}
            />

            <div>
              <ColorChoices
                Icon={Sparkles}
                label="رنگ متالیک"
                colors={FOIL_COLORS}
                value={config.foilColor}
                onChange={(hex) => update({ foilColor: hex })}
              />
              {/* B11 — the ratio the card actually ships. */}
              <p className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-subtle">
                <span>کنتراست نام‌ها روی کاغذ</span>
                <span className="tabular-nums text-ink-muted">{ratioText}</span>
                <span className={contrast.level.low ? 'text-danger' : 'text-ink-muted'}>
                  {contrast.level.label}
                </span>
              </p>
            </div>

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
                    onClick={() => update({ sealText: seal })}
                    aria-pressed={config.sealText === seal}
                    className={`chip-target relative border px-3 py-1.5 text-xs transition-colors ${
                      config.sealText === seal
                        ? 'border-ink bg-ink text-canvas'
                        : 'border-line text-ink-muted hover:border-line-strong'
                    }`}
                  >
                    {seal}
                  </button>
                ))}
              </div>
              <input
                id="seal-text"
                type="text"
                value={config.sealText}
                onChange={(event) => update({ sealText: event.target.value })}
                maxLength={MAX_SEAL}
                autoComplete="off"
                enterKeyHint="done"
                aria-describedby="seal-help"
                className={FIELD}
                placeholder="متن دلخواه..."
              />
              <p
                id="seal-help"
                className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-xs text-ink-subtle"
              >
                <span>اگر خالی بماند، نقش سادهٔ برگ روی مهر می‌نشیند.</span>
                <span className="tabular-nums">
                  {toPersianDigits(config.sealText.length)} / {toPersianDigits(MAX_SEAL)}
                </span>
              </p>
            </div>

            <div>
              <label htmlFor="names-text" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <Type className="size-3.5 text-gold" aria-hidden="true" />
                نام‌های روی کارت
              </label>
              <input
                id="names-text"
                type="text"
                value={config.namesText}
                onChange={(event) => update({ namesText: event.target.value })}
                maxLength={MAX_NAMES}
                autoComplete="off"
                enterKeyHint="done"
                className={FIELD}
              />
            </div>

            <div>
              <label htmlFor="date-text" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <Calendar className="size-3.5 text-gold" aria-hidden="true" />
                زمان مراسم
              </label>
              <input
                id="date-text"
                type="text"
                value={config.dateText}
                onChange={(event) => update({ dateText: event.target.value })}
                maxLength={MAX_LINE}
                autoComplete="off"
                enterKeyHint="done"
                className={FIELD}
                placeholder="جمعه ۲۸ خرداد ۱۴۰۶"
              />
            </div>

            <div>
              <label htmlFor="venue-text" className="mb-2 flex items-center gap-2 text-xs text-ink-muted">
                <MapPin className="size-3.5 text-gold" aria-hidden="true" />
                مکان مراسم
              </label>
              <input
                id="venue-text"
                type="text"
                value={config.venueText}
                onChange={(event) => update({ venueText: event.target.value })}
                maxLength={MAX_LINE}
                autoComplete="off"
                enterKeyHint="done"
                className={FIELD}
                placeholder="تالار، سالن یا نشانی"
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
                  value={config.audioTrack}
                  onChange={(event) => update({ audioTrack: event.target.value })}
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
              onClick={() => setIsCardOpen((open) => !open)}
              aria-keyshortcuts="O"
              title="پیش‌نمایش گشودن کارت (O)"
              className="btn btn-ink w-full"
            >
              {isCardOpen ? (
                <EyeOff className="size-4" aria-hidden="true" />
              ) : (
                <Eye className="size-4" aria-hidden="true" />
              )}
              {isCardOpen ? 'بستن پاکت' : 'پیش‌نمایش گشودن کارت'}
            </button>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyShareLink}
                className="flex items-center gap-1.5 border border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Copy className="size-3.5" aria-hidden="true" />
                کپی لینک طرح
              </button>
              <button
                type="button"
                onClick={copyJson}
                className="flex items-center gap-1.5 border border-line px-3 py-2 text-xs text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
              >
                <Braces className="size-3.5" aria-hidden="true" />
                کد طرح (JSON)
              </button>
            </div>
          </div>
        </div>

        {/* live preview — a studio table, not a flat field */}
        <div className="studio-table relative order-1 flex flex-col overflow-hidden border border-line lg:order-none lg:col-span-7">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line bg-surface/60 px-5 py-4">
            <span className="flex items-center gap-2 text-xs text-ink-muted">
              <span className="size-1.5 rounded-full bg-gold" aria-hidden="true" />
              پیش‌نمایش زنده
            </span>
            <AudioPlayer trackType={config.audioTrack} trackTitle={trackName} accentColor={config.foilColor} />
          </div>

          <div className="relative flex-1 px-4 py-5 sm:px-8">
            <ThreeDEnvelope
              isOpen={isCardOpen}
              onOpen={() => setIsCardOpen(true)}
              openLabel="گشودن پاکت سفارشی"
              sealText={trimmedSeal}
              accent={config.foilColor}
              metal={config.metal}
              paper={config.envelopeBg}
            >
              {/* B12 (partial) — the sheet is the site's own paper language, not a
                  bespoke panel: `paper-sheet` is the head-light/foot-shade sheet the
                  real invitation is set on. */}
              <article className="paper-sheet relative border border-paper-line bg-paper p-8 text-center text-paper-ink sm:p-12">
                <span lang="en" className="latin text-xs text-paper-ink-muted">Your custom invitation</span>
                <h2
                  className="mt-4 font-display text-3xl font-medium"
                  style={{ color: `color-mix(in srgb, ${config.foilColor} 82%, var(--color-paper-ink))` }}
                >
                  {displayNames}
                </h2>

                {/* A5/A6 — the card used to carry a UI paragraph and two raw hex values
                    as if they were invitation copy. What stands here is what an
                    invitation carries: the hour and the place. */}
                {(trimmedDate || trimmedVenue) && (
                  <div className="mt-6 space-y-2 border-t border-paper-line pt-5 text-start text-xs">
                    {trimmedDate && (
                      <p className="flex items-start gap-2 text-paper-ink-muted">
                        <Calendar className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                        <span>{trimmedDate}</span>
                      </p>
                    )}
                    {trimmedVenue && (
                      <p className="flex items-start gap-2 text-paper-ink-muted">
                        <MapPin className="mt-px size-3.5 shrink-0" aria-hidden="true" />
                        <span>{trimmedVenue}</span>
                      </p>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setIsCardOpen(false)}
                  className="mt-7 border-b border-paper-gold pb-1 text-xs text-paper-gold-deep"
                >
                  بستن دوباره
                </button>
              </article>
            </ThreeDEnvelope>
          </div>

          {/* The running spec sheet: what this invitation is made of, right now.
              A20 — the names and the date get cells of their own, so every field
              the controls offer has live feedback while the envelope is shut. */}
          <dl className="relative grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-3">
            {[
              { k: 'رنگ پاکت', v: envelopeName, dot: config.envelopeBg },
              { k: 'رنگ متالیک', v: foilName, dot: config.foilColor },
              { k: 'متن مهر', v: sealLabel },
              { k: 'نام‌ها', v: displayNames },
              { k: 'تاریخ', v: trimmedDate || '—' },
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
                {/* A14 — `line-clamp` wraps instead of clipping, so a long track name
                    stops overflowing its cell at 320; `title` keeps the mouse case. */}
                <dd className="mt-1.5 line-clamp-2 font-display text-sm text-ink" title={spec.v}>
                  {spec.v}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* A10 — the write lives here so there is exactly one, on the debounced beat. */
function persist(plan) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plan));
  } catch {
    /* Private browsing or a full quota must never break the customizer. */
  }
}
