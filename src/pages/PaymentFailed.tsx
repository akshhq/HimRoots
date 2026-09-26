import { Link, useLocation } from "react-router-dom";
import { AlertCircle, RefreshCw, ShoppingCart, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/common/SEO";

export default function PaymentFailed() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const reason = searchParams.get("reason") || (location.state as any)?.reason || "The payment could not be completed at this time.";
  const orderNumber = searchParams.get("orderNumber") || (location.state as any)?.orderNumber;

  return (
    <>
      <SEO
        title="Payment Incomplete | Himroots Wellness"
        description="Payment could not be completed. Your cart items are preserved so you can retry safely."
        noindex={true}
      />

      <div className="py-16 md:py-24 bg-[var(--color-background)] min-h-[75vh] flex items-center justify-center">
        <div className="container mx-auto px-4 max-w-xl text-center">
          
          {/* Warning Status Icon */}
          <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/30">
            <AlertCircle className="w-10 h-10 text-amber-400" />
          </div>

          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[var(--color-primary)] block mb-2">
            Checkout Status
          </span>

          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-4">
            Payment Not Completed
          </h1>

          <p className="text-gray-300 text-sm leading-relaxed mb-6 font-light max-w-md mx-auto">
            {reason}
          </p>

          {orderNumber && (
            <div className="inline-block bg-[var(--color-secondary)]/80 border border-[var(--color-border-gold)]/40 rounded-xl px-4 py-2 text-xs text-gray-300 mb-6">
              Reference: <span className="font-mono text-white font-bold">{orderNumber}</span>
            </div>
          )}

          {/* Reassurance Callout */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] text-left text-xs text-gray-300 leading-relaxed mb-8 space-y-2">
            <div className="font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Your Cart is Preserved
            </div>
            <p className="text-gray-400">
              No items were removed from your bag. You can safely return to checkout and retry using UPI, Credit/Debit card, or NetBanking.
            </p>
            <p className="text-gray-400 pt-1 border-t border-[var(--color-border)] text-[11px]">
              If money was debited from your bank account, it will automatically be refunded by your bank within 3–5 working days.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="w-full sm:w-auto bg-gold-gradient text-black font-bold uppercase text-xs tracking-widest px-8">
              <Link to="/checkout">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry Checkout
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-[var(--color-border-gold)] text-white hover:bg-[var(--color-primary)]/10 font-bold uppercase text-xs tracking-widest px-6">
              <Link to="/cart">
                <ShoppingCart className="w-4 h-4 mr-2" />
                View Cart
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="w-full sm:w-auto text-gray-400 hover:text-white text-xs font-semibold px-4">
              <Link to="/contact">
                <HelpCircle className="w-4 h-4 mr-1.5" />
                Support
              </Link>
            </Button>
          </div>

        </div>
      </div>
    </>
  );
}
