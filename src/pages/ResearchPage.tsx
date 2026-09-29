import React from 'react';
import { ChatConsole } from '../components/research/ChatConsole';

export const ResearchPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Concise Header (Takes very little vertical space so input is immediately above the fold) */}
      <div className="border-b border-[#DED3C2] pb-4 space-y-1">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#29251F] tracking-tight">
          AI Research Assistant
        </h1>
        <p className="text-xs sm:text-sm text-[#51483F]">
          Inquire into Dr. Ambedkar's philosophical treatises, parliamentary speeches, and constitutional debates with inline primary source citations.
        </p>
      </div>

      {/* Main Chat Console (Input & example prompts are right at the top) */}
      <ChatConsole />

    </div>
  );
};
