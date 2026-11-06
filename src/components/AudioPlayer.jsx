import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Music } from 'lucide-react';

export default function AudioPlayer({ trackType = 'synth-romantic', trackTitle = 'موسیقی ملایم اختصاصی', accentColor = '#B49A70' }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef(null);
  const timerRef = useRef(null);

  // Synth notes mapping based on mood
  const getNotes = () => {
    switch (trackType) {
      case 'synth-soothing': // Memorial - slow minor ambient
        return [220, 261.63, 293.66, 329.63, 261.63, 220, 196, 220];
      case 'synth-classical': // General - calm classical triad
        return [261.63, 329.63, 392.00, 523.25, 392.00, 329.63];
      case 'synth-modern': // Opening - elegant pentatonic
        return [293.66, 369.99, 440.00, 554.37, 440.00, 369.99];
      case 'synth-festive': // Festival - bright major
        return [329.63, 392.00, 493.88, 587.33, 493.88, 392.00];
      case 'synth-happy': // Birthday - cheerful arpeggio
        return [392.00, 493.88, 587.33, 659.25, 587.33, 493.88];
      case 'synth-romantic':
      default: // Wedding - romantic warm major 7th chord cycle
        return [261.63, 329.63, 392.00, 493.88, 440.00, 349.23, 392.00, 523.25];
    }
  };

  const playSynthNote = (freq, duration = 1.2) => {
    if (!audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = trackType === 'synth-soothing' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio playback notice:', e);
    }
  };

  const startLoop = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    const notes = getNotes();
    let step = 0;

    if (timerRef.current) clearInterval(timerRef.current);
    
    // Play initial note
    playSynthNote(notes[0]);

    timerRef.current = setInterval(() => {
      step = (step + 1) % notes.length;
      playSynthNote(notes[step]);
    }, 700);

    setIsPlaying(true);
  };

  const stopLoop = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggleMusic = () => {
    if (isPlaying) {
      stopLoop();
    } else {
      startLoop();
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="flex items-center gap-3 bg-stone-900/40 backdrop-blur-md px-4 py-2 rounded-full border border-amber-900/20 text-xs font-vazir text-stone-200 shadow-lg transition-all duration-300 hover:border-amber-500/40">
      <button
        onClick={toggleMusic}
        className="p-2 rounded-full transition-transform active:scale-95 flex items-center justify-center"
        style={{ backgroundColor: isPlaying ? accentColor : '#333', color: isPlaying ? '#25231F' : '#FFF' }}
        title={isPlaying ? 'قطع موسیقی' : 'پخش موسیقی ملایم'}
        aria-label="پخش موسیقی"
      >
        {isPlaying ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
      </button>

      <div className="flex flex-col">
        <span className="font-medium text-[11px] tracking-wide text-stone-300 flex items-center gap-1.5">
          <Music className="w-3 h-3 opacity-70" />
          {trackTitle}
        </span>
        <span className="text-[10px] text-stone-400">
          {isPlaying ? 'در حال پخش آنلاین...' : 'جهت شنیدن صدای کارت کلیک کنید'}
        </span>
      </div>

      {/* Animated Visualizer Bars */}
      {isPlaying && (
        <div className="flex items-end gap-0.5 h-3.5 mr-2">
          <span className="w-0.5 bg-amber-400 animate-pulse h-full rounded-full" style={{ animationDelay: '0ms' }} />
          <span className="w-0.5 bg-amber-300 animate-pulse h-2/3 rounded-full" style={{ animationDelay: '150ms' }} />
          <span className="w-0.5 bg-amber-400 animate-pulse h-5/6 rounded-full" style={{ animationDelay: '300ms' }} />
          <span className="w-0.5 bg-amber-200 animate-pulse h-1/2 rounded-full" style={{ animationDelay: '450ms' }} />
        </div>
      )}
    </div>
  );
}
