import { useState, useEffect, useCallback } from 'react';

export function useOfflineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(!navigator.onLine);
  const [cachedPackagesCount, setCachedPackagesCount] = useState<number>(3);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setIsOfflineMode(false);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setIsOfflineMode(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const toggleOfflineSimulation = useCallback(() => {
    setIsOfflineMode((prev) => !prev);
  }, []);

  return {
    isOnline,
    isOfflineMode,
    setIsOfflineMode,
    toggleOfflineSimulation,
    cachedPackagesCount,
    setCachedPackagesCount
  };
}
