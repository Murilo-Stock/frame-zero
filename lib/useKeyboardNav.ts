'use client';
import { useEffect } from 'react';

/**
 * Vim-style two-key navigation. Listens for `g` then a second key within 400ms.
 * Skips when the user is typing in an input/textarea/contenteditable. Also
 * surfaces `?` → open shortcuts overlay (via custom event consumed by
 * `ShortcutsOverlay`).
 */
export function useKeyboardNav() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let armed = false;
    let armedTimer: number | null = null;

    const isTyping = (el: EventTarget | null) => {
      if (!el || !(el instanceof HTMLElement)) return false;
      const tag = el.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
      if (el.isContentEditable) return true;
      return false;
    };

    const navTo = (path: string, hash?: string) => {
      if (hash && window.location.pathname === path) {
        const el = document.querySelector(hash);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
          return;
        }
      }
      window.location.href = path + (hash ?? '');
    };

    const onKey = (e: KeyboardEvent) => {
      if (isTyping(e.target)) return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      if (e.key === '?') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('frame-zero:open-shortcuts'));
        return;
      }

      if (armed) {
        const k = e.key.toLowerCase();
        armed = false;
        if (armedTimer != null) {
          clearTimeout(armedTimer);
          armedTimer = null;
        }
        if (k === 'g') {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else if (k === 'p') {
          e.preventDefault();
          navTo('/playbooks');
        } else if (k === 'm') {
          e.preventDefault();
          navTo('/', '#models');
        } else if (k === 'h') {
          e.preventDefault();
          navTo('/');
        } else if (k === 'a') {
          e.preventDefault();
          navTo('/about');
        }
        return;
      }

      if (e.key.toLowerCase() === 'g') {
        armed = true;
        armedTimer = window.setTimeout(() => {
          armed = false;
          armedTimer = null;
        }, 400);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      if (armedTimer != null) clearTimeout(armedTimer);
    };
  }, []);
}
