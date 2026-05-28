import type { Playbook } from '@/lib/types';

export function Cases({ playbook }: { playbook: Playbook }) {
  if (!playbook.cases || playbook.cases.length === 0) return null;
  return (
    <section className="py-16 border-b border-rule">
      <div className="max-w-7xl mx-auto px-6 md:px-10 mb-8">
        <h2 className="font-mono text-xs uppercase tracking-caps text-amber">
          The Cases
        </h2>
      </div>
      <div className="overflow-x-auto snap-x snap-mandatory pl-6 md:pl-10 pb-4">
        <ul className="flex gap-6 pr-6 md:pr-10">
          {playbook.cases.map((c, i) => (
            <li
              key={`${c.brand}-${i}`}
              className="snap-start shrink-0 w-[320px] md:w-[420px] bg-canvas-2 border border-rule rounded-sm p-6 flex flex-col gap-4"
            >
              {c.thumbnail && (
                <div className="aspect-video bg-canvas rounded-sm overflow-hidden border border-rule">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={c.thumbnail}
                    alt={c.brand}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <header className="flex flex-col gap-1">
                <h3 className="font-display text-2xl md:text-3xl text-ink leading-tight">
                  {c.brand}
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
                  {c.credit}
                </p>
              </header>
              {c.metric && (
                <p className="font-display text-4xl text-amber leading-none">
                  {c.metric}
                </p>
              )}
              <p className="text-sm text-ink leading-snug">{c.whatsBrilliant}</p>
              <a
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-auto font-mono text-[10px] uppercase tracking-caps text-amber hover:text-amber-hot transition self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2 rounded-sm"
              >
                Source ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
