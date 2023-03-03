import {useEffect, useState} from 'react';
import {Data} from './data';
import {shiftDensity} from './math';

export function useData(): Data | null {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    (async () => {
      const response = await fetch(process.env.REACT_APP_ENDPOINT_URL!);
      const data = await response.json();
      const current = new Date();
      const ceiled = new Date(current.getTime() + ((data.step - current.getSeconds() % data.step) % data.step) * 1000);
      const currentServerTime = new Date(response.headers.get('date')!);
      const referenceServerTime = new Date(data.reference_time);
      const shift = (
        (currentServerTime.getTime() - referenceServerTime.getTime())
        + (ceiled.getTime() - current.getTime())
      ) / 1000;
      setData({
        time: ceiled,
        density: shiftDensity(data.pdf, data.step, shift),
        step: data.step,
      });
    })();
  }, []);
  return data;
}
