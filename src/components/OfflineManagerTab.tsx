import React, { useState } from 'react';
import { 
  HardDriveDownload, 
  CheckCircle2, 
  AlertTriangle, 
  Trash2, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  Database, 
  Layers, 
  Check, 
  MapPin 
} from 'lucide-react';
import { OfflineMapRegion } from '../types';
import { INITIAL_OFFLINE_REGIONS } from '../data/mockData';

interface OfflineManagerTabProps {
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  offlineRegions: OfflineMapRegion[];
  onToggleDownloadRegion: (regionId: string) => void;
  onClearOfflineCache: () => void;
}

export const OfflineManagerTab: React.FC<OfflineManagerTabProps> = ({
  isOffline,
  setIsOffline,
  offlineRegions,
  onToggleDownloadRegion,
  onClearOfflineCache
}) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const totalSizeMB = (offlineRegions || [])
    .filter(r => r.isDownloaded)
    .reduce((acc, r) => acc + (r.estimatedSizeMB || 20), 0);

  const handleForceSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncMessage('Offline telemetry queue synced with remote cloud endpoints.');
      setTimeout(() => setSyncMessage(null), 4000);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
            <HardDriveDownload className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">Offline Map & Telemetry Cache Engine</h2>
            <p className="text-xs text-slate-400">
              Download vector tiles, GNN station snapshots, and clean corridors for un-interrupted operation without network connectivity
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 text-xs">
          <button
            onClick={() => setIsOffline(!isOffline)}
            className={`px-3 py-1.5 rounded-lg border font-semibold flex items-center space-x-1.5 transition-colors ${
              isOffline 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
            <span>{isOffline ? 'Offline Mode Active' : 'Online Mode'}</span>
          </button>
        </div>
      </div>

      {/* Storage Gauge & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Storage Capacity Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Database className="w-4 h-4 text-emerald-400" />
              <span>Local Storage Budget</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">IndexedDB / WebStorage</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-baseline text-xs font-mono">
              <span className="text-slate-400">Occupied Tile Space:</span>
              <span className="font-bold text-emerald-400">{totalSizeMB.toFixed(1)} MB / 500 MB</span>
            </div>

            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
              <div 
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(totalSizeMB / 500) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500">Maximum local tile storage allocation: 500 MB</p>
          </div>

          <div className="pt-2 border-t border-slate-800/80 space-y-2">
            <button
              onClick={handleForceSync}
              disabled={isSyncing}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Logs...' : 'Force Sync Offline Logs'}</span>
            </button>

            <button
              onClick={onClearOfflineCache}
              className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-semibold text-xs rounded-xl border border-red-500/20 flex items-center justify-center space-x-2 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All Cached Tiles</span>
            </button>
          </div>

          {syncMessage && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{syncMessage}</span>
            </div>
          )}
        </div>

        {/* Right Side: Available Region Packages */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center space-x-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>Offline Map Tile Packages</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select metro regions to download for offline map navigation
            </p>
          </div>

          <div className="space-y-3">
            {(offlineRegions || []).map((region) => (
              <div
                key={region.id}
                className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-emerald-400" />
                    <h4 className="font-bold text-sm text-slate-100">{region.name}</h4>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Size: {region.estimatedSizeMB} MB | Tile Count: {region.tileCount} | Zoom: {region.zoomRange[0]}-{region.zoomRange[1]}
                  </p>
                  {region.downloadDate && (
                    <p className="text-[10px] text-emerald-400">Downloaded: {region.downloadDate}</p>
                  )}
                </div>

                <button
                  onClick={() => onToggleDownloadRegion(region.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    region.isDownloaded 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-emerald-600 hover:bg-emerald-500 text-slate-950 shadow-md shadow-emerald-600/20'
                  }`}
                >
                  {region.isDownloaded ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Cached & Ready</span>
                    </>
                  ) : (
                    <>
                      <HardDriveDownload className="w-3.5 h-3.5" />
                      <span>Download Package</span>
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
