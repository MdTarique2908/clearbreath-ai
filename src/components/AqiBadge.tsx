import React from 'react';
import type { SeverityLabel } from '../lib/airCalculations';

interface AqiBadgeProps {
  aqi: number;
  severity: SeverityLabel;
}

const SEVERITY_STYLES: Record<SeverityLabel, string> = {
  Good: 'bg-emerald-950 text-emerald-100 border-emerald-600',
  Moderate: 'bg-amber-950 text-amber-100 border-amber-500',
  Poor: 'bg-orange-950 text-orange-100 border-orange-500',
  Severe: 'bg-red-950 text-red-100 border-red-500',
  Hazardous: 'bg-purple-950 text-purple-100 border-purple-500',
};

export function AqiBadge({ aqi, severity }: AqiBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm font-semibold ${SEVERITY_STYLES[severity]}`}
      aria-label={`Air Quality Index ${aqi}, rated ${severity}`}
    >
      <span className="h-2.5 w-2.5 rounded-full bg-current" aria-hidden="true" />
      AQI {aqi} · {severity}
    </span>
  );
}
