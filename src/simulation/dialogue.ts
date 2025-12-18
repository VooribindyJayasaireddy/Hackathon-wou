
import { AgentAction } from "./actions";

export function getActionDialogue(action: AgentAction | undefined): string {
  if (!action) return "...";
  
  switch (action) {
    case 'go_plate_0':
      return "I will stand on plate 1";
    case 'go_plate_1':
      return "I will stand on plate 2";
    case 'go_plate_2':
      return "I will stand on plate 3";
    case 'go_vault':
      return "I go for crystal";
    case 'wait':
      return "Thinking...";
    default:
      return action;
  }
}
