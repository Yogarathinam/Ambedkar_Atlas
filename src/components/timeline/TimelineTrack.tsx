import React, { useRef, useState } from 'react';
import { TimelineEvent } from '../../types';
import { ChevronLeft, ChevronRight, Calendar, MapPin, ArrowRight } from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';

interface TimelineTrackProps {
  events: TimelineEvent[];
  selectedEvent: TimelineEvent | null;
  onSelectEvent: (event: TimelineEvent) => void;
}

export const TimelineTrack: React.FC<TimelineTrackProps> = ({
  events,
  selectedEvent,
  onSelectEvent,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { isMobilePreview, isKiosk } = useDevice();
  const [focusedIndex, setFocusedIndex] = useState<number>(0);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const offset = direction === 'left' ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight' && index < events.length - 1) {
      setFocusedIndex(index + 1);
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
    } else if (e.key === 'Enter') {
      onSelectEvent(events[index]);
    }
  };

  // If mobile preview or kiosk or narrow viewport, render vertical timeline
  const isVertical = isMobilePreview || isKiosk;

  if (isVertical) {
    return (
      <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#DED3C2]">
        {events.map((evt, idx) => {
          const isSelected = selectedEvent?.id === evt.id;
          return (
            <div
              key={evt.id}
              tabIndex={0}
              onClick={() => onSelectEvent(evt)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`relative bg-[#FBF8F2] border rounded-xl p-5 transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-[#B96535] ring-2 ring-[#B96535]/20 shadow-md'
                  : 'border-[#DED3C2] hover:border-[#B96535]'
              }`}
            >
              {/* Timeline node marker */}
              <div className={`absolute -left-[31px] top-6 w-5 h-5 rounded-full border-2 border-[#F5EBDD] flex items-center justify-center transition-colors ${
                isSelected ? 'bg-[#B96535]' : 'bg-[#713F2B]'
              }`}>
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#E7D5B9] text-[#713F2B]">
                  {evt.year}
                </span>
                <span className="text-xs text-[#827567] flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {evt.exactDate}
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-[#29251F] mb-1">
                {evt.title}
              </h3>
              <p className="text-xs font-medium text-[#713F2B] mb-2">{evt.subtitle}</p>
              <p className="text-sm text-[#51483F] leading-relaxed mb-3">{evt.summary}</p>

              <div className="flex items-center justify-between pt-2 border-t border-[#DED3C2] text-xs text-[#827567]">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#B96535]" />
                  {evt.location}
                </span>
                <span className="text-[#B96535] font-medium flex items-center gap-0.5">
                  View Record <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Desktop Horizontal Scroller with smooth arrows
  return (
    <div className="relative py-4">
      {/* Scroll navigation buttons */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-[#827567] uppercase tracking-wider">
          Horizontal Historical Scrubber • 1891–1956
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleScroll('left')}
            className="p-2 rounded-lg bg-[#FBF8F2] border border-[#DED3C2] hover:bg-[#E7D5B9] text-[#29251F] transition-colors shadow-xs"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-2 rounded-lg bg-[#FBF8F2] border border-[#DED3C2] hover:bg-[#E7D5B9] text-[#29251F] transition-colors shadow-xs"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Scroller Track */}
      <div
        ref={scrollContainerRef}
        className="flex gap-6 overflow-x-auto pb-6 pt-2 scrollbar-none snap-x focus:outline-none"
        tabIndex={0}
      >
        {events.map((evt, idx) => {
          const isSelected = selectedEvent?.id === evt.id;
          return (
            <div
              key={evt.id}
              tabIndex={0}
              onClick={() => onSelectEvent(evt)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`snap-start w-[320px] sm:w-[360px] shrink-0 bg-[#FBF8F2] border rounded-2xl p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between hover:shadow-lg ${
                isSelected
                  ? 'border-[#B96535] ring-2 ring-[#B96535]/30 shadow-md transform -translate-y-1'
                  : 'border-[#DED3C2] hover:border-[#B96535]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B96535] text-white">
                    {evt.year}
                  </span>
                  <span className="text-xs text-[#827567] flex items-center gap-1 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {evt.exactDate}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-[#29251F] mb-1 leading-snug">
                  {evt.title}
                </h3>
                <p className="text-xs font-medium text-[#713F2B] mb-3">{evt.subtitle}</p>
                <p className="text-sm text-[#51483F] leading-relaxed line-clamp-4 mb-4">
                  {evt.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-[#DED3C2] flex items-center justify-between text-xs text-[#827567]">
                <span className="flex items-center gap-1 truncate max-w-[190px]">
                  <MapPin className="w-3.5 h-3.5 text-[#B96535] shrink-0" />
                  <span className="truncate">{evt.location}</span>
                </span>
                <span className="text-[#B96535] font-semibold flex items-center gap-1 shrink-0">
                  Inspect <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
