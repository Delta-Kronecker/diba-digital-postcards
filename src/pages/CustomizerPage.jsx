import React from 'react';
import Navbar from '../components/Navbar';
import DemoCustomizer from '../components/DemoCustomizer';
import Footer from '../components/Footer';

export default function CustomizerPage({ currentRoute = 'customizer', onNavigate = () => {} }) {
  return (
    <div className="flex min-h-dvh flex-col bg-canvas font-body text-ink">
      <Navbar currentRoute={currentRoute} onNavigate={onNavigate} />
      <div className="flex-1 py-12 md:py-20">
        <DemoCustomizer />
      </div>
      <Footer onNavigate={onNavigate} />
    </div>
  );
}
