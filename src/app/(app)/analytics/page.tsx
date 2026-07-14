"use client";

import { useState } from "react";
import { BreakdownBars, StatTile, TrendChart } from "@/components/dashboard/charts";
import { useSigStore } from "@/lib/store";
import { useAnalytics, useEvents } from "@/lib/useAnalytics";

const TARGET_LABELS: Record<string, string> = {
  cta: "CTA button",
  website: "Website link",
  linkedin: "LinkedIn",
  instagram: "Instagram",
  facebook: "Facebook",
  youtube: "YouTube",
  x: "X / Twitter",
  badge: "Verified badge",
  hosted: "Hosted card link",
};

export default function AnalyticsPage() {
  const signatures = useSigStore((s) => s.signatures);
  const [sigFilter, setSigFilter] = useState<string>("");
  const { events, loading } = useEvents(sigFilter || undefined);
  const a = useAnalytics(events);

  // A/B comparison: per-signature CTR from the unfiltered event set is shown
  // when more than one variant exists.
  const { events: allEvents } = useEvents();
  const variants = signatures.map((s) => {
    const ev = allEvents.filter((e) => e.signatureId === s.id);
    const imp = ev.filter((e) => e.eventType === "impression").length;
    const clk = ev.filter((e) => e.eventType === "click").length;
    return { name: s.name, id: s.id, impressions: imp, clicks: clk, ctr: imp ? (clk / imp) * 100 : 0 };
  });
  const best = [...variants].sort((x, y) => y.ctr - x.ctr)[0];

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Analytics</h1>
          <p className="text-sm text-ink-muted">
            Every impression and click on your signatures, measured without a single tracking pixel.
          </p>
        </div>
        <select
          value={sigFilter}
          onChange={(e) => setSigFilter(e.target.value)}
          className="rounded-xl border border-line bg-white px-3 py-2 text-sm"
          aria-label="Filter by signature"
        >
          <option value="">All signatures</option>
          {signatures.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.templateId}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p className="text-sm text-ink-faint">Loading events…</p>
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-3">
            <StatTile label="Impressions" value={a.impressions.toLocaleString()} hint="logo loads + hosted card visits" />
            <StatTile label="Clicks" value={a.clicks.toLocaleString()} hint="all tracked links" />
            <StatTile label="CTR" value={`${a.ctr.toFixed(1)}%`} hint="the number worth bragging about" />
          </div>

          <div className="mt-5">
            <TrendChart data={a.days} />
          </div>

          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <BreakdownBars
              title="Clicks by element"
              rows={a.byTarget.map((r) => ({ ...r, label: TARGET_LABELS[r.label] ?? r.label }))}
            />
            <BreakdownBars title="Events by email client" rows={a.byClient} />
          </div>

          {variants.length > 1 && (
            <div className="mt-5 overflow-x-auto rounded-3xl border border-line bg-white shadow-[--shadow-card]">
              <div className="flex items-center justify-between px-6 pt-5">
                <p className="font-display font-semibold text-ink">A/B variants</p>
                {best && best.impressions > 0 && (
                  <span className="rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
                    Top performer: {best.name}
                  </span>
                )}
              </div>
              <table className="mt-3 w-full min-w-[480px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-faint">
                    <th className="px-6 py-3 font-semibold">Variant</th>
                    <th className="px-6 py-3 font-semibold">Impressions</th>
                    <th className="px-6 py-3 font-semibold">Clicks</th>
                    <th className="px-6 py-3 font-semibold">CTR</th>
                  </tr>
                </thead>
                <tbody>
                  {variants.map((v) => (
                    <tr key={v.id} className="border-b border-line last:border-0">
                      <td className="px-6 py-3.5 font-medium text-ink">{v.name}</td>
                      <td className="px-6 py-3.5 text-ink-muted">{v.impressions.toLocaleString()}</td>
                      <td className="px-6 py-3.5 text-ink-muted">{v.clicks.toLocaleString()}</td>
                      <td className="px-6 py-3.5 font-semibold text-ink">{v.ctr.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
