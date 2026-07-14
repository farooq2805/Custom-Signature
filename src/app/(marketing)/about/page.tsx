import type { Metadata } from "next";
import { Section, SectionHeading, Card, FadeUp } from "@/components/ui";
import { FinalCTA } from "@/components/marketing/Sections";

export const metadata: Metadata = { title: "About" };

const VALUES = [
  {
    title: "The inbox is sacred",
    copy: "We will never ship a feature that risks a user's deliverability. Beautiful and spam-safe are non-negotiable together.",
  },
  {
    title: "Measure or it didn't happen",
    copy: "Every pixel we add to a signature must be able to prove its worth in the analytics dashboard.",
  },
  {
    title: "Three minutes, not three meetings",
    copy: "A founder should go from signup to a live, animated signature before their coffee cools.",
  },
];

export default function AboutPage() {
  return (
    <div className="pt-28">
      <Section className="!pb-10">
        <SectionHeading
          eyebrow="About SigCraft"
          title="The most-seen asset in your company is your signature"
          subtitle="The average professional sends 40 emails a day. That's 10,000+ brand impressions a year going completely to waste on 'Sent from my iPhone'. We fix that."
        />
        <FadeUp className="mx-auto max-w-3xl text-center leading-relaxed text-ink-muted">
          <p>
            SigCraft started when our founders — one ex-email-deliverability engineer, one
            ex-agency creative director — realized the same thing from opposite directions:
            the email signature is the highest-frequency, lowest-effort marketing surface
            in existence, and everyone is squandering it. We built the tool we wished
            existed: interactive where it can be, bulletproof where it must be, and
            measured everywhere.
          </p>
        </FadeUp>
      </Section>

      <Section className="bg-white">
        <SectionHeading eyebrow="What we believe" title="Three rules we build by" />
        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <FadeUp key={v.title} delay={i * 0.1}>
              <Card className="h-full">
                <h3 className="mb-2 font-display text-lg font-semibold text-ink">{v.title}</h3>
                <p className="text-sm leading-relaxed text-ink-muted">{v.copy}</p>
              </Card>
            </FadeUp>
          ))}
        </div>
      </Section>

      <FinalCTA />
    </div>
  );
}
