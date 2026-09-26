import { Link } from "react-router-dom";
import { Compass, ArrowRight, Home, ShoppingBag, BookOpen, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { SEO } from "@/components/common/SEO";

export default function NotFound() {
  return (
    <>
      <SEO
        title="404: Page Not Found | Himroots Wellness"
        description="The requested page could not be found. Explore our pure Himalayan Sea Buckthorn formulations or return home."
        noindex={true}
      />
      
      <div className="min-h-[75vh] flex items-center justify-center py-16 px-4 bg-[var(--color-background)]">
        <div className="max-w-2xl w-full text-center">
          
          {/* Subtle Icon Badge */}
          <div className="w-20 h-20 rounded-full bg-[var(--color-secondary)] border border-[var(--color-border-gold)] flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <Compass className="w-10 h-10 text-[var(--color-primary)]" />
          </div>

          <span className="text-xs uppercase font-bold tracking-[0.25em] text-[var(--color-primary)] block mb-2">
            Lost in the High Himalayas
          </span>
          
          <h1 className="text-6xl sm:text-7xl font-bold font-serif text-gold-gradient mb-4">
            404
          </h1>
          
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-4">
            Path Not Found
          </h2>
          
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8 font-light">
            The trail you are looking for has shifted, been moved, or does not exist. Let us guide you back to pure Himalayan vitality.
          </p>

          {/* Primary Action Button */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button asChild size="lg" className="w-full sm:w-auto bg-gold-gradient text-black font-bold uppercase text-xs tracking-widest px-8">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Return to Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto border-[var(--color-border-gold)] text-white hover:bg-[var(--color-primary)]/10 font-bold uppercase text-xs tracking-widest px-8">
              <Link to="/shop">
                <ShoppingBag className="w-4 h-4 mr-2" />
                Explore Shop
              </Link>
            </Button>
          </div>

          {/* Helpful Navigation Links Grid */}
          <div className="border-t border-[var(--color-border)] pt-8">
            <p className="text-xs text-gray-500 uppercase tracking-widest mb-4">
              Or explore popular destinations:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
              <Link
                to="/shop"
                className="p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">Our Formulations</div>
                  <div className="text-[11px] text-gray-400">Raw pulp & softgels</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 transition-all" />
              </Link>

              <Link
                to="/about-sea-buckthorn"
                className="p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">Botanical Guide</div>
                  <div className="text-[11px] text-gray-400">Omega 3, 6, 7 & 9</div>
                </div>
                <BookOpen className="w-3.5 h-3.5 text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" />
              </Link>

              <Link
                to="/contact"
                className="p-3.5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-white group-hover:text-[var(--color-primary)] transition-colors">Customer Care</div>
                  <div className="text-[11px] text-gray-400">Support & inquiries</div>
                </div>
                <Mail className="w-3.5 h-3.5 text-gray-500 group-hover:text-[var(--color-primary)] transition-colors" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
