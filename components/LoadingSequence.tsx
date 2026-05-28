'use client';
import { useEffect, useState } from 'react';

/**
 * First-mount loading sequence: 1.2s amber line draws across viewport revealing
 * "FRAME ZERO" wordmark, then expands vertically into a fade-out. Runs once per
 * sessionStorage. Respects `prefers-reduced-motion` (skips line draw — fades only).
 * ESC skips. z-9998 so the AmberCursor (10000) and grain (9999) stay above.
 */
export function LoadingSequence() {
  const [mounted, setMounted] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [phase, setPhase] = useState<'draw' | 'expand' | 'fade' | 'done'>('draw');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem('frame-zero-loaded') === '1') {
      setPhase('done');
      return;
    }
    const r = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setReduced(r);
    setMounted(true);
    sessionStorage.setItem('frame-zero-loaded', '1');

    const skip = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPhase('done');
        setMounted(false);
      }
    };
    window.addEventListener('keydown', skip);

    if (r) {
      const t1 = setTimeout(() => setPhase('fade'), 400);
      const t2 = setTimeout(() => {
        setPhase('done');
        setMounted(false);
      }, 600);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        window.removeEventListener('keydown', skip);
      };
    }

    const t1 = setTimeout(() => setPhase('expand'), 800);
    const t2 = setTimeout(() => setPhase('fade'), 1000);
    const t3 = setTimeout(() => {
      setPhase('done');
      setMounted(false);
    }, 1200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      window.removeEventListener('keydown', skip);
    };
  }, []);

  if (!mounted || phase === 'done') return null;

  return (
    <div
      aria-hidden="true"
      data-print="hide"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: phase === 'fade' ? 0 : 1,
        transition: 'opacity 200ms ease',
        pointerEvents: phase === 'fade' ? 'none' : 'auto',
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'inline-block',
          padding: '0 24px',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-display, Georgia, serif)',
            fontSize: 'clamp(2.5rem, 8vw, 4.5rem)',
            color: '#f4ede0',
            letterSpacing: '0.04em',
            opacity: reduced ? 1 : 0.85,
          }}
        >
          FRAME ZERO
        </span>
        {!reduced && (
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              height: phase === 'expand' ? '120%' : '2px',
              width: phase === 'draw' ? '0%' : '100%',
              background: '#d4a574',
              transform: 'translateY(-50%)',
              transition:
                phase === 'draw'
                  ? 'width 800ms cubic-bezier(0.65, 0, 0.35, 1)'
                  : 'height 400ms cubic-bezier(0.65, 0, 0.35, 1), opacity 400ms ease',
              opacity: phase === 'expand' ? 0.18 : 1,
              mixBlendMode: 'screen',
            }}
          />
        )}
      </div>
    </div>
  );
}
