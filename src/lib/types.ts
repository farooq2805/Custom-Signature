/** Shared domain types — mirrors the Supabase schema in /supabase/schema.sql */

export type AnimationStyle = "subtle" | "bold" | "none";

export type SocialPlatform =
  | "website"
  | "linkedin"
  | "instagram"
  | "facebook"
  | "youtube"
  | "x";

export type Socials = Partial<Record<SocialPlatform, string>>;

/** The ordered, toggleable blocks of a signature layout */
export type SignatureElement = "identity" | "contact" | "socials" | "cta" | "disclaimer";

export interface SignatureData {
  id: string;
  slug: string;
  userId?: string;
  /** Person */
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  socials: Socials;
  /** Brand */
  logoUrl: string;
  photoUrl: string;
  brandColor: string;
  /** CTA */
  ctaText: string;
  ctaUrl: string;
  /** Behavior */
  animationStyle: AnimationStyle;
  verifiedBadge: boolean;
  templateId: TemplateId;
  elementOrder: SignatureElement[];
  createdAt?: string;
  updatedAt?: string;
}

export type TemplateId = "aurora" | "ledger" | "compass" | "monogram" | "beacon" | "slate";

export interface SignatureTemplate {
  id: TemplateId;
  name: string;
  industryTag: string;
  roleTag: string;
  description: string;
  /** Layout hints consumed by SignatureCard */
  layout: "photo-left" | "stacked" | "banner" | "minimal";
  defaultColor: string;
}

export type EventType = "impression" | "click";

export interface SignatureEvent {
  id: string;
  signatureId: string;
  eventType: EventType;
  createdAt: string;
  meta?: {
    emailClientGuess?: string;
    target?: string;
    referer?: string;
  };
}

export type PlanId = "free" | "pro" | "team";

export interface Plan {
  id: PlanId;
  name: string;
  priceMonthly: number;
  tagline: string;
  features: string[];
  cta: string;
  highlighted?: boolean;
}
