import React, { useState, useEffect } from 'react';
import { AQIMeasurement } from '../types';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  Wind, 
  Factory, 
  AlertTriangle, 
  ArrowRight, 
  Download, 
  Copy, 
  ListChecks, 
  Clock, 
  Building2, 
  Layers
} from 'lucide-react';

interface MitigationPlanCardProps {
  currentCityData: AQIMeasurement;
}

export interface ActionStep {
  stepNumber: number;
  title: string;
  category: 'Traffic & Transport' | 'Dust & Construction' | 'Industrial & Power' | 'Biomass & Agriculture';
  targetPollutant: string;
  expectedAqiDrop: string;
  timeframe: string;
  authority: string;
  description: string;
  actions: string[];
  priority: 'Immediate (0-2 hrs)' | 'High (2-6 hrs)' | 'Medium (6-12 hrs)';
}

export const MitigationPlanCard: React.FC<MitigationPlanCardProps> = ({ currentCityData }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [planGenerated, setPlanGenerated] = useState(false);
  const [activeSteps, setActiveSteps] = useState<Record<number, boolean>>({});
  const [copiedStatus, setCopiedStatus] = useState(false);

  // Derive top pollutants and top source attributions safely
  const rawPollutants = currentCityData?.pollutants || [];
  const rawSources = currentCityData?.sourceAttribution || [];

  const defaultPollutants = [
    { name: 'PM2.5', value: 45, unit: 'µg/m³', category: 'High', limit: 15, percentOfLimit: 300 },
    { name: 'NO2', value: 32, unit: 'ppb', category: 'Moderate', limit: 25, percentOfLimit: 128 }
  ];

  const sortedPollutants = [...(rawPollutants.length > 0 ? rawPollutants : defaultPollutants)].sort(
    (a, b) => b.percentOfLimit - a.percentOfLimit
  );
  const topPollutant = sortedPollutants[0] || defaultPollutants[0];
  const secondPollutant = sortedPollutants[1] || defaultPollutants[1];

  const topSource = [...(rawSources.length > 0 ? rawSources : [{ source: 'Vehicular Emissions', percentage: 38 }])].sort(
    (a, b) => b.percentage - a.percentage
  )[0] || {
    source: 'Vehicular Emissions',
    percentage: 38
  };

  // Generate dynamic 3-step action plan tailored to current pollutant composition
  const steps: ActionStep[] = [
    {
      stepNumber: 1,
      title: `Emergency ${topPollutant.name} Dust & Source Suppression`,
      category: topPollutant.name.includes('PM') ? 'Dust & Construction' : 'Industrial & Power',
      targetPollutant: `${topPollutant.name} (${topPollutant.value} ${topPollutant.unit})`,
      expectedAqiDrop: '-18 to -25 AQI',
      timeframe: 'Immediate (Within 2 Hours)',
      authority: 'Municipal Public Works & Environmental Response Unit',
      priority: 'Immediate (0-2 hrs)',
      description: `Deploy high-pressure anti-smog water cannons and mist sprayers along major ${currentCityData.cityName} traffic corridors to suppress resuspended ${topPollutant.name} particulates.`,
      actions: [
        `Deploy 14 anti-smog cannons along high-volume corridors`,
        `Mandate wet-sweeping of arterial roads and halt non-essential demolition work`,
        `Cover all uncovered material stockpiles and active excavation sites`
      ]
    },
    {
      stepNumber: 2,
      title: `Targeted Corridor Traffic & ${topSource.source} Diversion`,
      category: 'Traffic & Transport',
      targetPollutant: `NO2 & PM2.5 (${topSource.percentage}% Source Share)`,
      expectedAqiDrop: '-12 to -16 AQI',
      timeframe: 'High Priority (Within 4 Hours)',
      authority: 'District Traffic Police Command & Urban Transit Board',
      priority: 'High (2-6 hrs)',
      description: `Institute commercial diesel truck restrictions and divert non-destined freight around the ${currentCityData.cityName} outer ring highway to cut ${topSource.source.toLowerCase()}.`,
      actions: [
        `Restrict BS-III diesel and BS-IV commercial freight trucks entering city center`,
        `Optimize traffic signal timing at 24 bottleneck intersections to eliminate idle emissions`,
        `Provide free municipal electric bus feeder shuttles for commuter parking lots`
      ]
    },
    {
      stepNumber: 3,
      title: `Industrial Stack Throttling & Inversion Layer Defense`,
      category: 'Industrial & Power',
      targetPollutant: `${secondPollutant.name} (${secondPollutant.value} ${secondPollutant.unit})`,
      expectedAqiDrop: '-8 to -14 AQI',
      timeframe: 'Medium Priority (Within 6-12 Hours)',
      authority: 'State Pollution Control Board & Energy Regulatory Cell',
      priority: 'Medium (6-12 hrs)',
      description: `Enforce a 20% operational load cap on thermal power plants and industrial boilers operating within 25km downwind of ${currentCityData.cityName}.`,
      actions: [
        `Switch industrial boilers to natural gas or clean biomass fuels`,
        `Audit continuous emission monitoring systems (CEMS) on top 8 industrial chimneys`,
        `Activate drone surveillance for agricultural open-burning hotspots along wind vector (${currentCityData.weather.windDirectionDeg}°)`
      ]
    }
  ];

  const handleGeneratePlan = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setPlanGenerated(true);
    }, 1200);
  };

  const toggleStepAction = (stepIdx: number) => {
    setActiveSteps((prev) => ({
      ...prev,
      [stepIdx]: !prev[stepIdx]
    }));
  };

  const handleCopyPlan = () => {
    const textContent = `=====================================================
AURA PREDICT AI — LOCALIZED 3-STEP AQI MITIGATION PLAN
=====================================================
Target City: ${currentCityData.cityName}
Current AQI: ${currentCityData.aqi} (${currentCityData.aqiCategory})
Dominant Threat: ${topPollutant.name} (${topPollutant.value} ${topPollutant.unit}) | ${topSource.source} (${topSource.percentage}%)

${steps.map((s) => `STEP ${s.stepNumber}: ${s.title}
Target Pollutant: ${s.targetPollutant}
Expected Impact: ${s.expectedAqiDrop}
Authority: ${s.authority}
Priority: ${s.priority}
Action Items:
${s.actions.map((a) => `  [ ] ${a}`).join('\n')}
`).join('\n')}`;

    navigator.clipboard.writeText(textContent);
    setCopiedStatus(true);
    setTimeout(() => setCopiedStatus(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
            <Sparkles className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
              <span>AI-Driven Localized Mitigation Action Plan</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                Speciated Engine
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Generates targeted 3-step intervention protocols based on {currentCityData.cityName}'s {topPollutant.name} composition
            </p>
          </div>
        </div>

        {/* Generate / Refresh Action Button */}
        <button
          onClick={handleGeneratePlan}
          disabled={isGenerating}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-extrabold text-xs rounded-xl flex items-center space-x-2 shadow-lg shadow-emerald-500/25 disabled:opacity-50 transition-all cursor-pointer"
        >
          <Sparkles className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
          <span>{isGenerating ? 'Analyzing Speciation...' : planGenerated ? 'Re-Generate Action Plan' : 'Generate Mitigation Plan'}</span>
        </button>
      </div>

      {/* Plan Card Body */}
      {!planGenerated && !isGenerating && (
        <div className="bg-slate-950/80 p-6 rounded-2xl border border-slate-800 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto text-emerald-400">
            <ListChecks className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-slate-200">No Mitigation Action Plan Active</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Click the button above to synthesize a 3-step municipal mitigation response tailored to {currentCityData.cityName}'s current <strong className="text-emerald-400">{topPollutant.name} ({topPollutant.value} {topPollutant.unit})</strong> and <strong className="text-emerald-400">{topSource.source}</strong> composition.
            </p>
          </div>
        </div>
      )}

      {isGenerating && (
        <div className="bg-slate-950 p-8 rounded-2xl border border-emerald-500/30 text-center space-y-4 animate-pulse">
          <div className="w-10 h-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-mono text-emerald-300 font-bold">
            Synthesizing Physics-Informed 3-Step Mitigation Protocol for {currentCityData.cityName}...
          </p>
        </div>
      )}

      {planGenerated && !isGenerating && (
        <div className="space-y-4">
          {/* Summary Banner */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-3">
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold rounded-lg text-[11px]">
                Target: {topPollutant.name} ({topPollutant.value} {topPollutant.unit})
              </span>
              <span className="text-slate-400 text-[11px]">
                Cumulative Projected Impact: <strong className="text-emerald-400 font-mono font-bold">-38 to -55 AQI Point Reduction</strong>
              </span>
            </div>

            <button
              onClick={handleCopyPlan}
              className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-lg text-[11px] flex items-center space-x-1.5 transition-all cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5 text-emerald-400" />
              <span>{copiedStatus ? 'Copied Briefing!' : 'Copy Plan Briefing'}</span>
            </button>
          </div>

          {/* 3 Step Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {steps.map((step, idx) => (
              <div
                key={step.stepNumber}
                className="bg-slate-950 p-4 rounded-2xl border border-slate-800/90 hover:border-emerald-500/40 transition-all space-y-3 flex flex-col justify-between relative group"
              >
                {/* Top Badge Row */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded font-mono font-bold text-[10px]">
                      Step {step.stepNumber}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold text-[10px]">
                      {step.priority}
                    </span>
                  </div>

                  <h4 className="font-extrabold text-slate-100 text-xs leading-snug">{step.title}</h4>

                  <p className="text-[11px] text-slate-400 leading-relaxed">{step.description}</p>
                </div>

                {/* Impact & Target Pollutant Badges */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Target Pollutant:</span>
                    <span className="font-bold text-amber-400">{step.targetPollutant}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-slate-400">Projected Impact:</span>
                    <span className="font-extrabold text-emerald-400">{step.expectedAqiDrop}</span>
                  </div>

                  {/* Checklist of Actions */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Protocol Checklist:</span>
                    {step.actions.map((act, aIdx) => {
                      const itemKey = idx * 10 + aIdx;
                      const isChecked = !!activeSteps[itemKey];

                      return (
                        <div
                          key={aIdx}
                          onClick={() => toggleStepAction(itemKey)}
                          className={`p-2 rounded-lg border text-[11px] flex items-start space-x-2 cursor-pointer transition-all ${
                            isChecked
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-200'
                              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="mt-0.5 accent-emerald-500 cursor-pointer"
                          />
                          <span className={isChecked ? 'line-through opacity-80' : ''}>{act}</span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="text-[9px] text-slate-500 pt-1 font-mono flex items-center space-x-1">
                    <Building2 className="w-3 h-3 text-slate-400" />
                    <span>{step.authority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
