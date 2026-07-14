"use client";

/**
 * Account & billing: current plan, trial countdown, invoices, cancel flow.
 * "Manage billing" opens the Stripe customer portal when configured;
 * demo mode explains what would happen.
 */

import { useEffect, useState } from "react";
import { AlertTriangle, Check, CreditCard, Download } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { PLANS } from "@/lib/templates";
import { getSession, updateSession, type LocalSession } from "@/lib/auth";
import type { PlanId } from "@/lib/types";

const DEMO_INVOICES = [
  { id: "INV-0003", date: "Jul 1, 2026", amount: "$12.00", status: "Paid" },
  { id: "INV-0002", date: "Jun 1, 2026", amount: "$12.00", status: "Paid" },
  { id: "INV-0001", date: "May 1, 2026", amount: "$12.00", status: "Paid" },
];

export default function BillingPage() {
  const [session, setSession] = useState<LocalSession | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);
  const [canceled, setCanceled] = useState(false);

  useEffect(() => {
    setSession(getSession());
  }, []);

  const planId: PlanId = session?.plan ?? "pro";
  const plan = PLANS.find((p) => p.id === planId) ?? PLANS[1];
  const trialDaysLeft = session
    ? Math.max(0, Math.ceil((new Date(session.trialEndsAt).getTime() - Date.now()) / 86400000))
    : 0;

  async function openPortal() {
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const json = await res.json().catch(() => ({}));
    if (json.url) window.location.href = json.url;
    else alert("Demo mode: with STRIPE_SECRET_KEY configured this opens your Stripe customer portal.");
  }

  function confirmCancel() {
    updateSession({ plan: "free" });
    setSession(getSession());
    setCanceled(true);
    setCancelOpen(false);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="font-display text-2xl font-semibold text-ink">Account & Billing</h1>
      <p className="mt-1 text-sm text-ink-muted">{session?.email ?? "demo@sigcraft.app"}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-ink-muted">Current plan</p>
              <p className="mt-1 font-display text-2xl font-bold text-ink">{plan.name}</p>
            </div>
            <span className="bg-gradient-accent rounded-full px-3 py-1 text-xs font-semibold text-white">
              ${plan.priceMonthly}/mo
            </span>
          </div>
          {trialDaysLeft > 0 && planId !== "free" && (
            <p className="mt-3 rounded-2xl bg-accent-soft px-4 py-3 text-sm text-ink-muted">
              <strong className="text-accent">{trialDaysLeft} trial day{trialDaysLeft === 1 ? "" : "s"} left.</strong>{" "}
              Your card won&apos;t be charged until the trial ends.
            </p>
          )}
          {canceled && (
            <p className="mt-3 flex items-center gap-2 rounded-2xl bg-success/10 px-4 py-3 text-sm text-success">
              <Check className="h-4 w-4" /> Plan canceled — you&apos;re on Starter. Hosted links keep
              working for 30 days.
            </p>
          )}
          <ul className="mt-5 flex flex-col gap-2">
            {plan.features.slice(0, 4).map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}
              </li>
            ))}
          </ul>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={openPortal}>
              <CreditCard className="h-4 w-4" /> Manage billing
            </Button>
            {planId !== "free" && !canceled && (
              <Button variant="ghost" onClick={() => setCancelOpen(true)}>
                Cancel plan
              </Button>
            )}
          </div>
        </Card>

        <Card>
          <p className="mb-4 font-display text-lg font-semibold text-ink">Invoices</p>
          <ul className="flex flex-col divide-y divide-line">
            {DEMO_INVOICES.map((inv) => (
              <li key={inv.id} className="flex items-center justify-between py-3 text-sm">
                <span>
                  <span className="block font-medium text-ink">{inv.id}</span>
                  <span className="block text-xs text-ink-faint">{inv.date}</span>
                </span>
                <span className="flex items-center gap-3">
                  <span className="text-ink-muted">{inv.amount}</span>
                  <span className="rounded-full bg-success/10 px-2.5 py-0.5 text-xs font-medium text-success">
                    {inv.status}
                  </span>
                  <button className="text-ink-faint transition hover:text-ink" aria-label={`Download ${inv.id}`}>
                    <Download className="h-4 w-4" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      {cancelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 px-6" role="dialog" aria-modal>
          <Card className="w-full max-w-md">
            <p className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
              <AlertTriangle className="h-5 w-5 text-warn" /> Cancel your {plan.name} plan?
            </p>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ink-muted">
              <li>• You drop to Starter (1 signature) at the end of the billing period.</li>
              <li>• Hosted links keep redirecting for 30 days — sent emails never break.</li>
              <li>• Your analytics history is kept and restored if you resubscribe.</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={() => setCancelOpen(false)}>
                Keep my plan
              </Button>
              <Button variant="dark" className="flex-1" onClick={confirmCancel}>
                Cancel plan
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
