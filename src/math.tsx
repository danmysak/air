export function computeProbabilities(density: number[], step: number): number[] {
  if (density.length === 0) {
    return [];
  }
  const probabilities = [0];
  for (let i = 0; i + 1 < density.length; i++) {
    probabilities.push(probabilities.at(-1)! + (density[i] + density[i + 1]) / 2 * step);
  }

  return probabilities;
}
