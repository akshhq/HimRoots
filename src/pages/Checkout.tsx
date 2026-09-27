import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cartStore";
import { Button } from "@/components/ui/Button";
import { loadRazorpayScript, type RazorpayOptions, type RazorpaySuccessResponse } from "@/lib/razorpay";
import { apiFetch } from "@/lib/api";
import { ArrowLeft, Lock, ShieldCheck, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { SEO } from "@/components/common/SEO";

export default function Checkout() {
  const navigate = useNavigate();
  const { items, getTotals, clearCart } = useCartStore();
  const { subtotal } = getTotals();

  // Client-side visual estimation matching backend policy: Free above ₹2000, else ₹150
  // Note: Backend calculates and enforces authentic amounts upon order creation.
  const shipping = subtotal > 2000 ? 0 : 150;
  const total = subtotal + (items.length > 0 ? shipping : 0);

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);
  const isOrderCompletedRef = useRef(false);

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

  useEffect(() => {
    // Only redirect to cart if user arrived with an empty cart, not when cart is cleared upon order placement
    if (items.length === 0 && !isOrderCompletedRef.current) {
      navigate("/cart");
    }
  }, [items.length, navigate]);

  if (items.length === 0 && !isOrderCompletedRef.current) {
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * Process Checkout & Launch Razorpay Gateway
   * Backend authenticates data and calculates prices; frontend never trusts client amounts
   */
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setInfoMessage(null);

    // 1. Client-side input validation
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      setErrorMessage("Please enter both your first and last name.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setErrorMessage("Please provide a valid email address for order notifications.");
      return;
    }
    const cleanPhone = formData.phone.replace(/[\s\-\(\)\+]/g, "");
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage("Please provide a valid contact phone number (at least 8 digits).");
      return;
    }
    if (
      !formData.address.trim() ||
      formData.address.trim().length < 5 ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.pincode.trim()
    ) {
      setErrorMessage("Please provide a complete delivery street address, city, state, and PIN code.");
      return;
    }

    if (items.length === 0) {
      setErrorMessage("Your cart is empty. Please add items before checking out.");
      return;
    }

    setIsProcessing(true);

    try {
      // 2. Prepare order payload: Only send product IDs, quantities, customer & shipping info.
      // Backend calculates authentic prices & totals, and generates Razorpay order
      const orderPayload = {
        items: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
        customer: {
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
        },
        shipping: {
          address: formData.address.trim(),
          city: formData.city.trim(),
          state: formData.state.trim(),
          pincode: formData.pincode.trim(),
          country: "India",
        },
      };

      const response = await apiFetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        const errorMsg =
          responseData.error ||
          (responseData.details ? Object.values(responseData.details)[0] : null) ||
          "Failed to place order. Please review your cart and details.";
        throw new Error(String(errorMsg));
      }

      const { order, razorpay } = responseData;

      // 3. Load Razorpay Checkout SDK
      const scriptReady = await loadRazorpayScript();

      if (scriptReady && window.Razorpay && razorpay?.keyId && !razorpay.keyId.includes("mock")) {
        const options: RazorpayOptions = {
          key: razorpay.keyId || (import.meta.env.VITE_RAZORPAY_KEY_ID as string),
          amount: razorpay.amount,
          currency: razorpay.currency || "INR",
          name: "Himroots Wellness",
          description: `Order ${order.orderNumber} - Pure Himalayan Wellness`,
          image: "/images/himroots-logo.png",
          order_id: razorpay.orderId,
          prefill: {
            name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            email: formData.email.trim(),
            contact: formData.phone.trim(),
          },
          notes: {
            orderId: order.id,
            orderNumber: order.orderNumber,
          },
          theme: {
            color: "#D4AF37", // Warm Himalayan Gold
          },
          handler: async function (paymentResponse: RazorpaySuccessResponse) {
            try {
              // 4. Server-Side HMAC SHA256 Signature Verification
              const verifyRes = await apiFetch("/api/orders/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  orderId: order.id,
                  razorpayOrderId: paymentResponse.razorpay_order_id,
                  razorpayPaymentId: paymentResponse.razorpay_payment_id,
                  razorpaySignature: paymentResponse.razorpay_signature,
                }),
              });

              const verifyData = await verifyRes.json();

              if (!verifyRes.ok || !verifyData.success) {
                throw new Error(verifyData.error || "Payment signature verification failed.");
              }

              // 5. Verification successful: mark completed, clear cart, transition to order-success
              isOrderCompletedRef.current = true;
              clearCart();
              navigate("/order-success", {
                state: {
                  orderId: order.id,
                  orderNumber: order.orderNumber,
                  orderToken: order.orderToken,
                  total: order.total,
                  subtotal: order.subtotal,
                  shippingFee: order.shippingFee,
                  discount: order.discount,
                  paymentId: paymentResponse.razorpay_payment_id,
                  paymentStatus: "Paid",
                  orderStatus: "processing",
                  customer: {
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    address: formData.address.trim(),
                    city: formData.city.trim(),
                    state: formData.state.trim(),
                    pincode: formData.pincode.trim(),
                  },
                  items: order.items,
                },
              });
            } catch (verifyErr: any) {
              console.error("Signature verification error:", verifyErr);
              setIsProcessing(false);
              setErrorMessage(
                verifyErr.message ||
                  "Payment verification failed. If your account was debited, please contact Himroots support."
              );
            }
          },
          modal: {
            ondismiss: function () {
              setIsProcessing(false);
              setInfoMessage(
                "Payment was cancelled. Your cart and details have been preserved so you can retry whenever ready."
              );
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", function (failRes: any) {
          setIsProcessing(false);
          const failureReason = failRes?.error?.description || "Transaction was declined by issuing bank.";
          setErrorMessage(
            `Payment failed: ${failureReason}. Your cart is preserved. Please try another card, UPI, or NetBanking.`
          );
        });

        try {
          rzp.open();
          // Reset isProcessing once modal opens so the button isn't stuck disabled if modal is dismissed externally
          setIsProcessing(false);
          return;
        } catch (openErr: any) {
          console.error("Razorpay popup open error:", openErr);
          setIsProcessing(false);
          setErrorMessage(openErr?.message || "Could not launch Razorpay checkout modal.");
          return;
        }
      }

      // If Razorpay failed to load or key is missing, block checkout completion and show clear error
      setIsProcessing(false);
      const reason = !scriptReady || !window.Razorpay
        ? "Payment SDK (checkout.js) could not be loaded. Please check your internet connection or ad blocker."
        : !razorpay?.keyId
        ? "Payment key not configured."
        : `Payment initialization failed (SDK: ${Boolean(window.Razorpay)}, Key: ${razorpay?.keyId}).`;
      setErrorMessage(reason);
      return;
    } catch (err: any) {
      console.error("Order submission error:", err);
      setIsProcessing(false);
      setErrorMessage(
        err.message || "A network or server error occurred while processing your order. Your cart has been preserved."
      );
    }
  };

  return (
    <>
      <SEO
        title="Secure Checkout | Himroots Wellness"
        description="Complete your order of authentic Himalayan Sea Buckthorn formulations with encrypted 256-bit secure checkout."
        canonical="/checkout"
        noindex={true}
      />
      <div className="py-10 sm:py-16 md:py-20 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        <Link
          to="/cart"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>

        <h1 className="text-3xl md:text-5xl font-bold font-serif text-white mb-6">Checkout</h1>

        {/* Status / Error Alerts */}
        {errorMessage && (
          <div className="mb-8 p-4 rounded-lg bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm leading-relaxed">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-red-400 hover:text-white text-xs uppercase font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {infoMessage && (
          <div className="mb-8 p-4 rounded-lg bg-amber-950/40 border border-amber-500/50 flex items-start gap-3 text-amber-200">
            <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm leading-relaxed">{infoMessage}</div>
            <button
              onClick={() => setInfoMessage(null)}
              className="text-amber-400 hover:text-white text-xs uppercase font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <form id="checkout-form" onSubmit={handlePayment} className="flex flex-col gap-8">
              {/* Contact Information */}
              <div className="bg-[var(--color-secondary)] p-4 sm:p-6 md:p-8 rounded-lg border border-[var(--color-border)]">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center text-sm">
                    1
                  </span>
                  Customer Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm text-gray-400">Email Address (for order receipts & tracking)</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="e.g. yourname@example.com"
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
                      placeholder="First name"
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
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm text-gray-400">Phone Number (for delivery coordination)</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Destination */}
              <div className="bg-[var(--color-secondary)] p-4 sm:p-6 md:p-8 rounded-lg border border-[var(--color-border)]">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center text-sm">
                    2
                  </span>
                  Shipping Destination
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1 md:col-span-2">
                    <label className="text-sm text-gray-400">
                      Street Address (House/Flat No, Apartment, Landmark)
                    </label>
                    <input
                      type="text"
                      name="address"
                      required
                      placeholder="Flat 102, Green Meadows, Mall Road"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-black border border-[var(--color-border)] text-white px-4 py-3 rounded focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-gray-400">City / Town</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="Shimla"
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
                      placeholder="Himachal Pradesh"
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
                      placeholder="171001"
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
                      className="bg-black/50 border border-[var(--color-border)] text-gray-400 px-4 py-3 rounded cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Gateway Section */}
              <div className="bg-[var(--color-secondary)] p-4 sm:p-6 md:p-8 rounded-lg border border-[var(--color-border)]">
                <h2 className="text-xl font-bold mb-6 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[var(--color-primary)] text-black flex items-center justify-center text-sm">
                    3
                  </span>
                  Payment Gateway
                </h2>

                <div className="border border-[var(--color-primary)]/30 bg-black/40 p-4 sm:p-6 rounded-lg mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                    <span className="font-bold text-white">Razorpay Secure Checkout</span>
                  </div>
                  <p className="text-sm text-gray-300 sm:ml-8 leading-relaxed">
                    UPI (Google Pay, PhonePe, Paytm), Debit/Credit Cards (Visa, Mastercard, RuPay), and NetBanking from all major Indian banks.
                  </p>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-400 sm:ml-1">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span>256-bit SSL encrypted • Backend signature verification • Zero card storage</span>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-[var(--color-secondary)] border border-[var(--color-border)] rounded-lg p-4 sm:p-6 sticky top-28 shadow-xl">
              <div className="flex items-center justify-between border-b border-[var(--color-border)] pb-4 mb-6">
                <h2 className="text-lg font-bold uppercase tracking-wider">Order Summary</h2>
                <span className="text-xs text-[var(--color-primary)] font-semibold tracking-wider uppercase">
                  Himroots
                </span>
              </div>

              <div className="flex flex-col gap-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center">
                    <div className="w-16 h-16 bg-black rounded-md overflow-hidden border border-[var(--color-border)] relative">
                      <img src={item.images[0]} alt={item.name} className="w-full h-full object-cover" />
                      <span className="absolute -top-1 -right-1 bg-[var(--color-primary)] text-black text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold line-clamp-1">{item.name}</h4>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <div className="text-sm font-medium">₹{item.price * item.quantity}</div>
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
                    Verifying & Launching Gateway...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Pay ₹{total} via Razorpay
                  </span>
                )}
              </Button>

              <div className="text-xs text-center text-gray-400 flex flex-col items-center gap-2">
                <p className="leading-relaxed">
                  By clicking Pay, you agree to Himroots{" "}
                  <Link to="/terms-and-conditions" target="_blank" className="text-[var(--color-primary)] hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link to="/refund-policy" target="_blank" className="text-[var(--color-primary)] hover:underline">
                    Cancellation & Refund Policy
                  </Link>.
                </p>
                <div className="flex items-center gap-2 mt-1 text-gray-500">
                  <span className="px-2 py-0.5 bg-black rounded border border-[var(--color-border)]">100% Secure</span>
                  <span className="px-2 py-0.5 bg-black rounded border border-[var(--color-border)]">Verified API</span>
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
