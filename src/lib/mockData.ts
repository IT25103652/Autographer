export interface Theme {
  id: string;
  name: string;
  category: string;
  prompt: string;
  image: string;
  creditCost: number;
  authorId: string;
  authorName: string;
  isPopular?: boolean;
  isFavorite?: boolean;
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  skills: string[];
  verificationStatus: "pending" | "approved" | "rejected" | "none";
  earnings: number;
  rating: number;
  reviewCount: number;
  portfolio: string[];
}

export interface PhotographerAd {
  id: string;
  name: string;
  avatar: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: string;
  status: "pending" | "approved" | "rejected";
  isSponsored: boolean;
  contactEmail: string;
  phone: string;
  portfolio: string[];
  description: string;
}

export interface UserGeneration {
  id: string;
  userId: string;
  tool: "generator" | "style-transfer" | "enhancer" | "background" | "object-replacement";
  beforeUrl: string;
  afterUrl: string;
  themeName?: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: "purchase" | "spend" | "referral_reward" | "seller_earning";
  credits: number;
  amount?: number; // USD
  description: string;
  date: string;
}

export const CATEGORIES = [
  "Wedding",
  "Birthday",
  "Graduation",
  "Business",
  "Travel",
  "Fashion",
  "Luxury",
  "Studio",
  "Nature"
];

export const DEFAULT_THEMES: Theme[] = [
  {
    id: "t1",
    name: "Royal Garden Vows",
    category: "Wedding",
    prompt: "Cinematic wedding portrait, soft evening sunlight, lush rose gardens, elegant attire, extremely detailed face, 8k resolution, romantic warm color grading",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "admin",
    authorName: "Studio Elite",
    isPopular: true
  },
  {
    id: "t2",
    name: "Luxury Neon Celebration",
    category: "Birthday",
    prompt: "High-end birthday celebration, neon pink and violet balloon arch, glowing sparklers, luxury penthouse view, glamorous outfit, professional studio lighting",
    image: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "s1",
    authorName: "NeonVibes",
    isPopular: true
  },
  {
    id: "t3",
    name: "Ivy League Achievement",
    category: "Graduation",
    prompt: "Graduation portrait, historic university brick arches, holding diploma, academic cap and gown, morning soft light, proud expression, realistic skin details",
    image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "admin",
    authorName: "Studio Elite"
  },
  {
    id: "t4",
    name: "Executive Boardroom Elite",
    category: "Business",
    prompt: "Corporate executive headshot, modern high-rise office boardroom background, navy business suit, confident posture, soft studio key lighting, commercial depth of field",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "admin",
    authorName: "Studio Elite",
    isPopular: true
  },
  {
    id: "t5",
    name: "Santorini Sunsets",
    category: "Travel",
    prompt: "Travel influencer style portrait, iconic blue domes of Santorini Greece background, golden hour sunset glow, breezy linen outfit, cinematic color grading, high-end travel vlog look",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "s2",
    authorName: "WanderlustAI"
  },
  {
    id: "t6",
    name: "Cyberpunk Streetwear",
    category: "Fashion",
    prompt: "Futuristic fashion editorial, Tokyo alleyway with glowing neon signs, rainy night, reflections, high-tech jacket, purple and cyan lighting, dark atmosphere, ultra-realistic",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "s3",
    authorName: "CyberFX",
    isPopular: true
  },
  {
    id: "t7",
    name: "Monaco Yacht Breeze",
    category: "Luxury",
    prompt: "Sailing in Monaco on a superyacht, sparkling Mediterranean sea background, designer sunglasses, luxury leisurewear, sun-kissed lighting, premium lifestyle photography",
    image: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "s1",
    authorName: "NeonVibes"
  },
  {
    id: "t8",
    name: "Moody Rembrandt Lighting",
    category: "Studio",
    prompt: "Fine art studio portrait, dramatic dark background, single key light casting classic triangle shadow on cheek, rich texture, cinematic, award-winning portrait photography",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "admin",
    authorName: "Studio Elite"
  },
  {
    id: "t9",
    name: "Icelandic Aurora Glow",
    category: "Nature",
    prompt: "Adventure portrait, background showing dancing green Northern Lights in Iceland, snow-capped mountains, professional cold weather gear, ethereal night sky lighting",
    image: "https://images.unsplash.com/photo-1483168527879-c66136b56105?q=80&w=600&auto=format&fit=crop",
    creditCost: 3,
    authorId: "s2",
    authorName: "WanderlustAI"
  }
];

export const DEFAULT_SELLERS: Seller[] = [
  {
    id: "s1",
    name: "NeonVibes",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop",
    skills: ["Neon Lighting", "Cyberpunk", "Festival Themes", "Night Portraiture"],
    verificationStatus: "approved",
    earnings: 345.50,
    rating: 4.8,
    reviewCount: 42,
    portfolio: [
      "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=300",
      "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=300"
    ]
  },
  {
    id: "s2",
    name: "WanderlustAI",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop",
    skills: ["Landscape Blending", "Golden Hour", "Drone Perspectives", "Travel Styling"],
    verificationStatus: "approved",
    earnings: 210.00,
    rating: 4.9,
    reviewCount: 29,
    portfolio: [
      "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=300",
      "https://images.unsplash.com/photo-1483168527879-c66136b56105?q=80&w=300"
    ]
  },
  {
    id: "s3",
    name: "CyberFX",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=150&auto=format&fit=crop",
    skills: ["Futuristic Wearables", "Glow Effects", "Mecha Accents", "Anomalous Colors"],
    verificationStatus: "approved",
    earnings: 590.20,
    rating: 4.7,
    reviewCount: 68,
    portfolio: [
      "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300"
    ]
  }
];

export const DEFAULT_PHOTOGRAPHERS: PhotographerAd[] = [
  {
    id: "p1",
    name: "Amesh Wijesinghe",
    avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?q=80&w=150&auto=format&fit=crop",
    location: "Colombo, Sri Lanka",
    rating: 4.9,
    reviewCount: 56,
    price: "$50 - $150 / hr",
    status: "approved",
    isSponsored: true,
    contactEmail: "amesh.photo@gmail.com",
    phone: "+94 77 123 4567",
    description: "Specializing in luxury wedding photography and modern editorial portraits in Colombo. Experienced in combining natural light with expert styling.",
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=300",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=300"
    ]
  },
  {
    id: "p2",
    name: "Sarah Jenkins",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=150&auto=format&fit=crop",
    location: "New York, USA",
    rating: 4.8,
    reviewCount: 88,
    price: "$150 - $300 / hr",
    status: "approved",
    isSponsored: true,
    contactEmail: "sarah@jenkinsphoto.com",
    phone: "+1 (555) 987-6543",
    description: "NYC-based commercial fashion photographer. Producing state of the art runway portfolios, influencer branding shoots, and model headshots.",
    portfolio: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=300"
    ]
  },
  {
    id: "p3",
    name: "Kasun Perera",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop",
    location: "Kandy, Sri Lanka",
    rating: 4.7,
    reviewCount: 24,
    price: "$30 - $80 / hr",
    status: "approved",
    isSponsored: false,
    contactEmail: "kasun.perera.photography@outlook.com",
    phone: "+94 81 987 6543",
    description: "Candid lifestyle photographer capturing family, birthday events, and graduation ceremonies. Passionate about capturing real, warm moments.",
    portfolio: [
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=300"
    ]
  }
];

export const DEFAULT_GENERATIONS: UserGeneration[] = [
  {
    id: "g1",
    userId: "u1",
    tool: "generator",
    beforeUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&auto=format&fit=crop", // Ordinary portrait
    afterUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop", // Executive headshot
    themeName: "Executive Boardroom Elite",
    createdAt: "2026-06-23T14:30:00Z"
  },
  {
    id: "g2",
    userId: "u1",
    tool: "background",
    beforeUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=300&auto=format&fit=crop", // Santorini blend
    themeName: "Santorini Background Replace",
    createdAt: "2026-06-24T18:15:00Z"
  }
];

export const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: "tx1",
    userId: "u1",
    type: "purchase",
    credits: 100,
    amount: 9.00,
    description: "Purchased Premium Subscription Plan",
    date: "2026-06-01T09:00:00Z"
  },
  {
    id: "tx2",
    userId: "u1",
    type: "spend",
    credits: 3,
    description: "Generated photo using theme 'Executive Boardroom Elite'",
    date: "2026-06-23T14:30:00Z"
  },
  {
    id: "tx3",
    userId: "u1",
    type: "spend",
    credits: 2,
    description: "Performed Background Replacement 'Santorini'",
    date: "2026-06-24T18:15:00Z"
  },
  {
    id: "tx4",
    userId: "u1",
    type: "referral_reward",
    credits: 10,
    description: "Referral signup bonus for friend (Rohan)",
    date: "2026-06-24T19:00:00Z"
  }
];

export const MOCK_BACKGROUNDS = [
  { id: "bg_beach", name: "Maldives Sandy Beach", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=500&auto=format&fit=crop" },
  { id: "bg_office", name: "Modern High-Rise Office", url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=500&auto=format&fit=crop" },
  { id: "bg_hotel", name: "Luxury Penthouse Lounge", url: "https://images.unsplash.com/photo-1582719478250-c89cae4db85b?q=80&w=500&auto=format&fit=crop" },
  { id: "bg_city", name: "Neon Cyberpunk City Alley", url: "https://images.unsplash.com/photo-1515621061946-eff1c2a352bd?q=80&w=500&auto=format&fit=crop" },
  { id: "bg_nature", name: "Alpine Forest at Sunset", url: "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=500&auto=format&fit=crop" },
  { id: "bg_studio", name: "Classic Studio Grey Backdrop", url: "https://images.unsplash.com/photo-1554050857-c84a8abdb5e2?q=80&w=500&auto=format&fit=crop" }
];

export const MOCK_OBJECTS = {
  outfits: [
    { id: "out_tux", name: "Black Slim-Fit Tuxedo" },
    { id: "out_blazer", name: "Beige Summer Linen Blazer" },
    { id: "out_cyber", name: "Glowing Cyberpunk Leather Jacket" },
    { id: "out_dress", name: "Elegant Silk Dinner Gown" }
  ],
  accessories: [
    { id: "acc_rolex", name: "Luxury Gold Chronograph Watch" },
    { id: "acc_glasses", name: "Classic Aviator Sunglasses" },
    { id: "acc_necklace", name: "Diamond Pendant Necklace" },
    { id: "acc_cap", name: "Academic Graduation Mortarboard" }
  ],
  hairstyles: [
    { id: "hair_pompadour", name: "Textured Slick-Back Pompadour" },
    { id: "hair_fade", name: "Modern High Skin Fade" },
    { id: "hair_waves", name: "Elegant Loose Beach Waves" },
    { id: "hair_bob", name: "Chic Sharp Blunt Bob" }
  ]
};

// Selection of sample face photos to allow users to click and generate mock photos
export const MOCK_SAMPLE_FACES = [
  { name: "Alex (Male)", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop" },
  { name: "Sophia (Female)", url: "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop" },
  { name: "Marcus (Male)", url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop" },
  { name: "Chloe (Female)", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop" }
];

// Presets mapping face upload index + theme to output image
export const GENERATOR_OUTPUT_MAPPING: Record<string, string> = {
  // Alex mapping
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=200&auto=format&fit=crop": "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop", // Business
  // Sophia mapping
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=200&auto=format&fit=crop": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop", // Studio Portrait
  // Marcus mapping
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop": "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop", // Wedding
  // Chloe mapping
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop": "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=600&auto=format&fit=crop"  // Fashion
};

export const MOCK_GEN_FALLBACK = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop";
