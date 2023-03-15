import assert from 'assert';
import {Loader, Menu, Message, SemanticCOLORS} from 'semantic-ui-react';
import {ReactNode, useState} from 'react';
import {Place} from '../../types/data';
import {formatTime} from '../../helpers/formatters';
import {computeProbabilities, computeProbabilityAt, findProbabilityPosition} from '../../helpers/math';
import {LoadingState} from '../../hooks/useApi';
import {useData} from '../../hooks/useData';
import Error from '../Error';
import Graph, {Data as GraphData} from '../Graph';
import './styles.css';

type Props = {
  place: Place,
  minDelay?: number,
};

const GRAPH_HEIGHT = 320;
const DEFAULT_VALUE_PROBABILITY = 0.5;

const DENSITY = {
  title: 'Густина ймовірності',
  color: '#1C82AD',
  semanticColor: 'blue' as SemanticCOLORS,
};
const MODES = [DENSITY];

function Visualizer({place, minDelay}: Props) {
  const [alertRequestId, setAlertRequestId] = useState(0);
  const alert = useData(place.id, alertRequestId, minDelay ?? 0);
  const [mode, setMode] = useState(0);

  type Content = {
    mainContent: ReactNode,
    graphAvailable: boolean,
    infoBox: ReactNode,
  };
  const getContent = (): Content => {
    if (alert.loadingState === LoadingState.Loading) {
      return {
        mainContent: <Loader active={true}/>,
        graphAvailable: false,
        infoBox: null,
      };
    } else if (alert.loadingState === LoadingState.Error) {
      return {
        mainContent: <Error message="Втрачено зв’язок із сервером." onRetry={() => setAlertRequestId((id) => id + 1)}/>,
        graphAvailable: false,
        infoBox: null,
      };
    } else {
      assert(alert.loadingState === LoadingState.Ok);
      const infoBox = (
        <div className="visualizer_infoBox">
          <Message negative={!alert.data.success}>
            дані: <strong>{formatTime(alert.data.dates.client)}</strong>
          </Message>
        </div>
      );

      if (alert.data.data.density === null) {
        return {
          mainContent: <Error message="На жаль, ми не маємо надійної статистики тривог для даного регіону."/>,
          graphAvailable: false,
          infoBox,
        };
      }

      const density = alert.data.data.density;
      const start = alert.data.data.start ?? new Date(2000, 0, 1, 0, 0, 0, 0);
      const delimiter = alert.data.data.start ? alert.data.data.current : null;

      const stepMilliseconds = density.step * 1000;
      const getTimeAtPosition = (position: number) => new Date(start.getTime() + position * stepMilliseconds);
      const getPositionOfTime = (time: Date) => (time.getTime() - start.getTime()) / stepMilliseconds;

      if (delimiter !== null && delimiter >= getTimeAtPosition(density.values.length - 1)) {
        return {
          mainContent: <Error message="Тривога у регіоні триває значно довше, ніж зазвичай."/>,
          graphAvailable: false,
          infoBox,
        };
      }

      const xLabel = alert.data.data.start ? 'Час закінчення тривоги' : 'Тривалість тривоги';

      const constructGraphData = (values: number[]): GraphData => values.map((value, index) => ({
        value,
        time: getTimeAtPosition(index),
      }));

      const probabilities = computeProbabilities(density.values, density.step);
      const delimiterPosition = delimiter !== null ? getPositionOfTime(delimiter) : 0;
      return {
        mainContent: <Graph
            data={constructGraphData(density.values)}
            delimiter={delimiter}
            height={GRAPH_HEIGHT}
            color={DENSITY.color}
            xLabel={xLabel}
            prominentValue={{
              extractor: (time) => computeProbabilityAt(probabilities, getPositionOfTime(time), delimiterPosition),
              defaultTime: getTimeAtPosition(findProbabilityPosition(
                probabilities,
                DEFAULT_VALUE_PROBABILITY,
                delimiterPosition,
              )),
            }}
            showValues={false}
          />,
        graphAvailable: true,
        infoBox,
      };
    }
  };

  const content = getContent();
  return (
    <div className="visualizer">
      <div className="visualizer_menuContainer">
        <Menu secondary>
          {MODES.map(({title, semanticColor}, index) => (
            <Menu.Item
              key={index}
              disabled={!content.graphAvailable}
              color={content.graphAvailable ? semanticColor : undefined}
              active={mode === index}
              onClick={() => setMode(index)}
            >{title}</Menu.Item>
          ))}
        </Menu>
      </div>
      <div className="visualizer_graphContainer" style={{height: GRAPH_HEIGHT + 'px'}}>
        {content.mainContent}
        {content.infoBox}
      </div>
    </div>
  );
}

export default Visualizer;
