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

export function shiftDensity(density: number[], step: number, shift: number): number[] {
  const probabilities = computeProbabilities(density, step);
  const position = shift / step;
  const floored = Math.floor(position);
  const interpolate = (prev: number, next: number) => prev * (floored + 1 - position) + next * (position - floored);
  if (floored >= probabilities.length - 1) {
    return [];
  }
  const trimmed = interpolate(probabilities[floored], probabilities[floored + 1]);
  if (trimmed >= 1) {
    return [];
  }
  const ratio = 1 / (1 - trimmed);
  const result: number[] = [];
  for (let index = floored; index < density.length; index++) {
    result.push(ratio * interpolate(density[index], index + 1 < density.length ? density[index + 1] : density[index]));
  }
  return result;
}
