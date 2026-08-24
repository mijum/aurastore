import { Product } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  // ==================== CLOTHING ====================
  {
    id: 'prod-cloth-1',
    slug: 'oversized-heavyweight-hoodie',
    name: 'Oversized Heavyweight Hoodie',
    category: 'Clothing',
    price: 3450,
    discountPrice: 2850,
    rating: 4.8,
    reviewCount: 142,
    description: 'Crafted from 480 GSM French terry cotton, this oversized hoodie combines extreme comfort with modern streetwear aesthetics. Featuring dropped shoulders, double-layered hood, and ribbed cuffs for a relaxed yet structured fit.',
    details: [
      '100% Organic Heavyweight French Terry Cotton (480 GSM)',
      'Pre-shrunk fabric to maintain perfect fit after wash',
      'Kangaroo pocket with reinforced bar-tack stitching',
      'Double-lined structured hood without drawstrings for a clean look',
      'Ethically made in certified sustainable mills'
    ],
    specifications: {
      'Material': '100% French Terry Cotton',
      'Weight': '480 GSM',
      'Fit': 'Relaxed / Oversized',
      'Care': 'Machine wash cold, lay flat to dry',
      'Country of Origin': 'Bangladesh'
    },
    stock: 24,
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Onyx Black', hex: '#111827' },
      { name: 'Heather Grey', hex: '#9ca3af' },
      { name: 'Sand Beige', hex: '#d1b89d' }
    ],
    featured: true,
    newArrival: false,
    tags: ['hoodie', 'oversized', 'streetwear', 'cotton', 'winter', 'clothing'],
    reviews: [
      {
        id: 'rev-101',
        userName: 'Tanvir Ahmed',
        rating: 5,
        date: '2026-07-28',
        comment: 'The 480 GSM fabric is genuinely top-tier. Heavy, cozy, and holds its shape perfectly even after several washes. Highly recommended!',
        verifiedPurchase: true
      },
      {
        id: 'rev-102',
        userName: 'Sadia Rahman',
        rating: 5,
        date: '2026-08-02',
        comment: 'Great oversized silhouette. The Sand Beige color looks even richer in person.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-cloth-2',
    slug: 'minimalist-linen-shirt',
    name: 'Minimalist Linen Shirt',
    category: 'Clothing',
    price: 2600,
    discountPrice: 2199,
    rating: 4.7,
    reviewCount: 89,
    description: 'Breathable, lightweight, and effortlessly refined. Made from 100% natural European flax linen, this relaxed-fit button-down offers optimal cooling during warmer climates with an understated luxury drape.',
    details: [
      '100% Pure European Flax Linen',
      'Soft-washed for an immediate lived-in comfort',
      'Mother-of-pearl buttons with clean topstitch finish',
      'Camp collar silhouette suitable for both casual and semi-formal wear',
      'Naturally antibacterial and moisture-wicking'
    ],
    specifications: {
      'Material': '100% European Flax Linen',
      'Collar': 'Cuban / Camp Collar',
      'Fit': 'Regular Relaxed',
      'Care': 'Hand wash or gentle cold cycle',
      'Season': 'Spring / Summer'
    },
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Ivory White', hex: '#f8fafc' },
      { name: 'Sage Green', hex: '#84a98c' },
      { name: 'Navy Blue', hex: '#1e3a8a' }
    ],
    featured: false,
    newArrival: true,
    tags: ['linen', 'shirt', 'summer', 'minimalist', 'casual', 'clothing'],
    reviews: [
      {
        id: 'rev-103',
        userName: 'Arafat Hossain',
        rating: 5,
        date: '2026-08-10',
        comment: 'Extremely comfortable in Dhaka weather. The linen breathes well and looks smart.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-cloth-3',
    slug: 'classic-wool-trench-coat',
    name: 'Classic Wool Trench Coat',
    category: 'Clothing',
    price: 8900,
    discountPrice: 7490,
    rating: 4.9,
    reviewCount: 64,
    description: 'A timeless cold-weather masterpiece. Tailored from an insulating Australian wool blend, featuring structured shoulder epaulets, double-breasted button closure, storm flap, and a detachable waist tie belt.',
    details: [
      '80% Recycled Australian Wool, 20% Technical Polyamide',
      'Satin-smooth viscose interior lining for frictionless layering',
      'Deep dual welt pockets and interior passport pocket',
      'Adjustable wrist buckle straps and rear center vent',
      'Water and wind-resistant surface treatment'
    ],
    specifications: {
      'Shell': '80% Wool, 20% Polyamide',
      'Lining': '100% Viscose',
      'Closure': 'Double-Breasted Horn Buttons',
      'Length': 'Mid-Calf',
      'Care': 'Dry clean only'
    },
    stock: 8,
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1544022613-e87ca75a784a?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel Tan', hex: '#c19a6b' },
      { name: 'Midnight Black', hex: '#0f172a' }
    ],
    featured: true,
    newArrival: false,
    tags: ['coat', 'trench', 'wool', 'luxury', 'outerwear', 'clothing'],
    reviews: [
      {
        id: 'rev-104',
        userName: 'Mahir Chowdhury',
        rating: 5,
        date: '2026-07-15',
        comment: 'Worth every single Taka. The drape and finish match luxury designer brands.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-cloth-4',
    slug: 'relaxed-cargo-trousers',
    name: 'Relaxed Cargo Trousers',
    category: 'Clothing',
    price: 3100,
    discountPrice: 2499,
    rating: 4.6,
    reviewCount: 95,
    description: 'Functional utilitarian design built for everyday movement. Engineered with stretch ripstop cotton, articulated knee darts, multiple ergonomic cargo pockets, and adjustable bungee toggles at the hems.',
    details: [
      '98% Heavyweight Cotton Ripstop, 2% Elastane for subtle flex',
      '6-pocket tactical design with hidden magnetic snap closures',
      'Elasticated waistband with durable integrated drawstring',
      'Reinforced seat and knee panels for maximum longevity'
    ],
    specifications: {
      'Material': 'Stretch Cotton Ripstop',
      'Fit': 'Relaxed Tapered',
      'Pockets': '6 Functional Pockets',
      'Care': 'Machine wash cold, inside out'
    },
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['30', '32', '34', '36'],
    colors: [
      { name: 'Olive Green', hex: '#4b5320' },
      { name: 'Matte Black', hex: '#18181b' },
      { name: 'Desert Khaki', hex: '#c2b280' }
    ],
    featured: false,
    newArrival: true,
    tags: ['cargo', 'pants', 'trousers', 'streetwear', 'utility', 'clothing'],
    reviews: [
      {
        id: 'rev-105',
        userName: 'Fahim Faisal',
        rating: 4,
        date: '2026-08-05',
        comment: 'Great fit and durable pockets. The bungee toggles at the bottom make it look great with sneakers.',
        verifiedPurchase: true
      }
    ]
  },

  // ==================== SHOES ====================
  {
    id: 'prod-shoe-1',
    slug: 'stealth-runner-sneakers',
    name: 'Stealth Runner Sneakers',
    category: 'Shoes',
    price: 6499,
    discountPrice: 5299,
    rating: 4.9,
    reviewCount: 218,
    description: 'Next-generation running sneakers combining futuristic aerodynamics with ultra-cushioned EVA foam responsiveness. Breathable engineered mesh upper keeps your feet cool while carbon-reinforced shank provides explosive energy return.',
    details: [
      'Engineered Aerodynamic FlyMesh Upper for 360° airflow',
      'High-rebound Dual-Density CloudEVA Midsole',
      'Anti-abrasion Vibram-grade rubber traction outsole',
      'Anatomical memory foam insole with arch support',
      'Reflective 3M accents for low-light night running'
    ],
    specifications: {
      'Weight': '265g (Size 42)',
      'Drop': '8mm',
      'Upper': 'Engineered Recycled Mesh',
      'Sole': 'Responsive EVA + Carbon Plate',
      'Usage': 'Daily Running & Lifestyle'
    },
    stock: 22,
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['40', '41', '42', '43', '44', '45'],
    colors: [
      { name: 'Triple Red', hex: '#dc2626' },
      { name: 'Stealth Black', hex: '#09090b' },
      { name: 'Chalk White', hex: '#f4f4f5' }
    ],
    featured: true,
    newArrival: false,
    tags: ['shoes', 'sneakers', 'running', 'sport', 'footwear', 'lifestyle'],
    reviews: [
      {
        id: 'rev-201',
        userName: 'Zubair Al Mamun',
        rating: 5,
        date: '2026-08-01',
        comment: 'Crazy comfort! Wore it for a 10k run right out of the box with zero blisters.',
        verifiedPurchase: true
      },
      {
        id: 'rev-202',
        userName: 'Rifat Hasan',
        rating: 5,
        date: '2026-07-22',
        comment: 'Looks stunning and ultra lightweight. Size 42 fits true to size.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-shoe-2',
    slug: 'leather-chelsea-boots',
    name: 'Leather Chelsea Boots',
    category: 'Shoes',
    price: 7800,
    discountPrice: 6690,
    rating: 4.8,
    reviewCount: 110,
    description: 'Handcrafted Goodyear-welted Chelsea boots made from full-grain Italian calfskin leather. Built with reinforced elastic side gussets and heavy-duty pull tabs for effortless slip-on versatility and enduring elegance.',
    details: [
      'Full-Grain Hand-Burnished Calfskin Leather',
      'Traditional Goodyear Welt construction (re-soleable)',
      'Supple cowhide leather lining with cushioned cork bed',
      'Custom studded rubber command outsole for all-weather grip',
      'Water-repellent leather treatment'
    ],
    specifications: {
      'Upper': 'Full-Grain Calfskin',
      'Construction': 'Goodyear Welted',
      'Insole': 'Cork-filled Leather Insole',
      'Shaft Height': '6 inches',
      'Care': 'Leather balm & horsehair brush'
    },
    stock: 12,
    images: [
      'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['41', '42', '43', '44'],
    colors: [
      { name: 'Dark Chestnut', hex: '#582f0e' },
      { name: 'Obsidian Black', hex: '#1c1917' }
    ],
    featured: true,
    newArrival: false,
    tags: ['boots', 'chelsea', 'leather', 'formal', 'shoes', 'footwear'],
    reviews: [
      {
        id: 'rev-203',
        userName: 'Kazi Naimur',
        rating: 5,
        date: '2026-08-04',
        comment: 'The leather smells and feels authentic. Unbelievable craftsmanship for this price point.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-shoe-3',
    slug: 'aero-air-athletic-shoes',
    name: 'Aero Air Athletic Shoes',
    category: 'Shoes',
    price: 5200,
    discountPrice: 4400,
    rating: 4.6,
    reviewCount: 77,
    description: 'Lightweight cross-trainers designed for high-intensity gym workouts, crossfit, and agility drills. Features wide toe-box stabilization and high-grip rubber wrap.',
    details: [
      'Reinforced TPU side-cage for lateral stability',
      'Shock-absorbing Air Cushion pod heel system',
      'Sweat-wicking interior lining with odor protection',
      'Flat wide heel base engineered for heavy lifting stability'
    ],
    specifications: {
      'Upper': 'Breathable Knit + TPU Overlay',
      'Sole': 'Air Cushion Midsole',
      'Weight': '280g',
      'Target Activity': 'Gym / Cross Training / HIIT'
    },
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['40', '41', '42', '43', '44'],
    colors: [
      { name: 'Glacier Blue', hex: '#38bdf8' },
      { name: 'Cyber Neon', hex: '#a3e635' },
      { name: 'Carbon Grey', hex: '#4b5563' }
    ],
    featured: false,
    newArrival: true,
    tags: ['gym', 'training', 'shoes', 'athletic', 'footwear'],
    reviews: [
      {
        id: 'rev-204',
        userName: 'Imran Kabir',
        rating: 4,
        date: '2026-07-30',
        comment: 'Very stable for squats and lunges. Great value for money.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-shoe-4',
    slug: 'urban-street-high-tops',
    name: 'Urban Street High-Tops',
    category: 'Shoes',
    price: 5900,
    discountPrice: 4950,
    rating: 4.7,
    reviewCount: 135,
    description: 'Iconic retro high-top silhouette reimagined for modern streetwear culture. Premium suede and leather panels with cushioned ankle collar support and classic vulcanized cupsole.',
    details: [
      'Combination of premium split suede and nappa leather',
      'Padded high-cut collar for all-day ankle support',
      'Vintage off-white textured rubber outsole',
      'Includes dual set of flat waxed cotton laces'
    ],
    specifications: {
      'Upper': 'Suede & Leather',
      'Sole': 'Vulcanized Rubber Cupsole',
      'Style': 'Retro High-Top',
      'Fit': 'True to size'
    },
    stock: 9,
    images: [
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['41', '42', '43', '44'],
    colors: [
      { name: 'Panda B&W', hex: '#000000' },
      { name: 'Vintage Olive', hex: '#556b2f' }
    ],
    featured: false,
    newArrival: true,
    tags: ['hightop', 'sneakers', 'streetwear', 'retro', 'shoes'],
    reviews: [
      {
        id: 'rev-205',
        userName: 'Shakil Anwar',
        rating: 5,
        date: '2026-08-08',
        comment: 'Looks super stylish with relaxed cargo pants. 10/10.',
        verifiedPurchase: true
      }
    ]
  },

  // ==================== ACCESSORIES ====================
  {
    id: 'prod-acc-1',
    slug: 'polarized-aviator-sunglasses',
    name: 'Polarized Aviator Sunglasses',
    category: 'Accessories',
    price: 3200,
    discountPrice: 2490,
    rating: 4.9,
    reviewCount: 180,
    description: 'Engineered with Japanese surgical-grade stainless steel wire frames and TAC polarized lenses. Provides 100% UV400 protection, crystal clarity, and glare reduction in direct sunlight.',
    details: [
      'Grade 316L Stainless Steel ultralight frame (only 18 grams)',
      'Triacetate Cellulose (TAC) 9-layer polarized lenses',
      '100% UVA/UVB/UVC protection (UV400 certified)',
      'Hypoallergenic adjustable silicone nose pads',
      'Includes magnetic hard leather travel case & microfiber pouch'
    ],
    specifications: {
      'Frame Material': '316L Surgical Stainless Steel',
      'Lens Type': 'Polarized TAC UV400',
      'Weight': '18g',
      'Dimensions': '58mm lens width - 14mm bridge - 140mm temple'
    },
    stock: 30,
    images: [
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Gunmetal Gold', hex: '#d4af37' },
      { name: 'Matte Graphite', hex: '#374151' },
      { name: 'Midnight Silver', hex: '#e5e7eb' }
    ],
    featured: true,
    newArrival: false,
    tags: ['sunglasses', 'polarized', 'aviator', 'accessories', 'eyewear'],
    reviews: [
      {
        id: 'rev-301',
        userName: 'Nafis Iqbal',
        rating: 5,
        date: '2026-08-07',
        comment: 'No glare while driving in bright sun. Premium feel and very light.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-acc-2',
    slug: 'italian-full-grain-leather-belt',
    name: 'Italian Full-Grain Leather Belt',
    category: 'Accessories',
    price: 2400,
    discountPrice: 1950,
    rating: 4.8,
    reviewCount: 92,
    description: 'Precision cut from single-piece vegetable-tanned Italian leather that develops a gorgeous, unique patina over time. Fitted with a solid brushed brass buckle.',
    details: [
      '100% Full-Grain Tuscan Vegetable-Tanned Leather (3.8mm thick)',
      'Solid antique brushed brass hardware',
      'Beveled and burnished edges for smooth loop insertion',
      'Lifetime structural warranty'
    ],
    specifications: {
      'Width': '35mm (1.38 inches)',
      'Material': 'Vegetable-Tanned Italian Leather',
      'Buckle': 'Solid Brass with Antique Finish'
    },
    stock: 20,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['32', '34', '36', '38', '40'],
    colors: [
      { name: 'Cognac Brown', hex: '#9a3412' },
      { name: 'Jet Black', hex: '#18181b' }
    ],
    featured: false,
    newArrival: false,
    tags: ['belt', 'leather', 'accessories', 'formal'],
    reviews: [
      {
        id: 'rev-302',
        userName: 'Rashedul Islam',
        rating: 5,
        date: '2026-07-19',
        comment: 'Solid thick leather that doesn’t bend or crack. Top quality!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-acc-3',
    slug: 'minimalist-titanium-cardholder',
    name: 'Minimalist Titanium Cardholder',
    category: 'Accessories',
    price: 1850,
    discountPrice: 1490,
    rating: 4.7,
    reviewCount: 160,
    description: 'Ultra-slim RFID-blocking cardholder made from aviation-grade titanium and carbon fiber. Holds 1-12 cards securely with a quick-access thumb notch and integrated money clip.',
    details: [
      'Grade 5 Aerospace Titanium with anti-scratch matte coating',
      'Certified RFID-blocking technology protects against wireless theft',
      'Flexible elastic band expands seamlessly from 1 to 12 cards',
      'Integrated spring-steel cash clip for paper notes'
    ],
    specifications: {
      'Capacity': 'Up to 12 cards + 10 bills',
      'Dimensions': '86 x 54 x 6 mm',
      'Weight': '42 grams',
      'RFID Protection': '13.56 MHz frequency shielded'
    },
    stock: 35,
    images: [
      'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Carbon Black', hex: '#1f2937' },
      { name: 'Titanium Grey', hex: '#6b7280' }
    ],
    featured: false,
    newArrival: true,
    tags: ['wallet', 'cardholder', 'titanium', 'rfid', 'accessories'],
    reviews: [
      {
        id: 'rev-303',
        userName: 'Tariq Monjur',
        rating: 5,
        date: '2026-08-11',
        comment: 'Goodbye bulky leather wallet. This fits in front pocket with zero bulge.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-acc-4',
    slug: 'cashmere-ribbed-beanie',
    name: 'Cashmere Ribbed Beanie',
    category: 'Accessories',
    price: 1950,
    discountPrice: 1550,
    rating: 4.9,
    reviewCount: 72,
    description: 'Luxuriously soft Mongolian cashmere knitted in a snug ribbed pattern. Keeps your head warm without causing itchiness or overheating.',
    details: [
      '100% Grade-A Mongolian Cashmere (2-ply 12-gauge knit)',
      'Ultra-soft touch with zero prickle factor',
      'Turn-up cuff allows adjustable depth and styling',
      'Naturally thermoregulating'
    ],
    specifications: {
      'Material': '100% Mongolian Cashmere',
      'Knit': '7x7 Ribbed',
      'Care': 'Hand wash lukewarm, lay flat on towel'
    },
    stock: 16,
    images: [
      'https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Charcoal Melange', hex: '#374151' },
      { name: 'Oatmeal Beige', hex: '#e7e5e4' },
      { name: 'Navy', hex: '#1e3a8a' }
    ],
    featured: false,
    newArrival: false,
    tags: ['beanie', 'cashmere', 'winter', 'hat', 'accessories'],
    reviews: [
      {
        id: 'rev-304',
        userName: 'Anika Tabassum',
        rating: 5,
        date: '2026-07-25',
        comment: 'So soft and warm! Love the oatmeal color.',
        verifiedPurchase: true
      }
    ]
  },

  // ==================== ELECTRONICS ====================
  {
    id: 'prod-elec-1',
    slug: 'studio-wireless-anc-headphones',
    name: 'Studio Wireless ANC Headphones',
    category: 'Electronics',
    price: 14500,
    discountPrice: 11990,
    rating: 4.9,
    reviewCount: 340,
    description: 'Audiophile-grade 40mm beryllium drivers paired with hybrid Active Noise Cancellation (ANC) delivering up to 42dB of ambient noise reduction. Enjoy 50 hours of battery life with ultra-plush memory foam earcups.',
    details: [
      'Custom 40mm Beryllium Dynamic Drivers with Hi-Res Audio certification',
      'Hybrid Adaptive ANC with Transparency Ambient Mode',
      '50 Hours playtime with ANC on (70 hours with ANC off)',
      'Multipoint Bluetooth 5.3 + lossless USB-C / 3.5mm wired connectivity',
      'Quad-microphone array with AI beamforming noise suppression for crystal clear calls'
    ],
    specifications: {
      'Frequency Response': '10Hz - 40,000Hz',
      'Bluetooth': 'v5.3 (LDAC, AAC, SBC codecs)',
      'Battery Life': '50h ANC / Fast Charge: 10m gives 5h',
      'Weight': '255g',
      'Warranty': '1 Year Official Warranty'
    },
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Matte Obsidian', hex: '#18181b' },
      { name: 'Silver Cloud', hex: '#e2e8f0' },
      { name: 'Midnight Navy', hex: '#1e3a8a' }
    ],
    featured: true,
    newArrival: false,
    tags: ['headphones', 'wireless', 'anc', 'audio', 'bluetooth', 'electronics'],
    reviews: [
      {
        id: 'rev-401',
        userName: 'Shahriar Khan',
        rating: 5,
        date: '2026-08-09',
        comment: 'ANC easily rivals the Sony XM5 and Bose QuietComfort at half the price. Bass is punchy and highs are sparkling.',
        verifiedPurchase: true
      },
      {
        id: 'rev-402',
        userName: 'Tasnim Jahan',
        rating: 5,
        date: '2026-07-31',
        comment: 'Battery lasts forever! I charge it maybe twice a month. Extremely comfortable cushions.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-elec-2',
    slug: 'lumina-ambient-smart-speaker',
    name: 'Lumina Ambient Smart Speaker',
    category: 'Electronics',
    price: 6800,
    discountPrice: 5690,
    rating: 4.7,
    reviewCount: 114,
    description: 'Fill your room with 360-degree acoustic fidelity and reactive ambient lighting. Equipped with dual passive radiators, room calibration sensors, and voice assistant compatibility.',
    details: [
      '360° Omnidirectional audio with 35W output',
      'Dynamic RGB ambient halo with music sync and circadian sleep modes',
      'Wi-Fi 6 streaming (AirPlay 2, Spotify Connect) + Bluetooth 5.2',
      'Built-in far-field microphone for smart home control'
    ],
    specifications: {
      'Audio Output': '35W RMS (Dual Tweeters + Subwoofer)',
      'Connectivity': 'Wi-Fi 6 / Bluetooth 5.2 / AUX',
      'Lighting': '16.8M Color Ambient LED',
      'Dimensions': '180mm x 110mm'
    },
    stock: 11,
    images: [
      'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Arctic White', hex: '#f8fafc' },
      { name: 'Space Grey', hex: '#334155' }
    ],
    featured: false,
    newArrival: true,
    tags: ['speaker', 'smart', 'audio', 'ambient', 'bluetooth', 'electronics'],
    reviews: [
      {
        id: 'rev-403',
        userName: 'Adnan Sami',
        rating: 5,
        date: '2026-08-06',
        comment: 'The lighting mode at night creates an amazing ambiance while listening to lo-fi music.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-elec-3',
    slug: 'pulse-ultra-smartwatch',
    name: 'Pulse Ultra Smartwatch',
    category: 'Electronics',
    price: 9200,
    discountPrice: 7990,
    rating: 4.8,
    reviewCount: 195,
    description: 'Precision aerospace titanium casing with a sapphire crystal 1.96-inch AMOLED display (2000 nits peak brightness). Comprehensive health tracking including ECG, blood oxygen (SpO2), sleep stages, and dual-frequency GPS.',
    details: [
      '1.96" Ultra-Bright AMOLED Display with Always-On Mode',
      'Dual-band GNSS GPS for pinpoint outdoor route mapping',
      '5 ATM + IP68 Water Resistance (swimming ready)',
      '14-day battery life on standard mode, 48 hours in continuous GPS mode',
      'Over 110+ sports modes with auto-detection'
    ],
    specifications: {
      'Display': '1.96" AMOLED (410x502 px, 2000 nits)',
      'Case': 'Grade 2 Titanium + Ceramic back',
      'Water Rating': '50m (5 ATM)',
      'Sensors': 'Optical HR, SpO2, Skin Temp, Barometer, ECG'
    },
    stock: 19,
    images: [
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Titanium Silver', hex: '#94a3b8' },
      { name: 'Stealth Black', hex: '#0f172a' },
      { name: 'Alpine Orange', hex: '#ea580c' }
    ],
    featured: true,
    newArrival: false,
    tags: ['smartwatch', 'fitness', 'wearable', 'gps', 'electronics'],
    reviews: [
      {
        id: 'rev-404',
        userName: 'Dr. Muniruzzaman',
        rating: 5,
        date: '2026-08-03',
        comment: 'Heart rate accuracy matches my dedicated chest strap. Battery lasts over 10 days easily.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-elec-4',
    slug: 'magsafe-dual-fast-charger',
    name: 'MagSafe Dual Fast Charger',
    category: 'Electronics',
    price: 3600,
    discountPrice: 2950,
    rating: 4.6,
    reviewCount: 88,
    description: 'Foldable 3-in-1 magnetic wireless charging station engineered with aircraft aluminum. Fast charges your phone (15W), smartwatch (5W), and wireless earbuds (5W) simultaneously on a single cable.',
    details: [
      '15W Qi2 / MagSafe certified ultra-fast magnetic alignment',
      'Foldable travel-friendly design fits in your pocket',
      'Smart temperature control chipset prevents overheating',
      'Includes 30W GaN PD wall adapter and braided USB-C cable'
    ],
    specifications: {
      'Total Output': '25W Max (15W + 5W + 5W)',
      'Input': 'USB-C PD 30W+',
      'Material': 'Aluminum Alloy + Soft Silicone',
      'Compatibility': 'iOS & Android Qi-enabled devices'
    },
    stock: 25,
    images: [
      'https://images.unsplash.com/photo-1622445262464-84b1456045b6?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Space Grey', hex: '#374151' },
      { name: 'Starlight White', hex: '#f8fafc' }
    ],
    featured: false,
    newArrival: true,
    tags: ['charger', 'magsafe', 'wireless', 'electronics', 'accessories'],
    reviews: [
      {
        id: 'rev-405',
        userName: 'Rezaul Karim',
        rating: 4,
        date: '2026-07-20',
        comment: 'Essential travel gadget. Folds completely flat and eliminated 3 separate chargers from my bag.',
        verifiedPurchase: true
      }
    ]
  },

  // ==================== BAGS ====================
  {
    id: 'prod-bag-1',
    slug: 'water-resistant-commuter-backpack',
    name: 'Water-Resistant Commuter Backpack',
    category: 'Bags',
    price: 5400,
    discountPrice: 4490,
    rating: 4.9,
    reviewCount: 230,
    description: 'Engineered for daily urban transit and business travel. Built with ballistic 1000D Cordura nylon, waterproof YKK Aquaguard zippers, dedicated 16-inch suspended laptop vault, and hidden anti-theft passport pocket.',
    details: [
      '1000D Cordura ballistic nylon with hydrophobic DWR coating',
      'Suspended shock-absorbing 16" laptop & tablet compartment',
      'Clamshell 180-degree opening for effortless packing',
      'Luggage pass-through strap for rolling suitcase handles',
      'Ergonomic EVA memory-foam shoulder straps and sternum buckle'
    ],
    specifications: {
      'Capacity': '24 Liters',
      'Weight': '980g',
      'Dimensions': '46 x 30 x 16 cm',
      'Laptop Fit': 'Up to 16-inch MacBook Pro / Dell XPS',
      'Waterproof Rating': 'Heavy Rain Proof (IPX4)'
    },
    stock: 17,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Matte Stealth Black', hex: '#0f172a' },
      { name: 'Urban Slate', hex: '#475569' }
    ],
    featured: true,
    newArrival: false,
    tags: ['backpack', 'commuter', 'waterproof', 'laptop', 'bags'],
    reviews: [
      {
        id: 'rev-501',
        userName: 'Arman Habib',
        rating: 5,
        date: '2026-08-12',
        comment: 'Survived heavy monsoon rain on my motorbike without a drop leaking through. Laptop remained bone dry!',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-bag-2',
    slug: 'canvas-weekend-duffle-bag',
    name: 'Canvas Weekend Duffle Bag',
    category: 'Bags',
    price: 4900,
    discountPrice: 3950,
    rating: 4.8,
    reviewCount: 97,
    description: 'Rugged 18oz waxed canvas combined with rich top-grain leather trim. Features an isolated ventilated shoe tunnel, heavy-duty brass hardware, and detachable padded shoulder sling.',
    details: [
      'Heavyweight 18oz paraffin waxed cotton canvas',
      'Separate zippered bottom shoe / laundry compartment',
      'Full-grain leather carry handles with snap fastener',
      'Compliant with standard international airline carry-on regulations'
    ],
    specifications: {
      'Volume': '42 Liters',
      'Dimensions': '52 x 28 x 28 cm',
      'Weight': '1.35 kg',
      'Usage': 'Weekend Getaway / Gym / Travel'
    },
    stock: 14,
    images: [
      'https://images.unsplash.com/photo-1547949003-9792a18a2601?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Army Olive Canvas', hex: '#4b5320' },
      { name: 'Vintage Khaki', hex: '#c2b280' }
    ],
    featured: false,
    newArrival: true,
    tags: ['duffle', 'travel', 'canvas', 'gym', 'bags'],
    reviews: [
      {
        id: 'rev-502',
        userName: 'Taufiq Omar',
        rating: 5,
        date: '2026-07-29',
        comment: 'Fits 3 days of clothes plus extra shoes easily. Very durable feel.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-bag-3',
    slug: 'heritage-leather-messenger-bag',
    name: 'Heritage Leather Messenger Bag',
    category: 'Bags',
    price: 7200,
    discountPrice: 5990,
    rating: 4.7,
    reviewCount: 68,
    description: 'Classic professional satchel crafted from thick oiled pull-up leather. Features dual antique push-lock buckles under the flap, organizer sleeves for pens and stationery, and padded laptop partition.',
    details: [
      '100% Genuine Full-Grain Oiled Pull-up Leather',
      'Solid cast alloy hardware in antique brass finish',
      'Padded sleeve fits laptops up to 14.5 inches',
      'Reinforced top briefcase handle and adjustable leather shoulder strap'
    ],
    specifications: {
      'Material': 'Full-Grain Oiled Leather',
      'Laptop Capacity': 'Up to 14.5 inches',
      'Dimensions': '39 x 29 x 10 cm'
    },
    stock: 6,
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Vintage Saddle Tan', hex: '#854d0e' },
      { name: 'Deep Espresso', hex: '#3e2723' }
    ],
    featured: false,
    newArrival: false,
    tags: ['messenger', 'leather', 'briefcase', 'office', 'bags'],
    reviews: [
      {
        id: 'rev-503',
        userName: 'Barrister Ehsan',
        rating: 5,
        date: '2026-08-01',
        comment: 'Exquisite look in corporate meetings. Ample space for files and laptop.',
        verifiedPurchase: true
      }
    ]
  },

  // ==================== WATCHES ====================
  {
    id: 'prod-watch-1',
    slug: 'chronograph-minimalist-watch',
    name: 'Chronograph Minimalist Watch',
    category: 'Watches',
    price: 8900,
    discountPrice: 7490,
    rating: 4.9,
    reviewCount: 175,
    description: 'Bauhaus-inspired precision chronograph featuring a Japanese Seiko VK63 Meca-Quartz movement, combining mechanical sweep-second tactile reset with quartz quartz reliability. Domed scratch-resistant sapphire crystal.',
    details: [
      'Seiko VK63 Meca-Quartz hybrid movement with 1/5th sec chronograph',
      'Double-domed Sapphire crystal with inner anti-reflective coating',
      '316L Marine-Grade Stainless Steel 40mm case',
      '5 ATM (50m) Water Resistance',
      'Includes quick-release Italian calfskin leather strap'
    ],
    specifications: {
      'Case Diameter': '40mm',
      'Case Thickness': '11.2mm',
      'Lug Width': '20mm',
      'Movement': 'Japanese Seiko VK63 Meca-Quartz',
      'Glass': 'AR-Coated Sapphire Crystal'
    },
    stock: 18,
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Silver & White Dial', hex: '#e2e8f0' },
      { name: 'Rose Gold & Midnight', hex: '#e0a96d' },
      { name: 'Stealth All-Black', hex: '#18181b' }
    ],
    featured: true,
    newArrival: false,
    tags: ['watch', 'chronograph', 'sapphire', 'minimalist', 'luxury', 'watches'],
    reviews: [
      {
        id: 'rev-601',
        userName: 'Mahmudur Rahman',
        rating: 5,
        date: '2026-08-10',
        comment: 'The mechanical snap-back action of the chrono hand is so satisfying. The sapphire crystal is crystal clear.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-watch-2',
    slug: 'automatic-mechanical-skeleton-watch',
    name: 'Automatic Mechanical Skeleton Watch',
    category: 'Watches',
    price: 15800,
    discountPrice: 12990,
    rating: 4.8,
    reviewCount: 94,
    description: 'An open-heart window into horological art. 24-jewel self-winding mechanical movement with 42 hours power reserve, visible balance wheel, custom exhibition caseback, and 316L solid link jubilee bracelet.',
    details: [
      '24-Jewel Automatic Self-Winding Movement (21,600 vph)',
      '42-hour power reserve with bi-directional winding rotor',
      'Full open skeleton dial with luminous Super-LumiNova BGW9 hands',
      'Solid link stainless steel bracelet with butterfly deployment clasp',
      '10 ATM (100m) Water Resistance with screw-down crown'
    ],
    specifications: {
      'Movement': 'Automatic Caliber 24-Jewels (Self & Hand Wind)',
      'Power Reserve': '42 Hours',
      'Case': '316L Stainless Steel 41mm',
      'Water Resistance': '100 meters / 10 ATM'
    },
    stock: 7,
    images: [
      'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1547996160-71dfa63582d8?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Stainless Silver & Blue', hex: '#3b82f6' },
      { name: 'Gunmetal Skeleton', hex: '#4b5563' }
    ],
    featured: true,
    newArrival: true,
    tags: ['automatic', 'mechanical', 'skeleton', 'watch', 'luxury', 'watches'],
    reviews: [
      {
        id: 'rev-602',
        userName: 'Zayd Al-Hasan',
        rating: 5,
        date: '2026-07-26',
        comment: 'Mesmerizing to watch the balance wheel oscillating. High-end finish and solid weight on wrist.',
        verifiedPurchase: true
      }
    ]
  },
  {
    id: 'prod-watch-3',
    slug: 'horizon-diver-stainless-watch',
    name: 'Horizon Diver Stainless Watch',
    category: 'Watches',
    price: 11200,
    discountPrice: 9450,
    rating: 4.9,
    reviewCount: 140,
    description: 'Professional dive watch rated to 200 meters (20 ATM) with 120-click unidirectional ceramic bezel, luminous indices, cyclops date magnifier, and helium escape valve simulation.',
    details: [
      '200m / 20 ATM Diver certification with screw-down crown',
      'Scratch-proof polished ceramic 120-click rotating bezel',
      'Swiss Super-LumiNova C3 ultra-bright green night glow',
      'Solid oyster link bracelet with dive extension lock'
    ],
    specifications: {
      'Case': '42mm 316L Stainless Steel',
      'Bezel': 'Polished Ceramic Unidirectional',
      'Depth Rating': '200 meters (660 ft)',
      'Crystal': 'Sapphire with 2.5x Date Magnifier'
    },
    stock: 15,
    images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=1000&q=80'
    ],
    colors: [
      { name: 'Deep Sea Black', hex: '#0f172a' },
      { name: 'Emerald Sunray', hex: '#047857' },
      { name: 'Pepsi Blue & Red', hex: '#1e40af' }
    ],
    featured: false,
    newArrival: false,
    tags: ['diver', 'watch', 'ceramic', 'waterproof', 'watches'],
    reviews: [
      {
        id: 'rev-603',
        userName: 'Jamil Ahmed',
        rating: 5,
        date: '2026-08-04',
        comment: 'The ceramic bezel clicks crisply. Lume is like a torch at night!',
        verifiedPurchase: true
      }
    ]
  },

  // Extra items to round out stock tests and variety:
  {
    id: 'prod-cloth-5',
    slug: 'tailored-oxford-cotton-shirt',
    name: 'Tailored Oxford Cotton Shirt',
    category: 'Clothing',
    price: 2400,
    discountPrice: 1999,
    rating: 4.7,
    reviewCount: 52,
    description: 'Traditional button-down collar Oxford shirt woven from premium two-ply long staple cotton. Durable, breathable, and an absolute wardrobe staple.',
    details: [
      '100% 2-ply Long Staple Combed Cotton',
      'Button-down collar with authentic roll',
      'Box pleat with locker loop at the back',
      'Curved hem for tucked or untucked styling'
    ],
    specifications: {
      'Fabric': 'Pinpoint Oxford Cotton',
      'Fit': 'Slim Tailored',
      'Care': 'Machine wash warm, warm iron'
    },
    stock: 0, // Test Out of stock state!
    images: [
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1000&q=80'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Sky Blue', hex: '#bae6fd' },
      { name: 'Crisp White', hex: '#ffffff' }
    ],
    featured: false,
    newArrival: false,
    tags: ['shirt', 'oxford', 'formal', 'clothing'],
    reviews: []
  }
];

export const VALID_COUPONS = [
  {
    code: 'AURA20',
    discountPercentage: 20,
    description: '20% discount on entire order'
  },
  {
    code: 'FREESHIP',
    freeShipping: true,
    description: 'Free express or standard shipping'
  },
  {
    code: 'SAVE500',
    fixedDiscount: 500,
    minSpend: 3000,
    description: '৳500 flat discount on orders over ৳3,000'
  }
];

export const SHIPPING_CONFIG = {
  standardCost: 120, // ৳120 inside Bangladesh
  expressCost: 250,  // ৳250 express fast delivery
  freeShippingThreshold: 5000, // Free standard shipping on orders >= ৳5,000
  taxRate: 0.05 // 5% VAT
};

export const DEFAULT_SHIPPING_SETTINGS = {
  dhakaCityFee: 60,
  dhakaSubAreaFee: 80,
  outsideDhakaFee: 120,
  expressSurcharge: 130,
  freeDeliveryEnabled: true,
  freeDeliveryMinAmount: 5000,
  freeDeliveryMinItems: 3,
  freeDeliveryRequirement: 'EITHER' as const,
  taxRate: 0.05,
};
