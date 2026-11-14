import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Play, Square } from 'lucide-react';
import { toPersianDigits } from '../utils/numbers';

const NOTE_SETS = {
  'synth-soothing': [220, 261.63, 293.66, 329.63, 261.63, 220, 196, 220],
  'synth-classical': [261.63, 329.63, 392.0, 523.25, 392.0, 329.63],
  'synth-modern': [293.66, 369.99, 440.0, 554.37, 440.0, 369.99],
  'synth-festive': [329.63, 392.0, 493.88, 587.33, 493.88, 392.0],
  'synth-happy': [392.0, 493.88, 587.33, 659.25, 587.33, 493.88],
  'synth-romantic': [261.63, 329.63, 392.0, 493.88, 440.0, 349.23, 392.0, 523.25],
};

/** A press feedback window short enough to read as "off", long enough not to click. */
const RELEASE_S = 0.06;

export default function AudioPlayer({
  trackType = 'synth-romantic',
  trackTitle = 'موسیقی ملایم اختصاصی',
  accentColor = 'var(--color-gold)',
  onDark = false,
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(() => {
    try {
      const saved = window.localStorage.getItem('ponisha_audio_volume');
      const parsed = saved ? Number(saved) : NaN;
      return Number.isFinite(parsed) && parsed >= 0 && parsed <= 1 ? parsed : 0.12;
    } catch {
      return 0.12;
    }
  });

  const audioCtxRef = useRef(null);
  const gainRef = useRef(null);
  const analyserRef = useRef(null);
  const timerRef = useRef(null);
  const rafRef = useRef(null);
  const barsRef = useRef(null);
  /* The melody and the volume are read at the moment a note is scheduled, not
     closed over at start, so switching either while it plays takes effect at
     once (see the `begin` effect below). */
  const volumeRef = useRef(volume);
  const playingRef = useRef(false);
  /* Every voice still sounding, so `stop` can end the note that is already in
     the air instead of letting it run out its full tail. */
  const voicesRef = useRef([]);

  const ensureContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
        gainRef.current = audioCtxRef.current.createGain();
        gainRef.current.gain.value = volume;
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 32;
        gainRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      }
    }
    if (audioCtxRef.current?.state === 'suspended') audioCtxRef.current.resume();
    return audioCtxRef.current;
  };

  const playNote = useCallback(
    (freq, duration = 1.3) => {
      const ctx = audioCtxRef.current;
      if (!ctx || !gainRef.current) return;
      try {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = trackType === 'synth-soothing' ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        noteGain.gain.setValueAtTime(0.001, ctx.currentTime);
        noteGain.gain.linearRampToValueAtTime(volumeRef.current, ctx.currentTime + 0.22);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(noteGain);
        noteGain.connect(gainRef.current);
        osc.start();
        osc.stop(ctx.currentTime + duration);
        const voice = { osc, gain: noteGain };
        voicesRef.current.push(voice);
        osc.onended = () => {
          voicesRef.current = voicesRef.current.filter((v) => v !== voice);
        };
      } catch {
        /* audio is a progressive enhancement */
      }
    },
    [trackType]
  );

  /* End whatever is sounding now, over one short release, so the stop answers
     the click instead of trailing a 1.3 s note. */
  const silence = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (ctx) {
      const t = ctx.currentTime;
      const voices = voicesRef.current;
      voicesRef.current = [];
      for (const voice of voices) {
        try {
          const gain = voice.gain.gain;
          gain.cancelScheduledValues(t);
          gain.setValueAtTime(Math.max(gain.value, 0.0001), t);
          gain.linearRampToValueAtTime(0.0001, t + RELEASE_S);
          voice.osc.stop(t + RELEASE_S + 0.02);
        } catch {
          /* an already-stopped voice is fine */
        }
      }
    }
  }, []);

  const begin = useCallback(() => {
    const ctx = ensureContext();
    if (!ctx) return;
    const notes = NOTE_SETS[trackType] || NOTE_SETS['synth-romantic'];
    let step = 0;
    if (timerRef.current) clearInterval(timerRef.current);
    playNote(notes[0]);
    timerRef.current = setInterval(() => {
      step = (step + 1) % notes.length;
      playNote(notes[step]);
    }, 760);
    playingRef.current = true;
    setIsPlaying(true);
  }, [playNote, trackType]);

  const stop = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    silence();
    playingRef.current = false;
    setIsPlaying(false);
  }, [silence]);

  const toggle = () => (playingRef.current ? stop() : begin());

  useEffect(() => {
    volumeRef.current = volume;
    try {
      window.localStorage.setItem('ponisha_audio_volume', String(volume));
    } catch {
      // Ignore storage failures; playback must keep working.
    }
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  /* Switching the piece while it plays swaps the melody for the new one, rather
     than keeping the old sequence until the next stop/start. `begin` only
     changes identity when `trackType` does, so a volume drag never re-triggers it. */
  useEffect(() => {
    if (!playingRef.current) return;
    begin();
  }, [begin]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      silence();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {
          /* noop */
        }
      }
    };
  }, [silence]);

  useEffect(() => {
    if (!isPlaying || !analyserRef.current || !barsRef.current) return;
    const analyser = analyserRef.current;
    const data = new Uint8Array(analyser.frequencyBinCount);
    const tick = () => {
      analyser.getByteFrequencyData(data);
      const bars = barsRef.current?.querySelectorAll('span');
      if (bars) {
        bars.forEach((bar, i) => {
          const v = data[i % data.length] / 255;
          bar.style.transform = `scaleY(${Math.max(0.18, v)})`;
        });
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isPlaying]);

  const muted = onDark ? 'text-cream/65' : 'text-ink-subtle';
  const strong = onDark ? 'text-cream' : 'text-ink';
  const line = onDark ? 'border-cream/20' : 'border-line';

  return (
    <div
      className={`flex min-w-0 items-center gap-3 border ${line} px-3 py-2`}
      role="group"
      aria-label="پخش موسیقی"
    >
      {/* A play control, not a mute control: the icon shows the action the press
          performs, so the stopped state is a `Play` and not a crossed-out speaker. */}
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? 'قطع موسیقی' : 'پخش موسیقی'}
        title={isPlaying ? 'قطع موسیقی' : 'پخش موسیقی'}
        className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-full border sm:min-h-8 sm:min-w-8 ${line} transition-colors ${
          isPlaying ? 'text-cream' : strong
        }`}
        style={isPlaying ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
      >
        {isPlaying ? (
          <Square className="size-3.5" fill="currentColor" aria-hidden="true" />
        ) : (
          <Play className="size-3.5" fill="currentColor" aria-hidden="true" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <p className={`flex min-w-0 items-center gap-1.5 text-xs ${strong}`}>
          <Music className="size-3 shrink-0 opacity-60" aria-hidden="true" />
          <span className="truncate">{trackTitle}</span>
        </p>
        <p className={`mt-0.5 text-xs ${muted}`} aria-live="polite">
          {isPlaying ? 'در حال پخش...' : 'برای شنیدن کلیک کنید'}
        </p>
      </div>

      <div ref={barsRef} className={`ms-1 hidden h-4 items-end gap-[2px] sm:flex ${isPlaying ? '' : 'opacity-40'}`} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-full w-[2px] origin-bottom rounded-full transition-transform duration-fast"
            style={{ backgroundColor: accentColor, transform: 'scaleY(0.3)' }}
          />
        ))}
      </div>

      <label className="sr-only" htmlFor="audio-volume">
        بلندی صدا
      </label>
      {/* The slider is the app's own gain, not the device volume, so it is offered
          wherever the player is — not only above `md`, where a phone could reach
          neither. The value is spoken as a percentage. */}
      <input
        id="audio-volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        aria-valuetext={`${toPersianDigits(Math.round(volume * 100))} درصد`}
        className="audio-range w-12 shrink-0 sm:w-14"
      />
    </div>
  );
}
