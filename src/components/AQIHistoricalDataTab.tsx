import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import {
  History,
  Calendar,
  Clock,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Flame,
  CloudRain,
  Sun,
  Wind,
  Layers,
  Sparkles,
  Download,
  Info,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  FileText
} from 'lucide-react';
import { AQIMeasurement } from '../types';
import {
  generate7DayHourlyData,
  generate30DayDailyData,
  SEASONAL_12MONTH_DELHI,
  MULTI_YEAR_DELHI,
  DIURNAL_24H_DATA,
  HISTORICAL_EXTREME_EPISODES,
  HistoricalEpisode
} from '../data/historicalData';

interface AQIHistoricalDataTabProps {
  currentCityData: AQIMeasurement;
}

type TimeHorizon = '7d_hourly' | '30d_daily' | '12m_seasonal' | '5y_annual' | 'diurnal_24h';
type MetricView = 'aqi' | 'particulate' | 'gaseous' | 'meteorology';

export const AQIHistoricalDataTab: React.FC<AQIHistoricalDataTabProps> = ({ currentCityData }) => {
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('12m_seasonal');
  const [metricView, setMetricView] = useState<MetricView>('aqi');
  const [selectedEpisode, setSelectedEpisode] = useState<HistoricalEpisode | null>(null);
  const [showWhoLimit, setShowWhoLimit] = useState(true);

  // Dynamic datasets based on current city base AQI
  const hourlyData = useMemo(() => generate7DayHourlyData(currentCityData.aqi), [currentCityData.aqi]);
  const dailyData = useMemo(() => generate30DayDailyData(currentCityData.aqi), [currentCityData.aqi]);

  // Statistical calculations
  const stats = useMemo(() => {
    const aqiValues = dailyData.map((d) => d.avgAQI).sort((a, b) => a - b);
    const p50 = aqiValues[Math.floor(aqiValues.length * 0.5)] || 0;
    const p90 = aqiValues[Math.floor(aqiValues.length * 0.9)] || 0;
    const p99 = aqiValues[Math.floor(aqiValues.length * 0.99)] || 0;
    const daysExceeded = dailyData.filter((d) => d.whoExceeded).length;
    const percentExceeded = Math.round((daysExceeded / dailyData.length) * 100);

    return { p50, p90, p99, daysExceeded, percentExceeded, totalDays: dailyData.length };
  }, [dailyData]);

  // Handle Export Historical Data
  const handleExportHistoricalCSV = () => {
    let csv = 'Timestamp_or_Date,AQI,PM2_5,PM10,NO2,O3,Category\n';
    if (timeHorizon === '7d_hourly') {
      hourlyData.forEach((h) => {
        csv += `"${h.formattedTime}",${h.aqi},${h.pm25},${h.pm10},${h.no2},${h.o3},"${h.category}"\n`;
      });
    } else if (timeHorizon === '30d_daily') {
      dailyData.forEach((d) => {
        csv += `"${d.date}",${d.avgAQI},${d.pm25},${d.pm10},${d.no2},${d.o3},"${d.category}"\n`;
      });
    } else if (timeHorizon === '12m_seasonal') {
      SEASONAL_12MONTH_DELHI.forEach((m) => {
        csv += `"${m.monthName}",${m.avgAQI},${m.pm25},${m.pm10},${m.no2},N/A,"${m.keyPhenomenon}"\n`;
      });
    } else {
      MULTI_YEAR_DELHI.forEach((y) => {
        csv += `"${y.year}",${y.annualMeanAQI},${y.annualMeanPM25},${y.annualMeanPM10},N/A,N/A,"${y.cleanAirPolicyMilestone}"\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aurapredict_historical_${currentCityData.cityId}_${timeHorizon}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Strip */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-5 flex flex-wrap items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <History className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-base md:text-lg font-bold text-slate-100">
                Atmospheric Historical Intelligence & Multi-Scale Trend Analytics
              </h2>
              <span className="bg-emerald-500/20 text-emerald-300 font-mono text-[10px] px-2 py-0.5 rounded font-bold border border-emerald-500/30">
                D3 / Recharts Engine
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Long-term multi-season air quality trajectories, diurnal 24-hour cycles, and historical extreme pollution episodes for{' '}
              <span className="font-semibold text-slate-200">{currentCityData.cityName}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportHistoricalCSV}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-all shadow-sm cursor-pointer"
            title="Download active historical dataset as CSV spreadsheet"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Statistical Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1 shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Median AQI (P50)</span>
          <div className="text-xl font-black text-slate-100 font-mono">{stats.p50}</div>
          <p className="text-[10px] text-slate-500">30-Day Median Baseline</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1 shadow-md">
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-wider">Hazard Level (P90)</span>
          <div className="text-xl font-black text-amber-400 font-mono">{stats.p90}</div>
          <p className="text-[10px] text-slate-500">90th Percentile Surge</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1 shadow-md">
          <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">Extreme Peak (P99)</span>
          <div className="text-xl font-black text-rose-400 font-mono">{stats.p99}</div>
          <p className="text-[10px] text-slate-500">Peak Acute Exposure</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1 shadow-md">
          <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">WHO Standard Breaches</span>
          <div className="text-xl font-black text-rose-400 font-mono">{stats.percentExceeded}%</div>
          <p className="text-[10px] text-slate-500">{stats.daysExceeded} of {stats.totalDays} Days &gt; 15µg/m³</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1 shadow-md">
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">Cleanest Month</span>
          <div className="text-xl font-black text-emerald-400 font-sans">August</div>
          <p className="text-[10px] text-slate-500">78 Avg AQI (Monsoon)</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1 shadow-md">
          <span className="text-[10px] text-rose-400 uppercase font-bold tracking-wider">Peak Smog Season</span>
          <div className="text-xl font-black text-rose-400 font-sans">November</div>
          <p className="text-[10px] text-slate-500">395 Avg AQI (Stubble & Inversion)</p>
        </div>
      </div>

      {/* Interactive Main Chart Card with Dual Filter Toolbars */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          {/* Time Horizon Selector */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-950 p-1.5 rounded-xl border border-slate-800">
            <span className="text-[11px] font-mono text-slate-400 px-2">Time Horizon:</span>
            {[
              { id: '12m_seasonal', label: '12 Months (Seasonal)' },
              { id: '30d_daily', label: '30 Days (Daily)' },
              { id: '7d_hourly', label: '7 Days (Hourly)' },
              { id: 'diurnal_24h', label: 'Diurnal 24h Cycle' },
              { id: '5y_annual', label: '5-Year Progress' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTimeHorizon(tab.id as TimeHorizon)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  timeHorizon === tab.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Metric View Selector & WHO Reference Toggle */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
              <button
                onClick={() => setMetricView('aqi')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  metricView === 'aqi' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                AQI
              </button>
              <button
                onClick={() => setMetricView('particulate')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  metricView === 'particulate' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                PM2.5 / PM10
              </button>
              <button
                onClick={() => setMetricView('gaseous')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  metricView === 'gaseous' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Gases (NO2/O3)
              </button>
              <button
                onClick={() => setMetricView('meteorology')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  metricView === 'meteorology' ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Meteorology
              </button>
            </div>

            <button
              onClick={() => setShowWhoLimit(!showWhoLimit)}
              className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold flex items-center space-x-1 transition-all cursor-pointer ${
                showWhoLimit
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-500'
              }`}
              title="Toggle WHO guideline threshold reference line"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>WHO Limits</span>
            </button>
          </div>
        </div>

        {/* Primary Chart Area Container */}
        <div className="h-[360px] w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            {timeHorizon === '12m_seasonal' ? (
              <ComposedChart data={SEASONAL_12MONTH_DELHI} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <defs>
                  <linearGradient id="seasonalAqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0.2} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 450]} />
                <YAxis yAxisId="right" orientation="right" stroke="#0284c7" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(value: any, name: any) => [
                    name === 'Rainfall' ? `${value} mm` : `${value} AQI/µg`,
                    name
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                {showWhoLimit && (
                  <ReferenceLine yAxisId="left" y={50} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'WHO Good Limit (50 AQI)', fill: '#10b981', fontSize: 10, position: 'insideTopLeft' }} />
                )}

                {metricView === 'aqi' && (
                  <>
                    <Area yAxisId="left" type="monotone" dataKey="avgAQI" name="Monthly Mean AQI" stroke="#ef4444" strokeWidth={3} fill="url(#seasonalAqiGrad)" />
                    <Bar yAxisId="right" dataKey="rainfallMm" name="Rainfall (mm)" fill="url(#rainGrad)" radius={[4, 4, 0, 0]} />
                  </>
                )}

                {metricView === 'particulate' && (
                  <>
                    <Line yAxisId="left" type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line yAxisId="left" type="monotone" dataKey="pm10" name="PM10 (µg/m³)" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  </>
                )}

                {metricView === 'gaseous' && (
                  <Line yAxisId="left" type="monotone" dataKey="no2" name="NO2 (µg/m³)" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3 }} />
                )}

                {metricView === 'meteorology' && (
                  <>
                    <Line yAxisId="left" type="monotone" dataKey="avgBlhMeters" name="Boundary Layer Height (m)" stroke="#a855f7" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line yAxisId="right" type="monotone" dataKey="avgTempC" name="Mean Temp (°C)" stroke="#f97316" strokeWidth={2} />
                  </>
                )}
              </ComposedChart>
            ) : timeHorizon === '30d_daily' ? (
              <AreaChart data={dailyData} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <defs>
                  <linearGradient id="dailyAqiGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="dayLabel" stroke="#64748b" tick={{ fontSize: 10 }} interval={3} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                {showWhoLimit && (
                  <ReferenceLine y={50} stroke="#10b981" strokeDasharray="4 4" label={{ value: 'WHO Target', fill: '#10b981', fontSize: 10 }} />
                )}

                {metricView === 'aqi' && (
                  <>
                    <Area type="monotone" dataKey="avgAQI" name="Daily Avg AQI" stroke="#f59e0b" strokeWidth={2.5} fill="url(#dailyAqiGrad)" />
                    <Line type="monotone" dataKey="maxAQI" name="Peak Max AQI" stroke="#ef4444" strokeDasharray="3 3" dot={false} />
                    <Line type="monotone" dataKey="minAQI" name="Min Daily AQI" stroke="#10b981" strokeDasharray="3 3" dot={false} />
                  </>
                )}

                {metricView === 'particulate' && (
                  <>
                    <Area type="monotone" dataKey="pm25" name="PM2.5 (µg/m³)" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
                    <Line type="monotone" dataKey="pm10" name="PM10 (µg/m³)" stroke="#f59e0b" strokeWidth={2} />
                  </>
                )}

                {metricView === 'gaseous' && (
                  <>
                    <Line type="monotone" dataKey="no2" name="NO2 (µg/m³)" stroke="#38bdf8" strokeWidth={2} />
                    <Line type="monotone" dataKey="o3" name="O3 (µg/m³)" stroke="#a855f7" strokeWidth={2} />
                  </>
                )}

                {metricView === 'meteorology' && (
                  <Area type="monotone" dataKey="avgAQI" name="Daily AQI Severity" stroke="#f59e0b" fill="url(#dailyAqiGrad)" />
                )}
              </AreaChart>
            ) : timeHorizon === 'diurnal_24h' ? (
              <ComposedChart data={DIURNAL_24H_DATA} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="hourLabel" stroke="#64748b" tick={{ fontSize: 10 }} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#38bdf8" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                <ReferenceLine yAxisId="left" x="08:00" stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Morning Rush', fill: '#f59e0b', fontSize: 10, position: 'top' }} />
                <ReferenceLine yAxisId="left" x="14:00" stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Solar Mixing Drop', fill: '#10b981', fontSize: 10, position: 'top' }} />
                <ReferenceLine yAxisId="left" x="20:00" stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Inversion Peak', fill: '#ef4444', fontSize: 10, position: 'top' }} />

                <Line yAxisId="left" type="monotone" dataKey="winterAQI" name="Winter Diurnal AQI" stroke="#ef4444" strokeWidth={3} dot={{ r: 2 }} />
                <Line yAxisId="left" type="monotone" dataKey="summerAQI" name="Summer Diurnal AQI" stroke="#f59e0b" strokeWidth={2} dot={{ r: 2 }} />
                <Line yAxisId="left" type="monotone" dataKey="monsoonAQI" name="Monsoon Diurnal AQI" stroke="#10b981" strokeWidth={2} dot={{ r: 2 }} />
                <Bar yAxisId="right" dataKey="trafficIntensityPct" name="Traffic Index (%)" fill="#38bdf8" fillOpacity={0.25} radius={[3, 3, 0, 0]} />
              </ComposedChart>
            ) : timeHorizon === '5y_annual' ? (
              <ComposedChart data={MULTI_YEAR_DELHI} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="year" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="left" stroke="#64748b" tick={{ fontSize: 11 }} domain={[120, 260]} />
                <YAxis yAxisId="right" orientation="right" stroke="#ef4444" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                <Bar yAxisId="left" dataKey="annualMeanAQI" name="Annual Mean AQI" fill="#10b981" fillOpacity={0.7} radius={[6, 6, 0, 0]} />
                <Line yAxisId="left" type="monotone" dataKey="annualMeanPM25" name="PM2.5 Annual Mean (µg/m³)" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 4 }} />
                <Line yAxisId="right" type="monotone" dataKey="severeEpisodeCount" name="Severe Smog Emergencies Count" stroke="#f59e0b" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            ) : (
              <AreaChart data={hourlyData.slice(-48)} margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="formattedTime" stroke="#64748b" tick={{ fontSize: 10 }} interval={5} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

                <Area type="monotone" dataKey="aqi" name="Hourly AQI" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} strokeWidth={2} />
                <Line type="monotone" dataKey="pm25" name="PM2.5" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="no2" name="NO2" stroke="#38bdf8" strokeWidth={1.5} dot={false} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-Season Diagnostic Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-rose-400">
            <Flame className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Autumn Biomass Stubble</h4>
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">395 AQI</div>
          <p className="text-xs text-slate-400">
            October &ndash; November transboundary agricultural stubble burning convergence with calm northwesterly winds.
          </p>
          <div className="text-[10px] font-mono text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded inline-block">
            Peak PM2.5: 285 µg/m³
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-sky-400">
            <Layers className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Winter Cold Inversion</h4>
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">360 AQI</div>
          <p className="text-xs text-slate-400">
            December &ndash; January shallow nocturnal radiation fog trapping vehicular & industrial emissions at &lt;350m height.
          </p>
          <div className="text-[10px] font-mono text-sky-300 bg-sky-500/10 px-2 py-0.5 rounded inline-block">
            25 Hazard Days / mo
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-amber-400">
            <Sun className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Summer Thar Dust Influx</h4>
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono">240 AQI</div>
          <p className="text-xs text-slate-400">
            April &ndash; May convective dust storms with elevated PM10 (340 µg/m³) and high photochemical ozone formation.
          </p>
          <div className="text-[10px] font-mono text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded inline-block">
            Coarse PM10 Surge
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center space-x-2 text-emerald-400">
            <CloudRain className="w-4 h-4" />
            <h4 className="text-xs font-bold uppercase tracking-wider">Monsoon Scavenging</h4>
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono">78 AQI</div>
          <p className="text-xs text-slate-400">
            July &ndash; August heavy rainfall wet deposition clearing particulate matter, resulting in 98% WHO compliance.
          </p>
          <div className="text-[10px] font-mono text-emerald-300 bg-emerald-500/10 px-2 py-0.5 rounded inline-block">
            245mm Scavenging Rain
          </div>
        </div>
      </div>

      {/* Historical Extreme Pollution Episodes Catalog */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-100">Historical Extreme Pollution Episodes Catalog</h3>
              <p className="text-xs text-slate-400">
                Archived multi-day acute smog emergencies, meteorological convergence drivers, and municipal interventions
              </p>
            </div>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-1 rounded">
            {HISTORICAL_EXTREME_EPISODES.length} Recorded Episodes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {HISTORICAL_EXTREME_EPISODES.map((ep) => (
            <div
              key={ep.id}
              onClick={() => setSelectedEpisode(selectedEpisode?.id === ep.id ? null : ep)}
              className={`p-4 rounded-xl border transition-all cursor-pointer ${
                selectedEpisode?.id === ep.id
                  ? 'bg-slate-950 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-mono text-slate-400">{ep.startDate} &rarr; {ep.endDate}</span>
                    <span className="text-[9px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.2 rounded">
                      {ep.durationDays} Days
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-100 mt-1">{ep.title}</h4>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block text-[10px] uppercase font-bold">Peak AQI</span>
                  <span className="text-lg font-black text-rose-400 font-mono">{ep.peakAQI}</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 mt-2 line-clamp-2">{ep.description}</p>

              <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                <span className="text-slate-500 font-mono">Dominant: <strong className="text-slate-300">{ep.dominantPollutant}</strong></span>
                <span className="text-emerald-400 font-semibold hover:underline">
                  {selectedEpisode?.id === ep.id ? 'Hide Dossier' : 'View Meteorological Dossier &rarr;'}
                </span>
              </div>

              {selectedEpisode?.id === ep.id && (
                <div className="mt-3 pt-3 border-t border-slate-800 space-y-2 text-xs bg-slate-900/60 p-3 rounded-lg">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-400 block">Atmospheric Driver:</span>
                    <span className="text-slate-300 text-[11px]">{ep.meteorologicalDriver}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-400 block">Mitigation Enacted:</span>
                    <span className="text-slate-300 text-[11px]">{ep.mitigationEnacted}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-sky-400 block">Health Advisory Status:</span>
                    <span className="text-slate-300 text-[11px]">{ep.healthAdvisoryStatus}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
