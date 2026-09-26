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
      "/images/himroots-sea-buckthorn-juice.jpg",
      "/images/pulp-serving-ritual.jpg",
      "/images/himroots-harvest-berries.jpg",
      "/images/sea-buckthorn-frost-harvest.jpg",
      "/images/himalayan-hero-peaks.jpg"
    ],
    category: "Wild Himalayan Pulp & Juice",
    ingredients: [
      "Pure Wild Himalayan Sea Buckthorn Pulp (Rich in Vitamin C, Omegas 3, 6, 7 & 9)",
      "Curcumin Extract (Standardized Curcuminoids for Enhanced Bioavailability)",
      "Naturally Occurring Plant Sterols, Polyphenols & Carotenoids"
    ],
    detailedIngredients: [
      {
        name: "Wild Sea Buckthorn Pulp",
        percentage: "95%",
        benefits: [
          "Rare full-spectrum Omega 3, 6, 7 & 9 profile",
          "Up to 28x more Vitamin C than oranges",
          "190+ active phytonutrients and plant sterols"
        ]
      },
      {
        name: "Standardized Curcumin Extract",
        percentage: "5%",
        benefits: [
          "Potent anti-inflammatory compound",
          "Neutralises systemic oxidative stress",
          "Synergistic cellular uptake with berry lipids"
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
      "Cold Pressed & Unfiltered",
      "Zero Added Sugar",
      "Heavy Metal Free",
      "Contaminant Free"
    ],
    directions: [
      "Shake the bottle well before use",
      "Mix 10 ml (2 tsp) in 200 ml of fresh or lukewarm water",
      "Take twice daily, before meals for optimal absorption",
      "Note: Natural black residue is due to unfiltered sea buckthorn seed particles",
      "Once opened, refrigerate and consume within 60 days"
    ],
    packagingFeature: "UV-protected amber canister with tamper-evident seal protecting active Omegas and Vitamin C",
    stock: 40,
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
  }
];

export const getProductBySlug = (slug: string): Product | undefined => {
  // Support legacy sea-buckthorn-juice slug as alias for sea-buckthorn-pulp
  if (slug === "sea-buckthorn-juice") {
    return products.find(p => p.slug === "sea-buckthorn-pulp");
  }
  return products.find(p => p.slug === slug);
};
