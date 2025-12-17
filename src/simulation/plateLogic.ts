export const PLATE_RADIUS = 0.8;

export function isOnPlate(
  agentPos: [number, number, number],
  platePos: [number, number, number]
) {
  const dx = agentPos[0] - platePos[0];
  const dz = agentPos[2] - platePos[2];
  return Math.sqrt(dx * dx + dz * dz) < PLATE_RADIUS;
}
