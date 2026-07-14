"use client";

/**
 * Marketing sections 3–12: social proof, stats, how-it-works, interactive
 * demo, deliverability, platform tabs, features grid, pricing teaser, FAQ,
 * final CTA. Composed in src/app/(marketing)/page.tsx.
 */

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  BarChart3,
  Check,
  Layers,
  LayoutTemplate,
  MailCheck,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  RefreshCcw,
  Server,
  ShieldCheck,
  Sparkles,
  Star,
  Wand2,
  Zap,
} from "lucide-react";
import {
  AnimatedCounter,
  Button,
  Card,
  FadeUp,
  Accordion,
  Section,
  SectionHeading,
  Tabs,
} from "@/components/ui";
import { SignatureCard } from "@/components/signature/SignatureCard";
import { DEFAULT_SIGNATURE, PLANS } from "@/lib/templates";
import type { AnimationStyle } from "@/lib/types";

/* ---------------- 3. Social proof strip ---------------- */
const PROOF_LOGOS = [
  "Northwind Labs",
  "Harbor & Co.",
  "Beacon Health",
  "Keystone Realty",
  "Vantage Capital",
  "Studio Meridian",
  "Atlas Outbound",
  "Fern & Field",
];

export function SocialProof() {
  return (
    <section className="border-y border-line bg-white px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-ink-muted">
          <span className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-warn text-warn" />
            ))}
            <strong className="text-ink">4.9</strong> on G2
          </span>
          <span>
            Trusted by <strong className="text-ink">12,000+</strong> founders & teams
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-success" /> SOC 2 Type II
          </span>
        </div>
        {/* marquee of customer wordmarks */}
        <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-[marquee_32s_linear_infinite] gap-14 py-2">
            {[...PROOF_LOGOS, ...PROOF_LOGOS].map((name, i) => (
              <span
                key={i}
                className="whitespace-nowrap font-display text-lg font-semibold tracking-tight text-ink-faint"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- 4. Stats bar ---------------- */
const STATS = [
  { value: 38, suffix: "%", label: "Average reply-rate lift" },
  { value: 5.2, suffix: "×", decimals: 1, label: "More CTA clicks vs. plain signatures" },
  { value: 12000, suffix: "+", label: "Signatures served daily" },
  { value: 14, suffix: "", label: "Email clients tested" },
];

export function StatsBar() {
  return (
    <Section className="!py-16">
      <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </p>
            <p className="mt-2 text-sm text-ink-muted">{s.label}</p>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- 5. How it works ---------------- */
const STEPS = [
  {
    icon: LayoutTemplate,
    title: "Select a template",
    copy: "Start from pro layouts tuned by industry and role — realtor, founder, consultant — each already optimized for clicks.",
  },
  {
    icon: Palette,
    title: "Customize your brand",
    copy: "Drop in your logo, photo, and brand color. Pick an animation style and CTA. The live preview updates as you type.",
  },
  {
    icon: RefreshCcw,
    title: "Sync across platforms",
    copy: "One-click install for Gmail and Outlook, copy-paste for everything else. Update once — it changes everywhere.",
  },
];

export function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-white">
      <SectionHeading
        eyebrow="How it works"
        title="Live in your inbox in under 3 minutes"
        subtitle="No designer, no HTML wrangling, no IT ticket."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {STEPS.map((step, i) => (
          <FadeUp key={step.title} delay={i * 0.12}>
            <Card className="relative h-full overflow-hidden">
              <span className="absolute -right-3 -top-5 font-display text-[7rem] font-bold leading-none text-cream-dim select-none">
                {i + 1}
              </span>
              <span className="bg-gradient-accent relative mb-5 flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-[--shadow-glow]">
                <step.icon className="h-5 w-5" />
              </span>
              <h3 className="relative mb-2 font-display text-xl font-semibold text-ink">
                {step.title}
              </h3>
              <p className="relative leading-relaxed text-ink-muted">{step.copy}</p>
            </Card>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- 6. Interactive demo ---------------- */
const DEMO_COLORS = ["#4f46e5", "#0f766e", "#b45309", "#dc2626", "#8b5cf6"];

export function InteractiveDemo() {
  const [color, setColor] = useState(DEMO_COLORS[0]);
  const [anim, setAnim] = useState<AnimationStyle>("subtle");

  return (
    <Section id="demo" className="relative">
      <SectionHeading
        eyebrow="Try it — this is real"
        title={
          <>
            Hover it. Click it. <span className="text-gradient">It&apos;s alive.</span>
          </>
        }
        subtitle="This is the actual signature component, not a screenshot. Hover the logo, the social icons, the verification badge — then imagine it at the bottom of every email you send."
      />
      <div className="dot-grid mx-auto flex max-w-3xl flex-col items-center gap-10 rounded-3xl border border-line bg-white/60 px-6 py-14">
        <SignatureCard
          data={{
            ...DEFAULT_SIGNATURE,
            brandColor: color,
            animationStyle: anim,
          }}
          className="shadow-[--shadow-pop]"
        />
        <div className="flex flex-wrap items-center justify-center gap-6">
          <div className="flex items-center gap-2">
            {DEMO_COLORS.map((c) => (
              <motion.button
                key={c}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setColor(c)}
                aria-label={`Brand color ${c}`}
                className={`h-7 w-7 rounded-full border-2 transition ${
                  color === c ? "border-ink" : "border-transparent"
                }`}
                style={{ background: c }}
              />
            ))}
          </div>
          <div className="flex gap-1 rounded-full border border-line bg-white p-1">
            {(["subtle", "bold", "none"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAnim(a)}
                className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition ${
                  anim === a ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
                }`}
              >
                {a}
              </button>
            ))}
          </div>
        </div>
        <p className="flex items-center gap-2 text-sm text-ink-faint">
          <MousePointerClick className="h-4 w-4" />
          Every element you just hovered is tracked when it&apos;s clicked in a real email.
        </p>
      </div>
    </Section>
  );
}

/* ---------------- 7. Deliverability ---------------- */
const DELIVERABILITY_POINTS = [
  {
    icon: MailCheck,
    title: "Clean, hand-tuned HTML",
    copy: "Table-based layout, 100% inline CSS — the exact patterns email clients were built to render. No hacks that trip spam filters.",
  },
  {
    icon: ShieldCheck,
    title: "No tracking pixels",
    copy: "Invisible 1×1 pixels are a spam-filter red flag. We measure clicks through branded redirect links instead — invisible to filters, visible in your dashboard.",
  },
  {
    icon: Server,
    title: "Trusted CDN hosting",
    copy: "Logos and animated assets are served from a reputation-clean CDN with strict caching, so your emails stay fast and trusted.",
  },
  {
    icon: MonitorSmartphone,
    title: "Tested where it matters",
    copy: "Every template is rendered and screenshot-tested across Gmail, Outlook (desktop & 365), Apple Mail, and Yahoo before release.",
  },
];

export function Deliverability() {
  return (
    <Section className="bg-ink text-cream">
      <SectionHeading
        eyebrow="Deliverability first"
        title={
          <span className="text-cream">
            Beautiful never comes at the cost of the inbox
          </span>
        }
        subtitle="An interactive signature is worthless in spam. Everything we generate is engineered to land."
      />
      <div className="grid gap-5 sm:grid-cols-2">
        {DELIVERABILITY_POINTS.map((p, i) => (
          <FadeUp key={p.title} delay={i * 0.08}>
            <div className="glass-dark h-full rounded-3xl p-7">
              <p.icon className="mb-4 h-6 w-6 text-accent-hi" />
              <h3 className="mb-2 font-display text-lg font-semibold text-cream">{p.title}</h3>
              <p className="text-sm leading-relaxed text-cream/70">{p.copy}</p>
            </div>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- 8. Platform tabs ---------------- */
function PlatformShot({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-white shadow-[--shadow-pop]">
      <div className="flex items-center gap-1.5 border-b border-line bg-cream-dim px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
        <span className="ml-3 text-xs text-ink-faint">{label}</span>
      </div>
      <div className="p-6 sm:p-8">{children}</div>
    </div>
  );
}

export function PlatformTabs() {
  return (
    <Section id="platform" className="bg-white">
      <SectionHeading
        eyebrow="The platform"
        title="One place to build, ship, and measure"
      />
      <Tabs
        tabs={[
          {
            label: "Signature Manager",
            content: (
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <PlatformShot label="app.sigcraft.com/signatures">
                  <div className="flex flex-col gap-3">
                    {["Alex Rivera — Founder", "Sales team · Outbound A", "Sales team · Outbound B"].map(
                      (name, i) => (
                        <div
                          key={name}
                          className="flex items-center justify-between rounded-2xl border border-line p-4"
                        >
                          <span className="text-sm font-medium text-ink">{name}</span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              i === 0
                                ? "bg-success/10 text-success"
                                : "bg-cream-dim text-ink-faint"
                            }`}
                          >
                            {i === 0 ? "Live" : "Draft"}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </PlatformShot>
                <div>
                  <h3 className="mb-3 font-display text-2xl font-semibold text-ink">
                    Every signature, every teammate, one roster
                  </h3>
                  <p className="leading-relaxed text-ink-muted">
                    Manage personal variants and team rollouts side by side. Duplicate a
                    winner, archive a dud, push a brand update to fifty inboxes at once.
                  </p>
                </div>
              </div>
            ),
          },
          {
            label: "Visual Editor",
            content: (
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <PlatformShot label="app.sigcraft.com/editor">
                  <SignatureCard data={DEFAULT_SIGNATURE} className="!border-0 !p-0 !shadow-none" />
                </PlatformShot>
                <div>
                  <h3 className="mb-3 font-display text-2xl font-semibold text-ink">
                    What you see is what lands
                  </h3>
                  <p className="leading-relaxed text-ink-muted">
                    Live preview as you type, with a Gmail/Outlook toggle that simulates
                    exactly how each client will render your signature — before you ever
                    hit send.
                  </p>
                  <Button href="/editor" variant="secondary" className="mt-6">
                    Open the editor →
                  </Button>
                </div>
              </div>
            ),
          },
          {
            label: "Analytics",
            content: (
              <div className="grid items-center gap-10 lg:grid-cols-2">
                <PlatformShot label="app.sigcraft.com/dashboard">
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        ["Impressions", "4,812"],
                        ["CTA clicks", "377"],
                        ["CTR", "7.8%"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl border border-line p-3">
                          <p className="text-[11px] text-ink-faint">{label}</p>
                          <p className="font-display text-lg font-bold text-ink">{value}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex h-24 items-end gap-1.5">
                      {[35, 48, 42, 60, 55, 72, 68, 84, 78, 92, 88, 100].map((h, i) => (
                        <motion.span
                          key={i}
                          initial={{ height: 0 }}
                          whileInView={{ height: `${h}%` }}
                          viewport={{ once: true }}
                          transition={{ delay: i * 0.05, duration: 0.4 }}
                          className="flex-1 rounded-t-md bg-gradient-accent opacity-80"
                        />
                      ))}
                    </div>
                  </div>
                </PlatformShot>
                <div>
                  <h3 className="mb-3 font-display text-2xl font-semibold text-ink">
                    Proof your signature is working
                  </h3>
                  <p className="leading-relaxed text-ink-muted">
                    Impressions, clicks, and click-through rate per signature — plus A/B
                    variants so your best CTA wins. This is the number you&apos;ll brag about.
                  </p>
                </div>
              </div>
            ),
          },
        ]}
      />
    </Section>
  );
}

/* ---------------- 9. Features grid ---------------- */
const FEATURES = [
  {
    icon: Wand2,
    title: "AI Logo Animation",
    copy: "Upload a static logo, get a tasteful shimmer, draw-in, or spin — rendered as an email-safe animated asset.",
  },
  {
    icon: MousePointerClick,
    title: "Interactive Design",
    copy: "Hover-lit social nav, tooltips, and a pulsing CTA on your hosted card.",
  },
  {
    icon: MonitorSmartphone,
    title: "Mobile Responsive",
    copy: "Layouts that hold up from a 4K monitor to a cracked iPhone screen.",
  },
  {
    icon: BadgeCheck,
    title: "Verification Badge",
    copy: "A verified-sender mark that builds instant trust with cold prospects.",
  },
  {
    icon: Layers,
    title: "Bulk Create",
    copy: "Apply one brand template across your whole team in a single click.",
  },
  {
    icon: Server,
    title: "Server Hosting",
    copy: "Signatures served from our edge network — update once, live everywhere.",
  },
  {
    icon: Sparkles,
    title: "Pro Templates",
    copy: "Layouts tuned by industry, from realtor to RIA to recruiting agency.",
  },
  {
    icon: BarChart3,
    title: "Click Analytics",
    copy: "Every tap on your CTA, socials, and badge — logged and graphed.",
  },
];

export function FeaturesGrid() {
  return (
    <Section id="features">
      <SectionHeading
        eyebrow="Features"
        title="Everything a signature should have been all along"
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f, i) => (
          <FadeUp key={f.title} delay={(i % 4) * 0.07}>
            <motion.div
              whileHover={{ y: -4 }}
              className="h-full rounded-3xl border border-line bg-white p-6 shadow-[--shadow-card] transition-shadow hover:shadow-[--shadow-pop]"
            >
              <f.icon className="mb-4 h-6 w-6 text-accent" />
              <h3 className="mb-1.5 font-display font-semibold text-ink">{f.title}</h3>
              <p className="text-sm leading-relaxed text-ink-muted">{f.copy}</p>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </Section>
  );
}

/* ---------------- 10. Pricing teaser ---------------- */
export function PricingTeaser() {
  return (
    <Section className="bg-white">
      <SectionHeading
        eyebrow="Pricing"
        title="Start free. Upgrade when it pays for itself."
        subtitle="One booked demo covers a year of Pro."
      />
      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan, i) => (
          <FadeUp key={plan.id} delay={i * 0.1}>
            <Card
              className={`relative flex h-full flex-col ${
                plan.highlighted ? "border-accent shadow-[--shadow-glow]" : ""
              }`}
            >
              {plan.highlighted && (
                <span className="bg-gradient-accent absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white">
                  Most popular
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-ink">{plan.name}</h3>
              <p className="mt-1 text-sm text-ink-muted">{plan.tagline}</p>
              <p className="mt-5 font-display text-4xl font-bold text-ink">
                ${plan.priceMonthly}
                <span className="text-base font-medium text-ink-faint">/mo</span>
              </p>
              <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                {plan.features.slice(0, 4).map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button
                href={`/signup?plan=${plan.id}`}
                variant={plan.highlighted ? "primary" : "secondary"}
                className="mt-7 w-full"
              >
                {plan.cta}
              </Button>
            </Card>
          </FadeUp>
        ))}
      </div>
      <FadeUp className="mt-8 text-center">
        <Link href="/pricing" className="text-sm font-medium text-accent hover:underline">
          Compare all features →
        </Link>
      </FadeUp>
    </Section>
  );
}

/* ---------------- 11. FAQ ---------------- */
const FAQS = [
  {
    q: "Why is this a subscription and not a one-time purchase?",
    a: "Because your signature isn't a file — it's a hosted, living asset. We serve your animated card and logo from our CDN, keep every click-tracking link running, re-test rendering as email clients change, and keep your analytics flowing. Cancel anytime and your signature gracefully falls back to a static version.",
  },
  {
    q: "Will an animated signature hurt my deliverability?",
    a: "No — and this is the core of our engineering. The HTML we generate is a conservative table layout with inline CSS, exactly what email clients expect. We never embed tracking pixels (a genuine spam signal); clicks are measured through normal branded links. Animation ships as a standard image asset that clients like Gmail render natively and Outlook shows as a clean static frame.",
  },
  {
    q: "How does the free trial work?",
    a: "Every new account gets 7 days of Pro, no credit card required. When the trial ends you keep your account and one live signature on the Starter plan — nothing breaks, nothing is deleted.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes, in two clicks from Billing — no email, no phone call, no retention maze. Your hosted signatures keep redirecting for 30 days after cancellation so your sent emails never show broken links.",
  },
  {
    q: "Does it work with Gmail, Outlook, and Apple Mail?",
    a: "Yes. Gmail and Outlook have guided one-click-style installs; Apple Mail and everything else use a copy-paste snippet with step-by-step instructions. The rendered result is tested across 14 clients.",
  },
  {
    q: "What exactly gets tracked?",
    a: "Only clicks on the links inside your signature (CTA, social icons, website), plus impressions counted when your hosted logo is loaded. We never read your email content — we can't; we're not in your mailbox.",
  },
];

export function FAQ() {
  return (
    <Section id="faq">
      <SectionHeading eyebrow="FAQ" title="Fair questions, straight answers" />
      <div className="mx-auto max-w-3xl">
        <Accordion items={FAQS} />
      </div>
    </Section>
  );
}

/* ---------------- 12. Final CTA ---------------- */
export function FinalCTA() {
  return (
    <Section>
      <FadeUp>
        <div className="bg-gradient-accent noise relative overflow-hidden rounded-3xl px-8 py-16 text-center sm:px-16 sm:py-20">
          <Zap className="mx-auto mb-6 h-10 w-10 text-white/80" />
          <h2 className="font-display text-3xl font-semibold tracking-tight text-white sm:text-5xl">
            Your next email could book a demo.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Build your interactive signature in 3 minutes. Free for 7 days — then $12/mo
            if it&apos;s earning its keep.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="dark" href="/signup" className="!bg-white !text-ink hover:!bg-cream">
              Get Started Free
            </Button>
            <Button size="lg" variant="ghost" href="/#demo" className="!text-white hover:!bg-white/10">
              See the demo again
            </Button>
          </div>
        </div>
      </FadeUp>
    </Section>
  );
}
