import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArchiveRecord } from '../types';
import { archiveService } from '../services/archiveService';
import { FacsimileViewer } from '../components/viewer/FacsimileViewer';
import { TranscriptionReader } from '../components/viewer/TranscriptionReader';
import { AudioNarrationPlayer } from '../components/viewer/AudioNarrationPlayer';
import { CitationModal } from '../components/viewer/CitationModal';
import { ArchiveCard } from '../components/archive/ArchiveCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { 
  ArrowLeft, Bookmark, Share2, Quote, ShieldCheck, Calendar, 
  MapPin, Globe, FileText, Sparkles, BookOpen, Layers, CheckCircle2 
} from 'lucide-react';
import { useBookmarks } from '../context/BookmarkContext';
import { useToast } from '../context/ToastContext';

export const ViewerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [record, setRecord] = useState<ArchiveRecord | null>(null);
  const [relatedRecords, setRelatedRecords] = useState<ArchiveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'original' | 'transcription' | 'summary' | 'translation'>('transcription');
  const [citationModalOpen, setCitationModalOpen] = useState(false);

  const { isBookmarked, toggleBookmark } = useBookmarks();
  const { showToast } = useToast();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    archiveService.getRecordById(id).then(({ record: found, relatedRecords: related }) => {
      setRecord(found);
      setRelatedRecords(related);
      setLoading(false);
      // Auto default tab based on format
      if (found?.format === 'manuscript' || found?.format === 'photo') {
        setActiveTab('original');
      } else {
        setActiveTab('transcription');
      }
    });
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <LoadingSkeleton count={3} type="card" />
      </div>
    );
  }

  if (!record) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="font-serif text-3xl font-bold text-[#29251F]">Archival Record Not Found</h2>
        <p className="text-sm text-[#827567]">The requested item could not be retrieved from the primary catalog.</p>
        <Link
          to="/archive"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#B96535] text-white rounded-lg text-sm font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const bookmarked = isBookmarked(record.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Breadcrumbs and Back Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#827567] pb-4 border-b border-[#DED3C2]">
        <div className="flex items-center gap-2">
          <Link to="/" className="hover:text-[#29251F]">Home</Link>
          <span>/</span>
          <Link to="/archive" className="hover:text-[#29251F]">Archive</Link>
          <span>/</span>
          <span className="capitalize text-[#713F2B] font-medium">{record.category}</span>
          <span>/</span>
          <span className="text-[#29251F] font-semibold truncate max-w-[200px]">{record.title}</span>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-[#51483F] hover:text-[#29251F] font-medium transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
      </div>

      {/* Record Title Header Banner */}
      <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-2xl p-6 sm:p-8 shadow-xs space-y-4">
        
        {/* Badges & Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E7D5B9] text-[#713F2B] border border-[#DED3C2]">
              {record.category}
            </span>
            <span className="text-xs text-[#827567] flex items-center gap-1 font-medium">
              <Calendar className="w-3.5 h-3.5" />
              {record.date}
            </span>
            <span className="text-xs text-[#29251F] bg-[#E7D5B9]/50 px-2.5 py-0.5 rounded border border-[#DED3C2]">
              {record.language}
            </span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{record.verificationStatus}</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCitationModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F5EBDD] hover:bg-[#E7D5B9] text-[#29251F] text-xs font-semibold border border-[#DED3C2] transition-colors shadow-2xs"
            >
              <Quote className="w-3.5 h-3.5 text-[#B96535]" />
              <span>Cite</span>
            </button>

            <button
              onClick={() => toggleBookmark(record.id, record.title)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
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

        {/* Description */}
        <p className="text-sm sm:text-base text-[#51483F] leading-relaxed max-w-4xl">
          {record.description}
        </p>

        {/* Provenance Metadata Grid */}
        <div className="pt-4 border-t border-[#DED3C2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[#827567] block">Source Collection:</span>
            <span className="font-medium text-[#29251F]">{record.sourceCollection}</span>
          </div>
          <div>
            <span className="text-[#827567] block">Accession / Archival ID:</span>
            <span className="font-mono text-[#713F2B] font-semibold">{record.accessionNumber}</span>
          </div>
          <div>
            <span className="text-[#827567] block">Era & Period:</span>
            <span className="font-medium text-[#29251F]">{record.era}</span>
          </div>
          <div>
            <span className="text-[#827567] block">Location of Origin:</span>
            <span className="font-medium text-[#29251F]">{record.locationCreated || 'Bombay / New Delhi'}</span>
          </div>
        </div>

      </div>

      {/* Audio Narration Component if available */}
      {record.audioNarration && (
        <AudioNarrationPlayer
          title={record.title}
          durationSeconds={record.audioNarration.durationSeconds}
          durationFormatted={record.audioNarration.durationFormatted}
          narrator={record.audioNarration.narrator}
        />
      )}

      {/* Segmented Viewer Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-[#DED3C2] gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('transcription')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'transcription'
                ? 'bg-[#FBF8F2] text-[#B96535] border-t-2 border-t-[#B96535] border-x border-[#DED3C2]'
                : 'text-[#827567] hover:text-[#29251F]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Transcription</span>
          </button>

          <button
            onClick={() => setActiveTab('original')}
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
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
            className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
              activeTab === 'summary'
                ? 'bg-[#FBF8F2] text-[#B96535] border-t-2 border-t-[#B96535] border-x border-[#DED3C2]'
                : 'text-[#827567] hover:text-[#29251F]'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Historical Summary</span>
          </button>

          {record.translation && (
            <button
              onClick={() => setActiveTab('translation')}
              className={`px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-colors flex items-center gap-2 ${
                activeTab === 'translation'
                  ? 'bg-[#FBF8F2] text-[#B96535] border-t-2 border-t-[#B96535] border-x border-[#DED3C2]'
                  : 'text-[#827567] hover:text-[#29251F]'
              }`}
            >
              <Globe className="w-4 h-4" />
              <span>Translation ({record.translation.language})</span>
            </button>
          )}
        </div>

        {/* Tab Content Panes */}
        <div>
          {activeTab === 'transcription' && (
            <TranscriptionReader
              transcription={record.transcription}
              sourceCollection={record.sourceCollection}
            />
          )}

          {activeTab === 'original' && (
            <FacsimileViewer record={record} />
          )}

          {activeTab === 'summary' && (
            <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#29251F] mb-2">Historical Context & Origin</h3>
                <p className="text-base text-[#51483F] leading-relaxed">
                  {record.summary.historicalContext}
                </p>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#29251F] mb-3">Key Philosophical Themes</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {record.summary.keyThemes.map((theme, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 bg-[#F5EBDD] p-3 rounded-lg border border-[#DED3C2] text-sm text-[#29251F]">
                      <span className="w-2 h-2 rounded-full bg-[#B96535] mt-2 shrink-0" />
                      <span>{theme}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-serif text-xl font-bold text-[#29251F] mb-2">Constitutional & Social Impact</h3>
                <p className="text-base text-[#29251F] bg-[#E7D5B9]/40 border-l-4 border-[#713F2B] p-4 rounded-r-lg leading-relaxed">
                  {record.summary.constitutionalSignificance}
                </p>
              </div>
            </div>
          )}

          {activeTab === 'translation' && record.translation && (
            <div className="bg-[#FBF8F2] border border-[#DED3C2] rounded-xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#DED3C2]">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#713F2B]">
                  Authenticated {record.translation.language} Edition
                </span>
                <span className="text-xs text-[#827567]">Parallel reading authorized</span>
              </div>
              <p className="font-serif text-lg leading-relaxed text-[#29251F] whitespace-pre-wrap">
                {record.translation.text}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Related Archival Items */}
      {relatedRecords.length > 0 && (
        <div className="pt-10 border-t border-[#DED3C2] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-[#B96535] block mb-1">
                Contextual Links
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#29251F]">
                Related Archival Records
              </h3>
            </div>
            <Link to="/archive" className="text-xs font-semibold text-[#B96535] hover:underline">
              Browse full collection →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedRecords.map((rel) => (
              <ArchiveCard key={rel.id} record={rel} viewMode="grid" />
            ))}
          </div>
        </div>
      )}

      {/* Citation Modal Dialog */}
      <CitationModal
        isOpen={citationModalOpen}
        onClose={() => setCitationModalOpen(false)}
        citations={record.citations}
        title={record.title}
      />

    </div>
  );
};
