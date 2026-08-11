import { OfflineMapRegion } from '../types';

const STORAGE_KEYS = {
  OFFLINE_REGIONS: 'aurapredict_offline_regions',
  OFFLINE_MODE_FORCED: 'aurapredict_offline_forced',
  CACHED_AQI_SNAPSHOTS: 'aurapredict_cached_aqi',
  SAVED_ROUTES: 'aurapredict_saved_routes',
  PENDING_OFFLINE_LOGS: 'aurapredict_pending_sync'
};

export class OfflineStorageService {
  public isOnline(): boolean {
    const forcedOffline = localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE_FORCED) === 'true';
    if (forcedOffline) return false;
    return navigator.onLine;
  }

  public setForcedOffline(forced: boolean) {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_MODE_FORCED, forced ? 'true' : 'false');
  }

  public getForcedOffline(): boolean {
    return localStorage.getItem(STORAGE_KEYS.OFFLINE_MODE_FORCED) === 'true';
  }

  public saveOfflineRegions(regions: OfflineMapRegion[]) {
    localStorage.setItem(STORAGE_KEYS.OFFLINE_REGIONS, JSON.stringify(regions));
  }

  public getOfflineRegions(): OfflineMapRegion[] {
    const data = localStorage.getItem(STORAGE_KEYS.OFFLINE_REGIONS);
    return data ? JSON.parse(data) : [];
  }

  public cacheAQISnapshot(key: string, data: any) {
    const existing = this.getAQISnapshots();
    existing[key] = {
      timestamp: new Date().toISOString(),
      payload: data
    };
    localStorage.setItem(STORAGE_KEYS.CACHED_AQI_SNAPSHOTS, JSON.stringify(existing));
  }

  public getAQISnapshots(): Record<string, { timestamp: string; payload: any }> {
    const data = localStorage.getItem(STORAGE_KEYS.CACHED_AQI_SNAPSHOTS);
    return data ? JSON.parse(data) : {};
  }

  public queuePendingOfflineLog(action: string, payload: any) {
    const queue = this.getPendingOfflineLogs();
    queue.push({ id: `sync_${Date.now()}`, action, payload, timestamp: new Date().toISOString() });
    localStorage.setItem(STORAGE_KEYS.PENDING_OFFLINE_LOGS, JSON.stringify(queue));
  }

  public getPendingOfflineLogs(): { id: string; action: string; payload: any; timestamp: string }[] {
    const data = localStorage.getItem(STORAGE_KEYS.PENDING_OFFLINE_LOGS);
    return data ? JSON.parse(data) : [];
  }

  public clearPendingOfflineLogs() {
    localStorage.removeItem(STORAGE_KEYS.PENDING_OFFLINE_LOGS);
  }
}

export const offlineStorage = new OfflineStorageService();
