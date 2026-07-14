"use client";

import Link from "next/link";
import { ArrowRight, MousePointerClick, PenSquare, Plug } from "lucide-react";
import { StatTile, TrendChart } from "@/components/dashboard/charts";
import { SignatureCard } from "@/components/signature/SignatureCard";
import { Button } from "@/components/ui";
import { useActiveSignature, useSigStore } from "@/lib/store";
import { useAnalytics, useEvents } from "@/lib/useAnalytics";

export default function DashboardPage() {
  const sig = useActiveSignature();
  const signatures = useSigStore((s) => s.signatures);
  const { events } = useEvents();
  const a = useAnalytics(events);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
          <p className="text-sm text-ink-muted">
            {signatures.length} signature{signatures.length === 1 ? "" : "s"} ·{" "}
            {a.clicks} total clicks tracked
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" href="/install">
            <Plug className="h-4 w-4" /> Install
          </Button>
          <Button size="sm" href="/editor">
            <PenSquare className="h-4 w-4" /> Edit signature
          </Button>
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Impressions" value={a.impressions.toLocaleString()} delta="↑ 12%" hint="vs. previous 14 days" />
        <StatTile label="CTA clicks" value={a.clicks.toLocaleString()} delta="↑ 43%" hint="vs. previous 14 days" />
        <StatTile label="Click-through rate" value={`${a.ctr.toFixed(1)}%`} hint="clicks ÷ impressions" />
        <StatTile label="Live signatures" value={String(signatures.length)} hint="served from the edge" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <TrendChart data={a.days} />

        <div className="flex flex-col gap-5">
          <div className="rounded-3xl border border-line bg-white p-6 shadow-[--shadow-card]">
            <p className="mb-4 font-display font-semibold text-ink">Your live signature</p>
            <div className="origin-top-left scale-[0.85]">
              <SignatureCard data={sig} />
            </div>
            <Link
              href={`/s/${sig.slug}`}
              target="_blank"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
            >
              View hosted card <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Link
            href="/analytics"
            className="group flex items-center justify-between rounded-3xl border border-line bg-white p-6 shadow-[--shadow-card] transition hover:shadow-[--shadow-pop]"
          >
            <span className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                <MousePointerClick className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-display font-semibold text-ink">Full analytics</span>
                <span className="block text-xs text-ink-faint">Clients, targets, variants</span>
              </span>
            </span>
            <ArrowRight className="h-4 w-4 text-ink-faint transition group-hover:translate-x-1 group-hover:text-ink" />
          </Link>
        </div>
      </div>
    </div>
  );
}
