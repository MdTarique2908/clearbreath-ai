import React from 'react';
import type { ImpactMetrics, SelectedActions } from '../lib/airCalculations';

interface ImpactSimulatorProps {
  metrics: ImpactMetrics;
  selectedActions: SelectedActions;
  onToggle: (key: keyof SelectedActions) => void;
}

const TOGGLE_ITEMS: { key: keyof SelectedActions; title: string; subtitle: string }[] = [
  {
    key: 'sealAndFilterIndoors',
    title: 'Seal Drafts & Filter Indoors',
    subtitle: 'Close peak-smog leaks & run HEPA / clean-room protocol',
  },
  {
    key: 'avoidPeakHours',
    title: 'Shift Outdoor Trips to Midday Window',
    subtitle: 'Avoid early-morning & post-sunset winter thermal inversions',
  },
  {
    key: 'shiftToTransit',
    title: 'Switch Solo Rides to Metro / Shared Transit',
    subtitle: 'Cuts direct roadside exhaust exposure & tailpipe CO2',
  },
];

export function ImpactSimulator({ metrics, selectedActions, onToggle }: ImpactSimulatorProps) {
  return (
    <section
      aria-labelledby="simulator-heading"
      className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg"
    >
      <h2 id="simulator-heading" className="text-lg font-bold text-white">
        2. Interactive &ldquo;What-If&rdquo; Impact Simulator
      </h2>
      <p className="mt-1 text-sm text-slate-300">
        Toggle actions below to see how your daily choices cut particulate inhalation and emissions.
      </p>

      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {TOGGLE_ITEMS.map((item) => {
          const active = selectedActions[item.key];
          return (
            <button
              key={item.key}
              type="button"
              aria-pressed={active}
              onClick={() => onToggle(item.key)}
              className={`rounded-xl border p-4 text-left transition focus:outline-none focus:ring-2 focus:ring-sky-400 ${
                active
                  ? 'border-emerald-400 bg-emerald-950/60 text-white'
                  : 'border-slate-700 bg-slate-950 text-slate-300 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold">{item.title}</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                    active ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {active ? 'ON' : 'OFF'}
                </span>
              </div>
              <p className="mt-1.5 text-xs text-slate-300">{item.subtitle}</p>
            </button>
          );
        })}
      </div>

      <div
        aria-live="polite"
        className="mt-5 grid gap-4 rounded-xl border border-slate-800 bg-slate-950 p-4 sm:grid-cols-3"
      >
        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Baseline Daily PM2.5 Load</p>
          <p className="mt-1 text-2xl font-extrabold text-amber-300">
            {metrics.baselineDailyInhaledPm25Ug.toLocaleString()} µg
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Projected Exposure Cut</p>
          <p className="mt-1 text-2xl font-extrabold text-emerald-400">
            -{metrics.projectedPm25ReductionPercent}%
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-slate-400">Daily CO2 Avoided</p>
          <p className="mt-1 text-2xl font-extrabold text-sky-400">
            {metrics.dailyCo2SavedKg} kg
          </p>
        </div>
      </div>

      <p className="mt-3 rounded-lg border border-sky-900/70 bg-sky-950/40 px-4 py-2.5 text-sm text-sky-100">
        <strong>Safe Outdoor Window:</strong> {metrics.recommendedOutdoorWindow}
      </p>
    </section>
  );
}
