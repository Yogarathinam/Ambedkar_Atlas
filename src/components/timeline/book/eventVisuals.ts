// Mapping of verified historical timeline events to authentic visual assets and layout types
import slidePortraitBook from '../../../assets/kiosk/processed/slide-portrait-book.webp';
import slideLibraryStudy from '../../../assets/kiosk/processed/slide-library-study.webp';
import slideStatuePointing from '../../../assets/kiosk/processed/slide-statue-pointing.webp';
import slideBronzeConstitution from '../../../assets/kiosk/processed/slide-bronze-constitution.webp';
import slideParliamentMonument from '../../../assets/kiosk/processed/slide-parliament-monument.webp';
import slideHeritageBronze from '../../../assets/kiosk/processed/slide-heritage-bronze.webp';
import ambedkarPortrait from '../../../assets/hero/ambedkar-portrait.webp';
import ambedkarLogo from '../../../assets/hero/image.png';

export type SpreadLayoutType = 'constitutional' | 'scholarship' | 'movement' | 'address';

export interface EventVisualMeta {
  image: string;
  imageCaption: string;
  layoutType: SpreadLayoutType;
  accentBadge: string;
}

export const EVENT_VISUAL_MAP: Record<string, EventVisualMeta> = {
  'birth-mhow-1891': {
    image: ambedkarPortrait,
    imageCaption: 'Birthplace memorial & young Bhimrao Sakpal at Mhow Cantonment',
    layoutType: 'movement',
    accentBadge: 'Early Life & Formative Years',
  },
  'matriculation-bombay-1907': {
    image: slidePortraitBook,
    imageCaption: 'Bhimrao at matriculation; receiving the biography of the Buddha from K. A. Keluskar',
    layoutType: 'scholarship',
    accentBadge: 'Historic Educational Milestone',
  },
  'columbia-university-admission-1913': {
    image: slideLibraryStudy,
    imageCaption: 'Columbia University Low Library, Morningside Heights, New York (1913–1916)',
    layoutType: 'scholarship',
    accentBadge: 'Gaekwad Scholar in New York',
  },
  'castes-in-india-paper-1916': {
    image: slideLibraryStudy,
    imageCaption: 'Manuscript presentation: "Castes in India: Their Mechanism, Genesis and Development"',
    layoutType: 'scholarship',
    accentBadge: 'First Seminal Anthropological Treatise',
  },
  'admission-lse-grays-inn-1916': {
    image: slideLibraryStudy,
    imageCaption: 'London School of Economics & Political Science (LSE) and The Honourable Society of Gray\'s Inn',
    layoutType: 'scholarship',
    accentBadge: 'Advanced Jurisprudence & Economics',
  },
  'southborough-committee-testimony-1919': {
    image: slideParliamentMonument,
    imageCaption: 'Memorandum on Franchise presented to the Southborough Committee in Bombay',
    layoutType: 'address',
    accentBadge: 'First Political Testimony on Franchise',
  },
  'mooknayak-founding-1920': {
    image: slidePortraitBook,
    imageCaption: 'Facsimile front page of "Mooknayak" (Leader of the Voiceless), founded 31 January 1920',
    layoutType: 'movement',
    accentBadge: 'Pioneering Independent Dalit Press',
  },
  'dsc-economics-problem-rupee-1923': {
    image: slideLibraryStudy,
    imageCaption: 'Award of Doctor of Science (Economics) at University of London; "The Problem of the Rupee"',
    layoutType: 'scholarship',
    accentBadge: 'Monetary Economics Masterwork',
  },
  'bahishkrit-hitakarini-sabha-1924': {
    image: slideHeritageBronze,
    imageCaption: 'Founding motto adopted at Damodar Hall: "Educate, Agitate, Organise"',
    layoutType: 'movement',
    accentBadge: 'Institutional Emancipation Platform',
  },
  'mahad-satyagraha-1927': {
    image: slideStatuePointing,
    imageCaption: 'The historic assertion of civic rights at Chavadar Tank, Mahad (20 March 1927)',
    layoutType: 'movement',
    accentBadge: 'Declaration of Human Rights at Mahad',
  },
  'manusmriti-dahan-1927': {
    image: slideStatuePointing,
    imageCaption: 'Mahad Conference resolution declaring all human beings born equal and free',
    layoutType: 'movement',
    accentBadge: 'Rejection of Feudal Social Inequity',
  },
  'first-round-table-conference-1930': {
    image: slideParliamentMonument,
    imageCaption: 'St. James\'s Palace, London: Plenary address on self-government and Depressed Classes',
    layoutType: 'address',
    accentBadge: 'Constitutional Representation in London',
  },
  'poona-pact-signing-1932': {
    image: slidePortraitBook,
    imageCaption: 'The agreement between Dr. Ambedkar and caste Hindu leadership at Yerwada Central Jail',
    layoutType: 'constitutional',
    accentBadge: '148 Reserved Assembly Seats Secured',
  },
  'yeola-declaration-1935': {
    image: slideStatuePointing,
    imageCaption: 'Historic address at Yeola: "I was born a Hindu, but I solemnly assure you I will not die a Hindu"',
    layoutType: 'movement',
    accentBadge: 'Historic Spiritual Emancipation Decree',
  },
  'annihilation-of-caste-1936': {
    image: slideLibraryStudy,
    imageCaption: 'First self-published edition of "Annihilation of Caste" (May 1936), Bombay',
    layoutType: 'scholarship',
    accentBadge: 'Magnum Opus of Social Democracy',
  },
  'independent-labour-party-1936': {
    image: slideHeritageBronze,
    imageCaption: 'Formation of the Independent Labour Party (ILP) representing peasants and industrial workers',
    layoutType: 'movement',
    accentBadge: 'Working-Class & Democratic Representation',
  },
  'labour-member-viceroys-council-1942': {
    image: slideParliamentMonument,
    imageCaption: 'Ministerial portfolio: Introduction of 8-hour work day, women\'s maternity benefits, and power projects',
    layoutType: 'constitutional',
    accentBadge: 'National Labour & River Valley Architecture',
  },
  'chairman-drafting-committee-1947': {
    image: slideBronzeConstitution,
    imageCaption: 'Appointment as Chairman of the Constitution Drafting Committee by the Constituent Assembly',
    layoutType: 'constitutional',
    accentBadge: 'Architect of the Sovereign Republic',
  },
  'introduction-draft-constitution-1948': {
    image: slideBronzeConstitution,
    imageCaption: 'Presenting the 315-article Draft Constitution to the Constituent Assembly on 4 November 1948',
    layoutType: 'constitutional',
    accentBadge: 'Foundational Constitutional Debate',
  },
  'grammar-of-anarchy-speech-1949': {
    image: slideParliamentMonument,
    imageCaption: 'Concluding address: "Political democracy must be made a social democracy. We must abandon bloody methods..."',
    layoutType: 'address',
    accentBadge: 'The Immortal Grammar of Anarchy',
  },
  'adoption-constitution-india-1949': {
    image: slideBronzeConstitution,
    imageCaption: 'Formal signing and adoption of the Constitution of India in Constitution Hall, New Delhi',
    layoutType: 'constitutional',
    accentBadge: 'Birth of Modern Constitutional India',
  },
  'resignation-cabinet-hindu-code-1951': {
    image: slideParliamentMonument,
    imageCaption: 'Statement on resignation from Prime Minister Nehru\'s Cabinet championing women\'s property and divorce rights',
    layoutType: 'constitutional',
    accentBadge: 'Principled Stand on Women\'s Equality',
  },
  'deekshabhoomi-conversion-1956': {
    image: slideHeritageBronze,
    imageCaption: 'The historic mass conversion to Buddhism taking the 22 Vows at Deekshabhoomi, Nagpur (14 October 1956)',
    layoutType: 'movement',
    accentBadge: 'The Great Dhamma Revolution',
  },
  'completion-buddha-and-his-dhamma-1956': {
    image: slidePortraitBook,
    imageCaption: 'Final manuscript of "The Buddha and His Dhamma", completed at 26 Alipur Road, Delhi',
    layoutType: 'scholarship',
    accentBadge: 'Final Philosophical Opus & Mahaparinirvana',
  },
};

export const DEFAULT_EVENT_VISUAL: EventVisualMeta = {
  image: ambedkarLogo,
  imageCaption: 'Dr. Babasaheb Ambedkar: Archival Record',
  layoutType: 'movement',
  accentBadge: 'Historical Milestone',
};
