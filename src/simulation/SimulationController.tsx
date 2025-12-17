import { useEffect, useState } from 'react';
import { Scene } from '../scene/Scene';

import { resetEnvironment } from './reset';
import { agentsState } from './agentsState';
import { worldState } from './worldState';
import { computePlateState } from './updatePlates';
import { runStep } from './gameLoop';

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

      // Update UI state from global state
      setAgents([...agentsState]);
      setPlateState(computePlateState());
      setVaultOpen(worldState.vaultOpen);
      setStepCount((s) => s + 1);

      if (result.done) {
        setDone(true);
        setIsRunning(false);
        console.log(`[Episode ${episode}] Finished at step ${stepCount + 1}`);
        console.log('[Rewards]', result.rewards);
      }
    }, 500); // 500ms per step for visibility

    return () => clearInterval(interval);
  }, [isRunning, done, stepCount, episode]);

  return (
    <Scene
      agents={agents}
      plateState={plateState}
      vaultOpen={vaultOpen}
    />
  );
}
