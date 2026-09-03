/**
 * World Air Quality Index (WAQI) Project & US EPA Air Quality System (AQS) Datasets
 * Sources:
 * - https://waqi.info/
 * - https://www.epa.gov/aqs
 */

export interface WaqiStationFeed {
  uid: number;
  aqi: number;
  station: {
    name: string;
    geo: [number, number]; // [lat, lng]
    url: string;
    country: string;
  };
  dominantPollutant: string;
  time: {
    s: string;
    tz: string;
    v: number;
  };
  iaqi: {
    pm25?: { v: number };
    pm10?: { v: number };
    no2?: { v: number };
    so2?: { v: number };
    o3?: { v: number };
    co?: { v: number };
    t?: { v: number }; // Temp C
    h?: { v: number }; // Humidity %
    w?: { v: number }; // Wind m/s
    p?: { v: number }; // Pressure hPa
  };
}

export const WAQI_GLOBAL_MONITORING_NETWORK: WaqiStationFeed[] = [
  {
    uid: 8421,
    aqi: 345,
    station: {
      name: 'US Embassy, New Delhi, India',
      geo: [28.5983, 77.1895],
      url: 'https://aqicn.org/city/delhi/us-embassy/',
      country: 'IN'
    },
    dominantPollutant: 'pm25',
    time: { s: '2026-09-03 18:00:00', tz: '+05:30', v: 1788448800 },
    iaqi: { pm25: { v: 295.4 }, pm10: { v: 388.0 }, no2: { v: 76.2 }, o3: { v: 42.1 }, t: { v: 31.5 }, h: { v: 62 }, w: { v: 2.1 } }
  },
  {
    uid: 1452,
    aqi: 142,
    station: {
      name: 'US Consulate, Mumbai, India',
      geo: [19.0688, 72.8698],
      url: 'https://aqicn.org/city/mumbai/us-consulate/',
      country: 'IN'
    },
    dominantPollutant: 'pm25',
    time: { s: '2026-09-03 18:00:00', tz: '+05:30', v: 1788448800 },
    iaqi: { pm25: { v: 52.8 }, pm10: { v: 104.2 }, no2: { v: 48.0 }, o3: { v: 34.0 }, t: { v: 29.8 }, h: { v: 78 }, w: { v: 4.2 } }
  },
  {
    uid: 3341,
    aqi: 58,
    station: {
      name: 'Central 5th Ave, New York, USA',
      geo: [40.7580, -73.9855],
      url: 'https://aqicn.org/city/usa/new-york/',
      country: 'US'
    },
    dominantPollutant: 'o3',
    time: { s: '2026-09-03 08:30:00', tz: '-04:00', v: 1788448200 },
    iaqi: { pm25: { v: 14.2 }, pm10: { v: 22.0 }, no2: { v: 18.5 }, o3: { v: 58.0 }, t: { v: 22.0 }, h: { v: 55 }, w: { v: 3.6 } }
  },
  {
    uid: 9102,
    aqi: 42,
    station: {
      name: 'Shinjuku, Tokyo, Japan',
      geo: [35.6895, 139.6917],
      url: 'https://aqicn.org/city/tokyo/',
      country: 'JP'
    },
    dominantPollutant: 'pm25',
    time: { s: '2026-09-03 21:30:00', tz: '+09:00', v: 1788447000 },
    iaqi: { pm25: { v: 9.8 }, pm10: { v: 18.4 }, no2: { v: 14.1 }, o3: { v: 38.0 }, t: { v: 24.5 }, h: { v: 68 }, w: { v: 1.8 } }
  }
];

/**
 * US EPA NowCast Calculation Algorithm
 * Calculates dynamic time-weighted particulate concentrations
 * w = (c_max - c_min) / c_max; weight_factor = max(1 - w, 0.5)
 */
export function calculateEpaNowCast(hourlyPm25Concentrations: number[]): number {
  if (!hourlyPm25Concentrations.length) return 0;
  if (hourlyPm25Concentrations.length === 1) return hourlyPm25Concentrations[0];

  const recent12 = hourlyPm25Concentrations.slice(-12);
  const cMax = Math.max(...recent12);
  const cMin = Math.min(...recent12);
  
  const w = cMax > 0 ? (cMax - cMin) / cMax : 0;
  const weightFactor = Math.max(1 - w, 0.5);

  let numerator = 0;
  let denominator = 0;

  for (let i = 0; i < recent12.length; i++) {
    const power = recent12.length - 1 - i;
    const weight = Math.pow(weightFactor, power);
    numerator += recent12[i] * weight;
    denominator += weight;
  }

  return Math.round((numerator / denominator) * 10) / 10;
}
