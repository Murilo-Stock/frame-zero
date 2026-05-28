import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseYouMind } from '../../scripts/parsers/youmind.mjs';

const fixture = readFileSync('scripts/fixtures/youmind-sample.md', 'utf-8');

describe('parseYouMind', () => {
  it('extracts two items from sample', () => {
    const items = parseYouMind(fixture, {
      model: 'gpt-image-2',
      sourceRepo: 'YouMind-OpenLab/awesome-gpt-image-2',
      sourceLicense: 'NOASSERTION',
    });
    expect(items).toHaveLength(2);
  });

  it('captures title, prompt, mediaUrl, aspect', () => {
    const items = parseYouMind(fixture, {
      model: 'gpt-image-2',
      sourceRepo: 'YouMind-OpenLab/awesome-gpt-image-2',
      sourceLicense: 'NOASSERTION',
    });
    expect(items[0].title).toBe("Cinematic Portrait — Director's Cut");
    expect(items[0].prompt).toContain('cinematic portrait of a woman');
    expect(items[0].mediaUrl).toBe('https://raw.githubusercontent.com/YouMind-OpenLab/awesome-gpt-image-2/main/public/images/portrait-001.png');
    expect(items[0].aspect).toBe('4:5');
    expect(items[0].kind).toBe('image');
    expect(items[0].model).toBe('gpt-image-2');
  });

  it('detects video kind for .mp4 mediaUrl', () => {
    const videoFixture = fixture.replace('portrait-001.png', 'portrait-001.mp4');
    const items = parseYouMind(videoFixture, {
      model: 'seedance-2',
      sourceRepo: 'YouMind-OpenLab/awesome-seedance-2-prompts',
      sourceLicense: 'NOASSERTION',
    });
    expect(items[0].kind).toBe('video');
  });
});
