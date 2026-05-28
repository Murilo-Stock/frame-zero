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

  describe('real YouMind README format (Schema B)', () => {
    const real = readFileSync('scripts/fixtures/youmind-real-image.md', 'utf-8');

    it('extracts both real-format items', () => {
      const items = parseYouMind(real, {
        model: 'gpt-image-2',
        sourceRepo: 'YouMind-OpenLab/awesome-gpt-image-2',
        sourceLicense: 'NOASSERTION',
      });
      expect(items).toHaveLength(2);
    });

    it('parses real-format image (HTML <img>) item', () => {
      const items = parseYouMind(real, {
        model: 'gpt-image-2',
        sourceRepo: 'YouMind-OpenLab/awesome-gpt-image-2',
        sourceLicense: 'NOASSERTION',
      });
      expect(items[0].title).toContain('Profile / Avatar');
      expect(items[0].kind).toBe('image');
      expect(items[0].mediaUrl).toContain('cms-assets.youmind.com');
      expect(items[0].prompt).toContain('studio portrait photograph');
      expect(items[0].hints).toContain('visual');
    });

    it('parses real-format video (anchor href) item with poster', () => {
      const items = parseYouMind(real, {
        model: 'seedance-2',
        sourceRepo: 'YouMind-OpenLab/awesome-seedance-2-prompts',
        sourceLicense: 'NOASSERTION',
      });
      expect(items[1].kind).toBe('video');
      expect(items[1].mediaUrl).toMatch(/\.mp4$/);
      expect(items[1].posterUrl).toContain('thumbnail.jpg');
    });
  });

  describe('real Seedance README format · video detection', () => {
    const seedance = readFileSync('scripts/fixtures/youmind-seedance-real.md', 'utf-8');
    const ctx = {
      model: 'seedance-2' as const,
      sourceRepo: 'YouMind-OpenLab/awesome-seedance-2-prompts',
      sourceLicense: 'NOASSERTION',
    };

    it('extracts all three items from real Seedance fixture', () => {
      const items = parseYouMind(seedance, ctx);
      expect(items).toHaveLength(3);
    });

    it('detects video via direct .mp4 href (Featured entry) + poster from thumbnail', () => {
      const items = parseYouMind(seedance, ctx);
      const featured = items[0];
      expect(featured.title).toContain('Japanese Romance');
      expect(featured.kind).toBe('video');
      expect(featured.mediaUrl).toMatch(/\.mp4$/);
      expect(featured.mediaUrl).toBe('https://github.com/YouMind-OpenLab/awesome-seedance-2-prompts/releases/download/videos/1402.mp4');
      expect(featured.posterUrl).toContain('cloudflarestream');
      expect(featured.posterUrl).toContain('thumbnail.jpg');
    });

    it('detects video via Cloudflare Stream thumbnail + Watch Video link (All Prompts entry)', () => {
      const items = parseYouMind(seedance, ctx);
      const reaper = items[1];
      expect(reaper.title).toContain('Gothic Anime Reaper');
      expect(reaper.kind).toBe('video');
      // mediaUrl should be the Watch Video link target (no direct .mp4 in block)
      expect(reaper.mediaUrl).toContain('youmind.com');
      expect(reaper.mediaUrl).not.toMatch(/\.mp4$/);
      // posterUrl should be the cloudflarestream thumbnail
      expect(reaper.posterUrl).toContain('cloudflarestream');
      expect(reaper.posterUrl).toContain('thumbnail.jpg');
    });

    it('detects video via Cloudflare Stream thumbnail · second sample (regression for >1 entry)', () => {
      const items = parseYouMind(seedance, ctx);
      const stealth = items[2];
      expect(stealth.title).toContain('AAA Stealth');
      expect(stealth.kind).toBe('video');
      expect(stealth.posterUrl).toContain('cloudflarestream');
    });

    it('does NOT promote plain images to video for non-video-CDN thumbnails (regression for image models)', () => {
      // Re-use the existing real-image fixture (gpt-image-2 / nano-banana style)
      const realImg = readFileSync('scripts/fixtures/youmind-real-image.md', 'utf-8');
      const items = parseYouMind(realImg, {
        model: 'gpt-image-2',
        sourceRepo: 'YouMind-OpenLab/awesome-gpt-image-2',
        sourceLicense: 'NOASSERTION',
      });
      // First entry is a cms-assets.youmind.com image, NOT a video-CDN thumbnail
      expect(items[0].kind).toBe('image');
      expect(items[0].mediaUrl).toContain('cms-assets.youmind.com');
    });
  });
});
