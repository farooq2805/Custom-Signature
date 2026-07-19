"use client";

/**
 * Landing sections: premium feature blocks, layered product showcase,
 * 3-step animated timeline, alternating benefits, particle CTA.
 * Every section has its own entrance choreography; all scroll reveals
 * trigger once and respect prefers-reduced-motion via Framer defaults.
 */

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Layers,
  LayoutTemplate,
  MonitorSmartphone,
  MousePointerClick,
  Palette,
  RefreshCcw,
  Server,
  ShieldCheck,
  Sparkles,
  Wand2,
} from "lucide-react";
import { SignatureCard } from "@/components/signature/SignatureCard";
import { DEFAULT_SIGNATURE } from "@/lib/templates";
import { MagneticButton, TiltCard } from "./interactions";

const EASE = [0.21, 0.65, 0.32, 0.95] as const;

function Reveal({
  children,
  delay = 0,
  from = "up",
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  from?: "up" | "left" | "right" | "scale" | "blur";
  className?: string;
}) {
  const initial =
    from === "left"
      ? { opacity: 0, x: -40 }
      : from === "right"
        ? { opacity: 0, x: 40 }
        : from === "scale"
          ? { opacity: 0, scale: 0.9 }
          : from === "blur"
            ? { opacity: 0, filter: "blur(12px)" }
            : { opacity: 0, y: 32 };
  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function Heading({
  eyebrow,
  title,
  sub,
}: {
  eyebrow: string;
  title: React.ReactNode;
  sub?: string;
}) {
  return (
    <div className="mx-auto mb-16 max-w-2xl text-center">
      <Reveal from="blur">
        <p className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
          {eyebrow}
        </p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.75rem] sm:leading-[1.08]">
          {title}
        </h2>
      </Reveal>
      {sub && (
        <Reveal delay={0.2}>
          <p className="mt-5 text-lg leading-relaxed text-ink-muted">{sub}</p>
        </Reveal>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* FEATURES — premium blocks, glass icon circles, gradient borders      */
/* ------------------------------------------------------------------ */

const FEATURES = [
  {
    icon: Wand2,
    title: "AI logo animation",
    copy: "Upload a static mark, get a tasteful shimmer or draw-in — rendered email-safe.",
  },
  {
    icon: MousePointerClick,
    title: "Tracked CTA button",
    copy: "Every click on “Book a Demo” logged through branded links, never pixels.",
  },
  {
    icon: BadgeCheck,
    title: "Verification badge",
    copy: "A verified-sender mark that earns trust before your first line is read.",
  },
  {
    icon: BarChart3,
    title: "Real analytics",
    copy: "Impressions, clicks and CTR per signature — the ROI number you'll quote.",
  },
  {
    icon: Layers,
    title: "Team rollout",
    copy: "One brand template across fifty inboxes in a single click.",
  },
  {
    icon: Server,
    title: "Edge hosted",
    copy: "Update once, changes everywhere — signatures served from the edge.",
  },
];

export function Features() {
  return (
    <section id="features" className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Heading
          eyebrow="Features"
          title={
            <>
              Everything a signature{" "}
              <span className="text-gradient">should have been</span>
            </>
          }
          sub="Not a fancier business card — a measurable growth surface at the bottom of every email."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 3) * 0.1 + Math.floor(i / 3) * 0.05}>
              <motion.div
                whileHover={{ y: -6, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="gradient-border group h-full rounded-3xl p-7 shadow-[--shadow-card] transition-shadow duration-300 hover:shadow-[--shadow-pop]"
              >
                <span className="glass-card mb-6 flex h-14 w-14 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110">
                  <f.icon className="h-6 w-6 text-accent" />
                </span>
                <h3 className="mb-2 font-display text-lg font-semibold text-ink">{f.title}</h3>
                <p className="text-[15px] leading-relaxed text-ink-muted">{f.copy}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* PRODUCT SHOWCASE — layered floating windows, subtle rotations        */
/* ------------------------------------------------------------------ */

function Window({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden rounded-3xl border border-white/70 bg-white/80 shadow-[--shadow-pop] backdrop-blur-xl ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line/70 bg-cream-dim/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-danger/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-warn/60" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/60" />
        <span className="ml-3 text-[11px] font-medium text-ink-faint">{label}</span>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function ProductShowcase() {
  const reduce = useReducedMotion();
  return (
    <section id="showcase" className="relative overflow-hidden px-6 py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute right-[-140px] top-24 h-96 w-96 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgb(139 125 255 / 0.25), transparent 70%)",
          animation: "blob-pulse 9s ease-in-out infinite",
        }}
      />
      <div className="relative mx-auto max-w-6xl">
        <Heading
          eyebrow="The product"
          title="Built in the editor. Served everywhere."
          sub="Real components, not screenshots — this is the actual signature engine rendering below."
        />

        <div className="relative mx-auto min-h-[480px] max-w-4xl">
          {/* main editor window — tilts toward the cursor like a held card */}
          <Reveal from="scale">
            <motion.div
              animate={reduce ? {} : { y: [0, -8, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="mx-auto max-w-xl"
              style={{ rotate: -1 }}
            >
              <TiltCard maxTilt={7}>
                <Window label="app.sigcraft.com/editor">
                  <SignatureCard data={DEFAULT_SIGNATURE} className="!border-0 !p-2 !shadow-none" />
                </Window>
              </TiltCard>
            </motion.div>
          </Reveal>

          {/* layered floating windows */}
          <Reveal from="left" delay={0.25} className="absolute -left-2 top-40 hidden w-64 lg:block">
            <motion.div
              animate={reduce ? {} : { y: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
              style={{ rotate: 2.5 }}
            >
              <Window label="Analytics">
                <div className="flex h-20 items-end gap-1">
                  {[40, 55, 48, 66, 60, 78, 72, 90, 84, 100].map((h, i) => (
                    <motion.span
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + i * 0.05, duration: 0.4 }}
                      className="flex-1 rounded-t-[3px] bg-gradient-to-t from-accent to-cyan opacity-80"
                    />
                  ))}
                </div>
                <p className="mt-3 text-[11px] font-medium text-ink-muted">
                  CTR <strong className="text-ink">7.8%</strong> · trending up
                </p>
              </Window>
            </motion.div>
          </Reveal>

          <Reveal from="right" delay={0.4} className="absolute -right-2 top-56 hidden w-72 lg:block">
            <motion.div
              animate={reduce ? {} : { y: [0, -12, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              style={{ rotate: -2.5 }}
            >
              <Window label="Install → Gmail">
                <div className="flex flex-col gap-2">
                  {["Copy signature HTML", "Paste in Gmail settings", "Set as default"].map(
                    (step, i) => (
                      <p key={step} className="flex items-center gap-2.5 text-[12px] text-ink-muted">
                        <span className="bg-gradient-accent flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white">
                          {i + 1}
                        </span>
                        {step}
                      </p>
                    )
                  )}
                </div>
              </Window>
            </motion.div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* HOW IT WORKS — 3-step timeline with animated connector               */
/* ------------------------------------------------------------------ */

const STEPS = [
  {
    icon: LayoutTemplate,
    title: "Pick a template",
    copy: "Six pro layouts tuned by role and industry, each already optimized for clicks.",
  },
  {
    icon: Palette,
    title: "Make it yours",
    copy: "Logo, photo, brand color, CTA. The live preview updates on every keystroke.",
  },
  {
    icon: RefreshCcw,
    title: "Sync everywhere",
    copy: "Guided installs for Gmail, Outlook and Apple Mail. Update once — live everywhere.",
  },
];

export function HowItWorks() {
  return (
    <section className="px-6 py-28">
      <div className="mx-auto max-w-6xl">
        <Heading
          eyebrow="How it works"
          title="Live in your inbox in three minutes"
          sub="No designer. No HTML wrangling. No IT ticket."
        />
        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          {/* animated connector line (desktop) */}
          <svg
            aria-hidden
            className="pointer-events-none absolute left-[16%] right-[16%] top-9 hidden h-2 w-[68%] md:block"
            viewBox="0 0 100 2"
            preserveAspectRatio="none"
          >
            <motion.line
              x1="0"
              y1="1"
              x2="100"
              y2="1"
              stroke="url(#step-grad)"
              strokeWidth="2"
              strokeDasharray="4 3"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: "easeInOut", delay: 0.4 }}
            />
            <defs>
              <linearGradient id="step-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#5B5BF7" />
                <stop offset="0.5" stopColor="#8B7DFF" />
                <stop offset="1" stopColor="#00D4FF" />
              </linearGradient>
            </defs>
          </svg>

          {STEPS.map((step, i) => (
            <Reveal key={step.title} delay={0.2 + i * 0.2} from="up">
              <div className="relative flex flex-col items-center text-center">
                <motion.span
                  whileHover={{ scale: 1.08, rotate: 3 }}
                  className="glass-card relative z-10 mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-[24px]"
                >
                  <step.icon className="h-7 w-7 text-accent" />
                  <span className="bg-gradient-accent absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold text-white">
                    {i + 1}
                  </span>
                </motion.span>
                <h3 className="mb-2.5 font-display text-xl font-semibold text-ink">{step.title}</h3>
                <p className="max-w-xs text-[15px] leading-relaxed text-ink-muted">{step.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* BENEFITS — alternating layouts with floating visual panels           */
/* ------------------------------------------------------------------ */

const BENEFITS = [
  {
    eyebrow: "Deliverability",
    title: "Beautiful never costs you the inbox",
    copy: "Table-based HTML, inline CSS, zero tracking pixels. The interactive layer lives on your hosted card — the email itself stays exactly what spam filters expect.",
    points: ["No tracking pixels", "Tested across 14 clients", "Static fallback built-in"],
    visual: "deliverability",
  },
  {
    eyebrow: "Analytics",
    title: "Proof it works, in one number",
    copy: "Impressions, clicks, and click-through rate per signature. Run two variants and let the data pick your best CTA.",
    points: ["Per-element click tracking", "A/B signature variants", "Email-client breakdown"],
    visual: "analytics",
  },
];

function BenefitVisual({ kind }: { kind: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="relative">
      <div
        aria-hidden
        className="absolute inset-0 -m-8 rounded-full blur-3xl"
        style={{
          background:
            kind === "analytics"
              ? "radial-gradient(circle, rgb(0 212 255 / 0.18), transparent 70%)"
              : "radial-gradient(circle, rgb(91 91 247 / 0.18), transparent 70%)",
        }}
      />
      <motion.div
        animate={reduce ? {} : { y: [0, -10, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative"
      >
        {kind === "deliverability" ? (
          <div className="glass-card rounded-3xl p-7">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-success/10 text-success">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-ink">Inbox placement</p>
                <p className="text-xs text-ink-muted">Last 30 days</p>
              </div>
              <span className="ml-auto font-display text-2xl font-bold text-success">99.2%</span>
            </div>
            {["Gmail", "Outlook", "Apple Mail", "Yahoo"].map((client, i) => (
              <div key={client} className="mb-3">
                <div className="mb-1 flex justify-between text-[11px] font-medium">
                  <span className="text-ink-muted">{client}</span>
                  <span className="text-ink">{[99.4, 98.9, 99.6, 98.7][i]}%</span>
                </div>
                <div className="h-2 rounded-full bg-cream-dim">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${[99.4, 98.9, 99.6, 98.7][i]}%` }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.12, duration: 0.7, ease: EASE }}
                    className="h-full rounded-full bg-gradient-to-r from-accent to-violet"
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-3xl p-7">
            <div className="mb-5 flex items-baseline justify-between">
              <p className="font-display text-sm font-semibold text-ink">Click-through rate</p>
              <p className="font-display text-3xl font-bold text-ink">
                7.8% <span className="text-sm font-semibold text-success">↑ 43%</span>
              </p>
            </div>
            <div className="flex h-32 items-end gap-1.5">
              {[30, 42, 38, 52, 47, 63, 58, 74, 68, 85, 80, 96].map((h, i) => (
                <motion.span
                  key={i}
                  initial={{ height: 0 }}
                  whileInView={{ height: `${h}%` }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.25 + i * 0.06, duration: 0.5, ease: EASE }}
                  className="flex-1 rounded-t-md bg-gradient-to-t from-accent via-violet to-cyan opacity-85"
                />
              ))}
            </div>
            <div className="mt-4 flex justify-between text-[10px] text-ink-faint">
              <span>Jul 1</span>
              <span>Jul 14</span>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export function Benefits() {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto flex max-w-6xl flex-col gap-28">
        {BENEFITS.map((b, i) => {
          const reversed = i % 2 === 1;
          return (
            <div
              key={b.title}
              className={`grid items-center gap-14 lg:grid-cols-2 ${
                reversed ? "lg:[&>*:first-child]:order-2" : ""
              }`}
            >
              <Reveal from={reversed ? "right" : "left"}>
                <BenefitVisual kind={b.visual} />
              </Reveal>
              <Reveal from={reversed ? "left" : "right"} delay={0.15}>
                <p className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
                  {b.eyebrow}
                </p>
                <h3 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {b.title}
                </h3>
                <p className="mt-5 text-lg leading-relaxed text-ink-muted">{b.copy}</p>
                <ul className="mt-7 flex flex-col gap-3">
                  {b.points.map((p) => (
                    <li key={p} className="flex items-center gap-3 text-[15px] font-medium text-ink">
                      <span className="glass-card flex h-7 w-7 items-center justify-center rounded-full">
                        <Sparkles className="h-3.5 w-3.5 text-accent" />
                      </span>
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* CTA — animated gradient, floating particles, huge headline           */
/* ------------------------------------------------------------------ */

const PARTICLES = [
  { left: "8%", size: 5, duration: 11, delay: 0 },
  { left: "18%", size: 3, duration: 9, delay: 2 },
  { left: "31%", size: 6, duration: 13, delay: 1 },
  { left: "44%", size: 4, duration: 10, delay: 3.5 },
  { left: "57%", size: 5, duration: 12, delay: 0.8 },
  { left: "68%", size: 3, duration: 8.5, delay: 2.6 },
  { left: "79%", size: 6, duration: 12.5, delay: 1.7 },
  { left: "90%", size: 4, duration: 9.5, delay: 4 },
];

export function FinalCTA() {
  const reduce = useReducedMotion();
  return (
    <section className="px-6 py-28">
      <Reveal from="scale">
        <div className="bg-gradient-animated noise relative mx-auto max-w-6xl overflow-hidden rounded-[28px] px-8 py-24 text-center sm:px-16">
          {/* floating particles */}
          {!reduce &&
            PARTICLES.map((p, i) => (
              <span
                key={i}
                aria-hidden
                className="absolute bottom-[-20px] rounded-full bg-white/50"
                style={{
                  left: p.left,
                  width: p.size,
                  height: p.size,
                  animation: `particle-rise ${p.duration}s linear infinite ${p.delay}s`,
                }}
              />
            ))}

          <motion.h2
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mx-auto max-w-3xl font-display text-4xl font-semibold tracking-tight text-white sm:text-6xl sm:leading-[1.05]"
          >
            Your next email could book a demo.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: EASE }}
            className="mx-auto mt-6 max-w-xl text-lg text-white/85"
          >
            Build your interactive signature in three minutes. Free for 7 days —
            then $12/mo once it&apos;s earning its keep.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
            className="mt-10 flex flex-wrap justify-center gap-4"
          >
            <MagneticButton>
              <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-ink shadow-[0_16px_40px_rgb(17_24_39/0.25)] transition hover:bg-cream"
                >
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.span>
            </MagneticButton>
            <motion.span whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-4 text-base font-semibold text-white backdrop-blur transition hover:bg-white/10"
              >
                See Pricing
              </Link>
            </motion.span>
          </motion.div>
          <p className="mt-7 text-sm text-white/70">
            <MonitorSmartphone className="mr-1.5 inline h-4 w-4" />
            Works with Gmail, Outlook & Apple Mail · Cancel in two clicks
          </p>
        </div>
      </Reveal>
    </section>
  );
}
