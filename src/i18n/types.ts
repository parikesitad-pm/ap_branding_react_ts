export type Locale = 'en' | 'zh-CN' | 'ja' | 'ko';

export interface TranslationSchema {
  nav: {
    work: string;
    disciplines: string;
    about: string;
    contact: string;
  };
  categories: {
    all: string;
    graphic: string;
    '3d': string;
    animation: string;
    photo: string;
  };
  hero: {
    roleLine: string;
    scrollHint: string;
  };
  intro: {
    statement: string;
  };
  reel: {
    title: string;
    subtitle: string;
    filterAll: string;
    filterGraphic: string;
    filter3D: string;
    filterAnimation: string;
    filterPhoto: string;
    filterVideo: string;
    endTitle: string;
    endSubtitle: string;
    startProject: string;
  };
  disciplines: {
    title: string;
    d3d: {
      title: string;
      desc: string;
    };
    graphic: {
      title: string;
      desc: string;
    };
    animation: {
      title: string;
      desc: string;
    };
    photo: {
      title: string;
      desc: string;
    };
    videography: {
      title: string;
      desc: string;
    };
  };
  about: {
    title: string;
    bio: string;
  };
  timeline: {
    entry1: {
      title: string;
      role: string;
      desc: string;
    };
    entry2: {
      title: string;
      role: string;
      desc: string;
    };
  };
  contact: {
    title: string;
    lead: string;
    emailLabel: string;
  };
  theme: {
    toggleLight: string;
    toggleDark: string;
  };
  a11y: {
    switchLanguage: string;
    selectTheme: string;
    menuOpen: string;
    menuClose: string;
    progress: string;
  };
  common: {
    placeholderNotice: string;
    viewWork: string;
    startProject: string;
  };
}
