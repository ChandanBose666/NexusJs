import { describe, it, expect } from '@jest/globals';
import {
  ALL_KINDS,
  KIND_COLORS,
  KIND_LABELS,
  emptyStats,
  type ComponentKind,
} from '../types.js';

describe('ALL_KINDS', () => {
  it('contains all five kinds', () => {
    expect(ALL_KINDS).toEqual(['server', 'client', 'shared', 'boundary', 'mixed']);
  });

  it('is readonly (frozen)', () => {
    expect(Object.isFrozen(ALL_KINDS)).toBe(true);
  });
});

describe('KIND_COLORS', () => {
  it('has an entry for every kind', () => {
    for (const kind of ALL_KINDS) {
      expect(KIND_COLORS[kind]).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('assigns distinct colors', () => {
    const colors = ALL_KINDS.map((k) => KIND_COLORS[k]);
    expect(new Set(colors).size).toBe(ALL_KINDS.length);
  });
});

describe('KIND_LABELS', () => {
  it('has a non-empty label for every kind', () => {
    for (const kind of ALL_KINDS) {
      expect(KIND_LABELS[kind].length).toBeGreaterThan(0);
    }
  });
});

describe('emptyStats', () => {
  it('returns zero counts for all kinds', () => {
    const stats = emptyStats();
    for (const kind of ALL_KINDS) {
      expect(stats[kind as ComponentKind]).toBe(0);
    }
  });

  it('returns total: 0', () => {
    expect(emptyStats().total).toBe(0);
  });

  it('returns a fresh object each time', () => {
    const a = emptyStats();
    const b = emptyStats();
    a.server = 99;
    expect(b.server).toBe(0);
  });
});
