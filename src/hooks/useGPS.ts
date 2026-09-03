import { useState, useEffect, useCallback } from 'react';
import { CITIES_AQI_DATA } from '../data/mockData';

export interface GPSLocation {
  lat: number;
  lng: number;
  accuracy: number;
  nearestCityId: string;
  nearestCityName: string;
  distanceKm: number;
}

// Calculate Haversine distance in kilometers
function calculateHaversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function useGPS(onCityMatch?: (cityId: string) => void) {
  const [gpsActive, setGpsActive] = useState(false);
  const [location, setLocation] = useState<GPSLocation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const findNearestDistrict = useCallback((lat: number, lng: number) => {
    let closestCity = CITIES_AQI_DATA[0];
    let minDistance = Infinity;

    for (const city of CITIES_AQI_DATA) {
      const dist = calculateHaversineDistance(lat, lng, city.lat, city.lng);
      if (dist < minDistance) {
        minDistance = dist;
        closestCity = city;
      }
    }

    return {
      nearestCityId: closestCity.cityId,
      nearestCityName: closestCity.cityName,
      distanceKm: Math.round(minDistance * 10) / 10
    };
  }, []);

  const requestGPS = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser/device.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        const nearest = findNearestDistrict(latitude, longitude);

        setLocation({
          lat: latitude,
          lng: longitude,
          accuracy,
          ...nearest
        });
        setGpsActive(true);
        setError(null);

        if (onCityMatch) {
          onCityMatch(nearest.nearestCityId);
        }
      },
      (err) => {
        console.warn('Geolocation access failed or denied:', err.message);
        setError(err.message);
        // Fallback default coordinates (Delhi NCR)
        const nearest = findNearestDistrict(28.6139, 77.2090);
        setLocation({
          lat: 28.6139,
          lng: 77.2090,
          accuracy: 50,
          ...nearest
        });
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }, [findNearestDistrict, onCityMatch]);

  useEffect(() => {
    requestGPS();
  }, [requestGPS]);

  return {
    gpsActive,
    location,
    error,
    requestGPS
  };
}
