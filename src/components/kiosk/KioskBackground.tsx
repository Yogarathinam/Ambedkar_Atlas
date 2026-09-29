import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

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
      {/* 1. Subtle Radial Illumination behind Centre/Right Slideshow Area */}
      <motion.div
        key={`glow-${currentSlide.id}`}
        className="absolute inset-0 opacity-75 transition-opacity duration-1000 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse at 70% 45%, ${currentSlide.ambientGlow} 0%, transparent 60%)`,
        }}
      />

      {/* 2. Soft Uniform Left Workspace Illumination (Preserves text legibility) */}
      <div 
        className="absolute inset-y-0 left-0 w-[55%] pointer-events-none opacity-40 transition-opacity duration-1000"
        style={{
          background: currentSlide.isDarkTheme 
            ? 'linear-gradient(to right, rgba(24, 21, 18, 0.6) 0%, transparent 100%)' 
            : 'linear-gradient(to right, rgba(245, 235, 221, 0.7) 0%, transparent 100%)',
        }}
      />

      {/* 3. Bottom Panoramic Historical Audience Crowd (Authentic crowd panorama with upper gradient fade) */}
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
        <div 
          className="relative w-full overflow-hidden flex items-end justify-center"
          style={{
            maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
            WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)',
          }}
        >
          <img
            src={crowdPanoramaWebp}
            alt="Historical Gathering Audience Panorama"
            className="w-full h-auto min-h-[110px] sm:min-h-[140px] md:min-h-[160px] max-h-[18vh] lg:max-h-[22vh] object-cover object-bottom opacity-85 select-none filter contrast-105"
          />
        </div>
      </motion.div>
    </div>
  );
};
