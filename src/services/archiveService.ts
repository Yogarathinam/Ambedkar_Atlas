import { ArchiveRecord, TimelineEvent, ResearchQA, FilterState, DeviceMode } from '../types';
import { ARCHIVE_RECORDS } from '../data/archiveRecords';
import { TIMELINE_EVENTS } from '../data/timelineEvents';
import { RESEARCH_KNOWLEDGE_BASE } from '../data/researchQA';
import { MEA_INGESTED_VOLUMES, MeaVolumeRecord } from '../data/mea/ingestedVolumes';
import { meaSearchService } from './meaSearchService';

// Simulated artificial latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BOOKMARKS_KEY = 'ambedkar_atlas_bookmarks';
const RECENT_SEARCHES_KEY = 'ambedkar_atlas_recent_searches';
const DEVICE_MODE_KEY = 'ambedkar_atlas_device_mode';

/**
 * Adapter to map MEA volume record into the standard ArchiveRecord interface
 */
export function mapMeaVolumeToArchiveRecord(vol: MeaVolumeRecord): ArchiveRecord {
  return {
    id: vol.id,
    title: vol.title,
    category: 'writings',
    date: `${vol.publicationYear || 1979}`,
    year: vol.publicationYear || 1979,
    era: '1936-1946: Annihilation of Caste & Labour Movement',
    language: vol.language === 'English' ? 'English' : 'Hindi',
    format: 'document',
    description: vol.description,
    shortDescription: vol.description.slice(0, 160) + '...',
    sourceCollection: 'Ministry of External Affairs (MEA), Government of India',
    verificationStatus: 'Archival Master',
    accessionNumber: `MEA-CWBA-VOL-${vol.volume}${vol.part ? `-PT-${vol.part}` : ''}`,
    mediaUrl: vol.originalUrl,
    transcription: vol.extractedPages?.[0]?.text || vol.description,
    summary: {
      historicalContext: `Official publication of Dr. Babasaheb Ambedkar Writings and Speeches Volume ${vol.volume}, published by Government of India.`,
      keyThemes: vol.keyThemes,
      constitutionalSignificance: 'Official primary repository published under the authority of Dr. Ambedkar Foundation and the Ministry of External Affairs.'
    },
    citations: {
      apa: `Ambedkar, B. R. (${vol.publicationYear || 1979}). Dr. Babasaheb Ambedkar: Writings and Speeches (Vol. ${vol.volume}). Ministry of External Affairs, Government of India.`,
      chicago: `Ambedkar, Bhimrao Ramji. Dr. Babasaheb Ambedkar: Writings and Speeches. Vol. ${vol.volume}. New Delhi: Ministry of External Affairs, Government of India, ${vol.publicationYear || 1979}.`,
      mla: `Ambedkar, B. R. Dr. Babasaheb Ambedkar: Writings and Speeches. Vol. ${vol.volume}, Ministry of External Affairs, Government of India, ${vol.publicationYear || 1979}.`,
      bibtex: `@book{ambedkar_mea_vol${vol.volume},\n  title={Dr. Babasaheb Ambedkar: Writings and Speeches (Vol. ${vol.volume})},\n  author={Ambedkar, B. R.},\n  publisher={Ministry of External Affairs, Government of India},\n  year={${vol.publicationYear || 1979}}\n}`
    },
    tags: vol.tags,
    relatedRecordIds: []
  };
}

export const archiveService = {
  /**
   * Fetch archive records with asynchronous filtering, searching, and sorting
   */
  async getRecords(filters: FilterState): Promise<{ records: ArchiveRecord[]; totalCount: number }> {
    await delay(180);

    // Merge baseline archive records with mapped MEA volumes
    const meaRecords = MEA_INGESTED_VOLUMES.map(mapMeaVolumeToArchiveRecord);
    let result = [...ARCHIVE_RECORDS, ...meaRecords];

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      result = result.filter((item) => 
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        (item.transcription && item.transcription.toLowerCase().includes(q)) ||
        item.sourceCollection.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category && filters.category !== 'all') {
      result = result.filter((item) => item.category === filters.category);
    }

    // Era filter
    if (filters.era && filters.era !== 'all') {
      result = result.filter((item) => item.era === filters.era);
    }

    // Language filter
    if (filters.language && filters.language !== 'all') {
      result = result.filter((item) => item.language === filters.language);
    }

    // Format filter
    if (filters.format && filters.format !== 'all') {
      result = result.filter((item) => item.format === filters.format);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'date-desc':
        result.sort((a, b) => b.year - a.year);
        break;
      case 'date-asc':
        result.sort((a, b) => a.year - b.year);
        break;
      case 'title-asc':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'relevance':
      default:
        result.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return 0;
        });
        break;
    }

    return {
      records: result,
      totalCount: result.length,
    };
  },

  /**
   * Get single record by ID with related records
   */
  async getRecordById(id: string): Promise<{ record: ArchiveRecord | null; relatedRecords: ArchiveRecord[] }> {
    await delay(120);

    // 1. Check primary archive records
    let record = ARCHIVE_RECORDS.find((r) => r.id === id) || null;

    // 2. Check MEA Ingested Volumes
    if (!record) {
      const meaVol = MEA_INGESTED_VOLUMES.find((v) => v.id === id);
      if (meaVol) {
        record = mapMeaVolumeToArchiveRecord(meaVol);
      }
    }

    if (!record) {
      return { record: null, relatedRecords: [] };
    }

    const relatedRecords = ARCHIVE_RECORDS.filter(
      (r) => record?.relatedRecordIds.includes(r.id) || (r.category === record?.category && r.id !== record?.id)
    ).slice(0, 3);

    return { record, relatedRecords };
  },

  /**
   * Get MEA Volume by ID
   */
  getMeaVolumeById(id: string): MeaVolumeRecord | undefined {
    return MEA_INGESTED_VOLUMES.find((v) => v.id === id);
  },

  /**
   * Get all MEA volumes
   */
  getAllMeaVolumes(): MeaVolumeRecord[] {
    return MEA_INGESTED_VOLUMES;
  },

  /**
   * Get featured records for Homepage showcase
   */
  async getFeaturedRecords(): Promise<ArchiveRecord[]> {
    await delay(120);
    return ARCHIVE_RECORDS.filter((r) => r.featured).slice(0, 6);
  },

  /**
   * Get timeline events
   */
  async getTimelineEvents(era?: string): Promise<TimelineEvent[]> {
    await delay(150);
    let events = [...TIMELINE_EVENTS];
    if (era && era !== 'all') {
      events = events.filter((e) => e.era.includes(era) || e.era === era);
    }
    return events.sort((a, b) => a.year - b.year);
  },

  /**
   * Global Search across both primary archives and MEA volumes
   */
  async searchGlobal(query: string): Promise<ArchiveRecord[]> {
    await delay(150);
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();

    const baselineMatches = ARCHIVE_RECORDS.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      (item.transcription && item.transcription.toLowerCase().includes(q))
    );

    const meaMatches = MEA_INGESTED_VOLUMES.filter((v) =>
      v.title.toLowerCase().includes(q) ||
      v.description.toLowerCase().includes(q) ||
      v.keyThemes.some((t) => t.toLowerCase().includes(q)) ||
      v.tableOfContents.some((c) => c.title.toLowerCase().includes(q))
    ).map(mapMeaVolumeToArchiveRecord);

    return [...baselineMatches, ...meaMatches];
  },

  /**
   * AI Research Assistant with source-aware retrieval across MEA documents
   */
  async askResearchAssistant(query: string): Promise<ResearchQA> {
    await delay(600); // Simulate multi-step archival retrieval and synthesis
    const qLower = query.toLowerCase().trim();

    // 1. Search MEA ingested volumes for exact documentary evidence
    const meaMatches = meaSearchService.search(query);
    if (meaMatches.length > 0) {
      const topMatch = meaMatches[0];
      const secondMatch = meaMatches.length > 1 ? meaMatches[1] : null;

      const citations = [
        {
          marker: '[1]',
          recordId: topMatch.volumeId,
          title: `${topMatch.volumeTitle} (Page ${topMatch.pdfPageNumber})`,
          source: `Ministry of External Affairs, Govt. of India • Vol. ${topMatch.volumeNumber}, p. ${topMatch.pdfPageNumber}`,
          year: 1979,
          quoteSnippet: topMatch.snippet,
        }
      ];

      if (secondMatch && (secondMatch.volumeId !== topMatch.volumeId || secondMatch.pdfPageNumber !== topMatch.pdfPageNumber)) {
        citations.push({
          marker: '[2]',
          recordId: secondMatch.volumeId,
          title: `${secondMatch.volumeTitle} (Page ${secondMatch.pdfPageNumber})`,
          source: `Ministry of External Affairs, Govt. of India • Vol. ${secondMatch.volumeNumber}, p. ${secondMatch.pdfPageNumber}`,
          year: 1979,
          quoteSnippet: secondMatch.snippet,
        });
      }

      return {
        id: `mea-rag-${Date.now()}`,
        query,
        keywords: [topMatch.volumeTitle, topMatch.chapterTitle || 'MEA Document'],
        summary: `Documentary evidence from the official Writings and Speeches of Dr. Babasaheb Ambedkar (${topMatch.volumeTitle}) addresses this inquiry directly.`,
        paragraphs: [
          `In "${topMatch.chapterTitle || topMatch.volumeTitle}" (recorded in Volume ${topMatch.volumeNumber}, page ${topMatch.pdfPageNumber}), Dr. Ambedkar writes [1]: "${topMatch.snippet.replace(/\.\.\./g, '').trim()}".`,
          `This document is preserved in the official archival collection published by the Ministry of External Affairs and Dr. Ambedkar Foundation, Government of India.`,
          secondMatch 
            ? `Furthermore, related corroborating analysis appears in Volume ${secondMatch.volumeNumber} (page ${secondMatch.pdfPageNumber}) [2]: "${secondMatch.snippet.replace(/\.\.\./g, '').trim()}".`
            : `Visitors can open the verified facsimile or search the full text directly at the referenced page in the interactive reader.`
        ],
        citations,
        suggestedFollowUps: [
          `Open Volume ${topMatch.volumeNumber} at page ${topMatch.pdfPageNumber}`,
          `Explore all chapters in ${topMatch.volumeTitle}`,
          'Examine related debates in the Constituent Assembly'
        ]
      };
    }

    // 2. Direct or fuzzy match with curated knowledge base
    const matched = RESEARCH_KNOWLEDGE_BASE.find((item) => {
      const titleMatch = item.query.toLowerCase().includes(qLower) || qLower.includes(item.query.toLowerCase());
      const keywordMatch = item.keywords.some((kw) => qLower.includes(kw));
      return titleMatch || keywordMatch;
    });

    if (matched) {
      return matched;
    }

    // 3. Fallback answer when no direct documentary passage is found
    return {
      id: `no-evidence-${Date.now()}`,
      query,
      keywords: ['archive', 'inquiry'],
      summary: `No direct passage in the ingested MEA documents specifically addresses the inquiry "${query}".`,
      paragraphs: [
        `Our source-aware retrieval system scanned the official Writings and Speeches of Dr. Babasaheb Ambedkar published by the Ministry of External Affairs, but did not find an exact matching citation for this specific phrasing.`,
        `Dr. Ambedkar's foundational philosophy consistently centers on constitutional morality, social democracy, and the total eradication of institutional caste inequality [1].`,
        `You can explore the catalogue or search by specific treatise titles such as "Annihilation of Caste", "States and Minorities", or "Thoughts on Linguistic States".`
      ],
      citations: [
        {
          marker: '[1]',
          recordId: 'mea-english-vol-1',
          title: 'Dr. Babasaheb Ambedkar Writings and Speeches Vol. 1',
          source: 'Ministry of External Affairs, Government of India',
          year: 1979,
          quoteSnippet: 'Political democracy cannot last unless there lies at the base of it social democracy.'
        }
      ],
      suggestedFollowUps: [
        'What did Ambedkar write about caste and division of labour?',
        'What were Ambedkar’s proposals for linguistic states?',
        'What took place during the historic 1927 Mahad Satyagraha?'
      ]
    };
  },

  // Bookmark storage helpers
  getBookmarks(): string[] {
    try {
      const raw = localStorage.getItem(BOOKMARKS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveBookmarks(ids: string[]): void {
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(ids));
    } catch (e) {
      console.error('Failed to save bookmarks', e);
    }
  },

  toggleBookmark(id: string): boolean {
    const current = this.getBookmarks();
    const exists = current.includes(id);
    const updated = exists ? current.filter((x) => x !== id) : [...current, id];
    this.saveBookmarks(updated);
    return !exists;
  },

  // Recent Searches helpers
  getRecentSearches(): string[] {
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  saveRecentSearch(query: string): void {
    if (!query.trim()) return;
    try {
      const current = this.getRecentSearches();
      const updated = [query.trim(), ...current.filter((q) => q.toLowerCase() !== query.trim().toLowerCase())].slice(0, 8);
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save search query', e);
    }
  },

  addRecentSearch(query: string): void {
    this.saveRecentSearch(query);
  },

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error('Failed to clear recent searches', e);
    }
  },

  // Device Mode persistence
  getDeviceMode(): DeviceMode {
    try {
      const mode = localStorage.getItem(DEVICE_MODE_KEY);
      return ['desktop', 'mobile', 'kiosk', 'tv'].includes(mode || '') ? (mode as DeviceMode) : 'desktop';
    } catch {
      return 'desktop';
    }
  },

  getStoredDeviceMode(): DeviceMode {
    return this.getDeviceMode();
  },

  setDeviceMode(mode: DeviceMode): void {
    try {
      localStorage.setItem(DEVICE_MODE_KEY, mode);
    } catch (e) {
      console.error('Failed to set device mode', e);
    }
  },

  setStoredDeviceMode(mode: DeviceMode): void {
    this.setDeviceMode(mode);
  }
};
