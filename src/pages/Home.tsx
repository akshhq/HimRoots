import { SEO } from "@/components/common/SEO";
import { HeroSlideshow } from "@/components/home/HeroSlideshow";
import { CategoryTrack } from "@/components/home/CategoryTrack";
import { FastestSelling } from "@/components/home/FastestSelling";
import { StartHereDiscovery } from "@/components/home/StartHereDiscovery";
import { ArtisanalCollectives } from "@/components/home/ArtisanalCollectives";
import { TabbedCollections } from "@/components/home/TabbedCollections";
import { BotanicalSpotlight } from "@/components/home/BotanicalSpotlight";
import { SocialImpactBanner } from "@/components/home/SocialImpactBanner";
import { VerifiedTestimonials } from "@/components/home/VerifiedTestimonials";
import { PhilosophyBillboard } from "@/components/home/PhilosophyBillboard";
import { WhyUsPillars } from "@/components/home/WhyUsPillars";
import { PressAndAccreditations } from "@/components/home/PressAndAccreditations";
import { ComparisonMatrix } from "@/components/home/ComparisonMatrix";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { LatestJournal } from "@/components/home/LatestJournal";

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Himroots Wellness",
    url: "https://himroots.in",
    logo: "https://himroots.in/images/himroots-logo.png",
    description:
      "Pure wild-foraged Himalayan Sea Buckthorn juice and natural wellness formulations from Ladakh and Spiti at 12,000+ feet.",
    sameAs: ["https://www.instagram.com/himroots.wellness/"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dharamshala",
      addressRegion: "Himachal Pradesh",
      postalCode: "176215",
      addressCountry: "IN",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Support",
      email: "customercare@himroots.in",
      telephone: "+91-84286-11319",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Himroots Wellness",
    url: "https://himroots.in",
  };

  return (
    <>
      <SEO
        title="Himroots Wellness | Pure Himalayan Sea Buckthorn Formulations from 12,000+ Ft"
        description="Experience the untouched vitality of wild-harvested Himalayan Seabuckthorn Goldenberry from 12,000+ feet in Ladakh and Spiti. Raw, pure, cold-pressed, zero added sugar, rich in rare Omega-7 and Vitamin C."
        canonical="/"
        type="website"
        structuredData={[organizationSchema, websiteSchema]}
      />

      <div className="flex flex-col bg-black text-white">
        
        {/* 1. Cinematic Billboard Hero Slideshow Carousel */}
        <HeroSlideshow />

        {/* 2. Curated Circular / Card Category Navigation Track */}
        <CategoryTrack />

        {/* 3. Fastest-Selling High-Velocity Star Formulations */}
        <FastestSelling />

        {/* 4. First-Time Discovery Onboarding Module: Start Here */}
        <StartHereDiscovery />

        {/* 6. Artisanal Guild & Mountain Foraging Collectives Showcase */}
        <ArtisanalCollectives />

        {/* 7. Tabbed Curated Collections (Pure Pulp, Softgels, Bundles) */}
        <TabbedCollections />

        {/* 8. This Season Botanical Spotlight Showcase (6 Raw Alpine Specimens) */}
        <BotanicalSpotlight />

        {/* 9. Social Impact Metric & Omnichannel Retail Bar */}
        <SocialImpactBanner />

        {/* 10. Verified Customer Testimonials Carousel */}
        <VerifiedTestimonials />

        {/* 11. Brand Origin Philosophy Billboard */}
        <PhilosophyBillboard />

        {/* 12. Four-Pillar Value Proposition Grid: Why Us? (Pure, Authentic, Transparency, Lab Tested) */}
        <WhyUsPillars />

        {/* 13. Institutional Quality Accreditations & In The Press Media Bar */}
        <PressAndAccreditations />

        {/* 14. Brand Transparency & Purity Comparison Matrix */}
        <ComparisonMatrix />

        {/* 15. Accordion Knowledge Base & Trust FAQ */}
        <FaqAccordion />

        {/* 16. Educational Himalayan Wellness Journal */}
        <LatestJournal />

      </div>
    </>
  );
}
