import { getVaultOccupant } from './vaultOccupancy';
import { tryAssignCrystal } from './crystalState';

let enterCount = 0;

export function updateCrystalPossession(vaultOpen: boolean) {
  if (!vaultOpen) {
    enterCount = 0;
    return;
  }

  const occupant = getVaultOccupant();
  if (!occupant) return;

  enterCount++;
  if (enterCount >= 2) {
    tryAssignCrystal(occupant.id);
  }
}
