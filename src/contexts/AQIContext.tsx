import React, { createContext, useContext, ReactNode } from 'react';
import { useAQI } from '../hooks/useAQI';
import { AQIMeasurement, ForecastPoint } from '../types';

interface AQIContextType {
  selectedCityId: string;
  setSelectedCityId: (cityId: string) => void;
  currentCityData: AQIMeasurement;
  forecastData: ForecastPoint[];
  citiesList: AQIMeasurement[];
  lastRefreshed: Date;
  isRefreshing: boolean;
  refreshTelemetry: () => Promise<void>;
}

const AQIContext = createContext<AQIContextType | undefined>(undefined);

export const AQIProvider: React.FC<{ children: ReactNode; initialCityId?: string }> = ({
  children,
  initialCityId = 'delhi'
}) => {
  const aqi = useAQI({ initialCityId });
  return <AQIContext.Provider value={aqi}>{children}</AQIContext.Provider>;
};

export function useAQIContext(): AQIContextType {
  const context = useContext(AQIContext);
  if (!context) {
    throw new Error('useAQIContext must be used within an AQIProvider');
  }
  return context;
}
