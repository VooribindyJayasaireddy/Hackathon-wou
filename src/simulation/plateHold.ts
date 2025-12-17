const hold: Record<number, number> = { 0: 0, 1: 0, 2: 0 };
const REQUIRED = 2; // steps

export function updatePlateHold(active: boolean[]) {
  active.forEach((on, i) => {
    hold[i] = on ? hold[i] + 1 : 0;
  });
}

export function platesSatisfied() {
  return Object.values(hold).every(v => v >= REQUIRED);
}

export function resetPlateHold() {
  hold[0] = 0;
  hold[1] = 0;
  hold[2] = 0;
}
