"use client";

/**
 * Hero — centered copy over a flowing signature showcase, modeled on the
 * customesignature.com hero but built live instead of a pre-rendered video:
 *
 *  - An email compose window sits center stage; a continuous marquee of
 *    industry signature cards (Real Estate, Healthcare, Tech Founder,
 *    Finance, Agency, Consulting, Sales, Product) flows straight through
 *    its signature slot, with a glowing selection ring at the center.
 *  - The strip pauses on hover; every card is a real DOM component.
 *  - Below it, the personalization panel: type your name, watch a live
 *    card become yours, carry it into the editor.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Facebook,
  Globe,
  Instagram,
  Linkedin,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Undo2,
  Youtube,
} from "lucide-react";
import { MagneticButton, TiltCard } from "./interactions";
import { useSigStore } from "@/lib/store";

const EASE = [0.21, 0.65, 0.32, 0.95] as const;

const stage = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: EASE },
});

/* ------------------------------------------------------------------ */
/* Industry example cards (the flowing strip)                          */
/* ------------------------------------------------------------------ */

interface ExamplePersona {
  industry: string;
  name: string;
  title: string;
  company: string;
  domain: string;
  color: string;
}

const EXAMPLES: ExamplePersona[] = [
  { industry: "Real Estate", name: "Maya Bennett", title: "Principal Broker", company: "Keystone Realty", domain: "keystonerealty.com", color: "#b45309" },
  { industry: "Healthcare", name: "Dr. Sarah Chen", title: "Cardiologist", company: "Beacon Health", domain: "beaconhealth.com", color: "#0284c7" },
  { industry: "Tech Founder", name: "Alex Rivera", title: "Co-founder & CEO", company: "Northwind Labs", domain: "northwindlabs.com", color: "#5b5bf7" },
  { industry: "Finance", name: "James Okafor", title: "Wealth Advisor", company: "Vantage Capital", domain: "vantagecap.com", color: "#0f766e" },
  { industry: "Agency", name: "Lena Torres", title: "Creative Director", company: "Studio Meridian", domain: "studiomeridian.co", color: "#8b7dff" },
  { industry: "Consulting", name: "David Kim", title: "Managing Partner", company: "Harbor & Co.", domain: "harborco.com", color: "#db2777" },
  { industry: "Sales", name: "Marcus Webb", title: "Head of Sales", company: "Atlas Outbound", domain: "atlasoutbound.io", color: "#dc2626" },
  { industry: "Product", name: "Priya Nair", title: "Head of Product", company: "Fern & Field", domain: "fernandfield.com", color: "#0d9488" },
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

/** One flowing signature card: icon rail · identity · slanted avatar. */
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
        {/* vertical social rail */}
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
        {/* identity */}
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold tracking-tight" style={{ color: p.color }}>
            {p.company}
          </p>
          <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-ink">
            {p.name}
            <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-[#1d9bf0]" />
          </p>
          <p className="text-[11px] text-ink-muted">{p.title}</p>
          <p className="mt-1 truncate text-[10.5px] text-ink-faint">
            {p.name.split(" ")[0].toLowerCase()}@{p.domain}
          </p>
          <p className="truncate text-[10.5px] text-ink-faint">www.{p.domain}</p>
        </div>
        {/* slanted avatar block, echoing the reference's diagonal photo crop */}
        <div className="relative h-[76px] w-[64px] shrink-0 overflow-hidden">
          <div
            className="absolute inset-y-0 left-1 right-1 flex -skew-x-[10deg] items-center justify-center rounded-lg font-display text-lg font-bold text-white"
            style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}99)` }}
          >
            <span className="skew-x-[10deg]">{initialsOf(p.name)}</span>
          </div>
          <div className="absolute inset-y-0 -right-0.5 w-1.5 -skew-x-[10deg] rounded bg-white/70" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The flowing showcase: marquee through an email compose window       */
/* ------------------------------------------------------------------ */

function SignatureFlow() {
  return (
    <div className="relative mx-auto mt-16 w-full max-w-6xl select-none">
      {/* email compose window, centered beneath the strip */}
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
        {/* signature slot the strip flows through */}
        <div className="h-[150px]" aria-hidden />
        <div className="flex items-center justify-between border-t border-line px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            {/* live toggle */}
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

      {/* the flowing strip — centered on the signature slot */}
      <div className="absolute inset-x-0 top-[63%] z-10 -translate-y-1/2 overflow-hidden py-8 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
        <div className="marquee-row flex w-max gap-6 pr-6">
          {[...EXAMPLES, ...EXAMPLES].map((p, i) => (
            <ExampleCard key={`${p.company}-${i}`} p={p} />
          ))}
        </div>
      </div>

      {/* glowing selection ring, sharing the strip's center — cards flow through it */}
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

/* ------------------------------------------------------------------ */
/* Personalization panel (kept from the previous hero)                 */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pb-24 pt-36 sm:pt-40">
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[560px] w-[1100px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(91 91 247 / 0.4), rgb(139 125 255 / 0.18) 45%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <motion.div {...stage(0)}>
          <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-ink-muted">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            Supercharge your email signature
          </span>
        </motion.div>

        <motion.h1
          {...stage(1)}
          className="mx-auto mt-7 max-w-3xl font-display text-[2.9rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-[4rem]"
        >
          Stand out in <span className="text-gradient">every inbox</span>
        </motion.h1>

        <motion.p
          {...stage(2)}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
        >
          Animated, verified, click-tracked signatures — whatever your industry,
          your email starts booking demos for you.
        </motion.p>

        <motion.div {...stage(3)} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/signup"
                className="bg-gradient-accent inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-[--shadow-glow] transition hover:brightness-110"
              >
                Get Started, Free <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.span>
          </MagneticButton>
          <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/#showcase"
              className="glass-card inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-ink transition hover:bg-white"
            >
              <Play className="h-4 w-4 text-accent" /> See how it works
            </Link>
          </motion.span>
        </motion.div>

        <motion.div
          {...stage(4)}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted"
        >
          <span className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-warn text-warn" />
            ))}
            <strong className="text-ink">4.9</strong> on G2
          </span>
          <span className="hidden h-4 w-px bg-line sm:block" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-success" /> SOC 2 Type II
          </span>
          <span className="hidden h-4 w-px bg-line sm:block" />
          <span>7-day free trial · No card required</span>
        </motion.div>

        {/* the flowing showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.55, ease: EASE }}
        >
          <SignatureFlow />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.85, ease: EASE }}
        >
          <PersonaPanel />
        </motion.div>
      </div>
    </section>
  );
}
