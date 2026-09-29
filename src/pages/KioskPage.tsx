import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useDevice } from '../context/DeviceContext';
import { useToast } from '../context/ToastContext';
import { KioskBackground, KIOSK_SLIDES } from '../components/kiosk/KioskBackground';
import { 
  Search, BookOpen, Volume2, Clock, Bot, VolumeX, LogOut, ChevronLeft, ChevronRight 
} from 'lucide-react';

interface LanguageContent {
  label: string;
  headingLine1: string;
  headingLine2: string;
  description: string;
  searchPlaceholder: string;
  searchBtn: string;
  categories: {
    writingsTitle: string;
    writingsDesc: string;
    speechesTitle: string;
    speechesDesc: string;
    timelineTitle: string;
    timelineDesc: string;
    researchTitle: string;
    researchDesc: string;
  };
}

const LOCALIZED_CONTENT: Record<'English' | 'मराठी' | 'हिन्दी', LanguageContent> = {
  English: {
    label: 'INTERACTIVE EXHIBITION ARCHIVE',
    headingLine1: 'Architect of Equality.',
    headingLine2: 'Voice of the Republic.',
    description: 'Explore the writings, speeches and legacy of Dr. B. R. Ambedkar through an interactive digital archive.',
    searchPlaceholder: 'Search writings, speeches or historical records...',
    searchBtn: 'Search',
    categories: {
      writingsTitle: 'Writings & Books',
      writingsDesc: 'Explore books and collected writings',
      speechesTitle: 'Historic Speeches',
      speechesDesc: 'Speeches and assembly records',
      timelineTitle: 'Historical Timeline',
      timelineDesc: 'Explore milestones from 1891–1956',
      researchTitle: 'AI Research Desk',
      researchDesc: 'Ask questions with archival references',
    },
  },
  मराठी: {
    label: 'परस्परसंवादी प्रदर्शन संग्रह',
    headingLine1: 'समतेचे शिल्पकार.',
    headingLine2: 'प्रजासत्ताकाचा आवाज.',
    description: 'डॉ. बाबासाहेब आंबेडकरांचे मूळ लेखन, ऐतिहासिक भाषणे आणि विचार परंपरेचा परस्परसंवादी संग्रह शोधा.',
    searchPlaceholder: 'भाषणे, ग्रंथ किंवा ऐतिहासिक दस्तऐवज शोधा...',
    searchBtn: 'शोधा',
    categories: {
      writingsTitle: 'ग्रंथ व लेखन',
      writingsDesc: 'संग्रहित पुस्तके आणि निबंध',
      speechesTitle: 'ऐतिहासिक भाषणे',
      speechesDesc: 'महाड आणि संविधान सभेची भाषणे',
      timelineTitle: 'ऐतिहासिक कालपट',
      timelineDesc: '१८९१–१९५६ महत्त्वाचे टप्पे',
      researchTitle: 'संशोधन कक्ष',
      researchDesc: 'दस्तऐवज संदर्भ व प्रश्नोत्तरे',
    },
  },
  हिन्दी: {
    label: 'इंटरैक्टिव प्रदर्शनी अभिलेखागार',
    headingLine1: 'समानता के शिल्पी.',
    headingLine2: 'गणराज्य की आवाज़.',
    description: 'डॉ. बी. आर. अम्बेडकर के मूल लेखन, ऐतिहासिक भाषणों और बौद्धिक विरासत का इंटरैक्टिव संग्रह देखें।',
    searchPlaceholder: 'भाषण, ग्रंथ या ऐतिहासिक अभिलेख खोजें...',
    searchBtn: 'खोजें',
    categories: {
      writingsTitle: 'ग्रंथ व लेखन',
      writingsDesc: 'संग्रहीत पुस्तकें और निबंध',
      speechesTitle: 'ऐतिहासिक भाषण',
      speechesDesc: 'महाड़ एवं संविधान सभा के भाषण',
      timelineTitle: 'ऐतिहासिक कालक्रम',
      timelineDesc: '१८९१–१९५६ के मुख्य पड़ाव',
      researchTitle: 'अनुसंधान कक्ष',
      researchDesc: 'अभिलेखीय संदर्भों के साथ संवाद',
    },
  },
};

export const KioskPage: React.FC = () => {
  const navigate = useNavigate();
  const prefersReducedMotion = useReducedMotion();
  const { 
    setDeviceMode, 
    narrationVoiceActive, 
    toggleNarrationVoice, 
    resetInactivityTimer,
    inactivityCountdown,
  } = useDevice();
  const { showToast } = useToast();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [kioskSearch, setKioskSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'मराठी' | 'हिन्दी'>('English');

  const activeSlide = KIOSK_SLIDES[currentSlideIndex] || KIOSK_SLIDES[0];
  const isDark = activeSlide.isDarkTheme;
  const content = LOCALIZED_CONTENT[selectedLanguage];

  // Set device mode to kiosk automatically
  useEffect(() => {
    setDeviceMode('kiosk');
  }, [setDeviceMode]);

  // Touch and interaction listener to reset inactivity countdown
  useEffect(() => {
    const handleUserActivity = () => {
      resetInactivityTimer();
    };

    window.addEventListener('pointerdown', handleUserActivity, { passive: true });
    window.addEventListener('touchstart', handleUserActivity, { passive: true });
    window.addEventListener('keydown', handleUserActivity, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
    };
  }, [resetInactivityTimer]);

  // Inactivity timeout: reset to primary exhibition state if timer reaches 1
  useEffect(() => {
    if (inactivityCountdown <= 1) {
      setCurrentSlideIndex(0);
      setKioskSearch('');
      setSelectedLanguage('English');
    }
  }, [inactivityCountdown]);

  // Automatic slideshow transitions every 9 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % KIOSK_SLIDES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const handlePrevSlide = useCallback(() => {
    resetInactivityTimer();
    setCurrentSlideIndex((prev) => (prev - 1 + KIOSK_SLIDES.length) % KIOSK_SLIDES.length);
  }, [resetInactivityTimer]);

  const handleNextSlide = useCallback(() => {
    resetInactivityTimer();
    setCurrentSlideIndex((prev) => (prev + 1) % KIOSK_SLIDES.length);
  }, [resetInactivityTimer]);

  const handleSelectSlide = useCallback((index: number) => {
    resetInactivityTimer();
    setCurrentSlideIndex(index);
  }, [resetInactivityTimer]);

  const handleKioskSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    resetInactivityTimer();
    if (kioskSearch.trim()) {
      navigate(`/archive?q=${encodeURIComponent(kioskSearch.trim())}`);
    }
  };

  const handleLanguageChange = (lang: 'English' | 'मराठी' | 'हिन्दी') => {
    resetInactivityTimer();
    setSelectedLanguage(lang);
    showToast(`Exhibition language: ${lang}`, 'info');
  };

  const handleExitKiosk = () => {
    setDeviceMode('desktop');
    navigate('/');
    showToast('Exited Touchscreen Kiosk Exhibition Mode', 'info');
  };

  return (
    <div 
      className={`min-h-screen lg:h-screen lg:max-h-screen w-screen relative flex flex-col justify-between p-3.5 sm:p-5 lg:p-6 kiosk-mode selection:bg-transparent overflow-x-hidden overflow-y-auto lg:overflow-hidden transition-colors duration-1000 ${
        isDark ? 'text-[#FBF8F2]' : 'text-[#29251F]'
      }`}
    >
      {/* Dynamic Ambient Background Illumination & Bottom Historical Audience Crowd */}
      <KioskBackground currentSlideIndex={currentSlideIndex} />

      {/* ========================================================================= */}
      {/* MOBILE / TABLET COMPACT TOP BAR (< lg displays)                           */}
      {/* ========================================================================= */}
      <header className="lg:hidden relative z-40 w-full flex items-center justify-between px-3 py-2 rounded-xl border-2 mb-3 shadow-md backdrop-blur-md transition-colors bg-[#FBF8F2]/90 dark:bg-[#23201C]/90 border-[#DED3C2] dark:border-[#423B33]">
        <div className="flex items-center gap-2">
          <img src="/seal.svg" alt="Archival Seal" className="w-6 h-6 object-contain" />
          <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#B96535] dark:text-[#C89B3C]">
            Ambedkar Atlas
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Voice guide toggle */}
          <button
            type="button"
            onClick={() => {
              resetInactivityTimer();
              toggleNarrationVoice();
              showToast(narrationVoiceActive ? 'Voice guide muted' : 'Voice guide activated', 'info');
            }}
            className={`px-2 py-1 rounded-lg text-xs flex items-center gap-1 transition-all cursor-pointer ${
              narrationVoiceActive
                ? 'bg-[#B96535] text-white'
                : 'bg-black/5 dark:bg-white/10 text-stone-700 dark:text-stone-300'
            }`}
            aria-label="Toggle voice narration"
          >
            {narrationVoiceActive ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="text-[9px] font-bold">Voice</span>
          </button>

          {/* Language selector */}
          <div className="flex items-center gap-0.5 bg-black/5 dark:bg-white/5 p-0.5 rounded-lg border border-black/5 dark:border-white/10">
            {(['English', 'मराठी', 'हिन्दी'] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => handleLanguageChange(lang)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                  selectedLanguage === lang
                    ? 'bg-[#29251F] dark:bg-[#FBF8F2] text-[#FBF8F2] dark:text-[#29251F]'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {lang === 'English' ? 'EN' : lang === 'मराठी' ? 'म' : 'हि'}
              </button>
            ))}
          </div>

          {/* Exit */}
          <button
            type="button"
            onClick={handleExitKiosk}
            className="px-2 py-1 rounded-lg text-xs bg-[#E7D5B9] hover:bg-[#DED3C2] text-[#713F2B] border border-[#DED3C2] flex items-center gap-1 transition-colors cursor-pointer"
            aria-label="Exit Kiosk"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="text-[9px] font-bold">Exit</span>
          </button>
        </div>
      </header>

      {/* Main Exhibition Hall: Left Workspace (A) + Center/Right Slideshow (B) + Right Rail (Desktop) */}
      <div className="relative z-20 flex-1 flex flex-col lg:flex-row items-center justify-between gap-4 sm:gap-6 lg:gap-6 xl:gap-8 w-full max-w-[1720px] mx-auto min-h-0">
        
        {/* ========================================================================= */}
        {/* AREA A: Left Exhibition Workspace (~45-50% width on large screens)        */}
        {/* ========================================================================= */}
        <main className="w-full lg:w-[50%] xl:w-[48%] flex flex-col justify-center space-y-3 sm:space-y-4 lg:space-y-4.5 xl:space-y-5 my-auto pl-1 sm:pl-2 lg:pl-3 min-h-0 z-20">
          
          {/* Exhibition Plaque Label */}
          <div className="flex items-center gap-2">
            <span 
              className={`inline-flex items-center gap-1.5 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.18em] px-3 py-1 rounded-full border shadow-xs ${
                isDark 
                  ? 'bg-[#C89B3C]/15 border-[#C89B3C]/35 text-[#C89B3C]' 
                  : 'bg-[#B96535]/10 border-[#B96535]/25 text-[#B96535]'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-current" />
              {content.label}
            </span>
          </div>
          
          {/* Main Editorial Heading (Exact 2 lines max, Cormorant Garamond, 2nd line Terracotta) */}
          <div>
            <h1 className={`font-serif text-2xl sm:text-3.5xl lg:text-[2.5rem] xl:text-[3.15rem] font-bold leading-[1.08] tracking-tight ${
              isDark ? 'text-[#FBF8F2]' : 'text-[#29251F]'
            }`}>
              {content.headingLine1}<br />
              <span className={isDark ? 'text-[#C89B3C]' : 'text-[#B96535]'}>
                {content.headingLine2}
              </span>
            </h1>
            
            {/* Description */}
            <p className={`text-xs sm:text-sm mt-1.5 sm:mt-2 max-w-xl lg:max-w-2xl leading-relaxed ${
              isDark ? 'text-[#D5C9B8]' : 'text-[#51483F]'
            }`}>
              {content.description}
            </p>
          </div>

          {/* Prominent Wide Touch Search Bar */}
          <form onSubmit={handleKioskSearchSubmit} className="w-full max-w-xl lg:max-w-2xl pt-0.5">
            <div className={`relative flex items-center rounded-xl sm:rounded-2xl border-2 transition-all shadow-sm ${
              isDark 
                ? 'bg-[#23201C]/95 border-[#51483F] focus-within:border-[#C89B3C]' 
                : 'bg-[#FBF8F2]/95 border-[#DED3C2] focus-within:border-[#B96535]'
            }`}>
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#827567] dark:text-[#A89C8F] absolute left-3.5 sm:left-4 pointer-events-none shrink-0" />
              
              <input
                type="text"
                value={kioskSearch}
                onChange={(e) => setKioskSearch(e.target.value)}
                placeholder={content.searchPlaceholder}
                className="w-full pl-10 sm:pl-12 pr-24 sm:pr-28 py-2.5 sm:py-3.5 text-xs sm:text-sm bg-transparent rounded-xl sm:rounded-2xl text-[#29251F] dark:text-[#FBF8F2] placeholder-[#827567] dark:placeholder-[#A89C8F] focus:outline-none"
              />
              
              <button
                type="submit"
                className="absolute right-1.5 sm:right-2 px-4 sm:px-5 py-1.5 sm:py-2.5 bg-[#B96535] hover:bg-[#713F2B] active:scale-95 text-white font-medium rounded-lg sm:rounded-xl text-xs sm:text-sm shadow-xs transition-all cursor-pointer shrink-0"
              >
                {content.searchBtn}
              </button>
            </div>
          </form>

          {/* Four Primary Exhibition Categories (2x2 Balanced Touch Grid, Equal Heights, No Truncation) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-xl lg:max-w-2xl pt-0.5">
            
            {/* Tile 1: Writings & Books */}
            <div
              onClick={() => {
                resetInactivityTimer();
                navigate('/archive?category=writings');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/archive?category=writings')}
              aria-label={content.categories.writingsTitle}
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 border-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-3 sm:gap-3.5 min-h-[76px] sm:min-h-[84px] h-full ${
                isDark 
                  ? 'bg-[#23201C]/90 hover:bg-[#2A2621] border-[#423B33] hover:border-[#C89B3C]' 
                  : 'bg-[#FBF8F2]/95 hover:bg-white border-[#DED3C2] hover:border-[#B96535]'
              }`}
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                isDark ? 'bg-[#363028] text-[#C89B3C]' : 'bg-[#E7D5B9]/70 text-[#713F2B]'
              }`}>
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-sm sm:text-base font-bold text-[#29251F] dark:text-[#FBF8F2] leading-tight">
                  {content.categories.writingsTitle}
                </h2>
                <p className="text-[11px] sm:text-xs text-[#51483F] dark:text-[#D5C9B8] leading-snug mt-1">
                  {content.categories.writingsDesc}
                </p>
              </div>
            </div>

            {/* Tile 2: Historic Speeches */}
            <div
              onClick={() => {
                resetInactivityTimer();
                navigate('/archive?category=speeches');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/archive?category=speeches')}
              aria-label={content.categories.speechesTitle}
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 border-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-3 sm:gap-3.5 min-h-[76px] sm:min-h-[84px] h-full ${
                isDark 
                  ? 'bg-[#23201C]/90 hover:bg-[#2A2621] border-[#423B33] hover:border-[#C89B3C]' 
                  : 'bg-[#FBF8F2]/95 hover:bg-white border-[#DED3C2] hover:border-[#B96535]'
              }`}
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                isDark ? 'bg-[#363028] text-[#C89B3C]' : 'bg-[#E7D5B9]/70 text-[#713F2B]'
              }`}>
                <Volume2 className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-sm sm:text-base font-bold text-[#29251F] dark:text-[#FBF8F2] leading-tight">
                  {content.categories.speechesTitle}
                </h2>
                <p className="text-[11px] sm:text-xs text-[#51483F] dark:text-[#D5C9B8] leading-snug mt-1">
                  {content.categories.speechesDesc}
                </p>
              </div>
            </div>

            {/* Tile 3: Historical Timeline */}
            <div
              onClick={() => {
                resetInactivityTimer();
                navigate('/timeline');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/timeline')}
              aria-label={content.categories.timelineTitle}
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 border-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-3 sm:gap-3.5 min-h-[76px] sm:min-h-[84px] h-full ${
                isDark 
                  ? 'bg-[#23201C]/90 hover:bg-[#2A2621] border-[#423B33] hover:border-[#C89B3C]' 
                  : 'bg-[#FBF8F2]/95 hover:bg-white border-[#DED3C2] hover:border-[#B96535]'
              }`}
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                isDark ? 'bg-[#363028] text-[#C89B3C]' : 'bg-[#E7D5B9]/70 text-[#713F2B]'
              }`}>
                <Clock className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-sm sm:text-base font-bold text-[#29251F] dark:text-[#FBF8F2] leading-tight">
                  {content.categories.timelineTitle}
                </h2>
                <p className="text-[11px] sm:text-xs text-[#51483F] dark:text-[#D5C9B8] leading-snug mt-1">
                  {content.categories.timelineDesc}
                </p>
              </div>
            </div>

            {/* Tile 4: AI Research Desk */}
            <div
              onClick={() => {
                resetInactivityTimer();
                navigate('/research');
              }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate('/research')}
              aria-label={content.categories.researchTitle}
              className={`rounded-xl sm:rounded-2xl p-3 sm:p-3.5 lg:p-4 border-2 transition-all cursor-pointer shadow-xs active:scale-[0.98] flex items-center gap-3 sm:gap-3.5 min-h-[76px] sm:min-h-[84px] h-full ${
                isDark 
                  ? 'bg-[#23201C]/90 hover:bg-[#2A2621] border-[#423B33] hover:border-[#C89B3C]' 
                  : 'bg-[#FBF8F2]/95 hover:bg-white border-[#DED3C2] hover:border-[#B96535]'
              }`}
            >
              <div className={`w-10 h-10 sm:w-11 sm:h-11 shrink-0 rounded-xl flex items-center justify-center transition-colors ${
                isDark ? 'bg-[#363028] text-[#C89B3C]' : 'bg-[#E7D5B9]/70 text-[#713F2B]'
              }`}>
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="font-serif text-sm sm:text-base font-bold text-[#29251F] dark:text-[#FBF8F2] leading-tight">
                  {content.categories.researchTitle}
                </h2>
                <p className="text-[11px] sm:text-xs text-[#51483F] dark:text-[#D5C9B8] leading-snug mt-1">
                  {content.categories.researchDesc}
                </p>
              </div>
            </div>

          </div>

        </main>

        {/* ========================================================================= */}
        {/* AREA B: Centre/Right Ambedkar Slideshow (~35-40% width on large screens)  */}
        {/* ========================================================================= */}
        <section 
          aria-label="Ambedkar Historical Slideshow"
          className="w-full lg:w-[40%] xl:w-[42%] flex flex-col items-center justify-center relative my-auto min-h-0 z-20 py-2 sm:py-0"
        >
          {/* Slideshow Display Stage */}
          <div className="relative w-full flex flex-col items-center justify-center">
            
            {/* Visual focus: dominant portrait/monument with smooth crossfade & restrained scale */}
            <div className="relative w-full flex items-center justify-center min-h-[200px] sm:min-h-[260px] md:min-h-[300px] lg:min-h-[340px] xl:min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{
                    duration: prefersReducedMotion ? 0.25 : 0.8,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="flex flex-col items-center justify-center"
                >
                  <img
                    src={activeSlide.image}
                    alt={activeSlide.title}
                    className="max-h-[30vh] sm:max-h-[38vh] md:max-h-[42vh] lg:max-h-[46vh] xl:max-h-[50vh] w-auto max-w-full object-contain filter drop-shadow-[0_20px_44px_rgba(41,37,31,0.22)] select-none pointer-events-none"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Discreet Archival Caption Pill & Slide Controls */}
            <div className="mt-2 sm:mt-2.5 flex items-center gap-2">
              
              {/* Unobtrusive Previous Slide Button */}
              <button
                type="button"
                onClick={handlePrevSlide}
                aria-label="Previous slide"
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs ${
                  isDark 
                    ? 'bg-[#23201C]/80 hover:bg-[#363028] border-white/10 text-stone-300' 
                    : 'bg-[#FBF8F2]/90 hover:bg-white border-[#DED3C2] text-stone-700'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {/* Caption Pill */}
              <div 
                className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full border text-[11px] sm:text-xs flex items-center gap-2 shadow-xs transition-colors ${
                  isDark 
                    ? 'bg-[#23201C]/85 border-[#423B33] text-[#FBF8F2]' 
                    : 'bg-[#FBF8F2]/90 border-[#DED3C2] text-[#29251F]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B96535] shrink-0" />
                <span className="font-serif font-bold tracking-wide">{activeSlide.title}</span>
                <span className="opacity-55 text-[10px] font-mono shrink-0">({activeSlide.yearContext})</span>
              </div>

              {/* Unobtrusive Next Slide Button */}
              <button
                type="button"
                onClick={handleNextSlide}
                aria-label="Next slide"
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border flex items-center justify-center transition-all cursor-pointer active:scale-95 shadow-xs ${
                  isDark 
                    ? 'bg-[#23201C]/80 hover:bg-[#363028] border-white/10 text-stone-300' 
                    : 'bg-[#FBF8F2]/90 hover:bg-white border-[#DED3C2] text-stone-700'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </section>

        {/* ========================================================================= */}
        {/* DESKTOP RIGHT CONTROL RAIL: 4 Compact Museum Sections (>= lg displays)    */}
        {/* ========================================================================= */}
        <aside 
          aria-label="Kiosk Exhibition Controls"
          className={`hidden lg:flex shrink-0 w-14 sm:w-16 lg:w-[4.25rem] flex-col items-center justify-between py-3.5 sm:py-4 px-1 rounded-2xl sm:rounded-3xl border-2 shadow-xl backdrop-blur-xl transition-all duration-700 z-40 my-auto ${
            isDark 
              ? 'bg-[#23201C]/90 border-[#DED3C2]/20' 
              : 'bg-[#FBF8F2]/95 border-[#DED3C2]'
          }`} 
          style={{ maxHeight: 'calc(100vh - 44px)' }}
        >
          
          {/* Section 1: Archival Seal & Brand */}
          <div className="flex flex-col items-center gap-1">
            <img src="/seal.svg" alt="Archival Seal" className="w-8 h-8 sm:w-9 sm:h-9 object-contain" />
            <span className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.18em] text-center leading-tight ${
              isDark ? 'text-[#C89B3C]' : 'text-[#B96535]'
            }`}>
              Atlas
            </span>
          </div>

          <div className="w-6 h-px bg-stone-300 dark:bg-stone-700 my-1.5" />

          {/* Section 2: Audio Voice Narration Toggle */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => {
                resetInactivityTimer();
                toggleNarrationVoice();
                showToast(narrationVoiceActive ? 'Voice guide muted' : 'Voice guide activated', 'info');
              }}
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer ${
                narrationVoiceActive
                  ? 'bg-[#B96535] text-white shadow-xs'
                  : 'bg-black/5 dark:bg-white/10 text-stone-700 dark:text-stone-300 hover:bg-[#B96535]/15'
              }`}
              title={narrationVoiceActive ? 'Voice Guide: Active' : 'Voice Guide: Muted'}
              aria-label={narrationVoiceActive ? 'Voice Guide Active' : 'Voice Guide Muted'}
            >
              {narrationVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="text-[7px] sm:text-[8px] font-bold mt-0.5 leading-none">Voice</span>
            </button>
          </div>

          <div className="w-6 h-px bg-stone-300 dark:bg-stone-700 my-1.5" />

          {/* Section 3: Language Selector (English, मराठी, हिन्दी) */}
          <div 
            className="flex flex-col items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10"
            role="radiogroup"
            aria-label="Exhibition Language"
          >
            {([
              { code: 'English', label: 'EN' },
              { code: 'मराठी', label: 'म' },
              { code: 'हिन्दी', label: 'हि' },
            ] as const).map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleLanguageChange(lang.code)}
                role="radio"
                aria-checked={selectedLanguage === lang.code}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-[10px] sm:text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  selectedLanguage === lang.code
                    ? 'bg-[#29251F] dark:bg-[#FBF8F2] text-[#FBF8F2] dark:text-[#29251F] shadow-xs'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title={`Language: ${lang.code}`}
                aria-label={`Switch to ${lang.code}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="w-6 h-px bg-stone-300 dark:bg-stone-700 my-1.5" />

          {/* Section 4: Slide Indicators & Accessible Kiosk Exit */}
          <div className="flex flex-col items-center gap-2">
            
            {/* 6 Slide Indicator Dots */}
            <div className="flex flex-col items-center gap-1.5" title={`Current slide: ${activeSlide.title}`}>
              {KIOSK_SLIDES.map((slide, idx) => (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => handleSelectSlide(idx)}
                  title={`${slide.title} (${slide.yearContext})`}
                  aria-label={`Slide ${idx + 1}: ${slide.title}`}
                  className={`kiosk-dot-btn transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentSlideIndex
                      ? 'w-2 sm:w-2.5 h-4 sm:h-5 bg-[#B96535]'
                      : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-stone-400/40 hover:bg-stone-500'
                  }`}
                />
              ))}
            </div>

            <div className="w-5 h-px bg-stone-300/60 dark:bg-stone-700/60 my-0.5" />

            {/* Accessible Kiosk Exit Button */}
            <button
              type="button"
              onClick={handleExitKiosk}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#E7D5B9] hover:bg-[#DED3C2] text-[#713F2B] flex flex-col items-center justify-center border border-[#DED3C2] transition-colors cursor-pointer active:scale-95"
              title="Exit Kiosk Mode and return to homepage"
              aria-label="Exit Kiosk Mode"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="text-[7px] sm:text-[8px] font-bold mt-0.5 leading-none">Exit</span>
            </button>

          </div>

        </aside>

      </div>

    </div>
  );
};
