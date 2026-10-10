import { ShieldCheck, ArrowRight } from "lucide-react";

export function PressAndAccreditations() {
  const pressArticles = [
    {
      publisher: "The Himalayan Journal",
      headline: "How HimRoots Is Revitalizing Trans-Himalayan Goldenberry Harvesting in Ladakh",
      readTime: "3 min read",
    },
    {
      publisher: "Indian Wellness Review",
      headline: "The Science of High-Altitude Omega-7: Why 12,000+ Ft Terroir Matters",
      readTime: "2 min read",
    },
    {
      publisher: "Sustainable India",
      headline: "Empowering Rural Women Collectives Across Spiti Valley Through Direct Ethical Trade",
      readTime: "4 min read",
    },
    {
      publisher: "Pure Food Chronicles",
      headline: "Zero Added Sugar, 190+ Bioactives: Breaking Down HimRoots Raw Unfiltered Pulp",
      readTime: "2 min read",
    },
  ];

  const certifications = [
    { label: "FSSAI Licensed", sub: "Central Food Safety Authority" },
    { label: "cGMP Certified", sub: "Current Good Manufacturing Practices" },
    { label: "100% Cold-Pressed", sub: "Zero Thermal Degradation" },
    { label: "Heavy Metal Screened", sub: "Independent ISO/NABL Lab Verified" },
    { label: "Zero Added Sugar", sub: "100% Pure Raw Botanical Pulp" },
    { label: "Non-GMO & Vegan", sub: "Ethically Wild-Harvested" },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#040404] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Quality Certifications Grid */}
        <div className="mb-14 pb-12 border-b border-[var(--color-border-gold)]/30">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-1.5 block">
              Certified Safety & Regulatory Compliance
            </span>
            <h3 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white">
              Institutional Quality Accreditations
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {certifications.map((cert, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-black/60 border border-[var(--color-border-gold)]/40 flex flex-col items-center text-center hover:border-[var(--color-primary)] transition-all group"
              >
                <div className="w-8 h-8 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/30 flex items-center justify-center text-[var(--color-primary)] mb-2.5 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="text-xs font-bold text-white mb-0.5 leading-tight">
                  {cert.label}
                </h4>
                <span className="text-[10px] text-gray-400 font-light leading-tight">
                  {cert.sub}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Media & Press Section */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-1.5 block">
                Editorial Mentions
              </span>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                In The Press
              </h3>
            </div>
            <span className="text-xs text-gray-400 font-mono">
              Independent Editorial Coverage
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {pressArticles.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/40 flex flex-col justify-between hover:border-[var(--color-primary)] transition-all group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--color-primary-light)] mb-2.5 font-bold uppercase tracking-wider">
                    <span>{item.publisher}</span>
                    <span className="text-gray-500">{item.readTime}</span>
                  </div>

                  <h4 className="text-sm font-serif font-bold text-white group-hover:text-[var(--color-primary)] transition-colors leading-snug mb-3">
                    "{item.headline}"
                  </h4>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-semibold text-[var(--color-primary)] group-hover:translate-x-1 transition-transform">
                  <span>Read Feature</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
