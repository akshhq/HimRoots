import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Mountain, Droplets, Sun, Sparkles, ChevronLeft, ChevronRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface HeroSlide {
  id: string;
  tagline: string;
  title: string;
  subtitle: string;
  description: string;
  badges: { icon: typeof Mountain; label: string }[];
  ctaPrimaryText: string;
  ctaPrimaryLink: string;
  ctaSecondaryText: string;
  ctaSecondaryLink: string;
  image: string;
  imageAlt: string;
  altitudeTag: string;
}

export function HeroSlideshow() {
  const slides: HeroSlide[] = [
    {
      id: "slide-1",
      tagline: "SIP THE POWER OF HIMALAYAS",
      title: "Seabuckthorn Goldenberry",
      subtitle: "The Ancient Elixir of the High Himalayas",
      description:
        "Wild-foraged at 12,000+ feet from the sub-zero glacial valleys of Ladakh & Spiti. Raw, unfiltered, and concentrated with 190+ bioactive nutrients, abundant natural Vitamin C, and rare full-spectrum Omega 3, 6, 7 & 9.",
      badges: [
        { icon: Mountain, label: "12,000+ Ft Terroir" },
        { icon: Sun, label: "12× Vitamin C vs Oranges" },
        { icon: Droplets, label: "Rare Omega-7 Matrix" },
      ],
      ctaPrimaryText: "Explore Formulations",
      ctaPrimaryLink: "/shop",
      ctaSecondaryText: "Discover Terroir",
      ctaSecondaryLink: "/about-sea-buckthorn",
      image: "/images/himroots-harvest-berries.jpg",
      imageAlt: "Wild-Harvested Himalayan Sea Buckthorn Golden Berries",
      altitudeTag: "12,000+ Ft Altitude",
    },
    {
      id: "slide-2",
      tagline: "CELLULAR REJUVENATION & RADIANCE",
      title: "Himalayan Sea Buckthorn Capsules",
      subtitle: "Pure Cold-Pressed Seed & Berry Oil in Vegan Softgels",
      description:
        "Nature's richest plant source of rare Omega-7 (Palmitoleic Acid). Restores deep cellular moisture, rejuvenates skin barrier elasticity, lubricates mucous membranes, and supports cardiovascular wellness.",
      badges: [
        { icon: Droplets, label: "Peak Omega-7 Potency" },
        { icon: Sparkles, label: "100% Vegan Softgel" },
        { icon: ShieldCheck, label: "Hexane & Solvent Free" },
      ],
      ctaPrimaryText: "Shop Softgels",
      ctaPrimaryLink: "/products/sea-buckthorn-capsules",
      ctaSecondaryText: "View Clinical Profile",
      ctaSecondaryLink: "/about-sea-buckthorn",
      image: "/images/himroots-sea-buckthorn-capsules.jpg",
      imageAlt: "Himroots Sea Buckthorn Softgel Oil Capsules",
      altitudeTag: "60 Softgels • 100% Pure",
    },
    {
      id: "slide-3",
      tagline: "DAILY MORNING IMMUNITY SIP",
      title: "Raw Liquid Pulp with Curcumin",
      subtitle: "Pure Unfiltered Himalayan Berry Concentrate",
      description:
        "95% raw Sea Buckthorn berry pulp synergized with standardized 95% Curcumin extract. Zero added sugar, zero artificial dilution. Mix 10ml with water every morning for clean, enduring vitality.",
      badges: [
        { icon: Sun, label: "Buffered L-Ascorbic Acid" },
        { icon: Mountain, label: "Zero Added Sugar" },
        { icon: Droplets, label: "Liposomal Curcumin Synergy" },
      ],
      ctaPrimaryText: "Order Pure Pulp",
      ctaPrimaryLink: "/products/sea-buckthorn-pulp",
      ctaSecondaryText: "How To Consume",
      ctaSecondaryLink: "/products/sea-buckthorn-pulp",
      image: "/images/himroots-sea-buckthorn-pulp.jpg",
      imageAlt: "Himalayan Sea Buckthorn Juice Pulp with Curcumin",
      altitudeTag: "500ml • 25 Servings",
    },
    {
      id: "slide-4",
      tagline: "PRISTINE ALPINE PROVENANCE",
      title: "The Winter Frost Harvest",
      subtitle: "Hand-Gathered in Sub-Zero Deserts of Ladakh",
      description:
        "Untouched by commercial monoculture, every golden berry braves harsh -30°C winter temperatures and intense UV radiation, forcing the plant to synthesize unmatched antioxidant density.",
      badges: [
        { icon: Mountain, label: "Wild-Foraged by SHGs" },
        { icon: ShieldCheck, label: "Third-Party Lab Tested" },
        { icon: Sparkles, label: "Ethical Living Wages" },
      ],
      ctaPrimaryText: "Our Himalayan Story",
      ctaPrimaryLink: "/about",
      ctaSecondaryText: "Shop All Formulations",
      ctaSecondaryLink: "/shop",
      image: "/images/sea-buckthorn-frost-harvest.jpg",
      imageAlt: "Frost-covered Himalayan Sea Buckthorn Harvest",
      altitudeTag: "Sub-Zero Alpine Terroir",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const active = slides[currentSlide];

  return (
    <section
      className="relative overflow-hidden pt-6 sm:pt-10 md:pt-14 pb-12 md:pb-20 border-b border-[var(--color-border)] bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Subtle Alpine Peaks Background Backdrop */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none transition-opacity duration-700">
        <img
          src="/images/himalayan-hero-peaks.jpg"
          alt="Pristine Himalayan Mountain Peaks in Ladakh"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-[460px]">
          
          {/* Left Column: Narrative & Typography */}
          <div className="lg:col-span-7 xl:col-span-8 flex flex-col items-start text-left">
            
            {/* Tagline Ribbon */}
            <div className="flex items-center gap-2.5 sm:gap-3 mb-3">
              <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
              <span className="font-tagline text-[11px] sm:text-xs md:text-sm tracking-[0.22em] uppercase text-[var(--color-primary-light)] font-bold">
                {active.tagline}
              </span>
              <span className="h-[1.5px] w-6 sm:w-10 bg-gradient-to-r from-transparent via-[var(--color-primary)] to-transparent" />
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] xl:text-[52px] font-bold tracking-tight text-white mb-2 leading-[1.12] font-serif transition-all duration-300">
              {active.title}
            </h1>

            {/* Secondary Subtitle */}
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-semibold tracking-tight text-gold-gradient font-serif leading-snug mb-4">
              {active.subtitle}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed font-light max-w-2xl mb-6">
              {active.description}
            </p>

            {/* Botanical Badge Highlights */}
            <div className="inline-flex flex-wrap items-center gap-3 sm:gap-5 py-3.5 px-4 rounded-xl bg-[var(--color-secondary)]/80 border border-[var(--color-border-gold)]/40 text-xs text-gray-300 mb-6">
              {active.badges.map((badge, idx) => {
                const IconComp = badge.icon;
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <IconComp className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                    <span className="tracking-wider uppercase font-medium text-[11px] sm:text-xs text-gray-200">
                      {badge.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <Button
                asChild
                className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-widest px-7 py-3 rounded-xl hover:opacity-95 shadow-lg shadow-[var(--color-primary)]/10"
              >
                <Link to={active.ctaPrimaryLink} className="inline-flex items-center gap-2">
                  <span>{active.ctaPrimaryText}</span>
                  <ArrowRight className="w-4 h-4 text-black" />
                </Link>
              </Button>

              <Button
                asChild
                className="bg-transparent border border-[var(--color-border-gold)] text-gray-300 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] font-bold uppercase text-xs tracking-widest px-6 py-3 rounded-xl transition-all"
              >
                <Link to={active.ctaSecondaryLink}>
                  <span>{active.ctaSecondaryText}</span>
                </Link>
              </Button>
            </div>

          </div>

          {/* Right Column: Visual Showcase Container */}
          <div className="lg:col-span-5 xl:col-span-4 relative mt-4 lg:mt-0">
            <div className="relative group">
              
              {/* Outer decorative gold frame */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/30 via-[var(--color-accent)]/20 to-[var(--color-primary)]/30 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />

              <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)]/80 bg-[var(--color-card)] shadow-2xl">
                <img
                  src={active.image}
                  alt={active.imageAlt}
                  className="w-full h-[280px] sm:h-[360px] lg:h-[400px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
                />

                {/* Lower gradient overlay with tags */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent p-4 sm:p-5 flex items-end justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">
                      Wild Himalayan Terroir
                    </span>
                    <h3 className="text-sm sm:text-base font-serif font-bold text-white">
                      Hippophae Rhamnoides
                    </h3>
                  </div>
                  <span className="text-[10px] text-gray-200 bg-black/80 px-2.5 py-1 rounded-full border border-[var(--color-border-gold)]/50 font-medium">
                    {active.altitudeTag}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Carousel Navigation Controls & Indicators */}
        <div className="flex items-center justify-between pt-8 mt-6 border-t border-[var(--color-border-gold)]/20">
          
          {/* Slide Indicator Pills */}
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-8 bg-gold-gradient"
                    : "w-2 bg-gray-700 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Prev / Next Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="w-8 h-8 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] text-gray-300 hover:text-[var(--color-primary)] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-mono text-gray-400 px-1">
              0{currentSlide + 1} / 0{slides.length}
            </span>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="w-8 h-8 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] text-gray-300 hover:text-[var(--color-primary)] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
