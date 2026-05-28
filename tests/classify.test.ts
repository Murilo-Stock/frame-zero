import { describe, it, expect } from 'vitest';
import { classify } from '../scripts/classify.mjs';

describe('classify', () => {
  it.each([
    ['Product hero shot for cosmetic ad campaign', 'ads'],
    ['Vertical 9:16 selfie POV candid morning routine', 'ugc'],
    ['Modern living room interior, golden hour, architectural digest', 'architecture'],
    ['Looping cinematic b-roll of city skyline at dawn', 'broll'],
    ['Surreal conceptual abstract dreamscape with melting clocks', 'experimental'],
    ['Portrait of a woman in 35mm film grain, shallow DoF', 'visual'],
  ])('classifies "%s" → %s', (text, expectedUseCase) => {
    expect(classify(text, [])).toBe(expectedUseCase);
  });

  it('respects explicit hints when present', () => {
    expect(classify('Just a portrait shot', ['experimental'])).toBe('experimental');
  });
});
