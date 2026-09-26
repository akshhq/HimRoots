import { Link } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { Trash2, ArrowLeft, ShoppingBag } from "lucide-react";
import { SEO } from "@/components/common/SEO";

export default function Cart() {
  const { items, updateQuantity, removeItem, getTotals } = useCartStore();
  const { subtotal } = getTotals();
  
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + (items.length > 0 ? shipping : 0);

  if (items.length === 0) {
    return (
      <>
        <SEO
          title="Your Shopping Cart | Himroots Wellness"
          description="Review your selected pure Himalayan Sea Buckthorn formulations and proceed to secure checkout."
          canonical="/cart"
          noindex={true}
        />
        <div className="container mx-auto px-4 py-32 text-center flex flex-col items-center">
          <div className="w-24 h-24 bg-[var(--color-secondary)] rounded-full flex items-center justify-center mb-8 border border-[var(--color-border)]">
            <ShoppingBag className="w-10 h-10 text-gray-500" />
          </div>
          <h1 className="text-3xl font-bold mb-4 font-serif text-white">Your Cart is Empty</h1>
          <p className="text-gray-400 mb-8 max-w-md mx-auto">
            Looks like you haven't added any wellness products to your cart yet.
          </p>
          <Button asChild size="lg" className="uppercase tracking-widest text-sm bg-gold-gradient text-black font-bold">
            <Link to="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO
        title="Your Shopping Cart | Himroots Wellness"
        description="Review your selected pure Himalayan Sea Buckthorn formulations and proceed to secure checkout."
        canonical="/cart"
        noindex={true}
      />
      <div className="py-10 sm:py-16 md:py-20 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-10">Shopping Cart</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3">
            <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[var(--color-border)] text-sm font-medium uppercase tracking-wider text-gray-400 mb-6">
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-right">Total</div>
            </div>
            
            <div className="flex flex-col gap-6">
              {items.map(item => (
                <div key={item.id} className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center bg-[var(--color-secondary)] md:bg-transparent p-4 md:p-0 rounded-lg md:rounded-none border md:border-none border-[var(--color-border)] pb-6 md:pb-6 md:border-b">
                  
                  {/* Product Info */}
                  <div className="col-span-12 md:col-span-6 flex items-center gap-4 w-full">
                    <Link to={`/products/${item.slug}`} className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-black rounded-md overflow-hidden border border-[var(--color-border)]">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                    </Link>
                    <div className="flex flex-col flex-1">
                      <Link to={`/products/${item.slug}`} className="font-bold text-lg hover:text-[var(--color-primary)] transition-colors line-clamp-2">
                        {item.name}
                      </Link>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-500 hover:text-red-500 text-sm flex items-center gap-1 mt-2 w-fit transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  </div>
                  
                  {/* Price (Desktop) */}
                  <div className="hidden md:flex col-span-2 justify-center items-center font-medium">
                    ₹{item.price}
                  </div>
                  
                  {/* Quantity */}
                  <div className="col-span-12 md:col-span-2 flex justify-between md:justify-center items-center w-full">
                    <span className="md:hidden text-gray-400 text-sm">Quantity:</span>
                    <div className="flex items-center border border-[var(--color-border)] rounded-md overflow-hidden bg-black md:bg-[var(--color-secondary)]">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[var(--color-muted)] transition-colors"
                      >
                        -
                      </button>
                      <input 
                        type="number" 
                        value={item.quantity}
                        readOnly
                        className="w-10 h-10 text-center bg-transparent text-white font-bold focus:outline-none text-sm"
                      />
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-[var(--color-muted)] transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Total */}
                  <div className="col-span-12 md:col-span-2 flex justify-between md:justify-end items-center w-full md:w-auto font-bold text-[var(--color-primary)] text-lg">
                    <span className="md:hidden text-gray-400 text-sm font-normal">Total:</span>
                    ₹{item.price * item.quantity}
                  </div>
                  
                </div>
              ))}
            </div>
            
            <div className="mt-8">
              <Link to="/shop" className="inline-flex items-center gap-2 text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <ArrowLeft className="w-4 h-4" /> Continue Shopping
              </Link>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-lg p-6 sticky top-28 shadow-xl">
              <h2 className="text-xl font-bold mb-6 uppercase tracking-wider">Order Summary</h2>
              
              <div className="flex flex-col gap-4 mb-6 text-sm">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                {shipping > 0 && (
                  <div className="text-xs text-[var(--color-primary)] text-right -mt-2">
                    Free shipping on orders above ₹2000
                  </div>
                )}
                <div className="border-t border-[var(--color-border)] pt-4 mt-2 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-[var(--color-primary)]">₹{total}</span>
                </div>
              </div>
              
              <Button asChild size="lg" className="w-full uppercase tracking-widest text-sm mb-4">
                <Link to="/checkout">Proceed to Checkout</Link>
              </Button>
              
              <div className="text-xs text-center text-gray-500 flex flex-col items-center gap-2">
                <p>Taxes and shipping calculated at checkout.</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-black rounded border border-[var(--color-border)]">Secure</span>
                  <span className="px-2 py-1 bg-black rounded border border-[var(--color-border)]">Encrypted</span>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
    </>
  );
}
