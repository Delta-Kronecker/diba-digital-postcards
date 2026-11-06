import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ targetDate = '2025-09-19T19:00:00', accentColor = '#B49A70', hasGold = true }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTime = () => {
      const difference = +new Date(targetDate) - +new Date();
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const timeUnits = [
    { label: 'روز', value: timeLeft.days },
    { label: 'ساعت', value: timeLeft.hours },
    { label: 'دقیقه', value: timeLeft.minutes },
    { label: 'ثانیه', value: timeLeft.seconds },
  ];

  return (
    <div className="w-full my-6 flex flex-col items-center">
      <div className="text-xs uppercase tracking-widest text-stone-500 mb-3 font-vazir">
        شمارش معکوس تا زمان برگزاری مراسم
      </div>
      <div className="grid grid-cols-4 gap-3 md:gap-4 max-w-md w-full">
        {timeUnits.map((unit, index) => (
          <div 
            key={index}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-stone-900/5 backdrop-blur border border-amber-900/15 shadow-sm transition-transform hover:scale-105"
            style={{
              borderColor: hasGold ? 'rgba(180, 154, 112, 0.3)' : 'rgba(104, 117, 103, 0.3)'
            }}
          >
            <span 
              className="text-2xl md:text-3xl font-bold font-estedad tracking-tight text-stone-800"
              style={{ color: hasGold ? '#9C8259' : accentColor }}
            >
              {String(unit.value).padStart(2, '۰')}
            </span>
            <span className="text-[11px] font-vazir text-stone-500 mt-1">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
