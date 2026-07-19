"use client";

/**
 * Landing hero — immersive, Stripe/Linear-grade.
 * Left: staged copy reveal. Right: floating glassmorphism product showcase
 * (dashboard, live signature, analytics, profile, CTA widget, notifications,
 * floating icons) with continuous float loops, glowing background blobs and
 * mouse parallax across three depth layers.
 */

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { MagneticButton, TiltCard } from "./interactions";
import { useSigStore } from "@/lib/store";
import {
  ArrowRight,
  BadgeCheck,
  Bell,
  CalendarCheck,
  Globe,
  Instagram,
  Linkedin,
  MousePointerClick,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

const EASE = [0.21, 0.65, 0.32, 0.95] as const;

const stage = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: EASE },
});

/* ------------------------------------------------------------------ */
/* Showcase cards                                                      */
/* ------------------------------------------------------------------ */

function MiniDashboard() {
  return (
    <div className="glass-card w-[300px] rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[13px] font-semibold text-ink">Signature performance</p>
        <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-semibold text-accent">
          Live
        </span>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-2.5">
        <div className="rounded-2xl bg-white/70 p-3">
          <p className="text-[10px] font-medium text-ink-muted">Impressions</p>
          <p className="font-display text-lg font-bold text-ink">4,812</p>
        </div>
        <div className="rounded-2xl bg-white/70 p-3">
          <p className="text-[10px] font-medium text-ink-muted">CTA clicks</p>
          <p className="font-display text-lg font-bold text-ink">377</p>
        </div>
      </div>
      <div className="flex h-16 items-end gap-1">
        {[34, 48, 40, 58, 52, 70, 64, 82, 76, 92, 86, 100].map((h, i) => (
          <motion.span
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: 0.9 + i * 0.05, duration: 0.5, ease: EASE }}
            className="flex-1 rounded-t-[3px] bg-gradient-to-t from-accent to-violet opacity-90"
          />
        ))}
      </div>
    </div>
  );
}

export interface HeroPersona {
  name: string;
  company: string;
  color: string;
}

const DEFAULT_PERSONA: HeroPersona = {
  name: "Alex Rivera",
  company: "Northwind Labs",
  color: "#5b5bf7",
};

function initialsOf(name: string) {
  return (
    name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "AR"
  );
}

function MiniSignature({ persona }: { persona: HeroPersona }) {
  const name = persona.name.trim() || DEFAULT_PERSONA.name;
  const company = persona.company.trim() || DEFAULT_PERSONA.company;
  return (
    <TiltCard>
      <div className="glass-card w-[280px] rounded-3xl p-4">
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
          <div>
            <motion.p
              key={name}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-1 text-[13px] font-semibold text-ink"
            >
              {name} <BadgeCheck className="h-3.5 w-3.5" style={{ color: persona.color }} />
            </motion.p>
            <p className="text-[11px] text-ink-muted">CEO · {company}</p>
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

function AnalyticsChip() {
  return (
    <div className="glass-card flex w-[190px] items-center gap-3 rounded-3xl p-4">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-success/10 text-success">
        <TrendingUp className="h-4 w-4" />
      </span>
      <div>
        <p className="text-[10px] font-medium text-ink-muted">Reply rate</p>
        <p className="font-display text-base font-bold text-ink">
          +38% <span className="text-[10px] font-semibold text-success">↑</span>
        </p>
      </div>
    </div>
  );
}

function ProfileChip() {
  return (
    <div className="glass-card flex w-[210px] items-center gap-3 rounded-3xl p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet to-cyan text-[11px] font-bold text-white">
        JW
      </div>
      <div>
        <p className="text-[12px] font-semibold text-ink">Jordan Wu</p>
        <p className="text-[10px] text-ink-muted">Verified sender</p>
      </div>
      <ShieldCheck className="ml-auto h-4 w-4 text-accent" />
    </div>
  );
}

function CtaWidget() {
  return (
    <div className="glass-card w-[200px] rounded-3xl p-4">
      <p className="mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold text-ink">
        <CalendarCheck className="h-3.5 w-3.5 text-accent" /> Demo booked
      </p>
      <p className="text-[10px] leading-relaxed text-ink-muted">
        Sarah from Vantage clicked your signature CTA
      </p>
      <span className="mt-2.5 block text-[10px] font-semibold text-accent">2 min ago</span>
    </div>
  );
}

function NotificationChip({ text, delay }: { text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.6, ease: EASE }}
      className="glass-card flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-accent">
        <Bell className="h-3 w-3" />
      </span>
      <p className="text-[11px] font-medium text-ink">{text}</p>
    </motion.div>
  );
}

function FloatingIcon({
  icon: Icon,
  className,
  delay = 0,
}: {
  icon: React.ComponentType<{ className?: string }>;
  className: string;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 15 }}
      className={`glass-card absolute flex h-11 w-11 items-center justify-center rounded-2xl text-accent ${className}`}
    >
      <Icon className="h-4.5 w-4.5" />
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Floating showcase with mouse parallax                               */
/* ------------------------------------------------------------------ */

function FloatLayer({
  children,
  depth,
  mx,
  my,
  className = "",
  bob = 10,
  duration = 6,
  delay = 0,
  rotate = 0,
}: {
  children: React.ReactNode;
  depth: number;
  mx: ReturnType<typeof useSpring>;
  my: ReturnType<typeof useSpring>;
  className?: string;
  bob?: number;
  duration?: number;
  delay?: number;
  rotate?: number;
}) {
  const reduce = useReducedMotion();
  const x = useTransform(mx, (v: number) => v * depth);
  const y = useTransform(my, (v: number) => v * depth);
  return (
    <motion.div style={{ x, y }} className={`absolute ${className}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 32 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay, duration: 0.8, ease: EASE }}
      >
        <motion.div
          animate={reduce ? {} : { y: [0, -bob, 0], rotate: [rotate, rotate + 1, rotate] }}
          transition={{ duration, repeat: Infinity, ease: "easeInOut", delay: delay + 0.8 }}
          style={{ rotate }}
        >
          {children}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function Showcase({ persona }: { persona: HeroPersona }) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const mx = useSpring(rawX, { stiffness: 50, damping: 20 });
  const my = useSpring(rawY, { stiffness: 50, damping: 20 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
    rawY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
  }

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      className="relative h-[520px] w-full max-w-[560px] select-none"
      aria-hidden
    >
      {/* glowing blobs */}
      <div
        className="absolute -left-16 top-6 h-72 w-72 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgb(91 91 247 / 0.35), transparent 70%)",
          animation: "blob-pulse 7s ease-in-out infinite",
        }}
      />
      <div
        className="absolute -right-10 bottom-4 h-80 w-80 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgb(0 212 255 / 0.28), transparent 70%)",
          animation: "blob-pulse 9s ease-in-out infinite 1.5s",
        }}
      />
      <div
        className="absolute left-1/3 top-1/2 h-64 w-64 rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgb(139 125 255 / 0.3), transparent 70%)",
          animation: "blob-pulse 8s ease-in-out infinite 3s",
        }}
      />

      {/* depth layers: far (subtle shift) → near (strong shift) */}
      <FloatLayer depth={8} mx={mx} my={my} className="left-6 top-2" delay={0.5} bob={8} duration={7}>
        <MiniDashboard />
      </FloatLayer>

      <FloatLayer depth={16} mx={mx} my={my} className="right-0 top-24" delay={0.7} bob={12} duration={6} rotate={2}>
        <MiniSignature persona={persona} />
      </FloatLayer>

      <FloatLayer depth={22} mx={mx} my={my} className="left-0 bottom-24" delay={0.9} bob={10} duration={5.5} rotate={-2}>
        <AnalyticsChip />
      </FloatLayer>

      <FloatLayer depth={14} mx={mx} my={my} className="right-10 bottom-2" delay={1.05} bob={9} duration={6.5}>
        <ProfileChip />
      </FloatLayer>

      <FloatLayer depth={26} mx={mx} my={my} className="left-1/2 top-1/2 -translate-x-1/2" delay={1.2} bob={12} duration={5} rotate={1}>
        <CtaWidget />
      </FloatLayer>

      {/* notifications stack */}
      <div className="absolute -right-2 top-0 flex flex-col gap-2">
        <NotificationChip text="+12 CTA clicks today" delay={1.4} />
        <NotificationChip text="Signature synced to Gmail" delay={1.6} />
      </div>

      {/* floating icons */}
      <FloatingIcon icon={Zap} className="left-[46%] top-6" delay={1.5} />
      <FloatingIcon icon={MousePointerClick} className="bottom-40 right-2" delay={1.7} />
      <FloatingIcon icon={Sparkles} className="bottom-0 left-1/3" delay={1.9} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

const CUSTOMER_LOGOS = ["Northwind", "Vantage", "Beacon", "Keystone", "Meridian"];

const PERSONA_COLORS = ["#5b5bf7", "#0d9488", "#b45309", "#dc2626", "#8b7dff"];

/** Inline "make it yours" panel: typing updates the floating signature live,
 *  then carries the personalization straight into the editor — the visitor
 *  has already invested in their signature before ever signing up. */
function PersonaPanel({
  persona,
  onChange,
}: {
  persona: HeroPersona;
  onChange: (p: HeroPersona) => void;
}) {
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
    <div className="glass-card mt-10 max-w-lg rounded-3xl p-5">
      <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent">
        <Sparkles className="h-3.5 w-3.5" /> Try it — watch the card change
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="flex-1">
          <span className="sr-only">Your name</span>
          <input
            value={persona.name}
            onChange={(e) => onChange({ ...persona, name: e.target.value })}
            placeholder="Your name"
            maxLength={40}
            className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </label>
        <label className="flex-1">
          <span className="sr-only">Company</span>
          <input
            value={persona.company}
            onChange={(e) => onChange({ ...persona, company: e.target.value })}
            placeholder="Company"
            maxLength={40}
            className="w-full rounded-xl border border-line bg-white/80 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/15"
          />
        </label>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {PERSONA_COLORS.map((c) => (
            <motion.button
              key={c}
              whileHover={{ scale: 1.18 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onChange({ ...persona, color: c })}
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
  );
}

export function Hero() {
  const [persona, setPersona] = useState<HeroPersona>(DEFAULT_PERSONA);
  return (
    <section className="relative overflow-hidden px-6 pb-28 pt-36 sm:pt-44">
      {/* ambient page glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-220px] h-[560px] w-[1100px] -translate-x-1/2 rounded-full opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(91 91 247 / 0.4), rgb(139 125 255 / 0.18) 45%, transparent 72%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.05fr_1fr]">
        <div>
          <motion.div {...stage(0)}>
            <span className="glass-card inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-ink-muted">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              The signature platform for modern teams
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-bold text-accent">
                NEW
              </span>
            </span>
          </motion.div>

          <motion.h1
            {...stage(1)}
            className="mt-7 font-display text-[2.9rem] font-semibold leading-[1.04] tracking-tight text-ink sm:text-[4rem]"
          >
            Every email you send,
            <br />
            <span className="text-gradient">working like a landing page</span>
          </motion.h1>

          <motion.p
            {...stage(2)}
            className="mt-6 max-w-lg text-lg leading-relaxed text-ink-muted"
          >
            SigCraft turns your email signature into an animated, verified,
            click-tracked asset — so every reply, intro, and follow-up quietly
            books demos for you.
          </motion.p>

          <motion.div {...stage(3)} className="mt-9 flex flex-wrap items-center gap-4">
            <MagneticButton>
              <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link
                  href="/signup"
                  className="bg-gradient-accent inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-[--shadow-glow] transition hover:brightness-110"
                >
                  Start Free <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.span>
            </MagneticButton>
            <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/#showcase"
                className="glass-card inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-ink transition hover:bg-white"
              >
                <Play className="h-4 w-4 text-accent" /> Watch it work
              </Link>
            </motion.span>
          </motion.div>

          <motion.div {...stage(4)} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-ink-muted">
            <span className="flex items-center gap-1.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-warn text-warn" />
              ))}
              <strong className="text-ink">4.9</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> SOC 2 Type II
            </span>
            <span>7-day free trial · No card required</span>
          </motion.div>

          <motion.div {...stage(5)}>
            <PersonaPanel persona={persona} onChange={setPersona} />
          </motion.div>

          <motion.div {...stage(6)} className="mt-10">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-ink-faint">
              Trusted by 12,000+ teams
            </p>
            <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
              {CUSTOMER_LOGOS.map((name) => (
                <span key={name} className="font-display text-base font-semibold text-ink-faint">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="mx-auto hidden w-full sm:block">
          <Showcase persona={persona} />
        </div>
      </div>
    </section>
  );
}
