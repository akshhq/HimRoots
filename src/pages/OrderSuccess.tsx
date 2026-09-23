import { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { orderId: string; total: number; customer: any };

  useEffect(() => {
    // If accessed directly without order state, redirect home
    if (!state || !state.orderId) {
      navigate("/");
    }
  }, [state, navigate]);

  if (!state || !state.orderId) return null;

  return (
    <div className="py-20 md:py-32 bg-[var(--color-background)] min-h-[70vh] flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        
        <BrandLogo size="md" showSubtitle={true} className="mb-8 mx-auto" />

        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/40">
          <CheckCircle2 className="w-10 h-10 text-green-500" />
        </div>
        
        <h1 className="text-3xl md:text-5xl font-bold mb-4">Order Successful!</h1>
        <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>

        <div className="bg-[var(--color-secondary)] p-8 rounded-lg border border-[var(--color-border)] mb-10 text-left">
          <h3 className="font-bold uppercase tracking-wider mb-6 border-b border-[var(--color-border)] pb-4">Order Details</h3>
          
          <div className="grid grid-cols-2 gap-y-4 text-sm mb-6">
            <div className="text-gray-400">Order ID:</div>
            <div className="font-bold text-white text-right">{state.orderId}</div>
            
            <div className="text-gray-400">Date:</div>
            <div className="text-white text-right">{new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            
            <div className="text-gray-400">Total Amount:</div>
            <div className="font-bold text-[var(--color-primary)] text-right">₹{state.total}</div>
            
            <div className="text-gray-400">Payment Method:</div>
            <div className="text-white text-right">Razorpay (Paid)</div>
          </div>
          
          <h3 className="font-bold uppercase tracking-wider mb-4 border-b border-[var(--color-border)] pb-4 mt-8">Delivery Information</h3>
          <div className="text-sm text-gray-300">
            <p className="font-bold text-white mb-1">{state.customer.firstName} {state.customer.lastName}</p>
            <p>{state.customer.address}</p>
            <p>{state.customer.city}, {state.customer.state} {state.customer.pincode}</p>
            <p className="mt-2 text-gray-400">{state.customer.email}</p>
            <p className="text-gray-400">{state.customer.phone}</p>
          </div>
        </div>

        <Button asChild size="lg" className="uppercase tracking-widest text-sm">
          <Link to="/shop">
            Continue Shopping <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
        </Button>
        
      </div>
    </div>
  );
}
