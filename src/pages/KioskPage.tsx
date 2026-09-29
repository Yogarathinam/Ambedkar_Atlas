import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ARCHIVE_CATEGORIES } from '../data/categories';
import { useDevice } from '../context/DeviceContext';
import { useToast } from '../context/ToastContext';
import { 
  Search, BookOpen, Clock, Bot, Volume2, VolumeX, Globe, 
  RotateCcw, ArrowRight, ShieldCheck, Home, ArrowLeft, LogOut, Check 
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

  const [kioskSearch, setKioskSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'मराठी' | 'हिन्दी'>('English');

  useEffect(() => {
    // Automatically set device mode to kiosk when on /kiosk route
    setDeviceMode('kiosk');
  }, [setDeviceMode]);

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
    <div className="min-h-screen bg-[#F5EBDD] text-[#29251F] flex flex-col justify-between p-6 sm:p-10 kiosk-mode selection:bg-transparent">
      
      {/* Kiosk Top Bar with Exit and Inactivity Reset */}
      <div className="flex items-center justify-between gap-4 pb-6 border-b-2 border-[#DED3C2]">
        
        {/* Archival Seal & Welcome Badge */}
        <div className="flex items-center gap-4">
          <img src="/seal.svg" alt="Seal" className="w-14 h-14" />
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#29251F]">
              AMBEDKAR ATLAS
            </h1>
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535]">
              Public Interactive Exhibition Kiosk
            </span>
          </div>
        </div>

        {/* Exhibition Controls */}
        <div className="flex items-center gap-3">
          
          {/* Audio Narration Toggle */}
          <button
            onClick={() => {
              toggleNarrationVoice();
              showToast(narrationVoiceActive ? 'Voice assistance muted' : 'Voice assistance activated', 'info');
              resetInactivityTimer();
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${
              narrationVoiceActive
                ? 'bg-[#B96535] text-white border-[#B96535] shadow-md'
                : 'bg-[#FBF8F2] text-[#51483F] border-[#DED3C2]'
            }`}
          >
            {narrationVoiceActive ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            <span className="hidden sm:inline">Voice Guide: {narrationVoiceActive ? 'ON' : 'OFF'}</span>
          </button>

          {/* Language Selector */}
          <div className="flex items-center bg-[#FBF8F2] p-1 rounded-2xl border border-[#DED3C2]">
            {(['English', 'मराठी', 'हिन्दी'] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors ${
                  selectedLanguage === lang
                    ? 'bg-[#29251F] text-[#FBF8F2]'
                    : 'text-[#827567] hover:text-[#29251F]'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>

          {/* Exit Kiosk Button */}
          <button
            onClick={handleExitKiosk}
            className="flex items-center gap-1.5 px-4 py-3 bg-[#E7D5B9] hover:bg-[#DED3C2] text-[#713F2B] text-xs sm:text-sm font-bold rounded-2xl border border-[#DED3C2] transition-colors"
            title="Exit Kiosk Mode and return to Desktop"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Exit Kiosk</span>
          </button>

        </div>

      </div>

      {/* Main Touch Hero and Search */}
      <div className="my-auto py-8 max-w-4xl mx-auto w-full text-center space-y-8">
        
        <div>
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#B96535] block mb-2">
            Touch to Begin Exploration
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold text-[#29251F] leading-tight">
            Discover the Heritage of <br />
            Dr. B. R. Ambedkar
          </h2>
          <p className="text-base sm:text-lg text-[#51483F] mt-3 max-w-2xl mx-auto leading-relaxed">
            Touch any collection tile below to browse original manuscripts, historical audio, and constitutional debates.
          </p>
        </div>

        {/* Large Prominent Touch Search */}
        <form onSubmit={handleKioskSearchSubmit} className="max-w-2xl mx-auto">
          <div className="relative flex items-center">
            <input
              type="text"
              value={kioskSearch}
              onChange={(e) => {
                setKioskSearch(e.target.value);
                resetInactivityTimer();
              }}
              placeholder="Touch here to search speeches, writings, or historical dates..."
              className="w-full pl-14 pr-32 py-5 text-base sm:text-lg bg-[#FFF] border-2 border-[#DED3C2] rounded-3xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:border-[#B96535] shadow-lg"
            />
            <Search className="w-7 h-7 text-[#827567] absolute left-5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-3 px-6 py-3 bg-[#B96535] hover:bg-[#713F2B] text-white font-bold rounded-2xl text-base shadow-sm"
            >
              Search
            </button>
          </div>
        </form>

        {/* Touch-First Category Tiles (Massive tap targets) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-left">
          
          <div
            onClick={() => {
              navigate('/archive?category=writings');
              resetInactivityTimer();
            }}
            className="bg-[#FBF8F2] border-2 border-[#DED3C2] hover:border-[#B96535] rounded-3xl p-6 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95 space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E7D5B9] flex items-center justify-center text-[#713F2B]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#29251F]">Writings & Books</h3>
              <p className="text-xs text-[#827567] mt-1">Annihilation of Caste, Rupee, treatises</p>
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/archive?category=speeches');
              resetInactivityTimer();
            }}
            className="bg-[#FBF8F2] border-2 border-[#DED3C2] hover:border-[#B96535] rounded-3xl p-6 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95 space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E7D5B9] flex items-center justify-center text-[#713F2B]">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#29251F]">Historic Speeches</h3>
              <p className="text-xs text-[#827567] mt-1">Mahad, Constituent Assembly, BBC</p>
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/timeline');
              resetInactivityTimer();
            }}
            className="bg-[#FBF8F2] border-2 border-[#DED3C2] hover:border-[#B96535] rounded-3xl p-6 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95 space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E7D5B9] flex items-center justify-center text-[#713F2B]">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#29251F]">Historical Timeline</h3>
              <p className="text-xs text-[#827567] mt-1">1891–1956 chronological milestones</p>
            </div>
          </div>

          <div
            onClick={() => {
              navigate('/research');
              resetInactivityTimer();
            }}
            className="bg-[#FBF8F2] border-2 border-[#DED3C2] hover:border-[#B96535] rounded-3xl p-6 transition-all hover:scale-[1.02] cursor-pointer shadow-sm active:scale-95 space-y-3"
          >
            <div className="w-12 h-12 rounded-2xl bg-[#E7D5B9] flex items-center justify-center text-[#713F2B]">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-[#29251F]">AI Research Desk</h3>
              <p className="text-xs text-[#827567] mt-1">Ask questions with cited records</p>
            </div>
          </div>

        </div>

      </div>

      {/* Kiosk Bottom Status Bar with Inactivity Counter */}
      <div className="pt-6 border-t border-[#DED3C2] flex flex-wrap items-center justify-between gap-4 text-xs text-[#827567]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#FBF8F2] hover:bg-[#E7D5B9] text-[#29251F] font-semibold rounded-xl border border-[#DED3C2]"
          >
            <Home className="w-4 h-4 text-[#B96535]" />
            <span>Exhibition Home</span>
          </button>
          <span>Touchscreen optimized • High contrast mode</span>
        </div>

        <div className="flex items-center gap-2 bg-[#FBF8F2] px-3.5 py-1.5 rounded-full border border-[#DED3C2]">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Session Auto-Reset: {inactivityCountdown} seconds</span>
          <button
            onClick={resetInactivityTimer}
            className="text-[#B96535] font-semibold underline ml-1"
          >
            Tap to Stay
          </button>
        </div>
      </div>

    </div>
  );
};
