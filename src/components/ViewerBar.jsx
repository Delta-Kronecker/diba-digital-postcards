import React from 'react';
import { ArrowRight, Copy } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function ViewerBar({ onNavigate = () => {}, onCopy, copied = false, children }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="group inline-flex items-center gap-2 text-[11px] text-ink-muted transition-colors hover:text-ink"
        >
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          <span className="hidden sm:inline">بازگشت به آتلیه</span>
          <span className="sm:hidden">بازگشت</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('home')}
          className="font-display text-lg font-semibold text-ink"
          aria-label="دیبا، صفحه اصلی"
        >
          دیبا
        </button>

        <div className="flex items-center gap-2">
          {onCopy && (
            <button
              type="button"
              onClick={onCopy}
              className="inline-flex h-10 items-center gap-2 border border-line px-3 text-[11px] text-ink-muted transition-colors hover:border-line-strong hover:text-ink"
              title="کپی لینک اختصاصی"
            >
              <Copy className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">{copied ? 'کپی شد' : 'کپی لینک'}</span>
            </button>
          )}
          {children}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
