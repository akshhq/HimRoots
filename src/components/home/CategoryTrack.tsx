import { useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Droplets, Sparkles, Sun, ShieldCheck, Flame } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  subtitle: string;
  themeClass: string;
  icon: typeof Droplets;
  accentText: string;
  image: string;
  link: string;
}

export function CategoryTrack() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const categories: CategoryItem[] = [
    {
      id: "cat-pulp",
      name: "Pure Pulp & Juice",
      subtitle: "Unfiltered Raw Concentrate",
      themeClass: "card-theme-berry",
      icon: Sun,
      accentText: "95% Berry Pulp",
      image: "/images/himroots-sea-buckthorn-pulp.jpg",
      link: "/products/sea-buckthorn-pulp",
    },
    {
      id: "cat-oil",
      name: "Cold-Pressed Oil",
      subtitle: "Pure Seed & Berry Lipids",
      themeClass: "card-theme-amber",
      icon: Droplets,
      accentText: "Rare Omega-7",
      image: "/images/pulp-omega-profile.jpg",
      link: "/products/sea-buckthorn-capsules",
    },
    {
      id: "cat-supplements",
      name: "Daily Softgels",
      subtitle: "Cellular Hydration Ritual",
      themeClass: "card-theme-gold",
      icon: Sparkles,
      accentText: "60 Softgels",
      image: "/images/himroots-sea-buckthorn-capsules.jpg",
      link: "/products/sea-buckthorn-capsules",
    },
    {
      id: "cat-tisanes",
      name: "Herbal Mountain Teas",
      subtitle: "High-Altitude Leaf Infusions",
      themeClass: "card-theme-forest",
      icon: ShieldCheck,
      accentText: "Alpine Botanical",
      image: "/images/sea-buckthorn-frost-harvest.jpg",
      link: "/shop",
    },
    {
      id: "cat-berries",
      name: "Sun-Dried Berries",
      subtitle: "Whole High-Altitude Harvest",
      themeClass: "card-theme-terracotta",
      icon: Flame,
      accentText: "Raw Superfruit",
      image: "/images/himroots-harvest-berries.jpg",
      link: "/shop",
    },
    {
      id: "cat-bundles",
      name: "Wellness Bundles",
      subtitle: "Synergistic Health Packs",
      themeClass: "card-theme-slate",
      icon: Sparkles,
      accentText: "Curated Sets",
      image: "/images/pulp-pack2-bundle.jpg",
      link: "/shop",
    },
  ];

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="py-14 sm:py-18 bg-[#040404] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header & Controls */}
        <div className="flex items-end justify-between mb-8 sm:mb-10">
          <div>
            <span className="text-[var(--color-primary)] text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] mb-1.5 block">
              Curated Harvest Collections
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white">
              Shop By Category
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] text-gray-300 hover:text-[var(--color-primary)] flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] text-gray-300 hover:text-[var(--color-primary)] flex items-center justify-center transition-colors shadow-sm"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Horizontal Track */}
        <div
          ref={scrollRef}
          className="flex items-stretch gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((cat) => {
            const IconComp = cat.icon;
            return (
              <Link
                key={cat.id}
                to={cat.link}
                className={`flex-shrink-0 w-[240px] sm:w-[270px] rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 group cursor-pointer snap-start ${cat.themeClass}`}
              >
                <div>
                  {/* Top Badge & Icon */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--color-primary-light)] bg-black/60 px-2.5 py-1 rounded-full border border-white/10">
                      {cat.accentText}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-black/60 border border-[var(--color-border-gold)]/30 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  {/* Thumbnail Image */}
                  <div className="relative rounded-xl overflow-hidden h-36 w-full mb-3.5 bg-black/50 border border-white/5">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  </div>

                  {/* Titles */}
                  <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-gray-400 font-light leading-snug">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Bottom Action Hint */}
                <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] font-semibold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                  <span>Explore Harvest</span>
                  <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
