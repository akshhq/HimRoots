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
        description="Experience the untouched nutritional vitality of wild-harvested Himalayan Seabuckthorn (Goldenberry) from 12,000+ feet in Ladakh and Spiti. Raw, pure, and rich in rare Omega-7 and Vitamin C."
        canonical="/"
        type="website"
        structuredData={[organizationSchema, websiteSchema]}
      />
      <div className="flex flex-col bg-black text-white">
        
        {/* ============================================================== */}
        {/* 1. MINIMAL HERO SECTION                                       */}
        {/* ============================================================== */}
        <section className="relative overflow-hidden pt-10 sm:pt-14 md:pt-20 pb-16 md:pb-24 border-b border-[var(--color-border)] bg-black">
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
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              
              {/* Left Column: Hero Narrative & Title Hierarchy */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                {/* Tagline */}
                <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                  <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
                  <span className="font-tagline text-xs sm:text-sm tracking-[0.2em] sm:tracking-[0.25em] uppercase text-[var(--color-primary-light)] font-semibold">
                    SIP THE POWER OF HIMALAYAS
                  </span>
                  <span className="h-[1px] w-6 sm:w-10 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
                </div>

                {/* Hero Title Hierarchy */}
                <div className="mb-5 sm:mb-6">
                  {/* Line 1: Category / Ingredient Identifier */}
                  <span className="block text-sm sm:text-base md:text-lg font-serif tracking-[0.18em] uppercase text-[var(--color-primary)] mb-2 font-medium">
                    Seabuckthorn — Goldenberry
                  </span>
                  {/* Line 2: The Main Statement with Strong Visual Emphasis */}
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.14] font-serif">
                    The Elixir of the <span className="text-gold-gradient">Himalayas</span>
                  </h1>
                </div>

                {/* Concise Nutrition-Centric Narrative */}
                <p className="text-sm sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed font-light max-w-2xl">
                  Revered for centuries in high-altitude Tibetan and Ayurvedic traditions as the sacred golden berry, Sea Buckthorn survives extreme temperatures of -40°C in Ladakh and Spiti. In this unyielding cold desert, the plant synthesizes an unmatched density of <strong>190+ bioactive nutrients</strong>, abundant <strong>natural Vitamin C</strong>, and the exceedingly rare <strong>Omega-7</strong>.
                </p>

                {/* Small, Subtle Formulation Discovery Link */}
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Button 
                    asChild
                    className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-6 py-3 rounded-xl hover:opacity-95 shadow-md shadow-[var(--color-primary)]/10"
                  >
                    <Link to="/shop">
                      Explore Formulations <ArrowRight className="w-3.5 h-3.5 ml-2 inline-block" />
                    </Link>
                  </Button>
                  <Link 
                    to="/about-sea-buckthorn" 
                    className="text-xs uppercase tracking-widest text-gray-300 hover:text-[var(--color-primary)] transition-colors py-2 px-3 font-semibold"
                  >
                    Botanical Science &rarr;
                  </Link>
                </div>

              </div>

              {/* Right Column: Authentic Himalayan Harvest Visual */}
              <div className="lg:col-span-5 relative mt-4 lg:mt-0">
                <div className="relative group">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)]/70 bg-[var(--color-card)] shadow-2xl">
                    <img 
                      src="/images/himroots-harvest-berries.jpg" 
                      alt="Wild-Harvested Himalayan Sea Buckthorn Golden Berries" 
                      className="w-full h-[280px] sm:h-[400px] lg:h-[460px] object-cover object-center"
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
        {/* 2. NUTRITIONAL VALUE SECTION (MAIN FOCUS)                     */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
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

          </div>
        </section>

        {/* ============================================================== */}
        {/* 3. CONCISE BOTANICAL & ORIGIN NOTE                            */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-18 bg-black border-b border-[var(--color-border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="bg-[var(--color-card)] rounded-2xl p-6 sm:p-10 md:p-12 border border-[var(--color-border-gold)]/50 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                
                <div className="md:col-span-7">
                  <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
                    Pristine Provenance
                  </span>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-white mb-3">
                    Wild-Harvested, Never Commercially Cultivated
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light mb-4">
                    Himroots works in ethical partnership with local Himalayan communities in Ladakh and Spiti. Every berry is hand-gathered from wild, thorny bushes during sub-zero winters, completely free from commercial monoculture, synthetic fertilizers, or heat-intensive extraction.
                  </p>
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-light">
                    The result is cold-processed botanical purity that preserves intact delicate omega fatty acids and volatile antioxidants exactly as nature formulated them.
                  </p>
                </div>

                <div className="md:col-span-5 flex flex-col gap-3.5 bg-black/60 p-5 sm:p-6 rounded-xl border border-white/5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-200"><strong>Zero Added Sugar:</strong> 100% natural berry tartness and vital nourishment.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-200"><strong>Cold-Processed:</strong> Protects thermosensitive Omega-7 and Vitamin C.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-gray-200"><strong>Lab-Verified Potency:</strong> Rigorously tested for purity and heavy metal safety.</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* 4. SUBTLE PRODUCT DISCOVERY ELEMENT                           */}
        {/* ============================================================== */}
        <section className="py-14 sm:py-18 bg-[var(--color-background)]">
          <div className="max-w-5xl mx-auto px-4 sm:px-8 text-center">
            
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Available Formulations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-3">
              Two Ways to Experience HimRoots
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto mb-8 font-light">
              Crafted exclusively from wild Himalayan sea buckthorn, tailored for your daily wellness ritual.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-8 text-left">
              
              {/* Formulation 1: Pure Pulp */}
              <div className="p-5 sm:p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">Daily Liquid Sip</span>
                    <span className="text-[10px] text-gray-400 border border-white/10 px-2 py-0.5 rounded">500 ml</span>
                  </div>
                  <h4 className="text-lg font-bold font-serif text-white mb-1.5">
                    Himalayan Pure Pulp with Curcumin
                  </h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                    Liquid concentrate wild-harvested at 12,000+ ft. Mixed daily with water for morning immunity and antioxidant energy.
                  </p>
                </div>
                <Link 
                  to="/products/sea-buckthorn-pulp" 
                  className="text-xs font-semibold text-[var(--color-primary)] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Formulation 2: Capsules */}
              <div className="p-5 sm:p-6 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">Targeted Moisture</span>
                    <span className="text-[10px] text-gray-400 border border-white/10 px-2 py-0.5 rounded">60 Softgels</span>
                  </div>
                  <h4 className="text-lg font-bold font-serif text-white mb-1.5">
                    Sea Buckthorn Oil Capsules
                  </h4>
                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                    100% pure cold-pressed seed & berry oil with peak Omega-7 concentration for cellular moisture and glowing skin.
                  </p>
                </div>
                <Link 
                  to="/products/sea-buckthorn-capsules" 
                  className="text-xs font-semibold text-[var(--color-primary)] hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider"
                >
                  View Details <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

            <Button 
              asChild
              className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-8 py-3.5 rounded-xl hover:opacity-95 shadow-md shadow-[var(--color-primary)]/10"
            >
              <Link to="/shop">Explore Formulations</Link>
            </Button>

          </div>
        </section>

      </div>
    </>
  );
}
