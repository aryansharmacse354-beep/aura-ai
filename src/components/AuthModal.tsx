import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  Lock, 
  UserCheck, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  LogIn,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { 
    user, 
    login, 
    register, 
    usersList
  } = useAuth();

  const [authMode, setAuthMode] = useState<'password' | 'register'>('password');
  const [email, setEmail] = useState(user?.email || 'sarah.lin@aurapredict.org');
  const [password, setPassword] = useState('AuraPredict2026!');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'citizen' | 'epidemiologist' | 'city_planner' | 'industrial_auditor' | 'station_operator'>('citizen');
  const [statusMessage, setStatusMessage] = useState<{ type: 'idle' | 'loading' | 'success' | 'error'; text: string }>({
    type: 'idle',
    text: ''
  });

  if (!isOpen) return null;

  // 1. Password Login Handler
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage({ type: 'loading', text: 'Verifying credentials with PBKDF2 cryptography...' });
    
    const res = await login(email, password);
    if (res.success) {
      setStatusMessage({ type: 'success', text: `Welcome back, ${res.user?.name || email}!` });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Authentication failed. Please verify credentials.' });
    }
  };

  // 2. Account Registration Handler
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in name, email, and password.' });
      return;
    }

    setStatusMessage({ type: 'loading', text: 'Generating encrypted user profile & credentials...' });
    const res = await register({
      name,
      email,
      password,
      role
    });

    if (res.success) {
      setStatusMessage({ type: 'success', text: `Account created for ${name}! Logged in successfully.` });
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatusMessage({ type: 'error', text: res.error || 'Registration failed.' });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-700/60 bg-slate-900 shadow-2xl shadow-emerald-500/10 flex flex-col text-slate-100">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/70 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">AuraPredict Authentication</h3>
              <p className="text-xs text-slate-400 font-mono">PBKDF2 Cryptographic Security</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Auth Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1.5 mx-5 mt-4 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => { setAuthMode('password'); setStatusMessage({ type: 'idle', text: '' }); }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              authMode === 'password'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="h-3.5 w-3.5" />
            Sign In
          </button>
          
          <button
            onClick={() => { setAuthMode('register'); setStatusMessage({ type: 'idle', text: '' }); }}
            className={`flex items-center justify-center gap-1.5 py-2 rounded-lg transition-all ${
              authMode === 'register'
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="h-3.5 w-3.5" />
            Register
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 flex-1 overflow-y-auto">
          
          {/* Status Message Alert */}
          {statusMessage.text && (
            <div className={`mb-4 flex items-start gap-2.5 rounded-xl p-3 text-xs ${
              statusMessage.type === 'error'
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                : statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-blue-500/10 border border-blue-500/30 text-blue-300'
            }`}>
              {statusMessage.type === 'error' ? (
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-rose-400" />
              ) : statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <div className="h-4 w-4 shrink-0 rounded-full border-2 border-blue-400 border-t-transparent animate-spin mt-0.5" />
              )}
              <span className="leading-relaxed">{statusMessage.text}</span>
            </div>
          )}

          {/* MODE 1: PASSWORD SIGN-IN */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="user@aurapredict.org"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2.5 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                  />
                  <Lock className="absolute right-3.5 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                </div>
              </div>

              {/* Quick Persona Selector */}
              {usersList.length > 0 && (
                <div>
                  <span className="block text-[11px] font-semibold text-slate-400 mb-2">Or Quick Switch Profile:</span>
                  <div className="grid grid-cols-2 gap-2">
                    {usersList.slice(0, 4).map(u => (
                      <button
                        key={u.id}
                        type="button"
                        onClick={() => {
                          setEmail(u.email);
                          setPassword('AuraPredict2026!');
                        }}
                        className={`text-left p-2 rounded-lg border text-xs transition-all ${
                          email.toLowerCase() === u.email.toLowerCase()
                            ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        <p className="font-semibold truncate">{u.name}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{u.role.replace('_', ' ')}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={statusMessage.type === 'loading'}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-colors disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" />
                Sign In to Account
              </button>
            </form>
          )}

          {/* MODE 2: REGISTER ACCOUNT */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dr. Aryan Sharma"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@aurapredict.org"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Role Persona</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                >
                  <option value="citizen">Citizen (Personal Alerts & Routes)</option>
                  <option value="epidemiologist">Epidemiologist (Health Impact Analysis)</option>
                  <option value="city_planner">City Planner (Interventions & Policy)</option>
                  <option value="industrial_auditor">Industrial Auditor (Compliance & Plumes)</option>
                  <option value="station_operator">Station Operator (Sensor Telemetry)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Create Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3.5 py-2 text-sm text-white focus:border-emerald-500 focus:outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={statusMessage.type === 'loading'}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-500 transition-colors disabled:opacity-50 mt-2"
              >
                <UserCheck className="h-4 w-4" />
                Complete Registration
              </button>
            </form>
          )}

        </div>

        {/* Footer info */}
        <div className="border-t border-slate-800 bg-slate-950/60 px-5 py-3 text-center text-[11px] text-slate-500">
          Encrypted Authentication • Zero Cross-Site Trackers
        </div>
      </div>
    </div>
  );
};
