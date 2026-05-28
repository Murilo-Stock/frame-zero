import type { Playbook } from '@/lib/types';

export function Stack({ playbook }: { playbook: Playbook }) {
  if (!playbook.stack || playbook.stack.length === 0) return null;
  return (
    <section className="px-6 md:px-10 py-16 border-b border-rule">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-mono text-xs uppercase tracking-caps text-amber mb-8">
          The Stack
        </h2>
        <ol className="flex flex-col">
          {playbook.stack.map((row, i) => (
            <li
              key={`${row.moment}-${i}`}
              className="grid grid-cols-12 gap-4 md:gap-6 py-5 border-t border-rule last:border-b"
            >
              <span className="col-span-1 font-mono text-[10px] text-ink-mute pt-2">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="col-span-12 md:col-span-4 font-display text-2xl md:text-3xl text-ink leading-tight">
                {row.moment}
              </span>
              <span className="col-span-12 md:col-span-2">
                <span className="inline-block font-mono text-[10px] uppercase tracking-caps text-amber bg-canvas-2 border border-rule px-2 py-1">
                  {row.model}
                </span>
              </span>
              <span className="col-span-12 md:col-span-5 text-sm md:text-base text-ink-mute leading-snug">
                {row.rationale}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
