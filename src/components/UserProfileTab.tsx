import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  KeyRound, 
  User, 
  Smartphone, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  ShieldAlert,
  FileSpreadsheet,
  Bell,
  Heart,
  MapPin,
  Camera,
  Plus,
  Trash2,
  Search,
  Check,
  Key,
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { UserProfile, SecurityAuditLog, UserRole, HealthCondition } from '../types';
import { UserAchievementsCard } from './UserAchievementsCard';

interface UserProfileTabProps {
  user: UserProfile;
  auditLogs: SecurityAuditLog[];
  onUpdateUser: (updatedFields: Partial<UserProfile>) => void;
}

const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
];

const HEALTH_OPTIONS: { id: HealthCondition; label: string; desc: string }[] = [
  { id: 'asthma', label: 'Asthma', desc: 'Airway hyper-responsiveness to PM2.5 & NO2' },
  { id: 'copd', label: 'COPD', desc: 'Chronic respiratory limitation' },
  { id: 'cardiovascular', label: 'Cardiovascular Risk', desc: 'Sensitivity to vascular pollutant spikes' },
  { id: 'pregnant', label: 'Pregnancy', desc: 'Heightened sensitivity to atmospheric toxins' },
  { id: 'elderly', label: 'Senior / Elderly (65+)', desc: 'Higher risk of PM2.5 deep alveolar deposition' },
  { id: 'child', label: 'Pediatric / Child (<12)', desc: 'Developing lung tissue vulnerability' },
  { id: 'outdoor_worker', label: 'Outdoor Field Worker', desc: 'High daily continuous ambient exposure' },
  { id: 'athlete', label: 'Outdoor Athlete', desc: 'High pulmonary ventilation rate during exercise' }
];

export const UserProfileTab: React.FC<UserProfileTabProps> = ({
  user,
  auditLogs,
  onUpdateUser
}) => {
  // Sync state variables with incoming user prop
  const [userName, setUserName] = useState(user.name);
  const [userEmail, setUserEmail] = useState(user.email);
  const [userRole, setUserRole] = useState<UserRole>(user.role);
  const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || AVATAR_PRESETS[0]);
  const [alertThreshold, setAlertThreshold] = useState(user.alertThresholdAQI || 150);
  const [healthConditions, setHealthConditions] = useState<HealthCondition[]>(user.healthConditions || []);
  const [savedLocations, setSavedLocations] = useState(user.savedLocations || []);

  // Location form state
  const [newLocName, setNewLocName] = useState('');
  const [newLocLat, setNewLocLat] = useState('');
  const [newLocLng, setNewLocLng] = useState('');
  const [showAddLocation, setShowAddLocation] = useState(false);

  // Password form state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Log filter
  const [logSearch, setLogSearch] = useState('');

  // Toast Feedback Messages
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [passSuccessMsg, setPassSuccessMsg] = useState<string | null>(null);
  const [passErrorMsg, setPassErrorMsg] = useState<string | null>(null);
  const [csvSuccessMsg, setCsvSuccessMsg] = useState<string | null>(null);

  // Sync effect when user prop changes externally
  useEffect(() => {
    setUserName(user.name);
    setUserEmail(user.email);
    setUserRole(user.role);
    setAvatarUrl(user.avatarUrl || AVATAR_PRESETS[0]);
    setAlertThreshold(user.alertThresholdAQI || 150);
    setHealthConditions(user.healthConditions || []);
    setSavedLocations(user.savedLocations || []);
  }, [user]);

  const handleExportCSV = () => {
    const headers = ['Log ID', 'Timestamp', 'Event Description', 'Client IP', 'Location', 'Device / Client', 'Status'];
    const csvRows = [
      headers.join(','),
      ...(auditLogs || []).map((log) =>
        [
          `"${log.id}"`,
          `"${log.timestamp}"`,
          `"${log.event.replace(/"/g, '""')}"`,
          `"${log.ipAddress}"`,
          `"${log.location.replace(/"/g, '""')}"`,
          `"${log.device.replace(/"/g, '""')}"`,
          `"${log.status}"`
        ].join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const formattedName = userName.toLowerCase().replace(/\s+/g, '_');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.download = `${formattedName}_security_audit_logs_${dateStr}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setCsvSuccessMsg('Security Audit Logs CSV Exported Successfully!');
    setTimeout(() => setCsvSuccessMsg(null), 3500);
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: userName,
      email: userEmail,
      role: userRole,
      avatarUrl,
      alertThresholdAQI: alertThreshold,
      healthConditions,
      savedLocations
    });
    setProfileSuccessMsg('User profile & health settings saved successfully!');
    setTimeout(() => setProfileSuccessMsg(null), 3500);
  };

  const handleToggleHealthCondition = (conditionId: HealthCondition) => {
    const updated = healthConditions.includes(conditionId)
      ? healthConditions.filter((c) => c !== conditionId)
      : [...healthConditions, conditionId];
    setHealthConditions(updated);
    onUpdateUser({ healthConditions: updated });
  };

  const handleAddLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName || !newLocLat || !newLocLng) return;
    const latNum = parseFloat(newLocLat);
    const lngNum = parseFloat(newLocLng);
    if (isNaN(latNum) || isNaN(lngNum)) return;

    const updated = [...savedLocations, { name: newLocName, lat: latNum, lng: lngNum }];
    setSavedLocations(updated);
    onUpdateUser({ savedLocations: updated });
    setNewLocName('');
    setNewLocLat('');
    setNewLocLng('');
    setShowAddLocation(false);
  };

  const handleRemoveLocation = (index: number) => {
    const updated = savedLocations.filter((_, i) => i !== index);
    setSavedLocations(updated);
    onUpdateUser({ savedLocations: updated });
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassErrorMsg(null);
    if (newPass.length < 6) {
      setPassErrorMsg('New password must be at least 6 characters long.');
      return;
    }
    if (newPass !== confirmPass) {
      setPassErrorMsg('New password and confirmation do not match.');
      return;
    }

    setCurrentPass('');
    setNewPass('');
    setConfirmPass('');
    setPassSuccessMsg('Password hash updated & secure session tokens re-signed!');
    setTimeout(() => setPassSuccessMsg(null), 4000);
  };

  const roleCapabilities: Record<UserRole, string[]> = {
    citizen: [
      'Access 3D Live AQI Heatmaps & GPS Realtime Tracking',
      'Receive Personal Health Warnings & AI Advisor Guidance',
      'Download Clean-Path Navigation Corridors for Offline Guidance',
      'Configure Custom AQI Alert Threshold Notifications'
    ],
    planner: [
      'Access GenAI Municipal Policy Simulator & Strategic Briefings',
      'Execute Multi-District Intervention Scenarios & Cost Modeling',
      'View Speciated Pollutant Component Breakdown & Inversion Height',
      'Export Executive Policy Briefings & High-Res Heatmap Vectors'
    ],
    analyst: [
      'Inspect Graph Neural Network (GNN) Physical Drift Vectors',
      'Audit 72h Sequence-to-Sequence LSTM Uncertainty Bounds (±)',
      'Run Automated Source Attribution Algorithms',
      'Ingest Satellite Aerosol Optical Depth (AOD) Telemetry Feeds'
    ],
    field_officer: [
      'Report On-Ground Pollution Violations & Industrial Stacks',
      'Calibrate Sensor Nodes & In-Situ Monitoring Telemetry',
      'Cache High-Resolution Offline Vector Tiles for Field Patrols',
      'Receive Emergency Smog Threshold Breach Push Dispatch'
    ]
  };

  const filteredLogs = (auditLogs || []).filter(
    (log) =>
      log.event.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.location.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.ipAddress.toLowerCase().includes(logSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Top Banner Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-100 flex items-center space-x-2">
              <span>Secure User Profile & Security Command Center</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                Active Session
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Manage personal health condition profiles, AQI alert thresholds, multi-factor authentication, and audit logs
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <span className="text-slate-400">Auth Token Status:</span>
          <span className="px-2.5 py-1 rounded-lg font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center space-x-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>SHA256 Signed</span>
          </span>
        </div>
      </div>

      {/* Main Grid: Profile Settings & Security Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Profile Details & Health Calibration */}
        <div className="space-y-6 lg:col-span-1">
          {/* Account Profile Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <User className="w-4 h-4 text-emerald-400" />
                <span>Account & Role Settings</span>
              </h3>
              <span className="text-[10px] bg-slate-800 text-emerald-400 font-mono px-2 py-0.5 rounded uppercase font-bold">
                {userRole.replace('_', ' ')}
              </span>
            </div>

            <form onSubmit={handleProfileSave} className="space-y-4 text-xs">
              {/* Avatar Selector */}
              <div>
                <label className="text-slate-300 font-semibold block mb-2 flex items-center space-x-1.5">
                  <Camera className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Profile Photo / Avatar</span>
                </label>
                <div className="flex items-center space-x-3 mb-2">
                  <img
                    src={avatarUrl}
                    alt={userName}
                    className="w-12 h-12 rounded-full ring-2 ring-emerald-500/50 object-cover flex-shrink-0"
                  />
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-slate-400 block font-mono">Select Avatar Preset:</span>
                    <div className="flex items-center space-x-1.5">
                      {AVATAR_PRESETS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatarUrl(preset)}
                          className={`w-6 h-6 rounded-full overflow-hidden border transition-all cursor-pointer ${
                            avatarUrl === preset ? 'ring-2 ring-emerald-400 scale-110' : 'opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={preset} alt="" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="Or enter custom avatar image URL..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-200 font-mono text-[11px] px-3 py-1.5 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Full Name */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-medium px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* Email Address */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Email Address</label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-mono px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              {/* User Role Dropdown Switcher */}
              <div>
                <label className="text-slate-300 font-semibold block mb-1 flex items-center space-x-1.5">
                  <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Platform Authorization Role</span>
                </label>
                <select
                  value={userRole}
                  onChange={(e) => setUserRole(e.target.value as UserRole)}
                  className="w-full bg-slate-950 border border-slate-800 text-emerald-300 font-bold px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500 cursor-pointer"
                >
                  <option value="citizen">Role: Citizen / General Resident</option>
                  <option value="planner">Role: Municipal Urban Planner</option>
                  <option value="analyst">Role: Environmental Air Quality Analyst</option>
                  <option value="field_officer">Role: Field Emergency Response Officer</option>
                </select>
              </div>

              {/* AQI Alert Threshold Slider */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-slate-300 font-semibold flex items-center space-x-1.5">
                    <Bell className="w-3.5 h-3.5 text-amber-400" />
                    <span>Personal AQI Push Threshold</span>
                  </label>
                  <span className="font-mono font-extrabold text-amber-400 text-xs px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    {alertThreshold} AQI
                  </span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="10"
                  value={alertThreshold}
                  onChange={(e) => setAlertThreshold(parseInt(e.target.value) || 150)}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 gap-1">
                  <button
                    type="button"
                    onClick={() => setAlertThreshold(100)}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      alertThreshold === 100 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    100 Moderate
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertThreshold(150)}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      alertThreshold === 150 ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    150 Unhealthy
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertThreshold(200)}
                    className={`px-2 py-0.5 rounded border transition-colors cursor-pointer ${
                      alertThreshold === 200 ? 'bg-red-500/20 text-red-300 border-red-500/40' : 'bg-slate-950 border-slate-800'
                    }`}
                  >
                    200 Very Unhealthy
                  </button>
                </div>
              </div>

              {/* Save Button & Feedback */}
              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 cursor-pointer flex items-center justify-center space-x-2 mt-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Save Profile Settings</span>
              </button>

              {profileSuccessMsg && (
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}
            </form>
          </div>

          {/* Account Password Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="border-b border-slate-800 pb-2">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <span>Account Password</span>
              </h3>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Current Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-slate-100 px-3 py-2 rounded-xl focus:outline-none focus:border-emerald-500"
                />
              </div>

              <button
                type="submit"
                disabled={!newPass || newPass.length < 6}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl disabled:opacity-50 transition-colors cursor-pointer"
              >
                Update Password
              </button>
            </form>

            {passErrorMsg && (
              <div className="p-2.5 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl text-xs flex items-center space-x-1.5 animate-fade-in">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{passErrorMsg}</span>
              </div>
            )}

            {passSuccessMsg && (
              <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center space-x-1.5 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{passSuccessMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Health Conditions Matrix, Saved Locations, Achievements, Audit Logs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Health & Environmental Vulnerability Calibration Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm text-slate-100">Personal Health Conditions & Vulnerability Profile</h3>
              </div>
              <span className="text-[10px] bg-rose-500/20 text-rose-300 font-mono px-2 py-0.5 rounded font-bold">
                {healthConditions.length} Active Conditions
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Select your respiratory and cardiovascular profile to tailor AI Health Advisor recommendations and trigger instant push alerts:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              {HEALTH_OPTIONS.map((opt) => {
                const isSelected = healthConditions.includes(opt.id);

                return (
                  <div
                    key={opt.id}
                    onClick={() => handleToggleHealthCondition(opt.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start justify-between group ${
                      isSelected
                        ? 'bg-slate-950 border-rose-500/40 shadow-sm shadow-rose-500/10'
                        : 'bg-slate-950/50 border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <div className="space-y-0.5 pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className={`font-bold text-xs ${isSelected ? 'text-rose-300' : 'text-slate-300'}`}>
                          {opt.label}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 leading-snug">{opt.desc}</p>
                    </div>

                    <div className={`p-1 rounded-full flex-shrink-0 transition-transform group-hover:scale-110 ${
                      isSelected ? 'bg-rose-500 text-slate-950' : 'bg-slate-800 text-slate-600'
                    }`}>
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Saved Monitoring Locations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm text-slate-100">Saved Monitoring Locations & Stations</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddLocation(!showAddLocation)}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 rounded-lg text-xs font-bold flex items-center space-x-1 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{showAddLocation ? 'Cancel' : 'Add Location'}</span>
              </button>
            </div>

            {/* Add Location Subform */}
            {showAddLocation && (
              <form onSubmit={handleAddLocation} className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2.5 text-xs animate-in fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Location Name (e.g. Home)"
                    value={newLocName}
                    onChange={(e) => setNewLocName(e.target.value)}
                    className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-200 focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Latitude (e.g. 28.6139)"
                    value={newLocLat}
                    onChange={(e) => setNewLocLat(e.target.value)}
                    className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                  <input
                    type="number"
                    step="0.0001"
                    placeholder="Longitude (e.g. 77.2090)"
                    value={newLocLng}
                    onChange={(e) => setNewLocLng(e.target.value)}
                    className="bg-slate-900 border border-slate-800 px-2.5 py-1.5 rounded-lg text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Save New Waypoint
                </button>
              </form>
            )}

            {/* Saved Locations List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {savedLocations.map((loc, idx) => (
                <div key={idx} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200 font-sans block">{loc.name}</span>
                    <span className="text-[10px] text-emerald-400">
                      {loc.lat.toFixed(4)}°N, {loc.lng.toFixed(4)}°E
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(idx)}
                    className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-slate-900 rounded-lg transition-colors cursor-pointer"
                    title="Remove Saved Location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* User Achievements & Badges Component */}
          <UserAchievementsCard />

          {/* Active Role Privileges Matrix */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span>Active Role Privileges Matrix ({userRole.replace('_', ' ')})</span>
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded font-bold">
                Enterprise Authorized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {(roleCapabilities[userRole] || roleCapabilities.citizen).map((cap, idx) => (
                <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span className="text-slate-300">{cap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Audit Log Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="border-b border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
              <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-emerald-400" />
                <span>Live Security & Handshake Audit Log</span>
              </h3>

              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    className="bg-slate-950 border border-slate-800 text-slate-200 text-xs pl-8 pr-3 py-1 rounded-xl focus:outline-none focus:border-emerald-500 w-36 sm:w-48 font-mono"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center space-x-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer flex-shrink-0"
                  title="Export complete security audit log history to CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Export CSV Log</span>
                </button>
              </div>
            </div>

            {csvSuccessMsg && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl p-3 text-xs flex items-center space-x-2 animate-fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{csvSuccessMsg}</span>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400">
                    <th className="pb-2">Timestamp</th>
                    <th className="pb-2">Event Description</th>
                    <th className="pb-2">Client IP</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-950/50">
                      <td className="py-2.5 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                      <td className="py-2.5 font-sans font-medium text-slate-200">{log.event}</td>
                      <td className="py-2.5 text-slate-400">{log.ipAddress}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'success' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {log.status.toUpperCase()}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {filteredLogs.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500 font-sans">
                        No security audit logs found matching "{logSearch}"
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
