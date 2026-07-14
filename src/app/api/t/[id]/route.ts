import { NextRequest, NextResponse } from "next/server";
import { guessEmailClient, logEvent } from "@/lib/events";

/**
 * Click-tracking redirect: /api/t/:signatureId?k=cta&to=https://…
 * Logs the click then 302s to the destination. This is the
 * deliverability-safe alternative to a tracking pixel — to the email client
 * it's just a normal link.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const to = req.nextUrl.searchParams.get("to") ?? "/";
  const key = req.nextUrl.searchParams.get("k") ?? "link";

  // Only forward to http(s) destinations — never javascript:, data:, etc.
  let dest: URL;
  try {
    dest = new URL(to);
    if (!["http:", "https:"].includes(dest.protocol)) throw new Error("bad scheme");
  } catch {
    dest = new URL("/", req.nextUrl.origin);
  }

  await logEvent(id, "click", {
    target: key,
    emailClientGuess: guessEmailClient(req.headers.get("user-agent")),
    referer: req.headers.get("referer") ?? undefined,
  });

  return NextResponse.redirect(dest, { status: 302 });
}
