import { CategoryInfo } from '../types';

export const ARCHIVE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'writings',
    title: 'Writings & Books',
    description: 'Foundational treatises on economics, sociology, caste annihilation, constitutionalism, and democracy.',
    count: 26,
    iconName: 'BookOpen',
  },
  {
    id: 'speeches',
    title: 'Speeches & Addresses',
    description: 'Keynotes at Mahad, Round Table Conferences, the Constituent Assembly, and public rallies across India.',
    count: 38,
    iconName: 'Mic',
  },
  {
    id: 'manuscripts',
    title: 'Manuscripts & Drafts',
    description: 'Original handwritten notes, constitutional draft revisions, marginalia, and legal briefs.',
    count: 19,
    iconName: 'FileText',
  },
  {
    id: 'photographs',
    title: 'Photographs & Plates',
    description: 'Restored archival portraits, working sessions with the Drafting Committee, and mass gatherings.',
    count: 42,
    iconName: 'Image',
  },
  {
    id: 'audio',
    title: 'Audio Recordings',
    description: 'Preserved radio broadcasts, voice recordings, and authenticated oral history narrations.',
    count: 14,
    iconName: 'Radio',
  },
  {
    id: 'video',
    title: 'Audiovisual Records',
    description: 'Archival newsreels, signing ceremonies of the Constitution, and historic film footage.',
    count: 11,
    iconName: 'Film',
  },
  {
    id: 'records',
    title: 'Gazettes & Records',
    description: 'Parliamentary debates, official gazette notifications, university diplomas, and state correspondence.',
    count: 31,
    iconName: 'Scroll',
  },
];
