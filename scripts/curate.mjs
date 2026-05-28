// @ts-check
import { createHash } from 'node:crypto';
import { classify } from './classify.mjs';
import { scoreItem } from './score.mjs';

const QUOTAS = { visual: 60, ads: 50, ugc: 40, architecture: 50, broll: 60, experimental: 30 };

/**
 * @param {Array<import('../lib/types').RawItem>} raws
 * @returns {{items: Array<import('../lib/types').Item>, log: Array<object>}}
 */
export function curate(raws) {
  const log = [];
  const scored = [];
  const seenPrompts = new Set();

  for (const raw of raws) {
    const useCase = classify(`${raw.title} ${raw.prompt}`, raw.hints);
    const { keep, score, reason } = scoreItem(raw, useCase);
    if (!keep) { log.push({ kind: 'reject', reason, title: raw.title }); continue; }
    const promptKey = raw.prompt.trim().toLowerCase().slice(0, 80);
    if (seenPrompts.has(promptKey)) { log.push({ kind: 'reject', reason: 'duplicate-prompt', title: raw.title }); continue; }
    seenPrompts.add(promptKey);
    scored.push({ raw, useCase, score });
  }

  // Sort each bucket by score desc, take quota
  /** @type {Array<import('../lib/types').Item>} */
  const items = [];
  for (const [useCase, quota] of Object.entries(QUOTAS)) {
    const bucket = scored
      .filter((s) => s.useCase === useCase)
      .sort((a, b) => b.score - a.score)
      .slice(0, quota);
    for (const s of bucket) {
      const subCategory = inferSubCategory(s.raw.title, s.raw.prompt, useCase);
      const id = createHash('sha1').update(s.raw.mediaUrl).digest('hex').slice(0, 12);
      items.push({
        id,
        model: s.raw.model,
        kind: s.raw.kind,
        mediaUrl: s.raw.mediaUrl,
        posterUrl: s.raw.posterUrl,
        width: s.raw.width,
        height: s.raw.height,
        aspect: s.raw.aspect,
        durationSec: s.raw.durationSec,
        prompt: s.raw.prompt,
        title: s.raw.title,
        useCase: /** @type {any} */ (useCase),
        subCategory,
        sourceRepo: s.raw.sourceRepo,
        sourceLicense: s.raw.sourceLicense,
        sourceUrl: s.raw.sourceUrl,
        featured: s.raw.hints?.includes('featured'),
      });
    }
    log.push({ kind: 'bucket-filled', useCase, kept: bucket.length, quota });
  }

  // Diversity: anti-monotony shuffle within each bucket — avoid 2 consecutive same subCategory
  return { items: diversify(items), log };
}

function inferSubCategory(title, prompt, useCase) {
  const t = `${title} ${prompt}`.toLowerCase();
  const dict = {
    visual:        ['portrait','poster','surreal','character-sheet','landscape','illustration'],
    ads:           ['product-hero','lifestyle-composite','hook-frame','benefit-shot','before-after'],
    ugc:           ['selfie','mirror-shot','pov-handheld','unboxing','candid','talking-head'],
    architecture:  ['interior','exterior','arch-viz','walkthrough','floorplan','property-dossier'],
    broll:         ['cinematic-loop','motion-graphic','transition','meme-cut','slow-mo','timelapse'],
    experimental:  ['surreal','conceptual','abstract','fora-da-caixa','genre-blend','uncanny'],
  };
  for (const sub of dict[useCase] || []) {
    if (t.includes(sub.replace('-', ' '))) return sub;
  }
  return (dict[useCase] || ['general'])[0];
}

function diversify(items) {
  const byUseCase = new Map();
  for (const it of items) {
    if (!byUseCase.has(it.useCase)) byUseCase.set(it.useCase, []);
    byUseCase.get(it.useCase).push(it);
  }
  const out = [];
  for (const [, bucket] of byUseCase) {
    let prevSub = null;
    const remaining = [...bucket];
    while (remaining.length) {
      const idx = remaining.findIndex((i) => i.subCategory !== prevSub);
      const pick = idx >= 0 ? remaining.splice(idx, 1)[0] : remaining.shift();
      out.push(pick);
      prevSub = pick.subCategory;
    }
  }
  return out;
}
