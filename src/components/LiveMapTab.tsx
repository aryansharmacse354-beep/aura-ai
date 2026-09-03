import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  Wind, 
  Radio, 
  MapPin, 
  HardDriveDownload, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Search,
  Eye,
  Crosshair,
  Sliders,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Satellite,
  Mountain,
  Flame,
  Globe,
  Map as MapIcon,
  Maximize2,
  Minimize2,
  Columns,
  Square,
  Tv,
  Monitor,
  LayoutGrid,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  Plus,
  Minus,
  Compass,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  Save,
  RotateCcw
} from 'lucide-react';
import { AQIMeasurement, GNNNode, GPSPosition, OfflineMapRegion } from '../types';
import { GNN_NODES_DELHI, CITIES_AQI_DATA } from '../data/mockData';
import { offlineStorage } from '../services/offlineStorageService';
import { PollutantBadgeTooltip } from './PollutantBadgeTooltip';

// Helper coordinate validator
export const isValidCoord = (lat: any, lng: any): boolean => {
  return (
    typeof lat === 'number' &&
    typeof lng === 'number' &&
    !isNaN(lat) &&
    !isNaN(lng) &&
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
};

// LocalStorage Persistence Schema
const MAP_VIEW_STORAGE_KEY = 'aurapredict_last_map_view';

export interface SavedMapView {
  lat: number;
  lng: number;
  zoom: number;
  cityId: string;
  savedAt: string;
}

export const getSavedMapView = (): SavedMapView | null => {
  try {
    const raw = localStorage.getItem(MAP_VIEW_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (isValidCoord(parsed.lat, parsed.lng) && typeof parsed.zoom === 'number' && parsed.zoom >= 2 && parsed.zoom <= 19) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Failed to read persisted map view from localStorage', e);
  }
  return null;
};

export const saveMapView = (lat: number, lng: number, zoom: number, cityId: string) => {
  if (!isValidCoord(lat, lng)) return;
  try {
    const data: SavedMapView = {
      lat: Number(lat.toFixed(5)),
      lng: Number(lng.toFixed(5)),
      zoom: Math.round(zoom),
      cityId,
      savedAt: new Date().toISOString()
    };
    localStorage.setItem(MAP_VIEW_STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save map view to localStorage', e);
  }
};

interface LiveMapTabProps {
  currentCityData: AQIMeasurement;
  gpsPos: GPSPosition | null;
  onDownloadOfflineRegion: (regionName: string, lat: number, lng: number) => void;
  isOffline: boolean;
  onSelectCity?: (cityId: string) => void;
}

// Base Map View Modes
export type MapViewMode = 'satellite' | 'terrain' | 'heatmap';

export interface ViewModeConfig {
  id: MapViewMode;
  label: string;
  shortLabel: string;
  icon: any;
  tileUrl: string;
  attribution: string;
  maxZoom: number;
  subdomains?: string;
  badge: string;
  desc: string;
}

export const MAP_VIEW_MODES: ViewModeConfig[] = [
  {
    id: 'heatmap',
    label: 'Air Quality Heatmap',
    shortLabel: 'AQI Heatmap',
    icon: Flame,
    tileUrl: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19,
    subdomains: 'abcd',
    badge: 'Carto Dark',
    desc: 'High-contrast dark cartographic canvas optimized for particulate and gas dispersion heatmaps'
  },
  {
    id: 'satellite',
    label: 'Satellite',
    shortLabel: 'Satellite',
    icon: Satellite,
    tileUrl: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Maxar, Earthstar Geographics, CNES/Airbus DS',
    maxZoom: 19,
    badge: 'High-Res Optical',
    desc: 'High-resolution true-color orbital imagery to correlate smoke plumes and industrial stacks'
  },
  {
    id: 'terrain',
    label: 'Terrain',
    shortLabel: 'Terrain',
    icon: Mountain,
    tileUrl: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors, SRTM | Map style: &copy; OpenTopoMap',
    maxZoom: 17,
    subdomains: 'abc',
    badge: 'Topographic Contours',
    desc: 'Topographic contour shading to visualize valley stagnation, ridge boundaries, and wind funnels'
  }
];

// Aspect Ratio Configurations
export type MapAspectRatio = 'fill' | '16:9' | '21:9' | '4:3' | '1:1' | 'split';

export interface AspectRatioConfig {
  id: MapAspectRatio;
  label: string;
  shortLabel: string;
  ratioClass: string;
  icon: any;
  desc: string;
  badge: string;
}

export const MAP_ASPECT_RATIOS: AspectRatioConfig[] = [
  {
    id: 'fill',
    label: 'Full Viewport Fill',
    shortLabel: 'Auto Fit',
    ratioClass: 'h-full min-h-[480px]',
    icon: LayoutGrid,
    desc: 'Dynamically scales to fill 100% of available viewport space',
    badge: 'Responsive'
  },
  {
    id: '16:9',
    label: '16:9 Widescreen Command',
    shortLabel: '16:9 Wide',
    ratioClass: 'aspect-[16/9] max-h-[78vh] min-h-[420px]',
    icon: Tv,
    desc: 'Standard widescreen display ratio ideal for multi-monitor setups and presentations',
    badge: 'HD 1080p'
  },
  {
    id: '21:9',
    label: '21:9 Cinematic Basin Pan',
    shortLabel: '21:9 Ultra',
    ratioClass: 'aspect-[21/9] max-h-[70vh] min-h-[380px]',
    icon: Monitor,
    desc: 'Ultrawide pan-basin aspect ratio for continuous cross-regional drift monitoring',
    badge: 'Ultrawide'
  },
  {
    id: '4:3',
    label: '4:3 Dense Tactical GIS',
    shortLabel: '4:3 Tactical',
    ratioClass: 'aspect-[4/3] max-h-[82vh] min-h-[460px]',
    icon: Columns,
    desc: 'Balanced square-box grid for dense station network inspection and telemetry',
    badge: 'Compact'
  },
  {
    id: '1:1',
    label: '1:1 Concentric Plume Radial',
    shortLabel: '1:1 Radial',
    ratioClass: 'aspect-square max-h-[78vh] min-h-[420px] max-w-[78vh] mx-auto',
    icon: Square,
    desc: 'Square geometric canvas tailored for radial dispersion plumes and circular isopleths',
    badge: 'Square'
  },
  {
    id: 'split',
    label: 'Dual Multi-View Split',
    shortLabel: 'Split Dual',
    ratioClass: 'h-full min-h-[480px]',
    icon: Columns,
    desc: 'Side-by-side synchronized view: High-Res Satellite Optical + Carto Dark AQI Heatmap',
    badge: 'Dual Sync'
  }
];

// Pollutant Heatmap Layers Configuration Definition
const POLLUTANT_CONFIGS = [
  { key: 'PM2.5', label: 'PM2.5', fullLabel: 'Fine Particles', unit: 'µg/m³', color: '#ef4444', ringRadius: 3800, opacity: 0.35, desc: 'Combustion & Smoke Plumes' },
  { key: 'PM10', label: 'PM10', fullLabel: 'Coarse Dust', unit: 'µg/m³', color: '#f97316', ringRadius: 6200, opacity: 0.28, dash: '3, 3', desc: 'Construction & Road Dust' },
  { key: 'NO2', label: 'NO2', fullLabel: 'Nitrogen Dioxide', unit: 'µg/m³', color: '#a855f7', ringRadius: 9000, opacity: 0.24, dash: '5, 5', desc: 'Diesel Vehicles & Thermal Plants' },
  { key: 'O3', label: 'O3', fullLabel: 'Ground Ozone', unit: 'µg/m³', color: '#06b6d4', ringRadius: 12000, opacity: 0.20, desc: 'Photochemical Smog' },
  { key: 'SO2', label: 'SO2', fullLabel: 'Sulfur Dioxide', unit: 'µg/m³', color: '#eab308', ringRadius: 15000, opacity: 0.18, desc: 'Industrial Coal Burning' },
  { key: 'CO', label: 'CO', fullLabel: 'Carbon Monoxide', unit: 'mg/m³', color: '#f59e0b', ringRadius: 18000, opacity: 0.15, desc: 'Incomplete Engine Combustion' },
];

export const LiveMapTab: React.FC<LiveMapTabProps> = ({
  currentCityData,
  gpsPos,
  onDownloadOfflineRegion,
  isOffline,
  onSelectCity
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const secondaryMapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const secondaryMapInstanceRef = useRef<L.Map | null>(null);
  const baseTileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Base map view mode: 'satellite' | 'terrain' | 'heatmap'
  const [viewMode, setViewMode] = useState<MapViewMode>('heatmap');

  // Aspect Ratio selection state
  const [aspectRatio, setAspectRatio] = useState<MapAspectRatio>('fill');
  const [isFullscreen, setIsFullscreen] = useState(false);

  const [activeLayers, setActiveLayers] = useState({
    heatmap: true,
    gnnNodes: true,
    satelliteAOD: false,
    cleanCorridors: true
  });

  // Granular interactive pollutant layer toggles state
  const [enabledPollutants, setEnabledPollutants] = useState<Record<string, boolean>>({
    'PM2.5': true,
    'PM10': true,
    'NO2': true,
    'O3': false,
    'SO2': false,
    'CO': false
  });

  const [isLegendExpanded, setIsLegendExpanded] = useState(true);
  const [selectedGNNNode, setSelectedGNNNode] = useState<GNNNode | null>(GNN_NODES_DELHI[0]);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [isDownloadingTilePackage, setIsDownloadingTilePackage] = useState(false);
  const [currentZoomLevel, setCurrentZoomLevel] = useState<number>(12);
  const [savedViewBadge, setSavedViewBadge] = useState<string | null>(null);
  const [isViewPersisted, setIsViewPersisted] = useState<boolean>(false);

  const togglePollutant = (key: string) => {
    setEnabledPollutants((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Invalidate and trigger map resize whenever aspect ratio or fullscreen changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
      if (secondaryMapInstanceRef.current) {
        secondaryMapInstanceRef.current.invalidateSize();
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [aspectRatio, isFullscreen]);

  // Map Lifecycle & Unmount Cleanup
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error removing primary map instance', e);
        }
        mapInstanceRef.current = null;
      }
      if (secondaryMapInstanceRef.current) {
        try {
          secondaryMapInstanceRef.current.remove();
        } catch (e) {
          console.warn('Error removing secondary map instance', e);
        }
        secondaryMapInstanceRef.current = null;
      }
    };
  }, []);

  // Handle Base Tile Layer switching when viewMode changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const modeConfig = MAP_VIEW_MODES.find((m) => m.id === viewMode) || MAP_VIEW_MODES[0];

    if (baseTileLayerRef.current) {
      map.removeLayer(baseTileLayerRef.current);
    }

    const newTileLayer = L.tileLayer(modeConfig.tileUrl, {
      attribution: modeConfig.attribution,
      subdomains: modeConfig.subdomains || 'abc',
      maxZoom: modeConfig.maxZoom
    });

    newTileLayer.addTo(map);
    newTileLayer.bringToBack();
    baseTileLayerRef.current = newTileLayer;

    // When switching specifically to Air Quality Heatmap mode, ensure heatmap layer is enabled
    if (viewMode === 'heatmap') {
      setActiveLayers((prev) => ({ ...prev, heatmap: true }));
    }
  }, [viewMode]);

  // Secondary map initialization for split dual mode
  useEffect(() => {
    if (aspectRatio !== 'split') {
      if (secondaryMapInstanceRef.current) {
        secondaryMapInstanceRef.current.remove();
        secondaryMapInstanceRef.current = null;
      }
      return;
    }

    if (!secondaryMapContainerRef.current) return;

    const cityLat = isValidCoord(currentCityData?.lat, currentCityData?.lng) ? currentCityData.lat : 28.6139;
    const cityLng = isValidCoord(currentCityData?.lat, currentCityData?.lng) ? currentCityData.lng : 77.2090;

    if (!secondaryMapInstanceRef.current) {
      const secMap = L.map(secondaryMapContainerRef.current, {
        center: [cityLat, cityLng],
        zoom: 12,
        zoomControl: false
      });

      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '&copy; Esri World Imagery',
        maxZoom: 19
      }).addTo(secMap);

      secondaryMapInstanceRef.current = secMap;

      // Sync map views
      const primaryMap = mapInstanceRef.current;
      if (primaryMap) {
        primaryMap.on('move', () => {
          if (secondaryMapInstanceRef.current) {
            secondaryMapInstanceRef.current.setView(primaryMap.getCenter(), primaryMap.getZoom(), { animate: false });
          }
        });
        secMap.on('move', () => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView(secMap.getCenter(), secMap.getZoom(), { animate: false });
          }
        });
      }
    } else {
      secondaryMapInstanceRef.current.setView([cityLat, cityLng], 12);
    }
  }, [aspectRatio, currentCityData]);

  // Initialize and update Primary Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const cityLat = isValidCoord(currentCityData?.lat, currentCityData?.lng) ? currentCityData.lat : 28.6139;
    const cityLng = isValidCoord(currentCityData?.lat, currentCityData?.lng) ? currentCityData.lng : 77.2090;

    if (!mapInstanceRef.current) {
      // Check for saved map view in localStorage
      const savedView = getSavedMapView();
      const initialCenter: [number, number] = savedView && isValidCoord(savedView.lat, savedView.lng)
        ? [savedView.lat, savedView.lng]
        : [cityLat, cityLng];
      const initialZoom = savedView && typeof savedView.zoom === 'number' ? savedView.zoom : 12;

      if (savedView) {
        setIsViewPersisted(true);
        setSavedViewBadge(`Restored saved view (${savedView.lat.toFixed(2)}, ${savedView.lng.toFixed(2)} @ z${savedView.zoom})`);
        setTimeout(() => setSavedViewBadge(null), 4000);
      }

      setCurrentZoomLevel(initialZoom);

      const map = L.map(mapContainerRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        zoomControl: false // Using our custom high-precision zoom and pan overlay
      });

      // Track zoom level in state & save position on user move/zoom
      map.on('zoomend', () => {
        const z = map.getZoom();
        setCurrentZoomLevel(z);
        const center = map.getCenter();
        if (isValidCoord(center.lat, center.lng)) {
          saveMapView(center.lat, center.lng, z, currentCityData.cityId);
          setIsViewPersisted(true);
        }
      });

      map.on('moveend', () => {
        const center = map.getCenter();
        const z = map.getZoom();
        if (isValidCoord(center.lat, center.lng)) {
          saveMapView(center.lat, center.lng, z, currentCityData.cityId);
          setIsViewPersisted(true);
        }
      });

      // Initialize base tile layer from current viewMode
      const modeConfig = MAP_VIEW_MODES.find((m) => m.id === viewMode) || MAP_VIEW_MODES[0];
      const initialTileLayer = L.tileLayer(modeConfig.tileUrl, {
        attribution: modeConfig.attribution,
        subdomains: modeConfig.subdomains || 'abc',
        maxZoom: modeConfig.maxZoom
      }).addTo(map);

      baseTileLayerRef.current = initialTileLayer;
      mapInstanceRef.current = map;
    } else {
      // If city changed and it doesn't match saved view center, update view
      const map = mapInstanceRef.current;
      const currentCenter = map.getCenter();
      const distance = Math.abs(currentCenter.lat - cityLat) + Math.abs(currentCenter.lng - cityLng);
      if (distance > 0.4) {
        map.setView([cityLat, cityLng], 12);
        saveMapView(cityLat, cityLng, 12, currentCityData.cityId);
      }
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    // Clear custom vector layers
    map.eachLayer((layer) => {
      if (layer instanceof L.Circle || layer instanceof L.Polyline || layer instanceof L.Marker) {
        if (layer !== userMarkerRef.current) {
          map.removeLayer(layer);
        }
      }
    });

    // 1. Draw Heatmap Rings based on CITIES_AQI_DATA and enabled pollutant composition layers
    if (activeLayers.heatmap) {
      CITIES_AQI_DATA.forEach((city) => {
        if (!isValidCoord(city.lat, city.lng)) return;

        const getAQIColor = (aqi: number) => {
          if (aqi > 300) return '#dc2626'; // Hazardous / Dark Red
          if (aqi > 200) return '#ef4444'; // Very Unhealthy / Red
          if (aqi > 150) return '#f97316'; // Unhealthy / Orange
          if (aqi > 100) return '#f59e0b'; // Sensitive / Amber
          if (aqi > 50)  return '#3b82f6'; // Moderate / Blue
          return '#10b981'; // Good / Green
        };

        const cityColor = getAQIColor(city.aqi);
        const isCurrentCity = city.cityId === currentCityData.cityId;

        // Draw active speciated pollutant layers (PM2.5, PM10, NO2, O3, SO2, CO)
        POLLUTANT_CONFIGS.forEach((config) => {
          if (!enabledPollutants[config.key]) return;

          const pData = Array.isArray(city.pollutants) ? city.pollutants.find((p) => p.name === config.key) : null;
          if (!pData) return;

          const radius = isCurrentCity ? config.ringRadius : config.ringRadius * 1.35;

          const layerCircle = L.circle([city.lat, city.lng], {
            color: config.color,
            fillColor: config.color,
            fillOpacity: config.opacity,
            weight: isCurrentCity ? 2 : 1,
            dashArray: config.dash || undefined,
            radius: radius
          }).addTo(map);

          layerCircle.bindTooltip(`
            <div style="font-family: sans-serif; font-size: 11px; padding: 4px 8px; background-color: #020617; color: #f8fafc; border-radius: 8px; border: 1px solid #334155; box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.5);">
              <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 2px;">
                <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${config.color}"></span>
                <strong style="color: ${config.color}">${config.fullLabel} (${config.key}) Layer</strong>
              </div>
              <div style="color: #cbd5e1; font-weight: bold;">${city.cityName}</div>
              <div style="font-family: monospace; color: #10b981; font-size: 12px; margin-top: 2px;">
                Concentration: ${pData.value} ${pData.unit}
              </div>
              <div style="color: #94a3b8; font-size: 10px;">
                Category: ${pData.category} (${pData.percentOfLimit}% of WHO limit)
              </div>
            </div>
          `, {
            permanent: false,
            direction: 'top'
          });
        });

        // Always render subtle overall urban AQI boundary ring
        const outerCircle = L.circle([city.lat, city.lng], {
          color: cityColor,
          fillColor: cityColor,
          fillOpacity: 0.08,
          weight: 1,
          dashArray: '4, 4',
          radius: isCurrentCity ? 8000 : 18000
        }).addTo(map);

        outerCircle.bindTooltip(`
          <div style="font-family: sans-serif; font-size: 11px; padding: 2px 4px;">
            <strong style="color: #f8fafc;">${city.cityName}</strong><br/>
            <span style="color: ${cityColor}; font-weight: bold;">Overall AQI ${city.aqi} (${city.aqiCategory})</span><br/>
            <span style="color: #94a3b8;">Primary: ${city.primaryPollutant}</span>
          </div>
        `, {
          permanent: false,
          direction: 'top'
        });
      });

      // Local GNN Station heatmap rings around current city
      GNN_NODES_DELHI.forEach((node) => {
        if (!isValidCoord(node.lat, node.lng)) return;
        const color = node.aqi > 300 ? '#ef4444' : node.aqi > 200 ? '#f97316' : '#f59e0b';
        
        L.circle([node.lat, node.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.28,
          radius: 2200
        }).addTo(map);

        L.circle([node.lat, node.lng], {
          color: color,
          fillColor: color,
          fillOpacity: 0.12,
          radius: 4500
        }).addTo(map);
      });
    }

    // 2. Draw GNN Sensor Graph Nodes and Directed Edges with Smooth CSS Transition Animations
    if (activeLayers.gnnNodes) {
      GNN_NODES_DELHI.forEach((node) => {
        if (!isValidCoord(node.lat, node.lng)) return;

        // Directed Graph Edges between connected sensor nodes
        node.connectedNodeIds.forEach((targetId) => {
          const targetNode = GNN_NODES_DELHI.find((n) => n.id === targetId);
          if (targetNode && isValidCoord(targetNode.lat, targetNode.lng)) {
            L.polyline([[node.lat, node.lng], [targetNode.lat, targetNode.lng]], {
              color: '#10b981',
              weight: 1.5,
              opacity: 0.5,
              dashArray: '4, 6'
            }).addTo(map);
          }
        });

        const isSelected = selectedGNNNode?.id === node.id;
        const bgColor = node.aqi > 300 ? '#dc2626' : node.aqi > 200 ? '#ea580c' : node.aqi > 100 ? '#d97706' : '#10b981';

        // Sensor Node Marker Custom HTML Icon with Smooth CSS Scale / Grow & Pulse Animations
        const nodeIcon = L.divIcon({
          className: `custom-gnn-pin ${isSelected ? 'custom-gnn-pin-selected' : ''}`,
          html: `
            <div class="custom-gnn-pin-inner" style="
              background-color: ${bgColor};
              color: #020617;
              font-weight: 800;
              font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
              font-size: 10px;
              padding: 2px 7px;
              border-radius: 9999px;
              border: 2px solid ${isSelected ? '#38bdf8' : '#ffffff'};
              box-shadow: ${isSelected ? '0 0 16px rgba(56, 189, 248, 0.9), 0 4px 12px rgba(0,0,0,0.7)' : '0 4px 10px rgba(0,0,0,0.6)'};
              white-space: nowrap;
              cursor: pointer;
              transform: translate(-50%, -50%);
              display: flex;
              align-items: center;
              gap: 4px;
            ">
              <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background-color: ${isSelected ? '#020617' : '#ffffff'}; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
              <span>${node.aqi}</span>
            </div>
          `,
          iconSize: [34, 22]
        });

        const marker = L.marker([node.lat, node.lng], { icon: nodeIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedGNNNode(node);
          if (mapInstanceRef.current) {
            mapInstanceRef.current.panTo([node.lat, node.lng], { animate: true });
          }
        });

        marker.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #020617; min-width: 190px;">
            <div style="font-weight: 800; font-size: 13px; margin-bottom: 2px; color: #0f172a;">${node.name}</div>
            <div style="color: #64748b; font-size: 11px; margin-bottom: 6px;">Station Type: ${node.type.toUpperCase()}</div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>Current AQI:</span>
              <strong style="color: ${node.aqi > 200 ? '#dc2626' : '#16a34a'}; font-family: monospace;">${node.aqi}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>Plume Velocity:</span>
              <strong style="font-family: monospace;">${node.vectorDriftSpeed} km/h</strong>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 3px;">
              <span>Wind Azimuth:</span>
              <strong style="font-family: monospace;">${node.vectorDirectionDeg}° NW</strong>
            </div>
            <div style="margin-top: 6px; padding-top: 6px; border-top: 1px solid #e2e8f0; font-size: 10px; color: #059669; font-weight: bold;">
              Active GNN Spatial Mesh Node
            </div>
          </div>
        `);
      });
    }

    // 3. User Real-Time GPS Tracking Marker (strictly validated coordinates)
    if (gpsPos && isValidCoord(gpsPos.lat, gpsPos.lng)) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([gpsPos.lat, gpsPos.lng]);
      } else {
        const userIcon = L.divIcon({
          className: 'user-gps-marker',
          html: `
            <div style="position: relative; width: 22px; height: 22px;">
              <div style="position: absolute; inset: 0; background-color: #3b82f6; border-radius: 50%; opacity: 0.75; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
              <div style="position: absolute; inset: 3px; background-color: #2563eb; border: 2px solid #ffffff; border-radius: 50%; box-shadow: 0 0 10px rgba(37,99,235,0.8);"></div>
            </div>
          `,
          iconSize: [22, 22]
        });

        userMarkerRef.current = L.marker([gpsPos.lat, gpsPos.lng], { icon: userIcon }).addTo(map);
        userMarkerRef.current.bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; color: #0f172a;">
            <strong>Your Live Location</strong><br/>
            Accuracy: ±${Math.round(gpsPos.accuracy || 10)}m
          </div>
        `);
      }
    }
  }, [currentCityData, activeLayers, gpsPos, enabledPollutants, selectedGNNNode?.id]);

  // Map Navigation & Precision Control Handlers
  const handleZoomIn = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.zoomOut();
    }
  };

  const handlePan = (dx: number, dy: number) => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panBy([dx, dy], { animate: true });
    }
  };

  // Recenter map on user's GPS
  const centerOnUserGPS = () => {
    if (gpsPos && isValidCoord(gpsPos.lat, gpsPos.lng) && mapInstanceRef.current) {
      mapInstanceRef.current.setView([gpsPos.lat, gpsPos.lng], 14, { animate: true });
      saveMapView(gpsPos.lat, gpsPos.lng, 14, currentCityData.cityId);
      setSavedViewBadge('View Centered on GPS Location');
      setTimeout(() => setSavedViewBadge(null), 3000);
    }
  };

  // Recenter map on current city
  const centerOnCity = () => {
    const cityLat = isValidCoord(currentCityData?.lat, currentCityData?.lng) ? currentCityData.lat : 28.6139;
    const cityLng = isValidCoord(currentCityData?.lat, currentCityData?.lng) ? currentCityData.lng : 77.2090;
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([cityLat, cityLng], 12, { animate: true });
      saveMapView(cityLat, cityLng, 12, currentCityData.cityId);
      setSavedViewBadge(`View Reset to ${currentCityData.cityName} Extent`);
      setTimeout(() => setSavedViewBadge(null), 3000);
    }
  };

  // Explicit Save Current View to LocalStorage
  const handleExplicitSaveView = () => {
    if (mapInstanceRef.current) {
      const center = mapInstanceRef.current.getCenter();
      const zoom = mapInstanceRef.current.getZoom();
      if (isValidCoord(center.lat, center.lng)) {
        saveMapView(center.lat, center.lng, zoom, currentCityData.cityId);
        setIsViewPersisted(true);
        setSavedViewBadge(`Saved view (${center.lat.toFixed(2)}, ${center.lng.toFixed(2)} @ z${zoom})`);
        setTimeout(() => setSavedViewBadge(null), 3500);
      }
    }
  };

  // Clear Saved View from LocalStorage
  const handleResetSavedView = () => {
    try {
      localStorage.removeItem(MAP_VIEW_STORAGE_KEY);
      setIsViewPersisted(false);
      centerOnCity();
      setSavedViewBadge('Map view persistence cleared & reset to city default');
      setTimeout(() => setSavedViewBadge(null), 3500);
    } catch (e) {
      console.warn(e);
    }
  };

  // Offline Package Download Trigger
  const handleDownloadOfflineRegionClick = () => {
    const cityLat = isValidCoord(currentCityData?.lat, currentCityData?.lng) ? currentCityData.lat : 28.6139;
    const cityLng = isValidCoord(currentCityData?.lat, currentCityData?.lng) ? currentCityData.lng : 77.2090;
    setIsDownloadingTilePackage(true);
    setTimeout(() => {
      onDownloadOfflineRegion(currentCityData.cityName, cityLat, cityLng);
      setIsDownloadingTilePackage(false);
      setDownloadSuccessMessage(`Map tiles & GNN mesh successfully cached for ${currentCityData.cityName}! (Available 100% offline)`);
      setTimeout(() => setDownloadSuccessMessage(null), 4500);
    }, 1200);
  };

  const activeRatioConfig = MAP_ASPECT_RATIOS.find((r) => r.id === aspectRatio) || MAP_ASPECT_RATIOS[0];

  return (
    <div className={`h-full flex flex-col overflow-hidden space-y-3 ${isFullscreen ? 'fixed inset-0 z-50 bg-slate-950 p-4' : ''}`}>
      {/* Top Map Action & Control Deck */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0 shadow-md">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-sm font-bold text-slate-100">{currentCityData.cityName} Real-Time AQI Layer</h2>
              <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                currentCityData.aqi > 200 ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                AQI {currentCityData.aqi} ({currentCityData.aqiCategory})
              </span>
            </div>
            
            {/* Quick District Switcher Dropdown */}
            {onSelectCity && (
              <div className="flex items-center space-x-1.5 mt-1">
                <span className="text-[10px] text-slate-400 font-medium">Switch District:</span>
                <select
                  value={currentCityData.cityId}
                  onChange={(e) => onSelectCity(e.target.value)}
                  className="bg-slate-950 text-emerald-400 text-[11px] font-bold py-0.5 px-2 rounded border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  {CITIES_AQI_DATA.map((city) => (
                    <option key={city.cityId} value={city.cityId}>
                      {city.cityName} (AQI {city.aqi}) &bull; {city.country.replace('India (', '').replace(')', '')}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <p className="text-[11px] text-slate-400 mt-0.5">
              Monitoring Stations: <span className="text-slate-200 font-mono font-medium">Indian AQI Grid Active</span> | Wind: <span className="text-slate-200 font-mono font-medium">{currentCityData.weather.windSpeedKmh} km/h NW ({currentCityData.weather.windDirectionDeg}°)</span>
            </p>
          </div>
        </div>

        {/* Viewport Aspect Ratio & Layer Selector Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Map Aspect Ratio Sizing Engine Selector */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 pl-2 pr-1.5 hidden md:inline">Size Ratio:</span>
            {MAP_ASPECT_RATIOS.map((ratio) => {
              const isSelected = aspectRatio === ratio.id;
              const Icon = ratio.icon;
              return (
                <button
                  key={ratio.id}
                  onClick={() => setAspectRatio(ratio.id)}
                  className={`px-2 py-1 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={`${ratio.label}: ${ratio.desc}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono">{ratio.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Base Map View Mode Selector (Satellite / Terrain / AQI Heatmap) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <span className="text-[10px] font-mono text-slate-400 pl-2 pr-1.5 hidden md:inline">Mode:</span>
            {MAP_VIEW_MODES.map((mode) => {
              const isSelected = viewMode === mode.id;
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => setViewMode(mode.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={`${mode.label}: ${mode.desc}`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[11px]">{mode.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* Heatmap Toggle */}
          <button
            onClick={() => setActiveLayers({ ...activeLayers, heatmap: !activeLayers.heatmap })}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
              activeLayers.heatmap 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20' 
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Spatial AQI Intensity Heatmap Overlay"
          >
            <Layers className={`w-3.5 h-3.5 ${activeLayers.heatmap ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="hidden sm:inline">Heatmap</span>
            <span className={`px-1 py-0.2 text-[9px] font-mono rounded ${
              activeLayers.heatmap ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'
            }`}>
              {activeLayers.heatmap ? 'ON' : 'OFF'}
            </span>
          </button>

          {/* Center GPS / City Shortcuts */}
          <button
            onClick={centerOnCity}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Recenter Map on City Center"
          >
            <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset Center</span>
          </button>

          <button
            onClick={centerOnUserGPS}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Recenter Map on User GPS Location"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">GPS</span>
          </button>

          {/* Fullscreen Viewport Mode Toggle */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen GIS Deck'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-amber-400" /> : <Maximize2 className="w-4 h-4 text-slate-300" />}
          </button>

          {/* Offline Download Button */}
          <button
            onClick={handleDownloadOfflineRegionClick}
            disabled={isDownloadingTilePackage}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>{isDownloadingTilePackage ? 'Caching...' : 'Download Offline'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Speciated Pollutants & AI Health Impacts Ribbon */}
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-xl px-3 py-2 flex flex-wrap items-center justify-between gap-2 flex-shrink-0">
        <div className="flex items-center space-x-2 text-xs">
          <span className="text-slate-400 font-bold text-[11px]">Speciated Pollutants (Hover for AI Health Impact):</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {currentCityData.pollutants.map((p) => (
            <PollutantBadgeTooltip key={p.name} pollutant={p} />
          ))}
        </div>
      </div>

      {/* Download Alert Notification */}
      {downloadSuccessMessage && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-2.5 text-xs flex items-center space-x-2 flex-shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{downloadSuccessMessage}</span>
        </div>
      )}

      {/* Main Map Stage Grid with Dynamic Aspect Ratio Containers */}
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-3 overflow-hidden">
        {/* Left/Main Leaflet Canvas Container */}
        <div className={`flex-1 overflow-hidden flex flex-col transition-all duration-300 ${activeRatioConfig.ratioClass}`}>
          <div className="w-full h-full bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative shadow-2xl flex flex-col">
            
            {/* Split Screen Dual View Mode Layout */}
            {aspectRatio === 'split' ? (
              <div className="w-full h-full grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 relative">
                {/* Left Side: Carto Dark AQI Heatmap */}
                <div className="relative w-full h-full">
                  <div ref={mapContainerRef} className="w-full h-full z-0" />
                  <div className="absolute top-3 left-3 z-10 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-emerald-400 font-bold flex items-center space-x-1 shadow-lg">
                    <Flame className="w-3 h-3 text-red-400" />
                    <span>Carto Dark &bull; Spatial AQI Heatmap</span>
                  </div>
                </div>

                {/* Right Side: High-Resolution Optical Satellite View */}
                <div className="relative w-full h-full">
                  <div ref={secondaryMapContainerRef} className="w-full h-full z-0" />
                  <div className="absolute top-3 left-3 z-10 bg-slate-950/85 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[10px] font-mono text-cyan-400 font-bold flex items-center space-x-1 shadow-lg">
                    <Satellite className="w-3 h-3 text-cyan-400" />
                    <span>Orbital High-Res Optical Imagery</span>
                  </div>
                </div>
              </div>
            ) : (
              /* Single Unified Map Canvas */
              <div ref={mapContainerRef} className="w-full h-full z-0" />
            )}

            {/* Floating On-Map Layer View Mode Selector */}
            <div className="absolute top-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-1.5 shadow-2xl flex items-center space-x-1">
              <div className="px-2 py-1 flex items-center space-x-1.5 border-r border-slate-800 mr-1 text-[10px] font-mono text-slate-400">
                <Layers className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline font-bold text-slate-200">Layer</span>
              </div>
              {MAP_VIEW_MODES.map((mode) => {
                const isSelected = viewMode === mode.id;
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.id}
                    onClick={() => setViewMode(mode.id)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-900 border border-transparent hover:border-slate-800'
                    }`}
                    title={`${mode.label}: ${mode.desc}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{mode.shortLabel}</span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-950 ml-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Interactive Floating Pollutant Layer Legend Widget */}
            <div className="absolute top-4 right-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs text-slate-300 shadow-2xl w-72 transition-all">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2">
                <div className="flex items-center space-x-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold text-slate-100 text-xs font-mono">Pollutant Heatmap Layers</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded-full font-bold border border-emerald-500/30">
                    {Object.values(enabledPollutants).filter(Boolean).length}/6
                  </span>
                  <button
                    onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                    title={isLegendExpanded ? "Collapse Pollutant Legend" : "Expand Pollutant Legend"}
                  >
                    {isLegendExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {isLegendExpanded && (
                <div className="space-y-2.5 animate-in fade-in duration-150">
                  {/* Quick Presets Row */}
                  <div className="flex items-center justify-between text-[10px] font-mono gap-1">
                    <button
                      onClick={() => setEnabledPollutants({ 'PM2.5': true, 'PM10': true, 'NO2': false, 'O3': false, 'SO2': false, 'CO': false })}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition-colors cursor-pointer flex-1 text-center"
                    >
                      PM2.5 + PM10
                    </button>
                    <button
                      onClick={() => setEnabledPollutants({ 'PM2.5': false, 'PM10': false, 'NO2': true, 'O3': false, 'SO2': false, 'CO': true })}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded border border-slate-800 transition-colors cursor-pointer flex-1 text-center"
                    >
                      NO2 + CO
                    </button>
                    <button
                      onClick={() => setEnabledPollutants({ 'PM2.5': true, 'PM10': true, 'NO2': true, 'O3': true, 'SO2': true, 'CO': true })}
                      className="px-2 py-0.5 bg-slate-900 hover:bg-slate-800 text-emerald-400 rounded border border-slate-800 transition-colors cursor-pointer font-bold"
                    >
                      All On
                    </button>
                  </div>

                  {/* Pollutants Toggle List */}
                  <div className="space-y-1.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                    {POLLUTANT_CONFIGS.map((config) => {
                      const isActive = !!enabledPollutants[config.key];
                      const currData = currentCityData.pollutants.find((p) => p.name === config.key);

                      return (
                        <div
                          key={config.key}
                          onClick={() => togglePollutant(config.key)}
                          className={`p-2 rounded-lg border transition-all cursor-pointer flex items-center justify-between group ${
                            isActive
                              ? 'bg-slate-900/90 border-slate-700 shadow-sm'
                              : 'bg-slate-950/60 border-slate-800/60 opacity-60 hover:opacity-90'
                          }`}
                        >
                          <div className="flex items-center space-x-2.5">
                            {/* Color Dot & Check Marker */}
                            <div
                              className="w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                              style={{ backgroundColor: config.color, boxShadow: isActive ? `0 0 8px ${config.color}` : 'none' }}
                            >
                              {isActive && <Check className="w-2.5 h-2.5 text-slate-950 stroke-[3]" />}
                            </div>

                            <div>
                              <div className="flex items-center space-x-1.5">
                                <span className="font-bold font-mono text-xs text-slate-200 group-hover:text-emerald-300">
                                  {config.label}
                                </span>
                                <span className="text-[10px] text-slate-400 font-sans">({config.fullLabel})</span>
                              </div>
                              <p className="text-[9px] text-slate-500 font-mono">{config.desc}</p>
                            </div>
                          </div>

                          <div className="text-right">
                            {currData ? (
                              <span className="text-[11px] font-mono font-bold block" style={{ color: isActive ? config.color : '#94a3b8' }}>
                                {currData.value} <span className="text-[9px] text-slate-500">{currData.unit}</span>
                              </span>
                            ) : (
                              <span className="text-[10px] text-slate-500 font-mono block">--</span>
                            )}
                            <span className={`text-[9px] font-mono font-bold ${isActive ? 'text-emerald-400' : 'text-slate-600'}`}>
                              {isActive ? 'ACTIVE' : 'OFF'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Floating Persistence Notice Badge */}
            {savedViewBadge && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 bg-emerald-500/90 text-slate-950 px-3 py-1.5 rounded-full text-xs font-mono font-bold shadow-2xl backdrop-blur-md flex items-center space-x-1.5 animate-in fade-in slide-in-from-top-2 border border-emerald-300/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{savedViewBadge}</span>
              </div>
            )}

            {/* Custom Precision Zoom, Pan & View Controls Overlay */}
            <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end space-y-2 pointer-events-auto">
              {/* Precision Compass & Pan D-Pad */}
              <div className="bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-2xl p-2 shadow-2xl flex flex-col items-center">
                <div className="flex items-center justify-between w-full px-1 mb-1.5">
                  <div className="flex items-center space-x-1 text-[9px] font-mono text-slate-400">
                    <Compass className="w-3 h-3 text-cyan-400 animate-spin-slow" />
                    <span className="font-bold">GIS NAV</span>
                  </div>
                  <span className="text-[9px] font-mono text-emerald-400 font-bold bg-slate-900 px-1 py-0.2 rounded border border-slate-800">
                    z{currentZoomLevel}
                  </span>
                </div>

                {/* Pan D-Pad Grid */}
                <div className="grid grid-cols-3 gap-1 w-24 h-24 place-items-center bg-slate-900/80 p-1.5 rounded-xl border border-slate-800/80">
                  <div />
                  <button
                    onClick={() => handlePan(0, -120)}
                    className="w-7 h-7 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    title="Pan North (Up)"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <div />

                  <button
                    onClick={() => handlePan(-120, 0)}
                    className="w-7 h-7 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    title="Pan West (Left)"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={centerOnCity}
                    className="w-7 h-7 bg-emerald-500/20 hover:bg-emerald-500 hover:text-slate-950 text-emerald-400 rounded-lg flex items-center justify-center transition-colors border border-emerald-500/30 shadow-sm cursor-pointer"
                    title="Reset to City Center"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handlePan(120, 0)}
                    className="w-7 h-7 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    title="Pan East (Right)"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <div />
                  <button
                    onClick={() => handlePan(0, 120)}
                    className="w-7 h-7 bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-slate-200 rounded-lg flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                    title="Pan South (Down)"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <div />
                </div>

                {/* Zoom Controls & Persistence Quick Actions */}
                <div className="flex items-center justify-between w-full mt-2 pt-1.5 border-t border-slate-800/80 gap-1">
                  <button
                    onClick={handleZoomIn}
                    className="flex-1 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 rounded-lg flex items-center justify-center transition-colors text-xs font-bold shadow-sm cursor-pointer"
                    title="Zoom In (+)"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="flex-1 py-1 bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 rounded-lg flex items-center justify-center transition-colors text-xs font-bold shadow-sm cursor-pointer"
                    title="Zoom Out (-)"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Persistent Storage Controls */}
                <div className="flex items-center justify-between w-full mt-1.5 gap-1">
                  <button
                    onClick={handleExplicitSaveView}
                    className="flex-1 py-1 px-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-slate-950 border border-emerald-500/30 rounded-lg flex items-center justify-center space-x-1 transition-all text-[10px] font-mono font-bold cursor-pointer"
                    title="Save current map view, zoom and center into localStorage"
                  >
                    <Save className="w-3 h-3" />
                    <span>Save</span>
                  </button>
                  <button
                    onClick={handleResetSavedView}
                    className="py-1 px-1.5 bg-slate-800 hover:bg-red-500 hover:text-slate-950 text-slate-400 hover:text-white rounded-lg flex items-center justify-center transition-colors text-[10px] font-mono cursor-pointer"
                    title="Clear saved view from localStorage"
                  >
                    <RotateCcw className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Map Overlay Badge Legend */}
            <div className="absolute bottom-4 left-4 z-10 bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl p-3 text-xs text-slate-300 space-y-2 shadow-xl max-w-xs">
              <div className="font-bold text-slate-100 flex items-center justify-between">
                <span>AQI Severity Scale</span>
                <span className="text-[10px] text-slate-400 font-mono">GNN Model</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[10px] font-medium">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                  <span>Good (0-50)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>Moderate (51-100)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                  <span>Unhealthy (101-200)</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
                  <span>Severe (&gt;200)</span>
                </div>
              </div>
              {isViewPersisted && (
                <div className="pt-1.5 border-t border-slate-800 text-[10px] text-emerald-400 flex items-center space-x-1 font-mono">
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span>Session view persisted to localStorage</span>
                </div>
              )}
              {isOffline && (
                <div className="pt-1 border-t border-slate-800 text-[11px] text-amber-400 flex items-center space-x-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Operating on Offline Cached Tiles</span>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
