export type Place = {
  id: number,
  name: string,
};

export type Density = {
  step: number,
  values: number[],
};

export type Data = {
  start: Date | null, // null if there is no alert
  current: Date,
  density: Density | null, // null if there is no data for the region
};
