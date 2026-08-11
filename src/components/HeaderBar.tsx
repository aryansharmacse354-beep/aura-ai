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
  X
} from 'lucide-react';
import { CITIES_AQI_DATA } from '../data/mockData';
import { UserProfile } from '../types';

interface HeaderBarProps {
  selectedCity: string;
  setSelectedCity: (cityId: string) => void;
  activeTab: string;
  setActiveTab: (tabId: string) => void;
  user: UserProfile;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  selectedCity,
  setSelectedCity,
  activeTab,
  setActiveTab,
  user
}) => {
  const [utcTime, setUtcTime] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

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
    // Default fallback initial recent cities
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

  // Handle user selecting a city
  const handleSelectCity = (cityId: string) => {
    setSelectedCity(cityId);
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  // Clear recent searches history
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

  // Map recentCityIds to full city objects
  const recentCityObjects = recentCityIds
    .map((id) => CITIES_AQI_DATA.find((c) => c.cityId === id))
    .filter((c): c is typeof CITIES_AQI_DATA[0] => Boolean(c));

  return (
    <header className="bg-slate-950 border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs z-30 shadow-md">
      {/* Left: Model Checkpoint Badge & System Status */}
      <div className="flex items-center space-x-3">
        <div 
          onClick={() => setActiveTab('agent_llm')}
          className="flex items-center space-x-2 bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/30 px-3 py-1.5 rounded-xl cursor-pointer hover:border-emerald-400 transition-all group"
        >
          <div className="p-1 bg-emerald-500/20 text-emerald-400 rounded-lg group-hover:scale-110 transition-transform">
            <Cpu className="w-4 h-4" />
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
              <span>Multi-Agent Consensus Active &bull; Loss 0.0142</span>
            </p>
          </div>
        </div>

        {/* Live Agentic Grid Status Pill */}
        <div className="hidden lg:flex items-center space-x-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-300">
          <Bot className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
          <span>5 Climate Agents Syncing</span>
          <span className="text-emerald-400 font-bold ml-1">99.8% Physics Accuracy</span>
        </div>
      </div>

      {/* Center: Global District Quick Search Dropdown & Recent Searches */}
      <div className="relative flex-1 max-w-lg mx-auto flex flex-col justify-center">
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
          <div className="flex items-center space-x-1.5 mt-1.5 overflow-x-auto no-scrollbar py-0.5">
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
                  className={`px-2 py-0.5 rounded-lg text-[10px] font-mono flex items-center space-x-1 whitespace-nowrap transition-all border cursor-pointer ${
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
            {/* Backdrop click outside detector overlay */}
            <div 
              className="fixed inset-0 -z-10 bg-transparent" 
              onClick={() => setIsSearchOpen(false)} 
            />

            {/* If query is empty, display Recent Searches List */}
            {searchQuery.trim() === '' ? (
              <div className="p-2 space-y-1">
                <div className="flex items-center justify-between px-2 py-1 border-b border-slate-800/80">
                  <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center space-x-1">
                    <History className="w-3.5 h-3.5" />
                    <span>Recent Searches (Last 5 Investigated)</span>
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
              /* If search query entered, display filtered cities */
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

      {/* Right: Quick Shortcuts & Live UTC Clock */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Agentic LLM Studio Button */}
        <button
          onClick={() => setActiveTab('agent_llm')}
          className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
            activeTab === 'agent_llm'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow'
              : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-800'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Agentic Weather LLM</span>
        </button>

        {/* UTC Clock & Latency Badge */}
        <div className="hidden sm:flex items-center space-x-2 bg-slate-900 px-2.5 py-1.5 rounded-xl border border-slate-800 font-mono text-[10px]">
          <Clock className="w-3 h-3 text-slate-400" />
          <span className="text-slate-300 font-bold">{utcTime}</span>
          <span className="text-emerald-400 border-l border-slate-800 pl-2">14ms</span>
        </div>

        {/* User Badge */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 p-1 pl-2.5 rounded-xl border border-slate-800 cursor-pointer transition-all"
        >
          <span className="text-slate-300 font-extrabold text-[11px] truncate max-w-[90px]">{user.name}</span>
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

