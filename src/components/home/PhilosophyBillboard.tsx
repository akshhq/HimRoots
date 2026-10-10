import { Link } from "react-router-dom";
import { ArrowRight, Mountain, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function PhilosophyBillboard() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28 bg-black border-b border-[var(--color-border)]">
      {/* Background Cinematic Panoramic Image */}
      <div className="absolute inset-0 z-0 opacity-25">
        <img
          src="/images/himalayan-harvest.jpg"
          alt="Himalayan Mountain Harvesters in Spiti Valley"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/85 to-black/60" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        <div className="max-w-2xl">
          
          <div className="flex items-center gap-2 text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            <Mountain className="w-4 h-4" />
            <span>Source-to-Bottle Integrity</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-white mb-6 leading-tight">
            The Philosophy Rooted in the Mountains
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 font-light leading-relaxed mb-8">
            We are building India's purest source-to-bottle Himalayan wellness brand. We work directly with high-altitude foraging families and women self-help collectives across Ladakh and Spiti at 12,000+ feet, making unadulterated, raw alpine produce accessible to conscious homes nationwide.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <div className="flex items-start gap-3 bg-black/60 p-4 rounded-xl border border-[var(--color-border-gold)]/40">
              <ShieldCheck className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Zero Middlemen Brokers</h4>
                <p className="text-xs text-gray-400 font-light">
                  100% direct traceability to indigenous mountain foraging collectives.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-black/60 p-4 rounded-xl border border-[var(--color-border-gold)]/40">
              <HeartHandshake className="w-5 h-5 text-[var(--color-primary)] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-white mb-1">Ethical Living Wages</h4>
                <p className="text-xs text-gray-400 font-light">
                  Fair economic compensation empowering high-altitude mountain women.
                </p>
              </div>
            </div>
          </div>

          <Button
            asChild
            className="bg-transparent border-2 border-[var(--color-primary)] text-[var(--color-primary-light)] hover:bg-[var(--color-primary)] hover:text-black font-bold uppercase text-xs tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-[var(--color-primary)]/10"
          >
            <Link to="/about" className="inline-flex items-center gap-2">
              <span>Read Our Himalayan Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>

        </div>
      </div>
    </section>
  );
}
