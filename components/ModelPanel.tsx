'use client';
import { useState } from 'react';
import type { Item, ModelResource } from '@/lib/types';
import { Card } from './Card';
import { Lightbox } from './Lightbox';
import { ResourceCard } from './ResourceCard';

export function ModelPanel({
  model,
  items,
}: {
  model: ModelResource;
  items: Item[];
}) {
  const [open, setOpen] = useState<Item | null>(null);
  const thumbs = items.slice(0, 6);

  return (
    <section id={`model-${model.id}`} className="py-24 px-6 border-t border-rule scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* LEFT 60% */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            <div className="font-mono text-[10px] uppercase tracking-caps text-amber">{model.vendor}</div>
            <h2 className="font-display text-5xl md:text-7xl text-ink leading-none">{model.name}</h2>
            <p className="text-xl text-ink-mute leading-relaxed max-w-2xl">{model.tagline}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {model.strengths.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-caps text-ink-mute border border-rule px-2.5 py-1 rounded-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber" aria-hidden="true" />
                  {s}
                </span>
              ))}
            </div>
            <div className="font-mono text-xs text-ink-mute mt-4 pt-4 border-t border-rule flex flex-wrap gap-x-3 gap-y-1">
              <span><span className="text-amber">{items.length}</span> prompts in gallery</span>
              <span className="text-rule">·</span>
              <span><span className="text-amber">{model.repos.length}</span> repos</span>
              <span className="text-rule">·</span>
              <span><span className="text-amber">{model.videos.length}</span> videos</span>
              <span className="text-rule">·</span>
              <span><span className="text-amber">{model.courses.length}</span> courses</span>
              <span className="text-rule">·</span>
              <span><span className="text-amber">{model.tools.length}</span> tools</span>
            </div>
          </div>

          {/* RIGHT 40% */}
          <div className="lg:col-span-2">
            {thumbs.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {thumbs.map((it) => (
                  <Card key={it.id} item={it} onOpen={() => setOpen(it)} />
                ))}
              </div>
            ) : (
              <div className="h-full min-h-[12rem] flex items-center justify-center border border-dashed border-rule rounded-sm p-6">
                <span className="font-mono text-xs uppercase tracking-caps text-ink-mute text-center">
                  No prompts in gallery yet · resources below
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Resource cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <ResourceCard kind="repos" items={model.repos} />
          <ResourceCard kind="videos" items={model.videos} />
          <ResourceCard kind="courses" items={model.courses} />
          <ResourceCard kind="tools" items={model.tools} />
        </div>
      </div>
      <Lightbox item={open} onClose={() => setOpen(null)} />
    </section>
  );
}
