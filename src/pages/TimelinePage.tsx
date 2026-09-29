import React, { useState, useEffect, useMemo } from 'react';
import { TimelineEvent, ArchiveRecord } from '../types';
import { archiveService } from '../services/archiveService';
import { TimelineTrack } from '../components/timeline/TimelineTrack';
import { EventDetailModal } from '../components/timeline/EventDetailModal';
import { useVoiceSearch } from '../hooks/useVoiceSearch';
import { Search, Mic, MicOff, Filter, RotateCcw, ArrowUp, Sparkles, CheckCircle2 } from 'lucide-react';

const ERAS: { id: string; label: string; period: string }[] = [
  { id: 'all', label: 'All Epochs', period: '1891–1956' },
  { id: '1891-1912', label: 'Early Life & Education', period: '1891–1912' },
  { id: '1913-1923', label: 'Columbia & London', period: '1913–1923' },
  { id: '1924-1935', label: 'Mahad & Civil Rights', period: '1924–1935' },
  { id: '1936-1946', label: 'Annihilation & Labour', period: '1936–1946' },
  { id: '1947-1951', label: 'Constitution & Law', period: '1947–1951' },
  { id: '1952-1956', label: 'Buddhist Revival', period: '1952–1956' },
];

export const TimelinePage: React.FC = () => {
  const [allEvents, setAllEvents] = useState<TimelineEvent[]>([]);
  const [selectedEra, setSelectedEra] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalEvent, setActiveModalEvent] = useState<TimelineEvent | null>(null);
  const [relatedRecords, setRelatedRecords] = useState<ArchiveRecord[]>([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { isListening, isSupported, startListening, stopListening } = useVoiceSearch();

  useEffect(() => {
    archiveService.getTimelineEvents().then((data) => {
      setAllEvents(data);
    });
  }, []);

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

  // Filter events by selected era and search query
  const filteredEvents = useMemo(() => {
    return allEvents.filter((evt) => {
      const matchesEra = selectedEra === 'all' || evt.era.includes(selectedEra);
      if (!matchesEra) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = evt.title.toLowerCase().includes(q);
      const matchSubtitle = evt.subtitle.toLowerCase().includes(q);
      const matchSummary = evt.summary.toLowerCase().includes(q);
      const matchNarrative = evt.detailedNarrative.toLowerCase().includes(q);
      const matchYear = evt.year.toString().includes(q);
      const matchLocation = evt.location.toLowerCase().includes(q);

      return matchTitle || matchSubtitle || matchSummary || matchNarrative || matchYear || matchLocation;
    });
  }, [allEvents, selectedEra, searchQuery]);

  const handleSelectEvent = async (event: TimelineEvent) => {
    setActiveModalEvent(event);
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
    setSearchQuery('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header Banner */}
      <div className="border-b border-[#DED3C2] pb-6 space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535]">
          Historical Chronology • 1891–1956
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F] tracking-tight">
          A Life Dedicated to Human Liberty
        </h1>
        <p className="text-sm sm:text-base text-[#51483F] max-w-3xl leading-relaxed">
          Traverse the historical milestones of Dr. B. R. Ambedkar across six transformative epochs. Use text or voice search to filter events, or select an event to inspect primary archival citations.
        </p>
      </div>

      {/* Timeline Controls: Search + Voice Input + Epoch Filters */}
      <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-5 shadow-xs space-y-5">
        
        {/* Search Bar with Integrated Voice Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search timeline: 'Mahad', '1949', 'Poona Pact', 'Columbia', 'Constitution'..."
              className="w-full pl-11 pr-12 py-3 text-sm bg-[#FFF] border border-[#DED3C2] rounded-xl text-[#29251F] placeholder-[#827567] focus:outline-none focus:ring-2 focus:ring-[#B96535]"
            />
            <Search className="w-4 h-4 text-[#827567] absolute left-3.5 top-3.5 pointer-events-none" />

            {/* Voice Search Button */}
            <button
              type="button"
              onClick={handleVoiceSearch}
              title={isListening ? 'Listening... click to stop' : 'Search by voice'}
              className={`absolute right-2 top-2 p-2 rounded-lg transition-colors ${
                isListening
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'text-[#827567] hover:text-[#B96535] hover:bg-[#F5EBDD]'
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
          </div>

          {(searchQuery || selectedEra !== 'all') && (
            <button
              onClick={handleResetFilters}
              className="px-4 py-3 bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#713F2B] text-xs font-semibold rounded-xl border border-[#DED3C2] transition-colors flex items-center justify-center gap-1.5 shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* Epoch Filter Pills */}
        <div>
          <div className="flex items-center gap-2 mb-2.5 text-xs font-semibold text-[#713F2B] uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter by Epoch:</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {ERAS.map((era) => (
              <button
                key={era.id}
                onClick={() => setSelectedEra(era.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  selectedEra === era.id
                    ? 'bg-[#B96535] text-white font-semibold shadow-xs'
                    : 'bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
                }`}
              >
                <span>{era.label}</span>
                <span className="text-[10px] opacity-75 block">{era.period}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Results Count Indicator */}
        <div className="text-xs text-[#827567] flex items-center justify-between pt-2 border-t border-[#DED3C2]">
          <span>
            Displaying <strong>{filteredEvents.length}</strong> historical event{filteredEvents.length === 1 ? '' : 's'}
          </span>
          {isListening && (
            <span className="text-[#B96535] font-semibold animate-pulse flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#B96535]" />
              Voice recognition active... Speak clearly into microphone
            </span>
          )}
        </div>

      </div>

      {/* Vertical Animated Timeline Track */}
      <TimelineTrack
        events={filteredEvents}
        selectedEvent={activeModalEvent}
        onSelectEvent={handleSelectEvent}
      />

      {/* Floating Return to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-[#29251F] text-[#FBF8F2] hover:bg-[#B96535] rounded-full shadow-xl transition-all duration-300 hover:scale-110 flex items-center justify-center border border-[#3E3830]"
          title="Return to top of timeline"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Event Detail Modal */}
      <EventDetailModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        relatedRecords={relatedRecords}
      />

    </div>
  );
};
