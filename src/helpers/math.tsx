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

function computeProbabilityAtSimple(probabilities: number[], position: number): number {
  if (probabilities.length === 0) {
    return 0;
  }
  if (position <= 0) {
    return probabilities[0];
  }
  if (position >= probabilities.length - 1) {
    return probabilities[probabilities.length - 1];
  }
  const index = Math.floor(position);
  return probabilities[index] * (index + 1 - position) + probabilities[index + 1] * (position - index);
}

export function computeProbabilityAt(probabilities: number[], position: number, trimPosition: number = 0): number {
  const total = computeProbabilityAtSimple(probabilities, position);
  const trimmed = computeProbabilityAtSimple(probabilities, trimPosition);
  return trimmed < Math.min(total, 1) ? (total - trimmed) / (1 - trimmed) : 0;
}

export function findProbabilityPosition(probabilities: number[], value: number, trimPosition: number = 0): number {
  if (trimPosition >= probabilities.length - 1 || value <= 0) {
    return trimPosition;
  }
  if (value >= computeProbabilityAt(probabilities, probabilities.length - 1, trimPosition)) {
    return probabilities.length - 1;
  }
  let left = Math.floor(trimPosition);
  let right = probabilities.length - 1;
  while (right - left > 1) {
    const middle = Math.floor((left + right) / 2);
    if (computeProbabilityAt(probabilities, middle, trimPosition) > value) {
      right = middle;
    } else {
      left = middle;
    }
  }
  const leftProbability = computeProbabilityAt(probabilities, left, trimPosition);
  const rightProbability = computeProbabilityAt(probabilities, right, trimPosition);
  return Math.max(trimPosition, left + (value - leftProbability) / (rightProbability - leftProbability));
}
