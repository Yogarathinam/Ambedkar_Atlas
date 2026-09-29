import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TimelineEvent } from '../../../types';
import { BookCover } from './BookCover';
import { BookSpread } from './BookSpread';
import { BookControls } from './BookControls';
import { bookAudio } from './bookSound';
import { ShieldCheck } from 'lucide-react';

interface Historical3DBookProps {
  events: TimelineEvent[];
  selectedYear?: number | null;
  onSelectEvent: (event: TimelineEvent) => void;
  onResetFilters?: () => void;
  onToggleViewMode?: (mode: '3d-book' | 'list') => void;
  viewMode?: '3d-book' | 'list';
}

export const Historical3DBook: React.FC<Historical3DBookProps> = ({
  events,
  selectedYear,
  onSelectEvent,
  onToggleViewMode,
  viewMode = '3d-book',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Spread indexing:
  // 0 = Front Cover (Closed)
  // 1..totalSpreads = Milestone spreads (1 to events.length)
  // totalSpreads + 1 = Colophon & Final Legacy spread
  const totalSpreads = events.length;
  const totalSegments = totalSpreads + 1.5;

  const [currentSpreadIndex, setCurrentSpreadIndex] = useState<number>(0);
  const [turnProgress, setTurnProgress] = useState<number>(0); // 0 (flat recto) to 1 (flat verso)
  const [turnDirection, setTurnDirection] = useState<'forward' | 'reverse' | null>(null);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(bookAudio.getMuted());
  const [isMobile, setIsMobile] = useState<boolean>(false);

  // Physics animation & gesture tracking refs
  const isAutoAnimatingRef = useRef<boolean>(false);
  const animationFrameRef = useRef<number | null>(null);
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const lastTurnTimeRef = useRef<number>(0);
  const touchStartYRef = useRef<number>(0);
  const touchStartXRef = useRef<number>(0);

  // Viewport detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Compute active event for top HUD display
  const activeEvent = useMemo(() => {
    if (currentSpreadIndex === 0) return events[0];
    if (currentSpreadIndex > totalSpreads) return events[events.length - 1];
    return events[currentSpreadIndex - 1] || events[0];
  }, [currentSpreadIndex, totalSpreads, events]);

  const activeYear = activeEvent ? activeEvent.year : 1891;

  // Synchronize window scroll position to match a given spread index
  const syncScrollToSpread = useCallback((targetSpread: number) => {
    if (!containerRef.current) return;
    const containerTop = containerRef.current.offsetTop;
    const containerHeight = containerRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollableDistance = containerHeight - windowHeight;
    if (scrollableDistance <= 0) return;

    const targetProgress = Math.max(0, Math.min(1, targetSpread / totalSegments));
    const targetY = containerTop + targetProgress * scrollableDistance;

    isProgrammaticScrollRef.current = true;
    window.scrollTo({
      top: targetY,
      behavior: 'auto',
    });

    setTimeout(() => {
      isProgrammaticScrollRef.current = false;
    }, 60);
  }, [totalSegments]);

  // Physics Engine: Natural Automatic Page-Turning Completion
  const animatePageCompletion = useCallback((
    fromProgress: number,
    toProgress: number,
    direction: 'forward' | 'reverse',
    onFinish: () => void
  ) => {
    if (isAutoAnimatingRef.current) return;
    isAutoAnimatingRef.current = true;
    setTurnDirection(direction);

    // Cancel any previous animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    // Play tactile paper rustle sound
    bookAudio.playPageTurn();

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 60 : 340; // 340ms natural paper momentum
    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / duration);
      // Cubic ease-out: 1 - (1 - t)^3 for physical gravity deceleration
      const ease = 1 - Math.pow(1 - t, 3);
      const currentVal = fromProgress + (toProgress - fromProgress) * ease;

      setTurnProgress(currentVal);

      if (t < 1) {
        animationFrameRef.current = requestAnimationFrame(step);
      } else {
        // Finalize turn
        setTurnProgress(toProgress === 1 ? 1 : 0);
        onFinish();

        // Brief safety cooldown to prevent double-flips from rapid scroll momentum
        setTimeout(() => {
          isAutoAnimatingRef.current = false;
          setTurnDirection(null);
          setTurnProgress(0);
          lastTurnTimeRef.current = Date.now();
        }, 90);
      }
    };

    animationFrameRef.current = requestAnimationFrame(step);
  }, []);

  // Programmatic Page Turning trigger (HUD buttons, keyboard, cover click)
  const triggerPageTurn = useCallback((direction: 'forward' | 'reverse') => {
    if (isAutoAnimatingRef.current) return;
    if (Date.now() - lastTurnTimeRef.current < 120) return;

    if (direction === 'forward') {
      if (currentSpreadIndex > totalSpreads) return;
      animatePageCompletion(0, 1, 'forward', () => {
        setCurrentSpreadIndex((prev) => {
          const next = Math.min(totalSpreads + 1, prev + 1);
          syncScrollToSpread(next);
          return next;
        });
      });
    } else {
      if (currentSpreadIndex <= 0) return;
      animatePageCompletion(1, 0, 'reverse', () => {
        setCurrentSpreadIndex((prev) => {
          const prevIdx = Math.max(0, prev - 1);
          syncScrollToSpread(prevIdx);
          return prevIdx;
        });
      });
    }
  }, [animatePageCompletion, currentSpreadIndex, totalSpreads, syncScrollToSpread]);

  // Jump smoothly to a specific spread or year
  const handleJumpToSpread = useCallback((targetSpread: number) => {
    if (isAutoAnimatingRef.current) return;
    const clamped = Math.max(0, Math.min(totalSpreads + 1, targetSpread));
    setCurrentSpreadIndex(clamped);
    setTurnProgress(0);
    setTurnDirection(null);
    syncScrollToSpread(clamped);
    bookAudio.playPageTurn();
  }, [syncScrollToSpread, totalSpreads]);

  const handleJumpToYear = useCallback((year: number) => {
    const idx = events.findIndex((e) => e.year >= year);
    if (idx !== -1) {
      handleJumpToSpread(idx + 1);
    }
  }, [events, handleJumpToSpread]);

  // Synchronize prop selectedYear if provided
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

  // Keyboard navigation (ArrowLeft / ArrowRight / PageUp / PageDown)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        e.preventDefault();
        triggerPageTurn('forward');
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        triggerPageTurn('reverse');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [triggerPageTurn]);

  // Synchronize Scroll Progress from Window Scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current || isProgrammaticScrollRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = containerRef.current.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollableDistance = containerHeight - windowHeight;

      if (scrollableDistance <= 0) return;

      const topOffset = rect.top - 56;
      const rawProgress = Math.max(0, Math.min(1, -topOffset / scrollableDistance));
      setScrollProgress(rawProgress);

      // If user is animating, don't interrupt with scroll position changes
      if (isAutoAnimatingRef.current) return;

      // When outside the container viewport, do not intercept
      if (rect.top > 80 || rect.bottom < windowHeight - 80) return;

      const currentUnit = rawProgress * totalSegments;
      const targetSpread = Math.min(totalSpreads + 1, Math.floor(currentUnit));
      const fraction = currentUnit - targetSpread;

      // Forward page turn initiated by scroll
      if (targetSpread === currentSpreadIndex) {
        if (fraction > 0.03) {
          setTurnDirection('forward');
          // Below tipping threshold: follow user input directly
          if (fraction < 0.48) {
            setTurnProgress(fraction);
          } else {
            // TIPPING THRESHOLD CROSSED (~90 degrees): Auto-complete turn
            animatePageCompletion(fraction, 1, 'forward', () => {
              const nextSpread = Math.min(totalSpreads + 1, currentSpreadIndex + 1);
              setCurrentSpreadIndex(nextSpread);
              syncScrollToSpread(nextSpread);
            });
          }
        } else {
          setTurnProgress(0);
          setTurnDirection(null);
        }
      } else if (targetSpread < currentSpreadIndex) {
        // Reverse page turn initiated by scroll
        const reverseFraction = 1 - (currentSpreadIndex - currentUnit);
        if (reverseFraction < 0.97) {
          setTurnDirection('reverse');
          // Above reverse tipping threshold: follow user input directly
          if (reverseFraction > 0.52) {
            setTurnProgress(reverseFraction);
          } else {
            // REVERSE TIPPING THRESHOLD CROSSED: Auto-complete reverse turn
            animatePageCompletion(reverseFraction, 0, 'reverse', () => {
              const prevSpread = Math.max(0, currentSpreadIndex - 1);
              setCurrentSpreadIndex(prevSpread);
              syncScrollToSpread(prevSpread);
            });
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [animatePageCompletion, currentSpreadIndex, totalSegments, totalSpreads, syncScrollToSpread]);

  // High-Precision Mouse Wheel & Trackpad Gesture Engine on 3D Stage
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let wheelAccumulator = 0;
    let wheelTimeout: ReturnType<typeof setTimeout> | null = null;

    const handleWheel = (e: WheelEvent) => {
      // If auto-animating, lock out conflicting gestures
      if (isAutoAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      // If at closed cover (0) and scrolling up, allow normal page scroll outside timeline
      if (currentSpreadIndex === 0 && e.deltaY < 0 && turnProgress <= 0.05) {
        return;
      }
      // If at colophon end and scrolling down, allow normal page scroll outside timeline
      if (currentSpreadIndex > totalSpreads && e.deltaY > 0) {
        return;
      }

      // Prevent abrupt window jumping while interacting directly with the book
      e.preventDefault();

      if (Date.now() - lastTurnTimeRef.current < 120) return;

      wheelAccumulator += e.deltaY;

      if (wheelTimeout) clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        // If user released before crossing the tipping point, gently ease page back to rest
        if (!isAutoAnimatingRef.current && turnProgress > 0 && turnProgress < 0.48) {
          animatePageCompletion(turnProgress, 0, 'forward', () => {
            setTurnProgress(0);
            setTurnDirection(null);
          });
        } else if (!isAutoAnimatingRef.current && turnProgress > 0.52 && turnProgress < 1) {
          animatePageCompletion(turnProgress, 1, 'reverse', () => {
            setTurnProgress(0);
            setTurnDirection(null);
          });
        }
        wheelAccumulator = 0;
      }, 240);

      // Delta threshold to reach 90 degrees tipping point
      const THRESHOLD = 140;

      if (wheelAccumulator > 0) {
        // Forward turn gesture
        if (currentSpreadIndex > totalSpreads) return;
        const progress = Math.min(0.5, (wheelAccumulator / THRESHOLD) * 0.5);
        setTurnDirection('forward');
        setTurnProgress(progress);

        if (progress >= 0.48) {
          // TIPPING THRESHOLD CROSSED!
          wheelAccumulator = 0;
          animatePageCompletion(progress, 1, 'forward', () => {
            const nextSpread = Math.min(totalSpreads + 1, currentSpreadIndex + 1);
            setCurrentSpreadIndex(nextSpread);
            syncScrollToSpread(nextSpread);
          });
        }
      } else if (wheelAccumulator < 0) {
        // Reverse turn gesture
        if (currentSpreadIndex <= 0) return;
        const progress = Math.max(0.5, 1 - (Math.abs(wheelAccumulator) / THRESHOLD) * 0.5);
        setTurnDirection('reverse');
        setTurnProgress(progress);

        if (progress <= 0.52) {
          // REVERSE TIPPING THRESHOLD CROSSED!
          wheelAccumulator = 0;
          animatePageCompletion(progress, 0, 'reverse', () => {
            const prevSpread = Math.max(0, currentSpreadIndex - 1);
            setCurrentSpreadIndex(prevSpread);
            syncScrollToSpread(prevSpread);
          });
        }
      }
    };

    stage.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      stage.removeEventListener('wheel', handleWheel);
      if (wheelTimeout) clearTimeout(wheelTimeout);
    };
  }, [animatePageCompletion, currentSpreadIndex, totalSpreads, turnProgress, syncScrollToSpread]);

  // Touch Gesture Handling for Mobile & Tablets
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;

    let touchDeltaY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (isAutoAnimatingRef.current) return;
      touchStartYRef.current = e.touches[0].clientY;
      touchStartXRef.current = e.touches[0].clientX;
      touchDeltaY = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (isAutoAnimatingRef.current) {
        e.preventDefault();
        return;
      }

      const currentY = e.touches[0].clientY;
      const currentX = e.touches[0].clientX;
      const diffY = touchStartYRef.current - currentY;
      const diffX = touchStartXRef.current - currentX;

      // Check if primary gesture is vertical swipe or horizontal page turn
      const delta = Math.abs(diffX) > Math.abs(diffY) ? diffX : diffY;
      touchDeltaY = delta;

      const TOUCH_THRESHOLD = 110;

      if (delta > 15) {
        // Forward swipe
        if (currentSpreadIndex > totalSpreads) return;
        const p = Math.min(0.5, (delta / TOUCH_THRESHOLD) * 0.5);
        setTurnDirection('forward');
        setTurnProgress(p);

        if (p >= 0.48) {
          animatePageCompletion(p, 1, 'forward', () => {
            const nextSpread = Math.min(totalSpreads + 1, currentSpreadIndex + 1);
            setCurrentSpreadIndex(nextSpread);
            syncScrollToSpread(nextSpread);
          });
        }
      } else if (delta < -15) {
        // Reverse swipe
        if (currentSpreadIndex <= 0) return;
        const p = Math.max(0.5, 1 - (Math.abs(delta) / TOUCH_THRESHOLD) * 0.5);
        setTurnDirection('reverse');
        setTurnProgress(p);

        if (p <= 0.52) {
          animatePageCompletion(p, 0, 'reverse', () => {
            const prevSpread = Math.max(0, currentSpreadIndex - 1);
            setCurrentSpreadIndex(prevSpread);
            syncScrollToSpread(prevSpread);
          });
        }
      }
    };

    const handleTouchEnd = () => {
      if (!isAutoAnimatingRef.current) {
        if (turnProgress > 0 && turnProgress < 0.48) {
          animatePageCompletion(turnProgress, 0, 'forward', () => {
            setTurnProgress(0);
            setTurnDirection(null);
          });
        } else if (turnProgress > 0.52 && turnProgress < 1) {
          animatePageCompletion(turnProgress, 1, 'reverse', () => {
            setTurnProgress(0);
            setTurnDirection(null);
          });
        }
      }
    };

    stage.addEventListener('touchstart', handleTouchStart, { passive: true });
    stage.addEventListener('touchmove', handleTouchMove, { passive: false });
    stage.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      stage.removeEventListener('touchstart', handleTouchStart);
      stage.removeEventListener('touchmove', handleTouchMove);
      stage.removeEventListener('touchend', handleTouchEnd);
    };
  }, [animatePageCompletion, currentSpreadIndex, totalSpreads, turnProgress, syncScrollToSpread]);

  // Events for current and adjacent spreads
  const currentEvent = events && events.length > 0
    ? (currentSpreadIndex >= 1 && currentSpreadIndex <= totalSpreads
        ? events[currentSpreadIndex - 1]
        : events[0])
    : null;

  const nextEvent = events && currentSpreadIndex + 1 <= totalSpreads
    ? events[currentSpreadIndex]
    : null;

  const prevEvent = events && currentSpreadIndex - 2 >= 0
    ? events[currentSpreadIndex - 2]
    : null;

  // Determine turning leaf angle and visibility
  const isTurning = turnProgress > 0.005 && turnProgress < 0.995;
  const turnAngle = -turnProgress * 180;
  const isCoverOpen = currentSpreadIndex > 0 || (turnDirection === 'forward' && turnProgress > 0.08);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{
        // 85vh per spread ensures comfortable scroll travel
        height: `${Math.max(300, (totalSegments + 1) * 85)}vh`,
        // Continuous wooden surface across the entire timeline track
        backgroundImage: `url('https://i.pinimg.com/736x/db/57/c4/db57c43bb1b847a6547f7fa37c3802da.jpg'), url('/wood-texture.jpg')`,
        backgroundColor: '#24160E',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Pinned Sticky Museum Stage with Subtle Wooden Table Vignette */}
      <div
        ref={stageRef}
        className="sticky top-14 h-[calc(100vh-3.5rem)] w-full flex flex-col justify-between p-3 sm:p-5 lg:p-7 overflow-hidden z-20 select-none"
        style={{
          // Museum table lighting: soft center glow falling off naturally to edges
          backgroundImage: `radial-gradient(ellipse at 50% 50%, rgba(18,12,8,0.2) 0%, rgba(10,6,4,0.62) 100%), url('https://i.pinimg.com/736x/db/57/c4/db57c43bb1b847a6547f7fa37c3802da.jpg'), url('/wood-texture.jpg')`,
          backgroundColor: '#24160E',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
        }}
      >
        {/* Top HUD Controls & Scrubber */}
        <BookControls
          currentSpreadIndex={currentSpreadIndex}
          totalSpreads={totalSpreads}
          events={events}
          activeYear={activeYear}
          isMuted={isMuted}
          viewMode={viewMode}
          onPrevSpread={() => triggerPageTurn('reverse')}
          onNextSpread={() => triggerPageTurn('forward')}
          onJumpToYear={handleJumpToYear}
          onToggleSound={handleToggleSound}
          onToggleViewMode={(mode) => onToggleViewMode && onToggleViewMode(mode)}
        />

        {/* ============================================================ */}
        {/* 3D BOOK STAGE (Centrally positioned on wooden surface)       */}
        {/* ============================================================ */}
        <div className="relative w-full my-auto flex items-center justify-center py-2 sm:py-4">
          
          {/* Deep Ambient Wooden Table Contact & Drop Shadows */}
          <div className="absolute w-[94%] sm:w-[90%] lg:w-[86%] max-w-5xl h-20 sm:h-24 -bottom-10 rounded-[50%] bg-black/65 blur-3xl pointer-events-none" />
          <div className="absolute w-[86%] max-w-4xl h-10 -bottom-4 rounded-[50%] bg-black/80 blur-xl pointer-events-none" />

          {/* 3D Perspective Viewport */}
          <div
            className="relative w-full max-w-5xl h-[460px] sm:h-[520px] md:h-[580px] lg:h-[620px] transition-transform duration-300 select-none"
            style={{
              perspective: '2500px',
              perspectiveOrigin: '50% 50%',
            }}
          >
            {/* Hardcover Outer Frame (Dark Walnut Binder) */}
            <div className="absolute inset-0 rounded-3xl bg-[#1E140E] p-2 sm:p-3 shadow-[0_30px_70px_rgba(0,0,0,0.65),0_10px_25px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.2)] border border-[#3E281C]">
              
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
                
                {/* Active Event Spread or Preloaded Milestone 1 under closed cover */}
                {currentSpreadIndex <= totalSpreads && currentEvent && (
                  <BookSpread
                    event={currentEvent}
                    pageNumber={Math.max(1, currentSpreadIndex)}
                    totalPages={totalSpreads}
                    onOpenProvenance={onSelectEvent}
                  />
                )}

                {/* Final Colophon & Testament Spread */}
                {currentSpreadIndex > totalSpreads && (
                  <div className="w-full h-full flex flex-col md:flex-row select-text font-serif">
                    {/* Left Colophon Page */}
                    <div className="w-full md:w-1/2 h-full bg-[#FAF4EA] border-r border-[#DED3C2] p-8 lg:p-12 flex flex-col justify-between text-center relative">
                      <div className="text-[10px] font-mono tracking-widest text-[#827567] uppercase">
                        Colophon &amp; Testament
                      </div>
                      
                      <div className="space-y-4 max-w-sm mx-auto my-auto">
                        <div className="w-16 h-16 mx-auto rounded-full bg-[#E7D5B9] border border-[#DED3C2] flex items-center justify-center">
                          <ShieldCheck className="w-8 h-8 text-[#B96535]" />
                        </div>
                        <h3 className="font-serif text-2xl font-bold text-[#29251F]">
                          "Educate. Agitate. Organise."
                        </h3>
                        <p className="text-xs text-[#51483F] leading-relaxed italic">
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
                    <div className="w-full md:w-1/2 h-full bg-[#FAF4EA] p-8 lg:p-12 flex flex-col justify-between text-center relative">
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
                            onClick={() => handleJumpToSpread(1)}
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
                  openProgress={turnProgress}
                  onOpenClick={() => triggerPageTurn('forward')}
                />
              )}

              {/* ====================================================== */}
              {/* 3D TURNING PAGE LEAF (Realistic Flip Across Center)   */}
              {/* ====================================================== */}
              {isTurning && currentSpreadIndex >= 1 && (
                <div
                  className="hidden md:block absolute top-2 bottom-2 right-2 w-[calc(50%-0.5rem)] origin-left pointer-events-none"
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: `rotateY(${turnAngle}deg)`,
                    zIndex: 35,
                    boxShadow: `${Math.sin(turnProgress * Math.PI) * -20}px 15px 35px rgba(0,0,0,0.35)`,
                  }}
                >
                  {/* Front of Turning Leaf (Visible 0deg to 90deg, peeling from recto) */}
                  <div
                    className="absolute inset-0 rounded-r-xl overflow-hidden bg-[#FAF4EA] border border-[#DED3C2] shadow-2xl p-6 lg:p-8 flex flex-col justify-between"
                    style={{
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    {/* Dynamic surface illumination & gradient shadow */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to right, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 20%, transparent 60%)',
                        opacity: Math.sin(turnProgress * Math.PI) * 0.75,
                      }}
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#827567] pb-2 border-b border-[#DED3C2]">
                      <span>The Ambedkar Chronicle</span>
                      <span>Milestone {currentSpreadIndex}</span>
                    </div>
                    <div className="my-auto space-y-2 text-left">
                      <span className="text-xs font-mono font-bold text-[#713F2B] bg-[#E7D5B9] px-2 py-0.5 rounded">
                        {currentEvent?.exactDate || currentEvent?.year}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#29251F]">
                        {currentEvent?.title}
                      </h4>
                      <p className="text-xs text-[#51483F] line-clamp-4 leading-relaxed">
                        {currentEvent?.summary}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-[#827567] border-t border-[#DED3C2] pt-2 flex items-center justify-between">
                      <span>Turning page...</span>
                      <span className="text-[#B96535]">Milestone {currentSpreadIndex}</span>
                    </div>
                  </div>

                  {/* Back of Turning Leaf (Visible 90deg to 180deg, landing onto verso) */}
                  <div
                    className="absolute inset-0 rounded-l-xl overflow-hidden bg-[#FAF4EA] border border-[#DED3C2] shadow-2xl p-6 lg:p-8 flex flex-col justify-between text-left"
                    style={{
                      transform: 'rotateY(180deg)',
                      backfaceVisibility: 'hidden',
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background: 'linear-gradient(to left, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.1) 20%, transparent 60%)',
                        opacity: Math.sin(turnProgress * Math.PI) * 0.75,
                      }}
                    />
                    <div className="flex items-center justify-between text-[10px] font-mono text-[#827567] pb-2 border-b border-[#DED3C2]">
                      <span>The Ambedkar Chronicle</span>
                      <span>
                        {turnDirection === 'reverse'
                          ? `Milestone ${currentSpreadIndex - 1}`
                          : `Milestone ${currentSpreadIndex + 1}`}
                      </span>
                    </div>
                    <div className="my-auto space-y-2">
                      <span className="text-xs font-mono font-bold text-[#B96535] bg-[#FAF4EA] px-2 py-0.5 rounded border border-[#DED3C2]">
                        {turnDirection === 'reverse'
                          ? prevEvent?.exactDate || prevEvent?.year
                          : nextEvent?.exactDate || nextEvent?.year}
                      </span>
                      <h4 className="font-serif text-xl font-bold text-[#29251F]">
                        {turnDirection === 'reverse' ? prevEvent?.title : nextEvent?.title}
                      </h4>
                      <p className="text-xs text-[#51483F] line-clamp-3 leading-relaxed">
                        {turnDirection === 'reverse'
                          ? prevEvent?.summary
                          : nextEvent?.detailedNarrative || nextEvent?.summary}
                      </p>
                    </div>
                    <div className="text-[10px] font-mono text-[#827567] border-t border-[#DED3C2] pt-2 flex items-center justify-between">
                      <span>Settling onto page...</span>
                      <span className="text-[#713F2B] font-semibold">Verified Archival Record</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Bottom Museum Status Bar (No introductory instructions) */}
        <div className="flex items-center justify-between px-3 py-1.5 text-[11px] font-mono text-[#C5B8A5] border border-white/10 bg-[#1A120B]/85 backdrop-blur-md rounded-xl">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Interactive 3D Chronicle • 24 Verified Milestones (1891–1956)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#C5B8A5]">Chronology:</span>
            <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/10">
              <div
                className="h-full bg-[#B96535] rounded-full transition-all duration-75"
                style={{ width: `${Math.round(scrollProgress * 100)}%` }}
              />
            </div>
            <span className="w-8 text-right font-bold text-[#D4AF37]">
              {Math.round(scrollProgress * 100)}%
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
