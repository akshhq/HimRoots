import { Check, X } from "lucide-react";

export function ComparisonMatrix() {
  const criteria = [
    {
      parameter: "Sourced Direct from Mountain Harvesters",
      himroots: "YES — Hand-gathered by rural women SHGs & cooperatives",
      commercial: "NO — Bought from multi-tier commodity brokers",
    },
    {
      parameter: "Harvest Terroir & Elevation",
      himroots: "12,000+ Ft Trans-Himalayan Sub-Zero Peaks",
      commercial: "Lowland or commercial pesticide monocultures",
    },
    {
      parameter: "Sugar, Syrups & Artificial Fillers",
      himroots: "ZERO Added Sugar — 95% pure raw berry pulp",
      commercial: "Diluted with apple juice, corn syrups & artificial citric acid",
    },
    {
      parameter: "Rare Omega-7 (Palmitoleic Acid) Potency",
      himroots: "Peak Active Concentration — Verified natural lipids",
      commercial: "Stripped or degraded through thermal pasteurization",
    },
    {
      parameter: "Published 3rd-Party Lab Certificates",
      himroots: "YES — Screened for heavy metals, microbials & active bioactives",
      commercial: "Rarely tested; unverified marketing claims",
    },
    {
      parameter: "Fair Living Wage Paid to Growers",
      himroots: "YES — Direct ethical compensation supporting 150+ families",
      commercial: "Suppressed farm-gate margins; industrial exploitation",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-black border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Transparency Benchmark
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
            Why Choose HimRoots?
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            Compare our uncompromising high-altitude standards against conventional commercial alternatives.
          </p>
        </div>

        {/* Comparison Table Container */}
        <div className="rounded-2xl border border-[var(--color-border-gold)]/60 bg-[var(--color-card)] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[var(--color-border-gold)]/40 bg-black/80">
                  <th className="py-5 px-6 text-xs sm:text-sm font-serif font-bold text-gray-300 uppercase tracking-wider w-2/5">
                    Evaluation Parameter
                  </th>
                  <th className="py-5 px-6 text-xs sm:text-sm font-serif font-bold text-black uppercase tracking-wider w-3/10 bg-gold-gradient text-center">
                    HimRoots Standard
                  </th>
                  <th className="py-5 px-6 text-xs sm:text-sm font-serif font-bold text-gray-400 uppercase tracking-wider w-3/10 text-center">
                    Conventional Supermarket Brands
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)] text-xs sm:text-sm">
                {criteria.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="py-4 sm:py-5 px-6 font-medium text-white">
                      {item.parameter}
                    </td>

                    {/* HimRoots Column */}
                    <td className="py-4 sm:py-5 px-6 bg-[var(--color-primary)]/5 border-x border-[var(--color-border-gold)]/20 text-gray-200">
                      <div className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                        <span className="font-semibold text-white">
                          {item.himroots}
                        </span>
                      </div>
                    </td>

                    {/* Conventional Column */}
                    <td className="py-4 sm:py-5 px-6 text-gray-400">
                      <div className="flex items-start gap-2.5">
                        <X className="w-4 h-4 text-red-500/80 flex-shrink-0 mt-0.5" />
                        <span>{item.commercial}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </section>
  );
}
