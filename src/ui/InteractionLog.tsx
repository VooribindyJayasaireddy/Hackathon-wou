import { useEffect, useState } from 'react';
import { agentsState } from '../simulation/agentsState';
import { canInteract } from '../simulation/interaction';
import { computePlateState } from '../simulation/updatePlates';
import { isVaultUnlocked } from '../simulation/vaultLogic';
import { getCrystalOwner } from '../simulation/crystalState';

export function InteractionLog() {
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const entries: string[] = [];

    // Vault status logging
    const plateState = computePlateState();
    const vaultOpen = isVaultUnlocked(plateState);
    
    if (vaultOpen) {
      entries.push('[system] Vault unlocked: 3 plates active');
    } else {
      entries.push('[system] Vault locked');
    }

    // Crystal acquisition logging
    const owner = getCrystalOwner();
    if (owner) {
      entries.push(`[event] Crystal acquired by ${owner}`);
    }

    agentsState.forEach((a, i) => {
      agentsState.forEach((b, j) => {
        if (i >= j) return;
        if (canInteract(a.position, b.position)) {
          entries.push(
            `[interaction] ${a.id} ↔ ${b.id}`
          );
        }
      });
    });

    setLogs(entries);
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 20,
        left: 20,
        color: '#dddddd',
        fontFamily: 'monospace',
        fontSize: 12,
        opacity: 0.8,
      }}
    >
      {logs.map((l, i) => (
        <div key={i}>{l}</div>
      ))}
    </div>
  );
}
