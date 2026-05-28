import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Item } from '@/lib/types';
import { Hero } from '@/components/Hero';
import { ManifestoStrip } from '@/components/ManifestoStrip';
import { Gallery } from '@/components/Gallery';
import { BehindLens } from '@/components/BehindLens';
import { Credits } from '@/components/Credits';

export default function Page() {
  const itemsPath = resolve(process.cwd(), 'public/data/items.json');
  const items: Item[] = JSON.parse(readFileSync(itemsPath, 'utf-8'));
  const featured = items.filter((i) => i.kind === 'video').slice(0, 5);
  const muriloItems = items.filter((i) => i.model === 'murilo');
  return (
    <main>
      <Hero featured={featured} />
      <ManifestoStrip />
      <Gallery items={items} />
      <BehindLens items={muriloItems} />
      <Credits />
    </main>
  );
}
