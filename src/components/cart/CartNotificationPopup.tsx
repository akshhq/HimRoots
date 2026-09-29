import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { CheckCircle2, X, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function CartNotificationPopup() {
  const { lastNotification, clearNotification } = useCartStore();
  const [prevNotificationId, setPrevNotificationId] = useState<string | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeAnimationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  // Reset closing state when a new notification arrives
  if (lastNotification && lastNotification.notificationId !== prevNotificationId) {
    setPrevNotificationId(lastNotification.notificationId);
    setIsClosing(false);
  }

  const handleDismiss = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    closeAnimationTimerRef.current = setTimeout(() => {
      setIsClosing(false);
      clearNotification();
    }, 250);
  }, [isClosing, clearNotification]);

  useEffect(() => {
    if (!lastNotification) return;

    if (closeAnimationTimerRef.current) clearTimeout(closeAnimationTimerRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Auto dismiss after 4.5 seconds
    timerRef.current = setTimeout(() => {
      handleDismiss();
    }, 4500);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (closeAnimationTimerRef.current) clearTimeout(closeAnimationTimerRef.current);
    };
  }, [lastNotification, handleDismiss]);

  const handlePause = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  };

  const handleResume = () => {
    if (lastNotification && !isClosing) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        handleDismiss();
      }, 2500);
    }
  };

  if (!lastNotification) return null;

  const { item, addedQuantity } = lastNotification;
  const totalPrice = item.price * addedQuantity;

  return (
    <aside
      aria-label="Cart Notification"
      aria-live="polite"
      role="status"
      onMouseEnter={handlePause}
      onMouseLeave={handleResume}
      className={`fixed top-4 right-4 sm:top-6 sm:right-6 z-50 w-[calc(100%-2rem)] sm:w-[380px] max-w-full ${
        isClosing ? "animate-toast-out" : "animate-toast-in"
      }`}
    >
      <div className="relative overflow-hidden rounded-2xl bg-[#0a0a0a]/95 backdrop-blur-xl border border-[var(--color-border-gold)] shadow-2xl p-4 sm:p-5 gold-glow-sm">
        
        {/* Header row: Status & Close */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-[var(--color-primary)]/15 border border-[var(--color-primary)]/40 flex items-center justify-center text-[var(--color-primary)]">
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--color-primary-light)]">
              Added to Cart
            </span>
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Close notification"
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Product Details Row */}
        <div className="flex items-start gap-3.5 mb-4">
          <img
            src={item.images && item.images[0] ? item.images[0] : "/images/himroots-harvest-berries.jpg"}
            alt={item.name}
            className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-[var(--color-border)] bg-black/80 shrink-0 shadow-md"
          />

          <div className="flex-1 min-w-0">
            <h4 className="font-serif font-bold text-white text-xs sm:text-sm line-clamp-1 leading-snug mb-1">
              {item.name}
            </h4>
            <div className="flex items-center gap-2 text-[11px] text-gray-400 mb-1.5">
              <span>{item.volume || "Standard Unit"}</span>
              <span>•</span>
              <span className="text-gray-300 font-medium">Qty: +{addedQuantity}</span>
              {item.quantity > addedQuantity && (
                <span className="text-[10px] text-gray-500">
                  (Total: {item.quantity})
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-black text-gold-gradient">
                ₹{totalPrice.toLocaleString("en-IN")}
              </span>
              {item.originalPrice && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{(item.originalPrice * addedQuantity).toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <Button
            asChild
            variant="outline"
            size="sm"
            onClick={handleDismiss}
            className="w-full text-xs font-semibold uppercase tracking-wider h-9 border-[var(--color-border-gold)] text-gray-200 hover:text-white hover:bg-[var(--color-primary)]/10"
          >
            <Link to="/cart">
              <ShoppingBag className="w-3.5 h-3.5 mr-1 text-[var(--color-primary)]" />
              View Cart
            </Link>
          </Button>

          <Button
            size="sm"
            onClick={() => {
              handleDismiss();
              navigate("/checkout");
            }}
            className="w-full text-xs font-bold uppercase tracking-wider h-9 bg-gold-gradient text-black hover:opacity-95 shadow-md"
          >
            Checkout
            <ArrowRight className="w-3.5 h-3.5 ml-1 stroke-[2.5]" />
          </Button>
        </div>

        {/* Dynamic Timer Progress Bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 overflow-hidden">
          <div className="h-full bg-gradient-to-r from-transparent via-[var(--color-primary)] to-[var(--color-primary-light)] animate-toast-progress" />
        </div>

      </div>
    </aside>
  );
}
