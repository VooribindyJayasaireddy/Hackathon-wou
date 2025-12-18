import { agentsState } from '../simulation/agentsState';
import { canInteract } from '../simulation/interaction';
import { getActionDialogue } from '../simulation/dialogue';

const AGENT_COLORS: Record<string, string> = {
  thief: '#ff4a4a',
  guardian: '#1f68a8',
  negotiator: '#2de680',
  AgentX: '#ffbf4a',
};

export function InteractionPanel({ stepCount }: { stepCount: number }) {
  const agents = agentsState;

  return (
    <div style={{
      position: 'absolute',
      top: 10,
      right: 10,
      width: '300px',
      maxHeight: '90vh',
      overflowY: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'monospace',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    }}>
      <h3 style={{ margin: 0, borderBottom: '1px solid #444', paddingBottom: '5px' }}>
        Agent Status (Step {stepCount})
      </h3>

      {agents.map(agent => (
        <div key={agent.id} style={{
          borderLeft: `4px solid ${AGENT_COLORS[agent.id] || 'white'}`,
          paddingLeft: '10px',
          backgroundColor: 'rgba(255,255,255,0.05)',
          padding: '8px',
          borderRadius: '0 4px 4px 0'
        }}>
          <div style={{ fontWeight: 'bold', color: AGENT_COLORS[agent.id] || 'white', marginBottom: '4px' }}>
            {agent.id.toUpperCase()}
          </div>
          
          <div style={{ fontSize: '12px', marginBottom: '2px', fontStyle: 'italic', color: '#eee' }}>
            "{getActionDialogue(agent.currentAction)}"
          </div>

          {agent.lastDecision && (
            <div style={{ fontSize: '11px', color: '#888' }}>
              <div>Reason: {agent.lastDecision.reason}</div>
              <div>Value: {agent.lastDecision.value.toFixed(3)}</div>
            </div>
          )}

          {/* Show active interactions */}
          <div style={{ marginTop: '5px' }}>
            {agents
              .filter(other => other.id !== agent.id && canInteract(agent.position, other.position))
              .map(other => (
                <div key={other.id} style={{ 
                  fontSize: '10px', 
                  backgroundColor: 'rgba(255,255,0,0.2)', 
                  padding: '2px 4px', 
                  borderRadius: '2px',
                  display: 'inline-block',
                  marginRight: '4px'
                }}>
                  ↔ {other.id}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
