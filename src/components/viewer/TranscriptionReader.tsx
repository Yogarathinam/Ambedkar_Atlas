import React, { useState } from 'react';
import { Copy, Check, BookOpen, Globe, RotateCcw, Search, ChevronDown } from 'lucide-react';
import { EIGHTH_SCHEDULE_LANGUAGES, IndianLanguage } from '../../data/indianLanguages';
import { translationService } from '../../services/translationService';
import { useToast } from '../../context/ToastContext';

interface TranscriptionReaderProps {
  recordId: string;
  transcription?: string;
  sourceCollection: string;
}

export const TranscriptionReader: React.FC<TranscriptionReaderProps> = ({
  recordId,
  transcription = '',
  sourceCollection,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);
  
  // Translation state
  const [selectedLangCode, setSelectedLangCode] = useState<string>('mr'); // default to Marathi
  const [currentText, setCurrentText] = useState<string>(transcription);
  const [activeLanguage, setActiveLanguage] = useState<IndianLanguage>(EIGHTH_SCHEDULE_LANGUAGES[0]); // English original
  const [isTranslating, setIsTranslating] = useState(false);
  const [isTranslated, setIsTranslated] = useState(false);
  
  // Language dropdown search state
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  
  const { showToast } = useToast();

  const handleCopyTranscription = () => {
    if (!currentText) return;
    navigator.clipboard.writeText(currentText);
    setCopied(true);
    showToast('Displayed transcription copied to clipboard', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTranslate = async () => {
    if (!transcription) return;
    setIsTranslating(true);
    setLangDropdownOpen(false);

    try {
      const result = await translationService.translateTranscription(recordId, transcription, selectedLangCode);
      setCurrentText(result.translatedText);
      setActiveLanguage(result.language);
      setIsTranslated(selectedLangCode !== 'en');
      showToast(`Document translated to ${result.language.name} (${result.language.nativeName})`, 'success');
    } catch {
      showToast('Translation error. Reverting to original text.', 'warning');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleResetOriginal = () => {
    setCurrentText(transcription);
    setActiveLanguage(EIGHTH_SCHEDULE_LANGUAGES[0]);
    setIsTranslated(false);
    showToast('Restored original English transcription', 'info');
  };

  const filteredLanguages = EIGHTH_SCHEDULE_LANGUAGES.filter((lang) => {
    const q = langSearch.toLowerCase();
    return lang.name.toLowerCase().includes(q) || lang.nativeName.toLowerCase().includes(q);
  });

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
        <p className="text-xs mt-1">Please refer to the Original Facsimile tab for primary inspection.</p>
      </div>
    );
  }

  const selectedLangObj = EIGHTH_SCHEDULE_LANGUAGES.find((l) => l.code === selectedLangCode) || EIGHTH_SCHEDULE_LANGUAGES[0];

  return (
    <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-6 sm:p-10 shadow-xs space-y-6">
      
      {/* Top Multilingual Translation & Controls Toolbar */}
      <div className="pb-5 border-b border-[#DED3C2] space-y-4">
        
        <div className="flex flex-wrap items-center justify-between gap-3">
          
          {/* Source Attribution */}
          <div className="text-xs text-[#827567]">
            <span className="font-semibold text-[#713F2B] uppercase tracking-wider mr-1">Source Edition:</span>
            <span>{sourceCollection}</span>
          </div>

          {/* Font Size Adjusters & Copy Action */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-[#F5EBDD] p-1 rounded-lg border border-[#DED3C2] text-xs">
              <button
                onClick={() => setFontSize('normal')}
                className={`px-2 py-0.5 rounded ${fontSize === 'normal' ? 'bg-[#B96535] text-white font-bold' : 'text-[#51483F]'}`}
                title="Normal text size"
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

            <button
              onClick={handleCopyTranscription}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#29251F] text-xs font-semibold rounded-lg border border-[#DED3C2] transition-colors"
              title="Copy displayed text to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>

        </div>

        {/* Translation Bar: 22 Languages Selector + Translate Button */}
        <div className="bg-[#F5EBDD]/70 p-3.5 rounded-xl border border-[#DED3C2] flex flex-wrap items-center justify-between gap-3">
          
          <div className="flex flex-wrap items-center gap-2 relative">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#713F2B]">
              <Globe className="w-4 h-4 text-[#B96535]" />
              <span>Translate Document (22 Scheduled Languages):</span>
            </div>

            {/* Custom Searchable Language Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center justify-between gap-2 px-3 py-1.5 bg-[#FFF] border border-[#DED3C2] hover:border-[#B96535] rounded-lg text-xs font-medium text-[#29251F] min-w-[200px] shadow-2xs"
              >
                <span>{selectedLangObj.name} ({selectedLangObj.nativeName})</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#827567]" />
              </button>

              {/* Dropdown Menu with Search */}
              {langDropdownOpen && (
                <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#FFF] border border-[#DED3C2] rounded-xl shadow-xl z-50 p-2 space-y-1 max-h-72 overflow-y-auto">
                  <div className="relative mb-2">
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Search language..."
                      className="w-full pl-7 pr-2 py-1 text-xs border border-[#DED3C2] rounded-md focus:outline-none focus:ring-1 focus:ring-[#B96535]"
                    />
                    <Search className="w-3.5 h-3.5 text-[#827567] absolute left-2 top-2 pointer-events-none" />
                  </div>

                  {filteredLanguages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLangCode(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-md text-xs flex items-center justify-between transition-colors ${
                        selectedLangCode === lang.code
                          ? 'bg-[#B96535] text-white font-semibold'
                          : 'text-[#29251F] hover:bg-[#F5EBDD]'
                      }`}
                    >
                      <span>{lang.name}</span>
                      <span className={`text-[11px] ${selectedLangCode === lang.code ? 'text-white/80' : 'text-[#827567]'}`}>
                        {lang.nativeName}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Translate Button */}
            <button
              onClick={handleTranslate}
              disabled={isTranslating}
              className="px-4 py-1.5 bg-[#B96535] hover:bg-[#713F2B] disabled:opacity-60 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              {isTranslating ? 'Translating...' : 'Translate'}
            </button>
          </div>

          {/* Reset to Original Button */}
          {isTranslated && (
            <button
              onClick={handleResetOriginal}
              className="flex items-center gap-1.5 text-xs text-[#713F2B] hover:text-[#B96535] font-semibold underline transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Show Original (English)</span>
            </button>
          )}

        </div>

        {/* Translation Banner Indicator */}
        {isTranslated && (
          <div className="bg-[#E7D5B9]/60 px-4 py-2 rounded-lg border border-[#DED3C2] text-xs text-[#29251F] flex items-center justify-between">
            <span className="font-serif">
              Reading translation in <strong>{activeLanguage.name} ({activeLanguage.nativeName})</strong>. Complete document structure preserved.
            </span>
            <span className="text-[#827567] text-[11px]">Authorized Archival Translation</span>
          </div>
        )}

      </div>

      {/* Reader Prose (Full Document) */}
      <div className={`prose-archival max-w-prose mx-auto text-[#29251F] space-y-6 ${getFontSizeClass()}`}>
        {currentText.split('\n\n').map((paragraph, index) => (
          <p key={index} className="leading-relaxed font-serif text-justify">
            {paragraph}
          </p>
        ))}
      </div>

      {/* Reader Footer Colophon */}
      <div className="pt-6 border-t border-[#DED3C2] text-center text-xs text-[#827567] italic font-serif">
        Digitized and verified in accordance with Dr. Babasaheb Ambedkar Writings and Speeches (BAWS).
      </div>
    </div>
  );
};
