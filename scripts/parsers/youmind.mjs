// @ts-check

/**
 * Parses a YouMind-OpenLab awesome-* README into RawItem records.
 * Schema: H3 = item title; first ![preview](url) = media; fenced prompt block; **Aspect:** XXX
 *
 * @param {string} markdown
 * @param {{model:'gpt-image-2'|'nano-banana-pro'|'seedance-2', sourceRepo:string, sourceLicense:string}} ctx
 * @returns {Array<import('../../lib/types').RawItem>}
 */
export function parseYouMind(markdown, ctx) {
  const items = [];
  // Split on H3 headings
  const blocks = markdown.split(/^###\s+/m).slice(1);
  for (const block of blocks) {
    const titleMatch = block.match(/^\d*\.?\s*(.+?)\n/);
    const mediaMatch = block.match(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/);
    const promptMatch = block.match(/\*\*Prompt:\*\*\s*\n```[a-z]*\n([\s\S]*?)\n```/i);
    const aspectMatch = block.match(/\*\*Aspect:\*\*\s*([0-9:]+)/i);
    const sourceMatch = block.match(/\*\*Source:\*\*\s*\[[^\]]+\]\(([^)]+)\)/i);

    if (!titleMatch || !mediaMatch || !promptMatch) continue;

    const mediaUrl = mediaMatch[1];
    const isVideo = /\.(mp4|webm|mov)(\?|$)/i.test(mediaUrl);
    const aspect = aspectMatch ? aspectMatch[1] : '1:1';
    const [w, h] = aspect.split(':').map(Number);

    items.push({
      title: titleMatch[1].trim(),
      prompt: promptMatch[1].trim(),
      mediaUrl,
      kind: isVideo ? 'video' : 'image',
      model: ctx.model,
      width: w * 100,
      height: h * 100,
      aspect,
      sourceRepo: ctx.sourceRepo,
      sourceLicense: ctx.sourceLicense,
      sourceUrl: sourceMatch ? sourceMatch[1] : `https://github.com/${ctx.sourceRepo}`,
      hints: [],
    });
  }
  return items;
}
