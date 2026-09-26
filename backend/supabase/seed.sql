-- =============================================================================
-- HIMROOTS WELLNESS — DATABASE SEED DATA
-- Description: Initial product records matching the existing storefront catalog
-- =============================================================================

INSERT INTO public.products (
    id,
    name,
    slug,
    tagline,
    script_quote,
    volume,
    description,
    price,
    original_price,
    images,
    category,
    ingredients,
    detailed_ingredients,
    benefits,
    certifications,
    directions,
    packaging_feature,
    stock_status,
    stock_quantity,
    rating,
    reviews_count,
    is_featured
) VALUES 
(
    'prod_001',
    'Himroots Pure Sea Buckthorn Pulp',
    'sea-buckthorn-pulp',
    'Nature''s Shield for Better Health',
    'Nature''s Goodness in Every Sip',
    '500 ml',
    'HIMROOTS Sea Buckthorn Pulp is made from handpicked, wild-harvested Himalayan sea buckthorn berries, rich in essential nutrients, vitamins and antioxidants. Formulated with 90% pure berry pulp and 5 synergistic Ayurvedic botanicals to nourish your body, boost immunity and support overall wellness.',
    999.00,
    1299.00,
    ARRAY[
        '/images/himroots-sea-buckthorn-pulp.jpg',
        '/images/himroots-sea-buckthorn-juice.jpg',
        '/images/pulp-serving-ritual.jpg',
        '/images/himroots-harvest-berries.jpg'
    ],
    'Wild Himalayan Pulp & Juice',
    ARRAY[
        '90% Wild Sea Buckthorn (Rich in Vitamin C, E & K)',
        '2% Bhoomi Amla (Liver health & Digestion)',
        '2% Makoy (Eye health & Respiratory wellness)',
        '2% Punarva (Kidney health & Natural detox)',
        '2% Ashwagandha (Stress reduction & Stamina)',
        '2% Safed Musli (Vitality & Overall wellness)'
    ],
    '[
        {"name": "Sea Buckthorn", "percentage": "90%", "benefits": ["Rich in Vitamin C, E & K", "Boosts immunity & skin health", "Powerful antioxidant"]},
        {"name": "Bhoomi Amla", "percentage": "2%", "benefits": ["Supports liver health", "Improves digestion", "Rich in natural antioxidants"]},
        {"name": "Makoy", "percentage": "2%", "benefits": ["Enhances eye health", "Rich in Vitamin A & antioxidants", "Supports respiratory wellness"]},
        {"name": "Punarva", "percentage": "2%", "benefits": ["Supports kidney & urinary health", "Reduces inflammation", "Aids natural detoxification"]},
        {"name": "Ashwagandha", "percentage": "2%", "benefits": ["Reduces stress & fatigue", "Boosts energy & stamina", "Supports hormonal balance"]},
        {"name": "Safed Musli", "percentage": "2%", "benefits": ["Enhances vitality & strength", "Supports reproductive health", "Improves overall wellness"]}
    ]'::jsonb,
    ARRAY[
        'Rich in Vitamin C & Bioactive Nutrients',
        'Antioxidant Powerhouse',
        'Supports Immune Health & Vitality',
        'Wild-Harvested Himalayan Purity',
        'Zero Added Sugar or Preservatives'
    ],
    ARRAY[
        '100% Natural',
        'No Added Sugar',
        'No Preservatives',
        'Vegan Friendly'
    ],
    ARRAY[
        'Shake well before use',
        'Best served chilled',
        'Take 30ml with equal parts lukewarm or fresh water daily in the morning on an empty stomach'
    ],
    'Premium cylindrical kraft canister with embossed gold foil logo & golden foil lid',
    'in_stock',
    50,
    4.90,
    148,
    true
),
(
    'prod_002',
    'Himroots Sea Buckthorn Capsules',
    'sea-buckthorn-capsules',
    'Cellular Rejuvenation & Rare Omega-7',
    'Himalayan Vitality in Every Capsule',
    '60 Softgels',
    'Formulated with 100% pure cold-pressed wild Himalayan Sea Buckthorn berry and seed oil. Each vegetarian softgel capsule delivers an exceptionally concentrated source of rare Omega-7 (palmitoleic acid), Omegas 3, 6, 9, natural carotenoids, and vitamin E to restore cellular health, support glowing skin, lubricate dry mucous membranes, and boost cardiovascular immunity.',
    1199.00,
    1499.00,
    ARRAY[
        '/images/himroots-sea-buckthorn-capsules.jpg',
        '/images/capsules-apothecary.jpg',
        '/images/himalayan-harvest.jpg'
    ],
    'Daily Wellness Supplements',
    ARRAY[
        '100% Wild Himalayan Sea Buckthorn Berry & Seed Oil (Cold-Pressed)',
        'Plant Cellulose Softgel Shell',
        'Natural Vitamin E (D-Alpha Tocopherol)'
    ],
    '[
        {"name": "Sea Buckthorn Berry & Seed Oil", "percentage": "85%", "benefits": ["Unmatched source of rare Omega-7", "Omega 3, 6, 9 synergy", "Cellular membrane restoration"]},
        {"name": "Bioactive Carotenoids & Lycopene", "percentage": "10%", "benefits": ["Shields skin against oxidative stress", "Promotes radiant golden complexion", "Supports eye and heart health"]},
        {"name": "Natural Vitamin E (Tocopherol)", "percentage": "5%", "benefits": ["Protects fragile essential fatty acids", "Deep antioxidant support", "Maintains pristine botanical freshness"]}
    ]'::jsonb,
    ARRAY[
        'Highest Natural Concentration of Rare Omega-7',
        'Deep Skin Hydration & Barrier Repair',
        'Soothes & Lubricates Mucosal Linings (Dry Eyes & Gut)',
        '100% Vegetarian Softgel Delivery',
        'Zero Fillers, Preservatives, or Artificial Binders'
    ],
    ARRAY[
        '100% Pure Cold-Pressed',
        'Rich in Omega-7',
        'Vegan Softgel',
        'Non-GMO & Hexane Free'
    ],
    ARRAY[
        'Take 1 to 2 softgel capsules daily with meals',
        'Swallow with a full glass of water',
        'Consistent use for 60 to 90 days recommended for optimal skin radiance and systemic benefits'
    ],
    'UV-protective amber glass apothecary bottle with gold foil labeling and airtight metallic gold cap',
    'in_stock',
    65,
    4.90,
    112,
    true
)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    tagline = EXCLUDED.tagline,
    script_quote = EXCLUDED.script_quote,
    volume = EXCLUDED.volume,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    images = EXCLUDED.images,
    category = EXCLUDED.category,
    ingredients = EXCLUDED.ingredients,
    detailed_ingredients = EXCLUDED.detailed_ingredients,
    benefits = EXCLUDED.benefits,
    certifications = EXCLUDED.certifications,
    directions = EXCLUDED.directions,
    packaging_feature = EXCLUDED.packaging_feature,
    stock_status = EXCLUDED.stock_status,
    stock_quantity = EXCLUDED.stock_quantity,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count,
    is_featured = EXCLUDED.is_featured,
    updated_at = timezone('utc'::text, now());
