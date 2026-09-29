import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { ArchiveRecord, TimelineEvent } from '../types';
import { archiveService } from '../services/archiveService';
import { InteractivePdfViewer } from '../components/viewer/InteractivePdfViewer';
import { FacsimileViewer } from '../components/viewer/FacsimileViewer';
import { TranscriptionReader } from '../components/viewer/TranscriptionReader';
import { CitationModal } from '../components/viewer/CitationModal';
import { ArchiveCard } from '../components/archive/ArchiveCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  ArrowLeft, Bookmark, Quote, Calendar, 
  FileText, BookOpen, Layers, CheckCircle2, 
  ArrowRight, ShieldCheck, ExternalLink
} from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';

export const ViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [record, setRecord] = useState<ArchiveRecord | null>(null);
  const [relatedRecords, setRelatedRecords] = useState<ArchiveRecord[]>([]);
  const [linkedTimelineEvent, setLinkedTimelineEvent] = useState<TimelineEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'transcription' | 'original' | 'summary'>('transcription');
  const [citationModalOpen, setCitationModalOpen] = useState(false);

  const { isBookmarked, toggleBookmark } = useBookmarks();

  const meaVolume = id ? archiveService.getMeaVolumeById(id) : undefined;
  const pageParam = searchParams.get('page');
  const initialPage = pageParam ? parseInt(pageParam, 10) : undefined;
  const initialQuery = searchParams.get('q') || '';

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    archiveService.getRecordById(id).then(({ record: found, relatedRecords: related }) => {
      setRecord(found);
      setRelatedRecords(related);
      setLoading(false);
      if (found?.format === 'manuscript' || found?.format === 'photo') {
        setActiveTab('original');
      } else {
        setActiveTab('transcription');
      }

      // Check for related timeline events
      archiveService.getTimelineEvents().then((events) => {
        const matched = events.find(
          (e) => e.linkedArchiveIds.includes(id) || (found?.linkedTimelineYear && e.year === found.linkedTimelineYear)
        );
        if (matched) {
          setLinkedTimelineEvent(matched);
        }
      });
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[600px]">
        <LoadingSkeleton count={3} type="card" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#29251F]">Archival Record Not Found</h2>
        <p className="text-sm text-[#827567]">The requested item could not be retrieved from the primary or MEA catalog.</p>
        <Link
          to="/archive"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B96535] text-white rounded-xl text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(record.id);

  const fromTimeline = searchParams.get('from') === 'timeline';
  const timelineYearParam = searchParams.get('year');
  const returnYear = timelineYearParam || (fromTimeline ? sessionStorage.getItem('ambedkar_atlas_timeline_year') : null) || (linkedTimelineEvent ? linkedTimelineEvent.year.toString() : null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Return to Timeline Banner when navigated from historical event */}
      {returnYear && (
        <div className="bg-[#FAF4EA] border-2 border-[#B96535] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#B96535] text-white flex items-center justify-center font-serif font-bold text-sm shrink-0">
              {returnYear}
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#B96535] block">
                Navigated from Historical Timeline ({returnYear})
              </span>
              <p className="text-xs sm:text-sm text-[#29251F] font-semibold">
                Viewing official source document at verified page {initialPage}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sessionStorage.setItem('ambedkar_atlas_timeline_year', returnYear);
              navigate(`/timeline?year=${returnYear}#timeline-event-${returnYear}`);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#29251F] hover:bg-[#713F2B] text-white rounded-xl text-xs font-bold transition-all shadow-2xs shrink-0 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Historical Timeline (Year {returnYear})</span>
          </button>
        </div>
      )}

      {/* Compact Breadcrumbs & Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#827567] pb-3 border-b border-[#DED3C2]">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-[#29251F]">Home</Link>
          <span>/</span>
          <Link to="/archive" className="hover:text-[#29251F]">Archive</Link>
          <span>/</span>
          {meaVolume ? (
            <span className="text-[#B96535] font-semibold">Official Books & Writings (MEA)</span>
          ) : (
            <span className="capitalize text-[#713F2B] font-medium">{record.category}</span>
          )}
          <span>/</span>
          <span className="text-[#29251F] font-semibold truncate max-w-[260px]">{record.title}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-[#51483F] hover:text-[#29251F] font-semibold transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Document Header & Metadata Banner */}
      <div className="bg-[#FBF8F2] border-2 border-[#DED3C2] rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        
        {/* Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7D5B9] text-[#713F2B] border border-[#DED3C2]">
              {meaVolume ? 'MEA Official Edition' : record.category}
            </span>
            <span className="text-xs text-[#827567] flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5 text-[#B96535]" />
              {record.date}
            </span>
            <span className="text-xs text-[#29251F] bg-[#E7D5B9]/50 px-2.5 py-0.5 rounded-lg border border-[#DED3C2]">
              {record.language}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{record.verificationStatus}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCitationModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#29251F] text-xs font-semibold border border-[#DED3C2] transition-colors shadow-2xs cursor-pointer"
              title="Cite this archival document"
            >
              <Quote className="w-3.5 h-3.5 text-[#B96535]" />
              <span>Cite Document</span>
            </button>

            <button
              onClick={() => toggleBookmark(record.id, record.title)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                bookmarked
                  ? 'bg-[#B96535] text-white border-[#B96535]'
                  : 'bg-[#F5EBDD] text-[#29251F] border-[#DED3C2] hover:bg-[#E7D5B9]'
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${bookmarked ? 'fill-current' : ''}`} />
              <span>{bookmarked ? 'Saved' : 'Bookmark'}</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <h1 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-[#29251F] leading-tight">
          {record.title}
        </h1>

        {/* Short Description */}
        <p className="text-sm sm:text-base text-[#51483F] leading-relaxed max-w-4xl">
          {record.description}
        </p>

        {/* Provenance Details */}
        <div className="pt-3 border-t border-[#DED3C2] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#827567] block">Collection:</span>
            <span className="font-medium text-[#29251F]">{record.sourceCollection}</span>
          </div>
          <div>
            <span className="text-[#827567] block">Source Reference:</span>
            <span className="font-mono text-[#713F2B] font-semibold">{record.accessionNumber}</span>
          </div>
          <div>
            <span className="text-[#827567] block">Historical Epoch:</span>
            <span className="font-medium text-[#29251F]">{record.era}</span>
          </div>
          <div>
            <span className="text-[#827567] block">Publisher / Issuing Body:</span>
            <span className="font-medium text-[#29251F]">{record.publisher || 'Government of India (MEA)'}</span>
          </div>
        </div>

      </div>

      {/* Historical Chronology / Timeline Context Banner */}
      {linkedTimelineEvent && (
        <div className="bg-[#FAF4EA] border border-[#DED3C2] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E7D5B9] text-[#713F2B] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-[#B96535]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#B96535]">
                  Historical Chronology Milestone
                </span>
                <span className="text-xs bg-[#B96535] text-white px-2 py-0.2 rounded-full font-bold">
                  {linkedTimelineEvent.year}
                </span>
              </div>
              <p className="text-sm font-serif font-bold text-[#29251F]">
                {linkedTimelineEvent.title}
              </p>
            </div>
          </div>

          <Link
            to={`/timeline?year=${linkedTimelineEvent.year}#timeline-event-${linkedTimelineEvent.year}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#713F2B] text-xs font-semibold border border-[#DED3C2] transition-colors shrink-0 shadow-2xs hover:shadow-xs"
          >
            <span>Locate in Historical Timeline</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Viewer Body: MEA Interactive PDF & Extracted Text Viewer OR Standard Tabs */}
      {meaVolume ? (
        <div className="min-h-[500px]">
          <InteractivePdfViewer
            volume={meaVolume}
            initialPage={initialPage}
            initialQuery={initialQuery}
          />
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex border-b border-[#DED3C2] gap-2">
            <button
              onClick={() => setActiveTab('transcription')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'transcription'
                  ? 'bg-[#FBF8F2] text-[#B96535] border-t-2 border-t-[#B96535] border-x border-[#DED3C2]'
                  : 'text-[#827567] hover:text-[#29251F]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Transcription & Translation</span>
            </button>

            <button
              onClick={() => setActiveTab('original')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'original'
                  ? 'bg-[#FBF8F2] text-[#B96535] border-t-2 border-t-[#B96535] border-x border-[#DED3C2]'
                  : 'text-[#827567] hover:text-[#29251F]'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Original Facsimile</span>
            </button>

            <button
              onClick={() => setActiveTab('summary')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 cursor-pointer ${
                activeTab === 'summary'
                  ? 'bg-[#FBF8F2] text-[#B96535] border-t-2 border-t-[#B96535] border-x border-[#DED3C2]'
                  : 'text-[#827567] hover:text-[#29251F]'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>Historical Summary</span>
            </button>
          </div>

          {activeTab === 'transcription' && (
            <TranscriptionReader
              recordId={record.id}
              transcription={record.transcription}
              sourceCollection={record.sourceCollection}
            />
          )}

          {activeTab === 'original' && (
            <FacsimileViewer
              mediaUrl={record.mediaUrl}
              title={record.title}
              accessionNumber={record.accessionNumber}
            />
          )}

          {activeTab === 'summary' && (
            <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-6 sm:p-8 space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#29251F]">Curatorial & Constitutional Analysis</h3>
              <p className="text-sm text-[#51483F] leading-relaxed">{record.summary.historicalContext}</p>
              <div className="pt-3 border-t border-[#DED3C2]">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#713F2B] mb-2">Core Thematic Pillars:</h4>
                <div className="flex flex-wrap gap-2">
                  {record.summary.keyThemes.map((theme, i) => (
                    <span key={i} className="text-xs bg-[#E7D5B9] text-[#29251F] px-2.5 py-1 rounded-md font-medium">
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Related Archival Entries */}
      {relatedRecords.length > 0 && (
        <div className="pt-8 border-t border-[#DED3C2] space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-xl font-bold text-[#29251F]">Related Archival Records</h3>
            <Link to="/archive" className="text-xs font-semibold text-[#B96535] hover:underline">
              Browse Complete Catalog →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedRecords.map((rel) => (
              <ArchiveCard key={rel.id} record={rel} viewMode="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Scholarly Citation Modal */}
      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        record={record}
        currentPage={initialPage && initialPage > 1 ? initialPage : undefined}
        pageRange={record.pageRange}
        isTranslation={activeTab === 'transcription' && !!record.translation?.isTranslation}
      />

    </div>
  );
};
