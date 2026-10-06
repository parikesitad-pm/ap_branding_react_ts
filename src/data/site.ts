import type { SiteMeta, DisciplineItem } from './types';

export const siteMeta: SiteMeta = {
  name: 'Afrizal Pramudyan',
  title: 'Multidisciplinary Visual Designer',
  bioKey: 'bio',
  email: '[EMAIL]',
  socials: [
    { label: 'Instagram', url: '[INSTAGRAM]' },
    { label: 'Behance', url: '[BEHANCE]' },
    { label: 'LinkedIn', url: '[LINKEDIN]' },
  ],
};

export const disciplinesList: DisciplineItem[] = [
  {
    id: '3d',
    titleKey: 'discipline.3d.title',
    descKey: 'discipline.3d.desc',
  },
  {
    id: 'graphic',
    titleKey: 'discipline.graphic.title',
    descKey: 'discipline.graphic.desc',
  },
  {
    id: 'animation',
    titleKey: 'discipline.animation.title',
    descKey: 'discipline.animation.desc',
  },
  {
    id: 'photo',
    titleKey: 'discipline.photo.title',
    descKey: 'discipline.photo.desc',
  },
  {
    id: 'videography',
    titleKey: 'discipline.videography.title',
    descKey: 'discipline.videography.desc',
  },
];

