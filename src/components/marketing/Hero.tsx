"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { MousePointer2, Sparkles } from "lucide-react";
import { Button, Pill } from "@/components/ui";
import { SignatureCard } from "@/components/signature/SignatureCard";
import { DEFAULT_SIGNATURE } from "@/lib/templates";
import type { SignatureData } from "@/lib/types";

/**
 * Live looping demo: the real SignatureCard component cycling through brand
 * colors/templates while a simulated cursor sweeps across its interactive
 * elements — not a video, not a GIF; the same component the editor renders.
 */
const DEMO_STATES: Partial<SignatureData>[] = [
  { brandColor: "#4f46e5", templateId: "aurora", ctaText: "Book a Demo" },
  { brandColor: "#0f766e", templateId: "ledger", ctaText: "View Calendar" },
  { brandColor: "#b45309", templateId: "compass", ctaText: "See Listings" },
  { brandColor: "#8b5cf6", templateId: "monogram", ctaText: "Visit Website" },
];

// Cursor waypoints, roughly matching card hotspots (social row → badge → CTA)
const CURSOR_PATH = [
  { x: 110, y: 150 },
  { x: 175, y: 150 },
  { x: 205, y: 42 },
  { x: 140, y: 208 },
];

function HeroSignatureDemo() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => s + 1), 2600);
    return () => clearInterval(t);
  }, []);

  const state = DEMO_STATES[step % DEMO_STATES.length];
  const cursor = CURSOR_PATH[step % CURSOR_PATH.length];

  return (
    <div className="relative">
      <motion.div
        key={state.templateId}
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.21, 0.65, 0.32, 0.95] }}
      >
        <SignatureCard data={{ ...DEFAULT_SIGNATURE, ...state }} className="shadow-[--shadow-pop]" />
      </motion.div>

      {/* simulated cursor sweeping the interactive hotspots */}
      <motion.div
        animate={{ x: cursor.x, y: cursor.y }}
        transition={{ type: "spring", stiffness: 60, damping: 14 }}
        className="pointer-events-none absolute left-0 top-0 z-10"
        aria-hidden
      >
        <MousePointer2 className="h-5 w-5 fill-ink text-white drop-shadow-md" />
        <motion.span
          key={step}
          initial={{ scale: 0, opacity: 0.6 }}
          animate={{ scale: 2.2, opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute -left-2 -top-2 h-9 w-9 rounded-full border-2 border-accent"
        />
      </motion.div>

      {/* floating metric chips to sell the loop */}
      <motion.div
        className="absolute -right-8 -top-6 hidden sm:block"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="rounded-2xl border border-line bg-white px-4 py-2.5 shadow-[--shadow-pop]">
          <p className="text-[11px] font-medium text-ink-faint">CTA clicks this week</p>
          <p className="font-display text-lg font-bold text-ink">
            127 <span className="text-xs font-semibold text-success">↑ 43%</span>
          </p>
        </div>
      </motion.div>
      <motion.div
        className="absolute -bottom-7 -left-6 hidden sm:block"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <div className="rounded-2xl border border-line bg-white px-4 py-2.5 shadow-[--shadow-pop]">
          <p className="text-[11px] font-medium text-ink-faint">Demos booked</p>
          <p className="font-display text-lg font-bold text-ink">
            9 <span className="text-xs font-semibold text-success">this week</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="dot-grid relative overflow-hidden px-6 pb-24 pt-36 sm:pt-44">
      {/* soft accent wash behind the headline */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[900px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(99 102 241 / 0.5), rgb(139 92 246 / 0.25) 50%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Pill className="mb-6">
              <Sparkles className="h-3 w-3 text-accent" />
              Interactive signatures, hosted & tracked
            </Pill>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-[2.75rem] font-semibold leading-[1.05] tracking-tight text-ink sm:text-6xl"
          >
            Turn Every Email Into a{" "}
            <span className="text-gradient">Demo Booking Machine</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mt-6 max-w-xl text-lg leading-relaxed text-ink-muted"
          >
            Your signature is seen more than your website. SigCraft makes it animated,
            verified, and clickable — with a tracked CTA that turns everyday replies
            into booked demos.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.24 }}
            className="mt-9 flex flex-wrap items-center gap-4"
          >
            <Button size="lg" href="/signup">
              Build Yours Free →
            </Button>
            <Button size="lg" variant="secondary" href="/#demo">
              Try the Live Demo
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-5 text-sm text-ink-faint"
          >
            Free 7-day Pro trial · No credit card required · Works with Gmail, Outlook & Apple Mail
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto"
        >
          <HeroSignatureDemo />
        </motion.div>
      </div>
    </section>
  );
}
