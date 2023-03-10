import {useCallback, useState} from 'react';

export function useUpdate(): () => void {
  const [, setCounter] = useState(0);
  return useCallback(() => setCounter((counter) => counter + 1), []);
}
