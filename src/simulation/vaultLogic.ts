// simulation/vaultLogic.ts
export function isVaultUnlocked(plates: boolean[]) {
  return plates.filter(Boolean).length === 3;
}