import { notFound } from "next/navigation";
import { Section } from "@/components/ui";

const DOCS: Record<string, { title: string; body: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    body: [
      "SigCraft collects only the data needed to serve and measure your signatures: your account details, the signature content you create, and click/impression events on links inside your signatures.",
      "We never read, store, or access the content of your emails. SigCraft is not connected to your mailbox — your signature is generated here and pasted or synced into your email client by you.",
      "Click analytics record the link clicked, a timestamp, and a coarse user-agent-derived client guess. We do not build recipient profiles and we do not sell data to anyone.",
      "You can export or delete all of your data at any time from Account settings. Deleting your account removes your signatures, assets, and analytics within 30 days.",
    ],
  },
  terms: {
    title: "Terms of Service",
    body: [
      "SigCraft is a subscription service for creating, hosting, and measuring email signatures. Paid plans begin with a 7-day free trial; you will not be charged until the trial ends.",
      "You may cancel at any time from the Billing page. After cancellation your hosted signatures continue redirecting for 30 days so previously sent emails never break.",
      "You retain all rights to the content and brand assets you upload. You warrant that you have the right to use any logos or imagery in your signatures.",
      "Abuse of the tracking infrastructure (phishing, spam, deceptive redirects) results in immediate termination.",
    ],
  },
  security: {
    title: "Security",
    body: [
      "All traffic is served over TLS. Signature assets are served from an isolated CDN with strict caching and no third-party scripts.",
      "Authentication and data storage are provided by Supabase (Postgres) with row-level security: users can only access their own signatures and events.",
      "Payments are handled entirely by Stripe; card data never touches SigCraft servers.",
      "Report vulnerabilities to security@sigcraft.app — we respond within 48 hours.",
    ],
  },
};

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const content = DOCS[doc];
  if (!content) notFound();

  return (
    <div className="pt-24">
      <Section>
        <div className="mx-auto max-w-2xl">
          <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
            {content.title}
          </h1>
          <p className="mt-2 text-sm text-ink-faint">Last updated July 2026</p>
          <div className="mt-8 flex flex-col gap-5">
            {content.body.map((p, i) => (
              <p key={i} className="leading-relaxed text-ink-muted">
                {p}
              </p>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
