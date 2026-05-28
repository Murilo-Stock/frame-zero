'use client';
import { USE_CASES, type UseCase, type Model } from '@/lib/types';
import { clsx } from 'clsx';

const USE_CASE_LABELS: Record<UseCase, string> = {
  visual: 'Visual',
  ads: 'Ads',
  ugc: 'UGC',
  architecture: 'Architecture',
  broll: 'B-roll',
  experimental: 'Experimental',
};

const MODELS: Array<{ id: Model; label: string }> = [
  { id: 'gpt-image-2', label: 'GPT Image 2' },
  { id: 'nano-banana-pro', label: 'Nano Banana Pro' },
  { id: 'seedance-2', label: 'Seedance 2' },
];

export function UseCaseRail({
  useCase, model, query, onChange,
}: {
  useCase: UseCase | null;
  model: Model | null;
  query: string;
  onChange: (s: { useCase?: UseCase | null; model?: Model | null; query?: string }) => void;
}) {
  return (
    <div className="sticky top-0 z-40 bg-canvas/80 backdrop-blur-md border-b border-rule">
      <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap items-center gap-3">
        <span className="font-mono text-xs uppercase tracking-caps text-ink-mute mr-2">Use-case</span>
        {USE_CASES.map((uc) => (
          <button
            key={uc}
            onClick={() => onChange({ useCase: useCase === uc ? null : uc })}
            aria-pressed={useCase === uc}
            className={clsx(
              'px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-caps border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
              useCase === uc
                ? 'bg-amber text-canvas border-amber'
                : 'text-ink-mute border-rule hover:text-ink hover:border-ink-mute',
            )}
          >
            {USE_CASE_LABELS[uc]}
          </button>
        ))}
        <span className="w-px h-5 bg-rule mx-2" />
        <span className="font-mono text-xs uppercase tracking-caps text-ink-mute mr-2">Model</span>
        {MODELS.map((m) => (
          <button
            key={m.id}
            onClick={() => onChange({ model: model === m.id ? null : m.id })}
            aria-pressed={model === m.id}
            className={clsx(
              'px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-caps border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas',
              model === m.id
                ? 'bg-ink text-canvas border-ink'
                : 'text-ink-mute border-rule hover:text-ink hover:border-ink-mute',
            )}
          >
            {m.label}
          </button>
        ))}
        <input
          value={query}
          onChange={(e) => onChange({ query: e.target.value })}
          placeholder="search prompts…"
          aria-label="search prompts"
          className="ml-auto bg-canvas-2 border border-rule rounded-full px-4 py-1.5 text-sm text-ink placeholder:text-ink-mute focus:outline-none focus:border-amber focus-visible:ring-2 focus-visible:ring-amber w-64"
        />
      </div>
    </div>
  );
}
