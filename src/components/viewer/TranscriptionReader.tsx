import React, { useState } from 'react';
import { Copy, Check, Type, BookOpen } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface TranscriptionReaderProps {
  transcription?: string;
  sourceCollection: string;
}

export const TranscriptionReader: React.FC<TranscriptionReaderProps> = ({
  transcription,
  sourceCollection,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);
  const { showToast } = useToast();

  const handleCopyTranscription = () => {
    if (!transcription) return;
    navigator.clipboard.writeText(transcription);
    setCopied(true);
    showToast('Transcription copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'large': return 'text-lg sm:text-xl leading-relaxed';
      case 'xlarge': return 'text-xl sm:text-2xl leading-loose';
      default: return 'text-base sm:text-lg leading-relaxed';
    }
  };

  if (!transcription) {
    return (
      <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-8 text-center text-[#827567]">
        <BookOpen className="w-8 h-8 mx-auto mb-2 text-[#C5B8A5]" />
        <p className="font-serif text-lg">Full text transcription is in process of archival OCR certification.</p>
        <p className="text-xs mt-1">Please refer to the Original Facsimile scan tab for primary inspection.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-6 sm:p-10 shadow-xs space-y-6">
      
      {/* Top Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#DED3C2]">
        <div className="flex items-center gap-2 text-xs text-[#827567]">
          <span className="font-semibold text-[#713F2B] uppercase tracking-wider">Historical Text:</span>
          <span>Verified against {sourceCollection}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size Adjusters */}
          <div className="flex items-center bg-[#F5EBDD] p-1 rounded-lg border border-[#DED3C2] text-xs">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-[#B96535] text-white font-bold' : 'text-[#51483F]'}`}
              title="Standard text size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-0.5 rounded ${fontSize === 'large' ? 'bg-[#B96535] text-white font-bold' : 'text-[#51483F]'}`}
              title="Large text size"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-0.5 rounded ${fontSize === 'xlarge' ? 'bg-[#B96535] text-white font-bold' : 'text-[#51483F]'}`}
              title="Extra large text size"
            >
              A++
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopyTranscription}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#29251F] text-xs font-medium rounded-lg border border-[#DED3C2] transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Text'}</span>
          </button>
        </div>
      </div>

      {/* Reader Prose */}
      <div className={`prose-archival max-w-prose mx-auto text-[#29251F] space-y-6 ${getFontSizeClass()}`}>
        {transcription.split('\n\n').map((paragraph, index) => (
          <p key={index} className="leading-relaxed font-serif">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Reader Footer Colophon */}
      <div className="pt-6 border-t border-[#DED3C2] text-center text-xs text-[#827567] italic font-serif">
        Digitized and verified in accordance with the National Archives of India standards.
      </div>
    </div>
  );
};
