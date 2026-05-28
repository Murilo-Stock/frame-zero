'use client';
import { useState } from 'react';
import type { Item, UseCase } from '@/lib/types';
import { useFilter } from '@/lib/useFilter';
import { UseCaseRail } from './UseCaseRail';
import { Masonry } from './Masonry';
import { Lightbox } from './Lightbox';
import { UseCaseIndex } from './UseCaseIndex';
import { USE_CASES } from '@/lib/types';

export function Gallery({ items }: { items: Item[] }) {
  const { state, setState, filtered } = useFilter(items);
  const [open, setOpen] = useState<Item | null>(null);
  const counts = USE_CASES.reduce((acc, uc) => {
    acc[uc] = items.filter((i) => i.useCase === uc).length;
    return acc;
  }, {} as Record<UseCase, number>);

  // When no filter: group by use-case with section headers
  const grouped = !state.useCase && !state.model && !state.query;

  return (
    <>
      <UseCaseRail
        useCase={state.useCase}
        model={state.model}
        query={state.query}
        onChange={(patch) => setState((s) => ({ ...s, ...patch }))}
      />
      {grouped ? (
        USE_CASES.map((uc) => {
          const bucket = filtered.filter((i) => i.useCase === uc);
          if (bucket.length === 0) return null;
          return (
            <section key={uc} id={`section-${uc}`} className="py-16">
              <header className="max-w-7xl mx-auto px-6 mb-8 flex items-baseline gap-4 border-b border-rule pb-4">
                <h2 className="font-display text-4xl text-ink capitalize">{uc}</h2>
                <span className="font-mono text-xs uppercase tracking-caps text-amber">{bucket.length} frames</span>
              </header>
              <Masonry items={bucket} onOpen={setOpen} />
            </section>
          );
        })
      ) : (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-6 mb-6 font-mono text-xs uppercase tracking-caps text-ink-mute">
            {filtered.length} of {items.length} frames
          </div>
          <Masonry items={filtered} onOpen={setOpen} />
        </section>
      )}
      <Lightbox item={open} onClose={() => setOpen(null)} />
      <UseCaseIndex counts={counts} />
    </>
  );
}
