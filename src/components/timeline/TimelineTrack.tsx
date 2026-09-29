import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TimelineEvent } from '../../types';
import { Calendar, MapPin, ArrowRight, BookOpen, ExternalLink, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

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
        <p className="font-serif text-lg text-[#29251F]">No timeline events match your criteria.</p>
        <p className="text-xs mt-1">Try selecting another epoch, clearing the search query, or jumping to another decade.</p>
      </div>
    );
  }

  const dateTypeLabels: Record<string, string> = {
    event_occurred: 'Event',
    speech_delivered: 'Address',
    work_written: 'Authored',
    first_published: 'Publication',
    subsequent_edition: 'Edition',
  };

  return (
    <div className="relative py-8">
      {/* Central Connecting Vertical Line */}
      <div className="absolute top-4 bottom-4 left-6 md:left-1/2 w-0.5 bg-gradient-to-b from-[#B96535] via-[#DED3C2] to-[#B96535] -translate-x-1/2 z-0" />

      <div className="space-y-12 sm:space-y-16">
        {events.map((evt, idx) => {
          const isEven = idx % 2 === 0;
          const isSelected = selectedEvent?.id === evt.id;
          const hasLinkedWritings = evt.linkedWritings && evt.linkedWritings.length > 0;

          return (
            <div
              key={evt.id}
              id={`timeline-event-${evt.year}`}
              className={`relative flex flex-col md:flex-row items-center gap-6 md:gap-12 scroll-mt-28 ${
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

              {/* Event Card Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="w-full md:w-[calc(50%-2.5rem)] pl-12 md:pl-0 md:text-left"
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
                  className={`group bg-[#FBF8F2] border rounded-3xl p-6 sm:p-7 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-xl ${
                    isSelected
                      ? 'border-[#B96535] ring-2 ring-[#B96535]/25 shadow-md'
                      : 'border-[#DED3C2] hover:border-[#B96535]'
                  }`}
                >
                  {/* Card Header: Year Pill, Date & Type */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#B96535] text-white shadow-2xs">
                        {evt.year}
                      </span>
                      {evt.dateType && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#E7D5B9] text-[#713F2B] uppercase tracking-wider">
                          {dateTypeLabels[evt.dateType] || evt.dateType}
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-[#827567] flex items-center gap-1 font-medium">
                      <Calendar className="w-3.5 h-3.5 text-[#B96535]" />
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

                  {/* LINKED OFFICIAL MEA WRITINGS & DIRECT PDF LINKS */}
                  {hasLinkedWritings && (
                    <div className="mb-4 pt-3 border-t border-[#DED3C2] space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#713F2B] flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5 text-[#B96535]" />
                          <span>Official MEA Source Document{evt.linkedWritings!.length > 1 ? 's' : ''}</span>
                        </span>
                        <span className="text-[10px] text-emerald-800 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Verified Facsimile</span>
                        </span>
                      </div>

                      <div className="space-y-2">
                        {evt.linkedWritings!.map((writing, wIdx) => {
                          const targetPage = writing.pageNumber || 1;
                          const targetUrl = `/archive/${writing.id}?page=${targetPage}&from=timeline&year=${evt.year}&view=pdf`;

                          return (
                            <div
                              key={wIdx}
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#FAF4EA] border border-[#DED3C2] hover:border-[#B96535] p-3 rounded-2xl transition-all space-y-2 text-xs"
                            >
                              <div className="flex flex-wrap items-center justify-between gap-1.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#E7D5B9] text-[#713F2B]">
                                    {writing.language === 'Hindi' ? `खण्ड ${writing.volume}` : `BAWS Vol. ${writing.volume}`}
                                    {writing.part ? ` Pt. ${writing.part}` : ''}
                                  </span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-stone-200 text-stone-700 font-semibold">
                                    {writing.language}
                                  </span>
                                </div>

                                {writing.pageVerified ? (
                                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                                    PDF Page {targetPage} (Verified)
                                  </span>
                                ) : (
                                  <span className="text-[10px] text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                                    Page {targetPage} (Passage unverified)
                                  </span>
                                )}
                              </div>

                              <p className="font-serif font-bold text-[#29251F] text-xs sm:text-sm line-clamp-1">
                                {writing.title}
                              </p>

                              {/* Direct Reader and MEA PDF Actions */}
                              <div className="flex flex-wrap items-center gap-2 pt-1">
                                <Link
                                  to={targetUrl}
                                  className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-[11px] font-bold shadow-2xs transition-colors"
                                  title={`Open ${writing.title} in document viewer at page ${targetPage}`}
                                >
                                  <FileText className="w-3 h-3" />
                                  <span>Read in Document Viewer (p. {targetPage})</span>
                                </Link>

                                <a
                                  href={`${writing.pdfUrl}#page=${targetPage}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white hover:bg-[#F5EBDD] text-[#713F2B] border border-[#DED3C2] rounded-xl text-[11px] font-semibold transition-colors"
                                  title="Open original official PDF file from MEA in new browser tab"
                                >
                                  <span>Open MEA PDF</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Card Footer with Location and Direct Link */}
                  <div className="pt-3 border-t border-[#DED3C2] flex items-center justify-between text-xs text-[#827567]">
                    <span className="flex items-center gap-1 truncate max-w-[200px]">
                      <MapPin className="w-3.5 h-3.5 text-[#B96535] shrink-0" />
                      <span className="truncate">{evt.location}</span>
                    </span>
                    <span className="text-[#B96535] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1 shrink-0">
                      <span>Inspect Event & Historical Sources</span>
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
