import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, BookOpen, Mic, Scroll, Image, Radio, Film } from 'lucide-react';
import { ARCHIVE_CATEGORIES } from '../../data/categories';

export const CollectionsGrid: React.FC = () => {
  const navigate = useNavigate();

  // Category visual metadata with custom SVG artwork badges
  const categoryVisuals: Record<string, {
    bgGradient: string;
    accentColor: string;
    icon: React.ReactNode;
    svgIllustration: React.ReactNode;
  }> = {
    writings: {
      bgGradient: 'from-[#E7D5B9]/40 to-[#FBF8F2]',
      accentColor: '#B96535',
      icon: <BookOpen className="w-5 h-5 text-[#B96535]" />,
      svgIllustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 opacity-85 group-hover:scale-105 transition-transform duration-300">
          <path d="M10,20 Q30,10 50,22 Q70,10 90,20 L90,65 Q70,55 50,67 Q30,55 10,65 Z" fill="#F5EBDD" stroke="#713F2B" strokeWidth="2.5" />
          <line x1="50" y1="22" x2="50" y2="67" stroke="#713F2B" strokeWidth="2.5" />
          <line x1="20" y1="32" x2="42" y2="35" stroke="#827567" strokeWidth="1.5" strokeDasharray="2,2" />
          <line x1="20" y1="42" x2="42" y2="45" stroke="#827567" strokeWidth="1.5" strokeDasharray="2,2" />
          <line x1="58" y1="35" x2="80" y2="32" stroke="#827567" strokeWidth="1.5" strokeDasharray="2,2" />
          <line x1="58" y1="45" x2="80" y2="42" stroke="#827567" strokeWidth="1.5" strokeDasharray="2,2" />
          {/* Bookmark ribbon */}
          <path d="M47,20 L47,40 L50,37 L53,40 L53,20 Z" fill="#B96535" />
        </svg>
      ),
    },
    speeches: {
      bgGradient: 'from-[#E7D5B9]/40 to-[#FBF8F2]',
      accentColor: '#713F2B',
      icon: <Mic className="w-5 h-5 text-[#713F2B]" />,
      svgIllustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 opacity-85 group-hover:scale-105 transition-transform duration-300">
          <rect x="42" y="15" width="16" height="28" rx="8" fill="#F5EBDD" stroke="#713F2B" strokeWidth="2.5" />
          <path d="M34,28 C34,42 66,42 66,28" fill="none" stroke="#713F2B" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="50" y1="42" x2="50" y2="62" stroke="#713F2B" strokeWidth="3" />
          <line x1="38" y1="62" x2="62" y2="62" stroke="#713F2B" strokeWidth="3" strokeLinecap="round" />
          {/* Sound waves */}
          <path d="M26,22 C22,27 22,35 26,40" fill="none" stroke="#B96535" strokeWidth="2" strokeLinecap="round" />
          <path d="M74,22 C78,27 78,35 74,40" fill="none" stroke="#B96535" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    manuscripts: {
      bgGradient: 'from-[#E7D5B9]/40 to-[#FBF8F2]',
      accentColor: '#B96535',
      icon: <Scroll className="w-5 h-5 text-[#B96535]" />,
      svgIllustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 opacity-85 group-hover:scale-105 transition-transform duration-300">
          <path d="M25,18 C20,18 18,22 18,26 L18,58 C18,64 24,66 28,66 L75,66 C80,66 82,62 82,58 L82,26 C82,20 76,18 72,18 Z" fill="#F5EBDD" stroke="#713F2B" strokeWidth="2.5" />
          <path d="M28,18 C28,24 22,24 22,18" fill="none" stroke="#713F2B" strokeWidth="2" />
          <line x1="32" y1="28" x2="68" y2="28" stroke="#827567" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="36" x2="68" y2="36" stroke="#827567" strokeWidth="2" strokeLinecap="round" />
          <line x1="32" y1="44" x2="55" y2="44" stroke="#827567" strokeWidth="2" strokeLinecap="round" />
          {/* Wax seal */}
          <circle cx="65" cy="52" r="8" fill="#B96535" stroke="#713F2B" strokeWidth="1.5" />
          <circle cx="65" cy="52" r="4" fill="#E7D5B9" />
        </svg>
      ),
    },
    photographs: {
      bgGradient: 'from-[#E7D5B9]/40 to-[#FBF8F2]',
      accentColor: '#713F2B',
      icon: <Image className="w-5 h-5 text-[#713F2B]" />,
      svgIllustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 opacity-85 group-hover:scale-105 transition-transform duration-300">
          <rect x="18" y="16" width="64" height="48" rx="4" fill="#F5EBDD" stroke="#713F2B" strokeWidth="2.5" />
          <circle cx="34" cy="30" r="5" fill="#B96535" />
          <path d="M22,56 L38,40 L52,50 L64,36 L78,56 Z" fill="#E7D5B9" stroke="#713F2B" strokeWidth="2" strokeLinejoin="round" />
        </svg>
      ),
    },
    audio: {
      bgGradient: 'from-[#E7D5B9]/40 to-[#FBF8F2]',
      accentColor: '#B96535',
      icon: <Radio className="w-5 h-5 text-[#B96535]" />,
      svgIllustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 opacity-85 group-hover:scale-105 transition-transform duration-300">
          <circle cx="50" cy="40" r="26" fill="#F5EBDD" stroke="#713F2B" strokeWidth="2.5" />
          <circle cx="50" cy="40" r="18" fill="none" stroke="#827567" strokeWidth="1" strokeDasharray="3,3" />
          <circle cx="50" cy="40" r="8" fill="#B96535" stroke="#713F2B" strokeWidth="1.5" />
          <circle cx="50" cy="40" r="2.5" fill="#F5EBDD" />
          {/* Tone arm needle */}
          <line x1="78" y1="18" x2="60" y2="35" stroke="#713F2B" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      ),
    },
    video: {
      bgGradient: 'from-[#E7D5B9]/40 to-[#FBF8F2]',
      accentColor: '#713F2B',
      icon: <Film className="w-5 h-5 text-[#713F2B]" />,
      svgIllustration: (
        <svg viewBox="0 0 100 80" className="w-20 h-16 opacity-85 group-hover:scale-105 transition-transform duration-300">
          <rect x="18" y="20" width="64" height="42" rx="3" fill="#F5EBDD" stroke="#713F2B" strokeWidth="2.5" />
          {/* Film perforations */}
          <rect x="22" y="23" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="34" y="23" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="46" y="23" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="58" y="23" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="70" y="23" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="22" y="54" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="34" y="54" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="46" y="54" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="58" y="54" width="5" height="5" rx="1" fill="#713F2B" />
          <rect x="70" y="54" width="5" height="5" rx="1" fill="#713F2B" />
          {/* Play triangle */}
          <polygon points="45,34 57,41 45,48" fill="#B96535" />
        </svg>
      ),
    },
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" aria-label="Archival Collections">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535]">
          Curated Holdings
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29251F] tracking-tight">
          Archival Collections
        </h2>
        <p className="text-sm sm:text-base text-[#51483F] leading-relaxed pt-1">
          Explore the preserved literary, oratorical, calligraphic, and media legacy of Dr. B. R. Ambedkar across six authenticated divisions.
        </p>
      </div>

      {/* Modern Animated 6-Card Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
      >
        {ARCHIVE_CATEGORIES.slice(0, 6).map((cat) => {
          const visual = categoryVisuals[cat.id] || categoryVisuals.writings;
          return (
            <motion.div
              key={cat.id}
              variants={cardVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              onClick={() => navigate(`/archive?category=${cat.id}`)}
              className="group relative bg-[#FBF8F2] border border-[#DED3C2] hover:border-[#B96535] rounded-2xl p-6 sm:p-7 shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
              tabIndex={0}
              role="button"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(`/archive?category=${cat.id}`);
                }
              }}
            >
              {/* Top ambient color tint */}
              <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[${visual.accentColor}] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

              <div>
                {/* Header Row: Count & Custom Vector Art */}
                <div className="flex items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-xl bg-[#F5EBDD] flex items-center justify-center border border-[#DED3C2] group-hover:bg-[#E7D5B9] transition-colors">
                      {visual.icon}
                    </div>
                    <span className="text-xs font-semibold text-[#713F2B] bg-[#E7D5B9]/70 px-2.5 py-1 rounded-full border border-[#DED3C2]">
                      {cat.count} Records
                    </span>
                  </div>

                  <div className="shrink-0">
                    {visual.svgIllustration}
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#29251F] group-hover:text-[#B96535] transition-colors mb-2">
                  {cat.title}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-sm text-[#51483F] leading-relaxed line-clamp-3">
                  {cat.description}
                </p>
              </div>

              {/* Action Button Link */}
              <div className="pt-5 mt-4 border-t border-[#DED3C2] flex items-center justify-between text-xs font-semibold text-[#B96535] group-hover:text-[#713F2B] transition-colors">
                <span>Browse Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};
