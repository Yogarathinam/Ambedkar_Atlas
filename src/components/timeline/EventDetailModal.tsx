import React from 'react';
import { TimelineEvent, ArchiveRecord } from '../../types';
import { X, Calendar, MapPin, Quote, ArrowRight, BookOpen, ExternalLink, ShieldCheck, Tag, FileText, CheckCircle2 } from 'lucide-react';
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

  const dateTypeLabels: Record<string, string> = {
    event_occurred: 'Historical Event',
    speech_delivered: 'Address Delivered',
    work_written: 'Work Authored',
    first_published: 'Original Publication',
    subsequent_edition: 'Edition Published',
  };

  const hasLinkedWritings = event.linkedWritings && event.linkedWritings.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Surface */}
      <div className="relative bg-[#FBF8F2] border-2 border-[#DED3C2] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl z-10 space-y-6">
        
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-[#DED3C2]">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-[#B96535] text-white">
                {event.year}
              </span>
              <span className="text-xs text-[#827567] flex items-center gap-1 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#B96535]" />
                {event.exactDate}
              </span>
              {event.dateType && (
                <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-[#E7D5B9] text-[#713F2B] flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  {dateTypeLabels[event.dateType] || event.dateType}
                </span>
              )}
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F] leading-tight">
              {event.title}
            </h2>
            <p className="text-sm font-medium text-[#713F2B] mt-1">{event.subtitle}</p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#827567] hover:text-[#29251F] hover:bg-[#E7D5B9] transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Location & Epoch */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#51483F] bg-[#F5EBDD] p-3 rounded-2xl border border-[#DED3C2]">
          <span className="flex items-center gap-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#B96535]" />
            {event.location}
          </span>
          <span>•</span>
          <span className="text-[#713F2B] font-medium">
            {event.era}
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            {event.sourceType === 'primary' ? 'Primary Documented Event' : 'Secondary Historical Record'}
          </span>
        </div>

        {/* Archival Quote if available */}
        {event.archivalQuote && (
          <div className="bg-[#E7D5B9]/40 border-l-4 border-[#B96535] p-4 rounded-r-2xl italic font-serif text-[#29251F] text-base leading-relaxed">
            <Quote className="w-5 h-5 text-[#B96535] mb-1 opacity-70" />
            <p>"{event.archivalQuote.text}"</p>
            <span className="block text-right text-xs not-italic font-sans font-medium text-[#827567] mt-1.5">
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
            <p className="text-sm text-[#29251F] bg-[#F5EBDD]/60 p-3.5 rounded-2xl border border-[#DED3C2]">
              {event.historicalSignificance}
            </p>
          </div>
        </div>

        {/* Authoritative Source Citation */}
        <div className="bg-[#FFF] p-4 rounded-2xl border border-[#DED3C2] space-y-2 text-xs text-[#51483F]">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-[#29251F] text-sm">Documentary Source Citation:</span>
            {event.sourceUrl && (
              <a
                href={event.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#B96535] hover:text-[#713F2B] font-semibold flex items-center gap-1 hover:underline"
              >
                <span>Inspect Source PDF</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
          <p className="font-mono text-xs text-[#29251F] bg-[#F5EBDD] p-2.5 rounded-xl border border-[#DED3C2]">
            {event.sourceCitation}
          </p>
        </div>

        {/* VERIFIED LINKED MEA WRITINGS & DIRECT PDF NAVIGATOR */}
        {hasLinkedWritings && (
          <div className="pt-4 border-t border-[#DED3C2] space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-serif text-base font-bold text-[#29251F] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#B96535]" />
                <span>Verified Source Documents (Official MEA Collection)</span>
              </h4>
              <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Original PDF Available</span>
              </span>
            </div>

            <div className="space-y-3">
              {event.linkedWritings!.map((writing, idx) => {
                const targetPage = writing.pageNumber || 1;
                const targetUrl = `/archive/${writing.id}?page=${targetPage}&from=timeline&year=${event.year}&view=pdf`;

                return (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[#FAF4EA] border border-[#DED3C2] hover:border-[#B96535] transition-all space-y-2.5"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-[#E7D5B9] text-[#713F2B]">
                          {writing.language === 'Hindi' ? `खण्ड ${writing.volume}` : `BAWS Vol. ${writing.volume}`}
                          {writing.part ? ` Pt. ${writing.part}` : ''}
                        </span>
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-stone-200 text-stone-800">
                          {writing.language}
                        </span>
                      </div>

                      {writing.pageVerified ? (
                        <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                          Verified PDF Page {targetPage}
                        </span>
                      ) : (
                        <span className="text-xs text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                          Page {targetPage} (Passage location unverified)
                        </span>
                      )}
                    </div>

                    <div>
                      <h5 className="font-serif font-bold text-base text-[#29251F]">
                        {writing.title}
                      </h5>
                      {writing.chapterTitle && (
                        <p className="text-xs font-semibold text-[#713F2B] mt-0.5">
                          Chapter: {writing.chapterTitle}
                        </p>
                      )}
                      {writing.historicalContext && (
                        <p className="text-xs text-[#51483F] mt-1 leading-relaxed">
                          {writing.historicalContext}
                        </p>
                      )}
                    </div>

                    {/* Direct Actions: Open in Document Viewer vs Open MEA PDF */}
                    <div className="pt-2 flex flex-wrap items-center gap-2.5">
                      <Link
                        to={targetUrl}
                        onClick={onClose}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Read in Document Viewer (Page {targetPage})</span>
                      </Link>

                      <a
                        href={`${writing.pdfUrl}#page=${targetPage}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-[#F5EBDD] text-[#713F2B] border border-[#DED3C2] rounded-xl text-xs font-semibold transition-colors"
                      >
                        <span>Open Original MEA PDF ↗</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Fallback to Related Archive Records if linkedWritings is empty */}
        {!hasLinkedWritings && relatedRecords.length > 0 && (
          <div className="pt-4 border-t border-[#DED3C2]">
            <h4 className="font-serif text-base font-bold text-[#29251F] mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#B96535]" />
              Linked Primary Documents in Archive
            </h4>
            <div className="space-y-2">
              {relatedRecords.map((rec) => {
                const targetPage = event.linkedRecordPage || 1;
                const targetUrl = `/archive/${rec.id}?page=${targetPage}&from=timeline&year=${event.year}&view=pdf`;

                return (
                  <Link
                    key={rec.id}
                    to={targetUrl}
                    onClick={onClose}
                    className="flex items-center justify-between p-3.5 rounded-xl bg-[#F5EBDD] hover:bg-[#E7D5B9] border border-[#DED3C2] transition-all group shadow-2xs hover:shadow-xs"
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-[#713F2B] uppercase tracking-wider">
                          {rec.category} • {rec.year}
                        </span>
                        {event.linkedRecordPage && (
                          <span className="text-[10px] bg-[#B96535] text-white px-1.5 py-0.2 rounded font-semibold">
                            Page {event.linkedRecordPage}
                          </span>
                        )}
                      </div>
                      <span className="text-sm font-serif font-bold text-[#29251F] group-hover:text-[#B96535] transition-colors block">
                        {rec.title}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#827567] group-hover:translate-x-1 group-hover:text-[#B96535] transition-all shrink-0 ml-3" />
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
