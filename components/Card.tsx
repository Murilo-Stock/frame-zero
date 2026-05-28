'use client';
import type { Item } from '@/lib/types';
import { useState } from 'react';
import { ScriptCard } from './ScriptCard';

export function Card({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const ratio = `${item.width} / ${item.height}`;
  const isMurilo = item.model === 'murilo';

  return (
    <button
      onClick={onOpen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group block w-full mb-4 relative overflow-hidden bg-canvas-2 border border-rule hover:border-amber transition rounded-sm text-left"
      style={{ aspectRatio: ratio }}
    >
      {isMurilo ? (
        <ScriptCard item={item} compact />
      ) : item.kind === 'video' ? (
        <video
          src={item.mediaUrl}
          poster={item.posterUrl}
          autoPlay={hover}
          muted loop playsInline preload="metadata"
          className="w-full h-full object-cover"
        />
      ) : (
        <img src={item.mediaUrl} alt={item.title} loading="lazy" className="w-full h-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-canvas/95 via-canvas/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="font-mono text-[10px] uppercase tracking-caps text-amber mb-1">{item.useCase} · {item.model}</div>
        <div className="font-display text-lg text-ink line-clamp-2">{item.title}</div>
      </div>
    </button>
  );
}
