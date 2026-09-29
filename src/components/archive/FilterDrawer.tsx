import React, { useState, useEffect } from 'react';
import { FilterState, ArchiveCategory, ArchiveEra, ArchiveLanguage } from '../../types';
import { ARCHIVE_CATEGORIES } from '../../data/categories';
import { SlidersHorizontal, RotateCcw, X, Check, ChevronDown, ChevronUp, BookOpen, Clock, Globe, FileStack } from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';

interface FilterDrawerProps {
  filters: FilterState;
  onChange?: (updates: Partial<FilterState>) => void;
  onUpdateFilters?: (updates: Partial<FilterState>) => void;
  onReset?: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  isMobile?: boolean;
  categoryCounts?: Record<string, number>;
  totalCount?: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filters,
  onChange,
  onUpdateFilters,
  onReset,
  isOpenMobile = false,
  onCloseMobile,
  isMobile,
  categoryCounts,
  totalCount = 74,
}) => {
  const { isKiosk } = useDevice();
  const handleChange = onUpdateFilters || onChange || (() => {});
  const showMobile = isMobile !== undefined ? isMobile : isOpenMobile;
  const handleClose = onCloseMobile || (() => {});

  // Collapsible section states
  const [openSections, setOpenSections] = useState({
    collections: true,
    epoch: filters.era !== 'all',
    language: filters.language !== 'all',
    format: filters.format !== 'all',
  });

  // Auto-expand sections when active filters exist
  useEffect(() => {
    if (filters.era !== 'all') {
      setOpenSections((prev) => ({ ...prev, epoch: true }));
    }
    if (filters.language !== 'all') {
      setOpenSections((prev) => ({ ...prev, language: true }));
    }
    if (filters.format !== 'all') {
      setOpenSections((prev) => ({ ...prev, format: true }));
    }
  }, [filters.era, filters.language, filters.format]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const ERAS: ArchiveEra[] = [
    'all',
    '1891-1912: Early Life & Columbia',
    '1913-1923: LSE, Gray\'s Inn & Early Practice',
    '1924-1935: Mahad & Poona Pact Epoch',
    '1936-1946: Annihilation of Caste & Labour Movement',
    '1947-1951: Drafting Constitution & Law Ministry',
    '1952-1956: Buddhist Conversion & Final Works',
  ];

  const LANGUAGES: ('all' | ArchiveLanguage)[] = ['all', 'English', 'Marathi', 'Hindi', 'Multilingual'];
  const FORMATS: ('all' | 'document' | 'manuscript' | 'photo')[] = [
    'all', 'document', 'manuscript', 'photo'
  ];

  const hasActiveFilters = 
    Boolean(filters.searchQuery) ||
    filters.category !== 'all' ||
    filters.era !== 'all' ||
    filters.language !== 'all' ||
    filters.format !== 'all';

  const filterContent = (
    <div className={`space-y-4 ${isKiosk ? 'text-base' : 'text-xs sm:text-sm'}`}>
      
      {/* 1. SECTION: Collections / Categories */}
      <div className="border border-[#DED3C2] rounded-xl overflow-hidden bg-white/60">
        <button
          type="button"
          onClick={() => toggleSection('collections')}
          className="w-full flex items-center justify-between p-3.5 bg-[#FAF4EA] hover:bg-[#F5EBDD] transition-colors text-left font-serif font-bold text-[#29251F]"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#B96535]" />
            <span>Collections</span>
            {filters.category !== 'all' && (
              <span className="text-[10px] bg-[#B96535] text-white px-2 py-0.5 rounded-full font-sans font-semibold uppercase">
                {filters.category}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[#827567]">
            {openSections.collections ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.collections && (
          <div className="p-3 space-y-1 bg-[#FBF8F2]/70 border-t border-[#DED3C2]">
            <button
              onClick={() => handleChange({ category: 'all' })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-xs ${
                filters.category === 'all'
                  ? 'bg-[#B96535] text-white font-semibold shadow-2xs'
                  : 'text-[#51483F] hover:bg-[#E7D5B9]/60'
              }`}
            >
              <span>All Collections</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono ${
                filters.category === 'all' ? 'bg-white/20 text-white' : 'bg-[#E7D5B9] text-[#713F2B]'
              }`}>
                {totalCount}
              </span>
            </button>

            {ARCHIVE_CATEGORIES.map((cat) => {
              const actualCount = categoryCounts ? (categoryCounts[cat.id] ?? cat.count) : cat.count;
              const isSelected = filters.category === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => handleChange({ category: cat.id })}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors text-xs ${
                    isSelected
                      ? 'bg-[#B96535] text-white font-semibold shadow-2xs'
                      : 'text-[#51483F] hover:bg-[#E7D5B9]/60'
                  }`}
                >
                  <span className="truncate pr-2">{cat.title}</span>
                  <span className={`text-[11px] px-1.5 py-0.5 rounded-full font-mono shrink-0 ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#E7D5B9] text-[#713F2B]'
                  }`}>
                    {actualCount}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. SECTION: Historical Epoch */}
      <div className="border border-[#DED3C2] rounded-xl overflow-hidden bg-white/60">
        <button
          type="button"
          onClick={() => toggleSection('epoch')}
          className="w-full flex items-center justify-between p-3.5 bg-[#FAF4EA] hover:bg-[#F5EBDD] transition-colors text-left font-serif font-bold text-[#29251F]"
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#B96535]" />
            <span>Historical Epoch</span>
            {filters.era !== 'all' && (
              <span className="text-[10px] bg-[#713F2B] text-white px-2 py-0.5 rounded-full font-sans font-semibold">
                Active
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[#827567]">
            {openSections.epoch ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.epoch && (
          <div className="p-3 space-y-1 bg-[#FBF8F2]/70 border-t border-[#DED3C2]">
            {ERAS.map((era) => {
              const isSelected = filters.era === era;
              return (
                <button
                  key={era}
                  onClick={() => handleChange({ era })}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-[#29251F] text-[#FBF8F2] font-semibold shadow-2xs'
                      : 'text-[#51483F] hover:bg-[#E7D5B9]/50'
                  }`}
                >
                  <span className="leading-snug">
                    {era === 'all' ? 'All Eras (1891–1956)' : era}
                  </span>
                  {isSelected && <Check className="w-3.5 h-3.5 shrink-0 text-[#E7D5B9]" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 3. SECTION: Language */}
      <div className="border border-[#DED3C2] rounded-xl overflow-hidden bg-white/60">
        <button
          type="button"
          onClick={() => toggleSection('language')}
          className="w-full flex items-center justify-between p-3.5 bg-[#FAF4EA] hover:bg-[#F5EBDD] transition-colors text-left font-serif font-bold text-[#29251F]"
        >
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#B96535]" />
            <span>Language</span>
            {filters.language !== 'all' && (
              <span className="text-[10px] bg-[#B96535] text-white px-2 py-0.5 rounded-full font-sans font-semibold">
                {filters.language}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[#827567]">
            {openSections.language ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.language && (
          <div className="p-3 bg-[#FBF8F2]/70 border-t border-[#DED3C2]">
            <div className="flex flex-wrap gap-1.5">
              {LANGUAGES.map((lang) => {
                const isSelected = filters.language === lang;
                return (
                  <button
                    key={lang}
                    onClick={() => handleChange({ language: lang })}
                    className={`px-3 py-1.5 rounded-lg text-xs transition-colors font-medium ${
                      isSelected
                        ? 'bg-[#713F2B] text-white shadow-2xs'
                        : 'bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
                    }`}
                  >
                    {lang === 'all' ? 'All Languages' : lang}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* 4. SECTION: Media Format */}
      <div className="border border-[#DED3C2] rounded-xl overflow-hidden bg-white/60">
        <button
          type="button"
          onClick={() => toggleSection('format')}
          className="w-full flex items-center justify-between p-3.5 bg-[#FAF4EA] hover:bg-[#F5EBDD] transition-colors text-left font-serif font-bold text-[#29251F]"
        >
          <div className="flex items-center gap-2">
            <FileStack className="w-4 h-4 text-[#B96535]" />
            <span>Media Format</span>
            {filters.format !== 'all' && (
              <span className="text-[10px] bg-[#B96535] text-white px-2 py-0.5 rounded-full font-sans font-semibold capitalize">
                {filters.format}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-[#827567]">
            {openSections.format ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </button>

        {openSections.format && (
          <div className="p-3 bg-[#FBF8F2]/70 border-t border-[#DED3C2]">
            <div className="flex flex-wrap gap-1.5">
              {FORMATS.map((fmt) => {
                const isSelected = filters.format === fmt;
                return (
                  <button
                    key={fmt}
                    onClick={() => handleChange({ format: fmt })}
                    className={`px-3 py-1.5 rounded-lg text-xs capitalize transition-colors font-medium ${
                      isSelected
                        ? 'bg-[#B96535] text-white shadow-2xs'
                        : 'bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
                    }`}
                  >
                    {fmt === 'all' ? 'All Formats' : fmt}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Reset Action */}
      {hasActiveFilters && onReset && (
        <div className="pt-2">
          <button
            onClick={onReset}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#DED3C2] hover:border-[#B96535] text-xs font-semibold text-[#713F2B] hover:text-[#B96535] transition-colors bg-[#FAF4EA] hover:bg-[#F5EBDD]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      )}

    </div>
  );

  return (
    <>
      {/* 1. Desktop Standalone Sidebar (Single unified container, no nested aside) */}
      <aside className="hidden lg:block w-72 shrink-0 bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-5 sticky top-24 self-start shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#DED3C2]">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-[#B96535]" />
            <h3 className="font-serif text-lg font-bold text-[#29251F]">Filter Archive</h3>
          </div>
          {hasActiveFilters && onReset && (
            <button
              onClick={onReset}
              className="text-xs text-[#B96535] hover:text-[#713F2B] font-semibold transition-colors"
            >
              Reset All
            </button>
          )}
        </div>

        <div className="text-[11px] text-[#827567] bg-[#FAF4EA] px-2.5 py-1.5 rounded-lg border border-[#DED3C2]/70 flex items-center justify-between">
          <span className="font-medium">Digitized Holdings</span>
          <span className="font-mono font-bold text-[#713F2B]">{totalCount} Available</span>
        </div>

        {filterContent}
      </aside>

      {/* 2. Mobile Drawer Slide-over Modal (Full overlay when triggered) */}
      {showMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={handleClose}
            aria-hidden="true"
          />
          <div className="relative ml-auto w-full max-w-sm bg-[#FBF8F2] h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#DED3C2]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#B96535]" />
                  <h3 className="font-serif text-xl font-bold text-[#29251F]">Filter Archive</h3>
                </div>
                <button
                  onClick={handleClose}
                  className="p-1.5 rounded-lg text-[#827567] hover:text-[#29251F] hover:bg-[#E7D5B9] transition-colors"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="text-xs text-[#827567] bg-[#FAF4EA] p-2.5 rounded-xl border border-[#DED3C2] flex items-center justify-between">
                <span>Available Records in Catalog:</span>
                <span className="font-mono font-bold text-[#713F2B]">{totalCount} Items</span>
              </div>

              {filterContent}
            </div>

            <div className="pt-4 border-t border-[#DED3C2] flex gap-2 shrink-0">
              {hasActiveFilters && onReset && (
                <button
                  onClick={() => {
                    onReset();
                    handleClose();
                  }}
                  className="flex-1 py-2.5 border border-[#DED3C2] rounded-xl text-xs font-semibold text-[#51483F] hover:bg-[#E7D5B9] transition-colors"
                >
                  Reset All
                </button>
              )}
              <button
                onClick={handleClose}
                className="flex-1 py-2.5 bg-[#B96535] hover:bg-[#713F2B] text-white font-semibold rounded-xl text-xs shadow-xs transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
