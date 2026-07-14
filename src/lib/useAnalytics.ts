"use client";

import { useEffect, useMemo, useState } from "react";
import type { SignatureEvent } from "./types";
import type { DayPoint } from "@/components/dashboard/charts";

export function useEvents(signatureId?: string) {
  const [events, setEvents] = useState<SignatureEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const qs = signatureId ? `?signatureId=${encodeURIComponent(signatureId)}` : "";
    fetch(`/api/events${qs}`)
      .then((r) => r.json())
      .then((j) => setEvents(j.events ?? []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [signatureId]);

  return { events, loading };
}

export function useAnalytics(events: SignatureEvent[]) {
  return useMemo(() => {
    const impressions = events.filter((e) => e.eventType === "impression").length;
    const clicks = events.filter((e) => e.eventType === "click").length;
    const ctr = impressions ? (clicks / impressions) * 100 : 0;

    // last 14 days trend
    const days: DayPoint[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let d = 13; d >= 0; d--) {
      const start = new Date(today.getTime() - d * 86400000);
      const end = new Date(start.getTime() + 86400000);
      const inDay = events.filter((e) => {
        const t = new Date(e.createdAt).getTime();
        return t >= start.getTime() && t < end.getTime();
      });
      days.push({
        date: start.toISOString(),
        impressions: inDay.filter((e) => e.eventType === "impression").length,
        clicks: inDay.filter((e) => e.eventType === "click").length,
      });
    }

    const byClient = new Map<string, number>();
    const byTarget = new Map<string, number>();
    for (const e of events) {
      const c = e.meta?.emailClientGuess ?? "Unknown";
      byClient.set(c, (byClient.get(c) ?? 0) + 1);
      if (e.eventType === "click") {
        const t = e.meta?.target ?? "link";
        byTarget.set(t, (byTarget.get(t) ?? 0) + 1);
      }
    }
    const sortDesc = (m: Map<string, number>) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]).map(([label, value]) => ({ label, value }));

    return {
      impressions,
      clicks,
      ctr,
      days,
      byClient: sortDesc(byClient),
      byTarget: sortDesc(byTarget),
    };
  }, [events]);
}
