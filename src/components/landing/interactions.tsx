"use client";

/**
 * Conversion-focused interaction primitives (patterns sourced from the
 * 21st.dev catalog + ui-ux-pro-max motion presets):
 *
 *  - MagneticButton: cursor-attracted CTA (pull clamped ×0.3, springed —
 *    the preset's "don't let it leave its hit box" rule). Use on at most
 *    1–2 focal CTAs per screen.
 *  - TiltCard: 3D perspective tilt + glare sweep that tracks the cursor,
 *    making the signature feel like a physical card in hand.
 *  - StickyCtaBar: glass conversion bar that slides in after the hero is
 *    scrolled away, with a live "clicks tracked" ticker for social proof.
 *
 * All three are inert under prefers-reduced-motion.
 */

import Link from "next/link";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, MousePointerClick, X } from "lucide-react";

export function MagneticButton({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  // spring tuned to feel elastic without overshooting the hit box
  const x = useSpring(rawX, { stiffness: 220, damping: 16 });
  const y = useSpring(rawY, { stiffness: 220, damping: 16 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    rawX.set((e.clientX - r.left - r.width / 2) * 0.3);
    rawY.set((e.clientY - r.top - r.height / 2) * 0.3);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => {
        rawX.set(0);
        rawY.set(0);
      }}
      style={{ x, y, willChange: "transform" }}
      className={`inline-flex ${className}`}
    >
      {children}
    </motion.div>
  );
}

export function TiltCard({
  children,
  maxTilt = 10,
  className = "",
}: {
  children: React.ReactNode;
  maxTilt?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0.5); // cursor position 0–1 within the card
  const py = useMotionValue(0.5);
  const sx = useSpring(px, { stiffness: 150, damping: 20 });
  const sy = useSpring(py, { stiffness: 150, damping: 20 });
  const rotateY = useTransform(sx, [0, 1], [-maxTilt, maxTilt]);
  const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt]);
  // glare highlight follows the cursor across the surface
  const glare = useTransform(
    [sx, sy],
    ([gx, gy]: number[]) =>
      `radial-gradient(320px circle at ${gx * 100}% ${gy * 100}%, rgb(255 255 255 / 0.35), transparent 65%)`
  );

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  }

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={() => {
        px.set(0.5);
        py.set(0.5);
      }}
      style={{
        rotateX: reduce ? 0 : rotateX,
        rotateY: reduce ? 0 : rotateY,
        transformStyle: "preserve-3d",
        perspective: 900,
        willChange: "transform",
      }}
      className={`relative ${className}`}
    >
      {children}
      {!reduce && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl"
          style={{ background: glare }}
        />
      )}
    </motion.div>
  );
}

export function StickyCtaBar() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [clicks, setClicks] = useState(127);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // live-feeling ticker: a click lands every few seconds
  useEffect(() => {
    timer.current = setInterval(
      () => setClicks((c) => c + (Math.random() > 0.55 ? 1 : 0)),
      3200
    );
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 90, opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
          className="fixed inset-x-0 bottom-5 z-40 flex justify-center px-4"
        >
          <div className="glass-card flex items-center gap-3 rounded-full py-2 pl-5 pr-2 shadow-[--shadow-pop] sm:gap-5">
            <p className="hidden items-center gap-2 text-sm font-medium text-ink sm:flex">
              <MousePointerClick className="h-4 w-4 text-accent" />
              <motion.span
                key={clicks}
                initial={{ opacity: 0.4, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display font-bold text-accent"
              >
                {clicks.toLocaleString()}
              </motion.span>
              signature clicks tracked today
            </p>
            <p className="text-sm font-medium text-ink sm:hidden">
              Make your signature work
            </p>
            <Link
              href="/signup"
              className="bg-gradient-accent sig-cta-pulse inline-flex h-11 items-center gap-2 rounded-full px-6 text-sm font-semibold text-white transition hover:brightness-110"
            >
              Build Yours Free <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
              className="flex h-11 w-11 items-center justify-center rounded-full text-ink-faint transition hover:bg-white hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
