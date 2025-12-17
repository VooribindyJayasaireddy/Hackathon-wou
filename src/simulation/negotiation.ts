export function isNegotiating(
  plateState: boolean[],
  stepCount: number
) {
  // All plates occupied AND during hold window
  return plateState.every(Boolean) && stepCount < 6;
}
