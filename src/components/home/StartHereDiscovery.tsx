import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Droplets, Sun, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function StartHereDiscovery() {
  const steps = [
    {
      step: "01",
      goal: "Choose Your Wellness Focus",
      title: "Liquid Vitality vs. Targeted Softgels",
      description:
        "If you want total body immunity and morning energy, start with the raw Liquid Pulp. For intense skin barrier hydration and mucosal comfort, choose the Cold-Pressed Softgels.",
      icon: Sun,
    },
    {
      step: "02",
      goal: "The 30-Day Himalayan Protocol",
      title: "Cumulative Botanical Bioactivity",
      description:
        "Wild Himalayan sea buckthorn works synergistically with your cellular lipids. Consistency over 3 to 4 weeks triggers profound skin luminosity, digestive soothe, and cellular resilience.",
      icon: Droplets,
    },
    {
      step: "03",
      goal: "Simple Morning Water Ritual",
      title: "Empty Stomach Bio-Absorption",
      description:
        "Simply dilute 10ml of raw pulp in 200ml of ambient water first thing upon waking. Zero added sugar, naturally tart, and immediately bioavailable.",
      icon: Sparkles,
    },
  ];

  return (
    <section className="py-16 sm:py-20 bg-[#060606] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        <div className="rounded-2xl bg-gradient-to-br from-[#0c0a07] to-[#040404] border border-[var(--color-border-gold)]/60 p-6 sm:p-10 lg:p-12 shadow-2xl relative overflow-hidden">
          
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-primary)]/5 rounded-full blur-3xl pointer-events-none" />

          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-14 relative z-10">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              First-Time Visitor Guide
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white mb-3">
              New to HimRoots? Start Here
            </h2>
            <div className="w-16 h-1 bg-gold-gradient mx-auto mb-4" />
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
              Experience why wild-foraged 12,000+ ft Sea Buckthorn is revered as the ultimate longevity elixir. Follow our simple newcomer roadmap.
            </p>
          </div>

          {/* 3 Step Onboarding Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 relative z-10">
            {steps.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-xl bg-black/60 border border-[var(--color-border-gold)]/30 flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-2xl font-bold text-gold-gradient">
                        {item.step}
                      </span>
                      <div className="w-8 h-8 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/30 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 transition-transform">
                        <IconComp className="w-4 h-4" />
                      </div>
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-primary-light)] block mb-1.5">
                      {item.goal}
                    </span>

                    <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                      {item.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Fast Action Banner */}
          <div className="pt-6 border-t border-[var(--color-border-gold)]/30 flex flex-col sm:flex-row items-center justify-between gap-4 relative z-10 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
              <span className="text-xs sm:text-sm text-gray-200 font-medium">
                100% Satisfaction Guarantee • Third-Party Lab Tested for Purity & Heavy Metal Safety
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                asChild
                className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-6 py-2.5 rounded-xl hover:opacity-95 shadow-md shadow-[var(--color-primary)]/10"
              >
                <Link to="/products/sea-buckthorn-pulp" className="inline-flex items-center gap-2">
                  <span>Start with Pure Pulp</span>
                  <ArrowRight className="w-3.5 h-3.5 text-black" />
                </Link>
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
