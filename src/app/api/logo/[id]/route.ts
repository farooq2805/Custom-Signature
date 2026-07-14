import { NextRequest, NextResponse } from "next/server";
import { guessEmailClient, logEvent } from "@/lib/events";

/**
 * Brand-logo asset route. Serves the signature's logo (the animated GIF
 * variant where generated) and logs an impression — a visible brand image
 * the user chose to include, not a hidden pixel, so it carries no
 * deliverability penalty.
 *
 * Demo mode: without Supabase Storage we return a branded SVG monogram.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await logEvent(id, "impression", {
    emailClientGuess: guessEmailClient(req.headers.get("user-agent")),
  });

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="112" viewBox="0 0 112 112">
  <rect width="112" height="112" rx="24" fill="#4f46e5"/>
  <text x="56" y="70" font-family="Arial, Helvetica, sans-serif" font-size="40" font-weight="bold" fill="#ffffff" text-anchor="middle">NL</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      // short cache so impressions still register through proxies
      "Cache-Control": "private, max-age=300",
    },
  });
}
