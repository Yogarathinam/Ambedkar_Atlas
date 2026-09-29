import React from 'react';
import ambedkarLogo from '../../../assets/hero/image.png';

interface BookCoverProps {
  isOpen: boolean;
  openProgress: number; // 0 (closed) to 1 (fully open)
  onOpenClick?: () => void;
}

export const BookCover: React.FC<BookCoverProps> = ({
  openProgress,
  onOpenClick,
}) => {
  // Convert 0..1 openProgress to rotation: 0deg (closed) to -180deg (open flat on left)
  const angle = -openProgress * 180;
  const isPastHalf = openProgress > 0.5;

  return (
    <div
      className="absolute top-0 right-0 w-1/2 h-full origin-left cursor-pointer transition-shadow duration-300"
      style={{
        transformStyle: 'preserve-3d',
        transform: `rotateY(${angle}deg)`,
        zIndex: isPastHalf ? 10 : 40,
      }}
      onClick={onOpenClick}
      title={openProgress < 0.1 ? 'Click to open' : undefined}
    >
      {/* ============================================================ */}
      {/* FRONT COVER (Faces user when closed, rotateY: 0deg)         */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 rounded-r-2xl overflow-hidden shadow-[0_20px_40px_rgba(20,15,10,0.45)] border-r-4 border-y-2 border-[#1E140E]"
        style={{
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #2E1F16 0%, #1F140E 50%, #291A12 100%)',
        }}
      >
        {/* Leather grain & subtle ambient highlight */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_25%,rgba(255,255,255,0.15),transparent_65%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#C89B3C_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Embossed Spine Hinge Crease on the left */}
        <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-black/60 via-black/20 to-transparent pointer-events-none" />
        <div className="absolute left-6 top-0 bottom-0 w-[2px] bg-[#C89B3C]/30 shadow-[1px_0_2px_rgba(0,0,0,0.5)]" />

        {/* Outer Gilded Filigree Border */}
        <div className="absolute inset-4 sm:inset-6 rounded-xl border border-[#D4AF37]/50 pointer-events-none">
          {/* Inner Inset Border */}
          <div className="absolute inset-1.5 rounded-lg border border-[#D4AF37]/30" />

          {/* Four Corner Ornaments */}
          <div className="absolute top-2 left-2 text-[#D4AF37] text-xs opacity-75 font-serif select-none">❖</div>
          <div className="absolute top-2 right-2 text-[#D4AF37] text-xs opacity-75 font-serif select-none">❖</div>
          <div className="absolute bottom-2 left-2 text-[#D4AF37] text-xs opacity-75 font-serif select-none">❖</div>
          <div className="absolute bottom-2 right-2 text-[#D4AF37] text-xs opacity-75 font-serif select-none">❖</div>
        </div>

        {/* Cover Content Centerpiece */}
        <div className="relative h-full flex flex-col items-center justify-between p-4 sm:p-6 lg:p-7 text-center z-10">
          
          {/* Header Epoch Inscription */}
          <div className="space-y-1 pt-1">
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.28em] text-[#D4AF37]/80 uppercase block">
              Historical Documentary Chronicle
            </span>
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/60 to-transparent mx-auto" />
          </div>

          {/* Central Title & Insignia Medallion */}
          <div className="space-y-3 sm:space-y-4 my-auto">
            {/* Medallion with Archival Seal & Ambedkar Portrait */}
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
              {/* Outer Gilded Aura Ring */}
              <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37]/70 shadow-[0_0_15px_rgba(212,175,55,0.25)]" />
              <div className="absolute inset-1.5 rounded-full border border-[#D4AF37]/40 border-dashed animate-[spin_60s_linear_infinite]" />
              
              {/* Archival Seal Foundation */}
              <img
                src="/seal.svg"
                alt="Ambedkar Atlas Seal"
                className="w-12 h-12 sm:w-16 sm:h-16 invert brightness-90 opacity-60"
              />
              
              {/* Raw Dr. Ambedkar Portrait on top */}
              <img
                src={ambedkarLogo}
                alt="Dr. B. R. Ambedkar"
                className="absolute inset-1.5 w-12 h-12 sm:w-16 sm:h-16 object-contain drop-shadow-md"
              />
            </div>

            {/* Book Title with Realistic Gold Foil Shimmer */}
            <div className="space-y-1.5">
              <h2 className="font-serif text-xl sm:text-2xl md:text-3xl font-extrabold tracking-wide uppercase leading-tight bg-gradient-to-b from-[#FFF4D0] via-[#E5C158] to-[#9E782F] bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                THE AMBEDKAR<br />CHRONICLE
              </h2>
              
              <div className="w-20 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto" />
              
              <p className="font-serif italic text-xs sm:text-sm text-[#F5EBDD]/90 max-w-[260px] sm:max-w-xs mx-auto leading-relaxed tracking-wide">
                The Life, Ideas &amp; Legacy of<br />Dr. B. R. Ambedkar
              </p>
            </div>
          </div>

          {/* Bottom Colophon Inscription */}
          <div className="pb-1">
            <span className="text-[10px] sm:text-xs font-mono tracking-[0.24em] text-[#D4AF37]/80 uppercase block">
              1891 – 1956 • Verified Records
            </span>
          </div>

        </div>

        {/* Dynamic Shadow on cover as it opens */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-150"
          style={{
            background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)',
            opacity: openProgress * 0.7,
          }}
        />
      </div>

      {/* ============================================================ */}
      {/* INSIDE FRONT COVER (Left page when opened, rotateY: 180deg) */}
      {/* ============================================================ */}
      <div
        className="absolute inset-0 rounded-l-2xl overflow-hidden shadow-inner border-l-4 border-y-2 border-[#DED3C2]"
        style={{
          transform: 'rotateY(180deg)',
          backfaceVisibility: 'hidden',
          background: 'linear-gradient(135deg, #EADFCF 0%, #FAF4EA 50%, #F5EBDD 100%)',
        }}
      >
        {/* Subtle Marbled Texture */}
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#713F2B_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

        {/* Inner Gutter Shadow (Right side of left page) */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/25 via-black/10 to-transparent pointer-events-none" />

        {/* Frontispiece / Dedication Plate */}
        <div className="h-full flex flex-col justify-between p-4 sm:p-6 text-center relative z-10">
          <div className="pt-1 text-right">
            <span className="text-[10px] font-mono tracking-widest text-[#827567] uppercase">
              Frontispiece
            </span>
          </div>

          <div className="space-y-2.5 my-auto max-w-xs mx-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-[#E7D5B9] border border-[#DED3C2] flex items-center justify-center">
              <span className="font-serif text-base sm:text-lg font-bold text-[#713F2B]">Ω</span>
            </div>

            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#29251F] leading-snug">
              "Tell the slave he is a slave and he will revolt."
            </h3>

            <p className="text-xs text-[#51483F] leading-relaxed italic line-clamp-3">
              Dedicated to the ongoing struggle for social democracy, human dignity, and constitutional liberty.
            </p>

            <div className="pt-1">
              <span className="text-[11px] font-serif font-bold text-[#713F2B] block">
                Babasaheb Dr. B. R. Ambedkar
              </span>
              <span className="text-[9px] font-mono text-[#827567] tracking-wider uppercase">
                14 April 1891 – 6 December 1956
              </span>
            </div>
          </div>

          <div className="pb-1 border-t border-[#DED3C2] pt-2 text-[10px] text-[#827567] flex items-center justify-between font-mono">
            <span>Ambedkar Atlas Edition</span>
            <span>Vol. I – XXIV</span>
          </div>
        </div>

        {/* Gutter shadow when opened */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-150"
          style={{
            background: 'linear-gradient(to left, rgba(0,0,0,0.3), transparent 30%)',
            opacity: (1 - openProgress) * 0.8,
          }}
        />
      </div>
    </div>
  );
};
