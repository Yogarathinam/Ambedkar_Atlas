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
  };

  const handleExitKiosk = () => {
    setDeviceMode('desktop');
    navigate('/');
    showToast('Exited Touchscreen Kiosk Exhibition Mode', 'info');
  };

  return (
    <div className={`h-screen max-h-screen w-screen relative flex items-stretch justify-between p-4 sm:p-6 md:p-8 kiosk-mode selection:bg-transparent overflow-hidden transition-colors duration-1000 ${
      isDark ? 'text-[#FBF8F2]' : 'text-[#29251F]'
    }`}>
      
      {/* Dynamic Adaptive Kiosk Background with Ambedkar Slideshow & Panoramic Audience */}
      <KioskBackground currentSlideIndex={currentSlideIndex} />

      {/* 1. Main Touch Exhibition Workspace (Left & Center-Left) */}
      <main className="relative z-20 flex-1 flex flex-col justify-center max-w-xl lg:max-w-2xl xl:max-w-[48rem] py-2 my-auto pl-2 sm:pl-4 space-y-4">
        
        {/* Exhibition Branding & Headline */}
        <div>
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className={`inline-block text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
              isDark 
                ? 'bg-[#C89B3C]/15 border-[#C89B3C]/30 text-[#C89B3C]' 
                : 'bg-[#B96535]/10 border-[#B96535]/25 text-[#B96535]'
            }`}>
              Interactive Exhibition Archive
            </span>
          </div>
          
          <h2 className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.12] tracking-tight ${
            isDark ? 'text-[#FBF8F2] drop-shadow-md' : 'text-[#29251F]'
          }`}>
            Architect of Equality.<br />
            <span className={isDark ? 'text-[#C89B3C]' : 'text-[#B96535]'}>Voice of the Republic.</span>
          </h2>
          
          <p className={`text-xs sm:text-sm mt-2 max-w-lg leading-relaxed ${
            isDark ? 'text-[#D5C9B8]' : 'text-[#51483F]'
          }`}>
            Touch any collection tile below to explore original manuscripts, historical speeches, and constitutional records.
          </p>
        </div>

        {/* Large Prominent Touch Search with Glassmorphism */}
        <form onSubmit={handleKioskSearchSubmit} className="w-full max-w-lg">
          <div className="relative flex items-center shadow-md rounded-2xl group">
            <input
              type="text"
              value={kioskSearch}
              onChange={(e) => setKioskSearch(e.target.value)}
              placeholder="Search speeches, writings, or historical records..."
              className="w-full pl-11 pr-24 py-3 text-xs sm:text-sm bg-[#FBF8F2]/95 dark:bg-[#23201C]/95 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#51483F] focus:border-[#B96535] rounded-2xl text-[#29251F] dark:text-[#FBF8F2] placeholder-[#827567] dark:placeholder-[#A89C8F] focus:outline-none shadow-sm transition-all"
            />
            <Search className="w-4 h-4 text-[#827567] dark:text-[#A89C8F] absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1.5 px-4 py-1.5 bg-[#B96535] hover:bg-[#713F2B] text-white font-bold rounded-xl text-xs shadow-sm transition-colors active:scale-95"
            >
              Search
            </button>
          </div>
        </form>

        {/* 4 Touch-First Category Tiles (Compact, ergonomic, guaranteed never cut off) */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-3 max-w-lg pt-1">
          
          <div
            onClick={() => navigate('/archive?category=writings')}
            className="bg-[#FBF8F2]/92 dark:bg-[#23201C]/92 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#423B33] hover:border-[#B96535] rounded-2xl p-3.5 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95 flex items-center gap-3"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#E7D5B9] dark:bg-[#363028] flex items-center justify-center text-[#713F2B] dark:text-[#C89B3C]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#29251F] dark:text-[#FBF8F2] leading-tight">Writings & Books</h3>
              <p className="text-[11px] text-[#827567] dark:text-[#A89C8F] truncate mt-0.5">Annihilation of Caste, Rupee</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/archive?category=speeches')}
            className="bg-[#FBF8F2]/92 dark:bg-[#23201C]/92 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#423B33] hover:border-[#B96535] rounded-2xl p-3.5 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95 flex items-center gap-3"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#E7D5B9] dark:bg-[#363028] flex items-center justify-center text-[#713F2B] dark:text-[#C89B3C]">
              <Volume2 className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#29251F] dark:text-[#FBF8F2] leading-tight">Historic Speeches</h3>
              <p className="text-[11px] text-[#827567] dark:text-[#A89C8F] truncate mt-0.5">Mahad, Constituent Assembly</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/timeline')}
            className="bg-[#FBF8F2]/92 dark:bg-[#23201C]/92 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#423B33] hover:border-[#B96535] rounded-2xl p-3.5 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95 flex items-center gap-3"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#E7D5B9] dark:bg-[#363028] flex items-center justify-center text-[#713F2B] dark:text-[#C89B3C]">
              <Clock className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#29251F] dark:text-[#FBF8F2] leading-tight">Historical Timeline</h3>
              <p className="text-[11px] text-[#827567] dark:text-[#A89C8F] truncate mt-0.5">1891–1956 milestones</p>
            </div>
          </div>

          <div
            onClick={() => navigate('/research')}
            className="bg-[#FBF8F2]/92 dark:bg-[#23201C]/92 backdrop-blur-md border-2 border-[#DED3C2] dark:border-[#423B33] hover:border-[#B96535] rounded-2xl p-3.5 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95 flex items-center gap-3"
          >
            <div className="w-10 h-10 shrink-0 rounded-xl bg-[#E7D5B9] dark:bg-[#363028] flex items-center justify-center text-[#713F2B] dark:text-[#C89B3C]">
              <Bot className="w-5 h-5" />
            </div>
            <div className="overflow-hidden">
              <h3 className="font-serif text-sm sm:text-base font-bold text-[#29251F] dark:text-[#FBF8F2] leading-tight">AI Research Desk</h3>
              <p className="text-[11px] text-[#827567] dark:text-[#A89C8F] truncate mt-0.5">Ask questions with cited records</p>
            </div>
          </div>

        </div>

      </main>

      {/* 2. Vertical Navigation Bar on the Right Side (As designed for interactive kiosks) */}
      <aside className={`relative z-40 shrink-0 w-16 sm:w-20 my-auto py-5 px-1.5 sm:px-2 flex flex-col items-center justify-between rounded-3xl border-2 transition-all duration-700 shadow-xl ${
        isDark 
          ? 'bg-[#23201C]/85 backdrop-blur-xl border-[#DED3C2]/20' 
          : 'bg-[#FBF8F2]/90 backdrop-blur-xl border-[#DED3C2]'
      }`} style={{ maxHeight: 'calc(100vh - 48px)' }}>
        
        {/* Top: Archival Seal & Exhibition Brand */}
        <div className="flex flex-col items-center gap-1">
          <img src="/seal.svg" alt="Archival Seal" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
          <span className={`text-[8px] font-bold uppercase tracking-wider text-center leading-tight ${isDark ? 'text-[#C89B3C]' : 'text-[#B96535]'}`}>
            Atlas
          </span>
        </div>

        {/* Middle: Controls & Navigation */}
        <div className="flex flex-col items-center gap-3.5 my-auto">
          
          {/* Audio Narration Toggle */}
          <button
            onClick={() => {
              toggleNarrationVoice();
              showToast(narrationVoiceActive ? 'Voice guide muted' : 'Voice guide activated', 'info');
            }}
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex flex-col items-center justify-center transition-all ${
              narrationVoiceActive
                ? 'bg-[#B96535] text-white shadow-md'
                : 'bg-black/5 dark:bg-white/10 text-stone-700 dark:text-stone-300 hover:bg-[#B96535]/20'
            }`}
            title={narrationVoiceActive ? 'Voice Guide: Active' : 'Voice Guide: Muted'}
          >
            {narrationVoiceActive ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
            <span className="text-[7px] sm:text-[8px] font-bold mt-0.5">Voice</span>
          </button>

          <div className="w-6 h-px bg-stone-300 dark:bg-stone-700" />

          {/* Language Selector (Vertical Stack) */}
          <div className="flex flex-col items-center gap-1 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
            {([
              { code: 'English', label: 'EN' },
              { code: 'मराठी', label: 'म' },
              { code: 'हिन्दी', label: 'हि' },
            ] as const).map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center ${
                  selectedLanguage === lang.code
                    ? 'bg-[#29251F] dark:bg-[#FBF8F2] text-[#FBF8F2] dark:text-[#29251F] shadow-sm'
                    : 'text-stone-500 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
                title={`Language: ${lang.code}`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <div className="w-6 h-px bg-stone-300 dark:bg-stone-700" />

          {/* Slide Indicator Dots (Vertical) */}
          <div className="flex flex-col items-center gap-1.5" title={`Current: ${activeSlide.title}`}>
            {KIOSK_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlideIndex(idx)}
                title={`${slide.title} (${slide.yearContext})`}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlideIndex
                    ? 'w-2.5 h-5 sm:h-6 bg-[#B96535]'
                    : 'w-2 h-2 bg-stone-400/40 hover:bg-stone-500'
                }`}
              />
            ))}
          </div>

        </div>

        {/* Bottom: Exit Kiosk Button */}
        <button
          onClick={handleExitKiosk}
          className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-[#E7D5B9] hover:bg-[#DED3C2] text-[#713F2B] flex flex-col items-center justify-center border border-[#DED3C2] transition-colors"
          title="Exit Kiosk Mode and return to Desktop"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-[7px] sm:text-[8px] font-bold mt-0.5">Exit</span>
        </button>

      </aside>

    </div>
  );
};
