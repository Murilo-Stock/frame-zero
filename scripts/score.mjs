// @ts-check

const ASPECT_BONUS = {
  ugc: ['9:16', '4:5'],
  ads: ['1:1', '4:5'],
  broll: ['16:9', '21:9', '9:16'],
  architecture: ['16:9', '21:9', '4:5'],
  visual: ['4:5', '1:1', '16:9'],
  experimental: ['1:1', '21:9'],
};

/**
 * @param {import('../lib/types').RawItem} item
 * @param {import('../lib/types').UseCase} useCase
 * @returns {{keep:boolean, score:number, reason?:string}}
 */
export function scoreItem(item, useCase) {
  const words = item.prompt.trim().split(/\s+/);
  if (words.length < 20) return { keep: false, score: 0, reason: 'prompt-too-short' };
  if (words.length > 600) return { keep: false, score: 0, reason: 'prompt-too-long' };
  if (!item.title || /^(untitled|test|image[-_]?\d+)$/i.test(item.title)) {
    return { keep: false, score: 0, reason: 'generic-title' };
  }
  const shortEdge = Math.min(item.width, item.height);
  if (item.kind === 'image' && shortEdge < 1024) {
    return { keep: false, score: 0, reason: 'image-too-small' };
  }
  if (item.kind === 'video' && (item.durationSec ?? 6) < 4) {
    return { keep: false, score: 0, reason: 'video-too-short' };
  }
  let score = 0;
  score += Math.min(20, words.length / 4);                                 // length sweet spot
  if (ASPECT_BONUS[useCase]?.includes(item.aspect)) score += 5;            // aspect match
  if (item.hints?.includes('featured')) score += 10;                       // featured bonus
  if (item.mediaUrl.includes('/featured/')) score += 5;                    // url hint
  return { keep: true, score };
}
