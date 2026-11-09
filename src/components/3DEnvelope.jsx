import React, { useState, useEffect, useRef } from 'react';
import { Lock, Sparkles } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function ThreeDEnvelope({
  isOpen = false,
  onOpen = () => {},
  sealText = 'A & S',
  category = 'wedding',
  accentColor = '#9a7a44',
  hasGold = true,
  envelopeColor = '#efe6d7',
  title = 'دعوت‌نامهٔ اختصاصی',
  showBeams = true,
  children,
}) {
  const [isOpening, setIsOpening] = useState(false);
  const reduced = useReducedMotion();
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleOpen = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    const delay = reduced ? 120 : 1150;
    timerRef.current = setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, delay);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleOpen();
    }
  };

  const isMemorial = category === 'memorial';
  const ariaLabel = isMemorial ? 'گشودن پاکت یادبود' : 'گشودن پاکت دعوت';

  const sealBackground = hasGold
    ? 'radial-gradient(circle at 34% 28%, #e2cda6 0%, #c0a06a 46%, #8d6c37 78%, #6c4f24 100%)'
    : `radial-gradient(circle at 34% 28%, #9aa894 0%, ${accentColor} 55%, #46504a 100%)`;

  return (
    <div className="relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-visible px-2 py-8 sm:px-4">
      {showBeams && !reduced && (
        <div className="light-beam-container opacity-50" aria-hidden="true">
          <div className="light-beam" />
          <div className="light-beam-2" />
        </div>
      )}

      {!isOpen ? (
        <div className="relative z-10 w-full max-w-[520px]">
          <div
            role="button"
            tabIndex={0}
            aria-label={ariaLabel}
            aria-pressed={isOpen}
            onClick={handleOpen}
            onKeyDown={handleKeyDown}
            className="group relative mx-auto block w-full cursor-pointer select-none outline-offset-8"
          >
            <div className="perspective-1200">
              <div
                className="relative h-[310px] w-full border border-[#cfc1a9] shadow-envelope transition-transform duration-700 ease-out-expo group-hover:-translate-y-1 sm:h-[340px]"
                style={{ backgroundColor: envelopeColor }}
              >
                {/* paper grain / perforation */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-[0.18]"
                  style={{
                    backgroundImage: 'radial-gradient(#8b7a5e 0.7px, transparent 0.7px)',
                    backgroundSize: '14px 14px',
                  }}
                />

                {/* inner card peeking */}
                <div
                  className="absolute inset-x-8 top-6 border border-[#d7cbb8] bg-[#fbf7ee] px-6 py-5 text-center shadow-md transition-all duration-1000 ease-out-expo"
                  style={{
                    transform: isOpening && !reduced ? 'translateY(-58px)' : 'translateY(0)',
                    opacity: isOpening && !reduced ? 0.95 : 0.92,
                  }}
                >
                  <span className="latin block text-[9px] tracking-[0.3em] text-[#6f6046]">
                    {isMemorial ? 'In loving memory' : 'You are invited'}
                  </span>
                  <span className="mt-2 block font-display text-base text-[#3b342a]">{title}</span>
                  <span
                    className="mx-auto mt-3 block h-px w-10 opacity-60"
                    style={{ backgroundColor: hasGold ? '#c0a06a' : accentColor }}
                  />
                </div>

                {/* envelope bottom flap */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[155px]"
                  style={{
                    background: `linear-gradient(180deg, ${envelopeColor} 0%, #e4d8c4 100%)`,
                    clipPath: 'polygon(0 100%, 50% 28%, 100% 100%)',
                    borderTop: '1px solid rgba(160,140,108,0.25)',
                  }}
                />

                {/* side creases */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[155px] opacity-60"
                  style={{
                    background: `linear-gradient(135deg, rgba(255,255,255,0.35) 0%, transparent 42%), linear-gradient(225deg, rgba(120,100,70,0.12) 0%, transparent 42%)`,
                    clipPath: 'polygon(0 100%, 50% 28%, 100% 100%)',
                  }}
                />

                {/* top flap */}
                <div
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 z-30 h-[145px] origin-top transition-all duration-1000 ease-out-expo"
                  style={{
                    background: 'linear-gradient(180deg, #eadfcc 0%, #ddcfb8 100%)',
                    clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                    transform: isOpening ? (reduced ? 'scaleY(0.9)' : 'rotateX(178deg)') : 'rotateX(0deg)',
                    opacity: isOpening && reduced ? 0 : 1,
                    boxShadow: '0 14px 30px -18px rgba(60,46,26,0.55)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-10 top-9 block h-px"
                    style={{ backgroundColor: hasGold ? 'rgba(201,183,149,0.6)' : 'rgba(76,87,69,0.4)' }}
                  />
                </div>

                {/* wax seal */}
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pt-10">
                  <div
                    className={`relative flex h-[86px] w-[86px] items-center justify-center rounded-full shadow-[0_18px_30px_-14px_rgba(60,46,26,0.7)] transition-all duration-700 ease-out-expo ${
                      isOpening ? 'scale-150 opacity-0' : 'group-hover:scale-105'
                    }`}
                    style={{ background: sealBackground }}
                  >
                    <span
                      aria-hidden="true"
                      className="absolute inset-[5px] rounded-full border border-white/25"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,rgba(255,255,255,0.5),transparent_45%)]"
                    />
                    <span
                      className={`relative z-10 leading-none ${
                        /^[A-Za-z&\s]+$/.test(sealText)
                          ? 'font-latin text-xl tracking-[0.12em] text-[#3a2a11]'
                          : 'font-display text-xl text-[#2f2410]'
                      }`}
                    >
                      {sealText}
                    </span>
                  </div>

                  <span className="mt-7 inline-flex items-center gap-2 border bg-[#fbf7ee]/80 px-4 py-2 text-[10px] text-[#4c4232] backdrop-blur-sm transition-colors duration-300"
                    style={{ borderColor: hasGold ? 'rgba(154,122,68,0.45)' : 'rgba(76,87,69,0.35)' }}
                  >
                    {isOpening ? (
                      <>در حال گشودن پاکت…</>
                    ) : (
                      <>
                        <Lock className="h-3 w-3" aria-hidden="true" />
                        لمس کنید تا پاکت گشوده شود
                      </>
                    )}
                  </span>
                </div>

                {/* corner ticks */}
                {['right-2 top-2 border-r border-t', 'left-2 top-2 border-l border-t', 'right-2 bottom-2 border-r border-b', 'left-2 bottom-2 border-l border-b'].map(
                  (cls) => (
                    <span
                      key={cls}
                      aria-hidden="true"
                      className={`pointer-events-none absolute z-40 h-3 w-3 ${cls}`}
                      style={{ borderColor: hasGold ? 'rgba(165,144,108,0.45)' : 'rgba(76,87,69,0.35)' }}
                    />
                  )
                )}
              </div>
            </div>

            <p className="mt-6 text-center text-[10px] tracking-[0.16em] text-ink-subtle">
              {isMemorial ? 'با آرامش و احترام' : 'دعوت‌نامهٔ دیجیتال · دیبا'}
            </p>
          </div>
        </div>
      ) : (
        <div className="z-20 w-full max-w-3xl animate-fade-in">
          {children}
        </div>
      )}

      <div className="sr-only" aria-live="polite">
        {isOpening ? 'پاکت در حال گشودن است' : isOpen ? 'کارت نمایان شد' : ''}
      </div>
    </div>
  );
}
