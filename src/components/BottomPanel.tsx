import React, { useState } from 'react';
import { 
  ChevronUp, 
  ChevronDown, 
  Sparkles, 
  TrendingUp, 
  Sliders, 
  Navigation, 
  Flame, 
  ShieldAlert, 
  Activity, 
  CheckCircle2, 
  Radio,
  FileSpreadsheet
} from 'lucide-react';
import { AQIMeasurement } from '../types';

interface BottomPanelProps {
  currentCityData: AQIMeasurement;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onTriggerForecastAI?: () => void;
  isLoadingAI?: boolean;
}

export const BottomPanel: React.FC<BottomPanelProps> = ({
  currentCityData,
  activeTab,
  setActiveTab,
  onTriggerForecastAI,
  isLoadingAI = false
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedHorizon, setSelectedHorizon] = useState<'now' | '6h' | '12h' | '24h' | '48h' | '72h'>('now');

  const getAqiColor = (aqi: number) => {
    if (aqi <= 50) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (aqi <= 100) return 'text-lime-400 border-lime-500/30 bg-lime-500/10';
    if (aqi <= 150) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (aqi <= 200) return 'text-orange-400 border-orange-500/30 bg-orange-500/10';
    if (aqi <= 300) return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
    return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
  };

  // Forecast offset projections based on current AQI
  const forecastHorizons = [
    { id: 'now', label: 'NOW', aqi: currentCityData.aqi, trend: 'baseline' },
    { id: '6h', label: '+6H', aqi: Math.round(currentCityData.aqi * 1.08), trend: 'rising' },
    { id: '12h', label: '+12H', aqi: Math.round(currentCityData.aqi * 1.15), trend: 'peak' },
    { id: '24h', label: '+24H', aqi: Math.round(currentCityData.aqi * 0.94), trend: 'dispersion' },
    { id: '48h', label: '+48H', aqi: Math.round(currentCityData.aqi * 0.88), trend: 'clearing' },
    { id: '72h', label: '+72H', aqi: Math.round(currentCityData.aqi * 0.82), trend: 'stable' }
  ];

  const getPollutantVal = (name: string, fallback: number): number => {
    if (Array.isArray(currentCityData.pollutants)) {
      const p = currentCityData.pollutants.find(item => item.name === name);
      return p ? p.value : fallback;
    }
    return (currentCityData.pollutants as any)?.[name] ?? fallback;
  };

  const pm25Val = getPollutantVal('PM2.5', 185);
  const pm10Val = getPollutantVal('PM10', 260);
  const no2Val = getPollutantVal('NO2', 45);
  const o3Val = getPollutantVal('O3', 55);

  return (
    <footer className="w-full bg-slate-950/95 backdrop-blur-md border-t border-slate-800 text-xs z-30 transition-all duration-200">
      {/* Expanded Ticker Drawer */}
      {isExpanded && (
        <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Detailed Pollutants */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Detailed Atmospheric Gas Matrix</span>
              <span className="font-mono text-emerald-400">WHO 2021 Reference</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 text-center">
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PM2.5 / Limit</span>
                <span className="font-bold text-slate-200">{pm25Val}</span>
                <span className="text-[9px] text-rose-400 block font-mono">
                  {Math.round((pm25Val / 15) * 100)}% WHO
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">PM10 / Limit</span>
                <span className="font-bold text-slate-200">{pm10Val}</span>
                <span className="text-[9px] text-amber-400 block font-mono">
                  {Math.round((pm10Val / 45) * 100)}% WHO
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">NO2 / Limit</span>
                <span className="font-bold text-slate-200">{no2Val}</span>
                <span className="text-[9px] text-emerald-400 block font-mono">
                  {Math.round((no2Val / 25) * 100)}% WHO
                </span>
              </div>
            </div>
          </div>

          {/* Forecast Scrubber */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-semibold uppercase tracking-wider">72h Trajectory Timeline Scrubber</span>
              <button 
                onClick={() => setActiveTab('forecast')}
                className="text-emerald-400 hover:underline flex items-center gap-0.5 text-[10px]"
              >
                Full PINN Forecast &rarr;
              </button>
            </div>
            <div className="flex items-center justify-between gap-1">
              {forecastHorizons.map(h => (
                <button
                  key={h.id}
                  onClick={() => setSelectedHorizon(h.id as any)}
                  className={`flex-1 p-1.5 rounded-lg border text-center transition-all ${
                    selectedHorizon === h.id 
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300 font-bold scale-105' 
                      : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span className="text-[9px] block text-slate-500">{h.label}</span>
                  <span className="text-xs font-mono">{h.aqi}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col gap-1.5 justify-center">
            <div className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              Instant Spatial Solvers
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (onTriggerForecastAI) onTriggerForecastAI();
                  setActiveTab('forecast');
                }}
                disabled={isLoadingAI}
                className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isLoadingAI ? 'Analyzing...' : 'Run Gemini Forecast'}</span>
              </button>
              <button
                onClick={() => setActiveTab('route_nav')}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg flex items-center justify-center gap-1 border border-slate-700 transition-colors"
                title="Clean-Air Routing"
              >
                <Navigation className="w-3.5 h-3.5 text-cyan-400" />
                <span>Nav</span>
              </button>
              <button
                onClick={() => setActiveTab('simulator')}
                className="py-1.5 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg flex items-center justify-center gap-1 border border-slate-700 transition-colors"
                title="Policy Simulator"
              >
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>Sim</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Persistent Bottom Bar */}
      <div className="h-10 px-3 flex items-center justify-between gap-3">
        {/* Left: Current Telemetry Pill */}
        <div className="flex items-center gap-2 overflow-x-auto py-1 custom-scrollbar">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-slate-200 text-xs">{currentCityData.cityName}</span>
            <span className={`px-1.5 py-0.2 rounded font-mono font-bold text-xs border ${getAqiColor(currentCityData.aqi)}`}>
              AQI {currentCityData.aqi}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 font-mono text-[11px] text-slate-400 shrink-0">
            <span className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800">
              PM2.5: <strong className="text-slate-200">{pm25Val}</strong>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800">
              PM10: <strong className="text-slate-200">{pm10Val}</strong>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800">
              NO2: <strong className="text-slate-200">{no2Val}</strong>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-900/80 border border-slate-800">
              O3: <strong className="text-slate-200">{o3Val}</strong>
            </span>
          </div>
        </div>

        {/* Center: System Status */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Gemini 2.5 Active
          </span>
          <span className="text-slate-600">|</span>
          <span>PINN Epoch: 450</span>
          <span className="text-slate-600">|</span>
          <span>GNN Edges: 10,000</span>
        </div>

        {/* Right: Expand Toggle & Quick Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-emerald-400 transition-colors text-[11px]"
            title={isExpanded ? 'Collapse Bottom Ticker' : 'Expand Live Telemetry Ticker'}
          >
            {isExpanded ? (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>Hide Ticker</span>
              </>
            ) : (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Live Ticker</span>
              </>
            )}
          </button>
        </div>
      </div>
    </footer>
  );
};
