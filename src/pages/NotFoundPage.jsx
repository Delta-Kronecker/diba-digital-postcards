import React from 'react';
import { ArrowUpLeft } from 'lucide-react';
import Ornament from '../components/Ornament';

export default function NotFoundPage({ onNavigate = () => {} }) {
  return (
    <div className="paper-grain flex min-h-screen flex-col items-center justify-center bg-canvas px-6 text-center">
      <Ornament className="h-6 w-6 text-gold" />
      <p className="latin mt-6 text-[10px] tracking-[0.3em] text-ink-subtle">Page not found</p>
      <p className="mt-4 font-display text-[clamp(5rem,18vw,10rem)] font-medium leading-none text-ink">
        ۴۰۴
      </p>
      <div className="mx-auto mt-6 h-px w-14 bg-gold" />
      <h1 className="mt-6 font-display text-2xl font-medium text-ink">این صفحه در دفتر ما نیست.</h1>
      <p className="mx-auto mt-3 max-w-sm text-xs leading-[2] text-ink-muted">
        شاید نشانی تغییر کرده یا کارت موردنظر هنوز ساخته نشده است. از آتلیه
        دیدن کنید و نمونه‌ها را ببینید.
      </p>

      <div className="mt-8 flex items-center gap-6">
        <button type="button" onClick={() => onNavigate('home')} className="btn btn-ink">
          بازگشت به آتلیه
          <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button type="button" onClick={() => onNavigate('gallery')} className="link-underline">
          دیدن نمونه‌ها
        </button>
      </div>
    </div>
  );
}
