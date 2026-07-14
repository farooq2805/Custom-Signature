import type { Metadata } from "next";
import { PricingTable } from "./PricingTable";
import { FAQ, FinalCTA } from "@/components/marketing/Sections";

export const metadata: Metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="pt-28">
      <PricingTable />
      <FAQ />
      <FinalCTA />
    </div>
  );
}
