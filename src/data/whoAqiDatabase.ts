/**
 * World Health Organization (WHO) Ambient Air Quality Database & 2021 Global Air Quality Guidelines
 * Source: https://www.who.int/data/gho/data/themes/air-pollution/who-air-quality-database
 */

export interface WhoAirQualityGuideline {
  pollutant: string;
  averagingTime: 'Annual' | '24-hour' | '8-hour' | '1-hour';
  aqg2021Level: number; // µg/m³
  interimTarget1: number;
  interimTarget2: number;
  interimTarget3: number;
  interimTarget4?: number;
  healthEffectNote: string;
}

export const WHO_2021_AIR_QUALITY_GUIDELINES: WhoAirQualityGuideline[] = [
  {
    pollutant: 'PM2.5 (Fine Particulate Matter)',
    averagingTime: 'Annual',
    aqg2021Level: 5,
    interimTarget1: 35,
    interimTarget2: 25,
    interimTarget3: 15,
    interimTarget4: 10,
    healthEffectNote: 'Associated with premature mortality from ischemic heart disease, stroke, COPD, lung cancer, and acute lower respiratory infections.'
  },
  {
    pollutant: 'PM2.5 (Fine Particulate Matter)',
    averagingTime: '24-hour',
    aqg2021Level: 15,
    interimTarget1: 75,
    interimTarget2: 50,
    interimTarget3: 37.5,
    interimTarget4: 25,
    healthEffectNote: 'Short-term spike threshold (99th percentile, 3-4 exceedance days/year).'
  },
  {
    pollutant: 'PM10 (Coarse Particulate Matter)',
    averagingTime: 'Annual',
    aqg2021Level: 15,
    interimTarget1: 70,
    interimTarget2: 50,
    interimTarget3: 30,
    interimTarget4: 20,
    healthEffectNote: 'Inhalable thoracic particulate deposition leading to aggravated asthma and airway inflammation.'
  },
  {
    pollutant: 'PM10 (Coarse Particulate Matter)',
    averagingTime: '24-hour',
    aqg2021Level: 45,
    interimTarget1: 150,
    interimTarget2: 100,
    interimTarget3: 75,
    interimTarget4: 50,
    healthEffectNote: 'Short-term inhalation exposure limit.'
  },
  {
    pollutant: 'NO2 (Nitrogen Dioxide)',
    averagingTime: 'Annual',
    aqg2021Level: 10,
    interimTarget1: 40,
    interimTarget2: 30,
    interimTarget3: 20,
    healthEffectNote: 'Combustion tracer triggering pediatric asthma incidence and systemic inflammatory cascades.'
  },
  {
    pollutant: 'O3 (Ozone - Peak Season)',
    averagingTime: '8-hour',
    aqg2021Level: 60,
    interimTarget1: 100,
    interimTarget2: 70,
    healthEffectNote: 'Potent photochemical oxidant inducing severe alveolar cellular damage and pulmonary edema.'
  },
  {
    pollutant: 'SO2 (Sulfur Dioxide)',
    averagingTime: '24-hour',
    aqg2021Level: 40,
    interimTarget1: 125,
    interimTarget2: 50,
    healthEffectNote: 'Bronchoconstriction and acute airway resistance in asthmatic subjects.'
  },
  {
    pollutant: 'CO (Carbon Monoxide)',
    averagingTime: '24-hour',
    aqg2021Level: 4, // mg/m³
    interimTarget1: 7,
    interimTarget2: 7,
    healthEffectNote: 'Carboxyhemoglobin formation reducing oxygen delivery to cerebral and myocardial vascular beds.'
  }
];

export interface WhoGlobalCityRecord {
  country: string;
  city: string;
  whoRegion: 'SEARO' | 'WPRO' | 'EUR' | 'AMR' | 'AFR' | 'EMR';
  annualAvgPm25: number;
  annualAvgPm10: number;
  annualAvgNo2: number;
  whoExceedanceFactorPm25: number; // Multiple of 5 µg/m³
  populationMillions: number;
  measurementYear: number;
}

export const WHO_GLOBAL_CITIES_DATABASE: WhoGlobalCityRecord[] = [
  { country: 'India', city: 'Delhi', whoRegion: 'SEARO', annualAvgPm25: 98.6, annualAvgPm10: 214.2, annualAvgNo2: 44.1, whoExceedanceFactorPm25: 19.7, populationMillions: 32.9, measurementYear: 2025 },
  { country: 'India', city: 'Mumbai', whoRegion: 'SEARO', annualAvgPm25: 46.2, annualAvgPm10: 98.4, annualAvgNo2: 38.2, whoExceedanceFactorPm25: 9.2, populationMillions: 21.3, measurementYear: 2025 },
  { country: 'India', city: 'Bengaluru', whoRegion: 'SEARO', annualAvgPm25: 28.4, annualAvgPm10: 64.1, annualAvgNo2: 24.8, whoExceedanceFactorPm25: 5.7, populationMillions: 13.6, measurementYear: 2025 },
  { country: 'China', city: 'Beijing', whoRegion: 'WPRO', annualAvgPm25: 32.1, annualAvgPm10: 58.6, annualAvgNo2: 26.4, whoExceedanceFactorPm25: 6.4, populationMillions: 21.8, measurementYear: 2025 },
  { country: 'Japan', city: 'Tokyo', whoRegion: 'WPRO', annualAvgPm25: 9.4, annualAvgPm10: 18.2, annualAvgNo2: 16.5, whoExceedanceFactorPm25: 1.9, populationMillions: 37.4, measurementYear: 2025 },
  { country: 'United Kingdom', city: 'London', whoRegion: 'EUR', annualAvgPm25: 8.8, annualAvgPm10: 14.6, annualAvgNo2: 18.9, whoExceedanceFactorPm25: 1.8, populationMillions: 9.6, measurementYear: 2025 },
  { country: 'France', city: 'Paris', whoRegion: 'EUR', annualAvgPm25: 9.2, annualAvgPm10: 15.1, annualAvgNo2: 19.4, whoExceedanceFactorPm25: 1.8, populationMillions: 2.1, measurementYear: 2025 },
  { country: 'United States', city: 'New York', whoRegion: 'AMR', annualAvgPm25: 7.9, annualAvgPm10: 13.8, annualAvgNo2: 17.2, whoExceedanceFactorPm25: 1.6, populationMillions: 8.8, measurementYear: 2025 },
  { country: 'United States', city: 'Los Angeles', whoRegion: 'AMR', annualAvgPm25: 11.8, annualAvgPm10: 24.2, annualAvgNo2: 22.0, whoExceedanceFactorPm25: 2.4, populationMillions: 3.9, measurementYear: 2025 },
  { country: 'Egypt', city: 'Cairo', whoRegion: 'EMR', annualAvgPm25: 68.4, annualAvgPm10: 152.0, annualAvgNo2: 36.5, whoExceedanceFactorPm25: 13.7, populationMillions: 22.1, measurementYear: 2025 }
];
