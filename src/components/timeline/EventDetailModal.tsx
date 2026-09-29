import React from 'react';
import { TimelineEvent, ArchiveRecord } from '../../types';
import { X, Calendar, MapPin, Quote, ArrowRight, BookOpen, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EventDetailModalProps {
  event: TimelineEvent | null;
  onClose: () => void;
  relatedRecords: ArchiveRecord[];
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  relatedRecords,
}) => {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Surface */}
      <div className="relative bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DED3C2]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B96535] text-white">
                {event.year}
              </span>
              <span className="text-xs text-[#827567] flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                {event.exactDate}
              </span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F] leading-tight">
              {event.title}
            </h2>
            <p className="text-sm font-medium text-[#713F2B] mt-0.5">{event.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-[#827567] hover:text-[#29251F] hover:bg-[#E7D5B9] transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Location & Significance */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-[#51483F] bg-[#F5EBDD] p-3 rounded-lg border border-[#DED3C2]">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#B96535]" />
            {event.location}
          </span>
          <span>•</span>
          <span className="text-[#713F2B]">
            {event.era}
          </span>
        </div>

        {/* Archival Quote if available */}
        {event.archivalQuote && (
          <div className="bg-[#E7D5B9]/40 border-l-4 border-[#B96535] p-4 rounded-r-lg italic font-serif text-[#29251F] text-base leading-relaxed">
            <Quote className="w-5 h-5 text-[#B96535] mb-1 opacity-70" />
            <p>"{event.archivalQuote.text}"</p>
            <span className="block text-right text-xs not-italic font-sans font-medium text-[#827567] mt-1">
              — {event.archivalQuote.source}
            </span>
          </div>
        )}

        {/* Detailed Narrative */}
        <div className="space-y-3 text-sm sm:text-base text-[#51483F] leading-relaxed">
          <h4 className="font-serif text-lg font-bold text-[#29251F]">Historical Context</h4>
          <p>{event.detailedNarrative}</p>
          
          <div className="pt-2">
            <h5 className="font-semibold text-xs uppercase tracking-wider text-[#713F2B] mb-1">
              Historical Significance
            </h5>
            <p className="text-sm text-[#29251F] bg-[#F5EBDD]/60 p-3 rounded border border-[#DED3C2]">
              {event.historicalSignificance}
            </p>
          </div>
        </div>

        {/* Related Archival Records */}
        {relatedRecords.length > 0 && (
          <div className="pt-4 border-t border-[#DED3C2]">
            <h4 className="font-serif text-base font-bold text-[#29251F] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#B96535]" />
              Linked Archival Records in Catalog
            </h4>
            <div className="space-y-2">
              {relatedRecords.map((rec) => (
                <Link
                  key={rec.id}
                  to={`/archive/${rec.id}`}
                  onClick={onClose}
                  className="flex items-center justify-between p-3 rounded-lg bg-[#F5EBDD] hover:bg-[#E7D5B9] border border-[#DED3C2] transition-colors group"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-semibold text-[#713F2B] uppercase tracking-wider block">
                      {rec.category} • {rec.year}
                    </span>
                    <span className="text-sm font-serif font-bold text-[#29251F] group-hover:text-[#B96535] transition-colors block">
                      {rec.title}
                    </span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#827567] group-hover:translate-x-1 group-hover:text-[#B96535] transition-all shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
