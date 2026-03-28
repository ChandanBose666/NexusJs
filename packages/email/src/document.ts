import { DEFAULT_THEME } from "./lib/tokens.js";

export interface WrapDocumentOptions {
  /** Email subject line — used as the <title> in the HTML head. */
  title?: string;
  /** Preview text shown in email client inboxes before the email is opened. */
  previewText?: string;
  /** Background color of the outermost email shell. Defaults to DEFAULT_THEME.background. */
  backgroundColor?: string;
  /** Maximum width of the content column in pixels. Defaults to 600. */
  maxWidth?: number;
}

/**
 * Wraps a rendered HTML fragment in a full, MSO-safe email document.
 *
 * Email clients require a specific boilerplate structure:
 *   - HTML4-style DOCTYPE (required for Outlook rendering engine)
 *   - Explicit charset and viewport meta tags
 *   - Reset styles in a <style> block (stripped by some clients but helpful for others)
 *   - A centering shell table to contain the content column
 *
 * @param body  — HTML fragment produced by composing Stack/Text/Action/Input calls
 * @param opts  — document-level options
 */
export function wrapDocument(body: string, opts: WrapDocumentOptions = {}): string {
  const {
    title          = "Email",
    previewText,
    backgroundColor = DEFAULT_THEME.background,
    maxWidth        = 600,
  } = opts;

  // Invisible preview text filler — pads the snippet so email clients
  // don't pull body copy into the inbox preview.
  const preview = previewText !== undefined
    ? `<div style="display:none;max-height:0;overflow:hidden;">` +
      previewText +
      // Zero-width non-breaking spaces fill out the snippet
      `&nbsp;&zwnj;`.repeat(Math.max(0, 100 - previewText.length)) +
      `</div>`
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml>
  </noscript>
  <![endif]-->
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
    body { margin: 0 !important; padding: 0 !important; width: 100% !important; }
  </style>
</head>
<body style="margin:0;padding:0;background-color:${backgroundColor};">
  ${preview}
  <!-- Outer centering shell -->
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%"
         style="border-collapse:collapse;background-color:${backgroundColor};">
    <tr>
      <td align="center" valign="top" style="padding:24px 16px;">
        <!-- Content column -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"
               width="${maxWidth}" style="border-collapse:collapse;width:${maxWidth}px;max-width:${maxWidth}px;">
          <tr>
            <td>
              ${body}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
