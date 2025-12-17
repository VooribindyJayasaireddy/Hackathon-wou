import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export type AgentType =
  | 'thief'
  | 'guardian'
  | 'negotiator'
  | 'opportunist';

const CORE_COLOR: Record<AgentType, string> = {
  thief: '#ff4a4a',
  guardian: '#1f68a8',
  negotiator: '#2de680',
  opportunist: '#ffbf4a',
};

export function Agent({
  agent,
}: {
  agent: {
    id: string;
    position: [number, number, number];
  };
}) {
  const ref = useRef<THREE.Group>(null);
  const coreColor = CORE_COLOR[agent.id as AgentType];

  // TEMPORARILY COMMENTED OUT - Agents are static
  // useFrame(() => {
  //   if (!ref.current) return;
  //   ref.current.position.set(
  //     agent.position[0],
  //     agent.position[1],
  //     agent.position[2]
  //   );
  // });

  return (
    <group ref={ref} position={[agent.position[0], agent.position[1] + 1.0, agent.position[2]]}>
      {/* Body */}
      <mesh castShadow>
        <capsuleGeometry args={[0.45, 1.0, 6, 12]} />
        <meshStandardMaterial
          color="#d0d0d0"
          metalness={0.4}
          roughness={0.6}
        />
      </mesh>

      {/* Head */}
      <mesh position={[0, 0.85, 0]} castShadow>
        <sphereGeometry args={[0.35, 24, 24]} />
        <meshStandardMaterial
          color="#e0e0e0"
          metalness={0.35}
          roughness={0.55}
        />
      </mesh>

      {/* Emissive Core */}
      <mesh position={[0, 0.2, 0.46]}>
        <circleGeometry args={[0.18, 32]} />
        <meshStandardMaterial
          color={coreColor}
          emissive={coreColor}
          emissiveIntensity={3.0}
        />
      </mesh>

      {/* Core Light */}
      <pointLight
        position={[0, 0.2, 0.6]}
        color={coreColor}
        intensity={0.8}
        distance={2.5}
      />
    </group>
  );
}
