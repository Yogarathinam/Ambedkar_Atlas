import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, Compass, ExternalLink, Heart } from 'lucide-react';
import ambedkarLogo from '../../assets/hero/image.png';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#29251F] text-[#E7D5B9] border-t-4 border-[#B96535] mt-24">
      {/* Upper Colophon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <img src="/seal.svg" alt="Seal" className="w-full h-full invert brightness-90 opacity-80" />
                <img
                  src={ambedkarLogo}
                  alt="Dr. B. R. Ambedkar"
                  className="absolute inset-0 w-full h-full object-contain pointer-events-none scale-105"
                />
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-tight text-[#FBF8F2] block">
                  AMBEDKAR ATLAS
                </span>
                <span className="text-[11px] font-medium tracking-widest text-[#B96535] uppercase">
                  Digital Heritage Archive
                </span>
              </div>
            </div>

            <p className="text-sm text-[#C5B8A5] leading-relaxed max-w-md">
              A curated digital heritage repository dedicated to preserving and illuminating the speeches, writings, manuscripts, and constitutional jurisprudence of Dr. Bhimrao Ramji Ambedkar (1891–1956).
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C1814] border border-[#3E3830] text-xs font-serif italic text-[#E7D5B9]">
                <span>« Educate • Agitate • Organize »</span>
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FBF8F2] uppercase tracking-wider mb-4 border-b border-[#3E3830] pb-1">
              Archive Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C5B8A5]">
              <li>
                <Link to="/archive" className="hover:text-[#FBF8F2] transition-colors">Browse Collections</Link>
              </li>
              <li>
                <Link to="/timeline" className="hover:text-[#FBF8F2] transition-colors">Historical Chronology (1891–1956)</Link>
              </li>
              <li>
                <Link to="/research" className="hover:text-[#FBF8F2] transition-colors">AI Research Assistant (RAG)</Link>
              </li>
              <li>
                <Link to="/kiosk" className="hover:text-[#FBF8F2] transition-colors">Touch Kiosk Exhibition Mode</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-[#FBF8F2] transition-colors">Catalog Search Index</Link>
              </li>
            </ul>
          </div>

          {/* Archival Principles */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FBF8F2] uppercase tracking-wider mb-4 border-b border-[#3E3830] pb-1">
              Curatorial Standards
            </h4>
            <ul className="space-y-2.5 text-sm text-[#C5B8A5]">
              <li>
                <Link to="/about#sources" className="hover:text-[#FBF8F2] transition-colors">Primary Sources & Provenance</Link>
              </li>
              <li>
                <Link to="/about#preservation" className="hover:text-[#FBF8F2] transition-colors">Digitisation Methodology</Link>
              </li>
              <li>
                <Link to="/about#citation" className="hover:text-[#FBF8F2] transition-colors">Citation & Open Access</Link>
              </li>
              <li>
                <Link to="/about#accessibility" className="hover:text-[#FBF8F2] transition-colors">Universal Accessibility</Link>
              </li>
            </ul>
          </div>

          {/* Archival Citation Statement */}
          <div>
            <h4 className="font-serif text-base font-semibold text-[#FBF8F2] uppercase tracking-wider mb-4 border-b border-[#3E3830] pb-1">
              Scholarly Access
            </h4>
            <div className="bg-[#1C1915] p-3.5 rounded-xl border border-[#3E3830] text-xs text-[#C5B8A5] space-y-2.5">
              <p className="leading-relaxed">
                Open historical archive preserving primary documents, verified debate records, and authoritative translations for public scholarship.
              </p>
              <div className="flex items-center gap-1.5 text-[#E7D5B9]">
                <ShieldCheck className="w-4 h-4 text-[#B96535] shrink-0" />
                <span>BAWS & CAD Reference Edition</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#3E3830] bg-[#1C1814] py-6 px-4 sm:px-6 lg:px-8 text-xs text-[#8E8273]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            Ambedkar Atlas • Commemorating the Architect of the Constitution of India • 1891–1956
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-[#E7D5B9]">About</Link>
            <Link to="/archive" className="hover:text-[#E7D5B9]">Archive</Link>
            <Link to="/timeline" className="hover:text-[#E7D5B9]">Timeline</Link>
            <Link to="/kiosk" className="hover:text-[#E7D5B9]">Kiosk Mode</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
