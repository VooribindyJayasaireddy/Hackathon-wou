export const VAULT_RADIUS = 1.5;
export const VAULT_CENTER: [number, number, number] = [0, -1.4, 0];

export function isInsideVault(pos: [number, number, number]) {
  const dx = pos[0] - VAULT_CENTER[0];
  const dz = pos[2] - VAULT_CENTER[2];
  return Math.sqrt(dx * dx + dz * dz) < VAULT_RADIUS;
}
