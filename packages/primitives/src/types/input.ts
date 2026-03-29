import type { BaseProps, ColorValue, SpaceValue, FontSize } from "./common.js";

/**
 * <Input> — the universal form input primitive.
 *
 * Maps to:
 *   Web    → <input> or <textarea> (when `multiline` is true)
 *   Native → <TextInput> from react-native
 *   Email  → static display of the field label only
 *             (email clients have no form runtime — inputs are rendered
 *              as a styled placeholder with the label text)
 *
 * Design intent: covers all text-entry scenarios. Checkbox, Select, and
 * other input types will be separate primitives in a future task.
 */

export type InputType =
  | "text"
  | "email"
  | "password"
  | "number"
  | "tel"
  | "url"
  | "search";

export type InputVariant = "outline" | "filled" | "underline";

export interface InputProps extends BaseProps {
  /** HTML input type. Drives the virtual keyboard on Native. Defaults to "text". */
  type?: InputType;

  /** Visual style variant. Defaults to "outline". */
  variant?: InputVariant;

  /** Floating or static label displayed above the field. */
  fieldLabel?: string;

  /** Ghost text shown when the field is empty. */
  placeholder?: string;

  /** Controlled value. */
  value?: string;

  /** Uncontrolled default value. */
  defaultValue?: string;

  /** Whether the field accepts multiple lines (maps to <textarea> on web). */
  multiline?: boolean;

  /** Number of visible rows when multiline is true. */
  rows?: number;

  /** Maximum character length. */
  maxLength?: number;

  /** Marks the field as required — adds aria-required and native validation. */
  required?: boolean;

  /** Disabled state. */
  disabled?: boolean;

  /** Read-only state — value is shown but not editable. */
  readOnly?: boolean;

  /**
   * Error message. When present, the field renders in an error state
   * and the message is displayed below the input with role="alert".
   */
  error?: string;

  /**
   * Helper text displayed below the field when there is no error.
   * Replaces `error` when both are set.
   */
  hint?: string;

  /** Leading icon name (resolved by the target's icon system). */
  leadingIcon?: string;

  /** Trailing icon name. */
  trailingIcon?: string;

  /** Font size override. */
  size?: FontSize;

  /** Background color override. */
  background?: ColorValue;

  /** Border color override. */
  borderColor?: ColorValue;

  /** Padding override. */
  padding?: SpaceValue;
  paddingX?: SpaceValue;
  paddingY?: SpaceValue;

  /**
   * Change handler.
   * Not rendered in the Email bundle (email has no JS runtime).
   */
  onChange?: (value: string) => void;

  /**
   * Submit handler — fired when the user presses Enter (web)
   * or the return key (Native).
   */
  onSubmit?: (value: string) => void;

  /**
   * Whether and how autocomplete suggestions are provided.
   * Only meaningful when the input has a predictive popup (e.g. a combobox).
   */
  "aria-autocomplete"?: "none" | "inline" | "list" | "both";

  /**
   * ID of the element containing the error message for this field.
   * Complements the `error` prop — use when the error message element has a known ID.
   */
  "aria-errormessage"?: string;

  /**
   * ID of the currently focused descendant in a composite widget
   * (e.g. a combobox with an active listbox option).
   */
  "aria-activedescendant"?: string;
}
