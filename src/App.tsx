import {Loader} from 'semantic-ui-react';

import {useData} from './useData';
import Visualizer from './Visualizer';

function App() {
  const data = useData();
  if (data === null) {
    return <Loader active={true} />;
  } else {
    return <Visualizer data={data} />;
  }
}

export default App;
