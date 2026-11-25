import type { StructuredAirPlan, UserContext } from '../schemas/airPlan';
import { classifySmogSeverity } from './airCalculations';

export function generateFallbackPlan(ctx: UserContext): StructuredAirPlan {
  const severity = classifySmogSeverity(ctx.aqi);
  const isCommunity = ctx.audienceMode === 'community';
  const vulnerabilityNote = ctx.hasVulnerableMembers
    ? ' Prioritize extra protection for children, older adults, and anyone with respiratory or heart sensitivity.'
    : '';

  return {
    summaryAlert: `${ctx.city} is currently at AQI ${ctx.aqi} (${severity}, PM2.5 ~${ctx.pm25} µg/m³) in ${
      isCommunity ? 'Community' : 'Household'
    } mode.${vulnerabilityNote}`,
    lowEmissionRoutines: [
      {
        title: 'Shift Outdoor & Commute Windows Past Smog Traps',
        steps: [
          'Delay non-urgent outdoor walks or errands from early morning and late evening into warmer midday hours when ground-level inversion eases.',
          'Batch multiple errands into a single trip rather than making separate short outings.',
        ],
        directImpactExplanation:
          'Winter temperature inversions trap fine particulates near the ground during cold mornings and nights; moving trips into warmer hours and combining stops reduces both direct PM2.5 inhalation and cold-start vehicle emissions.',
        estimatedReductionTag: 'Up to 18% exposure cut',
      },
      {
        title:
          ctx.commuteMode === 'two_wheeler'
            ? 'Swap Open Two-Wheeler Trips for Enclosed Transit'
            : 'Combine Commute Legs with Public Transit or Carpooling',
        steps: [
          isCommunity
            ? 'Organize a shared neighbor carpool or staggered school/work transit drop-off group.'
            : 'Use metro, bus, or shared rides for longer stretches and walk or cycle only on low-traffic side streets.',
        ],
        directImpactExplanation:
          'Riders on open two-wheelers face direct roadside exhaust and road-dust exposure, while shifting solo vehicle kilometers to mass or shared transit lowers per-passenger tailpipe NOx and CO2 emissions.',
        estimatedReductionTag: 'Lower tailpipe CO2 & PM',
      },
    ],
    indoorAirHacks: [
      {
        title: 'Seal Draft Gaps & Time Window Ventilation',
        steps: [
          'Keep windows and balcony doors tightly closed during peak smog hours, using weatherstripping or rolled towels on leaky gaps.',
          'Open cross-ventilating windows briefly (5–10 minutes) only when outdoor PM2.5 dips during midday.',
        ],
        directImpactExplanation:
          'Preventing unfiltered outdoor air infiltration keeps indoor PM2.5 well below outdoor peaks, while brief midday airing clears indoor CO2 and moisture without flooding the room with heavy smog.',
        estimatedReductionTag: '22%–38% indoor PM cut',
      },
      {
        title: 'Cut Indoor Combustion & Run Filtration Smartly',
        steps: [
          'Pause incense sticks, agarbatti, candles, and unvented indoor burning during smog episodes, and run kitchen exhaust during cooking.',
          ctx.hasAirPurifier
            ? 'Run your air purifier continuously in the main bedroom or living room with doors closed.'
            : 'Concentrate family time in one well-sealed room and consider a certified HEPA purifier or DIY MERV-13 fan filter.',
        ],
        directImpactExplanation:
          'Indoor burning and pan-frying generate dense ultrafine particles inside already closed rooms; pairing source control with HEPA filtration removes suspended PM2.5 directly from indoor air.',
        estimatedReductionTag: 'High indoor air protection',
      },
    ],
    sustainableAlternatives: [
      {
        title: isCommunity
          ? `Coordinate a ${ctx.city} Clean-Air Block Playbook`
          : `Tailor Low-Impact Habits to ${ctx.city}`,
        steps: [
          isCommunity
            ? 'Share daily midday safe-window alerts with neighbors and discourage open leaf or waste burning in the area.'
            : 'Choose cleaner cooking/heating fuels where possible and avoid idling engines while waiting.',
        ],
        directImpactExplanation:
          'Eliminating open burning and unnecessary engine idling removes high-toxicity smoke and black carbon right where families live and breathe.',
        estimatedReductionTag: 'Sustained local impact',
      },
      {
        title: 'Track Real-Time Air & Routine Adjustments',
        steps: [
          'Check hourly PM2.5 before planning outdoor chores and keep a N95/FFP2-grade mask handy if forced into heavy traffic.',
          'Review which routine swaps felt easiest this week and keep them as your baseline winter habit.',
        ],
        directImpactExplanation:
          'Consistent habit tracking turns one-off smog reactions into repeatable low-emission routines that lower cumulative seasonal exposure.',
        estimatedReductionTag: 'Long-term habit gain',
      },
    ],
    causalTakeaway:
      'Closing air leaks and cutting indoor smoke protect your lungs immediately, while shifting trips and sharing rides reduces the emissions feeding urban smog.',
  };
}
