// scene/Floor.tsx
export function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
      <planeGeometry args={[20, 20, 40, 40]} />
      <meshStandardMaterial
        color="#0a0a0a"
        metalness={0.9}
        roughness={0.1}
        emissive="#ffffff"
        emissiveIntensity={0.1}
        wireframe={true}
      />
    </mesh>
  );
}
