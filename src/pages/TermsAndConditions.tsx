import { Link } from "react-router-dom";
import { ArrowLeft, FileText, Shield, Scale, AlertCircle, Mail, Phone } from "lucide-react";
import { SEO } from "@/components/common/SEO";

export default function TermsAndConditions() {
  return (
    <>
      <SEO
        title="Terms & Conditions | Himroots Wellness"
        description="Read the official Terms and Conditions governing purchases, usage, and policies on the Himroots Wellness e-commerce platform."
        canonical="/terms-and-conditions"
      />
      <div className="py-10 sm:py-16 md:py-20 bg-[var(--color-background)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* Breadcrumb / Back link */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[var(--color-muted-foreground)] hover:text-[var(--color-primary)] transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          {/* Header */}
          <header className="mb-10 sm:mb-14">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Terms & <span className="text-gold-gradient">Conditions</span>
            </h1>
            <div className="w-16 h-1 bg-gold-gradient mb-6" />
            <p className="text-gray-400 text-xs sm:text-sm">
              Last updated: September 2026 • Applies to all users and purchases on himroots.in
            </p>
          </header>

          {/* Notice Banner */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-secondary)]/80 border border-[var(--color-border-gold)]/60 mb-10 flex items-start gap-3 text-xs sm:text-sm text-gray-300">
            <FileText className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white block mb-0.5">Agreement to Terms</strong>
              By accessing, browsing, or purchasing products on this website (<strong>himroots.in</strong>), you acknowledge that you have read, understood, and agreed to be legally bound by these Terms and Conditions.
            </div>
          </div>

          {/* Sections List */}
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3">1. General Overview & Eligibility</h2>
              <p className="text-sm text-gray-300 mb-3">
                This website is owned and operated by Himroots Wellness ("Himroots", "we", "us", or "our"), with sourcing and fulfillment centers located in Himachal Pradesh, India.
              </p>
              <p className="text-sm text-gray-300">
                By purchasing through this platform, you represent and warrant that you are at least 18 years of age and legally competent to enter into binding commercial contracts under applicable Indian law (Indian Contract Act, 1872).
              </p>
            </section>

            {/* Section 2 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3">2. Products, Pricing & Availability</h2>
              <ul className="list-disc list-inside space-y-2 text-sm text-gray-300">
                <li>
                  <strong className="text-white">Product Accuracy:</strong> We endeavor to display our wild-foraged formulations, specifications, volume, and packaging as accurately as possible. Because our raw ingredients are harvested from nature, natural variations in taste, viscosity, and amber hue may occur between batches.
                </li>
                <li>
                  <strong className="text-white">Pricing Currency:</strong> All prices listed on himroots.in are in Indian National Rupees (INR / ₹) and are inclusive of applicable goods and services taxes (GST).
                </li>
                <li>
                  <strong className="text-white">Price Revisions:</strong> We reserve the right to revise catalog prices, product offerings, or promotional discounts at any time without prior individual notice.
                </li>
                <li>
                  <strong className="text-white">Stock Limits:</strong> All orders are subject to product availability. In the rare event of out-of-stock inventory post-payment, you will be notified promptly and issued a full 100% refund.
                </li>
              </ul>
            </section>

            {/* Section 3 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3">3. Orders, Payment & Razorpay Gateway</h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  Orders placed on this website constitute an offer to purchase. An order is confirmed once payment has been authorized and verified by our backend server.
                </p>
                <p>
                  <strong className="text-white">Authorized Payment Channels:</strong> Payments are processed via our secure, RBI-compliant payment gateway partner, <strong>Razorpay</strong>. Accepted payment methods include:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-2 text-xs">
                  <div className="p-3 bg-[var(--color-secondary)] rounded-lg border border-[var(--color-border)] text-center">
                    <strong className="text-white block">UPI</strong>
                    Google Pay, PhonePe, Paytm, BHIM
                  </div>
                  <div className="p-3 bg-[var(--color-secondary)] rounded-lg border border-[var(--color-border)] text-center">
                    <strong className="text-white block">Cards</strong>
                    Visa, MasterCard, RuPay, Maestro
                  </div>
                  <div className="p-3 bg-[var(--color-secondary)] rounded-lg border border-[var(--color-border)] text-center">
                    <strong className="text-white block">NetBanking</strong>
                    50+ Major Indian Banks
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  <Shield className="w-3.5 h-3.5 inline mr-1 text-[var(--color-primary)]" />
                  Himroots Wellness never collects or stores credit/debit card numbers, CVVs, or bank passwords. All sensitive payment sessions are tokenized and processed through 256-bit encrypted Razorpay protocols.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3">4. Shipping & Delivery</h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  <strong className="text-white">Shipping Fees:</strong> Orders with a subtotal above ₹2,000 qualify for free express shipping across India. Orders below ₹2,000 incur a flat shipping charge of ₹150.
                </p>
                <p>
                  <strong className="text-white">Dispatch & Transit:</strong> Orders are typically dispatched from Himachal Pradesh within 24 to 48 business hours. Estimated delivery timelines range from 3 to 7 business days depending on customer delivery location and pin code.
                </p>
                <p>
                  Tracking numbers will be communicated via order confirmation emails upon dispatch.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3">5. Returns, Replacements & Refunds</h2>
              <p className="text-sm text-gray-300">
                All returns, transit damage claims, and cancellations are governed strictly by our dedicated{" "}
                <Link to="/refund-policy" className="text-[var(--color-primary)] underline hover:text-white font-medium">
                  Cancellation & Refund Policy
                </Link>
                , which provides a 7-day reporting window for transit damages and explains the refund processing timeline (typically 2–7 business days).
              </p>
            </section>

            {/* Section 6 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-400" />
                6. Health & Dietary Supplement Disclaimer
              </h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  Himroots Sea Buckthorn formulations are wild-foraged botanical health food supplements and liquid pulp concentrates.
                </p>
                <p className="text-amber-200/90 text-xs sm:text-sm bg-amber-950/30 p-3.5 rounded-lg border border-amber-500/30 leading-relaxed">
                  These statements and formulations have not been evaluated by any regulatory authority as pharmaceutical medications. This product is not intended to diagnose, treat, cure, or prevent any medical condition or disease. Consult a qualified healthcare professional before starting any dietary supplement, particularly if pregnant, nursing, taking prescription medicines, or managing a medical condition.
                </p>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[var(--color-primary)]" />
                7. Intellectual Property & Governing Law
              </h2>
              <div className="space-y-2 text-sm text-gray-300">
                <p>
                  All content on this website—including the brand name "Himroots Wellness", logos, botanical illustrations, product photography, editorial copy, and layout design—is the intellectual property of Himroots Wellness and protected by Indian copyright and trademark laws.
                </p>
                <p className="pt-2">
                  <strong className="text-white">Governing Law:</strong> These terms shall be construed, interpreted, and governed in accordance with the laws of India. Any disputes arising in connection with orders or website use shall be subject to the exclusive jurisdiction of the competent courts in <strong>Himachal Pradesh, India</strong>.
                </p>
              </div>
            </section>

            {/* Section 8: Support */}
            <section className="bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-card)] to-[var(--color-secondary)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border-gold)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3">8. Grievance Officer & Contact Details</h2>
              <p className="text-sm text-gray-300 mb-4">
                For grievances, legal notices, or queries regarding these Terms and Conditions:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-[var(--color-border)]">
                  <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-xs">Official Inquiries</span>
                    <a href="mailto:support@himroots.in" className="text-white font-medium hover:text-[var(--color-primary)]">
                      support@himroots.in
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-[var(--color-border)]">
                  <Phone className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-xs">Customer Helpline</span>
                    <a href="tel:+919876543210" className="text-white font-medium hover:text-[var(--color-primary)]">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] text-xs text-gray-400">
                Himroots Wellness Hub, Solan / Shimla, Himachal Pradesh — 171001
              </div>
            </section>

          </div>

        </div>
      </div>
    </>
  );
}
