import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { ChatConsole } from '../components/research/ChatConsole';
import { Bot, ShieldCheck, Database, BookOpen, AlertTriangle } from 'lucide-react';

export const ResearchPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Banner */}
      <div className="border-b border-[#DED3C2] pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block mb-1">
          Archival Intelligence Simulation
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F]">
          AI Research Assistant
        </h1>
        <p className="text-sm sm:text-base text-[#51483F] mt-2 max-w-2xl leading-relaxed">
          Inquire into Dr. Ambedkar's philosophical treatises, parliamentary interventions, and sociological works. All answers simulate a citation-backed Retrieval-Augmented Generation (RAG) pipeline linked to catalog records.
        </p>
      </div>

      {/* Prototype Notice Alert */}
      <div className="bg-[#E7D5B9]/40 border-l-4 border-[#B96535] p-4 rounded-r-xl flex items-start gap-3 text-xs sm:text-sm text-[#29251F]">
        <ShieldCheck className="w-5 h-5 text-[#B96535] shrink-0 mt-0.5" />
        <div>
          <strong className="font-semibold text-[#713F2B]">Curatorial Simulation Disclosure:</strong>
          <span className="ml-1 text-[#51483F]">
            This frontend prototype runs locally in your browser using deterministic knowledge graphs and simulated asynchronous delays. It connects with catalog record IDs for verified quotation inspection without external server tracking.
          </span>
        </div>
      </div>

      {/* Main Chat Console */}
      <ChatConsole />

      {/* Technical Methodology Breakdown */}
      <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="font-serif text-xl font-bold text-[#29251F] flex items-center gap-2">
          <Database className="w-5 h-5 text-[#B96535]" />
          <span>Curated Archival Grounding Pipeline</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2 text-xs sm:text-sm text-[#51483F]">
          <div className="p-4 bg-[#F5EBDD] rounded-xl border border-[#DED3C2] space-y-2">
            <span className="font-semibold text-[#713F2B] block">1. Primary Source Corpus</span>
            <p className="leading-relaxed">
              Indices built across Dr. Babasaheb Ambedkar Writings and Speeches (BAWS Vols 1–17) and Constituent Assembly Debates.
            </p>
          </div>
          <div className="p-4 bg-[#F5EBDD] rounded-xl border border-[#DED3C2] space-y-2">
            <span className="font-semibold text-[#713F2B] block">2. Strict Inline Markers</span>
            <p className="leading-relaxed">
              Every factual assertion requires an bracketed marker (e.g. [1]) mapping to a unique accession number.
            </p>
          </div>
          <div className="p-4 bg-[#F5EBDD] rounded-xl border border-[#DED3C2] space-y-2">
            <span className="font-semibold text-[#713F2B] block">3. One-Click Verification</span>
            <p className="leading-relaxed">
              Clicking any citation marker instantly opens the document viewer to inspect the original facsimile scan and transcript.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
