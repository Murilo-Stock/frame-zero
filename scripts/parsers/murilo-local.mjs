// @ts-check

/**
 * Parses Murilo's local prompt JSON (vault/research/2026-05-18-gpt-image-2-skill/02-prompts.json)
 * OR the simplified test fixture shape { items: [{id, title, prompt, category, aspect}] }.
 *
 * @param {{items: Array<{id:string, title:string, prompt:string, category:string, aspect:string}>}} json
 * @returns {Array<import('../../lib/types').RawItem>}
 */
export function parseMuriloLocal(json) {
  const items = json.items || [];
  return items.map((raw) => {
    const [w, h] = raw.aspect.split(':').map(Number);
    const hints = [];
    if (raw.category === 'architecture') hints.push('architecture');
    if (raw.category === 'fora-da-caixa') hints.push('experimental');
    return {
      title: raw.title,
      prompt: raw.prompt,
      mediaUrl: `/murilo/${raw.id}.png`,
      kind: 'image',
      model: 'murilo',
      width: w * 100,
      height: h * 100,
      aspect: raw.aspect,
      sourceRepo: 'Murilo-Stock/murilo-os',
      sourceLicense: 'Murilo Stock · all rights reserved · educational showcase',
      sourceUrl: 'https://github.com/Murilo-Stock/murilo-os/tree/main/vault/research/2026-05-18-gpt-image-2-skill',
      hints,
    };
  });
}
