import { AQIMeasurement, CleanPathRoute, ForecastPoint, GNNNode, OfflineMapRegion, PolicyIntervention, SecurityAuditLog, UserProfile } from '../types';

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: 'usr_citizen_01',
    name: 'Dr. Sarah Lin',
    email: 'sarah.lin@aurapredict.org',
    role: 'citizen',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    healthConditions: ['asthma', 'outdoor_worker'],
    alertThresholdAQI: 120,
    mfaEnabled: true,
    mfaMethod: 'app',
    savedLocations: [
      { name: 'Home Base', lat: 28.6139, lng: 77.2090 },
      { name: 'Research Lab', lat: 28.5355, lng: 77.3910 }
    ],
    offlineRegions: ['off_delhi_core', 'off_mumbai_metro'],
    lastLogin: '2026-08-11T02:15:00Z',
    createdAt: '2026-01-10T10:00:00Z'
  },
  {
    id: 'usr_planner_02',
    name: 'Marcus Vance',
    email: 'm.vance@citygov.gov',
    role: 'planner',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    healthConditions: ['cardiovascular'],
    alertThresholdAQI: 150,
    mfaEnabled: true,
    mfaMethod: 'security_key',
    savedLocations: [
      { name: 'Municipal City Hall', lat: 28.6304, lng: 77.2177 },
      { name: 'Industrial Monitoring Station 4', lat: 28.7041, lng: 77.1025 }
    ],
    offlineRegions: ['off_delhi_core'],
    lastLogin: '2026-08-10T18:45:00Z',
    createdAt: '2025-11-20T08:30:00Z'
  }
];

export const INITIAL_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'log_901',
    timestamp: '2026-08-11 02:15:02',
    event: 'Multi-Factor Session Handshake',
    ipAddress: '192.168.1.104',
    location: 'New Delhi, IN',
    device: 'AuraPredict Web App / Chrome 128',
    status: 'success'
  },
  {
    id: 'log_902',
    timestamp: '2026-08-11 01:04:18',
    event: 'Offline Map Region Package Cached',
    ipAddress: '192.168.1.104',
    location: 'New Delhi, IN',
    device: 'AuraPredict Native Service Worker',
    status: 'success'
  },
  {
    id: 'log_903',
    timestamp: '2026-08-10 22:30:45',
    event: 'Password Token Re-authentication',
    ipAddress: '192.168.1.104',
    location: 'New Delhi, IN',
    device: 'AuraPredict Web App',
    status: 'success'
  },
  {
    id: 'log_904',
    timestamp: '2026-08-09 14:12:00',
    event: 'API Session Key Rotation',
    ipAddress: '10.0.4.12',
    location: 'Cloud Ingestion Microservice',
    device: 'Server Node Express',
    status: 'success'
  }
];

export const CITIES_AQI_DATA: AQIMeasurement[] = [
  // --- NORTH INDIA ---
  {
    cityId: 'delhi',
    cityName: 'Delhi NCR',
    country: 'India (Delhi)',
    lat: 28.6139,
    lng: 77.2090,
    aqi: 284,
    aqiCategory: 'Very Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 11,
    pollutants: [
      { name: 'PM2.5', value: 182.4, unit: 'µg/m³', category: 'Very Unhealthy', limit: 15, percentOfLimit: 1216 },
      { name: 'PM10', value: 295.1, unit: 'µg/m³', category: 'Unhealthy', limit: 45, percentOfLimit: 655 },
      { name: 'NO2', value: 78.3, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 313 },
      { name: 'O3', value: 52.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 52 },
      { name: 'SO2', value: 34.2, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 85 },
      { name: 'CO', value: 2.8, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 70 }
    ],
    weather: {
      tempC: 34,
      humidity: 62,
      windSpeedKmh: 11.2,
      windDirectionDeg: 310,
      pressureHpa: 1008,
      boundaryLayerHeightM: 420,
      visibilityKm: 3.2
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Vehicular Emissions & Freight', percentage: 38, color: '#f59e0b' },
      { source: 'Industrial Stacks & Thermal', percentage: 27, color: '#ef4444' },
      { source: 'Agricultural Crop Burning Drift', percentage: 21, color: '#8b5cf6' },
      { source: 'Construction & Dust Resuspension', percentage: 14, color: '#64748b' }
    ]
  },
  {
    cityId: 'lucknow',
    cityName: 'Lucknow District',
    country: 'India (Uttar Pradesh)',
    lat: 26.8467,
    lng: 80.9462,
    aqi: 265,
    aqiCategory: 'Very Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 9,
    pollutants: [
      { name: 'PM2.5', value: 165.0, unit: 'µg/m³', category: 'Very Unhealthy', limit: 15, percentOfLimit: 1100 },
      { name: 'PM10', value: 240.0, unit: 'µg/m³', category: 'Unhealthy', limit: 45, percentOfLimit: 533 },
      { name: 'NO2', value: 62.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 248 },
      { name: 'O3', value: 48.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 48 },
      { name: 'SO2', value: 22.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 55 },
      { name: 'CO', value: 2.1, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 52 }
    ],
    weather: {
      tempC: 33,
      humidity: 68,
      windSpeedKmh: 9.5,
      windDirectionDeg: 290,
      pressureHpa: 1006,
      boundaryLayerHeightM: 480,
      visibilityKm: 4.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Urban Transit & Diesel Vans', percentage: 42, color: '#f59e0b' },
      { source: 'Brick Kilns & Unorganized Industry', percentage: 33, color: '#ef4444' },
      { source: 'Biomass Burning', percentage: 25, color: '#8b5cf6' }
    ]
  },
  {
    cityId: 'varanasi',
    cityName: 'Varanasi District',
    country: 'India (Uttar Pradesh)',
    lat: 25.3176,
    lng: 82.9739,
    aqi: 278,
    aqiCategory: 'Very Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 10,
    pollutants: [
      { name: 'PM2.5', value: 175.2, unit: 'µg/m³', category: 'Very Unhealthy', limit: 15, percentOfLimit: 1168 },
      { name: 'PM10', value: 260.0, unit: 'µg/m³', category: 'Unhealthy', limit: 45, percentOfLimit: 577 },
      { name: 'NO2', value: 58.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 232 },
      { name: 'O3', value: 42.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 42 },
      { name: 'SO2', value: 28.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 70 },
      { name: 'CO', value: 2.4, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 60 }
    ],
    weather: {
      tempC: 32,
      humidity: 72,
      windSpeedKmh: 7.8,
      windDirectionDeg: 270,
      pressureHpa: 1005,
      boundaryLayerHeightM: 450,
      visibilityKm: 3.5
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Construction & Silt Dust', percentage: 38, color: '#64748b' },
      { source: 'Vehicular Traffic', percentage: 35, color: '#f59e0b' },
      { source: 'River Plain Biomass Burning', percentage: 27, color: '#8b5cf6' }
    ]
  },
  {
    cityId: 'agra',
    cityName: 'Agra District',
    country: 'India (Uttar Pradesh)',
    lat: 27.1767,
    lng: 78.0081,
    aqi: 245,
    aqiCategory: 'Very Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 8,
    pollutants: [
      { name: 'PM2.5', value: 152.0, unit: 'µg/m³', category: 'Very Unhealthy', limit: 15, percentOfLimit: 1013 },
      { name: 'PM10', value: 220.0, unit: 'µg/m³', category: 'Unhealthy', limit: 45, percentOfLimit: 488 },
      { name: 'NO2', value: 54.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 216 },
      { name: 'O3', value: 50.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 50 },
      { name: 'SO2', value: 31.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 77 },
      { name: 'CO', value: 2.0, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 50 }
    ],
    weather: {
      tempC: 35,
      humidity: 58,
      windSpeedKmh: 10.0,
      windDirectionDeg: 300,
      pressureHpa: 1007,
      boundaryLayerHeightM: 510,
      visibilityKm: 4.2
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Foundries & Glass Industry', percentage: 40, color: '#ef4444' },
      { source: 'National Highway Freight Traffic', percentage: 38, color: '#f59e0b' },
      { source: 'Dust & Municipal Waste', percentage: 22, color: '#64748b' }
    ]
  },
  {
    cityId: 'jaipur',
    cityName: 'Jaipur District',
    country: 'India (Rajasthan)',
    lat: 26.9124,
    lng: 75.7873,
    aqi: 210,
    aqiCategory: 'Very Unhealthy',
    primaryPollutant: 'PM10',
    uncertainty: 8,
    pollutants: [
      { name: 'PM2.5', value: 110.0, unit: 'µg/m³', category: 'Unhealthy', limit: 15, percentOfLimit: 733 },
      { name: 'PM10', value: 225.0, unit: 'µg/m³', category: 'Very Unhealthy', limit: 45, percentOfLimit: 500 },
      { name: 'NO2', value: 45.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 180 },
      { name: 'O3', value: 55.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 55 },
      { name: 'SO2', value: 18.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 45 },
      { name: 'CO', value: 1.6, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 40 }
    ],
    weather: {
      tempC: 37,
      humidity: 42,
      windSpeedKmh: 14.5,
      windDirectionDeg: 250,
      pressureHpa: 1004,
      boundaryLayerHeightM: 780,
      visibilityKm: 5.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Thar Desert Crustal Dust', percentage: 48, color: '#eab308' },
      { source: 'Vehicular Traffic', percentage: 32, color: '#f59e0b' },
      { source: 'Stone Crushing & Mining', percentage: 20, color: '#64748b' }
    ]
  },
  {
    cityId: 'chandigarh',
    cityName: 'Chandigarh District',
    country: 'India (Punjab/Haryana)',
    lat: 30.7333,
    lng: 76.7794,
    aqi: 128,
    aqiCategory: 'Unhealthy for Sensitive Groups',
    primaryPollutant: 'PM2.5',
    uncertainty: 6,
    pollutants: [
      { name: 'PM2.5', value: 46.5, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 15, percentOfLimit: 310 },
      { name: 'PM10', value: 92.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 204 },
      { name: 'NO2', value: 32.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 128 },
      { name: 'O3', value: 48.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 48 },
      { name: 'SO2', value: 12.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 30 },
      { name: 'CO', value: 1.1, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 28 }
    ],
    weather: {
      tempC: 32,
      humidity: 58,
      windSpeedKmh: 12.0,
      windDirectionDeg: 300,
      pressureHpa: 1010,
      boundaryLayerHeightM: 650,
      visibilityKm: 7.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Interstate Transport Corridor', percentage: 45, color: '#f59e0b' },
      { source: 'Agricultural Drift', percentage: 35, color: '#8b5cf6' },
      { source: 'Commercial HVAC & Power', percentage: 20, color: '#10b981' }
    ]
  },
  {
    cityId: 'ludhiana',
    cityName: 'Ludhiana District',
    country: 'India (Punjab)',
    lat: 30.9010,
    lng: 75.8573,
    aqi: 220,
    aqiCategory: 'Very Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 8,
    pollutants: [
      { name: 'PM2.5', value: 135.0, unit: 'µg/m³', category: 'Very Unhealthy', limit: 15, percentOfLimit: 900 },
      { name: 'PM10', value: 210.0, unit: 'µg/m³', category: 'Unhealthy', limit: 45, percentOfLimit: 466 },
      { name: 'NO2', value: 50.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 200 },
      { name: 'O3', value: 40.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 40 },
      { name: 'SO2', value: 25.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 62 },
      { name: 'CO', value: 1.9, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 48 }
    ],
    weather: {
      tempC: 34,
      humidity: 60,
      windSpeedKmh: 10.5,
      windDirectionDeg: 310,
      pressureHpa: 1008,
      boundaryLayerHeightM: 500,
      visibilityKm: 4.5
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Textile & Metal Dyeing Units', percentage: 46, color: '#ef4444' },
      { source: 'Stubble Burning Incursion', percentage: 34, color: '#8b5cf6' },
      { source: 'Urban Freight Traffic', percentage: 20, color: '#f59e0b' }
    ]
  },
  {
    cityId: 'srinagar',
    cityName: 'Srinagar District',
    country: 'India (Jammu & Kashmir)',
    lat: 34.0837,
    lng: 74.7973,
    aqi: 52,
    aqiCategory: 'Moderate',
    primaryPollutant: 'PM2.5',
    uncertainty: 4,
    pollutants: [
      { name: 'PM2.5', value: 12.8, unit: 'µg/m³', category: 'Moderate', limit: 15, percentOfLimit: 85 },
      { name: 'PM10', value: 28.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 62 },
      { name: 'NO2', value: 15.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 60 },
      { name: 'O3', value: 38.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 38 },
      { name: 'SO2', value: 6.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 15 },
      { name: 'CO', value: 0.5, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 12 }
    ],
    weather: {
      tempC: 22,
      humidity: 50,
      windSpeedKmh: 8.0,
      windDirectionDeg: 120,
      pressureHpa: 1018,
      boundaryLayerHeightM: 920,
      visibilityKm: 10.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Domestic Wood & Biomass Heating', percentage: 52, color: '#8b5cf6' },
      { source: 'Tourist Vehicles', percentage: 35, color: '#f59e0b' },
      { source: 'Valley Dust', percentage: 13, color: '#64748b' }
    ]
  },
  {
    cityId: 'dehradun',
    cityName: 'Dehradun District',
    country: 'India (Uttarakhand)',
    lat: 30.3165,
    lng: 78.0322,
    aqi: 88,
    aqiCategory: 'Moderate',
    primaryPollutant: 'PM2.5',
    uncertainty: 5,
    pollutants: [
      { name: 'PM2.5', value: 29.5, unit: 'µg/m³', category: 'Moderate', limit: 15, percentOfLimit: 196 },
      { name: 'PM10', value: 62.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 137 },
      { name: 'NO2', value: 22.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 88 },
      { name: 'O3', value: 42.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 42 },
      { name: 'SO2', value: 8.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 20 },
      { name: 'CO', value: 0.8, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 20 }
    ],
    weather: {
      tempC: 28,
      humidity: 62,
      windSpeedKmh: 9.0,
      windDirectionDeg: 180,
      pressureHpa: 1012,
      boundaryLayerHeightM: 800,
      visibilityKm: 8.5
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Vehicular Hill Transit', percentage: 50, color: '#f59e0b' },
      { source: 'Valley Thermal Inversion Dust', percentage: 30, color: '#64748b' },
      { source: 'Residential Combustion', percentage: 20, color: '#8b5cf6' }
    ]
  },
  {
    cityId: 'shimla',
    cityName: 'Shimla District',
    country: 'India (Himachal Pradesh)',
    lat: 31.1048,
    lng: 77.1734,
    aqi: 35,
    aqiCategory: 'Good',
    primaryPollutant: 'O3',
    uncertainty: 3,
    pollutants: [
      { name: 'PM2.5', value: 6.2, unit: 'µg/m³', category: 'Good', limit: 15, percentOfLimit: 41 },
      { name: 'PM10', value: 18.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 40 },
      { name: 'NO2', value: 10.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 40 },
      { name: 'O3', value: 32.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 32 },
      { name: 'SO2', value: 3.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 7 },
      { name: 'CO', value: 0.3, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 8 }
    ],
    weather: {
      tempC: 20,
      humidity: 55,
      windSpeedKmh: 12.0,
      windDirectionDeg: 210,
      pressureHpa: 1020,
      boundaryLayerHeightM: 1200,
      visibilityKm: 12.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Tourist Transport', percentage: 65, color: '#f59e0b' },
      { source: 'Biomass Burning', percentage: 35, color: '#8b5cf6' }
    ]
  },

  // --- WEST INDIA ---
  {
    cityId: 'mumbai',
    cityName: 'Mumbai Metro',
    country: 'India (Maharashtra)',
    lat: 19.0760,
    lng: 72.8777,
    aqi: 142,
    aqiCategory: 'Unhealthy for Sensitive Groups',
    primaryPollutant: 'PM2.5',
    uncertainty: 7,
    pollutants: [
      { name: 'PM2.5', value: 52.1, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 15, percentOfLimit: 347 },
      { name: 'PM10', value: 110.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 244 },
      { name: 'NO2', value: 42.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 168 },
      { name: 'O3', value: 38.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 38 },
      { name: 'SO2', value: 18.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 45 },
      { name: 'CO', value: 1.4, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 35 }
    ],
    weather: {
      tempC: 31,
      humidity: 78,
      windSpeedKmh: 18.5,
      windDirectionDeg: 240,
      pressureHpa: 1012,
      boundaryLayerHeightM: 680,
      visibilityKm: 6.5
    },
    lastUpdated: '2026-08-11T02:25:00Z',
    sourceAttribution: [
      { source: 'Maritime & Port Logistics', percentage: 32, color: '#06b6d4' },
      { source: 'Vehicular Emissions', percentage: 34, color: '#f59e0b' },
      { source: 'Refining & Petrochemicals', percentage: 22, color: '#ef4444' },
      { source: 'Coastal Dust & Construction', percentage: 12, color: '#64748b' }
    ]
  },
  {
    cityId: 'pune',
    cityName: 'Pune District',
    country: 'India (Maharashtra)',
    lat: 18.5204,
    lng: 73.8567,
    aqi: 98,
    aqiCategory: 'Moderate',
    primaryPollutant: 'PM2.5',
    uncertainty: 5,
    pollutants: [
      { name: 'PM2.5', value: 34.2, unit: 'µg/m³', category: 'Moderate', limit: 15, percentOfLimit: 228 },
      { name: 'PM10', value: 72.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 160 },
      { name: 'NO2', value: 28.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 112 },
      { name: 'O3', value: 45.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 45 },
      { name: 'SO2', value: 11.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 27 },
      { name: 'CO', value: 0.9, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 22 }
    ],
    weather: {
      tempC: 29,
      humidity: 65,
      windSpeedKmh: 15.0,
      windDirectionDeg: 260,
      pressureHpa: 1013,
      boundaryLayerHeightM: 750,
      visibilityKm: 8.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Automotive & Tech Park Transit', percentage: 48, color: '#f59e0b' },
      { source: 'Industrial Manufacturing Clusters', percentage: 32, color: '#ef4444' },
      { source: 'Dust Resuspension', percentage: 20, color: '#64748b' }
    ]
  },
  {
    cityId: 'nagpur',
    cityName: 'Nagpur District',
    country: 'India (Maharashtra)',
    lat: 21.1458,
    lng: 79.0882,
    aqi: 110,
    aqiCategory: 'Unhealthy for Sensitive Groups',
    primaryPollutant: 'PM2.5',
    uncertainty: 6,
    pollutants: [
      { name: 'PM2.5', value: 39.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 15, percentOfLimit: 260 },
      { name: 'PM10', value: 85.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 188 },
      { name: 'NO2', value: 31.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 124 },
      { name: 'O3', value: 40.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 40 },
      { name: 'SO2', value: 16.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 40 },
      { name: 'CO', value: 1.0, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 25 }
    ],
    weather: {
      tempC: 33,
      humidity: 62,
      windSpeedKmh: 11.0,
      windDirectionDeg: 280,
      pressureHpa: 1010,
      boundaryLayerHeightM: 700,
      visibilityKm: 7.5
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Thermal Power Plants', percentage: 45, color: '#ef4444' },
      { source: 'Logistics Freight Hubs', percentage: 35, color: '#f59e0b' },
      { source: 'Agricultural Dust', percentage: 20, color: '#64748b' }
    ]
  },
  {
    cityId: 'ahmedabad',
    cityName: 'Ahmedabad District',
    country: 'India (Gujarat)',
    lat: 23.0225,
    lng: 72.5714,
    aqi: 175,
    aqiCategory: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 8,
    pollutants: [
      { name: 'PM2.5', value: 92.0, unit: 'µg/m³', category: 'Unhealthy', limit: 15, percentOfLimit: 613 },
      { name: 'PM10', value: 155.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 45, percentOfLimit: 344 },
      { name: 'NO2', value: 48.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 192 },
      { name: 'O3', value: 52.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 52 },
      { name: 'SO2', value: 24.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 60 },
      { name: 'CO', value: 1.8, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 45 }
    ],
    weather: {
      tempC: 36,
      humidity: 52,
      windSpeedKmh: 13.0,
      windDirectionDeg: 270,
      pressureHpa: 1007,
      boundaryLayerHeightM: 620,
      visibilityKm: 5.2
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Textile & Chemical Chemical Estate', percentage: 44, color: '#ef4444' },
      { source: 'Urban Vehicular Grid', percentage: 36, color: '#f59e0b' },
      { source: 'Arid Crustal Dust', percentage: 20, color: '#eab308' }
    ]
  },
  {
    cityId: 'surat',
    cityName: 'Surat District',
    country: 'India (Gujarat)',
    lat: 21.1702,
    lng: 72.8311,
    aqi: 162,
    aqiCategory: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 7,
    pollutants: [
      { name: 'PM2.5', value: 81.0, unit: 'µg/m³', category: 'Unhealthy', limit: 15, percentOfLimit: 540 },
      { name: 'PM10', value: 140.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 45, percentOfLimit: 311 },
      { name: 'NO2', value: 44.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 176 },
      { name: 'O3', value: 46.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 46 },
      { name: 'SO2', value: 28.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 70 },
      { name: 'CO', value: 1.6, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 40 }
    ],
    weather: {
      tempC: 33,
      humidity: 70,
      windSpeedKmh: 15.2,
      windDirectionDeg: 250,
      pressureHpa: 1009,
      boundaryLayerHeightM: 650,
      visibilityKm: 6.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Textile & Diamond Processing Units', percentage: 48, color: '#ef4444' },
      { source: 'Heavy Heavy Commercial Vehicles', percentage: 32, color: '#f59e0b' },
      { source: 'Coastal Sea Salt & Dust', percentage: 20, color: '#06b6d4' }
    ]
  },
  {
    cityId: 'panaji',
    cityName: 'North Goa District',
    country: 'India (Goa)',
    lat: 15.4989,
    lng: 73.8278,
    aqi: 32,
    aqiCategory: 'Good',
    primaryPollutant: 'O3',
    uncertainty: 3,
    pollutants: [
      { name: 'PM2.5', value: 5.5, unit: 'µg/m³', category: 'Good', limit: 15, percentOfLimit: 36 },
      { name: 'PM10', value: 15.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 33 },
      { name: 'NO2', value: 12.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 48 },
      { name: 'O3', value: 30.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 30 },
      { name: 'SO2', value: 4.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 10 },
      { name: 'CO', value: 0.4, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 10 }
    ],
    weather: {
      tempC: 29,
      humidity: 82,
      windSpeedKmh: 20.0,
      windDirectionDeg: 230,
      pressureHpa: 1014,
      boundaryLayerHeightM: 1100,
      visibilityKm: 12.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Marine Coastal Winds', percentage: 60, color: '#06b6d4' },
      { source: 'Tourist Transport', percentage: 40, color: '#f59e0b' }
    ]
  },

  // --- SOUTH INDIA ---
  {
    cityId: 'bengaluru',
    cityName: 'Bengaluru Urban District',
    country: 'India (Karnataka)',
    lat: 12.9716,
    lng: 77.5946,
    aqi: 68,
    aqiCategory: 'Moderate',
    primaryPollutant: 'PM2.5',
    uncertainty: 4,
    pollutants: [
      { name: 'PM2.5', value: 20.5, unit: 'µg/m³', category: 'Moderate', limit: 15, percentOfLimit: 136 },
      { name: 'PM10', value: 48.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 106 },
      { name: 'NO2', value: 26.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 104 },
      { name: 'O3', value: 42.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 42 },
      { name: 'SO2', value: 6.5, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 16 },
      { name: 'CO', value: 0.8, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 20 }
    ],
    weather: {
      tempC: 27,
      humidity: 65,
      windSpeedKmh: 16.0,
      windDirectionDeg: 240,
      pressureHpa: 1015,
      boundaryLayerHeightM: 850,
      visibilityKm: 9.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Urban Traffic & Outer Ring Road', percentage: 62, color: '#f59e0b' },
      { source: 'Construction Dust', percentage: 24, color: '#64748b' },
      { source: 'Industrial Generators', percentage: 14, color: '#ef4444' }
    ]
  },
  {
    cityId: 'chennai',
    cityName: 'Chennai District',
    country: 'India (Tamil Nadu)',
    lat: 13.0827,
    lng: 80.2707,
    aqi: 74,
    aqiCategory: 'Moderate',
    primaryPollutant: 'PM2.5',
    uncertainty: 5,
    pollutants: [
      { name: 'PM2.5', value: 23.0, unit: 'µg/m³', category: 'Moderate', limit: 15, percentOfLimit: 153 },
      { name: 'PM10', value: 52.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 115 },
      { name: 'NO2', value: 24.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 96 },
      { name: 'O3', value: 38.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 38 },
      { name: 'SO2', value: 12.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 30 },
      { name: 'CO', value: 0.9, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 22 }
    ],
    weather: {
      tempC: 32,
      humidity: 76,
      windSpeedKmh: 19.0,
      windDirectionDeg: 120,
      pressureHpa: 1012,
      boundaryLayerHeightM: 900,
      visibilityKm: 8.5
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Port Logistics & Heavy Freight', percentage: 40, color: '#06b6d4' },
      { source: 'Vehicular Emissions', percentage: 38, color: '#f59e0b' },
      { source: 'Industrial Petrochemical Belt', percentage: 22, color: '#ef4444' }
    ]
  },
  {
    cityId: 'hyderabad',
    cityName: 'Hyderabad District',
    country: 'India (Telangana)',
    lat: 17.3850,
    lng: 78.4867,
    aqi: 112,
    aqiCategory: 'Unhealthy for Sensitive Groups',
    primaryPollutant: 'PM2.5',
    uncertainty: 6,
    pollutants: [
      { name: 'PM2.5', value: 40.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 15, percentOfLimit: 266 },
      { name: 'PM10', value: 88.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 195 },
      { name: 'NO2', value: 32.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 128 },
      { name: 'O3', value: 44.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 44 },
      { name: 'SO2', value: 10.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 25 },
      { name: 'CO', value: 1.1, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 28 }
    ],
    weather: {
      tempC: 30,
      humidity: 64,
      windSpeedKmh: 14.0,
      windDirectionDeg: 260,
      pressureHpa: 1011,
      boundaryLayerHeightM: 720,
      visibilityKm: 7.8
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'IT Corridor & Ring Road Traffic', percentage: 52, color: '#f59e0b' },
      { source: 'Pharma & Industrial Clusters', percentage: 28, color: '#ef4444' },
      { source: 'Dust & Construction', percentage: 20, color: '#64748b' }
    ]
  },
  {
    cityId: 'visakhapatnam',
    cityName: 'Visakhapatnam District',
    country: 'India (Andhra Pradesh)',
    lat: 17.6868,
    lng: 83.2185,
    aqi: 86,
    aqiCategory: 'Moderate',
    primaryPollutant: 'PM2.5',
    uncertainty: 5,
    pollutants: [
      { name: 'PM2.5', value: 28.5, unit: 'µg/m³', category: 'Moderate', limit: 15, percentOfLimit: 190 },
      { name: 'PM10', value: 65.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 144 },
      { name: 'NO2', value: 26.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 104 },
      { name: 'O3', value: 36.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 36 },
      { name: 'SO2', value: 18.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 45 },
      { name: 'CO', value: 0.9, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 22 }
    ],
    weather: {
      tempC: 31,
      humidity: 75,
      windSpeedKmh: 17.5,
      windDirectionDeg: 140,
      pressureHpa: 1012,
      boundaryLayerHeightM: 880,
      visibilityKm: 8.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Steel Plant & Heavy Industry', percentage: 48, color: '#ef4444' },
      { source: 'Port Maritime Operations', percentage: 32, color: '#06b6d4' },
      { source: 'Urban Transit', percentage: 20, color: '#f59e0b' }
    ]
  },
  {
    cityId: 'kochi',
    cityName: 'Ernakulam District (Kochi)',
    country: 'India (Kerala)',
    lat: 9.9312,
    lng: 76.2673,
    aqi: 42,
    aqiCategory: 'Good',
    primaryPollutant: 'O3',
    uncertainty: 3,
    pollutants: [
      { name: 'PM2.5', value: 9.8, unit: 'µg/m³', category: 'Good', limit: 15, percentOfLimit: 65 },
      { name: 'PM10', value: 24.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 53 },
      { name: 'NO2', value: 16.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 64 },
      { name: 'O3', value: 38.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 38 },
      { name: 'SO2', value: 5.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 12 },
      { name: 'CO', value: 0.5, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 12 }
    ],
    weather: {
      tempC: 28,
      humidity: 84,
      windSpeedKmh: 18.0,
      windDirectionDeg: 270,
      pressureHpa: 1014,
      boundaryLayerHeightM: 1050,
      visibilityKm: 10.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Coastal Sea Breeze dispersion', percentage: 55, color: '#06b6d4' },
      { source: 'Port & Refinery Corridor', percentage: 28, color: '#ef4444' },
      { source: 'Urban Transport', percentage: 17, color: '#f59e0b' }
    ]
  },
  {
    cityId: 'thiruvananthapuram',
    cityName: 'Thiruvananthapuram District',
    country: 'India (Kerala)',
    lat: 8.5241,
    lng: 76.9366,
    aqi: 38,
    aqiCategory: 'Good',
    primaryPollutant: 'O3',
    uncertainty: 3,
    pollutants: [
      { name: 'PM2.5', value: 8.2, unit: 'µg/m³', category: 'Good', limit: 15, percentOfLimit: 54 },
      { name: 'PM10', value: 20.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 44 },
      { name: 'NO2', value: 14.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 56 },
      { name: 'O3', value: 32.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 32 },
      { name: 'SO2', value: 4.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 10 },
      { name: 'CO', value: 0.4, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 10 }
    ],
    weather: {
      tempC: 29,
      humidity: 80,
      windSpeedKmh: 16.5,
      windDirectionDeg: 250,
      pressureHpa: 1014,
      boundaryLayerHeightM: 1100,
      visibilityKm: 11.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Maritime Ocean Dispersion', percentage: 65, color: '#06b6d4' },
      { source: 'Urban Vehicles', percentage: 35, color: '#f59e0b' }
    ]
  },
  {
    cityId: 'coimbatore',
    cityName: 'Coimbatore District',
    country: 'India (Tamil Nadu)',
    lat: 11.0168,
    lng: 76.9558,
    aqi: 58,
    aqiCategory: 'Moderate',
    primaryPollutant: 'PM2.5',
    uncertainty: 4,
    pollutants: [
      { name: 'PM2.5', value: 15.5, unit: 'µg/m³', category: 'Moderate', limit: 15, percentOfLimit: 103 },
      { name: 'PM10', value: 38.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 84 },
      { name: 'NO2', value: 18.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 72 },
      { name: 'O3', value: 34.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 34 },
      { name: 'SO2', value: 6.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 15 },
      { name: 'CO', value: 0.6, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 15 }
    ],
    weather: {
      tempC: 28,
      humidity: 68,
      windSpeedKmh: 15.0,
      windDirectionDeg: 230,
      pressureHpa: 1015,
      boundaryLayerHeightM: 950,
      visibilityKm: 9.5
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Textile Industry Foundries', percentage: 45, color: '#ef4444' },
      { source: 'Urban Traffic', percentage: 35, color: '#f59e0b' },
      { source: 'Western Ghats Wind Dispersion', percentage: 20, color: '#10b981' }
    ]
  },

  // --- EAST & CENTRAL INDIA ---
  {
    cityId: 'kolkata',
    cityName: 'Kolkata District',
    country: 'India (West Bengal)',
    lat: 22.5726,
    lng: 88.3639,
    aqi: 188,
    aqiCategory: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 8,
    pollutants: [
      { name: 'PM2.5', value: 102.0, unit: 'µg/m³', category: 'Unhealthy', limit: 15, percentOfLimit: 680 },
      { name: 'PM10', value: 172.0, unit: 'µg/m³', category: 'Unhealthy', limit: 45, percentOfLimit: 382 },
      { name: 'NO2', value: 52.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 25, percentOfLimit: 208 },
      { name: 'O3', value: 45.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 45 },
      { name: 'SO2', value: 20.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 50 },
      { name: 'CO', value: 2.1, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 52 }
    ],
    weather: {
      tempC: 32,
      humidity: 78,
      windSpeedKmh: 10.2,
      windDirectionDeg: 180,
      pressureHpa: 1008,
      boundaryLayerHeightM: 520,
      visibilityKm: 4.8
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Legacy Auto-Rickshaws & Commercial Diesel', percentage: 45, color: '#f59e0b' },
      { source: 'Thermal Power & Industrial Belt', percentage: 35, color: '#ef4444' },
      { source: 'Biomass & Refuse Combustion', percentage: 20, color: '#8b5cf6' }
    ]
  },
  {
    cityId: 'patna',
    cityName: 'Patna District',
    country: 'India (Bihar)',
    lat: 25.5941,
    lng: 85.1376,
    aqi: 290,
    aqiCategory: 'Very Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 10,
    pollutants: [
      { name: 'PM2.5', value: 190.0, unit: 'µg/m³', category: 'Very Unhealthy', limit: 15, percentOfLimit: 1266 },
      { name: 'PM10', value: 298.0, unit: 'µg/m³', category: 'Unhealthy', limit: 45, percentOfLimit: 662 },
      { name: 'NO2', value: 65.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 260 },
      { name: 'O3', value: 40.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 40 },
      { name: 'SO2', value: 26.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 65 },
      { name: 'CO', value: 2.6, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 65 }
    ],
    weather: {
      tempC: 33,
      humidity: 70,
      windSpeedKmh: 8.0,
      windDirectionDeg: 280,
      pressureHpa: 1006,
      boundaryLayerHeightM: 400,
      visibilityKm: 3.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Alluvial Ganges Dust & Sand Silt', percentage: 38, color: '#64748b' },
      { source: 'Brick Kilns & Unorganized Industry', percentage: 34, color: '#ef4444' },
      { source: 'Vehicular Emissions', percentage: 28, color: '#f59e0b' }
    ]
  },
  {
    cityId: 'bhubaneswar',
    cityName: 'Khurda District (Bhubaneswar)',
    country: 'India (Odisha)',
    lat: 20.2961,
    lng: 85.8245,
    aqi: 118,
    aqiCategory: 'Unhealthy for Sensitive Groups',
    primaryPollutant: 'PM2.5',
    uncertainty: 6,
    pollutants: [
      { name: 'PM2.5', value: 42.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 15, percentOfLimit: 280 },
      { name: 'PM10', value: 89.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 197 },
      { name: 'NO2', value: 28.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 112 },
      { name: 'O3', value: 36.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 36 },
      { name: 'SO2', value: 15.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 37 },
      { name: 'CO', value: 1.0, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 25 }
    ],
    weather: {
      tempC: 32,
      humidity: 74,
      windSpeedKmh: 13.0,
      windDirectionDeg: 160,
      pressureHpa: 1010,
      boundaryLayerHeightM: 750,
      visibilityKm: 7.5
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Mining & Metallurgical Belt Drift', percentage: 45, color: '#ef4444' },
      { source: 'Urban Infrastructure Transit', percentage: 35, color: '#f59e0b' },
      { source: 'Dust Resuspension', percentage: 20, color: '#64748b' }
    ]
  },
  {
    cityId: 'bhopal',
    cityName: 'Bhopal District',
    country: 'India (Madhya Pradesh)',
    lat: 23.2599,
    lng: 77.4126,
    aqi: 158,
    aqiCategory: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 7,
    pollutants: [
      { name: 'PM2.5', value: 78.0, unit: 'µg/m³', category: 'Unhealthy', limit: 15, percentOfLimit: 520 },
      { name: 'PM10', value: 135.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 45, percentOfLimit: 300 },
      { name: 'NO2', value: 40.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 160 },
      { name: 'O3', value: 48.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 48 },
      { name: 'SO2', value: 18.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 45 },
      { name: 'CO', value: 1.5, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 37 }
    ],
    weather: {
      tempC: 32,
      humidity: 60,
      windSpeedKmh: 12.0,
      windDirectionDeg: 270,
      pressureHpa: 1010,
      boundaryLayerHeightM: 680,
      visibilityKm: 6.2
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Industrial Manufacturing Estates', percentage: 42, color: '#ef4444' },
      { source: 'Urban Transit Grid', percentage: 38, color: '#f59e0b' },
      { source: 'Biomass Burning', percentage: 20, color: '#8b5cf6' }
    ]
  },
  {
    cityId: 'indore',
    cityName: 'Indore District',
    country: 'India (Madhya Pradesh)',
    lat: 22.7196,
    lng: 75.8577,
    aqi: 122,
    aqiCategory: 'Unhealthy for Sensitive Groups',
    primaryPollutant: 'PM2.5',
    uncertainty: 6,
    pollutants: [
      { name: 'PM2.5', value: 44.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 15, percentOfLimit: 293 },
      { name: 'PM10', value: 95.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 211 },
      { name: 'NO2', value: 34.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 136 },
      { name: 'O3', value: 46.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 46 },
      { name: 'SO2', value: 14.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 35 },
      { name: 'CO', value: 1.2, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 30 }
    ],
    weather: {
      tempC: 31,
      humidity: 58,
      windSpeedKmh: 14.0,
      windDirectionDeg: 260,
      pressureHpa: 1011,
      boundaryLayerHeightM: 720,
      visibilityKm: 7.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Commercial Freight Transit', percentage: 50, color: '#f59e0b' },
      { source: 'Industrial Clusters', percentage: 30, color: '#ef4444' },
      { source: 'Dust Control Systems', percentage: 20, color: '#64748b' }
    ]
  },
  {
    cityId: 'raipur',
    cityName: 'Raipur District',
    country: 'India (Chhattisgarh)',
    lat: 21.2514,
    lng: 81.6296,
    aqi: 172,
    aqiCategory: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 8,
    pollutants: [
      { name: 'PM2.5', value: 90.0, unit: 'µg/m³', category: 'Unhealthy', limit: 15, percentOfLimit: 600 },
      { name: 'PM10', value: 150.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 45, percentOfLimit: 333 },
      { name: 'NO2', value: 42.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 168 },
      { name: 'O3', value: 40.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 40 },
      { name: 'SO2', value: 32.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 80 },
      { name: 'CO', value: 1.7, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 42 }
    ],
    weather: {
      tempC: 33,
      humidity: 65,
      windSpeedKmh: 11.0,
      windDirectionDeg: 280,
      pressureHpa: 1009,
      boundaryLayerHeightM: 600,
      visibilityKm: 5.5
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Sponge Iron & Steel Mills', percentage: 52, color: '#ef4444' },
      { source: 'Heavy Ore Transportation', percentage: 30, color: '#f59e0b' },
      { source: 'Thermal Power', percentage: 18, color: '#8b5cf6' }
    ]
  },
  {
    cityId: 'ranchi',
    cityName: 'Ranchi District',
    country: 'India (Jharkhand)',
    lat: 23.3441,
    lng: 85.3096,
    aqi: 185,
    aqiCategory: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 8,
    pollutants: [
      { name: 'PM2.5', value: 98.0, unit: 'µg/m³', category: 'Unhealthy', limit: 15, percentOfLimit: 653 },
      { name: 'PM10', value: 168.0, unit: 'µg/m³', category: 'Unhealthy', limit: 45, percentOfLimit: 373 },
      { name: 'NO2', value: 45.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 180 },
      { name: 'O3', value: 38.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 38 },
      { name: 'SO2', value: 28.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 70 },
      { name: 'CO', value: 1.8, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 45 }
    ],
    weather: {
      tempC: 30,
      humidity: 68,
      windSpeedKmh: 12.0,
      windDirectionDeg: 270,
      pressureHpa: 1010,
      boundaryLayerHeightM: 620,
      visibilityKm: 5.2
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Coal Mining & Processing Plants', percentage: 50, color: '#ef4444' },
      { source: 'Heavy Truck Corridors', percentage: 32, color: '#f59e0b' },
      { source: 'Domestic Combustion', percentage: 18, color: '#8b5cf6' }
    ]
  },

  // --- NORTH-EAST INDIA ---
  {
    cityId: 'guwahati',
    cityName: 'Kamrup Metropolitan District (Guwahati)',
    country: 'India (Assam)',
    lat: 26.1445,
    lng: 91.7362,
    aqi: 135,
    aqiCategory: 'Unhealthy for Sensitive Groups',
    primaryPollutant: 'PM2.5',
    uncertainty: 6,
    pollutants: [
      { name: 'PM2.5', value: 49.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 15, percentOfLimit: 326 },
      { name: 'PM10', value: 105.0, unit: 'µg/m³', category: 'Moderate', limit: 45, percentOfLimit: 233 },
      { name: 'NO2', value: 30.0, unit: 'µg/m³', category: 'Moderate', limit: 25, percentOfLimit: 120 },
      { name: 'O3', value: 35.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 35 },
      { name: 'SO2', value: 14.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 35 },
      { name: 'CO', value: 1.2, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 30 }
    ],
    weather: {
      tempC: 31,
      humidity: 80,
      windSpeedKmh: 7.5,
      windDirectionDeg: 110,
      pressureHpa: 1010,
      boundaryLayerHeightM: 580,
      visibilityKm: 6.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Brahmaputra Valley Thermal Inversion', percentage: 40, color: '#64748b' },
      { source: 'Urban Commercial Transport', percentage: 38, color: '#f59e0b' },
      { source: 'Refinery & Brick Kilns', percentage: 22, color: '#ef4444' }
    ]
  },
  {
    cityId: 'shillong',
    cityName: 'East Khasi Hills District (Shillong)',
    country: 'India (Meghalaya)',
    lat: 25.5788,
    lng: 91.8933,
    aqi: 28,
    aqiCategory: 'Good',
    primaryPollutant: 'O3',
    uncertainty: 2,
    pollutants: [
      { name: 'PM2.5', value: 4.8, unit: 'µg/m³', category: 'Good', limit: 15, percentOfLimit: 32 },
      { name: 'PM10', value: 12.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 26 },
      { name: 'NO2', value: 8.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 32 },
      { name: 'O3', value: 26.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 26 },
      { name: 'SO2', value: 2.5, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 6 },
      { name: 'CO', value: 0.3, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 8 }
    ],
    weather: {
      tempC: 22,
      humidity: 85,
      windSpeedKmh: 10.0,
      windDirectionDeg: 180,
      pressureHpa: 1020,
      boundaryLayerHeightM: 1150,
      visibilityKm: 12.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Pristine Pine Canopy Canopy', percentage: 70, color: '#10b981' },
      { source: 'Local Transport', percentage: 30, color: '#f59e0b' }
    ]
  },
  {
    cityId: 'imphal',
    cityName: 'Imphal West District',
    country: 'India (Manipur)',
    lat: 24.8170,
    lng: 93.9368,
    aqi: 45,
    aqiCategory: 'Good',
    primaryPollutant: 'O3',
    uncertainty: 3,
    pollutants: [
      { name: 'PM2.5', value: 10.2, unit: 'µg/m³', category: 'Good', limit: 15, percentOfLimit: 68 },
      { name: 'PM10', value: 22.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 48 },
      { name: 'NO2', value: 12.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 48 },
      { name: 'O3', value: 30.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 30 },
      { name: 'SO2', value: 3.5, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 8 },
      { name: 'CO', value: 0.5, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 12 }
    ],
    weather: {
      tempC: 26,
      humidity: 78,
      windSpeedKmh: 8.5,
      windDirectionDeg: 150,
      pressureHpa: 1016,
      boundaryLayerHeightM: 900,
      visibilityKm: 10.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Valley Vegetation', percentage: 60, color: '#10b981' },
      { source: 'Township Traffic', percentage: 40, color: '#f59e0b' }
    ]
  },
  {
    cityId: 'agartala',
    cityName: 'West Tripura District (Agartala)',
    country: 'India (Tripura)',
    lat: 23.8315,
    lng: 91.2868,
    aqi: 55,
    aqiCategory: 'Moderate',
    primaryPollutant: 'PM2.5',
    uncertainty: 4,
    pollutants: [
      { name: 'PM2.5', value: 14.2, unit: 'µg/m³', category: 'Moderate', limit: 15, percentOfLimit: 94 },
      { name: 'PM10', value: 32.0, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 71 },
      { name: 'NO2', value: 16.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 64 },
      { name: 'O3', value: 32.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 32 },
      { name: 'SO2', value: 4.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 10 },
      { name: 'CO', value: 0.6, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 15 }
    ],
    weather: {
      tempC: 29,
      humidity: 82,
      windSpeedKmh: 9.0,
      windDirectionDeg: 140,
      pressureHpa: 1014,
      boundaryLayerHeightM: 850,
      visibilityKm: 9.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Urban Transit', percentage: 55, color: '#f59e0b' },
      { source: 'Cross-Border Agricultural Smoke', percentage: 45, color: '#8b5cf6' }
    ]
  },

  // --- INTERNATIONAL METROS ---
  {
    cityId: 'new_york',
    cityName: 'New York City',
    country: 'USA',
    lat: 40.7128,
    lng: -74.0060,
    aqi: 48,
    aqiCategory: 'Good',
    primaryPollutant: 'O3',
    uncertainty: 3,
    pollutants: [
      { name: 'PM2.5', value: 8.5, unit: 'µg/m³', category: 'Good', limit: 15, percentOfLimit: 56 },
      { name: 'PM10', value: 18.2, unit: 'µg/m³', category: 'Good', limit: 45, percentOfLimit: 40 },
      { name: 'NO2', value: 21.0, unit: 'µg/m³', category: 'Good', limit: 25, percentOfLimit: 84 },
      { name: 'O3', value: 45.0, unit: 'µg/m³', category: 'Good', limit: 100, percentOfLimit: 45 },
      { name: 'SO2', value: 4.1, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 10 },
      { name: 'CO', value: 0.6, unit: 'mg/m³', category: 'Good', limit: 4, percentOfLimit: 15 }
    ],
    weather: {
      tempC: 24,
      humidity: 55,
      windSpeedKmh: 14.0,
      windDirectionDeg: 180,
      pressureHpa: 1016,
      boundaryLayerHeightM: 1100,
      visibilityKm: 10.0
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Urban Traffic & Transit', percentage: 55, color: '#f59e0b' },
      { source: 'Commercial HVAC & Building Heat', percentage: 25, color: '#10b981' },
      { source: 'Regional Secondary Ozone', percentage: 20, color: '#3b82f6' }
    ]
  },
  {
    cityId: 'beijing',
    cityName: 'Beijing Capital',
    country: 'China',
    lat: 39.9042,
    lng: 116.4074,
    aqi: 168,
    aqiCategory: 'Unhealthy',
    primaryPollutant: 'PM2.5',
    uncertainty: 8,
    pollutants: [
      { name: 'PM2.5', value: 88.0, unit: 'µg/m³', category: 'Unhealthy', limit: 15, percentOfLimit: 586 },
      { name: 'PM10', value: 140.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 45, percentOfLimit: 311 },
      { name: 'NO2', value: 55.0, unit: 'µg/m³', category: 'Unhealthy for Sensitive Groups', limit: 25, percentOfLimit: 220 },
      { name: 'O3', value: 68.0, unit: 'µg/m³', category: 'Moderate', limit: 100, percentOfLimit: 68 },
      { name: 'SO2', value: 12.0, unit: 'µg/m³', category: 'Good', limit: 40, percentOfLimit: 30 },
      { name: 'CO', value: 1.8, unit: 'mg/m³', category: 'Moderate', limit: 4, percentOfLimit: 45 }
    ],
    weather: {
      tempC: 28,
      humidity: 58,
      windSpeedKmh: 8.0,
      windDirectionDeg: 90,
      pressureHpa: 1010,
      boundaryLayerHeightM: 520,
      visibilityKm: 4.8
    },
    lastUpdated: '2026-08-11T02:30:00Z',
    sourceAttribution: [
      { source: 'Industrial Smelting & Coal Power', percentage: 42, color: '#ef4444' },
      { source: 'Vehicular Ring Road Traffic', percentage: 32, color: '#f59e0b' },
      { source: 'Dust Incursion from North', percentage: 26, color: '#84cc16' }
    ]
  }
];

export const MOCK_72H_FORECAST: ForecastPoint[] = [
  { time: '00:00 (Now)', aqi: 284, upperBound: 295, lowerBound: 273, pm25: 182, pm10: 295, no2: 78, o3: 52, confidenceScore: 96, windSpeed: 11, windDirection: 310 },
  { time: '03:00', aqi: 298, upperBound: 312, lowerBound: 284, pm25: 195, pm10: 310, no2: 82, o3: 40, confidenceScore: 94, windSpeed: 9, windDirection: 315 },
  { time: '06:00', aqi: 322, upperBound: 340, lowerBound: 304, pm25: 215, pm10: 345, no2: 95, o3: 35, confidenceScore: 92, windSpeed: 6, windDirection: 320 },
  { time: '09:00', aqi: 310, upperBound: 325, lowerBound: 295, pm25: 202, pm10: 325, no2: 88, o3: 65, confidenceScore: 91, windSpeed: 10, windDirection: 300 },
  { time: '12:00', aqi: 265, upperBound: 280, lowerBound: 250, pm25: 168, pm10: 270, no2: 62, o3: 98, confidenceScore: 90, windSpeed: 15, windDirection: 280 },
  { time: '15:00', aqi: 230, upperBound: 248, lowerBound: 212, pm25: 142, pm10: 235, no2: 50, o3: 110, confidenceScore: 88, windSpeed: 18, windDirection: 270 },
  { time: '18:00', aqi: 255, upperBound: 275, lowerBound: 235, pm25: 160, pm10: 260, no2: 72, o3: 75, confidenceScore: 87, windSpeed: 12, windDirection: 290 },
  { time: '21:00', aqi: 278, upperBound: 298, lowerBound: 258, pm25: 178, pm10: 285, no2: 81, o3: 48, confidenceScore: 85, windSpeed: 8, windDirection: 305 },
  { time: '+24h', aqi: 245, upperBound: 268, lowerBound: 222, pm25: 152, pm10: 250, no2: 68, o3: 60, confidenceScore: 84, windSpeed: 14, windDirection: 285 },
  { time: '+36h', aqi: 210, upperBound: 235, lowerBound: 185, pm25: 128, pm10: 215, no2: 52, o3: 72, confidenceScore: 80, windSpeed: 17, windDirection: 260 },
  { time: '+48h', aqi: 185, upperBound: 215, lowerBound: 155, pm25: 108, pm10: 188, no2: 44, o3: 80, confidenceScore: 78, windSpeed: 20, windDirection: 250 },
  { time: '+72h', aqi: 160, upperBound: 195, lowerBound: 125, pm25: 88, pm10: 160, no2: 38, o3: 85, confidenceScore: 72, windSpeed: 22, windDirection: 240 }
];

export const GNN_NODES_DELHI: GNNNode[] = [
  { id: 'gnn_1', name: 'Connaught Place Monitoring Hub', lat: 28.6315, lng: 77.2167, aqi: 242, type: 'monitoring_station', status: 'active', connectedNodeIds: ['gnn_2', 'gnn_3', 'gnn_5'], vectorDriftSpeed: 12, vectorDirectionDeg: 310 },
  { id: 'gnn_2', name: 'Anand Vihar Transport Depot', lat: 28.6469, lng: 77.3160, aqi: 365, type: 'traffic_corridor', status: 'active', connectedNodeIds: ['gnn_1', 'gnn_4'], vectorDriftSpeed: 14, vectorDirectionDeg: 305 },
  { id: 'gnn_3', name: 'Okhla Industrial Cluster', lat: 28.5308, lng: 77.2711, aqi: 310, type: 'industrial_zone', status: 'active', connectedNodeIds: ['gnn_1', 'gnn_6'], vectorDriftSpeed: 10, vectorDirectionDeg: 320 },
  { id: 'gnn_4', name: 'Gaziabad Border Zone', lat: 28.6692, lng: 77.4538, aqi: 380, type: 'industrial_zone', status: 'active', connectedNodeIds: ['gnn_2'], vectorDriftSpeed: 15, vectorDirectionDeg: 300 },
  { id: 'gnn_5', name: 'IIT Delhi Eco Sensor Node', lat: 28.5450, lng: 77.1926, aqi: 195, type: 'residential_grid', status: 'active', connectedNodeIds: ['gnn_1', 'gnn_6'], vectorDriftSpeed: 8, vectorDirectionDeg: 315 },
  { id: 'gnn_6', name: 'Gurugram Cyber Hub Node', lat: 28.4595, lng: 77.0266, aqi: 215, type: 'traffic_corridor', status: 'active', connectedNodeIds: ['gnn_3', 'gnn_5'], vectorDriftSpeed: 11, vectorDirectionDeg: 310 }
];

export const CLEAN_PATH_ROUTES: CleanPathRoute[] = [
  {
    id: 'route_delhi_1',
    title: 'Connaught Place to Lodhi Gardens Park Corridor',
    mode: 'walking',
    originName: 'Connaught Place Outer Circle',
    destinationName: 'Lodhi Garden Gate 2',
    totalDistanceKm: 4.2,
    durationMins: 48,
    avgAQI: 165,
    peakAQI: 205,
    exposureReductionPercent: 41,
    isOfflineCached: true,
    waypoints: [
      { lat: 28.6315, lng: 77.2167, name: 'Connaught Place', aqi: 242, distanceFromStartKm: 0 },
      { lat: 28.6180, lng: 77.2185, name: 'Rajpath Green Canopy Path', aqi: 155, distanceFromStartKm: 1.8 },
      { lat: 28.5930, lng: 77.2197, name: 'Lodhi Colony Tree Belt', aqi: 140, distanceFromStartKm: 3.5 },
      { lat: 28.5880, lng: 77.2205, name: 'Lodhi Gardens Entry', aqi: 130, distanceFromStartKm: 4.2 }
    ],
    pathCoordinates: [
      [28.6315, 77.2167],
      [28.6250, 77.2170],
      [28.6180, 77.2185],
      [28.6050, 77.2190],
      [28.5930, 77.2197],
      [28.5880, 77.2205]
    ],
    standardPathCoordinates: [
      [28.6315, 77.2167],
      [28.6280, 77.2240], // Arterial High Traffic Road
      [28.6120, 77.2280],
      [28.5980, 77.2260],
      [28.5880, 77.2205]
    ]
  },
  {
    id: 'route_delhi_2',
    title: 'IIT Campus to Hauz Khas Cycling Bypass',
    mode: 'cycling',
    originName: 'IIT Gate 1',
    destinationName: 'Hauz Khas Village Metro',
    totalDistanceKm: 3.1,
    durationMins: 14,
    avgAQI: 148,
    peakAQI: 178,
    exposureReductionPercent: 36,
    isOfflineCached: false,
    waypoints: [
      { lat: 28.5450, lng: 77.1926, name: 'IIT Campus Gate', aqi: 195, distanceFromStartKm: 0 },
      { lat: 28.5490, lng: 77.1980, name: 'SDA Residential Buffer Lane', aqi: 142, distanceFromStartKm: 1.2 },
      { lat: 28.5535, lng: 77.2040, name: 'Deer Park Pedestrian Pathway', aqi: 125, distanceFromStartKm: 2.4 },
      { lat: 28.5550, lng: 77.2060, name: 'Hauz Khas Metro Station', aqi: 152, distanceFromStartKm: 3.1 }
    ],
    pathCoordinates: [
      [28.5450, 77.1926],
      [28.5490, 77.1980],
      [28.5535, 77.2040],
      [28.5550, 77.2060]
    ],
    standardPathCoordinates: [
      [28.5450, 77.1926],
      [28.5470, 77.2010],
      [28.5550, 77.2060]
    ]
  }
];

export const INITIAL_POLICY_LEVERS: PolicyIntervention[] = [
  { id: 'pol_1', name: 'Heavy Commercial Vehicle & Diesel Entry Ban', category: 'traffic', sliderValue: 80, unit: '% vehicle restriction', description: 'Restricts non-essential medium & heavy diesel freight trucks from entering urban perimeter during peak smog hours.' },
  { id: 'pol_2', name: 'Industrial Stack Emission Cap & Scrubbing', category: 'industry', sliderValue: 50, unit: '% emission cut', description: 'Mandates strict continuous particulate scrubbing systems for thermal power plants and metal furnaces within 50km.' },
  { id: 'pol_3', name: 'Crop Residue In-Situ Management Incentive', category: 'agriculture', sliderValue: 65, unit: '% biomass converted', description: 'Subsidizes Happy Seeder machinery and bio-decomposer sprays to eliminate seasonal agricultural stubble burning.' },
  { id: 'pol_4', name: 'Construction Dust Mist Cannon Mandate', category: 'urban_green', sliderValue: 75, unit: '% sites compliant', description: 'Enforces anti-smog mist guns, green fabric wraps, and wind-break barriers at all commercial development sites.' },
  { id: 'pol_5', name: 'EV Public Fleet & Low Emission Zone (LEZ)', category: 'traffic', sliderValue: 40, unit: '% EV penetration', description: 'Establishes zero-emission pedestrian zones in dense city centers with electric bus feeder loops.' }
];

export const INITIAL_OFFLINE_REGIONS: OfflineMapRegion[] = [
  {
    id: 'off_delhi_core',
    name: 'Delhi-NCR Central Urban Grid',
    center: [28.6139, 77.2090],
    zoomRange: [10, 16],
    estimatedSizeMB: 28.4,
    tileCount: 1420,
    isDownloaded: true,
    downloadDate: '2026-08-11 01:04',
    expiresDate: '2026-09-11'
  },
  {
    id: 'off_mumbai_metro',
    name: 'Mumbai Coastal & Port District',
    center: [19.0760, 72.8777],
    zoomRange: [11, 15],
    estimatedSizeMB: 18.2,
    tileCount: 980,
    isDownloaded: true,
    downloadDate: '2026-08-08 12:30',
    expiresDate: '2026-09-08'
  },
  {
    id: 'off_nyc_tristate',
    name: 'New York Tri-State Area',
    center: [40.7128, -74.0060],
    zoomRange: [10, 15],
    estimatedSizeMB: 32.1,
    tileCount: 1650,
    isDownloaded: false
  },
  {
    id: 'off_beijing_capital',
    name: 'Beijing Municipal Corridor',
    center: [39.9042, 116.4074],
    zoomRange: [10, 15],
    estimatedSizeMB: 24.6,
    tileCount: 1210,
    isDownloaded: false
  }
];
