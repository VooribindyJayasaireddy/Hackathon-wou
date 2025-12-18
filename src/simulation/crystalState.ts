import { worldState } from './worldState';

let crystalOwner: string | null = null;

export function getCrystalOwner() {
  return crystalOwner;
}

export function tryAssignCrystal(agentId: string) {
  if (crystalOwner === null) {
    crystalOwner = agentId;
    worldState.crystalOwner = agentId;
    return true;
  }
  return false;
}

export function resetCrystal() {
  crystalOwner = null;
  worldState.crystalOwner = null;
}
