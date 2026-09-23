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
    name: "Himroots Pure Sea Buckthorn Pulp",
    tagline: "Nature's Shield for Better Health",
    scriptQuote: "Nature's Goodness in Every Sip",
    slug: "sea-buckthorn-pulp",
    volume: "500 ml",
    description: "HIMROOTS Sea Buckthorn Pulp is made from handpicked, wild-harvested Himalayan sea buckthorn berries, rich in essential nutrients, vitamins and antioxidants. Formulated with 90% pure berry pulp and 5 synergistic Ayurvedic botanicals to nourish your body, boost immunity and support overall wellness.",
    price: 999,
    originalPrice: 1299,
    images: [
      "/images/himroots-sea-buckthorn-pulp.jpg",
      "/images/himroots-sea-buckthorn-juice.jpg",
      "/images/pulp-serving-ritual.jpg",
      "/images/himroots-harvest-berries.jpg"
    ],
    category: "Wild Himalayan Pulp & Juice",
    ingredients: [
      "90% Wild Sea Buckthorn (Rich in Vitamin C, E & K)",
      "2% Bhoomi Amla (Liver health & Digestion)",
      "2% Makoy (Eye health & Respiratory wellness)",
      "2% Punarva (Kidney health & Natural detox)",
      "2% Ashwagandha (Stress reduction & Stamina)",
      "2% Safed Musli (Vitality & Overall wellness)"
    ],
    detailedIngredients: [
      {
        name: "Sea Buckthorn",
        percentage: "90%",
        benefits: ["Rich in Vitamin C, E & K", "Boosts immunity & skin health", "Powerful antioxidant"]
      },
      {
        name: "Bhoomi Amla",
        percentage: "2%",
        benefits: ["Supports liver health", "Improves digestion", "Rich in natural antioxidants"]
      },
      {
        name: "Makoy",
        percentage: "2%",
        benefits: ["Enhances eye health", "Rich in Vitamin A & antioxidants", "Supports respiratory wellness"]
      },
      {
        name: "Punarva",
        percentage: "2%",
        benefits: ["Supports kidney & urinary health", "Reduces inflammation", "Aids natural detoxification"]
      },
      {
        name: "Ashwagandha",
        percentage: "2%",
        benefits: ["Reduces stress & fatigue", "Boosts energy & stamina", "Supports hormonal balance"]
      },
      {
        name: "Safed Musli",
        percentage: "2%",
        benefits: ["Enhances vitality & strength", "Supports reproductive health", "Improves overall wellness"]
      }
    ],
    benefits: [
      "Rich in Vitamin C & Bioactive Nutrients",
      "Antioxidant Powerhouse",
      "Supports Immune Health & Vitality",
      "Wild-Harvested Himalayan Purity",
      "Zero Added Sugar or Preservatives"
    ],
    certifications: [
      "100% Natural",
      "No Added Sugar",
      "No Preservatives",
      "Vegan Friendly"
    ],
    directions: [
      "Shake well before use",
      "Best served chilled",
      "Take 30ml with equal parts lukewarm or fresh water daily in the morning on an empty stomach"
    ],
    packagingFeature: "Premium cylindrical kraft canister with embossed gold foil logo & golden foil lid",
    stock: 50,
    rating: 4.9,
    reviews: 148,
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
