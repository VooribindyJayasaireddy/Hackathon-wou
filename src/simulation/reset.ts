// simulation/reset.ts
import { resetCrystal } from './crystalState';
import { agentsState } from './agentsState';
import { worldState } from './worldState';
import { resetPlateHold } from './plateHold';

// Initial agent positions
const INITIAL_POSITIONS: Record<string, [number, number, number]> = {
  thief: [-7, -1.7, 0],
  guardian: [7, -1.7, 0],
  negotiator: [0, -1.7, -7],
  AgentX: [0, -1.7, 7],
};

export function resetEnvironment() {
  // Reset crystal ownership
  resetCrystal();
  
  // Reset agent positions to initial state
  agentsState.forEach(agent => {
    const initialPos = INITIAL_POSITIONS[agent.id];
    if (initialPos) {
      agent.position[0] = initialPos[0];
      agent.position[1] = initialPos[1];
      agent.position[2] = initialPos[2];
    }
  });
  
  // Reset world state
  worldState.vaultOpen = false;
  worldState.pressurePlates = [false, false, false];
  
  // Reset plate hold timers
  resetPlateHold();
}
