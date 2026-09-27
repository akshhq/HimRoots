import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
// Primary data source: GET /api/products/:slug via getStoreProductBySlug()
// src/data/products.ts is strictly retained as an offline/error fallback
import { getProductBySlug as getOfflineFallbackProductBySlug, type Product } from "@/data/products";
import { getStoreProductBySlug } from "@/lib/supabase";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { 
  Star, 
  ShieldCheck, 
  Truck, 
  Package, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Compass,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Activity,
  Heart,
  Droplets,
  Flame,
  Award,
  BookOpen,
  Users,
  Check,
  Zap,
  CreditCard,
  HelpCircle
} from "lucide-react";
import { SEO } from "@/components/common/SEO";

// Carousel slides matching spec descriptions (18 items)
interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  image?: string;
  isInfographic?: boolean;
  infographicType?: "omega" | "bioactives" | "vitaminc" | "comparison" | "results" | "quality" | "pack2";
  badge?: string;
}

const CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: "Sea Buckthorn Pulp Juice",
    subtitle: "Front of Pack — Pure Liquid Pulp Concentrate 500ml",
    image: "/images/himroots-sea-buckthorn-pulp.jpg",
    badge: "Bestseller"
  },
  {
    id: 2,
    title: "Himalayan Sea Buckthorn",
    subtitle: "Wild-Harvested from pristine Ladakh at ~12,000 ft",
    image: "/images/himroots-harvest-berries.jpg",
    badge: "12,000 ft Harvest"
  },
  {
    id: 3,
    title: "Sea Buckthorn Backed by Science",
    subtitle: "20+ Global Clinical Trials Validating Cellular Potency",
    isInfographic: true,
    infographicType: "quality",
    badge: "Clinical Grade"
  },
  {
    id: 4,
    title: "Benefits of Sea Buckthorn Juice",
    subtitle: "Triple Action: Energy, Deep Immunity & Radiant Skin",
    image: "/images/pulp-serving-ritual.jpg",
    badge: "Full Spectrum"
  },
  {
    id: 5,
    title: "Clinically Proven Results",
    subtitle: "Noticeable boost in stamina, digestive ease & mucosal hydration",
    isInfographic: true,
    infographicType: "results",
    badge: "Proven Efficacy"
  },
  {
    id: 6,
    title: "Full Spectrum Omega Profile",
    subtitle: "Rare natural synergy of Omega 3, 6, 7 & 9 in bioactive plant form",
    isInfographic: true,
    infographicType: "omega",
    badge: "Omega 3, 6, 7 & 9"
  },
  {
    id: 7,
    title: "Sea Buckthorn with 190+ Bioactives",
    subtitle: "Vitamins C & E, carotenoids, plant sterols & flavonoids",
    isInfographic: true,
    infographicType: "bioactives",
    badge: "190+ Bioactives"
  },
  {
    id: 8,
    title: "Sea Buckthorn with Vitamin C",
    subtitle: "Provides up to 28x more concentrated Vitamin C than oranges",
    isInfographic: true,
    infographicType: "vitaminc",
    badge: "28x Vitamin C"
  },
  {
    id: 9,
    title: "Himroots Sea Buckthorn vs Others",
    subtitle: "Zero added sugar, never diluted, unfiltered berry pulp",
    isInfographic: true,
    infographicType: "comparison",
    badge: "Pure Comparison"
  },
  {
    id: 10,
    title: "Results of Sea Buckthorn",
    subtitle: "Day 1 to Day 60 biological restoration timeline",
    isInfographic: true,
    infographicType: "results",
    badge: "30-Day Ritual"
  },
  {
    id: 11,
    title: "How to Take Sea Buckthorn Juice",
    subtitle: "Mix 10ml in 200ml water twice daily before meals",
    image: "/images/himroots-sea-buckthorn-juice.jpg",
    badge: "Daily Ritual"
  },
  {
    id: 12,
    title: "Unfiltered Sea Buckthorn Texture",
    subtitle: "Visible natural berry seed particles retaining essential lipid pulp",
    image: "/images/sea-buckthorn-frost-harvest.jpg",
    badge: "100% Unfiltered"
  },
  {
    id: 13,
    title: "Tested for Quality & Purity",
    subtitle: "Heavy metal free, pesticide free & third-party verified",
    isInfographic: true,
    infographicType: "quality",
    badge: "Lab Verified"
  },
  {
    id: 14,
    title: "Preserving Golden Bioactives",
    subtitle: "Crafted in dark UV-resistant canister to preserve fragile fatty acids",
    image: "/images/himroots-sea-buckthorn-pulp.jpg",
    badge: "UV-Shielded"
  },
  {
    id: 15,
    title: "Tamper-Evident Luxury Packaging",
    subtitle: "Double foil-sealed lid ensuring mountain-fresh active vitality",
    image: "/images/pulp-serving-ritual.jpg",
    badge: "Foil Sealed"
  },
  {
    id: 16,
    title: "Back Label & Nutritional Panel",
    subtitle: "100% Transparency: Zero preservatives, zero fillers, zero sugar",
    isInfographic: true,
    infographicType: "bioactives",
    badge: "Clean Label"
  },
  {
    id: 17,
    title: "Himalayan Golden Vitality Elixir",
    subtitle: "Wild berries thriving through extreme Himalayan winter frost",
    image: "/images/himalayan-hero-peaks.jpg",
    badge: "High Altitude"
  },
  {
    id: 18,
    title: "Pack of 2 Value Bundle",
    subtitle: "2 x 500ml bottles — 50-day complete wellness course",
    isInfographic: true,
    infographicType: "pack2",
    badge: "Save 25%"
  }
];

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  // Initial fallback avoids layout shift; immediately hydrated from authoritative backend /api/products/:slug
  const [product, setProduct] = useState<Product | undefined>(() => getOfflineFallbackProductBySlug(slug || ""));
  const { addItem } = useCartStore();

  useEffect(() => {
    if (slug) {
      // Connect to GET /api/products/:slug as primary authoritative data source
      getStoreProductBySlug(slug).then((liveProduct) => {
        if (liveProduct) setProduct(liveProduct);
      });
    }
  }, [slug]);

  // Variant Selection: "pack-1" or "pack-2"
  const [selectedVariant, setSelectedVariant] = useState<"pack-1" | "pack-2">("pack-1");
  const [quantity, setQuantity] = useState(1);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<string>("description");
  const toggleAccordion = (key: string) => {
    setOpenAccordion(prev => prev === key ? "" : key);
  };

  // Product FAQ state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Scientific Evidence Slider state
  const [activeStudyIndex, setActiveStudyIndex] = useState(0);

  // Review Filter
  const [activeReviewFilter, setActiveReviewFilter] = useState<"all" | "5star" | "4star">("all");

  if (!product) {
    return (
      <>
        <SEO
          title="Product Not Found | Himroots Wellness"
          description="The requested Himalayan formulation could not be found. Explore our pure Sea Buckthorn pulp and softgels."
          noindex={true}
        />
        <div className="py-24 sm:py-32 px-4 bg-black min-h-[70vh] flex items-center justify-center">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 rounded-full bg-[#0a0a0a] border border-[var(--color-border-gold)] flex items-center justify-center mx-auto mb-6 shadow-xl">
              <Compass className="w-8 h-8 text-[var(--color-primary)]" />
            </div>
            <span className="text-xs uppercase font-bold tracking-[0.25em] text-[var(--color-primary)] block mb-2">
              Himalayan Collection
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3">Formulation Not Found</h1>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed font-light">
              The formulation you are searching for does not exist or may have been updated.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="lg" className="w-full sm:w-auto bg-gold-gradient text-black font-bold uppercase text-xs tracking-widest px-8">
                <Link to="/shop">Explore All Formulations</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-[var(--color-border-gold)] text-white hover:bg-[var(--color-primary)]/10 text-xs font-semibold px-6">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const isJuice = product.id === "prod_001" || product.slug.includes("pulp") || product.slug.includes("juice");

  // Dynamic pricing calculations based on summary specifications
  const currentPricing = isJuice
    ? (selectedVariant === "pack-1" 
        ? {
            price: 899,
            originalPrice: 1199,
            discount: "25% OFF",
            sku: "SBP-500",
            volume: "500ml",
            name: "Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract | 500ml (Pack of 1)"
          }
        : {
            price: 1798,
            originalPrice: 2398,
            discount: "25% OFF",
            sku: "SBP-500-2",
            volume: "2 x 500ml",
            name: "Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract | 500ml (Pack of 2)"
          })
    : (selectedVariant === "pack-1"
        ? {
            price: product.price,
            originalPrice: product.originalPrice || 1499,
            discount: "20% OFF",
            sku: "SBC-60",
            volume: product.volume || "60 Softgels",
            name: `${product.name} (Pack of 1)`
          }
        : {
            price: Math.round(product.price * 2 * 0.9),
            originalPrice: (product.originalPrice || 1499) * 2,
            discount: "28% OFF",
            sku: "SBC-60-2",
            volume: `2 x ${product.volume || "60 Softgels"}`,
            name: `${product.name} (Pack of 2)`
          });

  const handleAddToCart = () => {
    const itemToAdd: Product = {
      ...product,
      id: selectedVariant === "pack-2" ? `${product.id}-pack2` : product.id,
      name: currentPricing.name,
      price: currentPricing.price,
      originalPrice: currentPricing.originalPrice,
      volume: currentPricing.volume
    };
    addItem(itemToAdd, quantity);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % CAROUSEL_SLIDES.length);
  };

  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + CAROUSEL_SLIDES.length) % CAROUSEL_SLIDES.length);
  };

  const currentSlide = CAROUSEL_SLIDES[activeSlideIndex];

  // Clinical studies from spec
  const clinicalStudies = [
    {
      id: 1,
      journal: "Functional Foods in Health and Disease",
      year: "2025",
      title: "Effects on Erythropoietin Production, Fatigue & Quality of Life",
      focus: "Stamina & Red Blood Cell Oxygenation",
      summary: "Evaluated clinical outcomes in women experiencing persistent fatigue. Regular consumption of bioactive sea buckthorn pulp demonstrated positive modulation in erythropoietin markers and marked enhancement in daily vigor and cellular oxygen transport."
    },
    {
      id: 2,
      journal: "Nutrition Journal",
      year: "2011",
      title: "Treatment of Childhood & Adult Gastrointestinal Irregularity",
      focus: "Gut Motility & Microbiome Balance",
      summary: "Demonstrated the gentle laxative and digestive lubricating action of wild sea buckthorn pulp. Natural pectin, mucilage fibers, and rare fatty acids supported smooth mucosal lining transit without cramping."
    },
    {
      id: 3,
      journal: "Journal of Functional Foods",
      year: "2024",
      title: "Impact on Skin Hydration, Blood Markers, Ocular & Vaginal Mucosa",
      focus: "Mucosal Hydration & Barrier Lipids",
      summary: "Comprehensive trial investigating Omega-7 palmitoleic acid on epithelial tissues. Confirmed statistically significant improvements in dermal hydration index, natural collagen elasticity, and tear-film stability."
    },
    {
      id: 4,
      journal: "BMC Complementary Medicine and Therapies",
      year: "2021",
      title: "Efficacy of Curcumin Extract on Gastrointestinal Symptoms",
      focus: "Systemic Anti-Inflammation & Gut Soothing",
      summary: "Randomized controlled investigation on standardized curcumin extract. Showed rapid reduction in visceral gut inflammation and bloating, working synergistically with lipid-rich berry pulp to amplify curcuminoid absorption."
    },
    {
      id: 5,
      journal: "Frontiers in Nutrition",
      year: "2022",
      title: "Phytochemistry and Health Benefits Comprehensive Systematic Review",
      focus: "190+ Phytonutrient Synergies",
      summary: "Extensive molecular analysis profiling over 190 bioactives including carotenoids, tocopherols, flavonoids, and phytosterols found in high-altitude Himalayan berries, documenting cardiovascular and liver hepatoprotection."
    },
    {
      id: 6,
      journal: "Intelligent Pharmacy",
      year: "2024",
      title: "Potential Dietary Supplement with Multifaceted Therapeutic Activities",
      focus: "Cardiovascular, Metabolic & Liver Function",
      summary: "Modern pharmacological review validating traditional Tibetan Sowa-Rigpa formulations. Sea buckthorn pulp combined with curcuminoids helps balance hepatic lipid profiles and scavenge harmful reactive oxygen species."
    }
  ];

  // Customer Reviews from sea-buckthorn-juice-product-summary.md
  const customerReviews = [
    {
      name: "Ishita Gupta",
      date: "30/08/2026",
      rating: 5,
      verified: true,
      sentiment: "Positive",
      sentimentNote: "Likes full Omega 3/6/7/9 profile",
      headline: "Complete Omega profile - surviving startup stress & pollution",
      text: "Love the fact that this has the complete Omega profile - 3, 6, 7 & 9. Crazy that a berry which survived the Ice Age is now helping me survive Gurgaon traffic pollution and startup stress."
    },
    {
      name: "Shreya Menon",
      date: "30/08/2026",
      rating: 5,
      verified: true,
      sentiment: "Positive",
      sentimentNote: "Bought for no added sugar, stayed for taste",
      headline: "Came for No Added Sugar, Stayed for the Taste",
      text: "Bought it because of the no added sugar, stayed because I genuinely enjoy taking it every morning. The tart natural flavor is unmatched."
    },
    {
      name: "Pooja Khanna",
      date: "30/08/2026",
      rating: 5,
      verified: true,
      sentiment: "Positive",
      sentimentNote: "Non-negotiable morning ritual",
      headline: "My Non-Negotiable Morning Habit",
      text: "I'm a founder and my sleep schedule is honestly terrible. This has become my one non-negotiable morning habit — feels like I'm giving my body something real before the chaos starts."
    },
    {
      name: "Rahul Bansal",
      date: "14/09/2026",
      rating: 4,
      verified: true,
      sentiment: "Neutral",
      sentimentNote: "Too early to assess results, likes packaging",
      headline: "Too early to assess results, likes packaging",
      text: "Too early to assess systemic health results after just 10 days, but the packaging and dark amber canister feel exceptionally premium. Taste is authentic and bracing."
    },
    {
      name: "Karan Malhotra",
      date: "18/09/2026",
      rating: 4,
      verified: true,
      sentiment: "Neutral",
      sentimentNote: "Taste is different but not bad",
      headline: "Taste is different but not bad",
      text: "Only a week in so too early to assess long-term benefits, but the taste is definitely different from standard sweetened juices — tart, robust, but not bad at all once mixed in water."
    }
  ];

  // FAQs from sea-buckthorn-juice-product-summary.md
  const productFaqs = [
    {
      question: "What is sea buckthorn?",
      answer: "Sea buckthorn (Hippophae rhamnoides) is a wildly hardy, ancient deciduous shrub native to the freezing, high-altitude deserts of the Himalayas (such as Ladakh at ~12,000 ft). Despite its name, it is not an ocean plant. Revered for centuries in traditional Tibetan and Ayurvedic medicine, its vibrant orange berries synthesize over 190 bioactives, rare plant lipids, and exceptional concentrations of natural Vitamin C."
    },
    {
      question: "What does sea buckthorn do for the body?",
      answer: "Sea buckthorn delivers comprehensive multi-system nourishment: it helps support all-day energy and vitality, helps reduce systemic inflammation when paired with curcumin, aids healthy gut motility and soothes digestive mucous membranes, supports liver function and metabolic detox, and actively reduces oxidative stress throughout the body."
    },
    {
      question: "Is sea buckthorn good for skin?",
      answer: "Yes, exceptionally. Sea buckthorn is one of the only known botanical sources of rare Omega-7 (palmitoleic acid), an essential structural constituent of skin cell membranes and mucosal tissues. Working alongside Vitamins C & E and carotenoids, it deeply hydrates dermal layers, reinforces moisture barriers, and stimulates natural pro-collagen synthesis for radiant, resilient skin."
    },
    {
      question: "How does its nutrition compare to other fruits?",
      answer: "Sea buckthorn dramatically outperforms ordinary fruits. It provides up to 28 times more concentrated Vitamin C than oranges (and up to 100 times more than lemons by weight). Furthermore, unlike standard sweet fruits that only offer watery carbohydrates, sea buckthorn synthesizes healthy lipids directly in its pulp and seeds, yielding a rare full-spectrum Omega 3, 6, 7 & 9 profile."
    }
  ];

  const filteredReviews = activeReviewFilter === "all" 
    ? customerReviews 
    : customerReviews.filter(r => activeReviewFilter === "5star" ? r.rating === 5 : r.rating === 4);

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract | 500ml",
    image: CAROUSEL_SLIDES.filter(s => s.image).map(s => `https://himroots.in${s.image}`),
    description: "Himroots Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract is a liquid pulp concentrate, wild-harvested from the pristine Himalayan region of Ladakh at ~12,000 ft.",
    sku: currentPricing.sku,
    brand: {
      "@type": "Brand",
      name: "Himroots Wellness",
    },
    offers: {
      "@type": "Offer",
      url: `https://himroots.in/products/${product.slug}`,
      priceCurrency: "INR",
      price: currentPricing.price,
      priceValidUntil: "2026-12-31",
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.73",
      reviewCount: "11"
    }
  };

  return (
    <>
      <SEO
        title="Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract | Himroots Wellness"
        description="Liquid pulp concentrate wild-harvested from Ladakh at 12,000 ft. Full-spectrum Omega 3, 6, 7 & 9 with standardized Curcumin Extract for energy, immunity & radiant skin."
        canonical={`/products/${product.slug}`}
        image="/images/himroots-sea-buckthorn-pulp.jpg"
        type="product"
        structuredData={[productStructuredData]}
      />

      <div className="bg-black text-gray-200">
        
        {/* ============================================================== */}
        {/* SECTION 1: PROMO ANNOUNCEMENT BAR (Product-Specific Offer)    */}
        {/* ============================================================== */}
        <div className="bg-[#050505] border-b border-[#1f1f1f] py-2 px-4 text-center">
          <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-xs sm:text-sm text-gray-300">
            <span className="bg-[var(--color-primary)] text-black font-extrabold text-[10px] sm:text-xs px-2 py-0.5 rounded uppercase tracking-wider">
              Special Offer
            </span>
            <span className="font-medium text-white">
              Get 10% OFF on all Himalayan Formulations
            </span>
            <span className="text-gray-400 hidden sm:inline">• Free Express Delivery Nationwide</span>
          </div>
        </div>

        {/* Breadcrumb Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 pt-5 pb-3">
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-gray-400">
              <Link to="/" className="hover:text-[var(--color-primary)]">Home</Link>
              <span>/</span>
              <Link to="/shop" className="hover:text-[var(--color-primary)]">Shop</Link>
              <span>/</span>
              <span className="text-gray-200 truncate max-w-[220px] sm:max-w-none font-medium">
                Himalayan Sea Buckthorn Juice with Curcumin
              </span>
            </div>
            <Link
              to="/about-sea-buckthorn"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--color-primary)] hover:text-white font-medium bg-[#0a0a0a] px-3 py-1 rounded border border-[#1f1f1f]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Scientific Monograph</span>
              <ArrowRight className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>

        {/* ============================================================== */}
        {/* SECTION 3: PRODUCT HERO SECTION (Above The Fold)               */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* LEFT: 18-Slide Image Carousel */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              
              {/* Main Slide Viewer */}
              <div className="relative w-full aspect-square sm:aspect-[4/3] lg:aspect-square bg-[#050505] rounded-2xl overflow-hidden border border-[#1f1f1f] shadow-2xl flex items-center justify-center p-4">
                
                {/* Visual Content: Image or Rich Infographic Card */}
                {currentSlide.image ? (
                  <img
                    src={currentSlide.image}
                    alt={currentSlide.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  /* Infographic Slide Renderers */
                  <div className="w-full h-full p-4 sm:p-6 flex flex-col justify-between bg-gradient-to-b from-[#0a0a0a] via-black to-[#050505] border border-[var(--color-border-gold)]/40 rounded-xl">
                    
                    {/* Infographic Header */}
                    <div className="flex items-center justify-between border-b border-[#1f1f1f] pb-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                        <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold">
                          Scientific Monograph
                        </span>
                      </div>
                      <span className="text-[10px] bg-[#1a1a1a] text-gray-300 font-mono px-2 py-0.5 rounded">
                        Slide {activeSlideIndex + 1} of 18
                      </span>
                    </div>

                    {/* Infographic Body based on type */}
                    {currentSlide.infographicType === "omega" && (
                      <div className="py-4 space-y-3">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white text-center">
                          Full Spectrum Omega Profile
                        </h3>
                        <p className="text-xs text-gray-400 text-center">
                          One of Earth's only botanical sources naturally containing all four omegas:
                        </p>
                        <div className="grid grid-cols-2 gap-2.5 pt-2">
                          <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-[var(--color-primary)] font-bold text-sm block">Omega-7</span>
                            <span className="text-[11px] text-gray-300">Skin barrier repair & mucosal hydration</span>
                          </div>
                          <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-[var(--color-primary)] font-bold text-sm block">Omega-3</span>
                            <span className="text-[11px] text-gray-300">Cardiovascular & healthy inflammation</span>
                          </div>
                          <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-[var(--color-primary)] font-bold text-sm block">Omega-6</span>
                            <span className="text-[11px] text-gray-300">Dermal resilience & moisture retention</span>
                          </div>
                          <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-[var(--color-primary)] font-bold text-sm block">Omega-9</span>
                            <span className="text-[11px] text-gray-300">Metabolic wellness & digestive harmony</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentSlide.infographicType === "vitaminc" && (
                      <div className="py-4 text-center space-y-4">
                        <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-bold">
                          Potency Comparison
                        </span>
                        <div className="flex items-center justify-center gap-6 my-2">
                          <div className="text-center p-3 bg-[#0a0a0a] rounded-xl border border-[var(--color-border-gold)]">
                            <span className="text-4xl sm:text-5xl font-black text-gold-gradient block">28x</span>
                            <span className="text-xs text-gray-200 font-bold mt-1 block">Sea Buckthorn</span>
                          </div>
                          <span className="text-gray-500 font-bold text-lg">vs</span>
                          <div className="text-center p-3 bg-[#0a0a0a] rounded-xl border border-[#1f1f1f] opacity-70">
                            <span className="text-3xl sm:text-4xl font-black text-gray-400 block">1x</span>
                            <span className="text-xs text-gray-400 font-medium mt-1 block">Fresh Oranges</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed max-w-sm mx-auto">
                          Provides exceptionally bioavailable raw Vitamin C bonded with natural bioflavonoids for superior absorption and systemic immune defense.
                        </p>
                      </div>
                    )}

                    {currentSlide.infographicType === "bioactives" && (
                      <div className="py-4 space-y-3">
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white text-center">
                          190+ Bioactive Nutrients
                        </h3>
                        <p className="text-xs text-gray-400 text-center">
                          Pristine high-altitude Ladakh berry matrix
                        </p>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="font-bold text-white block">Vitamins</span>
                            <span className="text-[10px] text-gray-400">A, B1, B2, C, E, K</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="font-bold text-white block">Minerals</span>
                            <span className="text-[10px] text-gray-400">Zinc, Iron, Calcium</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="font-bold text-white block">Phytosterols</span>
                            <span className="text-[10px] text-gray-400">Beta-sitosterol</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="font-bold text-white block">Polyphenols</span>
                            <span className="text-[10px] text-gray-400">Quercetin, Isorhamnetin</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="font-bold text-white block">Lipids</span>
                            <span className="text-[10px] text-gray-400">Omegas 3, 6, 7 & 9</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="font-bold text-white block">Curcuminoids</span>
                            <span className="text-[10px] text-gray-400">Turmeric Extract</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentSlide.infographicType === "comparison" && (
                      <div className="py-4 space-y-3">
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-white text-center">
                          Himroots vs Ordinary Juices
                        </h3>
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between p-2 rounded bg-[#0a0a0a] border border-[var(--color-border-gold)]">
                            <span className="text-gray-200">Processing Method</span>
                            <span className="text-[var(--color-primary)] font-bold">Cold Pressed & Unfiltered</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-gray-200">Sugar & Sweeteners</span>
                            <span className="text-white font-bold">Zero Added Sugar</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-gray-200">Harvest Altitude</span>
                            <span className="text-[var(--color-primary)] font-bold">~12,000 ft (Ladakh)</span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-gray-200">Curcumin Synergy</span>
                            <span className="text-white font-bold">Standardized Extract Added</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentSlide.infographicType === "results" && (
                      <div className="py-4 space-y-3 text-xs">
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-white text-center">
                          Expected Results Timeline
                        </h3>
                        <div className="space-y-2">
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-[var(--color-primary)] font-bold block mb-0.5">Days 1 - 10: Cellular Energy</span>
                            <span className="text-gray-400">Noticeable boost in morning stamina, gut comfort, and digestive lightness.</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-[var(--color-primary)] font-bold block mb-0.5">Days 15 - 30: Skin Barrier & Immunity</span>
                            <span className="text-gray-400">Enhanced dermal hydration, soothed mucosal linings, and sustained immune resilience.</span>
                          </div>
                          <div className="p-2.5 rounded bg-[#0a0a0a] border border-[#1f1f1f]">
                            <span className="text-[var(--color-primary)] font-bold block mb-0.5">Days 45 - 60+: Deep Metabolic Balance</span>
                            <span className="text-gray-400">Liver hepatoprotection, systemic antioxidant defense, and youthful cellular repair.</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {currentSlide.infographicType === "quality" && (
                      <div className="py-4 text-center space-y-3">
                        <ShieldCheck className="w-10 h-10 text-[var(--color-primary)] mx-auto" />
                        <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                          Rigorous Quality & Safety Standards
                        </h3>
                        <p className="text-xs text-gray-300 max-w-sm mx-auto">
                          Every batch is cold-extracted in a US FDA registered facility and strictly tested for heavy metals, pesticides, and microbial safety.
                        </p>
                        <div className="flex flex-wrap justify-center gap-2 pt-2">
                          <span className="px-2.5 py-1 rounded bg-[#0a0a0a] border border-[#1f1f1f] text-[11px] text-gray-300">GMP Certified</span>
                          <span className="px-2.5 py-1 rounded bg-[#0a0a0a] border border-[#1f1f1f] text-[11px] text-gray-300">FSSAI Approved</span>
                          <span className="px-2.5 py-1 rounded bg-[#0a0a0a] border border-[#1f1f1f] text-[11px] text-gray-300">Heavy Metal Free</span>
                        </div>
                      </div>
                    )}

                    {currentSlide.infographicType === "pack2" && (
                      <div className="py-4 text-center space-y-3">
                        <Package className="w-10 h-10 text-[var(--color-primary)] mx-auto" />
                        <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
                          Pack of 2 Value Bundle
                        </h3>
                        <p className="text-xs text-gray-300">
                          Complete 50-day course: 2 x 500ml bottles for unbroken cellular nourishment.
                        </p>
                        <div className="p-3 bg-[#0a0a0a] rounded-xl border border-[var(--color-border-gold)] max-w-xs mx-auto">
                          <span className="text-2xl font-bold text-white">₹1,798</span>
                          <span className="text-sm text-gray-500 line-through ml-2">₹2,398</span>
                          <span className="text-xs font-bold text-[var(--color-primary)] block mt-1">25% Discount Applied</span>
                        </div>
                      </div>
                    )}

                    {/* Infographic Footer */}
                    <div className="border-t border-[#1f1f1f] pt-2 text-[10px] text-gray-500 text-center">
                      Himroots Pure Himalayan Wellness Formulation
                    </div>

                  </div>
                )}

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  <span className="bg-black/90 border border-[var(--color-border-gold)] text-[var(--color-primary)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {currentSlide.badge || "Cold Pressed"}
                  </span>
                  <span className="bg-black/90 border border-[#1f1f1f] text-gray-300 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Unfiltered Pulp
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-[var(--color-accent)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider pointer-events-none">
                  25% OFF
                </div>

                {/* Carousel Prev / Next Controls */}
                <button
                  onClick={prevSlide}
                  aria-label="Previous Slide"
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 border border-[#1f1f1f] hover:border-[var(--color-primary)] text-white flex items-center justify-center shadow-lg"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  aria-label="Next Slide"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/80 border border-[#1f1f1f] hover:border-[var(--color-primary)] text-white flex items-center justify-center shadow-lg"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>

                {/* Bottom Slide Label */}
                <div className="absolute bottom-3 left-3 right-3 bg-black/90 backdrop-blur-sm border border-[#1f1f1f] px-3 py-1.5 rounded-lg flex items-center justify-between text-xs">
                  <span className="text-white font-medium truncate mr-2">
                    {currentSlide.title}
                  </span>
                  <span className="text-gray-400 font-mono text-[10px] shrink-0">
                    {activeSlideIndex + 1} / {CAROUSEL_SLIDES.length}
                  </span>
                </div>

              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CAROUSEL_SLIDES.map((slide, idx) => (
                  <button
                    key={slide.id}
                    onClick={() => setActiveSlideIndex(idx)}
                    className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 rounded-lg overflow-hidden border p-0.5 bg-[#050505] text-left relative ${
                      activeSlideIndex === idx
                        ? "border-[var(--color-primary)] ring-1 ring-[var(--color-primary)]"
                        : "border-[#1f1f1f] opacity-50 hover:opacity-100"
                    }`}
                    title={slide.title}
                  >
                    {slide.image ? (
                      <img src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded" />
                    ) : (
                      <div className="w-full h-full bg-[#111] rounded flex flex-col items-center justify-center p-1 text-center">
                        <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)] mb-0.5" />
                        <span className="text-[8px] text-gray-300 font-bold leading-tight line-clamp-2">
                          {slide.title}
                        </span>
                      </div>
                    )}
                  </button>
                ))}
              </div>

            </div>

            {/* RIGHT: Product Buy Block & Info */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Category & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)]">
                  Wild Himalayan Superfood
                </span>
                
                {/* Rating from spec: 4.73/5 (Based on 11 reviews) */}
                <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#1f1f1f] px-2.5 py-1 rounded-full text-xs">
                  <div className="flex text-[var(--color-primary)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-white">4.73</span>
                  <span className="text-gray-400">/ 5 (11 reviews)</span>
                </div>
              </div>

              {/* Title from spec */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2 leading-tight">
                Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract | 500ml
              </h1>

              {/* Tagline from spec */}
              <p className="text-sm font-medium text-[var(--color-primary-light)] mb-4">
                For Energy, Immunity & Skin Health
              </p>

              {/* Inventory Notice from summary */}
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Only 30 left
                </span>
                <span className="text-xs text-gray-400">• High Demand</span>
              </div>

              {/* Pricing Box */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#050505] border border-[#1f1f1f] mb-6">
                
                {/* Variant Selector: Pack of 1 vs Pack of 2 */}
                <div className="mb-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                    Select Pack Size
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    
                    {/* Pack of 1 */}
                    <button
                      type="button"
                      onClick={() => setSelectedVariant("pack-1")}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between relative ${
                        selectedVariant === "pack-1"
                          ? "border-[var(--color-primary)] bg-[#0a0a0a]"
                          : "border-[#1f1f1f] bg-black hover:border-gray-700"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">Pack of 1</span>
                        {selectedVariant === "pack-1" && (
                          <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 mb-2">500ml bottle (25 days)</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white">₹899</span>
                        <span className="text-xs text-gray-500 line-through">₹1,199</span>
                        <span className="text-[10px] font-bold text-[var(--color-accent)]">25% off</span>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 font-mono">SKU: SBP-500</span>
                    </button>

                    {/* Pack of 2 */}
                    <button
                      type="button"
                      onClick={() => setSelectedVariant("pack-2")}
                      className={`p-3 rounded-xl border text-left flex flex-col justify-between relative ${
                        selectedVariant === "pack-2"
                          ? "border-[var(--color-primary)] bg-[#0a0a0a]"
                          : "border-[#1f1f1f] bg-black hover:border-gray-700"
                      }`}
                    >
                      <div className="absolute -top-2.5 right-3 bg-[var(--color-primary)] text-black font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full tracking-wider shadow">
                        Best Value
                      </div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-bold text-white">Pack of 2</span>
                        {selectedVariant === "pack-2" && (
                          <div className="w-4 h-4 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 mb-2">2 x 500ml (50 days course)</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white">₹1,798</span>
                        <span className="text-xs text-gray-500 line-through">₹2,398</span>
                        <span className="text-[10px] font-bold text-[var(--color-accent)]">25% off</span>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 font-mono">SKU: SBP-500-2</span>
                    </button>

                  </div>
                </div>

                {/* EMI & Cashback Offers from summary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">0% EMI Available</span>
                      <span className="text-[11px] text-gray-400">₹1 now + ₹449/mo (2 months)</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">Cashback Offer</span>
                      <span className="text-[11px] text-gray-400">Flat 10% up to ₹250</span>
                    </div>
                  </div>
                </div>

                {/* Member Subscription Price Banner */}
                <div className="p-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)]/10 via-[var(--color-primary)]/5 to-transparent border border-[var(--color-border-gold)]/60 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Member Price: ₹{selectedVariant === "pack-1" ? "854" : "1,708"}
                      </span>
                      <span className="text-[11px] text-gray-400">
                        Save additional on recurring deliveries
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[var(--color-primary)] uppercase tracking-wider border border-[var(--color-border-gold)] px-2 py-1 rounded">
                    Subscribe
                  </span>
                </div>

                {/* Tax & Shipping Note */}
                <div className="text-[11px] text-gray-400 mt-3 flex items-center gap-2">
                  <Truck className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                  <span>Free shipping across India • MRP is inclusive of all taxes</span>
                </div>

              </div>

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center gap-4">
                  <div className="flex items-center border border-[#1f1f1f] rounded-xl overflow-hidden bg-[#050505]">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#111] text-base"
                    >
                      -
                    </button>
                    <span className="w-12 h-11 flex items-center justify-center font-bold text-white text-sm">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[#111] text-base"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-xs text-gray-400">
                    Total: <span className="font-bold text-white text-sm">₹{currentPricing.price * quantity}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    size="lg"
                    onClick={handleAddToCart}
                    className="flex-1 uppercase tracking-widest text-xs font-bold bg-gold-gradient text-black hover:opacity-95 shadow-lg shadow-[var(--color-primary)]/20 h-12"
                  >
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={handleBuyNow}
                    className="flex-1 uppercase tracking-widest text-xs font-bold border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 text-white h-12"
                  >
                    Buy Now
                  </Button>
                </div>
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-3.5 bg-[#050505] border border-[#1f1f1f] rounded-xl text-xs text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <span>Wild-Harvested Purity</span>
                </div>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <span>Gold Foil Sealed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                  <span>Express Dispatched</span>
                </div>
              </div>

              {/* Expandable Tabs Accordion */}
              <div className="space-y-2 border-t border-[#1f1f1f] pt-4">
                
                {/* Description Accordion */}
                <div className="border border-[#1f1f1f] rounded-xl overflow-hidden bg-[#050505]">
                  <button
                    onClick={() => toggleAccordion("description")}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:text-[var(--color-primary)]"
                  >
                    <span>Product Description</span>
                    {openAccordion === "description" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {openAccordion === "description" && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#1f1f1f] pt-3">
                      Himroots Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract is a liquid pulp concentrate, wild-harvested from the pristine Himalayan region of Ladakh at ~12,000 ft. Revered for centuries in Tibetan medicine, this ancient berry now meets rigorous modern science, bringing time-tested wisdom to the challenges of contemporary health. Cold-pressed and unfiltered to preserve its naturally occurring nutrient richness, it contains no added sugar or fillers. Naturally rich in Vitamin C and powered by 190+ bioactives, including Vitamins C & E, carotenoids, polyphenols, plant sterols, and a rare full-spectrum Omega 3, 6, 7 & 9 profile, it delivers comprehensive support for healthy skin, immunity, liver function, cholesterol balance, gut health, and antioxidant defence.
                    </div>
                  )}
                </div>

                {/* Ingredients Accordion */}
                <div className="border border-[#1f1f1f] rounded-xl overflow-hidden bg-[#050505]">
                  <button
                    onClick={() => toggleAccordion("ingredients")}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:text-[var(--color-primary)]"
                  >
                    <span>Ingredients & Formulation</span>
                    {openAccordion === "ingredients" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {openAccordion === "ingredients" && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#1f1f1f] pt-3 space-y-3">
                      <div>
                        <strong className="text-white block mb-0.5">Sea Buckthorn (Hippophae rhamnoides) Pulp:</strong>
                        Pure wild-harvested Himalayan pulp concentrate supplying 190+ active phytonutrients and full-spectrum Omega 3, 6, 7 & 9 with high naturally occurring Vitamin C.
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Curcumin Extract (Curcuma longa):</strong>
                        High-purity standardized curcuminoids providing potent anti-inflammatory synergy and systemic antioxidant defense.
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Demineralized Water:</strong>
                        Purified water base maintaining the optimal fluidity of the unfiltered liquid pulp concentrate.
                      </div>
                      <div>
                        <strong className="text-white block mb-0.5">Potassium Sorbate & Sodium Benzoate:</strong>
                        Permitted food-grade preservatives safeguarding active botanical omegas and vitamins against oxidation and microbial degradation throughout the 12-month shelf life.
                      </div>
                      <div className="text-[11px] text-gray-400 border-t border-[#1f1f1f] pt-2">
                        Zero added sugar • Heavy metal free • Contaminant free • Non-GMO • cGMP manufactured
                      </div>
                    </div>
                  )}
                </div>

                {/* How to Take Accordion */}
                <div className="border border-[#1f1f1f] rounded-xl overflow-hidden bg-[#050505]">
                  <button
                    onClick={() => toggleAccordion("usage")}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:text-[var(--color-primary)]"
                  >
                    <span>Directions for Use</span>
                    {openAccordion === "usage" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {openAccordion === "usage" && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#1f1f1f] pt-3 space-y-2">
                      <p className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                        <span>Mix 10ml in 200ml water, twice daily.</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                        <span>Best taken before meals (on an empty stomach for maximum absorption).</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                        <span>Shake well before use (natural sediment is expected — sign of being unfiltered, not a defect).</span>
                      </p>
                      <p className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                        <span>Benefits are cumulative — consistency over several weeks is recommended.</span>
                      </p>
                      <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] text-xs text-gray-300 mt-2">
                        <strong className="text-[var(--color-primary)] block mb-1">Important Note on Sediment:</strong>
                        Natural black/dark sediment in the bottle is completely expected and is due to unfiltered sea buckthorn seed particles. This is the natural hallmark of raw, cold-pressed processing.
                      </div>
                    </div>
                  )}
                </div>

                {/* Storage & Shelf Life Accordion */}
                <div className="border border-[#1f1f1f] rounded-xl overflow-hidden bg-[#050505]">
                  <button
                    onClick={() => toggleAccordion("storage")}
                    className="w-full p-4 flex items-center justify-between text-left font-bold text-sm text-white hover:text-[var(--color-primary)]"
                  >
                    <span>Shelf Life & Storage</span>
                    {openAccordion === "storage" ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                  </button>
                  {openAccordion === "storage" && (
                    <div className="px-4 pb-4 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#1f1f1f] pt-3 space-y-2">
                      <p>
                        <strong className="text-white">Shelf Life:</strong> 12 months from date of manufacture.
                      </p>
                      <p>
                        Store in a cool, dry, and dark place away from direct sunlight. Once opened, refrigerate the bottle and consume within 60 days to preserve optimal freshness and bioactive potency.
                      </p>
                    </div>
                  )}
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 4: PRODUCT FEATURES BANNER (Iconography USPs)          */}
        {/* ============================================================== */}
        <section className="bg-[#050505] border-y border-[#1f1f1f] py-8 my-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="text-center mb-6">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">
                Pure Formulation Standards
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mt-1">
                Zero Compromise Clean Nutrition
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              
              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f] text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#222] flex items-center justify-center text-[var(--color-primary)] mb-2">
                  <Droplets className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white block">Cold Pressed</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Heat-free extraction</span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f] text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#222] flex items-center justify-center text-[var(--color-primary)] mb-2">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white block">Unfiltered</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Retains natural berry pulp</span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f] text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#222] flex items-center justify-center text-[var(--color-primary)] mb-2">
                  <Check className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white block">Zero Added Sugar</span>
                <span className="text-[10px] text-gray-400 mt-0.5">100% natural fruit sugars</span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f] text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#222] flex items-center justify-center text-[var(--color-primary)] mb-2">
                  <Package className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white block">Liquid Pulp</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Concentrated elixir</span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f] text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#222] flex items-center justify-center text-[var(--color-primary)] mb-2">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white block">Heavy Metal Free</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Certified pure</span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f] text-center flex flex-col items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#0a0a0a] border border-[#222] flex items-center justify-center text-[var(--color-primary)] mb-2">
                  <Award className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-white block">Contaminant Free</span>
                <span className="text-[10px] text-gray-400 mt-0.5">Strict ISO batch testing</span>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 5: CLAIMS & BENEFITS GRID                             */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="text-center max-w-3xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">
              Multi-System Efficacy
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 mb-2">
              Key Claims & Targeted Benefits
            </h2>
            <p className="text-xs sm:text-sm text-gray-400 italic mb-6">
              *(Claims based on clinically studied ingredients, not the finished product)*
            </p>

            {/* Featured Clinical Data Point Callout */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)]/15 via-[#0a0a0a] to-[#050505] border border-[var(--color-border-gold)] flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center text-black shrink-0 shadow-lg">
                  <Activity className="w-6 h-6 text-black" />
                </div>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary)]">
                    Featured Clinical Data Point
                  </div>
                  <div className="text-base sm:text-lg font-serif font-bold text-white">
                    82.8% Increase in Antioxidant Activity
                  </div>
                  <p className="text-xs text-gray-300">
                    Demonstrated in cited clinical research after 12 weeks of regular consumption.
                  </p>
                </div>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-black border border-[var(--color-border-gold)] text-[var(--color-primary)] px-3 py-1.5 rounded-full shrink-0">
                12-Week Study
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            <div className="p-5 sm:p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] hover:border-[var(--color-border-gold)]">
              <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] border border-[var(--color-border-gold)]/60 flex items-center justify-center text-[var(--color-primary)] mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Helps Support Energy & Vitality</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Rich in natural B-complex vitamins, amino acids, and iron to combat cellular fatigue and fuel all-day mitochondrial energy without caffeine crashes.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] hover:border-[var(--color-border-gold)]">
              <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] border border-[var(--color-border-gold)]/60 flex items-center justify-center text-[var(--color-primary)] mb-4">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Helps Reduce Inflammation</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Synergistic Curcumin Extract paired with natural berry lipids accelerates cellular uptake, neutralizing chronic low-grade systemic inflammation.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] hover:border-[var(--color-border-gold)]">
              <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] border border-[var(--color-border-gold)]/60 flex items-center justify-center text-[var(--color-primary)] mb-4">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Helps Promote Skin Health</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Rare Omega-7 (palmitoleic acid) deeply hydrates dermal layers, reinforces the stratum corneum barrier, and supports natural pro-collagen production.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] hover:border-[var(--color-border-gold)]">
              <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] border border-[var(--color-border-gold)]/60 flex items-center justify-center text-[var(--color-primary)] mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Helps Aid Gut & Digestive Health</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Unfiltered pectin fibers and fatty acids soothe gastric mucous membranes, facilitating comfortable motility and nurturing beneficial gut flora.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] hover:border-[var(--color-border-gold)]">
              <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] border border-[var(--color-border-gold)]/60 flex items-center justify-center text-[var(--color-primary)] mb-4">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Helps Support Liver Function</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                High concentrations of bioactive flavonoids (quercetin and isorhamnetin) assist in phase II liver detoxification and healthy lipid metabolism.
              </p>
            </div>

            <div className="p-5 sm:p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] hover:border-[var(--color-border-gold)]">
              <div className="w-11 h-11 rounded-xl bg-[#0a0a0a] border border-[var(--color-border-gold)]/60 flex items-center justify-center text-[var(--color-primary)] mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mb-2">Helps Reduce Oxidative Stress</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Up to 28x more concentrated Vitamin C than citrus fruit provides extraordinary radical-scavenging power against environmental toxins.
              </p>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 6: DETAILED BENEFIT COPY (Omega Profile & Vitamin C)   */}
        {/* ============================================================== */}
        <section className="bg-[#050505] border-y border-[#1f1f1f] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">
                  Nutritional Architecture
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white leading-tight">
                  Full-Spectrum Omegas & Nature's Most Concentrated Vitamin C
                </h2>
                <div className="space-y-4 text-xs sm:text-sm text-gray-300 leading-relaxed">
                  <p>
                    Himroots Himalayan Sea Buckthorn delivers a rare full-spectrum omega profile of <strong>Omega 3, 6, 7 & 9</strong>. Omega-7 helps support skin hydration and barrier function, Omega-3 supports heart health and a healthy inflammatory response, Omega-6 helps reinforce the skin barrier, while Omega-9 contributes to metabolic wellness and digestive balance.
                  </p>
                  <p>
                    Naturally rich in <strong>190+ bioactive compounds</strong>, Sea Buckthorn is one of nature's most concentrated sources of Vitamin C, providing up to <strong>28x more Vitamin C than oranges</strong>. Unlike synthetic ascorbic acid, these active nutrients exist alongside bioflavonoids, carotenoids, and natural lipids that drastically enhance absorption.
                  </p>
                  <p>
                    Enhanced with <strong>Standardized Curcumin Extract</strong>, this unique formulation works in synergy with Sea Buckthorn's naturally occurring phytonutrients to neutralise oxidative stress and reinforce daily immunoprotection.
                  </p>
                </div>
              </div>

              {/* Graphic cards for Omega breakdown */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <div className="p-4 rounded-xl bg-black border border-[var(--color-border-gold)]/60">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white font-serif">Omega-7</span>
                    <span className="text-[10px] bg-[var(--color-primary)] text-black font-bold px-2 py-0.5 rounded">Palmitoleic Acid</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Hydrates mucous membranes (dry eyes, mouth, gut) and restores youthful skin elasticity from deep within.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-[#1f1f1f]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white font-serif">Omega-3</span>
                    <span className="text-[10px] bg-[#1a1a1a] text-gray-300 font-bold px-2 py-0.5 rounded">ALA</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Vital essential fatty acid supporting cardiovascular rhythm and modulating healthy inflammatory cytokines.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-[#1f1f1f]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white font-serif">Omega-6</span>
                    <span className="text-[10px] bg-[#1a1a1a] text-gray-300 font-bold px-2 py-0.5 rounded">Linoleic Acid</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Reinforces outer epidermal barriers against moisture evaporation, pollution particles, and dryness.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-black border border-[#1f1f1f]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-white font-serif">Omega-9</span>
                    <span className="text-[10px] bg-[#1a1a1a] text-gray-300 font-bold px-2 py-0.5 rounded">Oleic Acid</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    Promotes healthy glycemic balance, smooth arterial flexibility, and systemic metabolic wellness.
                  </p>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* BANNER & LIFESTYLE GRAPHICS (Card_1, Card_2, Card_3 & Banner)  */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            
            {/* Card 1 */}
            <div className="rounded-2xl bg-[#050505] border border-[#1f1f1f] overflow-hidden flex flex-col justify-between p-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)] block mb-2">
                  Heritage & Provenance
                </span>
                <h3 className="text-lg font-serif font-bold text-white mb-2">
                  Ladakh Wild Harvest at 12,000 ft
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Surviving sub-zero Himalayan winters, our berries produce an exceptionally high density of protective polyphenols and lipid compounds found nowhere else in the plant kingdom.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1f1f1f] flex items-center justify-between text-xs text-gray-300">
                <span>Hand-foraged in Ladakh</span>
                <span className="text-[var(--color-primary)] font-bold">12,000 ft Altitude</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl bg-[#050505] border border-[#1f1f1f] overflow-hidden flex flex-col justify-between p-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)] block mb-2">
                  Processing Integrity
                </span>
                <h3 className="text-lg font-serif font-bold text-white mb-2">
                  Raw Unfiltered Liquid Pulp
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  We never pasteurize at destructive high temperatures or filter out the seed lipids. Every spoonful carries the authentic tart berry taste and golden lipid froth of raw nature.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1f1f1f] flex items-center justify-between text-xs text-gray-300">
                <span>Zero Fillers or Sugar</span>
                <span className="text-[var(--color-primary)] font-bold">Cold-Pressed Purity</span>
              </div>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl bg-[#050505] border border-[#1f1f1f] overflow-hidden flex flex-col justify-between p-6">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)] block mb-2">
                  Modern Alchemy
                </span>
                <h3 className="text-lg font-serif font-bold text-white mb-2">
                  Enhanced with Curcumin Extract
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Curcuminoids require dietary lipids for systemic absorption. The natural Omegas in our sea buckthorn pulp form a biological carrier, maximizing cellular anti-inflammatory uptake.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#1f1f1f] flex items-center justify-between text-xs text-gray-300">
                <span>Standardized Extract</span>
                <span className="text-[var(--color-primary)] font-bold">Bioactive Synergy</span>
              </div>
            </div>

          </div>

          {/* Web_Banner_2 & Mob_Banner_2: Full-width Lifestyle Banner */}
          <div className="p-5 sm:p-12 rounded-3xl bg-gradient-to-r from-[#0a0a0a] via-[#050505] to-black border border-[var(--color-border-gold)] text-center relative overflow-hidden">
            <div className="max-w-3xl mx-auto space-y-4">
              <span className="text-xs uppercase font-bold tracking-[0.25em] text-[var(--color-primary)] block">
                The Himalayan Philosophy
              </span>
              <h2 className="text-2xl sm:text-4xl font-serif font-bold text-white leading-tight">
                "Modern Lifestyles create a gap. Sea Buckthorn was built to fill it."
              </h2>
              <p className="text-sm sm:text-base text-gray-300 max-w-xl mx-auto font-light">
                Where ancient Tibetan wisdom meets modern cellular science. Innovation meets integrity.
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 7: BRAND TRUST BADGES                                  */}
        {/* ============================================================== */}
        <section className="bg-[#050505] border-y border-[#1f1f1f] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              
              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-3">
                  <Users className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-serif">5 Million</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Satisfied Global Customers</div>
              </div>

              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-3">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-serif">20+</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Clinical Studies</div>
              </div>

              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-serif">US FDA</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Registered Manufacturing</div>
              </div>

              <div className="p-4">
                <div className="w-12 h-12 rounded-full bg-[#0a0a0a] border border-[#1f1f1f] flex items-center justify-center text-[var(--color-primary)] mx-auto mb-3">
                  <Award className="w-6 h-6" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-serif">GMP & FSSAI</div>
                <div className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-semibold">Quality Certified</div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 8: INGREDIENTS BREAKDOWN                              */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">
              Botanical Profiling
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1 mb-3">
              Complete Formulation Integrity
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Full transparency down to every drop. Zero added sugar, zero fillers, non-GMO, and third-party verified.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Sea Buckthorn Card */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-[var(--color-border-gold)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                    Primary Superfruit
                  </span>
                  <span className="text-xs bg-gold-gradient text-black font-extrabold px-2.5 py-0.5 rounded">
                    Wild Harvested
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">
                  Sea Buckthorn (Hippophae rhamnoides) Pulp
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-5">
                  Liquid pulp concentrate cold-pressed from Ladakh berries. Provides 190+ bioactives and a rare complete Omega 3, 6, 7 & 9 profile with up to 28x more Vitamin C than oranges.
                </p>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Omega-7 for deep cellular hydration</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Rich in flavonoids (quercetin & kaempferol)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Unfiltered pulp retaining seed lipids</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Curcumin Extract Card */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                    Standardized Extract
                  </span>
                  <span className="text-xs bg-[#1a1a1a] text-gray-200 font-extrabold px-2.5 py-0.5 rounded border border-[#222]">
                    High Potency
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">
                  Curcumin Extract (Curcuma longa)
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-5">
                  Standardized curcuminoids providing potent anti-inflammatory synergy. Natural lipids in sea buckthorn enhance systemic bioavailability across tissues.
                </p>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Neutralises systemic oxidative stress</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Supports healthy joint & mucosal response</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Lipid-assisted rapid cellular uptake</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Water & Preservatives Card */}
            <div className="p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                    Stability & Safety
                  </span>
                  <span className="text-xs bg-[#1a1a1a] text-gray-200 font-extrabold px-2.5 py-0.5 rounded border border-[#222]">
                    Class II
                  </span>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-2">
                  Demineralized Water & Permitted Preservatives
                </h3>
                <p className="text-xs text-gray-300 leading-relaxed mb-5">
                  Demineralized water with Potassium Sorbate & Sodium Benzoate in strict permitted limits to prevent microbial fermentation and maintain fresh stability across 12 months.
                </p>
                <div className="space-y-2 text-xs text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>Preserves fragile omegas and Vitamin C</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>12 months stability from manufacture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <span>FSSAI & cGMP manufacturing compliant</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 9: SCIENTIFIC EVIDENCE SLIDER                         */}
        {/* ============================================================== */}
        <section className="bg-[#050505] border-y border-[#1f1f1f] py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
            
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
              <div>
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">
                  Science Behind Our Ingredients
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                  Peer-Reviewed Clinical Evidence
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveStudyIndex((prev) => (prev - 1 + clinicalStudies.length) % clinicalStudies.length)}
                  className="w-10 h-10 rounded-full bg-black border border-[#1f1f1f] hover:border-[var(--color-primary)] text-white flex items-center justify-center"
                  aria-label="Previous Study"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveStudyIndex((prev) => (prev + 1) % clinicalStudies.length)}
                  className="w-10 h-10 rounded-full bg-black border border-[#1f1f1f] hover:border-[var(--color-primary)] text-white flex items-center justify-center"
                  aria-label="Next Study"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Active Study Highlight & Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {clinicalStudies.map((study, idx) => (
                <div
                  key={study.id}
                  className={`p-6 rounded-2xl bg-black border transition-colors flex flex-col justify-between ${
                    activeStudyIndex === idx
                      ? "border-[var(--color-primary)] shadow-xl shadow-[var(--color-primary)]/10"
                      : "border-[#1f1f1f]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <span className="text-[var(--color-primary)] font-mono font-bold">
                        {study.journal}
                      </span>
                      <span className="text-gray-500 font-mono">({study.year})</span>
                    </div>
                    <span className="text-[10px] bg-[#111] text-gray-300 font-semibold px-2 py-0.5 rounded uppercase tracking-wider block w-fit mb-2">
                      Focus: {study.focus}
                    </span>
                    <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                      {study.title}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {study.summary}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-[#1f1f1f] flex items-center justify-between text-[11px] text-gray-500">
                    <span>Study #{idx + 1} of 6</span>
                    <span className="text-[var(--color-primary)] font-medium">Peer Reviewed</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 10: CUSTOMER REVIEWS SECTION                          */}
        {/* ============================================================== */}
        <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-12 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Aggregated Ratings & Score Bars */}
            <div className="lg:col-span-4 p-6 sm:p-8 rounded-2xl bg-[#050505] border border-[#1f1f1f]">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block mb-2">
                Social Proof & Verification
              </span>
              <h2 className="text-2xl font-serif font-bold text-white mb-4">Customer Reviews</h2>
              
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-5xl font-black text-white font-serif">4.73</span>
                <span className="text-gray-400 text-sm">out of 5</span>
              </div>

              <div className="flex text-[var(--color-primary)] mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-current" />
                ))}
              </div>

              <p className="text-xs text-gray-400 mb-6">
                Based on 11 verified customer reviews across India
              </p>

              {/* Score Bars from summary: 73% 5-star, 27% 4-star */}
              <div className="space-y-2.5 text-xs text-gray-300">
                <div className="flex items-center gap-2">
                  <span className="w-12">5 Star</span>
                  <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)] w-[73%]"></div>
                  </div>
                  <span className="w-8 text-right font-mono text-gray-400">73%</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-12">4 Star</span>
                  <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)] w-[27%]"></div>
                  </div>
                  <span className="w-8 text-right font-mono text-gray-400">27%</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-12">3 Star</span>
                  <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)] w-[0%]"></div>
                  </div>
                  <span className="w-8 text-right font-mono">0%</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-12">2 Star</span>
                  <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)] w-[0%]"></div>
                  </div>
                  <span className="w-8 text-right font-mono">0%</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="w-12">1 Star</span>
                  <div className="flex-1 h-2 bg-[#111] rounded-full overflow-hidden">
                    <div className="h-full bg-[var(--color-primary)] w-[0%]"></div>
                  </div>
                  <span className="w-8 text-right font-mono">0%</span>
                </div>
              </div>

              {/* Review Filter Buttons */}
              <div className="mt-8 pt-6 border-t border-[#1f1f1f] flex gap-2">
                <button
                  onClick={() => setActiveReviewFilter("all")}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${
                    activeReviewFilter === "all"
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white"
                      : "border-[#1f1f1f] text-gray-400 hover:text-white"
                  }`}
                >
                  All (11)
                </button>
                <button
                  onClick={() => setActiveReviewFilter("5star")}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${
                    activeReviewFilter === "5star"
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white"
                      : "border-[#1f1f1f] text-gray-400 hover:text-white"
                  }`}
                >
                  5 Star (8)
                </button>
                <button
                  onClick={() => setActiveReviewFilter("4star")}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium ${
                    activeReviewFilter === "4star"
                      ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-white"
                      : "border-[#1f1f1f] text-gray-400 hover:text-white"
                  }`}
                >
                  4 Star (3)
                </button>
              </div>

            </div>

            {/* Right: Review Cards from summary */}
            <div className="lg:col-span-8 space-y-4">
              {filteredReviews.map((rev, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-[#050505] border border-[#1f1f1f] space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{rev.name}</span>
                        {rev.verified && (
                          <span className="text-[10px] bg-green-950/80 border border-green-800 text-green-300 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-2.5 h-2.5" /> Verified Buyer
                          </span>
                        )}
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          rev.sentiment === "Positive"
                            ? "bg-[var(--color-primary)]/10 border-[var(--color-border-gold)] text-[var(--color-primary)]"
                            : "bg-[#1a1a1a] border-gray-700 text-gray-300"
                        }`}>
                          {rev.sentiment} • {rev.sentimentNote}
                        </span>
                      </div>
                      <span className="text-[11px] text-gray-500 font-mono">{rev.date}</span>
                    </div>

                    <div className="flex text-[var(--color-primary)]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-gray-100">
                    "{rev.headline}"
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed font-light">
                    "{rev.text}"
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 10.5: PRODUCT FAQS                                    */}
        {/* ============================================================== */}
        <section className="max-w-4xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
          <div className="text-center mb-10">
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block mb-2">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center justify-center gap-2.5">
              <HelpCircle className="w-6 h-6 text-[var(--color-primary)]" />
              Frequently Asked Questions
            </h2>
            <div className="w-16 h-0.5 bg-gold-gradient mx-auto mt-3 mb-3" />
            <p className="text-xs sm:text-sm text-gray-400">
              Essential questions on Himalayan Sea Buckthorn Juice with Curcumin Extract.
            </p>
          </div>

          <div className="space-y-3.5">
            {productFaqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={faq.question}
                  className="bg-[#050505] border border-[#1f1f1f] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)]/40"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-white text-sm sm:text-base">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-[var(--color-primary)] shrink-0 transition-transform duration-300 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 sm:px-5 pb-5 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[#1f1f1f]">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================================================== */}
        {/* SECTION 11: CERTIFICATIONS & LAB REPORTS                       */}
        {/* ============================================================== */}
        <section className="bg-[#050505] border-t border-[#1f1f1f] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-center">
            
            <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block mb-2">
              Quality Assurance & Certifications
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-8">
              Certified by Leading Regulatory Standards
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              
              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f]">
                <span className="text-lg font-black text-white font-serif block">GMP</span>
                <span className="text-xs text-gray-400 mt-1 block">Good Manufacturing Practice</span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f]">
                <span className="text-lg font-black text-white font-serif block">FSSAI</span>
                <span className="text-xs text-gray-400 mt-1 block">Food Safety Authority India</span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f]">
                <span className="text-lg font-black text-white font-serif block">US FDA</span>
                <span className="text-xs text-gray-400 mt-1 block">Registered Facility</span>
              </div>

              <div className="p-4 rounded-xl bg-black border border-[#1f1f1f]">
                <span className="text-lg font-black text-white font-serif block">FSSC 22000</span>
                <span className="text-xs text-gray-400 mt-1 block">Food Safety Management</span>
              </div>

            </div>

            <p className="text-xs text-gray-500 max-w-2xl mx-auto leading-relaxed">
              Every batch undergoes independent laboratory testing for heavy metals (lead, cadmium, arsenic, mercury), microbiological contaminants, and active botanical compound verification before dispatch.
            </p>

          </div>
        </section>

      </div>
    </>
  );
}
