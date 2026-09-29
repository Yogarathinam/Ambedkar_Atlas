import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Search, Bookmark, Menu, X, Sparkles, BookOpen, Clock, Bot, Touchpad, HelpCircle } from 'lucide-react';
import { useBookmarks } from '../../context/BookmarkContext';
import { useDevice } from '../../context/DeviceContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const { bookmarksCount } = useBookmarks();
  const { isKiosk, isTv } = useDevice();
  const navigate = useNavigate();

  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickSearchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearchInput.trim())}`);
      setQuickSearchInput('');
      setMobileMenuOpen(false);
    }
  };

  const navLinks = [
    { to: '/archive', label: 'Explore Archive', icon: <BookOpen className="w-4 h-4" /> },
    { to: '/timeline', label: 'Timeline', icon: <Clock className="w-4 h-4" /> },
    { to: '/research', label: 'AI Assistant', icon: <Bot className="w-4 h-4" />, badge: 'Simulated' },
    { to: '/about', label: 'About', icon: <HelpCircle className="w-4 h-4" /> },
    { to: '/kiosk', label: 'Kiosk Mode', icon: <Touchpad className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-[#FBF8F2] border-b border-[#DED3C2] sticky top-[33px] z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Archival Title */}
          <Link to="/" className="flex items-center gap-3.5 group focus:outline-none focus:ring-2 focus:ring-[#B96535] rounded-md p-1">
            <img 
              src="/seal.svg" 
              alt="Ambedkar Atlas Archival Seal" 
              className="w-12 h-12 shrink-0 transition-transform duration-300 group-hover:rotate-12"
            />
            <div className="flex flex-col">
              <span className="font-serif text-2xl font-bold tracking-tight text-[#29251F] group-hover:text-[#B96535] transition-colors">
                AMBEDKAR ATLAS
              </span>
              <span className="text-[11px] font-medium tracking-widest text-[#827567] uppercase">
                Digital Heritage Archive
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    isActive
                      ? 'text-[#B96535] bg-[#F5EBDD] font-semibold border-b-2 border-[#B96535]'
                      : 'text-[#51483F] hover:text-[#29251F] hover:bg-[#F5EBDD]/60'
                  }`
                }
              >
                {item.icon}
                <span>{item.label}</span>
                {item.badge && (
                  <span className="text-[10px] bg-[#B96535]/10 text-[#B96535] px-1.5 py-0.5 rounded-full font-medium ml-0.5">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Search bar & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Quick Search Form */}
            <form onSubmit={handleQuickSearch} className="hidden sm:flex relative items-center">
              <input
                type="text"
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                placeholder="Search writings, speeches..."
                className="w-48 md:w-60 pl-8 pr-3 py-1.5 text-xs bg-[#F5EBDD]/70 border border-[#DED3C2] rounded-md text-[#29251F] placeholder-[#827567] focus:outline-none focus:ring-1 focus:ring-[#B96535] focus:bg-[#FFF] transition-all"
              />
              <Search className="w-3.5 h-3.5 text-[#827567] absolute left-2.5 pointer-events-none" />
            </form>

            {/* Mobile Search Button */}
            <Link
              to="/search"
              aria-label="Open search"
              className="sm:hidden p-2 text-[#51483F] hover:text-[#29251F] hover:bg-[#F5EBDD] rounded-md transition-colors"
            >
              <Search className="w-5 h-5" />
            </Link>

            {/* Bookmarks Quick Link */}
            <Link
              to="/archive?bookmarked=true"
              aria-label="View saved bookmarks"
              className="relative p-2 text-[#51483F] hover:text-[#B96535] hover:bg-[#F5EBDD] rounded-md transition-colors flex items-center"
              title="Saved Archival Bookmarks"
            >
              <Bookmark className="w-5 h-5" />
              {bookmarksCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B96535] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {bookmarksCount}
                </span>
              )}
            </Link>

            {/* Mobile hamburger menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#51483F] hover:text-[#29251F] hover:bg-[#F5EBDD] rounded-md transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#DED3C2] bg-[#FBF8F2] px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top duration-200">
          <form onSubmit={handleQuickSearch} className="mb-4">
            <div className="relative flex items-center">
              <input
                type="text"
                value={quickSearchInput}
                onChange={(e) => setQuickSearchInput(e.target.value)}
                placeholder="Search archive catalog..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-[#F5EBDD] border border-[#DED3C2] rounded-md text-[#29251F] focus:outline-none focus:ring-2 focus:ring-[#B96535]"
              />
              <Search className="w-4 h-4 text-[#827567] absolute left-3 pointer-events-none" />
            </div>
          </form>

          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-[#29251F] hover:bg-[#F5EBDD] transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-xs bg-[#B96535]/15 text-[#B96535] px-2 py-0.5 rounded-full font-medium">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#DED3C2] flex items-center justify-between text-xs text-[#827567]">
            <span>Ambedkar Atlas Prototype</span>
            <Link to="/archive?bookmarked=true" onClick={() => setMobileMenuOpen(false)} className="text-[#B96535] font-medium">
              {bookmarksCount} Saved Records
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
