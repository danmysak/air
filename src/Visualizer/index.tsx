import {Data} from '../data';
import Graph, {DataPoint} from '../Graph';
import {computeProbabilities} from '../math';
import './styles.css';

const GRAPH_HEIGHT = 200;
const DENSITY_COLOR = '#1C82AD';
const PROBABILITY_COLOR = '#03C988';

type Props = {
  data: Data
};

function generateDataPoints(values: number[], start: Date, step: number): DataPoint[] {
  return values.map((value, index) => ({
    value,
    time: new Date(start.getTime() + index * step * 1000),
  }));
}

function Visualizer({data}: Props) {
  return (
    <div className="visualizer">
      <h1>
        Прогноз тривалості повітряної тривоги
        <br />
        <span className="visualizer_subcaption">Львівська область</span>
      </h1>
      {data.density.length > 1 ? (
        <>
          <div className="visualizer_segmentContainer">
            <div className="visualizer_segment">
              <h2>Густина ймовірності</h2>
              <div className="visualizer_graph">
                <Graph
                  data={generateDataPoints(data.density, data.time, data.step)}
                  height={GRAPH_HEIGHT}
                  color={DENSITY_COLOR}
                  showValues={false}
                />
              </div>
            </div>
          </div>
          <div className="visualizer_segmentContainer">
            <div className="visualizer_segment">
              <h2>Розподіл імовірностей</h2>
              <div className="visualizer_graph">
                <Graph
                  data={generateDataPoints(computeProbabilities(data.density, data.step), data.time, data.step)}
                  height={GRAPH_HEIGHT}
                  color={PROBABILITY_COLOR}
                  showValues={true}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <h2 className="visualizer_noData">На жаль, ми не можемо надати прогноз для поточної тривоги.</h2>
      )}
    </div>
  );
}

export default Visualizer;
