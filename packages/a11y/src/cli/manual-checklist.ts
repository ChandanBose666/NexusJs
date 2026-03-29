/**
 * WCAG 2.1 AA manual verification checklist.
 *
 * Axe-core covers roughly 30-40% of WCAG 2.1 AA violations automatically.
 * The remaining ~60% of success criteria require manual expert review.
 * This module provides structured data for both categories so the CLI
 * can print a complete coverage picture alongside automated results.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export type AutomationStatus =
  | 'full'     // Axe-core fully covers this criterion
  | 'partial'  // Axe-core catches some violations but not all
  | 'manual';  // Requires human review — no automated coverage

export type WcagPrinciple = 'perceivable' | 'operable' | 'understandable' | 'robust';

export interface WcagCriterion {
  id: string;               // e.g. "1.4.3"
  level: 'A' | 'AA';
  name: string;
  principle: WcagPrinciple;
  automation: AutomationStatus;
  /** Related axe-core rule IDs, if any. */
  axeRules: string[];
}

export interface ManualCheck {
  criterionId: string;
  title: string;
  /** What developers should manually verify. */
  instructions: string;
}

// ─── All 50 WCAG 2.1 AA success criteria ────────────────────────────────────

export const WCAG_CRITERIA: WcagCriterion[] = [
  // Perceivable
  { id: '1.1.1', level: 'A',  name: 'Non-text Content',              principle: 'perceivable',    automation: 'partial', axeRules: ['image-alt', 'input-image-alt', 'area-alt'] },
  { id: '1.2.1', level: 'A',  name: 'Audio-only and Video-only',     principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.2.2', level: 'A',  name: 'Captions (Prerecorded)',        principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.2.3', level: 'A',  name: 'Audio Description or Alt',     principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.2.4', level: 'AA', name: 'Captions (Live)',               principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.2.5', level: 'AA', name: 'Audio Description (Prerecorded)', principle: 'perceivable',  automation: 'manual',  axeRules: [] },
  { id: '1.3.1', level: 'A',  name: 'Info and Relationships',        principle: 'perceivable',    automation: 'partial', axeRules: ['aria-required-children', 'aria-required-parent', 'list', 'listitem', 'definition-list', 'dlitem'] },
  { id: '1.3.2', level: 'A',  name: 'Meaningful Sequence',          principle: 'perceivable',    automation: 'partial', axeRules: [] },
  { id: '1.3.3', level: 'A',  name: 'Sensory Characteristics',      principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.3.4', level: 'AA', name: 'Orientation',                  principle: 'perceivable',    automation: 'partial', axeRules: ['css-orientation-lock'] },
  { id: '1.3.5', level: 'AA', name: 'Identify Input Purpose',       principle: 'perceivable',    automation: 'partial', axeRules: ['autocomplete-valid'] },
  { id: '1.4.1', level: 'A',  name: 'Use of Color',                 principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.4.2', level: 'A',  name: 'Audio Control',                principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.4.3', level: 'AA', name: 'Contrast (Minimum)',           principle: 'perceivable',    automation: 'partial', axeRules: ['color-contrast'] },
  { id: '1.4.4', level: 'AA', name: 'Resize Text',                  principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.4.5', level: 'AA', name: 'Images of Text',               principle: 'perceivable',    automation: 'partial', axeRules: [] },
  { id: '1.4.10', level: 'AA', name: 'Reflow',                      principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  { id: '1.4.11', level: 'AA', name: 'Non-text Contrast',           principle: 'perceivable',    automation: 'partial', axeRules: ['color-contrast-enhanced'] },
  { id: '1.4.12', level: 'AA', name: 'Text Spacing',                principle: 'perceivable',    automation: 'partial', axeRules: [] },
  { id: '1.4.13', level: 'AA', name: 'Content on Hover or Focus',   principle: 'perceivable',    automation: 'manual',  axeRules: [] },
  // Operable
  { id: '2.1.1', level: 'A',  name: 'Keyboard',                     principle: 'operable',       automation: 'partial', axeRules: ['scrollable-region-focusable'] },
  { id: '2.1.2', level: 'A',  name: 'No Keyboard Trap',             principle: 'operable',       automation: 'partial', axeRules: [] },
  { id: '2.1.4', level: 'A',  name: 'Character Key Shortcuts',      principle: 'operable',       automation: 'manual',  axeRules: [] },
  { id: '2.2.1', level: 'A',  name: 'Timing Adjustable',            principle: 'operable',       automation: 'manual',  axeRules: [] },
  { id: '2.2.2', level: 'A',  name: 'Pause, Stop, Hide',            principle: 'operable',       automation: 'manual',  axeRules: [] },
  { id: '2.3.1', level: 'A',  name: 'Three Flashes or Below',       principle: 'operable',       automation: 'manual',  axeRules: [] },
  { id: '2.4.1', level: 'A',  name: 'Bypass Blocks',                principle: 'operable',       automation: 'partial', axeRules: ['bypass'] },
  { id: '2.4.2', level: 'A',  name: 'Page Titled',                  principle: 'operable',       automation: 'partial', axeRules: ['document-title'] },
  { id: '2.4.3', level: 'A',  name: 'Focus Order',                  principle: 'operable',       automation: 'partial', axeRules: ['tabindex'] },
  { id: '2.4.4', level: 'A',  name: 'Link Purpose (In Context)',    principle: 'operable',       automation: 'partial', axeRules: ['link-name'] },
  { id: '2.4.5', level: 'AA', name: 'Multiple Ways',                principle: 'operable',       automation: 'manual',  axeRules: [] },
  { id: '2.4.6', level: 'AA', name: 'Headings and Labels',          principle: 'operable',       automation: 'partial', axeRules: ['heading-order', 'empty-heading'] },
  { id: '2.4.7', level: 'AA', name: 'Focus Visible',                principle: 'operable',       automation: 'partial', axeRules: ['focus-order-semantics'] },
  { id: '2.5.1', level: 'A',  name: 'Pointer Gestures',             principle: 'operable',       automation: 'manual',  axeRules: [] },
  { id: '2.5.2', level: 'A',  name: 'Pointer Cancellation',         principle: 'operable',       automation: 'manual',  axeRules: [] },
  { id: '2.5.3', level: 'A',  name: 'Label in Name',                principle: 'operable',       automation: 'partial', axeRules: ['label-content-name-mismatch'] },
  { id: '2.5.4', level: 'A',  name: 'Motion Actuation',             principle: 'operable',       automation: 'manual',  axeRules: [] },
  // Understandable
  { id: '3.1.1', level: 'A',  name: 'Language of Page',             principle: 'understandable', automation: 'full',    axeRules: ['html-has-lang', 'html-lang-valid'] },
  { id: '3.1.2', level: 'AA', name: 'Language of Parts',            principle: 'understandable', automation: 'partial', axeRules: ['valid-lang'] },
  { id: '3.2.1', level: 'A',  name: 'On Focus',                     principle: 'understandable', automation: 'manual',  axeRules: [] },
  { id: '3.2.2', level: 'A',  name: 'On Input',                     principle: 'understandable', automation: 'manual',  axeRules: [] },
  { id: '3.2.3', level: 'AA', name: 'Consistent Navigation',        principle: 'understandable', automation: 'manual',  axeRules: [] },
  { id: '3.2.4', level: 'AA', name: 'Consistent Identification',    principle: 'understandable', automation: 'manual',  axeRules: [] },
  { id: '3.3.1', level: 'A',  name: 'Error Identification',         principle: 'understandable', automation: 'partial', axeRules: ['aria-required-attr'] },
  { id: '3.3.2', level: 'A',  name: 'Labels or Instructions',       principle: 'understandable', automation: 'partial', axeRules: ['label', 'aria-label'] },
  { id: '3.3.3', level: 'AA', name: 'Error Suggestion',             principle: 'understandable', automation: 'manual',  axeRules: [] },
  { id: '3.3.4', level: 'AA', name: 'Error Prevention',             principle: 'understandable', automation: 'manual',  axeRules: [] },
  // Robust
  { id: '4.1.1', level: 'A',  name: 'Parsing',                      principle: 'robust',         automation: 'full',    axeRules: ['duplicate-id', 'duplicate-id-active', 'duplicate-id-aria'] },
  { id: '4.1.2', level: 'A',  name: 'Name, Role, Value',            principle: 'robust',         automation: 'partial', axeRules: ['button-name', 'aria-allowed-attr', 'aria-required-attr', 'aria-valid-attr'] },
  { id: '4.1.3', level: 'AA', name: 'Status Messages',              principle: 'robust',         automation: 'partial', axeRules: ['aria-live-region-content'] },
];

// ─── Manual checklist ────────────────────────────────────────────────────────

/** The ~20 highest-priority manual checks for developers to review. */
export const MANUAL_CHECKS: ManualCheck[] = [
  {
    criterionId: '1.1.1',
    title: 'Alt text accuracy for complex images',
    instructions:
      'Axe confirms alt attributes exist, but not whether they are meaningful. ' +
      'Verify charts, diagrams, and infographics have descriptions that convey equivalent information.',
  },
  {
    criterionId: '1.2.1',
    title: 'Audio/Video alternatives',
    instructions:
      'All pre-recorded audio-only content must have a text transcript. ' +
      'All pre-recorded video-only content must have either an audio track or a text alternative.',
  },
  {
    criterionId: '1.2.2',
    title: 'Captions for pre-recorded audio in video',
    instructions:
      'Verify that synchronized captions are provided for all pre-recorded video containing speech or meaningful audio.',
  },
  {
    criterionId: '1.2.4',
    title: 'Live captions',
    instructions:
      'Any live video that includes audio must provide real-time captions.',
  },
  {
    criterionId: '1.3.3',
    title: 'Sensory characteristics',
    instructions:
      'Check that no instructions rely solely on shape, color, size, visual location, orientation, or sound ' +
      '(e.g., "click the round button", "see the red text").',
  },
  {
    criterionId: '1.4.1',
    title: 'Color not the sole differentiator',
    instructions:
      'Verify that color is not the only way to convey information, indicate an action, prompt a response, ' +
      'or distinguish a visual element (e.g., required form fields use more than just a red border).',
  },
  {
    criterionId: '1.4.4',
    title: 'Text resize to 200%',
    instructions:
      'Zoom the browser to 200%. Confirm that all text resizes without loss of content or functionality, ' +
      'and that no text is clipped, truncated, or overlapping.',
  },
  {
    criterionId: '1.4.10',
    title: 'Content reflows at 320px',
    instructions:
      'At 320px viewport width (equivalent to 400% zoom on 1280px screen), content must reflow to a ' +
      'single column without horizontal scrolling, except for content requiring two-dimensional layout.',
  },
  {
    criterionId: '1.4.13',
    title: 'Content triggered on hover or focus',
    instructions:
      'Tooltips and popovers that appear on hover/focus must be: (1) dismissible without moving focus, ' +
      '(2) hoverable (pointer can move over the tooltip), and (3) persistent until dismissed or no longer needed.',
  },
  {
    criterionId: '2.1.1',
    title: 'All functionality by keyboard',
    instructions:
      'Tab through the entire page using only the keyboard. Confirm every interactive element ' +
      'is reachable and operable. Check custom widgets (date pickers, sliders, drag-and-drop).',
  },
  {
    criterionId: '2.2.1',
    title: 'Timing adjustable',
    instructions:
      'If the page has session timeouts or auto-refreshing content, verify users can turn off, ' +
      'adjust, or extend the time limit (at least 10× the default).',
  },
  {
    criterionId: '2.2.2',
    title: 'Pause, stop, or hide moving content',
    instructions:
      'Any content that moves, blinks, scrolls, or auto-updates for more than 5 seconds must have a ' +
      'mechanism to pause, stop, or hide it.',
  },
  {
    criterionId: '2.3.1',
    title: 'No content flashes more than 3 times per second',
    instructions:
      'Use the Photosensitive Epilepsy Analysis Tool (PEAT) or Harding test to verify no content ' +
      'flashes more than 3 times per second.',
  },
  {
    criterionId: '2.4.3',
    title: 'Focus order is logical',
    instructions:
      'Tab through the page and confirm the focus order matches the visual reading order. ' +
      'Axe detects positive tabindex values but cannot verify logical sequence.',
  },
  {
    criterionId: '2.4.7',
    title: 'Focus indicator is visible',
    instructions:
      'Tab through all interactive elements and confirm every focused element has a clearly visible ' +
      'focus indicator. Disable custom CSS and retest if any indicator is missing.',
  },
  {
    criterionId: '2.5.3',
    title: 'Accessible name matches visible label',
    instructions:
      'For buttons and links with visible text, confirm the accessible name (aria-label or computed name) ' +
      'contains the visible label text so voice control users can activate by speaking what they see.',
  },
  {
    criterionId: '3.2.1',
    title: 'No unexpected context change on focus',
    instructions:
      'Tab through all focusable elements and verify that receiving focus never triggers a ' +
      'navigation, form submission, or other context change without user intent.',
  },
  {
    criterionId: '3.2.2',
    title: 'No unexpected context change on input',
    instructions:
      'Interact with all form controls (checkboxes, selects, radio buttons) and verify that ' +
      'changing a value does not automatically submit the form or navigate away.',
  },
  {
    criterionId: '3.3.3',
    title: 'Error messages suggest corrections',
    instructions:
      'Trigger validation errors on all forms. Verify that error messages describe not only what ' +
      'is wrong but also how to fix it (e.g., "Date must be in MM/DD/YYYY format").',
  },
  {
    criterionId: '3.3.4',
    title: 'Legal/financial submissions are reversible',
    instructions:
      'For forms that submit legal commitments, financial transactions, or user data: ' +
      'verify submissions can be checked, confirmed, and reversed/corrected before final commit.',
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Group criteria by automation status and principle for the coverage report. */
export function getCoverageStats(): {
  byStatus: Record<AutomationStatus, number>;
  byPrinciple: Record<WcagPrinciple, Record<AutomationStatus, number>>;
  total: number;
} {
  const byStatus: Record<AutomationStatus, number> = { full: 0, partial: 0, manual: 0 };
  const byPrinciple: Record<WcagPrinciple, Record<AutomationStatus, number>> = {
    perceivable:    { full: 0, partial: 0, manual: 0 },
    operable:       { full: 0, partial: 0, manual: 0 },
    understandable: { full: 0, partial: 0, manual: 0 },
    robust:         { full: 0, partial: 0, manual: 0 },
  };

  for (const c of WCAG_CRITERIA) {
    byStatus[c.automation]++;
    byPrinciple[c.principle][c.automation]++;
  }

  return { byStatus, byPrinciple, total: WCAG_CRITERIA.length };
}
