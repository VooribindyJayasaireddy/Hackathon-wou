import { step } from './step';
import { AgentAction } from './actions';
import { selectAction, getActionIndex, updateQ, getMaxQ } from '../rl/qTable';

const agents = ['thief', 'guardian', 'negotiator', 'opportunist'];

// Store previous actions for Q-learning updates
const previousActions: Record<string, { action: AgentAction; actionIdx: number }> = {};

export function runStep() {
  const actions: Record<string, AgentAction> = {};

  // Select actions for all agents using RL policy
  agents.forEach(id => {
    const action = selectAction(id, true); // true = enable exploration
    const actionIdx = getActionIndex(action);
    actions[id] = action;
    
    // Store for Q-learning update
    previousActions[id] = { action, actionIdx };
  });

  // Execute step in environment
  const result = step(actions);

  // Update Q-values based on rewards (Q-learning)
  agents.forEach(id => {
    const { actionIdx } = previousActions[id];
    const reward = result.rewards[id];
    const nextMaxQ = result.done ? 0 : getMaxQ(id); // No future reward if done
    
    updateQ(id, actionIdx, reward, nextMaxQ);
  });

  return result;
}
