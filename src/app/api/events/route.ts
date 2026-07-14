import { NextRequest, NextResponse } from "next/server";
import { getEvents, guessEmailClient, logEvent } from "@/lib/events";
import type { EventType } from "@/lib/types";

/** GET /api/events?signatureId=… — raw events for the analytics dashboard. */
export async function GET(req: NextRequest) {
  const signatureId = req.nextUrl.searchParams.get("signatureId") ?? undefined;
  const events = await getEvents(signatureId);
  return NextResponse.json({ events });
}

/** POST /api/events — log an impression from the hosted signature page. */
export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as {
    signatureId?: string;
    eventType?: EventType;
  };
  if (!body.signatureId) {
    return NextResponse.json({ error: "signatureId required" }, { status: 400 });
  }
  await logEvent(body.signatureId, body.eventType ?? "impression", {
    emailClientGuess: guessEmailClient(req.headers.get("user-agent")),
  });
  return NextResponse.json({ ok: true });
}
