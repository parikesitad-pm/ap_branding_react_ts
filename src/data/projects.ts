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
  },
  {
    id: 'project-04',
    title: '[PROJECT TITLE 04]',
    year: 2024,
    category: 'photo',
    media: {
      type: 'image',
      src: '/img/placeholder-04.webp',
      width: 1200,
      height: 1600,
    },
    caption: '[PHOTO PLACEHOLDER 04]',
  },
];
