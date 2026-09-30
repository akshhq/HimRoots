import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw, Clock, AlertTriangle, ShieldCheck, Mail, Phone } from "lucide-react";
import { SEO } from "@/components/common/SEO";

export default function RefundPolicy() {
  return (
    <>
      <SEO
        title="Cancellation & Refund Policy | Himroots Wellness"
        description="Review Himroots Wellness' cancellation, replacement, and refund policy for Himalayan Sea Buckthorn formulations."
        canonical="/refund-policy"
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
              Customer Assurance & Protections
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Cancellation & <span className="text-gold-gradient">Refund Policy</span>
            </h1>
            <div className="w-16 h-1 bg-gold-gradient mb-6" />
            <p className="text-gray-400 text-xs sm:text-sm">
              Last updated: September 2026 • Effective for all orders placed via himroots.in
            </p>
          </header>

          {/* Compliance Notice Banner */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-secondary)]/80 border border-[var(--color-border-gold)]/60 mb-10 flex items-start gap-3 text-xs sm:text-sm text-gray-300">
            <AlertTriangle className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white block mb-0.5">Policy Overview Notice</strong>
              This cancellation and refund policy sets forth the guidelines governing customer refunds, transit damages, and returns for Himroots Wellness botanical formulations.
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2.5">
                <Clock className="w-5 h-5 text-[var(--color-primary)]" />
                1. Order Cancellation Policy
              </h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  <strong className="text-white">Before Dispatch:</strong> You may cancel your order free of charge at any time prior to shipment dispatch. Once an order is cancelled before fulfillment, a full refund (100%) will be automatically initiated to your original payment method.
                </p>
                <p>
                  <strong className="text-white">After Dispatch:</strong> Once your package has been handed over to our express courier partner and tracking details have been generated, the order cannot be cancelled in transit. You may instead request a return or replacement upon delivery in accordance with our return guidelines below.
                </p>
                <p>
                  To request an immediate pre-dispatch cancellation, email us at{" "}
                  <a href="mailto:orders@himroots.in" className="text-[var(--color-primary)] underline hover:text-white">
                    orders@himroots.in
                  </a>{" "}
                  with your Order Reference (e.g. <code>HM-YYYYMMDD-XXXX</code>) and reason for cancellation.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2.5">
                <RotateCcw className="w-5 h-5 text-[var(--color-primary)]" />
                2. Damaged, Defective, or Incorrect Shipments
              </h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  We take utmost care in packaging our liquid botanical pulp and vegetarian softgels in tamper-evident, UV-protective canisters. However, if your order arrives under any of the following conditions:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-gray-300">
                  <li>Damaged outer packaging or cracked bottle during transit</li>
                  <li>Tampered foil seal or leaked liquid concentrate</li>
                  <li>Incorrect product formulation, volume, or quantity received</li>
                  <li>Product expired or past best-before date upon receipt</li>
                </ul>
                <p className="pt-2">
                  <strong className="text-white">Action Required:</strong> Please notify our support team within <strong>7 calendar days</strong> of parcel delivery by sending clear photographs/video of the outer carton, courier shipping label, and damaged product to{" "}
                  <a href="mailto:support@himroots.in" className="text-[var(--color-primary)] underline hover:text-white">
                    support@himroots.in
                  </a>.
                </p>
                <p>
                  Upon prompt verification by our care team, we will either dispatch a fresh replacement free of charge or issue a 100% refund as per your preference.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2.5">
                <AlertTriangle className="w-5 h-5 text-[var(--color-primary)]" />
                3. Non-Returnable & Non-Refundable Items
              </h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  Due to the nature of ingestible Ayurvedic and food-grade nutritional formulations, the following items are strictly exempt from return or refund for health, safety, and hygiene reasons:
                </p>
                <ul className="list-disc list-inside space-y-1.5 ml-2 text-gray-300">
                  <li>Bottles or softgel canisters with broken or opened seals</li>
                  <li>Partially consumed or used formulations</li>
                  <li>Items returned without original packaging, batch labels, or caps</li>
                  <li>Requests initiated beyond the 7-day post-delivery inspection window</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-4 flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                4. Refund Processing & Timelines
              </h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  Once an approved cancellation or verified damaged return is processed:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-3">
                  <div className="p-4 bg-[var(--color-secondary)] rounded-xl border border-[var(--color-border)]">
                    <div className="text-xs uppercase font-bold text-[var(--color-primary)] mb-1">UPI & NetBanking</div>
                    <div className="text-base font-bold text-white">2 to 4 Business Days</div>
                    <div className="text-xs text-gray-400 mt-1">Directly credited to linked bank account via Razorpay</div>
                  </div>
                  <div className="p-4 bg-[var(--color-secondary)] rounded-xl border border-[var(--color-border)]">
                    <div className="text-xs uppercase font-bold text-[var(--color-primary)] mb-1">Credit / Debit Cards</div>
                    <div className="text-base font-bold text-white">5 to 7 Business Days</div>
                    <div className="text-xs text-gray-400 mt-1">Depending on issuing bank billing cycle</div>
                  </div>
                </div>
                <p className="text-xs text-gray-400">
                  Refunds are transferred via our official payment gateway partner (Razorpay) back to the original source instrument. Himroots does not issue cash refunds or third-party transfers.
                </p>
              </div>
            </section>

            {/* Section 5: Grievance & Support */}
            <section className="bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-card)] to-[var(--color-secondary)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border-gold)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3">
                5. Grievance Redressal & Contact Channels
              </h2>
              <p className="text-sm text-gray-300 mb-6">
                If you have questions regarding an existing refund request or wish to track the status of an ongoing return, please reach out to our dedicated support desk:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-[var(--color-border)]">
                  <Mail className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-xs">Customer Care Desk</span>
                    <a href="mailto:customercare@himroots.in" className="text-white font-medium hover:text-[var(--color-primary)]">
                      customercare@himroots.in
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-black/40 rounded-xl border border-[var(--color-border)]">
                  <Phone className="w-5 h-5 text-[var(--color-primary)] shrink-0" />
                  <div>
                    <span className="text-gray-400 block text-xs">Helpline (Mon–Sat)</span>
                    <a href="tel:+919876543210" className="text-white font-medium hover:text-[var(--color-primary)]">
                      +91 98765 43210
                    </a>
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs text-gray-400">
                <span>Himroots Wellness Hub, Solan / Shimla, Himachal Pradesh — 171001</span>
                <Link to="/contact" className="text-[var(--color-primary)] hover:underline font-semibold">
                  Open Contact Page →
                </Link>
              </div>
            </section>

          </div>

        </div>
      </div>
    </>
  );
}
