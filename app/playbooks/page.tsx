import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import Link from 'next/link';
import type { PlaybooksIndex } from '@/lib/types';
import { TopNav } from '@/components/TopNav';

export default function PlaybooksIndexPage() {
  const path = resolve(process.cwd(), 'public/data/playbooks.json');
  const json: PlaybooksIndex = JSON.parse(readFileSync(path, 'utf-8'));
  const playbooks = json.playbooks;

  return (
    <>
      <TopNav />
      <main>
        <section className="px-6 md:px-10 pt-20 pb-12 border-b border-rule">
          <div className="max-w-7xl mx-auto flex flex-col gap-4">
            <p className="font-mono text-xs uppercase tracking-caps text-amber">
              Frame Zero · v2 · {playbooks.length} playbooks
            </p>
            <h1 className="font-display text-6xl md:text-8xl text-ink tracking-tight leading-none">
              Playbooks
            </h1>
            <p className="text-xl md:text-2xl text-ink-mute max-w-3xl">
              Repeatable production systems. Each playbook is a stack, a workflow, a math, and the prompts that ship it.
            </p>
          </div>
        </section>

        <section className="px-6 md:px-10 py-16">
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-rule">
            {playbooks.map((p) => {
              const isStub = p.status === 'stub';
              const inner = (
                <article
                  className={`relative bg-canvas-2 p-8 md:p-10 flex flex-col gap-4 min-h-[260px] transition-colors ${
                    isStub ? 'opacity-50' : 'hover:bg-canvas group'
                  }`}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-[3px]"
                    style={{ background: p.color }}
                    aria-hidden="true"
                  />
                  <div className="text-4xl leading-none" aria-hidden="true">
                    {p.icon}
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl text-ink leading-tight">
                    {p.name}
                  </h2>
                  <p className="text-base text-ink-mute leading-snug flex-1">
                    {p.tagline}
                  </p>
                  <div className="mt-auto">
                    {isStub ? (
                      <span className="font-mono text-[10px] uppercase tracking-caps text-ink-mute">
                        Coming Phase {p.comingPhase ?? 'γ'}
                      </span>
                    ) : (
                      <span className="font-mono text-[10px] uppercase tracking-caps text-amber group-hover:text-amber-hot transition-colors">
                        Open playbook →
                      </span>
                    )}
                  </div>
                </article>
              );
              if (isStub) {
                return <div key={p.id}>{inner}</div>;
              }
              return (
                <Link
                  key={p.id}
                  href={`/playbooks/${p.id}` as never}
                  className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
                >
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
