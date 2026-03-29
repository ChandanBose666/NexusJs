/**
 * Shared token types used across all four primitives.
 * Values are intentionally design-token-shaped so the universal
 * theme system (Task 2.3) can inject variables into all render targets.
 */

// ---------------------------------------------------------------------------
// Spacing
// ---------------------------------------------------------------------------

export type SpaceScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

export type SpaceValue = SpaceScale | `${number}px` | `${number}%`;

// ---------------------------------------------------------------------------
// Color
// ---------------------------------------------------------------------------

/** Semantic color tokens — resolved by the active theme. */
export type ColorToken =
  | "background"
  | "surface"
  | "border"
  | "primary"
  | "primary-fg"
  | "secondary"
  | "secondary-fg"
  | "success"
  | "warning"
  | "danger"
  | "muted"
  | "muted-fg";

export type ColorValue = ColorToken | `#${string}` | `rgb(${string})` | `hsl(${string})`;

// ---------------------------------------------------------------------------
// Typography
// ---------------------------------------------------------------------------

export type FontSize = "xs" | "sm" | "base" | "lg" | "xl" | "2xl" | "3xl" | "4xl";

export type FontWeight = "regular" | "medium" | "semibold" | "bold";

export type TextAlign = "start" | "center" | "end";

// ---------------------------------------------------------------------------
// Universal ARIA props available on every primitive
// ---------------------------------------------------------------------------

/**
 * ARIA attributes shared across all four primitives.
 * Renderers that cannot express a given attribute (e.g. email) silently ignore it.
 */
export interface AriaBaseProps {
  /** Remove the element from the accessibility tree entirely. */
  "aria-hidden"?: boolean | "true" | "false";
  /** ID of an element that provides a longer description of this one. */
  "aria-describedby"?: string;
  /** ID of an element that labels this one (overrides aria-label / label). */
  "aria-labelledby"?: string;
}

// ---------------------------------------------------------------------------
// Shared style props available on every primitive
// ---------------------------------------------------------------------------

export interface BaseProps extends AriaBaseProps {
  /** Accessible label, rendered as aria-label or equivalent. */
  label?: string;
  /** Test and analytics ID, injected as data-testid. */
  testId?: string;
}
