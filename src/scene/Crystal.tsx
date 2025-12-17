import { Float, Sparkles } from '@react-three/drei';
import { getCrystalOwner } from '../simulation/crystalState';

export function Crystal() {
  const owner = getCrystalOwner();

  // Hide crystal once picked up
  if (owner !== null) return null;

  return (
    <group position={[0, 1.2, 0]}>
      <Float speed={2} rotationIntensity={1.5} floatIntensity={1}>
        <mesh castShadow>
          <octahedronGeometry args={[0.4, 0]} />
          <meshStandardMaterial
            color="#b7bfbf"
            emissive="#b7bfbf"
            emissiveIntensity={2}
            toneMapped={false}
            roughness={0.1}
            metalness={1}
          />
        </mesh>

        <pointLight
          color="#b7bfbf"
          intensity={2}
          distance={3}
          decay={2}
        />
      </Float>

      <Sparkles
        count={25}
        scale={1.2}
        size={3}
        speed={0.4}
        opacity={0.6}
        color="#aaddff"
      />
    </group>
  );
}
