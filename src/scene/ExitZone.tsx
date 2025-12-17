// scene/ExitZone.tsx
export function ExitZone() {
  return (
    <group position={[0, 0.05, 12]}>
      {/* First bar of X (diagonal \) */}
      <mesh rotation={[0, 0, Math.PI / 4]}>
        <boxGeometry args={[1.2, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
      
      {/* Second bar of X (diagonal /) */}
      <mesh rotation={[0, 0, -Math.PI / 4]}>
        <boxGeometry args={[1.2, 0.15, 0.1]} />
        <meshStandardMaterial
          color="#ffffff"
          emissive="#ffffff"
          emissiveIntensity={0.5}
        />
      </mesh>
    </group>
  );
}
