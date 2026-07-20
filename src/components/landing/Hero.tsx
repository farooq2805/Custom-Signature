"use client";

/**
 * Dark cinematic hero — the transformation story, played once:
 *
 *   Phase "drift"  (~3.5s): six boring plain-text signatures float on the
 *                           dark stage, the way most emails end today.
 *   Phase "sweep"  (~1.1s): a gradient beam sweeps left→right; each boring
 *                           signature is blown away as the beam passes.
 *   Phase "reveal" (~0.9s): our animated signature lands center stage with
 *                           a glow burst.
 *   Phase "settled":        the landing card is the real, live, hoverable
 *                           SignatureCard — plus a replay control.
 *
 * prefers-reduced-motion skips straight to "settled".
 */

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, RotateCcw, ShieldCheck, Sparkles, Star } from "lucide-react";
import { SignatureCard } from "@/components/signature/SignatureCard";
import { DEFAULT_SIGNATURE } from "@/lib/templates";
import { MagneticButton } from "./interactions";

const EASE = [0.21, 0.65, 0.32, 0.95] as const;

const stage = (i: number) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay: 0.1 + i * 0.12, ease: EASE },
});

type Phase = "drift" | "sweep" | "reveal" | "settled";

/* ---------------- The boring signatures ---------------- */

interface BoringSig {
  lines: string[];
  x: string; // left %
  y: string; // top %
  rotate: number;
  bob: number;
  delay: number;
}

const BORING: BoringSig[] = [
  { lines: ["Best regards,", "John Smith", "Sales Manager", "Tel: 555-0134"], x: "4%", y: "8%", rotate: -3, bob: 9, delay: 0 },
  { lines: ["Thanks,", "Mary Johnson", "Account Executive"], x: "38%", y: "2%", rotate: 2, bob: 11, delay: 0.6 },
  { lines: ["Sent from my iPhone"], x: "74%", y: "12%", rotate: -2, bob: 8, delay: 1.1 },
  { lines: ["Kind regards,", "Bob Wilson", "Regional Director", "ext. 4402"], x: "10%", y: "58%", rotate: 2.5, bob: 10, delay: 0.3 },
  { lines: ["--", "Dave Miller", "Consultant", "dave.m@aol.com"], x: "44%", y: "64%", rotate: -1.5, bob: 12, delay: 0.9 },
  { lines: ["Regards,", "Susan Lee", "Office Admin"], x: "76%", y: "56%", rotate: 3, bob: 9, delay: 1.4 },
];

function BoringCard({ sig, phase }: { sig: BoringSig; phase: Phase }) {
  const reduce = useReducedMotion();
  const leaving = phase !== "drift"; // once swept away, they stay gone
  // beam travels left→right: cards exit in x order
  const exitDelay = (parseFloat(sig.x) / 100) * 0.7;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={
        leaving
          ? {
              opacity: 0,
              x: 140,
              rotate: sig.rotate + 18,
              scale: 0.8,
              filter: "blur(10px)",
              transition: { duration: 0.5, delay: exitDelay, ease: "easeIn" },
            }
          : { opacity: 1, scale: 1, transition: { duration: 0.8, delay: sig.delay * 0.3, ease: EASE } }
      }
      className="absolute"
      style={{ left: sig.x, top: sig.y, rotate: sig.rotate }}
    >
      <motion.div
        animate={reduce || leaving ? {} : { y: [0, -sig.bob, 0] }}
        transition={{ duration: 5 + sig.bob * 0.3, repeat: Infinity, ease: "easeInOut", delay: sig.delay }}
        className="rounded-xl border border-white/10 bg-white/[0.05] px-5 py-4 backdrop-blur-sm"
      >
        {sig.lines.map((line) => (
          <p key={line} className="font-mono text-[12px] leading-relaxed text-white/45">
            {line}
          </p>
        ))}
      </motion.div>
    </motion.div>
  );
}

/* ---------------- The transformation stage ---------------- */

function TransformationStage() {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>(reduce ? "settled" : "drift");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const run = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    if (reduce) {
      setPhase("settled");
      return;
    }
    setPhase("drift");
    timers.current.push(setTimeout(() => setPhase("sweep"), 3600));
    timers.current.push(setTimeout(() => setPhase("reveal"), 4700));
    timers.current.push(setTimeout(() => setPhase("settled"), 5600));
  }, [reduce]);

  useEffect(() => {
    run();
    const saved = timers.current;
    return () => saved.forEach(clearTimeout);
  }, [run]);

  const revealed = phase === "reveal" || phase === "settled";

  return (
    <div className="relative mx-auto h-[440px] w-full max-w-4xl">
      {/* stage frame */}
      <div className="absolute inset-0 overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.03]">
        {/* faint dot grid */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "radial-gradient(rgb(255 255 255 / 0.07) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* phase caption */}
        <AnimatePresence mode="wait">
          <motion.p
            key={revealed ? "after" : "before"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.4 }}
            className="absolute left-1/2 top-5 z-30 -translate-x-1/2 whitespace-nowrap rounded-full border border-white/10 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold tracking-wide text-white/60 backdrop-blur"
          >
            {revealed ? "Your email, with SigCraft" : "Every email today ends like this…"}
          </motion.p>
        </AnimatePresence>

        {/* boring signatures */}
        {BORING.map((sig) => (
          <BoringCard key={sig.lines.join()} sig={sig} phase={phase} />
        ))}

        {/* sweep beam */}
        <AnimatePresence>
          {phase === "sweep" && (
            <motion.div
              initial={{ x: "-30%" }}
              animate={{ x: "130%" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.05, ease: "easeInOut" }}
              className="absolute inset-y-[-10%] left-0 z-20 w-[26%] -skew-x-12"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgb(91 91 247 / 0.45) 35%, rgb(0 212 255 / 0.55) 55%, transparent)",
                filter: "blur(18px)",
              }}
            />
          )}
        </AnimatePresence>

        {/* our signature lands */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 60 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 18, delay: 0.1 }}
              className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2"
            >
              {/* glow burst */}
              <motion.div
                aria-hidden
                initial={{ opacity: 0.9, scale: 0.4 }}
                animate={{ opacity: 0, scale: 2.4 }}
                transition={{ duration: 1.1, ease: "easeOut", delay: 0.15 }}
                className="absolute inset-0 rounded-full"
                style={{ background: "radial-gradient(circle, rgb(0 212 255 / 0.5), rgb(91 91 247 / 0.3) 45%, transparent 70%)" }}
              />
              {/* particles */}
              {!reduce &&
                [...Array(10)].map((_, i) => {
                  const angle = (i / 10) * Math.PI * 2;
                  return (
                    <motion.span
                      key={i}
                      aria-hidden
                      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      animate={{
                        opacity: 0,
                        x: Math.cos(angle) * 190,
                        y: Math.sin(angle) * 130,
                        scale: 0.2,
                      }}
                      transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
                      className="absolute left-1/2 top-1/2 h-2 w-2 rounded-full"
                      style={{ background: i % 2 ? "#00d4ff" : "#8b7dff" }}
                    />
                  );
                })}
              {/* the real live card */}
              <div className="relative rounded-3xl shadow-[0_0_60px_rgb(91_91_247/0.45)]">
                <SignatureCard data={DEFAULT_SIGNATURE} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* replay */}
      <AnimatePresence>
        {phase === "settled" && !reduce && (
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.6 }}
            onClick={run}
            className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur transition hover:bg-white/[0.14] hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Replay
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ---------------- Hero ---------------- */

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#0b0f1c] px-6 pb-28 pt-36 sm:pt-40">
      {/* cinematic glow field */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-260px] h-[620px] w-[1200px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgb(91 91 247 / 0.35), rgb(0 212 255 / 0.12) 45%, transparent 72%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-200px] right-[-160px] h-[480px] w-[480px] rounded-full blur-3xl"
        style={{
          background: "radial-gradient(circle, rgb(139 125 255 / 0.18), transparent 70%)",
          animation: "blob-pulse 9s ease-in-out infinite",
        }}
      />

      <div className="relative mx-auto max-w-6xl text-center">
        <motion.div {...stage(0)}>
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-4 py-1.5 text-xs font-semibold text-white/70 backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-cyan" />
            The end of boring email signatures
          </span>
        </motion.div>

        <motion.h1
          {...stage(1)}
          className="mx-auto mt-7 max-w-3xl font-display text-[2.9rem] font-semibold leading-[1.04] tracking-tight text-white sm:text-[4rem]"
        >
          Every signature is boring.
          <br />
          <span className="text-gradient">Yours is about to book demos.</span>
        </motion.h1>

        <motion.p
          {...stage(2)}
          className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-white/60"
        >
          Watch what happens when a plain sign-off becomes an animated, verified,
          click-tracked SigCraft signature.
        </motion.p>

        <motion.div {...stage(3)} className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <MagneticButton>
            <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                href="/signup"
                className="bg-gradient-accent inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-white shadow-[0_8px_40px_rgb(91_91_247/0.5)] transition hover:brightness-110"
              >
                Get Started, Free <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.span>
          </MagneticButton>
          <motion.span whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/#showcase"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-7 py-3.5 text-base font-semibold text-white backdrop-blur transition hover:bg-white/[0.12]"
            >
              <Play className="h-4 w-4 text-cyan" /> See how it works
            </Link>
          </motion.span>
        </motion.div>

        <motion.div
          {...stage(4)}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-white/50"
        >
          <span className="flex items-center gap-1.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-warn text-warn" />
            ))}
            <strong className="text-white/85">4.9</strong> on G2
          </span>
          <span className="hidden h-4 w-px bg-white/15 sm:block" />
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-success" /> SOC 2 Type II
          </span>
          <span className="hidden h-4 w-px bg-white/15 sm:block" />
          <span>7-day free trial · No card required</span>
        </motion.div>

        {/* the transformation */}
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
          className="mt-16"
        >
          <TransformationStage />
        </motion.div>
      </div>

      {/* soft seam into the light page below */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24"
        style={{ background: "linear-gradient(180deg, transparent, #fafafc)" }}
      />
    </section>
  );
}
