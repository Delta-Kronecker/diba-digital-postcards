import React, { useState, useEffect } from 'react';
import { toPersianDigits } from '../utils/numbers';

function CountdownTimer({ targetDate = '2027-06-18T19:00:00', accentColor = 'var(--color-gold-deep)', hasGold = true }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const calculate = () => {
      const difference = +new Date(targetDate) - Date.now();
      if (difference > 0) {
        setStarted(false);
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setStarted(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: 'روز', value: timeLeft.days },
    { label: 'ساعت', value: timeLeft.hours },
    { label: 'دقیقه', value: timeLeft.minutes },
    { label: 'ثانیه', value: timeLeft.seconds },
  ];

  const ariaLabel = started
    ? 'مراسم برگزار شده است'
    : `زمان باقی‌مانده تا مراسم: ${timeLeft.days} روز، ${timeLeft.hours} ساعت، ${timeLeft.minutes} دقیقه و ${timeLeft.seconds} ثانیه`;

  return (
    <div className="my-8 w-full" role="timer" aria-label={ariaLabel}>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs text-ink-subtle">شمارش معکوس تا مراسم</span>
        <span className="h-px flex-1 bg-line" aria-hidden="true" />
        <span lang="en" className="latin text-xs text-ink-subtle">Countdown</span>
      </div>

      {started ? (
        <p className="border-y border-line py-5 text-center font-display text-sm text-ink-muted">
          مراسم برگزار شد
        </p>
      ) : (
        <div className="grid grid-cols-4 border-y border-line">
          {units.map((unit, i) => (
            <div
              key={unit.label}
              className={`px-1 py-5 text-center ${i !== 0 ? 'border-s border-line' : ''}`}
            >
              <span
                className="block font-display text-[1.7rem] font-medium leading-none tabular-nums sm:text-4xl"
                style={{ color: hasGold ? 'var(--color-gold-deep)' : accentColor }}
              >
                {toPersianDigits(String(unit.value).padStart(2, '0'))}
              </span>
              <span className="mt-2 block text-xs text-ink-subtle">{unit.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default React.memo(CountdownTimer);
