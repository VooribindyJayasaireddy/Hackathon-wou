// rl/baseline.ts
import { AgentAction } from '../simulation/actions';

const ACTIONS: AgentAction[] = [
    'go_plate_0',
    'go_plate_1',
    'go_plate_2',
    'go_vault',
    'wait',
];

/**
 * Random baseline policy - selects actions uniformly at random
 * Used for comparison against the learned Q-learning policy
 */
export class RandomBaseline {
    selectAction(_agentId: string): AgentAction {
        const randomIdx = Math.floor(Math.random() * ACTIONS.length);
        return ACTIONS[randomIdx];
    }

    // No learning in baseline
    update(_actionIdx: number, _reward: number): void {
        // Random baseline doesn't learn
    }
}

/**
 * Fixed policy baseline - always selects the same action
 * Useful for sanity checking
 */
export class FixedBaseline {
    private fixedAction: AgentAction;

    constructor(action: AgentAction = 'wait') {
        this.fixedAction = action;
    }

    selectAction(_agentId: string): AgentAction {
        return this.fixedAction;
    }

    update(_actionIdx: number, _reward: number): void {
        // Fixed baseline doesn't learn
    }
}

export const randomBaseline = new RandomBaseline();
