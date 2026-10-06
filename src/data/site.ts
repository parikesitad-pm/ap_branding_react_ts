import type { SiteMeta, DisciplineItem } from './types';

export const siteMeta: SiteMeta = {
  name: 'Afrizal Pramudyan',
  title: 'Multidisciplinary Visual Designer',
  bioKey: 'about.bio',
  email: '[EMAIL]',
  socials: [
    { label: 'Instagram', url: '[INSTAGRAM]' },
    { label: 'Behance', url: '[BEHANCE]' },
    { label: 'LinkedIn', url: '[LINKEDIN]' },
  ],
};

export const disciplinesList: DisciplineItem[] = [
  {
    id: 'graphic',
    titleKey: 'disciplines.graphic.title',
    descKey: 'disciplines.graphic.desc',
  },
  {
    id: '3d',
    titleKey: 'disciplines.d3d.title',
    descKey: 'disciplines.d3d.desc',
  },
  {
    id: 'animation',
    titleKey: 'disciplines.animation.title',
    descKey: 'disciplines.animation.desc',
  },
  {
    id: 'photo',
    titleKey: 'disciplines.photo.title',
    descKey: 'disciplines.photo.desc',
  },
  {
    id: 'videography',
    titleKey: 'disciplines.videography.title',
    descKey: 'disciplines.videography.desc',
  },
];
