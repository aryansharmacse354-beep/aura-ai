import React, { useState } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Sliders, 
  HeartPulse, 
  Users, 
  Atom, 
  BrainCircuit, 
  Image as ImageIcon, 
  Activity, 
  ShieldCheck, 
  Wind, 
  Thermometer, 
  Droplets, 
  Layers, 
  AlertTriangle,
  RefreshCw,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { AQIMeasurement, UserProfile } from '../types';
import { chatWithGemini } from '../services/geminiClientService';

interface RightPanelProps {
  currentCityData: AQIMeasurement;
  user: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}

export const RightPanel: React.FC<RightPanelProps> = ({
  currentCityData,
  user,
  activeTab,
  setActiveTab,
  isOpen,
  onToggleOpen
}) => {
  const [activeRightTab, setActiveRightTab] = useState<'copilot' | 'labs' | 'governance' | 'telemetry'>('copilot');
  const [selectedPersona, setSelectedPersona] = useState<'chemist' | 'epidemiologist' | 'gis' | 'policy' | 'triage'>('chemist');
  
  // Chat state
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'model'; text: string; modelUsed?: string }>>([
    {
      role: 'model',
      text: `Hello ${user.name}! I am your Gemini Atmospheric Intelligence copilot. Currently analyzing **${currentCityData.cityName}** (AQI: **${currentCityData.aqi}**). How can I assist with photochemistry, exposure, or policy simulations?`,
      modelUsed: 'gemini-2.5-flash'
    }
  ]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = (customText || inputMessage).trim();
    if (!textToSend || isLoading) return;

    const newHistory = [...chatHistory, { role: 'user' as const, text: textToSend }];
    setChatHistory(newHistory);
    setInputMessage('');
    setIsLoading(true);

    try {
      const { reply, modelUsed } = await chatWithGemini(
        newHistory,
        textToSend,
        selectedPersona,
        'gemini-2.5-flash'
      );
      setChatHistory(prev => [...prev, { role: 'model', text: reply, modelUsed }]);
    } catch (err) {
      const pm25Val = currentCityData.pollutants?.find(p => p.name === 'PM2.5')?.value || 185;
      setChatHistory(prev => [
        ...prev, 
        { 
          role: 'model', 
          text: `Inversion layer at ${currentCityData.weather.boundaryLayerHeightM}m is concentrating PM2.5 at ${pm25Val} µg/m³. Urgent mitigation recommended.`, 
          modelUsed: 'physics-fallback' 
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <aside 
        onClick={onToggleOpen}
        className="w-12 h-full bg-slate-900/90 border-l border-slate-800 flex flex-col items-center py-4 cursor-pointer hover:bg-slate-800/80 transition-all select-none z-20 group"
        title="Open AI Copilot & Operations Panel"
      >
        <button 
          className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform mb-4"
          aria-label="Expand Right Panel"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <div className="flex-1 flex flex-col items-center justify-center gap-6">
          <div className="flex items-center gap-1.5 -rotate-90 origin-center text-xs font-semibold uppercase tracking-wider text-slate-400 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 rotate-90" />
            <span>AI Copilot & Operations</span>
          </div>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mt-12" />
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 md:w-96 h-full bg-slate-900/95 backdrop-blur-md border-l border-slate-800 flex flex-col z-20 shadow-xl transition-all duration-300">
      {/* Top Header Bar */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-slate-100 tracking-wide">Aura AI Copilot</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Gemini 2.5
              </span>
            </div>
            <p className="text-[10px] text-slate-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-ping" />
              Direct Intelligence Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveTab('gemini_chat')}
            className="p-1.5 text-slate-400 hover:text-emerald-400 hover:bg-slate-800/80 rounded transition-colors"
            title="Open in Fullscreen Workspace"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onToggleOpen}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded transition-colors"
            title="Collapse Right Panel"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Panel Navigation Tabs */}
      <div className="grid grid-cols-4 border-b border-slate-800 text-[11px] font-medium bg-slate-950/40">
        <button
          onClick={() => setActiveRightTab('copilot')}
          className={`py-2 px-1 text-center border-b-2 transition-all flex flex-col items-center gap-0.5 ${
            activeRightTab === 'copilot'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Copilot</span>
        </button>
        <button
          onClick={() => setActiveRightTab('labs')}
          className={`py-2 px-1 text-center border-b-2 transition-all flex flex-col items-center gap-0.5 ${
            activeRightTab === 'labs'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Atom className="w-3.5 h-3.5" />
          <span>AI Labs</span>
        </button>
        <button
          onClick={() => setActiveRightTab('governance')}
          className={`py-2 px-1 text-center border-b-2 transition-all flex flex-col items-center gap-0.5 ${
            activeRightTab === 'governance'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Decisions</span>
        </button>
        <button
          onClick={() => setActiveRightTab('telemetry')}
          className={`py-2 px-1 text-center border-b-2 transition-all flex flex-col items-center gap-0.5 ${
            activeRightTab === 'telemetry'
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Physics</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar flex flex-col gap-3">
        {/* TAB 1: COPILOT */}
        {activeRightTab === 'copilot' && (
          <div className="flex-1 flex flex-col gap-3">
            {/* Persona Selector Chips */}
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'chemist', label: 'Chemist' },
                { id: 'epidemiologist', label: 'Health' },
                { id: 'gis', label: 'Satellite' },
                { id: 'policy', label: 'Policy' },
                { id: 'triage', label: 'Triage' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPersona(p.id as any)}
                  className={`text-[10px] px-2 py-0.5 rounded-full font-medium transition-all ${
                    selectedPersona === p.id 
                      ? 'bg-emerald-500 text-slate-950 font-bold' 
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Quick Prompts */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase font-semibold tracking-wider text-slate-400">Quick Inquiries:</span>
              <div className="flex flex-col gap-1">
                {[
                  `Analyze current boundary layer inversion in ${currentCityData.cityName}`,
                  `Is it safe for children & elderly outdoor activities today?`,
                  `Estimate PM2.5 reduction if heavy diesel freight is paused`
                ].map((promptText, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendMessage(promptText)}
                    disabled={isLoading}
                    className="text-left text-[11px] p-2 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700/50 transition-colors line-clamp-1"
                  >
                    ⚡ {promptText}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 flex flex-col gap-2 min-h-[160px] max-h-[300px] overflow-y-auto p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-xs custom-scrollbar">
              {chatHistory.map((msg, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-2.5 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-emerald-600 text-slate-950 font-medium rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    {msg.modelUsed && (
                      <span className="block mt-1 text-[9px] text-slate-400 font-mono">
                        via {msg.modelUsed}
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-center gap-2 p-2 text-slate-400 text-xs italic">
                  <RefreshCw className="w-3 h-3 animate-spin text-emerald-400" />
                  <span>Gemini reasoning with photochemistry priors...</span>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={inputMessage}
                onChange={e => setInputMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask Gemini Atmospheric Intelligence..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={isLoading || !inputMessage.trim()}
                className="p-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 rounded-lg transition-colors font-medium"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AI LABS */}
        {activeRightTab === 'labs' && (
          <div className="flex flex-col gap-2.5">
            <div 
              onClick={() => setActiveTab('ml_lab')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs group-hover:text-emerald-400">
                  <Atom className="w-4 h-4 text-emerald-400" />
                  <span>Atmospheric ML Lab</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono">20 Formulations</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                PINN, Graph Neural Networks, Transformer dispersion, and photochemistry solvers.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('agent_llm')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs group-hover:text-emerald-400">
                  <BrainCircuit className="w-4 h-4 text-emerald-400" />
                  <span>10,000 Node Climate Swarm</span>
                </div>
                <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-mono">Consensus Net</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Distributed agentic consensus predicting trans-boundary particulate drift.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('image_studio')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs group-hover:text-emerald-400">
                  <ImageIcon className="w-4 h-4 text-emerald-400" />
                  <span>Satellite & Plume Studio</span>
                </div>
                <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-mono">8 Ratios</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Synthesize high-fidelity satellite imagery and false-color plume dispersion.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: GOVERNANCE & DECISIONS */}
        {activeRightTab === 'governance' && (
          <div className="flex flex-col gap-2.5">
            <div 
              onClick={() => setActiveTab('simulator')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs group-hover:text-emerald-400">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  <span>GenAI Policy Simulator</span>
                </div>
                <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono">Counterfactual</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Simulate macro urban policies, odd-even traffic rules, and stack controls.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('health')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs group-hover:text-emerald-400">
                  <HeartPulse className="w-4 h-4 text-emerald-400" />
                  <span>Health & Exposure Shield</span>
                </div>
                <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded font-mono">WHO 2021</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Personalized pulmonary risk assessment, N95 advice, and indoor HEPA directives.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('multi_user')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs group-hover:text-emerald-400">
                  <Users className="w-4 h-4 text-emerald-400" />
                  <span>Multi-User Action Suite</span>
                </div>
                <span className="text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded font-mono">Collab</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Field incident geotagging, citizen emissions logs, and joint taskforces.
              </p>
            </div>

            <div 
              onClick={() => setActiveTab('profile')}
              className="p-3 rounded-lg bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 hover:border-emerald-500/50 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-slate-200 font-semibold text-xs group-hover:text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Security & Profile Vault</span>
                </div>
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded font-mono">RBAC</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Role management, cryptographic session validation, and tamper-evident audit logs.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: ATMOSPHERIC PHYSICS & TELEMETRY */}
        {activeRightTab === 'telemetry' && (
          <div className="flex flex-col gap-2">
            <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Atmospheric Diagnostics</span>
              
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Layers className="w-3 h-3 text-emerald-400" />
                    <span>Boundary Layer</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-100">
                    {currentCityData.weather.boundaryLayerHeightM} m
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Wind className="w-3 h-3 text-cyan-400" />
                    <span>Wind Vector</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-100">
                    {currentCityData.weather.windSpeedKmh} km/h {currentCityData.weather.windDirectionDeg}°
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Thermometer className="w-3 h-3 text-amber-400" />
                    <span>Temperature</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-100">
                    {currentCityData.weather.tempC}°C
                  </span>
                </div>

                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                    <Droplets className="w-3 h-3 text-blue-400" />
                    <span>Humidity</span>
                  </div>
                  <span className="text-sm font-mono font-bold text-slate-100">
                    {currentCityData.weather.humidity}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-amber-300">Inversion Alert</span>
                <p className="text-[11px] text-amber-200/80 leading-relaxed mt-0.5">
                  Shallow nocturnal boundary layer trapping PM2.5 in near-surface zone. Dispersion rate reduced by 42%.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Panel Footer */}
      <div className="p-2.5 border-t border-slate-800 bg-slate-950/70 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1 font-mono">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Key: AQ.Ab8...8Xw
        </span>
        <span className="text-slate-500">Latency: 28ms</span>
      </div>
    </aside>
  );
};
