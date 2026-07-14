import { NextRequest, NextResponse } from "next/server";
import { buildEmailHtml } from "@/lib/emailHtml";
import { DEFAULT_SIGNATURE } from "@/lib/templates";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { SignatureData } from "@/lib/types";

/**
 * Serves a signature's email-safe HTML by slug — used by the install flow's
 * "copy from URL" option and by integrations that pull the latest version.
 * Falls back to the demo signature when Supabase isn't configured.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  let sig: SignatureData = { ...DEFAULT_SIGNATURE, slug };
  const admin = getSupabaseAdmin();
  if (admin) {
    const { data } = await admin.from("signatures").select("*").eq("slug", slug).single();
    if (data) {
      sig = {
        id: data.id,
        slug: data.slug,
        name: data.name,
        title: data.title,
        company: data.company,
        phone: data.phone,
        email: data.email,
        website: data.website,
        socials: data.socials ?? {},
        logoUrl: data.logo_url ?? "",
        photoUrl: data.photo_url ?? "",
        brandColor: data.brand_color,
        ctaText: data.cta_text,
        ctaUrl: data.cta_url,
        animationStyle: data.animation_style,
        verifiedBadge: data.verified_badge,
        templateId: data.template_id,
        elementOrder: data.element_order ?? ["identity", "contact", "socials", "cta"],
      };
    }
  }

  const html = buildEmailHtml(sig, { baseUrl: req.nextUrl.origin });
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
