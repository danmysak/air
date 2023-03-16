import {Dropdown} from 'semantic-ui-react';
import {Place} from '../../types/data';
import './styles.css';

type Props = {
  places: Place[],
  selected?: number,
  onPlaceSelected: (place: Place) => void,
};

function PlaceSelector({places, selected, onPlaceSelected}: Props) {
  return (
    <div className="placeSelector">
      <Dropdown
        value={selected}
        placeholder="Виберіть регіон"
        fluid
        selection
        search
        noResultsMessage="Регіонів не знайдено"
        options={places.map(({id, name}) => ({
          text: name,
          value: id,
        }))}
        onChange={(_, props) => onPlaceSelected(places.find((place) => place.id === props.value)!)}
      />
    </div>
  );
}

export default PlaceSelector;
