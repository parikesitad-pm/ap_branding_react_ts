import type { Project } from '../../../data/types';

export type StageMode = 'final' | 'shaded' | 'wireframe';

export interface ModelStageProps {
  className?: string;
  onModalStateChange?: (isOpen: boolean) => void;
}

export interface ModelSceneProps {
  activeProject: Project;
  stageMode: StageMode;
  stageProgressRef: React.MutableRefObject<number>;
  isModal?: boolean;
  isDark: boolean;
  inView: boolean;
  reducedMotion: boolean;
  onDragStateChange?: (isDragging: boolean) => void;
}

export interface ModelCanvasProps {
  activeProject: Project;
  stageMode: StageMode;
  stageProgressRef: React.MutableRefObject<number>;
  isModal?: boolean;
  isDark: boolean;
  inView: boolean;
  reducedMotion: boolean;
  onReady?: () => void;
  onDragStateChange?: (isDragging: boolean) => void;
}

export interface ModelViewerModalProps {
  isOpen: boolean;
  projects: Project[];
  activeIndex: number;
  stageMode: StageMode;
  isDark: boolean;
  onClose: () => void;
  onSelectProject: (index: number) => void;
  onStageModeChange: (mode: StageMode) => void;
}

