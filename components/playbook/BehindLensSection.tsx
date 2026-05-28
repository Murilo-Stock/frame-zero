import type { Playbook } from '@/lib/types';

export function BehindLensSection({ playbook }: { playbook: Playbook }) {
  if (!playbook.behindTheLens || playbook.behindTheLens.length === 0) return null;
  return (
    <section className="px-6 md:px-10 py-16 border-b border-rule">
      <div className="max-w-4xl mx-auto">
        <h2 className="font-mono text-xs uppercase tracking-caps text-amber mb-12">
          Behind the Lens
        </h2>
        <ol className="flex flex-col gap-12">
          {playbook.behindTheLens.map((s) => (
            <li key={s.step} className="grid grid-cols-[auto_1fr] gap-6 md:gap-8">
              <div
                className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-amber flex items-center justify-center font-display text-2xl md:text-3xl text-amber leading-none shrink-0"
                aria-hidden="true"
              >
                {s.step}
              </div>
              <div className="flex flex-col gap-3 pt-1">
                <h3 className="font-display text-2xl md:text-3xl text-ink leading-tight">
                  {s.title}
                </h3>
                <p className="text-base md:text-lg text-ink-mute leading-relaxed">
                  {s.body}
                </p>
                {s.screenshot && (
                  <div className="mt-2 aspect-video bg-canvas-2 border border-rule rounded-sm overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={s.screenshot}
                      alt={s.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
