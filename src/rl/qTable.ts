// rl/qTable.ts
import { AgentAction } from '../simulation/actions';

const ACTIONS: AgentAction[] = [
  'go_plate_0',
  'go_plate_1',
  'go_plate_2',
  'go_vault',
  'wait',
];

export const Q: Record<string, number[]> = {
  thief: Array(ACTIONS.length).fill(0),
  guardian: Array(ACTIONS.length).fill(0),
  negotiator: Array(ACTIONS.length).fill(0),
  opportunist: Array(ACTIONS.length).fill(0),
};

// Hyperparameters
const EPSILON = 0.2; // Exploration rate
const LEARNING_RATE = 0.1;
const DISCOUNT_FACTOR = 0.95;

// Epsilon-greedy action selection
export function selectAction(agentId: string, explore: boolean = true): AgentAction {
  const q = Q[agentId];
  
  // Exploration: random action
  if (explore && Math.random() < EPSILON) {
    const randomIdx = Math.floor(Math.random() * ACTIONS.length);
    return ACTIONS[randomIdx];
  }
  
  // Exploitation: best action
  const max = Math.max(...q);
  const idx = q.indexOf(max);
  return ACTIONS[idx];
}

// Get action index for a given action
export function getActionIndex(action: AgentAction): number {
  return ACTIONS.indexOf(action);
}

// Update Q-value using Q-learning formula
export function updateQ(
  agentId: string,
  actionIdx: number,
  reward: number,
  nextMaxQ: number = 0
) {
  const oldQ = Q[agentId][actionIdx];
  const newQ = oldQ + LEARNING_RATE * (reward + DISCOUNT_FACTOR * nextMaxQ - oldQ);
  Q[agentId][actionIdx] = newQ;
}

// Get max Q-value for an agent (for next state)
export function getMaxQ(agentId: string): number {
  return Math.max(...Q[agentId]);
}
