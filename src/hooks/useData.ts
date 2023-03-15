import {useState} from 'react';
import {ApiAlert} from '../types/api';
import {Data} from '../types/data';
import {ApiData, ApiRequestData, ApiState, LoadingState, useApi} from './useApi';
import {useFirst} from './useFirst';
import {useInterval} from './useInterval';
import {useLast} from './useLast';
import {useIntervalUpdate} from './useIntervalUpdate';

const PLACE_PLACEHOLDER = '{PLACE}';
const UPDATE_INTERVAL = 1000;
const REQUEST_INTERVAL = 60000;

function transformData(
  alert: ApiData<ApiAlert>,
  request: ApiRequestData,
  timeDelta: number,
  success: boolean = true,
  ): ApiState<Data> {
  const current = new Date();
  return {
    loadingState: LoadingState.Ok,
    request,
    data: {
      dates: alert.dates,
      success,
      data: {
        start: alert.data.reference_time === null
          ? null
          : new Date(new Date(alert.data.reference_time).getTime() + timeDelta),
        current,
        density: alert.data.pdf,
      },
    },
  };
}

export function useData(placeId: number | null, attemptId: number, minDelay: number = 0): ApiState<Data> {
  const [baseRequestId, setBaseRequestId] = useState(0);
  useIntervalUpdate(UPDATE_INTERVAL);
  useInterval(() => {
    setBaseRequestId(Math.random());
  }, REQUEST_INTERVAL);
  const alert = useApi(
    placeId === null
      ? null
      : process.env.REACT_APP_API_ENDPOINT_ALERT!.replaceAll(PLACE_PLACEHOLDER, placeId.toString()),
    baseRequestId + attemptId,
    (alert: ApiAlert) => alert,
    minDelay,
  );

  const timeDelta = useFirst(
    alert.loadingState === LoadingState.Ok
      ? alert.data.dates.client.getTime() - alert.data.dates.server.getTime()
      : null,
    [placeId, attemptId],
  );
  const lastAlert = useLast(
    alert.loadingState === LoadingState.Ok ? alert : null,
    [placeId, attemptId],
  );

  if (alert.loadingState === LoadingState.Idle || (
    (alert.loadingState === LoadingState.Error || alert.loadingState === LoadingState.Loading) && lastAlert === null
  )) {
    return alert;
  } else if (alert.loadingState === LoadingState.Ok) {
    return transformData(alert.data, alert.request, timeDelta!);
  } else {
    return transformData(lastAlert!.data, lastAlert!.request, timeDelta!, alert.loadingState !== LoadingState.Error);
  }
}
