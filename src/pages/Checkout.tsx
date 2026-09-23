import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, Lock, ShieldCheck } from "lucide-react";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();
  
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + (items.length > 0 ? shipping : 0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSimulatePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate Razorpay loading
    setTimeout(() => {
      // Create a mock order ID
      const orderId = "ORD_" + Math.random().toString(36).substr(2, 9).toUpperCase();
      
      // Clear cart
      clearCart();
      
      // Redirect to success
      navigate("/order-success", { state: { orderId, total, customer: formData } });
    }, 2000);
  };

  return (
    <div className="py-12 md:py-20 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <Link to="/cart" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        
        <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-10">Checkout</h1>
        
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form id="checkout-form" onSubmit={handleSimulatePayment} className="flex flex-col gap-8">
              
              {/* Contact Information */}
              <div className="bg-[var(--color-secondary)] p-6 md:p-8 rounded-lg border border-[var(--color-border)]">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center text-sm">1</span>
                  Contact Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm text-gray-400">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">First Name</label>
                    <input 
                      type="text" 
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Last Name</label>
                    <input 
                      type="text" 
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm text-gray-400">Phone Number</label>
                    <input 
                      type="tel" 
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-[var(--color-secondary)] p-6 md:p-8 rounded-lg border border-[var(--color-border)]">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center text-sm">2</span>
                  Shipping Address
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm text-gray-400">Address (House No, Building, Street)</label>
                    <input 
                      type="text" 
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">City</label>
                    <input 
                      type="text" 
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">State</label>
                    <input 
                      type="text" 
                      name="state"
                      required
                      value={formData.state}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">PIN Code</label>
                    <input 
                      type="text" 
                      name="pincode"
                      required
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">Country</label>
                    <input 
                      type="text" 
                      value="India"
                      readOnly
                      className="bg-black/50 border border-[var(--color-border)] text-gray-500 px-4 py-3 rounded cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-[var(--color-secondary)] p-6 md:p-8 rounded-lg border border-[var(--color-border)]">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center text-sm">3</span>
                  Payment
                </h2>
                <div className="border border-[var(--color-primary)]/30 bg-black/40 p-6 rounded-lg mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                    <span className="font-bold text-white">Secure Razorpay Integration</span>
                  </div>
                  <p className="text-sm text-gray-400 ml-8">
                    You will be securely redirected to Razorpay to complete your purchase. (This is a simulated demo).
                  </p>
                </div>
              </div>

            </form>
          </div>
          
          {/* Order Summary sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-lg p-6 sticky top-28 shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider">Order Summary</h2>
                <span className="text-xs text-[var(--color-primary)] font-semibold tracking-wider uppercase">Himroots</span>
              </div>
              
              <div className="flex flex-col gap-4 mb-6">
                {items.map(item => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-black rounded-md overflow-hidden border border-[var(--color-border)] relative">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 bg-gray-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <div className="text-sm font-medium">
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-4 mb-6 text-sm border-t border-[var(--color-border)] pt-6">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `₹${shipping}`}</span>
                </div>
                <div className="border-t border-[var(--color-border)] pt-4 mt-2 flex justify-between items-center">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-2xl text-[var(--color-primary)]">₹{total}</span>
                </div>
              </div>
              
              <Button 
                type="submit" 
                form="checkout-form" 
                size="lg" 
                className="w-full uppercase tracking-widest text-sm mb-4 relative"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Pay ₹{total}
                  </span>
                )}
              </Button>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
