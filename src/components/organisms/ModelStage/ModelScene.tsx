import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { PlaceholderModel } from './PlaceholderModel';
import type { ModelSceneProps } from './types';

// TODO: replace procedural placeholder with Afrizal's production GLB

export const ModelScene: React.FC<ModelSceneProps> = ({
  stageMode,
  stageProgressRef,
  isModal = false,
  isDark,
  inView,
  reducedMotion,
  onDragStateChange,
}) => {
  const { invalidate } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const [isDragging, setIsDragging] = useState(false);
  const idleResumeTimerRef = useRef<number | null>(null);

  // Invalidate canvas whenever theme changes
  useEffect(() => {
    invalidate();
  }, [isDark, invalidate]);

  // Page visibility listener: pause animations when tab hidden, resume when visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && inView) {
        invalidate();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [inView, invalidate]);

  // Viewport intersection change: trigger one frame when entering viewport
  useEffect(() => {
    if (inView) {
      invalidate();
    }
  }, [inView, invalidate]);

  // Drag start handler
  const handleStart = useCallback(() => {
    if (idleResumeTimerRef.current !== null) {
      window.clearTimeout(idleResumeTimerRef.current);
      idleResumeTimerRef.current = null;
    }
    setIsDragging(true);
    onDragStateChange?.(true);
    invalidate();
  }, [onDragStateChange, invalidate]);

  // Drag end handler: smoothly resume turntable after brief idle
  const handleEnd = useCallback(() => {
    idleResumeTimerRef.current = window.setTimeout(() => {
      setIsDragging(false);
      onDragStateChange?.(false);
      invalidate();
    }, 1600);
  }, [onDragStateChange, invalidate]);

  // Orbit controls change handler
  const handleChange = useCallback(() => {
    invalidate();
  }, [invalidate]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (idleResumeTimerRef.current !== null) {
        window.clearTimeout(idleResumeTimerRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Editorial lighting scheme: key, rim, and brand accent fill */}
      <ambientLight intensity={isDark ? 0.9 : 1.25} />
      <hemisphereLight
        args={[isDark ? '#2438ff' : '#ffffff', isDark ? '#0a0c2b' : '#cbd7e8', isDark ? 0.8 : 0.6]}
      />
      <directionalLight
        position={[4, 7, 5]}
        intensity={isDark ? 2.4 : 1.9}
        color={isDark ? '#e0e7ff' : '#ffffff'}
        castShadow
      />
      <directionalLight
        position={[-5, -2, -3]}
        intensity={isDark ? 1.8 : 1.0}
        color="#0038ff"
      />
      <spotLight
        position={[0, 6, -4]}
        intensity={isDark ? 2.2 : 1.2}
        color="#ff3d00"
        angle={0.6}
        penumbra={0.8}
      />
      <pointLight position={[3, -2, 2]} intensity={isDark ? 1.2 : 0.8} color="#ff5a2c" />

      {/* Core 3D model node (Procedural placeholder during F4, GLB architecture-ready) */}
      <PlaceholderModel
        stageMode={stageMode}
        stageProgressRef={stageProgressRef}
        isDark={isDark}
        inView={inView}
        reducedMotion={reducedMotion}
        isDragging={isDragging}
      />

      {/* Lightweight contact grounding shadow */}
      <ContactShadows
        position={[0, -1.65, 0]}
        opacity={isDark ? 0.65 : 0.45}
        scale={10}
        blur={2.4}
        far={4}
        resolution={256}
        color="#000000"
      />

      {/* Controlled Orbit Interaction */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={isModal}
        minDistance={2.8}
        maxDistance={8.0}
        minPolarAngle={Math.PI / 4.5}
        maxPolarAngle={Math.PI / 1.75}
        enableDamping={true}
        dampingFactor={0.06}
        onStart={handleStart}
        onEnd={handleEnd}
        onChange={handleChange}
      />
    </>
  );
};

