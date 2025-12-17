export function IntentRing({
  color,
}: {
  color: string;
}) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 1.8, 0]}>
      <ringGeometry args={[0.35, 0.45, 32]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.5}
      />
    </mesh>
  );
}
