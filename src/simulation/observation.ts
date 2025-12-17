// simulation/observation.ts
import { agentsState } from './agentsState';
import { getCrystalOwner } from './crystalState';

export type AgentObservation = {
  selfPos: [number, number, number];
  plates: boolean[];
  vaultOpen: boolean;
  crystalAvailable: boolean;
};

export function getObservation(
  agentId: string,
  plates: boolean[],
  vaultOpen: boolean
): AgentObservation {
  const agent = agentsState.find(a => a.id === agentId)!;

  return {
    selfPos: agent.position,
    plates,
    vaultOpen,
    crystalAvailable: getCrystalOwner() === null,
  };
}
