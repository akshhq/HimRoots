import { Link } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  readTime: string;
  date: string;
  category: string;
  image: string;
  link: string;
}

export function LatestJournal() {
  const articles: Article[] = [
    {
      id: "art-1",
      title: "The Science of Rare Omega-7: How Palmitoleic Acid Rejuvenates Mucosal Barriers",
      excerpt:
        "Understand why Omega-7 is the body's secret structural lipid, hydrating deep cellular tissues, soothing dry eyes, and rejuvenating the skin barrier from within.",
      readTime: "3 min read",
      date: "October 2026",
      category: "Cellular Nutrition",
      image: "/images/pulp-omega-profile.jpg",
      link: "/about-sea-buckthorn",
    },
    {
      id: "art-2",
      title: "How to Take Raw Sea Buckthorn Pulp: The Morning Empty-Stomach Water Ritual",
      excerpt:
        "A practical guide to bio-absorption, optimal morning dilution ratios, and combining raw unheated honey for the ultimate natural daily wellness ritual.",
      readTime: "2 min read",
      date: "September 2026",
      category: "Daily Rituals",
      image: "/images/pulp-daily-ritual-guide.jpg",
      link: "/about-sea-buckthorn",
    },
    {
      id: "art-3",
      title: "Spiti & Ladakh Terroir: Why Sub-Zero Cold Deserts Yield 12× More Vitamin C",
      excerpt:
        "Exploring how harsh UV radiation and -30°C winter frost trigger an extraordinary survival response in wild thorny Hippophae rhamnoides bushes.",
      readTime: "4 min read",
      date: "August 2026",
      category: "Terroir Science",
      image: "/images/sea-buckthorn-frost-harvest.jpg",
      link: "/about",
    },
    {
      id: "art-4",
      title: "Sowa-Rigpa & Himalayan Folk Medicine: The Sacred History of the Golden Berry",
      excerpt:
        "Ancient Tibetan texts revered this thorny plant as a vital restorer of digestive fire (Drod) and lung stamina across high mountain passes.",
      readTime: "3 min read",
      date: "July 2026",
      category: "Heritage & Culture",
      image: "/images/hippophae-pegasus-mythology.jpg",
      link: "/about",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-black border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12 sm:mb-14">
          <div>
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Editorial Science & Terroir
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white">
              Himalayan Wellness Journal
            </h2>
          </div>

          <Link
            to="/about-sea-buckthorn"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors group"
          >
            <span>Explore All Research</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 4 Article Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {articles.map((art) => (
            <Link
              key={art.id}
              to={art.link}
              className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/50 overflow-hidden flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group shadow-xl"
            >
              <div>
                {/* Visual Header */}
                <div className="relative h-44 overflow-hidden bg-black/60">
                  <img
                    src={art.image}
                    alt={art.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider text-[var(--color-primary)] border border-white/10">
                    {art.category}
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-5">
                  <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono mb-2">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[var(--color-primary)]" />
                      <span>{art.readTime}</span>
                    </span>
                    <span>•</span>
                    <span>{art.date}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-serif text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug line-clamp-2">
                    {art.title}
                  </h3>

                  <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-3">
                    {art.excerpt}
                  </p>
                </div>
              </div>

              {/* Bottom Read Link */}
              <div className="px-5 pb-5 pt-2 flex items-center justify-between text-xs font-semibold text-[var(--color-primary)] group-hover:translate-x-0.5 transition-transform">
                <span>Read Research</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
