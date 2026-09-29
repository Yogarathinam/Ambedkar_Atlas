import React from 'react';
import { SearchX, RotateCcw } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  message?: string;
  onReset?: () => void;
  resetLabel?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No Archival Records Found',
  message = 'Try modifying your search keywords or resetting your category and era filters.',
  onReset,
  resetLabel = 'Reset Filters',
}) => {
  return (
    <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-10 text-center max-w-lg mx-auto my-8">
      <div className="w-14 h-14 mx-auto rounded-full bg-[#E7D5B9]/60 flex items-center justify-center text-[#713F2B] mb-4">
        <SearchX className="w-7 h-7" />
      </div>
      <h3 className="font-serif text-xl font-bold text-[#29251F] mb-2">{title}</h3>
      <p className="text-sm text-[#827567] mb-6 leading-relaxed">{message}</p>
      {onReset && (
        <button
          onClick={onReset}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#B96535] text-[#FBF8F2] hover:bg-[#713F2B] text-sm font-medium rounded-md transition-colors shadow-xs"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{resetLabel}</span>
        </button>
      )}
    </div>
  );
};
