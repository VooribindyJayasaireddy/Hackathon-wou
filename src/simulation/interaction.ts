export const INTERACTION_RADIUS = 2.2;

export function canInteract(
  a: [number, number, number],
  b: [number, number, number]
) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz) < INTERACTION_RADIUS;
}
