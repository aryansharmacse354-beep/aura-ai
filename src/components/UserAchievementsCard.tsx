import React, { useState } from 'react';
import { 
  Award, 
  Trophy, 
  Flame, 
  Bike, 
  Eye, 
  WifiOff, 
  Leaf, 
  Zap, 
  HeartPulse, 
  CheckCircle2, 
  Lock, 
  Sparkles,
  Star,
  ShieldCheck,
  TrendingUp,
  Info
} from 'lucide-react';

export interface AchievementBadge {
  id: string;
  title: string;
  category: 'Monitoring' | 'Eco Mobility' | 'Sentinel' | 'Offline & Data';
  description: string;
  iconName: string;
  icon: React.FC<{ className?: string }>;
  unlocked: boolean;
  progress: number; // 0 to 100
  progressText: string;
  unlockedDate?: string;
  xpPoints: number;
  badgeColor: 'emerald' | 'teal' | 'amber' | 'blue' | 'purple' | 'rose';
}

export const UserAchievementsCard: React.FC = () => {
  const [selectedBadge, setSelectedBadge] = useState<AchievementBadge | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'in_progress'>('all');

  const badges: AchievementBadge[] = [
    {
      id: 'streak_7d',
      title: '7-Day Smog Sentinel',
      category: 'Monitoring',
      description: 'Log into Aura Predict for 7 consecutive days to monitor localized AQI fluctuations.',
      iconName: 'Flame',
      icon: Flame,
      unlocked: true,
      progress: 100,
      progressText: '7 / 7 Days Tracked',
      unlockedDate: 'Aug 04, 2026',
      xpPoints: 150,
      badgeColor: 'emerald'
    },
    {
      id: 'clean_route_master',
      title: 'Eco-Path Commuter',
      category: 'Eco Mobility',
      description: 'Routed through low-particulate corridors 10 times to minimize exposure.',
      iconName: 'Bike',
      icon: Bike,
      unlocked: true,
      progress: 100,
      progressText: '10 / 10 Low-Exposure Trips',
      unlockedDate: 'Aug 08, 2026',
      xpPoints: 250,
      badgeColor: 'teal'
    },
    {
      id: 'policy_sim_pro',
      title: 'Policy Strategist',
      category: 'Sentinel',
      description: 'Simulated 5 municipal traffic & dust mitigation scenarios with GenAI Policy Engine.',
      iconName: 'Leaf',
      icon: Leaf,
      unlocked: true,
      progress: 100,
      progressText: '5 / 5 Simulations Executed',
      unlockedDate: 'Aug 10, 2026',
      xpPoints: 300,
      badgeColor: 'purple'
    },
    {
      id: 'offline_vault_guardian',
      title: 'Offline Vault Guardian',
      category: 'Offline & Data',
      description: 'Cached high-resolution vector map tiles for offline emergency guidance.',
      iconName: 'WifiOff',
      icon: WifiOff,
      unlocked: true,
      progress: 100,
      progressText: '3 / 3 Regions Saved',
      unlockedDate: 'Aug 11, 2026',
      xpPoints: 200,
      badgeColor: 'blue'
    },
    {
      id: 'health_shield',
      title: 'Health Profile Pioneer',
      category: 'Monitoring',
      description: 'Configured custom sensitivity conditions (e.g. Asthma, Elderly) for personal alerts.',
      iconName: 'HeartPulse',
      icon: HeartPulse,
      unlocked: true,
      progress: 100,
      progressText: 'Profile Calibrated',
      unlockedDate: 'Aug 02, 2026',
      xpPoints: 100,
      badgeColor: 'rose'
    },
    {
      id: 'zero_emission_champion',
      title: 'Zero-Emission Vanguard',
      category: 'Eco Mobility',
      description: 'Logged 25 zero-emission transit commutes or walks during high AQI advisory days.',
      iconName: 'Zap',
      icon: Zap,
      unlocked: false,
      progress: 68,
      progressText: '17 / 25 Trips Logged',
      xpPoints: 500,
      badgeColor: 'amber'
    },
    {
      id: '30d_air_master',
      title: '30-Day Air Quality Titan',
      category: 'Monitoring',
      description: 'Maintained active environmental health monitoring across 30 consecutive calendar days.',
      iconName: 'Trophy',
      icon: Trophy,
      unlocked: false,
      progress: 40,
      progressText: '12 / 30 Days Active',
      xpPoints: 1000,
      badgeColor: 'amber'
    },
    {
      id: 'hotspot_sentinel',
      title: 'Industrial Hotspot Auditor',
      category: 'Sentinel',
      description: 'Inspected 10 GNN physical drift vector nodes and verified source attribution data.',
      iconName: 'Eye',
      icon: Eye,
      unlocked: false,
      progress: 30,
      progressText: '3 / 10 Hotspots Audited',
      xpPoints: 400,
      badgeColor: 'teal'
    }
  ];

  const filteredBadges = badges.filter((b) => {
    if (activeFilter === 'unlocked') return b.unlocked;
    if (activeFilter === 'in_progress') return !b.unlocked;
    return true;
  });

  const totalXP = badges.filter((b) => b.unlocked).reduce((sum, b) => sum + b.xpPoints, 0);
  const unlockedCount = badges.filter((b) => b.unlocked).length;

  const colorStyles: Record<string, { border: string; bg: string; text: string; ring: string }> = {
    emerald: {
      border: 'border-emerald-500/40',
      bg: 'bg-emerald-500/15',
      text: 'text-emerald-400',
      ring: 'shadow-emerald-500/20'
    },
    teal: {
      border: 'border-teal-500/40',
      bg: 'bg-teal-500/15',
      text: 'text-teal-400',
      ring: 'shadow-teal-500/20'
    },
    amber: {
      border: 'border-amber-500/40',
      bg: 'bg-amber-500/15',
      text: 'text-amber-400',
      ring: 'shadow-amber-500/20'
    },
    blue: {
      border: 'border-blue-500/40',
      bg: 'bg-blue-500/15',
      text: 'text-blue-400',
      ring: 'shadow-blue-500/20'
    },
    purple: {
      border: 'border-purple-500/40',
      bg: 'bg-purple-500/15',
      text: 'text-purple-400',
      ring: 'shadow-purple-500/20'
    },
    rose: {
      border: 'border-rose-500/40',
      bg: 'bg-rose-500/15',
      text: 'text-rose-400',
      ring: 'shadow-rose-500/20'
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
      {/* Card Header & Level Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
            <Trophy className="w-5 h-5 animate-bounce" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
              <span>Eco-Sentinel Achievement & Badge Center</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded font-bold">
                Level 4 Guardian
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Earn badges for consistent air quality tracking, clean routes, and eco-friendly behavior
            </p>
          </div>
        </div>

        {/* Stats Pill Badges */}
        <div className="flex items-center space-x-2 text-xs font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Total XP:</span>
            <span className="font-extrabold text-amber-300">{totalXP} XP</span>
          </div>
          <div className="bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center space-x-1.5">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400">Badges:</span>
            <span className="font-extrabold text-emerald-300">{unlockedCount} / {badges.length}</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-slate-100 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Badges ({badges.length})
          </button>
          <button
            onClick={() => setActiveFilter('unlocked')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeFilter === 'unlocked'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Unlocked ({unlockedCount})
          </button>
          <button
            onClick={() => setActiveFilter('in_progress')}
            className={`px-3 py-1 rounded-lg font-semibold transition-all ${
              activeFilter === 'in_progress'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            In Progress ({badges.length - unlockedCount})
          </button>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Click any badge for detailed criteria & impact
        </span>
      </div>

      {/* Badge Grid Display */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {filteredBadges.map((badge) => {
          const IconComponent = badge.icon;
          const style = colorStyles[badge.badgeColor] || colorStyles.emerald;

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between group space-y-2.5 ${
                badge.unlocked
                  ? `bg-slate-950/90 ${style.border} hover:border-slate-500 shadow-md ${style.ring}`
                  : 'bg-slate-950/40 border-slate-800/80 opacity-70 hover:opacity-100'
              }`}
            >
              {/* Top Row: Category tag & Status Icon */}
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider font-semibold">
                  {badge.category}
                </span>

                {badge.unlocked ? (
                  <span className="p-1 bg-emerald-500/20 rounded-full text-emerald-400">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </span>
                ) : (
                  <span className="p-1 bg-slate-800 rounded-full text-slate-500">
                    <Lock className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>

              {/* Badge Icon Centerpiece */}
              <div className="text-center py-1 space-y-1.5">
                <div
                  className={`w-12 h-12 mx-auto rounded-2xl border flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg ${
                    badge.unlocked
                      ? `${style.bg} ${style.border} ${style.text}`
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  <IconComponent className="w-6 h-6" />
                </div>

                <h4 className="font-extrabold text-xs text-slate-100 group-hover:text-emerald-300 transition-colors">
                  {badge.title}
                </h4>
              </div>

              {/* Progress Bar & Footer */}
              <div className="space-y-1">
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full transition-all duration-500 ${
                      badge.unlocked ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-amber-500'
                    }`}
                    style={{ width: `${badge.progress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-400 truncate">{badge.progressText}</span>
                  <span className="font-bold text-amber-400">{badge.xpPoints} XP</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Badge Modal / Extended Detail Card */}
      {selectedBadge && (
        <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 relative animate-in fade-in zoom-in-95">
          <button
            onClick={() => setSelectedBadge(null)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-100 text-xs font-mono bg-slate-900 hover:bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 cursor-pointer"
          >
            Close ✕
          </button>

          <div className="flex items-start space-x-3">
            <div className={`p-3 rounded-2xl border ${colorStyles[selectedBadge.badgeColor]?.bg} ${colorStyles[selectedBadge.badgeColor]?.border} ${colorStyles[selectedBadge.badgeColor]?.text}`}>
              <selectedBadge.icon className="w-8 h-8" />
            </div>

            <div className="space-y-1 pr-12">
              <div className="flex items-center space-x-2">
                <h4 className="font-extrabold text-sm text-slate-100">{selectedBadge.title}</h4>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  selectedBadge.unlocked ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                }`}>
                  {selectedBadge.unlocked ? 'Unlocked Badge' : 'Locked'}
                </span>
              </div>
              <p className="text-xs text-slate-300">{selectedBadge.description}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-800/80 font-mono">
            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Category:</span>
              <span className="font-bold text-slate-200">{selectedBadge.category}</span>
            </div>

            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Reward Value:</span>
              <span className="font-bold text-amber-400">+{selectedBadge.xpPoints} Eco XP</span>
            </div>

            <div className="bg-slate-900 p-2 rounded-xl border border-slate-800">
              <span className="text-slate-400 text-[10px] block">Achievement Date:</span>
              <span className="font-bold text-emerald-400">{selectedBadge.unlockedDate || 'In Progress'}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
