'use client';
import { useState } from 'react';
import type { Playbook } from '@/lib/types';

export function Workflow({ playbook }: { playbook: Playbook }) {
  const [copied, setCopied] = useState(false);
  if (!playbook.workflow) return null;
  const code = playbook.workflow.mermaid;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  }

  return (
    <section className="px-6 md:px-10 py-16 border-b border-rule">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
          <h2 className="font-mono text-xs uppercase tracking-caps text-amber">
            The Workflow
          </h2>
          <p className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
            Paste into mermaid.live to preview
          </p>
        </div>
        <div className="bg-canvas-2 border border-rule rounded-sm p-6 md:p-8 flex flex-col gap-4">
          <pre className="font-mono text-xs md:text-sm text-ink-mute leading-relaxed overflow-x-auto whitespace-pre">
            {code}
          </pre>
          <button
            onClick={copy}
            className="self-start font-mono text-[10px] uppercase tracking-caps text-amber hover:text-amber-hot transition border border-amber/40 hover:border-amber px-3 py-1.5 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas-2"
          >
            {copied ? '✓ Copied' : 'Copy mermaid'}
          </button>
        </div>
      </div>
    </section>
  );
}
