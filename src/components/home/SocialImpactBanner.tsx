import { Award, Heart, Star, ShieldCheck } from "lucide-react";

export function SocialImpactBanner() {
  return (
    <section className="py-14 sm:py-18 bg-gradient-to-r from-[#170e08] via-[#100b06] to-[#170e08] border-b border-[var(--color-border)] relative overflow-hidden">
      
      {/* Decorative ambient lines */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[var(--color-primary)]/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 text-center relative z-10">
        
        {/* Top Metric Counter Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-[var(--color-border-gold)]/60 text-[var(--color-primary-light)] text-xs font-semibold mb-6 shadow-lg">
          <Star className="w-3.5 h-3.5 fill-[var(--color-primary)] text-[var(--color-primary)]" />
          <span>More Than 1,000+ Verified 5-Star Himalayan Experiences</span>
        </div>

        {/* Main Impact Headline */}
        <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white max-w-4xl mx-auto leading-tight mb-4">
          Over 10,000+ Bottles Delivered, Empowering 150+ High-Altitude Harvester Families
        </h2>

        <p className="text-gray-300 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mb-10 font-light leading-relaxed">
          Every purchase directly supports rural women self-help collectives and foraging cooperatives across Ladakh and Spiti Valley with equitable living wages and zero middlemen deduction.
        </p>

        {/* 3 Metric Pillar Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-10 text-left">
          <div className="bg-black/50 p-4 rounded-xl border border-[var(--color-border-gold)]/30 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold font-serif text-white">100% Wild</div>
              <div className="text-[11px] text-gray-400">Zero farmed monoculture</div>
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded-xl border border-[var(--color-border-gold)]/30 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold font-serif text-white">Ethical Trade</div>
              <div className="text-[11px] text-gray-400">Fair price paid to grower</div>
            </div>
          </div>

          <div className="bg-black/50 p-4 rounded-xl border border-[var(--color-border-gold)]/30 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold font-serif text-white">12,000+ Ft</div>
              <div className="text-[11px] text-gray-400">Sub-zero glacial terroir</div>
            </div>
          </div>
        </div>

        {/* Omnichannel Retail Availability */}
        <div className="pt-6 border-t border-[var(--color-border-gold)]/20 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-400">
          <span className="uppercase tracking-widest text-[10px] font-bold text-gray-400">
            Also Available On:
          </span>

          <div className="flex items-center gap-6 sm:gap-8">
            <span className="font-serif font-bold text-sm tracking-wider text-white">
              amazon<span className="text-[var(--color-primary)] font-sans text-xs">.in</span>
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="font-serif font-bold text-sm tracking-wider text-white">
              Flipkart
            </span>
            <span className="w-1 h-1 rounded-full bg-gray-600" />
            <span className="font-serif font-bold text-sm tracking-wider text-[var(--color-primary-light)]">
              HimRoots Flagship Online Store
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
