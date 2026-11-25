'use client';

import React, { useMemo, useState } from 'react';
import { ActionPlanGrid } from '../components/ActionPlanGrid';
import { AqiBadge } from '../components/AqiBadge';
import { ImpactSimulator } from '../components/ImpactSimulator';
import { ProfileForm } from '../components/ProfileForm';
import type { StructuredAirPlan, UserContext } from '../schemas/airPlan';
import { calculateAirImpact, type SelectedActions } from '../lib/airCalculations';
import { generateFallbackPlan } from '../lib/fallbackAirPlan';

const DEFAULT_CONTEXT: UserContext = {
  city: 'New Delhi',
  aqi: 385,
  pm25: 245,
  audienceMode: 'household',
  householdSize: 4,
  hasVulnerableMembers: true,
  commuteMode: 'two_wheeler',
  dailyCommuteKm: 18,
  hasAirPurifier: true,
};

export default function HomePage() {
  const [context, setContext] = useState<UserContext>(DEFAULT_CONTEXT);
  const [selectedActions, setSelectedActions] = useState<SelectedActions>({
    sealAndFilterIndoors: true,
    avoidPeakHours: true,
    shiftToTransit: false,
  });
  const [plan, setPlan] = useState<StructuredAirPlan>(() => generateFallbackPlan(DEFAULT_CONTEXT));
  const [source, setSource] = useState<'gemini' | 'fallback'>('fallback');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const metrics = useMemo(
    () => calculateAirImpact(context, selectedActions),
    [context, selectedActions]
  );

  const handleToggleAction = (key: keyof SelectedActions) => {
    setSelectedActions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleGeneratePlan = async () => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      });

      if (!response.ok) {
        const errData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errData.error || 'Could not generate tailored plan.');
      }

      const data = (await response.json()) as {
        plan: StructuredAirPlan;
        source: 'gemini' | 'fallback';
      };

      setPlan(data.plan);
      setSource(data.source);
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? `${err.message} Showing verified offline recommendations.`
          : 'Network issue. Showing verified offline recommendations.'
      );
      setPlan(generateFallbackPlan(context));
      setSource('fallback');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-sky-400">
            PromptWars Challenge 6 · Urban Air Quality Assistant
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            ClearBreath AI
          </h1>
          <p className="mt-1 text-sm text-slate-300">
            Tailored low-emission routines, indoor air hacks, and clear impact math for severe winter smog.
          </p>
        </div>

        <AqiBadge aqi={context.aqi} severity={metrics.severityLabel} />
      </header>

      <main id="main-content" className="space-y-8">
        <ProfileForm
          context={context}
          onChange={setContext}
          onSubmit={handleGeneratePlan}
          isLoading={isLoading}
        />

        {errorMessage && (
          <div
            role="alert"
            className="rounded-xl border border-red-500/60 bg-red-950/50 px-4 py-3 text-sm text-red-100"
          >
            {errorMessage}
          </div>
        )}

        <ImpactSimulator
          metrics={metrics}
          selectedActions={selectedActions}
          onToggle={handleToggleAction}
        />

        <ActionPlanGrid plan={plan} source={source} />
      </main>
    </div>
  );
}
