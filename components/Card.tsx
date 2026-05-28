'use client';
import type { Item } from '@/lib/types';
import { useState } from 'react';
import { ScriptCard } from './ScriptCard';

export function Card({ item, onOpen }: { item: Item; onOpen: () => void }) {
  const [hover, setHover] = useState(false);
  const ratio = `${item.width} / ${item.height}`;
  const isMurilo = item.model === 'murilo';
  const isDirectVideo = /\.(mp4|webm|mov)(\?|$)/i.test(item.mediaUrl);
  const isExternalVideo = item.kind === 'video' && !isDirectVideo;

  const handleClick = (e: React.MouseEvent) => {
    if (isExternalVideo) {
      e.preventDefault();
      window.open(item.mediaUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    onOpen();
  };

  return (
    <button
      onClick={handleClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      data-cursor="amber"
      aria-label={isExternalVideo ? `${item.title} · Video preview · opens in new tab` : `Open ${item.title}`}
      className="group block w-full mb-4 relative overflow-hidden bg-canvas-2 border border-rule hover:border-amber transition rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
      style={{ aspectRatio: ratio }}
    >
      {isMurilo ? (
        <ScriptCard item={item} compact />
      ) : item.kind === 'video' && isDirectVideo ? (
        <video
          src={item.mediaUrl}
          poster={item.posterUrl}
          aria-label={item.title}
          autoPlay={hover}
          muted loop playsInline preload="metadata"
          width={item.width}
          height={item.height}
          className="w-full h-full object-cover"
        />
      ) : item.kind === 'video' && !isDirectVideo ? (
        <>
          {item.posterUrl ? (
            <img
              src={item.posterUrl}
              alt={item.title}
              loading="lazy"
              width={item.width}
              height={item.height}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-canvas-2 flex items-center justify-center">
              <span className="font-mono text-xs text-ink-mute uppercase tracking-caps">video</span>
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-canvas/70 backdrop-blur-sm border border-amber/60 flex items-center justify-center group-hover:bg-amber group-hover:scale-110 transition-all">
              <svg viewBox="0 0 24 24" className="w-6 h-6 ml-1 fill-amber group-hover:fill-canvas transition-colors" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          <div className="absolute top-2 right-2 font-mono text-[10px] uppercase tracking-caps text-amber bg-canvas/80 border border-amber/40 px-2 py-1 rounded-sm opacity-0 group-hover:opacity-100 transition-opacity">
            Watch ↗
          </div>
        </>
      ) : (
        <img
          src={item.mediaUrl}
          alt={item.title}
          loading="lazy"
          width={item.width}
          height={item.height}
          className="w-full h-full object-cover"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-canvas/95 via-canvas/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-x-0 bottom-0 p-4 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="font-mono text-[10px] uppercase tracking-caps text-amber mb-1">{item.useCase} · {item.model}</div>
        <div className="font-display text-lg text-ink line-clamp-2">{item.title}</div>
      </div>
    </button>
  );
}
