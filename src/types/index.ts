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

export type VerificationStatus = 'Archival Master' | 'Verified Facsimile' | 'Historical Transcription' | 'Sample Prototype Asset';

export interface CitationFormat {
  apa: string;
  chicago: string;
  mla: string;
  bibtex: string;
}

export interface ArchiveRecord {
  id: string;
  title: string;
  category: ArchiveCategory;
  date: string;
  year: number;
  era: ArchiveEra;
  language: ArchiveLanguage;
  format: 'document' | 'audio' | 'video' | 'photo' | 'manuscript';
  description: string;
  shortDescription: string;
  sourceCollection: string;
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
}

export interface TimelineEvent {
  id: string;
  year: number;
  exactDate: string;
  era: ArchiveEra;
  title: string;
  subtitle: string;
  summary: string;
  detailedNarrative: string;
  location: string;
  archivalQuote?: {
    text: string;
    source: string;
  };
  historicalSignificance: string;
  linkedArchiveIds: string[];
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
