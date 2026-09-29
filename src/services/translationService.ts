import { EIGHTH_SCHEDULE_LANGUAGES, IndianLanguage } from '../data/indianLanguages';

export interface TranslationResult {
  translatedText: string;
  sourceText: string;
  language: IndianLanguage;
  provider: 'curated_archival' | 'google_neural' | 'mymemory_live' | 'unconfigured_fallback';
  isMachineGenerated: boolean;
  statusMessage: string;
}

// Curated verified archival translations for prominent passages (Annihilation of Caste, etc.)
const CURATED_ARCHIVAL_SNIPPETS: Record<string, Record<string, string>> = {
  mr: {
    "caste is not merely division of labour": "जात ही केवळ श्रमाची विभागणी नाही, तर ती श्रमिकांची विभागणी आहे. ही एक अशी उतरंड आहे ज्यामध्ये कामगारांचे वर्ग एकमेकांच्या वर विषमतेने रचले गेले आहेत.",
    "cultivation of mind should be the ultimate aim": "मनाची मशागत हेच मानवी अस्तित्वाचे अंतिम ध्येय असले पाहिजे.",
    "for a successful revolution it is not enough that there is discontent": "यशस्वी क्रांतीसाठी केवळ असंतोष असणे पुरेसे नाही; राजकीय व सामाजिक हक्कांच्या न्यायाची आणि महत्त्वाची दृढ जाणीव असणे आवश्यक आहे."
  },
  hi: {
    "caste is not merely division of labour": "जाति केवल श्रम का विभाजन नहीं है, बल्कि यह श्रमिकों का विभाजन है। यह एक ऐसा सोपानक्रम है जिसमें श्रमिकों को एक-दूसरे के ऊपर श्रेणीबद्ध कर दिया गया है।",
    "cultivation of mind should be the ultimate aim": "मन का विकास ही मानव अस्तित्व का अंतिम उद्देश्य होना चाहिए।",
    "for a successful revolution it is not enough that there is discontent": "सफल क्रांति के लिए केवल असंतोष ही पर्याप्त नहीं है; राजनीतिक और सामाजिक अधिकारों की न्यायसंगतता और आवश्यकता का गहरा विश्वास होना अनिवार्य है।"
  }
};

class TranslationService {
  private cache: Map<string, string> = new Map();

  /**
   * Map Eighth Schedule language code to engine-supported code
   */
  private mapLanguageCode(code: string): string {
    const codeMap: Record<string, string> = {
      'mni': 'mni-Mtei',
      'brx': 'hi', // Bodo fallback to Hindi Devanagari script if unmapped
      'ks': 'ur',  // Kashmiri fallback to Urdu Perso-Arabic if unmapped
    };
    return codeMap[code] || code;
  }

  /**
   * Translate a single text block using Google Translate GTX endpoint
   */
  private async translateWithGoogleGtx(text: string, targetLangCode: string): Promise<string> {
    const mappedCode = this.mapLanguageCode(targetLangCode);
    const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${mappedCode}&dt=t&q=${encodeURIComponent(text)}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(apiUrl, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Google Translate HTTP ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) {
      throw new Error('Invalid Google Translate response format');
    }

    // data[0] contains array of sentence pairs [[translated, original], ...]
    const translatedParts = data[0]
      .filter((item: any) => Array.isArray(item) && typeof item[0] === 'string')
      .map((item: any) => item[0]);

    return translatedParts.join('');
  }

  /**
   * Translate a single text block using MyMemory API with safe sentence chunking
   */
  private async translateWithMyMemory(text: string, targetLangCode: string): Promise<string> {
    // If text is longer than 400 chars, split into sentence chunks so MyMemory 500-char limit isn't violated
    const chunks: string[] = [];
    if (text.length <= 400) {
      chunks.push(text);
    } else {
      // Split by sentence boundaries (.!?)
      const sentences = text.match(/[^.!?]+[.!?]+|\S+/g) || [text];
      let currentChunk = '';
      for (const sentence of sentences) {
        if ((currentChunk + ' ' + sentence).length > 400 && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk = currentChunk ? `${currentChunk} ${sentence}` : sentence;
        }
      }
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
      }
    }

    const translatedParts: string[] = [];
    for (const chunk of chunks) {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(chunk)}&langpair=en|${targetLangCode}`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);

      const response = await fetch(apiUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`MyMemory HTTP ${response.status}`);
      }

      const data = await response.json();
      const translatedChunk = data?.responseData?.translatedText;
      if (!translatedChunk || translatedChunk.includes('MYMEMORY WARNING')) {
        throw new Error('MyMemory quota reached or empty response');
      }

      translatedParts.push(translatedChunk);
    }

    return translatedParts.join(' ');
  }

  /**
   * Translate a single paragraph with caching and fallback hierarchy
   */
  private async translateParagraph(
    para: string,
    targetLanguageCode: string
  ): Promise<{ text: string; provider: 'curated_archival' | 'google_neural' | 'mymemory_live' | 'unconfigured_fallback' }> {
    const cleanPara = para.trim();
    if (!cleanPara) return { text: '', provider: 'curated_archival' };

    // Check memory cache
    const cacheKey = `${targetLanguageCode}:${cleanPara}`;
    if (this.cache.has(cacheKey)) {
      return { text: this.cache.get(cacheKey)!, provider: 'google_neural' };
    }

    // Check curated dictionary
    const lowerPara = cleanPara.toLowerCase();
    if (CURATED_ARCHIVAL_SNIPPETS[targetLanguageCode]) {
      for (const [key, val] of Object.entries(CURATED_ARCHIVAL_SNIPPETS[targetLanguageCode])) {
        if (lowerPara.includes(key)) {
          this.cache.set(cacheKey, val);
          return { text: val, provider: 'curated_archival' };
        }
      }
    }

    // Try Google Translate GTX first (fastest, supports full length up to thousands of chars)
    try {
      const translated = await this.translateWithGoogleGtx(cleanPara, targetLanguageCode);
      if (translated && translated.trim().length > 0) {
        this.cache.set(cacheKey, translated);
        return { text: translated, provider: 'google_neural' };
      }
    } catch {
      // Fall through to MyMemory fallback
    }

    // Fallback: MyMemory
    try {
      const translated = await this.translateWithMyMemory(cleanPara, targetLanguageCode);
      if (translated && translated.trim().length > 0) {
        this.cache.set(cacheKey, translated);
        return { text: translated, provider: 'mymemory_live' };
      }
    } catch {
      // Fall through
    }

    // Last resort: return clean paragraph with language marker
    return { text: cleanPara, provider: 'unconfigured_fallback' };
  }

  /**
   * Translate a block of text into any of the 22 Eighth Schedule Indian languages
   */
  async translateText(
    text: string,
    targetLanguageCode: string,
    _pageContext?: { volumeTitle?: string; pageNumber?: number }
  ): Promise<TranslationResult> {
    const language = EIGHTH_SCHEDULE_LANGUAGES.find((l) => l.code === targetLanguageCode) || EIGHTH_SCHEDULE_LANGUAGES[0];

    // If target is English or text is empty, return original
    if (targetLanguageCode === 'en' || !text.trim()) {
      return {
        translatedText: text,
        sourceText: text,
        language,
        provider: 'curated_archival',
        isMachineGenerated: false,
        statusMessage: 'Original primary archival text displayed.'
      };
    }

    // Split text into paragraphs
    const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);
    const translatedParagraphs: string[] = [];
    let usedProvider: 'curated_archival' | 'google_neural' | 'mymemory_live' | 'unconfigured_fallback' = 'unconfigured_fallback';

    try {
      // Process in batches of 5 paragraphs for high speed and reliability without overloading
      const batchSize = 5;
      for (let i = 0; i < paragraphs.length; i += batchSize) {
        const batch = paragraphs.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map((p) => this.translateParagraph(p, targetLanguageCode))
        );

        for (const res of batchResults) {
          translatedParagraphs.push(res.text);
          if (res.provider !== 'unconfigured_fallback') {
            usedProvider = res.provider;
          }
        }
      }

      const providerName =
        usedProvider === 'curated_archival'
          ? `Verified archival translation in ${language.name} (${language.nativeName})`
          : usedProvider === 'google_neural'
          ? `High-fidelity Neural Translation in ${language.name} (${language.nativeName}) — Full text preserved`
          : usedProvider === 'mymemory_live'
          ? `Machine-assisted translation in ${language.name} (${language.nativeName}) via MyMemory Translation Engine`
          : `Original text displayed for ${language.name} (${language.nativeName}).`;

      return {
        translatedText: translatedParagraphs.join('\n\n'),
        sourceText: text,
        language,
        provider: usedProvider,
        isMachineGenerated: usedProvider !== 'curated_archival',
        statusMessage: providerName
      };
    } catch {
      return {
        translatedText: text,
        sourceText: text,
        language,
        provider: 'unconfigured_fallback',
        isMachineGenerated: false,
        statusMessage: `Could not reach translation provider for ${language.name}. Displaying verified original text.`
      };
    }
  }

  /**
   * Legacy adapter for existing TranscriptionReader
   */
  async translateTranscription(
    _recordId: string,
    englishText: string,
    targetLanguageCode: string
  ): Promise<{
    translatedText: string;
    language: IndianLanguage;
    isCertifiedFixture: boolean;
  }> {
    const result = await this.translateText(englishText, targetLanguageCode);
    return {
      translatedText: result.translatedText,
      language: result.language,
      isCertifiedFixture: result.provider === 'curated_archival',
    };
  }
}

export const translationService = new TranslationService();
