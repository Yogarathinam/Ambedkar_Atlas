import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDevice } from '../context/DeviceContext';
import { useToast } from '../context/ToastContext';
import { KioskBackground, KIOSK_SLIDES } from '../components/kiosk/KioskBackground';
import { 
  Search, BookOpen, Clock, Bot, Volume2, VolumeX, LogOut 
} from 'lucide-react';

export const KioskPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setDeviceMode, 
    narrationVoiceActive, 
    toggleNarrationVoice, 
    inactivityCountdown, 
    resetInactivityTimer 
  } = useDevice();
  const { showToast } = useToast();

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [kioskSearch, setKioskSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'मराठी' | 'हिन्दी'>('English');

  const activeSlide = KIOSK_SLIDES[currentSlideIndex] || KIOSK_SLIDES[0];
  const isDark = activeSlide.isDarkTheme;

  useEffect(() => {
    // Automatically set device mode to kiosk when on /kiosk route
    setDeviceMode('kiosk');
  }, [setDeviceMode]);

  // Slideshow auto-advance every 9 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % KIOSK_SLIDES.length);
    }, 9000);
    return () => clearInterval(timer);
  }, []);

  const handleKioskSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (kioskSearch.trim()) {
      navigate(`/archive?q=${encodeURIComponent(kioskSearch.trim())}`);
    }
  };

  const handleLanguageChange = (lang: 'English' | 'मराठी' | 'हिन्दी') => {
    setSelectedLanguage(lang);
    showToast(`Kiosk exhibition language set to ${lang}`, 'info');
    resetInactivityTimer();
  };

  const handleExitKiosk = () => {
    setDeviceMode('desktop');
    navigate('/');
    showToast('Exited Touchscreen Kiosk Exhibition Mode', 'info');
  };

  return (
    <div className={`h-screen max-h-screen w-screen relative flex flex-col justify-between p-5 sm:p-8 md:p-10 kiosk-mode selection:bg-transparent overflow-hidden transition-colors duration-1000 ${
      isDark ? 'text-[#FBF8F2]' : 'text-[#29251F]'
    }`}>
      
      {/* Dynamic Adaptive Kiosk Background with Ambedkar Slideshow & Panoramic Audience */}
      <KioskBackground currentSlideIndex={currentSlideIndex} />

      {/* 1. Kiosk Top Bar with Embedded Slide Indicator and Exhibition Controls */}
      <header className={`relative z-20 shrink-0 flex items-center justify-between gap-4 px-6 py-3.5 rounded-3xl border-2 transition-all duration-700 shadow-sm ${
        isDark 
          ? 'bg-[#23201C]/85 backdrop-blur-md border-[#DED3C2]/20' 
          : 'bg-[#FBF8F2]/90 backdrop-blur-md border-[#DED3C2]'
      }`}>
        
        {/* Archival Seal & Exhibition Brand */}
        <div className="flex items-center gap-3.5">
          <img src="/seal.svg" alt="Seal" className="w-10 h-10 object-contain" />
          <div>
            <h1 className={`font-serif text-lg sm:text-xl font-bold tracking-tight leading-none ${isDark ? 'text-[#FBF8F2]' : 'text-[#29251F]'}`}>
              AMBEDKAR ATLAS
            </h1>
            <span className={`text-[10px] font-bold uppercase tracking-widest block mt-0.5 ${isDark ? 'text-[#C89B3C]' : 'text-[#B96535]'}`}>
              Public Interactive Exhibition Kiosk
            </span>
          </div>
        </div>

        {/* Embedded Slide Switcher (Inside header, preventing any overlap) */}
        <div className="hidden xl:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10">
          <span className="text-[11px] font-serif font-bold text-stone-700 dark:text-stone-300">
            {activeSlide.title}
          </span>
          <div className="flex items-center gap-1.5">
            {KIOSK_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  setCurrentSlideIndex(idx);
                  resetInactivityTimer();
                }}
                title={`${slide.title} (${slide.yearContext})`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlideIndex
                    ? 'w-5 h-2 bg-[#B96535]'
                    : 'w-2 h-2 bg-stone-400/40 hover:bg-stone-500'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right Exhibition Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          
          {/* Audio Narration Toggle */}
          <button
            onClick={() => {
              toggleNarrationVoice();
              showToast(narrationVoiceActive ? 'Voice assistance muted' : 'Voice assistance activated', 'info');
              resetInactivityTimer();
            }}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs sm:text-sm font-semibold transition-all ${
              narrationVoiceActive
                ? 'bg-[#B96535] text-white border-[#B96535] shadow-sm'
                : 'bg-[#FBF8F2] text-[#51483F] border-[#DED3C2]'
            }`}
          >
            {narrationVoiceActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden md:inline">Voice: {narrationVoiceActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-[#FBF8F2] p-1 rounded-2xl border border-[#DED3C2]">
            {(['English', 'मराठी', 'हिन्दी'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-[#29251F] text-[#FBF8F2]'
                    : 'text-[#827567] hover:text-[#29251F]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Compact Session Reset Indicator */}
          <div 
            onClick={resetInactivityTimer}
            title="Kiosk auto-reset timer (tap to refresh)"
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-[#DED3C2] dark:border-stone-700 bg-[#FBF8F2] dark:bg-[#23201C] text-[11px] font-mono text-[#827567] dark:text-[#A89C8F] cursor-pointer hover:border-[#B96535] transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{inactivityCountdown}s</span>
          </div>

          {/* Exit Kiosk Button */}
          <button
            onClick={handleExitKiosk}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#E7D5B9] hover:bg-[#DED3C2] text-[#713F2B] text-xs sm:text-sm font-bold rounded-2xl border border-[#DED3C2] transition-colors"
            title="Exit Kiosk Mode and return to Desktop"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Exit Kiosk</span>
          </button>

        </div>

      </header>

      {/* 2. Main Touch Hero & Interactive Controls (Split Layout: Left Column) */}
      <main className="relative z-20 flex-1 flex flex-col justify-center max-w-2xl lg:max-w-xl xl:max-w-2xl py-4 my-auto space-y-5">
        
        {/* Editorial Eyebrow & Headline */}
        <div>
          <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-3 border ${
            isDark 
              ? 'bg-[#C89B3C]/15 border-[#C89B3C]/30 text-[#C89B3C]' 
              : 'bg-[#B96535]/10 border-[#B96535]/25 text-[#B96535]'
          }`}>
            Touch to Begin Exploration
          </span>
          <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.15] tracking-tight ${
            isDark ? 'text-[#FBF8F2] drop-shadow-md' : 'text-[#29251F]'
          }`}>
            Architect of Equality.<br />
            <span className={isDark ? 'text-[#C89B3C]' : 'text-[#B96535]'}>Voice of the Republic.</span>
          </h2>
          <p className={`text-sm sm:text-base mt-2 max-w-lg leading-relaxed ${
            isDark ? 'text-[#D5C9B8]' : 'text-[#51483F]'
          }`}>
            Touch any collection tile below to browse original manuscripts, historical audio, and constitutional debates.
          </p>
        </div>

        {/* Large Prominent Touch Search with Glassmorphism */}
        <form onSubmit={handleKioskSearchSubmit} className="w-full">
          <div className="relative flex items-center shadow-lg rounded-2xl group">
            <input
              type="text"
              value={kioskSearch}
              onChange={(e) => {
                setKioskSearch(e.target.value);
                resetInactivityTimer();
              }}
              placeholder="Touch here to search speeches, writings, or historical records..."
              className="w-full pl-12 pr-28 py-3.5 text-sm sm:text-base bg-[#FBF8F2]/95 dark:bg-[#23201C]/95 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#51483F] focus:border-[#B96535] rounded-2xl text-[#29251F] dark:text-[#FBF8F2] placeholder-[#827567] dark:placeholder-[#A89C8F] focus:outline-none shadow-md transition-all"
            />
            <Search className="w-5 h-5 text-[#827567] dark:text-[#A89C8F] absolute left-4 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-2 px-5 py-2 bg-[#B96535] hover:bg-[#713F2B] text-white font-bold rounded-xl text-sm shadow-sm transition-colors active:scale-95"
            >
              Search
            </button>
          </div>
        </form>

        {/* Touch-First Category Tiles (2x2 Grid with high-contrast glassmorphic backing) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
          
          <div
            onClick={() => {
              navigate('/archive?category=writings');
              resetInactivityTimer();
            }}
            className="bg-[#FBF8F2]/92 dark:bg-[#23201C]/92 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#423B33] hover:border-[#B96535] rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.02] cursor-pointer shadow-md active:scale-95 space-y-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] dark:bg-[#363028] flex items-center justify-center text-[#713F2B] dark:text-[#C89B3C]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#29251F] dark:text-[#FBF8F2]">Writings & Books</h3>
              <p className="text-xs text-[#827567] dark:text-[#A89C8F] mt-0.5 line-clamp-1">Annihilation of Caste, treatises</p>
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/archive?category=speeches');
              resetInactivityTimer();
            }}
            className="bg-[#FBF8F2]/92 dark:bg-[#23201C]/92 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#423B33] hover:border-[#B96535] rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.02] cursor-pointer shadow-md active:scale-95 space-y-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] dark:bg-[#363028] flex items-center justify-center text-[#713F2B] dark:text-[#C89B3C]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#29251F] dark:text-[#FBF8F2]">Historic Speeches</h3>
              <p className="text-xs text-[#827567] dark:text-[#A89C8F] mt-0.5 line-clamp-1">Mahad, Constituent Assembly, BBC</p>
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/timeline');
              resetInactivityTimer();
            }}
            className="bg-[#FBF8F2]/92 dark:bg-[#23201C]/92 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#423B33] hover:border-[#B96535] rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.02] cursor-pointer shadow-md active:scale-95 space-y-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] dark:bg-[#363028] flex items-center justify-center text-[#713F2B] dark:text-[#C89B3C]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#29251F] dark:text-[#FBF8F2]">Historical Timeline</h3>
              <p className="text-xs text-[#827567] dark:text-[#A89C8F] mt-0.5 line-clamp-1">1891–1956 chronological milestones</p>
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/research');
              resetInactivityTimer();
            }}
            className="bg-[#FBF8F2]/92 dark:bg-[#23201C]/92 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#423B33] hover:border-[#B96535] rounded-2xl p-4 sm:p-5 transition-all hover:scale-[1.02] cursor-pointer shadow-md active:scale-95 space-y-2.5"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] dark:bg-[#363028] flex items-center justify-center text-[#713F2B] dark:text-[#C89B3C]">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-base sm:text-lg font-bold text-[#29251F] dark:text-[#FBF8F2]">AI Research Desk</h3>
              <p className="text-xs text-[#827567] dark:text-[#A89C8F] mt-0.5 line-clamp-1">Ask questions with cited records</p>
            </div>
          </div>

        </div>

      </main>

      {/* Bottom Footer Bar has been completely removed as requested */}

    </div>
  );
};
