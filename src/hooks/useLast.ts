import {useRef} from 'react';
import {equal} from '../helpers/arrays';

export function useLast<T>(value: T, dependencies: any[]): T
export function useLast<T>(value: T | null, dependencies: any[]): T | null {
  const ref = useRef(value);
  const lastDependencies = useRef(dependencies);
  if (!equal(dependencies, lastDependencies.current)) {
    lastDependencies.current = dependencies;
    ref.current = null;
  }
  if (value !== null) {
    ref.current = value;
  }
  return ref.current;
}
