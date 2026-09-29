export interface IndianLanguage {
  code: string;
  name: string;
  nativeName: string;
  script: string;
}

export const EIGHTH_SCHEDULE_LANGUAGES: IndianLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English (Original)', script: 'Latin' },
  { code: 'as', name: 'Assamese', nativeName: 'অসমীয়া', script: 'Bengali-Assamese' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', script: 'Bengali' },
  { code: 'brx', name: 'Bodo', nativeName: 'बड़ो', script: 'Devanagari' },
  { code: 'doi', name: 'Dogri', nativeName: 'डोगरी', script: 'Devanagari' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', script: 'Gujarati' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', script: 'Devanagari' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'ks', name: 'Kashmiri', nativeName: 'کٲشُر / डोगरी', script: 'Perso-Arabic / Devanagari' },
  { code: 'kok', name: 'Konkani', nativeName: 'कोंकणी', script: 'Devanagari' },
  { code: 'mai', name: 'Maithili', nativeName: 'मैथिली', script: 'Devanagari' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', script: 'Malayalam' },
  { code: 'mni', name: 'Manipuri (Meitei)', nativeName: 'মৈতৈলোন্ / ꯃꯤꯇꯩꯂꯣꯟ', script: 'Bengali / Meitei Mayek' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', script: 'Devanagari' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली', script: 'Devanagari' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', script: 'Odia' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', script: 'Gurmukhi' },
  { code: 'sa', name: 'Sanskrit', nativeName: 'संस्कृतम्', script: 'Devanagari' },
  { code: 'sat', name: 'Santali', nativeName: 'ᱥᱟᱱᱛᱟᱲᱤ / संथाली', script: 'Ol Chiki / Devanagari' },
  { code: 'sd', name: 'Sindhi', nativeName: 'سنڌي / सिन्धी', script: 'Perso-Arabic / Devanagari' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', script: 'Tamil' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', script: 'Telugu' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', script: 'Perso-Arabic' },
];
