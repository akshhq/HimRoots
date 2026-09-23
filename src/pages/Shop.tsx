import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { products } from "@/data/products";
import { Button } from "@/components/ui/Button";

export default function Shop() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || product.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16 pt-8">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Pure Himalayan Botanicals
          </span>
          <h1 className="text-4xl md:text-5xl font-bold font-serif text-white mb-4">Sea Buckthorn Formulations</h1>
          <div className="w-16 h-1 bg-gold-gradient mx-auto mb-6"></div>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm md:text-base">
            Discover our wild-foraged Himalayan Sea Buckthorn collection: unrefined raw berry pulp for daily drinking vitality, and concentrated cold-pressed softgel capsules for cellular rejuvenation.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeCategory === category 
                    ? "bg-[var(--color-primary)] text-black" 
                    : "bg-[var(--color-secondary)] text-gray-400 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-2 pl-10 focus:outline-none focus:border-[var(--color-primary)] transition-colors rounded-md"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
              <div key={product.id} className="group bg-[var(--color-card)] rounded-lg overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all duration-300 shadow-lg flex flex-col">
                <Link to={`/products/${product.slug}`} className="relative h-[320px] overflow-hidden block bg-black/30">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="bg-black/85 text-[var(--color-primary)] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 border border-[var(--color-border-gold)] rounded-full backdrop-blur-md">
                      {product.volume}
                    </span>
                  </div>
                  {product.originalPrice && (
                    <div className="absolute top-3 right-3 bg-[var(--color-accent)] text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                      Save ₹{product.originalPrice - product.price}
                    </div>
                  )}
                </Link>
                <div className="p-6 flex flex-col flex-1">
                  <div className="text-[10px] uppercase tracking-widest text-[var(--color-primary)] mb-1">
                    {product.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2 font-serif text-white">
                    <Link to={`/products/${product.slug}`}>{product.name}</Link>
                  </h3>
                  <div className="mt-auto pt-4 flex flex-col gap-4 border-t border-[var(--color-border)]">
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-gold-gradient">₹{product.price}</span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through text-xs">₹{product.originalPrice}</span>
                      )}
                    </div>
                    <Button asChild className="w-full uppercase text-xs tracking-wider bg-gold-gradient text-black font-bold">
                      <Link to={`/products/${product.slug}`}>View Details</Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-[var(--color-secondary)] rounded-lg border border-[var(--color-border)]">
            <Filter className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or category filter.</p>
            <Button onClick={() => { setSearchTerm(""); setActiveCategory("All"); }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
