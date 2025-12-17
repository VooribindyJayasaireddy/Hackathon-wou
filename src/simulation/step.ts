// simulation/step.ts
import { AgentAction } from './actions';
import { computePlateState } from './updatePlates';
import { updateCrystalPossession } from './crystalLogic';
import { getCrystalOwner } from './crystalState';
import { computeRewards } from './rewards';
import { getObservation } from './observation';
import { executeActions } from './executeActions';
import { updatePlateHold, platesSatisfied } from './plateHold';

export function step(actions: Record<string, AgentAction>) {
  // Execute agent actions (movement)
  executeActions(actions);

  const plates = computePlateState();
  updatePlateHold(plates);
  const vaultOpen = platesSatisfied();

  updateCrystalPossession(vaultOpen);

  const crystalOwner = getCrystalOwner();
  const rewards = computeRewards(vaultOpen, crystalOwner);

  const observations = {
    thief: getObservation('thief', plates, vaultOpen),
    guardian: getObservation('guardian', plates, vaultOpen),
    negotiator: getObservation('negotiator', plates, vaultOpen),
    opportunist: getObservation('opportunist', plates, vaultOpen),
  };

  const done = crystalOwner !== null;

  return {
    observations,
    rewards,
    done,
  };
}
