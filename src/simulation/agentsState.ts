import { AgentAction } from './actions';

export const agentsState: Array<{
  id: string;
  position: [number, number, number];
  targetPosition: [number, number, number];
  color: string;
  currentAction?: AgentAction;
  lastDecision?: {
    action: AgentAction;
    reason: string;
    value: number;
  };
}> = [
  { 
    id: 'thief', 
    position: [-7, -1.7, 0], 
    targetPosition: [-7, -1.7, 0],
    color: '#ffffff',
    currentAction: 'wait' 
  },
  { 
    id: 'guardian', 
    position: [7, -1.7, 0], 
    targetPosition: [7, -1.7, 0],
    color: '#ff5555',
    currentAction: 'wait'
  },
  { 
    id: 'negotiator', 
    position: [0, -1.7, -7], 
    targetPosition: [0, -1.7, -7],
    color: '#55ff55',
    currentAction: 'wait'
  },
  { 
    id: 'AgentX', 
    position: [0, -1.7, 7], 
    targetPosition: [0, -1.7, 7],
    color: '#5555ff',
    currentAction: 'wait'
  },
];
