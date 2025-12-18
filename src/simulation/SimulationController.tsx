import { useEffect, useState } from 'react';
import { Scene } from '../scene/Scene';

import { resetEnvironment } from './reset';
import { agentsState } from './agentsState';
import { worldState } from './worldState';
import { computePlateState } from './updatePlates';
import { runStep } from './gameLoop';
import { metricsTracker } from '../rl/metricsTracker';
import { Q } from '../rl/qTable';

interface SimulationControllerProps {
  onStateChange?: (state: {
    episode: number;
    stepCount: number;
    isRunning: boolean;
    done: boolean;
  }) => void;
  onStartEpisode?: () => void;
  startEpisodeRef?: React.MutableRefObject<(() => void) | null>;
}

export function SimulationController({ onStateChange, startEpisodeRef }: SimulationControllerProps) {
  const [agents, setAgents] = useState<any[]>([]);
  const [plateState, setPlateState] = useState<boolean[]>([false, false, false]);
  const [vaultOpen, setVaultOpen] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [episode, setEpisode] = useState(0);

  // Track episode rewards
  const [episodeRewards, setEpisodeRewards] = useState<Record<string, number>>({
    thief: 0,
    guardian: 0,
    negotiator: 0,
    AgentX: 0,
  });
  const [vaultOpenedThisEpisode, setVaultOpenedThisEpisode] = useState(false);

  // Initialize environment
  useEffect(() => {
    resetEnvironment();
    setAgents([...agentsState]);
    setPlateState(computePlateState());
    setVaultOpen(worldState.vaultOpen);
  }, []);

  // Start new episode
  const startEpisode = () => {
    resetEnvironment();
    setAgents([...agentsState]);
    setPlateState(computePlateState());
    setVaultOpen(worldState.vaultOpen);
    setDone(false);
    setStepCount(0);
    setIsRunning(true);
    setEpisode(prev => prev + 1);
    setEpisodeRewards({ thief: 0, guardian: 0, negotiator: 0, AgentX: 0 });
    setVaultOpenedThisEpisode(false);
    console.log(`[Episode ${episode + 1}] Starting...`);
  };

  // Expose startEpisode to parent via ref
  useEffect(() => {
    if (startEpisodeRef) {
      startEpisodeRef.current = startEpisode;
    }
  }, [episode, startEpisodeRef]);

  // Notify parent of state changes
  useEffect(() => {
    if (onStateChange) {
      onStateChange({ episode, stepCount, isRunning, done });
    }
  }, [episode, stepCount, isRunning, done, onStateChange]);

  // Game loop with RL logic
  useEffect(() => {
    if (!isRunning || done) return;

    const interval = setInterval(() => {
      const result = runStep();

      // Accumulate rewards
      setEpisodeRewards(prev => ({
        thief: prev.thief + result.rewards.thief,
        guardian: prev.guardian + result.rewards.guardian,
        negotiator: prev.negotiator + result.rewards.negotiator,
        AgentX: prev.AgentX + result.rewards.AgentX,
      }));

      // Track if vault opened during episode
      if (worldState.vaultOpen) {
        setVaultOpenedThisEpisode(true);
      }

      // Update UI state from global state
      setAgents([...agentsState]);
      setPlateState(computePlateState());
      setVaultOpen(worldState.vaultOpen);
      setStepCount((s) => s + 1);

      if (result.done) {
        setDone(true);
        setIsRunning(false);

        const finalStepCount = stepCount + 1;
        const crystalOwner = worldState.crystalOwner;
        const success = crystalOwner !== null;

        // Record metrics for this episode
        const finalRewards = {
          thief: episodeRewards.thief + result.rewards.thief,
          guardian: episodeRewards.guardian + result.rewards.guardian,
          negotiator: episodeRewards.negotiator + result.rewards.negotiator,
          AgentX: episodeRewards.AgentX + result.rewards.AgentX,
        };

        metricsTracker.recordEpisode(
          episode,
          finalRewards,
          finalStepCount,
          success,
          worldState.vaultOpen || vaultOpenedThisEpisode,
          crystalOwner,
          Q
        );

        console.log(`[Episode ${episode}] Finished at step ${finalStepCount}`);
        console.log('[Rewards]', finalRewards);
        console.log('[Success]', success);
      }
    }, 1500); // 1500ms per step for better visibility

    return () => clearInterval(interval);
  }, [isRunning, done, stepCount, episode, episodeRewards, vaultOpenedThisEpisode]);

  return (
    <Scene
      agents={agents}
      plateState={plateState}
      vaultOpen={vaultOpen}
    />
  );
}
