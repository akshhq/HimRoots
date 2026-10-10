import { useState } from "react";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Quote } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location: string;
  rating: number;
  headline: string;
  story: string;
  productName: string;
  productImage: string;
}

export function VerifiedTestimonials() {
  const reviews: Testimonial[] = [
    {
      id: "rev-1",
      name: "Rohit K.",
      location: "New Delhi",
      rating: 5,
      headline: "Remarkable Morning Energy Surge",
      story:
        "I've replaced commercial multivitamins with 10ml of Himroots Sea Buckthorn pulp diluted in lukewarm water every morning. Within two weeks, my sluggish morning fatigue vanished and my digestion feels completely reset. You can immediately taste the tart, raw unadulterated purity.",
      productName: "Himalayan Sea Buckthorn Juice (Pulp) 500ml",
      productImage: "/images/himroots-sea-buckthorn-pulp.jpg",
    },
    {
      id: "rev-2",
      name: "Dr. Ananya S.",
      location: "Bengaluru",
      rating: 5,
      headline: "Noticeable Skin Barrier Hydration & Glow",
      story:
        "As a dermatologist, I actively looked for a genuine cold-pressed source of rare Omega-7 (palmitoleic acid). Himroots softgels have dramatically helped my dry skin and eye strain from long screen hours. The amber apothecary bottle and lab transparency are exemplary.",
      productName: "Himroots Sea Buckthorn Oil Capsules (60s)",
      productImage: "/images/himroots-sea-buckthorn-capsules.jpg",
    },
    {
      id: "rev-3",
      name: "Vikramaditya P.",
      location: "Chandigarh",
      rating: 5,
      headline: "Finally, A Pure Brand with Zero Sugar",
      story:
        "Every sea buckthorn juice on supermarket shelves is loaded with apple concentrate, synthetic acidity regulators, or syrup. Himroots is 95% pure thick pulp with zero sugar. The combination with standardized curcumin is pure genius for joint recovery after workouts.",
      productName: "Sea Buckthorn Juice (Pulp) with Curcumin",
      productImage: "/images/himroots-sea-buckthorn-pulp.jpg",
    },
    {
      id: "rev-4",
      name: "Divya N.",
      location: "Mumbai",
      rating: 5,
      headline: "Inside-Out Radiance Ritual",
      story:
        "I ordered the Himalayan Duo pack with both the pulp and softgels. My chronic winter dry patches cleared up within 20 days and my skin has a natural golden glow. Love knowing it directly supports Ladakhi foraging communities at 12,000+ feet.",
      productName: "Himroots Himalayan Synergy Duo Pack",
      productImage: "/images/pulp-pack2-bundle.jpg",
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  const prevReview = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  const nextReview = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#050505] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Real Experiences & Health Outcomes
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white">
              Verified Customer Reviews
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevReview}
              aria-label="Previous review"
              className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] text-gray-300 hover:text-[var(--color-primary)] flex items-center justify-center transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextReview}
              aria-label="Next review"
              className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] text-gray-300 hover:text-[var(--color-primary)] flex items-center justify-center transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 2 Review Cards Side-by-Side on Desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {[
            reviews[activeIndex],
            reviews[(activeIndex + 1) % reviews.length],
          ].map((item) => (
            <div
              key={item.id}
              className="rounded-2xl p-6 sm:p-8 bg-[var(--color-card)] border border-[var(--color-border-gold)]/50 shadow-2xl flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group relative"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-[var(--color-primary)]/10 pointer-events-none" />

              <div>
                {/* 5-Stars & Verified Tag */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-[var(--color-primary)]">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-green-400 bg-green-950/40 px-2.5 py-0.5 rounded-full border border-green-800/40">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Buyer</span>
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-3 group-hover:text-[var(--color-primary)] transition-colors">
                  "{item.headline}"
                </h3>

                {/* Review Story */}
                <p className="text-xs sm:text-sm text-gray-300 font-light leading-relaxed mb-6">
                  {item.story}
                </p>
              </div>

              {/* Bottom Customer Info & Product Thumbnail */}
              <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between gap-4 mt-auto">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gold-gradient text-black font-bold flex items-center justify-center font-serif text-sm">
                    {item.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-tight">
                      {item.name}
                    </h4>
                    <span className="text-[11px] text-gray-400 font-mono">
                      {item.location}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 max-w-[180px] text-right">
                  <span className="text-[10px] text-gray-400 truncate hidden sm:inline">
                    {item.productName}
                  </span>
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-10 h-10 rounded-lg object-cover bg-black/60 border border-[var(--color-border-gold)]/40 flex-shrink-0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
