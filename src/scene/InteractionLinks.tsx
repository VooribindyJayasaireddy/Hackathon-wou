import { Line } from '@react-three/drei';
import { canInteract } from '../simulation/interaction';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface InteractionLinksProps {
  agents: any[];
}

export function InteractionLinks({ agents }: InteractionLinksProps) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame((state) => {
    if (materialRef.current) {
      // Pulse opacity
      const t = state.clock.getElapsedTime();
      materialRef.current.opacity = 0.5 + Math.sin(t * 5) * 0.3;
    }
  });

  const links: JSX.Element[] = [];

  for (let i = 0; i < agents.length; i++) {
    for (let j = i + 1; j < agents.length; j++) {
      const a = agents[i];
      const b = agents[j];
      
      // Use targetPosition for visual connections if available, else position
      // Wait, if we use targetPosition, lines update instantly. 
      // If we want lines to follow smooth agents, we need the *current* visual position of agents.
      // But the agents are separate components managing their own refs. We don't have access to their refs here.
      // We only have the generic position data.
      // If we use agent.position (logical), lines might snap.
      // If use targetPosition, lines might snap.
      // However, since we are interpolating the Agents in their own component, the lines using logical positions might look disconnected from the bodies.
      
      // A proper solution would be to hoist the refs or rely on the same interpolation here.
      // For now, let's use the 'position' (which is the target) and accept they might lead the agent slightly, 
      // OR we can't easily sync them without state.
      // ACTUALLY, I updated executeActions to update targetPosition and reset position to targetPosition?
      // No, I set `agent.position` to `target`.
      // So `agent.position` IS the target.
      // So the lines will be drawn at the DESTINATION.
      // The agents will be moving towards the destination.
      // So the lines will appear ahead of the agents.
      // To fix this without refactoring everything: I could lerp the line positions locally too, but that's complex to match.
      // Alternatively, I can just not worry about it being perfect, or...
      // I can pass the agents' *previous* position and lerp here too?
      // Since I don't store previous position in strict accessible state for the scene...
      
      // Let's just draw lines between agent.position (targets). This shows "Interaction is active for this step".
      // It might look like a "prediction" line if agents lag behind.
      // User said "agents should not move more fast", so they will lag.
      // Maybe I can visualize it as "Connection established" at the destination.
      
      if (canInteract(a.position, b.position)) {
        // Offset Y slightly
        const p1 = [a.position[0], a.position[1] + 1, a.position[2]] as [number, number, number];
        const p2 = [b.position[0], b.position[1] + 1, b.position[2]] as [number, number, number];

        links.push(
          <Line
            key={`${a.id}-${b.id}`}
            points={[p1, p2]}
            color="yellow"
            lineWidth={2}
            transparent
            opacity={0.6}
            dashed={false}
          />
        );
      }
    }
  }

  return <group>{links}</group>;
}
