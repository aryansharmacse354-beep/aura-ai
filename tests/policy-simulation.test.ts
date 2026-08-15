import { describe, it, expect } from 'vitest';

export interface PolicyLeverTestInput {
  id: string;
  name: string;
  category: 'transport' | 'industrial' | 'construction' | 'agriculture';
  value: number; // 0 to 100 percentage implementation
  maxAQIImpactPct: number;
}

export function computePolicyScenarioImpact(
  levers: PolicyLeverTestInput[],
  baselineAQI: number
): {
  projectedAQI: number;
  reductionPct: number;
  estimatedCostMillionUSD: number;
} {
  let aggregateImpact = 0;
  let estimatedCost = 0;

  levers.forEach(l => {
    const leverEffect = (l.value / 100) * l.maxAQIImpactPct;
    // Diminishing returns formula
    aggregateImpact += leverEffect * (1 - aggregateImpact / 100);
    estimatedCost += (l.value / 100) * (l.category === 'transport' ? 8.5 : l.category === 'industrial' ? 14 : 5);
  });

  const cappedReductionPct = Math.min(Math.round(aggregateImpact * 10) / 10, 75);
  const projectedAQI = Math.max(Math.round(baselineAQI * (1 - cappedReductionPct / 100)), 20);

  return {
    projectedAQI,
    reductionPct: cappedReductionPct,
    estimatedCostMillionUSD: Math.round(estimatedCost * 10) / 10
  };
}

describe('Policy Simulation & Mitigation Decision Engine', () => {
  it('should return baseline AQI when all levers are set to 0%', () => {
    const levers: PolicyLeverTestInput[] = [
      { id: 'odd_even', name: 'Odd-Even Traffic', category: 'transport', value: 0, maxAQIImpactPct: 15 },
      { id: 'industrial_filter', name: 'Industrial Scrubbers', category: 'industrial', value: 0, maxAQIImpactPct: 22 }
    ];

    const result = computePolicyScenarioImpact(levers, 280);
    expect(result.reductionPct).toBe(0);
    expect(result.projectedAQI).toBe(280);
    expect(result.estimatedCostMillionUSD).toBe(0);
  });

  it('should compute diminishing returns when combining multiple heavy mitigation policies', () => {
    const levers: PolicyLeverTestInput[] = [
      { id: 'transport_ev', name: 'EV Fleet Transition', category: 'transport', value: 80, maxAQIImpactPct: 25 },
      { id: 'ind_scrub', name: 'Heavy Scrubbing', category: 'industrial', value: 70, maxAQIImpactPct: 30 },
      { id: 'anti_dust', name: 'Construction Mist Cannons', category: 'construction', value: 60, maxAQIImpactPct: 15 }
    ];

    const result = computePolicyScenarioImpact(levers, 300);
    expect(result.reductionPct).toBeGreaterThan(30);
    expect(result.reductionPct).toBeLessThanOrEqual(75);
    expect(result.projectedAQI).toBeLessThan(300);
    expect(result.estimatedCostMillionUSD).toBeGreaterThan(10);
  });
});
