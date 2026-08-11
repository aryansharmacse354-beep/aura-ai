export type UserRole = 'citizen' | 'planner' | 'analyst' | 'field_officer';

export type HealthCondition = 
  | 'asthma'
  | 'copd'
  | 'cardiovascular'
  | 'pregnant'
  | 'elderly'
  | 'child'
  | 'outdoor_worker'
  | 'athlete';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  healthConditions: HealthCondition[];
  alertThresholdAQI: number;
  mfaEnabled: boolean;
  mfaMethod?: 'app' | 'sms' | 'security_key';
  savedLocations: { name: string; lat: number; lng: number }[];
  offlineRegions: string[];
  lastLogin: string;
  createdAt: string;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  event: string;
  ipAddress: string;
  location: string;
  device: string;
  status: 'success' | 'warning' | 'failed';
}

export interface PollutantDetail {
  name: 'PM2.5' | 'PM10' | 'NO2' | 'O3' | 'SO2' | 'CO';
  value: number; // in µg/m³ or ppb
  unit: string;
  category: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  limit: number; // WHO benchmark limit
  percentOfLimit: number;
}

export interface AQIMeasurement {
  cityId: string;
  cityName: string;
  country: string;
  lat: number;
  lng: number;
  aqi: number;
  aqiCategory: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous';
  primaryPollutant: string;
  uncertainty: number; // e.g. +/- 12
  pollutants: PollutantDetail[];
  weather: {
    tempC: number;
    humidity: number;
    windSpeedKmh: number;
    windDirectionDeg: number;
    pressureHpa: number;
    boundaryLayerHeightM: number;
    visibilityKm: number;
  };
  lastUpdated: string;
  sourceAttribution: {
    source: string;
    percentage: number;
    color: string;
  }[];
}

export interface ForecastPoint {
  time: string; // e.g. "Today 14:00" or "Aug 12, 08:00"
  aqi: number;
  upperBound: number;
  lowerBound: number;
  pm25: number;
  pm10: number;
  no2: number;
  o3: number;
  confidenceScore: number; // 0 - 100
  windSpeed: number;
  windDirection: number;
}

export interface GNNNode {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  type: 'monitoring_station' | 'industrial_zone' | 'traffic_corridor' | 'residential_grid';
  status: 'active' | 'degraded' | 'offline';
  connectedNodeIds: string[];
  vectorDriftSpeed: number; // km/h
  vectorDirectionDeg: number;
}

export interface RouteWaypoint {
  lat: number;
  lng: number;
  name?: string;
  aqi: number;
  distanceFromStartKm: number;
}

export interface CleanPathRoute {
  id: string;
  title: string;
  mode: 'walking' | 'cycling' | 'driving';
  originName: string;
  destinationName: string;
  totalDistanceKm: number;
  durationMins: number;
  avgAQI: number;
  peakAQI: number;
  exposureReductionPercent: number; // vs standard path
  isOfflineCached: boolean;
  waypoints: RouteWaypoint[];
  pathCoordinates: [number, number][]; // [lat, lng]
  standardPathCoordinates: [number, number][]; // [lat, lng] for comparison
}

export interface PolicyIntervention {
  id: string;
  name: string;
  category: 'traffic' | 'industry' | 'agriculture' | 'energy' | 'urban_green';
  sliderValue: number; // 0 to 100
  unit: string;
  description: string;
}

export interface PolicySimulationResult {
  scenarioName: string;
  projectedAQIReductionPercent: number;
  newAvgAQI: number;
  currentAvgAQI: number;
  estimatedCostMillionUSD: number;
  implementationTimeMonths: number;
  sectorImpacts: {
    sector: string;
    reductionPercent: number;
  }[];
  aiAnalysisNarrative: string;
  districtImpacts: {
    districtName: string;
    beforeAQI: number;
    afterAQI: number;
  }[];
  confidenceInterval: string;
}

export interface OfflineMapRegion {
  id: string;
  name: string;
  center: [number, number];
  zoomRange: [number, number];
  estimatedSizeMB: number;
  tileCount: number;
  isDownloaded: boolean;
  downloadDate?: string;
  expiresDate?: string;
}

export interface GPSPosition {
  lat: number;
  lng: number;
  accuracy: number;
  speed: number | null;
  heading: number | null;
  altitude: number | null;
  timestamp: number;
  currentAQI: number;
  locationName: string;
}

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  groundingSources?: { title: string; url: string }[];
}
