// scene/PressurePlates.tsx
import { PressurePlate } from './PressurePlate';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PLATE_Y = -1.7;
const R = 7; // Increased from 4 to spread plates further

export function PressurePlates({
  state,
}: {
  state: boolean[];
}) {
  const ringRef = useRef<THREE.Mesh>(null);
  const innerRingRef = useRef<THREE.Mesh>(null);
  
  // Animate the energy ring
  useFrame((_, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * 0.3;
    }
    if (innerRingRef.current) {
      innerRingRef.current.rotation.z -= delta * 0.5;
    }
  });

  const activeCount = state.filter(Boolean).length;
  const energyIntensity = activeCount / 3;

  return (
    <>
      {/* Arc Reactor Energy Ring */}
      <group position={[0, PLATE_Y + 0.05, 0]}>
        {/* Outer ring */}
        <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R * 0.85, 0.08, 16, 64]} />
          <meshStandardMaterial
            color={activeCount === 3 ? '#00ffff' : '#4488ff'}
            emissive={activeCount === 3 ? '#00ffff' : '#4488ff'}
            emissiveIntensity={1.5 + energyIntensity * 2}
            transparent
            opacity={0.6 + energyIntensity * 0.3}
          />
        </mesh>

        {/* Inner ring */}
        <mesh ref={innerRingRef} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[R * 0.75, 0.05, 16, 64]} />
          <meshStandardMaterial
            color={activeCount === 3 ? '#ffffff' : '#88ccff'}
            emissive={activeCount === 3 ? '#ffffff' : '#88ccff'}
            emissiveIntensity={2 + energyIntensity * 3}
            transparent
            opacity={0.8}
          />
        </mesh>

        {/* Central glow when all plates active */}
        {activeCount === 3 && (
          <pointLight
            position={[0, 0, 0]}
            intensity={5}
            color="#00ffff"
            distance={R * 2}
          />
        )}
      </group>

      {/* Pressure Plates */}
      <PressurePlate
        index={0}
        position={[-R, PLATE_Y, 0]}
        active={state[0]}
      />

      <PressurePlate
        index={1}
        position={[R, PLATE_Y, 0]}
        active={state[1]}
      />

      <PressurePlate
        index={2}
        position={[0, PLATE_Y, -R]}
        active={state[2]}
      />
    </>
  );
}
