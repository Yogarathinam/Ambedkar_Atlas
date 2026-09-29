import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { Search, Bookmark, Menu, X, BookOpen, Clock, Bot, Touchpad, HelpCircle } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import ambedkarLogo from '../../assets/hero/image.png';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);
  const { bookmarksCount } = useBookmarks();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearchInput.trim())}`);
      setQuickSearchInput('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/archive', label: 'Explore Archive', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { to: '/timeline', label: 'Timeline', icon: <Clock className="w-3.5 h-3.5" /> },
    { to: '/research', label: 'AI Assistant', icon: <Bot className="w-3.5 h-3.5" /> },
    { to: '/about', label: 'About', icon: <HelpCircle className="w-3.5 h-3.5" /> },
    { to: '/kiosk', label: 'Kiosk', icon: <Touchpad className="w-3.5 h-3.5" /> },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBF8F2]/95 backdrop-blur-md border-b border-[#DED3C2] shadow-sm py-2'
          : 'bg-[#FBF8F2] border-b border-[#DED3C2]/80 py-3'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 gap-3 sm:gap-6">
          
          {/* Brand Seal & Title */}
          <Link
            to="/"
            className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus:ring-1 focus:ring-[#B96535] rounded-md shrink-0"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center">
              <img 
                src="/seal.svg" 
                alt="Archival Seal" 
                className="w-full h-full shrink-0 transition-transform duration-300 group-hover:rotate-6"
              />
              <img
                src={ambedkarLogo}
                alt="Dr. B. R. Ambedkar"
                className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#29251F] group-hover:text-[#B96535] transition-colors leading-tight">
                AMBEDKAR ATLAS
              </span>
              <span className="text-[9px] sm:text-[10px] font-medium tracking-widest text-[#827567] uppercase hidden xs:inline">
                Digital Heritage Archive
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 rounded-lg text-xs xl:text-sm font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#B96535] bg-[#E7D5B9]/60 font-semibold shadow-2xs'
                      : 'text-[#51483F] hover:text-[#29251F] hover:bg-[#F5EBDD]'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* Right Controls: Compact Search & Bookmark */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* Compact Search Input (Desktop) */}
            <form onSubmit={handleQuickSearch} className="hidden sm:flex relative items-center">
              <input
                type="text"
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                placeholder="Search archive..."
                className="w-36 md:w-48 lg:w-56 pl-7 pr-3 py-1.5 text-xs bg-[#F5EBDD]/70 border border-[#DED3C2] rounded-lg text-[#29251F] placeholder-[#827567] focus:outline-none focus:ring-1 focus:ring-[#B96535] focus:bg-[#FFF] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#827567] absolute left-2 pointer-events-none" />
            </form>

            {/* Mobile Search Button */}
            <Link
              to="/search"
              aria-label="Search Catalog"
              className="sm:hidden p-2 text-[#51483F] hover:text-[#29251F] hover:bg-[#F5EBDD] rounded-lg transition-colors"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* Bookmarks Icon */}
            <Link
              to="/archive?bookmarked=true"
              aria-label="Saved Records"
              className="relative p-2 text-[#51483F] hover:text-[#B96535] hover:bg-[#F5EBDD] rounded-lg transition-colors flex items-center"
              title="Saved Records"
            >
              <Bookmark className="w-4 h-4" />
              {bookmarksCount > 0 && (
                <span className="absolute 0 top-0.5 right-0.5 bg-[#B96535] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#51483F] hover:text-[#29251F] hover:bg-[#F5EBDD] rounded-lg transition-colors ml-0.5"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DED3C2] bg-[#FBF8F2] px-4 pt-3 pb-5 space-y-2 animate-in slide-in-from-top duration-200 shadow-md">
          <form onSubmit={handleQuickSearch} className="mb-3">
            <div className="relative flex items-center">
              <input
                type="text"
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                placeholder="Search archive catalog..."
                className="w-full pl-8 pr-3 py-2 text-xs bg-[#F5EBDD] border border-[#DED3C2] rounded-lg text-[#29251F] focus:outline-none focus:ring-1 focus:ring-[#B96535]"
              />
              <Search className="w-3.5 h-3.5 text-[#827567] absolute left-2.5 pointer-events-none" />
            </div>
          </form>

          <div className="space-y-1">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive ? 'text-[#B96535] bg-[#E7D5B9]/60 font-semibold' : 'text-[#29251F] hover:bg-[#F5EBDD]'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>

          <div className="pt-3 border-t border-[#DED3C2] flex items-center justify-between text-xs text-[#827567]">
            <span>Ambedkar Atlas</span>
            <Link to="/archive?bookmarked=true" className="text-[#B96535] font-semibold">
              {bookmarksCount} Saved Records
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
