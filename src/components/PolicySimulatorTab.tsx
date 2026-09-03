import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  Sparkles, 
  Building2, 
  Truck, 
  Sprout, 
  Zap, 
  DollarSign, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  TrendingDown, 
  BarChart2, 
  Layers, 
  Briefcase,
  Download,
  Printer,
  FileText,
  FileSpreadsheet,
  FileCode,
  Volume2,
  Square
} from 'lucide-react';
import { PolicyIntervention, PolicySimulationResult } from '../types';
import { INITIAL_POLICY_LEVERS } from '../data/mockData';
import { reportExportService, ReportFormat } from '../services/reportExportService';
import { speechSynthesisService } from '../services/speechSynthesisService';

interface PolicySimulatorTabProps {
  currentCityName: string;
  onRunSimulation: (scenarioTitle: string, levers: PolicyIntervention[]) => void;
  simulationResult: PolicySimulationResult | null;
  isSimulating: boolean;
}

export const PolicySimulatorTab: React.FC<PolicySimulatorTabProps> = ({
  currentCityName,
  onRunSimulation,
  simulationResult,
  isSimulating
}) => {
  const [levers, setLevers] = useState<PolicyIntervention[]>(INITIAL_POLICY_LEVERS);
  const [scenarioTitle, setScenarioTitle] = useState('Municipal Comprehensive Clean Air Protocol');
  const [showExportModal, setShowExportModal] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    const unsub = speechSynthesisService.subscribeSpeaking((speaking) => {
      setIsSpeaking(speaking);
    });
    return () => unsub();
  }, []);

  const handleSliderChange = (id: string, value: number) => {
    setLevers(levers.map(l => l.id === id ? { ...l, sliderValue: value } : l));
  };

  const handleExport = (format: ReportFormat) => {
    if (!simulationResult) return;
    reportExportService.exportPolicySimulation(simulationResult, currentCityName, levers, format);
    setShowExportModal(false);
  };

  const handleSpeakBriefing = () => {
    if (isSpeaking) {
      speechSynthesisService.stop();
      return;
    }
    if (!simulationResult?.aiAnalysisNarrative) return;
    const text = `Policy simulation executive briefing for ${currentCityName}. Scenario: ${simulationResult.scenarioName}. Projected air quality index improvement is minus ${simulationResult.projectedAQIReductionPercent} percent, dropping average AQI from ${simulationResult.currentAvgAQI} to ${simulationResult.newAvgAQI}. Estimated municipal budget requirement is ${simulationResult.estimatedCostMillionUSD} million dollars across ${simulationResult.implementationTimeMonths} months. ${simulationResult.aiAnalysisNarrative}`;
    speechSynthesisService.speak(text);
  };

  const applyPreset = (presetName: string) => {
    if (presetName === 'emergency') {
      setScenarioTitle('Severe Smog Emergency Response Strategy');
      setLevers(levers.map(l => {
        if (l.id === 'pol_1') return { ...l, sliderValue: 95 }; // Heavy Diesel Ban
        if (l.id === 'pol_2') return { ...l, sliderValue: 80 }; // Industrial Cut
        if (l.id === 'pol_4') return { ...l, sliderValue: 90 }; // Mist Cannon
        return l;
      }));
    } else if (presetName === 'green_transit') {
      setScenarioTitle('Green Transit & LEZ Urban Expansion');
      setLevers(levers.map(l => {
        if (l.id === 'pol_5') return { ...l, sliderValue: 85 }; // EV LEZ
        if (l.id === 'pol_1') return { ...l, sliderValue: 70 }; // Diesel Freight
        return l;
      }));
    } else if (presetName === 'agri_clean') {
      setScenarioTitle('Agricultural Stubble Management Incentive');
      setLevers(levers.map(l => {
        if (l.id === 'pol_3') return { ...l, sliderValue: 90 }; // Bio decomposer
        return l;
      }));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Presets & Export Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">GenAI Municipal Policy & Mitigation Simulator</h2>
            <p className="text-xs text-slate-400">
              Interactive sandbox for city planners to model policy interventions and preview forecasted AQI percentage reductions
            </p>
          </div>
        </div>

        {/* Action Preset Buttons & Export Button */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Presets:</span>
          <button
            onClick={() => applyPreset('emergency')}
            className="px-2.5 py-1 bg-red-500/15 text-red-300 border border-red-500/30 rounded-lg font-semibold hover:bg-red-500/25 transition-colors cursor-pointer"
          >
            Emergency Ban
          </button>
          <button
            onClick={() => applyPreset('green_transit')}
            className="px-2.5 py-1 bg-sky-500/15 text-sky-300 border border-sky-500/30 rounded-lg font-semibold hover:bg-sky-500/25 transition-colors cursor-pointer"
          >
            LEZ Transit
          </button>
          <button
            onClick={() => applyPreset('agri_clean')}
            className="px-2.5 py-1 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded-lg font-semibold hover:bg-amber-500/25 transition-colors cursor-pointer"
          >
            Agri Subsidy
          </button>

          {simulationResult && (
            <button
              onClick={() => setShowExportModal(true)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg flex items-center space-x-1.5 transition-all shadow-md shadow-emerald-600/20 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Dossier</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Grid: Control Levers vs AI Simulation Output */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Side: Levers Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl">
          <div className="border-b border-slate-800 pb-3 space-y-1">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Scenario Title</label>
            <input
              type="text"
              value={scenarioTitle}
              onChange={(e) => setScenarioTitle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-bold text-sm px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider">Policy Intervention Levers</h3>

            {levers.map((lever) => (
              <div key={lever.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-100">{lever.name}</span>
                  <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                    {lever.sliderValue} {lever.unit}
                  </span>
                </div>

                <p className="text-[11px] text-slate-400">{lever.description}</p>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={lever.sliderValue}
                  onChange={(e) => handleSliderChange(lever.id, Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
            ))}
          </div>

          <button
            onClick={() => onRunSimulation(scenarioTitle, levers)}
            disabled={isSimulating}
            className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-black text-sm rounded-xl flex items-center justify-center space-x-2 shadow-xl shadow-emerald-500/20 disabled:opacity-50 transition-all"
          >
            <Sparkles className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>{isSimulating ? 'Running Gemini Neural Policy Simulation...' : 'Simulate Policy Scenario'}</span>
          </button>
        </div>

        {/* Right Side: Simulation Projection Results */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                <span>Forecasted Environmental & Economic Projection</span>
              </h3>
              <span className="text-[10px] bg-slate-800 text-slate-300 font-mono px-2 py-0.5 rounded">
                Target: {currentCityName}
              </span>
            </div>

            {simulationResult ? (
              <div className="space-y-4 mt-4">
                {/* Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Projected AQI Drop</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-emerald-400 font-mono">
                        -{simulationResult.projectedAQIReductionPercent}%
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono">
                      {simulationResult.currentAvgAQI} → {simulationResult.newAvgAQI} AQI
                    </p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Estimated Cost</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-sky-400 font-mono">
                        ${simulationResult.estimatedCostMillionUSD}M
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Municipal Budget</p>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Timeline</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-black text-amber-400 font-mono">
                        {simulationResult.implementationTimeMonths} Mos
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-400">Implementation</p>
                  </div>
                </div>

                {/* Sector Reductions */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-300">Sector-by-Sector Emission Reductions:</h4>
                  <div className="space-y-2">
                    {(simulationResult.sectorImpacts || []).map((s, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>{s.sector}</span>
                          <span className="font-mono font-bold text-emerald-400">-{s.reductionPercent}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className="bg-emerald-500 h-full rounded-full transition-all duration-700"
                            style={{ width: `${s.reductionPercent}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* District Impacts */}
                <div className="space-y-2">
                  <h4 className="font-bold text-xs text-slate-300">District Level Heatmap Shifts:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                    {(simulationResult.districtImpacts || []).map((d, idx) => (
                      <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 space-y-1">
                        <p className="font-semibold text-slate-200 text-[11px] truncate">{d.districtName}</p>
                        <div className="flex items-center justify-between text-slate-400 font-mono text-[10px]">
                          <span className="text-red-400">{d.beforeAQI}</span>
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <span className="text-emerald-400 font-bold">{d.afterAQI}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gemini AI Briefing */}
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-2 text-xs text-emerald-200">
                  <div className="flex items-center justify-between border-b border-emerald-500/20 pb-2">
                    <span className="font-bold text-emerald-400 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Gemini Strategic Executive Briefing</span>
                    </span>
                    <button
                      onClick={handleSpeakBriefing}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 border transition-all cursor-pointer ${
                        isSpeaking
                          ? 'bg-red-500/20 text-red-300 border-red-500/40'
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
                      }`}
                    >
                      {isSpeaking ? <Square className="w-2.5 h-2.5 fill-current" /> : <Volume2 className="w-2.5 h-2.5" />}
                      <span>{isSpeaking ? 'Stop' : 'Read Aloud'}</span>
                    </button>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {simulationResult.aiAnalysisNarrative}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-16 space-y-3">
                <Sliders className="w-10 h-10 text-slate-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-300">Adjust levers on the left and click Simulate Policy Scenario</p>
                <p className="text-xs text-slate-400">Gemini GenAI will project multi-district AQI reductions and budget ROI.</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex justify-between">
            <span>Simulator Engine:</span>
            <span className="font-mono text-slate-300">Gemini 3.6 Flash Policy Net</span>
          </div>
        </div>
      </div>

      {/* Export Policy Simulation Modal */}
      {showExportModal && simulationResult && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-5 space-y-4 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Download className="w-5 h-5 text-emerald-400" />
                <h3 className="font-extrabold text-base text-slate-100">Export Policy Simulation Dossier</h3>
              </div>
              <button
                onClick={() => setShowExportModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 cursor-pointer"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Export simulation projections, economic ROI, sector reductions, and district heatmaps for scenario: <strong className="text-slate-200">{simulationResult.scenarioName}</strong>.
            </p>

            <div className="space-y-2.5">
              <button
                onClick={() => handleExport('html_print')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg group-hover:bg-emerald-500/20">
                    <Printer className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100">Printable PDF Dossier (HTML)</div>
                    <div className="text-[10px] text-slate-400">Formatted executive memorandum with charts, tables, & print styling</div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold">&rarr;</span>
              </button>

              <button
                onClick={() => handleExport('markdown')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-sky-500/10 text-sky-400 rounded-lg group-hover:bg-sky-500/20">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100">Markdown Dossier (.md)</div>
                    <div className="text-[10px] text-slate-400">Executive briefing format with markdown tables and levers</div>
                  </div>
                </div>
                <span className="text-[10px] text-sky-400 font-bold">&rarr;</span>
              </button>

              <button
                onClick={() => handleExport('csv')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-teal-500/10 text-teal-400 rounded-lg group-hover:bg-teal-500/20">
                    <FileSpreadsheet className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100">CSV Data Sheet (.csv)</div>
                    <div className="text-[10px] text-slate-400">Tabular spreadsheet of sector & district before/after AQI</div>
                  </div>
                </div>
                <span className="text-[10px] text-teal-400 font-bold">&rarr;</span>
              </button>

              <button
                onClick={() => handleExport('json')}
                className="w-full p-3 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl flex items-center justify-between transition-all group cursor-pointer"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg group-hover:bg-amber-500/20">
                    <FileCode className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <div className="text-xs font-bold text-slate-100">JSON Data Package (.json)</div>
                    <div className="text-[10px] text-slate-400">Complete JSON object for municipal data platforms</div>
                  </div>
                </div>
                <span className="text-[10px] text-amber-400 font-bold">&rarr;</span>
              </button>
            </div>

            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setShowExportModal(false)}
                className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
