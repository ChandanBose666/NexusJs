/**
 * Web Action renderer — ARIA prop tests.
 */

import { render, screen } from "@testing-library/react";
import { Action } from "../Action.js";

describe("Action — ARIA props", () => {
  it("renders with role prop as HTML role attribute", () => {
    const { container } = render(<Action role="menuitem" label="Menu item">Item</Action>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("role", "menuitem");
  });

  it("renders aria-expanded on the button", () => {
    const { container } = render(
      <Action aria-expanded={true} label="Toggle">Open</Action>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-expanded", "true");
  });

  it("renders aria-pressed on the button", () => {
    const { container } = render(
      <Action aria-pressed={true} label="Press me">Pressed</Action>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-pressed", "true");
  });

  it("renders aria-haspopup on the button", () => {
    const { container } = render(
      <Action aria-haspopup="menu" label="Dropdown">Open menu</Action>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-haspopup", "menu");
  });

  it("renders aria-controls on the button", () => {
    const { container } = render(
      <Action aria-controls="panel-1" label="Toggle panel">Toggle</Action>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-controls", "panel-1");
  });

  it("renders aria-selected on the button", () => {
    const { container } = render(
      <Action aria-selected={true} label="Tab">Tab 1</Action>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-selected", "true");
  });

  it("renders aria-hidden on the button", () => {
    const { container } = render(
      <Action aria-hidden={true} label="Decorative">×</Action>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders aria-describedby on the button", () => {
    const { container } = render(
      <Action aria-describedby="help-text" label="Submit">Submit</Action>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-describedby", "help-text");
  });

  it("renders aria-labelledby on the button", () => {
    const { container } = render(
      <Action aria-labelledby="heading-id" label="Action">Go</Action>
    );
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-labelledby", "heading-id");
  });

  it("TypeScript: label is required when no children", () => {
    // Verifies discriminated union: this must not show a type error
    const el = <Action label="Accessible" />;
    expect(el).toBeTruthy();
  });

  it("TypeScript: label is optional when children present", () => {
    const el = <Action>Click me</Action>;
    expect(el).toBeTruthy();
  });
});
