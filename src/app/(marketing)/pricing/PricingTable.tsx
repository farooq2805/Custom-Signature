"use client";

import { useState } from "react";
import { Check, Minus } from "lucide-react";
import { Button, Card, FadeUp, Section, SectionHeading } from "@/components/ui";
import { PLANS } from "@/lib/templates";

const MATRIX: { feature: string; free: boolean | string; pro: boolean | string; team: boolean | string }[] = [
  { feature: "Hosted signatures", free: "1", pro: "Unlimited", team: "Unlimited" },
  { feature: "Pro templates", free: "3", pro: "All", team: "All" },
  { feature: "AI logo animation", free: false, pro: true, team: true },
  { feature: "Verification badge", free: false, pro: true, team: true },
  { feature: "Click & impression analytics", free: "7 days", pro: "Full history", team: "Full history" },
  { feature: "A/B signature variants", free: false, pro: true, team: true },
  { feature: "Remove SigCraft branding", free: false, pro: true, team: true },
  { feature: "Central brand templates", free: false, pro: false, team: true },
  { feature: "Bulk create & team invites", free: false, pro: false, team: true },
  { feature: "Team analytics rollup", free: false, pro: false, team: true },
  { feature: "Directory sync (Google Workspace)", free: false, pro: false, team: true },
];

function Cell({ v }: { v: boolean | string }) {
  if (v === true) return <Check className="mx-auto h-4 w-4 text-success" />;
  if (v === false) return <Minus className="mx-auto h-4 w-4 text-line" />;
  return <span className="text-sm text-ink-muted">{v}</span>;
}

export function PricingTable() {
  const [yearly, setYearly] = useState(true);

  return (
    <Section className="!pt-8">
      <SectionHeading
        eyebrow="Pricing"
        title="Simple pricing that pays for itself"
        subtitle="Every paid plan starts with a 7-day free trial. No credit card required."
      />

      <div className="mb-10 flex justify-center">
        <div className="flex items-center gap-1 rounded-full border border-line bg-white p-1">
          {(["Monthly", "Yearly · 2 months free"] as const).map((label, i) => (
            <button
              key={label}
              onClick={() => setYearly(i === 1)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                yearly === (i === 1) ? "bg-ink text-white" : "text-ink-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {PLANS.map((plan, i) => {
          const price = yearly ? Math.round(plan.priceMonthly * 10 / 12 * 100) / 100 : plan.priceMonthly;
          return (
            <FadeUp key={plan.id} delay={i * 0.08}>
              <Card
                className={`relative flex h-full flex-col ${
                  plan.highlighted ? "border-accent shadow-[--shadow-glow]" : ""
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
                  ${plan.priceMonthly === 0 ? 0 : price}
                  <span className="text-base font-medium text-ink-faint">
                    /mo{plan.id === "team" ? " per seat" : ""}
                  </span>
                </p>
                <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  href={`/signup?plan=${plan.id}${yearly ? "&billing=yearly" : ""}`}
                  variant={plan.highlighted ? "primary" : "secondary"}
                  className="mt-7 w-full"
                >
                  {plan.cta}
                </Button>
              </Card>
            </FadeUp>
          );
        })}
      </div>

      {/* Full comparison matrix */}
      <FadeUp className="mt-16 overflow-x-auto rounded-3xl border border-line bg-white shadow-[--shadow-card]">
        <table className="w-full min-w-[640px] text-left">
          <thead>
            <tr className="border-b border-line">
              <th className="px-6 py-4 text-sm font-semibold text-ink">Feature</th>
              {PLANS.map((p) => (
                <th key={p.id} className="px-6 py-4 text-center text-sm font-semibold text-ink">
                  {p.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MATRIX.map((row, i) => (
              <tr key={row.feature} className={i % 2 ? "bg-cream/60" : ""}>
                <td className="px-6 py-3.5 text-sm text-ink-muted">{row.feature}</td>
                <td className="px-6 py-3.5 text-center"><Cell v={row.free} /></td>
                <td className="px-6 py-3.5 text-center"><Cell v={row.pro} /></td>
                <td className="px-6 py-3.5 text-center"><Cell v={row.team} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </FadeUp>
    </Section>
  );
}
