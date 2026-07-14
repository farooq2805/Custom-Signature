import type { SignatureData, SocialPlatform } from "./types";

/**
 * Email-safe signature HTML generator.
 *
 * THE TRADEOFF, EXPLAINED
 * -----------------------
 * Email clients are a hostile rendering environment: Gmail strips <style>
 * blocks and all JS; Outlook (Word engine) ignores flexbox, border-radius on
 * some versions, CSS animations, and :hover. So the "interactive" signature
 * cannot literally live inside the email body.
 *
 * Our strategy:
 *  1. WHAT'S EMBEDDED IN THE EMAIL is this file's output — a bulletproof
 *     table-based layout with 100% inline CSS. No <style>, no JS, no web
 *     fonts, no tracking pixels (invisible 1x1 images are a spam-filter
 *     signal and hurt deliverability).
 *  2. MOTION degrades gracefully: the logo slot can reference an animated
 *     GIF/APNG rendered by the platform (animated in Gmail/Apple Mail;
 *     Outlook shows the first frame — which we make the complete, static
 *     logo, so nothing looks broken).
 *  3. INTERACTIVITY is preserved through links, the one thing every client
 *     supports: every tappable element routes through the hosted
 *     click-tracking redirect (/api/t/:id?k=…&to=…), which logs the click
 *     and 302s to the real destination. The full hover-animated experience
 *     lives on the hosted page (/s/:slug) that the signature links to.
 *  4. IMPRESSIONS are counted when the brand-logo image is served from our
 *     CDN route — a real, visible brand asset the user chose to include,
 *     not a hidden pixel.
 */

const SOCIAL_LABELS: Record<SocialPlatform, string> = {
  website: "Web",
  linkedin: "in",
  instagram: "IG",
  facebook: "f",
  youtube: "▶",
  x: "𝕏",
};

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function initials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export interface EmailHtmlOptions {
  /** Absolute origin for tracked links + served images, e.g. https://sigcraft.app */
  baseUrl: string;
}

/** Wrap a destination through the click-tracking redirect. */
function track(baseUrl: string, sigId: string, key: string, to: string): string {
  return `${baseUrl}/api/t/${encodeURIComponent(sigId)}?k=${encodeURIComponent(key)}&to=${encodeURIComponent(to)}`;
}

export function buildEmailHtml(data: SignatureData, opts: EmailHtmlOptions): string {
  const { baseUrl } = opts;
  const brand = data.brandColor || "#4f46e5";
  const muted = "#55556b";
  const faint = "#8a8aa0";

  // Logo cell: served through our impression-counting asset route when the
  // user uploaded one (and it can be the animated GIF variant); otherwise a
  // solid-color monogram table cell that renders identically everywhere.
  const logoSrc = data.logoUrl
    ? `${baseUrl}/api/logo/${encodeURIComponent(data.id)}`
    : null;
  const logoCell = logoSrc
    ? `<img src="${esc(logoSrc)}" width="56" height="56" alt="${esc(data.company)} logo" style="display:block;border-radius:12px;border:0;outline:none;" />`
    : `<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;"><tr><td align="center" valign="middle" width="56" height="56" style="width:56px;height:56px;border-radius:12px;background-color:${esc(brand)};font-family:Arial,Helvetica,sans-serif;font-size:20px;font-weight:bold;color:#ffffff;">${esc(initials(data.company || data.name))}</td></tr></table>`;

  // Verified badge: a unicode check in a colored span — no image request, no
  // client can strip it. Links to the hosted verification page for the tooltip
  // equivalent ("Verified Sender" explanation lives one click away).
  const badge = data.verifiedBadge
    ? `&nbsp;<a href="${track(baseUrl, data.id, "badge", `${baseUrl}/s/${encodeURIComponent(data.slug)}#verified`)}" style="text-decoration:none;color:${esc(brand)};font-size:13px;" title="Verified Sender">&#10004;&#65039;</a>`
    : "";

  const socialEntries = (Object.entries(data.socials) as [SocialPlatform, string][]).filter(
    ([, url]) => url
  );

  // Social nav: real text-label chips (hover isn't available, so legibility
  // beats iconography). Every chip is a tracked link.
  const socialRow = socialEntries.length
    ? `<tr><td style="padding-top:10px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
          ${socialEntries
            .map(
              ([platform, url]) =>
                `<td style="padding-right:6px;"><a href="${track(baseUrl, data.id, platform, url)}" style="display:inline-block;padding:4px 10px;border:1px solid #e7e7e2;border-radius:999px;font-family:Arial,Helvetica,sans-serif;font-size:11px;font-weight:bold;color:${esc(brand)};text-decoration:none;">${SOCIAL_LABELS[platform]}</a></td>`
            )
            .join("")}
        </tr></table>
      </td></tr>`
    : "";

  const contactBits: string[] = [];
  if (data.phone)
    contactBits.push(
      `<a href="tel:${esc(data.phone.replace(/[^+\d]/g, ""))}" style="color:${muted};text-decoration:none;">${esc(data.phone)}</a>`
    );
  if (data.email)
    contactBits.push(
      `<a href="mailto:${esc(data.email)}" style="color:${muted};text-decoration:none;">${esc(data.email)}</a>`
    );
  if (data.website)
    contactBits.push(
      `<a href="${track(baseUrl, data.id, "website", data.website)}" style="color:${muted};text-decoration:none;">${esc(data.website.replace(/^https?:\/\//, ""))}</a>`
    );

  const contactRow = contactBits.length
    ? `<tr><td style="padding-top:6px;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:${muted};">${contactBits.join(
        `&nbsp;&nbsp;<span style="color:#e7e7e2;">|</span>&nbsp;&nbsp;`
      )}</td></tr>`
    : "";

  // CTA: a real bulletproof button (padded td with background-color — the
  // only button pattern Outlook renders reliably). Routed through tracking.
  const ctaRow = data.ctaText
    ? `<tr><td style="padding-top:14px;">
        <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:separate;"><tr>
          <td align="center" style="border-radius:999px;background-color:${esc(brand)};">
            <a href="${track(baseUrl, data.id, "cta", data.ctaUrl)}" style="display:inline-block;padding:9px 22px;font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:bold;color:#ffffff;text-decoration:none;border-radius:999px;">${esc(data.ctaText)} &rarr;</a>
          </td>
        </tr></table>
      </td></tr>`
    : "";

  return `<!-- SigCraft signature · edit at ${baseUrl} -->
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;max-width:480px;">
  <tr>
    <td valign="top" style="padding-right:16px;">${logoCell}</td>
    <td valign="top">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:15px;font-weight:bold;color:#0a0a0f;">${esc(data.name)}${badge}</td>
        </tr>
        <tr>
          <td style="padding-top:2px;font-family:Arial,Helvetica,sans-serif;font-size:13px;color:${muted};">${esc(data.title)}${data.title && data.company ? " &middot; " : ""}<span style="color:${esc(brand)};font-weight:bold;">${esc(data.company)}</span></td>
        </tr>
        ${contactRow}
        ${socialRow}
        ${ctaRow}
        <tr>
          <td style="padding-top:12px;font-family:Arial,Helvetica,sans-serif;font-size:10px;color:${faint};">
            <a href="${track(baseUrl, data.id, "hosted", `${baseUrl}/s/${encodeURIComponent(data.slug)}`)}" style="color:${faint};text-decoration:underline;">View interactive card</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`;
}

/** Plain-text fallback for clients/settings that render no HTML at all. */
export function buildPlainText(data: SignatureData, opts: EmailHtmlOptions): string {
  const lines = [
    `${data.name}${data.verifiedBadge ? " ✔" : ""}`,
    [data.title, data.company].filter(Boolean).join(" · "),
    [data.phone, data.email].filter(Boolean).join(" | "),
    data.website,
    data.ctaText ? `${data.ctaText}: ${track(opts.baseUrl, data.id, "cta", data.ctaUrl)}` : "",
  ];
  return lines.filter(Boolean).join("\n");
}
