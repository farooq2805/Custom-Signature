"use client";

/**
 * Industry showcase section (moved out of the hero): the email compose
 * window with the stop-and-go strip of recognizable-brand signature cards,
 * followed by the "make it yours" personalization panel.
 */

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Send,
  Sparkles,
  Trash2,
  Undo2,
  Youtube,
} from "lucide-react";
import { FadeUp } from "@/components/ui";
import { TiltCard } from "./interactions";
import { useSigStore } from "@/lib/store";

const EASE = [0.21, 0.65, 0.32, 0.95] as const;

interface ExamplePersona {
  industry: string;
  name: string;
  title: string;
  company: string;
  domain: string;
  color: string;
  photo: string;
}

/**
 * Recognizable-brand demo personas (fictional people, nominative brand
 * references — the same device the reference site uses with Zapier and
 * Squarespace) so the flowing signatures read instantly credible.
 */
const EXAMPLES: ExamplePersona[] = [
  { industry: "Sales", name: "Marcus Webb", title: "VP of Sales", company: "Salesforce", domain: "salesforce.com", color: "#00A1E0", photo: "https://randomuser.me/api/portraits/men/32.jpg" },
  { industry: "Real Estate", name: "Maya Bennett", title: "Principal Broker", company: "Zillow", domain: "zillow.com", color: "#1277e1", photo: "https://randomuser.me/api/portraits/women/44.jpg" },
  { industry: "Healthcare", name: "Dr. Sarah Chen", title: "Medical Director", company: "Pfizer", domain: "pfizer.com", color: "#0093d0", photo: "https://randomuser.me/api/portraits/women/65.jpg" },
  { industry: "Tech Founder", name: "Alex Rivera", title: "Co-founder & CEO", company: "Shopify", domain: "shopify.com", color: "#5E8E3E", photo: "https://randomuser.me/api/portraits/men/85.jpg" },
  { industry: "Finance", name: "James Okafor", title: "Managing Director", company: "Goldman Sachs", domain: "gs.com", color: "#1f4e79", photo: "https://randomuser.me/api/portraits/men/52.jpg" },
  { industry: "Agency", name: "Lena Torres", title: "Creative Director", company: "Adobe", domain: "adobe.com", color: "#FA0F00", photo: "https://randomuser.me/api/portraits/women/68.jpg" },
  { industry: "Consulting", name: "David Kim", title: "Managing Partner", company: "Deloitte", domain: "deloitte.com", color: "#26890d", photo: "https://randomuser.me/api/portraits/men/11.jpg" },
  { industry: "Product", name: "Priya Nair", title: "Head of Product", company: "Netflix", domain: "netflix.com", color: "#E50914", photo: "https://randomuser.me/api/portraits/women/17.jpg" },
];

function initialsOf(name: string) {
  return (
    name
      .replace(/^Dr\.\s*/i, "")
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AR"
  );
}

const RAIL_ICONS = [Globe, Instagram, Linkedin, Facebook, Youtube];

/** One flowing signature card: icon rail · identity · slanted portrait. */
function ExampleCard({ p }: { p: ExamplePersona }) {
  return (
    <div className="group/card relative w-[320px] shrink-0 rounded-2xl border border-line bg-white p-4 shadow-[--shadow-card] transition-transform duration-300 hover:scale-[1.04] hover:shadow-[--shadow-pop]">
      <span
        className="absolute -top-2.5 left-4 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white"
        style={{ background: p.color }}
      >
        {p.industry}
      </span>
      <div className="flex items-center gap-3.5">
        <div className="flex flex-col gap-1.5 rounded-xl border border-line p-1.5">
          {RAIL_ICONS.map((Icon, i) => (
            <span
              key={i}
              className="flex h-5 w-5 items-center justify-center text-ink-faint transition-colors group-hover/card:text-ink"
              style={{ transitionDelay: `${i * 40}ms` }}
            >
              <Icon className="h-3 w-3" />
            </span>
          ))}
        </div>
        <div className="min-w-0 flex-1">
          {/* animated wordmark: shimmer sweep sells "this logo is alive/clickable" */}
          <p
            className="w-fit cursor-pointer font-display text-base font-bold tracking-tight transition-transform duration-200 hover:scale-105"
            style={{
              backgroundImage: `linear-gradient(100deg, ${p.color} 38%, #ffffff 50%, ${p.color} 62%)`,
              backgroundSize: "220% 100%",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              animation: "shimmer 3s linear infinite",
            }}
          >
            {p.company}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-ink">
            {p.name}
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#1d9bf0]" />
          </p>
          <p className="text-[11px] text-ink-muted">{p.title}</p>
          <p className="mt-1 truncate text-[10.5px] text-ink-faint">
            {p.name.replace(/^Dr\.\s*/i, "").split(" ")[0].toLowerCase()}@{p.domain}
          </p>
          <p className="truncate text-[10.5px] text-ink-faint">www.{p.domain}</p>
        </div>
        {/* slanted portrait with initials fallback */}
        <div className="relative h-[76px] w-[64px] shrink-0">
          <div
            className="absolute inset-y-0 left-1 right-1 flex -skew-x-[10deg] items-center justify-center overflow-hidden rounded-lg"
            style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}
          >
            <span className="skew-x-[10deg] font-display text-lg font-bold text-white">
              {initialsOf(p.name)}
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.photo}
              alt=""
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
              className="absolute inset-0 h-full w-full skew-x-[10deg] scale-[1.25] object-cover"
            />
          </div>
          <div className="absolute inset-y-0 -right-0.5 w-1.5 -skew-x-[10deg] rounded bg-white/70" />
        </div>
      </div>
    </div>
  );
}

/** Stop-and-go strip: each card glides into the ring, dwells, then advances. */
function SteppedStrip() {
  const reduce = useReducedMotion();
  const [pos, setPos] = useState(0);
  const [instant, setInstant] = useState(false);
  const paused = useRef(false);
  const CARD = 320 + 24;
  const N = EXAMPLES.length;

  useEffect(() => {
    if (reduce) return;
    const t = setInterval(() => {
      if (!paused.current) setPos((p) => (p < N ? p + 1 : p));
    }, 2600);
    return () => clearInterval(t);
  }, [reduce, N]);

  useEffect(() => {
    if (!instant) return;
    const id = requestAnimationFrame(() => setInstant(false));
    return () => cancelAnimationFrame(id);
  }, [instant]);

  return (
    <div
      className="overflow-hidden py-8 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <motion.div
        className="flex w-max gap-6 pr-6"
        animate={{ x: -pos * CARD }}
        transition={instant ? { duration: 0 } : { duration: 0.7, ease: EASE }}
        onAnimationComplete={() => {
          if (pos === N) {
            setInstant(true);
            setPos(0);
          }
        }}
        style={{ willChange: "transform", paddingLeft: `calc(50% - ${160 + 2 * CARD}px)` }}
      >
        {[...EXAMPLES.slice(-2), ...EXAMPLES, ...EXAMPLES].map((p, i) => (
          <ExampleCard key={`${p.company}-${i}`} p={p} />
        ))}
      </motion.div>
    </div>
  );
}

function SignatureFlow() {
  return (
    <div className="relative mx-auto w-full max-w-6xl select-none">
      <div className="relative z-0 mx-auto max-w-2xl rounded-3xl border border-line bg-white shadow-[--shadow-pop]">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="bg-gradient-accent flex h-9 w-9 items-center justify-center rounded-full font-display text-sm font-bold text-white">
              S
            </span>
            <div>
              <p className="text-sm font-semibold text-ink">SigCraft</p>
              <p className="text-xs text-ink-faint">to: jordan@prospect.com</p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-ink-faint">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line"><Undo2 className="h-3.5 w-3.5" /></span>
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-line"><Trash2 className="h-3.5 w-3.5" /></span>
          </div>
        </div>
        <div className="px-6 pt-5">
          <p className="text-sm text-ink-muted">Hey Jordan,</p>
          <div className="mt-3 h-2 w-2/5 rounded-full bg-cream-dim" />
          <div className="mt-2 h-2 w-3/5 rounded-full bg-cream-dim" />
          <p className="mt-4 text-sm text-ink-muted">Best,</p>
        </div>
        <div className="h-[150px]" aria-hidden />
        <div className="flex items-center justify-between border-t border-line px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <span className="relative inline-flex h-6 w-11 items-center rounded-full bg-accent">
              <motion.span
                className="absolute h-5 w-5 rounded-full bg-white shadow"
                animate={{ x: [3, 23, 23, 3] }}
                transition={{ duration: 6, times: [0, 0.12, 0.88, 1], repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            <span className="text-sm font-medium text-ink">SigCraft</span>
          </div>
          <span className="flex items-center gap-2 rounded-full border border-line px-5 py-2 text-sm font-semibold text-ink">
            <Send className="h-3.5 w-3.5" /> Send
          </span>
        </div>
      </div>

      <div className="absolute inset-x-0 top-[63%] z-10 -translate-y-1/2">
        <SteppedStrip />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[63%] z-20 h-[158px] w-[348px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-accent"
        style={{
          boxShadow:
            "0 0 0 4px rgb(91 91 247 / 0.15), 0 0 32px rgb(91 91 247 / 0.35), inset 0 0 24px rgb(91 91 247 / 0.06)",
        }}
      />
    </div>
  );
}

/* ---------------- Personalization panel ---------------- */

interface HeroPersona {
  name: string;
  company: string;
  color: string;
}

const DEFAULT_PERSONA: HeroPersona = {
  name: "Alex Rivera",
  company: "Northwind Labs",
  color: "#5b5bf7",
};

const PERSONA_COLORS = ["#5b5bf7", "#0d9488", "#b45309", "#dc2626", "#8b7dff"];

function LiveMiniCard({ persona }: { persona: HeroPersona }) {
  const name = persona.name.trim() || DEFAULT_PERSONA.name;
  const company = persona.company.trim() || DEFAULT_PERSONA.company;
  return (
    <TiltCard>
      <div className="glass-card w-[270px] rounded-3xl p-4">
        <div className="flex items-center gap-3">
          <motion.div
            key={persona.color + initialsOf(name)}
            initial={{ scale: 0.7, rotate: -12, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="flex h-11 w-11 items-center justify-center rounded-2xl font-display text-sm font-bold text-white"
            style={{ background: persona.color }}
          >
            {initialsOf(name)}
          </motion.div>
          <div className="min-w-0">
            <motion.p
              key={name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 truncate text-[13px] font-semibold text-ink"
            >
              {name} <BadgeCheck className="h-3.5 w-3.5 shrink-0" style={{ color: persona.color }} />
            </motion.p>
            <p className="truncate text-[11px] text-ink-muted">CEO · {company}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5">
          {[Globe, Linkedin, Instagram].map((Icon, i) => (
            <motion.span
              key={i}
              whileHover={{ scale: 1.2, y: -2 }}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-line bg-white text-ink-muted"
            >
              <Icon className="h-3 w-3" />
            </motion.span>
          ))}
          <span
            className="sig-cta-pulse ml-auto rounded-full px-3.5 py-1.5 text-[11px] font-semibold text-white"
            style={{ background: persona.color }}
          >
            Book a Demo →
          </span>
        </div>
      </div>
    </TiltCard>
  );
}

function PersonaPanel() {
  const [persona, setPersona] = useState<HeroPersona>(DEFAULT_PERSONA);
  const router = useRouter();
  const update = useSigStore((s) => s.update);

  function continueInEditor() {
    update({
      name: persona.name.trim() || DEFAULT_PERSONA.name,
      company: persona.company.trim() || DEFAULT_PERSONA.company,
      brandColor: persona.color,
    });
    router.push("/editor");
  }

  return (
    <div className="glass-card mx-auto mt-16 flex max-w-3xl flex-col items-center gap-7 rounded-3xl p-7 sm:flex-row">
      <div className="flex-1">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
          <Sparkles className="h-3.5 w-3.5" /> Now make it yours
        </p>
        <div className="flex flex-col gap-3">
          <label>
            <span className="sr-only">Your name</span>
            <input
              value={persona.name}
              onChange={(e) => setPersona({ ...persona, name: e.target.value })}
              placeholder="Your name"
              maxLength={40}
              className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </label>
          <label>
            <span className="sr-only">Company</span>
            <input
              value={persona.company}
              onChange={(e) => setPersona({ ...persona, company: e.target.value })}
              placeholder="Company"
              maxLength={40}
              className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
            />
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {PERSONA_COLORS.map((c) => (
                <motion.button
                  key={c}
                  whileHover={{ scale: 1.18 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPersona({ ...persona, color: c })}
                  aria-label={`Brand color ${c}`}
                  className={`h-7 w-7 rounded-full border-2 transition ${
                    persona.color === c ? "border-ink" : "border-transparent"
                  }`}
                  style={{ background: c }}
                />
              ))}
            </div>
            <button
              onClick={continueInEditor}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent transition hover:gap-2.5"
            >
              Continue in the editor <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
      <LiveMiniCard persona={persona} />
    </div>
  );
}

/* ---------------- The section ---------------- */

export function IndustryShowcase() {
  return (
    <section className="overflow-hidden px-6 py-24">
      <div className="mx-auto mb-14 max-w-2xl text-center">
        <FadeUp>
          <p className="mb-4 inline-block rounded-full bg-accent-soft px-4 py-1 text-xs font-bold uppercase tracking-widest text-accent">
            Every industry
          </p>
        </FadeUp>
        <FadeUp delay={0.1}>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-[2.6rem]">
            Whatever you do, <span className="text-gradient">it signs better</span>
          </h2>
        </FadeUp>
      </div>
      <FadeUp delay={0.15}>
        <SignatureFlow />
      </FadeUp>
      <FadeUp delay={0.1}>
        <PersonaPanel />
      </FadeUp>
    </section>
  );
}
