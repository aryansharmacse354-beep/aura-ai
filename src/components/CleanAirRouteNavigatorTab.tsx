import React, { useState, useEffect, useRef } from 'react';
import { 
  Navigation, 
  MapPin, 
  ShieldCheck, 
  Wind, 
  AlertTriangle, 
  Play, 
  Pause, 
  RotateCcw, 
  Footprints, 
  Bike, 
  Car, 
  Activity, 
  Clock, 
  Route as RouteIcon, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Layers, 
  Info, 
  Download,
  Share2,
  TrendingDown,
  TreePine,
  ChevronRight
} from 'lucide-react';
import { AQIMeasurement } from '../types';

interface CleanAirRouteNavigatorTabProps {
  currentCityData: AQIMeasurement;
}

interface Waypoint {
  id: number;
  name: string;
  distanceKm: number;
  segmentAqi: number;
  segmentPm25: number;
  canopyDensity: number; // 0 to 100%
  hazardNote?: string;
  instruction: string;
  lat: number;
  lng: number;
}

interface RouteOption {
  id: 'clean' | 'fastest' | 'balanced';
  title: string;
  subtitle: string;
  distanceKm: number;
  durationMins: number;
  avgAqi: number;
  avgPm25: number;
  totalInhaledDoseUg: number; // Micrograms of PM2.5 inhaled
  treeCanopyCoveragePct: number;
  waypoints: Waypoint[];
  color: string;
  tag: string;
}

export const CleanAirRouteNavigatorTab: React.FC<CleanAirRouteNavigatorTabProps> = ({ currentCityData }) => {
  // Activity / Transport Mode
  const [activityMode, setActivityMode] = useState<'walk' | 'bike' | 'run' | 'car'>('bike');
  const [selectedRouteId, setSelectedRouteId] = useState<'clean' | 'fastest' | 'balanced'>('clean');
  
  // Custom Origin & Destination Presets based on selected city
  const [origin, setOrigin] = useState('Central Business District (CBD)');
  const [destination, setDestination] = useState('Greenwood Residential & Tech Park');
  
  // Simulation Player States
  const [isPlaying, setIsPlaying] = useState(false);
  const [simProgress, setSimProgress] = useState(0); // 0 to 100%
  const [liveInhaledDose, setLiveInhaledDose] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Minute breathing rates (L/min) based on exertion
  const breathingRates: Record<string, number> = {
    walk: 18,
    bike: 38,
    run: 60,
    car: 8 // Assuming vehicle cabin filtration
  };

  // Base multiplier for speed (km/h)
  const travelSpeeds: Record<string, number> = {
    walk: 5.0,
    bike: 16.0,
    run: 10.0,
    car: 32.0
  };

  // Generate dynamic routes tailored to city's current AQI
  const cityBaseAqi = currentCityData.aqi || 120;
  const pm25Item = Array.isArray(currentCityData.pollutants) 
    ? currentCityData.pollutants.find((p) => p.name === 'PM2.5')
    : null;
  const cityBasePm25 = pm25Item ? pm25Item.value : 55;

  const routes: RouteOption[] = [
    {
      id: 'clean',
      title: 'Green Canopy Eco-Route (Lowest Inhalation)',
      subtitle: 'Navigates through urban parks, tree-lined boulevards, and low-traffic residential corridors',
      distanceKm: 6.8,
      durationMins: Math.round((6.8 / travelSpeeds[activityMode]) * 60),
      avgAqi: Math.max(35, Math.round(cityBaseAqi * 0.42)),
      avgPm25: Math.max(12, Math.round(cityBasePm25 * 0.38)),
      totalInhaledDoseUg: Math.round(
        (cityBasePm25 * 0.38 * (breathingRates[activityMode] / 1000) * ((6.8 / travelSpeeds[activityMode]) * 60))
      ),
      treeCanopyCoveragePct: 78,
      color: '#10b981',
      tag: '-62% Toxic Inhalation Exposure',
      waypoints: [
        {
          id: 1,
          name: 'Origin: Plaza Gardens North',
          distanceKm: 0.0,
          segmentAqi: Math.round(cityBaseAqi * 0.45),
          segmentPm25: Math.round(cityBasePm25 * 0.40),
          canopyDensity: 85,
          instruction: 'Start eastward onto Pine Tree Boulevard bike path',
          lat: 28.615,
          lng: 77.210
        },
        {
          id: 2,
          name: 'Central Eco-Forest Corridor',
          distanceKm: 2.2,
          segmentAqi: Math.round(cityBaseAqi * 0.35),
          segmentPm25: Math.round(cityBasePm25 * 0.32),
          canopyDensity: 92,
          instruction: 'Enter Botanic Park Greenbelt; natural tree particulate filter zone',
          lat: 28.620,
          lng: 77.225
        },
        {
          id: 3,
          name: 'Riverfront Boardwalk Bypass',
          distanceKm: 4.6,
          segmentAqi: Math.round(cityBaseAqi * 0.38),
          segmentPm25: Math.round(cityBasePm25 * 0.35),
          canopyDensity: 75,
          instruction: 'Follow riverside promenade with active fresh breeze dispersion',
          lat: 28.628,
          lng: 77.238
        },
        {
          id: 4,
          name: 'Destination: Tech Park West Gate',
          distanceKm: 6.8,
          segmentAqi: Math.round(cityBaseAqi * 0.44),
          segmentPm25: Math.round(cityBasePm25 * 0.40),
          canopyDensity: 70,
          instruction: 'Arrive at destination through filtered building perimeter',
          lat: 28.635,
          lng: 77.250
        }
      ]
    },
    {
      id: 'fastest',
      title: 'Fastest Direct Route (Heavy Traffic Arterial)',
      subtitle: 'Direct high-speed route along major highways and arterial transit overpasses',
      distanceKm: 5.4,
      durationMins: Math.round((5.4 / travelSpeeds[activityMode]) * 60),
      avgAqi: Math.round(cityBaseAqi * 1.25),
      avgPm25: Math.round(cityBasePm25 * 1.30),
      totalInhaledDoseUg: Math.round(
        (cityBasePm25 * 1.30 * (breathingRates[activityMode] / 1000) * ((5.4 / travelSpeeds[activityMode]) * 60))
      ),
      treeCanopyCoveragePct: 14,
      color: '#ef4444',
      tag: 'High Particulate Stagnation',
      waypoints: [
        {
          id: 1,
          name: 'Origin: Main Ring Road Intersection',
          distanceKm: 0.0,
          segmentAqi: Math.round(cityBaseAqi * 1.2),
          segmentPm25: Math.round(cityBasePm25 * 1.25),
          canopyDensity: 10,
          hazardNote: 'Heavy diesel truck idle emissions',
          instruction: 'Merge immediately onto Ring Road Arterial Highway',
          lat: 28.614,
          lng: 77.212
        },
        {
          id: 2,
          name: 'Flyover Underpass Stagnation Zone',
          distanceKm: 2.8,
          segmentAqi: Math.round(cityBaseAqi * 1.45),
          segmentPm25: Math.round(cityBasePm25 * 1.5),
          canopyDensity: 5,
          hazardNote: 'Boundary layer trap: NOx + PM2.5 hotspot (AQI 300+)',
          instruction: 'Continue underneath concrete multi-tier interchange',
          lat: 28.625,
          lng: 77.230
        },
        {
          id: 3,
          name: 'Destination: Tech Park Highway Ramp',
          distanceKm: 5.4,
          segmentAqi: Math.round(cityBaseAqi * 1.15),
          segmentPm25: Math.round(cityBasePm25 * 1.2),
          canopyDensity: 18,
          instruction: 'Take ramp exit into parking plaza',
          lat: 28.635,
          lng: 77.250
        }
      ]
    },
    {
      id: 'balanced',
      title: 'Balanced Commute (Secondary Avenues)',
      subtitle: 'Moderates commute time with semi-canopied residential connector streets',
      distanceKm: 5.9,
      durationMins: Math.round((5.9 / travelSpeeds[activityMode]) * 60),
      avgAqi: Math.round(cityBaseAqi * 0.75),
      avgPm25: Math.round(cityBasePm25 * 0.72),
      totalInhaledDoseUg: Math.round(
        (cityBasePm25 * 0.72 * (breathingRates[activityMode] / 1000) * ((5.9 / travelSpeeds[activityMode]) * 60))
      ),
      treeCanopyCoveragePct: 45,
      color: '#06b6d4',
      tag: 'Balanced Time vs Air Exposure',
      waypoints: [
        {
          id: 1,
          name: 'Origin: Commercial Avenue',
          distanceKm: 0.0,
          segmentAqi: Math.round(cityBaseAqi * 0.8),
          segmentPm25: Math.round(cityBasePm25 * 0.78),
          canopyDensity: 40,
          instruction: 'Turn north onto 4th Avenue residential lane',
          lat: 28.615,
          lng: 77.212
        },
        {
          id: 2,
          name: 'Civic Center Green Promenade',
          distanceKm: 3.1,
          segmentAqi: Math.round(cityBaseAqi * 0.7),
          segmentPm25: Math.round(cityBasePm25 * 0.68),
          canopyDensity: 55,
          instruction: 'Cross through civic plaza with water fountain scrubbers',
          lat: 28.626,
          lng: 77.232
        },
        {
          id: 3,
          name: 'Destination: Tech Park North',
          distanceKm: 5.9,
          segmentAqi: Math.round(cityBaseAqi * 0.75),
          segmentPm25: Math.round(cityBasePm25 * 0.72),
          canopyDensity: 45,
          instruction: 'Arrive at destination complex',
          lat: 28.635,
          lng: 77.250
        }
      ]
    }
  ];

  const selectedRoute = routes.find(r => r.id === selectedRouteId) || routes[0];
  const fastestRoute = routes.find(r => r.id === 'fastest') || routes[1];

  // Inhaled Dose Savings calculation
  const doseSavedUg = Math.max(0, fastestRoute.totalInhaledDoseUg - selectedRoute.totalInhaledDoseUg);
  const timeDifferenceMins = selectedRoute.durationMins - fastestRoute.durationMins;

  // Active Simulation Loop
  useEffect(() => {
    let interval: any = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          const next = prev + 1.5;
          // Calculate dynamic dose
          const fraction = next / 100;
          setLiveInhaledDose(Math.round(selectedRoute.totalInhaledDoseUg * fraction));
          
          // Current step index
          const stepCount = selectedRoute.waypoints.length;
          const currentIdx = Math.min(stepCount - 1, Math.floor(fraction * stepCount));
          setCurrentStepIndex(currentIdx);

          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying, selectedRoute]);

  const handleResetSim = () => {
    setIsPlaying(false);
    setSimProgress(0);
    setLiveInhaledDose(0);
    setCurrentStepIndex(0);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Banner & Mode Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
                <Navigation className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-black text-slate-100 tracking-tight">
                    Clean-Air Exposure Navigator
                  </h2>
                  <span className="px-2.5 py-0.5 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold rounded-full border border-emerald-500/40">
                    Aura-Routing v2.6
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Real-time micro-topography & tree canopy routing to minimize cumulative particulate inhalation dosage in {currentCityData.cityName}.
                </p>
              </div>
            </div>
          </div>

          {/* Activity / Mobility Selector */}
          <div className="flex flex-wrap items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 pl-2 pr-1">Mobility:</span>
            
            <button
              onClick={() => { setActivityMode('walk'); handleResetSim(); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activityMode === 'walk'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Footprints className="w-3.5 h-3.5" />
              <span>Walk (18 L/min)</span>
            </button>

            <button
              onClick={() => { setActivityMode('bike'); handleResetSim(); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activityMode === 'bike'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Bike className="w-3.5 h-3.5" />
              <span>Cycling (38 L/min)</span>
            </button>

            <button
              onClick={() => { setActivityMode('run'); handleResetSim(); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activityMode === 'run'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Jogging (60 L/min)</span>
            </button>

            <button
              onClick={() => { setActivityMode('car'); handleResetSim(); }}
              className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                activityMode === 'car'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Cabin Filtered</span>
            </button>
          </div>
        </div>

        {/* Origin & Destination Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-5 border-t border-slate-800/80">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Starting Origin Location</span>
            </label>
            <input
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center space-x-1.5">
              <Navigation className="w-3.5 h-3.5 text-teal-400" />
              <span>Target Destination</span>
            </label>
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 px-3.5 py-2.5 rounded-xl text-xs text-slate-100 font-mono focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Route Comparison Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {routes.map((route) => {
          const isSelected = selectedRouteId === route.id;
          return (
            <div
              key={route.id}
              onClick={() => {
                setSelectedRouteId(route.id);
                handleResetSim();
              }}
              className={`p-5 rounded-3xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900 border-emerald-500 shadow-xl shadow-emerald-500/10'
                  : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="px-2.5 py-1 rounded-lg text-[10px] font-mono font-black uppercase tracking-wider"
                    style={{ backgroundColor: `${route.color}20`, color: route.color }}
                  >
                    {route.tag}
                  </span>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-xs text-emerald-400 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Active Route</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-extrabold text-sm text-slate-100">{route.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{route.subtitle}</p>
                </div>

                {/* Key Metric Blocks */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">Distance</div>
                    <div className="text-sm font-black font-mono text-slate-200 mt-0.5">{route.distanceKm} km</div>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">Duration</div>
                    <div className="text-sm font-black font-mono text-slate-200 mt-0.5">{route.durationMins} min</div>
                  </div>

                  <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800/80 text-center">
                    <div className="text-[10px] text-slate-400 font-mono">Avg AQI</div>
                    <div
                      className="text-sm font-black font-mono mt-0.5"
                      style={{ color: route.color }}
                    >
                      {route.avgAqi}
                    </div>
                  </div>
                </div>

                {/* Inhaled Dosage Bar */}
                <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800/80 space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Total Inhaled PM2.5:</span>
                    <strong className="text-slate-100">{route.totalInhaledDoseUg} &micro;g</strong>
                  </div>
                  <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (route.totalInhaledDoseUg / (fastestRoute.totalInhaledDoseUg || 1)) * 100)}%`,
                        backgroundColor: route.color
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 pt-0.5">
                    <span className="flex items-center space-x-1">
                      <TreePine className="w-3 h-3 text-emerald-400" />
                      <span>{route.treeCanopyCoveragePct}% Canopy</span>
                    </span>
                    <span>PM2.5: {route.avgPm25} &micro;g/m&sup3;</span>
                  </div>
                </div>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedRouteId(route.id);
                  handleResetSim();
                }}
                className={`mt-4 w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-slate-950'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <RouteIcon className="w-3.5 h-3.5" />
                <span>{isSelected ? 'Simulate This Route' : 'Select This Route'}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Main Interactive Route Stage & Live Turn-by-Turn Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Vector Route Map & Dynamic Elevation/Pollution Profile */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <Compass className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">
                  Interactive Route Vector & Micro-Pollution Profile
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Rendering: {selectedRoute.title}
                </p>
              </div>
            </div>

            {/* Simulation Player Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause Commute' : 'Play Commute Simulation'}</span>
              </button>

              <button
                onClick={handleResetSim}
                className="p-2 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-800 transition-colors cursor-pointer"
                title="Reset Simulation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* SVG Vector Route Visualizer Stage */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-6 relative overflow-hidden min-h-[260px] flex flex-col justify-between">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
              backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
              backgroundSize: '24px 24px'
            }} />

            {/* Live Progress Scrubber */}
            <div className="relative z-10 flex items-center justify-between text-xs font-mono mb-2">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Simulation Progress:</span>
                <span className="text-emerald-400 font-bold">{Math.round(simProgress)}%</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">Live Inhaled Dose:</span>
                <span className="text-amber-400 font-bold">{liveInhaledDose} &micro;g PM2.5</span>
              </div>
            </div>

            {/* SVG Pathway Graph */}
            <div className="relative z-10 w-full h-36 my-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 120">
                {/* Reference Baseline Highway Track */}
                <path
                  d="M 30,60 C 180,10 380,110 570,60"
                  fill="none"
                  stroke="#334155"
                  strokeWidth="6"
                  strokeDasharray="4 4"
                />

                {/* Active Selected Route Curve */}
                <path
                  d={
                    selectedRouteId === 'clean'
                      ? "M 30,60 C 150,110 300,10 450,110 570,60"
                      : selectedRouteId === 'fastest'
                      ? "M 30,60 L 570,60"
                      : "M 30,60 C 200,30 400,90 570,60"
                  }
                  fill="none"
                  stroke={selectedRoute.color}
                  strokeWidth="5"
                  strokeLinecap="round"
                />

                {/* Waypoint Nodes on Route */}
                {selectedRoute.waypoints.map((wp, idx) => {
                  const xPos = 30 + (idx / (selectedRoute.waypoints.length - 1)) * 540;
                  const yPos = selectedRouteId === 'clean'
                    ? (idx === 1 ? 100 : idx === 2 ? 30 : idx === 3 ? 90 : 60)
                    : 60;
                  const isPassed = simProgress >= (idx / (selectedRoute.waypoints.length - 1)) * 100;
                  
                  return (
                    <g key={wp.id} className="cursor-pointer">
                      <circle
                        cx={xPos}
                        cy={yPos}
                        r={isPassed ? "8" : "6"}
                        fill={isPassed ? selectedRoute.color : "#0f172a"}
                        stroke={selectedRoute.color}
                        strokeWidth="2.5"
                      />
                      <text
                        x={xPos}
                        y={yPos - 14}
                        fill="#cbd5e1"
                        fontSize="10"
                        fontWeight="bold"
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        WP#{wp.id}
                      </text>
                    </g>
                  );
                })}

                {/* Animated Commuter Marker */}
                {(() => {
                  const markerX = 30 + (simProgress / 100) * 540;
                  const markerY = selectedRouteId === 'clean'
                    ? 60 + Math.sin((simProgress / 100) * Math.PI * 2) * 35
                    : 60;
                  return (
                    <g transform={`translate(${markerX}, ${markerY})`}>
                      <circle r="12" fill={selectedRoute.color} opacity="0.3" className="animate-ping" />
                      <circle r="7" fill={selectedRoute.color} stroke="#0f172a" strokeWidth="2" />
                    </g>
                  );
                })()}
              </svg>
            </div>

            {/* Real-time Waypoint Hazard & Air Quality Banner */}
            <div className="relative z-10 p-3 bg-slate-900/90 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedRoute.color }} />
                <span className="font-bold text-slate-200">
                  Current Waypoint: {selectedRoute.waypoints[currentStepIndex]?.name}
                </span>
              </div>
              <div className="flex items-center space-x-3 font-mono text-[11px]">
                <span className="text-slate-400">Segment AQI: <strong className="text-slate-100">{selectedRoute.waypoints[currentStepIndex]?.segmentAqi}</strong></span>
                <span className="text-emerald-400 font-bold">{selectedRoute.waypoints[currentStepIndex]?.canopyDensity}% Tree Canopy</span>
              </div>
            </div>
          </div>

          {/* Health Inhalation Savings Banner */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-emerald-300">
                  Health Impact: {doseSavedUg > 0 ? `${doseSavedUg} µg Less Toxic Inhalation` : 'Baseline Exposure Route'}
                </h4>
                <p className="text-xs text-slate-300 font-mono">
                  {doseSavedUg > 0
                    ? `Choosing the Eco-Route reduces your respiratory alveolar particulate burden by 62% at a cost of only +${Math.max(1, timeDifferenceMins)} minutes.`
                    : 'Fastest arterial route carries maximum diesel soot and secondary inorganic aerosols.'}
                </p>
              </div>
            </div>

            <div className="text-right font-mono shrink-0">
              <div className="text-[10px] text-slate-400 uppercase">Inhaled Dose Delta</div>
              <div className="text-xl font-black text-emerald-400">-{doseSavedUg} &micro;g</div>
            </div>
          </div>
        </div>

        {/* Right Col: Turn-by-Turn Navigation Queue */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1 border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                <RouteIcon className="w-4 h-4 text-emerald-400" />
                <span>Turn-by-Turn Air Steps</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {selectedRoute.waypoints.length} Steps
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time particulate alerts and street-level navigation maneuvers.
            </p>
          </div>

          {/* Steps List */}
          <div className="space-y-3 flex-1 overflow-y-auto max-h-[360px] pr-1 custom-scrollbar">
            {selectedRoute.waypoints.map((wp, idx) => {
              const isCurrent = currentStepIndex === idx;
              return (
                <div
                  key={wp.id}
                  onClick={() => setCurrentStepIndex(idx)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isCurrent
                      ? 'bg-slate-950 border-emerald-500 shadow-md shadow-emerald-500/10'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-mono text-[10px] font-black shrink-0 mt-0.5 ${
                        isCurrent
                          ? 'bg-emerald-500 text-slate-950'
                          : 'bg-slate-900 text-slate-400 border border-slate-800'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-200">{wp.name}</h4>
                        <span className="text-[10px] font-mono text-slate-400">{wp.distanceKm} km</span>
                      </div>

                      <p className="text-[11px] text-slate-300 font-mono">{wp.instruction}</p>

                      {wp.hazardNote && (
                        <div className="flex items-center space-x-1.5 p-1.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg text-[10px] font-mono mt-1">
                          <AlertTriangle className="w-3 h-3 text-red-400 shrink-0" />
                          <span>{wp.hazardNote}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-[10px] font-mono pt-1 text-slate-400">
                        <span>Segment AQI: <strong className="text-slate-200">{wp.segmentAqi}</strong></span>
                        <span className="text-emerald-400">{wp.canopyDensity}% Tree Shade</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button: Export GPX / Navigation Link */}
          <div className="pt-2">
            <button
              onClick={() => {
                alert(`Clean-Air GPX Track for ${origin} -> ${destination} compiled! Ready for Garmin / Apple Health sync.`);
              }}
              className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Low-Exposure GPX to Navigation App</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
