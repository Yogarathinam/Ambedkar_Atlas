import React from 'react';
import { 
  ChevronLeft, ChevronRight, Volume2, VolumeX, 
  RotateCcw, List, BookOpen, Calendar, Sparkles 
} from 'lucide-react';
import { TimelineEvent } from '../../../types';

interface BookControlsProps {
  currentSpreadIndex: number; // 0 = Cover, 1..totalSpreads = events, totalSpreads + 1 = Colophon
  totalSpreads: number;
  events: TimelineEvent[];
  activeYear: number;
  isMuted: boolean;
  viewMode: '3d-book' | 'list';
  onPrevSpread: () => void;
  onNextSpread: () => void;
  onJumpToYear: (year: number) => void;
  onToggleSound: () => void;
  onToggleViewMode: (mode: '3d-book' | 'list') => void;
}

const KEY_YEARS = [
  1891, 1907, 1913, 1916, 1920, 1924, 1927, 
  1930, 1932, 1935, 1936, 1942, 1947, 1948, 1949, 1951, 1956
];

export const BookControls: React.FC<BookControlsProps> = ({
  currentSpreadIndex,
  totalSpreads,
  events,
  activeYear,
  isMuted,
  viewMode,
  onPrevSpread,
  onNextSpread,
  onJumpToYear,
  onToggleSound,
  onToggleViewMode,
}) => {
  const isCover = currentSpreadIndex === 0;
  const isColophon = currentSpreadIndex > totalSpreads;
  const activeEvent = !isCover && !isColophon ? events[currentSpreadIndex - 1] : null;

  return (
    <div className="w-full space-y-3 pointer-events-auto">
      
      {/* Top Floating Museum HUD Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#1A120B]/85 backdrop-blur-xl border border-white/15 shadow-[0_8px_30px_rgba(0,0,0,0.4)] text-xs text-[#F5EBDD]">
        
        {/* Left: Current State Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-serif font-bold text-sm sm:text-base text-[#D4AF37] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            {isCover
              ? 'The Ambedkar Chronicle'
              : isColophon
              ? 'Colophon & Eternal Legacy (1956)'
              : `${activeYear} • ${activeEvent?.title || 'Milestone'}`}
          </span>
          
          <span className="text-[11px] font-mono text-[#C5B8A5] hidden md:inline">
            ({isCover ? 'Closed Cover' : isColophon ? 'Closing Spread' : `Spread ${currentSpreadIndex} of ${totalSpreads}`})
          </span>
        </div>

        {/* Center: Year Progress */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#F5EBDD] bg-black/40 px-3 py-1 rounded-xl border border-white/10">
          <span className="font-bold text-[#D4AF37]">{activeYear}</span>
          <span className="text-[#827567]">/</span>
          <span>1956</span>
          <span className="text-[10px] text-[#827567] uppercase tracking-wider ml-1">Historical Span</span>
        </div>

        {/* Right: Sound, Prev/Next & View Switcher */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Subtle Paper Rustle Audio Toggle */}
          <button
            type="button"
            onClick={onToggleSound}
            className={`p-1.5 rounded-xl border transition-colors flex items-center justify-center cursor-pointer ${
              !isMuted
                ? 'bg-[#B96535] text-white border-[#B96535]'
                : 'bg-black/40 hover:bg-black/60 text-[#C5B8A5] border-white/10'
            }`}
            title={isMuted ? 'Enable page turn audio' : 'Mute page turn audio'}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Discreet Prev / Next Page Buttons */}
          <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={onPrevSpread}
              disabled={currentSpreadIndex <= 0}
              className="p-1.5 rounded-lg text-[#C5B8A5] hover:text-[#D4AF37] hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Turn to previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-1 text-[11px] font-mono text-[#D4AF37] font-semibold">
              {currentSpreadIndex}/{totalSpreads}
            </span>

            <button
              type="button"
              onClick={onNextSpread}
              disabled={currentSpreadIndex > totalSpreads}
              className="p-1.5 rounded-lg text-[#C5B8A5] hover:text-[#D4AF37] hover:bg-white/10 disabled:opacity-20 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Turn to next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Toggle: 3D Book vs Chronological List */}
          <button
            type="button"
            onClick={() => onToggleViewMode(viewMode === '3d-book' ? 'list' : '3d-book')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#291A12] hover:bg-[#3D251A] text-[#F5EBDD] text-xs font-semibold border border-white/15 shadow-xs transition-colors cursor-pointer ml-1"
            title="Switch between 3D Book Experience and Archival Track List"
          >
            {viewMode === '3d-book' ? (
              <>
                <List className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden lg:inline">List View</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="hidden lg:inline">3D Book</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Milestone Year Scrubber Bar (Direct Jump) */}
      <div className="bg-[#1A120B]/85 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-white/20 shadow-2xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D4AF37] shrink-0 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#D4AF37]" />
          <span>Milestones:</span>
        </span>

        {KEY_YEARS.map((yr) => {
          const isSelected = activeYear === yr;
          return (
            <button
              key={yr}
              onClick={() => onJumpToYear(yr)}
              className={`px-2.5 py-1 rounded-lg text-xs font-serif font-bold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-[#B96535] text-white shadow-xs scale-105'
                  : 'bg-black/40 text-[#C5B8A5] border border-white/10 hover:bg-white/10 hover:text-white'
              }`}
              title={`Turn book directly to year ${yr}`}
            >
              {yr}
            </button>
          );
        })}
      </div>

    </div>
  );
};
