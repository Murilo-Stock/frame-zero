'use client';
import { useEffect, useState } from 'react';
import { useCommandPalette } from './CommandPalette';

/**
 * Small "⌘K Search" hint button in the TopNav. Triggers the global command palette.
 * Hides in print. Shows ⌘ on macOS, Ctrl on other platforms.
 */
export function TopNavCmdK() {
  const { setOpen } = useCommandPalette();
  const [meta, setMeta] = useState('⌘');

  useEffect(() => {
    if (typeof navigator === 'undefined') return;
    const ua = navigator.userAgent;
    const isMac = /Mac|iPhone|iPod|iPad/i.test(ua);
    if (!isMac) setMeta('Ctrl');
  }, []);

  return (
    <button
      onClick={() => setOpen(true)}
      data-cursor="amber"
      data-print="hide"
      aria-label="Open command palette"
      className="hidden sm:flex items-center gap-2 h-8 px-2.5 rounded-sm border border-rule text-ink-mute hover:text-amber hover:border-amber/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber"
    >
      <span className="font-mono text-[10px] uppercase tracking-caps">Search</span>
      <kbd className="font-mono text-[10px] text-ink-mute bg-canvas border border-rule px-1.5 py-0.5 rounded-sm">
        {meta}K
      </kbd>
    </button>
  );
}
