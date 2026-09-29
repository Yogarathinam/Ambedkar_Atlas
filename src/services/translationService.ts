import { EIGHTH_SCHEDULE_LANGUAGES, IndianLanguage } from '../data/indianLanguages';

export interface TranslationResult {
  translatedText: string;
  sourceText: string;
  language: IndianLanguage;
  provider: 'curated_archival' | 'mymemory_live' | 'unconfigured_fallback';
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
  /**
   * Translate a block of text into any of the 22 Eighth Schedule Indian languages
   */
  async translateText(
    text: string,
    targetLanguageCode: string,
    pageContext?: { volumeTitle?: string; pageNumber?: number }
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

    // Split text into reasonable chunks (paragraphs) to preserve structure
    const paragraphs = text.split('\n\n').filter((p) => p.trim().length > 0);
    const translatedParagraphs: string[] = [];
    let usedProvider: 'curated_archival' | 'mymemory_live' | 'unconfigured_fallback' = 'unconfigured_fallback';

    try {
      // Translate up to first 8 paragraphs to respect latency and rate limits
      for (const para of paragraphs.slice(0, 8)) {
        const cleanPara = para.trim();
        
        // Check curated dictionary
        const lowerPara = cleanPara.toLowerCase();
        let matchedCurated: string | null = null;
        if (CURATED_ARCHIVAL_SNIPPETS[targetLanguageCode]) {
          for (const [key, val] of Object.entries(CURATED_ARCHIVAL_SNIPPETS[targetLanguageCode])) {
            if (lowerPara.includes(key)) {
              matchedCurated = val;
              break;
            }
          }
        }

        if (matchedCurated) {
          translatedParagraphs.push(matchedCurated);
          usedProvider = 'curated_archival';
          continue;
        }

        // Live API call with timeout
        const queryText = cleanPara.slice(0, 450); // safe chunk size
        const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(queryText)}&langpair=en|${targetLanguageCode}`;

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          const translatedChunk = data?.responseData?.translatedText;
          if (translatedChunk && !translatedChunk.includes('MYMEMORY WARNING')) {
            translatedParagraphs.push(translatedChunk);
            usedProvider = 'mymemory_live';
            continue;
          }
        }

        // Fallback for paragraph if API had issue
        translatedParagraphs.push(`[${language.name} — ${language.nativeName}]\n${cleanPara}`);
      }

      // If document had more paragraphs, append remaining
      if (paragraphs.length > 8) {
        translatedParagraphs.push(`\n... [Remaining ${paragraphs.length - 8} paragraphs retained in original text for performance] ...\n` + paragraphs.slice(8).join('\n\n'));
      }

      return {
        translatedText: translatedParagraphs.join('\n\n'),
        sourceText: text,
        language,
        provider: usedProvider,
        isMachineGenerated: usedProvider === 'mymemory_live',
        statusMessage: usedProvider === 'curated_archival' 
          ? `Verified archival translation in ${language.name} (${language.nativeName})`
          : usedProvider === 'mymemory_live'
          ? `Machine-assisted translation in ${language.name} (${language.nativeName}) via MyMemory Translation Engine`
          : `Translation service standby for ${language.name} (${language.nativeName}). Paragraph structure preserved.`
      };
    } catch {
      // In case of network disconnection, return original text with clear notification
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
    recordId: string,
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
