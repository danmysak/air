import assert from 'assert';
import {Header, Loader} from 'semantic-ui-react';
import {useState} from 'react';
import AnimateHeight from 'react-animate-height';
import {LoadingState} from '../../hooks/useApi';
import {usePlaces} from '../../hooks/usePlaces';
import Error from '../Error';
import PlaceSelector from '../PlaceSelector';
import Visualizer from '../Visualizer';
import './styles.css';

const HEIGHT_ANIMATION_DURATION = 500;
const PLACE_STORAGE_KEY = 'place';

function getStoredPlace(): number | null {
  const item = localStorage.getItem(PLACE_STORAGE_KEY);
  if (item === null) {
    return null;
  }
  const id = parseInt(item);
  return isNaN(id) ? null : id;
}

function setStoredPlace(id: number): void {
  localStorage.setItem(PLACE_STORAGE_KEY, id.toString());
}

function App() {
  const [placesRequestId, setPlacesRequestId] = useState(0)
  const places = usePlaces(placesRequestId);
  type PlaceData = {
    place: number | null,
    previousPlace: number | null,
  };
  const [selectedPlace, setSelectedPlace] = useState<PlaceData>(() => ({
    place: getStoredPlace(),
    previousPlace: null,
  }));

  const getContent = () => {
    if (places.loadingState === LoadingState.Loading) {
      return (
        <Loader active={true} />
      );
    } else if (places.loadingState === LoadingState.Error) {
      return (
        <Error message="Не вдалося під’єднатися до сервера." onRetry={() => setPlacesRequestId((id) => id + 1)} />
      );
    } else {
      assert(places.loadingState === LoadingState.Ok);
      const selectedPlaceData = places.data.data.find((place) => place.id === selectedPlace.place);
      return (
        <div className="app_home">
          <Header as="h1">
            Прогноз тривалості повітряної тривоги
          </Header>
          <PlaceSelector
            places={places.data.data}
            selected={selectedPlaceData?.id}
            onPlaceSelected={(place) => {
              setStoredPlace(place.id);
              setSelectedPlace({
                place: place.id,
                previousPlace: selectedPlaceData?.id ?? null,
              });
            }}
          />
          <AnimateHeight height={selectedPlaceData ? 'auto' : 0} duration={HEIGHT_ANIMATION_DURATION}>
            {selectedPlaceData && (
              <div className="app_visualizer">
                <Visualizer place={selectedPlaceData} minDelay={selectedPlace.previousPlace === null
                  ? HEIGHT_ANIMATION_DURATION // so that animation does not jitter
                  : 0} />
              </div>
            )}
          </AnimateHeight>
        </div>
      );
    }
  };

  return (
    <main className="app">
      {getContent()}
    </main>
  );
}

export default App;
