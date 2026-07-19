"use client";

/**
 * SignatureCard — the interactive signature.
 *
 * This is the *rich* rendition: hover-animated logo, interactive social nav,
 * verification-badge tooltip, pulsing tracked CTA. It is used in three places:
 *   1. The marketing hero / interactive demo section
 *   2. The editor's live WYSIWYG preview
 *   3. The hosted signature page at /s/[slug]
 *
 * IMPORTANT — email-client reality: most email clients (Gmail, Outlook,
 * Yahoo) strip <style> blocks, JS, and most CSS animation. So this React
 * component is NOT what gets pasted into an email. The email gets the
 * table-based, inline-CSS fallback from `emailHtml.ts`; interaction is
 * preserved by routing every link through the hosted click-tracking
 * redirect, and the "wow" version lives on the hosted page this card also
 * powers. See src/lib/emailHtml.ts for the full degradation strategy.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  BadgeCheck,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";
import type { SignatureData, SocialPlatform } from "@/lib/types";
import { templateById } from "@/lib/templates";

const SOCIAL_ICONS: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  website: Globe,
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  youtube: Youtube,
  x: XIcon,
};

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

/** Brand mark: uploaded logo if present, otherwise an animated monogram. */
function LogoMark({
  data,
  size = 56,
}: {
  data: SignatureData;
  size?: number;
}) {
  const anim = data.animationStyle;
  const wrapperAnim =
    anim === "bold"
      ? { rotate: [0, -6, 6, 0], scale: [1, 1.08, 1] }
      : anim === "subtle"
        ? { scale: [1, 1.04, 1] }
        : {};

  return (
    <motion.div
      whileHover={anim === "none" ? undefined : wrapperAnim}
      transition={{ duration: 0.7, ease: "easeInOut" }}
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-2xl ${
        anim === "subtle" ? "sig-logo-subtle" : ""
      }`}
      style={{ width: size, height: size, background: data.brandColor }}
    >
      {data.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={data.logoUrl}
          alt={`${data.company} logo`}
          className="h-full w-full object-cover"
        />
      ) : (
        <span
          className="font-display font-bold text-white"
          style={{ fontSize: size * 0.38 }}
        >
          {initials(data.company || data.name)}
        </span>
      )}
    </motion.div>
  );
}

function Avatar({ data, size = 56 }: { data: SignatureData; size?: number }) {
  if (data.photoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={data.photoUrl}
        alt={data.name}
        className="shrink-0 rounded-full object-cover ring-2 ring-white"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full text-white ring-2 ring-white"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, ${data.brandColor}, ${data.brandColor}bb)`,
      }}
    >
      <span className="font-display font-semibold" style={{ fontSize: size * 0.36 }}>
        {initials(data.name)}
      </span>
    </div>
  );
}

function VerifiedBadge({ color }: { color: string }) {
  const [show, setShow] = useState(false);
  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <BadgeCheck className="h-4 w-4" style={{ color }} aria-label="Verified sender" />
      <AnimatePresence>
        {show && (
          <motion.span
            initial={{ opacity: 0, y: 6, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute -top-9 left-1/2 z-20 -translate-x-1/2 whitespace-nowrap rounded-lg bg-ink px-2.5 py-1 text-[11px] font-medium text-white shadow-[--shadow-pop]"
          >
            Verified Sender
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-ink" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

/** Interactive mini nav row: website + social icons that light up on hover. */
function SocialRow({ data, trackBase }: { data: SignatureData; trackBase?: string }) {
  const entries = (Object.entries(data.socials) as [SocialPlatform, string][]).filter(
    ([, url]) => url
  );
  if (!entries.length) return null;
  return (
    <div className="flex items-center gap-1.5">
      {entries.map(([platform, url]) => {
        const Icon = SOCIAL_ICONS[platform];
        return (
          <motion.a
            key={platform}
            href={trackBase ? `${trackBase}?k=${platform}&to=${encodeURIComponent(url)}` : url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={platform}
            whileHover={{ scale: 1.18, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className="group flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-faint transition-colors"
            style={{ ["--hover" as string]: data.brandColor }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = data.brandColor;
              (e.currentTarget as HTMLElement).style.borderColor = data.brandColor;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = "";
              (e.currentTarget as HTMLElement).style.borderColor = "";
            }}
          >
            <Icon className="h-3.5 w-3.5" />
          </motion.a>
        );
      })}
    </div>
  );
}

function CtaButton({ data, trackBase }: { data: SignatureData; trackBase?: string }) {
  if (!data.ctaText) return null;
  return (
    <motion.a
      href={
        trackBase ? `${trackBase}?k=cta&to=${encodeURIComponent(data.ctaUrl)}` : data.ctaUrl
      }
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex w-fit items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white ${
        data.animationStyle !== "none" ? "sig-cta-pulse" : ""
      }`}
      style={{ background: data.brandColor }}
    >
      {data.ctaText}
      <span aria-hidden>→</span>
    </motion.a>
  );
}

/* ------------------------------------------------------------------ */

export function SignatureCard({
  data,
  trackBase,
  className = "",
}: {
  data: SignatureData;
  /** e.g. "/api/t/sig-1" — when set, every link routes through click tracking */
  trackBase?: string;
  className?: string;
}) {
  const template = templateById(data.templateId);
  const order = data.elementOrder?.length
    ? data.elementOrder
    : (["identity", "contact", "socials", "cta"] as const);

  const identity = (
    <div key="identity" className="flex items-center gap-3">
      {template.layout !== "stacked" && <Avatar data={data} size={template.layout === "minimal" ? 44 : 56} />}
      <div>
        <p className="flex items-center gap-1.5 font-display text-[15px] font-semibold leading-tight text-ink">
          {data.name}
          {data.verifiedBadge && <VerifiedBadge color={data.brandColor} />}
        </p>
        <p className="text-[13px] leading-snug text-ink-muted">
          {data.title}
          {data.title && data.company ? " · " : ""}
          <span style={{ color: data.brandColor }} className="font-medium">
            {data.company}
          </span>
        </p>
      </div>
    </div>
  );

  const contact = (
    <div key="contact" className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-ink-muted">
      {data.phone && (
        <a href={`tel:${data.phone}`} className="flex items-center gap-1.5 hover:text-ink">
          <Phone className="h-3 w-3" /> {data.phone}
        </a>
      )}
      {data.email && (
        <a href={`mailto:${data.email}`} className="flex items-center gap-1.5 hover:text-ink">
          <Mail className="h-3 w-3" /> {data.email}
        </a>
      )}
    </div>
  );

  const socials = <SocialRow key="socials" data={data} trackBase={trackBase} />;
  const cta = <CtaButton key="cta" data={data} trackBase={trackBase} />;

  const blocks: Record<string, React.ReactNode> = { identity, contact, socials, cta };
  const ordered = order.map((k) => blocks[k]).filter(Boolean);

  return (
    <div
      className={`w-fit rounded-3xl border border-line bg-white p-6 shadow-[--shadow-card] ${className}`}
      data-signature-id={data.id}
    >
      {template.layout === "stacked" ? (
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center gap-3">
            <LogoMark data={data} size={48} />
            <Avatar data={data} size={48} />
          </div>
          {ordered}
        </div>
      ) : template.layout === "banner" ? (
        <div className="flex flex-col gap-3.5">
          <div
            className="-m-6 mb-0 flex items-center gap-3 rounded-t-3xl px-6 py-3"
            style={{ background: `${data.brandColor}14` }}
          >
            <LogoMark data={data} size={36} />
            <span className="font-display text-sm font-semibold" style={{ color: data.brandColor }}>
              {data.company}
            </span>
          </div>
          {ordered}
        </div>
      ) : (
        <div className="flex items-start gap-5">
          <LogoMark data={data} size={template.layout === "minimal" ? 44 : 56} />
          <div className="flex flex-col gap-3">{ordered}</div>
        </div>
      )}
    </div>
  );
}
