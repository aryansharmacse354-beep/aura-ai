import React, { useState } from 'react';
import { PollutantDetail } from '../types';
import { Sparkles, Activity, ShieldAlert, HeartPulse, Info, CheckCircle2 } from 'lucide-react';

interface PollutantBadgeTooltipProps {
  pollutant: PollutantDetail;
}

const POLLUTANT_AI_KNOWLEDGE: Record<string, {
  fullName: string;
  sourceOrigin: string;
  healthImpactAI: string;
  organEffect: string;
  precaution: string;
}> = {
  'PM2.5': {
    fullName: 'Fine Particulate Matter (< 2.5 µm)',
    sourceOrigin: 'Heavy diesel transport, biomass burning, coal-fired thermal plants',
    healthImpactAI: 'Ultra-fine particles bypass pulmonary cilia to penetrate deep alveolar sacs and systemic bloodstream, triggering microvascular inflammation, asthma exacerbations, and elevated ischemic heart risk.',
    organEffect: 'Deep Lung Alveoli & Cardiovascular System',
    precaution: 'Wear certified N95/FFP2 respirators outdoors. Activate indoor HEPA purification.'
  },
  'PM10': {
    fullName: 'Coarse Inhalable Particulates (< 10 µm)',
    sourceOrigin: 'Construction dust, road friction wear, windblown soil erosion',
    healthImpactAI: 'Coarse particles settle in upper respiratory airways and tracheobronchial mucosa, causing mechanical airway abrasion, chronic cough, and reduced vital capacity.',
    organEffect: 'Upper Airways, Nasal Passages & Bronchi',
    precaution: 'Avoid outdoor exercise near active road corridors and construction sites.'
  },
  'NO2': {
    fullName: 'Nitrogen Dioxide Gas',
    sourceOrigin: 'High-temperature diesel engine combustion & industrial furnaces',
    healthImpactAI: 'Aggressive oxidizer that corrodes airway epithelial cells, dramatically elevates pediatric asthma susceptibility, and heightens lung infection severity.',
    organEffect: 'Bronchial Lining & Immune Defense Mechanisms',
    precaution: 'Avoid outdoor exposure during peak traffic hours and morning inversion.'
  },
  'O3': {
    fullName: 'Ground-Level Tropospheric Ozone',
    sourceOrigin: 'Photochemical solar reaction between NOx and VOC precursor emissions',
    healthImpactAI: 'Highly reactive molecule that oxidizes lung wall lipids, causing acute chest tightness, reduced exercise tolerance, and permanent airway scarring with repeated exposure.',
    organEffect: 'Pulmonary Elastic Tissue & Deep Bronchioles',
    precaution: 'Shift strenuous outdoor physical workouts to early morning hours.'
  },
  'SO2': {
    fullName: 'Sulfur Dioxide Gas',
    sourceOrigin: 'Coal combustion power plants, petroleum refineries, metal smelting',
    healthImpactAI: 'Soluble sulfurous gas that dissolves in respiratory mucous to form acid, inducing rapid bronchospasm, throat burning, and severe eye lacrimation.',
    organEffect: 'Upper Trachea, Larynx & Ocular Mucosa',
    precaution: 'Keep windows tightly closed downwind of industrial thermal clusters.'
  },
  'CO': {
    fullName: 'Carbon Monoxide Gas',
    sourceOrigin: 'Incomplete hydrocarbon combustion in congested stop-and-go traffic',
    healthImpactAI: 'Competitively binds hemoglobin with 200x greater affinity than oxygen, forming carboxyhemoglobin and causing cellular hypoxia, dizziness, and cognitive fatigue.',
    organEffect: 'Hemoglobin Binding & Central Nervous System',
    precaution: 'Maintain adequate ventilation near unvented heaters and enclosed roadways.'
  }
};

export const PollutantBadgeTooltip: React.FC<PollutantBadgeTooltipProps> = ({ pollutant }) => {
  const [isOpen, setIsOpen] = useState(false);

  const aiDetails = POLLUTANT_AI_KNOWLEDGE[pollutant.name] || {
    fullName: `${pollutant.name} Pollutant Component`,
    sourceOrigin: 'Urban industrial and vehicular transport sources',
    healthImpactAI: `Elevated levels of ${pollutant.name} (${pollutant.value} ${pollutant.unit}) exceed recommended health baselines and irritate the respiratory system.`,
    organEffect: 'Respiratory System & Cellular Metabolism',
    precaution: 'Monitor personal health symptoms and minimize prolonged outdoor exertion.'
  };

  const isDanger = pollutant.percentOfLimit > 200;
  const isModerate = pollutant.percentOfLimit > 100;

  return (
    <div className="relative inline-block">
      {/* Interactive Pollutant Badge Button */}
      <button
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onClick={() => setIsOpen(!isOpen)}
        className={`px-2.5 py-1.5 rounded-xl border font-mono text-xs flex items-center space-x-2 transition-all cursor-pointer ${
          isDanger
            ? 'bg-red-500/15 border-red-500/40 text-red-300 hover:bg-red-500/25 shadow-sm shadow-red-500/20'
            : isModerate
            ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 hover:bg-amber-500/25 shadow-sm shadow-amber-500/20'
            : 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
        }`}
      >
        <span className="font-bold">{pollutant.name}</span>
        <span className="font-extrabold text-slate-100">{pollutant.value}</span>
        <span className="text-[10px] text-slate-400">{pollutant.unit}</span>
      </button>

      {/* Interactive Hover Card / Popover Tooltip */}
      {isOpen && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 w-72 bg-slate-950/95 backdrop-blur-md border border-slate-700/90 rounded-2xl p-3.5 shadow-2xl z-50 text-xs space-y-2.5 pointer-events-none animate-in fade-in zoom-in-95">
          {/* Card Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-2">
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-sm text-slate-100">{pollutant.name}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  isDanger ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {pollutant.category}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">{aiDetails.fullName}</div>
            </div>
            <div className="text-right font-mono">
              <div className="font-bold text-emerald-400 text-sm">{pollutant.value} {pollutant.unit}</div>
              <div className="text-[9px] text-slate-400">{pollutant.percentOfLimit}% of WHO limit</div>
            </div>
          </div>

          {/* AI Health Impact Explanation Box */}
          <div className="bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center space-x-1 text-emerald-400 font-bold text-[11px]">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Gemini AI Health Impact Analysis</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              {aiDetails.healthImpactAI}
            </p>
          </div>

          {/* Organ Target & Precaution */}
          <div className="space-y-1 text-[11px]">
            <div className="flex items-center space-x-1 text-slate-300">
              <HeartPulse className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>Target Organ: <strong className="text-slate-100">{aiDetails.organEffect}</strong></span>
            </div>
            <div className="flex items-start space-x-1 text-slate-300">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>Protocol: <strong className="text-amber-200">{aiDetails.precaution}</strong></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
