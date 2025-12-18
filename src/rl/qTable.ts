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
  AgentX: Array(ACTIONS.length).fill(0),
};

const STORAGE_KEY = 'crystal_q_table_v1';

// Load Q-table from storage if available
if (typeof localStorage !== 'undefined') {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.assign(Q, parsed);
      console.log('Loaded Q-table from localStorage');
    }
  } catch (e) {
    console.warn('Failed to load Q-table:', e);
  }
}

// Hyperparameters
const EPSILON = 0.2; // Exploration rate
const LEARNING_RATE = 0.2;
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
  // Find all indices that share the max value
  const bestIndices = q.map((val, i) => val === max ? i : -1).filter(i => i !== -1);
  // Randomly select one of the best indices to break ties
  const idx = bestIndices[Math.floor(Math.random() * bestIndices.length)];
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

  // Persist to storage
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(Q));
  }
}

// Get max Q-value for an agent (for next state)
export function getMaxQ(agentId: string): number {
  return Math.max(...Q[agentId]);
}

// Reset learning (helper for debugging)
export function resetLearning() {
  Object.keys(Q).forEach(key => {
    Q[key] = Array(ACTIONS.length).fill(0);
  });
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  console.log('Q-table reset');
}

