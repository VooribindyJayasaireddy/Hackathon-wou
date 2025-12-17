import { agentsState } from './agentsState';
import { isInsideVault } from './vaultZone';

export function getVaultOccupant() {
  const inside = agentsState.filter(a =>
    isInsideVault(a.position)
  );

  return inside.length === 1 ? inside[0] : null;
}
