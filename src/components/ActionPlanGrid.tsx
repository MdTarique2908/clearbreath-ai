import React from 'react';
import type { ActionItem, StructuredAirPlan } from '../schemas/airPlan';

interface ActionPlanGridProps {
  plan: StructuredAirPlan;
  source: 'gemini' | 'fallback';
}

function CategorySection({
  title,
  badge,
  items,
}: {
  title: string;
  badge: string;
  items: ActionItem[];
}) {
  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs font-semibold text-sky-300">
          {badge}
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.title}
            className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-950 p-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-base font-bold text-white">{item.title}</h4>
                <span className="shrink-0 rounded-md bg-emerald-950 px-2 py-0.5 text-xs font-semibold text-emerald-300">
                  {item.estimatedReductionTag}
                </span>
              </div>

              <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-200">
                {item.steps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="mt-4 rounded-lg border border-slate-800 bg-slate-900/90 p-3 text-xs text-slate-300">
              <strong className="text-sky-300">Direct Impact: </strong>
              {item.directImpactExplanation}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ActionPlanGrid({ plan, source }: ActionPlanGridProps) {
  return (
    <div aria-live="polite" className="space-y-6">
      <div className="rounded-2xl border border-amber-600/60 bg-amber-950/40 p-5 text-amber-100">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <strong className="text-sm uppercase tracking-wider text-amber-300">
            Active Air Advisory
          </strong>
          <span className="rounded-md bg-slate-900 px-2.5 py-0.5 text-xs text-slate-300">
            Engine: {source === 'gemini' ? 'Gemini 2.5 Flash' : 'Verified Offline Playbook'}
          </span>
        </div>
        <p className="mt-2 text-base font-medium">{plan.summaryAlert}</p>
      </div>

      <CategorySection
        title="Low-Emission Daily Routines"
        badge="Schedule & Commute"
        items={plan.lowEmissionRoutines}
      />

      <CategorySection
        title="Indoor Air Quality Hacks"
        badge="Home & Ventilation"
        items={plan.indoorAirHacks}
      />

      <CategorySection
        title="Sustainable Alternatives"
        badge="Location & Lifestyle"
        items={plan.sustainableAlternatives}
      />

      <aside className="rounded-2xl border border-emerald-700/60 bg-emerald-950/30 p-5 text-sm text-emerald-100">
        <strong className="font-bold text-emerald-300">Why Your Choices Matter: </strong>
        {plan.causalTakeaway}
      </aside>
    </div>
  );
}
