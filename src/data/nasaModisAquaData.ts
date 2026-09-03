/**
 * NASA MODIS Aqua Satellite Telemetry & Google Earth Engine Asset Specifications
 * Sources:
 * - https://developers.google.com/earth-engine/datasets/tags/aqua
 * - https://ladsweb.modaps.eosdis.nasa.gov/missions-and-measurements/products/MYD13A2
 * - MODIS MYD04_L2 (Aerosol Optical Depth), MYD13A2 (Vegetation Indices NDVI/EVI), MYD14A1 (Thermal Anomalies/Fires)
 */

export interface ModisProductMetadata {
  productId: string;
  name: string;
  platform: 'Aqua' | 'Terra' | 'Combined';
  instrument: 'MODIS (Moderate Resolution Imaging Spectroradiometer)';
  spatialResolution: string;
  temporalResolution: string;
  geeAssetId: string;
  bands: Array<{
    name: string;
    description: string;
    units: string;
    scaleFactor: number;
    validRange: [number, number];
  }>;
  atmosphericRole: string;
}

export const NASA_MODIS_AQUA_PRODUCTS: Record<string, ModisProductMetadata> = {
  MYD04_L2: {
    productId: 'MYD04_L2',
    name: 'MODIS/Aqua Aerosol 5-Min L2 Swath 10km & 3km (AOD)',
    platform: 'Aqua',
    instrument: 'MODIS (Moderate Resolution Imaging Spectroradiometer)',
    spatialResolution: '10 km (Dark Target/Deep Blue) / 3 km (Coastal/Urban)',
    temporalResolution: 'Daily swath (Equatorial overpass ~13:30 local solar time)',
    geeAssetId: 'MODIS/061/MYD04_L2',
    bands: [
      {
        name: 'Optical_Depth_Land_And_Ocean',
        description: 'Aerosol Optical Thickness at 0.55 µm (AOD 550nm) from Dark Target algorithm',
        units: 'dimensionless',
        scaleFactor: 0.001,
        validRange: [-100, 5000]
      },
      {
        name: 'Deep_Blue_Aerosol_Optical_Depth_550_Land',
        description: 'AOD at 550nm over bright arid surfaces from Deep Blue algorithm',
        units: 'dimensionless',
        scaleFactor: 0.001,
        validRange: [0, 5000]
      },
      {
        name: 'Angstrom_Exponent_Land',
        description: 'Angstrom Exponent (470/660 nm) representing aerosol particle size distribution',
        units: 'dimensionless',
        scaleFactor: 0.001,
        validRange: [-1000, 5000]
      },
      {
        name: 'Aerosol_Type_Land',
        description: 'Classified aerosol model: 1=Dust, 2=Generic/Continental, 3=Urban/Industrial, 4=Smoke',
        units: 'classification_flag',
        scaleFactor: 1.0,
        validRange: [1, 4]
      }
    ],
    atmosphericRole: 'Direct satellite inversion of columnar atmospheric particulate loading used in PINN and GNN surface PM2.5 mapping.'
  },

  MYD13A2: {
    productId: 'MYD13A2',
    name: 'MODIS/Aqua Vegetation Indices 16-Day L3 Global 1km SIN Grid',
    platform: 'Aqua',
    instrument: 'MODIS (Moderate Resolution Imaging Spectroradiometer)',
    spatialResolution: '1000 meters (1 km)',
    temporalResolution: '16-Day composite',
    geeAssetId: 'MODIS/061/MYD13A2',
    bands: [
      {
        name: '_1_km_16_days_NDVI',
        description: 'Normalized Difference Vegetation Index (NDVI) measuring photosynthetic canopy density',
        units: 'NDVI',
        scaleFactor: 0.0001,
        validRange: [-2000, 10000]
      },
      {
        name: '_1_km_16_days_EVI',
        description: 'Enhanced Vegetation Index (EVI) with atmospheric aerosol resistance and canopy background decoupling',
        units: 'EVI',
        scaleFactor: 0.0001,
        validRange: [-2000, 10000]
      },
      {
        name: '_1_km_16_days_VI_Quality',
        description: 'VI Quality flags for cloud contamination, shadow masking, and aerosol quality assessment',
        units: 'bitmask',
        scaleFactor: 1.0,
        validRange: [0, 65535]
      }
    ],
    atmosphericRole: 'Used by AuraPredict clean-air routing engine to calculate green-canopy particulate filtration coefficient and dry deposition velocity (V_d).'
  },

  MYD14A1: {
    productId: 'MYD14A1',
    name: 'MODIS/Aqua Thermal Anomalies and Fire Daily L3 Global 1km',
    platform: 'Aqua',
    instrument: 'MODIS (Moderate Resolution Imaging Spectroradiometer)',
    spatialResolution: '1000 meters (1 km)',
    temporalResolution: 'Daily',
    geeAssetId: 'MODIS/061/MYD14A1',
    bands: [
      {
        name: 'FireMask',
        description: 'Pixel fire detection confidence: 7=low confidence, 8=nominal confidence, 9=high confidence fire',
        units: 'class',
        scaleFactor: 1.0,
        validRange: [0, 9]
      },
      {
        name: 'MaxFRP',
        description: 'Maximum Fire Radiative Power representing combustion intensity rate',
        units: 'MW (Megawatts)',
        scaleFactor: 0.1,
        validRange: [0, 10000]
      }
    ],
    atmosphericRole: 'Point-source thermal emission telemetry for agricultural stubble burning and wildfire plume dispersion simulations.'
  }
};

export interface RegionalAODSample {
  regionName: string;
  coordinates: { lat: number; lng: number };
  aod550: number;
  angstromExponent: number;
  ndviCanopyCover: number;
  activeFireCount: number;
  totalFrpMw: number;
  inferredPm25SurfaceUgM3: number;
  lastOverpassUtc: string;
}

export const MODIS_AQUA_TELEMETRY_FEED: RegionalAODSample[] = [
  {
    regionName: 'Indo-Gangetic Plain (North India Stubble Corridor)',
    coordinates: { lat: 29.5000, lng: 76.5000 },
    aod550: 1.28,
    angstromExponent: 1.54,
    ndviCanopyCover: 0.42,
    activeFireCount: 342,
    totalFrpMw: 4890.5,
    inferredPm25SurfaceUgM3: 265.4,
    lastOverpassUtc: '2026-09-03T07:45:00Z'
  },
  {
    regionName: 'Deccan Plateau (Central Urban / Forest)',
    coordinates: { lat: 17.5000, lng: 78.5000 },
    aod550: 0.38,
    angstromExponent: 1.12,
    ndviCanopyCover: 0.68,
    activeFireCount: 4,
    totalFrpMw: 24.0,
    inferredPm25SurfaceUgM3: 48.2,
    lastOverpassUtc: '2026-09-03T08:15:00Z'
  },
  {
    regionName: 'Western Ghats Bio-Canopy Corridor',
    coordinates: { lat: 13.0000, lng: 75.5000 },
    aod550: 0.18,
    angstromExponent: 0.88,
    ndviCanopyCover: 0.89,
    activeFireCount: 0,
    totalFrpMw: 0.0,
    inferredPm25SurfaceUgM3: 19.5,
    lastOverpassUtc: '2026-09-03T08:20:00Z'
  },
  {
    regionName: 'Thar Desert Arid Dust Zone',
    coordinates: { lat: 26.9000, lng: 71.0000 },
    aod550: 0.74, // High coarse dust optical depth
    angstromExponent: 0.32, // Low Angstrom exponent indicates coarse mineral particles
    ndviCanopyCover: 0.08,
    activeFireCount: 1,
    totalFrpMw: 8.0,
    inferredPm25SurfaceUgM3: 92.0,
    lastOverpassUtc: '2026-09-03T07:55:00Z'
  }
];
