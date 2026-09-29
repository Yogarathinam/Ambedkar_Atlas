import React from 'react';
import { X, RotateCcw } from 'lucide-react';
import { FilterState } from '../../types';

interface FilterChipsProps {
  filters: FilterState;
  onClearFilter?: (key: keyof FilterState) => void;
  onRemoveFilter?: (key: keyof FilterState) => void;
  onResetAll: () => void;
  totalCount?: number;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onClearFilter,
  onRemoveFilter,
  onResetAll,
  totalCount = 0,
}) => {
  const handleRemove = (key: keyof FilterState) => {
    if (onRemoveFilter) onRemoveFilter(key);
    else if (onClearFilter) onClearFilter(key);
  };

  const hasActiveFilters = 
    Boolean(filters.searchQuery) ||
    filters.category !== 'all' ||
    filters.era !== 'all' ||
    filters.language !== 'all' ||
    filters.format !== 'all';

  if (!hasActiveFilters) {
    return (
      <div className="flex items-center justify-between text-xs text-[#827567] py-2">
        <span>Showing all {totalCount} archival items</span>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 py-3 border-b border-[#DED3C2]">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-semibold uppercase text-[#713F2B] tracking-wider mr-1">
          Active Filters ({totalCount} results):
        </span>

        {filters.searchQuery && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#B96535]/15 text-[#B96535] border border-[#B96535]/30">
            Query: "{filters.searchQuery}"
            <button
              onClick={() => handleRemove('searchQuery')}
              className="hover:text-black"
              aria-label="Remove search filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.category !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#E7D5B9] text-[#29251F] border border-[#DED3C2]">
            Category: <strong className="capitalize">{filters.category}</strong>
            <button
              onClick={() => handleRemove('category')}
              className="hover:text-red-700"
              aria-label="Remove category filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.era !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#E7D5B9] text-[#29251F] border border-[#DED3C2]">
            Era: <strong>{filters.era.split(':')[0]}</strong>
            <button
              onClick={() => handleRemove('era')}
              className="hover:text-red-700"
              aria-label="Remove era filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.language !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#E7D5B9] text-[#29251F] border border-[#DED3C2]">
            Language: <strong>{filters.language}</strong>
            <button
              onClick={() => handleRemove('language')}
              className="hover:text-red-700"
              aria-label="Remove language filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}

        {filters.format !== 'all' && (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs bg-[#E7D5B9] text-[#29251F] border border-[#DED3C2]">
            Format: <strong className="capitalize">{filters.format}</strong>
            <button
              onClick={() => handleRemove('format')}
              className="hover:text-red-700"
              aria-label="Remove format filter"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>

      <button
        onClick={onResetAll}
        className="inline-flex items-center gap-1 text-xs text-[#B96535] hover:text-[#713F2B] font-medium transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>Clear All Filters</span>
      </button>
    </div>
  );
};
