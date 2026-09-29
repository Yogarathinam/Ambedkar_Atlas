import { ResearchQA } from '../types';

export const SUGGESTED_PROMPTS: string[] = [
  'What were Dr. Ambedkar’s core arguments in Annihilation of Caste?',
  'Why did Dr. Ambedkar insist on social democracy in his final Constituent Assembly address?',
  'What took place during the historic 1927 Mahad Satyagraha?',
  'What was the Poona Pact of 1932 and how did it alter political representation?',
  'Why did Dr. Ambedkar resign from the Nehru Cabinet over the Hindu Code Bill?',
  'How did Dr. Ambedkar’s economic studies at LSE impact the creation of the RBI?'
];

export const RESEARCH_KNOWLEDGE_BASE: ResearchQA[] = [
  {
    id: 'annihilation-caste-analysis',
    query: 'What were Dr. Ambedkar’s core arguments in Annihilation of Caste?',
    keywords: ['annihilation', 'caste', 'jat-pat-todak', 'division of labourers', 'shastras', 'reform', 'scripture'],
    summary: 'In Annihilation of Caste (1936), Dr. Ambedkar argued that caste is not merely an occupational division of labour, but an unnatural and hierarchical division of labourers based on birth.',
    paragraphs: [
      'Dr. Ambedkar decisively refuted the conservative defense of caste as a traditional division of labour [1]. He demonstrated that unlike modern economic specializations, caste forcibly assigns occupations at birth regardless of individual aptitude, talent, or inclination, creating an artificial hierarchy where classes are graded one above the other.',
      'He maintained that political freedom from colonial rule would be hollow and unstable without a preceding social revolution [1]. Using European history (such as the Protestant Reformation) and Indian history (the Bhakti saints of Maharashtra), Ambedkar showed that moral emancipation must precede lasting political liberty.',
      'Crucially, he diagnosed that caste persists not out of mere prejudice, but because it is sanctified by Hindu religious scripture [1]. Therefore, genuine annihilation of caste requires destroying the theological authority of the shastras and replacing dogma with a rational religion founded upon Liberty, Equality, and Fraternity.'
    ],
    citations: [
      {
        marker: '[1]',
        recordId: 'annihilation-of-caste-1936',
        title: 'Annihilation of Caste: With a Reply to Mahatma Gandhi',
        source: 'BAWS Vol. 1, Bombay (1936)',
        year: 1936,
        quoteSnippet: 'Caste is not just a division of labour, it is a division of labourers... Anything that you will build on the foundations of caste will crack.'
      }
    ],
    suggestedFollowUps: [
      'How did Mahatma Gandhi respond to Annihilation of Caste?',
      'What were the philosophical influences of John Dewey on Ambedkar’s ideas of democracy?',
      'How does the Indian Constitution embody the principles of Annihilation of Caste?'
    ]
  },
  {
    id: 'constituent-assembly-democracy',
    query: 'Why did Dr. Ambedkar insist on social democracy in his final Constituent Assembly address?',
    keywords: ['constituent', 'assembly', 'democracy', 'contradiction', 'grammar', 'anarchy', 'bhakti', 'fraternity'],
    summary: 'In his farewell address of 25 November 1949, Dr. Ambedkar delivered a profound warning that political democracy cannot survive unless it is anchored upon social democracy and fraternity.',
    paragraphs: [
      'On the eve of the Constitution’s adoption, Dr. Ambedkar alerted the nation that on 26 January 1950, India was entering into a "life of contradictions" [1]. In political life, India would recognize the democratic principle of "one man, one vote, and one vote, one value"; but in social and economic structures, the principle of "one man, one value" remained violently denied.',
      'Ambedkar warned that if this contradiction were allowed to fester, those who suffer from entrenched inequality would inevitably blow up the edifice of political democracy so painstakingly erected by the Constituent Assembly [1].',
      'To preserve the Republic, he issued three specific prescriptions: First, to abandon extra-constitutional agitational methods ("the Grammar of Anarchy") in favor of constitutional morality; second, to avoid "Bhakti" or hero-worship in politics, which leads directly to degradation and eventual dictatorship; and third, to foster Fraternity, without which liberty and equality cannot coexist [1].'
    ],
    citations: [
      {
        marker: '[1]',
        recordId: 'constituent-assembly-final-address-1949',
        title: 'The Grammar of Anarchy: Final Address to the Constituent Assembly',
        source: 'Constituent Assembly Debates, Vol. XI (1949)',
        year: 1949,
        quoteSnippet: 'Political democracy cannot last unless there lies at the base of it social democracy... In politics we will have equality and in social and economic life we will have inequality.'
      }
    ],
    suggestedFollowUps: [
      'What did Dr. Ambedkar mean by "Constitutional Morality"?',
      'What were the key debates on the Preamble of the Indian Constitution?',
      'How did Ambedkar assess the role of the Drafting Committee?'
    ]
  },
  {
    id: 'mahad-satyagraha-context',
    query: 'What took place during the historic 1927 Mahad Satyagraha?',
    keywords: ['mahad', 'water', 'tank', 'chavadar', '1927', 'human rights', 'dignity', 'manusmriti'],
    summary: 'The 1927 Mahad Satyagraha was India’s foundational civil rights event, where Dr. Ambedkar led thousands to drink water from the Chavadar Tank to assert fundamental human equality.',
    paragraphs: [
      'On 20 March 1927, Dr. Ambedkar addressed a convention of thousands at Mahad in Kolaba District [1]. Although the Bombay Legislative Council had enacted the Bole Resolution in 1923 opening municipal water bodies, local upper-caste authorities barred untouchables from accessing the Chavadar Tank.',
      'Ambedkar insisted that the movement was not merely about quenching physical thirst, but about affirming self-respect and establishing universal human dignity [1]. He famously pointed out the grotesque irony that beasts, birds, and animals could freely drink from the tank, while human beings endowed with reason were barred.',
      'Following violent orthodox reactions and so-called purification rituals on the tank, Dr. Ambedkar organized a second conference in December 1927, during which a resolution was passed to publicly burn the Manusmriti, signaling a definitive rupture with ancient codes of servitude [2].'
    ],
    citations: [
      {
        marker: '[1]',
        recordId: 'mahad-satyagraha-speech-1927',
        title: 'The Declaration of Human Rights: Mahad Chavadar Tank Address',
        source: 'Bahishkrit Bharat Archives (1927)',
        year: 1927,
        quoteSnippet: 'This gathering is not organized merely to claim water rights. Its true purpose is to plant the seed of self-respect in our minds.'
      },
      {
        marker: '[2]',
        recordId: 'burning-of-manusmriti-1927',
        title: 'Resolution and Burning of Manusmriti at Mahad Conference',
        source: 'Bahishkrit Bharat Archives (1928)',
        year: 1927,
        quoteSnippet: 'This conference solemnly burns this book of darkness in the fire of equality.'
      }
    ],
    suggestedFollowUps: [
      'How did the Mahad movement inspire Article 15(2) of the Indian Constitution?',
      'Who were the progressive caste Hindu allies who supported the Mahad Satyagraha?',
      'What was the judicial outcome of the Mahad Tank litigation in the Bombay High Court?'
    ]
  },
  {
    id: 'poona-pact-analysis',
    query: 'What was the Poona Pact of 1932 and how did it alter political representation?',
    keywords: ['poona', 'pact', '1932', 'gandhi', 'yerwada', 'electorate', 'reserved', 'communal award'],
    summary: 'Signed on 24 September 1932 at Yerwada Jail, the Poona Pact was an accord between Dr. Ambedkar and caste Hindu leaders that replaced separate electorates with reserved seats in joint electorates.',
    paragraphs: [
      'Following the British Government’s Communal Award in August 1932 granting separate electorates to the Depressed Classes, Mahatma Gandhi declared an indefinite fast unto death in Yerwada Prison, arguing that separate electorates would permanently vivisect Hindu society [1].',
      'Faced with immense political pressure to preserve Gandhi’s life, Dr. Ambedkar negotiated with tenacity. He agreed to relinquish separate electorates in return for a substantial increase in reserved seats for the Depressed Classes in provincial legislatures—from 71 under the British award to 148 seats [1].',
      'The agreement also instituted a primary election mechanism for Depressed Classes voters and stipulated financial assistance and fair representation in public employment [1]. This historical compromise laid the direct groundwork for Articles 330 and 332 of the Indian Constitution.'
    ],
    citations: [
      {
        marker: '[1]',
        recordId: 'poona-pact-agreement-1932',
        title: 'The Poona Pact: Text of Agreement on Depressed Classes Representation',
        source: 'National Archives of India, Home Political (1932)',
        year: 1932,
        quoteSnippet: 'There shall be seats reserved for the Depressed Classes out of the general electorate seats in the Provincial Legislatures... Total 148.'
      }
    ],
    suggestedFollowUps: [
      'What were Dr. Ambedkar’s subsequent criticisms of the working of the Poona Pact?',
      'How did the Cabinet Mission Plan of 1946 view the Depressed Classes representation?',
      'What were the provisions of the Scheduled Castes Federation founded by Ambedkar in 1942?'
    ]
  },
  {
    id: 'hindu-code-bill-context',
    query: 'Why did Dr. Ambedkar resign from the Nehru Cabinet over the Hindu Code Bill?',
    keywords: ['hindu', 'code', 'bill', 'resignation', '1951', 'women', 'property', 'divorce', 'law minister'],
    summary: 'Dr. Ambedkar resigned as India’s first Law Minister in October 1951 in protest against the government’s failure to pass the progressive Hindu Code Bill granting women equal property, marriage, and divorce rights.',
    paragraphs: [
      'As Law Minister, Dr. Ambedkar drafted the unified Hindu Code Bill to codify and modernize ancient personal laws, introducing equal inheritance rights for daughters, absolute ownership of property for women, monogamy, and the right to judicial divorce [1].',
      'The bill encountered fierce resistance from conservative members of Parliament and religious organizations. Facing impending general elections, Prime Minister Jawaharlal Nehru decided to drop the comprehensive measure and enact it only in piecemeal fashion [1].',
      'In his blistering resignation speech, Dr. Ambedkar stated that building political equality while allowing systemic discrimination against women to persist was a mockery of the Constitution’s Fundamental Rights [1]. He affirmed: "I measure the progress of a community by the degree of progress which women have achieved."'
    ],
    citations: [
      {
        marker: '[1]',
        recordId: 'hindu-code-bill-resignation-1951',
        title: 'Statement on Resignation from the Nehru Cabinet over the Hindu Code Bill',
        source: 'Parliamentary Debates of India (1951)',
        year: 1951,
        quoteSnippet: 'To leave inequality between class and class to remain intact is bad enough; but to leave inequality between sex and sex intact is completely contrary to the Constitution.'
      }
    ],
    suggestedFollowUps: [
      'Which acts were eventually passed from the fragments of the Hindu Code Bill between 1955 and 1956?',
      'How did Dr. Ambedkar champion maternity benefits and equal pay during his time on the Viceroy’s Council?',
      'What were Dr. Ambedkar’s perspectives on population control and family planning?'
    ]
  },
  {
    id: 'rbi-and-economics',
    query: 'How did Dr. Ambedkar’s economic studies at LSE impact the creation of the RBI?',
    keywords: ['rbi', 'economics', 'rupee', 'lse', 'currency', 'hilton', 'young', 'monetary'],
    summary: 'Dr. Ambedkar’s 1923 LSE doctoral thesis "The Problem of the Rupee" served as the core theoretical reference for the Hilton Young Commission that recommended the establishment of the Reserve Bank of India.',
    paragraphs: [
      'In "The Problem of the Rupee: Its Origin and Its Solution", Dr. Ambedkar analyzed the history of Indian currency from 1800 to 1893, demonstrating how colonial exchange manipulation drained Indian wealth [1].',
      'Unlike John Maynard Keynes, who advocated the Gold Exchange Standard for India, Ambedkar warned that an external exchange peg generated domestic price inflation and hurt the working class. He proposed an independent central monetary authority dedicated to stabilizing the domestic purchasing power of the rupee [1].',
      'When the Royal Commission on Indian Currency and Finance (Hilton Young Commission) convened in 1925–1926, its members extensively studied Dr. Ambedkar’s work and questioned witnesses based on his framework, ultimately recommending the creation of the Reserve Bank of India in 1934.'
    ],
    citations: [
      {
        marker: '[1]',
        recordId: 'the-problem-of-the-rupee-1923',
        title: 'The Problem of the Rupee: Its Origin and Its Solution',
        source: 'London: P. S. King & Son (1923)',
        year: 1923,
        quoteSnippet: 'In considering the question of monetary reform, the chief objective must be stability of the purchasing power of money.'
      }
    ],
    suggestedFollowUps: [
      'What were Dr. Ambedkar’s contributions to river valley projects and the Damodar Valley Corporation?',
      'How did Ambedkar analyze agrarian economics in "Small Holdings in India and Their Remedies"?',
      'What were the economic arguments in Ambedkar’s Columbia thesis on British provincial finance?'
    ]
  }
];
