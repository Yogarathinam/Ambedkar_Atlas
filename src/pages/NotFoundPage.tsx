import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-6">
      <div className="w-16 h-16 rounded-full bg-[#E7D5B9] text-[#713F2B] mx-auto flex items-center justify-center">
        <Compass className="w-8 h-8" />
      </div>
      <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#29251F]">
        Page Not Found
      </h1>
      <p className="text-base text-[#51483F] leading-relaxed max-w-md mx-auto">
        The archival document or exhibition path you requested could not be located in the catalog index.
      </p>
      <div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-[#B96535] hover:bg-[#713F2B] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};
