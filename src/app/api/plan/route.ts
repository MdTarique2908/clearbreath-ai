import { NextResponse, type NextRequest } from 'next/server';
import { UserContextSchema } from '../../../schemas/airPlan';
import { generateAirPlan } from '../../../services/airPlanService';

const RATE_LIMIT_WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 25;
const ipHits = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(clientId: string): boolean {
  const now = Date.now();
  const existing = ipHits.get(clientId);

  if (!existing || now > existing.resetAt) {
    ipHits.set(clientId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (existing.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  existing.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  const clientIp =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local-client';

  if (!checkRateLimit(clientIp)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON request body.' }, { status: 400 });
  }

  const parsed = UserContextSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input parameters.', issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const result = await generateAirPlan(parsed.data);
  return NextResponse.json(result, { status: 200 });
}
