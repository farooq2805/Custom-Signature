"use client";

/**
 * The Signature Builder.
 *  - Left: template gallery
 *  - Center: live preview with Interactive / Gmail / Outlook simulation modes
 *  - Right: content + brand + CTA fields, drag-to-reorder blocks
 */

import { useMemo, useState } from "react";
import { AnimatePresence, motion, Reorder } from "framer-motion";
import {
  Check,
  Copy,
  GripVertical,
  Plus,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { Button, Field, TextInput } from "@/components/ui";
import { SignatureCard } from "@/components/signature/SignatureCard";
import { buildEmailHtml } from "@/lib/emailHtml";
import { TEMPLATES } from "@/lib/templates";
import { useActiveSignature, useSigStore } from "@/lib/store";
import type { AnimationStyle, SignatureElement, SocialPlatform } from "@/lib/types";

type PreviewMode = "interactive" | "gmail" | "outlook";

const ELEMENT_LABELS: Record<SignatureElement, string> = {
  identity: "Name & title",
  contact: "Contact details",
  socials: "Social links",
  cta: "CTA button",
  disclaimer: "Disclaimer",
};

const SOCIAL_FIELDS: { key: SocialPlatform; label: string; placeholder: string }[] = [
  { key: "website", label: "Website", placeholder: "https://yourcompany.com" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/you" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/brand" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/brand" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@brand" },
  { key: "x", label: "X / Twitter", placeholder: "https://x.com/brand" },
];

/** Approximate Outlook's renderer: the Word engine drops border-radius. */
function outlookify(html: string): string {
  return html.replace(/border-radius:[^;"]+;?/g, "");
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function EditorPage() {
  const sig = useActiveSignature();
  const { signatures, activeId, setActive, update, updateSocial, reorder, addSignature, removeSignature } =
    useSigStore();
  const [mode, setMode] = useState<PreviewMode>("interactive");
  const [copied, setCopied] = useState(false);

  const emailHtml = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://sigcraft.app";
    return buildEmailHtml(sig, { baseUrl: origin });
  }, [sig]);

  async function copyHtml() {
    await navigator.clipboard.writeText(emailHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  async function onUpload(field: "logoUrl" | "photoUrl", file: File | undefined) {
    if (!file) return;
    // Demo mode stores a data URL; with Supabase configured this uploads to
    // Storage and stores the public URL instead.
    update({ [field]: await fileToDataUrl(file) });
  }

  return (
    <div className="mx-auto max-w-[1400px]">
      {/* header row: signature switcher + export */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Signature Builder</h1>
          <p className="text-sm text-ink-muted">Changes save automatically and update your hosted signature instantly.</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={activeId}
            onChange={(e) => setActive(e.target.value)}
            className="rounded-xl border border-line bg-white px-3 py-2 text-sm"
            aria-label="Active signature"
          >
            {signatures.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} — {s.templateId}
              </option>
            ))}
          </select>
          <Button variant="secondary" size="sm" onClick={() => addSignature()}>
            <Plus className="h-4 w-4" /> Variant
          </Button>
          {signatures.length > 1 && (
            <button
              onClick={() => removeSignature(activeId)}
              className="rounded-xl border border-line bg-white p-2 text-ink-faint transition hover:text-danger"
              aria-label="Delete signature"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[220px_1fr_320px]">
        {/* ---------------- Left: template gallery ---------------- */}
        <aside className="no-scrollbar flex gap-3 overflow-x-auto xl:block xl:space-y-3 xl:overflow-visible">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => update({ templateId: t.id, brandColor: sig.brandColor })}
              className={`w-44 shrink-0 rounded-2xl border bg-white p-4 text-left transition xl:w-full ${
                sig.templateId === t.id
                  ? "border-accent shadow-[--shadow-glow]"
                  : "border-line hover:border-ink-faint"
              }`}
            >
              <span
                className="mb-3 block h-14 rounded-xl"
                style={{
                  background: `linear-gradient(120deg, ${t.defaultColor}22, ${t.defaultColor}55)`,
                }}
              />
              <span className="block font-display text-sm font-semibold text-ink">{t.name}</span>
              <span className="block text-xs text-ink-faint">
                {t.industryTag} · {t.roleTag}
              </span>
            </button>
          ))}
        </aside>

        {/* ---------------- Center: live preview ---------------- */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-full border border-line bg-white p-1">
              {(
                [
                  ["interactive", "Interactive"],
                  ["gmail", "Gmail"],
                  ["outlook", "Outlook"],
                ] as [PreviewMode, string][]
              ).map(([m, label]) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition ${
                    mode === m ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <Button size="sm" variant="secondary" onClick={copyHtml}>
              {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy email HTML"}
            </Button>
          </div>

          <div className="dot-grid flex min-h-[420px] items-center justify-center rounded-3xl border border-line bg-white/60 p-8">
            <AnimatePresence mode="wait">
              {mode === "interactive" ? (
                <motion.div
                  key="interactive"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  <SignatureCard data={sig} className="shadow-[--shadow-pop]" />
                  <p className="mt-4 text-center text-xs text-ink-faint">
                    This is your hosted card — hover the logo, icons, and badge.
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  key={mode}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-white shadow-[--shadow-pop]"
                >
                  {/* mock client chrome */}
                  <div
                    className={`flex items-center gap-2 border-b border-line px-4 py-2.5 text-xs font-medium ${
                      mode === "gmail" ? "bg-[#f6f8fc] text-[#444746]" : "bg-[#0f6cbd] text-white"
                    }`}
                  >
                    {mode === "gmail" ? "New Message — Gmail" : "New Email — Outlook"}
                  </div>
                  <div className="px-5 py-3 text-xs text-ink-faint">
                    <p className="border-b border-line py-1.5">To: prospect@company.com</p>
                    <p className="border-b border-line py-1.5">Subject: Quick intro</p>
                  </div>
                  <div className="px-5 pb-2 text-sm text-ink-muted">
                    <p>Hi Jordan,</p>
                    <p className="mt-2">Great speaking today — details below.</p>
                    <p className="mt-2 mb-4">Best,</p>
                  </div>
                  <div
                    className="px-5 pb-6"
                    // The exact HTML that will be pasted into the client,
                    // with Outlook's border-radius stripping simulated.
                    dangerouslySetInnerHTML={{
                      __html: mode === "outlook" ? outlookify(emailHtml) : emailHtml,
                    }}
                  />
                  {mode === "outlook" && (
                    <p className="border-t border-line px-5 py-2.5 text-[11px] text-ink-faint">
                      Outlook&apos;s Word engine ignores rounded corners and animation — your
                      signature stays clean and fully clickable.
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* hosted link */}
          <p className="mt-4 text-center text-xs text-ink-faint">
            Hosted at{" "}
            <a href={`/s/${sig.slug}`} target="_blank" className="font-medium text-accent hover:underline">
              /s/{sig.slug}
            </a>{" "}
            · CTA clicks tracked via <code className="rounded bg-cream-dim px-1">/api/t/{sig.id}</code>
          </p>
        </div>

        {/* ---------------- Right: fields ---------------- */}
        <aside className="flex flex-col gap-6">
          <Panel title="Identity">
            <Field label="Full name">
              <TextInput value={sig.name} onChange={(e) => update({ name: e.target.value })} />
            </Field>
            <Field label="Job title">
              <TextInput value={sig.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Company">
              <TextInput value={sig.company} onChange={(e) => update({ company: e.target.value })} />
            </Field>
            <Field label="Phone">
              <TextInput value={sig.phone} onChange={(e) => update({ phone: e.target.value })} />
            </Field>
            <Field label="Email">
              <TextInput value={sig.email} onChange={(e) => update({ email: e.target.value })} />
            </Field>
            <Field label="Website">
              <TextInput value={sig.website} onChange={(e) => update({ website: e.target.value })} />
            </Field>
          </Panel>

          <Panel title="Brand">
            <div className="grid grid-cols-2 gap-3">
              <UploadTile label="Logo" preview={sig.logoUrl} onFile={(f) => onUpload("logoUrl", f)} />
              <UploadTile label="Photo" preview={sig.photoUrl} onFile={(f) => onUpload("photoUrl", f)} />
            </div>
            <Field label="Brand color">
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={sig.brandColor}
                  onChange={(e) => update({ brandColor: e.target.value })}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-line bg-white"
                  aria-label="Brand color"
                />
                <TextInput
                  value={sig.brandColor}
                  onChange={(e) => update({ brandColor: e.target.value })}
                  className="flex-1"
                />
              </div>
            </Field>
            <Field label="Animation style">
              <div className="flex gap-1 rounded-xl border border-line bg-white p-1">
                {(["subtle", "bold", "none"] as AnimationStyle[]).map((a) => (
                  <button
                    key={a}
                    onClick={() => update({ animationStyle: a })}
                    className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-medium capitalize transition ${
                      sig.animationStyle === a ? "bg-ink text-white" : "text-ink-muted"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </Field>
            <label className="flex items-center justify-between rounded-xl border border-line bg-white px-3.5 py-3">
              <span className="flex items-center gap-2 text-sm font-medium text-ink">
                <Sparkles className="h-4 w-4 text-accent" /> Verification badge
              </span>
              <input
                type="checkbox"
                checked={sig.verifiedBadge}
                onChange={(e) => update({ verifiedBadge: e.target.checked })}
                className="h-4 w-4 accent-[#4f46e5]"
              />
            </label>
          </Panel>

          <Panel title="Call to action">
            <Field label="Button text">
              <TextInput
                value={sig.ctaText}
                onChange={(e) => update({ ctaText: e.target.value })}
                placeholder="Book a Demo"
              />
            </Field>
            <Field label="Destination URL">
              <TextInput
                value={sig.ctaUrl}
                onChange={(e) => update({ ctaUrl: e.target.value })}
                placeholder="https://cal.com/you/demo"
              />
            </Field>
          </Panel>

          <Panel title="Social links">
            {SOCIAL_FIELDS.map(({ key, label, placeholder }) => (
              <Field key={key} label={label}>
                <TextInput
                  value={sig.socials[key] ?? ""}
                  onChange={(e) => updateSocial(key, e.target.value)}
                  placeholder={placeholder}
                />
              </Field>
            ))}
          </Panel>

          <Panel title="Layout order" subtitle="Drag to reorder the blocks">
            <Reorder.Group
              axis="y"
              values={sig.elementOrder}
              onReorder={(order) => reorder(order as SignatureElement[])}
              className="flex flex-col gap-2"
            >
              {sig.elementOrder.map((el) => (
                <Reorder.Item
                  key={el}
                  value={el}
                  className="flex cursor-grab items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink active:cursor-grabbing"
                  whileDrag={{ scale: 1.03, boxShadow: "0 8px 24px rgb(10 10 15 / 0.12)" }}
                >
                  <GripVertical className="h-4 w-4 text-ink-faint" />
                  {ELEMENT_LABELS[el]}
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </Panel>
        </aside>
      </div>
    </div>
  );
}

function Panel({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-[--shadow-card]">
      <p className="font-display text-sm font-semibold text-ink">{title}</p>
      {subtitle && <p className="mt-0.5 text-xs text-ink-faint">{subtitle}</p>}
      <div className="mt-4 flex flex-col gap-3.5">{children}</div>
    </div>
  );
}

function UploadTile({
  label,
  preview,
  onFile,
}: {
  label: string;
  preview: string;
  onFile: (file: File | undefined) => void;
}) {
  return (
    <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed border-line bg-cream px-3 py-5 text-center transition hover:border-accent">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt={label} className="h-10 w-10 rounded-lg object-cover" />
      ) : (
        <Upload className="h-5 w-5 text-ink-faint" />
      )}
      <span className="text-xs font-medium text-ink-muted">{label}</span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </label>
  );
}
