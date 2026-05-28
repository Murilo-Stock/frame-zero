import type { Item } from '@/lib/types';
import { Card } from './Card';

export function Masonry({ items, onOpen }: { items: Item[]; onOpen: (i: Item) => void }) {
  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 px-6 max-w-7xl mx-auto">
      {items.map((it) => (
        <div key={it.id} className="break-inside-avoid">
          <Card item={it} onOpen={() => onOpen(it)} />
        </div>
      ))}
    </div>
  );
}
