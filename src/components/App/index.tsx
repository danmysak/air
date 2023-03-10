import assert from 'assert';
import {Header, Loader} from 'semantic-ui-react';
import {useState} from 'react';
import AnimateHeight from 'react-animate-height';
import {Place} from '../../types/data';
import {LoadingState} from '../../hooks/useApi';
import {usePlaces} from '../../hooks/usePlaces';
import Error from '../Error';
import PlaceSelector from '../PlaceSelector';
import Visualizer from '../Visualizer';
import './styles.css';

const HEIGHT_ANIMATION_DURATION = 500;

function App() {
  const [placesRequestId, setPlacesRequestId] = useState(0)
  const places = usePlaces(placesRequestId);
  type PlaceData = {
    place: Place | null,
    previousPlace: Place | null,
  };
  const [selectedPlace, setSelectedPlace] = useState<PlaceData>({
    place: null,
    previousPlace: null,
  });

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
      return (
        <div className="app_home">
          <Header as="h1">
            Прогноз тривалості повітряної тривоги
          </Header>
          <PlaceSelector places={places.data.data} onPlaceSelected={(place) => setSelectedPlace((prev) => ({
            place,
            previousPlace: prev.place,
          }))} />
          <AnimateHeight height={selectedPlace.place ? 'auto' : 0} duration={HEIGHT_ANIMATION_DURATION}>
            {selectedPlace.place && (
              <div className="app_visualizer">
                <Visualizer place={selectedPlace.place} minDelay={selectedPlace.previousPlace === null
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
