import React, { useState, useEffect, Suspense, lazy } from 'react';
import ErrorBoundary from './components/ErrorBoundary';
const HomePage = lazy(() => import('./pages/HomePage'));
const WeddingViewer = lazy(() => import('./pages/WeddingViewer'));
const MemorialViewer = lazy(() => import('./pages/MemorialViewer'));
const CategoryViewer = lazy(() => import('./pages/CategoryViewer'));
const CustomizerPage = lazy(() => import('./pages/CustomizerPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function PageFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center" aria-busy="true" aria-live="polite">
      <span className="h-9 w-9 animate-spin rounded-full border border-line border-t-gold" />
    </div>
  );
}

const TITLES = {
  home: 'دیبا | آتلیهٔ دعوت دیجیتال',
  'wedding-amir-sara': 'دعوت‌نامهٔ عروسی امیرحسین و سارا | دیبا',
  'memorial-haj-reza': 'یادبود حاج رضا تهرانی | دیبا',
  'general-gallery-opening': 'گشایش گالری آرک | دیبا',
  'opening-tech-hub': 'افتتاحیهٔ هاب فناوری آفتاب | دیبا',
  'festival-nowruz-1404': 'نوروز ۱۴۰۴ | دیبا',
  'birthday-aria-10': 'تولد آریا | دیبا',
  customizer: 'استودیو طراحی | دیبا',
  gallery: 'نمایشگاه نمونه‌ها | دیبا',
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) return hash;
    const path = window.location.pathname;
    if (path.includes('/invite/wedding')) return 'wedding-amir-sara';
    if (path.includes('/invite/memorial')) return 'memorial-haj-reza';
    if (path.includes('/invite/general')) return 'general-gallery-opening';
    if (path.includes('/invite/opening')) return 'opening-tech-hub';
    if (path.includes('/invite/festival')) return 'festival-nowruz-1404';
    if (path.includes('/invite/birthday')) return 'birthday-aria-10';
    return 'home';
  });

  const navigateTo = (routeId) => {
    setCurrentRoute(routeId);
    window.location.hash = routeId;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    window.setTimeout(() => {
      const main = document.getElementById('root');
      if (main) main.focus({ preventScroll: true });
    }, 120);
  };

  useEffect(() => {
    let saved = null;
    try {
      saved = window.localStorage.getItem('theme');
    } catch {
      saved = null;
    }
    const isDark = saved === 'dark';
    document.documentElement.classList.toggle('dark', isDark);
    document.documentElement.classList.toggle('light', !isDark);
  }, []);

  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      setCurrentRoute(hash || 'home');
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  useEffect(() => {
    document.title = TITLES[currentRoute] || TITLES.home;
    const description =
      'دیبا، آتلیهٔ دعوت دیجیتال؛ کارت‌پستال و دعوت‌نامه‌های فاخر با انیمیشن سه‌بعدی، مهر موم، موسیقی اختصاصی و ثبت حضور آنلاین.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname + '#' + currentRoute;
  }, [currentRoute]);

  const renderView = () => {
    switch (currentRoute) {
      case 'wedding-amir-sara':
      case 'wedding':
        return <WeddingViewer onNavigate={navigateTo} />;
      case 'memorial-haj-reza':
      case 'memorial':
        return <MemorialViewer onNavigate={navigateTo} />;
      case 'general-gallery-opening':
      case 'general':
      case 'opening-tech-hub':
      case 'opening':
      case 'festival-nowruz-1404':
      case 'festival':
      case 'birthday-aria-10':
      case 'birthday':
        return <CategoryViewer slug={currentRoute} onNavigate={navigateTo} />;
      case 'customizer':
        return <CustomizerPage currentRoute={currentRoute} onNavigate={navigateTo} />;
      case 'gallery':
      case 'categories':
      case 'home':
        return <HomePage currentRoute={currentRoute} onNavigate={navigateTo} />;
      default:
        return <NotFoundPage onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-canvas text-ink transition-colors duration-300">
      <a
        href="#main-content"
        className="fixed -left-[9999px] top-4 z-[80] rounded-sm bg-ink px-4 py-2 text-xs font-medium text-canvas focus:left-4 focus:outline-none"
      >
        پرش به محتوای اصلی
      </a>
      <ErrorBoundary onReset={() => navigateTo('home')}>
        <Suspense fallback={<PageFallback />}>
          <div id="main-content" tabindex="-1">{renderView()}</div>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
