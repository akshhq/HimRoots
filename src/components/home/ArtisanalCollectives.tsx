import { Link } from "react-router-dom";
import { Users, ArrowRight, ShieldCheck } from "lucide-react";

interface Collective {
  id: string;
  name: string;
  valley: string;
  elevation: string;
  harvestersCount: string;
  specialty: string;
  image: string;
  link: string;
}

export function ArtisanalCollectives() {
  const collectives: Collective[] = [
    {
      id: "ladakh-shg",
      name: "Ladakh High-Altitude Women's SHG",
      valley: "Leh & Nubra Valley",
      elevation: "11,500+ Ft",
      harvestersCount: "52 Indigenous Women Foragers",
      specialty: "Sub-zero wild thorny sea buckthorn berry harvesting & hand-sorting",
      image: "/images/himroots-harvest-berries.jpg",
      link: "/about",
    },
    {
      id: "spiti-coop",
      name: "Spiti Valley Bio-Reserve Cooperative",
      valley: "Kaza & Tabo Basin",
      elevation: "12,500+ Ft",
      harvestersCount: "48 Traditional Mountain Harvesters",
      specialty: "Cold-pressed seed extraction & unheated single-floral alpine honeys",
      image: "/images/himalayan-harvest.jpg",
      link: "/about",
    },
    {
      id: "kinnaur-guild",
      name: "Upper Sutlej Alpine Foragers Guild",
      valley: "Kinnaur High River Valleys",
      elevation: "9,500+ Ft",
      harvestersCount: "34 Forager Families",
      specialty: "Wild chilgoza pine nuts, high-curcumin rhizomes & medicinal forest herbs",
      image: "/images/sea-buckthorn-frost-harvest.jpg",
      link: "/about",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#050505] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Direct Fair-Trade Partnerships
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
            Our Mountain Foraging Collectives
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            We work directly with self-help groups and indigenous foraging families across high Himalayan valleys, guaranteeing fair living wages and preserving ancient ecological knowledge.
          </p>
        </div>

        {/* 3-Column Cooperative Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {collectives.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/50 overflow-hidden flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group shadow-2xl"
            >
              <div>
                {/* Media Box */}
                <div className="relative h-56 overflow-hidden bg-black/60">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Elevation Badge */}
                  <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-mono text-[var(--color-primary)] border border-white/10 font-bold">
                    {item.elevation}
                  </div>

                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="text-[10px] text-gray-300 font-mono uppercase tracking-wider block">
                      {item.valley}
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>

                {/* Info Content */}
                <div className="p-5 sm:p-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[var(--color-primary-light)] mb-2">
                    <Users className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    <span>{item.harvestersCount}</span>
                  </div>

                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                    {item.specialty}
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div className="px-5 sm:px-6 pb-5 pt-2 border-t border-[var(--color-border)] flex items-center justify-between text-xs font-semibold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                <Link to={item.link} className="inline-flex items-center gap-1.5">
                  <span>Explore Collective Sourcing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <ShieldCheck className="w-4 h-4 text-green-500/70" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
