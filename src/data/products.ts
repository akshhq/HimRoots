export interface IngredientDetail {
  name: string;
  percentage: string;
  benefits: string[];
}

export interface Product {
  id: string;
  name: string;
  tagline: string;
  scriptQuote?: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  volume: string;
  images: string[];
  category: string;
  ingredients: string[];
  detailedIngredients: IngredientDetail[];
  benefits: string[];
  certifications: string[];
  directions: string[];
  packagingFeature: string;
  shelfLife?: string;
  stock: number;
  rating: number;
  reviews: number;
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "prod_001",
    name: "Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract | 500ml",
    tagline: "For Energy, Immunity & Skin Health",
    scriptQuote: "SIP THE POWER OF HIMALAYAS",
    slug: "sea-buckthorn-pulp",
    volume: "500 ml",
    description: "Himroots Himalayan Sea Buckthorn Juice (Pulp) with Curcumin Extract is a liquid pulp concentrate, wild-harvested from the pristine Himalayan region of Ladakh at ~12,000 ft. Revered for centuries in Tibetan medicine, this ancient berry now meets rigorous modern science, bringing time-tested wisdom to the challenges of contemporary health. Cold-pressed and unfiltered to preserve its naturally occurring nutrient richness, it contains no added sugar or fillers. Naturally rich in Vitamin C and powered by 190+ bioactives, including Vitamins C & E, carotenoids, polyphenols, plant sterols, and a rare full-spectrum Omega 3, 6, 7 & 9 profile, it delivers comprehensive support for healthy skin, immunity, liver function, cholesterol balance, gut health, and antioxidant defence.",
    price: 899,
    originalPrice: 1199,
    images: [
      "/images/himroots-sea-buckthorn-pulp.jpg",
      "/images/pulp-omega-profile.jpg",
      "/images/pulp-190-bioactives.jpg",
      "/images/pulp-vitaminc-comparison.jpg",
      "/images/pulp-clinical-timeline.jpg",
      "/images/pulp-quality-standards.jpg",
      "/images/pulp-daily-ritual-guide.jpg",
      "/images/pulp-comparison-chart.jpg",
      "/images/pulp-pack2-bundle.jpg",
      "/images/pulp-serving-ritual.jpg",
      "/images/himroots-harvest-berries.jpg",
      "/images/sea-buckthorn-frost-harvest.jpg",
      "/images/himroots-sea-buckthorn-juice.jpg",
      "/images/himalayan-hero-peaks.jpg"
    ],
    category: "Wild Himalayan Pulp & Juice",
    ingredients: [
      "Sea Buckthorn (Hippophae rhamnoides) Pulp",
      "Curcumin Extract (Curcuma longa)",
      "Potassium Sorbate & Sodium Benzoate (preservatives)",
      "Demineralized water"
    ],
    detailedIngredients: [
      {
        name: "Sea Buckthorn (Hippophae rhamnoides) Pulp",
        percentage: "94%",
        benefits: [
          "Rare full-spectrum Omega 3, 6, 7 & 9 profile",
          "Up to 28x more Vitamin C than oranges",
          "190+ active phytonutrients, polyphenols and plant sterols"
        ]
      },
      {
        name: "Curcumin Extract (Curcuma longa)",
        percentage: "5%",
        benefits: [
          "Standardized curcuminoids for maximum anti-inflammatory support",
          "Neutralises systemic oxidative stress",
          "Synergistic cellular uptake amplified by berry lipids"
        ]
      },
      {
        name: "Demineralized Water & Permitted Preservatives",
        percentage: "1%",
        benefits: [
          "Potassium Sorbate & Sodium Benzoate to preserve active botanical freshness",
          "Maintains sterile stability across 12-month shelf life"
        ]
      }
    ],
    benefits: [
      "Helps Support Energy & Vitality",
      "Helps Reduce Inflammation",
      "Helps Promote Skin Health",
      "Helps Aid Gut & Digestive Health",
      "Helps Support Liver Function",
      "Helps Reduce Oxidative Stress"
    ],
    certifications: [
      "Cold Pressed",
      "Unfiltered",
      "Zero Added Sugar",
      "Liquid Pulp Concentrate",
      "Heavy Metal Free",
      "Contaminant Free",
      "Non-GMO, Third-Party Tested & cGMP Certified"
    ],
    directions: [
      "Mix 10ml in 200ml water, twice daily",
      "Best taken before meals (empty stomach for max absorption)",
      "Shake well before use (natural sediment is expected — sign of being unfiltered, not a defect)",
      "Benefits are cumulative — consistency over several weeks recommended",
      "Once opened, refrigerate and consume within 60 days"
    ],
    packagingFeature: "UV-protected amber canister with tamper-evident seal protecting active Omegas and Vitamin C",
    shelfLife: "12 months from manufacture",
    stock: 30,
    rating: 4.73,
    reviews: 11,
    featured: true
  },
  {
    id: "prod_002",
    name: "Himroots Sea Buckthorn Capsules",
    tagline: "Cellular Rejuvenation & Rare Omega-7",
    scriptQuote: "Himalayan Vitality in Every Capsule",
    slug: "sea-buckthorn-capsules",
    volume: "60 Softgels",
    description: "Formulated with 100% pure cold-pressed wild Himalayan Sea Buckthorn berry and seed oil. Each vegetarian softgel capsule delivers an exceptionally concentrated source of rare Omega-7 (palmitoleic acid), Omegas 3, 6, 9, natural carotenoids, and vitamin E to restore cellular health, support glowing skin, lubricate dry mucous membranes, and boost cardiovascular immunity.",
    price: 1199,
    originalPrice: 1499,
    images: [
      "/images/himroots-sea-buckthorn-capsules.jpg",
      "/images/capsules-omega7-cellular.jpg",
      "/images/capsules-skin-hydration.jpg",
      "/images/capsules-mucosal-comfort.jpg",
      "/images/capsules-clean-ingredients.jpg",
      "/images/capsules-quality-certifications.jpg",
      "/images/capsules-daily-ritual.jpg",
      "/images/capsules-pack2-bundle.jpg",
      "/images/capsules-apothecary.jpg",
      "/images/himalayan-harvest.jpg"
    ],
    category: "Daily Wellness Supplements",
    ingredients: [
      "100% Wild Himalayan Sea Buckthorn Berry & Seed Oil (Cold-Pressed)",
      "Plant Cellulose Softgel Shell",
      "Natural Vitamin E (D-Alpha Tocopherol)"
    ],
    detailedIngredients: [
      {
        name: "Sea Buckthorn Berry & Seed Oil",
        percentage: "85%",
        benefits: ["Unmatched source of rare Omega-7", "Omega 3, 6, 9 synergy", "Cellular membrane restoration"]
      },
      {
        name: "Bioactive Carotenoids & Lycopene",
        percentage: "10%",
        benefits: ["Shields skin against oxidative stress", "Promotes radiant golden complexion", "Supports eye and heart health"]
      },
      {
        name: "Natural Vitamin E (Tocopherol)",
        percentage: "5%",
        benefits: ["Protects fragile essential fatty acids", "Deep antioxidant support", "Maintains pristine botanical freshness"]
      }
    ],
    benefits: [
      "Highest Natural Concentration of Rare Omega-7",
      "Deep Skin Hydration & Barrier Repair",
      "Soothes & Lubricates Mucosal Linings (Dry Eyes & Gut)",
      "100% Vegetarian Softgel Delivery",
      "Zero Fillers, Preservatives, or Artificial Binders"
    ],
    certifications: [
      "100% Pure Cold-Pressed",
      "Rich in Omega-7",
      "Vegan Softgel",
      "Non-GMO & Hexane Free"
    ],
    directions: [
      "Take 1 to 2 softgel capsules daily with meals",
      "Swallow with a full glass of water",
      "Consistent use for 60 to 90 days recommended for optimal skin radiance and systemic benefits"
    ],
    packagingFeature: "UV-protective amber glass apothecary bottle with gold foil labeling and airtight metallic gold cap",
    stock: 65,
    rating: 4.9,
    reviews: 112,
    featured: true
  },
  {
    id: "prod_003",
    name: "Himalayan Sea Buckthorn Face Oil | Cold-Pressed | 30ml",
    tagline: "Radiance & Deep Nourishment for Skin",
    scriptQuote: "GLOW WITH THE GOLD OF HIMALAYAS",
    slug: "sea-buckthorn-face-oil",
    volume: "30 ml",
    description: "A luxurious cold-pressed facial oil derived from wild Himalayan Sea Buckthorn berries. Rich in rare Omega-7, natural carotenoids, and Vitamin E, this lightweight elixir absorbs quickly to deeply nourish, repair, and illuminate your skin. Ideal for all skin types, it helps reduce fine lines, fade dark spots, and restore a luminous, youthful glow — the way nature intended.",
    price: 799,
    originalPrice: 999,
    images: [
      "/images/himroots-sea-buckthorn-capsules.jpg",
      "/images/capsules-skin-hydration.jpg",
      "/images/capsules-clean-ingredients.jpg",
      "/images/himalayan-harvest.jpg"
    ],
    category: "Skin & Beauty",
    ingredients: [
      "Cold-Pressed Sea Buckthorn Seed Oil",
      "Cold-Pressed Sea Buckthorn Berry Oil",
      "Natural Vitamin E (Tocopherol)"
    ],
    detailedIngredients: [
      {
        name: "Sea Buckthorn Seed Oil",
        percentage: "60%",
        benefits: ["Rich in Omega 3, 6, 9", "Deep cellular nourishment", "Soothes inflamed skin"]
      },
      {
        name: "Sea Buckthorn Berry Oil",
        percentage: "35%",
        benefits: ["Rare Omega-7 for skin elasticity", "Golden carotenoids for radiance", "Powerful antioxidant protection"]
      },
      {
        name: "Natural Vitamin E",
        percentage: "5%",
        benefits: ["Preserves oil freshness naturally", "Additional antioxidant layer", "Supports skin barrier repair"]
      }
    ],
    benefits: [
      "Reduces Fine Lines & Wrinkles",
      "Fades Dark Spots & Pigmentation",
      "Deep Hydration Without Greasiness",
      "Repairs Sun-Damaged Skin",
      "Restores Natural Radiance"
    ],
    certifications: [
      "100% Cold-Pressed",
      "No Synthetic Fragrances",
      "Paraben Free",
      "Cruelty Free",
      "Non-GMO"
    ],
    directions: [
      "Apply 3-4 drops on clean, damp face and neck",
      "Gently massage in upward circular motions",
      "Use morning and night for best results",
      "Can be mixed with moisturizer or used as a serum"
    ],
    packagingFeature: "UV-protective amber glass dropper bottle with precision pipette for controlled application",
    shelfLife: "18 months from manufacture",
    stock: 45,
    rating: 4.8,
    reviews: 67,
    featured: true
  },
  {
    id: "prod_004",
    name: "Himalayan Sea Buckthorn Immunity Shots | Pack of 15",
    tagline: "Daily Defense in One Powerful Shot",
    scriptQuote: "SHIELD YOURSELF WITH HIMALAYAN POWER",
    slug: "sea-buckthorn-immunity-shots",
    volume: "15 × 20 ml shots",
    description: "Potent single-serve immunity shots combining wild-harvested Sea Buckthorn pulp with Turmeric, Black Pepper extract (Piperine), and raw Himalayan Honey. Each 20ml shot delivers a concentrated burst of Vitamin C, antioxidants, and anti-inflammatory compounds designed to fortify your body's natural defences. Perfect for travel, busy mornings, or seasonal wellness support.",
    price: 699,
    originalPrice: 899,
    images: [
      "/images/himroots-sea-buckthorn-pulp.jpg",
      "/images/pulp-190-bioactives.jpg",
      "/images/pulp-vitaminc-comparison.jpg",
      "/images/himalayan-hero-peaks.jpg"
    ],
    category: "Wild Himalayan Pulp & Juice",
    ingredients: [
      "Sea Buckthorn Pulp Concentrate",
      "Raw Himalayan Honey",
      "Turmeric Extract (Curcumin)",
      "Black Pepper Extract (Piperine)",
      "Purified Water"
    ],
    detailedIngredients: [
      {
        name: "Sea Buckthorn Pulp Concentrate",
        percentage: "70%",
        benefits: ["Up to 28x more Vitamin C than oranges", "Full-spectrum Omega profile", "190+ bioactive compounds"]
      },
      {
        name: "Turmeric & Piperine Complex",
        percentage: "15%",
        benefits: ["Enhanced curcumin bioavailability by 2000%", "Powerful anti-inflammatory action", "Supports joint and digestive health"]
      },
      {
        name: "Raw Himalayan Honey",
        percentage: "15%",
        benefits: ["Natural energy source", "Soothes throat and gut lining", "Enzyme-rich with natural prebiotics"]
      }
    ],
    benefits: [
      "Rapid Immunity Boost",
      "Convenient Single-Serve Format",
      "Anti-Inflammatory Support",
      "Natural Energy Without Caffeine",
      "Travel-Friendly Wellness"
    ],
    certifications: [
      "Cold Processed",
      "Zero Added Sugar",
      "No Preservatives",
      "Non-GMO",
      "Third-Party Tested"
    ],
    directions: [
      "Consume 1 shot daily, preferably in the morning on an empty stomach",
      "Shake the individual sachet well before tearing open",
      "Can be diluted in 50ml warm water if preferred",
      "For intensive support, take 2 shots daily during seasonal changes"
    ],
    packagingFeature: "Individual foil-sealed sachets in a recyclable kraft box for freshness and portability",
    shelfLife: "9 months from manufacture",
    stock: 80,
    rating: 4.65,
    reviews: 38,
    featured: false
  },
  {
    id: "prod_005",
    name: "Himalayan Sea Buckthorn Lip Balm | SPF 15 | 5g",
    tagline: "Nourish, Protect & Repair Dry Lips",
    scriptQuote: "HIMALAYAN CARE FOR YOUR SMILE",
    slug: "sea-buckthorn-lip-balm",
    volume: "5 g",
    description: "A deeply nourishing lip balm infused with cold-pressed Sea Buckthorn oil, Beeswax, Shea Butter, and natural SPF protection. The rare Omega-7 and Vitamin E content repairs cracked, chapped lips while creating a protective moisture barrier. Its subtle golden tint and delicate berry aroma make it a daily essential for healthy, supple lips in every season.",
    price: 299,
    originalPrice: 399,
    images: [
      "/images/capsules-skin-hydration.jpg",
      "/images/capsules-clean-ingredients.jpg",
      "/images/himalayan-harvest.jpg"
    ],
    category: "Skin & Beauty",
    ingredients: [
      "Cold-Pressed Sea Buckthorn Oil",
      "Organic Beeswax",
      "Shea Butter",
      "Coconut Oil",
      "Natural Vitamin E"
    ],
    detailedIngredients: [
      {
        name: "Sea Buckthorn Berry Oil",
        percentage: "30%",
        benefits: ["Omega-7 for deep lip repair", "Natural golden tint from carotenoids", "Antioxidant shield against UV damage"]
      },
      {
        name: "Shea Butter & Beeswax",
        percentage: "55%",
        benefits: ["Long-lasting moisture lock", "Creates protective barrier", "Softens and smooths lip texture"]
      },
      {
        name: "Coconut Oil & Vitamin E",
        percentage: "15%",
        benefits: ["Rapid absorption and hydration", "Prevents oxidative lip aging", "Natural antimicrobial properties"]
      }
    ],
    benefits: [
      "Heals Cracked & Chapped Lips",
      "SPF 15 Sun Protection",
      "Long-Lasting Moisture Barrier",
      "Subtle Natural Golden Tint",
      "Safe for Sensitive Skin"
    ],
    certifications: [
      "100% Natural Ingredients",
      "Paraben Free",
      "Petroleum Free",
      "Cruelty Free",
      "Dermatologist Tested"
    ],
    directions: [
      "Apply generously to lips as needed throughout the day",
      "Reapply after eating or drinking for continuous protection",
      "For overnight repair, apply a thick layer before bed",
      "Safe for daily use — no synthetic ingredients"
    ],
    packagingFeature: "Eco-friendly kraft tube with push-up mechanism — zero plastic packaging",
    shelfLife: "24 months from manufacture",
    stock: 120,
    rating: 4.85,
    reviews: 94,
    featured: false
  },
  {
    id: "prod_006",
    name: "Himalayan Herbal Wellness Tea | Sea Buckthorn & Tulsi | 50g",
    tagline: "Ancient Herbs, Modern Calm",
    scriptQuote: "BREW THE SERENITY OF THE MOUNTAINS",
    slug: "himalayan-herbal-tea",
    volume: "50 g (25 cups)",
    description: "A hand-blended herbal infusion combining dried Sea Buckthorn leaves, Holy Basil (Tulsi), Lemongrass, and Himalayan Chamomile. Each cup delivers calming adaptogens, gentle antioxidants, and a soothing warmth that supports stress relief, digestion, and restful sleep. Caffeine-free and naturally aromatic, it's the perfect evening ritual rooted in Himalayan botanical wisdom.",
    price: 499,
    originalPrice: 649,
    images: [
      "/images/himroots-harvest-berries.jpg",
      "/images/himalayan-hero-peaks.jpg",
      "/images/sea-buckthorn-frost-harvest.jpg",
      "/images/himalayan-harvest.jpg"
    ],
    category: "Herbal Teas & Infusions",
    ingredients: [
      "Dried Sea Buckthorn Leaves",
      "Holy Basil (Tulsi) Leaves",
      "Lemongrass",
      "Himalayan Chamomile Flowers",
      "Stevia Leaf (natural sweetener)"
    ],
    detailedIngredients: [
      {
        name: "Sea Buckthorn Leaves",
        percentage: "35%",
        benefits: ["Rich in flavonoids and tannins", "Supports cardiovascular health", "Natural anti-inflammatory properties"]
      },
      {
        name: "Holy Basil (Tulsi)",
        percentage: "30%",
        benefits: ["Potent adaptogen for stress relief", "Supports respiratory health", "Balances cortisol levels naturally"]
      },
      {
        name: "Lemongrass & Chamomile",
        percentage: "35%",
        benefits: ["Calming aromatic blend", "Aids digestion and reduces bloating", "Promotes deep, restful sleep"]
      }
    ],
    benefits: [
      "Stress Relief & Mental Calm",
      "Supports Digestive Comfort",
      "Promotes Restful Sleep",
      "Caffeine-Free Daily Ritual",
      "Rich in Natural Antioxidants"
    ],
    certifications: [
      "100% Caffeine Free",
      "Hand-Blended Small Batches",
      "No Artificial Flavours",
      "Sustainably Sourced",
      "FSSAI Certified"
    ],
    directions: [
      "Steep 1 teaspoon (2g) in 200ml freshly boiled water",
      "Cover and infuse for 4-5 minutes",
      "Strain and enjoy plain or with a drizzle of honey",
      "Best enjoyed in the evening for relaxation"
    ],
    packagingFeature: "Resealable matte kraft pouch with inner foil lining to preserve aroma and freshness",
    shelfLife: "18 months from manufacture",
    stock: 55,
    rating: 4.7,
    reviews: 42,
    featured: true
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  // Support legacy sea-buckthorn-juice slug as alias for sea-buckthorn-pulp
  if (slug === "sea-buckthorn-juice") {
    return products.find(p => p.slug === "sea-buckthorn-pulp");
  }
  return products.find(p => p.slug === slug);
};
