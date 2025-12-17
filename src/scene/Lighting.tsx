// scene/Lighting.tsx
export function Lighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        color="#ffffff"
      />
      <pointLight position={[0, 5, 0]} intensity={1} distance={20} />
      <pointLight position={[-5, 3, 5]} intensity={0.5} distance={15} color="#b0b0b0" />
      <pointLight position={[5, 3, -5]} intensity={0.5} distance={15} color="#808080" />
    </>
  );
}
