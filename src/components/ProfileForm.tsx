import React from 'react';
import type { UserContext } from '../schemas/airPlan';

interface ProfileFormProps {
  context: UserContext;
  onChange: (updated: UserContext) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

const PRESETS: { label: string; data: Partial<UserContext> }[] = [
  {
    label: 'Severe Winter Smog (Delhi)',
    data: { city: 'New Delhi', aqi: 385, pm25: 245, commuteMode: 'two_wheeler', dailyCommuteKm: 18 },
  },
  {
    label: 'Moderate Urban Haze (Mumbai)',
    data: { city: 'Mumbai', aqi: 145, pm25: 68, commuteMode: 'public_transit', dailyCommuteKm: 24 },
  },
  {
    label: 'Cold Inversion Morning (Lahore)',
    data: { city: 'Lahore', aqi: 420, pm25: 270, commuteMode: 'petrol_car', dailyCommuteKm: 15 },
  },
];

export function ProfileForm({ context, onChange, onSubmit, isLoading }: ProfileFormProps) {
  const updateField = <K extends keyof UserContext>(key: K, value: UserContext[K]) => {
    onChange({ ...context, [key]: value });
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
      className="rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-lg"
      aria-labelledby="profile-heading"
    >
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 id="profile-heading" className="text-lg font-bold text-white">
          1. Location & Lifestyle Profile
        </h2>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Quick smog presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => onChange({ ...context, ...preset.data })}
              className="rounded-lg border border-slate-600 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-400"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Household vs Community Toggle */}
      <fieldset className="mb-5">
        <legend className="mb-2 text-sm font-medium text-slate-200">Planning Mode</legend>
        <div className="grid grid-cols-2 gap-3">
          {(['household', 'community'] as const).map((mode) => (
            <label
              key={mode}
              className={`flex cursor-pointer items-center justify-center rounded-xl border px-4 py-2.5 text-sm font-semibold capitalize transition ${
                context.audienceMode === mode
                  ? 'border-sky-400 bg-sky-950 text-sky-100'
                  : 'border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-750'
              }`}
            >
              <input
                type="radio"
                name="audienceMode"
                value={mode}
                checked={context.audienceMode === mode}
                onChange={() => updateField('audienceMode', mode)}
                className="sr-only"
              />
              {mode === 'household' ? 'Family / Household' : 'Neighborhood / Community'}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <label htmlFor="city-input" className="mb-1 block text-sm font-medium text-slate-200">
            City or Neighborhood
          </label>
          <input
            id="city-input"
            type="text"
            required
            minLength={2}
            maxLength={80}
            value={context.city}
            onChange={(e) => updateField('city', e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label htmlFor="aqi-input" className="mb-1 block text-sm font-medium text-slate-200">
            Current AQI (0–1000)
          </label>
          <input
            id="aqi-input"
            type="number"
            min={0}
            max={1000}
            required
            value={context.aqi}
            onChange={(e) => updateField('aqi', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label htmlFor="pm25-input" className="mb-1 block text-sm font-medium text-slate-200">
            PM2.5 (µg/m³)
          </label>
          <input
            id="pm25-input"
            type="number"
            min={0}
            max={1500}
            required
            value={context.pm25}
            onChange={(e) => updateField('pm25', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label htmlFor="commute-select" className="mb-1 block text-sm font-medium text-slate-200">
            Primary Commute Mode
          </label>
          <select
            id="commute-select"
            value={context.commuteMode}
            onChange={(e) => updateField('commuteMode', e.target.value as UserContext['commuteMode'])}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          >
            <option value="petrol_car">Petrol / Diesel Car</option>
            <option value="two_wheeler">Two-Wheeler / Scooter</option>
            <option value="public_transit">Metro / Public Bus</option>
            <option value="walk_cycle">Walk / Bicycle</option>
          </select>
        </div>

        <div>
          <label htmlFor="km-input" className="mb-1 block text-sm font-medium text-slate-200">
            Daily Commute (km)
          </label>
          <input
            id="km-input"
            type="number"
            min={0}
            max={300}
            required
            value={context.dailyCommuteKm}
            onChange={(e) => updateField('dailyCommuteKm', Number(e.target.value))}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>

        <div>
          <label htmlFor="size-input" className="mb-1 block text-sm font-medium text-slate-200">
            People Covered
          </label>
          <input
            id="size-input"
            type="number"
            min={1}
            max={500}
            required
            value={context.householdSize}
            onChange={(e) => updateField('householdSize', Math.max(1, Number(e.target.value)))}
            className="w-full rounded-lg border border-slate-600 bg-slate-950 px-3 py-2 text-sm text-white focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-400"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-slate-800 pt-4">
        <div className="flex flex-wrap gap-6">
          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={context.hasVulnerableMembers}
              onChange={(e) => updateField('hasVulnerableMembers', e.target.checked)}
              className="h-4 w-4 rounded border-slate-500 text-sky-500 focus:ring-sky-400"
            />
            Kids, elderly, or asthma sensitivity
          </label>

          <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
            <input
              type="checkbox"
              checked={context.hasAirPurifier}
              onChange={(e) => updateField('hasAirPurifier', e.target.checked)}
              className="h-4 w-4 rounded border-slate-500 text-sky-500 focus:ring-sky-400"
            />
            HEPA air purifier available
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-sky-500 px-6 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:opacity-60"
        >
          {isLoading ? 'Generating Tailored Plan...' : 'Generate Clean-Air Plan'}
        </button>
      </div>
    </form>
  );
}
