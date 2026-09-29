import { MEA_INGESTED_VOLUMES, MeaVolumeRecord, ExtractedPage } from '../data/mea/ingestedVolumes';

export interface MeaSearchResult {
  id: string;
  volumeId: string;
  volumeTitle: string;
  volumeNumber: string;
  part: string | null;
  language: 'English' | 'Hindi';
  chapterTitle?: string;
  pdfPageNumber: number;
  bookPageNumber?: number | null;
  snippet: string;
  matchedTerm: string;
  score: number;
  originalPdfUrl: string;
  viewerUrl: string;
}

export interface MeaSearchFilters {
  language?: 'all' | 'English' | 'Hindi';
  volume?: string;
}

class MeaSearchService {
  /**
   * Search across all ingested MEA volumes and extracted pages
   */
  search(query: string, filters?: MeaSearchFilters): MeaSearchResult[] {
    const rawQuery = query.trim();
    if (!rawQuery) return [];

    const lowerQuery = rawQuery.toLowerCase();
    const queryTokens = lowerQuery.split(/\s+/).filter((t) => t.length > 1);
    const results: MeaSearchResult[] = [];

    // Filter volumes by language and volume if specified
    const candidateVolumes = MEA_INGESTED_VOLUMES.filter((vol) => {
      if (filters?.language && filters.language !== 'all' && vol.language !== filters.language) {
        return false;
      }
      if (filters?.volume && filters.volume !== 'all' && vol.volume !== filters.volume) {
        return false;
      }
      return true;
    });

    for (const vol of candidateVolumes) {
      // 1. Search in Extracted Pages if available
      if (vol.extractedPages && vol.extractedPages.length > 0) {
        for (const page of vol.extractedPages) {
          const lowerText = page.text.toLowerCase();
          
          // Exact phrase match (Highest score)
          if (lowerText.includes(lowerQuery)) {
            const idx = lowerText.indexOf(lowerQuery);
            const start = Math.max(0, idx - 80);
            const end = Math.min(page.text.length, idx + lowerQuery.length + 120);
            const snippet = (start > 0 ? '...' : '') + page.text.substring(start, end).trim() + (end < page.text.length ? '...' : '');

            results.push({
              id: `${vol.id}-p${page.pdfPageNumber}-${idx}`,
              volumeId: vol.id,
              volumeTitle: vol.title,
              volumeNumber: vol.volume,
              part: vol.part,
              language: vol.language,
              chapterTitle: page.chapterTitle,
              pdfPageNumber: page.pdfPageNumber,
              bookPageNumber: page.bookPageNumber,
              snippet,
              matchedTerm: rawQuery,
              score: 100 + (page.chapterTitle?.toLowerCase().includes(lowerQuery) ? 20 : 0),
              originalPdfUrl: `${vol.originalUrl}#page=${page.pdfPageNumber}`,
              viewerUrl: `/archive/${vol.id}?page=${page.pdfPageNumber}&q=${encodeURIComponent(rawQuery)}`,
            });
            continue;
          }

          // Token match across page text
          const matchedTokenCount = queryTokens.filter((token) => lowerText.includes(token)).length;
          if (queryTokens.length > 0 && matchedTokenCount === queryTokens.length) {
            const firstToken = queryTokens[0];
            const idx = lowerText.indexOf(firstToken);
            const start = Math.max(0, idx - 60);
            const end = Math.min(page.text.length, idx + 140);
            const snippet = (start > 0 ? '...' : '') + page.text.substring(start, end).trim() + (end < page.text.length ? '...' : '');

            results.push({
              id: `${vol.id}-p${page.pdfPageNumber}-tokens`,
              volumeId: vol.id,
              volumeTitle: vol.title,
              volumeNumber: vol.volume,
              part: vol.part,
              language: vol.language,
              chapterTitle: page.chapterTitle,
              pdfPageNumber: page.pdfPageNumber,
              bookPageNumber: page.bookPageNumber,
              snippet,
              matchedTerm: rawQuery,
              score: 60 + matchedTokenCount * 5,
              originalPdfUrl: `${vol.originalUrl}#page=${page.pdfPageNumber}`,
              viewerUrl: `/archive/${vol.id}?page=${page.pdfPageNumber}&q=${encodeURIComponent(rawQuery)}`,
            });
          }
        }
      }

      // 2. Search Table of Contents chapters and Volume Description
      for (const tocItem of vol.tableOfContents) {
        if (tocItem.title.toLowerCase().includes(lowerQuery)) {
          results.push({
            id: `${vol.id}-toc-${tocItem.startPage}`,
            volumeId: vol.id,
            volumeTitle: vol.title,
            volumeNumber: vol.volume,
            part: vol.part,
            language: vol.language,
            chapterTitle: tocItem.title,
            pdfPageNumber: tocItem.startPage,
            bookPageNumber: null,
            snippet: `${tocItem.title} (${tocItem.part || 'Treatise'}) — Official chapter index in ${vol.title}.`,
            matchedTerm: rawQuery,
            score: 80,
            originalPdfUrl: `${vol.originalUrl}#page=${tocItem.startPage}`,
            viewerUrl: `/archive/${vol.id}?page=${tocItem.startPage}&q=${encodeURIComponent(rawQuery)}`,
          });
        }
      }

      // 3. Search Volume Title & Themes
      const titleMatches = vol.title.toLowerCase().includes(lowerQuery);
      const themeMatches = vol.keyThemes.some((t) => t.toLowerCase().includes(lowerQuery));
      const volNumMatches = lowerQuery === `vol ${vol.volume}` || lowerQuery === `volume ${vol.volume}` || lowerQuery === `vol. ${vol.volume}` || lowerQuery === `खण्ड ${vol.volume}`;

      if (titleMatches || themeMatches || volNumMatches) {
        results.push({
          id: `${vol.id}-title`,
          volumeId: vol.id,
          volumeTitle: vol.title,
          volumeNumber: vol.volume,
          part: vol.part,
          language: vol.language,
          chapterTitle: 'Complete Volume Overview',
          pdfPageNumber: 1,
          bookPageNumber: 1,
          snippet: vol.description,
          matchedTerm: rawQuery,
          score: volNumMatches ? 95 : 70,
          originalPdfUrl: `${vol.originalUrl}#page=1`,
          viewerUrl: `/archive/${vol.id}?page=1&q=${encodeURIComponent(rawQuery)}`,
        });
      }
    }

    // Sort by relevance score descending
    return results.sort((a, b) => b.score - a.score).slice(0, 40);
  }

  /**
   * Retrieve a specific volume by ID
   */
  getVolumeById(id: string): MeaVolumeRecord | undefined {
    return MEA_INGESTED_VOLUMES.find((v) => v.id === id);
  }

  /**
   * Get all volumes
   */
  getAllVolumes(): MeaVolumeRecord[] {
    return MEA_INGESTED_VOLUMES;
  }
}

export const meaSearchService = new MeaSearchService();
