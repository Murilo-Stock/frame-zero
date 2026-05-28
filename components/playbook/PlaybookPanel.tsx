import Link from 'next/link';
import type { Playbook, Item } from '@/lib/types';
import { Hero } from './Hero';
import { MathBlock } from './MathBlock';
import { Stack } from './Stack';
import { Workflow } from './Workflow';
import { Prompts } from './Prompts';
import { Cases } from './Cases';
import { ResourcesBlock } from './ResourcesBlock';
import { BehindLensSection } from './BehindLensSection';
import { ROICalculator } from './ROICalculator';

export function PlaybookPanel({
  playbook,
  itemsById,
}: {
  playbook: Playbook;
  itemsById?: Record<string, Item>;
}) {
  if (playbook.status === 'stub') {
    return (
      <main>
        <Hero playbook={playbook} />
        <section className="px-6 md:px-10 py-24">
          <div className="max-w-3xl mx-auto flex flex-col gap-6 text-center">
            <p className="font-mono text-xs uppercase tracking-caps text-amber">
              Coming Phase {playbook.comingPhase ?? 'γ'}
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-ink leading-tight">
              This playbook is in production.
            </h2>
            <p className="text-lg text-ink-mute">
              Meanwhile, see{' '}
              <Link href="/#models" className="text-amber hover:text-amber-hot underline underline-offset-4">
                Models
              </Link>{' '}
              for foundation resources, or{' '}
              <Link href={'/playbooks' as never} className="text-amber hover:text-amber-hot underline underline-offset-4">
                browse all playbooks
              </Link>
              .
            </p>
          </div>
        </section>
      </main>
    );
  }
  return (
    <main>
      <Hero playbook={playbook} />
      <MathBlock playbook={playbook} />
      <Stack playbook={playbook} />
      <Workflow playbook={playbook} />
      <Prompts playbook={playbook} itemsById={itemsById} />
      <Cases playbook={playbook} />
      <ResourcesBlock playbook={playbook} />
      <BehindLensSection playbook={playbook} />
      <ROICalculator playbook={playbook} />
      <section className="px-6 md:px-10 py-16">
        <div className="max-w-7xl mx-auto">
          <Link
            href={'/playbooks' as never}
            className="font-mono text-[11px] uppercase tracking-caps text-amber hover:text-amber-hot transition"
          >
            ← All playbooks
          </Link>
        </div>
      </section>
    </main>
  );
}
