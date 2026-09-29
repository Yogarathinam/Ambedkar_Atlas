import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Import processed kiosk assets
import crowdPanoramaWebp from '../../assets/kiosk/processed/kiosk-crowd-panorama.webp';
import slidePortraitBook from '../../assets/kiosk/processed/slide-portrait-book.webp';
import slideLibraryStudy from '../../assets/kiosk/processed/slide-library-study.webp';
import slideStatuePointing from '../../assets/kiosk/processed/slide-statue-pointing.webp';
import slideBronzeConstitution from '../../assets/kiosk/processed/slide-bronze-constitution.webp';
import slideParliamentMonument from '../../assets/kiosk/processed/slide-parliament-monument.webp';
import slideHeritageBronze from '../../assets/kiosk/processed/slide-heritage-bronze.webp';

export interface KioskSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  yearContext: string;
  ambientGradient: string;
  ambientGlow: string;
  isDarkTheme: boolean;
}

export const KIOSK_SLIDES: KioskSlide[] = [
  {
    id: 'portrait-book',
    image: slidePortraitBook,
    title: 'The Presiding Scholar',
    subtitle: 'Framed with manuscript and pen',
    yearContext: 'New Delhi • 1950',
    ambientGradient: 'radial-gradient(ellipse at 50% 38%, #FBF8F2 0%, #F5EBDD 50%, #E7D5B9 100%)',
    ambientGlow: 'rgba(185, 101, 53, 0.16)',
    isDarkTheme: false,
  },
  {
    id: 'library-study',
    image: slideLibraryStudy,
    title: 'Midnight in the Library',
    subtitle: 'A lifetime dedicated to reading and scholarship',
    yearContext: 'Study & Research Archive',
    ambientGradient: 'radial-gradient(ellipse at 50% 38%, #363028 0%, #23201C 55%, #181512 100%)',
    ambientGlow: 'rgba(200, 155, 60, 0.24)',
    isDarkTheme: true,
  },
  {
    id: 'statue-pointing',
    image: slideStatuePointing,
    title: 'Voice of Liberation',
    subtitle: 'Statue pointing toward justice and equality',
    yearContext: 'Constitutional Memorial',
    ambientGradient: 'radial-gradient(ellipse at 50% 38%, #F8F3EA 0%, #EFE4D3 55%, #DFCDAE 100%)',
    ambientGlow: 'rgba(185, 101, 53, 0.20)',
    isDarkTheme: false,
  },
  {
    id: 'bronze-constitution',
    image: slideBronzeConstitution,
    title: 'The Living Constitution',
    subtitle: 'Monumental bronze sculpture, Parliament House',
    yearContext: 'National Assembly Heritage',
    ambientGradient: 'radial-gradient(ellipse at 50% 38%, #FAF5EC 0%, #EFE6D8 55%, #DECBB2 100%)',
    ambientGlow: 'rgba(200, 155, 60, 0.22)',
    isDarkTheme: false,
  },
  {
    id: 'parliament-monument',
    image: slideParliamentMonument,
    title: 'Architect of the Republic',
    subtitle: 'Standing tall in civic remembrance',
    yearContext: 'Republic Memorial',
    ambientGradient: 'radial-gradient(ellipse at 50% 38%, #FAF6EE 0%, #F3ECE0 55%, #E5DAC9 100%)',
    ambientGlow: 'rgba(185, 101, 53, 0.16)',
    isDarkTheme: false,
  },
  {
    id: 'heritage-bronze',
    image: slideHeritageBronze,
    title: 'Beacon of Equality',
    subtitle: 'The historic Constitution bearer memorial',
    yearContext: 'Public Heritage Memorial',
    ambientGradient: 'radial-gradient(ellipse at 50% 38%, #FAF4EA 0%, #ECE2D2 55%, #DBC8AF 100%)',
    ambientGlow: 'rgba(113, 63, 43, 0.18)',
    isDarkTheme: false,
  },
];

interface KioskBackgroundProps {
  onSlideChange?: (slide: KioskSlide) => void;
}

export const KioskBackground: React.FC<KioskBackgroundProps> = ({ onSlideChange }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const currentSlide = KIOSK_SLIDES[currentIdx];

  // Auto-advance slideshow every 9 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % KIOSK_SLIDES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  // Notify parent of current slide for adaptive kiosk contrast
  useEffect(() => {
    if (onSlideChange) {
      onSlideChange(currentSlide);
    }
  }, [currentIdx, onSlideChange, currentSlide]);

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none overflow-hidden z-0 transition-colors duration-1000 ease-in-out"
      style={{
        background: currentSlide.ambientGradient,
      }}
      aria-hidden="true"
    >
      {/* 1. Adaptive Ambient Light Glow */}
      <motion.div
        key={`glow-${currentSlide.id}`}
        className="absolute inset-0 opacity-80 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 35%, ${currentSlide.ambientGlow} 0%, transparent 65%)`,
        }}
      />

      {/* 2. Background Slideshow Layer (Feathered Dr. Ambedkar Images) */}
      <div className="absolute inset-x-0 top-0 h-[68%] sm:h-[72%] md:h-[78%] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 0.65, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 1.2,
              ease: 'easeInOut',
            }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="max-h-[95%] max-w-[85%] sm:max-w-[70%] md:max-w-[55%] object-contain object-center filter drop-shadow-[0_12px_36px_rgba(41,37,31,0.18)]"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Slide Caption Badge (Archival metadata indicator) */}
      <div className="absolute top-24 right-6 sm:right-10 pointer-events-auto z-20">
        <div className="bg-[#FBF8F2]/80 backdrop-blur-xs border border-[#DED3C2]/80 rounded-2xl px-3.5 py-1.5 shadow-2xs flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#B96535] animate-ping" />
          <div className="text-left">
            <span className="block text-[11px] font-bold font-serif text-[#29251F]">
              {currentSlide.title}
            </span>
            <span className="block text-[9px] text-[#827567] font-mono tracking-wider">
              {currentSlide.yearContext}
            </span>
          </div>
        </div>
      </div>

      {/* 4. Slideshow Progress Indicator Dots */}
      <div className="absolute top-24 left-6 sm:left-10 pointer-events-auto flex items-center gap-1.5 z-20">
        {KIOSK_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            onClick={() => setCurrentIdx(idx)}
            title={slide.title}
            className={`transition-all duration-300 rounded-full ${
              idx === currentIdx
                ? 'w-6 h-2 bg-[#B96535]'
                : 'w-2 h-2 bg-[#827567]/40 hover:bg-[#827567]'
            }`}
          />
        ))}
      </div>

      {/* 5. Stitched Panoramic Audience Silhouette (crowd1 + crowd2 + crowd3) */}
      <motion.div
        className="absolute bottom-0 inset-x-0 w-full flex items-end justify-center pointer-events-none z-10 transform-gpu will-change-transform"
        animate={
          prefersReducedMotion
            ? { y: 0 }
            : {
                y: [0, -4, 0],
                transition: {
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 8,
                  ease: 'easeInOut',
                },
              }
        }
      >
        <div className="relative w-full overflow-hidden">
          <img
            src={crowdPanoramaWebp}
            alt="Assembled Citizens Audience"
            className="w-full h-auto min-h-[160px] sm:min-h-[220px] md:min-h-[280px] lg:min-h-[320px] object-cover object-bottom opacity-95 filter drop-shadow-[0_-4px_16px_rgba(41,37,31,0.12)]"
          />
          {/* Subtle bottom fade gradient */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#29251F]/40 to-transparent pointer-events-none" />
        </div>
      </motion.div>
    </div>
  );
};
