import { ArchiveRecord, CitationFormat } from '../types';

export interface CitationOptions {
  pageNumber?: number;
  pageRange?: string;
  isTranslation?: boolean;
}

export interface FormattedCitations {
  formats: CitationFormat;
  documentMetadata: {
    author: string;
    title: string;
    publicationDate: string;
    dateType: string;
    sourceVolume?: string;
    part?: string | null;
    pageCited: string;
    publisher: string;
    sourceUrl: string;
    accessDate: string;
    verificationStatus: string;
    isTranslation: boolean;
  };
}

/**
 * Scholarly Citation Engine
 * Adheres strictly to Chicago Manual of Style (17th ed.) Notes and Bibliography,
 * APA (7th ed.), MLA (9th ed.), and standardized BibTeX.
 */
export const citationService = {
  formatCitations(record: ArchiveRecord, options?: CitationOptions): FormattedCitations {
    const author = record.author || 'Dr. B. R. Ambedkar';
    const authorFormal = 'Ambedkar, Bhimrao Ramji';
    const authorApa = 'Ambedkar, B. R.';
    const title = record.title;
    const year = record.year;
    const publisher = record.publisher || 'Ministry of External Affairs, Government of India';
    const volume = record.sourceVolume;
    const part = record.part;
    const sourceUrl = record.originalPdfUrl || record.sourceUrl || record.mediaUrl || 'https://www.mea.gov.in/books-writings-of-ambedkar.htm';
    
    // Page citation resolution
    let pageCited = '';
    let pageSuffixChicago = '';
    let pageSuffixApa = '';
    let pageSuffixMla = '';
    let pageSuffixCompact = '';

    if (options?.pageNumber) {
      pageCited = `p. ${options.pageNumber}`;
      pageSuffixChicago = `, ${options.pageNumber}`;
      pageSuffixApa = `, p. ${options.pageNumber}`;
      pageSuffixMla = `, p. ${options.pageNumber}`;
      pageSuffixCompact = `, p. ${options.pageNumber}`;
    } else if (options?.pageRange) {
      pageCited = `pp. ${options.pageRange}`;
      pageSuffixChicago = `, ${options.pageRange}`;
      pageSuffixApa = `, pp. ${options.pageRange}`;
      pageSuffixMla = `, pp. ${options.pageRange}`;
      pageSuffixCompact = `, pp. ${options.pageRange}`;
    } else if (record.pageRange) {
      pageCited = `pp. ${record.pageRange}`;
      pageSuffixChicago = `, ${record.pageRange}`;
      pageSuffixApa = `, pp. ${record.pageRange}`;
      pageSuffixMla = `, pp. ${record.pageRange}`;
      pageSuffixCompact = `, pp. ${record.pageRange}`;
    } else {
      pageCited = 'Entire Document';
    }

    const todayStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const translationNotice = options?.isTranslation 
      ? ' [Translated text. Original composed in ' + (record.language || 'English') + '].' 
      : '';

    // Volume notation
    const volStr = volume ? `Vol. ${volume}${part ? `, Pt. ${part}` : ''}` : '';
    const volPrefixChicago = volume ? ` Dr. Babasaheb Ambedkar: Writings and Speeches, ${volStr}.` : '';

    // 1. Chicago Notes & Bibliography (Historian Standard)
    let chicago: string;
    if (record.category === 'speeches') {
      chicago = `${authorFormal}. "${title}." Delivered ${record.date}. In ${record.sourceCollection}${volPrefixChicago ? ` (${volStr})` : ''}${pageSuffixChicago}. ${publisher}, ${year}.${translationNotice} ${sourceUrl}.`;
    } else if (record.category === 'photographs') {
      chicago = `${publisher}. ${title}. Photograph, ${record.date}. ${record.sourceCollection}. ${sourceUrl}.`;
    } else if (record.category === 'manuscripts') {
      chicago = `${authorFormal}. ${title}. Manuscript facsimile, ${record.date}. ${record.sourceCollection}${pageSuffixChicago}. ${sourceUrl}.`;
    } else {
      chicago = `${authorFormal}. ${title}.${volPrefixChicago} New Delhi: ${publisher}, ${year}${pageSuffixChicago}.${translationNotice} ${sourceUrl}.`;
    }

    // 2. Compact Archival Citation (Concise reference for notes)
    const compactVol = volume ? `BAWS Vol. ${volume}` : record.sourceCollection;
    const compact = `${authorApa}, "${title}", ${compactVol}${pageSuffixCompact} (${publisher}, ${year}).`;

    // 3. APA 7th Edition
    let apa: string;
    if (record.category === 'speeches') {
      apa = `${authorApa} (${year}, ${record.date}). ${title} [Speech]. ${record.sourceCollection}${pageSuffixApa}. ${sourceUrl}`;
    } else {
      apa = `${authorApa} (${year}). ${title}${volume ? ` (Vol. ${volume})` : ''}${pageSuffixApa}. ${publisher}. ${sourceUrl}`;
    }

    // 4. MLA 9th Edition
    let mla: string;
    if (record.category === 'speeches') {
      mla = `${authorFormal}. "${title}." ${record.date}. ${record.sourceCollection}${volume ? `, vol. ${volume}` : ''}, ${publisher}, ${year}${pageSuffixMla}.${translationNotice} Web. Accessed ${todayStr}.`;
    } else {
      mla = `${authorFormal}. ${title}.${volume ? ` Vol. ${volume},` : ''} ${publisher}, ${year}${pageSuffixMla}.${translationNotice} Web. <${sourceUrl}>.`;
    }

    // 5. BibTeX Entry
    const bibId = `ambedkar_${record.id.replace(/[^a-zA-Z0-9]/g, '_')}${options?.pageNumber ? `_p${options.pageNumber}` : ''}`;
    let bibtex: string;
    if (record.category === 'speeches') {
      bibtex = `@inproceedings{${bibId},
  author    = {Ambedkar, Bhimrao Ramji},
  title     = {${title}},
  booktitle = {${record.sourceCollection}},
  year      = {${year}},
  note      = {Delivered on ${record.date}},
  publisher = {${publisher}},
  url       = {${sourceUrl}}${options?.pageNumber ? `,\n  pages     = {${options.pageNumber}}` : ''}
}`;
    } else {
      bibtex = `@book{${bibId},
  author    = {Ambedkar, Bhimrao Ramji},
  title     = {${title}},
  publisher = {${publisher}},
  year      = {${year}}${volume ? `,\n  volume    = {${volume}}` : ''}${options?.pageNumber ? `,\n  pages     = {${options.pageNumber}}` : ''},
  url       = {${sourceUrl}}
}`;
    }

    return {
      formats: {
        chicago,
        compact,
        apa,
        mla,
        bibtex,
      },
      documentMetadata: {
        author,
        title,
        publicationDate: record.date,
        dateType: record.dateType || 'first_published',
        sourceVolume: volStr,
        part: record.part,
        pageCited,
        publisher,
        sourceUrl,
        accessDate: todayStr,
        verificationStatus: record.verificationStatus,
        isTranslation: !!options?.isTranslation,
      },
    };
  },
};
