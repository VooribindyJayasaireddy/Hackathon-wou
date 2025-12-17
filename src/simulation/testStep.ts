// simulation/testStep.ts
import { step } from './step';

const result = step({
  thief: 'wait',
  guardian: 'wait',
  negotiator: 'wait',
  opportunist: 'wait',
});

console.log(result);
