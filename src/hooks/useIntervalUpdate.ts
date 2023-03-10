import {useInterval} from './useInterval';
import {useUpdate} from './useUpdate';

export function useIntervalUpdate(interval: number): void {
  const update = useUpdate();
  useInterval(update, interval);
}
