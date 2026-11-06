import React, { useState } from 'react';
import { Sparkles, Mail, Lock, Unlock } from 'lucide-react';

export default function ThreeDEnvelope({
  isOpen = false,
  onOpen = () => {},
  sealText = 'A & S',
  category = 'wedding',
  accentColor = '#B49A70',
  hasGold = true,
  title = 'دعوت‌نامه اختصاصی',
  children
}) {
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpen || isOpening) return;
    setIsOpening(true);
    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 1200);
  };

  const isMemorial = category === 'memorial';

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[520px] py-8 px-4 relative overflow-hidden">
      {/* Deluxe Subtle Light Beams behind envelope */}
      <div className="light-beam-container">
        <div className="light-beam" />
        <div className="light-beam-2" />
      </div>

      {!isOpen ? (
        /* Envelope Closed / Opening State with 3D Physics */
        <div 
          onClick={handleOpenClick}
          className="group relative cursor-pointer perspective-1000 w-full max-w-md h-[360px] rounded-2xl flex flex-col items-center justify-center transition-all duration-700 hover:scale-[1.02]"
        >
          {/* Envelope Body Frame with Enhanced Glass & Shadow */}
          <div className="relative w-full h-full bg-[#EFE9DF] rounded-2xl border border-[#D8CEBE] shadow-2xl overflow-hidden flex flex-col justify-between p-6 transform-style-3d">
            
            {/* Top Triangular Flap with 3D Fold & Depth Physics */}
            <div 
              className={`absolute top-0 left-0 right-0 h-44 bg-[#E4DDD0] border-b border-[#C8BEAD] origin-top transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] transform-style-3d z-30 ${
                isOpening ? 'rotate-x-180 opacity-25 scale-y-75' : 'group-hover:brightness-95'
              }`}
              style={{
                clipPath: 'polygon(0 0, 50% 100%, 100% 0)',
                boxShadow: isOpening ? 'none' : '0 12px 30px rgba(0,0,0,0.12)'
              }}
            >
              {/* Flap Backing Fill */}
              <div className="w-full h-full bg-[#DED6C7] opacity-90" />
            </div>

            {/* Envelope Interior Lining Pattern */}
            <div className="absolute inset-0 bg-stone-100 opacity-40 z-0 flex items-center justify-center">
              <div className="w-full h-full opacity-10 bg-[radial-gradient(#B49A70_1.5px,transparent_1.5px)] [background-size:16px_16px]" />
            </div>

            {/* Hidden Card preview peeking & sliding from inside during opening */}
            <div 
              className={`absolute left-6 right-6 bg-[#F6F1E9] border border-amber-800/25 rounded-xl p-6 shadow-2xl transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${
                isOpening ? 'top-[-110px] scale-100 opacity-100 translate-y-[-10px]' : 'top-12 scale-95 opacity-85'
              }`}
            >
              <div className="text-center">
                <span className="text-xs uppercase tracking-widest text-amber-800 font-vazir block mb-1 font-semibold">
                  {title}
                </span>
                <div className="h-0.5 w-16 mx-auto bg-amber-700/30 my-2" />
              </div>
            </div>

            {/* Wax Seal / Cover Button in Center */}
            <div className="relative z-40 my-auto flex flex-col items-center justify-center pt-8">
              {!isMemorial ? (
                /* Luxury Wax Seal */
                <div className="relative group/seal">
                  <div 
                    className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 ${
                      isOpening ? 'scale-150 opacity-0 rotate-90' : 'animate-wax-shimmer group-hover/seal:scale-110'
                    }`}
                    style={{
                      background: hasGold
                        ? 'radial-gradient(circle, #D8C3A3 0%, #B49A70 60%, #7A6239 100%)'
                        : `radial-gradient(circle, ${accentColor} 0%, #444 100%)`,
                      boxShadow: '0 10px 30px rgba(180, 154, 112, 0.45), inset 0 2px 5px rgba(255, 255, 255, 0.7)'
                    }}
                  >
                    <div className="w-16 h-16 rounded-full border-2 border-amber-100/50 flex flex-col items-center justify-center text-amber-950 font-editorial font-bold shadow-inner">
                      <span className="text-sm tracking-wider font-bold">{sealText}</span>
                      <Sparkles className="w-3 h-3 text-amber-900/80 mt-0.5" />
                    </div>
                  </div>

                  {/* Wax Seal Sheen Light Ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-amber-300/60 animate-ping opacity-30 pointer-events-none" />
                </div>
              ) : (
                /* Memorial Dignified Cover Button */
                <div className="w-20 h-20 rounded-full bg-[#687567] text-stone-100 flex flex-col items-center justify-center shadow-lg border border-stone-400/40 group-hover:scale-105 transition-transform duration-300">
                  <span className="text-xs font-editorial tracking-wide">{sealText}</span>
                </div>
              )}

              {/* Action Hint Text */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-vazir font-medium text-stone-800 bg-white/90 backdrop-blur-md border border-amber-900/20 shadow-md group-hover:bg-amber-50 group-hover:border-amber-500 transition-all">
                  <Lock className="w-3.5 h-3.5 text-amber-700" />
                  {isOpening ? 'در حال گشودن ۳بعدی پاکت...' : 'لمس کنید تا پاکت دعوت گشوده شود'}
                </span>
              </div>
            </div>

            {/* Bottom Flap Diagonal Hairlines */}
            <div 
              className="absolute bottom-0 left-0 right-0 h-28 bg-[#E6E0D4] border-t border-[#D5CBB9] z-20 pointer-events-none"
              style={{
                clipPath: 'polygon(0 100%, 50% 0, 100% 100%)'
              }}
            />
          </div>
        </div>
      ) : (
        /* Card Opened View - Reveals the inner content smoothly with 3D elevation */
        <div className="w-full max-w-3xl animate-in fade-in zoom-in-95 duration-1000 z-20">
          {children}
        </div>
      )}
    </div>
  );
}
