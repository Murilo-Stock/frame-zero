'use client';
import { USE_CASES, type UseCase } from '@/lib/types';

const LABELS: Record<UseCase, string> = {
  visual: 'Visual', ads: 'Ads', ugc: 'UGC', architecture: 'Architecture', broll: 'B-roll', experimental: 'Experimental',
};

export function UseCaseIndex({ counts }: { counts: Record<UseCase, number> }) {
  return (
    <nav className="sticky bottom-0 z-30 bg-canvas/90 backdrop-blur-md border-t border-rule" data-print="hide">
      <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-x-6 gap-y-1 font-mono text-[10px] uppercase tracking-caps text-ink-mute">
        {USE_CASES.map((uc) => (
          <a key={uc} href={`#section-${uc}`} className="hover:text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded">
            {LABELS[uc]} <span className="text-amber">{counts[uc] ?? 0}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
