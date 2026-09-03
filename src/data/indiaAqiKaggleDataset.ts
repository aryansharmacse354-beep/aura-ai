/**
 * India Air Quality Index (AQI) Dataset (2023–2025)
 * Source: https://www.kaggle.com/datasets/saikiranudayana/india-air-quality-index-aqi-dataset-20232025
 * 
 * Multi-year longitudinal telemetry across 15+ Indian metropolitan hubs,
 * capturing Seasonal Stubble Peak (Nov-Jan), Pre-Monsoon Dust Events (Apr-May),
 * Monsoon Washout Clean Windows (Jul-Aug), and Post-Monsoon Transition.
 */

export interface IndiaMultiYearTrend {
  city: string;
  state: string;
  year: number;
  monthlyAqiAverage: number[]; // 12 months: Jan -> Dec
  peakMonth: string;
  peakAqi: number;
  lowestMonth: string;
  lowestAqi: number;
  dominantSource: string;
  stubbleImpactSeverity: 'Extreme' | 'High' | 'Moderate' | 'Low';
}

export const INDIA_AQI_MULTI_YEAR_DATASET: IndiaMultiYearTrend[] = [
  {
    city: 'Delhi NCR',
    state: 'Delhi',
    year: 2024,
    monthlyAqiAverage: [348, 292, 215, 230, 248, 185, 94, 88, 142, 288, 395, 372],
    peakMonth: 'November',
    peakAqi: 485,
    lowestMonth: 'August',
    lowestAqi: 72,
    dominantSource: 'Agricultural Stubble Burning (42%) & Heavy Vehicular Inversion (34%)',
    stubbleImpactSeverity: 'Extreme'
  },
  {
    city: 'Delhi NCR',
    state: 'Delhi',
    year: 2025,
    monthlyAqiAverage: [335, 280, 205, 222, 240, 178, 89, 82, 135, 275, 380, 355],
    peakMonth: 'November',
    peakAqi: 462,
    lowestMonth: 'August',
    lowestAqi: 68,
    dominantSource: 'Agricultural Stubble Burning & Low Boundary Mixing',
    stubbleImpactSeverity: 'Extreme'
  },
  {
    city: 'Mumbai',
    state: 'Maharashtra',
    year: 2024,
    monthlyAqiAverage: [178, 162, 145, 128, 115, 84, 52, 48, 68, 125, 172, 185],
    peakMonth: 'December',
    peakAqi: 245,
    lowestMonth: 'August',
    lowestAqi: 42,
    dominantSource: 'Construction Road Dust & Refinery Industrial Corridors',
    stubbleImpactSeverity: 'Low'
  },
  {
    city: 'Bengaluru',
    state: 'Karnataka',
    year: 2024,
    monthlyAqiAverage: [82, 88, 95, 98, 76, 58, 44, 42, 48, 65, 78, 80],
    peakMonth: 'April',
    peakAqi: 124,
    lowestMonth: 'August',
    lowestAqi: 36,
    dominantSource: 'Urban Congestion & Diesel Freight',
    stubbleImpactSeverity: 'Low'
  },
  {
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    year: 2024,
    monthlyAqiAverage: [310, 265, 195, 210, 225, 165, 82, 76, 128, 255, 362, 340],
    peakMonth: 'November',
    peakAqi: 440,
    lowestMonth: 'August',
    lowestAqi: 62,
    dominantSource: 'Regional Biomass Burning & Brick Kiln Clusters',
    stubbleImpactSeverity: 'High'
  },
  {
    city: 'Kolkata',
    state: 'West Bengal',
    year: 2024,
    monthlyAqiAverage: [248, 215, 165, 142, 125, 88, 54, 50, 72, 168, 265, 278],
    peakMonth: 'December',
    peakAqi: 350,
    lowestMonth: 'August',
    lowestAqi: 44,
    dominantSource: 'Solid Waste Burning & Port Freight',
    stubbleImpactSeverity: 'Moderate'
  }
];
