import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { products, type Product } from "@/data/products";
import { getStoreProducts } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import { SEO } from "@/components/common/SEO";

export default function Home() {
  const { addItem } = useCartStore();
  const [storeProducts, setStoreProducts] = useState<Product[]>(products);

  useEffect(() => {
    getStoreProducts()
      .then((items) => {
        if (items && items.length > 0) setStoreProducts(items);
      })
      .catch(() => setStoreProducts(products));
  }, []);

  const pulpProduct = storeProducts[0] || products[0];
  const capsuleProduct = storeProducts[1] || products[1];

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

  return (
    <>
      <SEO
        title="Himroots Wellness | Pure Himalayan Sea Buckthorn Juice & Botanicals"
        description="Experience the untouched vitality of wild-harvested Himalayan Sea Buckthorn juice from 12,000+ feet in Ladakh and Spiti. Raw, pure, and rich in rare Omega-7."
        canonical="/"
        type="website"
        structuredData={[organizationSchema, websiteSchema]}
      />
      <div className="flex flex-col bg-[var(--color-background)]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-12 md:pt-16 pb-16 md:pb-24 border-b border-[var(--color-border)] bg-black">
        {/* Authentic Himalayan Peaks Background - Subtle and deep black */}
        <div className="absolute inset-0 z-0 opacity-10 pointer-events-none">
          <img 
            src="/images/himalayan-hero-peaks.jpg" 
            alt="Pristine Himalayan Mountain Peaks in Ladakh" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* Hero Content Grid: Left Information & Right Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* Tagline */}
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
                <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
                <span className="font-tagline text-xs sm:text-sm md:text-base tracking-[0.18em] sm:tracking-[0.24em] uppercase text-[var(--color-primary-light)] font-semibold">
                  SIP THE POWER OF HIMALAYAS
                </span>
                <span className="h-[1px] w-6 sm:w-12 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
              </div>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.18] sm:leading-[1.14] font-serif">
                The Sacred Golden Berry of the <br />
                <span className="text-gold-gradient">High Himalayas</span>
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed font-light max-w-2xl">
                Known in ancient Ayurvedic wisdom as the <em>Holy Fruit of the Himalayas</em>, Sea Buckthorn survives extreme temperatures of -40°C to synthesize <strong>190+ bioactive nutrients</strong>, abundant <strong>Vitamins C & E</strong>, and the miraculous rare <strong>Omega-7</strong>. Himroots brings this pristine high-altitude vitality to you, unadulterated.
              </p>

              {/* 3 Enlarged, Prominent Value Tags */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full max-w-2xl mt-1">
                <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/60 text-center sm:text-left shadow-lg">
                  <span className="text-base sm:text-lg md:text-xl font-bold font-serif text-[var(--color-primary)] uppercase tracking-wider block">
                    12x Vitamin C
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300 block mt-1.5 leading-snug font-medium">
                    versus Oranges
                  </span>
                </div>
                <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/60 text-center sm:text-left shadow-lg">
                  <span className="text-base sm:text-lg md:text-xl font-bold font-serif text-[var(--color-primary)] uppercase tracking-wider block">
                    Rare Omega-7
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300 block mt-1.5 leading-snug font-medium">
                    Cell Hydration
                  </span>
                </div>
                <div className="p-4 sm:p-5 md:p-6 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/60 text-center sm:text-left shadow-lg">
                  <span className="text-base sm:text-lg md:text-xl font-bold font-serif text-[var(--color-primary)] uppercase tracking-wider block">
                    12,000+ Feet
                  </span>
                  <span className="text-xs sm:text-sm text-gray-300 block mt-1.5 leading-snug font-medium">
                    in Ladakh & Spiti
                  </span>
                </div>
              </div>

            </div>

            {/* Right Column: Freshly Harvested Berries Image with Luxury Border */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative group">
                {/* Border Container */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)] bg-[var(--color-card)] shadow-2xl">
                  <img 
                    src="/images/himroots-harvest-berries.jpg" 
                    alt="Freshly Harvested Himalayan Sea Buckthorn Berries in Wooden Bowl" 
                    className="w-full h-[260px] sm:h-[400px] lg:h-[480px] object-cover object-center"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">Handpicked Daily</span>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-white">Wild Trans-Himalayan Berries</h3>
                    </div>
                    <span className="text-[10px] text-gray-300 bg-black/60 px-2.5 py-1 rounded-full border border-white/10">100% Raw</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Featured Products Section - 2 Products Showcase */}
      <section id="products" className="py-14 sm:py-20 md:py-28 bg-[var(--color-secondary)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Pure Himalayan Formulations
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
              Two Ways to Experience Sea Buckthorn
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              We specialize exclusively in Sea Buckthorn. Whether you prefer a raw, nourishing daily pulp sip or concentrated cold-pressed softgel capsules, every batch is wild-foraged and lab-verified.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto">
            
            {/* Product 1: Pure Pulp */}
            <div className="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-2xl flex flex-col group hover:border-[var(--color-primary)] transition-all duration-300">
              <Link to={`/products/${pulpProduct.slug}`} className="relative h-[260px] sm:h-[380px] md:h-[400px] overflow-hidden bg-black/40 block">
                <img 
                  src={pulpProduct.images[0]} 
                  alt={pulpProduct.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)] text-[var(--color-primary)] text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                  {pulpProduct.volume} Canister
                </div>
                {pulpProduct.originalPrice && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[var(--color-accent)] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                    Save ₹{pulpProduct.originalPrice - pulpProduct.price}
                  </div>
                )}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)] p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-gray-300 font-medium truncate mr-2">95% Pure Sea Buckthorn + Curcumin Extract</span>
                  <span className="text-[var(--color-primary)] font-bold flex-shrink-0">100% Raw Pulp</span>
                </div>
              </Link>

              <div className="p-5 sm:p-8 flex flex-col flex-1">
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-primary)] mb-1 font-semibold">
                  {pulpProduct.category}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  <Link to={`/products/${pulpProduct.slug}`}>{pulpProduct.name}</Link>
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[var(--color-primary-light)] mb-3 sm:mb-4">
                  {pulpProduct.tagline}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {pulpProduct.description}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-6 sm:mb-8 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Rich in Vitamins C, E & K</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Zero Added Sugar</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Full Spectrum Omegas 3,6,7,9</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Golden Foil Sealed</span>
                  </div>
                </div>

                <div className="mt-auto pt-5 sm:pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start">
                    <div className="flex items-baseline gap-2">
                      {pulpProduct.originalPrice && (
                        <span className="text-gray-500 line-through text-xs">₹{pulpProduct.originalPrice}</span>
                      )}
                      <span className="text-2xl font-black text-gold-gradient">₹{pulpProduct.price}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">500 ml (~25 servings)</span>
                  </div>

                  <div className="flex gap-2.5 w-full sm:w-auto">
                    <Button 
                      size="sm"
                      onClick={() => addItem(pulpProduct, 1)}
                      className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-4 py-2.5 flex-1 sm:flex-initial"
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="uppercase text-xs tracking-wider border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 flex-1 sm:flex-initial"
                    >
                      <Link to={`/products/${pulpProduct.slug}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Product 2: Sea Buckthorn Capsules */}
            <div className="bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-2xl flex flex-col group hover:border-[var(--color-primary)] transition-all duration-300">
              <Link to={`/products/${capsuleProduct.slug}`} className="relative h-[260px] sm:h-[380px] md:h-[400px] overflow-hidden bg-black/40 block">
                <img 
                  src={capsuleProduct.images[0]} 
                  alt={capsuleProduct.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)] text-[var(--color-primary)] text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                  {capsuleProduct.volume}
                </div>
                {capsuleProduct.originalPrice && (
                  <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[var(--color-accent)] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                    Save ₹{capsuleProduct.originalPrice - capsuleProduct.price}
                  </div>
                )}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)] p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-gray-300 font-medium truncate mr-2">100% Pure Cold-Pressed Seed & Berry Oil</span>
                  <span className="text-[var(--color-primary)] font-bold flex-shrink-0">Max Omega-7</span>
                </div>
              </Link>

              <div className="p-5 sm:p-8 flex flex-col flex-1">
                <div className="text-[10px] sm:text-xs uppercase tracking-widest text-[var(--color-primary)] mb-1 font-semibold">
                  {capsuleProduct.category}
                </div>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                  <Link to={`/products/${capsuleProduct.slug}`}>{capsuleProduct.name}</Link>
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[var(--color-primary-light)] mb-3 sm:mb-4">
                  {capsuleProduct.tagline}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-6">
                  {capsuleProduct.description}
                </p>

                <div className="grid grid-cols-2 gap-2 sm:gap-2.5 mb-6 sm:mb-8 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Peak Concentration of Omega-7</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Vegetarian Softgel Shell</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Deep Cellular & Skin Hydration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Amber Glass UV Protection</span>
                  </div>
                </div>

                <div className="mt-auto pt-5 sm:pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start">
                    <div className="flex items-baseline gap-2">
                      {capsuleProduct.originalPrice && (
                        <span className="text-gray-500 line-through text-xs">₹{capsuleProduct.originalPrice}</span>
                      )}
                      <span className="text-2xl font-black text-gold-gradient">₹{capsuleProduct.price}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">60 Softgels (30-60 days)</span>
                  </div>

                  <div className="flex gap-2.5 w-full sm:w-auto">
                    <Button 
                      size="sm"
                      onClick={() => addItem(capsuleProduct, 1)}
                      className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-4 py-2.5 flex-1 sm:flex-initial"
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="uppercase text-xs tracking-wider border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 flex-1 sm:flex-initial"
                    >
                      <Link to={`/products/${capsuleProduct.slug}`}>Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Comparison Guide: Pulp vs. Capsules */}
      <section className="py-14 sm:py-20 bg-[var(--color-background)] border-b border-[var(--color-border)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-12">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Selection Guide
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-3">
              Which Formulation Suits Your Needs?
            </h2>
            <p className="text-gray-400 text-sm">Both deliver authentic Himalayan Sea Buckthorn, tailored for different daily routines.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-[var(--color-card)] p-5 sm:p-8 rounded-xl border border-[var(--color-border)] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
                <h4 className="text-base sm:text-lg font-bold text-white font-serif">Pure Pulp (Juice)</h4>
                <span className="text-xs text-[var(--color-primary)] font-bold">Daily Drink Ritual</span>
              </div>
              <ul className="space-y-3 sm:space-y-3.5 text-xs text-gray-300 mb-6">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Format:</strong> 500ml liquid pulp, mixed 10ml with water</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Best For:</strong> Immediate morning energy, digestive harmony, and comprehensive antioxidant defense</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Synergies:</strong> 95% Pure Sea Buckthorn Pulp + Standardized Curcumin Extract</span>
                </li>
              </ul>
              <div className="mt-auto pt-4 border-t border-[var(--color-border)] text-center">
                <Button size="sm" asChild className="w-full bg-gold-gradient text-black font-bold text-xs uppercase py-2.5">
                  <Link to={`/products/${pulpProduct.slug}`}>Select Pure Pulp</Link>
                </Button>
              </div>
            </div>

            <div className="bg-[var(--color-card)] p-5 sm:p-8 rounded-xl border border-[var(--color-border)] flex flex-col">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border)]">
                <h4 className="text-base sm:text-lg font-bold text-white font-serif">Sea Buckthorn Capsules</h4>
                <span className="text-xs text-[var(--color-primary)] font-bold">Targeted Cell Moisture</span>
              </div>
              <ul className="space-y-3 sm:space-y-3.5 text-xs text-gray-300 mb-6">
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Format:</strong> 60 softgel capsules, 1-2 taken daily with meals</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Best For:</strong> Dry eye relief, glowing skin hydration, cardiovascular health, and travel convenience</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Synergies:</strong> 100% pure cold-pressed seed & berry oil with natural Vitamin E</span>
                </li>
              </ul>
              <div className="mt-auto pt-4 border-t border-[var(--color-border)] text-center">
                <Button size="sm" asChild className="w-full bg-gold-gradient text-black font-bold text-xs uppercase py-2.5">
                  <Link to={`/products/${capsuleProduct.slug}`}>Select Softgel Capsules</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
    </>
  );
}

