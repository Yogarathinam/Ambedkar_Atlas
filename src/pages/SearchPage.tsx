import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArchiveRecord } from '../types';
import { archiveService } from '../services/archiveService';
import { meaSearchService, MeaSearchResult } from '../services/meaSearchService';
import { ArchiveCard } from '../components/archive/ArchiveCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { 
  Search, Clock, Trash2, ArrowRight, Sparkles, Filter, Mic, MicOff, 
  BookOpen, FileText, ExternalLink, ArrowUpRight, CheckCircle2, Bookmark
} from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(queryParam);
  const [catalogResults, setCatalogResults] = useState<ArchiveRecord[]>([]);
  const [meaResults, setMeaResults] = useState<MeaSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  
  // Tab filter: 'all' | 'passages' | 'records'
  const [activeTab, setActiveTab] = useState<'all' | 'passages' | 'records'>('all');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'English' | 'Hindi'>('all');

  const { isListening, isSupported, startListening, stopListening } = useVoiceSearch();

  useEffect(() => {
    setRecentSearches(archiveService.getRecentSearches());
  }, []);

  useEffect(() => {
    if (queryParam.trim()) {
      setSearchInput(queryParam);
      setLoading(true);

      // Concurrently query global archive catalog and MEA volume full-text/TOC index
      Promise.all([
        archiveService.searchGlobal(queryParam),
        Promise.resolve(meaSearchService.search(queryParam, { language: languageFilter }))
      ]).then(([records, meaMatches]) => {
        setCatalogResults(records);
        setMeaResults(meaMatches);
        setLoading(false);
        archiveService.addRecentSearch(queryParam);
        setRecentSearches(archiveService.getRecentSearches());
      }).catch(() => {
        setLoading(false);
      });
    } else {
      setCatalogResults([]);
      setMeaResults([]);
    }
  }, [queryParam, languageFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setSearchInput(text);
        setSearchParams({ q: text });
      });
    }
  };

  const handleRecentClick = (term: string) => {
    setSearchInput(term);
    setSearchParams({ q: term });
  };

  const handleClearRecents = () => {
    archiveService.clearRecentSearches();
    setRecentSearches([]);
  };

  const filteredMeaResults = useMemo(() => {
    if (languageFilter === 'all') return meaResults;
    return meaResults.filter((r) => r.language === languageFilter);
  }, [meaResults, languageFilter]);

  const totalResultsCount = catalogResults.length + filteredMeaResults.length;

  const renderSnippet = (snippet: string, query: string) => {
    if (!query.trim()) return snippet;
    const terms = query.trim().split(/\s+/).filter(Boolean);
    const regex = new RegExp(`(${terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
    const parts = snippet.split(regex);
    return (
      <span>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-[#F6D06D] text-[#29251F] px-1 py-0.5 rounded font-semibold shadow-2xs">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Search Header */}
      <div className="border-b border-[#DED3C2] pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block mb-1">
          Catalog & Document Index
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F]">
          Search the Heritage Archive & MEA Volumes
        </h1>
        <p className="text-sm text-[#51483F] mt-1 max-w-2xl">
          Search across 60 official Ministry of External Affairs volumes (Writings & Speeches in English & Hindi), treatises, debate speeches, and historical records with exact page citations.
        </p>
      </div>

      {/* Main Search Bar Form with Voice Search */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search quotes, treatises, topics: 'Annihilation of Caste', 'cultivation of mind', 'Poona Pact', 'Volume 1'..."
            className="w-full pl-12 pr-36 py-4 text-base bg-[#FBF8F2] border-2 border-[#DED3C2] rounded-2xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:border-[#B96535] shadow-xs"
          />
          <Search className="w-5 h-5 text-[#827567] absolute left-4 pointer-events-none" />

          {/* Voice Search Button */}
          {isSupported && (
            <button
              type="button"
              onClick={handleVoiceSearch}
              title={isListening ? 'Listening... click to stop' : 'Search by voice'}
              className={`absolute right-24 p-2 rounded-xl transition-colors ${
                isListening ? 'bg-red-500 text-white animate-pulse' : 'text-[#827567] hover:text-[#B96535] hover:bg-[#F5EBDD]'
              }`}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          )}

          <button
            type="submit"
            className="absolute right-2.5 px-5 py-2.5 bg-[#B96535] hover:bg-[#713F2B] text-white text-sm font-semibold rounded-xl transition-colors shadow-2xs"
          >
            Search
          </button>
        </div>
      </form>

      {/* Recent & Suggested Searches */}
      <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[#827567]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[#713F2B] flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Recent Queries:
          </span>
          {recentSearches.length > 0 ? (
            recentSearches.map((term) => (
              <button
                key={term}
                onClick={() => handleRecentClick(term)}
                className="px-2.5 py-1 bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#29251F] rounded-lg border border-[#DED3C2] transition-colors"
              >
                {term}
              </button>
            ))
          ) : (
            <span>No recent searches</span>
          )}
        </div>

        {recentSearches.length > 0 && (
          <button
            onClick={handleClearRecents}
            className="text-[#827567] hover:text-[#29251F] flex items-center gap-1"
          >
            <Trash2 className="w-3 h-3" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Results Section */}
      <div className="space-y-6 pt-4">
        {loading ? (
          <LoadingSkeleton count={3} type="card" />
        ) : queryParam && totalResultsCount > 0 ? (
          <div className="space-y-6">
            
            {/* Results Filter Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#DED3C2]">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm font-serif font-bold text-[#29251F] mr-2">
                  Found {totalResultsCount} result{totalResultsCount === 1 ? '' : 's'} for "{queryParam}"
                </span>
                
                {/* Result Type Tabs */}
                <div className="inline-flex rounded-xl bg-[#F5EBDD] p-1 border border-[#DED3C2] text-xs font-semibold">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3 py-1 rounded-lg transition-colors ${
                      activeTab === 'all'
                        ? 'bg-white text-[#713F2B] shadow-2xs font-bold'
                        : 'text-[#827567] hover:text-[#29251F]'
                    }`}
                  >
                    All Results ({totalResultsCount})
                  </button>
                  <button
                    onClick={() => setActiveTab('passages')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeTab === 'passages'
                        ? 'bg-white text-[#713F2B] shadow-2xs font-bold'
                        : 'text-[#827567] hover:text-[#29251F]'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#B96535]" />
                    <span>MEA Passages ({filteredMeaResults.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('records')}
                    className={`px-3 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                      activeTab === 'records'
                        ? 'bg-white text-[#713F2B] shadow-2xs font-bold'
                        : 'text-[#827567] hover:text-[#29251F]'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 text-[#827567]" />
                    <span>Archive Records ({catalogResults.length})</span>
                  </button>
                </div>
              </div>

              {/* Language Pill Filters for Passages */}
              {(activeTab === 'all' || activeTab === 'passages') && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#827567] font-semibold">Language:</span>
                  {(['all', 'English', 'Hindi'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguageFilter(lang)}
                      className={`px-2.5 py-1 rounded-lg border transition-colors ${
                        languageFilter === lang
                          ? 'bg-[#E7D5B9] text-[#713F2B] font-bold border-[#B96535]'
                          : 'bg-[#F5EBDD] text-[#51483F] border-[#DED3C2] hover:bg-[#E7D5B9]'
                      }`}
                    >
                      {lang === 'all' ? 'All' : lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* A. MEA Books & Writings Passages Section */}
            {(activeTab === 'all' || activeTab === 'passages') && filteredMeaResults.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#B96535]" />
                    <h2 className="font-serif text-xl font-bold text-[#29251F]">
                      Exact Passages in MEA Books & Writings ({filteredMeaResults.length})
                    </h2>
                  </div>
                  <span className="text-xs text-[#827567]">
                    Official Government of India Collection • Page-level Citations
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {filteredMeaResults.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#FBF8F2] border border-[#DED3C2] hover:border-[#B96535] rounded-2xl p-5 sm:p-6 transition-all shadow-xs hover:shadow-md flex flex-col justify-between space-y-4"
                    >
                      <div className="space-y-2">
                        {/* Badges Header */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-[#E7D5B9] text-[#713F2B] font-bold font-mono">
                              Vol. {item.volumeNumber} {item.part ? `(Part ${item.part})` : ''}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full font-semibold ${
                              item.language === 'English'
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            }`}>
                              {item.language} Edition
                            </span>
                            <span className="text-[#827567] font-mono">
                              PDF Page {item.pdfPageNumber}
                              {item.bookPageNumber ? ` • Book p. ${item.bookPageNumber}` : ''}
                            </span>
                          </div>

                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Verified MEA Source</span>
                          </span>
                        </div>

                        {/* Volume & Chapter Title */}
                        <h3 className="font-serif text-lg font-bold text-[#29251F] leading-snug">
                          {item.chapterTitle ? item.chapterTitle : item.volumeTitle}
                        </h3>
                        {item.chapterTitle && (
                          <p className="text-xs text-[#827567] font-serif">
                            From: <span className="font-semibold text-[#51483F]">{item.volumeTitle}</span>
                          </p>
                        )}

                        {/* Search Excerpt / Snippet with Highlights */}
                        <div className="bg-[#FAF4EA] border border-[#DED3C2] rounded-xl p-3.5 text-sm sm:text-base text-[#29251F] leading-relaxed font-serif italic">
                          "{renderSnippet(item.snippet, queryParam)}"
                        </div>
                      </div>

                      {/* Navigation & Source Links */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#DED3C2]/70 text-xs">
                        <div className="flex items-center gap-2">
                          <Link
                            to={item.viewerUrl}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#B96535] hover:bg-[#713F2B] text-white font-semibold rounded-xl transition-colors shadow-2xs"
                          >
                            <span>Inspect Passage in Dual-Reader</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>

                          <a
                            href={item.originalPdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#713F2B] font-semibold rounded-xl border border-[#DED3C2] transition-colors"
                            title="Open original MEA PDF at this exact page in a new browser tab"
                          >
                            <span>Original PDF (Page {item.pdfPageNumber})</span>
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </a>
                        </div>

                        <span className="text-[11px] text-[#827567]">
                          Relevance Score: {item.score}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* B. Primary Archive Catalog Records Section */}
            {(activeTab === 'all' || activeTab === 'records') && catalogResults.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[#827567]" />
                    <h2 className="font-serif text-xl font-bold text-[#29251F]">
                      Archival Records & Manuscripts ({catalogResults.length})
                    </h2>
                  </div>
                  <Link
                    to={`/archive?q=${encodeURIComponent(queryParam)}`}
                    className="text-xs font-semibold text-[#B96535] hover:underline flex items-center gap-1"
                  >
                    <Filter className="w-3.5 h-3.5" />
                    <span>Open in Faceted Archive Explorer</span>
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {catalogResults.map((rec) => (
                    <ArchiveCard key={rec.id} record={rec} viewMode="grid" />
                  ))}
                </div>
              </div>
            )}

          </div>
        ) : queryParam && totalResultsCount === 0 ? (
          <EmptyState
            title={`No records or passages found matching "${queryParam}"`}
            message="Please check your spelling or search for broader historical topics such as 'Constitution', 'Mahad', 'Caste', 'Cultivation of mind', or 'Volume 1'."
            onReset={() => setSearchParams({})}
            resetLabel="Clear Search"
          />
        ) : (
          <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-8 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#B96535] mx-auto opacity-70" />
            <h3 className="font-serif text-xl font-bold text-[#29251F]">
              Search Across 60 MEA Volumes & Verified Primary Records
            </h3>
            <p className="text-sm text-[#827567] max-w-md mx-auto">
              Enter any quotation, chapter title, or keyword above to search through treaties, speeches, and parliamentary debates, or browse by collection.
            </p>
            <div className="pt-2">
              <Link
                to="/archive?collection=mea"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B96535] text-white text-xs font-semibold rounded-xl hover:bg-[#713F2B] transition-colors"
              >
                <span>Explore Official MEA Collection</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

