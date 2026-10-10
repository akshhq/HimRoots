import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Check, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { products } from "@/data/products";

interface TabProduct {
  id: string;
  category: "all" | "pulp" | "softgels" | "bundles";
  slug: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  discount: string;
  rating: number;
  reviews: number;
  image: string;
  volume: string;
}

export function TabbedCollections() {
  const [activeTab, setActiveTab] = useState<"all" | "pulp" | "softgels" | "bundles">("all");
  const { addItem } = useCartStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const items: TabProduct[] = [
    {
      id: "prod_001",
      category: "pulp",
      slug: "sea-buckthorn-pulp",
      name: "Himalayan Sea Buckthorn Juice (Pulp) with Curcumin",
      subtitle: "Raw unfiltered liquid concentrate wild-harvested at 12,000+ ft in Ladakh.",
      price: 899,
      originalPrice: 1199,
      discount: "SAVE 25%",
      rating: 4.8,
      reviews: 1995,
      image: "/images/himroots-sea-buckthorn-pulp.jpg",
      volume: "500 ml",
    },
    {
      id: "prod_002",
      category: "softgels",
      slug: "sea-buckthorn-capsules",
      name: "Himroots Sea Buckthorn Oil Capsules (Omega-7)",
      subtitle: "100% pure cold-pressed seed & berry oil in vegetarian softgels.",
      price: 1199,
      originalPrice: 1499,
      discount: "SAVE 20%",
      rating: 4.9,
      reviews: 1112,
      image: "/images/himroots-sea-buckthorn-capsules.jpg",
      volume: "60 Softgels",
    },
    {
      id: "prod_003_bundle",
      category: "bundles",
      slug: "sea-buckthorn-pulp",
      name: "Himroots Himalayan Synergy Duo: Pulp + Softgels",
      subtitle: "Complete inside-out 30-day daily cellular vitality protocol.",
      price: 1899,
      originalPrice: 2698,
      discount: "SAVE 30%",
      rating: 4.9,
      reviews: 485,
      image: "/images/pulp-pack2-bundle.jpg",
      volume: "Full Protocol",
    },
    {
      id: "prod_004_pulp_duo",
      category: "pulp",
      slug: "sea-buckthorn-pulp",
      name: "Himalayan Sea Buckthorn Pulp 2-Bottle Pack",
      subtitle: "Double harvest volume for consistent 50-day family vitality sip.",
      price: 1699,
      originalPrice: 2398,
      discount: "SAVE 29%",
      rating: 4.8,
      reviews: 320,
      image: "/images/pulp-pack2-bundle.jpg",
      volume: "1000 ml (2x 500ml)",
    },
  ];

  const filteredItems = activeTab === "all"
    ? items
    : items.filter((item) => item.category === activeTab);

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    const actualProd = products.find((p) => p.id === (productId.includes("bundle") || productId.includes("pulp_duo") ? "prod_001" : productId));
    if (!actualProd) return;

    addItem(actualProd, 1);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 2000);
  };

  const tabs = [
    { id: "all", label: "All Formulations" },
    { id: "pulp", label: "Pure Berry Pulp" },
    { id: "softgels", label: "Omega-7 Softgels" },
    { id: "bundles", label: "Wellness Bundles" },
  ] as const;

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#030303] border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header & Tabs */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Targeted Himalayan Efficacy
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-4">
            Curated Formulations
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-6" />

          {/* Interactive Tab Switcher */}
          <div className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/30 text-xs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2 rounded-xl font-bold uppercase tracking-wider text-[11px] transition-all ${
                  activeTab === tab.id
                    ? "bg-gold-gradient text-black shadow-md shadow-[var(--color-primary)]/10"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/50 overflow-hidden flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group shadow-xl"
            >
              {/* Image Preview */}
              <div className="relative h-56 overflow-hidden bg-black/60">
                <Link to={`/products/${item.slug}`}>
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>

                <div className="absolute top-3 left-3 bg-black/85 px-2.5 py-0.5 rounded-full text-[9px] uppercase font-bold tracking-wider text-[var(--color-primary-light)] border border-white/10">
                  {item.volume}
                </div>

                <div className="absolute top-3 right-3 bg-[var(--color-accent)] px-2 py-0.5 rounded-full text-[9px] uppercase font-bold text-white shadow-sm">
                  {item.discount}
                </div>
              </div>

              {/* Info Body */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center gap-1.5 text-[var(--color-primary)] mb-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-white">{item.rating}</span>
                    <span className="text-[10px] text-gray-500">({item.reviews})</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold font-serif text-white mb-1.5 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                  </h3>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-lg font-bold text-white font-serif">₹{item.price}</span>
                    <span className="text-xs text-gray-500 line-through">₹{item.originalPrice}</span>
                  </div>

                  <p className="text-xs text-gray-400 font-light leading-relaxed line-clamp-2 mb-4">
                    {item.subtitle}
                  </p>
                </div>

                {/* Add to Cart Button */}
                <div className="pt-3 border-t border-[var(--color-border)] flex items-center gap-2 mt-auto">
                  <button
                    onClick={(e) => handleAddToCart(e, item.id)}
                    className="flex-1 py-2 px-3 rounded-xl bg-gold-gradient text-black font-bold uppercase text-[10px] tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 transition-opacity"
                  >
                    {addedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Added</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/products/${item.slug}`}
                    aria-label={`View details of ${item.name}`}
                    className="w-8 h-8 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] text-gray-300 hover:text-[var(--color-primary)] flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
