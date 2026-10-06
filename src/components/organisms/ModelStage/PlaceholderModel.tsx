import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { StageMode } from './types';

// TODO: replace procedural placeholder with Afrizal's production GLB

interface PlaceholderModelProps {
  stageMode: StageMode;
  stageProgressRef: React.MutableRefObject<number>;
  isDark: boolean;
  inView: boolean;
  reducedMotion: boolean;
  isDragging: boolean;
}

export const PlaceholderModel: React.FC<PlaceholderModelProps> = ({
  stageProgressRef,
  isDark,
  inView,
  reducedMotion,
  isDragging,
}) => {
  const { invalidate } = useThree();

  // Scene node refs
  const rootGroupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const wireMeshRef = useRef<THREE.Mesh>(null);
  const outerRingRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);

  // Material refs
  const coreMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const wireMaterialRef = useRef<THREE.MeshBasicMaterial>(null);
  const outerRingMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const innerRingMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // Pre-allocated reusable colors to avoid garbage collection churn in render loop
  const tempColors = useMemo(() => {
    return {
      finalColor: new THREE.Color(),
      shadedColor: new THREE.Color(),
      wireBodyColor: new THREE.Color(),
      wireLineColor: new THREE.Color(),
      targetColor: new THREE.Color(),
      tempColor: new THREE.Color(),
    };
  }, []);

  // Update base color definitions based on theme
  useEffect(() => {
    if (isDark) {
      tempColors.finalColor.set('#0b1d3a');      // Deep cobalt ink
      tempColors.shadedColor.set('#242833');     // Neutral studio matte dark
      tempColors.wireBodyColor.set('#040711');   // Midnight backing
      tempColors.wireLineColor.set('#0044ff');   // Electric Cobalt wireframe
    } else {
      tempColors.finalColor.set('#cbd7e8');      // Luminous platinum
      tempColors.shadedColor.set('#9ca3af');     // Crisp studio clay
      tempColors.wireBodyColor.set('#f1f5f9');   // Clean paper backing
      tempColors.wireLineColor.set('#0038ff');   // Brand Cobalt
    }
    invalidate();
  }, [isDark, tempColors, invalidate]);

  // Interpolated progress state to smoothly transition between stages
  const currentProgressRef = useRef(stageProgressRef.current);

  useFrame((state, delta) => {
    // 1. Smooth material transitions driven by scroll progress ref
    const targetProgress = THREE.MathUtils.clamp(stageProgressRef.current, 0, 1);
    const progressDiff = Math.abs(currentProgressRef.current - targetProgress);

    // If progress is currently moving, lerp toward target
    if (progressDiff > 0.001) {
      currentProgressRef.current = THREE.MathUtils.lerp(
        currentProgressRef.current,
        targetProgress,
        Math.min(delta * 12, 1)
      );
      // Invalidate frame to continue rendering during transition
      state.invalidate();
    } else {
      currentProgressRef.current = targetProgress;
    }

    const p = currentProgressRef.current;
    const coreMat = coreMaterialRef.current;
    const wireMat = wireMaterialRef.current;
    const outerRingMat = outerRingMatRef.current;
    const innerRingMat = innerRingMatRef.current;

    if (coreMat && wireMat) {
      if (p <= 0.5) {
        // Stage 0.00 to 0.50: FINAL -> SHADED transition
        const t = p / 0.5; // 0 (Final) -> 1 (Shaded)
        tempColors.targetColor.copy(tempColors.finalColor).lerp(tempColors.shadedColor, t);
        coreMat.color.copy(tempColors.targetColor);
        coreMat.roughness = THREE.MathUtils.lerp(0.22, 0.88, t);
        coreMat.metalness = THREE.MathUtils.lerp(0.65, 0.05, t);
        coreMat.opacity = 1.0;
        coreMat.transparent = false;
        wireMat.opacity = 0.0;
        wireMat.transparent = true;
      } else {
        // Stage 0.50 to 1.00: SHADED -> WIREFRAME transition
        const t = (p - 0.5) / 0.5; // 0 (Shaded) -> 1 (Wireframe)
        tempColors.targetColor.copy(tempColors.shadedColor).lerp(tempColors.wireBodyColor, t);
        coreMat.color.copy(tempColors.targetColor);
        coreMat.roughness = THREE.MathUtils.lerp(0.88, 0.4, t);
        coreMat.metalness = THREE.MathUtils.lerp(0.05, 0.2, t);
        // Base mesh becomes semi-transparent dark hull to highlight wire lines
        coreMat.transparent = true;
        coreMat.opacity = THREE.MathUtils.lerp(1.0, 0.25, t);
        wireMat.transparent = true;
        wireMat.opacity = THREE.MathUtils.lerp(0.0, 0.9, t);
      }

      if (outerRingMat) {
        outerRingMat.roughness = THREE.MathUtils.lerp(0.2, 0.7, p);
        outerRingMat.metalness = THREE.MathUtils.lerp(0.8, 0.1, p);
      }
      if (innerRingMat) {
        innerRingMat.roughness = THREE.MathUtils.lerp(0.3, 0.8, p);
        innerRingMat.metalness = THREE.MathUtils.lerp(0.7, 0.2, p);
      }
    }

    // 2. Idle auto-rotation turntable
    if (!isDragging && !reducedMotion && inView && document.visibilityState === 'visible') {
      if (rootGroupRef.current) {
        rootGroupRef.current.rotation.y += delta * 0.25;
      }
      if (outerRingRef.current) {
        outerRingRef.current.rotation.x += delta * 0.18;
        outerRingRef.current.rotation.z += delta * 0.12;
      }
      if (innerRingRef.current) {
        innerRingRef.current.rotation.y -= delta * 0.22;
        innerRingRef.current.rotation.x += delta * 0.1;
      }
      // Continue requesting frames on demand while turntable rotates
      state.invalidate();
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Primary sculpted geometry (Torusknot showcasing volumetric curvature & reflections) */}
      <mesh ref={coreMeshRef} castShadow receiveShadow>
        <torusKnotGeometry args={[0.95, 0.32, 128, 32, 2, 3]} />
        <meshStandardMaterial
          ref={coreMaterialRef}
          color={tempColors.finalColor}
          roughness={0.25}
          metalness={0.65}
        />
      </mesh>

      {/* Synchronized wireframe overlay mesh for WIREFRAME state */}
      <mesh ref={wireMeshRef}>
        <torusKnotGeometry args={[0.955, 0.322, 64, 16, 2, 3]} />
        <meshBasicMaterial
          ref={wireMaterialRef}
          color={tempColors.wireLineColor}
          wireframe
          transparent
          opacity={0}
        />
      </mesh>

      {/* Gimbal orbital ring 1 (Brand Cobalt accent) */}
      <mesh ref={outerRingRef} rotation={[Math.PI / 4, 0, 0]}>
        <torusGeometry args={[1.75, 0.028, 16, 64]} />
        <meshStandardMaterial
          ref={outerRingMatRef}
          color="#0038ff"
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>

      {/* Gimbal orbital ring 2 (Brand Flare accent) */}
      <mesh ref={innerRingRef} rotation={[0, Math.PI / 3, Math.PI / 6]}>
        <torusGeometry args={[2.05, 0.02, 16, 64]} />
        <meshStandardMaterial
          ref={innerRingMatRef}
          color="#ff3d00"
          roughness={0.4}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
};

