/**
 * @jest-environment node
 */
import { describe, it, expect } from '@jest/globals';
import { auditHtml } from './audit.js';

describe('auditHtml', () => {
  it('returns no violations for a minimal accessible page', async () => {
    const html = `<!DOCTYPE html><html lang="en"><head><title>Test</title></head>
<body><main><h1>Hello</h1><button>OK</button></main></body></html>`;
    const results = await auditHtml(html);
    expect(results.violations).toHaveLength(0);
  }, 15000);

  it('detects missing lang attribute on html element', async () => {
    const html = `<!DOCTYPE html><html><head><title>Test</title></head>
<body><h1>Hello</h1></body></html>`;
    const results = await auditHtml(html);
    expect(results.violations.some((v) => v.id === 'html-has-lang')).toBe(true);
  }, 15000);

  it('detects image missing alt attribute', async () => {
    const html = `<!DOCTYPE html><html lang="en"><head><title>Test</title></head>
<body><main><img src="photo.jpg"></main></body></html>`;
    const results = await auditHtml(html);
    expect(results.violations.some((v) => v.id === 'image-alt')).toBe(true);
  }, 15000);

  it('does not flag an image with empty alt (decorative)', async () => {
    const html = `<!DOCTYPE html><html lang="en"><head><title>Test</title></head>
<body><main><img src="deco.jpg" alt=""></main></body></html>`;
    const results = await auditHtml(html);
    expect(results.violations.some((v) => v.id === 'image-alt')).toBe(false);
  }, 15000);

  it('detects missing document title', async () => {
    const html = `<!DOCTYPE html><html lang="en"><head></head><body><h1>Hello</h1></body></html>`;
    const results = await auditHtml(html);
    expect(results.violations.some((v) => v.id === 'document-title')).toBe(true);
  }, 15000);

  it('returns a passes array', async () => {
    const html = `<!DOCTYPE html><html lang="en"><head><title>Test</title></head>
<body><button>Click</button></body></html>`;
    const results = await auditHtml(html);
    expect(Array.isArray(results.passes)).toBe(true);
  }, 15000);

  it('returns an incomplete array', async () => {
    const html = `<!DOCTYPE html><html lang="en"><head><title>Test</title></head>
<body><button>Click</button></body></html>`;
    const results = await auditHtml(html);
    expect(Array.isArray(results.incomplete)).toBe(true);
  }, 15000);

  it('respects custom tags option (wcag2a only)', async () => {
    // This should still run — just a narrower ruleset
    const html = `<!DOCTYPE html><html><head><title>T</title></head><body></body></html>`;
    const results = await auditHtml(html, { tags: ['wcag2a'] });
    expect(Array.isArray(results.violations)).toBe(true);
  }, 15000);
});
