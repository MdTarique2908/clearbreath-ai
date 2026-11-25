# ClearBreath AI — Urban Air Quality & Winter Smog Assistant

Built for **PromptWars Challenge 6**, ClearBreath AI helps families and communities navigate severe winter smog and urban air pollution through personalized low-emission daily routines, indoor air quality hacks, sustainable alternatives, and transparent impact math.

## Key Capabilities
- **Household & Community Modes:** Tailors advice for individual families (including vulnerable members) or neighborhood-level action plans.
- **Deterministic Impact Simulator:** Calculates baseline daily $\text{PM}_{2.5}$ inhalation, exposure reduction percentages, $\text{CO}_2$ savings, and winter thermal-inversion safe outdoor windows.
- **Structured GenAI Playbook:** Uses **Gemini 2.5 Flash** (`@google/genai`) with strict Zod schema validation and an automatic offline fallback engine.
- **Accessible & Secure:** WCAG-tested UI (`vitest-axe`), strict TypeScript, server-side API key protection, rate limiting, and hardened HTTP security headers.

## Local Setup & Testing
1. Install dependencies: `npm install`
2. Add `GEMINI_API_KEY=your_key_here` to `.env.local`
3. Run tests: `npm test`
4. Start dev server: `npm run dev`
