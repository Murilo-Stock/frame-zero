import { describe, it, expect } from 'vitest';
import { curate } from '../scripts/curate.mjs';

function mkRaw(model: any, aspect: string, idx: number, useCaseHint: string) {
  return {
    title: `Item ${idx}`,
    prompt: `Variant ${idx} ${useCaseHint} ${aspect}: ` + 'A long enough prompt with plenty of descriptive words for the curator to keep it around safely '.repeat(2),
    mediaUrl: `https://x.test/${idx}.png`,
    width: 1500, height: 1500, kind: 'image' as const, model, aspect,
    sourceRepo: 'r', sourceLicense: 'l', sourceUrl: 'u',
    hints: [useCaseHint],
  };
}

describe('curate', () => {
  it('respects quota table (visual=60, ads=50, ugc=40, architecture=50, broll=60, experimental=30)', () => {
    const raws = [
      ...Array.from({length: 200}, (_, i) => mkRaw('gpt-image-2', '4:5', i, 'visual')),
      ...Array.from({length: 200}, (_, i) => mkRaw('nano-banana-pro', '1:1', 1000+i, 'ads')),
      ...Array.from({length: 200}, (_, i) => mkRaw('seedance-2', '9:16', 2000+i, 'ugc')),
      ...Array.from({length: 200}, (_, i) => mkRaw('gpt-image-2', '16:9', 3000+i, 'architecture')),
      ...Array.from({length: 200}, (_, i) => mkRaw('seedance-2', '16:9', 4000+i, 'broll')),
      ...Array.from({length: 200}, (_, i) => mkRaw('gpt-image-2', '1:1', 5000+i, 'experimental')),
    ];
    const out = curate(raws);
    const counts: Record<string, number> = {};
    for (const it of out.items) counts[it.useCase] = (counts[it.useCase] || 0) + 1;
    expect(counts.visual).toBe(60);
    expect(counts.ads).toBe(50);
    expect(counts.ugc).toBe(40);
    expect(counts.architecture).toBe(50);
    expect(counts.broll).toBe(60);
    expect(counts.experimental).toBe(30);
    expect(out.items.length).toBe(290);
  });

  it('assigns stable ids', () => {
    const raws = Array.from({length: 50}, (_, i) => mkRaw('gpt-image-2', '4:5', i, 'visual'));
    const out = curate(raws);
    const ids = new Set(out.items.map((i) => i.id));
    expect(ids.size).toBe(out.items.length); // no duplicates
  });

  it('emits curation log entries', () => {
    const raws = [mkRaw('gpt-image-2', '4:5', 0, 'visual')];
    const out = curate(raws);
    expect(out.log).toBeDefined();
    expect(Array.isArray(out.log)).toBe(true);
  });
});
