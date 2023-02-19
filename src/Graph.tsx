import * as d3 from 'd3';

import {useCallback, useMemo} from 'react';

const ANCHOR_WIDTH = 100;

export type DataPoint = [number, number];

export type Data = DataPoint[];

type Props = {
  data: Data;
  height: number;
  fill: string;
};

function Graph({data, height, fill}: Props) {
  const getMax = useCallback((data: Data, index: number) => Math.max(...data.map((d) => d[index])), []);

  const getScale = useCallback((data: Data, index: number) => {
    const max = getMax(data, index);
    return d3
      .scaleLinear()
      .domain([0, max])
      .range([[0, height][index], [ANCHOR_WIDTH, 0][index]]);
  }, [getMax, height]);

  const xScale = useMemo(() => getScale(data, 0), [getScale, data]);
  const yScale = useMemo(() => getScale(data, 1), [getScale, data]);

  const path = useMemo(() => {
    const lineGenerator = d3
      .line()
      .x(([x, _]) => xScale(x))
      .y(([_, y]) => yScale(y))
      .curve(d3.curveLinear);
    return lineGenerator([[0, 0], ...data, [getMax(data, 0), 0]]);
  }, [data, xScale, yScale, getMax]);

  return (
    <svg
      width="100%"
      height={height}
      viewBox={`0 0 ${ANCHOR_WIDTH} ${height}`}
      preserveAspectRatio="none"
    >
      <path
        d={path!}
        fill={fill}
      />
    </svg>
  );
}

export default Graph;
