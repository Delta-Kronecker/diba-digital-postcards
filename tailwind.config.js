/** @type {import('tailwindcss').Config} */
const opacityScale = Object.fromEntries(
  Array.from({ length: 101 }, (_, i) => [String(i), String(i / 100)])
);

const token = (name) => `rgb(var(--color-${name}-rgb) / <alpha-value>)`;

export default {
  darkMode: 'class',
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
        },
        olive: token('olive'),
        rose: token('rose'),
        cream: token('cream'),
        danger: '#B4462F',
        success: '#3E6B4F',
      },
      fontFamily: {
        display: ['Estedad', 'Vazirmatn', 'sans-serif'],
        body: ['Vazirmatn', 'Estedad', 'sans-serif'],
        latin: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Vazirmatn', 'Estedad', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1.7' }],
        xs: ['0.75rem', { lineHeight: '1.75' }],
        sm: ['0.875rem', { lineHeight: '1.85' }],
        base: ['1rem', { lineHeight: '1.9' }],
        lg: ['1.125rem', { lineHeight: '1.85' }],
        xl: ['1.25rem', { lineHeight: '1.7' }],
        '2xl': ['1.5rem', { lineHeight: '1.55' }],
        '3xl': ['1.875rem', { lineHeight: '1.4' }],
        '4xl': ['2.35rem', { lineHeight: '1.3' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.12' }],
        '7xl': ['4.75rem', { lineHeight: '1.05' }],
        '8xl': ['6rem', { lineHeight: '1' }],
      },
      letterSpacing: {
        tightest: '-0.02em',
        tighter: '-0.015em',
        tight: '-0.01em',
        normal: '0',
        wide: '0.04em',
        wider: '0.08em',
        widest: '0.16em',
        mega: '0.3em',
      },
      borderRadius: {
        card: '2px',
        panel: '4px',
        modal: '6px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(25,22,18,0.04), 0 12px 32px -18px rgba(25,22,18,0.28)',
        lift: '0 24px 60px -28px rgba(25,22,18,0.45)',
        envelope: '0 40px 90px -40px rgba(25,22,18,0.55), 0 2px 0 rgba(255,255,255,0.35) inset',
      },
      transitionDuration: {
        fast: '140ms',
        base: '240ms',
        slow: '420ms',
        cinematic: '900ms',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
        'ui-out': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'in-out-soft': 'cubic-bezier(0.77, 0, 0.175, 1)',
      },
      opacity: opacityScale,
      zIndex: {
        base: '0',
        sticky: '40',
        overlay: '50',
        modal: '60',
        toast: '70',
        tooltip: '80',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
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
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        marquee: 'marquee 38s linear infinite',
        'reveal-up': 'revealUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fadeIn 0.6s ease both',
        'float-soft': 'floatSoft 8s ease-in-out infinite',
        'spin-slow': 'spinSlow 26s linear infinite',
      },
    },
  },
  plugins: [],
}
