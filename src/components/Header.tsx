import React from 'react';
import { 
  Map, 
  TrendingUp, 
  Navigation, 
  Sliders, 
  HeartPulse, 
  HardDriveDownload, 
  ShieldCheck, 
  Wifi, 
  WifiOff, 
  Compass, 
  UserCheck, 
  Activity,
  Layers
} from 'lucide-react';
import { UserRole, UserProfile } from '../types';

interface HeaderProps {
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

export const Header: React.FC<HeaderProps> = ({
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
  const navItems = [
    { id: 'map', label: '3D Pollution Map', icon: Map, badge: 'GNN' },
    { id: 'forecast', label: '72h Forecast', icon: TrendingUp, badge: '± Bounds' },
    { id: 'navigation', label: 'Clean-Path Nav', icon: Navigation, badge: 'GPS' },
    { id: 'simulator', label: 'GenAI Policy Sim', icon: Sliders, badge: 'Executive' },
    { id: 'health', label: 'Health & Alerts', icon: HeartPulse, badge: 'Personalized' },
    { id: 'offline', label: 'Offline Maps', icon: HardDriveDownload, badge: isOffline ? 'Active' : 'Ready' },
    { id: 'profile', label: 'Security & Profile', icon: ShieldCheck, badge: user.mfaEnabled ? 'MFA On' : 'Setup' }
  ];

  return (
    <header className="bg-slate-950 text-slate-100 border-b border-slate-800 sticky top-0 z-50 shadow-xl backdrop-blur-md bg-opacity-95">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex flex-wrap items-center justify-between border-b border-slate-800/80 text-xs text-slate-400 gap-2">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 font-semibold tracking-wide text-emerald-400">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>AuraPredict AI v3.4</span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded font-mono">
              Industrial Enterprise
            </span>
          </div>

          <div className="h-3.5 w-px bg-slate-800 hidden md:block" />

          {/* Location Selector */}
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
            <span className="text-slate-400 font-medium">District Target:</span>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-emerald-400 font-medium focus:outline-none cursor-pointer"
            >
              <option value="delhi" className="bg-slate-900 text-slate-100">Delhi NCR (AQI 284)</option>
              <option value="mumbai" className="bg-slate-900 text-slate-100">Mumbai Metro (AQI 142)</option>
              <option value="beijing" className="bg-slate-900 text-slate-100">Beijing Capital (AQI 168)</option>
              <option value="new_york" className="bg-slate-900 text-slate-100">New York City (AQI 48)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Live GPS Signal Status */}
          <div className={`flex items-center space-x-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium transition-colors ${
            gpsActive 
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}>
            <Compass className={`w-3 h-3 ${gpsActive ? 'animate-spin' : ''}`} />
            <span>{gpsActive ? 'Real-Time GPS Synced' : 'GPS Re-centering'}</span>
          </div>

          {/* Offline Mode Switcher */}
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
              isOffline 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm' 
                : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
            }`}
            title="Toggle Offline Map Mode & Cached Data"
          >
            {isOffline ? (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Forced Offline Mode</span>
              </>
            ) : (
              <>
                <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                <span>Online Cloud Stream</span>
              </>
            )}
          </button>

          {/* User Role Switcher */}
          <div className="flex items-center space-x-1.5 bg-slate-900 px-2 py-1 rounded-md border border-slate-800">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={user.role}
              onChange={(e) => onRoleChange(e.target.value as UserRole)}
              className="bg-transparent text-slate-300 text-xs font-medium focus:outline-none cursor-pointer"
            >
              <option value="citizen" className="bg-slate-900">Role: Citizen</option>
              <option value="planner" className="bg-slate-900">Role: Municipal Planner</option>
              <option value="analyst" className="bg-slate-900">Role: Environmental Analyst</option>
              <option value="field_officer" className="bg-slate-900">Role: Field Officer</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between overflow-x-auto no-scrollbar">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <div className="pr-3 mr-2 border-r border-slate-800 hidden lg:flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-emerald-500/20">
              <Layers className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-tight text-slate-100 leading-tight">AuraPredict</h1>
              <p className="text-[10px] text-slate-400 font-medium">Spatio-Temporal Air Platform</p>
            </div>
          </div>

          <nav className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className={`px-1.5 py-0.2 text-[9px] rounded font-mono font-normal ${
                      isActive 
                        ? 'bg-emerald-500/20 text-emerald-300' 
                        : 'bg-slate-800 text-slate-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Badge Shortcut */}
        <div 
          onClick={() => setActiveTab('profile')}
          className="hidden sm:flex items-center space-x-2.5 pl-3 border-l border-slate-800 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <img
            src={user.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={user.name}
            className="w-7 h-7 rounded-full ring-1 ring-emerald-500/50 object-cover"
          />
          <div className="text-left text-xs">
            <p className="font-semibold text-slate-200 leading-none">{user.name}</p>
            <p className="text-[10px] text-slate-400 capitalize mt-0.5 font-mono">{user.role.replace('_', ' ')}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
