import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ClearBreath AI — Urban Air Quality & Winter Smog Assistant',
  description:
    'GenAI-powered assistant helping families and communities navigate severe winter smog with low-emission daily routines, indoor air hacks, and clear impact explanations.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-sky-400 focus:px-4 focus:py-2 focus:text-sm focus:font-bold focus:text-slate-950"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
