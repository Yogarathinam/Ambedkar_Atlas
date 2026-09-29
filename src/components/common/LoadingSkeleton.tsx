import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number; type?: 'card' | 'line' | 'detail' }> = ({
  count = 3,
  type = 'card',
}) => {
  return (
    <div className="w-full space-y-4">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-[#FBF8F2] border border-[#DED3C2] rounded-lg p-5 animate-pulse space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-[#E7D5B9] rounded w-1/4"></div>
            <div className="h-4 bg-[#E7D5B9] rounded w-16"></div>
          </div>
          <div className="h-6 bg-[#E7D5B9] rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-3 bg-[#E7D5B9]/60 rounded w-full"></div>
            <div className="h-3 bg-[#E7D5B9]/60 rounded w-5/6"></div>
          </div>
          <div className="flex gap-2 pt-2">
            <div className="h-5 bg-[#E7D5B9]/40 rounded-full w-20"></div>
            <div className="h-5 bg-[#E7D5B9]/40 rounded-full w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
};
