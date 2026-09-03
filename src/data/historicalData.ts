// Comprehensive Multi-Scale Historical Air Quality Datasets

export interface HistoricalHourlyPoint {
  timestamp: string; // ISO or date string
  formattedTime: string; // e.g. "Mon 08:00"
  aqi: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  so2: number;
  co: number;
  tempC: number;
  humidity: number;
  windSpeedKmh: number;
  blhMeters: number; // Boundary layer height in meters
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
}

export interface HistoricalDailyPoint {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Aug 01"
  avgAQI: number;
  minAQI: number;
  maxAQI: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  dominantPollutant: string;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  whoExceeded: boolean;
}

export interface SeasonalMonthlyPoint {
  month: string;
  monthName: string;
  avgAQI: number;
  pm25: number;
  pm10: number;
  no2: number;
  rainfallMm: number;
  avgTempC: number;
  avgBlhMeters: number;
  keyPhenomenon: string;
  hazardDays: number;
}

export interface MultiYearPoint {
  year: number;
  annualMeanAQI: number;
  annualMeanPM25: number;
  annualMeanPM10: number;
  daysExceedingStandard: number;
  cleanAirPolicyMilestone: string;
  severeEpisodeCount: number;
}

export interface DiurnalHourlyProfile {
  hour: number;
  hourLabel: string;
  winterAQI: number;
  summerAQI: number;
  monsoonAQI: number;
  trafficIntensityPct: number;
  blhHeightM: number;
}

export interface HistoricalEpisode {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  peakAQI: number;
  dominantPollutant: string;
  durationDays: number;
  meteorologicalDriver: string;
  healthAdvisoryStatus: string;
  description: string;
  mitigationEnacted: string;
}

// Generate realistic 7-Day Hourly Historical Points (168 points)
export const generate7DayHourlyData = (baseAqi: number = 280): HistoricalHourlyPoint[] => {
  const points: HistoricalHourlyPoint[] = [];
  const now = new Date();

  for (let i = 168; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 3600 * 1000);
    const hour = d.getHours();
    const dayOfWeek = d.toLocaleDateString('en-US', { weekday: 'short' });

    // Diurnal variation: high at night (inversion) & rush hours, low in afternoon (high BLH)
    const diurnalFactor = 
      hour >= 6 && hour <= 9 ? 1.25 : // Morning traffic
      hour >= 13 && hour <= 16 ? 0.72 : // Afternoon solar boundary mixing
      hour >= 20 && hour <= 23 ? 1.35 : // Evening rush + inversion descent
      hour >= 0 && hour <= 5 ? 1.15 : 0.95; // Night stagnation

    // Random day-to-day weather variation
    const dayNoise = Math.sin((i / 24) * Math.PI) * 20;
    const randomJitter = (Math.sin(i * 1.7) * 12) + ((i % 5) * 3);

    const calculatedAQI = Math.max(30, Math.round(baseAqi * diurnalFactor + dayNoise + randomJitter));
    const pm25 = Math.round(calculatedAQI * 0.65 * 10) / 10;
    const pm10 = Math.round(pm25 * 1.55 * 10) / 10;
    const no2 = Math.round((35 + (hour >= 7 && hour <= 20 ? 45 : 15) + Math.sin(i) * 8) * 10) / 10;
    const o3 = Math.round((20 + (hour >= 12 && hour <= 17 ? 55 : 10) + Math.cos(i) * 6) * 10) / 10;
    const so2 = Math.round((18 + Math.sin(i * 0.8) * 7) * 10) / 10;
    const co = Math.round((1.2 + (calculatedAQI / 200) * 1.5) * 10) / 10;

    const tempC = Math.round((26 + Math.sin((hour - 8) / 24 * 2 * Math.PI) * 7) * 10) / 10;
    const humidity = Math.round((65 - Math.sin((hour - 8) / 24 * 2 * Math.PI) * 25));
    const windSpeedKmh = Math.round((8 + Math.cos((hour - 14) / 24 * 2 * Math.PI) * 6 + (i % 3)));
    const blhMeters = Math.round(350 + Math.max(0, Math.sin((hour - 6) / 18 * Math.PI)) * 1400);

    let category: HistoricalHourlyPoint['category'] = 'Moderate';
    if (calculatedAQI <= 50) category = 'Good';
    else if (calculatedAQI <= 100) category = 'Moderate';
    else if (calculatedAQI <= 150) category = 'Unhealthy for Sensitive Groups';
    else if (calculatedAQI <= 200) category = 'Unhealthy';
    else if (calculatedAQI <= 300) category = 'Very Unhealthy';
    else category = 'Hazardous';

    points.push({
      timestamp: d.toISOString(),
      formattedTime: `${dayOfWeek} ${hour.toString().padStart(2, '0')}:00`,
      aqi: calculatedAQI,
      pm25,
      pm10,
      no2,
      o3,
      so2,
      co,
      tempC,
      humidity,
      windSpeedKmh,
      blhMeters,
      category
    });
  }

  return points;
};

// Generate 30-Day Historical Daily Records
export const generate30DayDailyData = (baseAqi: number = 280): HistoricalDailyPoint[] => {
  const points: HistoricalDailyPoint[] = [];
  const now = new Date();

  for (let i = 30; i >= 1; i--) {
    const d = new Date(now.getTime() - i * 86400 * 1000);
    const dayLabel = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const wave = Math.sin((i / 7) * 2 * Math.PI) * 45;
    const randomOffset = ((i * 13) % 31) - 15;

    const avgAQI = Math.max(45, Math.round(baseAqi + wave + randomOffset));
    const minAQI = Math.max(25, Math.round(avgAQI * 0.72));
    const maxAQI = Math.round(avgAQI * 1.38);

    const pm25 = Math.round(avgAQI * 0.64);
    const pm10 = Math.round(pm25 * 1.6);
    const no2 = Math.round(42 + ((i % 6) * 5));
    const o3 = Math.round(38 + Math.cos(i) * 12);

    let category: HistoricalDailyPoint['category'] = 'Moderate';
    if (avgAQI <= 50) category = 'Good';
    else if (avgAQI <= 100) category = 'Moderate';
    else if (avgAQI <= 150) category = 'Unhealthy for Sensitive Groups';
    else if (avgAQI <= 200) category = 'Unhealthy';
    else if (avgAQI <= 300) category = 'Very Unhealthy';
    else category = 'Hazardous';

    points.push({
      date: d.toISOString().split('T')[0],
      dayLabel,
      avgAQI,
      minAQI,
      maxAQI,
      pm25,
      pm10,
      no2,
      o3,
      dominantPollutant: 'PM2.5',
      category,
      whoExceeded: pm25 > 15 // WHO 24h limit is 15 µg/m³
    });
  }

  return points;
};

// 12-Month Seasonal Profile Data (Delhi Basin & Urban Sub-continent archetype)
export const SEASONAL_12MONTH_DELHI: SeasonalMonthlyPoint[] = [
  { month: 'Jan', monthName: 'January', avgAQI: 345, pm25: 235, pm10: 360, no2: 82, rainfallMm: 14, avgTempC: 14, avgBlhMeters: 410, keyPhenomenon: 'Severe Ground Inversion & Radiation Fog', hazardDays: 24 },
  { month: 'Feb', monthName: 'February', avgAQI: 260, pm25: 165, pm10: 275, no2: 68, rainfallMm: 18, avgTempC: 18, avgBlhMeters: 620, keyPhenomenon: 'Gradual Thermal Boundary Expansion', hazardDays: 16 },
  { month: 'Mar', monthName: 'March', avgAQI: 195, pm25: 110, pm10: 220, no2: 54, rainfallMm: 12, avgTempC: 24, avgBlhMeters: 980, keyPhenomenon: 'Spring Transition & Moderate Ventilation', hazardDays: 9 },
  { month: 'Apr', monthName: 'April', avgAQI: 215, pm25: 98, pm10: 290, no2: 48, rainfallMm: 8, avgTempC: 32, avgBlhMeters: 1450, keyPhenomenon: 'Thar Desert Dust Influx & Coarse PM10 Surge', hazardDays: 11 },
  { month: 'May', monthName: 'May', avgAQI: 240, pm25: 105, pm10: 340, no2: 44, rainfallMm: 22, avgTempC: 38, avgBlhMeters: 1850, keyPhenomenon: 'Intense Pre-Monsoon Dust Storms & High Ozone', hazardDays: 14 },
  { month: 'Jun', monthName: 'June', avgAQI: 180, pm25: 82, pm10: 245, no2: 38, rainfallMm: 65, avgTempC: 36, avgBlhMeters: 1600, keyPhenomenon: 'Pre-Monsoon Convective Showers', hazardDays: 6 },
  { month: 'Jul', monthName: 'July', avgAQI: 92, pm25: 42, pm10: 110, no2: 28, rainfallMm: 210, avgTempC: 31, avgBlhMeters: 1350, keyPhenomenon: 'Southwest Monsoon Wet Deposition (Cleanest Phase)', hazardDays: 1 },
  { month: 'Aug', monthName: 'August', avgAQI: 78, pm25: 35, pm10: 92, no2: 25, rainfallMm: 245, avgTempC: 30, avgBlhMeters: 1280, keyPhenomenon: 'Peak Monsoon Scavenging & Blue Skies', hazardDays: 0 },
  { month: 'Sep', monthName: 'September', avgAQI: 112, pm25: 56, pm10: 135, no2: 36, rainfallMm: 115, avgTempC: 29, avgBlhMeters: 1100, keyPhenomenon: 'Monsoon Retreat & Wind Deceleration', hazardDays: 2 },
  { month: 'Oct', monthName: 'October', avgAQI: 275, pm25: 180, pm10: 310, no2: 65, rainfallMm: 8, avgTempC: 26, avgBlhMeters: 750, keyPhenomenon: 'Northwest Crop Stubble Burning & Low Wind Stagnation', hazardDays: 18 },
  { month: 'Nov', monthName: 'November', avgAQI: 395, pm25: 285, pm10: 440, no2: 95, rainfallMm: 4, avgTempC: 20, avgBlhMeters: 450, keyPhenomenon: 'Peak Agricultural Biomass Smoke & Winter Inversion Trap', hazardDays: 27 },
  { month: 'Dec', monthName: 'December', avgAQI: 360, pm25: 250, pm10: 390, no2: 88, rainfallMm: 6, avgTempC: 15, avgBlhMeters: 380, keyPhenomenon: 'Dense Smog Blends, Calms & Night Cold Air Pools', hazardDays: 25 }
];

// 5-Year Multi-Year Comparison (2022 to 2026)
export const MULTI_YEAR_DELHI: MultiYearPoint[] = [
  { year: 2022, annualMeanAQI: 235, annualMeanPM25: 118, annualMeanPM10: 228, daysExceedingStandard: 245, cleanAirPolicyMilestone: 'GRAP Emergency Alert System Mandated', severeEpisodeCount: 14 },
  { year: 2023, annualMeanAQI: 218, annualMeanPM25: 106, annualMeanPM10: 212, daysExceedingStandard: 228, cleanAirPolicyMilestone: 'Heavy Diesel Freight Entry Curfew Enacted', severeEpisodeCount: 11 },
  { year: 2024, annualMeanAQI: 204, annualMeanPM25: 98, annualMeanPM10: 198, daysExceedingStandard: 210, cleanAirPolicyMilestone: 'Bio-Decomposer Subsidy & 1000 EV Buses Deployed', severeEpisodeCount: 9 },
  { year: 2025, annualMeanAQI: 188, annualMeanPM25: 89, annualMeanPM10: 182, daysExceedingStandard: 192, cleanAirPolicyMilestone: 'AuraPredict AI Predictive Micro-Zoning Rollout', severeEpisodeCount: 6 },
  { year: 2026, annualMeanAQI: 172, annualMeanPM25: 79, annualMeanPM10: 168, daysExceedingStandard: 174, cleanAirPolicyMilestone: 'Autonomous Smart Mist Cannons & LEZ Grid', severeEpisodeCount: 4 }
];

// Diurnal 24-Hour Profile by Season
export const DIURNAL_24H_DATA: DiurnalHourlyProfile[] = [
  { hour: 0, hourLabel: '00:00', winterAQI: 340, summerAQI: 160, monsoonAQI: 72, trafficIntensityPct: 20, blhHeightM: 320 },
  { hour: 1, hourLabel: '01:00', winterAQI: 350, summerAQI: 155, monsoonAQI: 68, trafficIntensityPct: 15, blhHeightM: 300 },
  { hour: 2, hourLabel: '02:00', winterAQI: 358, summerAQI: 150, monsoonAQI: 65, trafficIntensityPct: 12, blhHeightM: 280 },
  { hour: 3, hourLabel: '03:00', winterAQI: 365, summerAQI: 148, monsoonAQI: 62, trafficIntensityPct: 10, blhHeightM: 270 },
  { hour: 4, hourLabel: '04:00', winterAQI: 372, summerAQI: 152, monsoonAQI: 64, trafficIntensityPct: 15, blhHeightM: 290 },
  { hour: 5, hourLabel: '05:00', winterAQI: 380, summerAQI: 168, monsoonAQI: 68, trafficIntensityPct: 35, blhHeightM: 340 },
  { hour: 6, hourLabel: '06:00', winterAQI: 395, summerAQI: 185, monsoonAQI: 74, trafficIntensityPct: 60, blhHeightM: 420 },
  { hour: 7, hourLabel: '07:00', winterAQI: 410, summerAQI: 205, monsoonAQI: 82, trafficIntensityPct: 88, blhHeightM: 550 },
  { hour: 8, hourLabel: '08:00', winterAQI: 425, summerAQI: 215, monsoonAQI: 88, trafficIntensityPct: 100, blhHeightM: 700 },
  { hour: 9, hourLabel: '09:00', winterAQI: 390, summerAQI: 200, monsoonAQI: 85, trafficIntensityPct: 95, blhHeightM: 920 },
  { hour: 10, hourLabel: '10:00', winterAQI: 340, summerAQI: 180, monsoonAQI: 80, trafficIntensityPct: 80, blhHeightM: 1180 },
  { hour: 11, hourLabel: '11:00', winterAQI: 295, summerAQI: 165, monsoonAQI: 75, trafficIntensityPct: 70, blhHeightM: 1420 },
  { hour: 12, hourLabel: '12:00', winterAQI: 260, summerAQI: 150, monsoonAQI: 70, trafficIntensityPct: 65, blhHeightM: 1650 },
  { hour: 13, hourLabel: '13:00', winterAQI: 235, summerAQI: 140, monsoonAQI: 66, trafficIntensityPct: 60, blhHeightM: 1800 },
  { hour: 14, hourLabel: '14:00', winterAQI: 220, summerAQI: 135, monsoonAQI: 62, trafficIntensityPct: 62, blhHeightM: 1850 },
  { hour: 15, hourLabel: '15:00', winterAQI: 225, summerAQI: 138, monsoonAQI: 64, trafficIntensityPct: 68, blhHeightM: 1780 },
  { hour: 16, hourLabel: '16:00', winterAQI: 245, summerAQI: 145, monsoonAQI: 68, trafficIntensityPct: 75, blhHeightM: 1600 },
  { hour: 17, hourLabel: '17:00', winterAQI: 275, summerAQI: 160, monsoonAQI: 75, trafficIntensityPct: 88, blhHeightM: 1300 },
  { hour: 18, hourLabel: '18:00', winterAQI: 320, summerAQI: 180, monsoonAQI: 84, trafficIntensityPct: 98, blhHeightM: 950 },
  { hour: 19, hourLabel: '19:00', winterAQI: 365, summerAQI: 195, monsoonAQI: 89, trafficIntensityPct: 96, blhHeightM: 700 },
  { hour: 20, hourLabel: '20:00', winterAQI: 390, summerAQI: 190, monsoonAQI: 86, trafficIntensityPct: 85, blhHeightM: 520 },
  { hour: 21, hourLabel: '21:00', winterAQI: 380, summerAQI: 182, monsoonAQI: 82, trafficIntensityPct: 70, blhHeightM: 420 },
  { hour: 22, hourLabel: '22:00', winterAQI: 365, summerAQI: 175, monsoonAQI: 78, trafficIntensityPct: 50, blhHeightM: 380 },
  { hour: 23, hourLabel: '23:00', winterAQI: 350, summerAQI: 168, monsoonAQI: 75, trafficIntensityPct: 32, blhHeightM: 340 }
];

// Historical Extreme Episodes Log Catalog
export const HISTORICAL_EXTREME_EPISODES: HistoricalEpisode[] = [
  {
    id: 'ep_nov_2025_stubble',
    title: 'Severe Post-Harvest Agricultural Biomass Smog Surge',
    startDate: '2025-11-04',
    endDate: '2025-11-12',
    peakAQI: 488,
    dominantPollutant: 'PM2.5 (392 µg/m³)',
    durationDays: 8,
    meteorologicalDriver: 'Stagnant northwesterly winds (1.2 m/s) with 280m boundary layer height',
    healthAdvisoryStatus: 'Red Alert — Complete School Closure & Work-from-Home Mandate',
    description: 'A massive transboundary agricultural stubble burning smoke plume converged with a dense nighttime thermal inversion layer over the Indo-Gangetic Plains.',
    mitigationEnacted: 'GRAP Stage IV: Full ban on non-essential diesel trucks and construction activities.'
  },
  {
    id: 'ep_jan_2025_fog',
    title: 'Great Cold Wave Radiation Fog & Industrial Stagnation',
    startDate: '2025-01-14',
    endDate: '2025-01-21',
    peakAQI: 462,
    dominantPollutant: 'PM2.5 & NO2',
    durationDays: 7,
    meteorologicalDriver: 'Near-zero surface winds, 100% relative humidity, dense radiation fog ceiling',
    healthAdvisoryStatus: 'Severe Health Hazard — Vulnerable groups emergency advisories issued',
    description: 'Persistent radiation fog trapped secondary sulfate and nitrate aerosol particles in a 200m ultra-shallow cold pool.',
    mitigationEnacted: 'Anti-smog mist cannon deployment at 42 critical traffic junctions; power plant throttling.'
  },
  {
    id: 'ep_may_2025_dust',
    title: 'Trans-Thar Desert Severe Dust Transport Episode',
    startDate: '2025-05-18',
    endDate: '2025-05-22',
    peakAQI: 390,
    dominantPollutant: 'PM10 (520 µg/m³)',
    durationDays: 4,
    meteorologicalDriver: 'High-speed dry westerly gusts (42 km/h) carrying arid crustal mineral dust',
    healthAdvisoryStatus: 'Eye & Respiratory Irritation Warning',
    description: 'Extensive mineral dust lofting from western desert basins created an opaque brownish atmospheric veil with elevated PM10/PM2.5 ratios.',
    mitigationEnacted: 'Continuous mechanized road sweeping and high-pressure water sprinkling across transit rings.'
  },
  {
    id: 'ep_nov_2024_diwali',
    title: 'Combustion & Inversion Convergence Episode',
    startDate: '2024-11-01',
    endDate: '2024-11-06',
    peakAQI: 475,
    dominantPollutant: 'PM2.5 & SO2',
    durationDays: 5,
    meteorologicalDriver: 'Calm nocturnal winds (<0.5 m/s) with rapid ground radiative cooling',
    healthAdvisoryStatus: 'Emergency Health Directive — N95 mask distribution at metro stations',
    description: 'Pyrotechnic chemical emissions combined with stagnant autumn meteorology causing severe spike in heavy metals, barium, and fine particulates.',
    mitigationEnacted: 'Night water washing of arterial highways; localized odd-even vehicle restrictions.'
  }
];
