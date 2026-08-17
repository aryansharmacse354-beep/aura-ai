import React, { useState, useEffect, useRef } from 'react';
import { CITIES_AQI_DATA } from '../data/mockData';
import { 
  Map, 
  TrendingUp, 
  Sliders, 
  HeartPulse, 
  HardDriveDownload, 
  ShieldCheck, 
  BrainCircuit,
  Wifi, 
  WifiOff, 
  Compass, 
  UserCheck, 
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  MapPin,
  Navigation,
  Flame,
  Users,
  History,
  Atom,
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Search,
  CheckCircle2,
  ChevronDown,
  Bot,
  Image as ImageIcon,
  Ratio,
  Download
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';
import { AQILogo } from './AQILogo';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  gpsActive: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  user: UserProfile;
  onRoleChange?: (role: UserRole) => void;
  onVoiceReportTrigger?: () => void;
  onOpenInstallModal?: () => void;
  isInstalled?: boolean;
  hasInstallPrompt?: boolean;
}

export interface NavCategory {
  title: string;
  badge: string;
  items: {
    id: string;
    label: string;
    icon: any;
    badge?: string;
    desc?: string;
  }[];
}

export const NAV_CATEGORIES: NavCategory[] = [
  {
    title: 'Gemini Intelligence & Studio',
    badge: 'AI Suite',
    items: [
      { id: 'gemini_chat', label: 'Gemini AI Chatbot', icon: Bot, badge: 'Agent Chat', desc: 'Multi-turn chatbot with High Thinking, speech-to-text audio & persona roles' },
      { id: 'image_studio', label: 'Satellite & Image Studio', icon: ImageIcon, badge: '8 Ratios', desc: 'Synthesize satellite maps & plume images across 1:1, 16:9, 21:9, 9:16 aspect ratios' }
    ]
  },
  {
    title: 'Geospatial & Dispersion',
    badge: '3 Tools',
    items: [
      { id: 'map', label: '3D Pollution Map', icon: Map, badge: 'Multi-Ratio', desc: 'Real-time GNN spatial map with 16:9, 21:9 & dual views' },
      { id: 'route_nav', label: 'Clean-Air Navigator', icon: Navigation, badge: 'Low Exp.', desc: 'Exposure-minimizing routing engine' },
      { id: 'plume_lab', label: 'Gaussian Plume Lab', icon: Flame, badge: 'Physics', desc: 'Advection-diffusion plume dispersion' }
    ]
  },
  {
    title: 'Atmospheric AI & Physics',
    badge: '4 Modules',
    items: [
      { id: 'ml_lab', label: 'Atmospheric ML Lab', icon: Atom, badge: '20 Formulations', desc: 'PINN, GNN, Transformer, & Physics-AI Suite' },
      { id: 'agent_llm', label: '10k Agent Swarm', icon: BrainCircuit, badge: '10,000 Nodes', desc: 'Multi-agent climate consensus engine' },
      { id: 'forecast', label: '72h Forecast', icon: TrendingUp, badge: '± Bounds', desc: 'Probabilistic atmospheric prediction' },
      { id: 'historical', label: 'AQI Historical Trends', icon: History, badge: 'D3/Recharts', desc: 'Multi-year seasonal and diurnal trends' }
    ]
  },
  {
    title: 'Operations & Governance',
    badge: '3 Suites',
    items: [
      { id: 'multi_user', label: 'Multi-User Action Suite', icon: Users, badge: 'Collab', desc: 'Field annotations, incident logs & emissions tracking' },
      { id: 'simulator', label: 'GenAI Policy Sim', icon: Sliders, badge: 'Executive', desc: 'Macro counterfactual scenario forecasting' },
      { id: 'health', label: 'Health & Exposure Shield', icon: HeartPulse, badge: 'Personalized', desc: 'AI personalized health warnings & indoor air tips' }
    ]
  },
  {
    title: 'Edge & Security Vault',
    badge: '2 Services',
    items: [
      { id: 'offline', label: 'Offline Map Packages', icon: HardDriveDownload, badge: 'Edge GIS', desc: 'Local IndexedDB offline tile cache' },
      { id: 'profile', label: 'Security & Profile', icon: ShieldCheck, badge: 'MFA Vault', desc: 'RBAC, biometric credentials & audit logs' }
    ]
  }
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOffline,
  setIsOffline,
  gpsActive,
  selectedCity,
  setSelectedCity,
  user,
  onRoleChange,
  onVoiceReportTrigger,
  onOpenInstallModal,
  isInstalled = false,
  hasInstallPrompt = false
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navSearch, setNavSearch] = useState('');

  // Voice Command States
  const [isListening, setIsListening] = useState(false);
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const currentCityObj = CITIES_AQI_DATA.find((c) => c.cityId === selectedCity) || CITIES_AQI_DATA[0];

  // Voice Command Processor
  const processVoiceCommand = (rawTranscript: string) => {
    const transcript = rawTranscript.toLowerCase().trim();
    setVoiceFeedback(`Heard: "${rawTranscript}"`);

    const speak = (text: string) => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
      }
    };

    if (transcript.includes('forecast') || transcript.includes('predict')) {
      setActiveTab('forecast');
      speak(`Switching to 72-hour atmospheric forecast for ${currentCityObj.cityName}`);
    } else if (transcript.includes('route') || transcript.includes('navigator') || transcript.includes('clean air')) {
      setActiveTab('route_nav');
      speak(`Opening Clean-Air Route Navigator`);
    } else if (transcript.includes('plume') || transcript.includes('dispersion') || transcript.includes('gaussian')) {
      setActiveTab('plume_lab');
      speak(`Opening Gaussian Plume Dispersion Lab`);
    } else if (transcript.includes('ml lab') || transcript.includes('machine learning') || transcript.includes('prompt') || transcript.includes('pinn')) {
      setActiveTab('ml_lab');
      speak(`Opening Atmospheric Machine Learning Lab with 20 Prompt Suite`);
    } else if (transcript.includes('multi user') || transcript.includes('stakeholder') || transcript.includes('annotation') || transcript.includes('incident') || transcript.includes('pinned')) {
      setActiveTab('multi_user');
      speak(`Opening Multi-User Stakeholder Action Suite & Collaborative Field Notes`);
    } else if (transcript.includes('map') || transcript.includes('3d') || transcript.includes('gnn')) {
      setActiveTab('map');
      speak(`Opening 3D Pollution Map for ${currentCityObj.cityName}`);
    } else if (transcript.includes('history') || transcript.includes('trend') || transcript.includes('historical')) {
      setActiveTab('historical');
      speak(`Opening historical AQI trend diagnostics`);
    } else if (transcript.includes('swarm') || transcript.includes('agent') || transcript.includes('llm')) {
      setActiveTab('agent_llm');
      speak(`Opening 10,000 Node Agent Swarm`);
    } else if (transcript.includes('policy') || transcript.includes('simulator')) {
      setActiveTab('simulator');
      speak(`Opening Executive GenAI Policy Simulator`);
    } else if (transcript.includes('health') || transcript.includes('advisor') || transcript.includes('mask')) {
      setActiveTab('health');
      speak(`Opening Personalized Health Advisor`);
    } else if (transcript.includes('offline') || transcript.includes('download')) {
      setActiveTab('offline');
      speak(`Opening Offline Map Package Manager`);
    } else if (transcript.includes('profile') || transcript.includes('security') || transcript.includes('mfa')) {
      setActiveTab('profile');
      speak(`Opening Security and Profile Settings`);
    } else if (transcript.includes('alert') || transcript.includes('status') || transcript.includes('report') || transcript.includes('aqi')) {
      const reportText = `Current AQI in ${currentCityObj.cityName} is ${currentCityObj.aqi}, classified as ${currentCityObj.aqiCategory}. Primary pollutant is ${currentCityObj.primaryPollutant}. Wind speed is ${currentCityObj.weather.windSpeedKmh} kilometers per hour.`;
      speak(reportText);
      if (onVoiceReportTrigger) onVoiceReportTrigger();
    } else {
      setVoiceFeedback(`Command not recognized: "${rawTranscript}"`);
      setTimeout(() => setVoiceFeedback(null), 3000);
      return;
    }

    setTimeout(() => {
      setVoiceFeedback(null);
    }, 4000);
  };

  // Toggle Voice Recognition
  const toggleVoiceListener = () => {
    if (isListening) {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn('Failed to stop speech recognition', e);
        }
      }
      setIsListening(false);
      return;
    }

    try {
      const SpeechRecognition = typeof window !== 'undefined' && ((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
          setVoiceFeedback('Listening for voice command... (e.g. "show forecast", "alert status")');
        };

        recognition.onresult = (event: any) => {
          const transcript = event?.results?.[0]?.[0]?.transcript || '';
          if (transcript) {
            processVoiceCommand(transcript);
          }
          setIsListening(false);
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech recognition error:', event?.error);
          setIsListening(false);
          setVoiceFeedback(`Speech recognition unavailable (${event?.error || 'error'})`);
          setTimeout(() => setVoiceFeedback(null), 3000);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } else {
        setIsListening(true);
        setVoiceFeedback('Speech API simulated. Triggering voice AQI report...');
        setTimeout(() => {
          processVoiceCommand('alert status');
          setIsListening(false);
        }, 1500);
      }
    } catch (err) {
      console.warn('Speech recognition start failed:', err);
      setIsListening(false);
      setVoiceFeedback('Speech API unavailable. Triggering voice AQI report...');
      setTimeout(() => {
        processVoiceCommand('alert status');
      }, 1000);
    }
  };

  // Filter categories by search term
  const filteredCategories = NAV_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.label.toLowerCase().includes(navSearch.toLowerCase()) ||
      (item.desc && item.desc.toLowerCase().includes(navSearch.toLowerCase())) ||
      (item.badge && item.badge.toLowerCase().includes(navSearch.toLowerCase()))
    )
  })).filter((cat) => cat.items.length > 0);

  return (
    <>
      {/* Mobile Bar Header */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between z-50">
        <div className="flex items-center space-x-2">
          <AQILogo variant="icon-only" iconClassName="w-8 h-8" size="sm" />
          <span className="font-bold text-sm tracking-tight text-slate-100">AuraPredict AI</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full bg-slate-950 border-r border-slate-800 flex flex-col justify-between z-40 transition-all duration-300 ${
          isCollapsed ? 'md:w-20' : 'md:w-72'
        } ${
          mobileMenuOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header & Navigation Section */}
        <div className="p-3.5 space-y-3 flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3 flex-shrink-0">
            <div className={`flex items-center space-x-2.5 overflow-hidden ${isCollapsed ? 'hidden' : 'flex'}`}>
              <AQILogo variant="icon-only" iconClassName="w-9 h-9" size="sm" />
              <div className="leading-tight">
                <h1 className="font-extrabold text-sm tracking-tight text-slate-100">AuraPredict <span className="text-cyan-400">AI</span></h1>
                <p className="text-[10px] text-slate-400 font-mono">Atmospheric Platform</p>
              </div>
            </div>

            {/* Collapse Toggle Button */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors ml-auto"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Voice-Command Listener Bar */}
          {!isCollapsed ? (
            <div className="space-y-1.5 flex-shrink-0">
              <button
                onClick={toggleVoiceListener}
                className={`w-full py-1.5 px-2.5 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/20 animate-pulse'
                    : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-emerald-500/50 hover:text-emerald-300'
                }`}
                title="Speak: 'show forecast', 'alert status', 'plume lab', 'clean navigator', 'ml lab'"
              >
                <div className="flex items-center space-x-2">
                  {isListening ? (
                    <Mic className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
                  ) : (
                    <Mic className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  <span className="text-[11px]">{isListening ? 'Listening...' : 'Voice Navigation'}</span>
                </div>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  isListening ? 'bg-rose-500/30 text-rose-200' : 'bg-slate-950 text-slate-400'
                }`}>
                  {isListening ? 'Active' : 'Mic'}
                </span>
              </button>

              {voiceFeedback && (
                <div className="p-2 bg-slate-900 border border-emerald-500/30 rounded-xl text-[10px] text-emerald-300 font-mono animate-in fade-in">
                  <div className="flex items-center space-x-1 mb-0.5">
                    <Volume2 className="w-3 h-3 text-emerald-400" />
                    <span className="font-bold text-[9px] uppercase">Voice Status</span>
                  </div>
                  <p className="line-clamp-2">{voiceFeedback}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex justify-center flex-shrink-0">
              <button
                onClick={toggleVoiceListener}
                className={`p-2 rounded-xl border transition-colors ${
                  isListening
                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-emerald-400'
                }`}
                title="Voice Navigation & Alerts"
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Quick Target District Selector */}
          {!isCollapsed && (
            <div className="bg-slate-900/80 p-2 rounded-xl border border-slate-800 space-y-1 flex-shrink-0">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>Target District ({CITIES_AQI_DATA.length}):</span>
                </div>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 text-emerald-400 text-[11px] font-bold py-1 px-2 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
              >
                {CITIES_AQI_DATA.map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.cityName} &bull; AQI {city.aqi} ({city.country.replace('India (', '').replace(')', '')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filter Quick-Search in Sidebar */}
          {!isCollapsed && (
            <div className="relative flex-shrink-0">
              <Search className="w-3 h-3 text-slate-400 absolute left-2.5 top-2" />
              <input
                type="text"
                placeholder="Filter tools & decks..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-800/80 rounded-lg pl-7 pr-6 py-1 text-[11px] text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-all font-sans"
              />
              {navSearch && (
                <button
                  onClick={() => setNavSearch('')}
                  className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          )}

          {/* Structured Categorized Navigation Deck */}
          <nav className="flex-1 min-h-0 overflow-y-auto custom-scrollbar space-y-3 pr-1">
            {filteredCategories.map((category) => (
              <div key={category.title} className="space-y-1">
                {!isCollapsed && (
                  <div className="flex items-center justify-between px-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>{category.title}</span>
                    <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                      {category.badge}
                    </span>
                  </div>
                )}

                <div className="space-y-0.5">
                  {category.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActiveTab(item.id);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-2' : 'justify-between px-2.5 py-1.5'} rounded-xl text-xs font-semibold transition-all cursor-pointer group ${
                          isActive
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 border border-transparent'
                        }`}
                        title={isCollapsed ? `${item.label} - ${item.desc || ''}` : item.desc}
                      >
                        <div className="flex items-center space-x-2.5 min-w-0">
                          <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-slate-200'}`} />
                          {!isCollapsed && (
                            <span className="truncate text-[11px] font-medium">{item.label}</span>
                          )}
                        </div>
                        {!isCollapsed && item.badge && (
                          <span className={`px-1.5 py-0.2 text-[9px] rounded font-mono flex-shrink-0 ${
                            isActive ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-900 text-slate-400'
                          }`}>
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom Utility Controls & User Profile */}
        <div className="p-3 border-t border-slate-800 space-y-2 flex-shrink-0 bg-slate-950/90">
          {!isCollapsed ? (
            <>
              {/* GPS Sync & Offline Toggle Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {/* GPS Status */}
                <div className="flex items-center justify-between bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <Compass className={`w-3 h-3 ${gpsActive ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} />
                    <span className="text-slate-300 text-[10px]">GPS</span>
                  </div>
                  <span className={`text-[9px] font-bold px-1 py-0.2 rounded ${
                    gpsActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                  }`}>
                    {gpsActive ? 'Live' : 'Off'}
                  </span>
                </div>

                {/* Offline Mode Button */}
                <button
                  onClick={() => setIsOffline(!isOffline)}
                  className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    isOffline 
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                      : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                  title="Toggle Local Cache Mode"
                >
                  <div className="flex items-center space-x-1">
                    {isOffline ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-emerald-400" />}
                    <span className="text-[10px]">{isOffline ? 'Offline' : 'Online'}</span>
                  </div>
                  <span className="text-[8px] font-mono text-slate-400">{isOffline ? 'Edge' : 'Cloud'}</span>
                </button>
              </div>

              {/* Install App Button */}
              {onOpenInstallModal && (
                <button
                  onClick={onOpenInstallModal}
                  className={`w-full p-2 rounded-xl border text-xs font-bold flex items-center justify-between transition-all cursor-pointer ${
                    hasInstallPrompt
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-emerald-500/30'
                      : isInstalled
                      ? 'bg-slate-900 text-emerald-400 border-slate-800'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
                  }`}
                  title="Install AuraPredict AI App (PWA, Desktop, Mobile & Docker)"
                >
                  <div className="flex items-center space-x-2">
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{isInstalled ? 'App Installed' : 'Install App'}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
                    PWA
                  </span>
                </button>
              )}

              {/* Role Switcher */}
              <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="flex items-center space-x-1 text-slate-400 text-[10px]">
                  <UserCheck className="w-3 h-3 text-indigo-400" />
                  <span>Active Role:</span>
                </div>
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange && onRoleChange(e.target.value as UserRole)}
                  className="w-full bg-slate-950 text-slate-200 text-[11px] font-semibold py-0.5 px-1.5 rounded border border-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="citizen">Role: Citizen</option>
                  <option value="planner">Role: Municipal Planner</option>
                  <option value="analyst">Role: Environmental Analyst</option>
                  <option value="field_officer">Role: Field Officer</option>
                </select>
              </div>

              {/* User Profile Badge */}
              <div 
                onClick={() => setActiveTab('profile')}
                className="flex items-center space-x-2 pt-0.5 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full ring-1 ring-emerald-500/40 object-cover flex-shrink-0"
                />
                <div className="text-left text-xs overflow-hidden min-w-0">
                  <p className="font-bold text-slate-100 truncate text-[11px]">{user.name}</p>
                  <p className="text-[9px] text-slate-400 font-mono capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-2">
              <button
                onClick={() => setIsOffline(!isOffline)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                title={isOffline ? 'Offline Mode Active' : 'Online Stream Active'}
              >
                {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
              </button>

              <div 
                onClick={() => setActiveTab('profile')}
                className="cursor-pointer"
                title={user.name}
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-6 h-6 rounded-full ring-1 ring-emerald-500/40 object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
