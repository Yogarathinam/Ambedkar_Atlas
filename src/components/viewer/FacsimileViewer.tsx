import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, ShieldCheck, Eye } from 'lucide-react';
import { ArchiveRecord } from '../../types';

interface FacsimileViewerProps {
  record?: ArchiveRecord;
  mediaUrl?: string;
  title?: string;
  accessionNumber?: string;
  verificationStatus?: string;
}

export const FacsimileViewer: React.FC<FacsimileViewerProps> = ({ 
  record,
  mediaUrl,
  title,
  accessionNumber,
  verificationStatus
}) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const displayTitle = title || record?.title || 'Archival Document';
  const displayAccession = accessionNumber || record?.accessionNumber || 'MEA-ARCHIVE-001';
  const displayVerification = verificationStatus || record?.verificationStatus || 'Master Facsimile';
  const displayDate = record?.date || 'Historical Epoch';
  const displayLocation = record?.locationCreated || 'New Delhi, India';
  const displayTranscription = record?.transcription || '';
  const displayCollection = record?.sourceCollection || 'National Archival Repository';

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 20, 200));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 20, 60));
  const handleResetZoom = () => setZoomLevel(100);

  return (
    <div className={`relative bg-[#29251F] rounded-2xl overflow-hidden border border-[#DED3C2] transition-all ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl flex flex-col' : 'min-h-[500px]'
    }`}>
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-[#FBF8F2]/90 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#DED3C2] flex items-center gap-2 text-xs font-medium text-[#29251F] shadow-sm">
          <ShieldCheck className="w-4 h-4 text-[#B96535]" />
          <span>Accession: {displayAccession}</span>
          <span className="text-[#827567] hidden sm:inline">({displayVerification})</span>
        </div>

        <div className="pointer-events-auto bg-[#FBF8F2]/90 backdrop-blur-xs p-1 rounded-lg border border-[#DED3C2] flex items-center gap-1 shadow-sm">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-[#51483F] hover:text-[#29251F] hover:bg-[#E7D5B9] rounded transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <span className="text-xs font-mono font-medium px-1 text-[#29251F] w-12 text-center">
            {zoomLevel}%
          </span>
          <button
            onClick={handleZoomIn}
            className="p-1.5 text-[#51483F] hover:text-[#29251F] hover:bg-[#E7D5B9] rounded transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-[#DED3C2] mx-0.5" />
          <button
            onClick={handleResetZoom}
            className="p-1.5 text-[#51483F] hover:text-[#29251F] hover:bg-[#E7D5B9] rounded transition-colors"
            title="Reset Zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-[#51483F] hover:text-[#29251F] hover:bg-[#E7D5B9] rounded transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Facsimile Document Surface with Zoom */}
      <div className="w-full h-full flex-1 overflow-auto p-8 sm:p-12 flex items-center justify-center bg-radial from-[#3A342B] to-[#1C1814]">
        <div
          style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
          className="transition-transform duration-200 shadow-2xl relative bg-[#F7EFE3] text-[#29251F] w-full max-w-2xl min-h-[580px] p-8 sm:p-12 rounded border border-[#DED3C2] flex flex-col justify-between paper-grain"
        >
          {/* Subtle Archival Watermark */}
          <div className="absolute inset-0 flex items-center justify-center opacity-4 pointer-events-none">
            <img src="/seal.svg" alt="" className="w-96 h-96" />
          </div>

          {/* Facsimile Header */}
          <div className="border-b-2 border-double border-[#C5B8A5] pb-4 mb-6 text-center">
            <span className="text-[11px] font-serif tracking-widest text-[#713F2B] uppercase block">
              Official Archival Facsimile Reproduction
            </span>
            <h2 className="font-serif text-2xl font-bold tracking-tight mt-1 text-[#1F1B16]">
              {displayTitle}
            </h2>
            <div className="text-xs text-[#827567] mt-1 italic font-serif">
              {displayDate} • {displayLocation}
            </div>
          </div>

          {/* Facsimile Body with vintage typeset */}
          <div className="font-serif text-base sm:text-lg leading-relaxed text-[#2D261E] space-y-4 text-justify px-2">
            {displayTranscription ? (
              displayTranscription.split('\n\n').slice(0, 3).map((para, idx) => (
                <p key={idx} className="indent-6 first-letter:text-2xl first-letter:font-bold first-letter:text-[#713F2B]">
                  {para}
                </p>
              ))
            ) : (
              <p className="italic text-[#827567] text-center py-12">
                [High-resolution master facsimile plate: {displayCollection}]
              </p>
            )}
          </div>

          {/* Facsimile Footer with Seal and Catalog stamp */}
          <div className="mt-8 pt-4 border-t border-[#DED3C2] flex items-center justify-between text-xs text-[#827567]">
            <div className="flex items-center gap-2">
              <img src="/seal.svg" alt="" className="w-8 h-8 opacity-80" />
              <div>
                <span className="font-mono text-[10px] text-[#713F2B] block">AUTHENTICATED DIGITISATION</span>
                <span>BAWS Collection Records</span>
              </div>
            </div>
            <div className="text-right font-mono text-[11px]">
              Page 1 of 1 • Ref: {record?.id || displayAccession}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
