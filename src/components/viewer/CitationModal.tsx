import React, { useState } from 'react';
import { CitationFormat } from '../../types';
import { X, Copy, Check, BookOpen } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface CitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  citations: CitationFormat;
  title: string;
}

export const CitationModal: React.FC<CitationModalProps> = ({
  isOpen,
  onClose,
  citations,
  title,
}) => {
  const [activeTab, setActiveTab] = useState<keyof CitationFormat>('apa');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(citations[activeTab]);
    setCopied(true);
    showToast(`${activeTab.toUpperCase()} Citation copied to clipboard`, 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs: { key: keyof CitationFormat; label: string }[] = [
    { key: 'apa', label: 'APA (7th ed.)' },
    { key: 'chicago', label: 'Chicago (17th ed.)' },
    { key: 'mla', label: 'MLA (9th ed.)' },
    { key: 'bibtex', label: 'BibTeX' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Modal Dialog */}
      <div className="relative bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#DED3C2]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#E7D5B9] text-[#713F2B] flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#29251F]">Cite Archival Record</h3>
              <p className="text-xs text-[#827567] truncate max-w-sm">{title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[#827567] hover:text-[#29251F] hover:bg-[#E7D5B9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-[#DED3C2] gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-3 py-2 text-xs font-semibold rounded-t-lg transition-colors ${
                activeTab === tab.key
                  ? 'bg-[#E7D5B9] text-[#29251F] border-b-2 border-[#B96535]'
                  : 'text-[#827567] hover:text-[#29251F]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Citation Box */}
        <div className="relative bg-[#F5EBDD] border border-[#DED3C2] rounded-xl p-4 font-mono text-xs text-[#29251F] leading-relaxed break-words whitespace-pre-wrap select-all">
          {citations[activeTab]}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-[#827567]">Standard academic and archival format</span>
          <button
            onClick={handleCopy}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#B96535] hover:bg-[#713F2B] text-white text-xs sm:text-sm font-semibold transition-colors shadow-xs"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied!' : 'Copy to Clipboard'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
