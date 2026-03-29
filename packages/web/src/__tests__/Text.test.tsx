/**
 * Web Text renderer — ARIA prop tests.
 */

import { render } from "@testing-library/react";
import { Text } from "../Text.js";

describe("Text — ARIA props", () => {
  it("renders role prop as HTML role attribute", () => {
    const { container } = render(<Text role="note">Note</Text>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("role", "note");
  });

  it("renders aria-hidden prop", () => {
    const { container } = render(<Text aria-hidden={true}>Decorative</Text>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden", "true");
  });

  it("renders aria-describedby prop", () => {
    const { container } = render(<Text aria-describedby="desc-id">Content</Text>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-describedby", "desc-id");
  });

  it("renders aria-labelledby prop", () => {
    const { container } = render(<Text aria-labelledby="label-id">Content</Text>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-labelledby", "label-id");
  });

  it("renders heading role on a body variant", () => {
    const { container } = render(<Text variant="body" role="heading">Title</Text>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("role", "heading");
  });

  it("renders alert role for live text updates", () => {
    const { container } = render(<Text role="alert">Error occurred</Text>);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("role", "alert");
  });
});
