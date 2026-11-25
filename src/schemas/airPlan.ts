import { z } from 'zod';

export const UserContextSchema = z.object({
  city: z.string().trim().min(2).max(80),
  aqi: z.number().min(0).max(1000),
  pm25: z.number().min(0).max(1500),
  audienceMode: z.enum(['household', 'community']),
  householdSize: z.number().int().min(1).max(500),
  hasVulnerableMembers: z.boolean(),
  commuteMode: z.enum(['petrol_car', 'two_wheeler', 'public_transit', 'walk_cycle']),
  dailyCommuteKm: z.number().min(0).max(300),
  hasAirPurifier: z.boolean(),
});

export const ActionItemSchema = z.object({
  title: z.string().min(3),
  steps: z.array(z.string()).min(1).max(4),
  directImpactExplanation: z.string().min(10),
  estimatedReductionTag: z.string().min(2),
});

export const StructuredAirPlanSchema = z.object({
  summaryAlert: z.string(),
  lowEmissionRoutines: z.array(ActionItemSchema).min(2).max(4),
  indoorAirHacks: z.array(ActionItemSchema).min(2).max(4),
  sustainableAlternatives: z.array(ActionItemSchema).min(2).max(4),
  causalTakeaway: z.string(),
});

export type UserContext = z.infer<typeof UserContextSchema>;
export type ActionItem = z.infer<typeof ActionItemSchema>;
export type StructuredAirPlan = z.infer<typeof StructuredAirPlanSchema>;
