import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { parseMuriloLocal } from '../../scripts/parsers/murilo-local.mjs';

const fixture = JSON.parse(readFileSync('scripts/fixtures/murilo-sample.json', 'utf-8'));

describe('parseMuriloLocal', () => {
  it('extracts both items', () => {
    const items = parseMuriloLocal(fixture);
    expect(items).toHaveLength(2);
  });

  it('maps category=architecture → useCase architecture', () => {
    const items = parseMuriloLocal(fixture);
    expect(items[0].title).toContain('Japandi');
    expect(items[0].model).toBe('murilo');
    expect(items[0].mediaUrl).toContain('/murilo/');
  });

  it('maps fora-da-caixa → experimental hint', () => {
    const items = parseMuriloLocal(fixture);
    expect(items[1].hints).toContain('experimental');
  });
});
