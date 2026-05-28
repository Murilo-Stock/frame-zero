import { describe, it, expect } from 'vitest';
import { scoreItem } from '../scripts/score.mjs';

describe('scoreItem', () => {
  const base = {
    title: 'Foo', prompt: 'A wonderful prompt with many descriptive words for golden hour cinematic film grain shallow depth of field warm color grading editorial portraiture intimate framing soft rim light story driven composition',
    mediaUrl: 'https://x.test/foo.png', width: 1200, height: 1500,
    model: 'gpt-image-2' as const, kind: 'image' as const, aspect: '4:5',
    sourceRepo: 'r', sourceLicense: 'l', sourceUrl: 'u', hints: [],
  };

  it('rejects when prompt < 20 words', () => {
    const r = scoreItem({ ...base, prompt: 'short prompt' }, 'visual');
    expect(r.keep).toBe(false);
  });

  it('rejects when image short edge < 1024', () => {
    const r = scoreItem({ ...base, width: 800, height: 600 }, 'visual');
    expect(r.keep).toBe(false);
  });

  it('boosts score when aspect matches use-case (9:16 for ugc)', () => {
    const standard = scoreItem({ ...base, aspect: '1:1' }, 'ugc');
    const matched = scoreItem({ ...base, aspect: '9:16' }, 'ugc');
    expect(matched.score).toBeGreaterThan(standard.score);
  });

  it('drops when prompt > 600 words', () => {
    const longPrompt = 'word '.repeat(601).trim();
    const r = scoreItem({ ...base, prompt: longPrompt }, 'visual');
    expect(r.keep).toBe(false);
  });
});
