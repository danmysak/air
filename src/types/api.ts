export type ApiPlaces = {
  place_id: number,
  name: string,
}[];

export type ApiAlert = {
  reference_time: string | null;
  pdf: {
    step: number,
    values: number[],
  } | null;
};
