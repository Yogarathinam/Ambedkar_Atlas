import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArchiveRecord, FilterState, ArchiveCategory } from '../types';
import { archiveService } from '../services/archiveService';
import { ArchiveCard } from '../components/archive/ArchiveCard';
import { MeaVolumeCard } from '../components/archive/MeaVolumeCard';
import { FilterDrawer } from '../components/archive/FilterDrawer';
import { FilterChips } from '../components/archive/FilterChips';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { Search, LayoutGrid, List, SlidersHorizontal, ArrowUpDown, X, Bookmark, BookOpen, Layers, CheckCircle2 } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { MEA_INGESTED_VOLUMES, MeaVolumeRecord } from '../data/mea/ingestedVolumes';

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
  
  // Section toggle: 'all' or 'mea'
  const initialSection = searchParams.get('collection') === 'mea' ? 'mea' : 'all';
  const [activeSection, setActiveSection] = useState<'all' | 'mea'>(initialSection);

  // MEA specific filters
  const [meaEditionFilter, setMeaEditionFilter] = useState<'all' | 'English' | 'Hindi'>('all');
  const [meaVolumeSelect, setMeaVolumeSelect] = useState<string>('all');
  const [meaSearchQuery, setMeaSearchQuery] = useState<string>('');

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
    const collectionParam = searchParams.get('collection');

    if (collectionParam === 'mea') {
      setActiveSection('mea');
    }

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

  // Filtered MEA volumes calculation
  const filteredMeaVolumes = useMemo(() => {
    return MEA_INGESTED_VOLUMES.filter((vol) => {
      if (meaEditionFilter !== 'all' && vol.language !== meaEditionFilter) {
        return false;
      }
      if (meaVolumeSelect !== 'all' && vol.volume !== meaVolumeSelect) {
        return false;
      }
      if (meaSearchQuery.trim()) {
        const q = meaSearchQuery.toLowerCase().trim();
        const matchTitle = vol.title.toLowerCase().includes(q);
        const matchDesc = vol.description.toLowerCase().includes(q);
        const matchThemes = vol.keyThemes.some((t) => t.toLowerCase().includes(q));
        const matchToc = vol.tableOfContents.some((t) => t.title.toLowerCase().includes(q));
        if (!matchTitle && !matchDesc && !matchThemes && !matchToc) {
          return false;
        }
      }
      return true;
    });
  }, [meaEditionFilter, meaVolumeSelect, meaSearchQuery]);

  // Unique volume numbers for dropdown
  const availableVolumeNumbers = useMemo(() => {
    const set = new Set<string>();
    MEA_INGESTED_VOLUMES.forEach((v) => set.add(v.volume));
    return Array.from(set).sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-[#DED3C2] pb-6 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block">
          Archival Discovery
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F]">
          The National Digital Archive
        </h1>
        <p className="text-sm sm:text-base text-[#51483F] max-w-3xl leading-relaxed">
          Explore the official Books & Writings collection published by the Ministry of External Affairs, alongside historical speeches, Constituent Assembly debates, and verified archival manuscripts.
        </p>
      </div>

      {/* Primary Section Switcher Tabs: All Archives vs MEA Official Collection */}
      <div className="flex border-b-2 border-[#DED3C2] gap-2 sm:gap-4">
        <button
          onClick={() => {
            setActiveSection('all');
            const newParams = new URLSearchParams(searchParams);
            newParams.delete('collection');
            setSearchParams(newParams);
          }}
          className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-serif font-bold transition-all flex items-center gap-2 border-b-2 -mb-0.5 ${
            activeSection === 'all'
              ? 'border-[#B96535] text-[#B96535]'
              : 'border-transparent text-[#827567] hover:text-[#29251F]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>All Archival Records ({records.length})</span>
        </button>

        <button
          onClick={() => {
            setActiveSection('mea');
            const newParams = new URLSearchParams(searchParams);
            newParams.set('collection', 'mea');
            setSearchParams(newParams);
          }}
          className={`px-4 sm:px-6 py-3 text-sm sm:text-base font-serif font-bold transition-all flex items-center gap-2 border-b-2 -mb-0.5 ${
            activeSection === 'mea'
              ? 'border-[#B96535] text-[#B96535]'
              : 'border-transparent text-[#827567] hover:text-[#29251F]'
          }`}
        >
          <BookOpen className="w-4 h-4 text-[#B96535]" />
          <span>Official MEA Books & Writings (60 Volumes)</span>
        </button>
      </div>

      {/* SECTION A: Official MEA Collection (Books & Writings Hierarchy) */}
      {activeSection === 'mea' && (
        <div className="space-y-6">
          
          {/* MEA Collection Info Card */}
          <div className="bg-[#FAF4EA] border-2 border-[#DED3C2] rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B96535] text-white">
                  Government of India Edition
                </span>
                <span className="text-xs text-[#713F2B] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Authenticated Ministry of External Affairs Repository</span>
                </span>
              </div>

              <a
                href="https://www.mea.gov.in/books-writings-of-ambedkar.htm"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-[#B96535] hover:underline flex items-center gap-1"
              >
                <span>Visit Official MEA Collection Portal</span>
                <span>↗</span>
              </a>
            </div>

            <div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
                Dr. Babasaheb Ambedkar: Writings and Speeches
              </h2>
              <p className="text-sm text-[#51483F] mt-1.5 leading-relaxed max-w-3xl">
                The authoritative multi-volume library published by the Dr. Ambedkar Foundation and digitally preserved by the Ministry of External Affairs. Includes 20 complete English volumes (with specialized parts) and 40 Hindi editions (संपूर्ण वाङ्मय).
              </p>
            </div>

            {/* Ingestion & Hierarchy Summary Badges */}
            <div className="pt-3 border-t border-[#DED3C2] flex flex-wrap items-center gap-4 text-xs text-[#51483F]">
              <span><strong>60</strong> Discovered Volumes</span>
              <span>•</span>
              <span><strong>20</strong> English Editions</span>
              <span>•</span>
              <span><strong>40</strong> Hindi Editions</span>
              <span>•</span>
              <span className="text-emerald-800 font-semibold">Interactive PDF Facsimiles & Extracted Text Enabled</span>
            </div>
          </div>

          {/* MEA Filters Toolbar */}
          <div className="bg-[#FBF8F2] border-2 border-[#DED3C2] rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input for MEA Volumes */}
            <div className="relative flex-1">
              <input
                type="text"
                value={meaSearchQuery}
                onChange={(e) => setMeaSearchQuery(e.target.value)}
                placeholder="Search across MEA volume titles, chapters, treatises, or themes..."
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-[#DED3C2] rounded-xl text-[#29251F] focus:outline-none focus:border-[#B96535]"
              />
              <Search className="w-4 h-4 text-[#827567] absolute left-3.5 top-3 pointer-events-none" />
              {meaSearchQuery && (
                <button
                  onClick={() => setMeaSearchQuery('')}
                  className="absolute right-3 top-3 text-[#827567] hover:text-[#29251F]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Edition Selector Pills (English / Hindi / All) */}
            <div className="flex items-center gap-1.5 bg-[#F5EBDD] p-1 rounded-2xl border border-[#DED3C2] shrink-0">
              <button
                onClick={() => setMeaEditionFilter('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  meaEditionFilter === 'all'
                    ? 'bg-[#29251F] text-white shadow-xs'
                    : 'text-[#51483F] hover:text-[#29251F]'
                }`}
              >
                All (60)
              </button>

              <button
                onClick={() => setMeaEditionFilter('English')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  meaEditionFilter === 'English'
                    ? 'bg-[#29251F] text-white shadow-xs'
                    : 'text-[#51483F] hover:text-[#29251F]'
                }`}
              >
                English Editions (20)
              </button>

              <button
                onClick={() => setMeaEditionFilter('Hindi')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  meaEditionFilter === 'Hindi'
                    ? 'bg-[#29251F] text-white shadow-xs'
                    : 'text-[#51483F] hover:text-[#29251F]'
                }`}
              >
                Hindi Editions (40)
              </button>
            </div>

            {/* Volume Number Dropdown */}
            <div className="shrink-0 flex items-center gap-2 text-xs">
              <span className="font-semibold text-[#713F2B] hidden lg:inline">Jump to Volume:</span>
              <select
                value={meaVolumeSelect}
                onChange={(e) => setMeaVolumeSelect(e.target.value)}
                className="px-3 py-2 bg-white border border-[#DED3C2] rounded-xl text-xs font-semibold text-[#29251F] focus:outline-none focus:border-[#B96535]"
              >
                <option value="all">All Volumes</option>
                {availableVolumeNumbers.map((v) => (
                  <option key={v} value={v}>Volume {v}</option>
                ))}
              </select>
            </div>

          </div>

          {/* MEA Volumes Grid */}
          {filteredMeaVolumes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMeaVolumes.map((vol) => (
                <MeaVolumeCard key={vol.id} volume={vol} />
              ))}
            </div>
          ) : (
            <EmptyState
              title="No MEA Volumes Match Search"
              description="Try adjusting your keywords or clearing the edition filters to browse the complete catalogue."
              onReset={() => {
                setMeaSearchQuery('');
                setMeaEditionFilter('all');
                setMeaVolumeSelect('all');
              }}
            />
          )}

        </div>
      )}

      {/* SECTION B: All Archival Records (Existing Category & Era Browser) */}
      {activeSection === 'all' && (
        <div className="space-y-6">
          
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

                {/* Mobile Filter Drawer Trigger */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden px-3 py-2 rounded-xl text-xs font-semibold bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] flex items-center gap-1.5 hover:bg-[#E7D5B9]"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Filters</span>
                </button>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-1.5 bg-[#FFF] border border-[#DED3C2] rounded-xl px-2.5 py-1.5">
                  <ArrowUpDown className="w-3.5 h-3.5 text-[#827567]" />
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleUpdateFilters({ sortBy: e.target.value as FilterState['sortBy'] })}
                    className="text-xs bg-transparent border-none text-[#29251F] focus:outline-none cursor-pointer"
                  >
                    <option value="relevance">Sort: Curated Master Order</option>
                    <option value="date-desc">Sort: Chronological (Newest)</option>
                    <option value="date-asc">Sort: Chronological (Oldest)</option>
                    <option value="title-asc">Sort: Title (A-Z)</option>
                  </select>
                </div>

                {/* View Mode Toggle */}
                <div className="hidden sm:flex items-center bg-[#F5EBDD] border border-[#DED3C2] rounded-xl p-1 gap-1">
                  <button
                    onClick={() => handleUpdateFilters({ viewMode: 'grid' })}
                    className={`p-1.5 rounded-lg transition-colors ${
                      filters.viewMode === 'grid'
                        ? 'bg-[#FFF] text-[#B96535] shadow-xs'
                        : 'text-[#827567] hover:text-[#29251F]'
                    }`}
                    title="Grid view"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleUpdateFilters({ viewMode: 'list' })}
                    className={`p-1.5 rounded-lg transition-colors ${
                      filters.viewMode === 'list'
                        ? 'bg-[#FFF] text-[#B96535] shadow-xs'
                        : 'text-[#827567] hover:text-[#29251F]'
                    }`}
                    title="List view"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

            {/* Active Filter Chips */}
            <FilterChips
              filters={filters}
              onRemoveFilter={handleClearSingleFilter}
              onResetAll={handleResetAll}
            />

          </div>

          {/* Records Layout with Sidebar on Desktop */}
          <div className="flex gap-8 items-start">
            
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block w-72 shrink-0 bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#DED3C2]">
                <h3 className="font-serif text-lg font-bold text-[#29251F]">Filter Archive</h3>
                <button
                  onClick={handleResetAll}
                  className="text-xs text-[#B96535] hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>

              <FilterDrawer
                filters={filters}
                onUpdateFilters={handleUpdateFilters}
                isMobile={false}
              />
            </aside>

            {/* Records Content List / Grid */}
            <main className="flex-1 space-y-6">
              
              <div className="flex items-center justify-between text-xs text-[#827567] px-1">
                <span>
                  Showing {Math.min(displayCount, records.length)} of {records.length} curated archival records
                </span>
                {showOnlyBookmarked && (
                  <span className="font-semibold text-[#B96535]">Filtered by Saved Bookmarks</span>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <LoadingSkeleton count={6} type="card" />
                </div>
              ) : records.length === 0 ? (
                <EmptyState
                  title="No Archival Records Found"
                  description="We could not find any primary records matching the selected parameters. Try resetting your query or clearing era filters."
                  onReset={handleResetAll}
                />
              ) : (
                <div className={
                  filters.viewMode === 'grid'
                    ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col gap-4'
                }>
                  {records.slice(0, displayCount).map((record) => (
                    <ArchiveCard
                      key={record.id}
                      record={record}
                      viewMode={filters.viewMode}
                    />
                  ))}
                </div>
              )}

              {/* Load More Pagination Button */}
              {records.length > displayCount && (
                <div className="pt-6 text-center">
                  <button
                    onClick={() => setDisplayCount((prev) => prev + 9)}
                    className="px-6 py-2.5 rounded-xl border-2 border-[#DED3C2] bg-[#FBF8F2] hover:bg-[#E7D5B9] text-[#29251F] text-sm font-semibold transition-colors shadow-2xs"
                  >
                    Load More Archival Records ({records.length - displayCount} remaining)
                  </button>
                </div>
              )}

            </main>

          </div>

        </div>
      )}

      {/* Mobile Filters Slide-over */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="relative ml-auto w-full max-w-xs bg-[#FBF8F2] h-full p-6 shadow-2xl flex flex-col justify-between overflow-y-auto z-10 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#DED3C2]">
              <h3 className="font-serif text-lg font-bold text-[#29251F]">Filter Catalog</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-lg hover:bg-[#E7D5B9]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <FilterDrawer
              filters={filters}
              onUpdateFilters={(updates: Partial<FilterState>) => {
                handleUpdateFilters(updates);
                setMobileFilterOpen(false);
              }}
              isMobile={true}
            />

            <div className="pt-4 border-t border-[#DED3C2] flex gap-2">
              <button
                onClick={handleResetAll}
                className="flex-1 py-2 rounded-xl border border-[#DED3C2] text-xs font-semibold"
              >
                Reset All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 rounded-xl bg-[#B96535] text-white text-xs font-semibold"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
