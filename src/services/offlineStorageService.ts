import { OfflineMapRegion } from '../types';

const STORAGE_KEYS = {
  OFFLINE_REGIONS: 'aurapredict_offline_regions',
  OFFLINE_MODE_FORCED: 'aurapredict_offline_forced',
  CACHED_AQI_SNAPSHOTS: 'aurapredict_cached_aqi',
  SAVED_ROUTES: 'aurapredict_saved_routes',
  PENDING_OFFLINE_LOGS: 'aurapredict_pending_sync'
};

export class OfflineStorageService {
  private memoryCache: Map<string, string> = new Map();

  private safeGetItem(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(key);
      }
    } catch {
      // Fallback to memory cache
    }
    return this.memoryCache.get(key) || null;
  }

  private safeSetItem(key: string, value: string): void {
    this.memoryCache.set(key, value);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch {
      // Memory cache is already updated
    }
  }

  private safeRemoveItem(key: string): void {
    this.memoryCache.delete(key);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch {
      // Memory cache is already cleared
    }
  }

  public isOnline(): boolean {
    const forcedOffline = this.safeGetItem(STORAGE_KEYS.OFFLINE_MODE_FORCED) === 'true';
    if (forcedOffline) return false;
    return typeof navigator !== 'undefined' ? navigator.onLine : true;
  }

  public setForcedOffline(forced: boolean) {
    this.safeSetItem(STORAGE_KEYS.OFFLINE_MODE_FORCED, forced ? 'true' : 'false');
  }

  public getForcedOffline(): boolean {
    return this.safeGetItem(STORAGE_KEYS.OFFLINE_MODE_FORCED) === 'true';
  }

  public saveOfflineRegions(regions: OfflineMapRegion[]) {
    try {
      this.safeSetItem(STORAGE_KEYS.OFFLINE_REGIONS, JSON.stringify(regions));
    } catch (e) {
      console.warn('Failed to stringify offline regions', e);
    }
  }

  public getOfflineRegions(): OfflineMapRegion[] {
    const data = this.safeGetItem(STORAGE_KEYS.OFFLINE_REGIONS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public cacheAQISnapshot(key: string, data: any) {
    const existing = this.getAQISnapshots();
    existing[key] = {
      timestamp: new Date().toISOString(),
      payload: data
    };
    try {
      this.safeSetItem(STORAGE_KEYS.CACHED_AQI_SNAPSHOTS, JSON.stringify(existing));
    } catch (e) {
      console.warn('Failed to cache AQI snapshot', e);
    }
  }

  public getAQISnapshots(): Record<string, { timestamp: string; payload: any }> {
    const data = this.safeGetItem(STORAGE_KEYS.CACHED_AQI_SNAPSHOTS);
    if (!data) return {};
    try {
      const parsed = JSON.parse(data);
      return parsed && typeof parsed === 'object' ? parsed : {};
    } catch {
      return {};
    }
  }

  public queuePendingOfflineLog(action: string, payload: any) {
    const queue = this.getPendingOfflineLogs();
    queue.push({ id: `sync_${Date.now()}`, action, payload, timestamp: new Date().toISOString() });
    try {
      this.safeSetItem(STORAGE_KEYS.PENDING_OFFLINE_LOGS, JSON.stringify(queue));
    } catch (e) {
      console.warn('Failed to queue offline log', e);
    }
  }

  public getPendingOfflineLogs(): { id: string; action: string; payload: any; timestamp: string }[] {
    const data = this.safeGetItem(STORAGE_KEYS.PENDING_OFFLINE_LOGS);
    if (!data) return [];
    try {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  public clearPendingOfflineLogs() {
    this.safeRemoveItem(STORAGE_KEYS.PENDING_OFFLINE_LOGS);
  }
}

export const offlineStorage = new OfflineStorageService();
