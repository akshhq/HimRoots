import { Link } from "react-router-dom";
import { Sun, Shield, Heart, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { BrandLogo } from "@/components/ui/BrandLogo";

export default function SeaBuckthorn() {
  return (
    <div className="py-12 pt-16 bg-[var(--color-background)]">
      <div className="container mx-auto px-4 md:px-6">
        
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <BrandLogo size="sm" showSubtitle={false} className="mb-4 mx-auto" />
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Botanical Deep-Dive
          </span>
          <h1 className="text-4xl md:text-6xl font-bold font-serif text-white mb-6">
            The Himalayan <span className="text-gold-gradient">Miracle Berry</span>
          </h1>
          <div className="w-20 h-1 bg-gold-gradient mx-auto mb-6" />
          <p className="text-gray-300 text-base md:text-lg leading-relaxed">
            Revered in ancient Ayurvedic and Tibetan medical treatises as <em>Sanjeevani</em> and the "Holy Fruit of the Himalayas", Sea Buckthorn (<em>Hippophae rhamnoides</em>) is one of the planet's most nutrient-dense botanical species.
          </p>
        </div>

        {/* High Altitude Terroir Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="rounded-2xl overflow-hidden border border-[var(--color-border-gold)] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1596431952404-58a436531526?q=80&w=1200&auto=format&fit=crop" 
              alt="Wild Sea Buckthorn Berries in the Himalayas" 
              className="w-full h-[400px] object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-bold font-serif text-white mb-6">
              Forged in Glacial Cold and Solar Radiance
            </h2>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              At altitudes exceeding 12,000 feet in the cold deserts of Ladakh and Spiti, climatic conditions are relentless. Winter temperatures plummet to -40°C, and summer brings intense ultraviolet radiation.
            </p>
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-6">
              To thrive in this hostile environment without wilting, Sea Buckthorn developed an astonishing biochemical defense mechanism: an extraordinarily high concentration of protective bioflavonoids, carotenoids, and dense polyunsaturated fatty acids.
            </p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
                <span className="text-[var(--color-primary)] font-bold text-lg block mb-1">12,000+ Ft</span>
                Pristine glacial altitude free of chemical pesticides.
              </div>
              <div className="p-4 rounded-xl bg-[var(--color-card)] border border-[var(--color-border)]">
                <span className="text-[var(--color-primary)] font-bold text-lg block mb-1">-40°C</span>
                Natural thermal endurance concentrating active adaptogens.
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional Matrix (The 4 Omegas & 190+ Nutrients) */}
        <div className="bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl p-8 md:p-12 mb-20 shadow-xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
              Bioactive Complexity
            </span>
            <h2 className="text-3xl md:text-4xl font-bold font-serif text-white mb-4">
              The Rare Omega-7 & Nutrient Spectrum
            </h2>
            <p className="text-gray-400 text-sm">
              Sea Buckthorn is one of the only known botanical sources containing the complete fatty acid spectrum: Omega 3, 6, 9, and the scarce Omega-7.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]">
              <Zap className="w-8 h-8 text-[var(--color-primary)] mb-4" />
              <h3 className="text-lg font-bold text-white font-serif mb-2">Rare Omega-7</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Palmitoleic acid: virtually absent in most plants. Crucial for mucous membrane lubrication (soothing dry eyes & gut lining) and structural dermal elasticity.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]">
              <Heart className="w-8 h-8 text-[var(--color-primary)] mb-4" />
              <h3 className="text-lg font-bold text-white font-serif mb-2">Omega 3, 6 & 9</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Balanced essential fatty acids promoting cardiovascular vigor, brain function, and natural systemic inflammation moderation.
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]">
              <Sun className="w-8 h-8 text-[var(--color-primary)] mb-4" />
              <h3 className="text-lg font-bold text-white font-serif mb-2">Vitamin C & E</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Boasts up to 12 times the concentration of Vitamin C found in citrus fruits, paired with powerful natural alpha-tocopherol (Vitamin E).
              </p>
            </div>

            <div className="p-6 rounded-xl bg-[var(--color-secondary)] border border-[var(--color-border-gold)]">
              <Shield className="w-8 h-8 text-[var(--color-primary)] mb-4" />
              <h3 className="text-lg font-bold text-white font-serif mb-2">190+ Bioactives</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                Rich in beta-carotene, lycopene, superoxide dismutase (SOD), quercetin, and 24 trace minerals essential for human enzymatic processes.
              </p>
            </div>
          </div>
        </div>

        {/* Both Formulations CTA */}
        <div className="text-center py-12 border-t border-[var(--color-border)]">
          <h2 className="text-2xl md:text-3xl font-bold font-serif text-white mb-4">
            Experience Wild Himalayan Sea Buckthorn
          </h2>
          <p className="text-gray-400 text-sm max-w-xl mx-auto mb-8">
            Available in our signature 500ml unrefined berry pulp or 60 cold-pressed vegetarian softgel capsules.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" asChild className="bg-gold-gradient text-black font-bold uppercase text-xs tracking-wider">
              <Link to="/products/sea-buckthorn-pulp">View Pure Pulp (500ml)</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="border-[var(--color-border-gold)] uppercase text-xs tracking-wider text-white">
              <Link to="/products/sea-buckthorn-capsules">View Softgel Capsules</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
