import React, { useState } from 'react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Area, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { CITIES_AQI_DATA } from '../data/mockData';
import { AQIMeasurement, ForecastPoint } from '../types';
import { ArrowLeftRight, TrendingUp, TrendingDown, MapPin, ShieldAlert, Sparkles } from 'lucide-react';

interface ForecastComparisonProps {
  primaryCityData: AQIMeasurement;
  primaryForecast: ForecastPoint[];
}

export const ForecastComparison: React.FC<ForecastComparisonProps> = ({
  primaryCityData,
  primaryForecast,
}) => {
  // Default secondary city (e.g. Mumbai if primary is Delhi, or Delhi if primary is Mumbai)
  const defaultSecondaryId = primaryCityData.cityId === 'mumbai' ? 'delhi' : primaryCityData.cityId === 'delhi' ? 'mumbai' : 'delhi';
  const [secondaryCityId, setSecondaryCityId] = useState<string>(defaultSecondaryId);

  const secondaryCityData = CITIES_AQI_DATA.find((c) => c.cityId === secondaryCityId) || CITIES_AQI_DATA[1];

  // Scale primary forecast trajectory according to secondary city baseline AQI ratio
  const ratio = (secondaryCityData?.aqi || 1) / (primaryCityData?.aqi || 1);
  const comparisonChartData = (primaryForecast || []).map((pt) => {
    const secAqi = Math.round(pt.aqi * ratio);
    const secPm25 = Math.round(pt.pm25 * ratio);
    const secPm10 = Math.round(pt.pm10 * ratio);
    return {
      time: pt.time,
      primaryAQI: pt.aqi,
      primaryPM25: pt.pm25,
      secondaryAQI: secAqi,
      secondaryPM25: secPm25,
      aqiDelta: pt.aqi - secAqi,
    };
  });

  const aqiDiff = primaryCityData.aqi - secondaryCityData.aqi;
  const isPrimaryHigher = aqiDiff >= 0;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
      {/* Header & City Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400">
            <ArrowLeftRight className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
              <span>Multi-District Atmospheric Forecast Comparison</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                Side-by-Side Analytics
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Cross-comparing air quality trajectories, particulate speciation, and meteorology
            </p>
          </div>
        </div>

        {/* Secondary District Selector */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1.5 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 font-medium text-[11px] pl-1 flex items-center space-x-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compare with:</span>
          </span>
          <select
            value={secondaryCityId}
            onChange={(e) => setSecondaryCityId(e.target.value)}
            className="bg-slate-900 text-emerald-300 font-bold py-1 px-2.5 rounded-lg border border-slate-700 focus:outline-none cursor-pointer"
          >
            {CITIES_AQI_DATA.filter((c) => c.cityId !== primaryCityData.cityId).map((city) => (
              <option key={city.cityId} value={city.cityId}>
                {city.cityName} (AQI {city.aqi}) &bull; {city.country.replace('India (', '').replace(')', '')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Side-by-Side Metric Comparison Header Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
        {/* Primary City Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-emerald-500/30 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider">Primary Target</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold text-[10px]">
              {primaryCityData.aqiCategory}
            </span>
          </div>
          <h4 className="font-bold text-slate-100 text-base">{primaryCityData.cityName}</h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-emerald-400">{primaryCityData.aqi}</span>
            <span className="text-slate-400 text-xs">AQI</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[11px] text-slate-300">
            <div>PM2.5: <span className="font-mono font-bold text-slate-100">{primaryCityData?.pollutants?.find(p => p.name === 'PM2.5')?.value || 'N/A'} µg/m³</span></div>
            <div>NO2: <span className="font-mono font-bold text-slate-100">{primaryCityData?.pollutants?.find(p => p.name === 'NO2')?.value || 'N/A'} µg/m³</span></div>
            <div>Wind: <span className="font-mono text-slate-300">{primaryCityData?.weather?.windSpeedKmh || 0} km/h</span></div>
            <div>Temp: <span className="font-mono text-slate-300">{primaryCityData?.weather?.tempC || 0}°C</span></div>
          </div>
        </div>

        {/* Delta Summary Comparison Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Pollution Variance</span>
            <span className="p-1.5 bg-slate-800 rounded-lg text-slate-300">
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="text-center space-y-1">
            <div className="text-[11px] text-slate-400 font-medium">AQI Index Gap</div>
            <div className={`text-2xl font-black font-mono flex items-center justify-center space-x-1 ${
              isPrimaryHigher ? 'text-amber-400' : 'text-emerald-400'
            }`}>
              {isPrimaryHigher ? <TrendingUp className="w-5 h-5 text-amber-400" /> : <TrendingDown className="w-5 h-5 text-emerald-400" />}
              <span>{Math.abs(aqiDiff)} AQI ({isPrimaryHigher ? '+' : '-'}{Math.round((Math.abs(aqiDiff) / (secondaryCityData.aqi || 1)) * 100)}%)</span>
            </div>
            <p className="text-[11px] text-slate-300 font-medium">
              {primaryCityData.cityName} is <span className="font-bold text-slate-100">{isPrimaryHigher ? 'more severely polluted' : 'cleaner'}</span> than {secondaryCityData.cityName}.
            </p>
          </div>

          <div className="p-2 bg-slate-900/90 rounded-lg border border-slate-800 text-[10px] text-slate-400 text-center">
            Diff Inversion Layer: {Math.abs(primaryCityData.weather.boundaryLayerHeightM - secondaryCityData.weather.boundaryLayerHeightM)}m
          </div>
        </div>

        {/* Secondary City Card */}
        <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">Comparison Target</span>
            <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded font-bold text-[10px]">
              {secondaryCityData.aqiCategory}
            </span>
          </div>
          <h4 className="font-bold text-slate-100 text-base">{secondaryCityData.cityName}</h4>
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-black font-mono text-amber-400">{secondaryCityData.aqi}</span>
            <span className="text-slate-400 text-xs">AQI</span>
          </div>
          <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 gap-1 text-[11px] text-slate-300">
            <div>PM2.5: <span className="font-mono font-bold text-slate-100">{secondaryCityData?.pollutants?.find(p => p.name === 'PM2.5')?.value || 'N/A'} µg/m³</span></div>
            <div>NO2: <span className="font-mono font-bold text-slate-100">{secondaryCityData?.pollutants?.find(p => p.name === 'NO2')?.value || 'N/A'} µg/m³</span></div>
            <div>Wind: <span className="font-mono text-slate-300">{secondaryCityData?.weather?.windSpeedKmh || 0} km/h</span></div>
            <div>Temp: <span className="font-mono text-slate-300">{secondaryCityData?.weather?.tempC || 0}°C</span></div>
          </div>
        </div>
      </div>

      {/* Dual Trajectory Recharts Chart */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex justify-between items-center border-b border-slate-800/80 pb-2">
          <h4 className="font-bold text-xs text-slate-200 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>72-Hour Dual Trajectory Superposition Chart</span>
          </h4>
          <div className="flex items-center space-x-3 text-[11px]">
            <span className="flex items-center space-x-1 font-semibold text-emerald-400">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full" />
              <span>{primaryCityData.cityName}</span>
            </span>
            <span className="flex items-center space-x-1 font-semibold text-amber-400">
              <span className="w-2.5 h-2.5 bg-amber-500 rounded-full" />
              <span>{secondaryCityData.cityName}</span>
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={comparisonChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="primaryAqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="secondaryAqiGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 10, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#090d16',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '11px',
                  color: '#f8fafc',
                }}
              />
              <Area type="monotone" dataKey="primaryAQI" name={`${primaryCityData.cityName} AQI`} stroke="#10b981" strokeWidth={2.5} fill="url(#primaryAqiGrad)" />
              <Area type="monotone" dataKey="secondaryAQI" name={`${secondaryCityData.cityName} AQI`} stroke="#f59e0b" strokeWidth={2} fill="url(#secondaryAqiGrad)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Pollutant Speciation Delta Table */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
        <h4 className="font-bold text-xs text-slate-200">
          Speciated Pollutant Component Variance Matrix
        </h4>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                <th className="pb-2">Pollutant</th>
                <th className="pb-2">{primaryCityData.cityName}</th>
                <th className="pb-2">{secondaryCityData.cityName}</th>
                <th className="pb-2">Absolute Delta</th>
                <th className="pb-2">WHO Guideline Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {['PM2.5', 'PM10', 'NO2', 'O3', 'SO2', 'CO'].map((pollutantName) => {
                const p1 = primaryCityData?.pollutants?.find((p) => p.name === pollutantName);
                const p2 = secondaryCityData?.pollutants?.find((p) => p.name === pollutantName);

                const val1 = p1 ? p1.value : 0;
                const val2 = p2 ? p2.value : 0;
                const delta = val1 - val2;
                const unit = p1?.unit || 'µg/m³';
                const limit = p1?.limit || 15;

                return (
                  <tr key={pollutantName} className="hover:bg-slate-900/50">
                    <td className="py-2 font-bold font-mono text-emerald-400">{pollutantName}</td>
                    <td className="py-2 font-mono font-semibold text-slate-100">{val1} {unit}</td>
                    <td className="py-2 font-mono font-semibold text-slate-300">{val2} {unit}</td>
                    <td className="py-2 font-mono">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        delta > 0 ? 'bg-amber-500/20 text-amber-300' : delta < 0 ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)} {unit}
                      </span>
                    </td>
                    <td className="py-2 text-slate-400 text-[11px]">
                      WHO Limit: <span className="font-mono text-slate-300">{limit} {unit}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
