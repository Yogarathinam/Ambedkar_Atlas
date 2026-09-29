import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArchiveRecord } from '../../types';
import { Bookmark, FileText, Mic, Image, Radio, Film, Scroll, ExternalLink, Calendar, CheckCircle2, Copy } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useToast } from '../../context/ToastContext';

interface ArchiveCardProps {
  record: ArchiveRecord;
  viewMode?: 'grid' | 'list';
}

export const ArchiveCard: React.FC<ArchiveCardProps> = ({ record, viewMode = 'grid' }) => {
  const navigate = useNavigate();
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();
  const bookmarked = isBookmarked(record.id);

  const getFormatIcon = (format: string) => {
    switch (format) {
      case 'audio': return <Radio className="w-4 h-4" />;
      case 'video': return <Film className="w-4 h-4" />;
      case 'photo': return <Image className="w-4 h-4" />;
      case 'manuscript': return <Scroll className="w-4 h-4" />;
      case 'speech':
      case 'speeches': return <Mic className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleCopyCitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(record.citations.apa);
    showToast('APA Citation copied to clipboard', 'success');
  };

  const handleBookmarkToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleBookmark(record.id, record.title);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={() => navigate(`/archive/${record.id}`)}
        className="group bg-[#FBF8F2] border border-[#DED3C2] hover:border-[#B96535] rounded-xl p-5 transition-all duration-200 hover:shadow-md cursor-pointer flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#E7D5B9]/70 text-[#713F2B] border border-[#DED3C2]">
              {getFormatIcon(record.format)}
              <span className="capitalize">{record.category}</span>
            </span>
            <span className="text-xs text-[#827567] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{record.date}</span>
            </span>
            <span className="text-[11px] text-[#29251F] bg-[#E7D5B9]/40 px-2 py-0.5 rounded border border-[#DED3C2]">
              {record.language}
            </span>
            {record.verificationStatus !== 'Authoritative External Catalogue' && (
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            )}
          </div>

          <h3 className="font-serif text-xl font-bold text-[#29251F] group-hover:text-[#B96535] transition-colors leading-snug line-clamp-2 sm:line-clamp-3">
            {record.title}
          </h3>

          <p className="text-sm text-[#51483F] line-clamp-3 sm:line-clamp-4 leading-relaxed">
            {record.shortDescription}
          </p>

          <div className="text-xs text-[#827567] italic">
            Source: {record.sourceCollection}
          </div>
        </div>

        <div className="flex sm:flex-col items-center gap-2 self-end sm:self-center shrink-0">
          <button
            onClick={handleBookmarkToggle}
            className={`p-2 rounded-lg border transition-colors ${
              bookmarked
                ? 'bg-[#B96535] text-white border-[#B96535]'
                : 'bg-[#F5EBDD] text-[#51483F] hover:text-[#29251F] border-[#DED3C2]'
            }`}
            title={bookmarked ? 'Remove Bookmark' : 'Save Record'}
            aria-label="Bookmark record"
          >
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleCopyCitation}
            className="p-2 rounded-lg bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#51483F] hover:text-[#29251F] border border-[#DED3C2] transition-colors"
            title="Copy APA Citation"
            aria-label="Copy citation"
          >
            <Copy className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Grid layout card
  return (
    <div
      onClick={() => navigate(`/archive/${record.id}`)}
      className="group h-full bg-[#FBF8F2] border border-[#DED3C2] hover:border-[#B96535] rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col justify-between"
    >
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#E7D5B9]/80 text-[#713F2B] border border-[#DED3C2]">
            {getFormatIcon(record.format)}
            <span className="capitalize">{record.category}</span>
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={handleCopyCitation}
              className="p-1.5 rounded-md hover:bg-[#E7D5B9] text-[#827567] hover:text-[#29251F] transition-colors"
              title="Copy Citation"
              aria-label="Copy citation"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleBookmarkToggle}
              className={`p-1.5 rounded-md transition-colors ${
                bookmarked ? 'text-[#B96535]' : 'text-[#827567] hover:text-[#29251F]'
              }`}
              title={bookmarked ? 'Remove Bookmark' : 'Save Record'}
              aria-label="Bookmark record"
            >
              <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Date and Era */}
        <div className="flex items-center gap-2 text-xs text-[#827567]">
          <span className="flex items-center gap-1 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            {record.date}
          </span>
          <span>•</span>
          <span className="bg-[#E7D5B9]/40 px-1.5 py-0.5 rounded text-[11px]">
            {record.language}
          </span>
          {record.verificationStatus !== 'Authoritative External Catalogue' && (
            <>
              <span>•</span>
              <span className="text-[11px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 flex items-center gap-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>Verified</span>
              </span>
            </>
          )}
        </div>

        {/* Title: allows 3 lines with consistent alignment */}
        <div className="min-h-[3.75rem] flex items-start">
          <h3 className="font-serif text-xl font-bold text-[#29251F] group-hover:text-[#B96535] transition-colors line-clamp-3 leading-snug">
            {record.title}
          </h3>
        </div>

        {/* Short Description: generous 4-line room for meaningful context */}
        <p className="text-sm text-[#51483F] line-clamp-4 leading-relaxed flex-1">
          {record.shortDescription}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 pt-2 mt-auto">
          {record.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[11px] bg-[#F5EBDD] text-[#713F2B] px-2 py-0.5 rounded-md border border-[#DED3C2]">
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Footer with Verification and Accession */}
      <div className="px-6 py-3 bg-[#F5EBDD]/60 border-t border-[#DED3C2] flex items-center justify-between text-xs text-[#827567] mt-auto">
        <span className="truncate max-w-[170px]" title={record.sourceCollection}>
          {record.sourceCollection}
        </span>
        <span className="font-medium text-[#B96535] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
          Inspect <ExternalLink className="w-3 h-3" />
        </span>
      </div>
    </div>
  );
};
