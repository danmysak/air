import {Header, Segment} from 'semantic-ui-react';

import {Data} from '../data';
import Graph from '../Graph';
import {computeProbabilities} from '../math';
import './styles.css';

type Props = {
  data: Data
};

function Visualizer({data}: Props) {
  return (
    <div className="visualizer">
      <Header as="h1">Air raid alert duration predictor</Header>
      <Segment className="visualizer_segment">
        <Header as="h2">Probability density</Header>
        <div className="visualizer_graph">
          <Graph
            data={data.pdf.map((value, index) => [index, value])}
            height={100}
            fill="#1C82AD"
          />
        </div>
      </Segment>
      <Segment className="visualizer_segment">
        <Header as="h2">Cumulative probability</Header>
        <div className="visualizer_graph">
          <Graph
            data={computeProbabilities(data.pdf, data.step).map((value, index) => [index, value])}
            height={100}
            fill="#03C988"
          />
        </div>
      </Segment>
    </div>
  );
}

export default Visualizer;
