// @ts-check

/**
 * Parses Murilo's local prompt source.
 *
 * Accepts EITHER:
 *  - The test-fixture shape `{ items: [{id, title, prompt, category, aspect:"X:Y"}] }`
 *  - The real vault shape: ARRAY of `{id, no, title, category, aspect:"landscape|portrait|square", size:"WxH", raw_text, target_model}`
 *
 * @param {any} json
 * @returns {Array<import('../../lib/types').RawItem>}
 */
export function parseMuriloLocal(json) {
  const items = Array.isArray(json) ? json : (json.items || []);
  return items.map((raw) => {
    // --- Aspect resolution ---
    let aspect = raw.aspect || '1:1';
    if (!/^\d+:\d+$/.test(aspect)) {
      // Word form → ratio
      const word = String(aspect).toLowerCase();
      if (word.includes('landscape')) aspect = '16:9';
      else if (word.includes('portrait')) aspect = '4:5';
      else if (word.includes('square')) aspect = '1:1';
      else aspect = '1:1';
    }
    const [w, h] = aspect.split(':').map(Number);

    // --- Dimensions ---
    // Prefer raw.size "WxH" when present; else placeholder.
    let width = w * 400;
    let height = h * 400;
    if (typeof raw.size === 'string' && /^\d+x\d+$/i.test(raw.size)) {
      const [pw, ph] = raw.size.toLowerCase().split('x').map(Number);
      width = pw; height = ph;
    }

    // --- Prompt body ---
    const prompt = raw.prompt || raw.raw_text || '';

    // --- Category → hints ---
    const cat = String(raw.category || '').toLowerCase();
    const hints = [];
    if (/architecture|interior|exterior/.test(cat)) hints.push('architecture');
    else if (/fora-da-caixa|experimental|surreal|conceptual|anime|manga|gaming|retro|cyberpunk|pixel|isometric|fine-art|more-illustration|character-design|tattoo|fantasy/.test(cat)) hints.push('experimental');
    else if (/ads|product-and-food|brand-systems|marketing|commerce/.test(cat)) hints.push('ads');
    else if (/ugc|selfie|pov|vertical/.test(cat)) hints.push('ugc');
    else if (/cinematic|loop|broll|b-roll|motion|animation|film-references/.test(cat)) hints.push('broll');

    return {
      title: raw.title,
      prompt,
      mediaUrl: `/murilo/${raw.id}.png`,
      kind: 'image',
      model: 'murilo',
      width,
      height,
      aspect,
      sourceRepo: 'Murilo-Stock/murilo-os',
      sourceLicense: 'Murilo Stock · all rights reserved · educational showcase',
      sourceUrl: 'https://github.com/Murilo-Stock/murilo-os/tree/main/vault/research/2026-05-18-gpt-image-2-skill',
      hints,
    };
  });
}
