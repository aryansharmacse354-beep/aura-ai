/**
 * Central Pollution Control Board (CPCB) India - National Air Quality Index (NAQI) Dataset
 * Source: https://cpcb.gov.in/National-Air-Quality-Index/ & https://www.aqi.in/
 * 
 * Standards, Sub-Index Equations, Breakpoint Matrices for 8 Criteria Pollutants,
 * and Official Health Advisory Descriptors.
 */

export interface CPCBBreakpoint {
  category: 'Good' | 'Satisfactory' | 'Moderate' | 'Poor' | 'Very Poor' | 'Severe';
  aqiRange: [number, number];
  pm25Range: [number, number]; // µg/m³ (24-hr avg)
  pm10Range: [number, number]; // µg/m³ (24-hr avg)
  no2Range: [number, number];  // µg/m³ (24-hr avg)
  nh3Range: [number, number];  // µg/m³ (24-hr avg)
  so2Range: [number, number];  // µg/m³ (24-hr avg)
  coRange: [number, number];   // mg/m³ (8-hr avg)
  o3Range: [number, number];   // µg/m³ (8-hr avg)
  pbRange: [number, number];   // µg/m³ (24-hr avg)
  colorCode: string;
  healthStatement: string;
}

export const CPCB_NAQI_BREAKPOINTS: CPCBBreakpoint[] = [
  {
    category: 'Good',
    aqiRange: [0, 50],
    pm25Range: [0, 30],
    pm10Range: [0, 50],
    no2Range: [0, 40],
    nh3Range: [0, 200],
    so2Range: [0, 40],
    coRange: [0, 1.0],
    o3Range: [0, 50],
    pbRange: [0, 0.5],
    colorCode: '#10B981', // Emerald Green
    healthStatement: 'Minimal impact. Air quality is considered satisfactory, and air pollution poses little or no risk.'
  },
  {
    category: 'Satisfactory',
    aqiRange: [51, 100],
    pm25Range: [31, 60],
    pm10Range: [51, 100],
    no2Range: [41, 80],
    nh3Range: [201, 400],
    so2Range: [41, 80],
    coRange: [1.1, 2.0],
    o3Range: [51, 100],
    pbRange: [0.6, 1.0],
    colorCode: '#84CC16', // Lime Green
    healthStatement: 'Minor breathing discomfort to sensitive people including asthma patients and elderly.'
  },
  {
    category: 'Moderate',
    aqiRange: [101, 200],
    pm25Range: [61, 90],
    pm10Range: [101, 250],
    no2Range: [81, 180],
    nh3Range: [401, 800],
    so2Range: [81, 380],
    coRange: [2.1, 10.0],
    o3Range: [101, 168],
    pbRange: [1.1, 2.0],
    colorCode: '#FBBF24', // Amber
    healthStatement: 'Breathing discomfort to people with lung disease such as asthma and discomfort to people with heart disease, children and older adults.'
  },
  {
    category: 'Poor',
    aqiRange: [201, 300],
    pm25Range: [91, 120],
    pm10Range: [251, 350],
    no2Range: [181, 280],
    nh3Range: [801, 1200],
    so2Range: [381, 800],
    coRange: [10.1, 17.0],
    o3Range: [169, 208],
    pbRange: [2.1, 3.0],
    colorCode: '#F97316', // Orange
    healthStatement: 'Breathing discomfort to most people on prolonged exposure. Chronic respiratory disease patients should avoid outdoor exertion.'
  },
  {
    category: 'Very Poor',
    aqiRange: [301, 400],
    pm25Range: [121, 250],
    pm10Range: [351, 430],
    no2Range: [281, 400],
    nh3Range: [1201, 1800],
    so2Range: [801, 1600],
    coRange: [17.1, 34.0],
    o3Range: [209, 748],
    pbRange: [3.1, 3.5],
    colorCode: '#EF4444', // Red
    healthStatement: 'Respiratory illness on prolonged exposure. Pronounced effect on people with lung and heart diseases. N95/FFP2 respirators required.'
  },
  {
    category: 'Severe',
    aqiRange: [401, 500],
    pm25Range: [250, 500],
    pm10Range: [430, 800],
    no2Range: [400, 800],
    nh3Range: [1800, 3000],
    so2Range: [1600, 2500],
    coRange: [34.1, 60.0],
    o3Range: [748, 1000],
    pbRange: [3.5, 5.0],
    colorCode: '#7F1D1D', // Maroon / Dark Crimson
    healthStatement: 'Affects healthy people and seriously impacts those with existing diseases. Emergency mitigation (GRAP Stage IV) mandated.'
  }
];

/**
 * CPCB Indian National Sub-Index Calculation Algorithm
 * Ip = [ (I_HI - I_LO) / (B_HI - B_LO) ] * (Cp - B_LO) + I_LO
 */
export function calculateCPCBPollutantSubIndex(
  pollutant: 'pm25' | 'pm10' | 'no2' | 'nh3' | 'so2' | 'co' | 'o3' | 'pb',
  concentration: number
): number {
  const rangeKey = `${pollutant}Range` as keyof CPCBBreakpoint;
  
  for (const bp of CPCB_NAQI_BREAKPOINTS) {
    const [bLo, bHi] = bp[rangeKey] as [number, number];
    if (concentration >= bLo && concentration <= bHi) {
      const [iLo, iHi] = bp.aqiRange;
      const subIndex = ((iHi - iLo) / (bHi - bLo)) * (concentration - bLo) + iLo;
      return Math.round(subIndex);
    }
  }

  // Handle upper unbounded values
  if (concentration > 0) {
    return 500;
  }
  return 0;
}

export interface CPCBStationRecord {
  stationId: string;
  stationName: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  currentAQI: number;
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'O3' | 'SO2';
  pollutants: {
    pm25: number;
    pm10: number;
    no2: number;
    nh3: number;
    so2: number;
    co: number;
    o3: number;
  };
  lastUpdated: string;
  status: 'ONLINE' | 'CALIBRATING' | 'MAINTENANCE';
}

export const CPCB_INDIA_STATION_DATABASE: CPCBStationRecord[] = [
  {
    stationId: 'CPCB_DEL_01',
    stationName: 'Anand Vihar, Delhi - DPCC',
    city: 'Delhi NCR',
    state: 'Delhi',
    latitude: 28.6476,
    longitude: 77.3160,
    currentAQI: 368,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 218.4, pm10: 382.1, no2: 94.2, nh3: 45.8, so2: 24.1, co: 3.4, o3: 42.0 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_DEL_02',
    stationName: 'R K Puram, Delhi - DPCC',
    city: 'Delhi NCR',
    state: 'Delhi',
    latitude: 28.5632,
    longitude: 77.1869,
    currentAQI: 312,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 164.2, pm10: 295.6, no2: 82.5, nh3: 38.1, so2: 19.3, co: 2.8, o3: 56.4 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_BOM_01',
    stationName: 'Bandra Kurla Complex, Mumbai - MPCB',
    city: 'Mumbai',
    state: 'Maharashtra',
    latitude: 19.0657,
    longitude: 72.8687,
    currentAQI: 168,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 78.4, pm10: 142.1, no2: 68.9, nh3: 18.2, so2: 14.5, co: 1.6, o3: 38.1 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_BLR_01',
    stationName: 'BTM Layout, Bengaluru - KSPCB',
    city: 'Bengaluru',
    state: 'Karnataka',
    latitude: 12.9166,
    longitude: 77.6101,
    currentAQI: 74,
    dominantPollutant: 'PM10',
    pollutants: { pm25: 28.6, pm10: 72.4, no2: 34.2, nh3: 12.5, so2: 9.8, co: 0.9, o3: 32.1 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_CCU_01',
    stationName: 'Victoria Memorial, Kolkata - WBPCB',
    city: 'Kolkata',
    state: 'West Bengal',
    latitude: 22.5448,
    longitude: 88.3426,
    currentAQI: 224,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 98.6, pm10: 184.2, no2: 74.1, nh3: 28.4, so2: 21.0, co: 2.1, o3: 45.2 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_HYD_01',
    stationName: 'Sanathnagar, Hyderabad - TSPCB',
    city: 'Hyderabad',
    state: 'Telangana',
    latitude: 17.4563,
    longitude: 78.4439,
    currentAQI: 128,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 54.2, pm10: 112.8, no2: 48.6, nh3: 16.2, so2: 12.4, co: 1.2, o3: 36.8 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_LKO_01',
    stationName: 'Talkatora District Training Center, Lucknow - UPPCB',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    latitude: 26.8322,
    longitude: 80.8974,
    currentAQI: 286,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 116.5, pm10: 242.0, no2: 62.4, nh3: 32.1, so2: 16.8, co: 2.4, o3: 48.2 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_MAA_01',
    stationName: 'Alandur Bus Depot, Chennai - TNPCB',
    city: 'Chennai',
    state: 'Tamil Nadu',
    latitude: 13.0034,
    longitude: 80.2032,
    currentAQI: 88,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 36.4, pm10: 84.1, no2: 28.5, nh3: 11.2, so2: 8.4, co: 0.8, o3: 29.5 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_PAT_01',
    stationName: 'Muradpur, Patna - BSPCB',
    city: 'Patna',
    state: 'Bihar',
    latitude: 25.6186,
    longitude: 85.1612,
    currentAQI: 342,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 182.0, pm10: 320.4, no2: 88.0, nh3: 42.0, so2: 22.5, co: 3.1, o3: 54.0 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  },
  {
    stationId: 'CPCB_AMD_01',
    stationName: 'Maninagar, Ahmedabad - GPCB',
    city: 'Ahmedabad',
    state: 'Gujarat',
    latitude: 22.9968,
    longitude: 72.6031,
    currentAQI: 194,
    dominantPollutant: 'PM2.5',
    pollutants: { pm25: 86.2, pm10: 168.5, no2: 58.1, nh3: 22.4, so2: 18.2, co: 1.8, o3: 41.5 },
    lastUpdated: '2026-09-03T18:30:00Z',
    status: 'ONLINE'
  }
];
