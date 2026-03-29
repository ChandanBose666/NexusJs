/**
 * Web Stack renderer — ARIA prop tests.
 */

import { render } from "@testing-library/react";
import { Stack } from "../Stack.js";

describe("Stack — ARIA props", () => {
  it("renders role prop as HTML role attribute", () => {
    const { container } = render(<Stack role="navigation">Nav</Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("role", "navigation");
  });

  it("renders aria-live prop", () => {
    const { container } = render(<Stack aria-live="polite">Status</Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-live", "polite");
  });

  it("renders aria-atomic prop", () => {
    const { container } = render(<Stack aria-atomic={true}>Atomic</Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-atomic", "true");
  });

  it("renders aria-hidden prop", () => {
    const { container } = render(<Stack aria-hidden={true}>Hidden</Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders aria-describedby prop", () => {
    const { container } = render(<Stack aria-describedby="desc-id">Content</Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-describedby", "desc-id");
  });

  it("renders aria-labelledby prop", () => {
    const { container } = render(<Stack aria-labelledby="label-id">Content</Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("renders assertive live region", () => {
    const { container } = render(<Stack aria-live="assertive">Alert</Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-live", "assertive");
  });

  it("renders off live region", () => {
    const { container } = render(<Stack aria-live="off">Static</Stack>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-live", "off");
  });
});
