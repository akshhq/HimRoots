import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductBySlug } from "@/data/products";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Star, ShieldCheck, Truck, Package, ArrowLeft, CheckCircle2 } from "lucide-react";

export default function ProductDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || "");
  const { addItem } = useCartStore();
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [activeTab, setActiveTab] = useState<"ingredients" | "benefits" | "usage" | "packaging">("ingredients");

  if (!product) {
    return (
      <div className="container py-32 text-center">
        <h1 className="text-3xl font-bold mb-4 font-serif text-white">Product Not Found</h1>
        <p className="text-gray-400 mb-8">The product you are looking for does not exist or has been removed.</p>
        <Button asChild className="bg-gold-gradient text-black font-bold">
          <Link to="/shop">Back to Shop</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const handleBuyNow = () => {
    addItem(product, quantity);
    navigate("/checkout");
  };

  return (
    <div className="py-12 md:py-20 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Navigation Breadcrumb */}
        <Link 
          to="/shop" 
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Himalayan Collection
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
          
          {/* Image Gallery */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            <div className="relative w-full h-[450px] md:h-[580px] bg-[var(--color-card)] rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-2xl flex items-center justify-center p-4">
              <img 
                src={product.images[activeImage]} 
                alt={product.name} 
                className="w-full h-full object-contain md:object-cover rounded-xl"
              />
              
              {/* Volume tag */}
              <div className="absolute top-4 left-4 bg-black/85 backdrop-blur-md border border-[var(--color-border-gold)] text-[var(--color-primary)] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest">
                Net Volume: {product.volume}
              </div>

              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-[var(--color-accent)] text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  Save ₹{product.originalPrice - product.price}
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(idx)}
                    className={`w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all p-1 bg-[var(--color-card)] ${
                      activeImage === idx 
                        ? "border-[var(--color-primary)] shadow-lg shadow-[var(--color-primary)]/20" 
                        : "border-[var(--color-border)] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover rounded-lg" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:col-span-6 flex flex-col">
            
            {/* Tagline */}
            {product.scriptQuote && (
              <div className="font-tagline text-base sm:text-lg font-medium tracking-[0.14em] uppercase text-[var(--color-primary-light)] mb-2">
                {product.scriptQuote}
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <span className="text-[var(--color-primary)] text-xs tracking-[0.2em] uppercase font-bold">
                {product.category}
              </span>
              <span className="text-gray-600">•</span>
              <div className="flex items-center gap-1 text-[var(--color-primary)] text-xs font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>{product.rating} ({product.reviews} customer reviews)</span>
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold mb-3 font-serif text-white">{product.name}</h1>
            <p className="text-sm font-medium text-[var(--color-primary-light)] tracking-wide mb-6">
              {product.tagline}
            </p>
            
            {/* Price section */}
            <div className="flex items-baseline gap-4 mb-6 pb-6 border-b border-[var(--color-border)]">
              <span className="text-3xl md:text-4xl font-black text-gold-gradient">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
              <span className="text-xs text-gray-400">Inclusive of all taxes & free shipping across India</span>
            </div>

            <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
              {product.description}
            </p>

            {/* Certifications badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8">
              {product.certifications.map((cert, idx) => (
                <div key={idx} className="bg-[var(--color-card)] border border-[var(--color-border)] py-2 px-3 rounded-lg text-center">
                  <span className="text-[11px] font-semibold text-white uppercase tracking-wider block">
                    {cert}
                  </span>
                </div>
              ))}
            </div>

            {/* Quantity Selector */}
            <div className="mb-8 flex items-center gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Quantity
                </label>
                <div className="flex items-center border border-[var(--color-border-gold)] rounded-lg overflow-hidden bg-[var(--color-card)]">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[var(--color-muted)] transition-colors text-lg"
                  >
                    -
                  </button>
                  <input 
                    type="number" 
                    value={quantity}
                    readOnly
                    className="w-12 h-11 text-center bg-transparent text-white font-bold focus:outline-none"
                  />
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-11 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[var(--color-muted)] transition-colors text-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex-1">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                  Bottle Size
                </label>
                <div className="inline-block py-2.5 px-4 rounded-lg bg-[var(--color-card)] border border-[var(--color-border-gold)] text-white text-xs font-bold uppercase tracking-wider">
                  {product.volume} (Standard Size)
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Button 
                size="lg" 
                onClick={handleAddToCart} 
                className="flex-1 uppercase tracking-widest text-xs font-bold bg-gold-gradient text-black hover:opacity-95 shadow-lg shadow-[var(--color-primary)]/20 h-13"
              >
                Add to Cart
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                onClick={handleBuyNow} 
                className="flex-1 uppercase tracking-widest text-xs font-bold border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 text-white h-13"
              >
                Buy Now
              </Button>
            </div>

            {/* Guarantees Box */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-4 px-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Wild-Harvested Purity</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Gold Foil Sealed</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                <span>Express Dispatched</span>
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Information Tabs */}
        <div className="max-w-5xl mx-auto mt-16 pt-12 border-t border-[var(--color-border)]">
          
          <div className="flex border-b border-[var(--color-border)] mb-8 overflow-x-auto gap-2">
            {[
              { id: "ingredients", label: "Key Ingredients & Ratios" },
              { id: "benefits", label: "Health Benefits" },
              { id: "usage", label: "How to Consume" },
              { id: "packaging", label: "Canister Packaging" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 text-xs md:text-sm font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${
                  activeTab === tab.id 
                    ? "border-[var(--color-primary)] text-[var(--color-primary)] bg-[var(--color-card)]/50 rounded-t-lg" 
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          
          <div className="min-h-[250px] text-gray-300 leading-relaxed pb-12">
            
            {/* Ingredients Tab */}
            {activeTab === "ingredients" && (
              <div>
                <p className="text-xs uppercase tracking-widest text-[var(--color-primary)] mb-4">
                  Full Botanical Formulation as on Packaging
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.detailedIngredients.map((item, idx) => (
                    <div key={idx} className="bg-[var(--color-card)] border border-[var(--color-border)] p-5 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-base font-bold text-white font-serif">{item.name}</span>
                        <span className="text-xs font-black text-black bg-gold-gradient px-2 py-0.5 rounded">
                          {item.percentage}
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-gray-400 mt-3">
                        {item.benefits.map((b, bIdx) => (
                          <li key={bIdx} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[var(--color-primary)]" />
                            {b}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Benefits Tab */}
            {activeTab === "benefits" && (
              <div className="bg-[var(--color-card)] p-8 rounded-2xl border border-[var(--color-border)]">
                <h3 className="text-xl font-bold font-serif text-white mb-4">Targeted Wellness Outcomes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.benefits.map((b, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-[var(--color-secondary)]/50 border border-[var(--color-border-gold)]">
                      <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-200 font-medium">{b}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Usage Directions Tab */}
            {activeTab === "usage" && (
              <div className="bg-[var(--color-card)] p-8 rounded-2xl border border-[var(--color-border)]">
                <h3 className="text-xl font-bold font-serif text-white mb-6">Directions & Recommended Dosage</h3>
                <div className="space-y-4 max-w-2xl">
                  {product.directions.map((dir, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-4 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border)]">
                      <div className="w-8 h-8 rounded-full bg-gold-gradient text-black font-black text-xs flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </div>
                      <span className="text-sm text-gray-200 font-medium">{dir}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Packaging Tab */}
            {activeTab === "packaging" && (
              <div className="bg-[var(--color-card)] p-8 rounded-2xl border border-[var(--color-border)]">
                <h3 className="text-xl font-bold font-serif text-white mb-3">Eco-Luxury Canister Construction</h3>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                  {product.packagingFeature}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-gray-400">
                  <div className="p-4 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)]">
                    <span className="text-white font-bold block mb-1">Golden Foil Embossing</span>
                    Crafted with premium matte foil stamping that reflects the warm golden tones of wild berries.
                  </div>
                  <div className="p-4 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border)]">
                    <span className="text-white font-bold block mb-1">UV-Protected Kraft Core</span>
                    Shields essential Omega fatty acids and fragile vitamin C molecules against sunlight degradation.
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
