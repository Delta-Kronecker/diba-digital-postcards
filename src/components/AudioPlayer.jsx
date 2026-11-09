import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Music, Volume2, VolumeX } from 'lucide-react';

const NOTE_SETS = {
  'synth-soothing': [220, 261.63, 293.66, 329.63, 261.63, 220, 196, 220],
  'synth-classical': [261.63, 329.63, 392.0, 523.25, 392.0, 329.63],
  'synth-modern': [293.66, 369.99, 440.0, 554.37, 440.0, 369.99],
  'synth-festive': [329.63, 392.0, 493.88, 587.33, 493.88, 392.0],
  'synth-happy': [392.0, 493.88, 587.33, 659.25, 587.33, 493.88],
  'synth-romantic': [261.63, 329.63, 392.0, 493.88, 440.0, 349.23, 392.0, 523.25],
};

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
        noteGain.gain.linearRampToValueAtTime(volume, ctx.currentTime + 0.22);
        noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
        osc.connect(noteGain);
        noteGain.connect(gainRef.current);
        osc.start();
        osc.stop(ctx.currentTime + duration);
      } catch {
        /* audio is a progressive enhancement */
      }
    },
    [trackType, volume]
  );

  const start = () => {
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
    setIsPlaying(true);
  };

  const stop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  useEffect(() => {
    try {
      window.localStorage.setItem('ponisha_audio_volume', String(volume));
    } catch {
      // Ignore storage failures; playback must keep working.
    }
    if (gainRef.current) gainRef.current.gain.value = volume;
  }, [volume]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch {
          /* noop */
        }
      }
    };
  }, []);

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
      className={`flex items-center gap-3 border ${line} px-3 py-2`}
      role="group"
      aria-label="پخش موسیقی"
    >
      <button
        type="button"
        onClick={() => (isPlaying ? stop() : start())}
        aria-pressed={isPlaying}
        aria-label={isPlaying ? 'قطع موسیقی' : 'پخش موسیقی'}
        title={isPlaying ? 'قطع موسیقی' : 'پخش موسیقی'}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border ${line} transition-colors ${
          isPlaying ? 'text-cream' : strong
        }`}
        style={isPlaying ? { backgroundColor: accentColor, borderColor: accentColor } : undefined}
      >
        {isPlaying ? <Volume2 className="h-3.5 w-3.5" aria-hidden="true" /> : <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />}
      </button>

      <div className="min-w-0">
        <p className={`flex items-center gap-1.5 truncate text-[10px] ${strong}`}>
          <Music className="h-3 w-3 shrink-0 opacity-60" aria-hidden="true" />
          {trackTitle}
        </p>
        <p className={`mt-0.5 text-[9px] ${muted}`} aria-live="polite">
          {isPlaying ? 'در حال پخش…' : 'برای شنیدن کلیک کنید'}
        </p>
      </div>

      <div ref={barsRef} className={`mr-1 hidden h-4 items-end gap-[2px] sm:flex ${isPlaying ? '' : 'opacity-40'}`} aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-full w-[2px] origin-bottom rounded-full transition-transform duration-200"
            style={{ backgroundColor: accentColor, transform: 'scaleY(0.3)' }}
          />
        ))}
      </div>

      <label className="sr-only" htmlFor="audio-volume">
        بلندی صدا
      </label>
      <input
        id="audio-volume"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
        className="audio-range hidden w-14 md:block"
      />
    </div>
  );
}
