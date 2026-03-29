import { describe, it, expect, beforeEach } from '@jest/globals';
import { buildStylesheet, injectStylesheet, removeStylesheet, STYLE_ELEMENT_ID } from '../styles.js';
import { DATA_KIND } from '../scanner.js';

// ---------------------------------------------------------------------------
// buildStylesheet — pure function, no DOM needed
// ---------------------------------------------------------------------------

describe('buildStylesheet', () => {
  it('includes the default data attribute in the CSS rules', () => {
    const css = buildStylesheet(DATA_KIND);
    expect(css).toContain(`[${DATA_KIND}="server"]`);
    expect(css).toContain(`[${DATA_KIND}="client"]`);
    expect(css).toContain(`[${DATA_KIND}="shared"]`);
    expect(css).toContain(`[${DATA_KIND}="boundary"]`);
    expect(css).toContain(`[${DATA_KIND}="mixed"]`);
  });

  it('assigns distinct CSS custom property values for each kind', () => {
    const css = buildStylesheet(DATA_KIND);
    // Each kind maps to a unique hex colour
    const hexMatches = [...css.matchAll(/#[0-9a-f]{6}/gi)];
    const unique = new Set(hexMatches.map((m) => m[0].toLowerCase()));
    expect(unique.size).toBeGreaterThanOrEqual(5);
  });

  it('includes an outline rule on the base [attr] selector', () => {
    const css = buildStylesheet(DATA_KIND);
    expect(css).toContain('outline:');
  });

  it('includes a ::after pseudo-element for kind labels', () => {
    const css = buildStylesheet(DATA_KIND);
    expect(css).toContain('::after');
  });

  it('uses the custom attribute when one is supplied', () => {
    const css = buildStylesheet('data-custom-kind');
    expect(css).toContain('[data-custom-kind="server"]');
    expect(css).not.toContain(`[${DATA_KIND}`);
  });
});

// ---------------------------------------------------------------------------
// injectStylesheet / removeStylesheet — DOM tests (jsdom)
// ---------------------------------------------------------------------------

describe('injectStylesheet', () => {
  beforeEach(() => {
    // Clean up any leftover style element between tests
    document.getElementById(STYLE_ELEMENT_ID)?.remove();
  });

  it('appends a <style> element to document.head', () => {
    injectStylesheet(document, DATA_KIND);
    const el = document.getElementById(STYLE_ELEMENT_ID);
    expect(el).not.toBeNull();
    expect(el?.tagName.toLowerCase()).toBe('style');
  });

  it('sets the style element id to STYLE_ELEMENT_ID', () => {
    const el = injectStylesheet(document, DATA_KIND);
    expect(el.id).toBe(STYLE_ELEMENT_ID);
  });

  it('populates textContent with the stylesheet', () => {
    const el = injectStylesheet(document, DATA_KIND);
    expect(el.textContent).toContain(`[${DATA_KIND}="server"]`);
  });

  it('replaces an existing style element (idempotent)', () => {
    injectStylesheet(document, DATA_KIND);
    injectStylesheet(document, DATA_KIND);
    expect(document.querySelectorAll(`#${STYLE_ELEMENT_ID}`)).toHaveLength(1);
  });
});

describe('removeStylesheet', () => {
  it('removes the style element when present', () => {
    injectStylesheet(document, DATA_KIND);
    removeStylesheet(document);
    expect(document.getElementById(STYLE_ELEMENT_ID)).toBeNull();
  });

  it('does not throw when no style element exists', () => {
    expect(() => removeStylesheet(document)).not.toThrow();
  });
});
