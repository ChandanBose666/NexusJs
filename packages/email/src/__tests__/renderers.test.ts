/**
 * Email renderer unit tests.
 *
 * All tests operate on HTML strings — no DOM, no React, no jsdom required.
 * Tests assert structural correctness and key attribute/style presence.
 */

import { Stack }         from "../Stack.js";
import { Text }          from "../Text.js";
import { Action }        from "../Action.js";
import { Input }         from "../Input.js";
import { wrapDocument }  from "../document.js";

// ---------------------------------------------------------------------------
// Stack
// ---------------------------------------------------------------------------

describe("Stack", () => {
  it("renders a table wrapper", () => {
    const html = Stack({ children: "content" });
    expect(html).toContain("<table");
    expect(html).toContain("content");
    expect(html).toContain("</table>");
  });

  it("applies background color from ColorToken", () => {
    const html = Stack({ background: "primary", children: "" });
    expect(html).toContain("#6366f1");
  });

  it("applies background color from hex literal", () => {
    const html = Stack({ background: "#ff0000", children: "" });
    expect(html).toContain("#ff0000");
  });

  it("applies padding from SpaceScale", () => {
    const html = Stack({ padding: 4, children: "" });
    expect(html).toContain("padding-top:16px");
    expect(html).toContain("padding-right:16px");
    expect(html).toContain("padding-bottom:16px");
    expect(html).toContain("padding-left:16px");
  });

  it("paddingX overrides left/right only", () => {
    const html = Stack({ padding: 2, paddingX: 6, children: "" });
    expect(html).toContain("padding-top:8px");
    expect(html).toContain("padding-left:24px");
    expect(html).toContain("padding-right:24px");
  });

  it("includes aria-label when label is set", () => {
    const html = Stack({ label: "section", children: "" });
    expect(html).toContain('aria-label="section"');
  });

  it("uses row layout for direction row", () => {
    const html = Stack({ direction: "row", children: "<td>A</td><td>B</td>" });
    expect(html).toContain("<tr");
    expect(html).not.toContain("<td valign");
  });

  it("renders nested children as concatenated strings", () => {
    const child1 = Text({ variant: "body", children: "Hello" });
    const child2 = Text({ variant: "body", children: "World" });
    const html = Stack({ children: [child1, child2] });
    expect(html).toContain("Hello");
    expect(html).toContain("World");
  });
});

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

describe("Text", () => {
  it("renders body variant as <p>", () => {
    const html = Text({ variant: "body", children: "Hello" });
    expect(html).toMatch(/^<p /);
    expect(html).toContain(">Hello</p>");
  });

  it("renders heading variant as <h2> by default", () => {
    const html = Text({ variant: "heading", children: "Title" });
    expect(html).toMatch(/^<h2 /);
    expect(html).toContain(">Title</h2>");
  });

  it("as prop overrides the default tag", () => {
    const html = Text({ variant: "heading", as: "h3", children: "Sub" });
    expect(html).toMatch(/^<h3 /);
    expect(html).toContain(">Sub</h3>");
  });

  it("applies font-size from size prop", () => {
    const html = Text({ variant: "body", size: "xl", children: "Hi" });
    expect(html).toContain("font-size:20px");
  });

  it("applies font-weight from weight prop", () => {
    const html = Text({ variant: "body", weight: "bold", children: "Hi" });
    expect(html).toContain("font-weight:700");
  });

  it("applies text-align for align=center", () => {
    const html = Text({ variant: "body", align: "center", children: "Hi" });
    expect(html).toContain("text-align:center");
  });

  it("applies underline decoration", () => {
    const html = Text({ variant: "body", underline: true, children: "Hi" });
    expect(html).toContain("text-decoration:underline");
  });

  it("applies both underline and strikethrough", () => {
    const html = Text({ variant: "body", underline: true, strikethrough: true, children: "Hi" });
    expect(html).toContain("underline line-through");
  });

  it("escapes HTML special characters in children", () => {
    const html = Text({ variant: "body", children: "5 < 10 & 3 > 1" });
    expect(html).toContain("5 &lt; 10 &amp; 3 &gt; 1");
  });

  it("renders code variant with monospace font", () => {
    const html = Text({ variant: "code", children: "const x = 1" });
    expect(html).toContain("monospace");
  });
});

// ---------------------------------------------------------------------------
// Action
// ---------------------------------------------------------------------------

describe("Action", () => {
  it("always renders as <a>", () => {
    const html = Action({ children: "Click" });
    expect(html).toMatch(/^<a /);
    expect(html).toContain("</a>");
  });

  it("uses href when provided", () => {
    const html = Action({ href: "https://example.com", children: "Go" });
    expect(html).toContain('href="https://example.com"');
  });

  it("defaults to href='#' when no href is provided", () => {
    const html = Action({ children: "Click" });
    expect(html).toContain('href="#"');
  });

  it("adds target=_blank for external links", () => {
    const html = Action({ href: "https://example.com", external: true, children: "Open" });
    expect(html).toContain('target="_blank"');
    expect(html).toContain("noopener noreferrer");
  });

  it("applies primary variant background color", () => {
    const html = Action({ variant: "primary", children: "CTA" });
    expect(html).toContain("#6366f1");
  });

  it("applies danger variant background color", () => {
    const html = Action({ variant: "danger", children: "Delete" });
    expect(html).toContain("#ef4444");
  });

  it("applies opacity for disabled state", () => {
    const html = Action({ disabled: true, children: "Off" });
    expect(html).toContain("opacity:0.5");
  });

  it("applies opacity for loading state", () => {
    const html = Action({ loading: true, children: "Wait" });
    expect(html).toContain("opacity:0.5");
  });

  it("link variant has no background and uses underline", () => {
    const html = Action({ variant: "link", children: "Learn more" });
    expect(html).toContain("text-decoration:underline");
    expect(html).toContain("background-color:transparent");
  });

  it("escapes href attribute values", () => {
    const html = Action({ href: 'https://example.com?a="1"', children: "Go" });
    expect(html).toContain("&quot;");
  });
});

// ---------------------------------------------------------------------------
// Input
// ---------------------------------------------------------------------------

describe("Input", () => {
  it("renders a static label", () => {
    const html = Input({ fieldLabel: "Email address" });
    expect(html).toContain("Email address");
  });

  it("shows required marker when required=true", () => {
    const html = Input({ fieldLabel: "Name", required: true });
    expect(html).toContain("*");
    expect(html).toContain("#ef4444");
  });

  it("renders placeholder as static text", () => {
    const html = Input({ placeholder: "you@example.com" });
    expect(html).toContain("you@example.com");
  });

  it("renders error message with role=alert", () => {
    const html = Input({ fieldLabel: "Email", error: "Invalid email" });
    expect(html).toContain('role="alert"');
    expect(html).toContain("Invalid email");
  });

  it("renders hint text when no error", () => {
    const html = Input({ fieldLabel: "Email", hint: "We'll never share your email." });
    expect(html).toContain("We'll never share your email.");
  });

  it("error takes priority over hint", () => {
    const html = Input({ fieldLabel: "Email", error: "Bad", hint: "Tip" });
    expect(html).toContain("Bad");
    expect(html).not.toContain("Tip");
  });

  it("renders nothing interactive (no <input> tag)", () => {
    const html = Input({ fieldLabel: "Email" });
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<textarea");
  });
});

// ---------------------------------------------------------------------------
// wrapDocument
// ---------------------------------------------------------------------------

describe("wrapDocument", () => {
  it("produces a valid HTML document structure", () => {
    const html = wrapDocument("<p>Hello</p>");
    expect(html).toContain("<!DOCTYPE html");
    expect(html).toContain("<html");
    expect(html).toContain("<head>");
    expect(html).toContain("<body");
    expect(html).toContain("<p>Hello</p>");
    expect(html).toContain("</html>");
  });

  it("includes the title", () => {
    const html = wrapDocument("", { title: "Welcome Email" });
    expect(html).toContain("<title>Welcome Email</title>");
  });

  it("includes preview text", () => {
    const html = wrapDocument("", { previewText: "Check this out" });
    expect(html).toContain("Check this out");
    expect(html).toContain("display:none");
  });

  it("applies custom max width", () => {
    const html = wrapDocument("", { maxWidth: 480 });
    expect(html).toContain("width:480px");
    expect(html).toContain("max-width:480px");
  });

  it("applies custom background color", () => {
    const html = wrapDocument("", { backgroundColor: "#1a1a1a" });
    expect(html).toMatch(/background-color:#1a1a1a/);
  });
});
