import { Agent } from './Agent';

export function Agents({ agents }: { agents: any[] }) {
  return (
    <>
      {agents.map(a => (
        <Agent key={a.id} agent={a} />
      ))}
    </>
  );
}
