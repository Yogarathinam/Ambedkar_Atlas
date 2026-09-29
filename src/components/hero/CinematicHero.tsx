import React, { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Clock, Mic, MicOff, CheckCircle2 } from 'lucide-react';
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
      className="relative min-h-[580px] sm:min-h-[640px] lg:min-h-[720px] overflow-hidden bg-[#F5EBDD] flex flex-col justify-center lg:block paper-grain border-b border-[#DED3C2] px-4 sm:px-6 lg:px-8 py-8 lg:py-0"
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
        className="absolute bottom-0 right-0 w-full sm:w-[90%] md:w-[85%] lg:w-[78%] xl:w-[75%] h-[45%] sm:h-[60%] lg:h-[75%] pointer-events-none z-10 transform-gpu will-change-transform opacity-40 lg:opacity-95"
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
            className="w-full h-full object-contain object-bottom opacity-85"
          />
          {/* Bottom fade gradient to blend seamlessly into Antique Ivory background */}
          <div className="absolute inset-x-0 bottom-0 h-16 sm:h-24 bg-gradient-to-t from-[#F5EBDD] via-[#F5EBDD]/80 to-transparent pointer-events-none" />
          <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F5EBDD] to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Layer 2: Dr. B. R. Ambedkar Transparent Portrait */}
      {/* On mobile: subtly watermark anchored at bottom-right (opacity 30%) so hero card is clearly readable */}
      {/* On desktop: full majestic foreground presence on the left */}
      <motion.div
        className="absolute bottom-0 right-0 sm:right-4 lg:right-auto lg:left-6 w-[240px] sm:w-[320px] md:w-[420px] lg:w-[600px] xl:w-[680px] h-[60%] sm:h-[75%] lg:h-[105%] origin-bottom-left scale-100 sm:scale-105 lg:scale-[1.22] xl:scale-[1.30] pointer-events-none z-10 lg:z-20 transform-gpu will-change-transform opacity-30 sm:opacity-40 lg:opacity-100"
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
            className="w-full h-full object-contain object-bottom"
          />
          {/* Subtle bottom fade so base dissolves naturally */}
          <div className="absolute inset-x-0 bottom-0 h-8 sm:h-12 bg-gradient-to-t from-[#F5EBDD] to-transparent pointer-events-none" />
        </div>
      </motion.div>

      {/* Desktop-only Action Hub above Ambedkar portrait (Top-Left) */}
      <motion.div
        className="hidden lg:block lg:absolute lg:top-10 lg:left-12 z-30 max-w-sm sm:max-w-md"
        initial={hasVisited ? { opacity: 1, y: 0 } : { opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animDuration, delay: staggerDelay, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-2.5 bg-white/70 backdrop-blur-xl backdrop-saturate-150 p-2 rounded-2xl border border-white/80 shadow-[0_10px_30px_rgba(41,37,31,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]">
          <button
            onClick={() => navigate('/archive')}
            className="px-4 py-2 bg-[#29251F]/90 hover:bg-[#29251F] text-[#FBF8F2] text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2 group cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B96535] group-hover:scale-110 transition-transform" />
            <span>Explore Archive</span>
          </button>

          <button
            onClick={() => navigate('/timeline')}
            className="px-4 py-2 bg-white/80 hover:bg-white text-[#29251F] text-xs sm:text-sm font-semibold rounded-xl transition-all border border-white/80 shadow-2xs flex items-center gap-2 group cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#713F2B] group-hover:scale-110 transition-transform" />
            <span>Explore Timeline</span>
          </button>
        </div>
      </motion.div>

      {/* MAIN HERO CARD: Elegant glassmorphic card with reduced concise text and optical frosted sheen */}
      <motion.div
        className="relative w-full max-w-xl mx-auto lg:mx-0 lg:absolute lg:top-8 lg:right-10 xl:right-14 z-30 text-left space-y-4 p-5 sm:p-7 rounded-3xl bg-white/70 backdrop-blur-xl backdrop-saturate-150 border border-white/80 shadow-[0_20px_50px_rgba(41,37,31,0.12),inset_0_1px_1px_0_rgba(255,255,255,0.9),inset_0_0_0_1px_rgba(222,211,194,0.35)] my-auto overflow-hidden transition-all"
        initial={hasVisited ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: animDuration, delay: staggerDelay * 1.5, ease: 'easeOut' }}
      >
        {/* Subtle Frosted Glass Reflection & Sheen */}
        <div className="absolute -top-24 -right-24 w-60 h-60 bg-gradient-to-br from-white/70 via-white/20 to-transparent rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-gradient-to-tr from-[#B96535]/10 via-[#E7D5B9]/25 to-transparent rounded-full blur-2xl pointer-events-none" />

        {/* Eyebrow badge */}
        <div className="flex items-center gap-2 relative z-10">
          <span className="px-3 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider bg-[#B96535]/90 text-white shadow-2xs backdrop-blur-xs">
            Digital Heritage Archive
          </span>
          <span className="text-[11px] text-[#713F2B] font-semibold flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/60 border border-white/80 backdrop-blur-md shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official MEA Repository</span>
          </span>
        </div>

        {/* Main Heading */}
        <h1 className="relative z-10 font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] font-bold text-[#29251F] tracking-tight leading-[1.14]">
          Architect of Equality. <br />
          <span className="text-[#B96535]">Voice of the Republic.</span>
        </h1>

        {/* Concise Description (Reduced text amount) */}
        <p className="relative z-10 text-xs sm:text-sm md:text-base text-[#51483F] leading-relaxed font-normal">
          Explore Dr. B. R. Ambedkar's writings, speeches, and constitutional legacy across 60 verified national volumes.
        </p>

        {/* Search Bar: Frosted glass search input container */}
        <form onSubmit={handleSearchSubmit} className="pt-1 relative z-10">
          <div className="relative flex items-center group/search">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search treatises, speeches, volumes..."
              className="w-full pl-9 sm:pl-11 pr-24 sm:pr-36 py-2.5 sm:py-3 text-xs sm:text-sm bg-white/80 hover:bg-white/95 focus:bg-white border border-white/90 focus:border-[#B96535]/80 rounded-xl text-[#29251F] placeholder-[#827567] focus:outline-none shadow-[inset_0_1px_2px_rgba(0,0,0,0.03),0_2px_8px_rgba(41,37,31,0.04)] backdrop-blur-md transition-all"
            />
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#827567] absolute left-3 pointer-events-none group-focus-within/search:text-[#B96535] transition-colors" />

            <div className="absolute right-1.5 sm:right-2 flex items-center gap-1 sm:gap-1.5">
              {/* Voice Search Microphone Button */}
              {isSupported && (
                <button
                  type="button"
                  onClick={handleVoiceToggle}
                  title={isListening ? 'Stop listening' : 'Search by voice'}
                  className={`p-1.5 sm:p-2 rounded-lg transition-colors flex items-center justify-center cursor-pointer ${
                    isListening
                      ? 'bg-red-600 text-white animate-pulse'
                      : 'text-[#827567] hover:text-[#B96535] hover:bg-[#E7D5B9]/60'
                  }`}
                >
                  {isListening ? <MicOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Mic className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              )}

              <button
                type="submit"
                className="px-3.5 py-1.5 sm:px-4 sm:py-2 bg-[#B96535] hover:bg-[#713F2B] text-white text-xs sm:text-sm font-semibold rounded-lg transition-all flex items-center gap-1 shadow-xs hover:shadow-sm cursor-pointer"
              >
                <span>Explore</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </form>

        {/* Mobile & Tablet Quick Actions (Visible on small screens, integrated seamlessly) */}
        <div className="flex flex-wrap items-center gap-2 pt-2 lg:hidden border-t border-white/60 text-xs relative z-10">
          <button
            onClick={() => navigate('/archive')}
            className="flex-1 py-2 px-3 bg-[#29251F]/90 hover:bg-[#29251F] text-[#FBF8F2] font-semibold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-xs backdrop-blur-sm"
          >
            <BookOpen className="w-3.5 h-3.5 text-[#B96535]" />
            <span>Official Archive</span>
          </button>

          <button
            onClick={() => navigate('/timeline')}
            className="flex-1 py-2 px-3 bg-white/70 hover:bg-white/90 text-[#713F2B] font-semibold rounded-xl text-center flex items-center justify-center gap-1.5 transition-colors border border-white/80 cursor-pointer shadow-xs backdrop-blur-sm"
          >
            <Clock className="w-3.5 h-3.5 text-[#B96535]" />
            <span>Timeline</span>
          </button>
        </div>
      </motion.div>
    </section>
  );
};
