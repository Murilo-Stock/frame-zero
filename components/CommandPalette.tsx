'use client';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { SearchItem, SearchKind } from '@/lib/build-search-index';

type CommandPaletteCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  items: SearchItem[];
};

const Ctx = createContext<CommandPaletteCtx | null>(null);

export function useCommandPalette() {
  const c = useContext(Ctx);
  if (!c) throw new Error('CommandPalette context missing');
  return c;
}

export function CommandPaletteProvider({
  items,
  children,
}: {
  items: SearchItem[];
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  // Global hotkey: Cmd+K / Ctrl+K to toggle, "/" to open+focus, Esc handled by palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
        return;
      }
      if (e.key === '/' && !open) {
        const target = e.target as HTMLElement | null;
        const tag = target?.tagName;
        const editable =
          tag === 'INPUT' ||
          tag === 'TEXTAREA' ||
          (target?.isContentEditable ?? false);
        if (editable) return;
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const value = useMemo<CommandPaletteCtx>(
    () => ({ open, setOpen, items }),
    [open, items]
  );

  return (
    <Ctx.Provider value={value}>
      {children}
      <CommandPalette />
    </Ctx.Provider>
  );
}

const KIND_ORDER: SearchKind[] = [
  'playbook',
  'model',
  'prompt',
  'repo',
  'video',
  'course',
  'tool',
  'paper',
  'agency',
  'item',
];

const KIND_LABEL: Record<SearchKind, string> = {
  playbook: 'Playbooks',
  model: 'Models',
  prompt: 'Prompts',
  repo: 'Repos',
  video: 'Videos',
  course: 'Courses',
  tool: 'Tools',
  paper: 'Papers',
  agency: 'Agencies',
  item: 'Frames',
};

const KIND_ICON: Record<SearchKind, string> = {
  playbook: '◆',
  model: '◉',
  prompt: '⌘',
  repo: '⌥',
  video: '▶',
  course: '✦',
  tool: '⚙',
  paper: '📄',
  agency: '◍',
  item: '▣',
};

function scoreItem(item: SearchItem, q: string): number {
  if (!q) return 0;
  const ql = q.toLowerCase();
  const title = item.title.toLowerCase();
  const sub = (item.subtitle ?? '').toLowerCase();
  const kws = item.keywords.join(' ').toLowerCase();

  let score = 0;
  if (title === ql) score += 1000;
  if (title.startsWith(ql)) score += 500;
  const ti = title.indexOf(ql);
  if (ti >= 0) score += 200 - Math.min(ti, 100);
  const si = sub.indexOf(ql);
  if (si >= 0) score += 80 - Math.min(si, 40);
  const ki = kws.indexOf(ql);
  if (ki >= 0) score += 40;

  // Multi-word substring (each term must match)
  if (score === 0) {
    const terms = ql.split(/\s+/).filter(Boolean);
    if (terms.length > 1) {
      const hay = `${title} ${sub} ${kws}`;
      const allMatch = terms.every((t) => hay.includes(t));
      if (allMatch) score = 30;
    }
  }
  return score;
}

function CommandPalette() {
  const { open, setOpen, items } = useCommandPalette();
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (open) {
      setQ('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) {
      // Default: featured set (all playbooks + all models)
      return items
        .filter((i) => i.kind === 'playbook' || i.kind === 'model')
        .slice(0, 30);
    }
    const scored: Array<SearchItem & { _s: number }> = [];
    for (const it of items) {
      const s = scoreItem(it, q.trim());
      if (s > 0) scored.push({ ...it, _s: s });
    }
    scored.sort((a, b) => b._s - a._s);
    return scored.slice(0, 30);
  }, [q, items]);

  // Group results by kind in canonical order
  const grouped = useMemo(() => {
    const map = new Map<SearchKind, SearchItem[]>();
    for (const r of results) {
      if (!map.has(r.kind)) map.set(r.kind, []);
      map.get(r.kind)!.push(r);
    }
    return KIND_ORDER.filter((k) => map.has(k)).map((k) => ({
      kind: k,
      label: KIND_LABEL[k],
      items: map.get(k)!,
    }));
  }, [results]);

  // Flat list (for cursor navigation matching visual order)
  const flat = useMemo(() => grouped.flatMap((g) => g.items), [grouped]);

  useEffect(() => {
    if (cursor >= flat.length) setCursor(Math.max(0, flat.length - 1));
  }, [flat.length, cursor]);

  const activate = useCallback(
    (it: SearchItem, newTab: boolean) => {
      setOpen(false);
      if (it.external) {
        window.open(it.href, '_blank', 'noopener,noreferrer');
        return;
      }
      if (newTab) {
        window.open(it.href, '_blank', 'noopener,noreferrer');
        return;
      }
      router.push(it.href as never);
    },
    [router, setOpen]
  );

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setOpen(false);
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(flat.length - 1, c + 1));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
      return;
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      const hit = flat[cursor];
      if (hit) activate(hit, e.metaKey || e.ctrlKey);
    }
  };

  // Scroll active row into view
  useEffect(() => {
    if (!listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-cmdk-row="${cursor}"]`
    );
    if (el) el.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[10001] bg-canvas/70 backdrop-blur-md flex items-start justify-center pt-[18vh] px-4"
          onClick={() => setOpen(false)}
          data-print="hide"
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
        >
          <motion.div
            initial={{ y: -8, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -8, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl bg-canvas-2 border border-rule rounded-md shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 px-4 py-3 border-b border-rule">
              <span className="font-mono text-xs text-amber" aria-hidden>⌘K</span>
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setCursor(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Search playbooks, models, prompts, resources…"
                aria-label="Search"
                className="flex-1 bg-transparent outline-none font-sans text-base text-ink placeholder:text-ink-mute"
              />
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="font-mono text-xs text-ink-mute hover:text-ink border border-rule rounded px-2 py-0.5"
              >
                esc
              </button>
            </div>

            <div
              ref={listRef}
              className="max-h-[55vh] overflow-y-auto py-2"
            >
              {grouped.length === 0 && (
                <div className="px-4 py-12 text-center font-mono text-xs text-ink-mute uppercase tracking-caps">
                  No matches
                </div>
              )}
              {grouped.map((group) => {
                let baseIdx = 0;
                for (const g of grouped) {
                  if (g.kind === group.kind) break;
                  baseIdx += g.items.length;
                }
                return (
                  <div key={group.kind} className="mb-2">
                    <div className="px-4 py-1.5 font-mono text-[10px] uppercase tracking-caps text-ink-mute">
                      {group.label}
                    </div>
                    <ul>
                      {group.items.map((it, i) => {
                        const flatIdx = baseIdx + i;
                        const active = flatIdx === cursor;
                        return (
                          <li key={it.id}>
                            <button
                              data-cmdk-row={flatIdx}
                              onMouseMove={() => setCursor(flatIdx)}
                              onClick={(e) =>
                                activate(it, e.metaKey || e.ctrlKey)
                              }
                              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                                active
                                  ? 'bg-amber/15 text-ink'
                                  : 'text-ink-mute hover:bg-canvas/40'
                              }`}
                            >
                              <span
                                className={`font-mono text-xs w-5 ${
                                  active ? 'text-amber' : 'text-ink-mute'
                                }`}
                                aria-hidden
                              >
                                {KIND_ICON[it.kind]}
                              </span>
                              <span className="flex-1 min-w-0">
                                <span className="block font-sans text-sm text-ink truncate">
                                  {it.title}
                                </span>
                                {it.subtitle && (
                                  <span className="block font-mono text-[10px] uppercase tracking-caps text-ink-mute truncate">
                                    {it.subtitle}
                                  </span>
                                )}
                              </span>
                              <span
                                className={`font-mono text-xs ${
                                  active ? 'text-amber' : 'text-ink-mute/60'
                                }`}
                                aria-hidden
                              >
                                {it.external ? '↗' : '→'}
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-4 px-4 py-2 border-t border-rule font-mono text-[10px] uppercase tracking-caps text-ink-mute">
              <span>↑↓ navigate</span>
              <span>↵ open</span>
              <span>⌘↵ new tab</span>
              <span className="ml-auto">esc close</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
