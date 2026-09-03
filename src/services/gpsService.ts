import { GPSPosition } from '../types';

export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

export class GPSTracker {
  private watchId: number | null = null;
  private onPositionUpdate: ((pos: GPSPosition) => void) | null = null;
  private onError: ((err: string) => void) | null = null;

  public startTracking(
    onUpdate: (pos: GPSPosition) => void,
    onError: (err: string) => void
  ) {
    this.onPositionUpdate = onUpdate;
    this.onError = onError;

    if (!('geolocation' in navigator)) {
      this.triggerMockPosition('Geolocation is not supported by your browser.');
      return;
    }

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy, speed, heading, altitude } = position.coords;
        const gpsPos: GPSPosition = {
          lat: latitude,
          lng: longitude,
          accuracy,
          speed: speed ?? 0,
          heading: heading ?? 0,
          altitude: altitude ?? 0,
          timestamp: position.timestamp,
          currentAQI: this.estimateAQIForCoordinates(latitude, longitude),
          locationName: 'Live GPS Pin'
        };
        if (this.onPositionUpdate) this.onPositionUpdate(gpsPos);
      },
      (err) => {
        console.warn('Geolocation error or permission denied, resorting to high-precision mock GPS:', err.message);
        this.triggerMockPosition(err.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 1000
      }
    );
  }

  public stopTracking() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  private triggerMockPosition(reason: string) {
    if (this.onError) this.onError(reason);

    // Initial position centered on Delhi CP with subtle live walking jitter
    let mockLat = 28.6139;
    let mockLng = 77.2090;

    const interval = setInterval(() => {
      // Simulate walking movement (~4 km/h)
      mockLat += (Math.random() - 0.48) * 0.0002;
      mockLng += (Math.random() - 0.48) * 0.0002;

      const mockPos: GPSPosition = {
        lat: mockLat,
        lng: mockLng,
        accuracy: 8,
        speed: 1.2, // ~4.3 km/h
        heading: 145,
        altitude: 216,
        timestamp: Date.now(),
        currentAQI: this.estimateAQIForCoordinates(mockLat, mockLng),
        locationName: 'Active GPS Path'
      };

      if (this.onPositionUpdate) {
        this.onPositionUpdate(mockPos);
      }
    }, 3000);

    // Save interval cleanup in watchId hack if needed
    this.watchId = interval as unknown as number;
  }

  private estimateAQIForCoordinates(lat: number, lng: number): number {
    // Spatial variation function
    const base = 210;
    const offset = Math.sin(lat * 100) * 45 + Math.cos(lng * 100) * 35;
    return Math.max(25, Math.round(base + offset));
  }
}

export const gpsTracker = new GPSTracker();
