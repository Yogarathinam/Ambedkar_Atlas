import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { TimelineEvent, ArchiveRecord, DateType } from '../types';
import { archiveService } from '../services/archiveService';
import { TimelineTrack } from '../components/timeline/TimelineTrack';
import { EventDetailModal } from '../components/timeline/EventDetailModal';
import { Historical3DBook } from '../components/timeline/book/Historical3DBook';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { 
  Search, Mic, MicOff, Filter, RotateCcw, ArrowUp, 
  Sparkles, CheckCircle2, ChevronRight, BookOpen, 
  Calendar, Layers, ShieldCheck 
} from 'lucide-react';

const ERAS: { id: string; label: string; period: string }[] = [
  { id: 'all', label: 'All Epochs', period: '1891–1956' },
  { id: '1891-1912', label: 'Early Life & Columbia', period: '1891–1912' },
  { id: '1913-1923', label: 'Columbia, LSE & Bar', period: '1913–1923' },
  { id: '1924-1935', label: 'Mahad & Poona Pact', period: '1924–1935' },
  { id: '1936-1946', label: 'Annihilation & Labour', period: '1936–1946' },
  { id: '1947-1951', label: 'Constitution & Law', period: '1947–1951' },
  { id: '1952-1956', label: 'Buddhist Revival', period: '1952–1956' },
];

const EVENT_TYPES: { id: string; label: string }[] = [
  { id: 'all', label: 'All Event Types' },
  { id: 'event_occurred', label: 'Milestones & Movements' },
  { id: 'speech_delivered', label: 'Speeches & Addresses' },
  { id: 'first_published', label: 'Original Publications' },
  { id: 'work_written', label: 'Authored Treatises' },
];

const HISTORICAL_YEARS = [
  1891, 1907, 1913, 1916, 1919, 1920, 1923, 1924, 
  1927, 1930, 1932, 1935, 1936, 1942, 1947, 1948, 1949, 1951, 1956
];

export const TimelinePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  const [allEvents, setAllEvents] = useState<TimelineEvent[]>([]);
  const [selectedEra, setSelectedEra] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState<TimelineEvent | null>(null);
  const [relatedRecords, setRelatedRecords] = useState<ArchiveRecord[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeJumpYear, setActiveJumpYear] = useState<number | null>(null);
  const [timelineViewMode, setTimelineViewMode] = useState<'3d-book' | 'list'>('3d-book');

  const { isListening, isSupported, startListening, stopListening } = useVoiceSearch();
  const yearNavRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    archiveService.getTimelineEvents().then((data) => {
      setAllEvents(data);

      // Check query param ?year=... or hash #timeline-event-... or session memory
      const paramYear = searchParams.get('year');
      const sessionYear = sessionStorage.getItem('ambedkar_atlas_timeline_year');
      const targetYear = paramYear ? parseInt(paramYear, 10) : sessionYear ? parseInt(sessionYear, 10) : null;

      if (targetYear) {
        setActiveJumpYear(targetYear);
        setTimeout(() => {
          const el = document.getElementById(`timeline-event-${targetYear}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    });
  }, [searchParams]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleVoiceSearch = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((recognizedText) => {
        setSearchQuery(recognizedText);
      });
    }
  };

  // Jump directly to year
  const handleJumpToYear = (year: number) => {
    setActiveJumpYear(year);
    sessionStorage.setItem('ambedkar_atlas_timeline_year', year.toString());
    setSearchParams({ year: year.toString() });

    const el = document.getElementById(`timeline-event-${year}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Filter events by selected era, type, and search query
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      const matchesEra = selectedEra === 'all' || evt.era.includes(selectedEra);
      if (!matchesEra) return false;

      const matchesType = selectedType === 'all' || evt.dateType === selectedType;
      if (!matchesType) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchSubtitle = evt.subtitle.toLowerCase().includes(q);
      const matchSummary = evt.summary.toLowerCase().includes(q);
      const matchNarrative = evt.detailedNarrative.toLowerCase().includes(q);
      const matchYear = evt.year.toString().includes(q);
      const matchLocation = evt.location.toLowerCase().includes(q);
      const matchCitation = evt.sourceCitation?.toLowerCase().includes(q);

      return matchTitle || matchSubtitle || matchSummary || matchNarrative || matchYear || matchLocation || matchCitation;
    });
  }, [allEvents, selectedEra, selectedType, searchQuery]);

  const handleSelectEvent = async (event: TimelineEvent) => {
    setActiveModalEvent(event);
    sessionStorage.setItem('ambedkar_atlas_timeline_year', event.year.toString());

    if (event.linkedArchiveIds.length > 0) {
      const records: ArchiveRecord[] = [];
      for (const recId of event.linkedArchiveIds) {
        const res = await archiveService.getRecordById(recId);
        if (res.record) records.push(res.record);
      }
      setRelatedRecords(records);
    } else {
      setRelatedRecords([]);
    }
  };

  const handleResetFilters = () => {
    setSelectedEra('all');
    setSelectedType('all');
    setSearchQuery('');
    setActiveJumpYear(null);
    setSearchParams({});
    sessionStorage.removeItem('ambedkar_atlas_timeline_year');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // In 3D Book Mode, make the book the immediate visual focus resting on the wooden background
  if (timelineViewMode === '3d-book') {
    return (
      <div className="w-full min-h-screen">
        <Historical3DBook
          events={allEvents}
          selectedYear={activeJumpYear}
          onSelectEvent={handleSelectEvent}
          onToggleViewMode={setTimelineViewMode}
          viewMode={timelineViewMode}
        />

        {/* Floating Return to Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 z-40 p-3 bg-[#1A120B]/90 text-[#FBF8F2] hover:bg-[#B96535] rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-white/20 cursor-pointer backdrop-blur-md"
            title="Return to top of timeline"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Event Detail Modal with Full Provenance */}
        <EventDetailModal
          event={activeModalEvent}
          onClose={() => setActiveModalEvent(null)}
          relatedRecords={relatedRecords}
        />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Archival Track Header & Mode Switcher */}
      <div className="border-b border-[#DED3C2] pb-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535]">
              Verified Documentary Chronology • 1891–1956
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              100% Source-Grounded Records
            </span>
          </div>

          {/* View Mode Switcher */}
          <div className="flex items-center gap-1 bg-[#FAF4EA] p-1 rounded-xl border border-[#DED3C2]">
            <button
              type="button"
              onClick={() => setTimelineViewMode('3d-book')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer text-[#51483F] hover:text-[#29251F]"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#B96535]" />
              <span>3D Book Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setTimelineViewMode('list')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer bg-[#713F2B] text-white shadow-xs"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Archival Track</span>
            </button>
          </div>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F] tracking-tight">
          Archival Chronology &amp; Records
        </h1>
        <p className="text-sm sm:text-base text-[#51483F] max-w-3xl leading-relaxed">
          Filter and examine 65 years of authenticated milestones (1891–1956) with detailed documentary citations, primary source references, and connected official MEA volumes.
        </p>
      </div>

      {/* Year Quick-Jump Scrubber Control */}
      <div className="bg-[#FAF4EA] border border-[#DED3C2] rounded-2xl p-4 shadow-xs space-y-2">
        <div className="flex items-center justify-between text-xs text-[#713F2B] font-semibold uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#B96535]" />
            Jump Directly to Historical Year (1891–1956):
          </span>
          {activeJumpYear && (
            <span className="text-[#B96535] font-bold">
              Active Focus: {activeJumpYear}
            </span>
          )}
        </div>

        {/* Scrollable Year Chips */}
        <div 
          ref={yearNavRef}
          className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-[#DED3C2]"
        >
          {HISTORICAL_YEARS.map((yr) => {
            const isSelected = activeJumpYear === yr;
            return (
              <button
                key={yr}
                onClick={() => handleJumpToYear(yr)}
                className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition-all shrink-0 cursor-pointer ${
                  isSelected
                    ? 'bg-[#B96535] text-white shadow-xs scale-105'
                    : 'bg-[#F5EBDD] text-[#29251F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
                }`}
                title={`Jump to year ${yr}`}
              >
                {yr}
              </button>
            );
          })}
        </div>
      </div>

      {/* Timeline Controls: Search + Voice Input + Epoch & Type Filters */}
      <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-5 shadow-xs space-y-5">
        
        {/* Search Bar with Integrated Voice Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search historical chronology: 'Mahad', 'Poona Pact', '1949', 'Constitution', 'Columbia'..."
              className="w-full pl-11 pr-12 py-3 text-sm bg-[#FFF] border border-[#DED3C2] rounded-xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:ring-2 focus:ring-[#B96535]"
            />
            <Search className="w-4 h-4 text-[#827567] absolute left-3.5 top-3.5 pointer-events-none" />

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              title={isListening ? 'Listening... click to stop' : 'Search by voice'}
              className={`absolute right-2 top-2 p-2 rounded-lg transition-colors cursor-pointer ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-[#827567] hover:text-[#B96535] hover:bg-[#F5EBDD]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {(searchQuery || selectedEra !== 'all' || selectedType !== 'all' || activeJumpYear) && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-3 bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#713F2B] text-xs font-semibold rounded-xl border border-[#DED3C2] transition-colors flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Dual Filters: Epoch & Event Type */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2 border-t border-[#DED3C2]">
          
          {/* Epoch Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#713F2B] uppercase tracking-wider">
              <Filter className="w-3.5 h-3.5" />
              <span>Filter by Epoch:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {ERAS.map((era) => (
                <button
                  key={era.id}
                  onClick={() => setSelectedEra(era.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    selectedEra === era.id
                      ? 'bg-[#B96535] text-white font-semibold shadow-xs'
                      : 'bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
                  }`}
                >
                  <span>{era.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Event Type Filter */}
          <div>
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[#713F2B] uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Filter by Date Type:</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {EVENT_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer ${
                    selectedType === type.id
                      ? 'bg-[#713F2B] text-white font-semibold shadow-xs'
                      : 'bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
                  }`}
                >
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Results Count & Voice Status Indicator */}
        <div className="text-xs text-[#827567] flex items-center justify-between pt-2 border-t border-[#DED3C2]">
          <span>
            Displaying <strong>{filteredEvents.length}</strong> authenticated milestone{filteredEvents.length === 1 ? '' : 's'} (1891–1956)
          </span>
          {isListening && (
            <span className="text-[#B96535] font-semibold animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#B96535]" />
              Voice recognition active... Speak clearly into microphone
            </span>
          )}
        </div>

      </div>

      {/* Archival Linear Milestone Track */}
      <TimelineTrack
        events={filteredEvents}
        selectedEvent={activeModalEvent}
        onSelectEvent={handleSelectEvent}
      />

      {/* Floating Return to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-[#29251F] text-[#FBF8F2] hover:bg-[#B96535] rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-[#3E3830] cursor-pointer"
          title="Return to top of timeline"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Event Detail Modal with Full Provenance */}
      <EventDetailModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        relatedRecords={relatedRecords}
      />

    </div>
  );
};
