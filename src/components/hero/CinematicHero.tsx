import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Clock, Mic, MicOff } from 'lucide-react';
import { HERO_ASSETS } from '../../assets/hero/heroAssets';
import { useVoiceSearch } from '../../hooks/useVoiceSearch';
import { HistoricalTimelineTrail } from './HistoricalTimelineTrail';

export const CinematicHero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const prefersReducedMotion = useReducedMotion();
  const { isListening, isSupported, startListening, stopListening } = useVoiceSearch();

  const [hasVisited] = useState(() => {
    try {
      return sessionStorage.getItem('ambedkar_hero_seen') === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('ambedkar_hero_seen', 'true');
    } catch {
      // ignore
    }
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/archive?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/archive');
    }
  };

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcribedText) => {
        setSearchQuery(transcribedText);
      });
    }
  };

  // Entrance duration (fast if visited or reduced motion)
  const animDuration = prefersReducedMotion || hasVisited ? 0.3 : 1.1;
  const staggerDelay = prefersReducedMotion || hasVisited ? 0 : 0.25;

  return (
    <section
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[700px] overflow-hidden bg-[#F5EBDD] flex items-center paper-grain border-b border-[#DED3C2]"
      aria-label="Ambedkar Atlas Hero"
    >
      {/* Subtle Archival Ambient Lighting */}
      <div className="absolute inset-0 bg-radial from-[#FFFDF9]/60 via-[#F5EBDD]/40 to-transparent pointer-events-none z-0" />

      {/* Background Decorative Archival Colonnade Lines (Subtle) */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-15 pointer-events-none bg-[radial-gradient(#713F2B_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Decorative Continuous Historical Timeline Trail & Floating Milestone Cards */}
      <HistoricalTimelineTrail hasVisited={hasVisited} />

      {/* Layer 1: Crowd SVG Background (Subtle ambient looped sway) */}
      <motion.div
        className="absolute bottom-0 right-0 w-full sm:w-[90%] md:w-[85%] lg:w-[78%] xl:w-[75%] h-[58%] sm:h-[68%] md:h-[75%] pointer-events-none z-10"
        initial={hasVisited ? { opacity: 0.95, y: 0 } : { opacity: 0, y: 25 }}
        animate={
          prefersReducedMotion
            ? { opacity: 0.95, y: 0 }
            : {
                opacity: 0.95,
                y: [0, -7, 0],
                transition: {
                  y: {
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 7,
                    ease: 'easeInOut',
                  },
                  opacity: { duration: animDuration, ease: 'easeOut' },
                },
              }
        }
      >
        <div className="relative w-full h-full">
          <img
            src={HERO_ASSETS.historicalCrowd}
            alt="Historical Gathering Audience"
            className="w-full h-full object-contain object-bottom filter sepia-[0.25] opacity-90"
          />
          {/* Bottom fade gradient to blend seamlessly into Antique Ivory background */}
          <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-[#F5EBDD] via-[#F5EBDD]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F5EBDD] to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Layer 2: Dr. B. R. Ambedkar Transparent PNG Foreground (Subtle majestic breathing loop) */}
      <motion.div
        className="absolute bottom-0 left-0 sm:left-2 md:left-4 lg:left-6 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[680px] h-[85%] sm:h-[95%] lg:h-[105%] origin-bottom-left scale-100 sm:scale-105 lg:scale-[1.22] xl:scale-[1.30] pointer-events-none z-20"
        initial={hasVisited ? { opacity: 1, x: 0 } : { opacity: 0, x: -35 }}
        animate={
          prefersReducedMotion
            ? { opacity: 1, x: 0, y: 0 }
            : {
                opacity: 1,
                x: 0,
                y: [0, -5, 0],
                transition: {
                  y: {
                    repeat: Infinity,
                    repeatType: 'reverse',
                    duration: 5.5,
                    ease: 'easeInOut',
                    delay: staggerDelay,
                  },
                  opacity: { duration: animDuration, delay: staggerDelay, ease: 'easeOut' },
                  x: { duration: animDuration, delay: staggerDelay, ease: 'easeOut' },
                },
              }
        }
      >
        <div className="relative w-full h-full flex items-end">
          <img
            src={HERO_ASSETS.ambedkarPortrait}
            alt="Dr. B. R. Ambedkar"
            className="w-full h-full object-contain object-bottom filter drop-shadow-[0_12px_24px_rgba(41,37,31,0.22)]"
          />
          {/* Subtle bottom fade so base dissolves naturally */}
          <div className="absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-t from-[#F5EBDD] to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Layer 3: Above-Ambedkar Action Hub with Museum Trail Lines (Top Left) */}
      <motion.div
        className="relative lg:absolute top-4 sm:top-6 lg:top-10 left-4 sm:left-6 lg:left-12 z-30 max-w-sm sm:max-w-md pt-4 sm:pt-6 lg:pt-0"
        initial={hasVisited ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animDuration, delay: staggerDelay, ease: 'easeOut' }}
      >
        {/* Action Buttons Cluster */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 bg-[#FBF8F2]/90 backdrop-blur-xs p-1.5 sm:p-2 rounded-2xl border border-[#DED3C2] shadow-xs">
          <button
            onClick={() => navigate('/archive')}
            className="px-3.5 sm:px-4 py-2 bg-[#29251F] hover:bg-[#3E3830] text-[#FBF8F2] text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 group"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B96535] group-hover:scale-110 transition-transform" />
            <span>Explore Archive</span>
          </button>

          <button
            onClick={() => navigate('/timeline')}
            className="px-3.5 sm:px-4 py-2 bg-[#E7D5B9]/90 hover:bg-[#E7D5B9] text-[#29251F] text-xs sm:text-sm font-semibold rounded-xl transition-all border border-[#DED3C2] flex items-center gap-2 group"
          >
            <Clock className="w-3.5 h-3.5 text-[#713F2B] group-hover:scale-110 transition-transform" />
            <span>Explore Timeline</span>
          </button>
        </div>
      </motion.div>

      {/* Layer 4: Top-Right Editorial & Repositioned Search Hub (Occupying empty space above crowd) */}
      <motion.div
        className="relative lg:absolute top-4 sm:top-6 lg:top-10 right-4 sm:right-6 lg:right-12 xl:right-16 z-30 max-w-lg lg:max-w-xl text-left lg:text-right space-y-3 sm:space-y-4 px-4 sm:px-6 lg:px-0 pt-4 sm:pt-6 lg:pt-0"
        initial={hasVisited ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animDuration, delay: staggerDelay * 1.5, ease: 'easeOut' }}
      >
        {/* Main Heading: 1st line Archival Ink, 2nd line Burnt Terracotta */}
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#29251F] tracking-tight leading-[1.12]">
          Architect of Equality. <br />
          <span className="text-[#B96535]">Voice of the Republic.</span>
        </h1>

        {/* Short, Readable Description */}
        <p className="text-sm sm:text-base lg:text-lg text-[#51483F] leading-relaxed max-w-lg lg:ml-auto font-normal">
          Explore the writings, speeches and legacy of Dr. B. R. Ambedkar through a digital archive of historical documents and records.
        </p>

        {/* Repositioned Search Bar directly beneath description */}
        <form onSubmit={handleSearchSubmit} className="pt-1 max-w-lg lg:ml-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search writings, speeches, historical events..."
              className="w-full pl-11 pr-36 py-3 sm:py-3.5 text-xs sm:text-sm bg-[#FBF8F2]/95 backdrop-blur-xs border-2 border-[#DED3C2] rounded-xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:border-[#B96535] shadow-xs transition-all"
            />
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#827567] absolute left-3.5 pointer-events-none" />

            <div className="absolute right-2 flex items-center gap-1.5">
              {/* Voice Search Microphone Button */}
              <button
                type="button"
                onClick={handleVoiceToggle}
                title={isListening ? 'Stop listening' : 'Search by voice'}
                className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center justify-center ${
                  isListening
                    ? 'bg-red-600 text-white animate-pulse'
                    : 'text-[#827567] hover:text-[#B96535] hover:bg-[#E7D5B9]/60'
                }`}
              >
                {isListening ? <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
              </button>

              <button
                type="submit"
                className="px-3 py-1.5 sm:px-3.5 sm:py-2 bg-[#B96535] hover:bg-[#713F2B] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </section>
  );
};
