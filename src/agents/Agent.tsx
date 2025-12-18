import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';
import { AgentAction } from '../simulation/actions';
import { getActionDialogue } from '../simulation/dialogue';

export type AgentType =
  | 'thief'
  | 'guardian'
  | 'negotiator'
  | 'AgentX';

const CORE_COLOR: Record<AgentType, string> = {
  thief: '#ff4a4a',
  guardian: '#1f68a8',
  negotiator: '#2de680',
  AgentX: '#ffbf4a',
};

export function Agent({
  agent,
}: {
  agent: {
    id: string;
    position: [number, number, number];
    targetPosition?: [number, number, number];
    currentAction?: AgentAction;
  };
}) {
  const ref = useRef<THREE.Group>(null);
  const coreColor = CORE_COLOR[agent.id as AgentType];
  const [initialized, setInitialized] = useState(false);

  useFrame((_state, delta) => {
    if (!ref.current) return;

    // Target position (default to current position if target not set)
    const targetX = agent.targetPosition ? agent.targetPosition[0] : agent.position[0];
    const targetZ = agent.targetPosition ? agent.targetPosition[2] : agent.position[2];
    const targetY = (agent.targetPosition ? agent.targetPosition[1] : agent.position[1]) + 1.0;

    // Instant set on first frame to prevent flying from 0,0,0
    if (!initialized) {
      ref.current.position.set(targetX, targetY, targetZ);
      setInitialized(true);
      return;
    }

    // Smooth movement
    const targetPos = new THREE.Vector3(targetX, targetY, targetZ);
    ref.current.position.lerp(targetPos, delta * 3.0); // Adjust speed factor as needed

    // Rotation (face movement direction)
    if (ref.current.position.distanceTo(targetPos) > 0.1) {
      // Smooth rotation manually for better control
      // simplest: snap rotation or lerp rotation? lerp is hard with angles.
      // just lookAt for now
       ref.current.lookAt(targetPos.x, ref.current.position.y, targetPos.z);
    }
  });

  return (
    <group ref={ref}>
      {/* Action Text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.35}
        color="white"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.05}
        outlineColor="black"
        font="https://fonts.gstatic.com/s/roboto/v18/KFOmCnqEu92Fr1Mu4mxM.woff"
      >
        {getActionDialogue(agent.currentAction)}
      </Text>

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
