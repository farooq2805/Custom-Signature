import type { Metadata } from "next";
import { HostedCard } from "./HostedCard";

export const metadata: Metadata = { title: "Interactive Signature" };

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
