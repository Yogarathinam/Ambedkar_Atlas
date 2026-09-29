import React, { useState, useEffect } from 'react';
import { TimelineEvent, ArchiveEra, ArchiveRecord } from '../types';
import { archiveService } from '../services/archiveService';
import { TimelineTrack } from '../components/timeline/TimelineTrack';
import { EventDetailModal } from '../components/timeline/EventDetailModal';
import { Clock, Filter, Sparkles, BookOpen } from 'lucide-react';

const ERAS: { id: string; label: string; period: string }[] = [
  { id: 'all', label: 'All Eras', period: '1891–1956' },
  { id: '1891-1912', label: 'Early Life & Columbia', period: '1891–1912' },
  { id: '1913-1923', label: 'LSE & Gray\'s Inn', period: '1913–1923' },
  { id: '1924-1935', label: 'Mahad & Poona Pact', period: '1924–1935' },
  { id: '1936-1946', label: 'Annihilation of Caste', period: '1936–1946' },
  { id: '1947-1951', label: 'Constitution & Cabinet', period: '1947–1951' },
  { id: '1952-1956', label: 'Buddhist Revival', period: '1952–1956' },
];

export const TimelinePage: React.FC = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [selectedEra, setSelectedEra] = useState('all');
  const [activeModalEvent, setActiveModalEvent] = useState<TimelineEvent | null>(null);
  const [relatedRecords, setRelatedRecords] = useState<ArchiveRecord[]>([]);

  useEffect(() => {
    archiveService.getTimelineEvents(selectedEra).then((data) => {
      setEvents(data);
    });
  }, [selectedEra]);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="border-b border-[#DED3C2] pb-6">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block mb-1">
          Historical Chronology
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#29251F]">
          A Life Dedicated to Human Liberty
        </h1>
        <p className="text-sm sm:text-base text-[#51483F] mt-2 max-w-3xl leading-relaxed">
          Traverse the six defining epochs in the life and struggle of Dr. B. R. Ambedkar. Click or press Enter on any landmark event to inspect archival quotes, historical analysis, and linked primary catalog items.
        </p>
      </div>

      {/* Epoch Filter Bar */}
      <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold text-[#713F2B] uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5" />
          <span>Select Historical Epoch:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {ERAS.map((era) => (
            <button
              key={era.id}
              onClick={() => setSelectedEra(era.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedEra === era.id
                  ? 'bg-[#B96535] text-white shadow-xs'
                  : 'bg-[#F5EBDD] text-[#51483F] border border-[#DED3C2] hover:bg-[#E7D5B9]'
              }`}
            >
              <span>{era.label}</span>
              <span className="text-[10px] opacity-80 block font-normal">{era.period}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Interactive Track */}
      <TimelineTrack
        events={events}
        selectedEvent={activeModalEvent}
        onSelectEvent={handleSelectEvent}
      />

      {/* Archival Detail Modal */}
      <EventDetailModal
        event={activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        relatedRecords={relatedRecords}
      />

    </div>
  );
};
