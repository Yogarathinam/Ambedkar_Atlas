import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import { ArrowRight, BookOpen, Scale, Landmark, Coins, Globe, HeartHandshake } from 'lucide-react';

interface MeaDivisionCard {
  id: string;
  title: string;
  countBadge: string;
  description: string;
  icon: React.ReactNode;
  filterUrl: string;
}

export const CollectionsGrid: React.FC = () => {
  const navigate = useNavigate();

  const divisions: MeaDivisionCard[] = [
    {
      id: 'english-baws',
      title: 'English Edition (BAWS)',
      countBadge: '20 PDF Documents • 17 Vols',
      description: 'The complete English library Dr. Babasaheb Ambedkar: Writings and Speeches, including specialized multi-part treatises.',
      icon: <BookOpen className="w-5 h-5 text-[#B96535]" />,
      filterUrl: '/archive?language=English',
    },
    {
      id: 'hindi-vangmaya',
      title: 'Hindi Edition (सम्पूर्ण वाङ्मय)',
      countBadge: '40 PDF Documents • 40 Vols',
      description: 'Authoritative Hindi translations published by the Dr. Ambedkar Foundation and digitally preserved by the Ministry of External Affairs.',
      icon: <Globe className="w-5 h-5 text-[#713F2B]" />,
      filterUrl: '/archive?language=Hindi',
    },
    {
      id: 'caste-sociology',
      title: 'Sociological & Caste Critique',
      countBadge: 'Volume 1 & Parts',
      description: 'Foundational texts including Castes in India (1916), Annihilation of Caste (1936), and States and Minorities.',
      icon: <Scale className="w-5 h-5 text-[#B96535]" />,
      filterUrl: '/archive?vol=1',
    },
    {
      id: 'economics-finance',
      title: 'Monetary Economics & Currency',
      countBadge: 'Volume 6 & Treatises',
      description: 'The Problem of the Rupee (1923) and The Evolution of Provincial Finance, the conceptual blueprint for the Reserve Bank of India.',
      icon: <Coins className="w-5 h-5 text-[#713F2B]" />,
      filterUrl: '/archive?vol=6',
    },
    {
      id: 'constitution-debates',
      title: 'Constituent Assembly Debates',
      countBadge: 'Volume 13 (CAD)',
      description: 'Speeches introducing the Draft Constitution, defending parliamentary democracy, and the historic "Grammar of Anarchy" address.',
      icon: <Landmark className="w-5 h-5 text-[#B96535]" />,
      filterUrl: '/archive?vol=13',
    },
    {
      id: 'movement-conversion',
      title: 'Social Movements & Dhamma',
      countBadge: 'Volume 17 (3 Parts)',
      description: 'Documentation of the Mahad Satyagraha, Poona Pact, Yeola Declaration, and the Great Buddhist Conversion at Deekshabhoomi.',
      icon: <HeartHandshake className="w-5 h-5 text-[#713F2B]" />,
      filterUrl: '/archive?vol=17',
    },
  ];

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
      transition: { duration: 0.45, ease: 'easeOut' },
    },
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20" aria-label="Official MEA Collections">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535]">
          Government of India Authenticated Archive
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#29251F] tracking-tight">
          Official Books & Writings
        </h2>
        <p className="text-sm sm:text-base text-[#51483F] leading-relaxed pt-1">
          Explore 60 verified PDF documents across 57 numbered volumes published by the Ministry of External Affairs and the Dr. Ambedkar Foundation. Every volume includes full facsimiles and verified chapter contents.
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
        {divisions.map((item) => (
          <motion.div
            key={item.id}
            variants={cardVariants}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            onClick={() => navigate(item.filterUrl)}
            className="group relative bg-[#FBF8F2] border-2 border-[#DED3C2] hover:border-[#B96535] rounded-3xl p-6 sm:p-7 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden"
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate(item.filterUrl);
              }
            }}
          >
            <div>
              {/* Header Row: Count Badge & Icon */}
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="w-11 h-11 rounded-2xl bg-[#F5EBDD] flex items-center justify-center border border-[#DED3C2] group-hover:bg-[#E7D5B9] transition-colors">
                  {item.icon}
                </div>
                <span className="text-[11px] font-bold text-[#713F2B] bg-[#E7D5B9]/70 px-3 py-1 rounded-full border border-[#DED3C2]">
                  {item.countBadge}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#29251F] group-hover:text-[#B96535] transition-colors mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#51483F] leading-relaxed line-clamp-3">
                {item.description}
              </p>
            </div>

            {/* Action Button Link */}
            <div className="pt-5 mt-4 border-t border-[#DED3C2] flex items-center justify-between text-xs font-bold text-[#B96535] group-hover:text-[#713F2B] transition-colors">
              <span>Explore Volumes</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200" />
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
