// simulation/executeActions.ts
import { agentsState } from './agentsState';
import { AgentAction } from './actions';
import { ACTION_TARGETS } from './actionTargets';

export function executeActions(
  actions: Record<string, AgentAction>
) {
  agentsState.forEach(agent => {
    const action = actions[agent.id];

    if (action === 'wait') return;

    const target = ACTION_TARGETS[action];
    if (!target) return;

    // snap movement (simple, acceptable)
    agent.position[0] = target[0];
    agent.position[2] = target[2];
  });
}
