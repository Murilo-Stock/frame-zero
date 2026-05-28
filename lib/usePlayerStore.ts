'use client';
import { useSyncExternalStore } from 'react';
import type { Item } from './types';

type PlayerState = {
  item: Item | null;
  minimized: boolean;
};

let state: PlayerState = { item: null, minimized: false };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export const playerStore = {
  subscribe(cb: () => void) {
    listeners.add(cb);
    return () => {
      listeners.delete(cb);
    };
  },
  getSnapshot(): PlayerState {
    return state;
  },
  show(item: Item) {
    if (state.item?.id === item.id && !state.minimized) return;
    state = { item, minimized: false };
    emit();
  },
  minimize() {
    if (!state.item || state.minimized) return;
    state = { ...state, minimized: true };
    emit();
  },
  expand() {
    if (!state.item || !state.minimized) return;
    state = { ...state, minimized: false };
    emit();
  },
  close() {
    if (!state.item) return;
    state = { item: null, minimized: false };
    emit();
  },
};

const SERVER_SNAPSHOT: PlayerState = { item: null, minimized: false };

export function usePlayerState(): PlayerState {
  return useSyncExternalStore(
    playerStore.subscribe,
    playerStore.getSnapshot,
    () => SERVER_SNAPSHOT
  );
}
