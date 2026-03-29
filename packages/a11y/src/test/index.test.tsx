import { describe, it, expect } from '@jest/globals';
import {
  runA11yAudit,
  expectNoViolations,
  formatViolations,
  renderWithA11y,
} from './index.js';
import type { A11yViolation } from './index.js';

// ─── runA11yAudit ────────────────────────────────────────────────────────────

describe('runA11yAudit', () => {
  it('returns no violations for accessible markup', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<button>Click me</button>';
    document.body.appendChild(el);
    const result = await runA11yAudit(el);
    expect(result.violations).toEqual([]);
    document.body.removeChild(el);
  });

  it('detects missing alt text on images', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="photo.jpg">';
    document.body.appendChild(el);
    const result = await runA11yAudit(el);
    expect(result.violations.some((v) => v.id === 'image-alt')).toBe(true);
    document.body.removeChild(el);
  });

  it('returns a positive passes count for accessible markup', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<button>OK</button>';
    document.body.appendChild(el);
    const result = await runA11yAudit(el);
    expect(result.passes).toBeGreaterThan(0);
    document.body.removeChild(el);
  });

  it('includes impact level in each violation', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="photo.jpg">';
    document.body.appendChild(el);
    const result = await runA11yAudit(el);
    const imageAlt = result.violations.find((v) => v.id === 'image-alt');
    expect(imageAlt?.impact).toBeDefined();
    document.body.removeChild(el);
  });

  it('includes helpUrl for each violation', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="photo.jpg">';
    document.body.appendChild(el);
    const result = await runA11yAudit(el);
    result.violations.forEach((v) => expect(v.helpUrl).toMatch(/^https?:\/\//));
    document.body.removeChild(el);
  });

  it('includes affected node HTML in violation', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="photo.jpg">';
    document.body.appendChild(el);
    const result = await runA11yAudit(el);
    const imageAlt = result.violations.find((v) => v.id === 'image-alt');
    expect(imageAlt?.nodes.length).toBeGreaterThan(0);
    document.body.removeChild(el);
  });
});

// ─── expectNoViolations ──────────────────────────────────────────────────────

describe('expectNoViolations', () => {
  it('resolves for accessible markup', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<button>Save</button>';
    document.body.appendChild(el);
    await expect(expectNoViolations(el)).resolves.toBeUndefined();
    document.body.removeChild(el);
  });

  it('rejects for markup with violations', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="photo.jpg">';
    document.body.appendChild(el);
    await expect(expectNoViolations(el)).rejects.toThrow(/accessibility violation/i);
    document.body.removeChild(el);
  });

  it('error message includes the rule id', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="photo.jpg">';
    document.body.appendChild(el);
    await expect(expectNoViolations(el)).rejects.toThrow(/image-alt/);
    document.body.removeChild(el);
  });

  it('error message states the violation count', async () => {
    const el = document.createElement('div');
    el.innerHTML = '<img src="photo.jpg">';
    document.body.appendChild(el);
    await expect(expectNoViolations(el)).rejects.toThrow(/1 accessibility violation/);
    document.body.removeChild(el);
  });
});

// ─── formatViolations ────────────────────────────────────────────────────────

function makeViolation(overrides: Partial<A11yViolation> = {}): A11yViolation {
  return {
    id: 'test-rule',
    impact: 'serious',
    description: 'Test description',
    helpUrl: 'https://example.com/rules/test',
    nodes: [],
    ...overrides,
  };
}

describe('formatViolations', () => {
  it('returns "No violations found." for empty array', () => {
    expect(formatViolations([])).toBe('No violations found.');
  });

  it('includes the rule id in output', () => {
    expect(formatViolations([makeViolation({ id: 'image-alt' })])).toContain('image-alt');
  });

  it('formats impact level in uppercase', () => {
    expect(formatViolations([makeViolation({ impact: 'critical' })])).toContain('CRITICAL');
  });

  it('includes the help URL', () => {
    expect(formatViolations([makeViolation()])).toContain('https://example.com/rules/test');
  });

  it('numbers multiple violations sequentially', () => {
    const violations = [makeViolation({ id: 'a' }), makeViolation({ id: 'b' })];
    const output = formatViolations(violations);
    expect(output).toContain('1.');
    expect(output).toContain('2.');
  });

  it('lists affected node HTML', () => {
    const v = makeViolation({ nodes: [{ html: '<img src="x.jpg">', failureSummary: undefined }] });
    expect(formatViolations([v])).toContain('<img src="x.jpg">');
  });

  it('handles undefined impact gracefully', () => {
    expect(formatViolations([makeViolation({ impact: undefined })])).toContain('UNKNOWN');
  });
});

// ─── renderWithA11y ──────────────────────────────────────────────────────────

describe('renderWithA11y', () => {
  it('returns the rendered container', async () => {
    const { container } = await renderWithA11y(<button>Click</button>);
    expect(container.querySelector('button')).not.toBeNull();
  });

  it('returns a violations array', async () => {
    const { violations } = await renderWithA11y(<button>OK</button>);
    expect(Array.isArray(violations)).toBe(true);
  });

  it('returns no violations for accessible component', async () => {
    const { violations } = await renderWithA11y(<button>OK</button>);
    expect(violations).toHaveLength(0);
  });

  it('detects violations in rendered component', async () => {
    /* eslint-disable-next-line jsx-a11y/alt-text */
    const { violations } = await renderWithA11y(<img src="x.jpg" />);
    expect(violations.some((v) => v.id === 'image-alt')).toBe(true);
  });
});
