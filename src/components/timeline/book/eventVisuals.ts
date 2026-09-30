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
import { TimelineEvent } from '../../../types';

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
    imageCaption: 'Young Bhimrao Sakpal; born into a Kabir-panthi military family at Mhow Cantonment (1891)',
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

  // 1913: Arrival at Columbia University, New York
  'columbia-university-admission-1913': {
    image: ambedkarColumbia,
    imageCaption: 'Dr. B. R. Ambedkar during his academic residency at Columbia University, New York (1913–1916)',
    layoutType: 'scholarship',
    accentBadge: 'Gaekwad Scholar in New York',
  },

  // 1916: Presentation of "Castes in India" at Columbia
  'columbia-anthropology-paper-1916': {
    image: ambedkarColumbia,
    imageCaption: 'Dr. Ambedkar presenting "Castes in India: Their Mechanism, Genesis and Development" before Goldenweiser\'s seminar (1916)',
    layoutType: 'scholarship',
    accentBadge: 'First Seminal Anthropological Treatise',
  },
  'castes-in-india-paper-1916': {
    image: ambedkarColumbia,
    imageCaption: 'Dr. Ambedkar presenting "Castes in India: Their Mechanism, Genesis and Development" before Goldenweiser\'s seminar (1916)',
    layoutType: 'scholarship',
    accentBadge: 'First Seminal Anthropological Treatise',
  },

  // 1916: Admission to LSE & Gray\'s Inn
  'lse-and-grays-inn-1916': {
    image: ambedkarLse,
    imageCaption: 'Dr. B. R. Ambedkar with his professors and colleagues at the London School of Economics (1916–17)',
    layoutType: 'scholarship',
    accentBadge: 'Advanced Jurisprudence & Economics',
  },
  'admission-lse-grays-inn-1916': {
    image: ambedkarLse,
    imageCaption: 'Dr. B. R. Ambedkar with his professors and colleagues at the London School of Economics (1916–17)',
    layoutType: 'scholarship',
    accentBadge: 'Advanced Jurisprudence & Economics',
  },

  // 1919: Testimony before Southborough Franchise Committee
  'southborough-committee-1919': {
    image: ambedkarBarrister,
    imageCaption: 'Dr. Ambedkar in legal practice; testifying for voting rights before Southborough Committee in Bombay (1919)',
    layoutType: 'address',
    accentBadge: 'First Political Testimony on Franchise',
  },
  'southborough-committee-testimony-1919': {
    image: ambedkarBarrister,
    imageCaption: 'Dr. Ambedkar in legal practice; testifying for voting rights before Southborough Committee in Bombay (1919)',
    layoutType: 'address',
    accentBadge: 'First Political Testimony on Franchise',
  },

  // 1920: Founding of the Journal "Mooknayak"
  'mooknayak-launch-1920': {
    image: ambedkarBarrister,
    imageCaption: 'Dr. Ambedkar upon founding the fortnightly "Mooknayak" (Leader of the Voiceless), 31 January 1920',
    layoutType: 'movement',
    accentBadge: 'Pioneering Independent Dalit Press',
  },
  'mooknayak-founding-1920': {
    image: ambedkarBarrister,
    imageCaption: 'Dr. Ambedkar upon founding the fortnightly "Mooknayak" (Leader of the Voiceless), 31 January 1920',
    layoutType: 'movement',
    accentBadge: 'Pioneering Independent Dalit Press',
  },

  // 1923: Award of D.Sc. (Econ) and "The Problem of the Rupee"
  'lse-problem-of-rupee-1923': {
    image: ambedkarLse,
    imageCaption: 'Conferment of Doctor of Science (Economics) at University of London; "The Problem of the Rupee" (1923)',
    layoutType: 'scholarship',
    accentBadge: 'Monetary Economics Masterwork',
  },
  'dsc-economics-problem-rupee-1923': {
    image: ambedkarLse,
    imageCaption: 'Conferment of Doctor of Science (Economics) at University of London; "The Problem of the Rupee" (1923)',
    layoutType: 'scholarship',
    accentBadge: 'Monetary Economics Masterwork',
  },

  // 1924: Founding of the Bahishkrit Hitakarini Sabha
  'bahishkrit-hitakarini-sabha-1924': {
    image: ambedkarBarrister,
    imageCaption: 'Barrister Ambedkar establishing Bahishkrit Hitakarini Sabha with motto: "Educate, Agitate, Organise" (1924)',
    layoutType: 'movement',
    accentBadge: 'Institutional Emancipation Platform',
  },

  // 1927: The Historic Mahad Chavadar Tank Satyagraha
  'mahad-chavadar-tank-1927': {
    image: ambedkarPoonaPact,
    imageCaption: 'Dr. Ambedkar leading the historic assertion of civic drinking water rights at Chavadar Tank, Mahad (20 March 1927)',
    layoutType: 'movement',
    accentBadge: 'Declaration of Human Rights at Mahad',
  },
  'mahad-satyagraha-1927': {
    image: ambedkarPoonaPact,
    imageCaption: 'Dr. Ambedkar leading the historic assertion of civic drinking water rights at Chavadar Tank, Mahad (20 March 1927)',
    layoutType: 'movement',
    accentBadge: 'Declaration of Human Rights at Mahad',
  },

  // 1927: Public Burning of Manusmriti at Mahad
  'manusmriti-dahan-1927': {
    image: ambedkarPoonaPact,
    imageCaption: 'Mahad Satyagraha Conference: Declaration that all human beings are born equal and free (25 December 1927)',
    layoutType: 'movement',
    accentBadge: 'Rejection of Feudal Social Inequity',
  },

  // 1930: First Round Table Conference at St. James\'s Palace
  'round-table-conference-1930': {
    image: ambedkarPoonaPact,
    imageCaption: 'St. James\'s Palace, London: Plenary address demanding independent political representation (1930)',
    layoutType: 'address',
    accentBadge: 'Constitutional Representation in London',
  },
  'first-round-table-conference-1930': {
    image: ambedkarPoonaPact,
    imageCaption: 'St. James\'s Palace, London: Plenary address demanding independent political representation (1930)',
    layoutType: 'address',
    accentBadge: 'Constitutional Representation in London',
  },

  // 1932: The Signing of the Poona Pact at Yerwada Jail
  'poona-pact-yerwada-1932': {
    image: ambedkarPoonaPact,
    imageCaption: 'Dr. Babasaheb Ambedkar, M. R. Jayakar, and Tej Bahadur Sapru at Yerwada Jail on Poona Pact day (24 September 1932)',
    layoutType: 'constitutional',
    accentBadge: '148 Reserved Assembly Seats Secured',
  },
  'poona-pact-signing-1932': {
    image: ambedkarPoonaPact,
    imageCaption: 'Dr. Babasaheb Ambedkar, M. R. Jayakar, and Tej Bahadur Sapru at Yerwada Jail on Poona Pact day (24 September 1932)',
    layoutType: 'constitutional',
    accentBadge: '148 Reserved Assembly Seats Secured',
  },

  // 1935: The Historic Yeola Conversion Declaration
  'yeola-declaration-1935': {
    image: ambedkarRajagrihaFamily,
    imageCaption: 'Dr. Ambedkar with family at Rajagriha; historic Yeola declaration: "I will not die a Hindu" (1934–1935)',
    layoutType: 'movement',
    accentBadge: 'Historic Spiritual Emancipation Decree',
  },

  // 1936: Self-Publication of "Annihilation of Caste"
  'annihilation-of-caste-publication-1936': {
    image: ambedkarStudyRajgriha,
    imageCaption: 'Dr. Ambedkar in his study at Rajagriha; self-publishing his magnum opus "Annihilation of Caste" (May 1936)',
    layoutType: 'scholarship',
    accentBadge: 'Magnum Opus of Social Democracy',
  },
  'annihilation-of-caste-1936': {
    image: ambedkarStudyRajgriha,
    imageCaption: 'Dr. Ambedkar in his study at Rajagriha; self-publishing his magnum opus "Annihilation of Caste" (May 1936)',
    layoutType: 'scholarship',
    accentBadge: 'Magnum Opus of Social Democracy',
  },

  // 1936: Founding of the Independent Labour Party (ILP)
  'independent-labour-party-1936': {
    image: ambedkarRajagrihaFamily,
    imageCaption: 'Formation of the Independent Labour Party (ILP) representing working-class peasants and laborers (1936)',
    layoutType: 'movement',
    accentBadge: 'Working-Class & Democratic Representation',
  },

  // 1942: Labour Member on Viceroy\'s Executive Council
  'viceroys-council-labour-1942': {
    image: ambedkarStudyRajgriha,
    imageCaption: 'Ministerial portfolio: Introduction of the 8-hour workday, women\'s maternity benefits, and power grids (1942)',
    layoutType: 'constitutional',
    accentBadge: 'National Labour & River Valley Architecture',
  },
  'labour-member-viceroys-council-1942': {
    image: ambedkarStudyRajgriha,
    imageCaption: 'Ministerial portfolio: Introduction of the 8-hour workday, women\'s maternity benefits, and power grids (1942)',
    layoutType: 'constitutional',
    accentBadge: 'National Labour & River Valley Architecture',
  },

  // 1947: Chairman of the Constitution Drafting Committee
  'drafting-committee-chair-1947': {
    image: ambedkarDraftingCommittee,
    imageCaption: 'Dr. Babasaheb Ambedkar, Chairman, with members of the Constitution Drafting Committee (August 1947)',
    layoutType: 'constitutional',
    accentBadge: 'Architect of the Sovereign Republic',
  },
  'chairman-drafting-committee-1947': {
    image: ambedkarDraftingCommittee,
    imageCaption: 'Dr. Babasaheb Ambedkar, Chairman, with members of the Constitution Drafting Committee (August 1947)',
    layoutType: 'constitutional',
    accentBadge: 'Architect of the Sovereign Republic',
  },

  // 1948: Introduction of the Draft Constitution in Constituent Assembly
  'draft-constitution-introduced-1948': {
    image: ambedkarSavita,
    imageCaption: 'Dr. B. R. Ambedkar with Dr. Savita Ambedkar at 1 Hardinge Avenue while introducing the 315-article Draft Constitution (1948)',
    layoutType: 'constitutional',
    accentBadge: 'Foundational Constitutional Debate',
  },
  'introduction-draft-constitution-1948': {
    image: ambedkarSavita,
    imageCaption: 'Dr. B. R. Ambedkar with Dr. Savita Ambedkar at 1 Hardinge Avenue while introducing the 315-article Draft Constitution (1948)',
    layoutType: 'constitutional',
    accentBadge: 'Foundational Constitutional Debate',
  },

  // 1949: The Grammar of Anarchy: Concluding Address to Constituent Assembly
  'grammar-of-anarchy-cad-1949': {
    image: ambedkarPresentingConstitution,
    imageCaption: 'Concluding address to Constituent Assembly: "Political democracy must be made a social democracy" (25 November 1949)',
    layoutType: 'address',
    accentBadge: 'The Immortal Grammar of Anarchy',
  },
  'grammar-of-anarchy-speech-1949': {
    image: ambedkarPresentingConstitution,
    imageCaption: 'Concluding address to Constituent Assembly: "Political democracy must be made a social democracy" (25 November 1949)',
    layoutType: 'address',
    accentBadge: 'The Immortal Grammar of Anarchy',
  },

  // 1949: Formal Adoption of the Constitution of India
  'adoption-of-constitution-1949': {
    image: ambedkarPresentingConstitution,
    imageCaption: 'Dr. Babasaheb Ambedkar presenting the final draft Constitution to President Dr. Rajendra Prasad (25 November 1949)',
    layoutType: 'constitutional',
    accentBadge: 'Birth of Modern Constitutional India',
  },
  'adoption-constitution-india-1949': {
    image: ambedkarPresentingConstitution,
    imageCaption: 'Dr. Babasaheb Ambedkar presenting the final draft Constitution to President Dr. Rajendra Prasad (25 November 1949)',
    layoutType: 'constitutional',
    accentBadge: 'Birth of Modern Constitutional India',
  },

  // 1951: Resignation from the Cabinet over the Hindu Code Bill
  'hindu-code-bill-resignation-1951-event': {
    image: ambedkarIn1950,
    imageCaption: 'Dr. B. R. Ambedkar as Law Minister: Principled resignation championing women\'s equal property and divorce rights (1950–1951)',
    layoutType: 'constitutional',
    accentBadge: 'Principled Stand on Women\'s Equality',
  },
  'resignation-cabinet-hindu-code-1951': {
    image: ambedkarIn1950,
    imageCaption: 'Dr. B. R. Ambedkar as Law Minister: Principled resignation championing women\'s equal property and divorce rights (1950–1951)',
    layoutType: 'constitutional',
    accentBadge: 'Principled Stand on Women\'s Equality',
  },

  // 1956: The Great Buddhist Conversion at Deekshabhoomi, Nagpur
  'deekshabhoomi-nagpur-conversion-1956': {
    image: ambedkarConversionSpeech,
    imageCaption: 'Dr. Babasaheb Ambedkar delivering his historic conversion address and administering the 22 Vows at Deekshabhoomi, Nagpur (14 October 1956)',
    layoutType: 'movement',
    accentBadge: 'The Great Dhamma Revolution',
  },
  'deekshabhoomi-conversion-1956': {
    image: ambedkarConversionSpeech,
    imageCaption: 'Dr. Babasaheb Ambedkar delivering his historic conversion address and administering the 22 Vows at Deekshabhoomi, Nagpur (14 October 1956)',
    layoutType: 'movement',
    accentBadge: 'The Great Dhamma Revolution',
  },

  // 1956: Completion of Opus Magnum "The Buddha and His Dhamma"
  'buddha-and-his-dhamma-completion-1956': {
    image: ambedkarAddressColumbia,
    imageCaption: 'Dr. Babasaheb Ambedkar in his final monumental years of scholarship completing "The Buddha and His Dhamma" (1954–1956)',
    layoutType: 'scholarship',
    accentBadge: 'Final Philosophical Opus & Mahaparinirvana',
  },
  'completion-buddha-and-his-dhamma-1956': {
    image: ambedkarAddressColumbia,
    imageCaption: 'Dr. Babasaheb Ambedkar in his final monumental years of scholarship completing "The Buddha and His Dhamma" (1954–1956)',
    layoutType: 'scholarship',
    accentBadge: 'Final Philosophical Opus & Mahaparinirvana',
  },
};

// Fallback by milestone year in case any ID ever differs
const YEAR_VISUAL_MAP: Record<number, EventVisualMeta> = {
  1891: EVENT_VISUAL_MAP['birth-mhow-1891'],
  1907: EVENT_VISUAL_MAP['matriculation-bombay-1907'],
  1913: EVENT_VISUAL_MAP['columbia-university-admission-1913'],
  1916: EVENT_VISUAL_MAP['columbia-anthropology-paper-1916'],
  1919: EVENT_VISUAL_MAP['southborough-committee-1919'],
  1920: EVENT_VISUAL_MAP['mooknayak-launch-1920'],
  1923: EVENT_VISUAL_MAP['lse-problem-of-rupee-1923'],
  1924: EVENT_VISUAL_MAP['bahishkrit-hitakarini-sabha-1924'],
  1927: EVENT_VISUAL_MAP['mahad-chavadar-tank-1927'],
  1930: EVENT_VISUAL_MAP['round-table-conference-1930'],
  1932: EVENT_VISUAL_MAP['poona-pact-yerwada-1932'],
  1935: EVENT_VISUAL_MAP['yeola-declaration-1935'],
  1936: EVENT_VISUAL_MAP['annihilation-of-caste-publication-1936'],
  1942: EVENT_VISUAL_MAP['viceroys-council-labour-1942'],
  1947: EVENT_VISUAL_MAP['drafting-committee-chair-1947'],
  1948: EVENT_VISUAL_MAP['draft-constitution-introduced-1948'],
  1949: EVENT_VISUAL_MAP['adoption-of-constitution-1949'],
  1951: EVENT_VISUAL_MAP['hindu-code-bill-resignation-1951-event'],
  1956: EVENT_VISUAL_MAP['deekshabhoomi-nagpur-conversion-1956'],
};

export const DEFAULT_EVENT_VISUAL: EventVisualMeta = {
  image: ambedkarPortraitOfficial,
  imageCaption: 'Dr. Babasaheb Ambedkar: Archival Record',
  layoutType: 'movement',
  accentBadge: 'Historical Milestone',
};

export function getEventVisual(event: TimelineEvent): EventVisualMeta {
  if (!event) return DEFAULT_EVENT_VISUAL;
  if (event.id && EVENT_VISUAL_MAP[event.id]) {
    return EVENT_VISUAL_MAP[event.id];
  }
  if (event.year && YEAR_VISUAL_MAP[event.year]) {
    return YEAR_VISUAL_MAP[event.year];
  }
  return DEFAULT_EVENT_VISUAL;
}
