import React from 'react';
import { motion } from 'framer-motion';
import { TimelineEvent } from '../../types';
import { Calendar, MapPin, ArrowRight, Quote, BookOpen } from 'lucide-react';

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
  if (events.length === 0) {
    return (
      <div className="py-16 text-center text-[#827567] bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl">
        <p className="font-serif text-lg text-[#29251F]">No timeline events match your search criteria.</p>
        <p className="text-xs mt-1">Try searching for other years (e.g., 1916, 1927, 1949, 1956) or topics like "Mahad" or "Constitution".</p>
      </div>
    );
  }

  return (
    <div className="relative py-8">
      {/* Central Connecting Vertical Line for Desktop (Centered at 50%), Left-aligned on Mobile */}
      <div className="absolute top-4 bottom-4 left-6 md:left-1/2 w-0.5 bg-gradient-to-b from-[#B96535] via-[#DED3C2] to-[#B96535] -translate-x-1/2 z-0" />

      <div className="space-y-12 sm:space-y-16">
        {events.map((evt, idx) => {
          const isEven = idx % 2 === 0;
          const isSelected = selectedEvent?.id === evt.id;

          return (
            <div
              key={evt.id}
              className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 ${
                isEven ? 'md:flex-row-reverse' : ''
              }`}
            >
              {/* Timeline Center Node Marker */}
              <div
                className={`absolute left-6 md:left-1/2 -translate-x-1/2 w-6 h-6 rounded-full border-4 border-[#F5EBDD] z-10 transition-transform duration-300 flex items-center justify-center ${
                  isSelected ? 'bg-[#B96535] scale-125 shadow-md' : 'bg-[#713F2B] hover:scale-110'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>

              {/* Event Card Content (Takes 50% width on desktop, full width on mobile) */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                className={`w-full md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 ${
                  isEven ? 'md:text-left' : 'md:text-left'
                }`}
              >
                <div
                  onClick={() => onSelectEvent(evt)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectEvent(evt);
                    }
                  }}
                  tabIndex={0}
                  role="button"
                  className={`group bg-[#FBF8F2] border rounded-2xl p-6 sm:p-7 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-xl ${
                    isSelected
                      ? 'border-[#B96535] ring-2 ring-[#B96535]/25 shadow-md'
                      : 'border-[#DED3C2] hover:border-[#B96535]'
                  }`}
                >
                  {/* Card Header: Year Pill & Date */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B96535] text-white shadow-2xs">
                      {evt.year}
                    </span>
                    <span className="text-xs text-[#827567] flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      {evt.exactDate}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#29251F] group-hover:text-[#B96535] transition-colors leading-snug mb-1">
                    {evt.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#713F2B] uppercase tracking-wider mb-3">
                    {evt.subtitle}
                  </p>

                  {/* Summary */}
                  <p className="text-sm text-[#51483F] leading-relaxed mb-4">
                    {evt.summary}
                  </p>

                  {/* Archival Quote Snippet (if available) */}
                  {evt.archivalQuote && (
                    <div className="bg-[#E7D5B9]/45 border-l-3 border-[#B96535] p-3 rounded-r-lg text-xs italic font-serif text-[#29251F] mb-4 leading-relaxed">
                      "{evt.archivalQuote.text}"
                    </div>
                  )}

                  {/* Card Footer with Location and Direct Link */}
                  <div className="pt-3 border-t border-[#DED3C2] flex items-center justify-between text-xs text-[#827567]">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-[#B96535] shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </span>
                    <span className="text-[#B96535] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                      <span>Full Record</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Empty placeholder on the other side for desktop grid balance */}
              <div className="hidden md:block w-[calc(50%-2.5rem)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
};
