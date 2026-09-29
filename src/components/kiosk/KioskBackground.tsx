import React from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// Import authentic photographic panorama stitched from crowd1, crowd2, crowd3
import crowdPanoramaWebp from '../../assets/kiosk/processed/kiosk-crowd-panorama.webp';

// Import processed slide assets
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
    ambientGradient: 'radial-gradient(ellipse at 75% 45%, #FAF4EA 0%, #F5EBDD 50%, #E7D5B9 100%)',
    ambientGlow: 'rgba(185, 101, 53, 0.16)',
    isDarkTheme: false,
  },
  {
    id: 'library-study',
    image: slideLibraryStudy,
    title: 'Midnight in the Library',
    subtitle: 'A lifetime dedicated to reading and scholarship',
    yearContext: 'Study & Research Archive',
    ambientGradient: 'radial-gradient(ellipse at 75% 45%, #363028 0%, #23201C 55%, #181512 100%)',
    ambientGlow: 'rgba(200, 155, 60, 0.24)',
    isDarkTheme: true,
  },
  {
    id: 'statue-pointing',
    image: slideStatuePointing,
    title: 'Voice of Liberation',
    subtitle: 'Statue pointing toward justice and equality',
    yearContext: 'Constitutional Memorial',
    ambientGradient: 'radial-gradient(ellipse at 75% 45%, #F8F3EA 0%, #EFE4D3 55%, #DFCDAE 100%)',
    ambientGlow: 'rgba(185, 101, 53, 0.20)',
    isDarkTheme: false,
  },
  {
    id: 'bronze-constitution',
    image: slideBronzeConstitution,
    title: 'The Living Constitution',
    subtitle: 'Monumental bronze sculpture, Parliament House',
    yearContext: 'National Assembly Heritage',
    ambientGradient: 'radial-gradient(ellipse at 75% 45%, #FAF5EC 0%, #EFE6D8 55%, #DECBB2 100%)',
    ambientGlow: 'rgba(200, 155, 60, 0.22)',
    isDarkTheme: false,
  },
  {
    id: 'parliament-monument',
    image: slideParliamentMonument,
    title: 'Architect of the Republic',
    subtitle: 'Standing tall in civic remembrance',
    yearContext: 'Republic Memorial',
    ambientGradient: 'radial-gradient(ellipse at 75% 45%, #FAF6EE 0%, #F3ECE0 55%, #E5DAC9 100%)',
    ambientGlow: 'rgba(185, 101, 53, 0.16)',
    isDarkTheme: false,
  },
  {
    id: 'heritage-bronze',
    image: slideHeritageBronze,
    title: 'Beacon of Equality',
    subtitle: 'The historic Constitution bearer memorial',
    yearContext: 'Public Heritage Memorial',
    ambientGradient: 'radial-gradient(ellipse at 75% 45%, #FAF4EA 0%, #ECE2D2 55%, #DBC8AF 100%)',
    ambientGlow: 'rgba(113, 63, 43, 0.18)',
    isDarkTheme: false,
  },
];

interface KioskBackgroundProps {
  currentSlideIndex: number;
}

export const KioskBackground: React.FC<KioskBackgroundProps> = ({ currentSlideIndex }) => {
  const prefersReducedMotion = useReducedMotion();
  const currentSlide = KIOSK_SLIDES[currentSlideIndex] || KIOSK_SLIDES[0];

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
          background: `radial-gradient(circle at 72% 42%, ${currentSlide.ambientGlow} 0%, transparent 65%)`,
        }}
      />

      {/* 2. Right-Aligned Presiding Ambedkar Slideshow (Safe distance away from left-hand touch text) */}
      <div className="absolute right-0 top-16 bottom-16 w-full lg:w-[48%] xl:w-[44%] flex items-center justify-center lg:justify-end pr-4 lg:pr-10 pointer-events-none z-[5]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 0.92, x: 0 }}
            exit={{ opacity: 0, x: -25 }}
            transition={{
              duration: prefersReducedMotion ? 0.3 : 1.1,
              ease: 'easeInOut',
            }}
            className="relative w-full h-full flex flex-col items-center justify-center lg:items-end lg:justify-center"
          >
            <img
              src={currentSlide.image}
              alt={currentSlide.title}
              className="max-h-[82%] sm:max-h-[86%] w-auto max-w-full object-contain object-right-bottom filter drop-shadow-[0_18px_42px_rgba(41,37,31,0.22)]"
            />
            {/* Archival metadata caption pill under slide */}
            <div className="mt-3 px-3.5 py-1 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-white/20 text-[11px] text-stone-800 dark:text-stone-200 font-serif flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B96535]" />
              <span>{currentSlide.title}</span>
              <span className="opacity-60 text-[10px] font-mono">({currentSlide.yearContext})</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 3. Bottom Panoramic Audience (Authentic crowd1, crowd2, crowd3 seamless panorama) */}
      <motion.div
        className="absolute bottom-0 inset-x-0 w-full flex items-end justify-center pointer-events-none z-10 transform-gpu will-change-transform"
        animate={
          prefersReducedMotion
            ? { y: 0 }
            : {
                y: [0, -3, 0],
                transition: {
                  repeat: Infinity,
                  repeatType: 'reverse',
                  duration: 8,
                  ease: 'easeInOut',
                },
              }
        }
      >
        <div className="relative w-full overflow-hidden flex items-end justify-center">
          <img
            src={crowdPanoramaWebp}
            alt="Historical Gathering Audience Panorama"
            className="w-full h-auto min-h-[120px] sm:min-h-[160px] md:min-h-[200px] max-h-[24vh] object-cover object-bottom opacity-90 select-none filter contrast-105"
          />
        </div>
      </motion.div>
    </div>
  );
};

