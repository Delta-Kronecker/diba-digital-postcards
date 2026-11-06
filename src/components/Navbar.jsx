import React, { useState } from 'react';
import { Sparkles, Sliders, Layers, Heart, Moon, Home, Menu, X, ArrowLeft } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export default function Navbar({ currentRoute = 'home', onNavigate = () => {} }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'صفحه اصلی', icon: Home },
    { id: 'wedding-amir-sara', label: 'دعوت‌نامه عروسی', icon: Heart },
    { id: 'memorial-haj-reza', label: 'دعوت‌نامه ترحیم', icon: Moon },
    { id: 'customizer', label: 'استودیو شخصی‌سازی', icon: Sliders },
    { id: 'gallery', label: 'نمایشگاه نمونه‌ها', icon: Layers },
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--color-canvas)]/90 dark:bg-[#121212]/90 backdrop-blur-md border-b border-amber-900/10 dark:border-stone-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <button
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 group text-right focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gold-foil p-0.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#25231F] rounded-[10px] flex items-center justify-center text-amber-300">
              <Sparkles className="w-5 h-5 text-gold-foil" />
            </div>
          </div>
          <div>
            <span className="text-xl font-bold font-estedad tracking-tight text-stone-900 block group-hover:text-amber-800 transition-colors">
              دیبا
            </span>
            <span className="text-[10px] uppercase tracking-widest text-stone-500 font-vazir block">
              Digital Postcards & Invitations
            </span>
          </div>
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 font-vazir text-sm font-medium text-stone-700">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 ${
                  isActive
                    ? 'bg-amber-900/10 text-amber-900 font-semibold shadow-inner'
                    : 'hover:bg-stone-200/60 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-700' : 'text-stone-500'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Primary CTA & Theme Toggle */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => handleNavClick('customizer')}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-vazir font-semibold text-stone-900 dark:text-stone-900 bg-gold-foil shadow-md hover:brightness-105 active:scale-95 transition-all"
          >
            شخصی‌سازی زنده
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Menu & Theme Toggle */}
        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-stone-700 dark:text-stone-200 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors"
            aria-label="منو"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F6F1E9] border-b border-stone-300 px-6 py-6 space-y-3 animate-in slide-in-from-top-4 duration-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl text-right font-vazir text-sm ${
                  isActive ? 'bg-amber-900/10 text-amber-900 font-bold' : 'text-stone-800 hover:bg-stone-200/50'
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-amber-700" />
                  {item.label}
                </span>
              </button>
            );
          })}
          
          <div className="pt-4 border-t border-stone-300">
            <button
              onClick={() => handleNavClick('customizer')}
              className="w-full py-3 rounded-xl bg-gold-foil text-stone-900 font-vazir font-bold text-xs shadow-md text-center"
            >
              طراحی و شخصی‌سازی کارت جدید
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
