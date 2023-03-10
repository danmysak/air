import {useEffect, useRef} from 'react';

export function useInterval(callback: (() => void) | null, delay: number): void {
  const savedCallback = useRef<(() => void) | null>();

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
