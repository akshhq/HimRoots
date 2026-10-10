import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";

export function Footer() {
  return (
    <footer className="bg-[var(--color-card)] pt-12 sm:pt-16 pb-12 border-t border-[var(--color-border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Brand & Quality Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 pb-8 sm:pb-12 mb-8 sm:mb-12 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-2.5 sm:gap-3.5 bg-[var(--color-secondary)]/60 p-3 sm:p-4 rounded-xl border border-[var(--color-border-gold)]">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">100% Natural</div>
              <div className="text-[10px] sm:text-[11px] text-[var(--color-muted-foreground)]">Wild botanicals</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 bg-[var(--color-secondary)]/60 p-3 sm:p-4 rounded-xl border border-[var(--color-border-gold)]">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">No Added Sugar</div>
              <div className="text-[10px] sm:text-[11px] text-[var(--color-muted-foreground)]">Pure raw pulp</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 bg-[var(--color-secondary)]/60 p-3 sm:p-4 rounded-xl border border-[var(--color-border-gold)]">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">Zero Preservatives</div>
              <div className="text-[10px] sm:text-[11px] text-[var(--color-muted-foreground)]">Raw vitality</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 bg-[var(--color-secondary)]/60 p-3 sm:p-4 rounded-xl border border-[var(--color-border-gold)]">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white">Vegan Friendly</div>
              <div className="text-[10px] sm:text-[11px] text-[var(--color-muted-foreground)]">Plant-powered</div>
            </div>
          </div>
        </div>

        {/* Footer 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 mb-10">
          
          {/* Brand Info */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link to="/" className="inline-flex flex-col items-start group mb-3">
              <span className="text-2xl font-serif font-bold text-gold-gradient tracking-[0.2em] uppercase">
                HIMROOTS
              </span>
              <span className="text-[9px] uppercase tracking-[0.35em] text-[var(--color-primary)] font-semibold mt-1">
                PURE • NATURAL • WILD
              </span>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-4 max-w-sm">
              Himroots brings the untouched vitality of wild-foraged Himalayan Sea Buckthorn directly to your daily routine. Ethically sourced from 12,000+ feet altitude in Ladakh and Spiti.
            </p>

            {/* Official Instagram Button */}
            <div className="mt-2">
              <a 
                href="https://www.instagram.com/himroots.wellness/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 px-4 py-2 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)] text-gray-200 hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all text-xs font-semibold"
              >
                <InstagramIcon className="w-4 h-4 flex-shrink-0" />
                <span>Follow @himroots.wellness</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-serif font-bold uppercase tracking-wider text-sm mb-5 text-[var(--color-primary-light)]">
              Navigation
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Our Himalayan Story
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Shop Formulations
                </Link>
              </li>
              <li>
                <Link to="/about-sea-buckthorn" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors flex items-center gap-1.5">
                  <span>About Sea Buckthorn</span>
                  <span className="text-[9px] text-[var(--color-primary)] bg-[var(--color-primary)]/15 border border-[var(--color-border-gold)]/60 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Guide</span>
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Shopping Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Formulations */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-serif font-bold uppercase tracking-wider text-sm mb-5 text-[var(--color-primary-light)]">
              Formulations
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/products/sea-buckthorn-pulp" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Raw Berry Pulp (500ml)
                </Link>
              </li>
              <li>
                <Link to="/products/sea-buckthorn-capsules" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Omega-7 Softgels (60s)
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  All Formulations
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter & Community Engagement */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-serif font-bold uppercase tracking-wider text-sm mb-3 text-[var(--color-primary-light)]">
              Let's Stay In Touch
            </h4>
            <p className="text-xs text-gray-400 font-light leading-relaxed mb-3">
              Receive notifications when rare sub-zero winter harvest batches are cold-pressed and bottled.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for subscribing to HimRoots harvest notifications!"); }} className="space-y-2">
              <div className="flex items-center">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  className="w-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 rounded-l-lg py-2 px-3 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[var(--color-primary)]"
                />
                <button
                  type="submit"
                  className="bg-gold-gradient text-black font-bold text-xs uppercase tracking-wider px-3.5 py-2 rounded-r-lg hover:opacity-95 transition-opacity"
                >
                  Join
                </button>
              </div>
              <span className="text-[10px] text-gray-500 block">No spam. Only seasonal mountain harvest dispatches.</span>
            </form>

            {/* Grievance Redressal Officer */}
            <div className="mt-5 pt-4 border-t border-[var(--color-border)] text-xs text-gray-400">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[var(--color-primary-light)] block mb-1">
                Grievance Redressal Officer:
              </span>
              <a href="mailto:anshalini@gmail.com" className="text-[11px] text-[var(--color-primary)] hover:underline block">
                anshalini@gmail.com
              </a>
              <span className="text-[10px] text-gray-500">+91 84286 11319</span>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Compliance Links & FSSAI */}
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div className="flex flex-col sm:flex-row items-center gap-3 text-center md:text-left">
            <span className="px-2.5 py-1 rounded bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/30 text-[10px] font-mono text-[var(--color-primary)] font-bold">
              FSSAI CERTIFIED
            </span>
            <p>
              &copy; {new Date().getFullYear()} Himroots Wellness. All rights reserved.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs">
            <Link to="/terms-and-conditions" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
              Terms & Conditions
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/refund-policy" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
              Refund Policy
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/privacy-policy" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-gray-700">•</span>
            <Link to="/contact" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
              Contact Care Desk
            </Link>
          </div>

          <div className="flex items-center gap-6">
            <a 
              href="https://www.instagram.com/himroots.wellness/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-[var(--color-primary)] transition-colors flex items-center gap-1.5"
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>Instagram</span>
            </a>
            <span className="hidden sm:inline font-mono text-[10px] text-gray-400">12,000+ Ft Wild Terroir</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
