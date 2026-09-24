import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Heart, Sparkles, Check, Sun, Zap, Mountain, Compass } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { products, type Product } from "@/data/products";
import { getStoreProducts } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import { useLogoStore } from "@/store/logoStore";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function Home() {
  const { addItem } = useCartStore();
  const setIsHeroLogoVisible = useLogoStore((state) => state.setIsHeroLogoVisible);
  const heroLogoRef = useRef<HTMLDivElement>(null);

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

  // Observer to manage single-logo visibility between hero and navbar
  useEffect(() => {
    const target = heroLogoRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        // When hero logo is in view, setIsHeroLogoVisible(true) so navbar hides its logo.
        // Once hero logo leaves viewport (scrolled past), setIsHeroLogoVisible(false) so navbar smoothly shows its logo.
        setIsHeroLogoVisible(entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0,
        // Trigger right as hero logo scrolls behind the sticky navbar
        rootMargin: "-75px 0px 0px 0px",
      }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
      setIsHeroLogoVisible(false);
    };
  }, [setIsHeroLogoVisible]);

  return (
    <div className="flex flex-col bg-[var(--color-background)]">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-1 sm:pt-2 pb-16 md:pb-24 border-b border-[var(--color-border)]">
        {/* Subtle Ambient Glows */}
        <div className="absolute top-1/4 left-1/3 w-[600px] h-[600px] bg-[var(--color-primary)]/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-[450px] h-[450px] bg-[var(--color-accent)]/10 rounded-full blur-[140px] pointer-events-none" />
        
        {/* Authentic Himalayan Peaks Background */}
        <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
          <img 
            src="/images/himalayan-hero-peaks.jpg" 
            alt="Pristine Himalayan Mountain Peaks in Ladakh" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-background)] via-[var(--color-background)]/80 to-[var(--color-background)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
          
          {/* Centered Main Website Logo with subtle red visual treatment */}
          <div 
            ref={heroLogoRef}
            className="flex flex-col items-center justify-center text-center pt-1 pb-4 sm:pb-6"
          >
            <div className="relative group inline-block">
              {/* Subtle ambient warm red berry aura */}
              <div className="absolute -inset-4 sm:-inset-6 rounded-full bg-gradient-to-r from-red-600/20 via-rose-500/25 to-amber-500/15 blur-2xl pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-700" />
              
              {/* Prominent Hero Logo with subtle red tint/drop-shadow */}
              <BrandLogo 
                size="xl" 
                imgClassName="h-[68px] sm:h-36 md:h-44 w-auto hero-logo-red-treatment"
                showSubtitle={false} 
                className="relative z-10" 
              />
            </div>

            {/* Clean, Elegant, Readable Tagline */}
            <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 sm:gap-3">
              <span className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
              <span className="font-tagline text-xs sm:text-base md:text-lg tracking-[0.16em] sm:tracking-[0.22em] uppercase text-[var(--color-primary-light)] font-medium">
                Nature's Goodness in Every Sip
              </span>
              <span className="h-[1px] w-6 sm:w-16 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
            </div>
          </div>

          {/* Hero Content Grid: Left Information & Right Visual */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            
            {/* Left Column */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              
              {/* High Altitude Terroir Badge */}
              <Link 
                to="/about-sea-buckthorn"
                className="group inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)] text-[9px] sm:text-[10px] md:text-xs font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-[var(--color-primary)] uppercase mb-4 sm:mb-5 hover:border-[var(--color-primary)] hover:bg-[var(--color-secondary)]/80 transition-all"
              >
                <Mountain className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Wild-Harvested at 12,000+ Feet in Ladakh & Spiti</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>

              {/* Main Heading */}
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.18] sm:leading-[1.14] font-serif">
                The Sacred Golden Berry of the <br />
                <span className="text-gold-gradient">High Himalayas</span>
              </h1>

              {/* Description */}
              <p className="text-xs sm:text-base md:text-lg text-gray-300 mb-6 sm:mb-8 leading-relaxed font-light max-w-2xl">
                Known in ancient Ayurvedic wisdom as the <em>Holy Fruit of the Himalayas</em>, Sea Buckthorn survives extreme temperatures of -40°C to synthesize <strong>190+ bioactive nutrients</strong>, abundant <strong>Vitamins C & E</strong>, and the miraculous rare <strong>Omega-7</strong>. Himroots brings this pristine high-altitude vitality to you, unadulterated.
              </p>

              {/* 3 Value Badges */}
              <div className="grid grid-cols-3 gap-2 sm:gap-3.5 w-full max-w-xl mb-8 sm:mb-10">
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-center sm:text-left">
                  <span className="text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block">12x Vitamin C</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 block mt-0.5 leading-tight">vs. Oranges</span>
                </div>
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-center sm:text-left">
                  <span className="text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block">Rare Omega-7</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 block mt-0.5 leading-tight">Cell Hydration</span>
                </div>
                <div className="p-2.5 sm:p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] text-center sm:text-left">
                  <span className="text-[11px] sm:text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider block">12,000+ Ft</span>
                  <span className="text-[9px] sm:text-[10px] text-gray-400 block mt-0.5 leading-tight">Ladakh Terroir</span>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto">
                <Button 
                  size="lg" 
                  asChild
                  className="w-full sm:w-auto uppercase tracking-widest text-xs font-bold bg-gold-gradient hover:opacity-95 text-black shadow-lg shadow-[var(--color-primary)]/20 px-8 py-4 sm:py-5"
                >
                  <a href="#products">
                    Explore 2 Formulations <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  asChild 
                  className="w-full sm:w-auto uppercase tracking-widest text-xs font-bold border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 text-white px-8 py-4 sm:py-5"
                >
                  <Link to="/about">
                    Our Himalayan Story
                  </Link>
                </Button>
              </div>

            </div>

            {/* Right Column: Freshly Harvested Berries Image with Luxury Border */}
            <div className="lg:col-span-5 relative mt-4 lg:mt-0">
              <div className="relative group">
                
                {/* Ambient Glow */}
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-[var(--color-primary)]/30 via-[var(--color-accent)]/20 to-transparent blur-xl opacity-75 group-hover:opacity-100 transition duration-700 pointer-events-none" />
                
                {/* Border Container */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)] bg-[var(--color-card)] shadow-2xl">
                  <img 
                    src="/images/himroots-harvest-berries.jpg" 
                    alt="Freshly Harvested Himalayan Sea Buckthorn Berries in Wooden Bowl" 
                    className="w-full h-[260px] sm:h-[400px] lg:h-[480px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">Handpicked Daily</span>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-white">Wild Trans-Himalayan Berries</h3>
                    </div>
                    <span className="text-[10px] text-gray-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">100% Raw</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* The 4 Himalayan Botanical Pillars Strip */}
      <section className="bg-[var(--color-card)] border-b border-[var(--color-border)] py-8 sm:py-10 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                <Sun className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">12x Vitamin C</h4>
                <p className="text-[10px] sm:text-[11px] text-[var(--color-muted-foreground)] line-clamp-1 sm:line-clamp-none">More potent than fresh oranges</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">Rare Omega-7</h4>
                <p className="text-[10px] sm:text-[11px] text-[var(--color-muted-foreground)] line-clamp-1 sm:line-clamp-none">Nature's cellular hydrator</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">190+ Bioactives</h4>
                <p className="text-[10px] sm:text-[11px] text-[var(--color-muted-foreground)] line-clamp-1 sm:line-clamp-none">Flavonoids & minerals</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5 sm:gap-4 p-2 sm:p-0">
              <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">Wild Foraged</h4>
                <p className="text-[10px] sm:text-[11px] text-[var(--color-muted-foreground)] line-clamp-1 sm:line-clamp-none">Zero chemical agriculture</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section: What Makes Himalayan Sea Buckthorn So Unique? */}
      {/* Section: What Makes Himalayan Sea Buckthorn So Unique? */}
      <section className="py-14 sm:py-20 md:py-28 bg-[var(--color-background)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="max-w-3xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3 block">
              The Himalayan Miracle
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
              Nature's Most Resilient Botanical
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4 sm:mb-6" />
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Sea Buckthorn (<em>Hippophae rhamnoides</em>) has thrived across the trans-Himalayan desert for millennia. In extreme high-altitude conditions of intense UV solar radiation, freezing glacial winters, and thin mountain oxygen, the plant naturally supercharges its golden berries with unmatched cellular protection compounds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-8 rounded-2xl relative group hover:border-[var(--color-primary)]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5 sm:mb-6">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-serif mb-2 sm:mb-3">Complete Omega Spectrum</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                One of the only botanical species in the plant kingdom to furnish a complete profile of Omegas 3, 6, 9, and the exceptionally rare Omega-7 (Palmitoleic acid).
              </p>
              <div className="text-[11px] text-[var(--color-primary-light)] font-semibold uppercase tracking-wider">
                Restores mucosal hydration & cellular flexibility
              </div>
            </div>

            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-8 rounded-2xl relative group hover:border-[var(--color-primary)]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5 sm:mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-serif mb-2 sm:mb-3">Immune Defense Shield</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                Bursting with natural bio-available Vitamin C, bioflavonoids, and carotenoids. Helps neutralize free radical cascade and fortifies the body's natural daily resistance.
              </p>
              <div className="text-[11px] text-[var(--color-primary-light)] font-semibold uppercase tracking-wider">
                Superior absorption compared to synthetic ascorbic acid
              </div>
            </div>

            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-8 rounded-2xl relative group hover:border-[var(--color-primary)]/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5 sm:mb-6">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-white font-serif mb-2 sm:mb-3">Golden Skin Glow</h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                Omega-7 is a fundamental structural component of healthy human skin and collagen matrices. Nourishing from within illuminates tone, softens dryness, and preserves elasticity.
              </p>
              <div className="text-[11px] text-[var(--color-primary-light)] font-semibold uppercase tracking-wider">
                Deep nourishment for dull, irritated skin
              </div>
            </div>
          </div>

          {/* Deep Dive Callout Button */}
          <div className="mt-10 sm:mt-14 text-center">
            <Button 
              asChild 
              variant="outline" 
              className="border-[var(--color-border-gold)] text-white hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 text-xs font-bold uppercase tracking-widest px-8 py-5 rounded-xl shadow-lg"
            >
              <Link to="/about-sea-buckthorn" className="inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                <span>Deep Dive: History, Science & Legends of Sea Buckthorn</span>
                <ArrowRight className="w-4 h-4 ml-1 text-[var(--color-primary)]" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section - 2 Products Showcase */}
      <section id="products" className="py-14 sm:py-20 md:py-28 bg-[var(--color-secondary)] border-y border-[var(--color-border)]">
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
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[var(--color-accent)] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                  Save ₹{pulpProduct.originalPrice! - pulpProduct.price}
                </div>
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)] p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-[11px] sm:text-xs">
                  <span className="text-gray-300 font-medium truncate mr-2">90% Pure Sea Buckthorn + 5 Ayurvedic Herbs</span>
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
                    <span className="text-[11px] sm:text-xs">Liver & Digestive Support</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="text-[11px] sm:text-xs">Golden Foil Sealed</span>
                  </div>
                </div>

                <div className="mt-auto pt-5 sm:pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start">
                    <div className="flex items-baseline gap-2">
                      <span className="text-gray-500 line-through text-xs">₹{pulpProduct.originalPrice}</span>
                      <span className="text-2xl font-black text-gold-gradient">₹{pulpProduct.price}</span>
                    </div>
                    <span className="text-[11px] text-gray-400">500 ml (~17 servings)</span>
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
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[var(--color-accent)] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider">
                  Save ₹{capsuleProduct.originalPrice! - capsuleProduct.price}
                </div>
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
                      <span className="text-gray-500 line-through text-xs">₹{capsuleProduct.originalPrice}</span>
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
                  <span><strong>Format:</strong> 500ml liquid pulp, taken 30ml with water</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Best For:</strong> Immediate morning energy, digestive harmony, cold resistance, and immune boost</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Synergies:</strong> Enhanced with Bhoomi Amla, Ashwagandha, Makoy, Punarva, Safed Musli</span>
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

      {/* Sustainable Wild-Harvesting Brand Story */}
      <section className="py-14 sm:py-20 md:py-28 bg-[var(--color-card)] border-b border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            <div>
              <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3 block">
                The Himroots Ethos
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 sm:mb-6 font-serif">
                Respecting the Wild Himalayan Soil
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                Himroots was founded with a singular dedication: to preserve the authentic, untouched vitality of the Himalayan biosphere. We do not engage in commercial monoculture farming. Every berry is sustainably wild-harvested by local Himalayan villagers who have understood the rhythm of these thorny bushes for generations.
              </p>
              
              <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8 text-xs sm:text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Zero Carbon-Heavy Processing</strong> — Handpicked and cold-processed to guard delicate polyunsaturated fatty acids.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Fair-Trade Himalayan Partnerships</strong> — Directly empowering local high-altitude foragers with ethical wages.</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] mt-1.5 flex-shrink-0" />
                  <span><strong>Eco-Conscious Packaging</strong> — Food-safe recyclable kraft canisters and amber UV glass bottles.</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Button asChild className="w-full sm:w-auto uppercase tracking-widest text-xs bg-gold-gradient text-black font-bold px-8 py-4 sm:py-5">
                  <Link to="/about">
                    Our Himalayan Story <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto uppercase tracking-widest text-xs border-[var(--color-border-gold)] text-white hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 font-bold px-8 py-4 sm:py-5">
                  <Link to="/about-sea-buckthorn">
                    About Sea Buckthorn <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center mt-6 lg:mt-0">
              <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-2xl max-w-[480px] w-full">
                <img 
                  src="/images/himalayan-harvest.jpg" 
                  alt="Authentic wild harvesting of sea buckthorn in Ladakh Himalayas" 
                  className="w-full h-[260px] sm:h-[400px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent flex items-end p-4 sm:p-6">
                  <div>
                    <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">Untouched Terroir</div>
                    <div className="text-base sm:text-lg font-bold text-white font-serif">12,000+ Ft High Himalayan Altitudes</div>
                    <p className="text-[11px] sm:text-xs text-gray-300 mt-0.5">Sustainably hand-foraged by local Himalayan communities</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
