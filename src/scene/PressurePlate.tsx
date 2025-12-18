export function PressurePlate({
  index: _index,
  position,
  active,
}: {
  index: number;
  position: [number, number, number];
  active: boolean;
}) {

  return (
    <group position={position}>
      {/* Base */}
      <mesh receiveShadow>
        <cylinderGeometry args={[0.7, 0.7, 0.12, 32]} />
        <meshStandardMaterial
          color="#0e0e0e"
          metalness={0.9}
          roughness={0.15}
        />
      </mesh>

      {/* Energy Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.9, 0.04, 16, 64]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={active ? 2.0 : 0.4}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Subtle light spill */}
      <pointLight
        position={[0, 0.2, 0]}
        intensity={active ? 1.2 : 0.3}
        color="#ffffff"
        distance={2.5}
      />
    </group>
  );
}
