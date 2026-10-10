import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export function FaqAccordion() {
  const faqs: FaqItem[] = [
    {
      id: "faq-1",
      question: "Are your products really wild-harvested at 12,000+ feet in the Himalayas?",
      answer:
        "Yes, absolutely. Every single batch is sourced directly from wild thorny shrubs (Hippophae rhamnoides) growing natively in the sub-zero glacial valleys of Ladakh and Spiti. These bushes brave extreme cold deserts (-30°C) and high UV exposure, forcing them to concentrate far higher antioxidant and Omega-7 levels than lowland commercial farms. There are zero synthetic pesticides or commercial fertilizers.",
    },
    {
      id: "faq-2",
      question: "What does HimRoots Sea Buckthorn taste like, and is there any added sugar?",
      answer:
        "Our Sea Buckthorn Pulp is 100% natural with ZERO added sugar, syrups, or artificial sweeteners. It has an authentic, invigorating citrus-tangy flavour with rich natural astringency from its high Vitamin C and bioflavonoid density. Diluting 10ml to 20ml in a glass of water creates a refreshingly tart morning elixir.",
    },
    {
      id: "faq-3",
      question: "What is rare Omega-7 (Palmitoleic Acid) and why is it so essential?",
      answer:
        "Omega-7 is one of nature’s rarest plant-derived fatty acids. Unlike common Omegas, Omega-7 is a vital structural component of human cellular membranes, skin epithelium, and mucosal linings (eyes, digestive tract, respiratory system, and intimate tissues). It deeply nourishes from within, soothing dry eyes, restoring skin elasticity, and rejuvenating internal mucous barriers.",
    },
    {
      id: "faq-4",
      question: "How should I consume the Sea Buckthorn Pulp daily?",
      answer:
        "For optimal cellular absorption, shake the bottle thoroughly, take 10ml to 20ml of pulp, and mix it with 200ml of ambient or lukewarm water. Drink it first thing in the morning on an empty stomach. You can also mix it with a drizzle of raw honey if you prefer a gentler citrus flavor. Because our pulp is raw and unfiltered, natural separation is normal—shake well before every pour.",
    },
    {
      id: "faq-5",
      question: "Do you test for heavy metals, pesticides, and microbial safety?",
      answer:
        "Yes. High-altitude adaptogens and botanical resins must be rigorously screened. Every batch of HimRoots products is tested by independent ISO/NABL-accredited third-party laboratories to verify compliance with strict safety parameters (Lead, Arsenic, Cadmium, Mercury, aflatoxins, and microbial pathogens) as well as active compound potency before approval for shipment.",
    },
    {
      id: "faq-6",
      question: "Is HimRoots suitable for long-term daily consumption?",
      answer:
        "Yes. Himalayan Sea Buckthorn is a time-tested adaptogenic food revered for centuries in traditional Tibetan Sowa-Rigpa and Himalayan wellness systems. Its benefits are cumulative—daily consistent consumption over 4 to 8 weeks supports enduring immune defense, radiant skin vitality, healthy cholesterol balance, and digestive comfort.",
    },
    {
      id: "faq-7",
      question: "How are the local mountain harvesters supported?",
      answer:
        "We eliminate commercial middlemen brokers and work directly with rural women self-help collectives (SHGs) and foraging families across Ladakh and Spiti. Harvesters are compensated with fair living wages, and harvesting is conducted using non-destructive traditional pruning methods that protect wild shrubs for future generations.",
    },
    {
      id: "faq-8",
      question: "How should the products be stored once opened?",
      answer:
        "Because our pulp is minimally processed without synthetic preservatives or excess sugar, it should be refrigerated after opening and consumed within 60 days. Keep the bottle tightly capped and away from direct sunlight. The oil softgels can be stored in a cool, dry place inside their UV-protective apothecary amber bottle.",
    },
  ];

  const [openId, setOpenId] = useState<string | null>("faq-1");

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-[#050505] border-b border-[var(--color-border)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[var(--color-primary)] text-xs font-bold uppercase tracking-[0.25em] mb-2 block">
            Knowledge Base & Guidance
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold font-serif text-white mb-3 sm:mb-4">
            Things People Ask Us
          </h2>
          <div className="w-16 sm:w-20 h-1 bg-gold-gradient mx-auto mb-4" />
          <p className="text-gray-300 text-xs sm:text-sm md:text-base leading-relaxed font-light">
            Everything you need to know about high-altitude harvesting, bio-absorption, and our purity standards.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-3.5">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="rounded-xl border border-[var(--color-border-gold)]/40 bg-[var(--color-card)] overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full py-4 sm:py-5 px-5 sm:px-6 flex items-center justify-between text-left gap-4 hover:bg-white/[0.02] transition-colors"
                >
                  <span className="text-sm sm:text-base font-serif font-bold text-white flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-[var(--color-primary)] flex-shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-[var(--color-secondary)] border border-[var(--color-border-gold)]/40 flex items-center justify-center text-[var(--color-primary)] flex-shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-[var(--color-primary)] text-black" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-5 pt-1 text-xs sm:text-sm text-gray-300 font-light leading-relaxed border-t border-[var(--color-border)] bg-black/40">
                    <p className="pl-6.5">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
