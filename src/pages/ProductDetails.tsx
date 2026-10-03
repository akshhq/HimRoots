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

// Carousel slides matching spec descriptions
interface CarouselSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  badge?: string;
}

const JUICE_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: "Sea Buckthorn Pulp Juice",
    subtitle: "Front of Pack — Pure Liquid Pulp Concentrate 500ml",
    image: "/images/himroots-sea-buckthorn-pulp.jpg",
    badge: "Bestseller"
  },
  {
    id: 2,
    title: "Full Spectrum Omega Profile",
    subtitle: "Rare natural synergy of Omega 3, 6, 7 & 9 in bioactive plant form",
    image: "/images/pulp-omega-profile.jpg",
    badge: "Omega 3, 6, 7 & 9"
  },
  {
    id: 3,
    title: "Sea Buckthorn with 190+ Bioactives",
    subtitle: "Vitamins C & E, carotenoids, plant sterols & flavonoids",
    image: "/images/pulp-190-bioactives.jpg",
    badge: "190+ Bioactives"
  },
  {
    id: 4,
    title: "28x Vitamin C Potency",
    subtitle: "Provides up to 28x more concentrated Vitamin C than oranges",
    image: "/images/pulp-vitaminc-comparison.jpg",
    badge: "28x Vitamin C"
  },
  {
    id: 5,
    title: "60-Day Wellness Transformation",
    subtitle: "Expected results timeline from Day 1 to Day 60+",
    image: "/images/pulp-clinical-timeline.jpg",
    badge: "Clinical Timeline"
  },
  {
    id: 6,
    title: "Tested for Quality & Purity",
    subtitle: "Cold-pressed, unfiltered, zero added sugar & cGMP certified",
    image: "/images/pulp-quality-standards.jpg",
    badge: "Lab Verified"
  },
  {
    id: 7,
    title: "Daily Usage Ritual Guide",
    subtitle: "Mix 10ml in 200ml water twice daily before meals",
    image: "/images/pulp-daily-ritual-guide.jpg",
    badge: "Daily Ritual"
  },
  {
    id: 8,
    title: "Himroots Sea Buckthorn vs Others",
    subtitle: "Zero added sugar, never diluted, unfiltered berry pulp",
    image: "/images/pulp-comparison-chart.jpg",
    badge: "Pure Comparison"
  },
  {
    id: 9,
    title: "Pack of 2 Value Bundle",
    subtitle: "2 x 500ml bottles — 50-day complete wellness course",
    image: "/images/pulp-pack2-bundle.jpg",
    badge: "Save 25%"
  },
  {
    id: 10,
    title: "Benefits of Sea Buckthorn Juice",
    subtitle: "Triple Action: Energy, Deep Immunity & Radiant Skin",
    image: "/images/pulp-serving-ritual.jpg",
    badge: "Serving Ritual"
  },
  {
    id: 11,
    title: "Himalayan Sea Buckthorn",
    subtitle: "Wild-Harvested from pristine Ladakh at ~12,000 ft",
    image: "/images/himroots-harvest-berries.jpg",
    badge: "12,000 ft Harvest"
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
    title: "Golden Vitality Elixir",
    subtitle: "Bracing tart natural taste with standardized curcumin synergy",
    image: "/images/himroots-sea-buckthorn-juice.jpg",
    badge: "Golden Elixir"
  },
  {
    id: 14,
    title: "High Altitude Himalayan Peaks",
    subtitle: "Wild berries thriving through extreme Himalayan winter frost",
    image: "/images/himalayan-hero-peaks.jpg",
    badge: "Ladakh Peaks"
  }
];

const CAPSULES_CAROUSEL_SLIDES: CarouselSlide[] = [
  {
    id: 1,
    title: "Himroots Sea Buckthorn Softgels",
    subtitle: "Amber Apothecary Glass Bottle — 60 Vegetarian Softgels",
    image: "/images/himroots-sea-buckthorn-capsules.jpg",
    badge: "Bestseller"
  },
  {
    id: 2,
    title: "Concentrated Rare Omega-7",
    subtitle: "Palmitoleic acid for cellular membrane restoration & epithelial longevity",
    image: "/images/capsules-omega7-cellular.jpg",
    badge: "Rare Omega-7"
  },
  {
    id: 3,
    title: "Deep Skin Hydration & Barrier Repair",
    subtitle: "Reinforces epidermal lipid barrier and triggers pro-collagen synthesis",
    image: "/images/capsules-skin-hydration.jpg",
    badge: "Skin Barrier"
  },
  {
    id: 4,
    title: "Mucosal Lining & Internal Hydration",
    subtitle: "Targeted comfort for dry eyes, oral tissues and gut digestive mucosa",
    image: "/images/capsules-mucosal-comfort.jpg",
    badge: "Mucosal Comfort"
  },
  {
    id: 5,
    title: "100% Pure Botanical Formula",
    subtitle: "85% Cold-Pressed Berry & Seed Oil, 10% Carotenoids, 5% Vitamin E",
    image: "/images/capsules-clean-ingredients.jpg",
    badge: "Pure Formula"
  },
  {
    id: 6,
    title: "Rigorous Purity & Quality Standards",
    subtitle: "Cold-pressed, vegan softgel, hexane-free, cGMP certified facility",
    image: "/images/capsules-quality-certifications.jpg",
    badge: "Lab Verified"
  },
  {
    id: 7,
    title: "Daily Usage & Dosage Guide",
    subtitle: "1-2 softgels daily with meals, swallow with water, 60-90 days consistency",
    image: "/images/capsules-daily-ritual.jpg",
    badge: "Daily Ritual"
  },
  {
    id: 8,
    title: "Pack of 2 Value Bundle",
    subtitle: "2 x 60 Softgels (120 Capsules) — Complete 60-Day Wellness Course",
    image: "/images/capsules-pack2-bundle.jpg",
    badge: "Save 28%"
  },
  {
    id: 9,
    title: "Golden Softgel Pearls",
    subtitle: "Plant cellulose softgels rich in cold-pressed Himalayan berry oil",
    image: "/images/capsules-apothecary.jpg",
    badge: "Vegan Softgel"
  },
  {
    id: 10,
    title: "Ladakh High-Altitude Harvest",
    subtitle: "Wild Himalayan berries harvested at 12,000 ft in extreme cold desert",
    image: "/images/himalayan-harvest.jpg",
    badge: "12,000 ft Harvest"
  }
];

const JUICE_FAQS = [
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

const CAPSULES_FAQS = [
  {
    question: "What makes Himroots Sea Buckthorn Capsules unique?",
    answer: "Himroots Sea Buckthorn Capsules are formulated with 100% pure cold-pressed wild Himalayan berry and seed oil encapsulated in 100% plant-cellulose vegetarian softgels. They provide an extraordinarily concentrated source of rare Omega-7 (palmitoleic acid), Omegas 3, 6, 9, natural carotenoids, and vitamin E with zero gelatin, zero fillers, and zero synthetic preservatives."
  },
  {
    question: "How does Omega-7 benefit dry eyes and mucosal tissues?",
    answer: "Omega-7 (palmitoleic acid) is a fundamental building block of delicate epithelial and mucosal tissue membranes throughout the body. Supplementation helps replenish tear-film lipid layers to relieve dry, irritated eyes from screen fatigue, lubricates dry mouth and throat tissues, and soothes gastrointestinal linings."
  },
  {
    question: "Are the softgels 100% vegetarian?",
    answer: "Yes, 100%. Unlike conventional omega supplements that use bovine or porcine gelatin, Himroots uses advanced plant-cellulose softgel technology. They are completely vegan, non-GMO, hexane-free, and cause zero fishy aftertaste or reflux."
  },
  {
    question: "How long should I take the capsules to see results?",
    answer: "While initial hydration and mucosal comfort are often noticed within 1 to 2 weeks, biological cellular renewal and deep skin barrier repair are cumulative. Consistent daily use for 60 to 90 days is recommended for optimal, lasting results."
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
  const [prevSlug, setPrevSlug] = useState(slug);

  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setActiveSlideIndex(0);
  }

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

  const slides = isJuice ? JUICE_CAROUSEL_SLIDES : CAPSULES_CAROUSEL_SLIDES;

  const nextSlide = () => {
    setActiveSlideIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setActiveSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const currentSlide = slides[activeSlideIndex] || slides[0];
  const productFaqs = isJuice ? JUICE_FAQS : CAPSULES_FAQS;

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

  const filteredReviews = activeReviewFilter === "all" 
    ? customerReviews 
    : customerReviews.filter(r => activeReviewFilter === "5star" ? r.rating === 5 : r.rating === 4);

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: slides.map(s => `https://himroots.in${s.image}`),
    description: product.description,
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
      ratingValue: product.rating.toString(),
      reviewCount: product.reviews.toString()
    }
  };

  return (
    <>
      <SEO
        title={`${product.name} | Himroots Wellness`}
        description={product.description.slice(0, 160)}
        canonical={`/products/${product.slug}`}
        image={slides[0]?.image || product.images[0]}
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
                {product.name}
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
                
                {/* Visual Content: Real Product Detail Image */}
                <img
                  src={currentSlide.image}
                  alt={currentSlide.title}
                  className="w-full h-full object-contain"
                />

                {/* Overlaid Badges */}
                <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
                  <span className="bg-black/90 border border-[var(--color-border-gold)] text-[var(--color-primary)] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {currentSlide.badge || "Cold Pressed"}
                  </span>
                  <span className="bg-black/90 border border-[#1f1f1f] text-gray-300 text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    {isJuice ? "Unfiltered Pulp" : "Vegan Softgel"}
                  </span>
                </div>

                <div className="absolute top-3 right-3 bg-[var(--color-accent)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider pointer-events-none">
                  {isJuice ? "25% OFF" : "28% OFF"}
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
                    {activeSlideIndex + 1} / {slides.length}
                  </span>
                </div>

              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                {slides.map((slide, idx) => (
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
                    <img src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded" />
                  </button>
                ))}
              </div>

            </div>

            {/* RIGHT: Product Buy Block & Info */}
            <div className="lg:col-span-6 flex flex-col">
              
              {/* Category & Rating */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)]">
                  {product.category || "Wild Himalayan Superfood"}
                </span>
                
                {/* Rating */}
                <div className="flex items-center gap-1.5 bg-[#0a0a0a] border border-[#1f1f1f] px-2.5 py-1 rounded-full text-xs">
                  <div className="flex text-[var(--color-primary)]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-white">{product.rating}</span>
                  <span className="text-gray-400">/ 5 ({product.reviews} reviews)</span>
                </div>
              </div>

              {/* Title from product */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-white mb-2 leading-tight">
                {product.name}
              </h1>

              {/* Tagline from product */}
              <p className="text-sm font-medium text-[var(--color-primary-light)] mb-4">
                {product.tagline}
              </p>

              {/* Inventory Notice */}
              <div className="flex items-center gap-2 mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  Only {product.stock} left
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
                      <span className="text-xs text-gray-400 mb-2">
                        {isJuice ? "500ml bottle (25 days)" : "60 Softgels (30-60 days)"}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white">
                          ₹{isJuice ? "899" : (product.price || 1199)}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          ₹{isJuice ? "1,199" : (product.originalPrice || 1499)}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--color-accent)]">
                          {isJuice ? "25% off" : "20% off"}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 font-mono">
                        SKU: {isJuice ? "SBP-500" : "SBC-60"}
                      </span>
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
                      <span className="text-xs text-gray-400 mb-2">
                        {isJuice ? "2 x 500ml (50 days course)" : "2 x 60 Softgels (120 Softgels)"}
                      </span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-bold text-white">
                          ₹{isJuice ? "1,798" : "2,158"}
                        </span>
                        <span className="text-xs text-gray-500 line-through">
                          ₹{isJuice ? "2,398" : "2,998"}
                        </span>
                        <span className="text-[10px] font-bold text-[var(--color-accent)]">
                          {isJuice ? "25% off" : "28% off"}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-500 mt-1 font-mono">
                        SKU: {isJuice ? "SBP-500-2" : "SBC-60-2"}
                      </span>
                    </button>

                  </div>
                </div>

                {/* EMI & Cashback Offers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-4">
                  <div className="p-3 rounded-xl bg-[#0a0a0a] border border-[#1f1f1f] flex items-center gap-2.5">
                    <CreditCard className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-white block">0% EMI Available</span>
                      <span className="text-[11px] text-gray-400">
                        {isJuice ? "₹1 now + ₹449/mo (2 months)" : "₹1 now + ₹599/mo (2 months)"}
                      </span>
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
                        Member Price: ₹{isJuice ? (selectedVariant === "pack-1" ? "854" : "1,708") : (selectedVariant === "pack-1" ? "1,139" : "2,050")}
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
                      {product.description}
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
                      {product.detailedIngredients && product.detailedIngredients.length > 0 ? (
                        product.detailedIngredients.map((ing) => (
                          <div key={ing.name}>
                            <strong className="text-white block mb-0.5">{ing.name} ({ing.percentage}):</strong>
                            <span className="text-gray-400">{ing.benefits.join(" • ")}</span>
                          </div>
                        ))
                      ) : (
                        product.ingredients.map((ing, idx) => (
                          <div key={idx} className="text-gray-300">• {ing}</div>
                        ))
                      )}
                      <div className="text-[11px] text-gray-400 border-t border-[#1f1f1f] pt-2">
                        {product.certifications.join(" • ")}
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
                      {product.directions.map((dir, idx) => (
                        <p key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                          <span>{dir}</span>
                        </p>
                      ))}
                      {isJuice && (
                        <div className="p-3 rounded-lg bg-[#0a0a0a] border border-[#1f1f1f] text-xs text-gray-300 mt-2">
                          <strong className="text-[var(--color-primary)] block mb-1">Important Note on Sediment:</strong>
                          Natural separation and berry sediment are the hallmarks of cold-pressed, unfiltered sea buckthorn pulp containing pure essential fruit lipids. Shake vigorously before each pour.
                        </div>
                      )}
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
            {product.detailedIngredients && product.detailedIngredients.length > 0 ? (
              product.detailedIngredients.map((item, idx) => (
                <div
                  key={item.name}
                  className={`p-6 rounded-2xl bg-[#050505] flex flex-col justify-between ${
                    idx === 0 ? "border border-[var(--color-border-gold)]" : "border border-[#1f1f1f]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-primary)]">
                        {idx === 0 ? "Primary Botanical" : idx === 1 ? "Bioactive Synergy" : "Purity & Stability"}
                      </span>
                      <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded ${
                        idx === 0 ? "bg-gold-gradient text-black" : "bg-[#1a1a1a] text-gray-200 border border-[#222]"
                      }`}>
                        {item.percentage}
                      </span>
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white mb-2">
                      {item.name}
                    </h3>
                    <p className="text-xs text-gray-300 leading-relaxed mb-5">
                      {item.benefits[0]}
                    </p>
                    <div className="space-y-2 text-xs text-gray-300">
                      {item.benefits.slice(1).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] shrink-0" />
                          <span>{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : null}
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
              Essential questions on {product.name}.
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
