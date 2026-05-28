'use client';
import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Bottom-right speaker toggle. DEFAULT OFF (opt-in). When enabled, builds an
 * in-browser ambient drone via vanilla AudioContext (2 oscillators + lowpass +
 * gain envelope). Persisted via localStorage. Hidden on touch devices + print.
 *
 * Option B (WebAudio synth) chosen over a CC0 file: no extra bytes, no license
 * risk, no network round-trip on toggle, no extra dep.
 */
export function AudioToggle() {
  const [supported, setSupported] = useState(false);
  const [on, setOn] = useState(false);
  const ctxRef = useRef<AudioContext | null>(null);
  const nodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(
    null,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (coarse) return;
    if (typeof AudioContext === 'undefined' && typeof (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext === 'undefined') {
      return;
    }
    setSupported(true);
  }, []);

  const stop = useCallback(() => {
    const ctx = ctxRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !nodes) return;
    const now = ctx.currentTime;
    nodes.gain.gain.cancelScheduledValues(now);
    nodes.gain.gain.setValueAtTime(nodes.gain.gain.value, now);
    nodes.gain.gain.linearRampToValueAtTime(0, now + 0.4);
    setTimeout(() => {
      try {
        nodes.osc1.stop();
        nodes.osc2.stop();
      } catch {
        /* already stopped */
      }
      try {
        ctx.close();
      } catch {
        /* already closed */
      }
      ctxRef.current = null;
      nodesRef.current = null;
    }, 500);
  }, []);

  const start = useCallback(() => {
    if (ctxRef.current) return;
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.value = 110;
    osc2.type = 'triangle';
    osc2.frequency.value = 165;
    filter.type = 'lowpass';
    filter.frequency.value = 400;
    filter.Q.value = 0.7;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 1.2);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start();
    osc2.start();

    ctxRef.current = ctx;
    nodesRef.current = { osc1, osc2, gain };
  }, []);

  useEffect(() => {
    if (!supported) return;
    const saved = (() => {
      try {
        return localStorage.getItem('frame-zero-audio');
      } catch {
        return null;
      }
    })();
    if (saved === '1') {
      // Browsers gate AudioContext on first user gesture — do NOT auto-start.
      // We just remember the preference visually and arm start on next click.
      setOn(false);
    }
  }, [supported]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  if (!supported) return null;

  const toggle = () => {
    const next = !on;
    setOn(next);
    try {
      localStorage.setItem('frame-zero-audio', next ? '1' : '0');
    } catch {
      /* silent */
    }
    if (next) start();
    else stop();
  };

  return (
    <button
      type="button"
      aria-label={on ? 'Mute ambient drone' : 'Play ambient drone'}
      onClick={toggle}
      data-print="hide"
      data-cursor="amber"
      className="touch:hidden"
      style={{
        position: 'fixed',
        right: 16,
        bottom: 16,
        width: 36,
        height: 36,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 9999,
        background: 'rgba(10,10,10,0.55)',
        border: '1px solid rgba(212,165,116,0.35)',
        color: '#d4a574',
        cursor: 'pointer',
        zIndex: 9000,
        backdropFilter: 'blur(8px)',
        transition: 'background 180ms ease, border-color 180ms ease',
      }}
    >
      {on ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 5L6 9H2v6h4l5 4V5z" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
