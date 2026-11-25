import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { POST } from '../../src/app/api/plan/route';
import { StructuredAirPlanSchema } from '../../src/schemas/airPlan';

vi.mock('../../src/services/airPlanService', () => ({
  generateAirPlan: vi.fn(async (ctx) => {
    const { generateFallbackPlan } = await import('../../src/lib/fallbackAirPlan');
    return { plan: generateFallbackPlan(ctx), source: 'fallback' as const };
  }),
}));

describe('POST /api/plan', () => {
  it('returns 200 and a schema-valid plan for valid input', async () => {
    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.1' },
      body: JSON.stringify({
        city: 'New Delhi',
        aqi: 380,
        pm25: 240,
        audienceMode: 'household',
        householdSize: 4,
        hasVulnerableMembers: true,
        commuteMode: 'two_wheeler',
        dailyCommuteKm: 18,
        hasAirPurifier: true,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const data = await res.json();
    expect(StructuredAirPlanSchema.safeParse(data.plan).success).toBe(true);
  });

  it('returns 400 when input fails Zod validation', async () => {
    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.2' },
      body: JSON.stringify({
        city: '',
        aqi: -100,
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });

  it('returns 400 for malformed JSON bodies', async () => {
    const req = new NextRequest('http://localhost:3000/api/plan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-forwarded-for': '10.0.0.3' },
      body: '{invalid-json',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
