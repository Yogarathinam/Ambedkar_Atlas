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
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_rgba(41,37,31,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)] text-xs text-[#29251F]">
        
        {/* Left: Current State Indicator */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="font-serif font-bold text-sm sm:text-base text-[#713F2B] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#B96535] animate-pulse" />
            {isCover
              ? 'The Book of Ambedkar (Cover)'
              : isColophon
              ? 'Colophon & Eternal Legacy (1956)'
              : `${activeYear} • ${activeEvent?.title || 'Milestone'}`}
          </span>
          
          <span className="text-[11px] font-mono text-[#827567] hidden md:inline">
            ({isCover ? 'Closed Cover' : isColophon ? 'Closing Spread' : `Spread ${currentSpreadIndex} of ${totalSpreads}`})
          </span>
        </div>

        {/* Center: Year Progress */}
        <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-[#713F2B] bg-[#FAF4EA] px-3 py-1 rounded-xl border border-[#DED3C2]">
          <span className="font-bold text-[#B96535]">{activeYear}</span>
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
                : 'bg-white/80 hover:bg-white text-[#827567] border-[#DED3C2]'
            }`}
            title={isMuted ? 'Enable page turn audio' : 'Mute page turn audio'}
          >
            {!isMuted ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Discreet Prev / Next Page Buttons */}
          <div className="flex items-center gap-1 bg-white/80 p-0.5 rounded-xl border border-[#DED3C2]">
            <button
              type="button"
              onClick={onPrevSpread}
              disabled={currentSpreadIndex <= 0}
              className="p-1.5 rounded-lg text-[#51483F] hover:text-[#B96535] hover:bg-[#F5EBDD] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Turn to previous page (or scroll up)"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-1 text-[11px] font-mono text-[#713F2B] font-semibold">
              {currentSpreadIndex}/{totalSpreads}
            </span>

            <button
              type="button"
              onClick={onNextSpread}
              disabled={currentSpreadIndex > totalSpreads}
              className="p-1.5 rounded-lg text-[#51483F] hover:text-[#B96535] hover:bg-[#F5EBDD] disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
              title="Turn to next page (or scroll down)"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* View Mode Toggle: 3D Book vs Chronological List */}
          <button
            type="button"
            onClick={() => onToggleViewMode(viewMode === '3d-book' ? 'list' : '3d-book')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#29251F] hover:bg-[#3E3830] text-[#FBF8F2] text-xs font-semibold shadow-xs transition-colors cursor-pointer ml-1"
            title="Switch between 3D Book Experience and Archival Track List"
          >
            {viewMode === '3d-book' ? (
              <>
                <List className="w-3.5 h-3.5 text-[#B96535]" />
                <span className="hidden lg:inline">List View</span>
              </>
            ) : (
              <>
                <BookOpen className="w-3.5 h-3.5 text-[#B96535]" />
                <span className="hidden lg:inline">3D Book</span>
              </>
            )}
          </button>
        </div>

      </div>

      {/* Milestone Year Scrubber Bar (Direct Jump) */}
      <div className="bg-[#FAF4EA]/90 backdrop-blur-md border border-[#DED3C2] rounded-2xl px-3 py-2 flex items-center gap-2 overflow-x-auto scrollbar-thin scrollbar-thumb-[#DED3C2] shadow-2xs">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#713F2B] shrink-0 flex items-center gap-1">
          <Calendar className="w-3 h-3 text-[#B96535]" />
          <span>Timeline:</span>
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
                  : 'bg-white/80 text-[#29251F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
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
