import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, Compass, Award, Eye, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Editorial Header */}
      <div className="border-b border-[#DED3C2] pb-8 text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block">
          Archival Mission & Principles
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F] leading-tight">
          Preserving the Intellectual Heritage of Dr. B. R. Ambedkar
        </h1>
        <p className="text-base sm:text-lg text-[#51483F] leading-relaxed">
          The Ambedkar Atlas is an interactive digital heritage archive designed to provide scholars, students, and citizens with open, verified access to the monumental literary, legal, and constitutional legacy of Babasaheb Dr. B. R. Ambedkar.
        </p>
      </div>

      {/* Mission & Purpose */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#713F2B]">
            Foundational Vision
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
            A Living Digital Monument to Equality & Reason
          </h2>
          <p className="text-sm sm:text-base text-[#51483F] leading-relaxed">
            Few thinkers in modern world history matched the intellectual breadth of Dr. Ambedkar. As an economist, sociologist, jurist, statesman, and emancipator, his contributions laid the cornerstone of India’s constitutional democracy.
          </p>
          <p className="text-sm sm:text-base text-[#51483F] leading-relaxed">
            The mission of this archive is to transcend passive commemoration by creating an active, immersive learning environment where primary facsimiles, transcriptions, and contextual scholarship coexist seamlessly.
          </p>
        </div>

        <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-3xl p-8 shadow-xs space-y-4 paper-grain">
          <img src="/seal.svg" alt="Seal" className="w-16 h-16 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-center text-[#29251F]">
            Archival Pillar
          </h3>
          <blockquote className="font-serif italic text-center text-sm text-[#713F2B] leading-relaxed">
            "They cannot make history who forget history. Cultivation of mind should be the ultimate aim of human existence."
          </blockquote>
          <div className="text-center text-xs text-[#827567]">
            — Dr. B. R. Ambedkar
          </div>
        </div>
      </section>

      {/* Curatorial Principles Grid */}
      <section className="space-y-8" id="preservation">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#29251F]">
            Curatorial & Digitisation Principles
          </h2>
          <p className="text-sm text-[#51483F] mt-1">
            Core standards guiding our primary document selection and presentation.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] flex items-center justify-center text-[#713F2B]">
              <ShieldCheck className="w-5 h-5 text-[#B96535]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#29251F]">Primary Source Fidelity</h3>
            <p className="text-xs sm:text-sm text-[#51483F] leading-relaxed">
              Texts are transcribed and verified against the definitive 17 volumes of Dr. Babasaheb Ambedkar Writings and Speeches (BAWS) and Constituent Assembly Debates.
            </p>
          </div>

          <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] flex items-center justify-center text-[#713F2B]">
              <BookOpen className="w-5 h-5 text-[#B96535]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#29251F]">Universal Open Access</h3>
            <p className="text-xs sm:text-sm text-[#51483F] leading-relaxed">
              No paywalls, subscriptions, or intrusive analytics. High-fidelity historical knowledge accessible for education, scholarship, and public interest.
            </p>
          </div>

          <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-6 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] flex items-center justify-center text-[#713F2B]">
              <Eye className="w-5 h-5 text-[#B96535]" />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#29251F]">Inclusive Accessibility</h3>
            <p className="text-xs sm:text-sm text-[#51483F] leading-relaxed">
              Built with high-contrast typography, adjustable reading font sizes, simulated voice narration, keyboard remote navigation, and responsive mobile layouts.
            </p>
          </div>

        </div>
      </section>

      {/* Prototype Status Disclosure */}
      <section className="bg-[#F5EBDD] border-2 border-double border-[#DED3C2] rounded-3xl p-8 space-y-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-[#713F2B] block">
          Prototype Specification Notice
        </span>
        <h3 className="font-serif text-2xl font-bold text-[#29251F]">
          Frontend Prototype Demonstration
        </h3>
        <p className="text-sm text-[#51483F] leading-relaxed">
          Ambedkar Atlas is presented as a client-side frontend prototype built with React, TypeScript, and Tailwind CSS. All mock data, citations, audio narrations, and RAG assistant inquiries execute securely in the browser with simulated asynchronous latency. No real backend database or third-party tracking APIs are utilized.
        </p>
        <div className="pt-2">
          <Link
            to="/archive"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#B96535] hover:bg-[#713F2B] text-white text-sm font-semibold rounded-xl transition-colors shadow-xs"
          >
            <span>Explore the Archive Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
