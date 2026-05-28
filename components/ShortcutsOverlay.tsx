'use client';
import { useEffect, useState } from 'react';
import { useKeyboardNav } from '@/lib/useKeyboardNav';

const SHORTCUTS: Array<{ keys: string; label: string }> = [
  { keys: 'Cmd/Ctrl + K', label: 'Command palette' },
  { keys: 'g g', label: 'Scroll to top' },
  { keys: 'g h', label: 'Home' },
  { keys: 'g p', label: 'Playbooks' },
  { keys: 'g m', label: 'Models section' },
  { keys: 'g a', label: 'About (em breve)' },
  { keys: '?', label: 'Open this overlay' },
  { keys: 'Esc', label: 'Close overlay / skip intro' },
  { keys: '↑↑↓↓←→←→ B A', label: "Director's Cut" },
];

/**
 * Modal overlay listing all keyboard shortcuts. Opens via `?` (handled by
 * `useKeyboardNav` → custom event) or programmatically. Wires the keyboard
 * nav hook here so it's mounted exactly once with the overlay.
 */
export function ShortcutsOverlay() {
  const [open, setOpen] = useState(false);
  useKeyboardNav();

  useEffect(() => {
    const onOpen = () => setOpen(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('frame-zero:open-shortcuts', onOpen as EventListener);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('frame-zero:open-shortcuts', onOpen as EventListener);
      window.removeEventListener('keydown', onKey);
    };
  }, []);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      data-print="hide"
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9500,
        background: 'rgba(10,10,10,0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'var(--color-canvas-2, #131311)',
          border: '1px solid rgba(212,165,116,0.25)',
          borderRadius: 8,
          padding: '28px 32px',
          maxWidth: 480,
          width: '100%',
          color: 'var(--color-ink, #f4ede0)',
          fontFamily: 'var(--font-sans, Inter, system-ui, sans-serif)',
        }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display, Georgia, serif)',
            fontSize: '1.5rem',
            letterSpacing: '0.02em',
            marginBottom: 6,
          }}
        >
          Keyboard
        </div>
        <div
          style={{
            color: 'var(--color-ink-mute, #8a8276)',
            fontSize: '0.8rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginBottom: 20,
          }}
        >
          Atalhos · vim-style
        </div>
        <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '10px 20px', margin: 0 }}>
          {SHORTCUTS.map((s) => (
            <Row key={s.keys} keys={s.keys} label={s.label} />
          ))}
        </dl>
        <button
          type="button"
          onClick={() => setOpen(false)}
          data-cursor="amber"
          style={{
            marginTop: 24,
            padding: '8px 14px',
            background: 'transparent',
            border: '1px solid rgba(212,165,116,0.4)',
            color: '#d4a574',
            fontSize: '0.75rem',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: 4,
          }}
        >
          Close · Esc
        </button>
      </div>
    </div>
  );
}

function Row({ keys, label }: { keys: string; label: string }) {
  return (
    <>
      <dt
        style={{
          fontFamily: 'var(--font-mono, ui-monospace, monospace)',
          fontSize: '0.78rem',
          color: '#d4a574',
          whiteSpace: 'nowrap',
        }}
      >
        {keys}
      </dt>
      <dd style={{ margin: 0, fontSize: '0.9rem' }}>{label}</dd>
    </>
  );
}
