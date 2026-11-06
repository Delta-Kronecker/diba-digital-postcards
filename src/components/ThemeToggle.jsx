import React, { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return true; // DEFAULT TO DARK
  });

  useEffect(() => {
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="relative p-2.5 rounded-xl bg-stone-200/80 dark:bg-stone-800 text-stone-700 dark:text-amber-300 hover:bg-stone-300 dark:hover:bg-stone-700 transition-all duration-300 shadow-sm flex items-center justify-center group"
      aria-label="تغییر تم (تاریک / روشن)"
      title={isDark ? 'تغییر به حالت روشن' : 'تغییر به حالت تاریک'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-90 transition-transform duration-500" />
      ) : (
        <Moon className="w-4 h-4 text-stone-700 group-hover:-rotate-12 transition-transform duration-500" />
      )}
    </button>
  );
}
