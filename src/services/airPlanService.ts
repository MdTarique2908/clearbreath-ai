import { GoogleGenAI } from '@google/genai';
import {
  StructuredAirPlanSchema,
  type StructuredAirPlan,
  type UserContext,
} from '../schemas/airPlan';
import { generateFallbackPlan } from '../lib/fallbackAirPlan';

const SYSTEM_INSTRUCTION = `You are an Urban Air Quality & Winter Smog Assistant helping families and communities navigate severe urban air pollution.
Given the user's location, AQI/PM2.5 levels, household or community mode, and commute profile:
1. Provide Low-Emission Daily Routines (timing outdoor trips around winter thermal inversion, transit shifts, trip batching).
2. Provide Indoor Air Quality Hacks (sealing window drafts, timed cross-ventilation only during afternoon dips, avoiding indoor combustion like incense or unvented cooking, purifier or DIY filtration).
3. Provide Sustainable Alternatives tailored to their city, home context, and commute mode (including collective community actions when audienceMode is "community").
4. For every recommendation, provide a clear Direct Impact Explanation stating the physical mechanism (reducing PM2.5 inhalation dose or cutting tailpipe NOx, CO2, and particulate emissions) plus a concise estimatedReductionTag.
5. Never provide medical diagnoses. Keep language practical, empathetic, and clear.`;

const PLAN_JSON_SCHEMA = {
  type: 'OBJECT',
  required: [
    'summaryAlert',
    'lowEmissionRoutines',
    'indoorAirHacks',
    'sustainableAlternatives',
    'causalTakeaway',
  ],
  properties: {
    summaryAlert: { type: 'STRING' },
    lowEmissionRoutines: {
      type: 'ARRAY',
      minItems: 2,
      maxItems: 4,
      items: {
        type: 'OBJECT',
        required: ['title', 'steps', 'directImpactExplanation', 'estimatedReductionTag'],
        properties: {
          title: { type: 'STRING' },
          steps: { type: 'ARRAY', items: { type: 'STRING' } },
          directImpactExplanation: { type: 'STRING' },
          estimatedReductionTag: { type: 'STRING' },
        },
      },
    },
    indoorAirHacks: {
      type: 'ARRAY',
      minItems: 2,
      maxItems: 4,
      items: {
        type: 'OBJECT',
        required: ['title', 'steps', 'directImpactExplanation', 'estimatedReductionTag'],
        properties: {
          title: { type: 'STRING' },
          steps: { type: 'ARRAY', items: { type: 'STRING' } },
          directImpactExplanation: { type: 'STRING' },
          estimatedReductionTag: { type: 'STRING' },
        },
      },
    },
    sustainableAlternatives: {
      type: 'ARRAY',
      minItems: 2,
      maxItems: 4,
      items: {
        type: 'OBJECT',
        required: ['title', 'steps', 'directImpactExplanation', 'estimatedReductionTag'],
        properties: {
          title: { type: 'STRING' },
          steps: { type: 'ARRAY', items: { type: 'STRING' } },
          directImpactExplanation: { type: 'STRING' },
          estimatedReductionTag: { type: 'STRING' },
        },
      },
    },
    causalTakeaway: { type: 'STRING' },
  },
};

export async function generateAirPlan(
  context: UserContext,
  options?: { apiKey?: string; timeoutMs?: number }
): Promise<{ plan: StructuredAirPlan; source: 'gemini' | 'fallback' }> {
  const apiKey = options?.apiKey ?? process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { plan: generateFallbackPlan(context), source: 'fallback' };
  }

  const timeoutMs = options?.timeoutMs ?? 12000;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = `Generate a tailored urban air quality plan for this profile:\n${JSON.stringify(context, null, 2)}`;

    const response = await Promise.race([
      ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseJsonSchema: PLAN_JSON_SCHEMA,
          temperature: 0.4,
        },
      }),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Gemini request timed out')), timeoutMs)
      ),
    ]);

    const rawText = response.text;
    if (!rawText) {
      return { plan: generateFallbackPlan(context), source: 'fallback' };
    }

    const parsedJson: unknown = JSON.parse(rawText);
    const validated = StructuredAirPlanSchema.safeParse(parsedJson);

    if (!validated.success) {
      return { plan: generateFallbackPlan(context), source: 'fallback' };
    }

    return { plan: validated.data, source: 'gemini' };
  } catch {
    return { plan: generateFallbackPlan(context), source: 'fallback' };
  }
}
