import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, ArrowRight, ShieldCheck, Mail, ShoppingBag, HelpCircle, Clock } from "lucide-react";
import { apiUrl } from "@/lib/api";

interface OrderSuccessState {
  orderId?: string;
  orderNumber?: string;
  total?: number;
  subtotal?: number;
  shippingFee?: number;
  discount?: number;
  paymentStatus?: string;
  orderStatus?: string;
  customer?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
  items?: Array<{
    productId?: string;
    productName?: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
}

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state as OrderSuccessState) || null;

  const [orderData, setOrderData] = useState<OrderSuccessState | null>(state);
  const [isLoading, setIsLoading] = useState(!state?.orderNumber && !state?.orderId);

  useEffect(() => {
    // If state was passed via React Router navigation, we're ready
    if (state?.orderNumber || state?.orderId) {
      setOrderData(state);
      setIsLoading(false);
      return;
    }

    // Fallback: Check if accessed via URL search query params e.g. /order-success?orderNumber=HM-...
    const searchParams = new URLSearchParams(location.search);
    const identifier = searchParams.get("orderNumber") || searchParams.get("orderId");

    if (identifier) {
      fetch(apiUrl(`/api/orders/${encodeURIComponent(identifier)}`))
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.success && data.order) {
            const dbOrder = data.order;
            const nameParts = (dbOrder.customer_name || "").split(" ");
            setOrderData({
              orderId: dbOrder.id,
              orderNumber: dbOrder.order_number,
              total: Number(dbOrder.total),
              subtotal: Number(dbOrder.subtotal),
              shippingFee: Number(dbOrder.shipping_fee),
              discount: Number(dbOrder.discount || 0),
              paymentStatus: dbOrder.payment_status,
              orderStatus: dbOrder.order_status,
              customer: {
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: dbOrder.email,
                phone: dbOrder.phone,
                address: dbOrder.shipping_address,
                city: dbOrder.city,
                state: dbOrder.state,
                pincode: dbOrder.pincode,
              },
              items: (dbOrder.order_items || []).map((it: any) => ({
                productName: it.product_name,
                quantity: it.quantity,
                price: Number(it.price),
                subtotal: Number(it.subtotal),
              })),
            });
          } else {
            navigate("/");
          }
        })
        .catch(() => navigate("/"))
        .finally(() => setIsLoading(false));
    } else {
      // No order context found; safely return to homepage
      navigate("/");
    }
  }, [location, navigate, state]);

  if (isLoading) {
    return (
      <div className="py-32 bg-[var(--color-background)] min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 text-sm">Retrieving your order confirmation...</p>
        </div>
      </div>
    );
  }

  if (!orderData) return null;

  const displayOrderNumber = orderData.orderNumber || orderData.orderId || "HM-PENDING";
  const isPaid = orderData.paymentStatus === "paid" || orderData.paymentStatus === "Paid";
  const displayPaymentStatus = isPaid ? "Paid" : "Pending Payment";
  const displayOrderStatus = orderData.orderStatus
    ? orderData.orderStatus.charAt(0).toUpperCase() + orderData.orderStatus.slice(1)
    : "Received";

  return (
    <div className="py-16 md:py-24 bg-[var(--color-background)] min-h-[80vh] flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Success Header Icon & Title */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 animate-scaleUp">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>

          <span className="text-xs uppercase tracking-widest text-[var(--color-primary)] font-semibold mb-2 block">
            Order Confirmed & Placed
          </span>
          <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-3">Thank You for Your Order!</h1>
          <p className="text-gray-300 text-base md:text-lg max-w-lg mx-auto leading-relaxed">
            Your order has been recorded in our system. Our team in Himachal Pradesh is preparing your fresh wellness harvest.
          </p>
        </div>

        {/* Main Order Card */}
        <div className="bg-[var(--color-secondary)] p-6 md:p-8 rounded-xl border border-[var(--color-border)] mb-8 shadow-2xl">
          {/* Top Order Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--color-border)] pb-6 mb-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-gray-400 block mb-1">Order Reference</span>
              <span className="text-lg md:text-xl font-bold font-mono text-[var(--color-primary)]">
                {displayOrderNumber}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                  isPaid
                    ? "bg-green-500/20 text-green-300 border-green-500/40"
                    : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                }`}
              >
                {isPaid ? <ShieldCheck className="w-3.5 h-3.5 text-green-400" /> : <Clock className="w-3.5 h-3.5 text-amber-400" />}
                Payment: {displayPaymentStatus}
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-gray-200 border border-white/20">
                Fulfillment: {displayOrderStatus}
              </span>
            </div>
          </div>

          {/* Purchased Items */}
          {orderData.items && orderData.items.length > 0 && (
            <div className="mb-6 pb-6 border-b border-[var(--color-border)]">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4">Ordered Products</h3>
              <div className="flex flex-col gap-3">
                {orderData.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400 font-mono text-xs">{item.quantity}x</span>
                      <span className="text-white font-medium">{item.productName || "Himroots Wellness Product"}</span>
                    </div>
                    <div className="text-gray-300 font-mono">
                      ₹{item.subtotal || item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pricing Summary */}
          <div className="grid grid-cols-2 gap-y-3 text-sm border-b border-[var(--color-border)] pb-6 mb-6">
            <div className="text-gray-400">Order Date:</div>
            <div className="text-white text-right font-medium">
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </div>

            {orderData.subtotal !== undefined && (
              <>
                <div className="text-gray-400">Subtotal:</div>
                <div className="text-white text-right font-mono">₹{orderData.subtotal}</div>
              </>
            )}

            {orderData.shippingFee !== undefined && (
              <>
                <div className="text-gray-400">Shipping Delivery:</div>
                <div className="text-white text-right font-mono">
                  {orderData.shippingFee === 0 ? "Complimentary" : `₹${orderData.shippingFee}`}
                </div>
              </>
            )}

            {orderData.discount !== undefined && orderData.discount > 0 && (
              <>
                <div className="text-gray-400">Discount:</div>
                <div className="text-green-400 text-right font-mono">-₹{orderData.discount}</div>
              </>
            )}

            <div className="text-gray-300 font-semibold pt-2 border-t border-[var(--color-border)]/50">Total Amount:</div>
            <div className="font-bold text-lg text-[var(--color-primary)] text-right pt-2 border-t border-[var(--color-border)]/50 font-mono">
              ₹{orderData.total}
            </div>
          </div>

          {/* Shipping & Delivery Address */}
          {orderData.customer && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Shipping Destination</h3>
              <div className="text-sm text-gray-300 leading-relaxed bg-black/40 p-4 rounded-lg border border-[var(--color-border)]">
                <p className="font-bold text-white mb-1">
                  {orderData.customer.firstName} {orderData.customer.lastName}
                </p>
                <p>{orderData.customer.address}</p>
                <p>
                  {orderData.customer.city}, {orderData.customer.state} - {orderData.customer.pincode}
                </p>
                <div className="mt-3 pt-3 border-t border-[var(--color-border)]/50 flex flex-wrap gap-x-6 gap-y-1 text-xs text-gray-400">
                  <span>
                    Email: <strong className="text-gray-300">{orderData.customer.email}</strong>
                  </span>
                  <span>
                    Phone: <strong className="text-gray-300">{orderData.customer.phone}</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Customer Support & Help Options */}
        <div className="bg-[var(--color-secondary)]/60 p-6 rounded-lg border border-[var(--color-border)] mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold text-white mb-1">Need assistance with your order?</h4>
              <p className="text-xs text-gray-400">
                Our team is available Mon-Sat, 9:00 AM – 7:00 PM IST to help you with order questions or delivery updates.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 text-xs w-full md:w-auto">
            <a
              href="mailto:support@himroots.com"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-[var(--color-primary)] hover:text-black border border-[var(--color-border)] rounded text-gray-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> support@himroots.com
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-[var(--color-primary)] hover:text-black border border-[var(--color-border)] rounded text-gray-200 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild size="lg" className="w-full sm:w-auto uppercase tracking-widest text-sm">
            <Link to="/shop">
              <ShoppingBag className="w-4 h-4 mr-2" /> Continue Shopping
            </Link>
          </Button>

          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto uppercase tracking-widest text-sm">
            <Link to="/">
              Return Home <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
