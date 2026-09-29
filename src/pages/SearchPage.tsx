import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ArchiveRecord } from '../types';
import { archiveService } from '../services/archiveService';
import { ArchiveCard } from '../components/archive/ArchiveCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { Search, Clock, Trash2, ArrowRight, Sparkles, Filter, Mic, MicOff } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(queryParam);
  const [results, setResults] = useState<ArchiveRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const { isListening, isSupported, startListening, stopListening } = useVoiceSearch();

  useEffect(() => {
    setRecentSearches(archiveService.getRecentSearches());
  }, []);

  useEffect(() => {
    if (queryParam.trim()) {
      setSearchInput(queryParam);
      setLoading(true);
      archiveService.searchGlobal(queryParam).then((res) => {
        setResults(res);
        setLoading(false);
        archiveService.addRecentSearch(queryParam);
        setRecentSearches(archiveService.getRecentSearches());
      });
    } else {
      setResults([]);
    }
  }, [queryParam]);

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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Search Header */}
      <div className="border-b border-[#DED3C2] pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block mb-1">
          Catalog Search Index
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F]">
          Search the Heritage Archive
        </h1>
        <p className="text-sm text-[#51483F] mt-1 max-w-xl">
          Query primary treatises, verified debate speeches, calligraphic drafts, and historical records.
        </p>
      </div>

      {/* Main Search Bar Form with Voice Search */}
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search keywords: 'Annihilation of Caste', 'Poona Pact', 'Chavadar Tank', 'Article 14'..."
            className="w-full pl-12 pr-36 py-4 text-base bg-[#FBF8F2] border-2 border-[#DED3C2] rounded-2xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:border-[#B96535] shadow-xs"
          />
          <Search className="w-5 h-5 text-[#827567] absolute left-4 pointer-events-none" />

          {/* Voice Search Button */}
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
        ) : queryParam && results.length > 0 ? (
          <div>
            <div className="flex items-center justify-between pb-3 mb-6 border-b border-[#DED3C2]">
              <span className="text-sm font-serif font-bold text-[#29251F]">
                Found {results.length} archival match{results.length === 1 ? '' : 'es'} for "{queryParam}"
              </span>
              <Link
                to={`/archive?q=${encodeURIComponent(queryParam)}`}
                className="text-xs font-semibold text-[#B96535] hover:underline flex items-center gap-1"
              >
                <Filter className="w-3.5 h-3.5" />
                <span>Open in Faceted Archive Explorer</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((rec) => (
                <ArchiveCard key={rec.id} record={rec} viewMode="grid" />
              ))}
            </div>
          </div>
        ) : queryParam && results.length === 0 ? (
          <EmptyState
            title={`No records found matching "${queryParam}"`}
            message="Please check your spelling or search for broader historical topics such as 'Constitution', 'Mahad', 'Caste', or 'Economics'."
            onReset={() => setSearchParams({})}
            resetLabel="Clear Search"
          />
        ) : (
          <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-8 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-[#B96535] mx-auto opacity-70" />
            <h3 className="font-serif text-xl font-bold text-[#29251F]">
              Search Across 200+ Primary Records
            </h3>
            <p className="text-sm text-[#827567] max-w-md mx-auto">
              Enter any keyword above to search through treaties, speeches, and parliamentary debates, or browse by collection.
            </p>
            <div className="pt-2">
              <Link
                to="/archive"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B96535] text-white text-xs font-semibold rounded-xl hover:bg-[#713F2B] transition-colors"
              >
                <span>Browse All Collections</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
