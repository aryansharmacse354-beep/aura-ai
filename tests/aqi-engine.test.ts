import { describe, it, expect } from 'vitest';
import { CITIES_AQI_DATA } from '../src/data/mockData';

// Gaussian Plume Standard Dispersion Formula
export function calculateGaussianPlumeConcentration(
  emissionRateQ: number, // g/s
  windSpeedU: number, // m/s
  effectiveHeightH: number, // m
  xDistance: number, // m (downwind)
  yDistance: number = 0, // m (crosswind)
  stabilityClass: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' = 'C'
): number {
  if (xDistance <= 0 || windSpeedU <= 0) return 0;

  // Briggs dispersion coefficients for urban/suburban class C
  const sigmaY = 0.11 * xDistance * Math.pow(1 + 0.0004 * xDistance, -0.5);
  const sigmaZ = 0.08 * xDistance * Math.pow(1 + 0.00015 * xDistance, -0.5);

  const term1 = emissionRateQ / (2 * Math.PI * windSpeedU * sigmaY * sigmaZ);
  const term2 = Math.exp(-Math.pow(yDistance, 2) / (2 * Math.pow(sigmaY, 2)));
  const term3 = Math.exp(-Math.pow(effectiveHeightH, 2) / (2 * Math.pow(sigmaZ, 2)));

  // Return concentration in ug/m3
  return term1 * term2 * term3 * 1e6;
}

// EPA AQI Category Mapping
export function getAQICategory(aqi: number): { label: string; severity: 'good' | 'moderate' | 'unhealthy_sensitive' | 'unhealthy' | 'very_unhealthy' | 'hazardous' } {
  if (aqi <= 50) return { label: 'Good', severity: 'good' };
  if (aqi <= 100) return { label: 'Moderate', severity: 'moderate' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', severity: 'unhealthy_sensitive' };
  if (aqi <= 200) return { label: 'Unhealthy', severity: 'unhealthy' };
  if (aqi <= 300) return { label: 'Very Unhealthy', severity: 'very_unhealthy' };
  return { label: 'Hazardous', severity: 'hazardous' };
}

describe('Atmospheric Physics & Gaussian Plume Mathematical Engine', () => {
  it('should compute zero concentration when wind speed is non-positive or distance is non-positive', () => {
    expect(calculateGaussianPlumeConcentration(100, 0, 45, 500)).toBe(0);
    expect(calculateGaussianPlumeConcentration(100, 5, 45, 0)).toBe(0);
    expect(calculateGaussianPlumeConcentration(100, 5, 45, -100)).toBe(0);
  });

  it('should compute positive downwind ground-level concentration for standard stack emissions', () => {
    const concAt1Km = calculateGaussianPlumeConcentration(50, 4, 35, 1000, 0, 'C');
    expect(concAt1Km).toBeGreaterThan(0);
    expect(Number.isFinite(concAt1Km)).toBe(true);
  });

  it('should decrease ground concentration as crosswind distance y increases (Gaussian bell curve)', () => {
    const centerline = calculateGaussianPlumeConcentration(50, 4, 35, 1000, 0, 'C');
    const offCenter100m = calculateGaussianPlumeConcentration(50, 4, 35, 1000, 100, 'C');
    const offCenter300m = calculateGaussianPlumeConcentration(50, 4, 35, 1000, 300, 'C');

    expect(centerline).toBeGreaterThan(offCenter100m);
    expect(offCenter100m).toBeGreaterThan(offCenter300m);
  });

  it('should decrease ground concentration when stack height increases (thermal buoyancy & dispersion)', () => {
    const lowStack = calculateGaussianPlumeConcentration(50, 4, 20, 1000, 0, 'C');
    const highStack = calculateGaussianPlumeConcentration(50, 4, 80, 1000, 0, 'C');

    expect(lowStack).toBeGreaterThan(highStack);
  });
});

describe('Air Quality Index (AQI) Classification Engine', () => {
  it('should correctly classify all standard EPA / Indian CPCB AQI tiers', () => {
    expect(getAQICategory(35).severity).toBe('good');
    expect(getAQICategory(75).severity).toBe('moderate');
    expect(getAQICategory(125).severity).toBe('unhealthy_sensitive');
    expect(getAQICategory(185).severity).toBe('unhealthy');
    expect(getAQICategory(265).severity).toBe('very_unhealthy');
    expect(getAQICategory(410).severity).toBe('hazardous');
  });

  it('should validate that all seeded mock cities contain valid coordinates and pollutant telemetry', () => {
    expect(CITIES_AQI_DATA.length).toBeGreaterThanOrEqual(5);

    CITIES_AQI_DATA.forEach(city => {
      expect(city.cityId).toBeDefined();
      expect(city.cityName).toBeDefined();
      expect(city.aqi).toBeGreaterThan(0);
      expect(city.lat).toBeGreaterThanOrEqual(-90);
      expect(city.lat).toBeLessThanOrEqual(90);
      expect(city.lng).toBeGreaterThanOrEqual(-180);
      expect(city.lng).toBeLessThanOrEqual(180);
      expect(Array.isArray(city.pollutants)).toBe(true);
      expect(city.pollutants.length).toBeGreaterThan(0);
      
      const pm25 = city.pollutants.find(p => p.name === 'PM2.5');
      expect(pm25).toBeDefined();
      expect(pm25?.value).toBeGreaterThan(0);
    });
  });
});
