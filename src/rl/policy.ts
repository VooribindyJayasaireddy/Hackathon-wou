import { AgentAction } from '../simulation/actions';

const ACTIONS: AgentAction[] = [
  'go_plate_0',
  'go_plate_1',
  'go_plate_2',
  'go_vault',
  'wait',
];

export class Policy {
  probs: number[];

  constructor() {
    this.probs = Array(ACTIONS.length).fill(1 / ACTIONS.length);
  }

  sample(): AgentAction {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < this.probs.length; i++) {
      acc += this.probs[i];
      if (r < acc) return ACTIONS[i];
    }
    return ACTIONS[ACTIONS.length - 1];
  }

  update(actionIndex: number, advantage: number) {
    this.probs[actionIndex] += 0.05 * advantage;
    this.normalize();
  }

  normalize() {
    const sum = this.probs.reduce((a, b) => a + b, 0);
    this.probs = this.probs.map(p => Math.max(p / sum, 0.01));
  }
}
