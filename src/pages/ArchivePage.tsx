import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MeaVolumeCard } from '../components/archive/MeaVolumeCard';
import { EmptyState } from '../components/common/EmptyState';
import { Search, X, Bookmark, BookOpen, CheckCircle2, ArrowUpDown, Filter, RotateCcw } from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { MEA_INGESTED_VOLUMES, MEA_COLLECTION_METADATA, MeaVolumeRecord } from '../data/mea/ingestedVolumes';

export const ArchivePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { bookmarks } = useBookmarks();

  // Filters State
  const [searchQuery, setSearchQuery] = useState<string>(searchParams.get('q') || '');
  const [languageFilter, setLanguageFilter] = useState<'all' | 'English' | 'Hindi'>(
    (searchParams.get('language') as 'English' | 'Hindi') || 'all'
  );
  const [volumeFilter, setVolumeFilter] = useState<string>(searchParams.get('vol') || 'all');
  const [partFilter, setPartFilter] = useState<'all' | 'single' | 'multipart'>('all');
  const [sortBy, setSortBy] = useState<'volume-asc' | 'volume-desc' | 'title-asc' | 'pages-desc'>('volume-asc');
  const [showOnlyBookmarked, setShowOnlyBookmarked] = useState<boolean>(searchParams.get('bookmarked') === 'true');
  const [displayCount, setDisplayCount] = useState<number>(18);

  // Sync with URL query parameters
  useEffect(() => {
    const qParam = searchParams.get('q');
    const langParam = searchParams.get('language') as 'English' | 'Hindi' | null;
    const volParam = searchParams.get('vol');
    const bookmarkedParam = searchParams.get('bookmarked');

    if (qParam !== null) setSearchQuery(qParam);
    if (langParam === 'English' || langParam === 'Hindi') setLanguageFilter(langParam);
    if (volParam !== null) setVolumeFilter(volParam);
    if (bookmarkedParam !== null) setShowOnlyBookmarked(bookmarkedParam === 'true');
  }, [searchParams]);

  // Overall catalog metadata derived strictly from verified data
  const stats = useMemo(() => {
    const totalFiles = MEA_INGESTED_VOLUMES.length;
    const englishFiles = MEA_INGESTED_VOLUMES.filter((v) => v.language === 'English').length;
    const hindiFiles = MEA_INGESTED_VOLUMES.filter((v) => v.language === 'Hindi').length;

    const engVols = new Set(MEA_INGESTED_VOLUMES.filter((v) => v.language === 'English').map((v) => v.volume));
    const hinVols = new Set(MEA_INGESTED_VOLUMES.filter((v) => v.language === 'Hindi').map((v) => v.volume));
    const distinctNumberedVolumes = engVols.size + hinVols.size; // 17 English + 40 Hindi = 57 numbered volumes

    return {
      totalFiles,
      englishFiles,
      hindiFiles,
      englishVolumes: engVols.size,
      hindiVolumes: hinVols.size,
      distinctNumberedVolumes,
    };
  }, []);

  // Unique volume numbers for dropdown
  const availableVolumeNumbers = useMemo(() => {
    const set = new Set<string>();
    MEA_INGESTED_VOLUMES.forEach((v) => {
      if (languageFilter === 'all' || v.language === languageFilter) {
        set.add(v.volume);
      }
    });
    return Array.from(set).sort((a, b) => {
      const na = parseInt(a, 10);
      const nb = parseInt(b, 10);
      if (!isNaN(na) && !isNaN(nb)) return na - nb;
      return a.localeCompare(b);
    });
  }, [languageFilter]);

  // Active filter count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (searchQuery.trim()) count++;
    if (languageFilter !== 'all') count++;
    if (volumeFilter !== 'all') count++;
    if (partFilter !== 'all') count++;
    if (showOnlyBookmarked) count++;
    return count;
  }, [searchQuery, languageFilter, volumeFilter, partFilter, showOnlyBookmarked]);

  // Filter and Sort MEA volumes
  const filteredVolumes = useMemo(() => {
    const result = MEA_INGESTED_VOLUMES.filter((vol) => {
      // 1. Language filter
      if (languageFilter !== 'all' && vol.language !== languageFilter) {
        return false;
      }

      // 2. Volume number filter
      if (volumeFilter !== 'all' && vol.volume !== volumeFilter) {
        return false;
      }

      // 3. Part filter
      if (partFilter === 'single' && vol.part !== null) {
        return false;
      }
      if (partFilter === 'multipart' && vol.part === null) {
        return false;
      }

      // 4. Bookmark filter
      if (showOnlyBookmarked && !bookmarks.includes(vol.id)) {
        return false;
      }

      // 5. Search query filter (title, description, key themes, TOC chapters)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchTitle = vol.title.toLowerCase().includes(q);
        const matchDesc = vol.description.toLowerCase().includes(q);
        const matchThemes = vol.keyThemes.some((t) => t.toLowerCase().includes(q));
        const matchToc = vol.tableOfContents.some((t) => t.title.toLowerCase().includes(q));
        const matchTags = vol.tags.some((t) => t.toLowerCase().includes(q));

        if (!matchTitle && !matchDesc && !matchThemes && !matchToc && !matchTags) {
          return false;
        }
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      const volNumA = parseInt(a.volume, 10);
      const volNumB = parseInt(b.volume, 10);

      switch (sortBy) {
        case 'volume-desc':
          if (!isNaN(volNumA) && !isNaN(volNumB) && volNumA !== volNumB) {
            return volNumB - volNumA;
          }
          return b.title.localeCompare(a.title);

        case 'title-asc':
          return a.title.localeCompare(b.title);

        case 'pages-desc':
          return b.pageCount - a.pageCount;

        case 'volume-asc':
        default:
          if (a.language !== b.language) {
            // Keep English first or consistent
            return a.language === 'English' ? -1 : 1;
          }
          if (!isNaN(volNumA) && !isNaN(volNumB) && volNumA !== volNumB) {
            return volNumA - volNumB;
          }
          // Handle parts (Part I before Part II)
          if (a.part && b.part) {
            return a.part.localeCompare(b.part);
          }
          return a.title.localeCompare(b.title);
      }
    });
  }, [languageFilter, volumeFilter, partFilter, showOnlyBookmarked, bookmarks, searchQuery, sortBy]);

  // Distinct volumes count for currently filtered items
  const filteredDistinctVolumesCount = useMemo(() => {
    const set = new Set(filteredVolumes.map((v) => `${v.language}-${v.volume}`));
    return set.size;
  }, [filteredVolumes]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setLanguageFilter('all');
    setVolumeFilter('all');
    setPartFilter('all');
    setShowOnlyBookmarked(false);
    setSortBy('volume-asc');
    setSearchParams({});
    setDisplayCount(18);
  };

  const handleLanguageChange = (lang: 'all' | 'English' | 'Hindi') => {
    setLanguageFilter(lang);
    setVolumeFilter('all'); // reset volume dropdown since list may change
    const newParams = new URLSearchParams(searchParams);
    if (lang === 'all') {
      newParams.delete('language');
    } else {
      newParams.set('language', lang);
    }
    newParams.delete('vol');
    setSearchParams(newParams);
  };

  const visibleVolumes = filteredVolumes.slice(0, displayCount);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* 1. Header Banner: Official Books & Writings */}
      <div className="border-b border-[#DED3C2] pb-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#B96535] text-white">
              Official Ministry of External Affairs Archive
            </span>
            <span className="text-xs text-[#713F2B] font-semibold flex items-center gap-1.5 hidden sm:inline-flex">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verified Government of India Repository</span>
            </span>
          </div>

          <a
            href="https://www.mea.gov.in/books-writings-of-ambedkar.htm"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold text-[#B96535] hover:text-[#713F2B] hover:underline flex items-center gap-1.5 bg-[#F5EBDD] px-3.5 py-1.5 rounded-xl border border-[#DED3C2] transition-colors"
          >
            <span>Visit Official MEA Collection Portal</span>
            <span>↗</span>
          </a>
        </div>

        <div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F]">
            Official Books & Writings
          </h1>
          <p className="text-sm sm:text-base text-[#51483F] max-w-4xl mt-2 leading-relaxed">
            The complete multi-volume library <em>Dr. Babasaheb Ambedkar: Writings and Speeches</em> published by the Dr. Ambedkar Foundation and digitally preserved by the Ministry of External Affairs. This archive includes 20 complete English volumes (with specialized multi-part editions) and 40 complete Hindi editions (संपूर्ण वाङ्मय). Every volume is provided with its official PDF facsimile, table of contents, and extracted text.
          </p>
        </div>

        {/* Statistical Summary Cards: Verified Counts */}
        <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-[#FAF4EA] border border-[#DED3C2] p-3 rounded-2xl">
            <span className="text-[#827567] block">Official PDF Files</span>
            <span className="text-lg font-serif font-bold text-[#29251F]">
              {stats.totalFiles} Documents
            </span>
          </div>
          <div className="bg-[#FAF4EA] border border-[#DED3C2] p-3 rounded-2xl">
            <span className="text-[#827567] block">Distinct Numbered Volumes</span>
            <span className="text-lg font-serif font-bold text-[#29251F]">
              {stats.distinctNumberedVolumes} Volumes
            </span>
          </div>
          <div className="bg-[#FAF4EA] border border-[#DED3C2] p-3 rounded-2xl">
            <span className="text-[#827567] block">English Edition (BAWS)</span>
            <span className="text-lg font-serif font-bold text-[#713F2B]">
              {stats.englishFiles} Files ({stats.englishVolumes} Vols)
            </span>
          </div>
          <div className="bg-[#FAF4EA] border border-[#DED3C2] p-3 rounded-2xl">
            <span className="text-[#827567] block">Hindi Edition (वाङ्मय)</span>
            <span className="text-lg font-serif font-bold text-[#713F2B]">
              {stats.hindiFiles} Files ({stats.hindiVolumes} Vols)
            </span>
          </div>
        </div>
      </div>

      {/* 2. Filter & Controls Toolbar */}
      <div className="bg-[#FBF8F2] border-2 border-[#DED3C2] rounded-3xl p-5 sm:p-6 shadow-xs space-y-4">
        
        {/* Top Controls Row: Search Input + Language Pills */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          
          {/* Search Input across titles and extracted TOC */}
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                const newParams = new URLSearchParams(searchParams);
                if (e.target.value.trim()) {
                  newParams.set('q', e.target.value);
                } else {
                  newParams.delete('q');
                }
                setSearchParams(newParams);
              }}
              placeholder="Search across volume titles, treatises, chapters, or themes..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-white border border-[#DED3C2] rounded-xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:border-[#B96535] focus:ring-1 focus:ring-[#B96535]"
            />
            <Search className="w-4 h-4 text-[#827567] absolute left-3.5 top-3.5 pointer-events-none" />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  const newParams = new URLSearchParams(searchParams);
                  newParams.delete('q');
                  setSearchParams(newParams);
                }}
                className="absolute right-3 top-3 text-[#827567] hover:text-[#29251F] cursor-pointer"
                title="Clear search query"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Language Selection Filter Pills */}
          <div className="flex items-center gap-1.5 bg-[#F5EBDD] p-1 rounded-2xl border border-[#DED3C2] shrink-0 self-start lg:self-auto">
            <button
              onClick={() => handleLanguageChange('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                languageFilter === 'all'
                  ? 'bg-[#29251F] text-white shadow-xs'
                  : 'text-[#51483F] hover:text-[#29251F]'
              }`}
            >
              All ({stats.totalFiles})
            </button>

            <button
              onClick={() => handleLanguageChange('English')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                languageFilter === 'English'
                  ? 'bg-[#29251F] text-white shadow-xs'
                  : 'text-[#51483F] hover:text-[#29251F]'
              }`}
            >
              English ({stats.englishFiles})
            </button>

            <button
              onClick={() => handleLanguageChange('Hindi')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                languageFilter === 'Hindi'
                  ? 'bg-[#29251F] text-white shadow-xs'
                  : 'text-[#51483F] hover:text-[#29251F]'
              }`}
            >
              Hindi • हिन्दी ({stats.hindiFiles})
            </button>
          </div>

        </div>

        {/* Bottom Secondary Controls Row: Volume dropdown, Part filter, Sort, Bookmarks, Reset */}
        <div className="pt-3 border-t border-[#DED3C2] flex flex-wrap items-center justify-between gap-3 text-xs">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Volume Number Dropdown */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#713F2B]">Volume:</span>
              <select
                value={volumeFilter}
                onChange={(e) => {
                  setVolumeFilter(e.target.value);
                  const newParams = new URLSearchParams(searchParams);
                  if (e.target.value !== 'all') {
                    newParams.set('vol', e.target.value);
                  } else {
                    newParams.delete('vol');
                  }
                  setSearchParams(newParams);
                }}
                className="px-2.5 py-1.5 bg-white border border-[#DED3C2] rounded-xl text-xs font-semibold text-[#29251F] focus:outline-none focus:border-[#B96535]"
              >
                <option value="all">All Volumes</option>
                {availableVolumeNumbers.map((v) => (
                  <option key={v} value={v}>Volume {v}</option>
                ))}
              </select>
            </div>

            {/* Part Filter (Single vs Multi-part volumes) */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#713F2B]">Edition Type:</span>
              <select
                value={partFilter}
                onChange={(e) => setPartFilter(e.target.value as 'all' | 'single' | 'multipart')}
                className="px-2.5 py-1.5 bg-white border border-[#DED3C2] rounded-xl text-xs font-semibold text-[#29251F] focus:outline-none focus:border-[#B96535]"
              >
                <option value="all">All Formats</option>
                <option value="single">Standard Single Volume</option>
                <option value="multipart">Multi-Part Editions (e.g. Vol 14 & 17)</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#827567]" />
              <span className="font-semibold text-[#713F2B]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-2.5 py-1.5 bg-white border border-[#DED3C2] rounded-xl text-xs font-semibold text-[#29251F] focus:outline-none focus:border-[#B96535]"
              >
                <option value="volume-asc">Volume Number (Low to High)</option>
                <option value="volume-desc">Volume Number (High to Low)</option>
                <option value="title-asc">Title (A to Z)</option>
                <option value="pages-desc">Page Count (Most Pages)</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bookmarks Toggle */}
            <button
              onClick={() => {
                const nextState = !showOnlyBookmarked;
                setShowOnlyBookmarked(nextState);
                const newParams = new URLSearchParams(searchParams);
                if (nextState) {
                  newParams.set('bookmarked', 'true');
                } else {
                  newParams.delete('bookmarked');
                }
                setSearchParams(newParams);
              }}
              className={`px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 border transition-all cursor-pointer ${
                showOnlyBookmarked
                  ? 'bg-[#B96535] text-white border-[#B96535]'
                  : 'bg-white text-[#51483F] border-[#DED3C2] hover:bg-[#F5EBDD]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${showOnlyBookmarked ? 'fill-current' : ''}`} />
              <span>Saved ({bookmarks.length})</span>
            </button>

            {/* Reset All Filters button */}
            {activeFiltersCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-xl font-semibold flex items-center gap-1 text-[#713F2B] hover:text-[#B96535] hover:bg-[#E7D5B9] transition-colors cursor-pointer"
                title="Reset all search filters"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters ({activeFiltersCount})</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* 3. Results Header & Count Notice */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-[#827567] px-1">
        <div>
          Showing <strong className="text-[#29251F]">{filteredVolumes.length}</strong> of <strong>{stats.totalFiles}</strong> official MEA documents across <strong className="text-[#29251F]">{filteredDistinctVolumesCount}</strong> numbered volumes
          {searchQuery && <span> matching "<span className="text-[#B96535] font-semibold">{searchQuery}</span>"</span>}
          {languageFilter !== 'all' && <span> in <strong>{languageFilter}</strong></span>}
          {volumeFilter !== 'all' && <span> (Volume <strong>{volumeFilter}</strong>)</span>}
        </div>

        <div className="text-xs text-[#713F2B] font-medium hidden md:block">
          Direct PDF facsimile & extracted text available for every document
        </div>
      </div>

      {/* 4. Responsive MEA Volumes Grid */}
      {filteredVolumes.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleVolumes.map((vol) => (
              <MeaVolumeCard key={vol.id} volume={vol} />
            ))}
          </div>

          {/* Load More Pagination Button */}
          {visibleVolumes.length < filteredVolumes.length && (
            <div className="text-center pt-4">
              <button
                onClick={() => setDisplayCount((prev) => prev + 18)}
                className="px-6 py-3 bg-[#FAF4EA] hover:bg-[#F5EBDD] text-[#713F2B] font-serif font-bold text-sm rounded-2xl border-2 border-[#DED3C2] hover:border-[#B96535] transition-all shadow-xs cursor-pointer"
              >
                Load More Volumes ({filteredVolumes.length - visibleVolumes.length} remaining)
              </button>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          title="No MEA Volumes Found"
          description="No official MEA documents match your current filter criteria. Try clearing search keywords or switching languages."
          onReset={handleResetFilters}
        />
      )}

      {/* 5. Provenance & Preservation Note */}
      <div className="bg-[#FAF4EA] border border-[#DED3C2] rounded-3xl p-6 text-xs text-[#51483F] space-y-2">
        <h4 className="font-serif text-sm font-bold text-[#29251F]">
          Archival Provenance & Ingestion Integrity
        </h4>
        <p className="leading-relaxed">
          The Ambedkar Atlas exclusively indexes the authoritative edition of <em>Dr. Babasaheb Ambedkar: Writings and Speeches</em> (BAWS), published by the Dr. Ambedkar Foundation, Ministry of Social Justice and Empowerment, and digitally disseminated by the Ministry of External Affairs (MEA), Government of India. The collection comprises 20 English PDF documents (including multi-part volumes for Vol. 14 and Vol. 17) and 40 complete Hindi PDF volumes (सम्पूर्ण वाङ्मय). All metadata, volume counts, and file structures reflect verified government records.
        </p>
      </div>

    </div>
  );
};
