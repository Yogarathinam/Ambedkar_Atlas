export type DeviceMode = 'desktop' | 'mobile' | 'kiosk' | 'tv';

export type ArchiveCategory = 
  | 'all'
  | 'writings'
  | 'speeches'
  | 'manuscripts'
  | 'photographs'
  | 'audio'
  | 'video'
  | 'records';

export type ArchiveEra = 
  | 'all'
  | '1891-1912: Early Life & Columbia'
  | '1913-1923: LSE, Gray\'s Inn & Early Practice'
  | '1924-1935: Mahad & Poona Pact Epoch'
  | '1936-1946: Annihilation of Caste & Labour Movement'
  | '1947-1951: Drafting Constitution & Law Ministry'
  | '1952-1956: Buddhist Conversion & Final Works';

export type ArchiveLanguage = 'English' | 'Marathi' | 'Hindi' | 'Multilingual';

export type VerificationStatus = 
  | 'Verified Primary Document' 
  | 'Official Archival Facsimile' 
  | 'Historical Transcription' 
  | 'Authoritative External Catalogue'
  | 'Archival Master';

export type DateType = 
  | 'written' 
  | 'work_written'
  | 'delivered' 
  | 'speech_delivered'
  | 'first_published' 
  | 'subsequent_edition' 
  | 'event_occurred';

export interface CitationFormat {
  apa: string;
  chicago: string;
  mla: string;
  bibtex: string;
  compact: string;
}

export interface ArchiveRecord {
  id: string;
  title: string;
  category: ArchiveCategory;
  date: string;
  year: number;
  dateType?: DateType;
  era: ArchiveEra;
  language: ArchiveLanguage;
  format: 'document' | 'audio' | 'video' | 'photo' | 'manuscript';
  description: string;
  shortDescription: string;
  sourceCollection: string;
  sourceVolume?: string;
  part?: string | null;
  pageRange?: string;
  sourceUrl?: string;
  originalPdfUrl?: string;
  publisher?: string;
  author?: string;
  verificationStatus: VerificationStatus;
  accessionNumber: string;
  locationCreated?: string;
  transcription?: string;
  summary: {
    historicalContext: string;
    keyThemes: string[];
    constitutionalSignificance: string;
  };
  translation?: {
    language: string;
    text: string;
    isTranslation: boolean;
    originalLanguage: string;
  };
  audioNarration?: {
    durationSeconds: number;
    durationFormatted: string;
    narrator: string;
    audioUrl?: string;
  };
  mediaUrl?: string;
  thumbnailPlaceholder?: string;
  citations: CitationFormat;
  tags: string[];
  featured?: boolean;
  relatedRecordIds: string[];
  isExternallyCatalogued?: boolean;
  linkedTimelineYear?: number;
}

export interface LinkedWritingReference {
  id: string; // MEA Volume ID, e.g. 'mea-english-vol-1'
  documentId: string;
  title: string;
  volume: string;
  part?: string | null;
  language: 'English' | 'Hindi';
  pdfUrl: string;
  pageNumber?: number | null;
  pageVerified: boolean;
  chapterTitle?: string;
  historicalContext?: string;
}

export interface TimelineEvent {
  id: string;
  year: number;
  exactDate: string;
  dateType: DateType;
  datePrecision?: 'exact' | 'month_year' | 'year_only' | 'circa' | 'disputed';
  era: ArchiveEra;
  title: string;
  subtitle: string;
  summary: string;
  detailedNarrative: string;
  location: string;
  sourceType: 'primary' | 'secondary';
  sourceCitation: string;
  sourceVolume?: string;
  sourcePage?: number | string;
  sourceUrl?: string;
  archivalQuote?: {
    text: string;
    source: string;
  };
  historicalSignificance: string;
  linkedArchiveIds: string[];
  linkedRecordPage?: number;
  linkedWritings?: LinkedWritingReference[];
  imageCaption?: string;
}

export interface ResearchCitation {
  marker: string; // e.g., "[1]"
  recordId: string;
  title: string;
  source: string;
  year: number;
  quoteSnippet: string;
  pageNumber?: number;
  viewerUrl?: string;
  pdfUrl?: string;
}

export interface ResearchQA {
  id: string;
  query: string;
  keywords: string[];
  summary: string;
  paragraphs: string[];
  citations: ResearchCitation[];
  suggestedFollowUps: string[];
}

export interface FilterState {
  searchQuery: string;
  category: ArchiveCategory;
  era: ArchiveEra;
  language: 'all' | ArchiveLanguage;
  format: 'all' | 'document' | 'audio' | 'video' | 'photo' | 'manuscript';
  sortBy: 'relevance' | 'date-desc' | 'date-asc' | 'title-asc';
  viewMode: 'grid' | 'list';
}

export interface CategoryInfo {
  id: ArchiveCategory;
  title: string;
  description: string;
  count: number;
  iconName: string;
}
