import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Item, ResourcesIndex } from '@/lib/types';
import { Hero } from '@/components/Hero';
import { ManifestoStrip } from '@/components/ManifestoStrip';
import { ModelHub } from '@/components/ModelHub';
import { Gallery } from '@/components/Gallery';
import { BehindLens } from '@/components/BehindLens';
import { Credits } from '@/components/Credits';
import { TopNav } from '@/components/TopNav';

function curateMurilo(items: Item[]): Item[] {
  const murilo = items.filter((i) => i.model === 'murilo');
  const byTitle = (a: Item, b: Item) => a.title.localeCompare(b.title);
  const architecture = murilo.filter((i) => i.useCase === 'architecture').sort(byTitle).slice(0, 4);
  const experimental = murilo.filter((i) => i.useCase === 'experimental').sort(byTitle).slice(0, 6);
  const picked = new Set<string>([...architecture, ...experimental].map((i) => i.id));
  const curated: Item[] = [...architecture, ...experimental];
  if (curated.length < 10) {
    // Pad from remaining Murilo items in original (curation-scored) order.
    for (const it of murilo) {
      if (curated.length >= 10) break;
      if (!picked.has(it.id)) {
        curated.push(it);
        picked.add(it.id);
      }
    }
  }
  return curated.slice(0, 10);
}

export default function Page() {
  const itemsPath = resolve(process.cwd(), 'public/data/items.json');
  const resourcesPath = resolve(process.cwd(), 'public/data/resources.json');
  const items: Item[] = JSON.parse(readFileSync(itemsPath, 'utf-8'));
  const resources: ResourcesIndex = JSON.parse(readFileSync(resourcesPath, 'utf-8'));
  // Hero background needs a directly-playable video file (.mp4/.webm/.mov) — watch-page URLs would fail silently.
  const featured = items
    .filter((i) => i.kind === 'video' && /\.(mp4|webm|mov)(\?|$)/i.test(i.mediaUrl))
    .slice(0, 5);
  const muriloItems = curateMurilo(items);
  return (
    <main>
      <TopNav />
      <Hero featured={featured} total={items.length} />
      <ManifestoStrip total={items.length} />
      <div id="models">
        <ModelHub resources={resources.models} items={items} />
      </div>
      <div id="gallery">
        <Gallery items={items} />
      </div>
      <BehindLens items={muriloItems} />
      <Credits />
    </main>
  );
}
