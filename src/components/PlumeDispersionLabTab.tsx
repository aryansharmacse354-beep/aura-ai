import React, { useState, useEffect, useRef } from 'react';
import { 
  Flame, 
  Wind, 
  Layers, 
  Sliders, 
  Activity, 
  AlertTriangle, 
  ShieldAlert, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Factory, 
  Truck, 
  Building2, 
  TreePine, 
  RefreshCw,
  Info,
  Maximize2,
  TrendingUp,
  Cpu
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  AreaChart, 
  Area 
} from 'recharts';
import { AQIMeasurement } from '../types';

interface PlumeDispersionLabTabProps {
  currentCityData: AQIMeasurement;
}

// Pasquill-Gifford Stability Classes
type StabilityClass = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';

interface EmitterPreset {
  id: string;
  name: string;
  category: 'industrial' | 'traffic' | 'wildfire' | 'smelter';
  defaultEmissionRateGPerSec: number; // Q in g/s
  defaultStackHeightM: number; // hs in meters
  defaultPlumeRiseM: number; // delta_h in meters
  icon: any;
  description: string;
}

export const PlumeDispersionLabTab: React.FC<PlumeDispersionLabTabProps> = ({ currentCityData }) => {
  // Preset Selection
  const emitterPresets: EmitterPreset[] = [
    {
      id: 'coal_power',
      name: 'Supercritical Thermal Coal Plant',
      category: 'industrial',
      defaultEmissionRateGPerSec: 180,
      defaultStackHeightM: 150,
      defaultPlumeRiseM: 60,
      icon: Factory,
      description: 'Continuous heavy SO2 and PM2.5 point source with high thermal buoyancy plume rise.'
    },
    {
      id: 'highway_arterial',
      name: 'Major Highway Freight Arterial',
      category: 'traffic',
      defaultEmissionRateGPerSec: 95,
      defaultStackHeightM: 2,
      defaultPlumeRiseM: 5,
      icon: Truck,
      description: 'Ground-level line source representing 10,000+ diesel trucks/hr with zero stack buoyancy.'
    },
    {
      id: 'stubble_burn',
      name: 'Agricultural Stubble / Biomass Blaze',
      category: 'wildfire',
      defaultEmissionRateGPerSec: 260,
      defaultStackHeightM: 10,
      defaultPlumeRiseM: 40,
      icon: Flame,
      description: 'Intense seasonal crop burning generating massive respirable particulate mass accretion.'
    },
    {
      id: 'steel_smelter',
      name: 'Primary Steel Smelting Complex',
      category: 'smelter',
      defaultEmissionRateGPerSec: 140,
      defaultStackHeightM: 90,
      defaultPlumeRiseM: 35,
      icon: Building2,
      description: 'Industrial furnace emission with mixed fugitive and stack inorganic particulates.'
    }
  ];

  const [selectedEmitterId, setSelectedEmitterId] = useState('coal_power');
  const selectedEmitter = emitterPresets.find(e => e.id === selectedEmitterId) || emitterPresets[0];

  // Plume Simulation Physics Parameters
  const [emissionRateQ, setEmissionRateQ] = useState(selectedEmitter.defaultEmissionRateGPerSec);
  const [stackHeightHs, setStackHeightHs] = useState(selectedEmitter.defaultStackHeightM);
  const [plumeRiseDeltaH, setPlumeRiseDeltaH] = useState(selectedEmitter.defaultPlumeRiseM);
  const [windSpeedU, setWindSpeedU] = useState(Math.max(1.5, (currentCityData.weather?.windSpeedKmh || 12) / 3.6)); // m/s
  const [windDirectionDeg, setWindDirectionDeg] = useState(currentCityData.weather?.windDirectionDeg || 240); // Meteorological wind direction
  const [stabilityClass, setStabilityClass] = useState<StabilityClass>('D'); // D = Neutral
  const [inversionLidHeightM, setInversionLidHeightM] = useState(currentCityData.weather?.boundaryLayerHeightM || 550);

  // Active Control / Abatement Scrubbers
  const [fgdScrubberActive, setFgdScrubberActive] = useState(false); // -90% SO2/PM
  const [espPrecipitatorActive, setEspPrecipitatorActive] = useState(false); // -95% PM
  const [operationalCurtailment, setOperationalCurtailment] = useState(false); // -50% Load

  // Canvas Reference for 2D Plume Map
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Update parameters when emitter preset changes
  const handleSelectEmitter = (emitter: EmitterPreset) => {
    setSelectedEmitterId(emitter.id);
    setEmissionRateQ(emitter.defaultEmissionRateGPerSec);
    setStackHeightHs(emitter.defaultStackHeightM);
    setPlumeRiseDeltaH(emitter.defaultPlumeRiseM);
  };

  // Effective Stack Height H = hs + delta_h
  const effectiveStackHeightH = stackHeightHs + plumeRiseDeltaH;

  // Compute Net Effective Q with abatement
  let netQ = emissionRateQ;
  if (fgdScrubberActive) netQ *= 0.10;
  if (espPrecipitatorActive) netQ *= 0.05;
  if (operationalCurtailment) netQ *= 0.50;

  // Pasquill-Gifford dispersion parameters calculation
  // sigma_y = a * x^0.894, sigma_z = c * x^d + f
  const getDispersionCoefficients = (xKm: number, sClass: StabilityClass) => {
    const xM = xKm * 1000;
    let a = 0.22, c = 0.20, d = 1.0;
    switch (sClass) {
      case 'A': a = 0.22; c = 0.20; d = 1.0; break;
      case 'B': a = 0.16; c = 0.12; d = 1.0; break;
      case 'C': a = 0.11; c = 0.08; d = 0.9; break;
      case 'D': a = 0.08; c = 0.06; d = 0.85; break;
      case 'E': a = 0.06; c = 0.03; d = 0.8; break;
      case 'F': a = 0.04; c = 0.016; d = 0.75; break;
    }
    const sigmaY = Math.max(1, a * Math.pow(xM, 0.894));
    const sigmaZ = Math.max(1, c * Math.pow(xM, d));
    return { sigmaY, sigmaZ };
  };

  // Gaussian Ground-Level Centerline Concentration C(x, y=0, z=0) in ug/m3
  const calcGroundConcentration = (xKm: number): number => {
    if (xKm <= 0.05) return 0;
    const { sigmaY, sigmaZ } = getDispersionCoefficients(xKm, stabilityClass);
    const u = Math.max(0.5, windSpeedU);
    const H = effectiveStackHeightH;

    // Standard Gaussian Plume with ground reflection: C = (Q / (pi * u * sigma_y * sigma_z)) * exp(-H^2 / (2 * sigma_z^2))
    // Convert Q (g/s) to ug/s by 1e6
    const factor = (netQ * 1e6) / (Math.PI * u * sigmaY * sigmaZ);
    const exponent = - (H * H) / (2 * sigmaZ * sigmaZ);
    const conc = factor * Math.exp(exponent);

    return Math.round(Math.max(0, conc));
  };

  // Generate Downwind Profile Data (0 to 25 km)
  const downwindDistanceData = Array.from({ length: 26 }, (_, i) => {
    const distanceKm = i;
    const concentrationUgM3 = calcGroundConcentration(distanceKm);
    return {
      distanceKm,
      concentration: concentrationUgM3,
      baselineConcentration: calcGroundConcentration(distanceKm) * (netQ < emissionRateQ ? (emissionRateQ / netQ) : 1),
      aqiImpact: Math.min(500, Math.round(concentrationUgM3 * 0.85))
    };
  });

  // Calculate Peak Ground Touchdown Location and Max Concentration
  let maxConc = 0;
  let maxDistanceKm = 0;
  downwindDistanceData.forEach(d => {
    if (d.concentration > maxConc) {
      maxConc = d.concentration;
      maxDistanceKm = d.distanceKm;
    }
  });

  // Affected Population Estimation (assume 2,500 people per km2 in plume footprint)
  const plumeFootprintKm2 = Math.round(maxDistanceKm * 3.5);
  const estimatedExposedPopulation = plumeFootprintKm2 * 2800;

  // Render 2D Canvas Dispersion Contour
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.fillStyle = '#020617';
    ctx.fillRect(0, 0, width, height);

    // Draw coordinate grid
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Source Emitter position (left center)
    const sourceX = 60;
    const sourceY = height / 2;

    // Draw Gaussian Plume Envelope
    const steps = 40;
    const maxRangeKm = 25;
    const pxPerKm = (width - sourceX - 40) / maxRangeKm;

    // Draw Plume Contour Bands (Outer to Inner)
    const bands = [
      { alpha: 0.15, scale: 2.2, color: 'rgba(239, 68, 68, 0.15)' },
      { alpha: 0.35, scale: 1.5, color: 'rgba(245, 158, 11, 0.30)' },
      { alpha: 0.60, scale: 0.8, color: 'rgba(239, 68, 68, 0.65)' }
    ];

    bands.forEach(band => {
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);

      // Top plume edge
      for (let i = 1; i <= steps; i++) {
        const xKm = (i / steps) * maxRangeKm;
        const { sigmaY } = getDispersionCoefficients(xKm, stabilityClass);
        const yPx = sigmaY * band.scale * 0.08;
        const drawX = sourceX + xKm * pxPerKm;
        const drawY = sourceY - yPx;
        ctx.lineTo(drawX, drawY);
      }

      // Bottom plume edge (reverse)
      for (let i = steps; i >= 1; i--) {
        const xKm = (i / steps) * maxRangeKm;
        const { sigmaY } = getDispersionCoefficients(xKm, stabilityClass);
        const yPx = sigmaY * band.scale * 0.08;
        const drawX = sourceX + xKm * pxPerKm;
        const drawY = sourceY + yPx;
        ctx.lineTo(drawX, drawY);
      }

      ctx.closePath();
      ctx.fillStyle = band.color;
      ctx.fill();
    });

    // Draw Centerline Trajectory
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(sourceX, sourceY);
    ctx.lineTo(width - 20, sourceY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw Wind Direction Indicator Arrow
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(width - 15, sourceY);
    ctx.lineTo(width - 25, sourceY - 6);
    ctx.lineTo(width - 25, sourceY + 6);
    ctx.fill();

    // Draw Source Stack Marker
    ctx.fillStyle = '#10b981';
    ctx.beginPath();
    ctx.arc(sourceX, sourceY, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw Peak Ground Touchdown Marker
    const peakPxX = sourceX + maxDistanceKm * pxPerKm;
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(peakPxX, sourceY, 6, 0, Math.PI * 2);
    ctx.fill();

    // Label on Peak
    ctx.fillStyle = '#f87171';
    ctx.font = '10px monospace';
    ctx.fillText(`Peak Touchdown (${maxDistanceKm}km, ${maxConc}µg/m³)`, peakPxX - 40, sourceY - 14);

    // Label on Source
    ctx.fillStyle = '#34d399';
    ctx.font = '10px monospace';
    ctx.fillText(`Stack Origin (H=${effectiveStackHeightH}m)`, sourceX - 35, sourceY + 22);

  }, [selectedEmitterId, netQ, effectiveStackHeightH, windSpeedU, stabilityClass, maxDistanceKm, maxConc]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center space-x-2.5">
              <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-2xl border border-cyan-500/30">
                <Flame className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-black text-slate-100 tracking-tight">
                    Gaussian Plume Dispersion & Point-Source Physics Lab
                  </h2>
                  <span className="px-2.5 py-0.5 bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold rounded-full border border-cyan-500/40">
                    Pasquill-Gifford Solvers
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Physics-based steady-state Gaussian plume dispersion modeling with atmospheric turbulence, stack buoyancy, and downwind ground deposition in {currentCityData.cityName}.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-right font-mono">
              <div className="text-[10px] text-slate-400">Boundary Layer Lid (zi)</div>
              <div className="text-sm font-black text-emerald-400">{inversionLidHeightM} meters</div>
            </div>
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-right font-mono">
              <div className="text-[10px] text-slate-400">Net Source Rate (Q)</div>
              <div className="text-sm font-black text-amber-400">{Math.round(netQ)} g/sec</div>
            </div>
          </div>
        </div>

        {/* Preset Emitters Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800/80">
          {emitterPresets.map((preset) => {
            const Icon = preset.icon;
            const isSelected = selectedEmitterId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => handleSelectEmitter(preset)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                  isSelected
                    ? 'bg-slate-950 border-cyan-500 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl shrink-0 ${
                    isSelected ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-900 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="space-y-0.5 overflow-hidden">
                  <h4 className="font-bold text-xs text-slate-200 truncate">{preset.name}</h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 leading-tight">{preset.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Physics Sliders & Environmental Knobs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Knob 1: Stack Height & Plume Rise */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
              <Factory className="w-3.5 h-3.5 text-cyan-400" />
              <span>Stack Geometry (H)</span>
            </h4>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">{effectiveStackHeightH}m Effective</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                <span>Physical Stack (hs):</span>
                <span className="text-slate-200">{stackHeightHs}m</span>
              </div>
              <input
                type="range"
                min="0"
                max="250"
                value={stackHeightHs}
                onChange={(e) => setStackHeightHs(parseInt(e.target.value) || 0)}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                <span>Buoyancy Plume Rise (&Delta;h):</span>
                <span className="text-slate-200">{plumeRiseDeltaH}m</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={plumeRiseDeltaH}
                onChange={(e) => setPlumeRiseDeltaH(parseInt(e.target.value) || 0)}
                className="w-full accent-cyan-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Knob 2: Wind Speed & Vector */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
              <Wind className="w-3.5 h-3.5 text-emerald-400" />
              <span>Advection Wind Vector</span>
            </h4>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">{windSpeedU.toFixed(1)} m/s</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                <span>Wind Speed (u):</span>
                <span className="text-slate-200">{windSpeedU.toFixed(1)} m/s ({(windSpeedU * 3.6).toFixed(0)} km/h)</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="20.0"
                step="0.5"
                value={windSpeedU}
                onChange={(e) => setWindSpeedU(parseFloat(e.target.value) || 1.5)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-slate-400 text-[11px] font-mono">
                <span>Wind Compass Azimuth:</span>
                <span className="text-slate-200">{windDirectionDeg}&deg; (WSW)</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={windDirectionDeg}
                onChange={(e) => setWindDirectionDeg(parseInt(e.target.value) || 0)}
                className="w-full accent-emerald-500 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Knob 3: Pasquill Stability Class */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-400" />
              <span>Turbulence Stability Class</span>
            </h4>
            <span className="text-[10px] font-mono text-teal-400 font-bold">Class {stabilityClass}</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {(['A', 'B', 'C', 'D', 'E', 'F'] as StabilityClass[]).map((sc) => (
              <button
                key={sc}
                onClick={() => setStabilityClass(sc)}
                className={`py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer ${
                  stabilityClass === sc
                    ? 'bg-teal-500 text-slate-950 shadow-md shadow-teal-500/20'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {sc}
              </button>
            ))}
          </div>

          <div className="text-[10px] font-mono text-slate-400 leading-tight">
            {stabilityClass === 'A' && 'A: Extremely Unstable (Intense solar looping plume)'}
            {stabilityClass === 'B' && 'B: Moderately Unstable'}
            {stabilityClass === 'C' && 'C: Slightly Unstable'}
            {stabilityClass === 'D' && 'D: Neutral (Overcast / Heavy wind coning)'}
            {stabilityClass === 'E' && 'E: Slightly Stable (Night inversion fanning)'}
            {stabilityClass === 'F' && 'F: Moderately Stable (High stagnation trap)'}
          </div>
        </div>

        {/* Knob 4: Abatement & Control Mitigations */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 space-y-3 shadow-xl">
          <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
            <span>Emission Abatement Scrubbers</span>
          </h4>

          <div className="space-y-2 text-xs">
            <label className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <input
                type="checkbox"
                checked={fgdScrubberActive}
                onChange={(e) => setFgdScrubberActive(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-300 font-mono">FGD Wet Scrubber (-90%)</span>
            </label>

            <label className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <input
                type="checkbox"
                checked={espPrecipitatorActive}
                onChange={(e) => setEspPrecipitatorActive(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-300 font-mono">ESP Precipitator (-95%)</span>
            </label>

            <label className="flex items-center space-x-2 p-2 rounded-xl bg-slate-950 border border-slate-800/80 cursor-pointer">
              <input
                type="checkbox"
                checked={operationalCurtailment}
                onChange={(e) => setOperationalCurtailment(e.target.checked)}
                className="w-3.5 h-3.5 accent-emerald-500 cursor-pointer"
              />
              <span className="text-[11px] text-slate-300 font-mono">50% Curtailment Load</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main 2D Dispersion Map Canvas & Downwind Concentration Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 2D Spatial Plume Contour Stage */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-xl">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-slate-100">
                  2D Downwind Isopleth Dispersion Canvas
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Ground-level concentration contours over 25 km downwind axis
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="text-slate-400">Peak Downwind Touchdown:</span>
              <strong className="text-red-400">{maxDistanceKm} km ({maxConc} &micro;g/m&sup3;)</strong>
            </div>
          </div>

          {/* Canvas Component */}
          <div className="w-full bg-slate-950 rounded-2xl border border-slate-800 p-2 overflow-hidden flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={720}
              height={260}
              className="w-full h-auto max-h-[260px] rounded-xl"
            />
          </div>

          {/* Affected Zone Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-0.5">
              <div className="text-[10px] font-mono text-slate-400">Plume Footprint Area</div>
              <div className="text-lg font-black font-mono text-cyan-400">{plumeFootprintKm2} km&sup2;</div>
              <div className="text-[10px] text-slate-400">Downwind ground exposure zone</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-0.5">
              <div className="text-[10px] font-mono text-slate-400">Estimated Exposed Citizens</div>
              <div className="text-lg font-black font-mono text-amber-400">{estimatedExposedPopulation.toLocaleString()}</div>
              <div className="text-[10px] text-slate-400">Based on district population density</div>
            </div>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 space-y-0.5">
              <div className="text-[10px] font-mono text-slate-400">Abatement Reduction</div>
              <div className="text-lg font-black font-mono text-emerald-400">
                {Math.round(((emissionRateQ - netQ) / emissionRateQ) * 100)}%
              </div>
              <div className="text-[10px] text-slate-400">Active flue scrubber efficiency</div>
            </div>
          </div>
        </div>

        {/* Right Col: Distance vs Ground Concentration Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1 border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Ground Concentration vs Distance</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              Centerline Ground Profile C(x, y=0, z=0) (&micro;g/m&sup3;)
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={downwindDistanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="concGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="distanceKm" stroke="#64748b" fontSize={10} tickFormatter={(val) => `${val}km`} />
                <YAxis stroke="#64748b" fontSize={10} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px', fontFamily: 'monospace' }}
                  formatter={(val: any) => [`${val} µg/m³`, 'Ground Conc']}
                  labelFormatter={(val) => `Downwind: ${val} km`}
                />
                <Area type="monotone" dataKey="concentration" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#concGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-mono space-y-1">
            <div className="text-slate-300 font-bold flex items-center justify-between">
              <span>Analytical Equation:</span>
              <span className="text-cyan-400">Gaussian Reflection</span>
            </div>
            <p className="text-[10px] text-slate-400">
              C(x,y,z) = (Q / 2&pi;u&sigma;y&sigma;z) &times; exp(-y&sup2;/2&sigma;y&sup2;) &times; [exp(-(z-H)&sup2;/2&sigma;z&sup2;) + exp(-(z+H)&sup2;/2&sigma;z&sup2;)]
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
