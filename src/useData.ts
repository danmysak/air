import {useEffect, useState} from 'react';
import {Data} from './data';

export function useData(): Data | null {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    (async () => {
      const response = await fetch(process.env.REACT_APP_ENDPOINT_URL!);
      setData(await response.json());
    })();
  }, []);
  return data;
}
