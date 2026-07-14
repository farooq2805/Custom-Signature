"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { SignatureCard } from "@/components/signature/SignatureCard";
import { Logo } from "@/components/marketing/Logo";
import { DEFAULT_SIGNATURE } from "@/lib/templates";
import { useSigStore } from "@/lib/store";

export function HostedCard({ slug }: { slug: string }) {
  // Demo mode resolves the slug from the local store; with Supabase this is
  // fetched server-side in page.tsx from the `signatures` table.
  const signatures = useSigStore((s) => s.signatures);
  const sig = useMemo(
    () => signatures.find((s) => s.slug === slug) ?? { ...DEFAULT_SIGNATURE, slug },
    [signatures, slug]
  );

  // Count the visit as an impression of the hosted card.
  useEffect(() => {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ signatureId: sig.id, eventType: "impression" }),
    }).catch(() => {});
  }, [sig.id]);

  return (
    <div className="dot-grid flex min-h-screen flex-col items-center justify-center gap-10 px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.21, 0.65, 0.32, 0.95] }}
      >
        <SignatureCard data={sig} trackBase={`/api/t/${sig.id}`} className="shadow-[--shadow-pop]" />
      </motion.div>

      {sig.verifiedBadge && (
        <motion.p
          id="verified"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center gap-2 text-sm text-ink-muted"
        >
          <BadgeCheck className="h-4 w-4" style={{ color: sig.brandColor }} />
          <strong className="text-ink">{sig.name}</strong> is a verified SigCraft sender
        </motion.p>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="flex flex-col items-center gap-3"
      >
        <p className="text-xs text-ink-faint">Want a signature like this?</p>
        <Link
          href="/signup"
          className="bg-gradient-accent rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-[--shadow-glow] transition hover:brightness-110"
        >
          Build yours free →
        </Link>
        <Link href="/" aria-label="SigCraft home" className="mt-4 opacity-60 transition hover:opacity-100">
          <Logo />
        </Link>
      </motion.div>
    </div>
  );
}
