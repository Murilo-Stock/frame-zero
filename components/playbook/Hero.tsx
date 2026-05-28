import type { Playbook } from '@/lib/types';

export function Hero({ playbook }: { playbook: Playbook }) {
  return (
    <section
      className="relative px-6 md:px-10 pt-20 pb-16 border-b border-rule"
      style={{ background: `linear-gradient(180deg, ${playbook.color}10 0%, transparent 100%)` }}
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="text-5xl md:text-6xl leading-none" aria-hidden="true">
          {playbook.icon}
        </div>
        <h1 className="font-display text-6xl md:text-7xl lg:text-8xl tracking-tight leading-none text-ink">
          {playbook.name}
        </h1>
        <p className="text-xl md:text-2xl text-ink-mute max-w-3xl leading-snug">
          {playbook.tagline}
        </p>
        {playbook.icp && (
          <p className="font-mono text-xs md:text-sm uppercase tracking-caps text-amber mt-2">
            ICP · {playbook.icp}
          </p>
        )}
        <div
          className="h-px w-32 mt-2"
          style={{ background: playbook.color, opacity: 0.7 }}
        />
      </div>
    </section>
  );
}
