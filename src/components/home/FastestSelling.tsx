import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, ShoppingBag, Check, ArrowRight, Eye } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { products } from "@/data/products";

export function FastestSelling() {
  const { addItem } = useCartStore();
  const [addedId, setAddedId] = useState<string | null>(null);

  const handleAddToCart = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    addItem(product, 1);
    setAddedId(productId);
    setTimeout(() => setAddedId(null), 2000);
  };

  const starItems = [
    {
      id: "prod_001",
      slug: "sea-buckthorn-pulp",
      name: "Himalayan Sea Buckthorn Juice (Pulp) with Curcumin",
      volume: "500 ml",
      servings: "~25 Servings",
      badge: "SAVE 25%",
      badgeType: "sale",
      rating: 4.8,
      reviewsCount: 1995,
      price: 899,
      originalPrice: 1199,
      imagePrimary: "/images/himroots-sea-buckthorn-pulp.jpg",
      imageSecondary: "/images/pulp-serving-ritual.jpg",
      highlight: "95% Raw Pulp • Natural Omega 3,6,7,9 & Vitamin C",
    },
    {
      id: "prod_002",
      slug: "sea-buckthorn-capsules",
      name: "Himroots Sea Buckthorn Oil Capsules (Omega-7)",
      volume: "60 Softgels",
      servings: "30–60 Days",
      badge: "SAVE 20%",
      badgeType: "luxury",
      rating: 4.9,
      reviewsCount: 1112,
      price: 1199,
      originalPrice: 1499,
      imagePrimary: "/images/himroots-sea-buckthorn-capsules.jpg",
      imageSecondary: "/images/capsules-omega7-cellular.jpg",
      highlight: "Peak Concentration of Rare Omega-7 Palmitoleic Acid",
    },
    {
      id: "prod_003_bundle",
      slug: "sea-buckthorn-pulp",
      name: "Himroots Himalayan Duo: Pulp (500ml) + Capsules (60s)",
      volume: "Complete Ritual Set",
      servings: "Full 30-Day Protocol",
      badge: "SAVE 30%",
      badgeType: "power",
      rating: 4.9,
      reviewsCount: 485,
      price: 1899,
      originalPrice: 2698,
      imagePrimary: "/images/pulp-pack2-bundle.jpg",
      imageSecondary: "/images/capsules-pack2-bundle.jpg",
      highlight: "Inside-Out Synergy: Daily Liquid Sip + Cellular Softgels",
    },
  ];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-black border-b border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Most Loved Himalayan Formulations
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
            Fastest Selling
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            Crafted from high-altitude wild botanicals at 12,000+ feet in Ladakh & Spiti. Tested for peak purity, zero added sugar, and potent bioactivity.
          </p>
        </div>

        {/* 3-Column Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {starItems.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl bg-[var(--color-card)] border border-[var(--color-border-gold)]/60 shadow-2xl overflow-hidden flex flex-col justify-between hover:border-[var(--color-primary)] transition-all duration-300 group"
            >
              {/* Product Visual Container with Secondary Image Hover */}
              <div className="relative overflow-hidden bg-black/50 h-72 sm:h-80 w-full flex-shrink-0 cursor-pointer">
                <Link to={`/products/${item.slug}`}>
                  <img
                    src={item.imagePrimary}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:opacity-0 transition-opacity duration-500 absolute inset-0"
                  />
                  <img
                    src={item.imageSecondary}
                    alt={`${item.name} serving`}
                    className="w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 absolute inset-0"
                  />
                </Link>

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 flex flex-col gap-1.5 z-10 pointer-events-none">
                  <span className="bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)]/80 text-[var(--color-primary-light)] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {item.volume}
                  </span>
                </div>

                <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
                  <span className="bg-[var(--color-accent)]/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    {item.badge}
                  </span>
                </div>
              </div>

              {/* Product Details Content */}
              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                <div>
                  {/* Reviews & Rating */}
                  <div className="flex items-center justify-between mb-2.5">
                    <div className="flex items-center gap-1.5">
                      <div className="flex items-center text-[var(--color-primary)]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-white ml-0.5">{item.rating}</span>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium">
                      ({item.reviewsCount} Reviews)
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-2 group-hover:text-[var(--color-primary)] transition-colors leading-snug">
                    <Link to={`/products/${item.slug}`}>{item.name}</Link>
                  </h3>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-2.5 mb-3">
                    <span className="text-xl sm:text-2xl font-bold text-white font-serif">
                      ₹{item.price}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      ₹{item.originalPrice}
                    </span>
                    <span className="text-[10px] text-[var(--color-primary)] font-semibold uppercase tracking-wider bg-[var(--color-secondary)] px-2 py-0.5 rounded border border-[var(--color-border-gold)]/30">
                      Free Shipping
                    </span>
                  </div>

                  <p className="text-xs text-gray-400 font-light leading-relaxed mb-4">
                    {item.highlight}
                  </p>
                </div>

                {/* Bottom Actions: Add to Cart & View Details */}
                <div className="pt-4 border-t border-[var(--color-border)] flex items-center gap-2.5 mt-auto">
                  <button
                    onClick={(e) => handleAddToCart(e, item.id === "prod_003_bundle" ? "prod_001" : item.id)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-gold-gradient text-black font-bold uppercase text-[11px] tracking-wider flex items-center justify-center gap-1.5 hover:opacity-95 shadow-md shadow-[var(--color-primary)]/10 transition-all"
                  >
                    {addedId === (item.id === "prod_003_bundle" ? "prod_001" : item.id) ? (
                      <>
                        <Check className="w-4 h-4 text-black" />
                        <span>Added to Cart</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 text-black" />
                        <span>Add to Cart</span>
                      </>
                    )}
                  </button>

                  <Link
                    to={`/products/${item.slug}`}
                    aria-label={`View details of ${item.name}`}
                    className="w-10 h-10 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 hover:border-[var(--color-primary)] text-gray-300 hover:text-[var(--color-primary)] flex items-center justify-center transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* View All Shop Link */}
        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] hover:text-[var(--color-primary-light)] transition-colors group"
          >
            <span>Explore All Formulations</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

      </div>
    </section>
  );
}
