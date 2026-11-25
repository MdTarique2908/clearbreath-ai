import type { UserContext } from '../schemas/airPlan';

export type CommuteMode = UserContext['commuteMode'];
export type AudienceMode = UserContext['audienceMode'];
export type SeverityLabel = 'Good' | 'Moderate' | 'Poor' | 'Severe' | 'Hazardous';

export interface SelectedActions {
  shiftToTransit: boolean;
  sealAndFilterIndoors: boolean;
  avoidPeakHours: boolean;
}

export interface ImpactMetrics {
  severityLabel: SeverityLabel;
  baselineDailyInhaledPm25Ug: number;
  projectedPm25ReductionPercent: number;
  dailyCo2SavedKg: number;
  recommendedOutdoorWindow: string;
}

const EMISSION_FACTORS_KG_PER_KM: Record<CommuteMode, number> = {
  petrol_car: 0.192,
  two_wheeler: 0.085,
  public_transit: 0.041,
  walk_cycle: 0.0,
};

export function classifySmogSeverity(aqi: number): SeverityLabel {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 200) return 'Poor';
  if (aqi <= 350) return 'Severe';
  return 'Hazardous';
}

export function calculateAirImpact(
  ctx: UserContext,
  selectedActions: SelectedActions
): ImpactMetrics {
  const safeAqi = Math.max(0, Math.min(1000, ctx.aqi));
  const safePm25 = Math.max(0, Math.min(1500, ctx.pm25));
  const safeKm = Math.max(0, Math.min(300, ctx.dailyCommuteKm));
  const safePeople = Math.max(1, ctx.householdSize);

  // Average breathing volume ~15 m³/day per person
  const baselineDailyInhaledPm25Ug = Number((safePm25 * 15 * safePeople).toFixed(1));

  let reductionPercent = 0;
  if (selectedActions.sealAndFilterIndoors) {
    reductionPercent += ctx.hasAirPurifier ? 38 : 22;
  }
  if (selectedActions.avoidPeakHours) {
    reductionPercent += 18;
  }
  if (selectedActions.shiftToTransit && ctx.commuteMode !== 'walk_cycle') {
    reductionPercent += ctx.commuteMode === 'two_wheeler' ? 16 : 9;
  }

  // Cap cumulative exposure reduction at a realistic 75%
  const projectedPm25ReductionPercent = Math.min(75, reductionPercent);

  const currentFactor = EMISSION_FACTORS_KG_PER_KM[ctx.commuteMode];
  const targetFactor = selectedActions.shiftToTransit
    ? EMISSION_FACTORS_KG_PER_KM.public_transit
    : currentFactor;

  const perPersonSavedKg = Math.max(0, currentFactor - targetFactor) * safeKm;
  const scaleMultiplier = ctx.audienceMode === 'community' ? 10 : 1;
  const dailyCo2SavedKg = Number((perPersonSavedKg * scaleMultiplier).toFixed(2));

  const recommendedOutdoorWindow =
    safeAqi > 300
      ? 'Avoid outdoor exertion; keep essential errands brief around 1:00 PM – 3:30 PM when thermal inversion eases slightly.'
      : safeAqi > 150
      ? '12:30 PM – 4:00 PM (avoid early-morning 6:00 AM – 10:00 AM and post-sunset winter smog traps).'
      : 'Morning or afternoon windows are reasonable; double-check hourly PM2.5 before vigorous activity.';

  return {
    severityLabel: classifySmogSeverity(safeAqi),
    baselineDailyInhaledPm25Ug,
    projectedPm25ReductionPercent,
    dailyCo2SavedKg,
    recommendedOutdoorWindow,
  };
}
