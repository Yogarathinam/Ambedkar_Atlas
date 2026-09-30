// Mapping of verified historical timeline events to authentic archival photographs and visual plates
import youngAmbedkar from '../../../assets/timeline/young_ambedkar.gif';
import ambedkarColumbia from '../../../assets/timeline/ambedkar_columbia_university.jpg';
import ambedkarLse from '../../../assets/timeline/ambedkar_lse_professors_1916.jpg';
import ambedkarBarrister from '../../../assets/timeline/ambedkar_barrister_1922.jpg';
import ambedkarPoonaPact from '../../../assets/timeline/ambedkar_poona_pact_1932.jpg';
import ambedkarRajagrihaFamily from '../../../assets/timeline/ambedkar_rajagriha_family_1934.jpg';
import ambedkarStudyRajgriha from '../../../assets/timeline/dr_babasaheb_ambedkar_at_home_rajgriha___1946.jpg';
import ambedkarDraftingCommittee from '../../../assets/timeline/ambedkar_drafting_committee_1947.jpg';
import ambedkarSavita from '../../../assets/timeline/ambedkar_savita_1948.jpg';
import ambedkarPresentingConstitution from '../../../assets/timeline/ambedkar_presenting_constitution_1949.jpg';
import ambedkarIn1950 from '../../../assets/timeline/ambedkar_in_1950.jpg';
import ambedkarAddressColumbia from '../../../assets/timeline/ambedkar_address_columbia_1954.jpg';
import ambedkarConversionSpeech from '../../../assets/timeline/ambedkar_conversion_speech_1956.jpg';
import ambedkarPortraitOfficial from '../../../assets/timeline/ambedkar_portrait_official.jpg';
import ambedkarLogo from '../../../assets/hero/image.png';

export type SpreadLayoutType = 'constitutional' | 'scholarship' | 'movement' | 'address';

export interface EventVisualMeta {
  image: string;
  imageCaption: string;
  layoutType: SpreadLayoutType;
  accentBadge: string;
}

export const EVENT_VISUAL_MAP: Record<string, EventVisualMeta> = {
  // 1891: Birth at Mhow Cantonment
  'birth-mhow-1891': {
    image: youngAmbedkar,
    imageCaption: 'Young Bhimrao Sakpal in early youth; born into a Kabir-panthi military family at Mhow (1891)',
    layoutType: 'movement',
    accentBadge: 'Early Life & Formative Years',
  },

  // 1907: Matriculation from Elphinstone High School
  'matriculation-bombay-1907': {
    image: youngAmbedkar,
    imageCaption: 'Bhimrao upon historic matriculation from Elphinstone High School; presented with life of the Buddha (1907)',
    layoutType: 'scholarship',
    accentBadge: 'Historic Educational Milestone',
  },

  // 1913: Columbia University Admission
  'columbia-university-admission-1913': {
    image: ambedkarColumbia,
    imageCaption: 'Dr. B. R. Ambedkar during his academic residency at Columbia University, New York (1913–1916)',
    layoutType: 'scholarship',
    accentBadge: 'Gaekwad Scholar in New York',
  },

  // 1916: Castes in India Paper at Columbia
  'castes-in-india-paper-1916': {
    image: ambedkarColumbia,
    imageCaption: 'Dr. Ambedkar presenting "Castes in India: Their Mechanism, Genesis and Development" before Goldenweiser\'s seminar (1916)',
    layoutType: 'scholarship',
    accentBadge: 'First Seminal Anthropological Treatise',
  },

  // 1916: Admission to LSE & Gray\'s Inn
  'admission-lse-grays-inn-1916': {
    image: ambedkarLse,
    imageCaption: 'Dr. B. R. Ambedkar with his professors and colleagues at the London School of Economics (1916–17)',
    layoutType: 'scholarship',
    accentBadge: 'Advanced Jurisprudence & Economics',
  },

  // 1919: Southborough Committee Testimony
  'southborough-committee-testimony-1919': {
    image: ambedkarBarrister,
    imageCaption: 'Dr. Ambedkar in legal practice; testifying for voting rights before the Southborough Committee in Bombay (1919)',
    layoutType: 'address',
    accentBadge: 'First Political Testimony on Franchise',
  },

  // 1920: Founding of Mooknayak
  'mooknayak-founding-1920': {
    image: ambedkarBarrister,
    imageCaption: 'Dr. Ambedkar upon founding the fortnightly "Mooknayak" (Leader of the Voiceless), 31 January 1920',
    layoutType: 'movement',
    accentBadge: 'Pioneering Independent Dalit Press',
  },

  // 1923: D.Sc. Economics & Problem of the Rupee
  'dsc-economics-problem-rupee-1923': {
    image: ambedkarLse,
    imageCaption: 'Doctor of Science (Economics) conferred by University of London; "The Problem of the Rupee" (1923)',
    layoutType: 'scholarship',
    accentBadge: 'Monetary Economics Masterwork',
  },

  // 1924: Bahishkrit Hitakarini Sabha
  'bahishkrit-hitakarini-sabha-1924': {
    image: ambedkarBarrister,
    imageCaption: 'Barrister Ambedkar founding the Bahishkrit Hitakarini Sabha at Damodar Hall with motto: "Educate, Agitate, Organise" (1924)',
    layoutType: 'movement',
    accentBadge: 'Institutional Emancipation Platform',
  },

  // 1927: Mahad Water Satyagraha
  'mahad-satyagraha-1927': {
    image: ambedkarPoonaPact,
    imageCaption: 'Dr. Ambedkar leading the historic assertion of civic drinking rights at Chavadar Tank, Mahad (20 March 1927)',
    layoutType: 'movement',
    accentBadge: 'Declaration of Human Rights at Mahad',
  },

  // 1927: Manusmriti Dahan
  'manusmriti-dahan-1927': {
    image: ambedkarPoonaPact,
    imageCaption: 'Dr. Ambedkar addressing the Mahad Conference resolution declaring all human beings born equal and free (25 December 1927)',
    layoutType: 'movement',
    accentBadge: 'Rejection of Feudal Social Inequity',
  },

  // 1930: First Round Table Conference
  'first-round-table-conference-1930': {
    image: ambedkarPoonaPact,
    imageCaption: 'St. James\'s Palace, London: Dr. Ambedkar delivering his plenary address on self-government and Depressed Classes (1930)',
    layoutType: 'address',
    accentBadge: 'Constitutional Representation in London',
  },

  // 1932: Poona Pact Signing
  'poona-pact-signing-1932': {
    image: ambedkarPoonaPact,
    imageCaption: 'Dr. Babasaheb Ambedkar, M. R. Jayakar, and Tej Bahadur Sapru at Yerwada Jail on the day of the Poona Pact (24 September 1932)',
    layoutType: 'constitutional',
    accentBadge: '148 Reserved Assembly Seats Secured',
  },

  // 1935: Yeola Declaration
  'yeola-declaration-1935': {
    image: ambedkarRajagrihaFamily,
    imageCaption: 'Dr. Ambedkar with family at Rajagriha; historic Yeola declaration: "I will not die a Hindu" (1934–1935)',
    layoutType: 'movement',
    accentBadge: 'Historic Spiritual Emancipation Decree',
  },

  // 1936: Annihilation of Caste
  'annihilation-of-caste-1936': {
    image: ambedkarStudyRajgriha,
    imageCaption: 'Dr. Ambedkar in his study at Rajagriha; writing and publishing "Annihilation of Caste" (May 1936)',
    layoutType: 'scholarship',
    accentBadge: 'Magnum Opus of Social Democracy',
  },

  // 1936: Independent Labour Party
  'independent-labour-party-1936': {
    image: ambedkarRajagrihaFamily,
    imageCaption: 'Formation of the Independent Labour Party (ILP) representing peasants and industrial workers (1936)',
    layoutType: 'movement',
    accentBadge: 'Working-Class & Democratic Representation',
  },

  // 1942: Labour Member, Viceroy\'s Executive Council
  'labour-member-viceroys-council-1942': {
    image: ambedkarStudyRajgriha,
    imageCaption: 'Dr. Ambedkar working at his desk: Introduction of the 8-hour workday, women\'s maternity benefits, and river valley projects (1942)',
    layoutType: 'constitutional',
    accentBadge: 'National Labour & River Valley Architecture',
  },

  // 1947: Chairman, Constitution Drafting Committee
  'chairman-drafting-committee-1947': {
    image: ambedkarDraftingCommittee,
    imageCaption: 'Dr. Babasaheb Ambedkar, Chairman, with members of the Constitution Drafting Committee (August 1947)',
    layoutType: 'constitutional',
    accentBadge: 'Architect of the Sovereign Republic',
  },

  // 1948: Introduction of Draft Constitution
  'introduction-draft-constitution-1948': {
    image: ambedkarSavita,
    imageCaption: 'Dr. B. R. Ambedkar with Dr. Savita Ambedkar at 1 Hardinge Avenue, New Delhi, while piloting the Draft Constitution (1948)',
    layoutType: 'constitutional',
    accentBadge: 'Foundational Constitutional Debate',
  },

  // 1949: Grammar of Anarchy Address
  'grammar-of-anarchy-speech-1949': {
    image: ambedkarPresentingConstitution,
    imageCaption: 'Concluding address to the Constituent Assembly: "Political democracy must be made a social democracy" (25 November 1949)',
    layoutType: 'address',
    accentBadge: 'The Immortal Grammar of Anarchy',
  },

  // 1949: Adoption of the Constitution of India
  'adoption-constitution-india-1949': {
    image: ambedkarPresentingConstitution,
    imageCaption: 'Dr. Babasaheb Ambedkar, Chairman of the Drafting Committee, presenting the final draft Constitution to Dr. Rajendra Prasad (25 November 1949)',
    layoutType: 'constitutional',
    accentBadge: 'Birth of Modern Constitutional India',
  },

  // 1951: Resignation over Hindu Code Bill
  'resignation-cabinet-hindu-code-1951': {
    image: ambedkarIn1950,
    imageCaption: 'Dr. B. R. Ambedkar as Law Minister: Historic statement upon resigning from Cabinet championing women\'s equal legal rights (1950–1951)',
    layoutType: 'constitutional',
    accentBadge: 'Principled Stand on Women\'s Equality',
  },

  // 1956: Deekshabhoomi Buddhist Conversion
  'deekshabhoomi-conversion-1956': {
    image: ambedkarConversionSpeech,
    imageCaption: 'Dr. Babasaheb Ambedkar delivering his historic conversion address and administering the 22 Vows at Deekshabhoomi, Nagpur (14 October 1956)',
    layoutType: 'movement',
    accentBadge: 'The Great Dhamma Revolution',
  },

  // 1956: Completion of The Buddha and His Dhamma
  'completion-buddha-and-his-dhamma-1956': {
    image: ambedkarPortraitOfficial,
    imageCaption: 'Formal portrait of Babasaheb Dr. B. R. Ambedkar upon completing his final treatise "The Buddha and His Dhamma" (1956)',
    layoutType: 'scholarship',
    accentBadge: 'Final Philosophical Opus & Mahaparinirvana',
  },
};

export const DEFAULT_EVENT_VISUAL: EventVisualMeta = {
  image: ambedkarPortraitOfficial,
  imageCaption: 'Dr. Babasaheb Ambedkar: Archival Record',
  layoutType: 'movement',
  accentBadge: 'Historical Milestone',
};
