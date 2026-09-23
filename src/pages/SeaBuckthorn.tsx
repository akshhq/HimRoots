import { Link } from "react-router-dom";
import { 
  Sun, 
  Shield, 
  Zap, 
  Sparkles, 
  ArrowRight, 
  Mountain, 
  Compass, 
  CheckCircle2, 
  Flame, 
  Award, 
  Rocket, 
  Snowflake, 
  Feather,
  Leaf
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { products } from "@/data/products";

export default function SeaBuckthorn() {
  const pulpProduct = products[0];
  const capsuleProduct = products[1];

  return (
    <div className="py-10 sm:py-16 md:py-24 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] mb-8">
          <Link to="/" className="hover:text-[var(--color-primary)] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[var(--color-primary)] font-semibold">About Sea Buckthorn</span>
        </div>

        {/* Hero Header */}
        <div className="text-center max-w-4xl mx-auto mb-14 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)] text-[10px] md:text-xs font-semibold tracking-[0.2em] text-[var(--color-primary)] uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            The Definitive Botanical & Historical Guide
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif text-white mb-5 leading-tight">
            The Golden Berry of the <br />
            <span className="text-gold-gradient">High Himalayas</span>
          </h1>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6" />
          <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-3xl mx-auto">
            From the mythical diet of Pegasus and the conquests of Alexander the Great, to Russian space missions and Olympic athletic records—discover how a thorny, frost-bound shrub surviving at 12,000+ feet in the Himalayas became the planet's most formidable bioactive super-botanical.
          </p>
        </div>

        {/* Section 1: The Ancient Survival Plant */}
        <section className="mb-20 sm:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[var(--color-primary)] block mb-2">
                Origin & Habitat
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-5">
                The Ancient Survival Plant
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                Sea buckthorn (<em>Hippophae rhamnoides</em>) is <strong>not an ocean plant</strong>, despite its English colloquial name. It is a wildly hardy, prehistoric deciduous shrub native to the freezing, high-altitude arid cold deserts of the Himalayas (such as Ladakh and Spiti) and Eurasian rocky river valleys.
              </p>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                Long before modern laboratory assays documented its extraordinary chemical matrix, this thorny mountain plant was revered across millennia as an indispensable survival tool, an elite military ration, and the sovereign cornerstone of trans-Himalayan traditional pharmacopoeia.
              </p>

              <div className="grid grid-cols-2 gap-3 sm:gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-gold)]">
                  <span className="text-[var(--color-primary)] font-bold text-base sm:text-lg block mb-0.5">12,000+ Ft</span>
                  <span className="text-gray-400 text-[11px]">Cold Himalayan Deserts of Ladakh & Spiti</span>
                </div>
                <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-gold)]">
                  <span className="text-[var(--color-primary)] font-bold text-base sm:text-lg block mb-0.5">-40°C to +35°C</span>
                  <span className="text-gray-400 text-[11px]">Extreme Thermal Endurance Adaptation</span>
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
                  <div className="text-base sm:text-lg font-serif font-bold text-white">Wild Trans-Himalayan Bioactive Fruit</div>
                  <p className="text-xs text-gray-300 mt-1">Surviving relentless UV radiation and glacial frosts</p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Section 2: The "Shining Horse" of Antiquity (Pegasus & Alexander) */}
        <section className="mb-20 sm:mb-28 bg-[var(--color-card)] border border-[var(--color-border-gold)] rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              
              <div className="lg:col-span-6 order-2 lg:order-1">
                <div className="relative rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-2xl group">
                  <img 
                    src="/images/hippophae-pegasus-mythology.jpg" 
                    alt="Classical mythology of Pegasus and the Shining Horse Hippophae" 
                    className="w-full h-[320px] sm:h-[420px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-4 sm:p-6">
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block">Classical Antiquity Lore</span>
                    <h4 className="text-sm sm:text-base font-serif font-bold text-white">The Legend of Pegasus & The Shining Coat</h4>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 order-1 lg:order-2">
                <div className="inline-flex items-center gap-2 text-xs uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] mb-3">
                  <Feather className="w-4 h-4" />
                  Classical Etymology & Mythology
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-5">
                  The "Shining Horse" of Antiquity
                </h2>
                
                <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                  The botanical genus name, <strong className="text-[var(--color-primary-light)]">Hippophae</strong>, translates directly from Ancient Greek as <em>"shining horse"</em> (<em>hippos</em> = horse, <em>phaos</em> = shining light).
                </p>

                <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-secondary)]/70 border border-[var(--color-border)] mb-5 text-xs sm:text-sm text-gray-300 leading-relaxed">
                  <p className="mb-3">
                    <strong>The Pegasus Legend:</strong> In Greek classical mythology, sea buckthorn leaves and golden berries were celebrated as the preferred diet of <strong>Pegasus, the divine winged horse</strong>.
                  </p>
                  <p>
                    This myth arose from practical animal husbandry: ancient Greek horsemen observed that wounded and exhausted war horses grazing on wild sea buckthorn groves experienced rapid muscle repair, vibrant vitality, and developed exceptionally radiant, lustrous coats.
                  </p>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-gray-300">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <span><strong>Alexander the Great (4th Century BCE):</strong> Fed wild sea buckthorn berries to his troops and war horses to sustain endurance across grueling multi-year campaigns through Asia Minor and India.</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                    <span><strong>Pheidippides & Ancient Runners:</strong> Historic marathon runners consumed the tart, energy-dense berries to enhance pulmonary stamina and delay muscular fatigue.</span>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Section 3: Fueling Empires and Healing Traditions */}
        <section className="mb-20 sm:mb-28">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Sacred Heritage
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Fueling Empires & Ancient Healing Traditions
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-5" />
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              From the sacred medicine chambers of Tibet to the nomadic conquerors of Central Asia, Sea Buckthorn proved its worth where survival depended on unmatched resilience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            
            {/* 8th Century Tibetan Pharmacopoeia */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-8 rounded-2xl relative group hover:border-[var(--color-primary)]/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5">
                <Flame className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-bold tracking-widest text-[var(--color-primary)] mb-1">
                8th Century Classical Medicine
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mb-3">
                The Tibetan rGyud Bzi & Ayurveda
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                By the 8th century CE, the intensely sour, luminous golden berries were systematically codified in the <em>rGyud Bzi</em> (The Four Books of Pharmacopoeia), establishing it as a foundational medicine in Tibetan Sowa-Rigpa and Himalayan Ayurvedic traditions.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 border-t border-[var(--color-border)] pt-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span>Immediate relief for acute altitude sickness in high passes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span>Deep cellular healing for dermal burns and frost-cracked skin</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span>Digestive balance, gastric mucosal repair, and spleen tonic</span>
                </li>
              </ul>
            </div>

            {/* 13th Century Genghis Khan */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-8 rounded-2xl relative group hover:border-[var(--color-primary)]/60 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5">
                <Compass className="w-6 h-6" />
              </div>
              <div className="text-xs uppercase font-bold tracking-widest text-[var(--color-primary)] mb-1">
                13th Century Mongol Empire
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-serif text-white mb-3">
                Genghis Khan's Secret Cavalry Ration
              </h3>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed mb-4">
                During the 13th century, Sea Buckthorn played a decisive strategic role in the rapid expansion of the Mongol Empire. Genghis Khan famously ordered his commanders to supply cavalry troops and mounts with concentrated Sea Buckthorn rations.
              </p>
              <ul className="space-y-2 text-xs text-gray-300 border-t border-[var(--color-border)] pt-4">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span>Sustained agile military marches across sub-zero mountain steppes</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span>Rapid recovery from battle fatigue without relying on heavy supplies</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
                  <span>Immunity against harsh blizzards and scurvy on long campaigns</span>
                </li>
              </ul>
            </div>

          </div>
        </section>

        {/* Section 4: Modern Marvels (Space Race, Olympics, Everest) */}
        <section className="mb-20 sm:mb-28 bg-gradient-to-b from-[var(--color-secondary)]/50 via-[var(--color-card)] to-[var(--color-secondary)]/50 border border-[var(--color-border-gold)] rounded-3xl p-6 sm:p-10 md:p-14 shadow-2xl">
          <div className="max-w-6xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-14">
              <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
                20th & 21st Century Science
              </span>
              <h2 className="text-2xl sm:text-4xl font-bold font-serif text-white mb-4">
                Modern Marvels: Space and Sports
              </h2>
              <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
                In the mid-20th century, scientific biochemical analysis elevated Sea Buckthorn from regional folk medicine into a rigorously tested super-botanical for human survival in extreme environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              
              {/* Space Race */}
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl relative flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-4">
                  <Rocket className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-serif text-white mb-2">The Russian Space Race</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                  Soviet cosmonauts consumed concentrated Sea Buckthorn extracts aboard orbital space stations to protect their bodies from intense cosmic ionizing radiation and to prevent orbital frostbite.
                </p>
                <div className="mt-auto pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-primary-light)] font-medium">
                  Later applied topically to soothe severe radiation burns during Chernobyl recovery.
                </div>
              </div>

              {/* Olympic Endurance */}
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl relative flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-4">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-serif text-white mb-2">Olympic Athletic Stamina</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                  Because of its unique ability to optimize blood oxygen carrying capacity and speed muscle glycogen replenishment, Sea Buckthorn was officially designated as the official sports beverage of the 1992 Olympic Games.
                </p>
                <div className="mt-auto pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-primary-light)] font-medium">
                  Natural cellular stamina without synthetic stimulants or artificial chemicals.
                </div>
              </div>

              {/* High Altitude Operations */}
              <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 rounded-2xl relative flex flex-col">
                <div className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-4">
                  <Mountain className="w-5 h-5" />
                </div>
                <h4 className="text-lg font-bold font-serif text-white mb-2">Mount Everest Operations</h4>
                <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
                  Modern mountaineers scaling Mount Everest and special mountain defense regiments rely on Sea Buckthorn pulp and seed oil softgels to preserve respiratory vitality and mental alertness at 20,000+ feet altitude.
                </p>
                <div className="mt-auto pt-3 border-t border-[var(--color-border)] text-[11px] text-[var(--color-primary-light)] font-medium">
                  Combats extreme hypoxia, dry mucosal tissues, and freezing mountain winds.
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Section 5: Why Is It So Powerful? (The Botanical Breakdown) */}
        <section className="mb-20 sm:mb-28">
          <div className="max-w-4xl mx-auto text-center mb-12 sm:mb-16">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Biochemical Architecture
            </span>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Why Is It So Powerful?
            </h2>
            <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-5" />
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
              To withstand extreme drought, sub-zero winters, glacial salt, and blistering ultraviolet radiation, the Sea Buckthorn shrub produces an extraordinary arsenal of defensive nutrients that translate directly to human wellness:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            
            {/* Rare Omega-7 */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-7 rounded-2xl flex flex-col hover:border-[var(--color-primary)]/70 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2">The Rare Omega-7</h3>
              <div className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                Palmitoleic Acid
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                One of the only known botanical kingdoms to synthesize active Omega-7. Crucial for cellular membrane integrity, mucosal hydration (soothing dry eyes & gut lining), and stimulating healthy collagen dermal matrices.
              </p>
              <div className="mt-auto pt-3 border-t border-[var(--color-border)] text-[10px] text-gray-300 uppercase tracking-widest font-semibold">
                Virtually absent in other plants
              </div>
            </div>

            {/* Unmatched Vitamin C */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-7 rounded-2xl flex flex-col hover:border-[var(--color-primary)]/70 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2">Unmatched Vitamin C</h3>
              <div className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                Up to 100x vs Lemon
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Gram for gram, freshly harvested Himalayan Sea Buckthorn berries deliver up to 100 times more natural Vitamin C than citrus lemons, accompanied by synergistic bioflavonoids that prevent oxidation and dramatically boost human bio-availability.
              </p>
              <div className="mt-auto pt-3 border-t border-[var(--color-border)] text-[10px] text-gray-300 uppercase tracking-widest font-semibold">
                Superior natural absorption
              </div>
            </div>

            {/* 190+ Bioactives */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-7 rounded-2xl flex flex-col hover:border-[var(--color-primary)]/70 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2">190+ Bioactive Nutrients</h3>
              <div className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                Full Omega Profile 3, 6, 9 & 7
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                Supplies Vitamins A, B1, B2, B6, E, and K alongside carotenoids (beta-carotene, lycopene), superoxide dismutase (SOD), quercetin, and 24 essential trace minerals necessary for optimal enzymatic function.
              </p>
              <div className="mt-auto pt-3 border-t border-[var(--color-border)] text-[10px] text-gray-300 uppercase tracking-widest font-semibold">
                Complete botanical spectrum
              </div>
            </div>

            {/* Ecological Healer */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] p-6 sm:p-7 rounded-2xl flex flex-col hover:border-[var(--color-primary)]/70 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] mb-5">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold font-serif text-white mb-2">Ecological Healer</h3>
              <div className="text-[11px] font-semibold text-[var(--color-primary)] uppercase tracking-wider mb-3">
                Pioneer Nitrogen Fixer
              </div>
              <p className="text-xs text-gray-400 leading-relaxed mb-4">
                As a recognized "pioneer plant," Sea Buckthorn actively reverses cold desertification. Its massive deep taproot system pulls atmospheric nitrogen and fixes it directly into rocky earth, enriching barren soil and preventing mountain mudslides.
              </p>
              <div className="mt-auto pt-3 border-t border-[var(--color-border)] text-[10px] text-gray-300 uppercase tracking-widest font-semibold">
                Revitalizes fragile Himalayan soil
              </div>
            </div>

          </div>
        </section>

        {/* Section 6: The Harvest: Earning the Golden Berry */}
        <section className="mb-20 sm:mb-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center max-w-6xl mx-auto">
            
            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden border-2 border-[var(--color-border-gold)] shadow-2xl group">
                <img 
                  src="/images/sea-buckthorn-frost-harvest.jpg" 
                  alt="Wild Sea Buckthorn thorny branches frozen in winter frost in Ladakh mountains" 
                  className="w-full h-[320px] sm:h-[420px] object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent p-5 sm:p-6">
                  <div className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary)]">The Winter Frost Harvest</div>
                  <div className="text-base sm:text-lg font-serif font-bold text-white">Guarded by Thorns, Mastered by Frost</div>
                  <p className="text-xs text-gray-300 mt-1">Harvesters tap frozen branches onto tarps without bursting berries</p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.22em] text-[var(--color-primary)] block mb-2">
                Handcrafted Himalayan Foraging
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-5">
                The Harvest: Earning the Golden Berry
              </h2>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                The very same environmental defenses that allow Sea Buckthorn to thrive in extreme sub-zero weather make harvesting the fruit notoriously difficult. The shrubs are armed with sharp, needle-like thorns, and the delicate, juice-filled berries grow in tight clusters directly against wood bark.
              </p>
              <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
                Because fresh berries burst easily if plucked by fingers, Himalayan foragers and artisanal cultivators utilize two ancient, high-skill harvesting methods:
              </p>

              <div className="space-y-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 font-bold text-white mb-1.5 font-serif text-sm">
                    <Snowflake className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>1. The Winter Shake</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Harvesters wait until the first severe Himalayan winter freezes. Once the berries freeze solid on the branch, foragers sharply tap the thorny boughs, allowing thousands of intact, flash-frozen golden berries to drop cleanly onto clean linen tarps below.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
                  <div className="flex items-center gap-2 font-bold text-white mb-1.5 font-serif text-sm">
                    <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
                    <span>2. The Prune and Freeze</span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    Carefully pruning small fruiting branch tips preserves the health of the mother bush. The branches are immediately flash-frozen at sub-zero temperatures and mechanically vibrated, releasing perfectly intact berries with zero juice degradation.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* Section 7: Experience Himroots Formulations (Product Hyperlinks) */}
        <section className="bg-[var(--color-card)] border border-[var(--color-border-gold)] rounded-3xl p-8 sm:p-12 md:p-16 max-w-5xl mx-auto shadow-2xl text-center">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Pure Trans-Himalayan Purity
          </span>
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
            Experience Wild Himalayan Sea Buckthorn
          </h2>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-10">
            Himroots captures this ancient high-altitude vitality in two unadulterated formulations: raw 500ml unrefined daily drink pulp, and concentrated cold-pressed softgel capsules.
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
                  <span className="text-[10px] uppercase font-bold text-[var(--color-primary)] block">Liquid Botanical Elixir</span>
                  <h4 className="text-base font-bold text-white font-serif">{pulpProduct.name}</h4>
                  <span className="text-xs text-gold-gradient font-black">₹{pulpProduct.price}</span>
                </div>
              </div>
              <p className="text-xs text-gray-300 mb-6 flex-1">
                90% wild Himalayan Sea Buckthorn pulp enriched with 5 Ayurvedic herbs for digestive vigor, liver support, and raw morning vitality.
              </p>
              <Button asChild size="sm" className="w-full bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider">
                <Link to={`/products/${pulpProduct.slug}`}>
                  Explore Pure Pulp <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
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
                Pure seed and berry oil providing the highest natural concentration of Omega-7 for dry eye relief, deep cellular hydration, and skin glow.
              </p>
              <Button asChild size="sm" className="w-full bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider">
                <Link to={`/products/${capsuleProduct.slug}`}>
                  Explore Capsules <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>

          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="w-full sm:w-auto uppercase tracking-widest text-xs font-bold bg-gold-gradient text-black px-8 py-4 sm:py-5">
              <Link to="/shop">View Complete Shop Collection</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto uppercase tracking-widest text-xs font-bold border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 text-white px-8 py-4 sm:py-5">
              <Link to="/about">Our Himalayan Roots Story</Link>
            </Button>
          </div>
        </section>

      </div>
    </div>
  );
}
