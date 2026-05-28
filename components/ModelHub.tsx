'use client';
import type { Item, ModelResource } from '@/lib/types';
import { ModelPanel } from './ModelPanel';

export function ModelHub({
  resources,
  items,
}: {
  resources: ModelResource[];
  items: Item[];
}) {
  const itemsByModel: Record<string, Item[]> = {};
  for (const m of resources) itemsByModel[m.id] = [];
  for (const it of items) {
    if (itemsByModel[it.model]) itemsByModel[it.model].push(it);
  }

  return (
    <section id="the-models" className="py-24 bg-canvas border-t border-rule">
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <div className="font-mono text-[10px] uppercase tracking-caps text-amber mb-4">The Models</div>
        <h2 className="font-display text-5xl md:text-6xl text-ink leading-none mb-4">
          The Models
        </h2>
        <p className="text-xl text-ink-mute max-w-3xl leading-relaxed">
          Three frontier image models. One frontier video model. Everything you need to learn each.
        </p>
      </div>

      {/* Sticky in-page nav */}
      <nav
        aria-label="Model navigation"
        className="sticky top-0 z-30 bg-canvas/85 backdrop-blur-md border-y border-rule"
      >
        <div className="max-w-7xl mx-auto px-6 py-3 flex flex-wrap gap-2 overflow-x-auto">
          {resources.map((m) => (
            <a
              key={m.id}
              href={`#model-${m.id}`}
              className="font-mono text-[11px] uppercase tracking-caps text-ink-mute hover:text-amber border border-rule hover:border-amber px-3 py-1.5 rounded-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas whitespace-nowrap"
            >
              {m.name}
            </a>
          ))}
        </div>
      </nav>

      <div>
        {resources.map((m) => (
          <ModelPanel key={m.id} model={m} items={itemsByModel[m.id] || []} />
        ))}
      </div>
    </section>
  );
}
