import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArchiveRecord, FilterState, ArchiveCategory } from '../types';
import { archiveService } from '../services/archiveService';
import { ArchiveCard } from '../components/archive/ArchiveCard';
import { FilterDrawer } from '../components/archive/FilterDrawer';
import { FilterChips } from '../components/archive/FilterChips';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Search, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, X, Bookmark } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';

const DEFAULT_FILTERS: FilterState = {
  searchQuery: '',
  category: 'all',
  era: 'all',
  language: 'all',
  format: 'all',
  sortBy: 'relevance',
  viewMode: 'grid',
};

export const ArchivePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...DEFAULT_FILTERS,
    searchQuery: searchParams.get('q') || '',
    category: (searchParams.get('category') as ArchiveCategory) || 'all',
  }));

  const [records, setRecords] = useState<ArchiveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [displayCount, setDisplayCount] = useState(9);
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState(searchParams.get('bookmarked') === 'true');
  const { bookmarks } = useBookmarks();

  useEffect(() => {
    // Sync URL params if provided
    const qParam = searchParams.get('q');
    const catParam = searchParams.get('category');
    const bookmarkedParam = searchParams.get('bookmarked');
    if (qParam !== null || catParam !== null || bookmarkedParam !== null) {
      setFilters((prev) => ({
        ...prev,
        searchQuery: qParam || '',
        category: (catParam as ArchiveCategory) || 'all',
      }));
      setShowOnlyBookmarked(bookmarkedParam === 'true');
    }
  }, [searchParams]);

  useEffect(() => {
    setLoading(true);
    archiveService.getRecords(filters).then(({ records: fetched }) => {
      let finalRecords = fetched;
      if (showOnlyBookmarked) {
        finalRecords = finalRecords.filter((r) => bookmarks.includes(r.id));
      }
      setRecords(finalRecords);
      setLoading(false);
    });
  }, [filters, showOnlyBookmarked, bookmarks]);

  const handleUpdateFilters = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setDisplayCount(9);
  };

  const handleClearSingleFilter = (key: keyof FilterState) => {
    if (key === 'category') handleUpdateFilters({ category: 'all' });
    else if (key === 'era') handleUpdateFilters({ era: 'all' });
    else if (key === 'language') handleUpdateFilters({ language: 'all' });
    else if (key === 'format') handleUpdateFilters({ format: 'all' });
    else if (key === 'searchQuery') handleUpdateFilters({ searchQuery: '' });
  };

  const handleResetAll = () => {
    setFilters(DEFAULT_FILTERS);
    setShowOnlyBookmarked(false);
    setSearchParams({});
    setDisplayCount(9);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-[#DED3C2] pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block mb-1">
          Catalog Explorer
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F]">
          The Primary Archive Catalog
        </h1>
        <p className="text-sm sm:text-base text-[#51483F] mt-2 max-w-2xl leading-relaxed">
          Filter and cross-reference writings, speeches, calligraphic draft articles, and multimedia records with full facsimiles and verified transcripts.
        </p>
      </div>

      {/* Main Controls Bar */}
      <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-4 sm:p-5 shadow-xs space-y-4">
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={filters.searchQuery}
              onChange={(e) => handleUpdateFilters({ searchQuery: e.target.value })}
              placeholder="Filter by title, keywords, transcription text, or collection..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FFF] border border-[#DED3C2] rounded-xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:ring-2 focus:ring-[#B96535]"
            />
            <Search className="w-4 h-4 text-[#827567] absolute left-3.5 top-3.5 pointer-events-none" />
            {filters.searchQuery && (
              <button
                onClick={() => handleUpdateFilters({ searchQuery: '' })}
                className="absolute right-3 top-3 text-[#827567] hover:text-[#29251F]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filter & Sort Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            
            {/* Bookmarks Filter Toggle */}
            <button
              onClick={() => setShowOnlyBookmarked(!showOnlyBookmarked)}
              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 border transition-all ${
                showOnlyBookmarked
                  ? 'bg-[#B96535] text-white border-[#B96535]'
                  : 'bg-[#F5EBDD] text-[#51483F] border-[#DED3C2] hover:bg-[#E7D5B9]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarked ? 'fill-current' : ''}`} />
              <span>Saved ({bookmarks.length})</span>
            </button>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#29251F] border border-[#DED3C2] flex items-center gap-1.5 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#B96535]" />
              <span>Filters</span>
            </button>

            {/* Sort Menu */}
            <div className="flex items-center gap-1.5 bg-[#F5EBDD] px-3 py-1.5 rounded-xl border border-[#DED3C2] text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#827567]" />
              <select
                value={filters.sortBy}
                onChange={(e) => handleUpdateFilters({ sortBy: e.target.value as any })}
                className="bg-transparent text-[#29251F] font-medium focus:outline-none cursor-pointer"
              >
                <option value="relevance">Relevance</option>
                <option value="date-desc">Year: Newest First</option>
                <option value="date-asc">Year: Oldest First</option>
                <option value="title-asc">Title: A to Z</option>
              </select>
            </div>

            {/* Grid / List View Toggle */}
            <div className="flex items-center bg-[#F5EBDD] p-1 rounded-xl border border-[#DED3C2]">
              <button
                onClick={() => handleUpdateFilters({ viewMode: 'grid' })}
                className={`p-1.5 rounded-lg transition-colors ${
                  filters.viewMode === 'grid' ? 'bg-[#B96535] text-white' : 'text-[#827567] hover:text-[#29251F]'
                }`}
                title="Grid View"
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUpdateFilters({ viewMode: 'list' })}
                className={`p-1.5 rounded-lg transition-colors ${
                  filters.viewMode === 'list' ? 'bg-[#B96535] text-white' : 'text-[#827567] hover:text-[#29251F]'
                }`}
                title="List View"
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

        {/* Active Filter Chips */}
        <FilterChips
          filters={filters}
          onClearFilter={handleClearSingleFilter}
          onResetAll={handleResetAll}
          totalCount={records.length}
        />

      </div>

      {/* Main Grid with Sidebar Filter */}
      <div className="flex items-start gap-8">
        
        {/* Desktop Sidebar Filter */}
        <FilterDrawer
          filters={filters}
          onChange={handleUpdateFilters}
          onReset={handleResetAll}
          isOpenMobile={mobileFilterOpen}
          onCloseMobile={() => setMobileFilterOpen(false)}
        />

        {/* Catalog Records Content Area */}
        <div className="flex-1 min-w-0">
          {loading ? (
            <LoadingSkeleton count={4} type="card" />
          ) : records.length === 0 ? (
            <EmptyState
              title={showOnlyBookmarked ? 'No Bookmarked Records Found' : 'No Archival Records Match Your Query'}
              message={
                showOnlyBookmarked
                  ? 'You have not saved any archival records yet. Click the bookmark icon on any document card to save it here for reference.'
                  : 'Try relaxing your category or historical era filters, or search for terms like "Constitution", "Mahad", or "Caste".'
              }
              onReset={handleResetAll}
              resetLabel="Clear All Filters"
            />
          ) : (
            <div className="space-y-6">
              
              <div
                className={
                  filters.viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {records.slice(0, displayCount).map((record) => (
                  <ArchiveCard key={record.id} record={record} viewMode={filters.viewMode} />
                ))}
              </div>

              {/* Load More Pagination */}
              {displayCount < records.length && (
                <div className="pt-8 text-center">
                  <button
                    onClick={() => setDisplayCount((prev) => prev + 6)}
                    className="px-6 py-2.5 bg-[#FBF8F2] hover:bg-[#E7D5B9] border border-[#DED3C2] hover:border-[#B96535] text-[#29251F] text-sm font-semibold rounded-xl transition-all shadow-xs"
                  >
                    Load More Records ({records.length - displayCount} remaining)
                  </button>
                </div>
              )}

            </div>
          )}
        </div>

      </div>

    </div>
  );
};
