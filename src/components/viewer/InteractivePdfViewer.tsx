import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  FileText, BookOpen, Search, ZoomIn, ZoomOut, Maximize2, 
  ChevronLeft, ChevronRight, ExternalLink, Globe, Copy, Check, 
  RotateCcw, ListFilter, AlertCircle, Sparkles, Download, ArrowUpRight,
  ArrowRight, ArrowUp, AlignLeft, BookMarked, Languages
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
  initialPage,
  initialQuery = '',
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const urlPageParam = searchParams.get('page');
  const urlQuery = searchParams.get('q') || initialQuery || '';
  const urlViewMode = searchParams.get('view');

  // Determine starting page intelligently: explicit URL param > passed initialPage > first substantive chapter
  const resolvedInitialPage = useMemo(() => {
    if (urlPageParam) {
      const p = parseInt(urlPageParam, 10);
      if (!isNaN(p)) return p;
    }
    if (initialPage && initialPage > 1) {
      return initialPage;
    }
    const firstSubstantiveChapter = volume.tableOfContents?.find(
      (c) => c.part !== 'Introductory' && !c.title.toLowerCase().includes('front matter')
    ) || volume.tableOfContents?.[0];
    return firstSubstantiveChapter?.startPage || 1;
  }, [urlPageParam, initialPage, volume.tableOfContents]);

  const [currentPage, setCurrentPage] = useState<number>(resolvedInitialPage);
  const [pageInput, setPageInput] = useState<string>(`${resolvedInitialPage}`);
  const [viewMode, setViewMode] = useState<'pdf' | 'text'>(urlViewMode === 'pdf' ? 'pdf' : 'text');
  const [readingMode, setReadingMode] = useState<'chapter' | 'page'>('chapter');
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
  const [translationProgress, setTranslationProgress] = useState<string>('');
  const [translationResult, setTranslationResult] = useState<TranslationResult | null>(null);
  const [translatedPages, setTranslatedPages] = useState<Record<number, string>>({});
  const [showTranslatedText, setShowTranslatedText] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const { showToast } = useToast();

  const totalPages = volume.pageCount || 500;

  // Sync state if URL page changes
  useEffect(() => {
    if (urlPageParam) {
      const p = parseInt(urlPageParam, 10);
      if (!isNaN(p) && p !== currentPage) {
        setCurrentPage(p);
        setPageInput(`${p}`);
      }
    }
  }, [urlPageParam]);

  // Sync state if URL query changes
  useEffect(() => {
    if (urlQuery) {
      setDocSearchQuery(urlQuery);
      setSearchOpen(true);
    }
  }, [urlQuery]);

  // Find current active TOC chapter for context and fallback
  const activeTocChapter = useMemo(() => {
    if (!volume.tableOfContents || volume.tableOfContents.length === 0) return null;
    return (
      volume.tableOfContents.find((item, idx) => {
        const nextItem = volume.tableOfContents[idx + 1];
        const endPage = item.endPage || (nextItem ? nextItem.startPage - 1 : totalPages);
        return currentPage >= item.startPage && currentPage <= endPage;
      }) || volume.tableOfContents[0]
    );
  }, [volume.tableOfContents, currentPage, totalPages]);

  // Reset translation when language or chapter changes
  useEffect(() => {
    setTranslatedPages({});
    setTranslationResult(null);
    setShowTranslatedText(false);
    setTranslationProgress('');
  }, [selectedLangCode, activeTocChapter?.title]);

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

  // All extracted pages belonging to current active chapter
  const activeChapterPages = useMemo(() => {
    if (!volume.extractedPages || volume.extractedPages.length === 0 || !activeTocChapter) return [];
    const filtered = volume.extractedPages.filter((p) => {
      const matchesTitle =
        p.chapterTitle &&
        (activeTocChapter.title.toLowerCase().includes(p.chapterTitle.toLowerCase()) ||
          p.chapterTitle.toLowerCase().includes(activeTocChapter.title.toLowerCase().slice(0, 15)));
      const inPageRange =
        p.pdfPageNumber >= activeTocChapter.startPage &&
        (!activeTocChapter.endPage || p.pdfPageNumber <= activeTocChapter.endPage);
      return matchesTitle || inPageRange;
    });

    return [...filtered].sort((a, b) => a.pdfPageNumber - b.pdfPageNumber);
  }, [volume.extractedPages, activeTocChapter]);

  const totalChapterWords = useMemo(() => {
    return activeChapterPages.reduce((acc, p) => acc + (p.wordCount || 0), 0);
  }, [activeChapterPages]);

  // Find extracted page text if available with intelligent chapter fallback
  const extractedPageData: ExtractedPage | undefined = useMemo(() => {
    if (!volume.extractedPages || volume.extractedPages.length === 0) return undefined;

    // 1. Exact page match
    const exact = volume.extractedPages.find((p) => p.pdfPageNumber === currentPage);
    if (exact && exact.text && exact.text.trim().length > 30) {
      return exact;
    }

    // 2. If exact page is a title/divider page or has minimal text, find the first available page of this chapter
    if (activeTocChapter && activeChapterPages.length > 0) {
      const candidate = activeChapterPages.find((p) => p.pdfPageNumber >= currentPage) || activeChapterPages[0];
      if (candidate) return candidate;
    }

    // 3. Fallback to closest available extracted page
    const sorted = [...volume.extractedPages].sort(
      (a, b) => Math.abs(a.pdfPageNumber - currentPage) - Math.abs(b.pdfPageNumber - currentPage)
    );
    return sorted[0];
  }, [volume.extractedPages, currentPage, activeTocChapter, activeChapterPages]);

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
  const handleTranslatePage = async (pageToTranslate?: ExtractedPage) => {
    const targetPage = pageToTranslate || extractedPageData || activeChapterPages[0];
    if (!targetPage?.text) return;

    setIsTranslating(true);
    setTranslationProgress(`Translating Page ${targetPage.pdfPageNumber}...`);
    setLangDropdownOpen(false);

    try {
      const result = await translationService.translateText(
        targetPage.text,
        selectedLangCode,
        { volumeTitle: volume.title, pageNumber: targetPage.pdfPageNumber }
      );
      setTranslatedPages((prev) => ({
        ...prev,
        [targetPage.pdfPageNumber]: result.translatedText,
      }));
      setTranslationResult(result);
      setShowTranslatedText(true);
      showToast(`Page ${targetPage.pdfPageNumber} translated to ${result.language.name}`, 'success');
    } catch {
      showToast('Could not complete translation. Reverting to original text.', 'warning');
    } finally {
      setIsTranslating(false);
      setTranslationProgress('');
    }
  };

  const handleTranslateChapter = async () => {
    if (activeChapterPages.length === 0) return;

    setIsTranslating(true);
    setLangDropdownOpen(false);
    setShowTranslatedText(true);

    try {
      for (let i = 0; i < activeChapterPages.length; i++) {
        const page = activeChapterPages[i];
        setTranslationProgress(`Translating page ${i + 1} of ${activeChapterPages.length} (p.${page.pdfPageNumber})...`);
        const result = await translationService.translateText(
          page.text,
          selectedLangCode,
          { volumeTitle: volume.title, pageNumber: page.pdfPageNumber }
        );
        setTranslatedPages((prev) => ({
          ...prev,
          [page.pdfPageNumber]: result.translatedText,
        }));
        if (i === 0) {
          setTranslationResult(result);
        }
      }
      showToast(`Chapter translated to ${selectedLangObj.name} (${activeChapterPages.length} pages)`, 'success');
    } catch {
      showToast('Completed partial translation of chapter.', 'info');
    } finally {
      setIsTranslating(false);
      setTranslationProgress('');
    }
  };

  const handleTocClick = (item: { startPage: number; title: string }, openInPdf: boolean = false) => {
    handlePageChange(item.startPage);
    if (openInPdf) {
      setViewMode('pdf');
      showToast(`Opening "${item.title}" in Original PDF (p.${item.startPage})`, 'info');
    } else {
      showToast(`Selected "${item.title}" (p.${item.startPage})`, 'info');
    }
  };

  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Text copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyFullChapter = () => {
    if (activeChapterPages.length === 0) return;
    const header = `${activeTocChapter?.title || volume.title}\n${activeTocChapter?.part ? `${activeTocChapter.part}\n` : ''}From: ${volume.title} (${volume.publisher})\nOfficial MEA Publication, Government of India\n\n`;
    const body = activeChapterPages
      .map(
        (p) =>
          `[Printed Book Page ${p.bookPageNumber || '—'} • PDF Page ${p.pdfPageNumber}]\n\n${p.text}`
      )
      .join('\n\n\n');
    navigator.clipboard.writeText(header + body);
    setCopied(true);
    showToast(`Copied complete text of "${activeTocChapter?.title || 'Chapter'}" (${activeChapterPages.length} pages)`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadChapter = () => {
    if (activeChapterPages.length === 0) return;
    const header = `${activeTocChapter?.title || volume.title}\n${activeTocChapter?.part ? `${activeTocChapter.part}\n` : ''}From: ${volume.title} (${volume.publisher})\nOfficial MEA Publication, Government of India\n\n`;
    const body = activeChapterPages
      .map(
        (p) =>
          `============================================================\nPrinted Book Page ${p.bookPageNumber || '—'}  |  PDF Page ${p.pdfPageNumber}\n============================================================\n\n${p.text}`
      )
      .join('\n\n\n');
    const blob = new Blob([header + body], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const sanitizedTitle = (activeTocChapter?.title || 'chapter').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.download = `${sanitizedTitle}_MEA_Extracted_Text.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast(`Downloaded complete text of "${activeTocChapter?.title || 'Chapter'}"`, 'success');
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

  const switchViewMode = (mode: 'pdf' | 'text') => {
    setViewMode(mode);
    const newParams = new URLSearchParams(searchParams);
    newParams.set('view', mode);
    setSearchParams(newParams, { replace: true });
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
              onClick={() => switchViewMode('text')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'text'
                  ? 'bg-[#29251F] text-white shadow-xs'
                  : 'text-[#51483F] hover:text-[#29251F]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Extracted Text</span>
            </button>

            <button
              onClick={() => switchViewMode('pdf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
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

            <div className="space-y-1.5 text-xs">
              {volume.tableOfContents.map((item, idx) => {
                const isActive = currentPage >= item.startPage && (!item.endPage || currentPage <= item.endPage);
                return (
                  <div
                    key={idx}
                    className={`w-full p-2.5 rounded-xl border transition-all flex items-start justify-between gap-2 group ${
                      isActive
                        ? 'bg-[#E7D5B9] text-[#713F2B] font-bold border-[#B96535] shadow-2xs'
                        : 'hover:bg-[#F5EBDD] text-[#51483F] border-transparent'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => handleTocClick(item, false)}
                      className="text-left flex-1"
                    >
                      {item.part && (
                        <span className="block text-[9px] font-bold uppercase tracking-wider text-[#827567] mb-0.5">
                          {item.part}
                        </span>
                      )}
                      <span className="line-clamp-2 leading-snug">{item.title}</span>
                      <span className="block text-[10px] font-mono text-[#827567] mt-1">
                        Page {item.startPage}
                      </span>
                    </button>

                    <div className="flex items-center gap-1 shrink-0 pt-0.5">
                      <button
                        type="button"
                        onClick={() => handleTocClick(item, true)}
                        className={`px-2 py-1 rounded-lg border text-[10px] font-semibold transition-colors flex items-center gap-1 ${
                          isActive
                            ? 'bg-[#B96535] text-white border-[#B96535]'
                            : 'bg-white hover:bg-[#E7D5B9] text-[#713F2B] border-[#DED3C2]'
                        }`}
                        title={`Open "${item.title}" directly in PDF reader at page ${item.startPage}`}
                      >
                        <BookOpen className="w-3 h-3" />
                        <span>PDF</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* Reader Content Pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FBF8F2] overflow-hidden">
          
          {/* A. Extracted Text View */}
          {viewMode === 'text' && (
            <div className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto max-h-[760px] space-y-6">
              
              {/* Active Chapter Banner & Reading Mode Controls */}
              <div id="chapter-top-banner" className="bg-[#FAF4EA] border border-[#DED3C2] rounded-2xl p-4 sm:p-5 shadow-2xs space-y-4">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-[#E7D5B9] text-[#713F2B]">
                        <BookOpen className="w-4 h-4 text-[#B96535]" />
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#827567]">
                        {activeTocChapter?.part || 'Official Writings & Speeches'}
                      </span>
                    </div>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#29251F]">
                      {activeTocChapter?.title || volume.title}
                    </h2>
                    {activeTocChapter?.description && (
                      <p className="text-xs sm:text-sm text-[#51483F] leading-relaxed max-w-2xl">
                        {activeTocChapter.description}
                      </p>
                    )}
                  </div>

                  {/* Reading Mode Switcher (Continuous vs Single Page) */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-center">
                    <div className="flex items-center bg-[#E7D5B9]/70 p-1 rounded-xl border border-[#DED3C2]">
                      <button
                        type="button"
                        onClick={() => {
                          setReadingMode('chapter');
                          showToast('Switched to Complete Chapter View', 'info');
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          readingMode === 'chapter'
                            ? 'bg-[#29251F] text-white shadow-xs'
                            : 'text-[#51483F] hover:text-[#29251F]'
                        }`}
                        title="Read full continuous chapter text"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Continuous Chapter ({activeChapterPages.length > 0 ? `${activeChapterPages.length} Pages` : 'Text'})</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setReadingMode('page');
                          showToast(`Switched to Single Page View (Page ${currentPage})`, 'info');
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          readingMode === 'page'
                            ? 'bg-[#29251F] text-white shadow-xs'
                            : 'text-[#51483F] hover:text-[#29251F]'
                        }`}
                        title="Read one page at a time"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Single Page</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setViewMode('pdf');
                        showToast(`Switched to Original MEA PDF at Page ${extractedPageData?.pdfPageNumber || currentPage}`, 'info');
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>PDF Reader</span>
                    </button>
                  </div>
                </div>

                {/* Chapter Metrics Bar & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#DED3C2] text-xs">
                  <div className="flex flex-wrap items-center gap-3 font-mono text-[#827567]">
                    <span className="flex items-center gap-1 text-[#713F2B] font-semibold">
                      <BookMarked className="w-3.5 h-3.5 text-[#B96535]" />
                      <span>{activeChapterPages.length} Extracted Pages</span>
                    </span>
                    <span>•</span>
                    <span>{totalChapterWords.toLocaleString()} Words</span>
                    <span>•</span>
                    <span>~{Math.max(1, Math.ceil(totalChapterWords / 200))} min read</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-sans font-semibold">Official MEA Edition</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyFullChapter}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      title="Copy entire chapter text to clipboard"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied!' : 'Copy Chapter'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadChapter}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      title="Download chapter as clean .txt file"
                    >
                      <Download className="w-3.5 h-3.5 text-[#713F2B]" />
                      <span>Download .txt</span>
                    </button>
                  </div>
                </div>

                {/* Quick Page Navigator Pill Bar (when in chapter mode and multiple pages) */}
                {activeChapterPages.length > 1 && (
                  <div className="pt-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-[11px] font-bold text-[#713F2B] uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
                      <AlignLeft className="w-3 h-3" />
                      <span>Pages:</span>
                    </span>
                    {activeChapterPages.map((p) => {
                      const isCurrent = currentPage === p.pdfPageNumber;
                      return (
                        <button
                          key={p.pdfPageNumber}
                          type="button"
                          onClick={() => {
                            handlePageChange(p.pdfPageNumber);
                            if (readingMode === 'chapter') {
                              const el = document.getElementById(`chapter-page-${p.pdfPageNumber}`);
                              if (el) {
                                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                              }
                            }
                          }}
                          className={`px-2 py-0.5 rounded-lg text-xs font-mono transition-colors shrink-0 cursor-pointer ${
                            isCurrent
                              ? 'bg-[#B96535] text-white font-bold shadow-2xs'
                              : 'bg-white hover:bg-[#E7D5B9] text-[#51483F] border border-[#DED3C2]'
                          }`}
                          title={`Go to ${p.bookPageNumber ? `Printed Book Page #${p.bookPageNumber}` : `PDF Page ${p.pdfPageNumber}`}`}
                        >
                          {p.bookPageNumber ? `p.${p.bookPageNumber}` : `PDF ${p.pdfPageNumber}`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

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
                      onClick={() => handleTranslatePage()}
                      disabled={isTranslating}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors disabled:opacity-50"
                      title={`Translate current page (${extractedPageData?.pdfPageNumber || currentPage}) into ${selectedLangObj.name}`}
                    >
                      {isTranslating ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>
                        {isTranslating
                          ? (translationProgress || 'Translating...')
                          : `Translate Page ${extractedPageData?.pdfPageNumber || currentPage}`}
                      </span>
                    </button>

                    {/* Translate Entire Chapter Button (in chapter mode) */}
                    {readingMode === 'chapter' && activeChapterPages.length > 1 && (
                      <button
                        onClick={handleTranslateChapter}
                        disabled={isTranslating}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#713F2B] hover:bg-[#512D1F] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors disabled:opacity-50"
                        title={`Translate all ${activeChapterPages.length} pages of chapter into ${selectedLangObj.name}`}
                      >
                        <Languages className="w-3.5 h-3.5" />
                        <span>Translate All ({activeChapterPages.length} Pages)</span>
                      </button>
                    )}
                  </div>

                  {/* Copy & Reset Actions */}
                  <div className="flex items-center gap-2">
                    {/* Toggle original vs translated if any page has been translated */}
                    {Object.keys(translatedPages).length > 0 && (
                      <button
                        onClick={() => setShowTranslatedText(!showTranslatedText)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#DED3C2] hover:bg-[#F5EBDD] text-xs font-semibold text-[#713F2B] transition-colors"
                        title="Toggle original English / Translation"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{showTranslatedText ? 'Show Original English' : `Show ${selectedLangObj.name}`}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        if (readingMode === 'chapter') {
                          handleCopyFullChapter();
                        } else {
                          const textToCopy = (showTranslatedText && translatedPages[currentPage])
                            ? translatedPages[currentPage]
                            : (extractedPageData?.text || volume.description);
                          handleCopyText(textToCopy);
                        }
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-[#DED3C2] hover:bg-[#F5EBDD] text-xs font-semibold text-[#29251F] transition-colors"
                      title="Copy text"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : (readingMode === 'chapter' ? 'Copy Chapter' : 'Copy Page')}</span>
                    </button>
                  </div>
                </div>

                {/* Translation Status Notice */}
                {showTranslatedText && (Object.keys(translatedPages).length > 0 || translationResult) && (
                  <div className="text-[11px] text-[#713F2B] bg-white p-2.5 rounded-xl border border-[#DED3C2] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="font-semibold">
                        Displaying full neural translation in {selectedLangObj.name} ({selectedLangObj.nativeName})
                        {Object.keys(translatedPages).length > 1 ? ` • ${Object.keys(translatedPages).length} pages translated` : ''}
                      </span>
                    </div>
                    <span className="text-[10px] text-[#827567] font-mono uppercase tracking-wider hidden sm:inline">
                      100% Full Text • Neural Engine
                    </span>
                  </div>
                )}
              </div>

              {/* Chapter Content Stream OR Single Page View */}
              {readingMode === 'chapter' && activeChapterPages.length > 0 ? (
                <div className="space-y-6">
                  {activeChapterPages.map((page) => {
                    const isPageTranslated = Boolean(translatedPages[page.pdfPageNumber]);
                    const showThisTranslated = showTranslatedText && isPageTranslated;
                    const pageDisplayText = showThisTranslated ? translatedPages[page.pdfPageNumber] : page.text;

                    return (
                      <article
                        key={page.pdfPageNumber}
                        id={`chapter-page-${page.pdfPageNumber}`}
                        className="bg-white p-6 sm:p-8 rounded-2xl border border-[#DED3C2] shadow-2xs space-y-4 scroll-mt-6"
                      >
                        {/* Page Divider Badge */}
                        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#EADFCF] text-xs text-[#827567]">
                          <div className="flex items-center gap-2">
                            <span className="font-serif font-bold text-[#29251F] text-sm">
                              {page.bookPageNumber ? `Printed Book Page #${page.bookPageNumber}` : `Page ${page.pdfPageNumber}`}
                            </span>
                            <span className="text-[#713F2B] font-mono text-[11px]">
                              (PDF Page {page.pdfPageNumber} of {totalPages})
                            </span>
                            {page.wordCount && (
                              <span className="font-mono text-[11px] text-[#827567] hidden sm:inline">
                                • {page.wordCount} words
                              </span>
                            )}
                            {showThisTranslated && (
                              <span className="px-2 py-0.5 rounded-full bg-[#E7D5B9] text-[#713F2B] text-[10px] font-bold">
                                {selectedLangObj.name}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Individual Page Translation Toggle */}
                            {isPageTranslated ? (
                              <button
                                type="button"
                                onClick={() => setShowTranslatedText(!showTranslatedText)}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[11px] font-semibold transition-colors cursor-pointer ${
                                  showThisTranslated
                                    ? 'bg-[#B96535] text-white border-[#B96535]'
                                    : 'bg-[#FAF4EA] text-[#713F2B] border-[#DED3C2]'
                                }`}
                                title={showThisTranslated ? 'Show original English' : `Show ${selectedLangObj.name} translation`}
                              >
                                <Languages className="w-3 h-3" />
                                <span>{showThisTranslated ? 'Showing ' + selectedLangObj.name : 'Show ' + selectedLangObj.name}</span>
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleTranslatePage(page)}
                                disabled={isTranslating}
                                className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF4EA] hover:bg-[#E7D5B9] text-[#713F2B] rounded-lg border border-[#DED3C2] text-[11px] font-semibold transition-colors cursor-pointer disabled:opacity-50"
                                title={`Translate this page into ${selectedLangObj.name}`}
                              >
                                <Sparkles className="w-3 h-3 text-[#B96535]" />
                                <span>Translate</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                handlePageChange(page.pdfPageNumber);
                                setViewMode('pdf');
                                showToast(`Opening PDF Facsimile at Page ${page.pdfPageNumber}`, 'info');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF4EA] hover:bg-[#E7D5B9] text-[#713F2B] rounded-lg border border-[#DED3C2] text-[11px] font-semibold transition-colors cursor-pointer"
                              title={`View facsimile for page ${page.pdfPageNumber}`}
                            >
                              <BookOpen className="w-3 h-3 text-[#B96535]" />
                              <span>View Facsimile</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleCopyText(pageDisplayText)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#FAF4EA] hover:bg-[#E7D5B9] text-[#51483F] rounded-lg border border-[#DED3C2] text-[11px] font-semibold transition-colors cursor-pointer"
                              title="Copy this page"
                            >
                              <Copy className="w-3 h-3 text-[#827567]" />
                              <span>Copy Page</span>
                            </button>
                          </div>
                        </div>

                        {/* Extracted Verbatim Text / Translated Text */}
                        <div className="prose max-w-none text-[#29251F] leading-relaxed selection:bg-[#E7D5B9] font-serif text-base sm:text-lg">
                          {showThisTranslated ? (
                            <div className="space-y-4">
                              {pageDisplayText.split('\n\n').map((paragraph, pIdx) => (
                                <p key={pIdx}>{paragraph}</p>
                              ))}
                            </div>
                          ) : (
                            renderHighlightedText(pageDisplayText)
                          )}
                        </div>
                      </article>
                    );
                  })}

                  {/* End of Chapter Completion Card */}
                  <div className="bg-[#FAF4EA] border-2 border-[#DED3C2] rounded-3xl p-6 sm:p-8 text-center space-y-4">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#E7D5B9] text-[#713F2B] flex items-center justify-center font-bold">
                      <Check className="w-6 h-6 text-emerald-700" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-serif text-xl font-bold text-[#29251F]">
                        End of "{activeTocChapter?.title || 'Chapter'}"
                      </h4>
                      <p className="text-xs sm:text-sm text-[#827567] max-w-lg mx-auto">
                        You have completed reading all {activeChapterPages.length} pages of Dr. Babasaheb Ambedkar's "{activeTocChapter?.title}" ({totalChapterWords.toLocaleString()} words) from the official MEA publication.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                      {(() => {
                        const currentIdx = volume.tableOfContents.findIndex((c) => c.title === activeTocChapter?.title);
                        const nextChapter = volume.tableOfContents[currentIdx + 1];
                        if (nextChapter) {
                          return (
                            <button
                              type="button"
                              onClick={() => handleTocClick(nextChapter, false)}
                              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B96535] hover:bg-[#713F2B] text-white rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
                            >
                              <span>Next: {nextChapter.title}</span>
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          );
                        }
                        return null;
                      })()}

                      <button
                        type="button"
                        onClick={() => {
                          const topEl = document.getElementById('chapter-top-banner');
                          if (topEl) topEl.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white hover:bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5 text-[#B96535]" />
                        <span>Back to Top of Chapter</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                /* Single Page View or Fallback */
                <div className="space-y-6">
                  {/* Current Page Header Meta */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DED3C2] text-xs text-[#827567]">
                    <div>
                      <span className="font-serif text-base font-bold text-[#29251F] mr-2">
                        {extractedPageData?.chapterTitle || activeTocChapter?.title || volume.title}
                      </span>
                      {extractedPageData?.bookPageNumber && (
                        <span className="text-[#713F2B] font-mono">
                          (Printed Book Page #{extractedPageData.bookPageNumber})
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 font-mono">
                      <span>PDF Page {extractedPageData?.pdfPageNumber || currentPage} of {totalPages}</span>
                      {extractedPageData?.wordCount && (
                        <span>• {extractedPageData.wordCount} words</span>
                      )}
                    </div>
                  </div>

                  {/* The Actual Extracted Page Content */}
                  <article className="prose max-w-none text-[#29251F] leading-relaxed selection:bg-[#E7D5B9] bg-white p-6 sm:p-8 rounded-2xl border border-[#DED3C2]">
                    {showTranslatedText && (translatedPages[currentPage] || translationResult?.translatedText) ? (
                      <div className="space-y-4">
                        {(translatedPages[currentPage] || translationResult!.translatedText).split('\n\n').map((paragraph, idx) => (
                          <p key={idx} className="leading-relaxed text-[#29251F] text-base sm:text-lg font-serif">
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    ) : extractedPageData?.text ? (
                      renderHighlightedText(extractedPageData.text)
                    ) : (
                      <div className="bg-[#FAF4EA] p-6 sm:p-8 rounded-2xl border border-[#DED3C2] space-y-4">
                        <div className="flex items-center gap-2 text-[#713F2B] font-semibold text-sm">
                          <BookOpen className="w-4 h-4 text-[#B96535]" />
                          <span>{activeTocChapter?.title || `Page ${currentPage}`}</span>
                        </div>
                        <div className="space-y-2 text-sm text-[#51483F] leading-relaxed">
                          <p>
                            Page <strong>{currentPage}</strong> is a facsimile plate, photographic illustration, or frontispiece in the official MEA publication of <em>{volume.title}</em>.
                          </p>
                          <p className="text-xs text-[#827567]">
                            View the original facsimile plate directly in the embedded PDF reader below, or jump to the full extracted text of this chapter.
                          </p>
                        </div>
                        <div className="pt-2 flex flex-wrap items-center gap-3">
                          <button
                            onClick={() => {
                              setViewMode('pdf');
                              showToast(`Opening page ${currentPage} in PDF Reader`, 'info');
                            }}
                            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B96535] text-white rounded-xl text-xs font-bold shadow-2xs hover:bg-[#713F2B] transition-colors cursor-pointer"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span>View Facsimile Plate in PDF Reader (Page {currentPage})</span>
                          </button>
                          {activeChapterPages.length > 0 && (
                            <button
                              onClick={() => {
                                setReadingMode('chapter');
                                showToast(`Reading full text of ${activeTocChapter?.title}`, 'info');
                              }}
                              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white text-[#713F2B] border border-[#DED3C2] hover:bg-[#F5EBDD] rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                            >
                              <span>Read Full Chapter Text ({activeChapterPages.length} Pages)</span>
                              <ArrowRight className="w-3.5 h-3.5 text-[#B96535]" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </article>
                </div>
              )}

            </div>
          )}

          {/* B. Original Document (PDF Viewer) */}
          {viewMode === 'pdf' && (
            <div className="flex-1 flex flex-col h-[700px] relative bg-stone-100">
              {/* Responsive Embedded Official MEA PDF with dynamic key to ensure reload on page changes */}
              <iframe
                key={`${volume.id}-page-${currentPage}`}
                src={`${volume.originalUrl}#page=${currentPage}&zoom=${zoomLevel}`}
                title={`Original MEA PDF - ${volume.title} - Page ${currentPage}`}
                className="w-full h-full border-0"
              />

              {/* PDF Fallback Overlay Bar */}
              <div className="absolute bottom-3 left-4 right-4 bg-[#29251F]/90 backdrop-blur-md text-white px-4 py-2.5 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs shadow-lg">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#E7D5B9]" />
                  <span>
                    Viewing official MEA PDF: <strong>Page {currentPage} of {totalPages}</strong>
                    {activeTocChapter && ` • "${activeTocChapter.title}"`}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('text')}
                    className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                  >
                    <FileText className="w-3 h-3 text-[#E7D5B9]" />
                    <span>View Extracted Text</span>
                  </button>
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
