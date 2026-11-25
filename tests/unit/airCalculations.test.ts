import { describe, expect, it } from 'vitest';
import type { UserContext } from '../../src/schemas/airPlan';
import { calculateAirImpact, classifySmogSeverity } from '../../src/lib/airCalculations';

const BASE_CONTEXT: UserContext = {
  city: 'New Delhi',
  aqi: 380,
  pm25: 240,
  audienceMode: 'household',
  householdSize: 4,
  hasVulnerableMembers: true,
  commuteMode: 'two_wheeler',
  dailyCommuteKm: 20,
  hasAirPurifier: true,
};

describe('classifySmogSeverity', () => {
  it('classifies all AQI severity bands accurately', () => {
    expect(classifySmogSeverity(35)).toBe('Good');
    expect(classifySmogSeverity(85)).toBe('Moderate');
    expect(classifySmogSeverity(175)).toBe('Poor');
    expect(classifySmogSeverity(320)).toBe('Severe');
    expect(classifySmogSeverity(450)).toBe('Hazardous');
  });
});

describe('calculateAirImpact', () => {
  it('calculates baseline PM2.5 inhalation and reduction percentages accurately', () => {
    const result = calculateAirImpact(BASE_CONTEXT, {
      sealAndFilterIndoors: true,
      avoidPeakHours: true,
      shiftToTransit: true,
    });

    // 240 * 15 * 4 = 14,400 µg
    expect(result.baselineDailyInhaledPm25Ug).toBe(14400);
    // 38 + 18 + 16 = 72%
    expect(result.projectedPm25ReductionPercent).toBe(72);
    // (0.085 - 0.041) * 20 = 0.88 kg
    expect(result.dailyCo2SavedKg).toBe(0.88);
    expect(result.severityLabel).toBe('Hazardous');
  });

  it('caps cumulative reduction at 75% and scales community CO2 by 10x', () => {
    const communityCtx: UserContext = {
      ...BASE_CONTEXT,
      audienceMode: 'community',
      commuteMode: 'petrol_car',
    };

    const result = calculateAirImpact(communityCtx, {
      sealAndFilterIndoors: true,
      avoidPeakHours: true,
      shiftToTransit: true,
    });

    expect(result.projectedPm25ReductionPercent).toBeLessThanOrEqual(75);
    // (0.192 - 0.041) * 20 * 10 = 30.2 kg
    expect(result.dailyCo2SavedKg).toBe(30.2);
  });

  it('returns 0% reduction and 0 CO2 saved when no actions are selected', () => {
    const result = calculateAirImpact(BASE_CONTEXT, {
      sealAndFilterIndoors: false,
      avoidPeakHours: false,
      shiftToTransit: false,
    });

    expect(result.projectedPm25ReductionPercent).toBe(0);
    expect(result.dailyCo2SavedKg).toBe(0);
  });

  it('clamps extreme negative or out-of-range values safely', () => {
    const extremeCtx: UserContext = {
      ...BASE_CONTEXT,
      aqi: -50,
      pm25: -20,
      dailyCommuteKm: -10,
      householdSize: 0,
    };

    const result = calculateAirImpact(extremeCtx, {
      sealAndFilterIndoors: false,
      avoidPeakHours: false,
      shiftToTransit: false,
    });

    expect(result.severityLabel).toBe('Good');
    expect(result.baselineDailyInhaledPm25Ug).toBe(0);
    expect(result.dailyCo2SavedKg).toBe(0);
  });
});
