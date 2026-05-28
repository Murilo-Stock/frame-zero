'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { playerStore, usePlayerState } from '@/lib/usePlayerStore';

const HOVER_AWAY_DELAY = 3000;

/**
 * Spotify-style bottom-right mini player. Activates when a video card is
 * hovered (Card.tsx pushes into the store). On hover-end, after a 3s grace
 * period it minimizes to an icon. Click "Open full" to launch the source URL.
 * In-memory only — no localStorage.
 */
export function PersistentPlayer() {
  const { item, minimized } = usePlayerState();
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverInside = useRef(false);

  // Auto-minimize after 3s of no hover (on the source card OR the player itself).
  // The card calls playerStore.show(item) on hover; we receive that as a fresh
  // (item, !minimized) snapshot and reset the timer.
  useEffect(() => {
    if (!item || minimized) return;
    const reset = () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        if (!hoverInside.current) playerStore.minimize();
      }, HOVER_AWAY_DELAY);
    };
    reset();
    return () => {
      if (idleTimer.current) clearTimeout(idleTimer.current);
    };
  }, [item, minimized]);

  if (!item) return null;

  const openFull = () => {
    if (typeof window !== 'undefined') {
      window.open(item.mediaUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      data-print="hide"
      onMouseEnter={() => {
        hoverInside.current = true;
        if (idleTimer.current) clearTimeout(idleTimer.current);
      }}
      onMouseLeave={() => {
        hoverInside.current = false;
        if (!minimized) {
          idleTimer.current = setTimeout(
            () => playerStore.minimize(),
            HOVER_AWAY_DELAY
          );
        }
      }}
      className="fixed bottom-4 right-4 z-[9997] pointer-events-auto"
    >
      <AnimatePresence mode="wait" initial={false}>
        {minimized ? (
          <motion.button
            key="mini"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            onClick={() => playerStore.expand()}
            aria-label={`Re-expand player for ${item.title}`}
            data-cursor="amber"
            className="w-12 h-12 rounded-full bg-canvas-2 border border-amber/60 grid place-items-center shadow-xl hover:scale-105 transition-transform"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 ml-0.5 fill-amber" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </motion.button>
        ) : (
          <motion.div
            key="full"
            initial={{ y: 12, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 8, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-stretch gap-3 w-[320px] sm:w-[360px] bg-canvas-2 border border-rule rounded-md shadow-2xl overflow-hidden"
          >
            <div className="w-20 h-20 bg-canvas flex-shrink-0 overflow-hidden">
              {item.posterUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.posterUrl}
                  alt=""
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full grid place-items-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 fill-amber/70" aria-hidden>
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 py-2 pr-1 flex flex-col gap-1">
              <div className="font-mono text-[9px] uppercase tracking-caps text-amber truncate">
                {item.model} · {item.useCase}
              </div>
              <div className="font-display text-sm text-ink leading-tight line-clamp-2">
                {item.title}
              </div>
              <div className="mt-auto flex items-center gap-2">
                <button
                  onClick={openFull}
                  className="font-mono text-[10px] uppercase tracking-caps text-amber hover:text-amber-hot transition border border-amber/40 hover:border-amber px-2 py-1 rounded-sm"
                >
                  Open full ↗
                </button>
                <button
                  onClick={() => playerStore.minimize()}
                  aria-label="Minimize player"
                  className="font-mono text-[10px] uppercase tracking-caps text-ink-mute hover:text-ink border border-rule rounded-sm px-2 py-1"
                >
                  –
                </button>
              </div>
            </div>
            <button
              onClick={() => playerStore.close()}
              aria-label="Close player"
              className="self-start text-ink-mute hover:text-ink text-lg leading-none px-2 py-1"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
