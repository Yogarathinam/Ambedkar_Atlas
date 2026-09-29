import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FileText, BookOpen, Search, ZoomIn, ZoomOut, Maximize2, 
  ChevronLeft, ChevronRight, ExternalLink, Globe, Copy, Check, 
  RotateCcw, ListFilter, AlertCircle, Sparkles, Download, ArrowUpRight
} from 'lucide-react';
import { MeaVolumeRecord, ExtractedPage } from '../../data/mea/ingestedVolumes';
import { EIGHTH_SCHEDULE_LANGUAGES } from '../../data/indianLanguages';
import { translationService, TranslationResult } from '../../services/translationService';
import { useToast } from '../../context/ToastContext';

interface InteractivePdfViewerProps {
  volume: MeaVolumeRecord;
  initialPage?: number;
  initialQuery?: string;
}

export const InteractivePdfViewer: React.FC<InteractivePdfViewerProps> = ({
  volume,
  initialPage = 1,
  initialQuery = '',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPage = parseInt(searchParams.get('page') || `${initialPage}`, 10) || 1;
  const urlQuery = searchParams.get('q') || initialQuery || '';

  const [currentPage, setCurrentPage] = useState<number>(urlPage);
  const [pageInput, setPageInput] = useState<string>(`${urlPage}`);
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>('text'); // default to extracted text view for instant accessibility
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [tocOpen, setTocOpen] = useState<boolean>(true);
  
  // In-document search state
  const [docSearchQuery, setDocSearchQuery] = useState<string>(urlQuery);
  const [searchOpen, setSearchOpen] = useState<boolean>(!!urlQuery);

  // Translation state for Extracted Text view
  const [selectedLangCode, setSelectedLangCode] = useState<string>('hi');
  const [langDropdownOpen, setLangDropdownOpen] = useState<boolean>(false);
  const [langSearch, setLangSearch] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const { showToast } = useToast();

  const totalPages = volume.pageCount || 500;

  // Sync state if URL page changes
  useEffect(() => {
    if (urlPage && urlPage !== currentPage) {
      setCurrentPage(urlPage);
      setPageInput(`${urlPage}`);
    }
  }, [urlPage]);

  // Sync state if URL query changes
  useEffect(() => {
    if (urlQuery) {
      setDocSearchQuery(urlQuery);
      setSearchOpen(true);
    }
  }, [urlQuery]);

  // Reset translation when page changes
  useEffect(() => {
    setTranslationResult(null);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    const validPage = Math.max(1, Math.min(totalPages, newPage));
    setCurrentPage(validPage);
    setPageInput(`${validPage}`);
    
    // Update URL param without refreshing
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', `${validPage}`);
    setSearchParams(newParams, { replace: true });
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed)) {
      handlePageChange(parsed);
    } else {
      setPageInput(`${currentPage}`);
    }
  };

  // Find extracted page text if available
  const extractedPageData: ExtractedPage | undefined = useMemo(() => {
    if (!volume.extractedPages || volume.extractedPages.length === 0) return undefined;
    return volume.extractedPages.find((p) => p.pdfPageNumber === currentPage);
  }, [volume.extractedPages, currentPage]);

  // In-document search matches
  const searchMatches = useMemo(() => {
    const q = docSearchQuery.trim().toLowerCase();
    if (!q) return [];

    const matches: Array<{ pageNumber: number; chapterTitle?: string; snippet: string }> = [];

    // Search in extracted pages
    if (volume.extractedPages && volume.extractedPages.length > 0) {
      for (const p of volume.extractedPages) {
        if (p.text.toLowerCase().includes(q)) {
          const idx = p.text.toLowerCase().indexOf(q);
          const start = Math.max(0, idx - 60);
          const end = Math.min(p.text.length, idx + q.length + 80);
          const snippet = (start > 0 ? '...' : '') + p.text.substring(start, end).trim() + (end < p.text.length ? '...' : '');
          matches.push({
            pageNumber: p.pdfPageNumber,
            chapterTitle: p.chapterTitle,
            snippet,
          });
        }
      }
    }

    // Search in TOC
    for (const item of volume.tableOfContents) {
      if (item.title.toLowerCase().includes(q)) {
        if (!matches.some((m) => m.pageNumber === item.startPage)) {
          matches.push({
            pageNumber: item.startPage,
            chapterTitle: item.title,
            snippet: `Table of Contents: ${item.title} (${item.part || 'Treatise'})`,
          });
        }
      }
    }

    return matches;
  }, [docSearchQuery, volume]);

  // Translation handler
  const handleTranslatePage = async () => {
    const textToTranslate = extractedPageData?.text || volume.description;
    if (!textToTranslate) return;

    setIsTranslating(true);
    setLangDropdownOpen(false);

    try {
      const result = await translationService.translateText(
        textToTranslate,
        selectedLangCode,
        { volumeTitle: volume.title, pageNumber: currentPage }
      );
      setTranslationResult(result);
      showToast(`Page translated to ${result.language.name} (${result.language.nativeName})`, 'success');
    } catch {
      showToast('Could not complete translation. Reverting to original text.', 'warning');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Text copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedLangObj = EIGHTH_SCHEDULE_LANGUAGES.find((l) => l.code === selectedLangCode) || EIGHTH_SCHEDULE_LANGUAGES[0];

  const filteredLanguages = EIGHTH_SCHEDULE_LANGUAGES.filter((lang) => {
    const q = langSearch.toLowerCase();
    return lang.name.toLowerCase().includes(q) || lang.nativeName.toLowerCase().includes(q);
  });

  // Highlight helper for search query matches in extracted text
  const renderHighlightedText = (rawText: string) => {
    if (!docSearchQuery.trim()) {
      return (
        <div className="space-y-4">
          {rawText.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed text-[#29251F] text-base sm:text-lg">
              {paragraph}
            </p>
          ))}
        </div>
      );
    }

    const queryRegex = new RegExp(`(${docSearchQuery.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const paragraphs = rawText.split('\n\n');

    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, pIdx) => {
          const parts = paragraph.split(queryRegex);
          return (
            <p key={pIdx} className="leading-relaxed text-[#29251F] text-base sm:text-lg">
              {parts.map((part, partIdx) =>
                part.toLowerCase() === docSearchQuery.trim().toLowerCase() ? (
                  <mark key={partIdx} className="bg-[#F6D06D] text-[#29251F] px-1 py-0.5 rounded font-semibold shadow-2xs">
                    {part}
                  </mark>
                ) : (
                  part
                )
              )}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-[#FBF8F2] border-2 border-[#DED3C2] rounded-3xl shadow-md overflow-hidden flex flex-col transition-all">
      
      {/* 1. Official MEA Source Attribution & Redirection Banner */}
      <div className="bg-[#FAF4EA] border-b border-[#DED3C2] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-[#713F2B]">
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-semibold uppercase tracking-wider">Official MEA Publication:</span>
          <span className="text-[#51483F] hidden sm:inline">
            Ministry of External Affairs & Dr. Ambedkar Foundation, Government of India
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* View on MEA Collection Link */}
          <a
            href={volume.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#713F2B] font-semibold border border-[#DED3C2] transition-colors"
            title="Open official Ministry of External Affairs collection page in new tab"
          >
            <span>View on MEA</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Open Original PDF Link */}
          <a
            href={volume.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#B96535] hover:bg-[#713F2B] text-white font-semibold shadow-2xs transition-colors"
            title="Download or view original PDF from MEA server"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Open Original PDF ({volume.fileSize})</span>
          </a>

          {/* Open Current Page in MEA PDF */}
          <a
            href={`${volume.originalUrl}#page=${currentPage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#51483F] font-semibold border border-[#DED3C2] transition-colors hidden md:inline-flex"
            title={`Open official PDF at page ${currentPage}`}
          >
            <span>PDF Page #{currentPage}</span>
            <ExternalLink className="w-3 h-3 text-[#B96535]" />
          </a>
        </div>
      </div>

      {/* 2. Document Reader Top Toolbar */}
      <div className="bg-[#F5EBDD]/80 border-b border-[#DED3C2] px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
        
        {/* Left: View Mode Toggle & Table of Contents Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#E7D5B9]/70 p-1 rounded-2xl border border-[#DED3C2]">
            <button
              onClick={() => setViewMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'text'
                  ? 'bg-[#29251F] text-white shadow-xs'
                  : 'text-[#51483F] hover:text-[#29251F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Extracted Text</span>
            </button>

            <button
              onClick={() => setViewMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                viewMode === 'pdf'
                  ? 'bg-[#29251F] text-white shadow-xs'
                  : 'text-[#51483F] hover:text-[#29251F]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Original PDF</span>
            </button>
          </div>

          {/* Table of Contents Button */}
          <button
            onClick={() => setTocOpen(!tocOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              tocOpen
                ? 'bg-[#E7D5B9] text-[#713F2B] border-[#B96535]'
                : 'bg-[#FBF8F2] text-[#51483F] border-[#DED3C2] hover:bg-[#F5EBDD]'
            }`}
            title="Toggle Table of Contents"
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Contents ({volume.tableOfContents.length})</span>
          </button>

          {/* In-Document Search Toggle */}
          <button
            onClick={() => setSearchOpen(!searchOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors ${
              searchOpen
                ? 'bg-[#E7D5B9] text-[#713F2B] border-[#B96535]'
                : 'bg-[#FBF8F2] text-[#51483F] border-[#DED3C2] hover:bg-[#F5EBDD]'
            }`}
            title="Search inside this volume"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Search in Doc</span>
            {searchMatches.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#B96535] text-white text-[10px]">
                {searchMatches.length}
              </span>
            )}
          </button>
        </div>

        {/* Center: PDF Page Navigation Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 rounded-xl bg-[#FBF8F2] border border-[#DED3C2] hover:bg-[#E7D5B9] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4 text-[#29251F]" />
          </button>

          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-1.5 text-xs font-semibold text-[#51483F]">
            <span>Page</span>
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={handlePageInputSubmit}
              className="w-14 text-center py-1 bg-[#FFF] border border-[#DED3C2] focus:border-[#B96535] rounded-lg text-xs font-bold text-[#29251F] focus:outline-none"
            />
            <span className="text-[#827567]">of {totalPages}</span>
          </form>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 rounded-xl bg-[#FBF8F2] border border-[#DED3C2] hover:bg-[#E7D5B9] disabled:opacity-40 disabled:pointer-events-none transition-colors"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4 text-[#29251F]" />
          </button>
        </div>

        {/* Right: Zoom & Fullscreen Controls for PDF */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
            className="p-1.5 rounded-xl bg-[#FBF8F2] border border-[#DED3C2] hover:bg-[#E7D5B9] transition-colors"
            title="Zoom out"
          >
            <ZoomOut className="w-4 h-4 text-[#51483F]" />
          </button>

          <span className="text-[11px] font-mono font-semibold text-[#827567] w-12 text-center">
            {zoomLevel}%
          </span>

          <button
            onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
            className="p-1.5 rounded-xl bg-[#FBF8F2] border border-[#DED3C2] hover:bg-[#E7D5B9] transition-colors"
            title="Zoom in"
          >
            <ZoomIn className="w-4 h-4 text-[#51483F]" />
          </button>

          <button
            onClick={() => setZoomLevel(100)}
            className="p-1.5 rounded-xl bg-[#FBF8F2] border border-[#DED3C2] hover:bg-[#E7D5B9] transition-colors"
            title="Fit to page width (100%)"
          >
            <Maximize2 className="w-4 h-4 text-[#51483F]" />
          </button>
        </div>

      </div>

      {/* 3. In-Document Search Bar (Expandable) */}
      {searchOpen && (
        <div className="bg-[#FAF4EA] border-b border-[#DED3C2] p-3.5 sm:px-6 transition-all space-y-2">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={docSearchQuery}
                onChange={(e) => setDocSearchQuery(e.target.value)}
                placeholder="Search words, phrases, or chapter names within this volume..."
                className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm bg-white border border-[#DED3C2] focus:border-[#B96535] rounded-xl text-[#29251F] focus:outline-none"
              />
              <Search className="w-4 h-4 text-[#827567] absolute left-3 top-2.5 pointer-events-none" />
            </div>
            {docSearchQuery && (
              <button
                onClick={() => setDocSearchQuery('')}
                className="text-xs font-semibold text-[#827567] hover:text-[#29251F] underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Search Matches Preview */}
          {docSearchQuery.trim() && (
            <div className="text-xs text-[#51483F]">
              <span className="font-semibold text-[#713F2B] mr-2">
                Found {searchMatches.length} matching passage{searchMatches.length === 1 ? '' : 's'}:
              </span>
              <div className="flex flex-wrap gap-2 pt-1.5 max-h-28 overflow-y-auto">
                {searchMatches.map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(m.pageNumber)}
                    className={`px-2.5 py-1 rounded-lg border text-left text-xs transition-colors flex items-center gap-1.5 ${
                      currentPage === m.pageNumber
                        ? 'bg-[#B96535] text-white border-[#B96535]'
                        : 'bg-white hover:bg-[#E7D5B9] text-[#29251F] border-[#DED3C2]'
                    }`}
                  >
                    <span className="font-bold">p.{m.pageNumber}</span>
                    <span className="truncate max-w-[200px] text-[11px] opacity-90">{m.snippet}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Main Body: Split Layout with Table of Contents Drawer & Reader Content */}
      <div className="flex flex-col lg:flex-row flex-1 min-h-[580px]">
        
        {/* Table of Contents Drawer */}
        {tocOpen && (
          <aside className="w-full lg:w-72 xl:w-80 bg-[#FAF6EE] border-b lg:border-b-0 lg:border-r border-[#DED3C2] p-4 shrink-0 overflow-y-auto max-h-[350px] lg:max-h-[720px] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#DED3C2]">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#B96535]" />
                <h3 className="font-serif text-sm font-bold text-[#29251F]">Table of Contents</h3>
              </div>
              <span className="text-[11px] font-mono text-[#827567]">
                {volume.tableOfContents.length} Chapters
              </span>
            </div>

            <div className="space-y-1 text-xs">
              {volume.tableOfContents.map((item, idx) => {
                const isActive = currentPage >= item.startPage && (!item.endPage || currentPage <= item.endPage);
                return (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(item.startPage)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 ${
                      isActive
                        ? 'bg-[#E7D5B9] text-[#713F2B] font-bold border-[#B96535] shadow-2xs'
                        : 'hover:bg-[#F5EBDD] text-[#51483F] border-transparent'
                    }`}
                  >
                    <div>
                      {item.part && (
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#827567] mb-0.5">
                          {item.part}
                        </span>
                      )}
                      <span className="line-clamp-2 leading-snug">{item.title}</span>
                    </div>
                    <span className="shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/5">
                      p.{item.startPage}
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        )}

        {/* Reader Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FBF8F2] overflow-hidden">
          
          {/* A. Extracted Text View */}
          {viewMode === 'text' && (
            <div className="flex-1 flex flex-col p-5 sm:p-8 overflow-y-auto max-h-[720px] space-y-6">
              
              {/* Multilingual Full-Text Translation Toolbar inside Transcription tab */}
              <div className="bg-[#FAF4EA] border border-[#DED3C2] rounded-2xl p-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 relative">
                    <Globe className="w-4 h-4 text-[#B96535]" />
                    <span className="text-xs font-bold text-[#713F2B]">
                      Full-Text Translation (22 Scheduled Indian Languages):
                    </span>

                    {/* Language Selector Dropdown */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#DED3C2] hover:border-[#B96535] rounded-xl text-xs font-semibold text-[#29251F] shadow-2xs"
                      >
                        <span>{selectedLangObj.name} ({selectedLangObj.nativeName})</span>
                      </button>

                      {langDropdownOpen && (
                        <div className="absolute left-0 top-full mt-1.5 w-64 bg-white border-2 border-[#DED3C2] rounded-2xl shadow-xl z-50 p-2 space-y-2">
                          <input
                            type="text"
                            value={langSearch}
                            onChange={(e) => setLangSearch(e.target.value)}
                            placeholder="Search Indian languages..."
                            className="w-full px-2.5 py-1.5 text-xs bg-[#FAF4EA] border border-[#DED3C2] rounded-lg focus:outline-none focus:border-[#B96535]"
                            autoFocus
                          />
                          <div className="max-h-48 overflow-y-auto space-y-0.5 text-xs">
                            {filteredLanguages.map((lang) => (
                              <button
                                key={lang.code}
                                onClick={() => {
                                  setSelectedLangCode(lang.code);
                                  setLangDropdownOpen(false);
                                }}
                                className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between hover:bg-[#FAF4EA] ${
                                  selectedLangCode === lang.code ? 'bg-[#E7D5B9] font-bold text-[#713F2B]' : 'text-[#29251F]'
                                }`}
                              >
                                <span>{lang.name}</span>
                                <span className="text-[11px] text-[#827567] font-medium">{lang.nativeName}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Translate Page Button */}
                    <button
                      onClick={handleTranslatePage}
                      disabled={isTranslating}
                      className="flex items-center gap-1.5 px-4 py-1.5 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors disabled:opacity-50"
                    >
                      {isTranslating ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{isTranslating ? 'Translating...' : 'Translate Page'}</span>
                    </button>
                  </div>

                  {/* Copy & Reset Actions */}
                  <div className="flex items-center gap-2">
                    {translationResult && (
                      <button
                        onClick={() => setTranslationResult(null)}
                        className="flex items-center gap-1 text-xs text-[#713F2B] hover:underline"
                        title="Show original extracted text"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Original Text</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleCopyText(translationResult ? translationResult.translatedText : (extractedPageData?.text || volume.description))}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#DED3C2] hover:bg-[#F5EBDD] text-xs font-semibold text-[#29251F] transition-colors"
                      title="Copy displayed page text"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>

                {/* Translation Status Notice */}
                {translationResult && (
                  <div className="text-[11px] text-[#713F2B] bg-white p-2 rounded-xl border border-[#DED3C2] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>{translationResult.statusMessage}</span>
                    </div>
                    {translationResult.isMachineGenerated && (
                      <span className="text-[10px] text-[#827567] font-mono uppercase tracking-wider">
                        Machine Assisted
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Current Page Header Meta */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DED3C2] text-xs text-[#827567]">
                <div>
                  <span className="font-serif text-base font-bold text-[#29251F] mr-2">
                    {extractedPageData?.chapterTitle || volume.title}
                  </span>
                  {extractedPageData?.bookPageNumber && (
                    <span className="text-[#713F2B] font-mono">
                      (Printed Book Page #{extractedPageData.bookPageNumber})
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 font-mono">
                  <span>PDF Page {currentPage} of {totalPages}</span>
                  {extractedPageData?.wordCount && (
                    <span>• {extractedPageData.wordCount} words</span>
                  )}
                </div>
              </div>

              {/* The Actual Extracted Page Content */}
              <article className="prose max-w-none text-[#29251F] leading-relaxed selection:bg-[#E7D5B9]">
                {translationResult ? (
                  <div className="space-y-4">
                    {translationResult.translatedText.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="leading-relaxed text-[#29251F] text-base sm:text-lg">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                ) : extractedPageData?.text ? (
                  renderHighlightedText(extractedPageData.text)
                ) : (
                  <div className="bg-[#FAF4EA] p-6 rounded-2xl border border-[#DED3C2] space-y-3">
                    <div className="flex items-center gap-2 text-[#713F2B] font-semibold text-sm">
                      <AlertCircle className="w-4 h-4" />
                      <span>Page {currentPage} Preview</span>
                    </div>
                    <p className="text-sm text-[#51483F] leading-relaxed">
                      {volume.description}
                    </p>
                    <p className="text-xs text-[#827567]">
                      Digital selectable text for this volume is accessible via the original PDF viewer or can be downloaded directly from the official Ministry of External Affairs repository.
                    </p>
                    <button
                      onClick={() => setViewMode('pdf')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B96535] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#713F2B] transition-colors"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>View in Original PDF Reader</span>
                    </button>
                  </div>
                )}
              </article>

            </div>
          )}

          {/* B. Original Document (PDF Viewer) */}
          {viewMode === 'pdf' && (
            <div className="flex-1 flex flex-col h-[650px] relative bg-stone-100">
              {/* Responsive Embedded Official MEA PDF */}
              <iframe
                src={`${volume.originalUrl}#page=${currentPage}&zoom=${zoomLevel}`}
                title={`Original MEA PDF - ${volume.title}`}
                className="w-full h-full border-0"
              />

              {/* PDF Fallback Overlay Bar */}
              <div className="absolute bottom-3 left-4 right-4 bg-[#29251F]/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#E7D5B9]" />
                  <span>Viewing official MEA PDF: <strong>Page {currentPage}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={`${volume.originalUrl}#page=${currentPage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span>Open Standalone PDF</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
