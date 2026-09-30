import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare, AlertCircle, HelpCircle } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Button } from "@/components/ui/Button";
import { apiFetch } from "@/lib/api";
import { SEO } from "@/components/common/SEO";

const CATEGORIES = [
  "Order Support",
  "Payment Issue",
  "Delivery Issue",
  "Return/Refund",
  "Product Query",
  "General Enquiry",
  "Other",
] as const;

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    orderId: "",
    category: "General Enquiry" as string,
    message: "",
    honeypot: "", // hidden spam trap
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic frontend checks
    if (!formState.name.trim() || formState.name.trim().length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }
    if (!formState.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email.trim())) {
      setErrorMessage("Please provide a valid email address.");
      return;
    }
    if (!formState.message.trim() || formState.message.trim().length < 5) {
      setErrorMessage("Please enter a message of at least 5 characters.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiFetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formState.name.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim() || undefined,
          orderId: formState.orderId.trim() || undefined,
          category: formState.category,
          message: formState.message.trim(),
          honeypot: formState.honeypot,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit inquiry. Please try again.");
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error("Contact form error:", err);
      setErrorMessage(err.message || "An unexpected error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contact Himroots Wellness",
    description: "Get in touch with Himroots Wellness customer care and botanical guidance team.",
    url: "https://himroots.in/contact",
  };

  return (
    <>
      <SEO
        title="Contact Himroots Wellness | Customer Care & Inquiries"
        description="Get in touch with Himroots Wellness for customer support, order assistance, and wholesale inquiries. Based in Dharamshala, Himachal Pradesh."
        canonical="/contact"
        structuredData={contactSchema}
      />
      <div className="py-10 sm:py-16 md:py-20 bg-[var(--color-background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-20">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3 block">
            Customer Care & Botanical Guidance
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-4 sm:mb-6">
            Connect with <span className="text-gold-gradient">Himroots</span>
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4 sm:mb-6" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed">
            Have questions regarding an order, payment, delivery, return/refund, or botanical dosage? 
            Our Himalayan wellness team is available to personally assist your wellness journey.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Official Support Channels & Guidance */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white mb-3">
                Official Support Channels
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
                Direct communication lines for Himroots Wellness. All requests are manually handled by our Himachal Pradesh care team.
              </p>
            </div>

            {/* Email Support Card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 transition-all hover:border-[var(--color-border-gold)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary)] mb-1">
                  Email Desks
                </div>
                <div className="flex flex-col gap-1.5 text-sm font-medium text-gray-200">
                  <a href="mailto:customercare@himroots.in" className="hover:text-[var(--color-primary)] transition-colors">
                    customercare@himroots.in
                    <span className="text-[10px] text-gray-500 ml-1.5">(Customer Care)</span>
                  </a>
                  <a href="mailto:sales@himroots.in" className="hover:text-[var(--color-primary)] transition-colors">
                    sales@himroots.in
                    <span className="text-[10px] text-gray-500 ml-1.5">(Sales & Wholesale)</span>
                  </a>
                  <a href="mailto:info@himroots.in" className="hover:text-[var(--color-primary)] transition-colors">
                    info@himroots.in
                    <span className="text-[10px] text-gray-500 ml-1.5">(General Information)</span>
                  </a>
                  <a href="mailto:orders@himroots.in" className="hover:text-[var(--color-primary)] transition-colors">
                    orders@himroots.in
                    <span className="text-[10px] text-gray-500 ml-1.5">(Order Tracking & Status)</span>
                  </a>
                  <a href="mailto:support@himroots.in" className="hover:text-[var(--color-primary)] transition-colors">
                    support@himroots.in
                    <span className="text-[10px] text-gray-500 ml-1.5">(Technical & Product Support)</span>
                  </a>
                </div>
                <p className="text-[11px] text-gray-500 mt-2">Typical response within 24 business hours</p>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 transition-all hover:border-[var(--color-border-gold)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                <Phone className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary)] mb-1">
                  Phone & WhatsApp Helpline
                </div>
                <div className="text-sm font-medium text-gray-200">
                  <a href="tel:+919876543210" className="hover:text-[var(--color-primary)] transition-colors">
                    +91 98765 43210
                  </a>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Direct support for orders, payments & consultations</p>
              </div>
            </div>

            {/* Registered Headquarters Card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 transition-all hover:border-[var(--color-border-gold)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary)] mb-1">
                  Himalayan Sourcing & Dispatch
                </div>
                <div className="text-sm font-medium text-gray-300 leading-relaxed">
                  Himroots Wellness Hub, Solan / Shimla,<br />
                  Himachal Pradesh, India — 171001
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Cold-foraged harvesting & small-batch formulation</p>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 transition-all hover:border-[var(--color-border-gold)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary)] mb-1">
                  Operating Hours
                </div>
                <div className="text-sm font-medium text-gray-300">
                  Monday – Saturday: 9:00 AM – 7:00 PM IST
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Sundays reserved for botanical foraging and rest</p>
              </div>
            </div>

            {/* Official Instagram Card */}
            <div className="bg-gradient-to-br from-[var(--color-card)] to-[var(--color-secondary)] border border-[var(--color-border-gold)] rounded-xl p-5 flex items-start gap-4 shadow-lg">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                <InstagramIcon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary)] mb-1">
                  Official Instagram
                </div>
                <a 
                  href="https://www.instagram.com/himroots.wellness/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-sm font-bold text-white hover:text-[var(--color-primary)] transition-colors inline-flex items-center gap-1.5"
                >
                  <span>@himroots.wellness</span>
                </a>
                <p className="text-[11px] text-gray-400 mt-1">Follow for daily high-altitude harvest stories & customer reviews</p>
              </div>
            </div>

            {/* Support Scope Guide */}
            <div className="bg-black/30 border border-[var(--color-border)] rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[var(--color-primary)] uppercase tracking-wider">
                <HelpCircle className="w-4 h-4" /> Support Assistance Scope
              </div>
              <ul className="text-xs text-gray-400 space-y-1.5 list-disc list-inside">
                <li><strong className="text-gray-300">Orders:</strong> Tracking status, order confirmation & dispatch</li>
                <li><strong className="text-gray-300">Payments:</strong> Razorpay verification & billing queries</li>
                <li><strong className="text-gray-300">Delivery:</strong> Courier coordination & transit updates</li>
                <li><strong className="text-gray-300">Returns & Refunds:</strong> Review requests for transit damage or packaging issues</li>
                <li><strong className="text-gray-300">Product Questions:</strong> Dosage, Ayurvedic ingredients & benefits</li>
              </ul>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-4 sm:p-8 md:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
              <MessageSquare className="w-6 h-6 text-[var(--color-primary)]" />
              <div>
                <h3 className="text-xl font-bold font-serif text-white">Send Us a Direct Message</h3>
                <p className="text-xs text-gray-400">Our customer care team will review your inquiry and reply via email.</p>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-6 p-4 rounded-lg bg-red-950/40 border border-red-500/50 flex items-start gap-3 text-red-200">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1 text-sm">{errorMessage}</div>
                <button 
                  onClick={() => setErrorMessage(null)} 
                  className="text-red-400 hover:text-white text-xs font-bold uppercase"
                >
                  Dismiss
                </button>
              </div>
            )}

            {isSubmitted ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-white mb-2">Inquiry Received</h4>
                <p className="text-sm text-gray-300 max-w-md mx-auto mb-6 leading-relaxed">
                  Thank you for reaching out to Himroots. Your inquiry has been logged and dispatched to our customer care team. 
                  We will reply to <strong>{formState.email}</strong> promptly.
                </p>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormState({
                      name: "",
                      email: "",
                      phone: "",
                      orderId: "",
                      category: "General Enquiry",
                      message: "",
                      honeypot: "",
                    });
                  }}
                  variant="outline"
                  size="sm"
                  className="border-[var(--color-border-gold)] text-white uppercase text-xs tracking-wider"
                >
                  Send Another Message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Honeypot field (hidden from genuine users, traps spam bots) */}
                <input
                  type="text"
                  name="website_source_ref"
                  value={formState.honeypot}
                  onChange={(e) => setFormState({ ...formState, honeypot: e.target.value })}
                  style={{ display: "none", position: "absolute", left: "-9999px" }}
                  tabIndex={-1}
                  autoComplete="off"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-2">
                      Full Name *
                    </label>
                    <input 
                      type="text" 
                      required
                      placeholder="Your full name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-2">
                      Email Address *
                    </label>
                    <input 
                      type="email" 
                      required
                      placeholder="your.email@example.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-2">
                      Contact Phone (Optional)
                    </label>
                    <input 
                      type="tel" 
                      placeholder="+91 Mobile number"
                      value={formState.phone}
                      onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-2">
                      Order Reference ID (Optional)
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. HM-20260924-0001"
                      value={formState.orderId}
                      onChange={(e) => setFormState({ ...formState, orderId: e.target.value })}
                      className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-2">
                    Inquiry Category *
                  </label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-2">
                    Message Details *
                  </label>
                  <textarea 
                    rows={5}
                    required
                    placeholder="How can we assist you with your order, payment, delivery, or botanical product questions?"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gold-gradient text-black font-bold uppercase tracking-widest text-xs py-4 shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      Sending Message...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="w-4 h-4" /> Send Direct Message
                    </span>
                  )}
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
    </>
  );
}
