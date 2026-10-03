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

          {/* Customer Care & Legal Policies (Razorpay Mandatory) */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-serif font-bold uppercase tracking-wider text-sm mb-5 text-[var(--color-primary-light)]">
              Support & Policies
            </h4>
            <ul className="space-y-3">
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/refund-policy" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Cancellation & Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-and-conditions" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li className="pt-2 text-xs text-gray-500">
                <span className="block text-gray-400 font-medium">Care Desk: <a href="mailto:customercare@himroots.in" className="hover:text-[var(--color-primary)] transition-colors">customercare@himroots.in</a></span>
                <span>Solan / Shimla, Himachal Pradesh</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar with Compliance Links */}
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Himroots Wellness. All rights reserved.
          </p>

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
              Contact Us
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
            <span className="hidden sm:inline">Wild-Foraged in the Himalayas</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
