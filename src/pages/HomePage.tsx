import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CinematicHero } from '../components/hero/CinematicHero';
import { CollectionsGrid } from '../components/home/CollectionsGrid';
import { ArchiveCard } from '../components/archive/ArchiveCard';
import { TIMELINE_EVENTS } from '../data/timelineEvents';
import { SUGGESTED_PROMPTS } from '../data/researchQA';
import { archiveService } from '../services/archiveService';
import { ArchiveRecord } from '../types';
import { 
  BookOpen, Clock, Bot, 
  ArrowRight, ShieldCheck, Sparkles, CheckCircle2 
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [featuredRecords, setFeaturedRecords] = useState<ArchiveRecord[]>([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);

  useEffect(() => {
    archiveService.getFeaturedRecords().then((items) => {
      setFeaturedRecords(items);
      setLoadingFeatured(false);
    });
  }, []);

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. Cinematic Hero Section (Transparent Portrait + Crowd SVG Parallax) */}
      <CinematicHero />

      {/* 2. Archival Collections (Modern Animated Cards) */}
      <CollectionsGrid />

      {/* 3. Journey Through Time (Compact Timeline Preview) */}
      <section className="bg-[#E7D5B9]/35 border-y border-[#DED3C2] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block mb-1">
                Historical Chronology
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F]">
                Journey Through Time (1891–1956)
              </h2>
              <p className="text-sm sm:text-base text-[#51483F] mt-1 max-w-xl">
                Trace landmark moments from Columbia University and the Mahad Satyagraha to the drafting of India’s Constitution and Deekshabhoomi.
              </p>
            </div>

            <Link
              to="/timeline"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#29251F] hover:bg-[#3E3830] text-[#FBF8F2] text-sm font-semibold rounded-xl transition-all shadow-xs self-start md:self-auto shrink-0"
            >
              <Clock className="w-4 h-4 text-[#B96535]" />
              <span>Full Interactive Timeline</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Compact Timeline Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TIMELINE_EVENTS.slice(3, 7).map((evt) => (
              <div
                key={evt.id}
                onClick={() => navigate('/timeline')}
                className="bg-[#FBF8F2] border border-[#DED3C2] hover:border-[#B96535] rounded-xl p-5 cursor-pointer transition-all hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#B96535] text-white inline-block mb-3">
                    {evt.year}
                  </span>
                  <h4 className="font-serif text-lg font-bold text-[#29251F] leading-snug mb-1">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-[#713F2B] font-medium mb-2">{evt.subtitle}</p>
                  <p className="text-xs text-[#51483F] line-clamp-3 leading-relaxed">
                    {evt.summary}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#DED3C2] text-[11px] text-[#827567] flex items-center justify-between">
                  <span>{evt.location}</span>
                  <span className="text-[#B96535] font-semibold">Inspect</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. From the Archives (Curated Featured Records) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block mb-1">
              Curated Highlights
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F]">
              From the Master Archives
            </h2>
            <p className="text-base text-[#51483F] mt-1 max-w-xl">
              Essential writings, speeches, and authenticated media with full facsimiles, transcriptions, and audio readings.
            </p>
          </div>

          <Link
            to="/archive"
            className="text-sm font-semibold text-[#B96535] hover:text-[#713F2B] flex items-center gap-1.5 self-start md:self-auto transition-colors"
          >
            <span>View All Catalog Records</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loadingFeatured ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-64 bg-[#FBF8F2] border border-[#DED3C2] rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRecords.slice(0, 3).map((record) => (
              <ArchiveCard key={record.id} record={record} viewMode="grid" />
            ))}
          </div>
        )}
      </section>

      {/* 5. Ask and Discover (Research Assistant Teaser) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#FBF8F2] border-2 border-double border-[#DED3C2] rounded-3xl p-8 sm:p-12 shadow-sm relative overflow-hidden">
          <div className="max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E7D5B9] text-[#713F2B] text-xs font-semibold tracking-wider uppercase">
              <Bot className="w-3.5 h-3.5 text-[#B96535]" />
              <span>Research Assistant</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F] leading-tight">
              Ask & Discover: Archival Inquiries
            </h2>

            <p className="text-base sm:text-lg text-[#51483F] leading-relaxed">
              Explore questions on caste annihilation, the drafting of Fundamental Rights, and monetary economics. Every answer provides inline markers linking directly to primary source records.
            </p>

            {/* Quick Prompt Pills */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#827567] uppercase tracking-wider block mb-3">
                Try asking a research inquiry:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {SUGGESTED_PROMPTS.slice(0, 3).map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => navigate(`/research?q=${encodeURIComponent(prompt)}`)}
                    className="px-4 py-2 bg-[#F5EBDD] hover:bg-[#E7D5B9] border border-[#DED3C2] hover:border-[#B96535] rounded-xl text-xs font-medium text-[#29251F] transition-all flex items-center gap-2 shadow-2xs text-left"
                  >
                    <span>{prompt}</span>
                    <Sparkles className="w-3.5 h-3.5 text-[#B96535] shrink-0" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => navigate('/research')}
                className="px-6 py-3 bg-[#B96535] hover:bg-[#713F2B] text-white text-sm font-semibold rounded-xl transition-all shadow-xs flex items-center gap-2"
              >
                <Bot className="w-4 h-4" />
                <span>Launch Research Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Preservation & Provenance Principles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#29251F] text-[#F5EBDD] rounded-3xl p-8 sm:p-12 border border-[#3E3830]">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#B96535]">
                <ShieldCheck className="w-4 h-4" />
                <span>Digital Preservation Principles</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#FBF8F2] leading-tight">
                Authenticity, Open Access & Intellectual Rigor
              </h2>
              <p className="text-sm sm:text-base text-[#C5B8A5] leading-relaxed">
                All records presented within the Ambedkar Atlas are cross-referenced against authoritative editions published by the Dr. Babasaheb Ambedkar Writings and Speeches (BAWS) Committee, the National Archives of India, and the Constituent Assembly Debates.
              </p>
            </div>

            <div className="bg-[#1C1814] p-6 rounded-2xl border border-[#3E3830] space-y-3 text-xs text-[#C5B8A5]">
              <div className="flex items-center gap-2 text-[#E7D5B9] font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Verified Archival Records</span>
              </div>
              <div className="flex items-center gap-2 text-[#E7D5B9] font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Standardized Academic Citations</span>
              </div>
              <div className="flex items-center gap-2 text-[#E7D5B9] font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Universal Multi-Device Layouts</span>
              </div>
              <div className="pt-2 border-t border-[#3E3830]">
                <Link to="/about" className="text-[#B96535] hover:underline font-semibold block">
                  Read preservation charter →
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
