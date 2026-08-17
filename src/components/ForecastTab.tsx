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
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  TrendingUp, 
  Zap, 
  ShieldAlert, 
  Wind, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Sparkles, 
  RefreshCw, 
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Download,
  CheckCircle2,
  Printer
} from 'lucide-react';
import { AQIMeasurement, ForecastPoint } from '../types';
import { D3TrendsDashboard } from './D3TrendsDashboard';
import { ForecastComparison } from './ForecastComparison';
import { MitigationPlanCard } from './MitigationPlanCard';

interface ForecastTabProps {
  currentCityData: AQIMeasurement;
  forecastPoints: ForecastPoint[];
  onTriggerAIPrediction: () => void;
  aiReportMarkdown: string | null;
  isLoadingAI: boolean;
}

export const ForecastTab: React.FC<ForecastTabProps> = ({
  currentCityData,
  forecastPoints,
  onTriggerAIPrediction,
  aiReportMarkdown,
  isLoadingAI
}) => {
  const [selectedTimeHorizon, setSelectedTimeHorizon] = useState<'24h' | '48h' | '72h'>('72h');
  const [exportedStatus, setExportedStatus] = useState<string | null>(null);

  const visiblePoints = selectedTimeHorizon === '24h' 
    ? forecastPoints.slice(0, 9) 
    : selectedTimeHorizon === '48h' 
    ? forecastPoints.slice(0, 11) 
    : forecastPoints;

  const reportText = aiReportMarkdown || `Primary pollution forcing is driven by heavy freight vehicular emissions (38%) compounded by nocturnal thermal inversion trapping PM2.5 in the lower 420m atmospheric boundary layer.`;

  const generateReportContent = () => {
    const timestamp = new Date().toLocaleString();
    return `===================================================================
AURAPREDICT AI — ATMOSPHERIC TRAJECTORY & FORECAST BRIEFING REPORT
===================================================================
Target Location: ${currentCityData.cityName}
Generated Timestamp: ${timestamp}
Current AQI Index: ${currentCityData.aqi} (${currentCityData.aqiCategory})
Meteorological Telemetry:
  - Temperature: ${currentCityData.weather.tempC}°C
  - Humidity: ${currentCityData.weather.humidity}%
  - Wind Vector: ${currentCityData.weather.windSpeedKmh} km/h NW (${currentCityData.weather.windDirectionDeg}°)
  - Boundary Inversion Height: ${currentCityData.weather.boundaryLayerHeightM} m

-------------------------------------------------------------------
GEMINI AI ATMOSPHERIC TRAJECTORY BRIEFING
-------------------------------------------------------------------
${reportText}

-------------------------------------------------------------------
SPECIATED POLLUTANT BREAKDOWN
-------------------------------------------------------------------
${(currentCityData?.pollutants || []).map(p => `- ${p.name}: ${p.value} ${p.unit} (${p.category}) [${p.percentOfLimit}% of WHO 24h limit]`).join('\n')}

-------------------------------------------------------------------
AUTOMATED SOURCE ATTRIBUTION
-------------------------------------------------------------------
${(currentCityData?.sourceAttribution || []).map(s => `- ${s.source}: ${s.percentage}%`).join('\n')}

===================================================================
Report compiled by AuraPredict AI Physics-Informed LSTM/GNN Engine
===================================================================`;
  };

  const handleExportText = () => {
    const content = generateReportContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${currentCityData.cityName.toLowerCase().replace(/\s+/g, '_')}_atmospheric_briefing_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setExportedStatus('TXT Briefing Exported!');
    setTimeout(() => setExportedStatus(null), 3500);
  };

  const handleExportPDF = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>${currentCityData.cityName} — AI Atmospheric Briefing Report</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f172a; line-height: 1.6; }
              h1 { color: #047857; font-size: 24px; border-bottom: 2px solid #047857; padding-bottom: 10px; }
              h2 { color: #0f172a; font-size: 16px; margin-top: 24px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px; }
              .meta-box { background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; font-size: 14px; margin-bottom: 20px; }
              .briefing-box { background: #ecfdf5; border-left: 4px solid #10b981; padding: 16px; border-radius: 6px; font-size: 14px; color: #064e3b; margin: 16px 0; }
              table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
              th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
              th { background: #f1f5f9; }
              .footer { margin-top: 40px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; }
            </style>
          </head>
          <body>
            <h1>AuraPredict AI — Atmospheric Trajectory & Forecast Briefing</h1>
            <div class="meta-box">
              <strong>Location:</strong> ${currentCityData.cityName} | <strong>Date:</strong> ${new Date().toLocaleString()}<br/>
              <strong>Air Quality Index:</strong> ${currentCityData.aqi} AQI (${currentCityData.aqiCategory})<br/>
              <strong>Meteorology:</strong> ${currentCityData.weather.tempC}°C, ${currentCityData.weather.humidity}% Humidity, ${currentCityData.weather.windSpeedKmh} km/h NW Wind, ${currentCityData.weather.boundaryLayerHeightM}m Inversion Layer
            </div>

            <h2>Gemini AI Executive Atmospheric Trajectory Briefing</h2>
            <div class="briefing-box">
              ${reportText.replace(/\n/g, '<br/>')}
            </div>

            <h2>Speciated Pollutant Concentration Breakdown</h2>
            <table>
              <thead>
                <tr>
                  <th>Pollutant</th>
                  <th>Value</th>
                  <th>WHO Limit</th>
                  <th>% of Limit</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                ${(currentCityData?.pollutants || []).map(p => `
                  <tr>
                    <td><strong>${p.name}</strong></td>
                    <td>${p.value} ${p.unit}</td>
                    <td>${p.limit} ${p.unit}</td>
                    <td>${p.percentOfLimit}%</td>
                    <td>${p.category}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <h2>Automated Source Attribution</h2>
            <table>
              <thead>
                <tr>
                  <th>Source Category</th>
                  <th>Contribution Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${(currentCityData?.sourceAttribution || []).map(s => `
                  <tr>
                    <td>${s.source}</td>
                    <td>${s.percentage}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              Generated by AuraPredict AI Enterprise Environmental Intelligence Platform &bull; Physics-Informed LSTM / GNN Models
            </div>
            <script>
              window.onload = function() {
                window.print();
              };
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
      setExportedStatus('PDF Print Report Opened!');
      setTimeout(() => setExportedStatus(null), 3500);
    } else {
      handleExportText();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              {currentCityData.cityName} — 24-72h Sequence-to-Sequence Forecasting
            </h2>
            <p className="text-xs text-slate-400">
              LSTM / Graph Neural Network Physics-Informed Modeling with Statistical Uncertainty Bounds (±)
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Horizon Selector */}
          <div className="bg-slate-950 p-1 rounded-lg border border-slate-800 flex space-x-1">
            {(['24h', '48h', '72h'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setSelectedTimeHorizon(h)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                  selectedTimeHorizon === h 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {h} Horizon
              </button>
            ))}
          </div>

          <button
            onClick={onTriggerAIPrediction}
            disabled={isLoadingAI}
            className="px-3.5 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold rounded-lg text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50 transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isLoadingAI ? 'animate-spin' : ''}`} />
            <span>{isLoadingAI ? 'Running AI Engine...' : 'Run Gemini Forecast'}</span>
          </button>
        </div>
      </div>

      {exportedStatus && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{exportedStatus}</span>
        </div>
      )}

      {/* AI-Driven Localized Mitigation Action Plan Generator */}
      <MitigationPlanCard currentCityData={currentCityData} />

      {/* D3-based Interactive Trends Dashboard */}
      <D3TrendsDashboard 
        forecastData={forecastPoints} 
        cityName={currentCityData.cityName} 
      />

      {/* Side-by-Side Forecast Comparison Component */}
      <ForecastComparison 
        primaryCityData={currentCityData} 
        primaryForecast={forecastPoints} 
      />

      {/* Main Forecast Chart Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
        <div className="flex flex-wrap items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-emerald-400" />
            <h3 className="font-bold text-sm text-slate-100">Rolling AQI Prediction Trajectory with Confidence Band</h3>
          </div>
          <div className="flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-0.5 bg-emerald-400"></span>
              <span className="text-slate-300 font-medium">Predicted AQI Index</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 bg-emerald-500/20 border border-emerald-500/40 rounded"></span>
              <span className="text-slate-400">95% Confidence Interval (±)</span>
            </div>
          </div>
        </div>

        {/* Recharts Chart */}
        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={visiblePoints} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[0, 'dataMax + 50']} />
              <Tooltip
                contentStyle={{ backgroundColor: '#090d16', borderColor: '#334155', borderRadius: '12px', fontSize: '12px', color: '#f8fafc' }}
                formatter={(value: any, name: any) => [
                  name === 'aqi' ? `${value} AQI` : name === 'upperBound' ? `${value} (Upper)` : `${value} (Lower)`,
                  name === 'aqi' ? 'Predicted AQI' : name === 'upperBound' ? 'Upper Bound' : 'Lower Bound'
                ]}
              />
              {/* Shaded Area for Confidence Interval */}
              <Area type="monotone" dataKey="upperBound" stroke="none" fill="#10b981" fillOpacity={0.12} />
              <Area type="monotone" dataKey="lowerBound" stroke="none" fill="#0284c7" fillOpacity={0.08} />
              <Line type="monotone" dataKey="aqi" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: '#10b981' }} activeDot={{ r: 6 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pollutant Matrix & Source Attribution Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pollutants Breakdown Grid */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Gauge className="w-4 h-4 text-emerald-400" />
              <span>Speciated Pollutant Component Breakdown</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">WHO Benchmark Comparison</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {(currentCityData?.pollutants || []).map((p) => {
              const isDanger = p.percentOfLimit > 300;
              return (
                <div key={p.name} className="bg-slate-950 border border-slate-800 rounded-xl p-3 space-y-1.5 relative overflow-hidden">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-xs text-slate-200">{p.name}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      isDanger ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {p.category}
                    </span>
                  </div>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-xl font-extrabold font-mono text-slate-100">{p.value}</span>
                    <span className="text-[10px] text-slate-400">{p.unit}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${isDanger ? 'bg-red-500' : 'bg-emerald-500'}`}
                      style={{ width: `${Math.min(100, p.percentOfLimit / 10)}%` }}
                    />
                  </div>
                  <p className="text-[10px] text-slate-400">
                    <span className="font-mono text-slate-300">{p.percentOfLimit}%</span> of WHO 24h limit ({p.limit} {p.unit})
                  </p>
                </div>
              );
            })}
          </div>

          {/* Meteorological Vector Cards */}
          <div className="pt-2 border-t border-slate-800">
            <h4 className="text-xs font-semibold text-slate-300 mb-2">Meteorological & Boundary Layer Vector Telemetry</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2">
                <Wind className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Wind Vector</p>
                  <p className="font-mono font-bold text-slate-200">{currentCityData.weather.windSpeedKmh} km/h NW</p>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Temperature</p>
                  <p className="font-mono font-bold text-slate-200">{currentCityData.weather.tempC}°C</p>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Humidity</p>
                  <p className="font-mono font-bold text-slate-200">{currentCityData.weather.humidity}%</p>
                </div>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center space-x-2">
                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-[10px] text-slate-400">Inversion Layer</p>
                  <p className="font-mono font-bold text-slate-200">{currentCityData.weather.boundaryLayerHeightM} m</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Source Attribution Pie Chart & Gemini Report */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <PieChartIcon className="w-4 h-4 text-emerald-400" />
                <span>Automated Source Attribution</span>
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">GNN Model</span>
            </div>

            {/* Pie Chart */}
            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={currentCityData?.sourceAttribution || []}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="percentage"
                  >
                    {(currentCityData?.sourceAttribution || []).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => [`${val}%`, 'Contribution']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Source Legend */}
            <div className="space-y-1.5 text-xs">
              {(currentCityData?.sourceAttribution || []).map((s) => (
                <div key={s.source} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: s.color }}></span>
                    <span className="text-slate-300 font-medium text-[11px] truncate max-w-[170px]">{s.source}</span>
                  </div>
                  <span className="font-mono font-bold text-slate-100">{s.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gemini AI Briefing Box with Export Functionality */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2 mt-4 text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gemini AI Atmospheric Briefing</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handleExportText}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 rounded text-[10px] font-semibold flex items-center space-x-1 border border-slate-700 transition-colors"
                  title="Export Briefing as TXT Document"
                >
                  <FileText className="w-3 h-3 text-emerald-400" />
                  <span>Export TXT</span>
                </button>
                <button
                  onClick={handleExportPDF}
                  className="px-2 py-0.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 rounded text-[10px] font-semibold flex items-center space-x-1 border border-emerald-500/30 transition-colors"
                  title="Download / Print Executive PDF Report"
                >
                  <Printer className="w-3 h-3" />
                  <span>PDF / Print</span>
                </button>
              </div>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {reportText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

