import { Canvas } from '@react-three/fiber';
import { SimulationController } from './simulation/SimulationController';
import { useRef, useState } from 'react';

export default function App() {
  const startEpisodeRef = useRef<(() => void) | null>(null);
  const [simState, setSimState] = useState({
    episode: 0,
    stepCount: 0,
    isRunning: false,
    done: false,
  });

  const handleStartEpisode = () => {
    if (startEpisodeRef.current) {
      startEpisodeRef.current();
    }
  };

  return (
    <>
      {/* UI Controls - OUTSIDE Canvas */}
      <div style={{ 
        position: 'absolute', 
        top: 10, 
        left: 10, 
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <button 
          onClick={handleStartEpisode}
          disabled={simState.isRunning}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: simState.isRunning ? 'not-allowed' : 'pointer',
            backgroundColor: simState.isRunning ? '#666' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          {simState.isRunning ? 'Running...' : simState.done ? 'Start New Episode' : 'Start Episode'}
        </button>
        
        <div style={{ 
          color: 'white', 
          backgroundColor: 'rgba(0,0,0,0.7)', 
          padding: '10px',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <div>Episode: {simState.episode}</div>
          <div>Step: {simState.stepCount}</div>
          <div>Status: {simState.done ? 'Complete' : simState.isRunning ? 'Running' : 'Ready'}</div>
        </div>
      </div>

      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 12, 16], fov: 45 }}>
        <SimulationController 
          startEpisodeRef={startEpisodeRef}
          onStateChange={setSimState}
        />
      </Canvas>
    </>
  );
}
