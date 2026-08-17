import { useState, useMemo, useCallback } from 'react';
import { CITIES_AQI_DATA, MOCK_72H_FORECAST } from '../data/mockData';
import { AQIMeasurement, ForecastPoint } from '../types';

export interface UseAQIOptions {
  initialCityId?: string;
}

export function useAQI(options: UseAQIOptions = {}) {
  const { initialCityId = 'delhi' } = options;
  const [selectedCityId, setSelectedCityId] = useState<string>(initialCityId);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const currentCityData = useMemo<AQIMeasurement>(() => {
    return CITIES_AQI_DATA.find((c) => c.cityId === selectedCityId) || CITIES_AQI_DATA[0];
  }, [selectedCityId]);

  const forecastData = useMemo<ForecastPoint[]>(() => {
    const baseAQI = currentCityData.aqi;
    const baseForecast = MOCK_72H_FORECAST[selectedCityId] || MOCK_72H_FORECAST['delhi'];
    // Scale dynamically to match current city baseline if needed
    const baselineRatio = baseAQI / (baseForecast[0]?.aqi || 285);
    return baseForecast.map((pt) => ({
      ...pt,
      aqi: Math.round(pt.aqi * baselineRatio),
      pm25: Math.round(pt.pm25 * baselineRatio),
      pm10: Math.round(pt.pm10 * baselineRatio),
      lowerBound: Math.max(10, Math.round(pt.lowerBound * baselineRatio)),
      upperBound: Math.round(pt.upperBound * baselineRatio)
    }));
  }, [selectedCityId, currentCityData]);

  const refreshTelemetry = useCallback(async () => {
    setIsRefreshing(true);
    try {
      // Simulate real-time sensor fetch / GNN cycle
      await new Promise((res) => setTimeout(res, 400));
      setLastRefreshed(new Date());
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  return {
    selectedCityId,
    setSelectedCityId,
    currentCityData,
    forecastData,
    citiesList: CITIES_AQI_DATA,
    lastRefreshed,
    isRefreshing,
    refreshTelemetry
  };
}
