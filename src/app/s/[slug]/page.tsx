import type { Metadata } from "next";
import { HostedCard } from "./HostedCard";

export const metadata: Metadata = { title: "Interactive Signature" };

/** Pre-rendered slugs for the static (GitHub Pages) demo build. */
export function generateStaticParams() {
  return [{ slug: "demo" }, { slug: "alex-rivera" }];
}

/**
 * The hosted signature page — the full interactive experience that email
 * recipients land on. This is where hover animation, the badge tooltip, and
 * the live nav actually run (email clients themselves get the static
 * table-HTML fallback).
 */
export default async function HostedSignaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <HostedCard slug={slug} />;
}
