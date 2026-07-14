import { getSupabaseAdmin } from "./supabase";
import type { EventType, SignatureEvent } from "./types";

/**
 * Server-side event log. Writes to Supabase `signature_events` when
 * configured; otherwise an in-memory store (persisted on globalThis to
 * survive dev hot-reloads) keeps the demo fully functional. Seeded with two
 * weeks of plausible data so the analytics dashboard has something to show.
 */

type Store = { events: SignatureEvent[]; seeded: boolean };

const g = globalThis as unknown as { __sigcraftEvents?: Store };

function store(): Store {
  if (!g.__sigcraftEvents) g.__sigcraftEvents = { events: [], seeded: false };
  const s = g.__sigcraftEvents;
  if (!s.seeded) {
    s.seeded = true;
    seed(s);
  }
  return s;
}

function seed(s: Store) {
  const now = Date.now();
  const day = 24 * 3600 * 1000;
  let id = 0;
  for (let d = 13; d >= 0; d--) {
    // gently trending up, weekends dip
    const date = new Date(now - d * day);
    const weekend = [0, 6].includes(date.getDay());
    const impressions = Math.round((30 + (13 - d) * 3) * (weekend ? 0.4 : 1));
    const clicks = Math.round(impressions * (0.06 + (13 - d) * 0.002));
    for (let i = 0; i < impressions; i++) {
      s.events.push({
        id: `seed-${id++}`,
        signatureId: "sig-1",
        eventType: "impression",
        createdAt: new Date(date.getTime() - Math.random() * day).toISOString(),
        meta: { emailClientGuess: ["Gmail", "Outlook", "Apple Mail"][i % 3] },
      });
    }
    for (let i = 0; i < clicks; i++) {
      s.events.push({
        id: `seed-${id++}`,
        signatureId: "sig-1",
        eventType: "click",
        createdAt: new Date(date.getTime() - Math.random() * day).toISOString(),
        meta: {
          target: ["cta", "linkedin", "website", "cta", "cta"][i % 5],
          emailClientGuess: ["Gmail", "Outlook", "Apple Mail"][i % 3],
        },
      });
    }
  }
}

export function guessEmailClient(userAgent: string | null): string {
  if (!userAgent) return "Unknown";
  const ua = userAgent.toLowerCase();
  if (ua.includes("googleimageproxy") || ua.includes("gmail")) return "Gmail";
  if (ua.includes("outlook") || ua.includes("microsoft office")) return "Outlook";
  if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("macintosh")) return "Apple Mail";
  if (ua.includes("yahoo")) return "Yahoo";
  if (ua.includes("thunderbird")) return "Thunderbird";
  if (ua.includes("android")) return "Android";
  return "Web";
}

export async function logEvent(
  signatureId: string,
  eventType: EventType,
  meta: SignatureEvent["meta"] = {}
): Promise<void> {
  const admin = getSupabaseAdmin();
  if (admin) {
    await admin.from("signature_events").insert({
      signature_id: signatureId,
      event_type: eventType,
      meta,
    });
    return;
  }
  store().events.push({
    id: Math.random().toString(36).slice(2),
    signatureId,
    eventType,
    createdAt: new Date().toISOString(),
    meta,
  });
}

export async function getEvents(signatureId?: string): Promise<SignatureEvent[]> {
  const admin = getSupabaseAdmin();
  if (admin) {
    let q = admin
      .from("signature_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (signatureId) q = q.eq("signature_id", signatureId);
    const { data } = await q;
    return (data ?? []).map((r) => ({
      id: r.id,
      signatureId: r.signature_id,
      eventType: r.event_type,
      createdAt: r.created_at,
      meta: r.meta,
    }));
  }
  const all = store().events;
  return signatureId ? all.filter((e) => e.signatureId === signatureId) : all;
}
