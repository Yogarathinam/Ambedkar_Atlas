import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export interface HistoricalMilestone {
  year: number;
  label: string;
  xPct: number;
  yPct: number;
  svgX: number;
  svgY: number;
  cardPlacement: 'top' | 'bottom';
  visibility: string;
}

// Authentic milestones verified from BAWS and repository records
const MILESTONES: HistoricalMilestone[] = [
  {
    year: 1891,
    label: 'Birth at Mhow',
    xPct: 15,
    yPct: 25,
    svgX: 216,
    svgY: 170,
    cardPlacement: 'bottom',
    visibility: 'hidden xl:flex',
  },
  {
    year: 1913,
    label: 'Columbia University',
    xPct: 28,
    yPct: 44,
    svgX: 403,
    svgY: 299,
    cardPlacement: 'top',
    visibility: 'hidden lg:flex',
  },
  {
    year: 1927,
    label: 'Mahad Satyagraha',
    xPct: 43,
    yPct: 32,
    svgX: 619,
    svgY: 218,
    cardPlacement: 'top',
    visibility: 'hidden md:flex',
  },
  {
    year: 1936,
    label: 'Annihilation of Caste',
    xPct: 56,
    yPct: 48,
    svgX: 806,
    svgY: 326,
    cardPlacement: 'bottom',
    visibility: 'hidden sm:flex',
  },
  {
    year: 1947,
    label: 'Drafting Committee',
    xPct: 71,
    yPct: 28,
    svgX: 1022,
    svgY: 190,
    cardPlacement: 'top',
    visibility: 'flex',
  },
  {
    year: 1950,
    label: 'Republic Constitution',
    xPct: 84,
    yPct: 45,
    svgX: 1210,
    svgY: 306,
    cardPlacement: 'bottom',
    visibility: 'hidden sm:flex',
  },
  {
    year: 1956,
    label: 'Mahaparinirvan',
    xPct: 94,
    yPct: 36,
    svgX: 1354,
    svgY: 245,
    cardPlacement: 'top',
    visibility: 'hidden xl:flex',
  },
];

// Continuous flowing cubic bezier trail across the hero background
const TIMELINE_PATH =
  'M 40,130 C 120,140 170,165 216,170 C 290,180 340,300 403,299 C 480,298 540,210 619,218 C 690,225 745,330 806,326 C 890,320 950,185 1022,190 C 1090,195 1145,310 1210,306 C 1270,302 1315,248 1354,245 C 1390,242 1415,260 1440,270';

interface HistoricalTimelineTrailProps {
  hasVisited: boolean;
}

export const HistoricalTimelineTrail: React.FC<HistoricalTimelineTrailProps> = ({ hasVisited }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-[5] overflow-hidden"
      aria-hidden="true"
    >
      {/* Background SVG Flowing Line & Traveling Highlight */}
      <svg
        viewBox="0 0 1440 680"
        fill="none"
        preserveAspectRatio="none"
        className="w-full h-full opacity-70"
      >
        <defs>
          {/* Subtle antique gold/terracotta traveling highlight gradient */}
          <linearGradient id="travelingHighlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C89B3C" stopOpacity="0" />
            <stop offset="50%" stopColor="#B96535" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#C89B3C" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* 1. Base Subtle Flowing Path */}
        <motion.path
          d={TIMELINE_PATH}
          stroke="#B96535"
          strokeWidth="1.2"
          strokeOpacity="0.22"
          strokeDasharray="4 4"
          initial={hasVisited ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 2.2, ease: 'easeOut' }}
        />

        {/* 2. Traveling Time-Flow Highlight Pulse */}
        {!prefersReducedMotion && (
          <motion.path
            d={TIMELINE_PATH}
            stroke="url(#travelingHighlightGrad)"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeDasharray="70 420"
            initial={{ strokeDashoffset: 0 }}
            animate={{ strokeDashoffset: [0, -980] }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        )}

        {/* 3. Milestone Nodes & Connector Ticks on Path */}
        {MILESTONES.map((m) => (
          <g key={m.year}>
            {/* Soft outer glow ring */}
            <circle
              cx={m.svgX}
              cy={m.svgY}
              r="6"
              stroke="#C89B3C"
              strokeWidth="1"
              strokeOpacity="0.35"
              fill="none"
            />
            {/* Inner core milestone node */}
            <circle
              cx={m.svgX}
              cy={m.svgY}
              r="2.5"
              fill="#B96535"
              opacity="0.65"
            />
            {/* Subtle vertical tick toward annotation card */}
            <line
              x1={m.svgX}
              y1={m.svgY}
              x2={m.svgX}
              y2={m.cardPlacement === 'top' ? m.svgY - 14 : m.svgY + 14}
              stroke="#B96535"
              strokeWidth="1"
              strokeDasharray="2 2"
              strokeOpacity="0.35"
            />
          </g>
        ))}
      </svg>

      {/* Floating Translucent Milestone Annotation Cards */}
      {MILESTONES.map((m, idx) => (
        <motion.div
          key={m.year}
          className={`${m.visibility} absolute flex-col items-center pointer-events-none select-none`}
          style={{
            left: `${m.xPct}%`,
            top: `${m.yPct}%`,
            transform: `translate(-50%, ${m.cardPlacement === 'top' ? '-120%' : '30%'})`,
          }}
          initial={hasVisited ? { opacity: 0.75 } : { opacity: 0, y: m.cardPlacement === 'top' ? 6 : -6 }}
          animate={{ opacity: 0.85, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0 : 0.8,
            delay: prefersReducedMotion ? 0 : 0.5 + idx * 0.16,
            ease: 'easeOut',
          }}
        >
          <div className="bg-[#FBF8F2]/75 hover:bg-[#FBF8F2]/90 backdrop-blur-[2px] border border-[#DED3C2]/70 shadow-[0_2px_8px_rgba(41,37,31,0.03)] px-2.5 py-1 rounded-md transition-all">
            <div className="flex items-center gap-1.5">
              <span className="font-serif font-bold text-xs sm:text-[13px] text-[#713F2B] tracking-tight leading-none">
                {m.year}
              </span>
              <span className="w-1 h-1 rounded-full bg-[#B96535]/40" />
              <span className="text-[10px] text-[#51483F]/85 font-sans tracking-normal whitespace-nowrap leading-none">
                {m.label}
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
