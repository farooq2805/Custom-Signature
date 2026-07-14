"use client";

/**
 * Three-step onboarding: account → plan → payment.
 * Payment step calls /api/billing/checkout which returns a Stripe Checkout
 * URL when STRIPE_SECRET_KEY is configured, or completes the 7-day trial
 * locally in demo mode.
 */

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, CreditCard, ShieldCheck } from "lucide-react";
import { Button, Card, Field, TextInput } from "@/components/ui";
import { PLANS } from "@/lib/templates";
import { signUp, updateSession } from "@/lib/auth";
import type { PlanId } from "@/lib/types";

const STEPS = ["Account", "Plan", "Payment"] as const;

export function SignupFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState<PlanId>((params.get("plan") as PlanId) || "pro");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await signUp(email, password, name, plan);
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed");
    } finally {
      setBusy(false);
    }
  }

  async function startTrial() {
    setBusy(true);
    setError(null);
    updateSession({ plan });
    if (plan === "free") {
      router.push("/dashboard");
      return;
    }
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, email }),
      });
      const json = await res.json();
      if (json.url) {
        window.location.href = json.url; // real Stripe Checkout
      } else {
        router.push("/dashboard?trial=started"); // demo mode
      }
    } catch {
      router.push("/dashboard?trial=started");
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 pb-24 pt-32">
      {/* step indicator */}
      <div className="mb-10 flex items-center justify-center gap-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition ${
                i < step
                  ? "bg-success text-white"
                  : i === step
                    ? "bg-gradient-accent text-white"
                    : "bg-cream-dim text-ink-faint"
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? "text-ink" : "text-ink-faint"}`}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-px w-8 bg-line" />}
          </div>
        ))}
      </div>

      <motion.div
        key={step}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        {step === 0 && (
          <Card>
            <h1 className="font-display text-2xl font-semibold text-ink">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              Free 7-day Pro trial included. No credit card required to start.
            </p>
            <form onSubmit={createAccount} className="mt-7 flex flex-col gap-4">
              <Field label="Full name">
                <TextInput required value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Rivera" />
              </Field>
              <Field label="Work email">
                <TextInput type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="alex@company.com" />
              </Field>
              <Field label="Password">
                <TextInput type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
              </Field>
              {error && <p className="text-sm text-danger">{error}</p>}
              <Button type="submit" className="mt-2 w-full">
                {busy ? "Creating…" : "Continue →"}
              </Button>
            </form>
          </Card>
        )}

        {step === 1 && (
          <div>
            <h1 className="mb-6 text-center font-display text-2xl font-semibold text-ink">
              Pick your plan
            </h1>
            <div className="flex flex-col gap-4">
              {PLANS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPlan(p.id)}
                  className={`flex items-center justify-between rounded-3xl border bg-white p-5 text-left transition ${
                    plan === p.id
                      ? "border-accent shadow-[--shadow-glow]"
                      : "border-line hover:border-ink-faint"
                  }`}
                >
                  <span>
                    <span className="block font-display font-semibold text-ink">
                      {p.name}
                      {p.highlighted && (
                        <span className="ml-2 rounded-full bg-accent-soft px-2 py-0.5 text-xs font-medium text-accent">
                          Recommended
                        </span>
                      )}
                    </span>
                    <span className="mt-0.5 block text-sm text-ink-muted">{p.tagline}</span>
                  </span>
                  <span className="font-display text-xl font-bold text-ink">
                    ${p.priceMonthly}
                    <span className="text-sm font-medium text-ink-faint">/mo</span>
                  </span>
                </button>
              ))}
            </div>
            <Button onClick={() => setStep(2)} className="mt-6 w-full">
              Continue →
            </Button>
          </div>
        )}

        {step === 2 && (
          <Card>
            <h1 className="font-display text-2xl font-semibold text-ink">
              {plan === "free" ? "You're all set" : "Start your 7-day free trial"}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">
              {plan === "free"
                ? "The Starter plan is free forever. Upgrade whenever your signature starts earning."
                : `You won't be charged until your trial ends. Cancel anytime from Billing in two clicks.`}
            </p>
            {plan !== "free" && (
              <div className="mt-6 rounded-2xl border border-line bg-cream p-5">
                <p className="flex items-center gap-2 text-sm font-medium text-ink">
                  <CreditCard className="h-4 w-4 text-accent" />
                  {PLANS.find((p) => p.id === plan)?.name} — $
                  {PLANS.find((p) => p.id === plan)?.priceMonthly}/mo after trial
                </p>
                <p className="mt-2 flex items-center gap-2 text-xs text-ink-faint">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Payments processed by Stripe. We never see your card number.
                </p>
              </div>
            )}
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            <Button onClick={startTrial} className="mt-6 w-full">
              {busy ? "Setting up…" : plan === "free" ? "Go to Dashboard →" : "Start Trial →"}
            </Button>
            <button
              onClick={() => setStep(1)}
              className="mt-3 w-full text-center text-sm text-ink-faint hover:text-ink"
            >
              ← Back to plans
            </button>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
