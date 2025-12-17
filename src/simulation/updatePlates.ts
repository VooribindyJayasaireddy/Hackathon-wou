// simulation/updatePlates.ts
import { agentsState } from './agentsState';
import { PLATE_POSITIONS } from './platesState';
import { isOnPlate } from './plateLogic';

export function computePlateState() {
  return PLATE_POSITIONS.map((platePos) =>
    agentsState.some((agent) =>
      isOnPlate(agent.position, platePos)
    )
  );
}
