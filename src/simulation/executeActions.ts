// simulation/executeActions.ts
import { agentsState } from './agentsState';
import { AgentAction } from './actions';
import { ACTION_TARGETS } from './actionTargets';

export function executeActions(
  actions: Record<string, AgentAction>
) {
  agentsState.forEach(agent => {
    const action = actions[agent.id];
    agent.currentAction = action;

    if (action === 'wait') {
        agent.targetPosition = [...agent.position] as [number, number, number];
        return;
    }

    const target = ACTION_TARGETS[action];
    if (!target) return;

    // Update target position for UI interpolation
    agent.targetPosition = [target[0], target[1], target[2]];

    // Immediate logical update (for simulation calculations)
    // The visual layer (Agent.tsx) will handle the smooth transition
    agent.position[0] = target[0];
    agent.position[2] = target[2];
  });
}
