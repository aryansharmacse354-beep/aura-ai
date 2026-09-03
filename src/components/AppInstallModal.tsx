import React, { useState, useEffect } from 'react';
import { 
  Download, 
  X, 
  Smartphone, 
  Monitor, 
  Terminal, 
  Check, 
  Copy, 
  Globe, 
  ShieldCheck, 
  HardDrive, 
  Sparkles, 
  Zap,
  ArrowRight,
  Share2,
  PlusSquare,
  Layers
} from 'lucide-react';
import { AQILogo } from './AQILogo';

interface AppInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  deferredPrompt: any | null;
  onNativeInstall: () => void;
  isInstalled: boolean;
}

export const AppInstallModal: React.FC<AppInstallModalProps> = ({
  isOpen,
  onClose,
  deferredPrompt,
  onNativeInstall,
  isInstalled
}) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'mobile' | 'docker' | 'dev'>('pwa');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedCode(id);
      setTimeout(() => setCopiedCode(null), 2500);
    });
  };

  const dockerCommand = `# Clone & deploy AuraPredict AI with Docker
git clone https://github.com/aryansharma/aurapredict-ai.git
cd aurapredict-ai
docker-compose up --build -d`;

  const devCommand = `# Clone, install dependencies & start development server
git clone https://github.com/aryansharma/aurapredict-ai.git
cd aurapredict-ai
npm install
npm run dev`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/80">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
              <Download className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Install AuraPredict AI
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  PWA Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Run natively on Desktop, iOS, Android, or deploy locally via Docker
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            title="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 px-5 pt-3 gap-2 bg-slate-950/50">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'pwa'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Monitor className="w-4 h-4" />
            Desktop / Browser
          </button>

          <button
            onClick={() => setActiveTab('mobile')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'mobile'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            Mobile (iOS / Android)
          </button>

          <button
            onClick={() => setActiveTab('docker')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'docker'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            Docker Container
          </button>

          <button
            onClick={() => setActiveTab('dev')}
            className={`pb-3 px-3 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-all ${
              activeTab === 'dev'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            CLI / Source Code
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {activeTab === 'pwa' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-transparent p-4 rounded-xl border border-emerald-500/20 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-200">
                    Standalone Progressive Web App (PWA)
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Install AuraPredict as a standalone desktop app with hardware-accelerated 3D WebGL rendering, offline map tile persistence, low latency, and zero browser chrome bars.
                  </p>
                </div>
              </div>

              {deferredPrompt ? (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-center space-y-3">
                  <p className="text-sm text-slate-300 font-medium">
                    Your browser is ready for 1-click installation!
                  </p>
                  <button
                    onClick={onNativeInstall}
                    className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Install App to Desktop
                  </button>
                </div>
              ) : isInstalled ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-center text-xs text-emerald-300 font-medium">
                  ✓ AuraPredict is already running in standalone PWA application mode!
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    How to install on Chrome / Edge / Brave:
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">1</span>
                        Address Bar Icon
                      </div>
                      <p className="text-slate-400">
                        Look for the <strong>Install icon</strong> (a computer with a down arrow or plus symbol) in the right corner of your browser's address bar.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-1">
                      <div className="flex items-center gap-2 font-semibold text-slate-200">
                        <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-bold">2</span>
                        Browser Menu
                      </div>
                      <p className="text-slate-400">
                        Or click the 3-dot menu <span className="font-mono text-slate-300">⋮</span> &rarr; <strong>Cast, save, and share</strong> &rarr; <strong>Install AuraPredict AI</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Offline Features Highlight */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center">
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  <HardDrive className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">Offline GIS</p>
                  <p className="text-[10px] text-slate-500">Cached vector tiles</p>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  <Zap className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">Instant Load</p>
                  <p className="text-[10px] text-slate-500">Service Worker cache</p>
                </div>
                <div className="p-2.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  <ShieldCheck className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">Secure Vault</p>
                  <p className="text-[10px] text-slate-500">Local PBKDF2 auth</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'mobile' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  Apple iOS (Safari)
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                  <li>
                    Open this URL in <strong>Safari</strong> on your iPhone or iPad.
                  </li>
                  <li className="flex items-center gap-1.5 flex-wrap">
                    Tap the <strong>Share</strong> button <Share2 className="w-3.5 h-3.5 text-blue-400 inline" /> at the bottom toolbar.
                  </li>
                  <li className="flex items-center gap-1.5 flex-wrap">
                    Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 text-slate-300 inline" />.
                  </li>
                  <li>
                    Tap <strong>Add</strong> in the top-right corner to launch AuraPredict with standalone full-screen native capabilities.
                  </li>
                </ol>
              </div>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-200 text-sm">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  Android (Chrome / Edge / Firefox)
                </div>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed">
                  <li>
                    Open this URL in <strong>Google Chrome</strong> on Android.
                  </li>
                  <li>
                    Tap the <strong>3-dot menu</strong> <span className="font-mono text-slate-300">⋮</span> in the top-right corner.
                  </li>
                  <li>
                    Select <strong>Install app</strong> or <strong>Add to Home screen</strong>.
                  </li>
                  <li>
                    Confirm the prompt. AuraPredict will appear in your app drawer alongside native apps.
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'docker' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Deploy a self-hosted, multi-stage production container with embedded health checks and persistent volume storage:
              </p>
              
              <div className="relative">
                <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                  {dockerCommand}
                </pre>
                <button
                  onClick={() => copyToClipboard(dockerCommand, 'docker')}
                  className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  {copiedCode === 'docker' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCode === 'docker' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60 text-[11px] text-slate-400">
                🚀 Service will automatically boot on <span className="text-emerald-400 font-mono">http://localhost:3000</span> with health probe on <span className="text-emerald-400 font-mono">/api/health</span>.
              </div>
            </div>
          )}

          {activeTab === 'dev' && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-400 leading-relaxed">
                Install and run locally using Node.js (&ge; 20.0.0) with hot TypeScript reloading:
              </p>

              <div className="relative">
                <pre className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
                  {devCommand}
                </pre>
                <button
                  onClick={() => copyToClipboard(devCommand, 'dev')}
                  className="absolute top-2.5 right-2.5 px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1 text-[10px] font-semibold transition-colors"
                >
                  {copiedCode === 'dev' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  {copiedCode === 'dev' ? 'Copied' : 'Copy'}
                </button>
              </div>

              <div className="space-y-1 text-[11px] text-slate-400">
                <p>Run quality gates and testing:</p>
                <div className="flex gap-2 font-mono text-[10px]">
                  <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800 text-slate-300">npm run lint</span>
                  <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800 text-slate-300">npm run test</span>
                  <span className="px-2 py-1 bg-slate-950 rounded border border-slate-800 text-slate-300">npm run build</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-400">
            <AQILogo size="xs" variant="icon-only" />
            <span>AuraPredict AI v1.0.0</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
