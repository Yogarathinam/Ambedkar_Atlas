import React, { useState, useMemo } from 'react';
import { ArchiveRecord, CitationFormat } from '../../types';
import { citationService } from '../../services/citationService';
import { X, Copy, Check, BookOpen, ExternalLink, ShieldCheck, AlertCircle, FileText } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  record?: ArchiveRecord | null;
  // Fallbacks if only simple citations and title were passed
  citations?: CitationFormat;
  title?: string;
  currentPage?: number;
  pageRange?: string;
  isTranslation?: boolean;
}

export const CitationModal: React.FC<CitationModalProps> = ({
  isOpen,
  onClose,
  record,
  citations: fallbackCitations,
  title: fallbackTitle,
  currentPage,
  pageRange,
  isTranslation = false,
}) => {
  // Chicago Notes and Bibliography as the primary archival standard
  const [activeTab, setActiveTab] = useState<keyof CitationFormat>('chicago');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const formattedData = useMemo(() => {
    if (record) {
      return citationService.formatCitations(record, {
        pageNumber: currentPage,
        pageRange,
        isTranslation,
      });
    }
    // Fallback if record object wasn't supplied
    return null;
  }, [record, currentPage, pageRange, isTranslation]);

  if (!isOpen) return null;

  const currentTitle = record?.title || fallbackTitle || 'Archival Record';
  const citations = formattedData?.formats || fallbackCitations || {
    chicago: currentTitle,
    compact: currentTitle,
    apa: currentTitle,
    mla: currentTitle,
    bibtex: `@misc{ambedkar,\n  title={${currentTitle}}\n}`,
  };

  const activeCitationText = citations[activeTab] || citations.chicago || '';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCitationText);
    setCopied(true);
    showToast(`${activeTab.toUpperCase()} Citation copied to clipboard`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { key: keyof CitationFormat; label: string; sublabel: string }[] = [
    { key: 'chicago', label: 'Chicago', sublabel: 'Notes & Bib (17th ed.)' },
    { key: 'compact', label: 'Compact', sublabel: 'One-Click Source' },
    { key: 'apa', label: 'APA', sublabel: '7th Edition' },
    { key: 'mla', label: 'MLA', sublabel: '9th Edition' },
    { key: 'bibtex', label: 'BibTeX', sublabel: 'Standard Format' },
  ];

  const sourceUrl = record?.originalPdfUrl || record?.sourceUrl || record?.mediaUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      {/* Modal Dialog */}
      <div className="relative bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b border-[#DED3C2] gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] text-[#713F2B] flex items-center justify-center shrink-0 shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#29251F]">
                  Scholarly Archival Citation
                </h3>
                {currentPage && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-[#B96535] text-white">
                    Page {currentPage}
                  </span>
                )}
              </div>
              <p className="text-xs text-[#827567] truncate max-w-md mt-0.5">
                {currentTitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#827567] hover:text-[#29251F] hover:bg-[#E7D5B9] transition-colors"
            aria-label="Close citation modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Translation Transparency Banner */}
        {isTranslation && (
          <div className="flex items-center gap-2.5 p-3 bg-[#E7D5B9]/40 border border-[#DED3C2] rounded-xl text-xs text-[#713F2B]">
            <AlertCircle className="w-4 h-4 shrink-0 text-[#B96535]" />
            <span>
              <strong>Translation Note:</strong> You are citing an English rendering of Dr. Ambedkar's original text composed in {record?.language || 'Marathi'}. The citation preserves the original historical attribution.
            </span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex flex-wrap border-b border-[#DED3C2] gap-1">
          {tabs.map((tab) => {
            const isSelected = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all ${
                  isSelected
                    ? 'bg-[#E7D5B9] text-[#29251F] border-b-2 border-[#B96535] shadow-2xs'
                    : 'text-[#827567] hover:text-[#29251F] hover:bg-[#F5EBDD]'
                }`}
              >
                <span>{tab.label}</span>
                <span className="hidden sm:inline text-[10px] opacity-70 ml-1">({tab.sublabel})</span>
              </button>
            );
          })}
        </div>

        {/* Formatted Citation Box */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-[#827567]">
            <span className="font-medium">
              {activeTab === 'chicago' && 'Chicago Notes and Bibliography (Primary Archival Standard)'}
              {activeTab === 'compact' && 'Compact Archival Reference for Quick Notes'}
              {activeTab === 'apa' && 'American Psychological Association (7th ed.)'}
              {activeTab === 'mla' && 'Modern Language Association (9th ed.)'}
              {activeTab === 'bibtex' && 'Standard BibTeX Citation Record'}
            </span>
            {currentPage && (
              <span className="text-[#B96535] font-semibold flex items-center gap-1">
                <FileText className="w-3 h-3" />
                Precise to Page {currentPage}
              </span>
            )}
          </div>

          <div className="relative bg-[#F5EBDD] border border-[#DED3C2] rounded-xl p-4 font-mono text-xs text-[#29251F] leading-relaxed break-words whitespace-pre-wrap select-all shadow-inner">
            {activeCitationText}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#B96535] hover:text-[#713F2B] hover:underline"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Original Primary Source PDF</span>
            </a>
          ) : (
            <span className="text-xs text-[#827567]">Official repository citation</span>
          )}

          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#B96535] hover:bg-[#713F2B] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs hover:shadow-md cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Citation Copied!' : 'Copy Citation to Clipboard'}</span>
          </button>
        </div>

        {/* Verified Metadata Breakdown */}
        {record && (
          <div className="pt-4 border-t border-[#DED3C2] space-y-2.5 text-xs text-[#51483F]">
            <div className="flex items-center gap-1.5 font-serif font-bold text-sm text-[#29251F]">
              <ShieldCheck className="w-4 h-4 text-emerald-700" />
              <span>Document Provenance & Archival Verification</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-[#FFF]/70 p-3 rounded-xl border border-[#DED3C2]">
              <div>
                <span className="text-[#827567] block">Author / Speaker:</span>
                <span className="font-semibold text-[#29251F]">{record.author || 'Dr. B. R. Ambedkar'}</span>
              </div>
              <div>
                <span className="text-[#827567] block">Document Date:</span>
                <span className="font-semibold text-[#29251F]">{record.date}</span>
              </div>
              <div>
                <span className="text-[#827567] block">Source Volume:</span>
                <span className="font-semibold text-[#29251F]">
                  {record.sourceVolume ? `BAWS Volume ${record.sourceVolume}${record.part ? `, Part ${record.part}` : ''}` : record.sourceCollection}
                </span>
              </div>
              <div>
                <span className="text-[#827567] block">Page Ingested:</span>
                <span className="font-semibold text-[#29251F]">
                  {currentPage ? `Page ${currentPage}` : record.pageRange ? `pp. ${record.pageRange}` : 'Complete Work'}
                </span>
              </div>
              <div className="sm:col-span-2">
                <span className="text-[#827567] block">Publishing Institution:</span>
                <span className="font-semibold text-[#29251F]">
                  {record.publisher || 'Dr. Ambedkar Foundation, Ministry of Social Justice & Empowerment, Government of India'}
                </span>
              </div>
              <div className="sm:col-span-2 flex items-center justify-between pt-1 border-t border-[#DED3C2]/50">
                <span className="text-[#827567]">Verification Status:</span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  <ShieldCheck className="w-3 h-3" />
                  {record.verificationStatus}
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
