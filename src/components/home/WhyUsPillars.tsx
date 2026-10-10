import { Mountain, Users, Eye, FlaskConical } from "lucide-react";

export function WhyUsPillars() {
  const pillars = [
    {
      id: "pure",
      title: "Pure",
      subtitle: "100% Wild Botanicals",
      icon: Mountain,
      description:
        "Sourced from the pristine peaks of the Himalayas at 12,000+ feet, unadulterated and untouched by chemical fertilizers or factory processing — exactly the way nature intended.",
    },
    {
      id: "authentic",
      title: "Authentic",
      subtitle: "Traditional Heritage",
      icon: Users,
      description:
        "We bring you what mountain locals and Sowa-Rigpa herbal practitioners have used for centuries — zero commercial dilution, no synthetic concentrates, and no shortcuts.",
    },
    {
      id: "transparency",
      title: "Transparency",
      subtitle: "Source to Shelf",
      description:
        "From high-altitude berry harvest in Ladakh to your morning ritual cup, we show you every detail — because genuine wellness and consumer trust aren't built on secrets.",
      icon: Eye,
    },
    {
      id: "lab-tested",
      title: "Lab Tested",
      subtitle: "Verified Science",
      icon: FlaskConical,
      description:
        "Every production batch undergoes independent accredited laboratory testing for heavy metals, microbial safety, and active Omega-7 potency — purity you can verify, not just believe.",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#040404] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Our Uncompromising Standard
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
            Why Us?
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            Built on four unshakeable pillars connecting raw Himalayan terrain with modern laboratory verification.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {pillars.map((pillar) => {
            const IconComp = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="p-6 sm:p-7 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/60 flex flex-col justify-between shadow-xl hover:border-[var(--color-primary)] transition-all duration-300 group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 flex items-center justify-center text-[var(--color-primary)] group-hover:scale-110 group-hover:border-[var(--color-primary)] transition-all mb-5">
                    <IconComp className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-bold font-serif text-white mb-1 group-hover:text-[var(--color-primary)] transition-colors">
                    {pillar.title}
                  </h3>

                  <span className="text-xs font-medium text-[var(--color-primary-light)] block mb-3 uppercase tracking-wider">
                    {pillar.subtitle}
                  </span>

                  <p className="text-xs sm:text-sm text-gray-400 font-light leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
