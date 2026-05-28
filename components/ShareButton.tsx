'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { copyToClipboard } from '@/lib/copyToClipboard';

/**
 * Tiny share button for the TopNav. Copies window.location.href to clipboard
 * and shows a "Link copied" toast via the existing motion pattern.
 */
export function ShareButton() {
  const [copied, setCopied] = useState(false);
  const [hover, setHover] = useState(false);

  async function onClick() {
    if (typeof window === 'undefined') return;
    const ok = await copyToClipboard(window.location.href);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <div className="relative" data-print="hide">
      <button
        onClick={onClick}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        aria-label="Share this page"
        data-cursor="amber"
        className="grid place-items-center w-8 h-8 rounded-sm border border-rule text-ink-mute hover:text-amber hover:border-amber/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
      >
        <svg
          viewBox="0 0 24 24"
          width="14"
          height="14"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1 1" />
          <path d="M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1-1" />
        </svg>
      </button>
      <AnimatePresence>
        {hover && !copied && (
          <motion.div
            initial={{ opacity: 0, y: -2 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 pointer-events-none"
          >
            <span className="block whitespace-nowrap font-mono text-[10px] uppercase tracking-caps text-ink-mute bg-canvas-2 border border-rule px-2 py-1 rounded-sm">
              Share this page
            </span>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {copied && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 pointer-events-none"
            role="status"
            aria-live="polite"
          >
            <span className="block whitespace-nowrap font-mono text-[10px] uppercase tracking-caps text-amber bg-canvas-2 border border-amber/40 px-2 py-1 rounded-sm">
              ✓ Link copied
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
