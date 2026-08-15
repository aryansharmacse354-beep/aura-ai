import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  UserCheck, 
  Heart, 
  Building2, 
  Activity, 
  ShieldCheck, 
  Sliders, 
  Calculator, 
  Check, 
  TrendingDown, 
  Wind, 
  Flame, 
  TreePine, 
  Truck, 
  AlertTriangle,
  Send,
  Download,
  Share2
} from 'lucide-react';
import { UserProfile, UserRole, AQIMeasurement } from '../types';

interface RoleCustomizedFunctionsModalProps {
  user: UserProfile;
  currentCityData: AQIMeasurement;
  onRoleChange: (role: UserRole) => void;
  onClose: () => void;
}

export const RoleCustomizedFunctionsModal: React.FC<RoleCustomizedFunctionsModalProps> = ({
  user,
  currentCityData,
  onRoleChange,
  onClose
}) => {
  const [activeRole, setActiveRole] = useState<UserRole>(user.role);

  // Citizen Calculator States
  const [roomAreaSqFt, setRoomAreaSqFt] = useState(250);
  const [exerciseIntensity, setExerciseIntensity] = useState<'light' | 'moderate' | 'heavy'>('moderate');
  const [cadrResult, setCadrResult] = useState<number | null>(null);
  const [maxSafeExerciseMins, setMaxSafeExerciseMins] = useState<number | null>(null);

  // Planner Policy Calculator States
  const [canopyIncreasePercent, setCanopyIncreasePercent] = useState(15);
  const [oddEvenVehicleCutPercent, setOddEvenVehicleCutPercent] = useState(20);
  const [simulatedAqiReduction, setSimulatedAqiReduction] = useState<number | null>(null);

  // Analyst Speciation States
  const [analysisHorizonHours, setAnalysisHorizonHours] = useState(72);
  const [analyzedChemicalKinetics, setAnalyzedChemicalKinetics] = useState<string | null>(null);

  // Field Officer Action States
  const [dispatchSprinklers, setDispatchSprinklers] = useState(false);
  const [constructionHaltZone, setConstructionHaltZone] = useState(true);
  const [actionDispatchSuccess, setActionDispatchSuccess] = useState(false);

  // Calculate CADR & Exercise Limits
  const handleCalculateCitizenTools = (e: React.FormEvent) => {
    e.preventDefault();
    // CADR rule of thumb: CADR in CFM should be at least 2/3 of room area in sq ft
    const recommendedCADR = Math.round(roomAreaSqFt * 0.67 * (currentCityData.aqi > 200 ? 1.4 : 1.0));
    
    // Max safe outdoor exercise based on current AQI
    let baseMins = 60;
    if (currentCityData.aqi > 300) baseMins = 10;
    else if (currentCityData.aqi > 200) baseMins = 20;
    else if (currentCityData.aqi > 150) baseMins = 35;
    else if (currentCityData.aqi > 100) baseMins = 45;

    if (exerciseIntensity === 'heavy') baseMins = Math.round(baseMins * 0.6);
    if (exerciseIntensity === 'light') baseMins = Math.round(baseMins * 1.3);

    setCadrResult(recommendedCADR);
    setMaxSafeExerciseMins(baseMins);
  };

  // Calculate Urban Planner Interventions
  const handleSimulatePlannerTools = (e: React.FormEvent) => {
    e.preventDefault();
    const canopyCut = canopyIncreasePercent * 0.45; // 0.45 AQI drop per % canopy
    const vehicleCut = oddEvenVehicleCutPercent * 0.85; // 0.85 AQI drop per % vehicle cut
    const totalDrop = Math.round(canopyCut + vehicleCut);
    setSimulatedAqiReduction(totalDrop);
  };

  // Run Chemical Speciation Kinetics
  const handleRunAnalystKinetics = () => {
    setAnalyzedChemicalKinetics(
      `Photochemical Speciation over ${analysisHorizonHours}h indicates secondary ammonium nitrate (NH4NO3) aerosol synthesis dominates PM2.5 mass accretion (+14.2 µg/m³/day) under boundary layer compression (${currentCityData.weather.boundaryLayerHeightM}m).`
    );
  };

  // Dispatch Field Response Orders
  const handleDispatchFieldAction = () => {
    setActionDispatchSuccess(true);
    setTimeout(() => setActionDispatchSuccess(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-100 tracking-tight">
                Role-Tailored Multi-User Command Center
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Target Air Basin: {currentCityData.cityName} &bull; Current AQI: {currentCityData.aqi}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 bg-slate-950/60 border-b border-slate-800">
          <button
            onClick={() => {
              setActiveRole('citizen');
              onRoleChange('citizen');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeRole === 'citizen'
                ? 'bg-slate-900 border-emerald-500 text-slate-100 shadow-md shadow-emerald-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <Heart className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold text-xs">Citizen</span>
            </div>
            <span className="text-[10px] text-slate-400">Health & Safe Exertion</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('planner');
              onRoleChange('planner');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeRole === 'planner'
                ? 'bg-slate-900 border-teal-500 text-slate-100 shadow-md shadow-teal-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <Building2 className="w-4 h-4 text-teal-400" />
              <span className="font-extrabold text-xs">Urban Planner</span>
            </div>
            <span className="text-[10px] text-slate-400">Policy Levers & Canopy</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('analyst');
              onRoleChange('analyst');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeRole === 'analyst'
                ? 'bg-slate-900 border-cyan-500 text-slate-100 shadow-md shadow-cyan-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span className="font-extrabold text-xs">AQI Analyst</span>
            </div>
            <span className="text-[10px] text-slate-400">Chemical Speciation</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('field_officer');
              onRoleChange('field_officer');
            }}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
              activeRole === 'field_officer'
                ? 'bg-slate-900 border-amber-500 text-slate-100 shadow-md shadow-amber-500/10'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className="flex items-center space-x-1.5 mb-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span className="font-extrabold text-xs">Field Officer</span>
            </div>
            <span className="text-[10px] text-slate-400">Emergency Dispatch</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar flex-1">
          {/* 1. CITIZEN FUNCTION WORKSPACE */}
          {activeRole === 'citizen' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                  <Heart className="w-4 h-4 text-emerald-400" />
                  <span>Citizen Respiratory & Clean Living Toolkit</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Calculate exact HEPA air purifier CADR requirements and safe outdoor aerobic exertion durations based on current {currentCityData.cityName} atmospheric conditions.
                </p>
              </div>

              <form onSubmit={handleCalculateCitizenTools} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Living Space / Bedroom Area (sq ft)</label>
                    <input
                      type="number"
                      value={roomAreaSqFt}
                      onChange={(e) => setRoomAreaSqFt(parseInt(e.target.value) || 0)}
                      className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-100 font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-semibold">Planned Outdoor Exertion Intensity</label>
                    <select
                      value={exerciseIntensity}
                      onChange={(e) => setExerciseIntensity(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-800 px-3 py-2 rounded-xl text-slate-100 font-bold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="light">Light (Walking, Strolling)</option>
                      <option value="moderate">Moderate (Brisk Walk, Commuting)</option>
                      <option value="heavy">Heavy (Running, High-Cadence Cycling)</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Calculator className="w-4 h-4" />
                  <span>Compute Health Safeguards & Air Purifier CADR</span>
                </button>
              </form>

              {cadrResult !== null && maxSafeExerciseMins !== null && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-in fade-in">
                  <div className="p-4 bg-slate-950 border border-emerald-500/40 rounded-2xl space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Recommended Air Purifier CADR</div>
                    <div className="text-2xl font-black font-mono text-emerald-400">{cadrResult} CFM</div>
                    <p className="text-[11px] text-slate-400">Sufficient for 5 Air Changes Per Hour (ACH) in {roomAreaSqFt} sq ft.</p>
                  </div>

                  <div className="p-4 bg-slate-950 border border-teal-500/40 rounded-2xl space-y-1">
                    <div className="text-[10px] font-mono text-slate-400">Max Safe Outdoor Cardio Duration</div>
                    <div className="text-2xl font-black font-mono text-teal-400">{maxSafeExerciseMins} Mins</div>
                    <p className="text-[11px] text-slate-400">Wear N95 mask if AQI exceeds 150. Rest in filtered indoor areas.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 2. PLANNER FUNCTION WORKSPACE */}
          {activeRole === 'planner' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                  <Building2 className="w-4 h-4 text-teal-400" />
                  <span>Urban Planner Policy Simulation Levers</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Model the direct AQI impact of expanding green urban canopies and odd-even vehicular traffic rationing.
                </p>
              </div>

              <form onSubmit={handleSimulatePlannerTools} className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-4">
                <div className="space-y-3 text-xs">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-semibold">Urban Green Canopy Expansion: {canopyIncreasePercent}%</label>
                      <span className="font-mono text-teal-400 font-bold">+{canopyIncreasePercent}% Target</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={canopyIncreasePercent}
                      onChange={(e) => setCanopyIncreasePercent(parseInt(e.target.value) || 0)}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-semibold">Odd-Even Vehicular Restriction: {oddEvenVehicleCutPercent}%</label>
                      <span className="font-mono text-teal-400 font-bold">-{oddEvenVehicleCutPercent}% Traffic</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={oddEvenVehicleCutPercent}
                      onChange={(e) => setOddEvenVehicleCutPercent(parseInt(e.target.value) || 0)}
                      className="w-full accent-teal-500 cursor-pointer"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Calculate Projected District AQI Reduction</span>
                </button>
              </form>

              {simulatedAqiReduction !== null && (
                <div className="p-4 bg-slate-950 border border-teal-500/40 rounded-2xl space-y-2 animate-in fade-in">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-semibold">Projected Net AQI Drop:</span>
                    <span className="text-xl font-mono font-black text-teal-400">-{simulatedAqiReduction} Points</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    New Estimated AQI: <strong className="text-emerald-400 font-mono">{Math.max(30, currentCityData.aqi - simulatedAqiReduction)}</strong> (down from {currentCityData.aqi}).
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. ANALYST FUNCTION WORKSPACE */}
          {activeRole === 'analyst' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-cyan-400" />
                  <span>Photochemical Speciation & Aerosol Kinetics</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Analyze secondary inorganic aerosol (SIA) transformations: gaseous precursors (NO2, SO2, NH3) into respirable particulate mass.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-semibold">Analysis Horizon: {analysisHorizonHours} Hours</span>
                  <div className="flex space-x-2">
                    {[24, 48, 72].map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => setAnalysisHorizonHours(h)}
                        className={`px-3 py-1 rounded-lg font-mono text-xs font-bold cursor-pointer ${
                          analysisHorizonHours === h ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 border border-slate-800'
                        }`}
                      >
                        {h}h
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleRunAnalystKinetics}
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Activity className="w-4 h-4" />
                  <span>Compute Atmospheric Chemical Reaction Graph</span>
                </button>
              </div>

              {analyzedChemicalKinetics && (
                <div className="p-4 bg-slate-950 border border-cyan-500/40 rounded-2xl space-y-2 animate-in fade-in">
                  <div className="text-xs font-mono text-cyan-400 font-bold">Kinetics Synthesis Report:</div>
                  <p className="text-xs text-slate-300 font-mono leading-relaxed">{analyzedChemicalKinetics}</p>
                </div>
              )}
            </div>
          )}

          {/* 4. FIELD OFFICER WORKSPACE */}
          {activeRole === 'field_officer' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Rapid Emergency Response & Enforcement Dispatch</span>
                </h4>
                <p className="text-xs text-slate-400">
                  Deploy anti-smog water mist guns and issue mandatory construction dust halts in high-particulate clusters.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
                <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dispatchSprinklers}
                    onChange={(e) => setDispatchSprinklers(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-200 block">Deploy Anti-Smog Mobile Mist Cannon Fleet</span>
                    <span className="text-[11px] text-slate-400">Dispatches 12 high-pressure mist trucks along arterial ring roads.</span>
                  </div>
                </label>

                <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={constructionHaltZone}
                    onChange={(e) => setConstructionHaltZone(e.target.checked)}
                    className="w-4 h-4 accent-amber-500 cursor-pointer"
                  />
                  <div>
                    <span className="font-bold text-slate-200 block">Enforce Mandatory Construction Dust Halt Notice</span>
                    <span className="text-[11px] text-slate-400">Halts active demolition & unpaved earthworks within 5km radius.</span>
                  </div>
                </label>

                <button
                  type="button"
                  onClick={handleDispatchFieldAction}
                  className="w-full py-2.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-xl text-xs transition-colors cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Transmit Field Action Protocol to Municipal Patrols</span>
                </button>

                {actionDispatchSuccess && (
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                    <Check className="w-4 h-4" />
                    <span>Emergency Enforcement Directive Transmitted to 18 Field Units!</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="text-[11px] text-slate-400 font-mono">
            Active Role Profile: <strong className="text-emerald-400 uppercase">{activeRole}</strong>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
          >
            Done & Apply Role View
          </button>
        </div>
      </div>
    </div>
  );
};
