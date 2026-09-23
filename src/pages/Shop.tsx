import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Check, ShoppingBag, ShieldCheck, Truck, Sparkles, ArrowRight } from "lucide-react";
import { products } from "@/data/products";
import { Button } from "@/components/ui/Button";
import { useCartStore } from "@/store/cartStore";

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const { addItem } = useCartStore();

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-10 sm:py-16 md:py-20 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header — No redundant logo per single-logo rule */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-20">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3 block">
            Pure Himalayan Botanicals
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-4 sm:mb-6">
            Sea Buckthorn <span className="text-gold-gradient">Formulations</span>
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4 sm:mb-6" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Discover our wild-foraged Himalayan Sea Buckthorn collection: unrefined raw berry pulp for daily drinking vitality, and concentrated cold-pressed softgel capsules for cellular rejuvenation.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-5xl mx-auto">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs uppercase tracking-wider font-semibold rounded-lg transition-all ${
                  activeCategory === category 
                    ? "bg-gold-gradient text-black shadow-md shadow-[var(--color-primary)]/20" 
                    : "bg-[var(--color-card)] text-gray-300 hover:text-white border border-[var(--color-border)]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search formulations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--color-card)] border border-[var(--color-border)] text-white px-4 py-2.5 pl-10 focus:outline-none focus:border-[var(--color-primary)] transition-colors rounded-lg text-sm"
            />
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Product Grid: 2 Flagship Formulations Showcase */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 max-w-5xl mx-auto mb-16 sm:mb-20">
            {filteredProducts.map(product => (
              <div 
                key={product.id} 
                className="group bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border-gold)] hover:border-[var(--color-primary)] transition-all duration-300 shadow-2xl flex flex-col"
              >
                <Link to={`/products/${product.slug}`} className="relative h-[260px] sm:h-[340px] md:h-[380px] overflow-hidden block bg-black/40">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <span className="bg-black/85 text-[var(--color-primary)] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2.5 sm:px-3 py-1 sm:py-1.5 border border-[var(--color-border-gold)] rounded-full backdrop-blur-md">
                      {product.volume}
                    </span>
                  </div>
                  {product.originalPrice && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4 bg-[var(--color-accent)] text-white text-[10px] sm:text-xs font-bold px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                      Save ₹{product.originalPrice - product.price}
                    </div>
                  )}
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)] p-2.5 sm:p-3 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium truncate mr-2">{product.tagline}</span>
                    <span className="text-[var(--color-primary)] font-bold flex-shrink-0">★ {product.rating}</span>
                  </div>
                </Link>

                <div className="p-5 sm:p-8 flex flex-col flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] mb-1 sm:mb-2 font-bold">
                    {product.category}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 font-serif text-white">
                    <Link to={`/products/${product.slug}`}>{product.name}</Link>
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4 sm:mb-6 line-clamp-3">
                    {product.description}
                  </p>

                  <div className="space-y-2 mb-6 sm:mb-8 text-xs text-gray-300">
                    {product.benefits.slice(0, 3).map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-[var(--color-primary)] flex-shrink-0" />
                        <span className="text-[11px] sm:text-xs">{benefit}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto pt-5 sm:pt-6 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex sm:flex-col items-baseline sm:items-start justify-between sm:justify-start">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gold-gradient">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-gray-500 line-through text-xs">₹{product.originalPrice}</span>
                        )}
                      </div>
                      <span className="text-[10px] text-gray-400 block mt-0.5">Free Shipping Across India</span>
                    </div>

                    <div className="flex items-center gap-2.5 w-full sm:w-auto">
                      <Button 
                        size="sm"
                        onClick={() => addItem(product, 1)}
                        className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-4 py-2.5 flex items-center justify-center gap-1.5 flex-1 sm:flex-initial"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add
                      </Button>
                      <Button 
                        asChild 
                        variant="outline"
                        size="sm" 
                        className="uppercase text-xs tracking-wider border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 text-white px-4 py-2.5 flex-1 sm:flex-initial text-center"
                      >
                        <Link to={`/products/${product.slug}`}>Details</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] max-w-2xl mx-auto mb-20">
            <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold font-serif text-white mb-2">No formulations found</h3>
            <p className="text-gray-400 text-sm mb-6">Try clearing your search query or filter selection.</p>
            <Button 
              onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}
              className="bg-gold-gradient text-black font-bold uppercase text-xs"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Editorial Guide Banner */}
        <div className="max-w-5xl mx-auto mb-14 p-5 sm:p-8 rounded-2xl bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-card)] to-[var(--color-secondary)] border border-[var(--color-border-gold)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[var(--color-primary)]/15 border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
              <Sparkles className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block mb-0.5">
                Botanical Monograph
              </span>
              <h3 className="text-base sm:text-lg font-serif font-bold text-white mb-1">
                Curious why Sea Buckthorn is called the "Holy Fruit"?
              </h3>
              <p className="text-xs text-gray-400 max-w-xl">
                Read about the Pegasus legend, Genghis Khan's cavalry rations, Soviet cosmonaut space diets, and rare Omega-7 science in our definitive guide.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="border-[var(--color-border-gold)] text-white hover:text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10 text-xs font-bold uppercase tracking-wider shrink-0 w-full md:w-auto">
            <Link to="/about-sea-buckthorn">
              About Sea Buckthorn <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </Button>
        </div>

        {/* Quality Assurances Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto pt-8 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <ShieldCheck className="w-6 h-6 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">100% Wild Sourced</div>
              <div className="text-[11px] text-gray-400">Zero synthetic agrochemicals</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <Truck className="w-6 h-6 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Free Express Shipping</div>
              <div className="text-[11px] text-gray-400">Insured delivery across India</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <Sparkles className="w-6 h-6 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Highest Active Density</div>
              <div className="text-[11px] text-gray-400">190+ bioactives & Omega-7</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
