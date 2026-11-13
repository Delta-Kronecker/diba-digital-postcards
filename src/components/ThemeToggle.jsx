import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

/**
 * Applies a theme instantly, with transitions suppressed for the swap. Without
 * this every colour transition on the page fires at once and the switch smears.
 * The override is in the document while the new theme commits, then removed
 * after the next paint.
 */
function commitTheme(dark) {
  const style = document.createElement('style');
  style.appendChild(
    document.createTextNode('*,*::before,*::after{transition:none !important}'),
  );
  document.head.append(style);

  const root = document.documentElement;
  root.classList.toggle('dark', dark);
  root.classList.toggle('light', !dark);
  root.dataset.theme = dark ? 'dark' : 'light';

  // The status bar / browser chrome tracks the page canvas, not the OS scheme.
  const themeColor = dark ? '#131110' : '#f1ebe0';
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.setAttribute('content', themeColor);
  });

  void document.body.offsetHeight; // force a synchronous style flush
  requestAnimationFrame(() => requestAnimationFrame(() => style.remove()));
}

export default function ThemeToggle({ className = '' }) {
  const [isDark, setIsDark] = useState(() => {
    try {
      return window.localStorage.getItem('theme') === 'dark';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem('theme', isDark ? 'dark' : 'light');
    } catch {
      // Storage can be unavailable in private mode; the class still applies.
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => {
        const next = !isDark;
        commitTheme(next);
        setIsDark(next);
      }}
      aria-pressed={isDark}
      aria-label={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
      title={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
      className={`relative inline-flex size-10 items-center justify-center border border-line text-ink-muted transition-colors duration-base after:absolute after:-inset-[3px] after:content-[''] hover:border-line-strong hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 ${className}`}
    >
      {/* One control, two glyphs, stacked. The swap used to replace the icon node
          outright, so the button's contents blinked; both stay mounted and only
          their opacity moves — a crossfade with no layout, and the opacity tier
          the reduced-motion policy keeps. */}
      <span className="relative size-4" aria-hidden="true">
        <Sun
          className={`absolute inset-0 size-4 transition-opacity duration-base ${
            isDark ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <Moon
          className={`absolute inset-0 size-4 transition-opacity duration-base ${
            isDark ? 'opacity-0' : 'opacity-100'
          }`}
        />
      </span>
    </button>
  );
}
