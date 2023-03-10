import {Dropdown} from 'semantic-ui-react';
import {Place} from '../../types/data';
import './styles.css';

type Props = {
  places: Place[],
  onPlaceSelected: (place: Place) => void,
};

function PlaceSelector({places, onPlaceSelected}: Props) {
  return (
    <div className="placeSelector">
      <Dropdown
        placeholder="Виберіть регіон"
        fluid
        selection
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
