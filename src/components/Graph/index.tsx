import {Chart as ChartJS, registerables, ScriptableLineSegmentContext} from 'chart.js';
import {getRelativePosition} from 'chart.js/helpers';
import {MouseEvent, useRef, useState} from 'react';
import {Chart} from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import annotationPlugin from 'chartjs-plugin-annotation';
import './styles.css';

const LABEL_PERIOD_MINUTES = 5;

const FILL_TRANSPARENCY = '22';
const DELIMITER_COLOR = '#888888';
const PAST_COLOR = '#888888';
const PROMINENT_COLOR = '#888888';
const PROMINENT_DASH = [5, 3];
const PROMINENT_LABEL_BACKGROUND = '#888888DD';
const ANIMATION_DURATION = 400;

export type DataPoint = {
  value: number,
  time: Date,
};

export type Data = DataPoint[];

type Props = {
  data: Data;
  delimiter: Date | null,
  height: number;
  color: string;
  xLabel: string,
  prominentValue?: {
    extractor: (time: Date) => number,
    totalExtractor: (time: Date) => number,
    defaultTime: Date,
  },
};

ChartJS.register(...registerables);
ChartJS.register(annotationPlugin);

function formatTime(time: Date): string {
  return [
    time.getHours().toString(),
    time.getMinutes().toString().padStart(2, '0'),
  ].join(':');
}

function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

function Graph({data, delimiter, height, color, xLabel, prominentValue}: Props) {
  const showValues = !!prominentValue;
  const getBaseColor = (ctx: ScriptableLineSegmentContext) => delimiter === null || new Date(
    (data[ctx.p0DataIndex].time.getTime() + data[ctx.p1DataIndex].time.getTime()) / 2
  ) >= delimiter ? color: PAST_COLOR;
  const [preProminentTime, setPreProminentTime] = useState<Date | null>(null);
  const prominentTime = preProminentTime ?? prominentValue?.defaultTime ?? null;
  const chartRef = useRef<any>(null);
  const getRelevantTime = (event: MouseEvent): Date | null => {
    if (!prominentValue) {
      return null;
    }
    const chart = chartRef.current!;
    const canvasPosition = getRelativePosition(event.nativeEvent, chart);
    const time = new Date(chart.scales.x.getValueForPixel(canvasPosition.x));
    return data.length > 0 && time >= data[0].time && time <= data[data.length - 1].time ? time : null;
  };
  return (
    <Chart
      ref={chartRef}
      type="line"
      height={height}
      data={{
        labels: data.map((item) => item.time),
        datasets: [{
          cubicInterpolationMode: 'monotone', // to avoid ridges with small screen sizes
          data: data.map((item) => item.value),
          fill: true,
          segment: {
            borderColor: (ctx) => getBaseColor(ctx),
            backgroundColor: (ctx) => getBaseColor(ctx) + FILL_TRANSPARENCY,
          },
        }],
      }}
      onClick={(event) => {
        const time = getRelevantTime(event);
        if (time !== null) {
          setPreProminentTime(time);
        }
      }}
      onMouseMove={(event) => {
        chartRef.current.canvas.style.cursor = getRelevantTime(event) === null ? 'default' : 'pointer';
      }}
      options={{
        maintainAspectRatio: false,
        events: [], // disabling hover
        clip: false,
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          x: {
            type: 'timeseries',
            title: {
              display: true,
              text: xLabel,
              font: {
                style: 'italic',
              },
            },
            ticks: {
              callback: (value) => {
                const date = new Date(value);
                return date.getMinutes() % LABEL_PERIOD_MINUTES === 0 && date.getSeconds() === 0
                  ? formatTime(date)
                  : null;
              },
            },
          },
          y: {
            grid: {
              display: showValues,
            },
            ticks: {
              display: showValues,
            },
          },
        },
        animation: {
          duration: ANIMATION_DURATION,
        },
        plugins: {
          annotation: {
            annotations: [
              ...(delimiter !== null ? [{
                type: 'line' as const,
                borderColor: DELIMITER_COLOR,
                xMin: delimiter.getTime(),
                xMax: delimiter.getTime(),
              }] : []),
              ...(prominentValue ? [{
                type: 'line' as const,
                borderColor: PROMINENT_COLOR,
                borderDash: PROMINENT_DASH,
                xMin: prominentTime!.getTime(),
                xMax: prominentTime!.getTime(),
                label: {
                  display: true,
                  content: [formatTime(prominentTime!), formatProbability(prominentValue.extractor(prominentTime!))],
                  backgroundColor: PROMINENT_LABEL_BACKGROUND,
                  position: prominentValue.totalExtractor(prominentTime!) > 0.5 ? 'start' as const : 'end' as const,
                },
              }] : [])],
          },
          legend: {
            display: false,
          },
          tooltip: {
            enabled: false,
          },
        },
      }}
    />
  );
}

export default Graph;
