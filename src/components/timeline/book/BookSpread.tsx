import React from 'react';
import { TimelineEvent } from '../../../types';
import { EVENT_VISUAL_MAP, DEFAULT_EVENT_VISUAL } from './eventVisuals';
import { 
  Calendar, MapPin, BookOpen, Quote, ShieldCheck, 
  ExternalLink, ChevronRight, FileText 
} from 'lucide-react';

interface BookSpreadProps {
  event: TimelineEvent;
  pageNumber: number; // e.g., 1..24
  totalPages: number;
  onOpenProvenance?: (event: TimelineEvent) => void;
}

export const BookSpread: React.FC<BookSpreadProps> = ({
  event,
  pageNumber,
  totalPages,
  onOpenProvenance,
}) => {
  if (!event) return null;
  const visual = (event.id && EVENT_VISUAL_MAP[event.id]) || DEFAULT_EVENT_VISUAL;
  const leftPageNum = pageNumber * 2 - 1;
  const rightPageNum = pageNumber * 2;

  return (
    <div className="w-full h-full flex flex-col md:flex-row select-text font-serif">
      
      {/* ============================================================ */}
      {/* LEFT PAGE (Verso) - Visuals, Pull Quotes & Provenance        */}
      {/* ============================================================ */}
      <div className="w-full md:w-1/2 h-full bg-[#FAF4EA] border-r border-[#DED3C2] flex flex-col justify-between p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-[inset_-8px_0_16px_rgba(0,0,0,0.04)]">
        
        {/* Subtle Archival Gutter Shadow along the right edge (Center Spine) */}
        <div className="hidden md:block absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-black/15 via-black/5 to-transparent pointer-events-none" />
        
        {/* Verso Running Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DED3C2]/70 text-[10px] sm:text-[11px] font-mono tracking-wider text-[#827567] uppercase">
          <span className="font-semibold text-[#713F2B]">p. {leftPageNum}</span>
          <span className="truncate max-w-[200px] text-center">
            {event.era.split(':')[1] || event.era}
          </span>
          <span className="hidden sm:inline">Ambedkar Chronicle</span>
        </div>

        {/* Verso Core Content: Visual & Pull Quote */}
        <div className="my-auto space-y-5 py-3">
          
          {/* Authentic Archival Photograph / Visual Plate */}
          <div className="relative group">
            <div className="relative rounded-xl overflow-hidden border-2 border-[#DED3C2] bg-[#E7D5B9]/40 shadow-xs max-h-48 sm:max-h-56 md:max-h-60 mx-auto">
              <img
                src={visual.image}
                alt={event.title}
                className="w-full h-full object-cover object-center max-h-48 sm:max-h-56 md:max-h-60 transition-transform duration-500 group-hover:scale-102"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              
              {/* Location Badge on Image */}
              {event.location && (
                <div className="absolute bottom-2 left-2 right-2 flex items-center gap-1.5 text-[10px] font-mono text-white/95 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-md">
                  <MapPin className="w-3 h-3 text-[#E7D5B9] shrink-0" />
                  <span className="truncate">{event.location}</span>
                </div>
              )}
            </div>

            {/* Photo Caption */}
            <p className="text-[10px] sm:text-[11px] font-mono text-[#827567] mt-1.5 text-center italic leading-tight">
              {visual.imageCaption}
            </p>
          </div>

          {/* Archival Quotation Plate */}
          {event.archivalQuote && (
            <div className="bg-[#F5EBDD]/80 border-l-2 border-[#B96535] p-3 sm:p-4 rounded-r-xl relative space-y-1">
              <Quote className="w-4 h-4 text-[#B96535]/40 absolute top-2 right-2" />
              <p className="font-serif italic text-xs sm:text-sm text-[#29251F] leading-relaxed">
                "{event.archivalQuote.text}"
              </p>
              <span className="block text-[10px] font-mono text-[#713F2B] font-semibold text-right">
                — {event.archivalQuote.source}
              </span>
            </div>
          )}

        </div>

        {/* Verso Footer Citation */}
        <div className="pt-3 border-t border-[#DED3C2]/70 flex items-center justify-between text-[10px] text-[#827567] font-mono">
          <span className="truncate max-w-[240px]">
            Ref: {event.sourceCitation || 'Primary Archival Holdings'}
          </span>
          <span className="font-bold text-[#713F2B]">Vol. {event.sourceVolume || 'XII'}</span>
        </div>

      </div>

      {/* ============================================================ */}
      {/* RIGHT PAGE (Recto) - Historical Narrative, Analysis & Actions */}
      {/* ============================================================ */}
      <div className="w-full md:w-1/2 h-full bg-[#FAF4EA] flex flex-col justify-between p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-[inset_8px_0_16px_rgba(0,0,0,0.04)]">
        
        {/* Subtle Archival Gutter Shadow along the left edge (Center Spine) */}
        <div className="hidden md:block absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-black/20 via-black/8 to-transparent pointer-events-none" />

        {/* Recto Running Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#DED3C2]/70 text-[10px] sm:text-[11px] font-mono tracking-wider text-[#827567] uppercase">
          <span className="hidden sm:inline">The Ambedkar Chronicle</span>
          <span className="text-[#B96535] font-bold">Milestone {pageNumber} of {totalPages}</span>
          <span className="font-semibold text-[#713F2B]">p. {rightPageNum}</span>
        </div>

        {/* Recto Core Historical Event Narrative */}
        <div className="my-auto space-y-3.5 py-3">
          
          {/* Date & Epoch Badge Row */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-[#713F2B] text-white text-xs font-mono font-bold tracking-wider shadow-2xs">
              {event.exactDate || event.year}
            </span>
            <span className="px-2 py-0.5 rounded-md bg-[#E7D5B9] text-[#713F2B] text-[10px] font-mono font-semibold tracking-wide border border-[#DED3C2]">
              {visual.accentBadge}
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-1">
            <h3 className="font-serif text-xl sm:text-2xl lg:text-[1.75rem] font-bold text-[#29251F] leading-[1.18] tracking-tight">
              {event.title}
            </h3>
            {event.subtitle && (
              <p className="text-xs sm:text-sm font-serif italic text-[#713F2B]">
                {event.subtitle}
              </p>
            )}
          </div>

          {/* Detailed Narrative */}
          <div className="font-sans text-xs sm:text-sm text-[#3E3830] leading-relaxed space-y-2.5 font-normal">
            <p>
              {event.detailedNarrative || event.summary}
            </p>
            {event.historicalSignificance && (
              <div className="bg-[#FAF4EA] border border-[#DED3C2] p-2.5 rounded-lg text-[11px] sm:text-xs text-[#51483F] font-serif leading-relaxed">
                <strong className="text-[#713F2B] font-sans font-semibold text-[10px] tracking-wider uppercase block mb-0.5">
                  Historical Significance
                </strong>
                {event.historicalSignificance}
              </div>
            )}
          </div>

        </div>

        {/* Recto Footer Action: Provenance & Full Document Inspector */}
        <div className="pt-3 border-t border-[#DED3C2]/70 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#827567]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Verified Primary Source</span>
          </div>

          <button
            type="button"
            onClick={() => onOpenProvenance && onOpenProvenance(event)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#B96535] hover:bg-[#713F2B] text-white text-[11px] font-sans font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            title="Inspect full documentary provenance, citations & connected MEA volumes"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Read Full Provenance</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
