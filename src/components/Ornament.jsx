import React from 'react';

export default function Ornament({ className = '', color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M32 2c2.8 12.2 7.8 17.2 20 20-12.2 2.8-17.2 7.8-20 20-2.8-12.2-7.8-17.2-20-20 12.2-2.8 17.2-7.8 20-20Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M32 14c1.7 7.4 4.8 10.5 12.2 12.2C36.8 27.9 33.7 31 32 38.4c-1.7-7.4-4.8-10.5-12.2-12.2C27.2 24.5 30.3 21.4 32 14Z"
        fill="var(--color-canvas)"
        opacity="0.5"
      />
      <circle cx="32" cy="26" r="1.5" fill={color} />
    </svg>
  );
}
