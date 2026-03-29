import { describe, it, expect } from '@jest/globals';
import {
  formatViolationsSection,
  formatManualChecklist,
  formatCoverageReport,
  formatSummary,
  buildReport,
  buildSummaryLine,
  getAutomatedRuleIds,
} from './reporter.js';
import type { AuditSummary } from './reporter.js';
import type { AxeResults } from 'axe-core';

// ─── Minimal fixture builders ─────────────────────────────────────────────────

function makeViolation(overrides: Partial<AxeResults['violations'][0]> = {}): AxeResults['violations'][0] {
  return {
    id: 'image-alt',
    impact: 'critical',
    tags: [],
    description: 'Images must have alternate text',
    help: 'Image alt text',
    helpUrl: 'https://dequeuniversity.com/rules/axe/4.7/image-alt',
    nodes: [{
      html: '<img src="x.jpg">',
      failureSummary: 'Fix any of: Image element does not have an alt attribute',
      impact: 'critical',
      target: ['img'],
      any: [], all: [], none: [],
    }],
    ...overrides,
  };
}

function makeAxeResults(overrides: Partial<AxeResults> = {}): AxeResults {
  return {
    violations: [],
    passes: [],
    incomplete: [],
    inapplicable: [],
    timestamp: new Date().toISOString(),
    url: 'http://localhost',
    testEngine: { name: 'axe-core', version: '4.7.0' },
    testEnvironment: { userAgent: 'jest', windowWidth: 1280, windowHeight: 800, orientationAngle: 0, orientationType: 'landscape-primary' },
    testRunner: { name: 'axe' },
    toolOptions: {},
    ...overrides,
  };
}

// ─── formatViolationsSection ─────────────────────────────────────────────────

describe('formatViolationsSection', () => {
  it('shows a pass message when there are no violations', () => {
    expect(formatViolationsSection([])).toContain('No automated violations');
  });

  it('includes violation count in header', () => {
    expect(formatViolationsSection([makeViolation()])).toContain('VIOLATIONS (1)');
  });

  it('includes the rule ID', () => {
    expect(formatViolationsSection([makeViolation()])).toContain('image-alt');
  });

  it('includes impact in uppercase', () => {
    expect(formatViolationsSection([makeViolation({ impact: 'serious' })])).toContain('SERIOUS');
  });

  it('includes the help URL', () => {
    expect(formatViolationsSection([makeViolation()])).toContain('dequeuniversity.com');
  });

  it('includes affected node HTML', () => {
    expect(formatViolationsSection([makeViolation()])).toContain('<img src="x.jpg">');
  });

  it('truncates node list beyond 3', () => {
    const nodes = Array.from({ length: 5 }, (_, i) => ({
      html: `<img src="${i}.jpg">`,
      failureSummary: '',
      impact: 'critical' as const,
      target: [`img:nth-child(${i})`],
      any: [], all: [], none: [],
    }));
    const output = formatViolationsSection([makeViolation({ nodes })]);
    expect(output).toContain('2 more');
  });

  it('sorts violations by impact severity (critical first)', () => {
    const violations = [
      makeViolation({ id: 'rule-minor', impact: 'minor' }),
      makeViolation({ id: 'rule-critical', impact: 'critical' }),
    ];
    const output = formatViolationsSection(violations);
    expect(output.indexOf('rule-critical')).toBeLessThan(output.indexOf('rule-minor'));
  });
});

// ─── formatManualChecklist ────────────────────────────────────────────────────

describe('formatManualChecklist', () => {
  it('includes the count of manual checks', () => {
    const output = formatManualChecklist();
    expect(output).toMatch(/MANUAL VERIFICATION REQUIRED \(\d+ checks\)/);
  });

  it('includes checkbox markers', () => {
    expect(formatManualChecklist()).toContain('□');
  });

  it('includes instructions text', () => {
    expect(formatManualChecklist()).toContain('keyboard');
  });

  it('accepts a custom subset of checks', () => {
    const custom = [{ criterionId: '2.1.1', title: 'Keyboard', instructions: 'Test keyboard.' }];
    const output = formatManualChecklist(custom);
    expect(output).toContain('2.1.1');
    expect(output).toContain('MANUAL VERIFICATION REQUIRED (1 checks)');
  });
});

// ─── formatCoverageReport ─────────────────────────────────────────────────────

describe('formatCoverageReport', () => {
  it('includes "COVERAGE REPORT" heading', () => {
    expect(formatCoverageReport()).toContain('COVERAGE REPORT');
  });

  it('includes all four WCAG principles', () => {
    const output = formatCoverageReport();
    expect(output).toContain('Perceivable');
    expect(output).toContain('Operable');
    expect(output).toContain('Understandable');
    expect(output).toContain('Robust');
  });

  it('includes TOTAL row', () => {
    expect(formatCoverageReport()).toContain('TOTAL');
  });

  it('includes percentage figures', () => {
    expect(formatCoverageReport()).toContain('%');
  });
});

// ─── formatSummary ────────────────────────────────────────────────────────────

describe('formatSummary', () => {
  const base: AuditSummary = { violations: 0, passes: 10, incomplete: 0, filePath: 'index.html' };

  it('shows PASS when violations = 0', () => {
    expect(formatSummary(base)).toContain('PASS');
  });

  it('shows FAIL when violations > 0', () => {
    expect(formatSummary({ ...base, violations: 2 })).toContain('FAIL');
  });

  it('includes violation count', () => {
    expect(formatSummary({ ...base, violations: 3 })).toContain('3');
  });

  it('includes file path', () => {
    expect(formatSummary({ ...base, filePath: 'dist/index.html' })).toContain('dist/index.html');
  });
});

// ─── buildReport ─────────────────────────────────────────────────────────────

describe('buildReport', () => {
  it('includes all three sections', () => {
    const results = makeAxeResults({ violations: [makeViolation()] });
    const report = buildReport(results, 'test.html');
    expect(report).toContain('VIOLATIONS');
    expect(report).toContain('MANUAL VERIFICATION');
    expect(report).toContain('COVERAGE REPORT');
  });

  it('includes the file path', () => {
    const report = buildReport(makeAxeResults(), 'pages/about.html');
    expect(report).toContain('pages/about.html');
  });
});

// ─── buildSummaryLine ─────────────────────────────────────────────────────────

describe('buildSummaryLine', () => {
  it('shows a ✓ pass line when there are no violations', () => {
    expect(buildSummaryLine(0)).toContain('0 violations');
    expect(buildSummaryLine(0)).toContain('✓');
  });

  it('shows a ✗ fail line when there are violations', () => {
    expect(buildSummaryLine(3)).toContain('3 violation');
    expect(buildSummaryLine(3)).toContain('✗');
  });

  it('includes manual check count', () => {
    expect(buildSummaryLine(0)).toMatch(/\d+.*manual checks/);
  });
});

// ─── getAutomatedRuleIds ──────────────────────────────────────────────────────

describe('getAutomatedRuleIds', () => {
  it('returns a non-empty array', () => {
    expect(getAutomatedRuleIds().length).toBeGreaterThan(0);
  });

  it('contains no duplicates', () => {
    const ids = getAutomatedRuleIds();
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('includes known axe rule IDs', () => {
    const ids = getAutomatedRuleIds();
    expect(ids).toContain('image-alt');
    expect(ids).toContain('duplicate-id');
  });
});
