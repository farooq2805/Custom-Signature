import { Hero } from "@/components/marketing/Hero";
import {
  Deliverability,
  FAQ,
  FeaturesGrid,
  FinalCTA,
  HowItWorks,
  InteractiveDemo,
  PlatformTabs,
  PricingTeaser,
  SocialProof,
  StatsBar,
} from "@/components/marketing/Sections";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <SocialProof />
      <StatsBar />
      <HowItWorks />
      <InteractiveDemo />
      <Deliverability />
      <PlatformTabs />
      <FeaturesGrid />
      <PricingTeaser />
      <FAQ />
      <FinalCTA />
    </>
  );
}
