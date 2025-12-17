export type AgentIntent =
  | 'idle'
  | 'move_to_plate'
  | 'hold_plate'
  | 'enter_vault'
  | 'steal_crystal'
  | 'block'
  | 'negotiate';

export const agentIntent: Record<string, AgentIntent> = {
  thief: 'idle',
  guardian: 'idle',
  negotiator: 'idle',
  opportunist: 'idle',
};
