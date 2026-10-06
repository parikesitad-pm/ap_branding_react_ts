export type Category =
  | 'graphic'
  | '3d'
  | 'animation'
  | 'photo';

export type Discipline =
  | 'graphic'
  | '3d'
  | 'animation'
  | 'photo'
  | 'videography';

export type Media =
  | {
      type: 'glb';
      src: string;
      poster: string;
    }
  | {
      type: 'image';
      src: string;
      width: number;
      height: number;
    };

export type ReelLayout =
  | 'portrait'
  | 'landscape'
  | 'square'
  | 'wide'
  | 'tall';

export type ReelAlignment =
  | 'center'
  | 'up'
  | 'down';

export interface Project {
  id: string;
  title: string;
  year: number;
  category: Category;
  media: Media;
  caption?: string;
  reelLayout?: ReelLayout;
  alignment?: ReelAlignment;
}

export interface DisciplineItem {
  id: Discipline;
  titleKey: string;
  descKey: string;
}

export interface TimelineEntry {
  id: string;
  year: string;
  titleKey: string;
  roleKey: string;
  descKey: string;
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface SiteMeta {
  name: string;
  title: string;
  bioKey: string;
  email: string;
  socials: SocialLink[];
}

