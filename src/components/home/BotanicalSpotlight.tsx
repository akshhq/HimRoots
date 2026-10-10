import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, Droplets, Sun, Mountain, ShieldCheck, HeartPulse } from "lucide-react";

interface BotanicalItem {
  id: string;
  name: string;
  botanicalName: string;
  origin: string;
  accentColor: string;
  tag: string;
  description: string;
  icon: typeof Sun;
  link: string;
}

export function BotanicalSpotlight() {
  const botanicals: BotanicalItem[] = [
    {
      id: "bot-sbt",
      name: "Wild Sea Buckthorn",
      botanicalName: "Hippophae Rhamnoides",
      origin: "Ladakh & Spiti (12,000+ Ft)",
      accentColor: "border-[var(--color-accent)]/50",
      tag: "Flagship Superfruit",
      description: "12× Vitamin C of oranges, full-spectrum Omegas 3, 6, 7 & 9, and 190+ bioactive nutrients for cellular vitality.",
      icon: Sun,
      link: "/products/sea-buckthorn-pulp",
    },
    {
      id: "bot-curcumin",
      name: "Standardized Curcumin",
      botanicalName: "Curcuma Longa (95%)",
      origin: "High-Curcumin Terroir",
      accentColor: "border-amber-500/50",
      tag: "Active Curcuminoids",
      description: "Standardized extract delivering targeted antioxidant defense, amplified by natural sea buckthorn lipids.",
      icon: HeartPulse,
      link: "/products/sea-buckthorn-pulp",
    },
    {
      id: "bot-shilajit",
      name: "Purified Himalayan Shilajit",
      botanicalName: "Asphaltum Punjabianum",
      origin: "High-Altitude Rock Fissures",
      accentColor: "border-[var(--color-primary)]/50",
      tag: "Fulvic Acid Matrix",
      description: "Natural mineral pitch hand-purified with traditional Surya-Tapi method for stamina and cellular energy.",
      icon: Mountain,
      link: "/shop",
    },
    {
      id: "bot-saffron",
      name: "Mongra Kashmiri Saffron",
      botanicalName: "Crocus Sativus",
      origin: "Pampore Alluvial Valleys",
      accentColor: "border-red-500/50",
      tag: "Grade-1 Filaments",
      description: "Accredited lab-tested crimson filaments rich in natural crocin, safranal, and mood-lifting antioxidants.",
      icon: Sparkles,
      link: "/shop",
    },
    {
      id: "bot-lavender",
      name: "Mountain Chamomile & Lavender",
      botanicalName: "Matricaria & Lavandula",
      origin: "Alpine Foothills & High Valleys",
      accentColor: "border-purple-500/50",
      tag: "Calming Terpenes",
      description: "Sun-cured floral blossoms and steam-distilled essential oils supporting restorative sleep and nervous balance.",
      icon: Droplets,
      link: "/shop",
    },
    {
      id: "bot-honey",
      name: "Trans-Himalayan Raw Honey",
      botanicalName: "Apis Cerana & Rock Bee",
      origin: "Wild Forest Canopies",
      accentColor: "border-yellow-600/50",
      tag: "Unheated & Raw",
      description: "Never pasteurized or ultra-filtered, preserving active enzymes, pollen grains, and medicinal mountain nectar.",
      icon: ShieldCheck,
      link: "/shop",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-black border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Pure Botanical Harvest
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
            This Season Spotlight
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            Six raw, unadulterated high-altitude specimens celebrated in ancient Himalayan healing and verified by contemporary nutritional science.
          </p>
        </div>

        {/* 6-Card Botanical Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {botanicals.map((bot) => {
            const IconComp = bot.icon;
            return (
              <div
                key={bot.id}
                className={`rounded-2xl p-6 bg-[var(--color-card)] border ${bot.accentColor} flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group shadow-xl`}
              >
                <div>
                  {/* Top Category Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-light)] bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                      {bot.tag}
                    </span>
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                      <IconComp className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Botanical Names */}
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-0.5 group-hover:text-[var(--color-primary)] transition-colors">
                    {bot.name}
                  </h3>
                  <span className="text-xs italic text-[var(--color-primary-light)] block mb-2 font-serif">
                    {bot.botanicalName}
                  </span>

                  <span className="text-[10px] text-gray-400 font-mono block mb-3 uppercase tracking-wider">
                    {bot.origin}
                  </span>

                  <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-4">
                    {bot.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-semibold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                  <Link to={bot.link} className="inline-flex items-center gap-1.5">
                    <span>Explore Formulation</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
