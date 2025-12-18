import { OrbitControls } from '@react-three/drei';
import { Lighting } from './Lighting';
import { Floor } from './Floor';
import { Vault } from './Vault';
import { PressurePlates } from './PressurePlates';
import { ExitZone } from './ExitZone';
import { Crystal } from './Crystal';
import { Particles } from './Particles';
import { Agents } from '../agents/Agents';
import { InteractionLinks } from './InteractionLinks';

export function Scene({
  agents,
  plateState,
  vaultOpen,
}: {
  agents: any[];
  plateState: boolean[];
  vaultOpen: boolean;
}) {
  return (
    <>
      <OrbitControls />
      <Lighting />
      <Floor />
      <Particles />

      <Vault open={vaultOpen} />
      <PressurePlates state={plateState} />
      <Crystal />
      <ExitZone />
      <Agents agents={agents} />
      <InteractionLinks agents={agents} />


    </>
  );
}
