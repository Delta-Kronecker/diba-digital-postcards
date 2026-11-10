import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpLeft, Menu, X } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import useScrollLock from '../hooks/useScrollLock';

const NAV_ITEMS = [
  { id: 'home', label: 'خانه' },
  { id: 'wedding-amir-sara', label: 'عروسی' },
  { id: 'memorial-haj-reza', label: 'یادبود' },
  { id: 'gallery', label: 'گالری' },
  { id: 'customizer', label: 'استودیو' },
];

export default function Navbar({ currentRoute = 'home', onNavigate = () => {} }) {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef(null);
  const toggleRef = useRef(null);

  useScrollLock(open);

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  useEffect(() => {
    if (!open) return;
    const drawer = drawerRef.current;
    const focusables = () =>
      Array.from(
        drawer?.querySelectorAll(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) || []
      ).filter((el) => el.offsetParent !== null);

    const t = window.setTimeout(() => focusables()[0]?.focus(), 60);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-sticky border-b border-line bg-canvas/88 backdrop-blur-xl">
        <div className="shell flex h-[76px] items-center justify-between gap-6">
          <button
            type="button"
            onClick={() => go('home')}
            aria-label="دیبا، صفحه اصلی"
            className="group flex items-center gap-3 text-start"
          >
            <span className="flex h-10 w-10 items-center justify-center border border-gold/50 bg-surface">
              <span className="font-display text-lg leading-none text-gold-deep">د</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-[1.35rem] font-semibold text-ink transition-colors group-hover:text-gold-deep">
                دیبا
              </span>
              <span lang="en" className="latin mt-1 text-xs text-ink-subtle">
                Diba Atelier
              </span>
            </span>
          </button>

          <nav aria-label="مسیرهای اصلی" className="hidden items-center gap-8 lg:flex">
            {NAV_ITEMS.map((item) => {
              const active = currentRoute === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => go(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`group relative py-2 font-body text-sm transition-colors duration-base ${
                    active ? 'text-ink' : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {item.label}
                  <span
                    className={`absolute bottom-0 start-0 h-px origin-right scale-x-0 bg-gold transition-transform duration-slow ${
                      active ? 'scale-x-100' : 'group-hover:scale-x-100'
                    }`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => go('customizer')}
              className="btn btn-ink hidden !px-6 !py-3 text-xs sm:inline-flex"
            >
              شروع طراحی
              <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
            </button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setOpen(true)}
              aria-label="گشودن منو"
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line text-ink transition-colors hover:border-line-strong lg:hidden"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="منوی اصلی"
          className="fixed inset-0 z-modal flex flex-col bg-canvas lg:hidden"
        >
          <div className="shell flex h-[76px] shrink-0 items-center justify-between border-b border-line">
            <span className="font-display text-2xl font-semibold text-ink">دیبا</span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  toggleRef.current?.focus();
                }}
                aria-label="بستن منو"
                className="inline-flex min-h-11 min-w-11 items-center justify-center border border-line text-ink"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <nav aria-label="مسیرهای موبایل" className="shell flex-1 overflow-y-auto py-10">
            <ul>
              {NAV_ITEMS.map((item) => {
                const active = currentRoute === item.id;
                return (
                  <li key={item.id} className="border-b border-line">
                    <button
                      type="button"
                      onClick={() => go(item.id)}
                      aria-current={active ? 'page' : undefined}
                      className="group flex w-full items-baseline justify-between py-6 text-start"
                    >
                      <span
                          className={`font-display text-3xl transition-colors ${
                            active ? 'text-gold-deep' : 'text-ink group-hover:text-gold-deep'
                          }`}
                        >
                          {item.label}
                      </span>
                      <ArrowUpLeft
                        className="h-5 w-5 text-ink-subtle transition-transform duration-base group-hover:-translate-x-1 group-hover:-translate-y-1"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                );
              })}
            </ul>

            <div className="mt-10 space-y-4">
              <button type="button" onClick={() => go('customizer')} className="btn btn-ink w-full">
                شروع طراحی اختصاصی
                <ArrowUpLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <p className="text-center text-xs text-ink-subtle">
                تهران، خیابان فرشته، شنبه تا پنجشنبه، ۱۰ تا ۱۹
              </p>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
