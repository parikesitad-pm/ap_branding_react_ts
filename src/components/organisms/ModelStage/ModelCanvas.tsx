import React from 'react';
import { Canvas } from '@react-three/fiber';
import { ModelScene } from './ModelScene';
import type { ModelCanvasProps } from './types';

export const ModelCanvas: React.FC<ModelCanvasProps> = ({
  activeProject,
  stageMode,
  stageProgressRef,
  isModal = false,
  isDark,
  inView,
  reducedMotion,
  onReady,
  onDragStateChange,
}) => {
  return (
    <Canvas
      dpr={[1, 1.75]}
      frameloop="demand"
      camera={{ position: [0, 0.2, 4.8], fov: 42 }}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      }}
      onCreated={() => {
        onReady?.();
      }}
      style={{
        width: '100%',
        height: '100%',
        pointerEvents: 'auto',
      }}
    >
      <ModelScene
        activeProject={activeProject}
        stageMode={stageMode}
        stageProgressRef={stageProgressRef}
        isModal={isModal}
        isDark={isDark}
        inView={inView}
        reducedMotion={reducedMotion}
        onDragStateChange={onDragStateChange}
      />
    </Canvas>
  );
};

export default ModelCanvas;
