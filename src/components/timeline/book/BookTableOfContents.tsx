import React from 'react';
import { TimelineEvent } from '../../../types';
import { BookOpen, ChevronRight, Calendar, Bookmark, ArrowRight, ShieldCheck } from 'lucide-react';

interface BookTableOfContentsProps {
  events: TimelineEvent[];
  onSelectSpread: (spreadIndex: number) => void;
  onJumpToYear: (year: number) => void;
}

interface EpochSection {
  id: string;
  period: string;
  title: string;
  summary: string;
  startYear: number;
  highlightYears: number[];
}

const CANONICAL_EPOCHS: EpochSection[] = [
  {
    id: 'early-life',
    period: '1891–1912',
    title: 'Early Life & Academic Foundation',
    summary: 'Mhow birth, matriculation at Elphinstone & B.A. degree.',
    startYear: 1891,
    highlightYears: [1891, 1907],
  },
  {
    id: 'columbia-lse',
    period: '1913–1923',
    title: 'Columbia, LSE & London Bar',
    summary: 'Doctorates in New York & London, Gray\'s Inn Bar, Mooknayak.',
    startYear: 1913,
    highlightYears: [1913, 1916, 1920, 1923],
  },
  {
    id: 'mahad-poona',
    period: '1924–1935',
    title: 'Mass Emancipation & Poona Pact',
    summary: 'Mahad Water Satyagraha, Manusmriti Dahan, Round Table & Pact.',
    startYear: 1924,
    highlightYears: [1924, 1927, 1930, 1932],
  },
  {
    id: 'annihilation-labour',
    period: '1936–1946',
    title: 'Annihilation of Caste & Labour',
    summary: 'Foundational treatise, Independent Labour Party & Viceroy\'s Council.',
    startYear: 1936,
    highlightYears: [1936, 1942, 1946],
  },
  {
    id: 'constitution-law',
    period: '1947–1951',
    title: 'Chief Architect of Constitution',
    summary: 'Drafting Committee Chair, Republic\'s Constitution & Law Ministry.',
    startYear: 1947,
    highlightYears: [1947, 1948, 1949, 1951],
  },
  {
    id: 'buddhist-revival',
    period: '1952–1956',
    title: 'Buddhist Revival & Eternal Legacy',
    summary: 'Rajya Sabha tenure, The Buddha and His Dhamma & Deekshabhoomi.',
    startYear: 1952,
    highlightYears: [1952, 1956],
  },
];

export const BookTableOfContents: React.FC<BookTableOfContentsProps> = ({
  events,
  onSelectSpread,
  onJumpToYear,
}) => {
  // Helper to find the 1-based spread index for a given start year
  const getSpreadForYear = (year: number): number => {
    const idx = events.findIndex((e) => e.year >= year);
    return idx !== -1 ? idx + 1 : 1;
  };

  // Helper to count how many milestones belong to an epoch
  const getMilestoneCount = (startYear: number, nextStartYear?: number): number => {
    return events.filter((e) => {
      if (nextStartYear) {
        return e.year >= startYear && e.year < nextStartYear;
      }
      return e.year >= startYear;
    }).length;
  };

  return (
    <div className="w-full md:w-1/2 h-full bg-[#FAF4EA] flex flex-col justify-between p-3 sm:p-5 lg:p-6 relative overflow-hidden shadow-[inset_8px_0_16px_rgba(0,0,0,0.04)] select-text font-serif">
      
      {/* Subtle Archival Gutter Shadow along the left edge (Center Spine) */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/20 via-black/8 to-transparent pointer-events-none" />

      {/* Recto Running Header */}
      <div className="flex items-center justify-between pb-1.5 border-b border-[#DED3C2]/70 text-[10px] sm:text-[11px] font-mono tracking-wider text-[#827567] uppercase shrink-0">
        <span className="font-semibold text-[#713F2B]">Table of Contents</span>
        <span className="hidden sm:inline text-center">Conspectus Chronologicum</span>
        <span className="font-semibold text-[#713F2B]">p. 1</span>
      </div>

      {/* Header & Inscription */}
      <div className="space-y-0.5 pt-1 shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="font-serif text-base sm:text-lg lg:text-xl font-bold text-[#29251F] tracking-tight">
            Chronological Directory
          </h3>
          <span className="text-[10px] font-mono text-[#B96535] bg-[#E7D5B9]/60 px-2 py-0.5 rounded-full border border-[#DED3C2] font-semibold">
            {events.length} Milestones
          </span>
        </div>
        <p className="text-[10px] sm:text-[11px] font-serif italic text-[#713F2B] leading-tight">
          Traverse the six historic epochs in the life, writings, and constitutional legacy of Babasaheb Dr. B. R. Ambedkar.
        </p>
      </div>

      {/* Epochs List (Chronological Table of Contents) */}
      <div className="my-auto space-y-1 sm:space-y-1.5 py-1">
        {CANONICAL_EPOCHS.map((epoch, idx) => {
          const nextEpoch = CANONICAL_EPOCHS[idx + 1];
          const spreadNum = getSpreadForYear(epoch.startYear);
          const count = getMilestoneCount(epoch.startYear, nextEpoch?.startYear);

          return (
            <button
              key={epoch.id}
              type="button"
              onClick={() => onSelectSpread(spreadNum)}
              className="w-full flex items-center justify-between text-left group px-2 py-1 rounded-lg hover:bg-[#F5EBDD] transition-colors cursor-pointer border border-transparent hover:border-[#DED3C2]"
              title={`Turn book to ${epoch.title} (Page ${spreadNum})`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Epoch Period Badge */}
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-[#E7D5B9] text-[#713F2B] border border-[#DED3C2] shrink-0 group-hover:bg-[#B96535] group-hover:text-white transition-colors">
                  {epoch.period}
                </span>

                {/* Title & Short Summary */}
                <div className="min-w-0 flex-1">
                  <div className="text-xs sm:text-[13px] font-serif font-bold text-[#29251F] group-hover:text-[#B96535] truncate transition-colors">
                    {epoch.title}
                  </div>
                  <div className="text-[10px] text-[#827567] truncate hidden sm:block">
                    {epoch.summary}
                  </div>
                </div>
              </div>

              {/* Dotted Leader Line & Target Page */}
              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                <span className="text-[10px] font-mono text-[#827567] hidden md:inline">
                  {count} {count === 1 ? 'event' : 'events'}
                </span>
                <span className="text-[10px] sm:text-[11px] font-mono font-bold text-[#713F2B] bg-[#FAF4EA] group-hover:bg-[#E7D5B9] px-1.5 py-0.5 rounded border border-[#DED3C2] transition-colors">
                  p. {spreadNum}
                </span>
                <ChevronRight className="w-3 h-3 text-[#B96535] opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Quick Key-Year Selector Pills */}
      <div className="pt-1.5 pb-0.5 border-t border-[#DED3C2]/70 flex flex-wrap items-center justify-between gap-1 shrink-0 text-[10px] font-mono">
        <span className="text-[#827567] hidden sm:inline">Jump to Year:</span>
        <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
          {[1891, 1916, 1927, 1932, 1936, 1947, 1949, 1956].map((yr) => (
            <button
              key={yr}
              type="button"
              onClick={() => onJumpToYear(yr)}
              className="px-1.5 py-0.5 rounded bg-[#FAF4EA] hover:bg-[#B96535] hover:text-white text-[#713F2B] border border-[#DED3C2] transition-colors cursor-pointer"
              title={`Turn directly to year ${yr}`}
            >
              {yr}
            </button>
          ))}
        </div>
      </div>

      {/* Footer CTA: Begin Reading */}
      <div className="pt-1.5 border-t border-[#DED3C2]/70 flex items-center justify-between gap-2 shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#827567]">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Authenticated MEA Holdings</span>
          <span className="sm:hidden">MEA Verified</span>
        </div>

        <button
          type="button"
          onClick={() => onSelectSpread(1)}
          className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#B96535] hover:bg-[#713F2B] text-white text-[10px] sm:text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
          title="Turn to Milestone 1: Birth at Mhow Cantonment (1891)"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Begin Chronicle (1891)</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
