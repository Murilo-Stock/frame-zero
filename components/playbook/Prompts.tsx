'use client';
import { useState } from 'react';
import type { Playbook, PromptEntry, Item } from '@/lib/types';

function PromptCard({ p, item }: { p: PromptEntry; item?: Item }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(p.body);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }
  return (
    <article className="bg-canvas-2 border border-rule rounded-sm p-6 flex flex-col gap-4">
      <header className="flex items-start justify-between gap-3">
        <h3 className="font-display text-2xl text-ink leading-tight">{p.title}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <span className="font-mono text-[10px] uppercase tracking-caps text-amber bg-canvas border border-rule px-2 py-1">
            {p.model}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute border border-rule px-2 py-1">
            {p.aspect}
          </span>
        </div>
      </header>
      {item && item.mediaUrl && (
        <div className="aspect-video bg-canvas overflow-hidden rounded-sm border border-rule">
          {item.kind === 'video' ? (
            <video
              src={item.mediaUrl}
              muted
              loop
              playsInline
              autoPlay
              className="w-full h-full object-cover"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.mediaUrl}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}
      <pre className="font-mono text-xs md:text-sm text-ink-mute leading-relaxed whitespace-pre-wrap bg-canvas border border-rule rounded-sm p-4 max-h-72 overflow-auto">
        {p.body}
      </pre>
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {p.tags && p.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {p.tags.map((t) => (
              <li
                key={t}
                className="font-mono text-[10px] uppercase tracking-caps text-ink-mute"
              >
                #{t}
              </li>
            ))}
          </ul>
        )}
        <button
          onClick={copy}
          className="ml-auto font-mono text-[10px] uppercase tracking-caps text-amber hover:text-amber-hot transition border border-amber/40 hover:border-amber px-3 py-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2"
        >
          {copied ? '✓ Copied' : 'Copy prompt'}
        </button>
      </div>
    </article>
  );
}

export function Prompts({
  playbook,
  itemsById,
}: {
  playbook: Playbook;
  itemsById?: Record<string, Item>;
}) {
  if (!playbook.prompts || playbook.prompts.length === 0) return null;
  return (
    <section className="px-6 md:px-10 py-16 border-b border-rule">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-mono text-xs uppercase tracking-caps text-amber mb-8">
          The Prompts
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {playbook.prompts.map((p, i) => (
            <PromptCard
              key={`${p.title}-${i}`}
              p={p}
              item={p.expectedOutputItemId ? itemsById?.[p.expectedOutputItemId] : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
