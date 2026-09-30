import { Link } from "react-router-dom";
import { ArrowLeft, Lock, ShieldCheck, Database, Eye, Mail } from "lucide-react";
import { SEO } from "@/components/common/SEO";

export default function PrivacyPolicy() {
  return (
    <>
      <SEO
        title="Privacy Policy | Himroots Wellness"
        description="Learn how Himroots Wellness collects, protects, and handles your personal information and transaction data."
        canonical="/privacy-policy"
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
              Data Protection & Privacy
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-4">
              Privacy <span className="text-gold-gradient">Policy</span>
            </h1>
            <div className="w-16 h-1 bg-gold-gradient mb-6" />
            <p className="text-gray-400 text-xs sm:text-sm">
              Last updated: September 2026 • Applies to customer data collected on himroots.in
            </p>
          </header>

          {/* Summary Notice */}
          <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-secondary)]/80 border border-[var(--color-border-gold)]/60 mb-10 flex items-start gap-3 text-xs sm:text-sm text-gray-300">
            <Lock className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-white block mb-0.5">Commitment to Your Privacy</strong>
              Himroots Wellness values your trust and is committed to protecting your personal information. We do not sell, rent, or trade customer data to third-party marketing brokers.
            </div>
          </div>

          {/* Policy Sections */}
          <div className="space-y-8 text-gray-300 text-sm sm:text-base leading-relaxed">
            
            {/* Section 1 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-[var(--color-primary)]" />
                1. Information We Collect
              </h2>
              <p className="text-sm text-gray-300 mb-3">
                When you interact with our website, place an order, or submit an inquiry, we may collect:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
                <li><strong className="text-white">Contact & Identity:</strong> Full name, email address, and mobile phone number.</li>
                <li><strong className="text-white">Delivery Coordinates:</strong> Street address, apartment/flat number, city, state, pin code, and delivery instructions.</li>
                <li><strong className="text-white">Order History:</strong> Purchased formulations, transaction totals, date of order, and fulfillment status.</li>
                <li><strong className="text-white">Customer Support Inquiries:</strong> Communications sent to us through our contact form or support email.</li>
              </ul>
            </section>

            {/* Section 2 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--color-primary)]" />
                2. Payment Data & Razorpay Security
              </h2>
              <div className="space-y-3 text-sm text-gray-300">
                <p>
                  All online payments on this website are routed through <strong>Razorpay</strong>, an RBI-licensed payment aggregator maintaining strict <strong>PCI-DSS Level 1 Compliance</strong>.
                </p>
                <div className="p-4 bg-[var(--color-secondary)] rounded-xl border border-[var(--color-border)] text-xs space-y-2">
                  <div className="font-bold text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    Zero Card Storage Policy
                  </div>
                  <p className="text-gray-400">
                    Himroots Wellness servers never see, handle, or store credit card numbers, debit card details, CVVs, or UPI MPINs. Payment details are tokenized and processed directly by the payment gateway through 256-bit SSL encryption.
                  </p>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--color-primary)]" />
                3. How We Use Your Data
              </h2>
              <ul className="list-disc list-inside space-y-1.5 text-sm text-gray-300">
                <li>To process, pack, and deliver your botanical formulations.</li>
                <li>To dispatch automated order confirmation receipts, payment verifications, and courier tracking details.</li>
                <li>To provide customer support and process cancellations or approved refunds.</li>
                <li>To maintain fraud prevention and satisfy regulatory tax and accounting obligations under Indian law.</li>
              </ul>
            </section>

            {/* Section 4 */}
            <section className="bg-[var(--color-card)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3">4. Information Sharing & Third Parties</h2>
              <p className="text-sm text-gray-300 mb-2">
                We share relevant customer data strictly with essential service providers necessary to operate our store:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li><strong className="text-white">Logistics & Couriers:</strong> Delivery name, address, and phone number to courier partners for parcel transport.</li>
                <li><strong className="text-white">Payment Gateway:</strong> Transaction amounts and order identifiers to Razorpay for processing.</li>
                <li><strong className="text-white">Transactional Email Desks:</strong> Email address to Resend/Brevo for dispatching order invoices.</li>
              </ul>
            </section>

            {/* Section 5 */}
            <section className="bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-card)] to-[var(--color-secondary)] p-6 sm:p-8 rounded-2xl border border-[var(--color-border-gold)]">
              <h2 className="text-xl font-serif font-bold text-white mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5 text-[var(--color-primary)]" />
                5. Privacy Queries & Contact
              </h2>
              <p className="text-sm text-gray-300 mb-4">
                To access, correct, or request deletion of your personal contact records, contact our privacy desk:
              </p>
              <div className="text-sm">
                <a href="mailto:info@himroots.in" className="text-[var(--color-primary)] font-semibold underline hover:text-white">
                  info@himroots.in
                </a>
                <p className="text-xs text-gray-400 mt-2">
                  Himroots Wellness Hub, Solan / Shimla, Himachal Pradesh, India — 171001
                </p>
              </div>
            </section>

          </div>

        </div>
      </div>
    </>
  );
}
