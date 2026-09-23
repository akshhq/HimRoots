import { Link } from "react-router-dom";
import { ArrowRight, Mountain, ShieldCheck, HeartHandshake } from "lucide-react";
import { InstagramIcon } from "@/components/ui/InstagramIcon";
import { Button } from "@/components/ui/Button";

export default function About() {
  return (
    <div className="py-10 sm:py-16 md:py-20 bg-[var(--color-background)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
        
        {/* Header — No redundant logo per single-logo rule */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-16 md:mb-20">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 sm:mb-3 block">
            Our Himalayan Roots
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold font-serif text-white mb-4 sm:mb-6">
            The Story Behind <span className="text-gold-gradient">Himroots</span>
          </h1>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4 sm:mb-6" />
          <p className="text-gray-300 text-sm md:text-base leading-relaxed">
            Himroots was born from a deep reverence for the sacred botanical heritage of the Indian Himalayas. We bridge the ancient healing traditions of high-altitude valleys with modern purity standards.
          </p>
        </div>

        {/* Narrative Section 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-16 sm:mb-24 max-w-6xl mx-auto">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[var(--color-primary)] block mb-2">High Altitude Terroir</span>
            <h2 className="text-xl sm:text-2xl md:text-4xl font-bold font-serif text-white mb-4 sm:mb-6">
              Rooted in the Soil of 12,000 Feet
            </h2>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
              In the harsh, arid landscapes of Ladakh, Spiti, and Kinnaur, life doesn't merely survive; it learns to concentrate immense protective energy. Among these rocky glacial riverbeds grows the wild, thorny Sea Buckthorn shrub.
            </p>
            <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed mb-6">
              While mass-market wellness brands often dilute or chemically process active botanical extracts, Himroots takes a purist approach: zero artificial preservatives, zero added sugar, and zero industrial shortcuts.
            </p>
            
            {/* Elegant Tagline Quote Box */}
            <div className="p-4 sm:p-5 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-gold)]">
              <span className="font-tagline text-sm sm:text-base md:text-lg text-[var(--color-primary-light)] font-medium uppercase tracking-[0.15em] block mb-1.5">
                "Nature's Goodness in Every Sip"
              </span>
              <p className="text-xs text-gray-400">
                A simple promise to deliver the wild vitality of the Himalayas directly to your daily routine.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-2xl">
            <img 
              src="/images/himalayan-hero-peaks.jpg" 
              alt="Majestic Himalayan Peaks and Valleys in Ladakh" 
              className="w-full h-[260px] sm:h-[400px] md:h-[460px] object-cover"
            />
          </div>
        </div>

        {/* Brand Values Pillars */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-24">
          <div className="text-center mb-8 sm:mb-12">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif text-white">
              Pillars of Our Commitment
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="p-5 sm:p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all">
              <Mountain className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-primary)] mb-4 sm:mb-5" />
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-2 sm:mb-3">Wild Foraging</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                We never use commercial monoculture crops. Berries are hand-foraged from untamed wild groves at high altitudes where the soil is untouched by chemical fertilizers.
              </p>
            </div>

            <div className="p-5 sm:p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all">
              <HeartHandshake className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-primary)] mb-4 sm:mb-5" />
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-2 sm:mb-3">Community Empowerment</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                We work directly with Himalayan tribal women's self-help groups and local farming collectives, ensuring fair ethical wages and supporting sustainable harvesting practices.
              </p>
            </div>

            <div className="p-5 sm:p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)] hover:border-[var(--color-primary)]/50 transition-all">
              <ShieldCheck className="w-7 h-7 sm:w-8 sm:h-8 text-[var(--color-primary)] mb-4 sm:mb-5" />
              <h3 className="text-lg sm:text-xl font-bold font-serif text-white mb-2 sm:mb-3">Uncompromising Purity</h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Every production batch is tested for active nutrient density. Our gold foil embossed packaging protects sensitive fatty acids and vitamins against light degradation.
              </p>
            </div>
          </div>
        </div>

        {/* Community & Instagram Banner */}
        <div className="max-w-6xl mx-auto mb-16 sm:mb-20 p-5 sm:p-8 md:p-12 rounded-2xl bg-gradient-to-r from-[var(--color-secondary)] via-[var(--color-card)] to-[var(--color-secondary)] border border-[var(--color-border-gold)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 shadow-xl">
          <div className="flex items-start sm:items-center gap-4 sm:gap-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[var(--color-card)] border border-[var(--color-border-gold)] flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 shadow-lg">
              <InstagramIcon className="w-6 h-6 sm:w-8 sm:h-8" />
            </div>
            <div>
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[var(--color-primary)] block mb-1">
                Follow the Himalayan Journey
              </span>
              <h3 className="text-lg sm:text-xl md:text-2xl font-serif font-bold text-white mb-1">
                Join Us on Instagram @himroots.wellness
              </h3>
              <p className="text-xs sm:text-sm text-gray-400">
                Witness daily high-altitude wild harvests, traditional foraging methods, and botanical insights.
              </p>
            </div>
          </div>
          <Button asChild variant="outline" className="w-full md:w-auto border-[var(--color-border-gold)] hover:bg-[var(--color-primary)]/10 text-white uppercase text-xs tracking-wider whitespace-nowrap px-6 py-4 sm:py-5 flex-shrink-0 justify-center">
            <a 
              href="https://www.instagram.com/himroots.wellness/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              Follow Profile <ArrowRight className="w-4 h-4 ml-1" />
            </a>
          </Button>
        </div>

        {/* Explore Products CTA */}
        <div className="text-center py-10 sm:py-12 border-t border-[var(--color-border)] max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-white mb-3 sm:mb-4">
            Discover Our Sea Buckthorn Range
          </h2>
          <p className="text-gray-400 text-xs sm:text-sm max-w-xl mx-auto mb-6 sm:mb-8">
            Experience the raw vitality of the Himalayas through our 500ml unrefined berry pulp and cold-pressed softgel capsules.
          </p>
          <Button asChild className="w-full sm:w-auto bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-8 py-4 sm:py-5">
            <Link to="/shop">Explore Collection <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
