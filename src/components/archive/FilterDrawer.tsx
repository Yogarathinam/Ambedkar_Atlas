import React from 'react';
import { FilterState, ArchiveCategory, ArchiveEra, ArchiveLanguage } from '../../types';
import { ARCHIVE_CATEGORIES } from '../../data/categories';
import { SlidersHorizontal, RotateCcw, X, Check } from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';

interface FilterDrawerProps {
  filters: FilterState;
  onChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filters,
  onChange,
  onReset,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { isKiosk } = useDevice();

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
  const FORMATS: ('all' | 'document' | 'audio' | 'video' | 'photo' | 'manuscript')[] = [
    'all', 'document', 'manuscript', 'photo', 'audio', 'video'
  ];

  const content = (
    <div className={`space-y-6 ${isKiosk ? 'text-base' : 'text-sm'}`}>
      
      {/* Category Filter */}
      <div>
        <h4 className="font-serif text-base font-bold text-[#29251F] mb-3 flex items-center justify-between">
          <span>Archival Collections</span>
          {filters.category !== 'all' && (
            <button
              onClick={() => onChange({ category: 'all' })}
              className="text-xs font-normal text-[#B96535] hover:underline"
            >
              Reset
            </button>
          )}
        </h4>
        <div className="space-y-1">
          <button
            onClick={() => onChange({ category: 'all' })}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
              filters.category === 'all'
                ? 'bg-[#B96535] text-white font-semibold shadow-xs'
                : 'text-[#51483F] hover:bg-[#E7D5B9]/60'
            }`}
          >
            <span>All Archival Records</span>
            {filters.category === 'all' && <Check className="w-4 h-4" />}
          </button>
          {ARCHIVE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onChange({ category: cat.id })}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                filters.category === cat.id
                  ? 'bg-[#B96535] text-white font-semibold shadow-xs'
                  : 'text-[#51483F] hover:bg-[#E7D5B9]/60'
              }`}
            >
              <span>{cat.title}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                filters.category === cat.id ? 'bg-white/20 text-white' : 'bg-[#E7D5B9] text-[#713F2B]'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Historical Era Filter */}
      <div className="pt-4 border-t border-[#DED3C2]">
        <h4 className="font-serif text-base font-bold text-[#29251F] mb-3">
          Historical Epoch
        </h4>
        <div className="space-y-1.5">
          {ERAS.map((era) => (
            <button
              key={era}
              onClick={() => onChange({ era })}
              className={`w-full text-left px-3 py-1.5 rounded-md text-xs sm:text-sm transition-all ${
                filters.era === era
                  ? 'bg-[#29251F] text-[#FBF8F2] font-semibold'
                  : 'text-[#51483F] hover:bg-[#E7D5B9]/50'
              }`}
            >
              {era === 'all' ? 'All Eras (1891–1956)' : era}
            </button>
          ))}
        </div>
      </div>

      {/* Language Filter */}
      <div className="pt-4 border-t border-[#DED3C2]">
        <h4 className="font-serif text-base font-bold text-[#29251F] mb-3">
          Language
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => onChange({ language: lang })}
              className={`px-3 py-1 rounded-full text-xs transition-colors ${
                filters.language === lang
                  ? 'bg-[#713F2B] text-white font-medium'
                  : 'bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
              }`}
            >
              {lang === 'all' ? 'All Languages' : lang}
            </button>
          ))}
        </div>
      </div>

      {/* Format Filter */}
      <div className="pt-4 border-t border-[#DED3C2]">
        <h4 className="font-serif text-base font-bold text-[#29251F] mb-3">
          Media Format
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {FORMATS.map((fmt) => (
            <button
              key={fmt}
              onClick={() => onChange({ format: fmt })}
              className={`px-3 py-1 rounded-full text-xs capitalize transition-colors ${
                filters.format === fmt
                  ? 'bg-[#B96535] text-white font-medium'
                  : 'bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
              }`}
            >
              {fmt === 'all' ? 'All Formats' : fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Reset Action */}
      <div className="pt-6 border-t border-[#DED3C2]">
        <button
          onClick={onReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-[#DED3C2] hover:border-[#B96535] text-xs font-semibold text-[#51483F] hover:text-[#B96535] transition-colors bg-[#FBF8F2]"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop / Sidebar version */}
      <div className="hidden lg:block w-72 shrink-0 bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-5 sticky top-28 self-start shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#DED3C2]">
          <span className="flex items-center gap-2 font-serif text-lg font-bold text-[#29251F]">
            <SlidersHorizontal className="w-4 h-4 text-[#B96535]" />
            Filters & Facets
          </span>
        </div>
        {content}
      </div>

      {/* Mobile Drawer Backdrop and Slider */}
      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative ml-auto w-full max-w-sm bg-[#FBF8F2] h-full shadow-2xl p-6 overflow-y-auto z-10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#DED3C2] mb-6">
                <span className="font-serif text-xl font-bold text-[#29251F] flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-[#B96535]" />
                  Filter Catalog
                </span>
                <button
                  onClick={onCloseMobile}
                  className="p-1.5 rounded-md text-[#827567] hover:text-[#29251F] hover:bg-[#E7D5B9]"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {content}
            </div>
            <div className="pt-6 mt-6 border-t border-[#DED3C2]">
              <button
                onClick={onCloseMobile}
                className="w-full py-3 bg-[#B96535] text-white font-medium rounded-lg text-sm shadow-md"
              >
                Apply & View Results
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
