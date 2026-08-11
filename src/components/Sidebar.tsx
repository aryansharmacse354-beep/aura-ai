import React, { useState } from 'react';
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
  MapPin
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  gpsActive: boolean;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  user: UserProfile;
  onRoleChange: (role: UserRole) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOffline,
  setIsOffline,
  gpsActive,
  selectedCity,
  setSelectedCity,
  user,
  onRoleChange
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'map', label: '3D Pollution Map', icon: Map, badge: 'GNN' },
    { id: 'forecast', label: '72h Forecast', icon: TrendingUp, badge: '± Bounds' },
    { id: 'agent_llm', label: 'Agentic Weather LLM', icon: BrainCircuit, badge: '70B AI' },
    { id: 'simulator', label: 'GenAI Policy Sim', icon: Sliders, badge: 'Executive' },
    { id: 'health', label: 'Health & Alerts', icon: HeartPulse, badge: 'Personalized' },
    { id: 'offline', label: 'Offline Maps', icon: HardDriveDownload, badge: isOffline ? 'Active' : 'Ready' },
    { id: 'profile', label: 'Security & Profile', icon: ShieldCheck, badge: user.mfaEnabled ? 'MFA On' : 'Setup' }
  ];

  return (
    <>
      {/* Mobile Bar Header (Only visible on small screens) */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 p-3 flex items-center justify-between z-50">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md">
            <Layers className="w-5 h-5 text-slate-950" />
          </div>
          <span className="font-bold text-sm tracking-tight text-slate-100">AuraPredict AI</span>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-slate-300 hover:text-white bg-slate-900 rounded-lg border border-slate-800"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Container (Desktop Sidebar / Mobile Overlay Drawer) */}
      <aside
        className={`fixed md:relative top-0 left-0 h-full bg-slate-950 border-r border-slate-800 flex flex-col justify-between z-40 transition-all duration-300 ${
          isCollapsed ? 'md:w-20' : 'md:w-64'
        } ${
          mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header Section */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <div className={`flex items-center space-x-2.5 overflow-hidden ${isCollapsed ? 'hidden' : 'flex'}`}>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/20 flex-shrink-0">
                <Layers className="w-5 h-5 text-slate-950" />
              </div>
              <div className="leading-tight">
                <h1 className="font-extrabold text-sm tracking-tight text-slate-100">AuraPredict <span className="text-emerald-400">AI</span></h1>
                <p className="text-[10px] text-slate-400 font-mono">Enterprise Air Platform</p>
              </div>
            </div>

            {/* Collapse Toggle Button (Desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 border border-slate-800 transition-colors ml-auto"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Target District Selector */}
          {!isCollapsed && (
            <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Target District ({CITIES_AQI_DATA.length}):</span>
                </div>
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-slate-950 text-emerald-400 text-xs font-bold py-1.5 px-2 rounded-lg border border-slate-800 focus:outline-none focus:border-emerald-500 cursor-pointer max-h-40"
              >
                {CITIES_AQI_DATA.map((city) => (
                  <option key={city.cityId} value={city.cityId}>
                    {city.cityName} &bull; AQI {city.aqi} ({city.country.replace('India (', '').replace(')', '')})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-3'} py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                    {!isCollapsed && <span>{item.label}</span>}
                  </div>
                  {!isCollapsed && item.badge && (
                    <span className={`px-1.5 py-0.5 text-[9px] rounded font-mono ${
                      isActive ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-900 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Controls */}
        <div className="p-4 border-t border-slate-800 space-y-3">
          {!isCollapsed ? (
            <>
              {/* GPS Sync Card */}
              <div className="flex items-center justify-between text-xs bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center space-x-2">
                  <Compass className={`w-3.5 h-3.5 ${gpsActive ? 'text-emerald-400 animate-spin' : 'text-amber-400'}`} />
                  <span className="text-slate-300 font-medium">GPS Signal</span>
                </div>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  gpsActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {gpsActive ? 'Synced' : 'Active'}
                </span>
              </div>

              {/* Forced Offline Toggle */}
              <button
                onClick={() => setIsOffline(!isOffline)}
                className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-between transition-colors ${
                  isOffline 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {isOffline ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
                  <span>{isOffline ? 'Offline Mode' : 'Online Stream'}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{isOffline ? 'Active' : 'Cloud'}</span>
              </button>

              {/* Role Switcher */}
              <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex items-center space-x-1 text-slate-400 text-[11px]">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Role View:</span>
                </div>
                <select
                  value={user.role}
                  onChange={(e) => onRoleChange(e.target.value as UserRole)}
                  className="w-full bg-slate-950 text-slate-200 text-xs font-semibold py-1 px-2 rounded border border-slate-800 focus:outline-none cursor-pointer"
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
                className="flex items-center space-x-2.5 pt-2 cursor-pointer hover:opacity-80 transition-opacity"
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-8 h-8 rounded-full ring-2 ring-emerald-500/40 object-cover flex-shrink-0"
                />
                <div className="text-left text-xs overflow-hidden">
                  <p className="font-bold text-slate-100 truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 font-mono capitalize">{user.role.replace('_', ' ')}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center space-y-3">
              <button
                onClick={() => setIsOffline(!isOffline)}
                className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800"
                title={isOffline ? 'Offline Mode Active' : 'Online Stream Active'}
              >
                {isOffline ? <WifiOff className="w-4 h-4 text-amber-400" /> : <Wifi className="w-4 h-4 text-emerald-400" />}
              </button>

              <div 
                onClick={() => setActiveTab('profile')}
                className="cursor-pointer"
                title={user.name}
              >
                <img
                  src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full ring-2 ring-emerald-500/40 object-cover"
                />
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
