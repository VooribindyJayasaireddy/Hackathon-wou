// simulation/rewards.ts
export type RewardMap = Record<string, number>;

export function computeRewards(
  vaultOpen: boolean,
  crystalOwner: string | null
): RewardMap {
  const rewards: RewardMap = {
    thief: 0,
    guardian: 0,
    negotiator: 0,
    AgentX: 0,
  };

  if (vaultOpen) {
    Object.keys(rewards).forEach(id => {
      rewards[id] += 0.2;
    });
  }

  if (crystalOwner) {
    rewards[crystalOwner] += 50.0;
  }

  // Step penalty to encourage speed
  Object.keys(rewards).forEach(id => {
    rewards[id] -= 0.05;
  });

  return rewards;
}
