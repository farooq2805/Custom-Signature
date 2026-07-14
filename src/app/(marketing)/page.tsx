import { Hero } from "@/components/landing/Hero";
import {
  Benefits,
  Features,
  FinalCTA,
  HowItWorks,
  ProductShowcase,
} from "@/components/landing/Sections";

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Features />
      <ProductShowcase />
      <HowItWorks />
      <Benefits />
      <FinalCTA />
    </>
  );
}
