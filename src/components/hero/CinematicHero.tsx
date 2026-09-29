import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowRight, BookOpen, Clock } from 'lucide-react';
import { HERO_ASSETS } from '../../assets/hero/heroAssets';

export const CinematicHero: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const [hasVisited, setHasVisited] = useState(() => {
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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMouseOffset({ x, y });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/archive?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/archive');
    }
  };

  // Entrance durations: 0 if previously visited or reduced motion
  const animDuration = prefersReducedMotion || hasVisited ? 0.3 : 1.1;
  const staggerDelay = prefersReducedMotion || hasVisited ? 0 : 0.25;

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[600px] sm:min-h-[660px] lg:min-h-[720px] overflow-hidden bg-[#F5EBDD] flex items-center paper-grain border-b border-[#DED3C2]"
      aria-label="Ambedkar Atlas Hero"
    >
      {/* Subtle Archival Ambient Lighting */}
      <div className="absolute inset-0 bg-radial from-[#FFFDF9]/60 via-[#F5EBDD]/40 to-transparent pointer-events-none z-0" />

      {/* Background Decorative Archival Colonnade Lines (Subtle) */}
      <div className="absolute top-0 right-0 w-1/2 h-full opacity-15 pointer-events-none bg-[radial-gradient(#713F2B_1px,transparent_1px)] [background-size:24px_24px] z-0" />

      {/* Layer 1: Crowd SVG Background (Facing left towards Ambedkar) */}
      <motion.div
        className="absolute bottom-0 right-0 w-full sm:w-[90%] md:w-[85%] lg:w-[78%] xl:w-[75%] h-[58%] sm:h-[68%] md:h-[75%] pointer-events-none z-10"
        initial={hasVisited ? { opacity: 0.9, y: 0 } : { opacity: 0, y: 25 }}
        animate={{ opacity: 0.95, y: 0 }}
        transition={{ duration: animDuration, ease: 'easeOut' }}
        style={{
          x: prefersReducedMotion ? 0 : mouseOffset.x * -18,
          y: prefersReducedMotion ? 0 : mouseOffset.y * -10,
        }}
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

      {/* Layer 2: Dr. B. R. Ambedkar Transparent PNG Foreground (Increased Prominence & Scale) */}
      <motion.div
        className="absolute bottom-0 left-0 sm:left-2 md:left-4 lg:left-6 w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-[680px] h-[85%] sm:h-[95%] lg:h-[105%] origin-bottom-left scale-100 sm:scale-105 lg:scale-[1.22] xl:scale-[1.30] pointer-events-none z-20"
        initial={hasVisited ? { opacity: 1, x: 0 } : { opacity: 0, x: -35 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: animDuration, delay: staggerDelay, ease: 'easeOut' }}
        style={{
          x: prefersReducedMotion ? 0 : mouseOffset.x * 22,
          y: prefersReducedMotion ? 0 : mouseOffset.y * 12,
        }}
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

      {/* Layer 3: Editorial Typography & Actions (Right Side, No Card Frame, Directly on Ivory Ground) */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-30 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          {/* Spacer to guarantee Ambedkar's silhouette on the left is never obstructed */}
          <div className="hidden lg:block lg:w-5/12 xl:w-5/12 shrink-0 pointer-events-none" />

          {/* Clean Editorial Content Column (Seamless, No Box/Card) */}
          <motion.div
            className="w-full lg:w-7/12 xl:w-7/12 max-w-2xl lg:ml-auto space-y-5"
            initial={hasVisited ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: animDuration, delay: staggerDelay * 2, ease: 'easeOut' }}
          >
            {/* Archival Eyebrow */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7D5B9]/80 text-[#713F2B] text-xs font-semibold tracking-wider uppercase border border-[#DED3C2]">
                <img src="/seal.svg" alt="" className="w-3.5 h-3.5" />
                <span>The National Digital Heritage Archive</span>
              </span>
            </div>

            {/* Display Heading */}
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-[#29251F] tracking-tight leading-[1.12]">
              Architect of Equality. <br />
              <span className="text-[#B96535] italic font-normal">Voice of the Republic.</span>
            </h1>

            {/* Concise Editorial Intro */}
            <p className="text-base sm:text-lg text-[#51483F] leading-relaxed font-normal">
              Explore the verified writings, historic speeches, constitutional deliberations, and audiovisual heritage of <strong className="font-semibold text-[#29251F]">Dr. Bhimrao Ramji Ambedkar</strong> (1891–1956).
            </p>

            {/* Prominent Search Bar */}
            <form onSubmit={handleSearchSubmit} className="pt-1">
              <div className="relative flex items-center max-w-xl">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search Annihilation of Caste, Constituent Assembly, Mahad..."
                  className="w-full pl-11 pr-28 py-3.5 text-sm sm:text-base bg-[#FBF8F2] border-2 border-[#DED3C2] rounded-xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:border-[#B96535] shadow-xs transition-all"
                />
                <Search className="w-5 h-5 text-[#827567] absolute left-3.5 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-[#B96535] hover:bg-[#713F2B] text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Explore</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Key Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/archive')}
                className="px-5 py-2.5 bg-[#29251F] hover:bg-[#3E3830] text-[#FBF8F2] text-sm font-semibold rounded-lg transition-all shadow-xs flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4 text-[#B96535]" />
                <span>Explore Catalog</span>
              </button>

              <button
                onClick={() => navigate('/timeline')}
                className="px-5 py-2.5 bg-[#E7D5B9]/80 hover:bg-[#E7D5B9] text-[#29251F] text-sm font-semibold rounded-lg transition-all border border-[#DED3C2] flex items-center gap-2"
              >
                <Clock className="w-4 h-4 text-[#713F2B]" />
                <span>Historical Timeline (1891–1956)</span>
              </button>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
