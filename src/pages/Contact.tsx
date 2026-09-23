import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Button } from "@/components/ui/Button";

export default function Contact() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });

  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.email || !formState.message) return;
    setIsSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        
        {/* Page Header — No redundant logo per single-logo rule */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-3 block">
            Get in Touch
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-serif text-white mb-6">
            Connect with <span className="text-gold-gradient">Himroots</span>
          </h1>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6" />
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Have questions about our wild-harvested Himalayan Sea Buckthorn formulations, bulk or wholesale orders, or looking for personal wellness guidance? We are here to assist you.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start max-w-6xl mx-auto">
          
          {/* Left Column: Official Channels with Placeholders */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div>
              <h2 className="text-2xl font-serif font-bold text-white mb-3">
                Official Channels
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-6 leading-relaxed">
                Official contact details and communication channels for Himroots Wellness.
              </p>
            </div>

            {/* Email Card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 transition-all hover:border-[var(--color-border-gold)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary)] mb-1">
                  Customer Support Email
                </div>
                <div className="text-sm font-medium text-gray-300">
                  <span className="inline-block py-0.5 px-2 bg-[var(--color-secondary)] border border-dashed border-[var(--color-border)] rounded text-xs text-gray-400">
                    [Official Email to be added]
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Typical response within 24 hours</p>
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
                <div className="text-sm font-medium text-gray-300">
                  <span className="inline-block py-0.5 px-2 bg-[var(--color-secondary)] border border-dashed border-[var(--color-border)] rounded text-xs text-gray-400">
                    [Phone Number to be added]
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Assistance with orders and consultations</p>
              </div>
            </div>

            {/* Office Address Card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 transition-all hover:border-[var(--color-border-gold)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary)] mb-1">
                  Registered Headquarters
                </div>
                <div className="text-sm font-medium text-gray-300">
                  <span className="inline-block py-0.5 px-2 bg-[var(--color-secondary)] border border-dashed border-[var(--color-border)] rounded text-xs text-gray-400">
                    [Official Address to be added]
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Himalayan Sourcing & Dispatch</p>
              </div>
            </div>

            {/* Operating Hours Card */}
            <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-xl p-5 flex items-start gap-4 transition-all hover:border-[var(--color-border-gold)]">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 mt-0.5">
                <Clock className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="text-xs uppercase font-bold tracking-wider text-[var(--color-primary)] mb-1">
                  Operational Timings
                </div>
                <div className="text-sm font-medium text-gray-300">
                  <span className="inline-block py-0.5 px-2 bg-[var(--color-secondary)] border border-dashed border-[var(--color-border)] rounded text-xs text-gray-400">
                    [Business Hours to be added]
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-1">Indian Standard Time (IST)</p>
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
                <p className="text-[11px] text-gray-400 mt-1">Follow for daily high-altitude harvest stories & wellness guides</p>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 sm:p-10 shadow-2xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-[var(--color-border)]">
              <MessageSquare className="w-6 h-6 text-[var(--color-primary)]" />
              <div>
                <h3 className="text-xl font-bold font-serif text-white">Send Us a Direct Message</h3>
                <p className="text-xs text-gray-400">Fill out your query and our team will get back to you promptly.</p>
              </div>
            </div>

            {isSubmitted ? (
              <div className="py-12 text-center animate-in fade-in duration-300">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-2xl font-serif font-bold text-white mb-2">Message Received</h4>
                <p className="text-sm text-gray-300 max-w-md mx-auto mb-6">
                  Thank you for reaching out to Himroots. We have received your inquiry and our team will review it and follow up with you.
                </p>
                <Button 
                  onClick={() => {
                    setIsSubmitted(false);
                    setFormState({
                      name: "",
                      email: "",
                      phone: "",
                      subject: "General Inquiry",
                      message: "",
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
                      Phone Number (Optional)
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
                      Inquiry Topic
                    </label>
                    <select
                      value={formState.subject}
                      onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                      className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                    >
                      <option value="General Inquiry">General Product Inquiry</option>
                      <option value="Order & Delivery">Order Status & Delivery</option>
                      <option value="Wholesale & Bulk">Wholesale & Bulk Inquiries</option>
                      <option value="Wellness Consultation">Formulation Consultation</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase font-bold tracking-wider text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea 
                    rows={5}
                    required
                    placeholder="How can we assist your Himalayan wellness journey?"
                    value={formState.message}
                    onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                    className="w-full bg-[var(--color-secondary)] border border-[var(--color-border)] text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors resize-none"
                  />
                </div>

                <Button 
                  type="submit"
                  size="lg"
                  className="w-full bg-gold-gradient text-black font-bold uppercase tracking-widest text-xs py-4 shadow-lg hover:opacity-95 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Send Direct Message
                </Button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
