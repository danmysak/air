import {useEffect, useState} from 'react';
import {timeout} from '../helpers/promises';
import {useFirst} from './useFirst';

export enum LoadingState {
  Idle = 'idle',
  Loading = 'loading',
  Error = 'error',
  Ok = 'ok',
}

export type ApiData<T> = {
  dates: {
    server: Date,
    client: Date,
  },
  data: T,
};

export type ApiRequestData = {
  endpoint: string | null,
  requestId: number,
};

export type ApiState<T> = {
  loadingState: LoadingState.Idle | LoadingState.Loading | LoadingState.Error,
  request: ApiRequestData,
} | {
  loadingState: LoadingState.Ok,
  request: ApiRequestData,
  data: ApiData<T>,
};

export function useApi<S, T>(
  endpoint: string | null,
  requestId: number,
  dataProcessor: (json: S) => T,
  minDelay: number = 0,
): ApiState<T> {
  const constructLoadingState = (): ApiState<T> => ({
    loadingState: LoadingState.Loading,
    request: {endpoint, requestId},
  });
  const [state, setState] = useState<ApiState<T>>(constructLoadingState);
  const [fixedDataProcessor] = useState(() => dataProcessor);
  const fixedMinDelay = useFirst(minDelay, [endpoint, requestId]);
  useEffect(() => {
    let active = true;
    (async () => {
      const startTime = new Date();
      if (endpoint === null) {
        setState({
          loadingState: LoadingState.Idle,
          request: {endpoint, requestId},
        });
      } else {
        setState({
          loadingState: LoadingState.Loading,
          request: {endpoint, requestId},
        });
        try {
          const response = await fetch(process.env.REACT_APP_API_PREFIX! + endpoint, {cache: 'no-cache'});
          if (response.status !== 200) {
            throw new Error(`Server responded with status ${response.status}`);
          }
          const json = await response.json();
          const elapsed = new Date().getTime() - startTime.getTime();
          if (elapsed < fixedMinDelay) {
            await timeout(fixedMinDelay - elapsed);
          }
          if (active) {
            setState({
              loadingState: LoadingState.Ok,
              request: {endpoint, requestId},
              data: {
                dates: {
                  server: new Date(response.headers.get('date')!),
                  client: new Date(),
                },
                data: fixedDataProcessor(json),
              },
            });
          }
        } catch (e) {
          if (active) {
            setState({
              loadingState: LoadingState.Error,
              request: {endpoint, requestId},
            });
          }
        }
      }
    })();
    return () => {
      active = false;
    };
  }, [fixedDataProcessor, fixedMinDelay, endpoint, requestId]);
  return state.request.endpoint === endpoint && state.request.requestId === requestId
    ? state
    : constructLoadingState();
}
