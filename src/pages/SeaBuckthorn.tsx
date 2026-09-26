import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Sun, 
  Shield, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  ChevronDown, 
  Droplets, 
  Leaf, 
  FlaskConical, 
  HelpCircle, 
  Clock, 
  Wine 
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";
import { SEO } from "@/components/common/SEO";

export default function SeaBuckthorn() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const pulpProduct = products[0];
  const capsuleProduct = products[1];

  const guideSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Himalayan Seabuckthorn Juice | Omega 3, 6, 7 & 9",
    description: "Discover HIMROOTS WELLNESS Seabuckthorn Juice, inspired by the Himalayas. Explore the golden berry's natural Omega-3, 6, 7 and 9 fatty-acid profile.",
    image: "https://himroots.in/images/himroots-harvest-berries.jpg",
    author: {
      "@type": "Organization",
      name: "Himroots Wellness",
    },
    publisher: {
      "@type": "Organization",
      name: "Himroots Wellness",
      logo: {
        "@type": "ImageObject",
        url: "https://himroots.in/images/himroots-logo.png",
      },
    },
    mainEntityOfPage: "https://himroots.in/about-sea-buckthorn",
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const omegas = [
    {
      symbol: "Ω3",
      title: "Omega-3: Alpha-Linolenic Acid (ALA)",
      badge: "Essential Fatty Acid",
      description:
        "A plant-based polyunsaturated fatty acid that the human body cannot produce on its own. ALA contributes to normal growth, development, and cellular nutrition. Found abundantly in the berry's seed oil.",
      role: "Seed Oil Profile: 25–30%"
    },
    {
      symbol: "Ω6",
      title: "Omega-6: Linoleic Acid (LA)",
      badge: "Essential Fatty Acid",
      description:
        "The principal dietary representative of the Omega-6 family. Linoleic acid is an integral structural constituent of cell membranes and helps maintain the skin's natural barrier function.",
      role: "Seed Oil Profile: 35–40%"
    },
    {
      symbol: "Ω7",
      title: "Omega-7: Palmitoleic Acid",
      badge: "The Signature Fatty Acid",
      description:
        "The most distinctive hallmark of Seabuckthorn. A rare monounsaturated fatty acid found in few common plant oils. Renowned in scientific literature for its role in cellular membranes, mucosal tissue hydration, and dermal health.",
      role: "Pulp Oil Profile: 30–40%"
    },
    {
      symbol: "Ω9",
      title: "Omega-9: Oleic Acid",
      badge: "Monounsaturated Fatty Acid",
      description:
        "A healthy monounsaturated fat also found in virgin olive oil and avocados. Supports healthy cell-membrane architecture and fosters a favorable dietary fatty-acid balance when replacing saturated fats.",
      role: "Seed & Pulp Oil: 15–20%"
    }
  ];

  const nutrients = [
    {
      icon: Sun,
      title: "Vitamin C",
      subtitle: "Natural Nutritional Support",
      description:
        "Seabuckthorn berries are celebrated for their rich natural vitamin C, which contributes to normal immune-system function, healthy collagen synthesis, and cell defense against oxidative stress."
    },
    {
      icon: Shield,
      title: "Vitamin E",
      subtitle: "Fat-Soluble Antioxidant",
      description:
        "Berry and seed oils naturally contain tocopherols belonging to the vitamin E family, providing fat-soluble cellular protection from oxidative environmental stress."
    },
    {
      icon: Sparkles,
      title: "Carotenoids",
      subtitle: "Nature's Golden Pigments",
      description:
        "Responsible for the berry's vivid Himalayan sunrise orange colour. These compounds are studied for their antioxidant activities, with key carotenoids converting naturally into Vitamin A."
    },
    {
      icon: FlaskConical,
      title: "Flavonoids & Polyphenols",
      subtitle: "Botanical Diversity",
      description:
        "An intricate spectrum of polyphenols, quercetin, and flavonoids studied worldwide for their free-radical scavenging capacity and synergistic cellular benefits."
    }
  ];

  const blendIngredients = [
    {
      percentage: "90%",
      name: "Wild Himalayan Seabuckthorn",
      botanical: "Hippophae rhamnoides",
      role: "The golden foundation berry, hand-harvested at 12,000+ ft altitude, delivering 4 essential omegas and bio-active organic acids."
    },
    {
      percentage: "2%",
      name: "Bhoomi Amla",
      botanical: "Phyllanthus species",
      role: "A classical Indian botanical traditionally revered in Ayurvedic practices for liver vitality, cellular cleansing, and metabolic harmony."
    },
    {
      percentage: "2%",
      name: "Makoy",
      botanical: "Solanum nigrum",
      role: "A time-honored heritage plant celebrated in classical pharmacopoeia for supporting natural internal balance."
    },
    {
      percentage: "2%",
      name: "Punarnava",
      botanical: "Boerhavia diffusa",
      role: "Translates to 'the renewer' in Sanskrit. Traditionally valued for fluid equilibrium, kidney wellness, and overall systemic rejuvenation."
    },
    {
      percentage: "2%",
      name: "Ashwagandha",
      botanical: "Withania somnifera",
      role: "The revered Himalayan rasayana adaptogen, renowned for harmonizing stress response, stamina, and natural vitality."
    },
    {
      percentage: "2%",
      name: "Safed Musli",
      botanical: "Chlorophytum borivilianum",
      role: "A prized traditional Ayurvedic botanical prized for its nutrient-dense tuberous roots and nourishing tonic properties."
    }
  ];

  const faqs = [
    {
      question: "What makes seabuckthorn different from other fruits?",
      answer:
        "Seabuckthorn contains an unusual combination of fatty acids in its fruit and seed oils, including Omega-3, Omega-6, Omega-7, and Omega-9. Unlike most common fruits, it synthesizes healthy lipids in both its pulp and seeds, alongside high naturally occurring vitamin C, carotenoids, and a wide array of botanical flavonoids."
    },
    {
      question: "Does seabuckthorn juice contain all four omegas?",
      answer:
        "The seabuckthorn fruit inherently contains all four omega families (Omega-3, 6, 7, and 9). The amount present in finished juice depends on its processing and the proportion of natural pulp and cold-pressed botanical oils retained during pressing. HIMROOTS preserves raw fruit pulp to deliver natural lipid richness."
    },
    {
      question: "What is special about Omega-7?",
      answer:
        "Omega-7, particularly palmitoleic acid, is a monounsaturated fatty acid found in seabuckthorn pulp oil. It is comparatively rare among widely consumed plant-based food oils and has attracted deep scientific interest for its natural role in skin physiology, mucosal tissue hydration, and cellular membrane integrity."
    },
    {
      question: "Can seabuckthorn juice replace fish oil or Omega-3 supplements?",
      answer:
        "No direct equivalence should be assumed. Seabuckthorn provides plant-based Alpha-Linolenic Acid (ALA), whereas fish oil primarily supplies long-chain EPA and DHA. Their biochemical compositions and dietary roles differ, making seabuckthorn a superb botanical complement to a wholesome, plant-focused diet."
    },
    {
      question: "Can I drink seabuckthorn juice every day?",
      answer:
        "Yes, seabuckthorn juice may be enjoyed daily as part of a varied, balanced lifestyle. For best results, follow the recommended serving size (typically 20–30ml diluted in water) on the bottle. Those who are pregnant, nursing, taking prescription medications, or managing specific medical conditions should consult a healthcare professional before adding concentrated botanical juices to their daily regimen."
    },
    {
      question: "Why is seabuckthorn juice naturally tangy?",
      answer:
        "Seabuckthorn is naturally rich in organic plant acids (such as malic acid and quinic acid) and concentrated vitamin C, giving it a bright, bracing, and intensely tart flavor. This tangy kick is the authentic hallmark of pure, unadulterated high-altitude Himalayan berries without added artificial sugars or synthetic flavorings."
    }
  ];

  return (
    <>
      <SEO
        title="Himalayan Seabuckthorn Juice | Omega 3, 6, 7 & 9 | HIMROOTS WELLNESS"
        description="Discover HIMROOTS WELLNESS Seabuckthorn Juice, inspired by the Himalayas. Explore the golden berry's natural Omega-3, 6, 7 and 9 fatty-acid profile, botanical nutrients and distinctive flavour."
        canonical="/about-sea-buckthorn"
        image="/images/himroots-harvest-berries.jpg"
        type="article"
        structuredData={guideSchema}
      />
      <div className="py-10 sm:py-16 md:py-24 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Navigation Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] mb-8">
          <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-primary)] font-semibold">About Sea Buckthorn</span>
        </nav>

        {/* Hero Header */}
        <header className="text-center max-w-4xl mx-auto mb-16 sm:mb-24">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)] text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[var(--color-primary)] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[var(--color-primary)]" />
            Premium Seabuckthorn Juice • Nature's Golden Berry • Himalayan Wellness
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif text-white mb-5 leading-tight">
            The Himalayan Secret to <br />
            <span className="text-gold-gradient">Natural Vitality</span>
          </h1>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6" />
          <p className="text-gray-200 text-base sm:text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto mb-6">
            Discover the golden goodness of the Himalayas. Born in the pristine mountain landscapes, seabuckthorn is an extraordinary orange berry celebrated for its distinctive nutritional composition, rich plant-based antioxidants, and rare beneficial fatty acids.
          </p>
          <div className="p-4 sm:p-6 rounded-2xl bg-[var(--color-card)]/90 border border-[var(--color-border-gold)] max-w-2xl mx-auto shadow-xl">
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed italic">
              "One remarkable berry. Four important omega fatty acids. A world of natural goodness."
            </p>
            <p className="text-[11px] text-[var(--color-primary)] font-semibold uppercase tracking-wider mt-2">
              HIMROOTS WELLNESS — Rooted in Nature. Inspired by the Himalayas.
            </p>
          </div>
        </header>

        {/* Section 1: Discover the Power of the Golden Berry */}
        <section className="mb-20 sm:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[var(--color-primary)] block mb-2">
                Section 1 • Botanical Profile
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-5">
                Discover the Power of the Golden Berry
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                Seabuckthorn (<em>Hippophae rhamnoides</em>) is a resilient deciduous shrub that thrives in extreme mountainous terrains, including the high-altitude Himalayan landscape of Ladakh and Spiti. Its bright orange berries have long been treasured in traditional mountain food practices and are increasingly studied for their rich nutritional and phytochemical matrix.
              </p>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                Within these small berries lies an impressive combination of naturally occurring compounds, including vitamin C, carotenoids, tocopherols (vitamin E), flavonoids, organic acids, and plant lipids.
              </p>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                Seabuckthorn is particularly unique because its seeds and fruit pulp have distinct fatty-acid profiles: the seeds are rich in Omega-3 and Omega-6, while the pulp oil is world-renowned for its rare Omega-7 content.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-gold)]">
                  <span className="text-[var(--color-primary)] font-bold text-base sm:text-lg block mb-0.5">12,000+ Ft</span>
                  <span className="text-gray-400 text-[11px]">Wild Himalayan Terroir (Ladakh & Spiti)</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-gold)]">
                  <span className="text-[var(--color-primary)] font-bold text-base sm:text-lg block mb-0.5">-40°C to +35°C</span>
                  <span className="text-gray-400 text-[11px]">Sub-Zero Climatic Resilience</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)] shadow-2xl group">
                <img 
                  src="/images/himroots-harvest-berries.jpg" 
                  alt="Raw Wild Himalayan Sea Buckthorn Berries in Wooden Bowl" 
                  className="w-full h-[320px] sm:h-[420px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 sm:p-6">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">Hippophae rhamnoides</div>
                  <div className="text-base sm:text-lg font-serif font-bold text-white">Wild Trans-Himalayan Golden Berries</div>
                  <p className="text-xs text-gray-300 mt-1">Rich in botanical lipids, polyphenols, and active organic acids</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: The Omega 3-6-7-9 Profile */}
        <section className="mb-20 sm:mb-28 bg-[var(--color-card)] border border-[var(--color-border-gold)] rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
              <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
                Section 2 • The Complete Fatty Acid Profile
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white mb-4">
                The Omega 3-6-7-9 Spectrum: Four Fatty Acids, One Extraordinary Fruit
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
                Seabuckthorn stands apart from ordinary fruits because of the natural fatty acids found in its seed and pulp oils. Its distinctive lipid composition includes two essential polyunsaturated fatty acids and two monounsaturated fatty acids.
              </p>
            </div>

            {/* 4 Omega Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {omegas.map((omega) => (
                <div 
                  key={omega.symbol}
                  className="bg-[var(--color-secondary)]/70 border border-[var(--color-border)] hover:border-[var(--color-primary)]/70 p-6 rounded-2xl flex flex-col transition-all duration-300"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gold-gradient flex items-center justify-center text-black font-serif font-black text-xl shadow-md">
                      {omega.symbol}
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-border-gold)] text-[var(--color-primary-light)]">
                      {omega.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white mb-2">{omega.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-4 flex-1">
                    {omega.description}
                  </p>
                  <div className="pt-3 border-t border-[var(--color-border)] text-xs font-semibold text-[var(--color-primary)]">
                    {omega.role}
                  </div>
                </div>
              ))}
            </div>

            {/* Structured Table: Natural Omega Composition */}
            <div className="bg-[var(--color-background)]/80 border border-[var(--color-border-gold)] rounded-2xl p-6 sm:p-8 mb-8 overflow-x-auto">
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-2 flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-[var(--color-primary)]" />
                Understanding the Natural Omega Composition
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                The following ranges describe the typical fatty-acid composition of seabuckthorn oils reported in peer-reviewed scientific literature:
              </p>

              <table className="w-full text-left text-xs sm:text-sm border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-[var(--color-border-gold)] text-[var(--color-primary-light)] uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Omega Fatty Acid</th>
                    <th className="py-3 px-4">Scientific Name</th>
                    <th className="py-3 px-4">Typical Seed Oil Profile</th>
                    <th className="py-3 px-4">Typical Pulp Oil Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-border)] text-gray-300">
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">Omega-3</td>
                    <td className="py-3.5 px-4">Alpha-Linolenic Acid (ALA)</td>
                    <td className="py-3.5 px-4 font-semibold text-gold-gradient">25 – 30%</td>
                    <td className="py-3.5 px-4 text-gray-400">Usually lower</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">Omega-6</td>
                    <td className="py-3.5 px-4">Linoleic Acid (LA)</td>
                    <td className="py-3.5 px-4 font-semibold text-gold-gradient">35 – 40%</td>
                    <td className="py-3.5 px-4 text-gray-400">Usually lower</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">Omega-7</td>
                    <td className="py-3.5 px-4">Palmitoleic Acid</td>
                    <td className="py-3.5 px-4 text-gray-400">Trace amounts</td>
                    <td className="py-3.5 px-4 font-semibold text-gold-gradient">30 – 40%</td>
                  </tr>
                  <tr className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white">Omega-9</td>
                    <td className="py-3.5 px-4">Oleic Acid</td>
                    <td className="py-3.5 px-4 font-semibold text-gold-gradient">~15 – 20%</td>
                    <td className="py-3.5 px-4 text-gray-300">Variable</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[11px] text-gray-400 mt-4 italic border-t border-[var(--color-border)] pt-3">
                * Illustrative percentages of total fatty acids, not percentages of the raw fruit or beverage. Actual composition naturally varies with cultivar, growing altitude, seasonal harvest conditions, and processing.
              </p>
            </div>

            {/* Why This Matters for Your Juice Callout */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]">
              <h4 className="text-sm sm:text-base font-bold font-serif text-white mb-2 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-[var(--color-primary)]" />
                Why This Matters for Your Juice
              </h4>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                While ordinary filtered fruit juices often eliminate essential oils during industrial clarification, HIMROOTS WELLNESS carefully preserves natural berry pulp and botanical oils. Retaining this golden pulp ensures that the rich fatty-acid profile and active micronutrients remain part of your daily beverage.
              </p>
            </div>

          </div>
        </section>

        {/* Section 3: Beyond Omegas: A Spectrum of Natural Nutrients */}
        <section className="mb-20 sm:mb-28">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Section 3 • Comprehensive Micronutrients
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Beyond Omegas: A Spectrum of Natural Nutrients
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-5" />
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              The nutritional story of seabuckthorn goes far beyond fatty acids. The berry contains a diverse spectrum of water-soluble and fat-soluble compounds that contribute to its vibrant colour, distinctive tart flavour, and exceptional nutritional character.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {nutrients.map((item) => {
              const IconComponent = item.icon;
              return (
                <div 
                  key={item.title}
                  className="bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/70 p-6 sm:p-7 rounded-2xl flex flex-col transition-all duration-300"
                >
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold font-serif text-white mb-1">{item.title}</h3>
                  <div className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                    {item.subtitle}
                  </div>
                  <p className="text-xs text-gray-300 leading-relaxed mb-4 flex-1">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 4: From the Himalayas, Inspired by Nature */}
        <section className="mb-20 sm:mb-28 bg-[var(--color-card)] border border-[var(--color-border-gold)] rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[var(--color-primary)] block mb-2">
                Section 4 • Himalayan Provenance
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-5">
                From the Himalayas, Inspired by Nature
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                High in the Himalayan mountains, where crisp thin air, intense ultraviolet solar exposure, and dramatic seasonal shifts shape the wilderness, seabuckthorn thrives as an emblem of enduring resilience.
              </p>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                Its vivid orange berries possess an unforgettable character: bright, delightfully tangy, deeply aromatic, and unmistakably invigorating.
              </p>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                HIMROOTS WELLNESS honors this extraordinary Himalayan gift by translating its pure botanical essence into a convenient, nutrient-dense daily drink. We celebrate ingredients in their authentic natural integrity.
              </p>
              
              <div className="p-4 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]">
                <span className="text-sm font-serif font-bold text-gold-gradient block mb-1">
                  The Spirit of the Himalayas, Captured in Every Bottle
                </span>
                <span className="text-xs text-gray-400">
                  Ethically foraged from high mountain riverbeds and processed with care.
                </span>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)] shadow-2xl group">
                <img 
                  src="/images/sea-buckthorn-frost-harvest.jpg" 
                  alt="Wild Himalayan Sea Buckthorn Berries in Frost" 
                  className="w-full h-[320px] sm:h-[400px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">Himalayan Frost Terroir</span>
                  <div className="text-base font-serif font-bold text-white">Thriving in Sub-Zero Peaks</div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 5: Our Botanical Wellness Blend */}
        <section className="mb-20 sm:mb-28">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Section 5 • Signature Formulation
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Our Botanical Wellness Blend
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-5" />
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              At HIMROOTS WELLNESS, we combine the distinctive character of raw Seabuckthorn with a thoughtfully curated synergy of classical Indian herbal botanicals. Our signature formulation unites six powerful plants:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-8">
            {blendIngredients.map((item) => (
              <div 
                key={item.name}
                className="bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/70 p-6 rounded-2xl flex flex-col transition-all duration-300 relative group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-serif font-black text-gold-gradient">
                    {item.percentage}
                  </span>
                  <Leaf className="w-4 h-4 text-[var(--color-primary)] opacity-70 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-lg font-bold font-serif text-white mb-0.5">{item.name}</h3>
                <span className="text-[11px] italic text-[var(--color-primary)] mb-3 block">
                  {item.botanical}
                </span>
                <p className="text-xs text-gray-300 leading-relaxed flex-1">
                  {item.role}
                </p>
              </div>
            ))}
          </div>

          {/* Formulation & Regulatory Note */}
          <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-[var(--color-secondary)]/60 border border-[var(--color-border-gold)]/60 text-xs text-gray-400 leading-relaxed flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-gray-200">Formulation & Transparency Standard:</strong> HIMROOTS WELLNESS formulations are crafted in strict accordance with FSSAI regulations, laboratory-verified for microbiological purity and safety, and formulated to deliver uncompromised botanical potency.
            </div>
          </div>
        </section>

        {/* Section 6: A Golden Addition to Your Daily Routine */}
        <section className="mb-20 sm:mb-28 bg-[var(--color-card)] border border-[var(--color-border-gold)] rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6 order-2 lg:order-1">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)] shadow-2xl group">
                <img 
                  src="/images/pulp-serving-ritual.jpg" 
                  alt="Daily Himalayan Seabuckthorn Serving Ritual" 
                  className="w-full h-[320px] sm:h-[400px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">The Daily Ritual</span>
                  <div className="text-base font-serif font-bold text-white">Pure Mountain Vitality in Every Sip</div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 order-1 lg:order-2">
              <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[var(--color-primary)] block mb-2">
                Section 6 • Daily Ritual
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-5">
                A Golden Addition to Your Daily Routine
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                Make room for a revitalizing moment of Himalayan nourishment. The vibrant, tangy flavour of Seabuckthorn makes it a thrilling addition to your morning routine or an invigorating boost throughout the day.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <Wine className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-xs sm:text-sm block mb-0.5">1. Serve Chilled or Diluted</strong>
                    <p className="text-gray-300 text-xs">
                      Dilute 20–30ml of pure pulp in a glass of water, coconut water, or fresh fruit juice according to your taste.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <Droplets className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-xs sm:text-sm block mb-0.5">2. Shake Well Before Every Use</strong>
                    <p className="text-gray-300 text-xs">
                      Because pure botanical oils and raw pulp naturally separate, shake vigorously to redistribute the golden omegas.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                  <Clock className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white text-xs sm:text-sm block mb-0.5">3. Optimal Morning Timing</strong>
                    <p className="text-gray-300 text-xs">
                      Best consumed in the morning on an empty stomach or 20 minutes before meals for maximum nutrient bio-availability.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Section 7: Frequently Asked Questions */}
        <section className="mb-20 sm:mb-28 max-w-4xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Section 7 • Clarifying Questions
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white mb-4 flex items-center justify-center gap-2.5">
              <HelpCircle className="w-7 h-7 text-[var(--color-primary)]" />
              Frequently Asked Questions
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              Explore scientific clarifications and practical insights on Himalayan Seabuckthorn Juice.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div 
                  key={faq.question}
                  className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[var(--color-primary)]/50"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-white text-sm sm:text-base md:text-lg">
                      {faq.question}
                    </span>
                    <ChevronDown 
                      className={`w-5 h-5 text-[var(--color-primary)] flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "transform rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="px-5 sm:px-6 pb-6 pt-1 text-xs sm:text-sm text-gray-300 leading-relaxed border-t border-[var(--color-border)]/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 8: Experience HIMROOTS WELLNESS (CTA & Products) */}
        <section className="bg-[var(--color-card)] border border-[var(--color-border-gold)] rounded-3xl p-8 sm:p-12 md:p-16 max-w-5xl mx-auto shadow-2xl text-center">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Section 8 • Experience Himroots
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            Nature's Golden Goodness, Bottled for You
          </h2>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10">
            From the extraordinary nutritional diversity of wild Seabuckthorn to the rich heritage of Indian botanicals, HIMROOTS WELLNESS brings together nature-inspired ingredients in a distinctive beverage experience.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-3xl mx-auto mb-10 text-left">
            
            {/* Pulp Card */}
            <div className="bg-[var(--color-secondary)]/80 border border-[var(--color-border-gold)] rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={pulpProduct.images[0]} 
                  alt={pulpProduct.name} 
                  className="w-16 h-16 rounded-xl object-cover border border-[var(--color-border-gold)]"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-primary)] block">Signature Elixir</span>
                  <h4 className="text-base font-bold text-white font-serif">{pulpProduct.name}</h4>
                  <span className="text-xs text-gold-gradient font-black">₹{pulpProduct.price}</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-6 flex-1">
                90% wild Himalayan Sea Buckthorn pulp enriched with 5 Ayurvedic herbs for digestive vigor, liver support, and raw morning vitality.
              </p>
              <Button asChild size="sm" className="w-full bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider">
                <Link to={`/products/${pulpProduct.slug}`}>
                  Explore Pure Juice <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>

            {/* Capsules Card */}
            <div className="bg-[var(--color-secondary)]/80 border border-[var(--color-border-gold)] rounded-2xl p-6 flex flex-col">
              <div className="flex items-center gap-4 mb-4">
                <img 
                  src={capsuleProduct.images[0]} 
                  alt={capsuleProduct.name} 
                  className="w-16 h-16 rounded-xl object-cover border border-[var(--color-border-gold)]"
                />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--color-primary)] block">Cold-Pressed Softgels</span>
                  <h4 className="text-base font-bold text-white font-serif">{capsuleProduct.name}</h4>
                  <span className="text-xs text-gold-gradient font-black">₹{capsuleProduct.price}</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-6 flex-1">
                Pure seed and pulp oil providing the highest natural concentration of Omega-7 for dry eye relief, cellular hydration, and skin radiance.
              </p>
              <Button asChild size="sm" className="w-full bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider">
                <Link to={`/products/${capsuleProduct.slug}`}>
                  Explore Softgels <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto uppercase tracking-widest text-xs font-bold bg-gold-gradient text-black px-8 py-4 sm:py-5">
              <Link to="/shop">Explore Our Seabuckthorn Juice</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto uppercase tracking-widest text-xs font-bold border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 text-white px-8 py-4 sm:py-5">
              <Link to="/about">Our Himalayan Story</Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
    </>
  );
}
