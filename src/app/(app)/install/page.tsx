"use client";

/**
 * Install & Sync: per-client step-by-step instructions + copy-paste HTML.
 * Gmail/Outlook get a guided flow (OAuth-based one-click install is the
 * roadmap item — the button explains what it will do); Apple Mail and
 * "everything else" use the snippet.
 */

import { useMemo, useState } from "react";
import { Check, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui";
import { buildEmailHtml } from "@/lib/emailHtml";
import { useActiveSignature } from "@/lib/store";

type Client = "gmail" | "outlook" | "apple";

const STEPS: Record<Client, { title: string; steps: string[]; settingsUrl?: string }> = {
  gmail: {
    title: "Gmail",
    settingsUrl: "https://mail.google.com/mail/u/0/#settings/general",
    steps: [
      "Copy your signature HTML with the button below.",
      "Open Gmail → Settings (gear) → “See all settings”.",
      "Scroll to the Signature section and click “Create new”.",
      "Paste directly into the signature box — Gmail keeps the formatting.",
      "Set it as default for “New emails” and “On reply/forward”, then Save.",
    ],
  },
  outlook: {
    title: "Outlook",
    settingsUrl: "https://outlook.live.com/mail/0/options/mail/messageContent",
    steps: [
      "Copy your signature HTML with the button below.",
      "Open Outlook → Settings → Mail → Compose and reply.",
      "In the signature editor, paste your copied signature.",
      "Outlook's desktop app squares off rounded corners — your layout is built for it.",
      "Choose it for new messages and replies, then Save.",
    ],
  },
  apple: {
    title: "Apple Mail",
    steps: [
      "Copy your signature HTML with the button below.",
      "Open Mail → Settings → Signatures and create a new signature.",
      "Paste into the signature field (formatting is preserved).",
      "Uncheck “Always match my default message font”.",
      "Drag the signature onto your account and select it as default.",
    ],
  },
};

export default function InstallPage() {
  const sig = useActiveSignature();
  const [client, setClient] = useState<Client>("gmail");
  const [copied, setCopied] = useState(false);

  const html = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://sigcraft.app";
    return buildEmailHtml(sig, { baseUrl: origin });
  }, [sig]);

  async function copy() {
    // Write both flavors so pasting into a rich-text signature box (Gmail,
    // Apple Mail) renders the signature, while plain-text fields get markup.
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([html], { type: "text/plain" }),
        }),
      ]);
    } catch {
      await navigator.clipboard.writeText(html);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const info = STEPS[client];

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Install & Sync</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Install once per client. Content updates you make in the editor flow through your
        hosted links automatically — no reinstall needed for URL changes.
      </p>

      <div className="mt-6 flex gap-1 rounded-full border border-line bg-white p-1 w-fit">
        {(Object.keys(STEPS) as Client[]).map((c) => (
          <button
            key={c}
            onClick={() => setClient(c)}
            className={`rounded-full px-5 py-2 text-sm font-medium transition ${
              client === c ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
            }`}
          >
            {STEPS[c].title}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div className="rounded-3xl border border-line bg-white p-7 shadow-[--shadow-card]">
          <h2 className="font-display text-lg font-semibold text-ink">
            Set up in {info.title}
          </h2>
          <ol className="mt-5 flex flex-col gap-4">
            {info.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                <span className="bg-gradient-accent flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={copy}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copied!" : "Copy signature"}
            </Button>
            {info.settingsUrl && (
              <Button variant="secondary" href={info.settingsUrl}>
                Open {info.title} settings <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
          {(client === "gmail" || client === "outlook") && (
            <p className="mt-4 rounded-2xl bg-accent-soft px-4 py-3 text-xs leading-relaxed text-ink-muted">
              <strong className="text-accent">One-click install (coming soon):</strong> connect
              your {info.title} account via OAuth and SigCraft will set the signature for you —
              and keep every teammate's synced when the brand template changes.
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-line bg-white p-7 shadow-[--shadow-card]">
          <h2 className="font-display text-lg font-semibold text-ink">Your signature HTML</h2>
          <p className="mt-1 text-xs text-ink-faint">
            Table-based, inline CSS, no scripts — engineered to render everywhere and land in
            the inbox.
          </p>
          <pre className="no-scrollbar mt-4 max-h-72 overflow-auto rounded-2xl bg-ink p-4 text-[11px] leading-relaxed text-cream/90">
            {html}
          </pre>
          <p className="mt-3 text-xs text-ink-faint">
            Also served live at{" "}
            <a href={`/api/sig/${sig.slug}`} target="_blank" className="font-medium text-accent hover:underline">
              /api/sig/{sig.slug}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
