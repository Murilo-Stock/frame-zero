'use client';
import { useState, useMemo } from 'react';
import type { Item, UseCase, Model } from './types';

export type FilterState = {
  useCase: UseCase | null;
  model: Model | null;
  query: string;
};

export function useFilter(items: Item[]) {
  const [state, setState] = useState<FilterState>({ useCase: null, model: null, query: '' });
  const filtered = useMemo(() => {
    return items.filter((it) => {
      if (state.useCase && it.useCase !== state.useCase) return false;
      if (state.model && it.model !== state.model) return false;
      if (state.query) {
        const q = state.query.toLowerCase();
        if (!it.title.toLowerCase().includes(q) && !it.prompt.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [items, state]);
  return { state, setState, filtered };
}
