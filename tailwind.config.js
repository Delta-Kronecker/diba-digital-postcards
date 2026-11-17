/** @type {import('tailwindcss').Config} */
const opacityScale = Object.fromEntries(
  Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)])
);

const token = (name) => `rgb(var(--color-${name}-rgb) / <alpha-value>)`;

export default {
  darkMode: 'class',
  // Tailwind 3 emits `hover:` unconditionally, so on touch the state latches
  // after a tap and reads as stuck. This wraps every hover style (and its
  // group-/peer- variants) in `@media (hover: hover) and (pointer: fine)`.
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: {
          DEFAULT: token('surface'),
          2: token('surface-2'),
        },
        ink: {
          DEFAULT: token('ink'),
          muted: token('ink-muted'),
          subtle: token('ink-subtle'),
          band: token('ink-band'),
        },
        line: {
          DEFAULT: 'var(--color-line)',
          strong: 'var(--color-line-strong)',
        },
        gold: {
          DEFAULT: token('gold'),
          soft: token('gold-soft'),
          deep: token('gold-deep'),
          solid: token('gold-solid'),
        },
        sage: token('sage'),
        'sage-solid': token('sage-solid'),
        rose: token('rose'),
        cream: token('cream'),
        scrim: token('scrim'),
        'scrim-deep': token('scrim-deep'),
        paper: {
          DEFAULT: token('paper'),
          line: token('paper-line'),
          'line-2': token('paper-line-2'),
          'line-3': token('paper-line-3'),
          cream: token('paper-cream'),
          ink: token('paper-ink'),
          'ink-warm': token('paper-ink-warm'),
          'ink-muted': token('paper-ink-muted'),
          'ink-subtle': token('paper-ink-subtle'),
          gold: token('paper-gold'),
          'gold-deep': token('paper-gold-deep'),
        },
        seal: {
          line: token('seal-line'),
          cream: token('seal-cream'),
          ink: token('seal-ink'),
        },
        danger: token('danger'),
        'danger-on-ink': token('danger-on-ink'),
        success: token('success'),
      },
      fontFamily: {
        display: ['Estedad', 'Vazirmatn', 'sans-serif'],
        body: ['Vazirmatn', 'Estedad', 'sans-serif'],
        latin: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Vazirmatn', 'Estedad', 'sans-serif'],
      },
      /* The Persian floor. The previous scale bottomed out at 12px for `xs`,
         which is a Latin size applied to a joined script with deeper
         ascenders: most of the page's prose, every caption and every meta line
         was set there, so five different kinds of information all spoke at the
         same volume. `xs` is now 13px (the floor, used only for folios and
         meta) and `base` is 17px, which is the Persian body size. Line-heights
         are unchanged — all already at or above the script's 1.7 minimum. */
      fontSize: {
        xs: ['0.8125rem', { lineHeight: '1.75' }],
        sm: ['0.9375rem', { lineHeight: '1.85' }],
        base: ['1.0625rem', { lineHeight: '1.9' }],
        lg: ['1.1875rem', { lineHeight: '1.85' }],
        xl: ['1.3125rem', { lineHeight: '1.7' }],
        '2xl': ['1.5rem', { lineHeight: '1.55' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '4xl': ['2.35rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.12' }],
        '7xl': ['4.75rem', { lineHeight: '1.05' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      /* Two steps, the heading band. Every key here is reachable from a heading
         class; body and UI text stay at the inherited `normal`. */
      letterSpacing: {
        tight: '-0.01em',
        tightest: '-0.02em',
      },
      borderRadius: {
        card: '2px',
        panel: '4px',
        modal: '6px',
      },
      boxShadow: {
        seal: '0 18px 30px -14px rgba(60, 46, 26, 0.7)',
        photo: '0 40px 120px -40px rgba(0, 0, 0, 0.9)',
        'seal-lg': '0 18px 35px -18px rgba(0, 0, 0, 0.65)',
        soft: '0 1px 2px rgba(25,22,18,0.04), 0 12px 32px -18px rgba(25,22,18,0.28)',
        lift: '0 24px 60px -28px rgba(25,22,18,0.45)',
        envelope: '0 40px 90px -40px rgba(25,22,18,0.55), 0 2px 0 rgba(255,255,255,0.35) inset',
      },
      transitionDuration: {
        DEFAULT: 'var(--duration-ui)',
        fast: 'var(--duration-fast)',
        base: 'var(--duration-base)',
        slow: 'var(--duration-slow)',
        slower: 'var(--duration-slower)',
        cinematic: 'var(--duration-cinematic)',
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)',
        'ui-out': 'var(--ease-ui-out)',
      },
      opacity: opacityScale,
      zIndex: {
        base: 'var(--z-base)',
        sticky: 'var(--z-sticky)',
        overlay: 'var(--z-overlay)',
        modal: 'var(--z-modal)',
        toast: 'var(--z-toast)',
        tooltip: 'var(--z-tooltip)',
      },
      keyframes: {
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        floatSoft: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(-0.6deg)' },
        },
        sheen: {
          '0%': { transform: 'translateX(-140%) skewX(-14deg)' },
          '100%': { transform: 'translateX(160%) skewX(-14deg)' },
        },
        digitRoll: {
          '0%': { transform: 'translateY(-62%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'reveal-up': 'revealUp 0.9s var(--ease-out-expo) both',
        'fade-in': 'fadeIn 0.5s var(--ease-ui-out) both',
        'float-soft': 'floatSoft 8s ease-in-out infinite',
        sheen: 'sheen 1.9s var(--ease-out-expo) 0.5s both',
        /* The countdown's tick — the one place a changing number is an event.
           140ms, `translateY` only, so the digit stays legible on every frame
           and can never be stranded off-screen by the reduced-motion clamp. */
        'digit-roll': 'digitRoll 140ms var(--ease-ui-out) both',
      },
    },
  },
  plugins: [],
}
