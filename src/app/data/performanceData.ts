export const HERO_STRATEGY_NAME = "Managed stock portfolio vs Index";

export const HERO_CAGR_3Y = 34.88;
export const HERO_INCEPTION_RETURN = 325.63;

export const heroPerformanceSeries = [
  { label: "1M", return: 7.61 },
  { label: "3M", return: 14.46 },
  { label: "6M", return: 13.58 },
  { label: "1Y", return: 18.56 },
  { label: "3Y", return: 145.39 },
  { label: "SI", return: 325.63 },
] as const;

export const heroIndexSeries = [
  { label: "1M", return: -0.12 },
  { label: "3M", return: -2.2 },
  { label: "6M", return: -5.33 },
  { label: "1Y", return: -0.64 },
  { label: "3Y", return: 43.7 },
  { label: "SI", return: 99.53 },
] as const;
