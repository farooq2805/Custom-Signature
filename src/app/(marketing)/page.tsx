import { Hero } from "@/components/landing/Hero";
import { IndustryShowcase } from "@/components/landing/IndustryFlow";
import {
  Benefits,
  Features,
  FinalCTA,
  HowItWorks,
  ProductShowcase,
} from "@/components/landing/Sections";
import {
  ActivityToasts,
  FaqSection,
  PricingTeaser,
  RoiCalculator,
  StatsBand,
  Testimonials,
} from "@/components/landing/Conversion";
import { StickyCtaBar } from "@/components/landing/interactions";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <IndustryShowcase />
      <StatsBand />
      <Features />
      <ProductShowcase />
      <HowItWorks />
      <Benefits />
      <RoiCalculator />
      <Testimonials />
      <PricingTeaser />
      <FaqSection />
      <FinalCTA />
      <StickyCtaBar />
      <ActivityToasts />
    </>
  );
}
