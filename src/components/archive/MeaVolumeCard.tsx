import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, ExternalLink, Download, ChevronDown, ChevronUp, Layers, CheckCircle2, ArrowRight } from 'lucide-react';
import { MeaVolumeRecord } from '../../data/mea/ingestedVolumes';

interface MeaVolumeCardProps {
  volume: MeaVolumeRecord;
}

export const MeaVolumeCard: React.FC<MeaVolumeCardProps> = ({ volume }) => {
  const [tocExpanded, setTocExpanded] = useState(false);

  const isHindi = volume.language === 'Hindi';

  return (
    <div className="bg-[#FBF8F2] border-2 border-[#DED3C2] hover:border-[#B96535] rounded-3xl p-5 sm:p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group">
      
      {/* Top Header: Volume / Part & Language Badges */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7D5B9] text-[#713F2B] border border-[#DED3C2]">
              {isHindi ? `खण्ड ${volume.volume}` : `Volume ${volume.volume}`}
              {volume.part ? ` • Part ${volume.part}` : ''}
            </span>

            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-semibold border ${
              isHindi
                ? 'bg-amber-50 text-amber-900 border-amber-200'
                : 'bg-blue-50 text-blue-900 border-blue-200'
            }`}>
              {volume.language}
            </span>
          </div>

          <span className="text-[11px] font-mono text-[#827567] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official MEA</span>
          </span>
        </div>

        {/* Title */}
        <Link to={`/archive/${volume.id}`} className="block group-hover:text-[#B96535] transition-colors">
          <h3 className="font-serif text-lg sm:text-xl font-bold text-[#29251F] leading-snug line-clamp-2">
            {volume.title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-xs sm:text-sm text-[#51483F] leading-relaxed line-clamp-3">
          {volume.description}
        </p>

        {/* Meta Info: Page Count & File Size */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-[#827567] pt-2 border-t border-[#DED3C2]">
          <span><strong>{volume.pageCount}</strong> pages</span>
          <span>•</span>
          <span><strong>{volume.fileSize}</strong> PDF</span>
          <span>•</span>
          <span className="truncate max-w-[180px]">{volume.publisher.split('/')[0]}</span>
        </div>

        {/* Table of Contents Preview Accordion */}
        {volume.tableOfContents && volume.tableOfContents.length > 0 && (
          <div className="pt-2">
            <button
              onClick={() => setTocExpanded(!tocExpanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#713F2B] hover:text-[#B96535] transition-colors"
            >
              <span>{tocExpanded ? 'Hide Contents' : `Table of Contents (${volume.tableOfContents.length} chapters)`}</span>
              {tocExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {tocExpanded && (
              <div className="mt-2.5 p-3 rounded-2xl bg-[#FAF6EE] border border-[#DED3C2] max-h-48 overflow-y-auto space-y-1.5 text-xs">
                {volume.tableOfContents.map((item, idx) => (
                  <Link
                    key={idx}
                    to={`/archive/${volume.id}?page=${item.startPage}`}
                    className="flex items-start justify-between gap-2 p-1.5 rounded-lg hover:bg-[#E7D5B9]/60 text-[#51483F] transition-colors"
                  >
                    <span className="line-clamp-1">{item.title}</span>
                    <span className="text-[10px] font-mono text-[#827567] shrink-0">p.{item.startPage}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 mt-4 border-t border-[#DED3C2] flex items-center justify-between gap-2">
        <Link
          to={`/archive/${volume.id}`}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Read Document</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <a
            href={volume.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#713F2B] transition-colors border border-[#DED3C2]"
            title="Open official PDF from MEA server in new tab"
          >
            <Download className="w-3.5 h-3.5" />
          </a>

          <a
            href={volume.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#713F2B] transition-colors border border-[#DED3C2]"
            title="View on official MEA portal in new tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

    </div>
  );
};
