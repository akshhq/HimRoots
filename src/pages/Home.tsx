import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Droplets, Mountain, Sparkles, Sun } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/common/SEO";

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Himroots Wellness",
    url: "https://himroots.in",
    logo: "https://himroots.in/images/himroots-logo.png",
    description: "Pure wild-foraged Himalayan Sea Buckthorn juice and natural wellness formulations from Ladakh and Spiti.",
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
      email: "support@himroots.in",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Himroots Wellness",
    url: "https://himroots.in",
  };

  const nutritionalHighlights = [
    {
      metric: "12×",
      title: "Vitamin C",
      subtitle: "vs Fresh Oranges",
      description:
        "Remarkably high natural concentration of buffered L-ascorbic acid, supporting daily immune resilience, collagen synthesis, and vital cellular protection.",
      icon: Sun,
    },
    {
      metric: "Ω-7",
      title: "Rare Omega-7",
      subtitle: "Cellular Hydration",
      description:
        "One of nature’s rarest plant-derived sources of palmitoleic acid, deeply nourishing mucous membranes, soothing dry eyes, and rejuvenating skin elasticity.",
      icon: Droplets,
    },
    {
      metric: "190+",
      title: "Bioactive Nutrients",
      subtitle: "Full-Spectrum Matrix",
      description:
        "A holistic botanical profile containing Vitamins A, E & K, flavonoids, carotenoids, and a complete fatty-acid synergy of Omegas 3, 6, 7 & 9.",
      icon: Sparkles,
    },
    {
      metric: "12,000+",
      title: "Alpine Elevation",
      subtitle: "Ladakh & Spiti Terroir",
      description:
        "Wild-foraged from thorny shrubs braving sub-zero cold deserts at 12,000+ feet, synthesizing extraordinary phytochemical density unavailable in farm-grown crops.",
      icon: Mountain,
    },
  ];

  return (
    <>
      <SEO
        title="Himroots Wellness | Seabuckthorn Goldenberry - The Elixir of the Himalayas"
        description="Experience the untouched nutritional vitality of wild-harvested Himalayan Seabuckthorn Goldenberry from 12,000+ feet in Ladakh and Spiti. Raw, pure, and rich in rare Omega-7 and Vitamin C."
        canonical="/"
        type="website"
        structuredData={[organizationSchema, websiteSchema]}
      />
      <div className="flex flex-col bg-black text-white">
        
        {/* ============================================================== */}
        {/* 1. HERO SECTION                                               */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden pt-8 sm:pt-12 md:pt-16 pb-14 md:pb-20 border-b border-[var(--color-border)] bg-black">
          {/* Subtle Himalayan Peaks Texture */}
          <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
            <img 
              src="/images/himalayan-hero-peaks.jpg" 
              alt="Pristine Himalayan Mountain Peaks in Ladakh" 
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/85 to-black" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Primary Title, Secondary Title, Tagline & Narrative */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start text-left">
                
                {/* 1. Primary Title - Strictly ONE SINGLE LINE on desktop */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[42px] xl:text-[50px] 2xl:text-[58px] font-bold tracking-tight text-white mb-2 leading-[1.12] font-serif whitespace-normal lg:whitespace-nowrap">
                  Seabuckthorn Goldenberry
                </h1>

                {/* 2. Secondary Title */}
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-3xl xl:text-4xl font-semibold tracking-tight text-gold-gradient font-serif leading-snug mb-5">
                  The Elixir of the Himalayas
                </h2>

                {/* 3. Prominent Brand Statement / Tagline (Moved below main title & subtitle) */}
                <div className="flex items-center gap-2.5 sm:gap-3 mb-5">
                  <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
                  <span className="font-tagline text-xs sm:text-sm md:text-base tracking-[0.22em] sm:tracking-[0.26em] uppercase text-[var(--color-primary-light)] font-bold">
                    SIP THE POWER OF HIMALAYAS
                  </span>
                  <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
                </div>

                {/* 4. Short supporting description */}
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed font-light max-w-2xl mb-6">
                  Wild-harvested at 12,000+ feet from the sub-zero peaks of Ladakh and Spiti, synthesizing 190+ bioactive nutrients, abundant Vitamin C, and rare Omega-7 into an extraordinary elixir of pure Himalayan vitality.
                </p>

                {/* 5. Refined Botanical Touchpoints */}
                <div className="inline-flex flex-wrap items-center gap-4 sm:gap-6 pt-4 border-t border-[var(--color-border-gold)]/30 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="tracking-wider uppercase font-medium">12,000+ Ft Terroir</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]/60 hidden sm:inline" />
                  <div className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="tracking-wider uppercase font-medium">12× Vitamin C</span>
                  </div>
                  <span className="w-1 h-1 rounded-full bg-[var(--color-primary)]/60 hidden sm:inline" />
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-[var(--color-primary)]" />
                    <span className="tracking-wider uppercase font-medium">Rare Omega-7</span>
                  </div>
                </div>

              </div>

              {/* Right Column: Authentic Himalayan Harvest Visual */}
              <div className="lg:col-span-5 xl:col-span-4 relative mt-4 lg:mt-0">
                <div className="relative group">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)]/70 bg-[var(--color-card)] shadow-2xl">
                    <img 
                      src="/images/himroots-harvest-berries.jpg" 
                      alt="Wild-Harvested Himalayan Sea Buckthorn Golden Berries" 
                      className="w-full h-[280px] sm:h-[380px] lg:h-[420px] object-cover object-center"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-4 sm:p-6 flex items-end justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">
                          Wild Trans-Himalayan Harvest
                        </span>
                        <h3 className="text-sm sm:text-base font-serif font-bold text-white">
                          Hippophae Rhamnoides
                        </h3>
                      </div>
                      <span className="text-[10px] text-gray-300 bg-black/70 px-2.5 py-1 rounded-full border border-white/10 font-medium">
                        12,000+ Ft Altitude
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 2. NUTRITIONAL VALUE SECTION WITH DISCOVER BUTTON             */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 md:py-24 bg-[var(--color-secondary)] border-b border-[var(--color-border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
                Nutrition From The Himalayas
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
                Why The Golden Berry Is A Nutritional Powerhouse
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                Thriving in intense UV radiation and extreme thermal fluctuations, wild Himalayan Sea Buckthorn naturally concentrates essential fatty acids, antioxidants, and trace minerals in quantities unmatched by lowland botanicals.
              </p>
            </div>

            {/* 4 Nutritional Highlight Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12">
              {nutritionalHighlights.map((item, idx) => {
                const IconComponent = item.icon;
                return (
                  <div 
                    key={idx}
                    className="p-6 sm:p-7 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/60 flex flex-col justify-between shadow-xl hover:border-[var(--color-primary)] transition-all duration-300 group"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl sm:text-4xl font-extrabold font-serif text-gold-gradient tracking-tight">
                          {item.metric}
                        </span>
                        <div className="w-9 h-9 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                          <IconComponent className="w-4 h-4" />
                        </div>
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                        {item.title}
                      </h3>
                      <span className="text-xs font-medium text-[var(--color-primary-light)] block mb-3 uppercase tracking-wider">
                        {item.subtitle}
                      </span>
                      <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                        {item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA Button: Discover Seabuckthorn */}
            <div className="text-center">
              <Button 
                asChild
                className="bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary-light)] hover:bg-[var(--color-primary)] hover:text-black font-bold uppercase text-xs tracking-widest px-8 py-3.5 rounded-xl transition-all duration-300 shadow-lg shadow-[var(--color-primary)]/5 group"
              >
                <Link to="/about-sea-buckthorn" className="inline-flex items-center gap-2">
                  <span>Discover Seabuckthorn</span>
                  <ArrowRight className="w-4 h-4 text-[var(--color-primary)] group-hover:text-black group-hover:translate-x-1 transition-all" />
                </Link>
              </Button>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. REWORKED INFORMATION-DENSE PRISTINE PROVENANCE SECTION      */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 bg-black border-b border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="bg-[var(--color-card)] rounded-2xl p-6 sm:p-10 border border-[var(--color-border-gold)]/50 shadow-2xl">
              
              {/* Header Statement */}
              <div className="text-center max-w-3xl mx-auto mb-10">
                <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
                  Pristine Provenance
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-3">
                  Wild-Harvested at 12,000+ Feet in Ladakh & Spiti
                </h2>
                <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
                <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
                  Untouched by commercial agriculture, every berry is hand-gathered from wild, thorny shrubs braving extreme sub-zero cold deserts where harsh environmental stress forces peak phytochemical concentration.
                </p>
              </div>

              {/* Structured 4-Column Editorial Specification Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-black/60 p-5 rounded-xl border border-[var(--color-border-gold)]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)] block mb-1">
                      Geographic Terroir
                    </span>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-1.5">
                      Ladakh & Spiti Valley
                    </h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Trans-Himalayan high-altitude cold desert regions known for pristine air, glacial runoff, and zero industrial contamination.
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 p-5 rounded-xl border border-[var(--color-border-gold)]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)] block mb-1">
                      Altitude Baseline
                    </span>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-1.5">
                      12,000+ Feet Elevation
                    </h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Extreme UV radiation and -30°C winter temperatures stimulate exceptional bioactive potency and natural antioxidant density.
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 p-5 rounded-xl border border-[var(--color-border-gold)]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)] block mb-1">
                      Botanical Specimen
                    </span>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-1.5">
                      Hippophae Rhamnoides
                    </h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Ancient golden berry thorny shrub revered for millennia in Tibetan Sowa-Rigpa and traditional Himalayan wellness systems.
                    </p>
                  </div>
                </div>

                <div className="bg-black/60 p-5 rounded-xl border border-[var(--color-border-gold)]/30 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)] block mb-1">
                      Harvest Philosophy
                    </span>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-white mb-1.5">
                      Wild-Foraged & Raw
                    </h4>
                    <p className="text-xs text-gray-400 font-light leading-relaxed">
                      Never farmed or sprayed. Sustainably hand-gathered in partnership with indigenous Himalayan communities during winter frost.
                    </p>
                  </div>
                </div>
              </div>

              {/* Supporting Provenance Specs: 3 Key Guarantees */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-6 border-t border-[var(--color-border-gold)]/30">
                <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                  <span className="text-xs text-gray-300"><strong>Zero Added Sugar:</strong> 100% pure raw unadulterated berry pulp & seed oil</span>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                  <span className="text-xs text-gray-300"><strong>Cold-Processed:</strong> Protects thermosensitive Omega-7 & natural Vitamin C</span>
                </div>
                <div className="flex items-center gap-3 bg-black/40 px-4 py-3 rounded-lg border border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                  <span className="text-xs text-gray-300"><strong>Lab-Tested Purity:</strong> Rigorously verified for heavy metal & microbiological safety</span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. STAR PRODUCTS SECTION (SIDE BY SIDE)                        */}
        {/* ============================================================== */}
        <section className="py-16 sm:py-20 md:py-24 bg-[var(--color-background)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 text-center">
            
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Our Formulations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-3">
              Star Products
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto mb-10 sm:mb-12 font-light">
              Pure, potent Himalayan sea buckthorn formulations crafted for your daily wellness ritual.
            </p>

            {/* Star Products Grid: 2 Products Side-by-Side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto mb-12 text-left">
              
              {/* Product 1: Pure Pulp */}
              <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/50 shadow-2xl overflow-hidden flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group h-full">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-black/40 h-64 sm:h-72 w-full flex-shrink-0">
                  <img 
                    src="/images/himroots-sea-buckthorn-pulp.jpg" 
                    alt="Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract" 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)]/60 text-[var(--color-primary)] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    500 ml
                  </div>
                  <div className="absolute top-3 right-3 bg-[var(--color-primary)]/20 backdrop-blur-md border border-[var(--color-primary)]/40 text-[var(--color-primary-light)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Save 25%
                  </div>
                </div>

                {/* Content: Formulation Information */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">
                        Daily Liquid Sip
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        ~25 Daily Servings
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                      Himalayan Sea Buckthorn Juice (Pulp) with Curcumin
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2.5 mb-3">
                      <span className="text-xl font-bold text-white font-serif">₹899</span>
                      <span className="text-xs text-gray-500 line-through">₹1,199</span>
                      <span className="text-[11px] text-[var(--color-primary)] font-semibold uppercase tracking-wider">Free Delivery</span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4">
                      Raw, unfiltered liquid concentrate wild-harvested at 12,000+ ft. Mixed daily with water for morning immunity, cellular defense, and vibrant energy.
                    </p>

                    {/* Supporting details / data */}
                    <div className="space-y-2 mb-6 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                        <span>95% Pure Sea Buckthorn Pulp + Standardized Curcumin Extract</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                        <span>Natural full-spectrum Omegas 3, 6, 7 & 9 with high buffered Vitamin C</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between mt-auto">
                    <span className="text-xs text-[var(--color-primary-light)] font-semibold uppercase tracking-wider">
                      Pure Unfiltered Pulp
                    </span>
                    <Link 
                      to="/products/sea-buckthorn-pulp" 
                      className="text-xs font-bold text-white hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Product 2: Capsules */}
              <div className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/50 shadow-2xl overflow-hidden flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group h-full">
                {/* Product Image */}
                <div className="relative overflow-hidden bg-black/40 h-64 sm:h-72 w-full flex-shrink-0">
                  <img 
                    src="/images/himroots-sea-buckthorn-capsules.jpg" 
                    alt="Himroots Sea Buckthorn Oil Capsules" 
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)]/60 text-[var(--color-primary)] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    60 Softgels
                  </div>
                  <div className="absolute top-3 right-3 bg-[var(--color-primary)]/20 backdrop-blur-md border border-[var(--color-primary)]/40 text-[var(--color-primary-light)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Save 20%
                  </div>
                </div>

                {/* Content: Formulation Information */}
                <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">
                        Targeted Moisture
                      </span>
                      <span className="text-[11px] text-gray-400 font-medium">
                        30–60 Days Supply
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                      Himroots Sea Buckthorn Oil Capsules
                    </h3>

                    {/* Pricing */}
                    <div className="flex items-baseline gap-2.5 mb-3">
                      <span className="text-xl font-bold text-white font-serif">₹1,199</span>
                      <span className="text-xs text-gray-500 line-through">₹1,499</span>
                      <span className="text-[11px] text-[var(--color-primary)] font-semibold uppercase tracking-wider">Free Delivery</span>
                    </div>

                    <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4">
                      100% pure cold-pressed seed & berry oil with peak Omega-7 concentration for deep cellular moisture, glowing skin, and mucous membrane hydration.
                    </p>

                    {/* Supporting details / data */}
                    <div className="space-y-2 mb-6 text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                        <span>Peak Concentration of Rare Omega-7 (Palmitoleic Acid)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] flex-shrink-0" />
                        <span>Vegetarian softgel shell with UV-protective amber packaging</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between mt-auto">
                    <span className="text-xs text-[var(--color-primary-light)] font-semibold uppercase tracking-wider">
                      Cold-Pressed Seed & Berry Oil
                    </span>
                    <Link 
                      to="/products/sea-buckthorn-capsules" 
                      className="text-xs font-bold text-white hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5 uppercase tracking-wider group-hover:translate-x-0.5 transition-transform"
                    >
                      View Details <ArrowRight className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>

            {/* Clear CTA to existing shop page */}
            <div className="text-center">
              <Button 
                asChild
                className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-8 py-3.5 rounded-xl hover:opacity-95 shadow-md shadow-[var(--color-primary)]/10"
              >
                <Link to="/shop">Explore All Formulations</Link>
              </Button>
            </div>

          </div>
        </section>

      </div>
    </>
  );
}
