'use client';
import { useEffect, useState } from 'react';

const SEQUENCE = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
] as const;

/**
 * Listens for the Konami code → toggles `data-theme="director"` on <body>.
 * CSS variable swap (see globals.css `[data-theme="director"]`) repaints the
 * amber palette into the director's-cut red. Persists via localStorage.
 */
export function KonamiListener() {
  const [toast, setToast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Restore persisted theme on mount.
    try {
      const saved = localStorage.getItem('frame-zero-theme');
      if (saved === 'director' || saved === 'noir') {
        document.body.dataset.theme = saved;
      }
    } catch {
      /* silent */
    }

    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const tgt = e.target;
      if (tgt instanceof HTMLElement) {
        const tag = tgt.tagName;
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tgt.isContentEditable) return;
      }
      const expected = SEQUENCE[i];
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === expected) {
        i += 1;
        if (i === SEQUENCE.length) {
          i = 0;
          unlock();
        }
      } else {
        // Allow re-armed match if the wrong key happens to be the start.
        i = key === SEQUENCE[0] ? 1 : 0;
      }
    };

    const unlock = () => {
      document.body.dataset.theme = 'director';
      try {
        localStorage.setItem('frame-zero-theme', 'director');
      } catch {
        /* silent */
      }
      setToast(true);
      setTimeout(() => setToast(false), 2000);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!toast) return null;
  return (
    <div
      aria-live="polite"
      data-print="hide"
      style={{
        position: 'fixed',
        left: '50%',
        bottom: 80,
        transform: 'translateX(-50%)',
        background: 'rgba(10,10,10,0.85)',
        border: '1px solid #e63946',
        color: '#e63946',
        padding: '10px 20px',
        fontFamily: 'var(--font-mono, ui-monospace, monospace)',
        fontSize: '0.75rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        borderRadius: 4,
        zIndex: 9100,
        animation: 'frameZeroToast 2000ms ease forwards',
      }}
    >
      Director&apos;s Cut Unlocked
      <style>{`
        @keyframes frameZeroToast {
          0% { opacity: 0; transform: translate(-50%, 6px); }
          15% { opacity: 1; transform: translate(-50%, 0); }
          85% { opacity: 1; transform: translate(-50%, 0); }
          100% { opacity: 0; transform: translate(-50%, -4px); }
        }
      `}</style>
    </div>
  );
}
