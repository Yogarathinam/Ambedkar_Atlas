import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TimelineEvent } from '../../../types';
import { BookCover } from './BookCover';
import { BookSpread } from './BookSpread';
import { BookControls } from './BookControls';
import { BookTableOfContents } from './BookTableOfContents';
import { bookAudio } from './bookSound';
import ambedkarLogo from '../../../assets/hero/image.png';
import { ShieldCheck, BookOpen, ArrowUp, Calendar, ExternalLink } from 'lucide-react';

interface Historical3DBookProps {
  events: TimelineEvent[];
  selectedYear?: number | null;
  onSelectEvent: (event: TimelineEvent) => void;
  onResetFilters?: () => void;
}

export const Historical3DBook: React.FC<Historical3DBookProps> = ({
  events,
  selectedYear,
  onSelectEvent,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(bookAudio.getMuted());
  const [viewMode, setViewMode] = useState<'3d-book' | 'list'>('3d-book');
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const lastFlippedIndexRef = useRef<number>(-1);

  // Total pages: Cover (0) + events.length + Final Colophon (1)
  const totalSpreads = events.length;
  const totalSegments = totalSpreads + 1.5; // cover + events + colophon

  // Check viewport size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync scroll progress from window scrolling through container
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // When containerTop <= 64px, user is scrolling through book
      const topOffset = rect.top - 64;
      const scrollableDistance = containerHeight - windowHeight;

      if (scrollableDistance <= 0) return;

      const progress = Math.max(0, Math.min(1, -topOffset / scrollableDistance));
      setScrollProgress(progress);

      // Check if page flipped for audio feedback
      const currentSegment = progress * totalSegments;
      const currentFloor = Math.floor(currentSegment);
      if (currentFloor !== lastFlippedIndexRef.current && lastFlippedIndexRef.current !== -1) {
        bookAudio.playPageTurn();
      }
      lastFlippedIndexRef.current = currentFloor;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSegments]);

  // Derived current spread index and page turn progress
  // 0 = Cover
  // 1..totalSpreads = Event Spreads
  // totalSpreads + 1 = Colophon
  const { currentSpreadIndex, pageTurnProgress, isCoverOpen } = useMemo(() => {
    const totalUnits = totalSegments;
    const currentUnit = scrollProgress * totalUnits;
    const spreadIndex = Math.min(totalSpreads + 1, Math.floor(currentUnit));
    const turnFraction = currentUnit - spreadIndex;

    // Smooth tipping threshold (gravity past 90 degrees):
    // Accelerates smoothly to complete the turn once past 0.45 threshold
    let effectiveProgress = turnFraction;
    if (turnFraction > 0.45) {
      const t = Math.min(1, (turnFraction - 0.45) / 0.28);
      const ease = 1 - Math.pow(1 - t, 3);
      effectiveProgress = 0.45 + (1 - 0.45) * ease;
    } else {
      effectiveProgress = (turnFraction / 0.45) * 0.45;
    }

    return {
      currentSpreadIndex: spreadIndex,
      pageTurnProgress: Math.max(0, Math.min(1, effectiveProgress)),
      isCoverOpen: spreadIndex > 0 || effectiveProgress > 0.08,
    };
  }, [scrollProgress, totalSegments, totalSpreads]);

  // Calculate active event for HUD
  const activeEvent = useMemo(() => {
    if (currentSpreadIndex === 0) return events[0];
    if (currentSpreadIndex > totalSpreads) return events[events.length - 1];
    return events[currentSpreadIndex - 1] || events[0];
  }, [currentSpreadIndex, totalSpreads, events]);

  const activeYear = activeEvent ? activeEvent.year : 1891;

  // Jump smoothly to a specific spread
  const scrollToSpread = useCallback((targetSpread: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = containerHeight - windowHeight;

    const targetProgress = targetSpread <= 0 ? 0 : Math.max(0, Math.min(1, (targetSpread + 0.1) / totalSegments));
    const targetY = containerTop + targetProgress * scrollableDistance;

    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    });
  }, [totalSegments]);

  // Jump to specific historical year
  const handleJumpToYear = useCallback((year: number) => {
    const idx = events.findIndex((e) => e.year >= year);
    if (idx !== -1) {
      scrollToSpread(idx + 1);
    }
  }, [events, scrollToSpread]);

  // Sync with prop selectedYear if provided
  useEffect(() => {
    if (selectedYear) {
      handleJumpToYear(selectedYear);
    }
  }, [selectedYear, handleJumpToYear]);

  // Toggle sound
  const handleToggleSound = () => {
    const muted = bookAudio.toggleMute();
    setIsMuted(muted);
  };

  // Keyboard navigation (ArrowLeft / ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        scrollToSpread(Math.min(totalSpreads + 1, currentSpreadIndex + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        scrollToSpread(Math.max(0, currentSpreadIndex - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSpreadIndex, totalSpreads, scrollToSpread]);

  // Current and Next spread event objects for 3D page turning
  const currentEvent = currentSpreadIndex >= 1 && currentSpreadIndex <= totalSpreads
    ? events[currentSpreadIndex - 1]
    : null;

  const nextEvent = currentSpreadIndex + 1 <= totalSpreads
    ? events[currentSpreadIndex]
    : null;

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        // Generous vertical scroll track: 100vh per spread to ensure smooth, controllable page turns
        height: `${Math.max(300, (totalSegments + 1) * 85)}vh`,
      }}
    >
      {/* Pinned Sticky Museum Stage */}
      <div
        className="sticky top-16 h-[calc(100vh-4.75rem)] max-h-[860px] w-full flex flex-col justify-between px-3 sm:px-6 py-2 overflow-hidden z-20 rounded-3xl transition-all duration-300"
        style={!isCoverOpen ? {
          backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%), url('https://i.pinimg.com/736x/db/57/c4/db57c43bb1b847a6547f7fa37c3802da.jpg'), url('/wood-texture.jpg')`,
          backgroundColor: '#24160E',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        } : undefined}
      >
        
        {/* Top HUD Controls & Scrubber */}
        <BookControls
          currentSpreadIndex={currentSpreadIndex}
          totalSpreads={totalSpreads}
          events={events}
          activeYear={activeYear}
          isMuted={isMuted}
          viewMode={viewMode}
          onPrevSpread={() => scrollToSpread(Math.max(0, currentSpreadIndex - 1))}
          onNextSpread={() => scrollToSpread(Math.min(totalSpreads + 1, currentSpreadIndex + 1))}
          onJumpToYear={handleJumpToYear}
          onToggleSound={handleToggleSound}
          onToggleViewMode={setViewMode}
        />

        {/* ============================================================ */}
        {/* 3D BOOK STAGE (Centrally positioned with surrounding space)  */}
        {/* ============================================================ */}
        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center py-1">
          
          {/* Ambient Museum Under-Book Drop Shadow */}
          <div className="absolute w-[92%] sm:w-[88%] lg:w-[82%] max-w-5xl h-8 sm:h-12 -bottom-2 rounded-[50%] bg-black/40 blur-xl pointer-events-none" />

          {/* 3D Perspective Viewport (Dynamically responsive to fit viewport without cutting off bottom) */}
          <div
            className="relative w-full max-w-5xl h-full max-h-[480px] lg:max-h-[520px] transition-transform duration-300 select-none"
            style={{
              perspective: '2500px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* Hardcover Outer Frame (Dark Walnut Binder) */}
            <div className="absolute inset-0 rounded-3xl bg-[#1E140E] p-2 sm:p-3 shadow-[0_25px_60px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)] border border-[#3E281C]">
              
              {/* Outer Leather Grain Sheen */}
              <div className="absolute inset-0 rounded-3xl opacity-20 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.2),transparent_70%)] pointer-events-none" />

              {/* Realistic Page Edge Stacks (Deckle edging on left and right) */}
              {/* Left Page Stack */}
              <div
                className="absolute left-1 top-3 bottom-3 rounded-l-md bg-gradient-to-r from-[#DED3C2] via-[#F5EBDD] to-[#E7D5B9] shadow-inner pointer-events-none transition-all duration-300"
                style={{
                  width: `${Math.max(4, Math.min(22, (currentSpreadIndex / totalSpreads) * 22))}px`,
                  opacity: currentSpreadIndex > 0 ? 1 : 0,
                }}
              />
              {/* Right Page Stack */}
              <div
                className="absolute right-1 top-3 bottom-3 rounded-r-md bg-gradient-to-l from-[#DED3C2] via-[#F5EBDD] to-[#E7D5B9] shadow-inner pointer-events-none transition-all duration-300"
                style={{
                  width: `${Math.max(4, Math.min(22, ((totalSpreads - currentSpreadIndex) / totalSpreads) * 22))}px`,
                }}
              />

              {/* Center Spine Stitching Crease */}
              <div className="hidden md:block absolute left-1/2 top-2 bottom-2 w-4 -translate-x-1/2 bg-gradient-to-r from-black/40 via-black/10 to-black/40 z-30 pointer-events-none rounded-sm" />

              {/* ====================================================== */}
              {/* INSIDE SPREAD CONTENT (Base Canvas)                     */}
              {/* ====================================================== */}
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#FAF4EA] flex shadow-inner">
                
                {/* When cover is at spread 0 (Opening Spread: Left = Archival Preface, Right = Table of Contents) */}
                {currentSpreadIndex === 0 && (
                  <div className="w-full h-full flex flex-col md:flex-row select-text font-serif">
                    {/* Left Page (Verso): Closed Book Companion / Frontispiece Underlay */}
                    <div
                      className="w-full md:w-1/2 h-full flex flex-col items-center justify-between p-4 sm:p-6 lg:p-7 text-center relative border-r border-[#DED3C2]"
                      style={{
                        backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.75) 100%), url('https://i.pinimg.com/736x/db/57/c4/db57c43bb1b847a6547f7fa37c3802da.jpg'), url('/wood-texture.jpg')`,
                        backgroundColor: '#24160E',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    >
                      {/* Subtle gold filigree border */}
                      <div className="absolute inset-3 border border-[#D4AF37]/30 rounded-xl pointer-events-none" />

                      <div className="relative z-10 pt-1">
                        <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase">
                          National Digital Archive
                        </span>
                      </div>

                      <div className="relative z-10 my-auto space-y-2.5 max-w-xs mx-auto">
                        <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto flex items-center justify-center">
                          <div className="absolute inset-0 rounded-full border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.2)]" />
                          <img
                            src={ambedkarLogo}
                            alt="Dr. B. R. Ambedkar"
                            className="w-14 h-14 sm:w-16 sm:h-16 object-contain drop-shadow-md"
                          />
                        </div>

                        <div className="space-y-1">
                          <h3 className="font-serif text-xl sm:text-2xl font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                            The Book of Ambedkar
                          </h3>
                          <p className="text-[11px] sm:text-xs text-[#E7D5B9] leading-relaxed drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                            Traverse 65 years of constitutional drafting, treatises, and historic mass emancipation (1891–1956).
                          </p>
                        </div>

                        <div className="pt-1">
                          <button
                            type="button"
                            onClick={() => scrollToSpread(1)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B96535] hover:bg-[#713F2B] text-white text-xs font-semibold rounded-lg shadow-sm transition-all hover:scale-105 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Begin Reading (1891)</span>
                          </button>
                        </div>
                      </div>

                      <div className="relative z-10 pb-1 text-[10px] font-mono text-[#D4AF37]/80">
                        MEA Official Holdings • 24 Milestones
                      </div>
                    </div>

                    {/* Right Page (Recto): Table of Contents / Conspectus of Epochs & Milestones */}
                    <BookTableOfContents
                      events={events}
                      onSelectSpread={scrollToSpread}
                      onJumpToYear={handleJumpToYear}
                    />
                  </div>
                )}

                {/* When showing active event spread */}
                {currentEvent && (
                  <BookSpread
                    event={currentEvent}
                    pageNumber={currentSpreadIndex}
                    totalPages={totalSpreads}
                    onOpenProvenance={onSelectEvent}
                  />
                )}

                {/* When reaching final colophon spread */}
                {currentSpreadIndex > totalSpreads && (
                  <div className="w-full h-full flex flex-col md:flex-row select-text font-serif">
                    {/* Left Colophon Page */}
                    <div className="w-full md:w-1/2 h-full bg-[#FAF4EA] border-r border-[#DED3C2] p-4 sm:p-6 lg:p-8 flex flex-col justify-between text-center relative">
                      <div className="text-[10px] font-mono tracking-widest text-[#827567] uppercase">
                        Colophon &amp; Testament
                      </div>
                      
                      <div className="space-y-3 max-w-sm mx-auto my-auto">
                        <div className="w-12 h-12 mx-auto rounded-full bg-[#E7D5B9] border border-[#DED3C2] flex items-center justify-center">
                          <ShieldCheck className="w-6 h-6 text-[#B96535]" />
                        </div>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#29251F]">
                          "Educate. Agitate. Organise."
                        </h3>
                        <p className="text-xs text-[#51483F] leading-relaxed italic line-clamp-3">
                          "History shows that where ethics and economics come in conflict, victory is always with economics. Vested interests have never been known to have divested themselves unless there was sufficient force to compel them."
                        </p>
                        <span className="text-[11px] font-mono text-[#713F2B] font-bold block">
                          Babasaheb Dr. B. R. Ambedkar
                        </span>
                      </div>

                      <div className="text-[10px] font-mono text-[#827567] border-t border-[#DED3C2] pt-2">
                        Deekshabhoomi, Nagpur • 14 October 1956
                      </div>
                    </div>

                    {/* Right Colophon Page */}
                    <div className="w-full md:w-1/2 h-full bg-[#FAF4EA] p-4 sm:p-6 lg:p-8 flex flex-col justify-between text-center relative">
                      <div className="text-[10px] font-mono tracking-widest text-[#827567] uppercase">
                        Eternal Memorial
                      </div>

                      <div className="space-y-4 max-w-sm mx-auto my-auto">
                        <h4 className="font-serif text-xl font-bold text-[#713F2B]">
                          End of The Ambedkar Chronicle
                        </h4>
                        <p className="text-xs text-[#51483F] leading-relaxed">
                          You have traversed 65 years of monumental scholarship, legal drafting, and mass emancipation across 24 verified milestones (1891–1956).
                        </p>
                        <div className="pt-2 flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => scrollToSpread(1)}
                            className="px-4 py-2 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
                          >
                            Return to Beginning (1891)
                          </button>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-[#827567] border-t border-[#DED3C2] pt-2">
                        Official MEA Digital Heritage Holdings • 60 Volumes
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* ====================================================== */}
              {/* 3D HARDCOVER: Smooth Opening Animation                  */}
              {/* ====================================================== */}
              {currentSpreadIndex === 0 && (
                <BookCover
                  isOpen={isCoverOpen}
                  openProgress={pageTurnProgress}
                  onOpenClick={() => scrollToSpread(1)}
                />
              )}

              {/* ====================================================== */}
              {/* 3D TURNING PAGE LEAF (Realistic Flip Across Center)   */}
              {/* ====================================================== */}
              {currentSpreadIndex >= 1 && currentSpreadIndex <= totalSpreads && pageTurnProgress > 0.01 && pageTurnProgress < 0.99 && (
                <div
                  className="hidden md:block absolute top-2 bottom-2 right-2 w-[calc(50%-0.5rem)] origin-left pointer-events-none transition-transform duration-75 ease-out"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${-pageTurnProgress * 180}deg)`,
                    zIndex: 35,
                  }}
                >
                  {/* Front of Turning Leaf (Current Recto page peeling away) */}
                  <div
                    className="absolute inset-0 rounded-r-xl overflow-hidden bg-[#FAF4EA] border border-[#DED3C2] shadow-2xl p-4 sm:p-6 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Dynamic shadow that darkens as page approaches vertical */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0.35), transparent)',
                        opacity: Math.sin(pageTurnProgress * Math.PI) * 0.7,
                      }}
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#827567] pb-2 border-b border-[#DED3C2]">
                      <span>The Ambedkar Chronicle</span>
                      <span>Milestone {currentSpreadIndex}</span>
                    </div>
                    <div className="my-auto space-y-1.5 text-left">
                      <span className="text-xs font-mono font-bold text-[#713F2B] bg-[#E7D5B9] px-2 py-0.5 rounded">
                        {currentEvent?.exactDate || currentEvent?.year}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#29251F] line-clamp-1">
                        {currentEvent?.title}
                      </h4>
                      <p className="text-xs text-[#51483F] line-clamp-3">
                        {currentEvent?.summary}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-[#827567] border-t border-[#DED3C2] pt-2">
                      Flipping Page...
                    </div>
                  </div>

                  {/* Back of Turning Leaf (Next Verso page revealed on the left) */}
                  <div
                    className="absolute inset-0 rounded-l-xl overflow-hidden bg-[#FAF4EA] border border-[#DED3C2] shadow-2xl p-4 sm:p-6 flex flex-col justify-between text-left"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to left, rgba(0,0,0,0.35), transparent)',
                        opacity: Math.sin(pageTurnProgress * Math.PI) * 0.7,
                      }}
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#827567] pb-2 border-b border-[#DED3C2]">
                      <span>Ambedkar Chronicle</span>
                      <span>Milestone {currentSpreadIndex + 1}</span>
                    </div>
                    <div className="my-auto space-y-1.5">
                      <span className="text-xs font-mono font-bold text-[#B96535]">
                        {nextEvent?.exactDate || nextEvent?.year}
                      </span>
                      <h4 className="font-serif text-lg font-bold text-[#29251F] line-clamp-1">
                        {nextEvent?.title}
                      </h4>
                      <p className="text-xs text-[#51483F] line-clamp-3">
                        {nextEvent?.detailedNarrative || nextEvent?.summary}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-[#827567] border-t border-[#DED3C2] pt-2">
                      Turning to Spread {currentSpreadIndex + 1}...
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Bottom Museum Indicator & Scroll Hint */}
        <div className="flex items-center justify-between px-3 py-1 text-[11px] font-mono text-[#827567] border-t border-[#DED3C2]/60 shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="hidden sm:inline">Interactive 3D Book Mode • </span>
            <span>Scroll down or drag to turn pages</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">Scroll:</span>
            <div className="w-16 sm:w-24 h-1.5 bg-[#DED3C2] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#B96535] rounded-full transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="w-8 text-right font-bold text-[#713F2B]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
