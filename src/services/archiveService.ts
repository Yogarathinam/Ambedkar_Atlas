import { ArchiveRecord, TimelineEvent, ResearchQA, FilterState, DeviceMode } from '../types';
import { ARCHIVE_RECORDS } from '../data/archiveRecords';
import { TIMELINE_EVENTS } from '../data/timelineEvents';
import { RESEARCH_KNOWLEDGE_BASE } from '../data/researchQA';

// Simulated artificial latency helper
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const BOOKMARKS_KEY = 'ambedkar_atlas_bookmarks';
const RECENT_SEARCHES_KEY = 'ambedkar_atlas_recent_searches';
const DEVICE_MODE_KEY = 'ambedkar_atlas_device_mode';

export const archiveService = {
  /**
   * Fetch archive records with asynchronous filtering, searching, and sorting
   */
  async getRecords(filters: FilterState): Promise<{ records: ArchiveRecord[]; totalCount: number }> {
    await delay(220);

    let result = [...ARCHIVE_RECORDS];

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
        // Featured and earliest master items first
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
    await delay(180);
    const record = ARCHIVE_RECORDS.find((r) => r.id === id) || null;
    if (!record) {
      return { record: null, relatedRecords: [] };
    }

    const relatedRecords = ARCHIVE_RECORDS.filter(
      (r) => record.relatedRecordIds.includes(r.id) || (r.category === record.category && r.id !== record.id)
    ).slice(0, 3);

    return { record, relatedRecords };
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
   * Global Search with keyword snippets
   */
  async searchGlobal(query: string): Promise<ArchiveRecord[]> {
    await delay(200);
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return ARCHIVE_RECORDS.filter((item) =>
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      (item.transcription && item.transcription.toLowerCase().includes(q))
    );
  },

  /**
   * AI Research Assistant simulation with RAG synthesis
   */
  async askResearchAssistant(query: string): Promise<ResearchQA> {
    await delay(750); // Simulate multi-step archival retrieval and synthesis
    const qLower = query.toLowerCase().trim();

    // 1. Direct or fuzzy match with curated knowledge base
    const matched = RESEARCH_KNOWLEDGE_BASE.find((item) => {
      const titleMatch = item.query.toLowerCase().includes(qLower) || qLower.includes(item.query.toLowerCase());
      const keywordMatch = item.keywords.some((kw) => qLower.includes(kw));
      return titleMatch || keywordMatch;
    });

    if (matched) {
      return matched;
    }

    // 2. Dynamic synthesis from matching records if not in exact QA list
    const candidateRecords = ARCHIVE_RECORDS.filter((rec) => {
      return (
        rec.title.toLowerCase().includes(qLower) ||
        rec.description.toLowerCase().includes(qLower) ||
        rec.tags.some((tag) => qLower.includes(tag.toLowerCase()))
      );
    });

    if (candidateRecords.length > 0) {
      const topRecord = candidateRecords[0];
      return {
        id: `dyn-${Date.now()}`,
        query,
        keywords: [topRecord.title, topRecord.category],
        summary: `Based on the digital archive records for "${topRecord.title}", Dr. Ambedkar addressed this theme through rigorous constitutional and sociological analysis.`,
        paragraphs: [
          `In his analysis associated with "${topRecord.title}" (${topRecord.year}), Dr. Ambedkar underscored the critical importance of constitutional morality, self-determination, and the total eradication of institutionalized social disparities [1].`,
          topRecord.summary.historicalContext,
          `The historical significance of this work directly informed key constitutional guarantees regarding equality and fundamental freedoms [1].`
        ],
        citations: [
          {
            marker: '[1]',
            recordId: topRecord.id,
            title: topRecord.title,
            source: topRecord.sourceCollection,
            year: topRecord.year,
            quoteSnippet: topRecord.shortDescription,
          },
        ],
        suggestedFollowUps: [
          `Explore the full transcription of "${topRecord.title}"`,
          'What were the related debates in the Constituent Assembly?',
          'How does this relate to Annihilation of Caste?'
        ],
      };
    }

    // 3. Fallback answer grounded in Dr. Ambedkar's foundational philosophy
    return {
      id: `fallback-${Date.now()}`,
      query,
      keywords: ['archive', 'heritage', 'philosophy'],
      summary: `According to the archival records in the Ambedkar Atlas, Dr. Ambedkar’s life work established that democracy is not merely a form of government, but an attitude of respect and reverence towards fellow human beings.`,
      paragraphs: [
        `While the exact phrase "${query}" is undergoing deeper indexation in our historical repository, Dr. Ambedkar's comprehensive writings consistently emphasize three intertwined pillars: Liberty, Equality, and Fraternity [1].`,
        `His seminal work "Annihilation of Caste" (1936) demonstrates that social democracy is the non-negotiable prerequisite for enduring political freedom [1]. Without social equality, democratic structures remain fragile.`,
        `You can explore the verified catalog entries in the Archive section to inspect original speeches, legislative debates, and presidential addresses related to this inquiry.`
      ],
      citations: [
        {
          marker: '[1]',
          recordId: 'annihilation-of-caste-1936',
          title: 'Annihilation of Caste: With a Reply to Mahatma Gandhi',
          source: 'BAWS Vol. 1',
          year: 1936,
          quoteSnippet: 'Political democracy cannot last unless there lies at the base of it social democracy.'
        }
      ],
      suggestedFollowUps: [
        'What were Dr. Ambedkar’s core arguments in Annihilation of Caste?',
        'Why did Dr. Ambedkar insist on social democracy in his final Constituent Assembly address?',
        'What took place during the historic 1927 Mahad Satyagraha?'
      ]
    };
  },

  // Bookmark storage helpers
  getBookmarks(): string[] {
    try {
      const data = localStorage.getItem(BOOKMARKS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  toggleBookmark(recordId: string): boolean {
    const list = this.getBookmarks();
    const index = list.indexOf(recordId);
    let isBookmarked = false;
    if (index >= 0) {
      list.splice(index, 1);
      isBookmarked = false;
    } else {
      list.push(recordId);
      isBookmarked = true;
    }
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(list));
    } catch {
      // ignore
    }
    return isBookmarked;
  },

  isBookmarked(recordId: string): boolean {
    return this.getBookmarks().includes(recordId);
  },

  // Recent searches storage helpers
  getRecentSearches(): string[] {
    try {
      const data = localStorage.getItem(RECENT_SEARCHES_KEY);
      return data ? JSON.parse(data) : ['Annihilation of Caste', 'Constitution', 'Mahad Satyagraha', 'Poona Pact'];
    } catch {
      return ['Annihilation of Caste', 'Constitution', 'Mahad Satyagraha'];
    }
  },

  addRecentSearch(query: string): void {
    if (!query.trim()) return;
    const list = this.getRecentSearches().filter((q) => q.toLowerCase() !== query.toLowerCase().trim());
    list.unshift(query.trim());
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(list.slice(0, 8)));
    } catch {
      // ignore
    }
  },

  clearRecentSearches(): void {
    try {
      localStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch {
      // ignore
    }
  },

  // Device mode storage helpers
  getStoredDeviceMode(): DeviceMode {
    try {
      const mode = localStorage.getItem(DEVICE_MODE_KEY) as DeviceMode;
      return ['desktop', 'mobile', 'kiosk', 'tv'].includes(mode) ? mode : 'desktop';
    } catch {
      return 'desktop';
    }
  },

  setStoredDeviceMode(mode: DeviceMode): void {
    try {
      localStorage.setItem(DEVICE_MODE_KEY, mode);
    } catch {
      // ignore
    }
  }
};
