export function formatTime(time: Date): string {
  return [
    time.getHours().toString(),
    time.getMinutes().toString().padStart(2, '0'),
  ].join(':');
}

export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}
