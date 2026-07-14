import type { Plan, SignatureData, SignatureTemplate } from "./types";

export const TEMPLATES: SignatureTemplate[] = [
  {
    id: "aurora",
    name: "Aurora",
    industryTag: "SaaS / Startups",
    roleTag: "Founders",
    description: "Photo-forward with a bold CTA banner. Built to book demos.",
    layout: "photo-left",
    defaultColor: "#4f46e5",
  },
  {
    id: "ledger",
    name: "Ledger",
    industryTag: "Finance",
    roleTag: "Consultants",
    description: "Conservative, typographic, quietly confident.",
    layout: "minimal",
    defaultColor: "#0f766e",
  },
  {
    id: "compass",
    name: "Compass",
    industryTag: "Real Estate",
    roleTag: "Realtors",
    description: "Listing-ready with prominent phone and booking CTA.",
    layout: "photo-left",
    defaultColor: "#b45309",
  },
  {
    id: "monogram",
    name: "Monogram",
    industryTag: "Agencies",
    roleTag: "Creatives",
    description: "Logo-led stacked layout with animated brand mark.",
    layout: "stacked",
    defaultColor: "#8b5cf6",
  },
  {
    id: "beacon",
    name: "Beacon",
    industryTag: "Healthcare",
    roleTag: "Practitioners",
    description: "Trust-first: verification badge and credentials up front.",
    layout: "banner",
    defaultColor: "#0284c7",
  },
  {
    id: "slate",
    name: "Slate",
    industryTag: "Sales Teams",
    roleTag: "SDRs / AEs",
    description: "Compact and scannable — perfect for high-volume outbound.",
    layout: "minimal",
    defaultColor: "#dc2626",
  },
];

export const DEFAULT_SIGNATURE: SignatureData = {
  id: "demo",
  slug: "demo",
  name: "Alex Rivera",
  title: "Co-founder & CEO",
  company: "Northwind Labs",
  phone: "+1 (415) 555-0132",
  email: "alex@northwindlabs.com",
  website: "https://northwindlabs.com",
  socials: {
    website: "https://northwindlabs.com",
    linkedin: "https://linkedin.com/in/alexrivera",
    instagram: "https://instagram.com/northwindlabs",
    youtube: "https://youtube.com/@northwindlabs",
  },
  logoUrl: "",
  photoUrl: "",
  brandColor: "#4f46e5",
  ctaText: "Book a Demo",
  ctaUrl: "https://cal.com/alexrivera/demo",
  animationStyle: "subtle",
  verifiedBadge: true,
  templateId: "aurora",
  elementOrder: ["identity", "contact", "socials", "cta"],
};

export const PLANS: Plan[] = [
  {
    id: "free",
    name: "Starter",
    priceMonthly: 0,
    tagline: "Try the builder, keep one live signature.",
    features: [
      "1 hosted signature",
      "3 pro templates",
      "Basic click tracking (7 days)",
      "SigCraft badge on hosted page",
    ],
    cta: "Start Free",
  },
  {
    id: "pro",
    name: "Pro",
    priceMonthly: 12,
    tagline: "For founders and operators who live in their inbox.",
    features: [
      "Unlimited signatures & A/B variants",
      "All templates + AI logo animation",
      "Verification badge",
      "Full analytics: impressions, clicks, CTR",
      "Custom CTA tracking links",
      "No SigCraft branding",
    ],
    cta: "Start 7-Day Free Trial",
    highlighted: true,
  },
  {
    id: "team",
    name: "Team",
    priceMonthly: 9,
    tagline: "Per seat. Roll one brand out across the whole roster.",
    features: [
      "Everything in Pro",
      "Central brand templates",
      "Bulk create & invite teammates",
      "Team-level analytics rollup",
      "Directory sync (Google Workspace)",
      "Priority support",
    ],
    cta: "Start Team Trial",
  },
];

export function templateById(id: string): SignatureTemplate {
  return TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
}
