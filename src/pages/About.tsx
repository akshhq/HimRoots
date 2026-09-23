import { Link } from "react-router-dom";
import { ArrowRight, Mountain, ShieldCheck, HeartHandshake } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function About() {
  return (
    <div className="py-12 pt-16 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <BrandLogo size="md" showSubtitle={false} className="mb-4 mx-auto" />
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Our Himalayan Roots
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-white mb-6">
            The Story Behind <span className="text-gold-gradient">Himroots</span>
          </h1>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6" />
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Himroots was born from a deep reverence for the sacred botanical heritage of the Indian Himalayas. We bridge the ancient healing traditions of high-altitude valleys with modern purity standards.
          </p>
        </div>

        {/* Narrative Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-6">
              Rooted in the Soil of 12,000 Feet
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-4">
              In the harsh, arid landscapes of Ladakh, Spiti, and Kinnaur, life doesn't merely survive; it learns to concentrate immense protective energy. Among these rocky glacial riverbeds grows the wild, thorny Sea Buckthorn shrub.
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              While mass-market wellness brands often dilute or chemically process active botanical extracts, Himroots takes a purist approach: zero artificial preservatives, zero added sugar, and zero industrial shortcuts.
            </p>
            <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border-gold)]">
              <span className="font-script text-2xl text-[var(--color-primary-light)] block mb-1">
                "Nature's Goodness in Every Sip"
              </span>
              <p className="text-xs text-gray-400">
                A simple promise to deliver the wild vitality of the Himalayas directly to your daily routine.
              </p>
            </div>
          </div>

          <div className="rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format&fit=crop" 
              alt="Himalayan Mountain Landscape" 
              className="w-full h-[420px] object-cover"
            />
          </div>
        </div>

        {/* Brand Values Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <div className="p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <Mountain className="w-8 h-8 text-[var(--color-primary)] mb-4" />
            <h3 className="text-xl font-bold font-serif text-white mb-2">Wild Foraging</h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              We never use commercial monoculture crops. Berries are hand-foraged from untamed wild groves at high altitudes where the soil is untouched by chemical fertilizers.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <HeartHandshake className="w-8 h-8 text-[var(--color-primary)] mb-4" />
            <h3 className="text-xl font-bold font-serif text-white mb-2">Community Empowerment</h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              We work directly with Himalayan tribal women's self-help groups and local farming collectives, ensuring fair ethical wages and supporting sustainable harvesting practices.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-[var(--color-card)] border border-[var(--color-border)]">
            <ShieldCheck className="w-8 h-8 text-[var(--color-primary)] mb-4" />
            <h3 className="text-xl font-bold font-serif text-white mb-2">Uncompromising Purity</h3>
            <p className="text-xs md:text-sm text-gray-400 leading-relaxed">
              Every production batch is tested for active nutrient density. Our gold foil embossed packaging protects sensitive fatty acids and vitamins against light degradation.
            </p>
          </div>
        </div>

        {/* Explore Products CTA */}
        <div className="text-center py-12 border-t border-[var(--color-border)]">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-4">
            Discover Our Sea Buckthorn Range
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">
            Experience the raw vitality of the Himalayas through our 500ml unrefined berry pulp and cold-pressed softgel capsules.
          </p>
          <Button asChild className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider px-8 py-6">
            <Link to="/shop">Explore Collection <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
