import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 mb-12">
          
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

            <p className="text-gray-400 text-sm leading-relaxed mb-4">
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
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Shop Formulations
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/sea-buckthorn" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  The Himalayan Miracle Berry
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
                <Link to="/cart" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">
                  View Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Stay Connected */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-serif font-bold uppercase tracking-wider text-sm mb-5 text-[var(--color-primary-light)]">
              Join the Himalayan Journey
            </h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for seasonal wild harvest updates and exclusive wellness insights.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="bg-black/60 border border-[var(--color-border)] text-white px-4 py-2.5 text-sm rounded-lg focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-gold-gradient text-black font-bold text-xs uppercase tracking-widest px-4 py-2.5 rounded-lg hover:opacity-95 transition-opacity flex items-center justify-center gap-2"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p className="text-center md:text-left">
            &copy; {new Date().getFullYear()} Himroots Wellness. All rights reserved.
          </p>
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
            <span>Wild-Foraged in the Himalayas</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
