"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import {
  Briefcase,
  Building2,
  ChevronDown,
  HeartPulse,
  Home,
  Landmark,
  Menu,
  PenTool,
  Rocket,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Logo } from "./Logo";

const SOLUTIONS = {
  industries: [
    { label: "Real Estate", icon: Home, blurb: "Listing-ready signatures that book showings" },
    { label: "Healthcare", icon: HeartPulse, blurb: "Trust-first cards with credentials" },
    { label: "Finance", icon: Landmark, blurb: "Conservative, compliant, credible" },
    { label: "Agencies", icon: PenTool, blurb: "One brand across every account manager" },
    { label: "Sales Teams", icon: Users, blurb: "Outbound signatures that convert" },
  ],
  roles: [
    { label: "Founders", icon: Rocket, blurb: "Every email is a pitch — make it land" },
    { label: "Realtors", icon: Building2, blurb: "Your card, your listings, one tap away" },
    { label: "Consultants", icon: Briefcase, blurb: "Authority in every thread" },
    { label: "Freelancers", icon: PenTool, blurb: "Look bigger than you are" },
  ],
};

export function Nav() {
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="glass fixed inset-x-0 top-0 z-50">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" aria-label="SigCraft home">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink href="/#features">Features</NavLink>

          <div
            className="relative"
            onMouseEnter={() => setSolutionsOpen(true)}
            onMouseLeave={() => setSolutionsOpen(false)}
          >
            <button className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition hover:text-ink">
              Solutions
              <motion.span animate={{ rotate: solutionsOpen ? 180 : 0 }}>
                <ChevronDown className="h-3.5 w-3.5" />
              </motion.span>
            </button>
            <AnimatePresence>
              {solutionsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3"
                >
                  <div className="grid grid-cols-2 gap-6 rounded-3xl border border-line bg-white p-6 shadow-[--shadow-pop]">
                    <MegaColumn title="By industry" items={SOLUTIONS.industries} />
                    <MegaColumn title="By role" items={SOLUTIONS.roles} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <NavLink href="/pricing">Pricing</NavLink>
          <NavLink href="/about">About</NavLink>
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm" href="/login">
            Login
          </Button>
          <Button size="sm" href="/signup">
            Get Started Free
          </Button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-line bg-cream md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {[
                ["Features", "/#features"],
                ["Solutions", "/#solutions"],
                ["Pricing", "/pricing"],
                ["About", "/about"],
                ["Login", "/login"],
              ].map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink-muted hover:bg-cream-dim hover:text-ink"
                >
                  {label}
                </Link>
              ))}
              <Button href="/signup" className="mt-2">
                Get Started Free
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="rounded-full px-4 py-2 text-sm font-medium text-ink-muted transition hover:text-ink"
    >
      {children}
    </Link>
  );
}

function MegaColumn({
  title,
  items,
}: {
  title: string;
  items: { label: string; icon: React.ComponentType<{ className?: string }>; blurb: string }[];
}) {
  return (
    <div>
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-ink-faint">
        {title}
      </p>
      <ul className="flex flex-col gap-1">
        {items.map(({ label, icon: Icon, blurb }) => (
          <li key={label}>
            <Link
              href={`/signup?vertical=${encodeURIComponent(label.toLowerCase())}`}
              className="group flex items-start gap-3 rounded-2xl p-2.5 transition hover:bg-accent-soft"
            >
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cream-dim text-ink-muted transition group-hover:bg-white group-hover:text-accent">
                <Icon className="h-4 w-4" />
              </span>
              <span>
                <span className="block text-sm font-medium text-ink">{label}</span>
                <span className="block text-xs leading-snug text-ink-faint">{blurb}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
