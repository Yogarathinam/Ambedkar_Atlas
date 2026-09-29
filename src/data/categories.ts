import { CategoryInfo } from '../types';

export const ARCHIVE_CATEGORIES: CategoryInfo[] = [
  {
    id: 'writings',
    title: 'Writings & Books',
    description: 'Foundational treatises on economics, sociology, caste annihilation, and 60 official MEA Volumes.',
    count: 64,
    iconName: 'BookOpen',
  },
  {
    id: 'speeches',
    title: 'Speeches & Addresses',
    description: 'Keynotes at Mahad, the Constituent Assembly, Parliament, and Deekshabhoomi.',
    count: 4,
    iconName: 'Mic',
  },
  {
    id: 'records',
    title: 'Gazettes & Records',
    description: 'Official pact covenants, parliamentary statements, gazettes, and legislative proceedings.',
    count: 2,
    iconName: 'Scroll',
  },
  {
    id: 'photographs',
    title: 'Photographs & Plates',
    description: 'Preserved archival photographs from the Photo Division, Government of India.',
    count: 1,
    iconName: 'Image',
  },
  {
    id: 'manuscripts',
    title: 'Manuscripts & Facsimiles',
    description: 'Original illuminated facsimiles, calligraphy, and draft records preserved in Parliament.',
    count: 1,
    iconName: 'FileText',
  },
];
