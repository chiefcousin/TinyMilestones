import { headers } from "next/headers";
import { Navbar } from "@/components/marketing/Navbar";
import { Hero } from "@/components/marketing/Hero";
import { Features } from "@/components/marketing/Features";
import { DomainShowcase } from "@/components/marketing/DomainShowcase";
import { Pricing } from "@/components/marketing/Pricing";
import { FinalCTA } from "@/components/marketing/FinalCTA";
import { Footer } from "@/components/marketing/Footer";
import { getPricingForRegion } from "@/lib/geo/constants";

export const dynamic = "force-dynamic";

export default function HomePage() {
  const headersList = headers();
  const country = headersList.get("x-vercel-ip-country") || "US";
  const pricing = getPricingForRegion(country);

  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <DomainShowcase />
      <Pricing pricing={pricing} />
      <FinalCTA />
      <Footer />
    </>
  );
}
