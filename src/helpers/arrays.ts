export function equal(a: any[], b: any[]): boolean {
  return a.length === b.length && a.every((value, index) => b[index] === value);
}
