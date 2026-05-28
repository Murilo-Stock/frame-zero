// @ts-check

/**
 * Maps free-form prompt+title text to a UseCase via ordered keyword rules.
 * First match wins. Explicit hints override.
 *
 * @param {string} text
 * @param {string[]} hints
 * @returns {import('../lib/types').UseCase}
 */
export function classify(text, hints = []) {
  // Explicit hint shortcut
  for (const h of hints) {
    if (['visual','ads','ugc','architecture','broll','experimental'].includes(h)) {
      return /** @type {any} */ (h);
    }
  }
  const t = text.toLowerCase();
  const rules = [
    { useCase: 'ads',           keywords: ['product hero', 'ad campaign', 'ad creative', 'marketing', ' ad ', 'campaign', 'commercial', 'cosmetic ad', 'brand ad'] },
    { useCase: 'ugc',           keywords: ['selfie', 'pov', '9:16', 'vertical', 'candid', 'mirror shot', 'unboxing', 'talking head'] },
    { useCase: 'architecture',  keywords: ['interior', 'exterior', 'architecture', 'architectural', 'living room', 'kitchen', 'bedroom', 'house', 'apartment', 'arch viz', 'real estate', 'walkthrough'] },
    { useCase: 'broll',         keywords: ['b-roll', 'broll', 'looping', 'loop', 'transition', 'motion graphic', 'slow-mo', 'timelapse', 'cinematic loop'] },
    { useCase: 'experimental',  keywords: ['surreal', 'conceptual', 'abstract', 'dreamscape', 'uncanny', 'fora-da-caixa', 'genre-blend'] },
  ];
  for (const rule of rules) {
    if (rule.keywords.some((k) => t.includes(k))) {
      return /** @type {any} */ (rule.useCase);
    }
  }
  return 'visual';
}
