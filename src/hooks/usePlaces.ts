import {ApiPlaces} from '../types/api';
import {Place} from '../types/data';
import {ApiState, useApi} from './useApi';

export function usePlaces(attemptId: number): ApiState<Place[]> {
  return useApi(
    process.env.REACT_APP_API_ENDPOINT_PLACES!,
    attemptId,
    (places: ApiPlaces) => places.map((place) => ({
      id: place.place_id,
      name: place.name,
    })),
  );
}
