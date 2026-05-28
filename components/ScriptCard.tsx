import type { Item, UseCase } from '@/lib/types';

// Cinema slugline prefix per use-case — typographic noir replacement for missing imagery.
const SLUGLINE: Record<UseCase, string> = {
  visual: 'INT. STUDIO — DAY',
  ads: 'INT. SET — CONTINUOUS',
  ugc: 'EXT. HANDHELD — DAY',
  architecture: 'INT. PROPERTY — GOLDEN HOUR',
  broll: 'EXT. CITYSCAPE — NIGHT',
  experimental: 'EXT. CONCRETE LAB — DAWN',
};

export function ScriptCard({ item, compact = false }: { item: Item; compact?: boolean }) {
  return (
    <div
      className="w-full h-full bg-canvas relative overflow-hidden flex flex-col p-5"
      style={{ aspectRatio: compact ? undefined : `${item.width} / ${item.height}` }}
    >
      {/* Subtle corner mark */}
      <div className="absolute top-3 right-3 font-mono text-[9px] uppercase tracking-caps text-amber/60">
        ✎ Murilo Lab
      </div>

      {/* Slugline */}
      <div className="font-mono text-[10px] uppercase tracking-caps text-amber mb-3">
        {SLUGLINE[item.useCase] ?? SLUGLINE.visual}
      </div>

      {/* Title */}
      <h3 className="font-display text-2xl text-ink leading-tight mb-3 line-clamp-3">
        {item.title}
      </h3>

      {/* Prompt body */}
      <pre className="font-mono text-[11px] leading-relaxed text-ink-mute whitespace-pre-wrap line-clamp-[10] flex-1">
        {item.prompt}
      </pre>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-rule font-mono text-[9px] uppercase tracking-caps text-ink-mute/70 flex justify-between">
        <span>{item.subCategory}</span>
        <span>{item.aspect}</span>
      </div>
    </div>
  );
}
