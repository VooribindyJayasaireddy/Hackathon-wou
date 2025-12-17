import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Vault({ open }: { open: boolean }) {
  const circuitIntensity = open ? 2.5 : 0.3;
  const doorRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    // Animate Door Lifting
    const targetY = open ? 2.8 : 0.41; // High lift when open, sitting flush when closed
    
    if (doorRef.current) {
      // Smooth lerp movement
      doorRef.current.position.y = THREE.MathUtils.lerp(
        doorRef.current.position.y,
        targetY,
        delta * 2.5
      );
      
      // Slow rotation of the heavy door component
      doorRef.current.rotation.y += delta * 0.05;
    }
  });
  
  return (
    <group position={[0, -1.4, 0]}>
      
      {/* --- MOVING PARTS: The Crystal Door --- */}
      <group ref={doorRef} position={[0, 0.41, 0]}>
        
        {/* Metal Cap/Frame for the Door */}
        <mesh position={[0, -0.85, 0]}>
           <cylinderGeometry args={[1.05, 1.05, 0.1, 6]} />
           <meshStandardMaterial color="#d0d0d0" metalness={1} roughness={0.2} />
        </mesh>
      </group>

      {/* --- STATIC PARTS: The Base --- */}

      {/* Main vault body - cylindrical */}
      <mesh castShadow rotation={[0, 0, 0]}>
        <cylinderGeometry args={[2.5, 2.5, 0.8, 32]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Outer dark metal ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.41, 0]}>
        <torusGeometry args={[2.3, 0.15, 16, 64]} />
        <meshStandardMaterial
          color="#d0d0d0"
          metalness={0.95}
          roughness={0.1}
        />
      </mesh>

      {/* Bronze/copper middle ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.41, 0]}>
        <torusGeometry args={[1.8, 0.2, 16, 64]} />
        <meshStandardMaterial
          color="#966f3c"
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Cyan circuit pattern - outer */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.42, 0]}>
        <torusGeometry args={[2.05, 0.03, 16, 64]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={circuitIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Cyan circuit pattern - middle */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.42, 0]}>
        <torusGeometry args={[1.5, 0.025, 16, 64]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={circuitIntensity}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner dark ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0.41, 0]}>
        <torusGeometry args={[1.2, 0.1, 16, 64]} />
        <meshStandardMaterial
          color="#c0c0c0"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Decorative mechanical elements - 4 positions */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh position={[2.0, 0.41, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 0.1, 16]} />
            <meshStandardMaterial
              color="#e0e0e0"
              metalness={0.8}
              roughness={0.2}
            />
          </mesh>
          {/* Glowing center */}
          <mesh position={[2.0, 0.41, 0]}>
            <cylinderGeometry args={[0.08, 0.08, 0.12, 16]} />
            <meshStandardMaterial
              color="#00ffff"
              emissive="#00ffff"
              emissiveIntensity={circuitIntensity * 0.8}
            />
          </mesh>
        </group>
      ))}

      {/* Rivets on outer ring */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        return (
          <mesh
            key={`rivet-${i}`}
            position={[
              Math.cos(angle) * 2.3,
              0.41,
              Math.sin(angle) * 2.3,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshStandardMaterial
              color="#f0eeee"
              metalness={0.9}
              roughness={0.3}
            />
          </mesh>
        );
      })}

      {/* Ambient vault light (fills the scene slightly) */}
      <pointLight
        position={[0, 2, 0]}
        intensity={0.5}
        color="#ffffff"
        distance={4}
      />
    </group>
  );
}