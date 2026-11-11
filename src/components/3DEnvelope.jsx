import React, { useState, useEffect, useRef } from 'react';
import { Lock } from 'lucide-react';
import { useReducedMotion } from '../hooks/useReducedMotion';

export default function ThreeDEnvelope({
  isOpen = false,
  onOpen = () => {},
  sealText = 'A & S',
  category = 'wedding',
  accentColor = 'var(--color-gold)',
  onDark = false,
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

  const isMemorial = category === 'memorial';
  const ariaLabel = isMemorial ? 'گشودن پاکت یادبود' : 'گشودن پاکت دعوت';

  const sealBackground = hasGold
    ? 'radial-gradient(circle at 34% 28%, var(--color-seal-a) 0%, var(--color-seal-b) 46%, var(--color-seal-c) 78%, var(--color-seal-d) 100%)'
    : `radial-gradient(circle at 34% 28%, var(--color-seal-sage-a) 0%, ${accentColor} 55%, var(--color-seal-sage-c) 100%)`;

  return (
    <div className="relative flex min-h-[500px] w-full flex-col items-center justify-center overflow-visible px-2 py-8 sm:px-4">
      {/* A pool of light behind the paper, so the stage is not a flat field. */}
      <div aria-hidden="true" className="stage-glow pointer-events-none absolute inset-0" />

      {showBeams && !reduced && (
        <div className="light-beam-container opacity-50" aria-hidden="true">
          <div className="light-beam" />
          <div className="light-beam-2" />
        </div>
      )}

      {!isOpen ? (
        <div className="relative z-10 w-full max-w-[520px]">
          {/* The stage *is* the control, but the drawn envelope is a picture of
              the invitation: it is decoration, and the control is the transparent
              button laid over it. So the control's accessible name is the action
              ("گشودن پاکت دعوت") instead of a reading of the whole preview, and
              WCAG 2.5.3 holds without an aria-label fighting visible text. */}
          <div className="group relative mx-auto block w-full">
            {/* the envelope rests on the surface: it casts a soft shadow */}
            <span
              aria-hidden="true"
              className="stage-floor pointer-events-none absolute inset-x-8 bottom-1 h-9"
            />
            <div className="perspective-1400" aria-hidden="true">
              <div
                className="relative h-[310px] w-full border border-paper-line-3 shadow-envelope transition-transform duration-slow ease-out-expo group-hover:-translate-y-1 sm:h-[340px]"
                style={{
                  backgroundColor: envelopeColor,
                  /* the sheet's head catches the light, its foot holds a shade */
                  backgroundImage:
                    'linear-gradient(180deg, rgb(255 255 255 / 0.45) 0%, rgb(255 255 255 / 0) 15%, rgb(25 22 18 / 0.05) 100%)',
                }}
              >

                {/* inner card peeking */}
                <div
                  className="absolute inset-x-8 top-6 border border-paper-line-2 bg-paper-cream px-6 py-5 text-center transition-transform duration-cinematic ease-out-expo"
                  style={{
                    transform: isOpening && !reduced ? 'translateY(-58px)' : 'translateY(0)',
                    opacity: isOpening && !reduced ? 0.95 : 0.92,
                  }}
                >
                  <span lang="en" className="latin block text-xs text-paper-ink-muted">
                    {isMemorial ? 'In loving memory' : 'You are invited'}
                  </span>
                  <span className="mt-2 block font-display text-base text-paper-ink-warm">{title}</span>
                  <span
                    className="mx-auto mt-3 block h-px w-10 opacity-60"
                    style={{ backgroundColor: hasGold ? 'var(--color-foil)' : accentColor }}
                  />
                </div>

                {/* the crease the closed flap presses into the paper */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-[138px] block h-6"
                  style={{ background: 'linear-gradient(180deg, rgb(25 22 18 / 0.10) 0%, rgb(25 22 18 / 0) 100%)' }}
                />

                {/* envelope bottom flap */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[155px]"
                  style={{
                    background: `linear-gradient(180deg, ${envelopeColor} 0%, var(--color-paper-shade) 100%)`,
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
                  className="absolute inset-x-0 top-0 z-30 h-[145px] origin-top transition-transform duration-cinematic ease-out-expo"
                  style={{
                    /* the flap's two cut edges catch a hairline of foil: an outer
                       plate in the metal tone, a paper plate inset just inside it */
                    background: hasGold
                      ? 'linear-gradient(180deg, color-mix(in srgb, var(--color-foil) 66%, var(--color-paper-shade-3)) 0%, var(--color-seal-c) 100%)'
                      : `linear-gradient(180deg, color-mix(in srgb, ${accentColor} 52%, var(--color-paper-shade-3)) 0%, var(--color-seal-sage-c) 100%)`,
                    clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                    transform: isOpening ? (reduced ? 'scaleY(0.9)' : 'rotateX(178deg)') : 'rotateX(0deg)',
                    opacity: isOpening && reduced ? 0 : 1,
                    boxShadow: '0 14px 30px -18px rgba(60, 46, 26, 0.55)',
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-[1.5px] block"
                    style={{
                      clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                      background: 'linear-gradient(180deg, var(--color-paper-shade-2) 0%, var(--color-paper-shade-3) 100%)',
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-x-10 top-9 block h-px"
                    style={{ backgroundColor: hasGold ? 'rgba(201,183,149,0.6)' : 'rgba(76,87,69,0.4)' }}
                  />
                </div>

                {/* wax seal */}
                <div className="absolute inset-0 z-40 flex flex-col items-center justify-center pt-10">
                  <div
                    className={`relative flex h-[86px] w-[86px] items-center justify-center rounded-full shadow-seal transition-transform ease-out-expo ${
                      isOpening ? 'duration-slower scale-150 opacity-0' : 'duration-slow group-hover:scale-105'
                    }`}
                    style={{
                      background: sealBackground,
                      boxShadow: '0 10px 20px -12px rgb(25 22 18 / 0.55), inset 0 1px 1px rgb(255 255 255 / 0.3)',
                    }}
                  >
                    {/* the stamped rim: the hairline the die leaves in the wax */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-[2px] rounded-full border border-seal-ink/15"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-[5px] rounded-full border border-seal-cream/25"
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_22%,var(--color-gloss),transparent_45%)]"
                    />
                    <span
                      className={`relative z-10 leading-none ${
                        /^[A-Za-z&\s]+$/.test(sealText)
                          ? 'font-latin text-xl text-paper-ink-warm'
                          : 'font-display text-xl text-paper-ink-warm'
                      }`}
                    >
                      {sealText}
                    </span>
                  </div>

                  <span className="mt-7 inline-flex items-center gap-2 border bg-paper-cream/80 px-4 py-2 text-xs text-paper-ink-muted backdrop-blur-sm transition-colors duration-base"
                    style={{ borderColor: hasGold ? 'rgba(154,122,68,0.45)' : 'rgba(76,87,69,0.35)' }}
                  >
                    {isOpening ? (
                      <>در حال گشودن پاکت…</>
                    ) : (
                      <>
                        <Lock className="size-3" aria-hidden="true" />
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
                      className={`pointer-events-none absolute z-40 size-3 ${cls}`}
                      style={{ borderColor: hasGold ? 'rgba(165,144,108,0.45)' : 'rgba(76,87,69,0.35)' }}
                    />
                  )
                )}
              </div>
            </div>

            <p className={`mt-6 text-center text-xs ${onDark ? 'text-cream/70' : 'text-ink-subtle'}`}>
              {isMemorial ? 'با آرامش و احترام' : 'دعوت‌نامهٔ دیجیتال، دیبا'}
            </p>
            <button
              type="button"
              onClick={handleOpen}
              aria-label={ariaLabel}
              className="absolute inset-0 cursor-pointer outline-offset-8"
            />
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
