import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Share2, Globe, CheckCircle2 } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Footer() {
  return (
    <footer className="bg-[var(--color-card)] pt-16 pb-8 border-t border-[var(--color-border)]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Brand & Certifications Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12 mb-12 border-b border-[var(--color-border)]">
          <div className="flex items-center gap-3 bg-[var(--color-secondary)]/50 p-4 rounded-lg border border-[var(--color-border-gold)]">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">100% Natural</div>
              <div className="text-[11px] text-[var(--color-muted-foreground)]">Wild-foraged botanicals</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-secondary)]/50 p-4 rounded-lg border border-[var(--color-border-gold)]">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">No Added Sugar</div>
              <div className="text-[11px] text-[var(--color-muted-foreground)]">Pure unadulterated pulp</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-secondary)]/50 p-4 rounded-lg border border-[var(--color-border-gold)]">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">No Preservatives</div>
              <div className="text-[11px] text-[var(--color-muted-foreground)]">Raw botanical vitality</div>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-[var(--color-secondary)]/50 p-4 rounded-lg border border-[var(--color-border-gold)]">
            <CheckCircle2 className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0" />
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-white">Vegan Friendly</div>
              <div className="text-[11px] text-[var(--color-muted-foreground)]">Plant-powered wellness</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <Link to="/" className="inline-block mb-4">
              <BrandLogo size="md" showSubtitle={true} />
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4 mt-2">
              HIMROOTS Sea Buckthorn Juice is crafted from handpicked, wild-harvested Himalayan berries. Packed & marketed by HIMROOTS Wild-Foraged Food Products.
            </p>
            <p className="text-xs text-[var(--color-primary)]/90 tracking-wider mb-6">
              www.himroots.in • Net Volume: 500 ml
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <Share2 className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-[var(--color-primary)] transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium uppercase tracking-wider mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shop" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">Shop Products</Link>
              </li>
              <li>
                <Link to="/sea-buckthorn" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">About Sea Buckthorn</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">Our Story</Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">Contact Us</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-medium uppercase tracking-wider mb-6">Support</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">Shipping & Returns</Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">Terms & Conditions</Link>
              </li>
              <li>
                <a href="mailto:hello@himroots.com" className="text-gray-400 hover:text-[var(--color-primary)] text-sm transition-colors">hello@himroots.com</a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-medium uppercase tracking-wider mb-6">Join the Journey</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe for updates on new wellness products and exclusive offers.</p>
            <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Your email address" 
                className="bg-black border border-[var(--color-border)] text-white px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                required
              />
              <button 
                type="submit"
                className="bg-[var(--color-primary)] text-black font-medium text-sm px-4 py-2 uppercase tracking-wider hover:bg-[var(--color-primary)]/90 transition-colors flex items-center justify-center gap-2"
              >
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-[var(--color-border)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-xs text-center md:text-left">
            &copy; {new Date().getFullYear()} Himroots Wellness. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>Made with nature</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
