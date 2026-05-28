'use client';
import { useEffect, useRef, useState } from 'react';

/**
 * Additive amber-dot halo that tracks the mouse on desktop. Stays disabled on touch / coarse
 * pointers and respects `prefers-reduced-motion`. Native cursor remains visible — this is a
 * cinematic accent, not a replacement (which would break form inputs and a11y).
 *
 * Interactive elements opt-in via `data-cursor="amber"`; the dot expands and outlines over them.
 * Use `data-cursor="hide"` to suppress the halo over a specific region (e.g. a clean video).
 */
export function AmberCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const [enabled, setEnabled] = useState(false);
  const [active, setActive] = useState(false);
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const hoverCapable = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!hoverCapable || reduced) return;
    setEnabled(true);

    const flush = () => {
      rafRef.current = null;
      if (!pending.current || !dotRef.current) return;
      const { x, y } = pending.current;
      dotRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
    };

    const onMove = (e: MouseEvent) => {
      pending.current = { x: e.clientX, y: e.clientY };
      if (hidden) setHidden(false);
      if (rafRef.current == null) rafRef.current = window.requestAnimationFrame(flush);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      const hit = target.closest('[data-cursor]');
      const mode = hit?.getAttribute('data-cursor');
      setActive(mode === 'amber');
    };
    const onLeave = () => setHidden(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseover', onOver, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseleave', onLeave);
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    };
  }, [hidden]);

  if (!enabled) return null;
  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      data-print="hide"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: active ? 24 : 12,
        height: active ? 24 : 12,
        borderRadius: '9999px',
        backgroundColor: active ? 'transparent' : 'rgba(212, 165, 116, 0.85)',
        border: active ? '1px solid rgba(212, 165, 116, 0.95)' : 'none',
        pointerEvents: 'none',
        zIndex: 10000,
        mixBlendMode: 'screen',
        opacity: hidden ? 0 : 1,
        transition: 'width 180ms ease, height 180ms ease, background-color 180ms ease, opacity 200ms ease, border-color 180ms ease',
        willChange: 'transform, width, height, opacity',
      }}
    />
  );
}
