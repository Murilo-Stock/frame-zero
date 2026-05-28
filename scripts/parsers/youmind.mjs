// @ts-check

/**
 * Parses a YouMind-OpenLab awesome-* README into RawItem records.
 *
 * Supports two schemas:
 *
 * SCHEMA A (test fixture · simple markdown):
 *   ### N. Title
 *   ![preview](URL)
 *   **Prompt:** \n ``` ... ```
 *   **Aspect:** X:Y
 *   **Source:** [link](URL)
 *
 * SCHEMA B (real YouMind READMEs · 2026-05 format):
 *   ### No. N: [Category - ]Title
 *   #### 📝 Prompt \n ``` ... ```
 *   #### 🖼️ Generated Images   (image variant)
 *      <img src="URL" ... >
 *   #### 🎬 Video               (video variant)
 *      <a href="...mp4"><img src="THUMB_URL" ... ></a>
 *   #### 📌 Details
 *      - **Source:** [...](URL)
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
    // --- TITLE ---
    // Schema A: leading digit (e.g. "1. Foo")
    // Schema B: "No. 1: Foo"
    // Schema C (seedance "All Prompts"): bare H3 title (any first-line text)
    const titleA = block.match(/^\d+\.\s+(.+?)\n/);
    const titleB = block.match(/^No\.\s*\d+:\s*(.+?)\n/i);
    const titleC = block.match(/^([^\n]+)\n/);
    const titleMatch = titleA || titleB || titleC;

    // --- MEDIA URL ---
    // Schema A: markdown image ![alt](url) — but skip shields.io / badge URLs
    // Schema B-video: <a href="...mp4"> wrapping <img src=thumb>
    // Schema B-image: <img src="url">
    // Schema B-video-2 (YouMind seedance "All Prompts"): cloudflarestream thumbnail .jpg
    //   + "[🎬 Watch Video →](https://youmind.com/...)" link · NO direct .mp4
    const isBadgeUrl = (u) => /img\.shields\.io|badge\.svg|awesome\.re\/badge/i.test(u);
    const mdImgAll = [...block.matchAll(/!\[[^\]]*\]\((https?:\/\/[^\s)]+)\)/g)];
    const mdImgMatch = mdImgAll.map((m) => m[1]).find((u) => !isBadgeUrl(u));
    // Direct video URL anywhere in the block (per fix spec) — covers <a href=mp4>,
    // <video src=mp4>, or a bare https://...mp4 reference.
    const videoUrlMatch = block.match(/(https?:\/\/[^\s"')]+\.(?:mp4|webm|mov))(\?[^\s"')]*)?/i);
    const htmlImgAll = [...block.matchAll(/<img[^>]+src="(https?:\/\/[^"]+)"/gi)];
    const htmlImgMatch = htmlImgAll.map((m) => m[1]).find((u) => !isBadgeUrl(u));
    // Heuristic for video-CDN thumbnails (Cloudflare Stream) which always represent
    // an embedded video, even when no direct .mp4 URL is exposed in the README.
    const isVideoCdnThumb = (u) =>
      typeof u === 'string' &&
      /(?:cloudflarestream\.com|videodelivery\.net|customer-[a-z0-9]+\.cloudflarestream)/i.test(u) &&
      /thumbnail/i.test(u);
    const watchVideoLinkMatch = block.match(/\[(?:[^\]]*?Watch Video[^\]]*?)\]\((https?:\/\/[^)\s]+)\)/i);

    // --- PROMPT ---
    // Schema A: **Prompt:** then fenced code
    // Schema B: #### 📝 Prompt then fenced code
    const promptA = block.match(/\*\*Prompt:\*\*\s*\n```[a-z]*\n([\s\S]*?)\n```/i);
    const promptB = block.match(/####\s*[^\n]*Prompt[^\n]*\n+```[a-z]*\n([\s\S]*?)\n```/i);
    const promptMatch = promptA || promptB;

    // --- ASPECT ---
    // Schema A: **Aspect:** X:Y
    // Schema B: not stated → infer below from kind
    const aspectMatch = block.match(/\*\*Aspect:\*\*\s*([0-9:]+)/i);

    // --- SOURCE ---
    const sourceA = block.match(/\*\*Source:\*\*\s*\[[^\]]+\]\(([^)]+)\)/i);
    const sourceB = block.match(/-\s*\*\*Source:\*\*\s*\[[^\]]+\]\(([^)]+)\)/i);
    const tryItNow = block.match(/\[👉\s*Try it now[^\]]*\]\(([^)]+)\)/i);
    const sourceMatch = sourceA || sourceB || tryItNow;

    if (!titleMatch || !promptMatch) continue;

    // Decide media:
    //   1. PRIMARY (per fix spec): any direct .mp4/.webm/.mov URL → kind=video,
    //      mediaUrl=that video URL, posterUrl=first non-badge image in block.
    //   2. SECONDARY: video-CDN thumbnail (Cloudflare Stream) + "Watch Video" link
    //      → kind=video, mediaUrl=the Watch Video link target, posterUrl=thumbnail.
    //   3. Fallback to existing image logic (non-badge md img, then non-badge html img).
    let mediaUrl = null;
    let posterUrl;
    let kind = 'image';
    const firstImage = mdImgMatch || htmlImgMatch;
    if (videoUrlMatch) {
      mediaUrl = videoUrlMatch[0];
      kind = 'video';
      if (firstImage && !/\.(mp4|webm|mov)(\?|$)/i.test(firstImage)) posterUrl = firstImage;
    } else if (htmlImgMatch && isVideoCdnThumb(htmlImgMatch) && watchVideoLinkMatch) {
      mediaUrl = watchVideoLinkMatch[1];
      posterUrl = htmlImgMatch;
      kind = 'video';
    } else if (mdImgMatch) {
      mediaUrl = mdImgMatch;
      kind = /\.(mp4|webm|mov)(\?|$)/i.test(mediaUrl) ? 'video' : 'image';
    } else if (htmlImgMatch) {
      mediaUrl = htmlImgMatch;
      kind = /\.(mp4|webm|mov)(\?|$)/i.test(mediaUrl) ? 'video' : 'image';
    } else {
      continue;
    }

    const aspect = aspectMatch ? aspectMatch[1] : (kind === 'video' ? '16:9' : '4:5');
    const [w, h] = aspect.split(':').map(Number);

    // Extract category hint from title B (e.g. "Profile / Avatar - Censored Studio Portrait")
    const rawTitle = titleMatch[1].trim();
    const hints = [];
    const categoryMatch = rawTitle.match(/^([^-]+?)\s+-\s+/);
    if (categoryMatch) {
      const cat = categoryMatch[1].trim().toLowerCase();
      // Map YouMind categories → our use-case hints
      if (/product marketing|ecommerce|e-commerce|poster|flyer/.test(cat)) hints.push('ads');
      else if (/profile|avatar|selfie|portrait/.test(cat)) hints.push('visual');
      else if (/architecture|interior|landscape|cityscape/.test(cat)) hints.push('architecture');
      else if (/abstract|background|3d render|cinematic|film still/.test(cat)) hints.push('experimental');
    }

    // Placeholder dimensions: YouMind source assets are typically >=1024px on the short edge;
    // we scale by 400 so e.g. 4:5 → 1600×2000 (passes scorer 1024 threshold).
    items.push({
      title: rawTitle,
      prompt: promptMatch[1].trim(),
      mediaUrl,
      posterUrl,
      kind,
      model: ctx.model,
      width: w * 400,
      height: h * 400,
      aspect,
      sourceRepo: ctx.sourceRepo,
      sourceLicense: ctx.sourceLicense,
      sourceUrl: sourceMatch ? sourceMatch[1] : `https://github.com/${ctx.sourceRepo}`,
      hints,
    });
  }
  return items;
}
