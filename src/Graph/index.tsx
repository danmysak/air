import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2'
import 'chartjs-adapter-moment';
import './styles.css';

const FILL_TRANSPARENCY = '22';

export type DataPoint = {
  value: number,
  time: Date,
};

export type Data = DataPoint[];

type Props = {
  data: Data;
  height: number;
  color: string;
  showValues: boolean;
};

ChartJS.register(...registerables);

function Graph({data, height, color, showValues}: Props) {
  return (
    <Line
      height={height}
      data={{
        labels: data.map((item) => item.time),
        datasets: [{
          cubicInterpolationMode: 'monotone', // to avoid ridges with small screen sizes
          data: data.map((item) => item.value),
          borderColor: color,
          backgroundColor: color + FILL_TRANSPARENCY,
          fill: true,
        }],
      }}
      options={{
        maintainAspectRatio: false,
        clip: false,
        interaction: {
          intersect: false,
          mode: 'index',
        },
        events: showValues ? undefined : [], // disabling hover
        elements: {
          point: {
            radius: 0,
          },
        },
        scales: {
          x: {
            type: 'time',
            time: {
              tooltipFormat: 'H:mm:ss',
            },
            ticks: {
              callback: (value) => {
                const date = new Date(value);
                if (date.getMinutes() % 5 === 0 && date.getSeconds() === 0) {
                  return [
                    date.getHours().toString(),
                    date.getMinutes().toString().padStart(2, '0'),
                  ].join(':');
                } else {
                  return null;
                }
              },
            },
          },
          y: {
            ticks: {
              display: showValues,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: showValues,
          },
        },
      }}
    />
  );
}

export default Graph;
