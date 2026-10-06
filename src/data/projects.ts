import type { Project } from './types';

/**
 * Baseline placeholder projects for Foundation Phase (F0).
 * Real assets are currently being gathered.
 * Per project constraints: Explicit literal placeholders only. Never use fictitious artwork.
 */
export const projects: Project[] = [
  {
    id: 'project-01',
    title: '[PROJECT TITLE 01]',
    year: 2025,
    category: 'graphic',
    media: {
      type: 'image',
      src: '/img/placeholder-01.webp',
      width: 1200,
      height: 1500,
    },
    caption: '[PROJECT POSTER 01]',
    reelLayout: 'portrait',
    alignment: 'center',
  },
  {
    id: 'project-02',
    title: '[PROJECT TITLE 02]',
    year: 2025,
    category: '3d',
    media: {
      type: 'glb',
      src: '/models/placeholder-02.glb',
      poster: '/img/placeholder-02.webp',
    },
    caption: '[3D MODEL PLACEHOLDER 02]',
    reelLayout: 'tall',
    alignment: 'down',
  },
  {
    id: 'project-03',
    title: '[PROJECT TITLE 03]',
    year: 2024,
    category: 'animation',
    media: {
      type: 'image',
      src: '/img/placeholder-03.webp',
      width: 1600,
      height: 1600,
    },
    caption: '[ANIMATION PLACEHOLDER 03]',
    reelLayout: 'square',
    alignment: 'up',
  },
  {
    id: 'project-04',
    title: '[PROJECT TITLE 04]',
    year: 2024,
    category: 'photo',
    media: {
      type: 'image',
      src: '/img/placeholder-04.webp',
      width: 1600,
      height: 1200,
    },
    caption: '[PHOTO PLACEHOLDER 04]',
    reelLayout: 'landscape',
    alignment: 'center',
  },
  {
    id: 'project-05',
    title: '[PROJECT TITLE 05]',
    year: 2025,
    category: '3d',
    media: {
      type: 'glb',
      src: '/models/placeholder-05.glb',
      poster: '/img/placeholder-05.webp',
    },
    caption: '[3D MODEL PLACEHOLDER 05]',
    reelLayout: 'wide',
    alignment: 'down',
  },
  {
    id: 'project-06',
    title: '[PROJECT TITLE 06]',
    year: 2024,
    category: 'graphic',
    media: {
      type: 'image',
      src: '/img/placeholder-06.webp',
      width: 1200,
      height: 1600,
    },
    caption: '[GRAPHIC POSTER 06]',
    reelLayout: 'portrait',
    alignment: 'up',
  },
  {
    id: 'project-07',
    title: '[PROJECT TITLE 07]',
    year: 2024,
    category: 'animation',
    media: {
      type: 'image',
      src: '/img/placeholder-07.webp',
      width: 1920,
      height: 1080,
    },
    caption: '[MOTION LOOP 07]',
    reelLayout: 'landscape',
    alignment: 'center',
  },
  {
    id: 'project-08',
    title: '[PROJECT TITLE 08]',
    year: 2023,
    category: 'photo',
    media: {
      type: 'image',
      src: '/img/placeholder-08.webp',
      width: 1200,
      height: 1600,
    },
    caption: '[PHOTO ARCHIVE 08]',
    reelLayout: 'tall',
    alignment: 'up',
  },
];

