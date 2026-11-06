import React, { useState, useEffect } from 'react';
import HomePage from './pages/HomePage';
import WeddingViewer from './pages/WeddingViewer';
import MemorialViewer from './pages/MemorialViewer';
import CategoryViewer from './pages/CategoryViewer';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    // Read initial route from URL hash or pathname
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
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash) {
        setCurrentRoute(hash);
      } else {
        setCurrentRoute('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Render view based on route
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
      case 'gallery':
      case 'categories':
      case 'home':
      default:
        return <HomePage currentRoute={currentRoute} onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F6F1E9]">
      {renderView()}
    </div>
  );
}
