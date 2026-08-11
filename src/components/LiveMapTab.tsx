import React, { useEffect, useRef, useState } from 'react';
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
  Sparkles
} from 'lucide-react';
import { AQIMeasurement, GNNNode, GPSPosition, OfflineMapRegion } from '../types';
import { GNN_NODES_DELHI, CITIES_AQI_DATA } from '../data/mockData';
import { offlineStorage } from '../services/offlineStorageService';
import { PollutantBadgeTooltip } from './PollutantBadgeTooltip';

interface LiveMapTabProps {
  currentCityData: AQIMeasurement;
  gpsPos: GPSPosition | null;
  onDownloadOfflineRegion: (regionName: string, lat: number, lng: number) => void;
  isOffline: boolean;
  onSelectCity?: (cityId: string) => void;
}

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
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

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

  const togglePollutant = (key: string) => {
    setEnabledPollutants((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Initialize and update Leaflet map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCityData.lat, currentCityData.lng],
        zoom: 12,
        zoomControl: false
      });

      L.control.zoom({ position: 'topright' }).addTo(map);

      // Dark theme map tiles (CartoDB Dark Matter / OSM)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      mapInstanceRef.current = map;
    } else {
      mapInstanceRef.current.setView([currentCityData.lat, currentCityData.lng], 12);
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

          const pData = city.pollutants.find((p) => p.name === config.key);
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

    // 2. Render GNN Station Markers & Wind Drift Vectors
    if (activeLayers.gnnNodes) {
      GNN_NODES_DELHI.forEach((node) => {
        const customIcon = L.divIcon({
          className: 'custom-gnn-pin',
          html: `<div style="background-color: #0f172a; border: 2px solid ${
            node.aqi > 300 ? '#ef4444' : node.aqi > 200 ? '#f97316' : '#3b82f6'
          }; color: #f8fafc; font-weight: bold; font-size: 11px; padding: 2px 6px; border-radius: 12px; box-shadow: 0 0 10px rgba(0,0,0,0.5); display: flex; align-items: center; gap: 4px;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background-color: ${
              node.aqi > 300 ? '#ef4444' : node.aqi > 200 ? '#f97316' : '#10b981'
            }"></span>
            <span>AQI ${node.aqi}</span>
          </div>`,
          iconSize: [80, 24],
          iconAnchor: [40, 12]
        });

        const marker = L.marker([node.lat, node.lng], { icon: customIcon }).addTo(map);
        marker.on('click', () => setSelectedGNNNode(node));

        // Draw drift links between connected nodes
        node.connectedNodeIds.forEach((targetId) => {
          const targetNode = GNN_NODES_DELHI.find((n) => n.id === targetId);
          if (targetNode) {
            L.polyline(
              [
                [node.lat, node.lng],
                [targetNode.lat, targetNode.lng]
              ],
              {
                color: '#38bdf8',
                weight: 2,
                dashArray: '6, 8',
                opacity: 0.6
              }
            ).addTo(map);
          }
        });
      });
    }

    // 3. User Live GPS Marker
    if (gpsPos) {
      const gpsIcon = L.divIcon({
        className: 'user-gps-pulse',
        html: `<div style="position: relative;">
          <div style="width: 18px; height: 18px; background-color: #10b981; border: 3px solid #ffffff; border-radius: 50%; box-shadow: 0 0 15px #10b981;"></div>
          <div style="position: absolute; top: -11px; left: -11px; width: 40px; height: 40px; border-radius: 50%; background: rgba(16, 185, 129, 0.25); animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        </div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      if (!userMarkerRef.current) {
        userMarkerRef.current = L.marker([gpsPos.lat, gpsPos.lng], { icon: gpsIcon }).addTo(map);
      } else {
        userMarkerRef.current.setLatLng([gpsPos.lat, gpsPos.lng]);
      }
    }
  }, [currentCityData, activeLayers, gpsPos, enabledPollutants]);

  const handleDownloadOfflineRegionClick = () => {
    setIsDownloadingTilePackage(true);
    setTimeout(() => {
      onDownloadOfflineRegion(currentCityData.cityName, currentCityData.lat, currentCityData.lng);
      setIsDownloadingTilePackage(false);
      setDownloadSuccessMessage(`Map tiles for ${currentCityData.cityName} successfully cached in local storage for offline operation!`);
      setTimeout(() => setDownloadSuccessMessage(null), 5000);
    }, 1200);
  };

  const centerOnUserGPS = () => {
    if (gpsPos && mapInstanceRef.current) {
      mapInstanceRef.current.setView([gpsPos.lat, gpsPos.lng], 14, { animate: true });
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden space-y-3">
      {/* Top Map Action Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 flex-shrink-0">
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

        {/* Layer Toggles & Offline Cache Action */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveLayers({ ...activeLayers, heatmap: !activeLayers.heatmap })}
            className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all flex items-center space-x-1.5 ${
              activeLayers.heatmap 
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm shadow-emerald-500/20' 
                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Toggle Spatial AQI Intensity Heatmap Overlay"
          >
            <Layers className={`w-3.5 h-3.5 ${activeLayers.heatmap ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span>AQI Heatmap</span>
            <span className={`px-1 py-0.2 text-[9px] font-mono rounded ${
              activeLayers.heatmap ? 'bg-emerald-500/30 text-emerald-200' : 'bg-slate-800 text-slate-500'
            }`}>
              {activeLayers.heatmap ? 'ON' : 'OFF'}
            </span>
          </button>

          <button
            onClick={() => setActiveLayers({ ...activeLayers, gnnNodes: !activeLayers.gnnNodes })}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors flex items-center space-x-1.5 ${
              activeLayers.gnnNodes ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-950 text-slate-400 border-slate-800'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>GNN Vectors</span>
          </button>

          <button
            onClick={centerOnUserGPS}
            className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 flex items-center space-x-1.5 transition-colors"
            title="Recenter Map on User GPS Location"
          >
            <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
            <span>Center GPS</span>
          </button>

          <button
            onClick={handleDownloadOfflineRegionClick}
            disabled={isDownloadingTilePackage}
            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50"
          >
            <HardDriveDownload className="w-3.5 h-3.5" />
            <span>{isDownloadingTilePackage ? 'Caching...' : 'Download Offline Region'}</span>
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

      {/* Main Map Stage Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-4 gap-3 overflow-hidden">
        {/* Leaflet Canvas Container */}
        <div className="lg:col-span-3 bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden relative h-full shadow-2xl">
          <div ref={mapContainerRef} className="w-full h-full z-0" />

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
            {isOffline && (
              <div className="pt-2 border-t border-slate-800 text-[11px] text-amber-400 flex items-center space-x-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Operating on Offline Cached Tiles</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side GNN Station Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">GNN Station Inspector</h3>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                Node ID: {selectedGNNNode?.id}
              </span>
            </div>

            {selectedGNNNode ? (
              <div className="space-y-3 mt-3 text-xs">
                <div>
                  <h4 className="font-bold text-slate-200 text-sm">{selectedGNNNode.name}</h4>
                  <p className="text-slate-400 text-[11px]">Type: <span className="capitalize font-mono text-slate-300">{selectedGNNNode.type.replace('_', ' ')}</span></p>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Current Node AQI:</span>
                    <span className={`font-mono font-bold text-sm ${
                      selectedGNNNode.aqi > 300 ? 'text-red-400' : selectedGNNNode.aqi > 200 ? 'text-orange-400' : 'text-emerald-400'
                    }`}>
                      {selectedGNNNode.aqi}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Vector Drift Velocity:</span>
                    <span className="text-slate-200 font-mono">{selectedGNNNode.vectorDriftSpeed} km/h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Wind Direction:</span>
                    <span className="text-slate-200 font-mono">{selectedGNNNode.vectorDirectionDeg}° NW</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Telemetry Status:</span>
                    <span className="text-emerald-400 font-mono font-semibold">Active Realtime</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Graph Network Interconnections:</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedGNNNode.connectedNodeIds.map((nodeId) => (
                      <span key={nodeId} className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-mono text-[10px]">
                        → {nodeId}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-2.5 text-[11px] text-emerald-300">
                  <p className="font-semibold mb-0.5">GNN Drift Simulation:</p>
                  <p className="text-slate-300">
                    Physical particulate propagation models show air mass moving toward neighboring residential sectors over the next 3.5 hours.
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 mt-4">Click any station pin on the map to inspect telemetry details.</p>
            )}
          </div>

          <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Map Render Engine:</span>
              <span className="font-mono text-slate-300">Leaflet GL + Canvas</span>
            </div>
            <div className="flex justify-between">
              <span>GNN Interpolation:</span>
              <span className="font-mono text-slate-300">IDW Kriging Mesh</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
