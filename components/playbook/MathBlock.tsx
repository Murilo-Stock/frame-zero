import type { Playbook } from '@/lib/types';

type Cell = { label: string; value: string; sub?: string };

function brl(n: number): string {
  return n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  });
}

export function MathBlock({ playbook }: { playbook: Playbook }) {
  if (!playbook.math) return null;
  const m = playbook.math;
  const cells: Cell[] = [
    { label: 'Ticket médio', value: brl(m.ticketMedio), sub: 'per deliverable' },
    { label: 'Time-to-deliver', value: m.timeToDeliver, sub: 'from brief' },
    { label: 'Cost per asset', value: brl(m.costPerAsset), sub: 'API + ops' },
    { label: 'Suggested margin', value: `${m.suggestedMargin}%`, sub: 'gross' },
  ];
  return (
    <section className="px-6 md:px-10 py-16 border-b border-rule">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-mono text-xs uppercase tracking-caps text-amber mb-8">
          The Math
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-rule">
          {cells.map((c) => (
            <div
              key={c.label}
              className="bg-canvas-2 p-6 md:p-8 flex flex-col gap-2"
            >
              <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
                {c.label}
              </span>
              <span className="font-display text-4xl md:text-5xl text-ink leading-none">
                {c.value}
              </span>
              {c.sub && (
                <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
                  {c.sub}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
