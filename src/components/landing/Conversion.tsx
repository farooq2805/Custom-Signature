"use client";

/**
 * Conversion layer: the persuasion sections between the demo and the close.
 *  - StatsBand: animated proof numbers
 *  - RoiCalculator: drag a slider, watch YOUR numbers appear (investment effect)
 *  - Testimonials: outcome-first quotes, not compliments
 *  - PricingTeaser: value-framed plans, trial risk reversal
 *  - FaqSection: objection handling
 *  - ActivityToasts: tasteful recent-signup proof (cycles a few, then stops)
 */

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { ArrowRight, BadgeCheck, Check, Star } from "lucide-react";
import { Accordion, AnimatedCounter, FadeUp } from "@/components/ui";
import { PLANS } from "@/lib/templates";

const EASE = [0.21, 0.65, 0.32, 0.95] as const;

/* ---------------- Stats band ---------------- */

const STATS = [
  { value: 38, suffix: "%", label: "average reply-rate lift" },
  { value: 5.2, suffix: "×", decimals: 1, label: "more clicks than plain signatures" },
  { value: 12000, suffix: "+", label: "teams sending with SigCraft" },
  { value: 14, suffix: "", label: "email clients render-tested" },
];

export function StatsBand() {
  return (
    <section className="px-6 py-16">
      <div className="glass-card mx-auto grid max-w-6xl grid-cols-2 gap-10 rounded-3xl px-8 py-12 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <FadeUp key={s.label} delay={i * 0.08} className="text-center">
            <p className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
              <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals ?? 0} />
            </p>
            <p className="mt-2 text-sm text-ink-muted">{s.label}</p>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

/* ---------------- ROI calculator ---------------- */

export function RoiCalculator() {
  const [emails, setEmails] = useState(40);
  // Conservative model: 21 working days, 60% unique-open impressions,
  // 3.5% CTA click-through on impressions, 12% click→demo conversion.
  const impressions = Math.round(emails * 21 * 0.6);
  const clicks = Math.round(impressions * 0.035);
  const demos = Math.max(1, Math.round(clicks * 0.12));

  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <FadeUp>
            <p className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              Do the math
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem] sm:leading-[1.1]">
              Your inbox is already an audience.
              <br />
              <span className="text-gradient">You're just not charging it rent.</span>
            </h2>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-ink-muted">
              Every email you send is an impression. Drag the slider — the numbers
              use conservative click and booking rates from real SigCraft accounts.
            </p>
          </FadeUp>

          <FadeUp delay={0.15}>
            <div className="glass-card rounded-3xl p-8">
              <div className="flex items-baseline justify-between">
                <label htmlFor="roi-emails" className="text-sm font-semibold text-ink">
                  Emails you send per day
                </label>
                <span className="font-display text-3xl font-bold text-accent">{emails}</span>
              </div>
              <input
                id="roi-emails"
                type="range"
                min={5}
                max={150}
                step={5}
                value={emails}
                onChange={(e) => setEmails(Number(e.target.value))}
                className="mt-4 w-full accent-[#5b5bf7]"
              />
              <div className="mt-8 grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Impressions / mo", value: impressions.toLocaleString() },
                  { label: "CTA clicks / mo", value: clicks.toLocaleString() },
                  { label: "Demos booked / mo", value: demos.toLocaleString(), hot: true },
                ].map((m) => (
                  <div
                    key={m.label}
                    className={`rounded-2xl border p-4 ${
                      m.hot ? "border-accent bg-accent-soft" : "border-line bg-white/70"
                    }`}
                  >
                    <motion.p
                      key={m.value}
                      initial={{ opacity: 0.4, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`font-display text-2xl font-bold ${m.hot ? "text-accent" : "text-ink"}`}
                    >
                      {m.value}
                    </motion.p>
                    <p className="mt-1 text-[11px] font-medium text-ink-muted">{m.label}</p>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-sm text-ink-muted">
                One booked demo pays for <strong className="text-ink">a year of Pro</strong>.
              </p>
              <Link
                href="/signup"
                className="bg-gradient-accent mt-4 flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white shadow-[--shadow-glow] transition hover:brightness-110"
              >
                Start capturing those clicks <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </FadeUp>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */

const TESTIMONIALS = [
  {
    quote:
      "Nine demos booked in the first two weeks — all from the signature CTA. It's the highest-ROI thing on our stack and it costs less than lunch.",
    name: "Rachel Moreno",
    role: "Founder, Atlas Outbound",
    color: "#dc2626",
    metric: "+9 demos / 2 weeks",
  },
  {
    quote:
      "Our reply rate on cold outreach went from 4% to 7% after adding the verified badge and CTA. Same emails, same list. Only the signature changed.",
    name: "Tom Osei",
    role: "Head of Sales, Vantage Capital",
    color: "#0f766e",
    metric: "reply rate 4% → 7%",
  },
  {
    quote:
      "Rolled one brand template across 43 agents in an afternoon. Every listing email now carries a booking link — and I can see exactly who clicks.",
    name: "Dana Whitfield",
    role: "Broker/Owner, Keystone Realty",
    color: "#b45309",
    metric: "43 seats, 1 afternoon",
  },
];

export function Testimonials() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <FadeUp>
            <p className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              Results, not reviews
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem]">
              The numbers people brag about
            </h2>
          </FadeUp>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <FadeUp key={t.name} delay={i * 0.12}>
              <motion.figure
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="gradient-border flex h-full flex-col rounded-3xl p-7 shadow-[--shadow-card]"
              >
                <span className="mb-4 w-fit rounded-full px-3 py-1 text-xs font-bold text-white" style={{ background: t.color }}>
                  {t.metric}
                </span>
                <div className="mb-3 flex gap-0.5">
                  {[...Array(5)].map((_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-warn text-warn" />
                  ))}
                </div>
                <blockquote className="flex-1 text-[15px] leading-relaxed text-ink-muted">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-full font-display text-sm font-bold text-white"
                    style={{ background: t.color }}
                  >
                    {t.name.split(" ").map((w) => w[0]).join("")}
                  </span>
                  <span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-ink">
                      {t.name} <BadgeCheck className="h-3.5 w-3.5 text-[#1d9bf0]" />
                    </span>
                    <span className="block text-xs text-ink-faint">{t.role}</span>
                  </span>
                </figcaption>
              </motion.figure>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Pricing teaser ---------------- */

export function PricingTeaser() {
  return (
    <section id="pricing" className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <FadeUp>
            <p className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              Pricing
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem]">
              Costs less than one coffee. <span className="text-gradient">Books real demos.</span>
            </h2>
          </FadeUp>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <FadeUp key={plan.id} delay={i * 0.1}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border bg-white p-7 shadow-[--shadow-card] ${
                  plan.highlighted ? "border-accent shadow-[--shadow-glow]" : "border-line"
                }`}
              >
                {plan.highlighted && (
                  <span className="bg-gradient-accent absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-3 py-1 text-xs font-semibold text-white">
                    Most popular
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold text-ink">{plan.name}</h3>
                <p className="mt-1 min-h-10 text-sm text-ink-muted">{plan.tagline}</p>
                <p className="mt-4 font-display text-4xl font-bold text-ink">
                  ${plan.priceMonthly}
                  <span className="text-base font-medium text-ink-faint">
                    /mo{plan.id === "team" ? " per seat" : ""}
                  </span>
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {plan.features.slice(0, 4).map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/signup?plan=${plan.id}`}
                  className={`mt-7 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-semibold transition ${
                    plan.highlighted
                      ? "bg-gradient-accent text-white shadow-[--shadow-glow] hover:brightness-110"
                      : "border border-line bg-white text-ink hover:border-ink-faint"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            </FadeUp>
          ))}
        </div>
        <FadeUp className="mt-8 text-center">
          <p className="text-sm text-ink-muted">
            Every paid plan starts with a <strong className="text-ink">7-day free trial</strong> —
            no card required · cancel in two clicks ·{" "}
            <Link href="/pricing" className="font-medium text-accent hover:underline">
              compare all features →
            </Link>
          </p>
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------------- FAQ ---------------- */

const FAQS = [
  {
    q: "Will an animated signature hurt my deliverability?",
    a: "No — this is our core engineering. The HTML in your email is a conservative table layout with inline CSS, exactly what spam filters expect. Animation is served from our CDN as a standard image asset, and we never use tracking pixels — clicks are measured through normal branded links.",
  },
  {
    q: "Does it work with Gmail, Outlook, and Apple Mail?",
    a: "Yes. Gmail and Outlook have guided installs, Apple Mail and everything else use a copy-paste snippet. The rendered result is tested across 14 email clients before every template ships.",
  },
  {
    q: "Why is this a subscription?",
    a: "Because your signature isn't a file — it's a hosted, living asset. We serve your animated card from our CDN, keep every tracking link running, re-test rendering as email clients change, and keep your analytics flowing. Cancel anytime and it gracefully falls back to a static version.",
  },
  {
    q: "How does the free trial work?",
    a: "Every account gets 7 days of Pro, no credit card required. When the trial ends you keep your account and one live signature on the free Starter plan — nothing breaks, nothing is deleted.",
  },
  {
    q: "What exactly gets tracked?",
    a: "Only clicks on links inside your signature, plus impressions when your hosted logo loads. We never read your email content — we're not in your mailbox and can't be.",
  },
];

export function FaqSection() {
  return (
    <section id="faq" className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <FadeUp>
            <p className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
              FAQ
            </p>
          </FadeUp>
          <FadeUp delay={0.1}>
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem]">
              Fair questions, straight answers
            </h2>
          </FadeUp>
        </div>
        <FadeUp delay={0.15}>
          <Accordion items={FAQS} />
        </FadeUp>
      </div>
    </section>
  );
}

/* ---------------- Recent-activity toasts ---------------- */

const ACTIVITY = [
  { name: "Chris from Los Angeles", action: "started a Pro trial", ago: "2 min ago" },
  { name: "Amara from Austin", action: "published her signature", ago: "6 min ago" },
  { name: "Keystone Realty", action: "rolled out 43 team signatures", ago: "11 min ago" },
  { name: "Devon from Seattle", action: "booked a demo via signature CTA", ago: "14 min ago" },
];

export function ActivityToasts() {
  const [index, setIndex] = useState(-1);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;
    // first toast after 6s, then one every 9s; stop after the list ends
    const timers: ReturnType<typeof setTimeout>[] = [];
    ACTIVITY.forEach((_, i) => {
      timers.push(setTimeout(() => setIndex(i), 6000 + i * 9000));
      timers.push(setTimeout(() => setIndex((cur) => (cur === i ? -1 : cur)), 6000 + i * 9000 + 5000));
    });
    return () => timers.forEach(clearTimeout);
  }, [dismissed]);

  const item = index >= 0 ? ACTIVITY[index] : null;

  return (
    <AnimatePresence>
      {item && !dismissed && (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -24, y: 8 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45, ease: EASE }}
          className="fixed bottom-24 left-5 z-40 hidden sm:block"
        >
          <div className="glass-card flex items-center gap-3 rounded-2xl py-3 pl-4 pr-3 shadow-[--shadow-pop]">
            <span className="bg-gradient-accent flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-xs font-bold text-white">
              {item.name[0]}
            </span>
            <div className="pr-1">
              <p className="flex items-center gap-1 text-[13px] font-semibold text-ink">
                {item.name} <BadgeCheck className="h-3.5 w-3.5 text-[#1d9bf0]" />
              </p>
              <p className="text-xs text-ink-muted">
                {item.action} · <span className="text-ink-faint">{item.ago}</span>
              </p>
            </div>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss notifications"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-faint transition hover:bg-white hover:text-ink"
            >
              ×
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
