import React, { useState, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Cpu, 
  Globe, 
  Activity, 
  Search, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Zap, 
  Layers,
  MapPin,
  Flame,
  ChevronDown,
  History,
  Trash2,
  X,
  Navigation,
  Users,
  Atom,
  Sun,
  Moon,
  Compass,
  Sliders,
  HeartPulse,
  HardDriveDownload,
  LayoutGrid,
  Image as ImageIcon,
  Ratio
} from 'lucide-react';
import { CITIES_AQI_DATA } from '../data/mockData';
import { UserProfile, ThemeMode } from '../types';
import { AQILogo } from './AQILogo';

interface HeaderBarProps {
  selectedCity: string;
  setSelectedCity: (cityId: string) => void;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  user: UserProfile;
  onOpenRoleModal?: () => void;
  theme?: ThemeMode;
  onToggleTheme?: () => void;
}

interface DeckGroup {
  id: string;
  label: string;
  badge: string;
  icon: any;
  tabs: { id: string; label: string; icon: any }[];
}

const SYSTEM_DECKS: DeckGroup[] = [
  {
    id: 'gemini_intelligence',
    label: 'Gemini Intelligence & Studio',
    badge: 'Agent & Vision',
    icon: Sparkles,
    tabs: [
      { id: 'gemini_chat', label: 'Gemini AI Chatbot', icon: Bot },
      { id: 'image_studio', label: 'Satellite & Image Studio', icon: ImageIcon }
    ]
  },
  {
    id: 'geospatial',
    label: 'Geospatial Deck',
    badge: '3D Maps & Plumes',
    icon: Compass,
    tabs: [
      { id: 'map', label: '3D Pollution Map', icon: Globe },
      { id: 'route_nav', label: 'Clean-Air Navigator', icon: Navigation },
      { id: 'plume_lab', label: 'Gaussian Plume Lab', icon: Flame }
    ]
  },
  {
    id: 'ai_lab',
    label: 'Atmospheric AI Lab',
    badge: 'PINN / 10k Nodes',
    icon: Cpu,
    tabs: [
      { id: 'ml_lab', label: 'Atmospheric ML Lab', icon: Atom },
      { id: 'agent_llm', label: '10k Agent Swarm', icon: Bot },
      { id: 'forecast', label: '72h Forecast', icon: TrendingUp },
      { id: 'historical', label: 'AQI Historical Data', icon: History }
    ]
  },
  {
    id: 'operations',
    label: 'Operations & Policy',
    badge: 'Action Suite',
    icon: Sliders,
    tabs: [
      { id: 'multi_user', label: 'Multi-User Action Suite', icon: Users },
      { id: 'simulator', label: 'GenAI Policy Sim', icon: Sliders },
      { id: 'health', label: 'Health & Exposure Shield', icon: HeartPulse }
    ]
  },
  {
    id: 'system',
    label: 'Edge GIS & Vault',
    badge: 'MFA & Offline',
    icon: ShieldCheck,
    tabs: [
      { id: 'offline', label: 'Offline Maps', icon: HardDriveDownload },
      { id: 'profile', label: 'Security & Profile', icon: ShieldCheck }
    ]
  }
];

export const HeaderBar: React.FC<HeaderBarProps> = ({
  selectedCity,
  setSelectedCity,
  activeTab,
  setActiveTab,
  user,
  onOpenRoleModal,
  theme = 'slate',
  onToggleTheme
}) => {
  const [utcTime, setUtcTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDeckMenuOpen, setIsDeckMenuOpen] = useState(false);

  // Local storage backed state for recent searches (max 5)
  const [recentCityIds, setRecentCityIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('recent_city_searches');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.slice(0, 5);
        }
      }
    } catch (e) {
      console.error('Failed to parse recent city searches from localStorage', e);
    }
    return ['delhi', 'mumbai', 'beijing', 'tokyo', 'san_francisco'];
  });

  const currentCity = CITIES_AQI_DATA.find((c) => c.cityId === selectedCity) || CITIES_AQI_DATA[0];

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setUtcTime(now.toISOString().substring(11, 19) + ' UTC');
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync selectedCity into recent searches
  useEffect(() => {
    if (!selectedCity) return;
    setRecentCityIds((prev) => {
      const filtered = prev.filter((id) => id !== selectedCity);
      const updated = [selectedCity, ...filtered].slice(0, 5);
      try {
        localStorage.setItem('recent_city_searches', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save recent searches', e);
      }
      return updated;
    });
  }, [selectedCity]);

  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const handleClearRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentCityIds([]);
    try {
      localStorage.removeItem('recent_city_searches');
    } catch (e) {
      console.error('Failed to clear recent searches from localStorage', e);
    }
  };

  const filteredCities = CITIES_AQI_DATA.filter((c) =>
    c.cityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentCityObjects = recentCityIds
    .map((id) => CITIES_AQI_DATA.find((c) => c.cityId === id))
    .filter((c): c is typeof CITIES_AQI_DATA[0] => Boolean(c));

  // Find active deck
  const activeDeck = SYSTEM_DECKS.find((d) => d.tabs.some((t) => t.id === activeTab)) || SYSTEM_DECKS[0];
  const activeTabObj = activeDeck.tabs.find((t) => t.id === activeTab);

  return (
    <header className="bg-slate-950 border-b border-slate-800/80 px-3.5 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs z-30 shadow-md">
      {/* Left: Atmospheric AI Engine Status & Quick Deck Selector */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setActiveTab('gemini_chat')}
          className="flex items-center space-x-1.5 focus:outline-none"
          title="Open Gemini Atmospheric Intelligence"
        >
          <AQILogo variant="icon-only" iconClassName="w-8 h-8" size="sm" />
        </button>

        {/* Model Engine Badge */}
        <div 
          onClick={() => setActiveTab('agent_llm')}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 px-2.5 py-1.5 rounded-xl cursor-pointer hover:border-emerald-400 transition-all group shadow-sm"
        >
          <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold text-slate-100 text-[11px]">Aura-Weather-LLM-v3.4</span>
              <span className="text-[9px] bg-emerald-500/20 text-emerald-300 font-mono px-1.5 py-0.2 rounded font-bold">
                70B Fine-Tuned
              </span>
            </div>
            <p className="text-[9px] text-slate-400 font-mono flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              <span>5-Agent Physics Consensus Active</span>
            </p>
          </div>
        </div>

        {/* Global Deck Navigator Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDeckMenuOpen(!isDeckMenuOpen)}
            className="hidden sm:flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-850 px-2.5 py-1.5 rounded-xl border border-slate-800 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Switch Operational Deck"
          >
            <LayoutGrid className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold text-[11px] text-slate-200">{activeDeck.label}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {isDeckMenuOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 animate-in fade-in space-y-1.5">
              <div 
                className="fixed inset-0 -z-10 bg-transparent" 
                onClick={() => setIsDeckMenuOpen(false)} 
              />
              <div className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider px-2 py-0.5 border-b border-slate-800">
                System Operational Decks
              </div>
              {SYSTEM_DECKS.map((deck) => {
                const Icon = deck.icon;
                const isCurrent = deck.id === activeDeck.id;
                return (
                  <div key={deck.id} className="space-y-0.5">
                    <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold text-slate-300 bg-slate-900/60 rounded">
                      <div className="flex items-center space-x-1.5">
                        <Icon className="w-3 h-3 text-emerald-400" />
                        <span>{deck.label}</span>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500">{deck.badge}</span>
                    </div>
                    <div className="pl-3 space-y-0.5">
                      {deck.tabs.map((tab) => {
                        const TabIcon = tab.icon;
                        const isTabActive = activeTab === tab.id;
                        return (
                          <button
                            key={tab.id}
                            onClick={() => {
                              setActiveTab(tab.id);
                              setIsDeckMenuOpen(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-[11px] flex items-center justify-between transition-colors ${
                              isTabActive
                                ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                            }`}
                          >
                            <div className="flex items-center space-x-1.5">
                              <TabIcon className="w-3 h-3" />
                              <span>{tab.label}</span>
                            </div>
                            {isTabActive && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Center: Global District Quick Search Dropdown & Recent Searches */}
      <div className="relative flex-1 max-w-md mx-auto flex flex-col justify-center">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search district, atmospheric station, or air basin..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchOpen(true);
            }}
            onFocus={() => setIsSearchOpen(true)}
            className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500/80 rounded-xl pl-8 pr-28 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none transition-all font-sans"
          />
          <div className="absolute right-2 top-1.5 flex items-center space-x-1">
            <span className="px-1.5 py-0.5 bg-slate-800 text-slate-300 font-mono text-[9px] rounded border border-slate-700/60 flex items-center space-x-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              <span>{currentCity.cityName}</span>
              <span className="text-emerald-400 font-bold ml-0.5">AQI {currentCity.aqi}</span>
            </span>
          </div>
        </div>

        {/* Quick One-Click Recent Searches Chips Row */}
        {recentCityObjects.length > 0 && (
          <div className="flex items-center space-x-1.5 mt-1 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[9px] font-mono text-slate-400 flex items-center space-x-1 whitespace-nowrap uppercase tracking-wider">
              <History className="w-3 h-3 text-emerald-400 inline" />
              <span>Recent:</span>
            </span>
            {recentCityObjects.map((c) => {
              const isCurrent = c.cityId === selectedCity;
              return (
                <button
                  key={c.cityId}
                  onClick={() => handleSelectCity(c.cityId)}
                  title={`Navigate to ${c.cityName} forecast`}
                  className={`px-1.5 py-0.2 rounded-md text-[10px] font-mono flex items-center space-x-1 whitespace-nowrap transition-all border cursor-pointer ${
                    isCurrent
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm font-bold'
                      : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{c.cityName}</span>
                  <span className={`text-[9px] font-bold ${
                    c.aqi > 250 ? 'text-rose-400' : c.aqi > 150 ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {c.aqi}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Floating Search Results & Recent Searches Modal Dropdown */}
        {isSearchOpen && (
          <div className="absolute top-full left-0 right-0 mt-1.5 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto custom-scrollbar">
            <div 
              className="fixed inset-0 -z-10 bg-transparent" 
              onClick={() => setIsSearchOpen(false)} 
            />

            {searchQuery.trim() === '' ? (
              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800/80">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Searches</span>
                  </span>
                  {recentCityObjects.length > 0 && (
                    <button
                      onClick={handleClearRecent}
                      className="text-[10px] font-mono text-slate-400 hover:text-rose-400 flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>

                {recentCityObjects.length === 0 ? (
                  <p className="text-[11px] text-slate-500 p-3 text-center">No recent searches saved.</p>
                ) : (
                  recentCityObjects.map((c) => (
                    <div
                      key={c.cityId}
                      onClick={() => handleSelectCity(c.cityId)}
                      className="p-2 hover:bg-slate-900 rounded-lg flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg text-emerald-400 group-hover:border-emerald-500/50">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-xs text-slate-200 group-hover:text-emerald-300">{c.cityName}</p>
                          <p className="text-[10px] text-slate-400">{c.country}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 text-right">
                        <div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            c.aqi > 250 ? 'bg-rose-500/20 text-rose-300' : c.aqi > 150 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                          }`}>
                            AQI {c.aqi}
                          </span>
                          <span className="block text-[9px] text-slate-500">{c.aqiCategory}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="divide-y divide-slate-900">
                {filteredCities.length === 0 ? (
                  <p className="text-[11px] text-slate-400 p-4 text-center">No atmospheric stations found matching "{searchQuery}"</p>
                ) : (
                  filteredCities.map((c) => (
                    <div
                      key={c.cityId}
                      onClick={() => handleSelectCity(c.cityId)}
                      className="p-2.5 hover:bg-slate-900 flex items-center justify-between cursor-pointer transition-colors group"
                    >
                      <div className="flex items-center space-x-2.5">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        <div>
                          <p className="font-bold text-xs text-slate-200 group-hover:text-emerald-300">{c.cityName}</p>
                          <p className="text-[10px] text-slate-400">{c.country}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          c.aqi > 250 ? 'bg-rose-500/20 text-rose-300' : c.aqi > 150 ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          AQI {c.aqi}
                        </span>
                        <span className="block text-[9px] text-slate-500">{c.aqiCategory}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right: Operational Tool Shortcuts, Theme Switcher & UTC Clock */}
      <div className="flex items-center space-x-2 text-xs">
        {/* 3D Map Direct Shortcut */}
        <button
          onClick={() => setActiveTab('map')}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'map'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
          title="Open 3D Multi-Ratio Air Quality Map"
        >
          <Globe className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden xl:inline">Live Map</span>
        </button>

        {/* Clean-Air Navigator Shortcut Button */}
        <button
          onClick={() => setActiveTab('route_nav')}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'route_nav'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
          title="Open Clean-Air Eco-Routing Navigator"
        >
          <Navigation className="w-3.5 h-3.5 text-teal-400" />
          <span className="hidden xl:inline">Eco-Routes</span>
        </button>

        {/* Atmospheric ML Lab Button */}
        <button
          onClick={() => setActiveTab('ml_lab')}
          className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'ml_lab'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
          title="Open Atmospheric ML Lab"
        >
          <Atom className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden lg:inline">ML Lab</span>
        </button>

        {/* Multi-User Role Customized Functions Modal */}
        {onOpenRoleModal && (
          <button
            onClick={onOpenRoleModal}
            className="px-2.5 py-1.5 rounded-xl border border-emerald-500/30 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 text-xs font-bold flex items-center space-x-1 transition-all cursor-pointer"
            title="Open Role-Customized Functions Modal"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Role Deck</span>
          </button>
        )}

        {/* Global Theme Mode Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded-xl border text-xs font-bold flex items-center justify-center transition-all cursor-pointer ${
              theme === 'light'
                ? 'bg-amber-400/20 text-amber-500 border-amber-400/40 hover:bg-amber-400/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800 hover:text-amber-300'
            }`}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to High-Contrast Light Mode'}
          >
            {theme === 'light' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>
        )}

        {/* UTC Clock & Latency Badge */}
        <div className="hidden md:flex items-center space-x-2 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-[10px]">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300 font-bold">{utcTime}</span>
          <span className="text-emerald-400 border-l border-slate-800 pl-2">14ms</span>
        </div>

        {/* User Profile Badge */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 p-1 pl-2.5 rounded-xl border border-slate-800 cursor-pointer transition-all"
        >
          <span className="text-slate-300 font-extrabold text-[11px] truncate max-w-[85px]">{user.name}</span>
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-6 h-6 rounded-lg ring-1 ring-emerald-500/50 object-cover"
          />
        </div>
      </div>
    </header>
  );
};
