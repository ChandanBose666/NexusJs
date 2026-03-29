import { describe, it, expect } from '@jest/globals';
import {
  WCAG_CRITERIA,
  MANUAL_CHECKS,
  getCoverageStats,
} from './manual-checklist.js';

describe('WCAG_CRITERIA', () => {
  it('contains exactly 50 success criteria', () => {
    expect(WCAG_CRITERIA.length).toBe(50);
  });

  it('every criterion has an id, name, level, principle, and automation', () => {
    for (const c of WCAG_CRITERIA) {
      expect(c.id).toBeTruthy();
      expect(c.name).toBeTruthy();
      expect(['A', 'AA']).toContain(c.level);
      expect(['perceivable', 'operable', 'understandable', 'robust']).toContain(c.principle);
      expect(['full', 'partial', 'manual']).toContain(c.automation);
    }
  });

  it('has no duplicate criterion IDs', () => {
    const ids = WCAG_CRITERIA.map((c) => c.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it('criteria IDs match the x.y.z format', () => {
    for (const c of WCAG_CRITERIA) {
      expect(c.id).toMatch(/^\d+\.\d+\.\d+$/);
    }
  });

  it('axeRules is always an array', () => {
    for (const c of WCAG_CRITERIA) {
      expect(Array.isArray(c.axeRules)).toBe(true);
    }
  });

  it('all four principles are represented', () => {
    const principles = new Set(WCAG_CRITERIA.map((c) => c.principle));
    expect(principles).toContain('perceivable');
    expect(principles).toContain('operable');
    expect(principles).toContain('understandable');
    expect(principles).toContain('robust');
  });

  it('has at least one "full" automation criterion', () => {
    expect(WCAG_CRITERIA.some((c) => c.automation === 'full')).toBe(true);
  });

  it('has a mix of automation statuses', () => {
    const statuses = new Set(WCAG_CRITERIA.map((c) => c.automation));
    expect(statuses.size).toBeGreaterThanOrEqual(2);
  });
});

describe('MANUAL_CHECKS', () => {
  it('contains at least 15 manual checks', () => {
    expect(MANUAL_CHECKS.length).toBeGreaterThanOrEqual(15);
  });

  it('every check has a criterionId, title, and instructions', () => {
    for (const c of MANUAL_CHECKS) {
      expect(c.criterionId).toBeTruthy();
      expect(c.title).toBeTruthy();
      expect(c.instructions).toBeTruthy();
    }
  });

  it('every criterionId references a known WCAG criterion', () => {
    const ids = new Set(WCAG_CRITERIA.map((c) => c.id));
    for (const check of MANUAL_CHECKS) {
      expect(ids.has(check.criterionId)).toBe(true);
    }
  });

  it('has no duplicate criterionIds', () => {
    const ids = MANUAL_CHECKS.map((c) => c.criterionId);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

describe('getCoverageStats', () => {
  it('total matches WCAG_CRITERIA length', () => {
    const { total } = getCoverageStats();
    expect(total).toBe(WCAG_CRITERIA.length);
  });

  it('byStatus counts sum to total', () => {
    const { byStatus, total } = getCoverageStats();
    const sum = byStatus.full + byStatus.partial + byStatus.manual;
    expect(sum).toBe(total);
  });

  it('byPrinciple counts sum to total', () => {
    const { byPrinciple, total } = getCoverageStats();
    const sum = Object.values(byPrinciple).reduce(
      (acc, p) => acc + p.full + p.partial + p.manual,
      0
    );
    expect(sum).toBe(total);
  });

  it('manual criterion count exceeds automated', () => {
    const { byStatus } = getCoverageStats();
    expect(byStatus.manual).toBeGreaterThan(byStatus.full);
  });
});
