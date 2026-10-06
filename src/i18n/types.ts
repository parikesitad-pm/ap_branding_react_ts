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
    eyebrow: string;
    firstName: string;
    lastName: string;
    roleLine: string;
    disciplinesLine: string;
    scrollHint: string;
    pending3D: string;
  };
  preloader: {
    loading: string;
    status: string;
  };
  intro: {
    statement: string;
    highlightPhrase: string;
    secondaryStatement: string;
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
    startPanelEyebrow: string;
    startPanelTitle: string;
    startPanelDesc: string;
    processTag: string;
    processNote: string;
    scrollHint: string;
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
    comingNext: string;
    selectedWorksPlaceholder: string;
  };
  stage3d: {
    featuredIn3D: string;
    final: string;
    shaded: string;
    wireframe: string;
    dragToRotate: string;
    scrollToExplore: string;
    exploreIn3D: string;
    closeViewer: string;
    previous: string;
    next: string;
    assetPending: string;
    loading3D: string;
    webglUnavailable: string;
    projectCount: string;
  };
}
