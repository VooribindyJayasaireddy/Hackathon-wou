import { step } from '../simulation/step';
import { Policy } from './policy';

const agents = ['thief', 'guardian', 'negotiator', 'AgentX'];

const policies: Record<string, Policy> = {
  thief: new Policy(),
  guardian: new Policy(),
  negotiator: new Policy(),
  AgentX: new Policy(),
};

for (let episode = 0; episode < 200; episode++) {
  let done = false;

  while (!done) {
    const actions: any = {};

    agents.forEach(id => {
      actions[id] = policies[id].sample();
    });

    const { rewards, done: episodeDone } = step(actions);

    agents.forEach(id => {
      const reward = rewards[id];
      const actionIndex = 0; // track sampled index in real impl
      policies[id].update(actionIndex, reward);
    });

    done = episodeDone;
  }

  console.log(`Episode ${episode} complete`);
}
