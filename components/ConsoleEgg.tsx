'use client';
import { useEffect } from 'react';

/**
 * Prints an ASCII art card to the DevTools console + installs the discoverable
 * `window.frameZero` API. The API is intentionally tiny and additive — no side
 * effects on first load beyond a single console.log + property attachment.
 */
export function ConsoleEgg() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.frameZero) return; // idempotent across HMR / nav

    const art = `
  ╔══════════════════════════════════════════╗
  ║                                          ║
  ║    F R A M E    Z E R O                  ║
  ║    Curated AI cinema · 2026              ║
  ║    by Murilo Stock                       ║
  ║                                          ║
  ║    Type frameZero.help() to begin.       ║
  ║                                          ║
  ╚══════════════════════════════════════════╝
    `;
    console.log(
      '%c' + art,
      'color: #d4a574; font-family: monospace; line-height: 1.2',
    );

    window.frameZero = {
      help: () =>
        console.log(
          'Commands: frameZero.stats() · frameZero.konami() · frameZero.about() · frameZero.theme("director"|"noir")',
        ),
      stats: () =>
        console.table({
          items: 282,
          playbooks: 11,
          resources: 283,
          models: 4,
          commits: '60+',
        }),
      konami: () => console.log('Hint: ↑ ↑ ↓ ↓ ← → ← → B A'),
      about: () =>
        console.log(
          'Built solo by Murilo Stock · Fábrica de Vídeo · 2026 · https://github.com/Murilo-Stock/frame-zero',
        ),
      theme: (t: 'director' | 'noir') => {
        const next = t === 'director' ? 'director' : 'noir';
        document.body.dataset.theme = next;
        try {
          localStorage.setItem('frame-zero-theme', next);
        } catch {
          /* storage may be unavailable (privacy mode) — silent */
        }
      },
    };
  }, []);
  return null;
}
