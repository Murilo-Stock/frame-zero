'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Item } from '@/lib/types';
import { copyToClipboard } from '@/lib/copyToClipboard';
import { ScriptCard } from './ScriptCard';

export function Lightbox({ item, onClose }: { item: Item | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const titleId = item ? `lightbox-title-${item.id}` : 'lightbox-title';

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const isMurilo = item?.model === 'murilo';

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className="fixed inset-0 z-50 bg-canvas/90 backdrop-blur-md flex items-center justify-center p-4 md:p-12"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="relative max-w-7xl w-full grid grid-cols-1 md:grid-cols-[3fr_2fr] gap-6 bg-canvas-2 border border-rule rounded-sm overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-canvas flex items-center justify-center max-h-[80vh] overflow-hidden">
              {isMurilo ? (
                <div className="w-full h-full max-h-[80vh] overflow-auto">
                  <ScriptCard item={item} />
                </div>
              ) : item.kind === 'video' ? (
                <video
                  src={item.mediaUrl}
                  aria-label={item.title}
                  autoPlay controls loop playsInline
                  width={item.width}
                  height={item.height}
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.title}
                  width={item.width}
                  height={item.height}
                  className="w-full h-full object-contain max-h-[80vh]"
                />
              )}
            </div>
            <div className="p-8 flex flex-col gap-4 overflow-y-auto max-h-[80vh]">
              <div className="font-mono text-[10px] uppercase tracking-caps text-amber">
                {item.useCase} · {item.subCategory} · {item.model}
              </div>
              <h2 id={titleId} className="font-display text-3xl text-ink leading-tight">{item.title}</h2>
              <pre className="font-mono text-sm text-ink whitespace-pre-wrap bg-canvas/50 border border-rule rounded p-4">
                {item.prompt}
              </pre>
              <div className="flex items-center gap-3">
                <button
                  onClick={async () => { if (await copyToClipboard(item.prompt)) { setCopied(true); setTimeout(() => setCopied(false), 1500); } }}
                  className="px-4 py-2 bg-amber text-canvas font-mono text-xs uppercase tracking-caps rounded hover:bg-amber-hot transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  {copied ? 'Copied' : 'Copy prompt'}
                </button>
                <a
                  href={item.sourceUrl} target="_blank" rel="noopener"
                  className="px-4 py-2 border border-rule text-ink-mute font-mono text-xs uppercase tracking-caps rounded hover:text-ink hover:border-ink-mute transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas"
                >
                  Source
                </a>
                <button
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="ml-auto text-ink-mute hover:text-ink text-2xl leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-canvas rounded"
                >
                  ×
                </button>
              </div>
              <div className="text-xs text-ink-mute font-mono mt-auto pt-4 border-t border-rule">
                <div>{item.sourceRepo}</div>
                <div className="opacity-60">{item.sourceLicense}</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
