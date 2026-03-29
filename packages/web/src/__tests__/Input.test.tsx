/**
 * Web Input renderer — ARIA prop tests.
 */

import { render } from "@testing-library/react";
import { Input } from "../Input.js";

describe("Input — ARIA props", () => {
  it("renders aria-autocomplete on the input element", () => {
    const { container } = render(
      <Input aria-autocomplete="list" label="Search" />
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
  });

  it("renders aria-errormessage on the input element", () => {
    const { container } = render(
      <Input aria-errormessage="err-id" label="Email" />
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-errormessage", "err-id");
  });

  it("renders aria-activedescendant on the input element", () => {
    const { container } = render(
      <Input aria-activedescendant="option-1" label="Combo" />
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-activedescendant", "option-1");
  });

  it("renders aria-hidden on the outer wrapper div", () => {
    const { container } = render(
      <Input aria-hidden={true} label="Hidden input" />
    );
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveAttribute("aria-hidden", "true");
  });

  it("renders aria-describedby on the input element (not the wrapper)", () => {
    const { container } = render(
      <Input aria-describedby="desc-id" label="Name" />
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-describedby", "desc-id");
    // wrapper must NOT carry it — association only works on the focusable control
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveAttribute("aria-describedby");
  });

  it("renders aria-labelledby on the input element (not the wrapper)", () => {
    const { container } = render(
      <Input aria-labelledby="heading-id" label="Name" />
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-labelledby", "heading-id");
    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).not.toHaveAttribute("aria-labelledby");
  });

  it("renders aria-invalid=true when error is set", () => {
    const { container } = render(
      <Input error="Required" label="Email" />
    );
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("does not render aria-invalid when no error", () => {
    const { container } = render(<Input label="Email" />);
    const input = container.querySelector("input");
    expect(input).not.toHaveAttribute("aria-invalid");
  });
});
