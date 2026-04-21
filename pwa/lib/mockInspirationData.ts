// Mock data for inspiration testing — Enhanced for Premium UI/UX

// Configuration for mock data behavior
export const MOCK_CONFIG = {
  ENABLE_MOCK_DATA: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_ENABLE_MOCK_DATA === 'true',
  MOCK_DELAY: 500, // ms delay to simulate API calls
  ENABLE_RANDOM_DATA: true, // Add slight variations to make data feel more dynamic
  FALLBACK_TO_MOCK: true, // Use mock data when API fails
  ENABLE_LOCALIZATION: true, // Support multiple languages
  ENABLE_INTERACTIONS: true, // Simulate user interactions
};

// Utility to add realistic delays for testing loading states
export const mockApiDelay = (min = 200, max = 1000) => {
  const delay = Math.random() * (max - min) + min;
  return new Promise(resolve => setTimeout(resolve, delay));
};

// Localization support - TODO: Implement when needed

export interface MockComment {
    id: number;
    author: {
        name: string;
        avatar?: string;
        isVerified?: boolean;
    };
    content: string;
    createdAt: string;
    likes?: number;
    replies?: MockComment[];
}

export interface MockUserInteraction {
    userId?: number;
    articleId?: number;
    photoId?: number;
    type?: 'like' | 'bookmark' | 'comment' | 'share' | 'photo_like';
    createdAt?: string;
    isLiked?: boolean;
    isBookmarked?: boolean;
    newLikeCount?: number;
    rating?: number;
    comment?: string;
    user?: { name: string; avatar?: string };
    metadata?: Record<string, unknown>;
    [key: string]: unknown;
}


// Testing utilities for different scenarios
// NOTE: Returns a function instead of a plain object to avoid TDZ
// (mockArticleCategories etc. are declared later in this file)
export const getMockScenarios = () => ({
    // Empty state testing
    EMPTY: {
        articles: [],
        articleCategories: [],
        photos: [],
    },

    // Error state testing
    ERROR: null,

    // Loading state (can be used with delays)
    LOADING: {
        articles: Array(3).fill(null).map((_, i) => ({ id: i, loading: true })),
        articleCategories: mockArticleCategories,
        photos: mockInspirationPhotos,
    },

    // Large dataset for performance testing
    LARGE_DATASET: {
        articles: Array(50).fill(null).map((_, i) => ({
            ...mockArticles[i % mockArticles.length],
            id: i + 1,
            title: `${mockArticles[i % mockArticles.length].title} ${i + 1}`,
            slug: `${mockArticles[i % mockArticles.length].slug}-${i + 1}`,
        })),
        articleCategories: mockArticleCategories,
        photos: Array(100).fill(null).map((_, i) => ({
            ...mockInspirationPhotos[i % mockInspirationPhotos.length],
            id: i + 1,
            "@id": `/api/inspiration_photos/${i + 1}`,
        })),
    },
});

// Keep backwards-compatible alias (evaluated lazily via getter)
export const MOCK_SCENARIOS = new Proxy({} as ReturnType<typeof getMockScenarios>, {
    get(_target, prop) {
        return getMockScenarios()[prop as keyof ReturnType<typeof getMockScenarios>];
    },
});

// Search and filtering utilities
export interface SearchFilters {
  query?: string;
  category?: string;
  style?: string;
  city?: string;
  tags?: string[];
  hasComments?: boolean;
  isLiked?: boolean;
  minLikes?: number;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
  limit?: number;
  offset?: number;
}

export const searchArticles = (filters: SearchFilters): MockArticle[] => {
  let results = [...mockArticles];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(article =>
      article.title.toLowerCase().includes(query) ||
      article.excerpt.toLowerCase().includes(query) ||
      article.content.toLowerCase().includes(query) ||
      article.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Category filter
  if (filters.category) {
    results = results.filter(article => article.category.slug === filters.category);
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(article =>
      filters.tags!.some(tag => article.tags.includes(tag))
    );
  }

  // Sorting
  switch (filters.sortBy) {
    case 'newest':
      results.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      break;
    case 'oldest':
      results.sort((a, b) => new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime());
      break;
    case 'popular':
      results.sort((a, b) => (b.readTime || 0) - (a.readTime || 0));
      break;
    default:
      break;
  }

  // Pagination
  if (filters.offset) {
    results = results.slice(filters.offset);
  }
  if (filters.limit) {
    results = results.slice(0, filters.limit);
  }

  return results;
};

export const searchPhotos = (filters: SearchFilters): MockInspirationPhoto[] => {
  let results = [...mockInspirationPhotos];

  // Text search
  if (filters.query) {
    const query = filters.query.toLowerCase();
    results = results.filter(photo =>
      photo.caption.toLowerCase().includes(query) ||
      photo.style.toLowerCase().includes(query) ||
      photo.category?.name.toLowerCase().includes(query) ||
      photo.city?.name.toLowerCase().includes(query) ||
      photo.tags?.some(tag => tag.toLowerCase().includes(query)) ||
      photo.photographer?.toLowerCase().includes(query)
    );
  }

  // Category filter
  if (filters.category) {
    results = results.filter(photo => photo.category?.name.toLowerCase() === filters.category?.toLowerCase());
  }

  // Style filter
  if (filters.style) {
    results = results.filter(photo => photo.style.toLowerCase() === filters.style?.toLowerCase());
  }

  // City filter
  if (filters.city) {
    results = results.filter(photo => photo.city?.name.toLowerCase() === filters.city?.toLowerCase());
  }

  // Tags filter
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter(photo =>
      photo.tags?.some(tag => filters.tags!.includes(tag))
    );
  }

  // Comments filter
  if (filters.hasComments) {
    results = results.filter(photo => photo.comments && photo.comments.length > 0);
  }

  // Likes filter
  if (filters.isLiked !== undefined) {
    results = results.filter(photo => photo.isLiked === filters.isLiked);
  }

  if (filters.minLikes) {
    results = results.filter(photo => (photo.likes || 0) >= filters.minLikes!);
  }

  // Sorting
  switch (filters.sortBy) {
    case 'popular':
      results.sort((a, b) => (b.likes || 0) - (a.likes || 0));
      break;
    case 'trending':
      results.sort((a, b) => {
        const aComments = a.comments?.length || 0;
        const bComments = b.comments?.length || 0;
        return (bComments + (b.likes || 0)) - (aComments + (a.likes || 0));
      });
      break;
    default:
      results.sort((a, b) => b.id - a.id); // Newest first by default
  }

  // Pagination
  if (filters.offset) {
    results = results.slice(filters.offset);
  }
  if (filters.limit) {
    results = results.slice(0, filters.limit);
  }

  return results;
};

// User interaction simulation
export const simulateUserInteraction = (
  type: 'like' | 'bookmark' | 'comment',
  itemId: number,
  itemType: 'article' | 'photo',
  userId: number = 1
): MockUserInteraction => {
  return {
    userId,
    [itemType === 'article' ? 'articleId' : 'photoId']: itemId,
    type,
    createdAt: new Date().toISOString(),
    metadata: {
      timestamp: Date.now(),
      userAgent: 'MockUser/1.0',
    }
  };
};

// Real-time updates simulation
export const simulateRealTimeUpdate = (callback: (update: MockUserInteraction) => void) => {
  if (!MOCK_CONFIG.ENABLE_INTERACTIONS) return;

  const interval = setInterval(() => {
    // Simulate random likes/comments on photos
    const randomPhoto = mockInspirationPhotos[Math.floor(Math.random() * mockInspirationPhotos.length)];
    const updateType = Math.random() > 0.7 ? 'comment' : 'like';

    if (updateType === 'like' && randomPhoto.likes) {
      randomPhoto.likes += 1;
      callback({
        type: 'photo_like',
        photoId: randomPhoto.id,
        newLikeCount: randomPhoto.likes,
        user: {
          name: 'Anonymous User',
          avatar: `https://images.unsplash.com/photo-${Math.floor(Math.random() * 100000000)}?w=40&q=80`
        }
      });
    }
  }, 30000); // Update every 30 seconds

  return () => clearInterval(interval);
};

export interface MockArticle {
    id: number;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    featuredImage: string;
    publishedAt: string;
    isFeatured: boolean;
    featuredOrder?: number;
    category: {
        id: number;
        name: string;
        slug: string;
    };
    tags: string[];
    readTime?: number; // in minutes
    author?: {
        name: string;
        avatar?: string;
    };
}

export interface MockArticleCategory {
    id: number;
    name: string;
    slug: string;
    description?: string;
    articleCount?: number;
}

export interface MockInspirationPhoto {
    id: number;
    imagePath: string;
    caption: string;
    style: string;
    "@id": string; // API Platform IRI
    category?: { name: string };
    city?: { name: string };
    likes?: number;
    isLiked?: boolean;
    isBookmarked?: boolean;
    tags?: string[];
    photographer?: string;
    location?: { name: string; coordinates?: { lat: number; lng: number } };
    comments?: MockComment[];
    author?: {
        name: string;
        avatar?: string;
        isVerified?: boolean;
    };
    createdAt?: string;
}




export interface MockWeddingStory {
    id: number;
    coupleNames: string;
    location: string;
    vibe: string;
    coverImage: string;
    description: string;
    gallery: string[];
    vendorCredits: Array<{ role: string; name: string; slug: string }>;
    isFeatured: boolean;
    style: string;
    season: string;
    colorPalette: string[];
    celebrationTimeline: Array<{ time: string; event: string; description: string }>;
    guestCount?: number;
    budget?: string;
}

export const mockArticleCategories: MockArticleCategory[] = [
    {
        id: 1,
        name: "Planning Tips",
        slug: "planning-tips",
        description: "Essential guides for organizing your perfect Moroccan wedding",
        articleCount: 12,
    },
    {
        id: 2,
        name: "Beauty & Style",
        slug: "beauty-style",
        description: "From traditional henna to modern bridal looks",
        articleCount: 8,
    },
    {
        id: 3,
        name: "Moroccan Traditions",
        slug: "moroccan-traditions",
        description: "Honoring time-honored customs and ceremonies",
        articleCount: 15,
    },
    {
        id: 4,
        name: "Wedding Stories",
        slug: "wedding-stories",
        description: "Real couples sharing their magical moments",
        articleCount: 6,
    },
    {
        id: 5,
        name: "Vendor Spotlight",
        slug: "vendor-spotlight",
        description: "Meet the artisans crafting unforgettable experiences",
        articleCount: 9,
    },
];

export const mockArticles: MockArticle[] = [
    {
        id: 1,
        title: "Top 5 Tips for Choosing Your Riad Venue",
        slug: "top-5-tips-choosing-riad-venue",
        excerpt: "Planning a wedding in a Riad requires special attention to guest count and acoustics.",
        content: `Riads offer an intimate and authentic Moroccan experience. However, when choosing one for your wedding, consider the layout, the central patio capacity, and the noise regulations in the Médina.

Key considerations include:
• Guest capacity and seating arrangements
• Acoustic properties for music and speeches
• Lighting options for evening ceremonies
• Accessibility for elderly guests
• Backup plans for weather-dependent activities

Many couples find that the riad's traditional architecture creates the perfect backdrop for both intimate ceremonies and lively celebrations.`,
        featuredImage: "moroccan_wedding_centerpiece",
        publishedAt: "2024-04-15T10:00:00Z",
        isFeatured: true,
        featuredOrder: 1,
        readTime: 5,
        category: {
            id: 1,
            name: "Planning Tips",
            slug: "planning-tips",
        },
        author: {
            name: "Fatima Alaoui",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80",
        },
        tags: ["#RiadWedding", "#Casablanca", "#Planning101"],
    },
    {
        id: 2,
        title: "The Art of the Negrafa: What to Expect",
        slug: "art-negrafa-what-to-expect",
        excerpt: "Understand the pivotal role of the Negrafa in a traditional Moroccan wedding.",
        content: `The Negrafa is more than just a stylist; she is the guardian of tradition. From the Lebssa Mezgouda to the Amariya entrance, she ensures every moment is majestic.

The Negrafa typically:
• Oversees the bride's preparation ceremony
• Coordinates with musicians and dancers
• Manages the timing of traditional rituals
• Ensures cultural authenticity throughout the celebration

Modern couples often blend traditional Negrafa guidance with contemporary styling preferences, creating weddings that honor heritage while feeling fresh and personal.`,
        featuredImage: "moroccan_bride_negafa",
        publishedAt: "2024-04-10T14:30:00Z",
        isFeatured: false,
        readTime: 7,
        category: {
            id: 3,
            name: "Moroccan Traditions",
            slug: "moroccan-traditions",
        },
        author: {
            name: "Karim Bennani",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
        },
        tags: ["#Traditions", "#Negafa", "#Culture"],
    },
    {
        id: 3,
        title: "Modern Moroccan Wedding Trends 2024",
        slug: "modern-moroccan-wedding-trends-2024",
        excerpt: "How contemporary couples are blending tradition with modern elegance.",
        content: `This year, we're seeing a beautiful fusion of traditional Moroccan elements with contemporary design. From minimalist Zellige patterns to modern takes on traditional ceremonies.

Popular trends include:
• Sustainable and eco-friendly celebrations
• Fusion cuisine combining Moroccan and international flavors
• Digital elements in traditional ceremonies
• Gender-neutral celebrations
• Micro-weddings with intimate guest lists

The key is maintaining cultural authenticity while incorporating personal style and modern sensibilities.`,
        featuredImage: "moroccan_table_setting",
        publishedAt: "2024-04-08T09:15:00Z",
        isFeatured: false,
        readTime: 6,
        category: {
            id: 2,
            name: "Beauty & Style",
            slug: "beauty-style",
        },
        author: {
            name: "Leila Tazi",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
        },
        tags: ["#ModernWedding", "#Trends2024", "#MoroccanStyle"],
    },
    {
        id: 4,
        title: "A Boho Chic Riad Wedding in Marrakech",
        slug: "boho-chic-riad-wedding-marrakech",
        excerpt: "Layla and Mehdi's intimate celebration captured the magic of Morocco.",
        content: `Nestled in the heart of Marrakech's Médina, Layla and Mehdi created a wedding that perfectly balanced bohemian freedom with Moroccan tradition. Their intimate celebration for 45 guests became the stuff of legend.

Highlights included:
• A sunset ceremony in a hidden riad courtyard
• Traditional Moroccan musicians mixed with acoustic guitar
• A candlelit dinner under the stars
• Henna ceremony incorporating both families' traditions

The couple's authentic celebration showed how modern couples can honor Moroccan heritage while expressing their unique personalities.`,
        featuredImage: "riad_sunset_wedding",
        publishedAt: "2024-04-05T16:45:00Z",
        isFeatured: false,
        readTime: 8,
        category: {
            id: 4,
            name: "Wedding Stories",
            slug: "wedding-stories",
        },
        author: {
            name: "Sara Alaoui",
            avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&q=80",
        },
        tags: ["#WeddingStory", "#Marrakech", "#BohoChic"],
    },
    {
        id: 5,
        title: "The Perfect Moroccan Wedding Cake",
        slug: "perfect-moroccan-wedding-cake",
        excerpt: "From traditional almond pastries to modern tiered cakes with Arabesque designs.",
        content: `Moroccan wedding cakes have evolved from simple almond-based pastries to elaborate multi-tiered creations that incorporate traditional motifs. Modern bakers are creating stunning cakes that blend Moroccan aesthetics with contemporary techniques.

Traditional elements often include:
• Arabesque patterns and Islamic geometry
• Natural colors from saffron, cinnamon, and rose
• Local ingredients like almonds, honey, and citrus
• Symbolic decorations representing fertility and prosperity

Contemporary Moroccan wedding cakes often feature clean lines, fresh flowers, and innovative flavor combinations that surprise and delight guests.`,
        featuredImage: "moroccan_wedding_cake",
        publishedAt: "2024-04-03T11:20:00Z",
        isFeatured: false,
        readTime: 4,
        category: {
            id: 2,
            name: "Beauty & Style",
            slug: "beauty-style",
        },
        author: {
            name: "Youssef Bennani",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80",
        },
        tags: ["#WeddingCake", "#MoroccanDesserts", "#Tradition"],
    },
];

export const mockInspirationPhotos: MockInspirationPhoto[] = [
    {
        id: 1,
        "@id": "/api/inspiration_photos/1",
        imagePath: "moroccan_wedding_centerpiece",
        caption: "Golden lanterns and white florals create an enchanting atmosphere",
        style: "Modern",
        category: { name: "Decoration" },
        city: { name: "Marrakech" },
        likes: 245,
        isLiked: false,
        tags: ["#ModernWedding", "#FloralDesign", "#Marrakech"],
        photographer: "Yasmine Photography",
        location: {
            name: "Jardin Secret, Marrakech",
            coordinates: { lat: 31.6342, lng: -7.9994 }
        },
        comments: [
            {
                id: 1,
                author: { name: "Fatima Alaoui", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&q=80", isVerified: true },
                content: "Absolutely stunning! The lanterns add such a magical touch ✨",
                createdAt: "2024-04-15T14:30:00Z",
                likes: 12,
            },
            {
                id: 2,
                author: { name: "Karim Bennani", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&q=80" },
                content: "Perfect blend of traditional and modern elements",
                createdAt: "2024-04-15T16:45:00Z",
                likes: 8,
            }
        ]
    },
    {
        id: 2,
        "@id": "/api/inspiration_photos/2",
        imagePath: "moroccan_bride_negafa",
        caption: "Traditional Fassi bridal set with intricate gold embroidery",
        style: "Traditional",
        category: { name: "Négafa" },
        city: { name: "Fès" },
        likes: 189,
        isLiked: true,
        tags: ["#TraditionalWedding", "#FassiStyle", "#GoldEmbroidery"],
        photographer: "Hassan Photography",
        location: {
            name: "Palais Jamaï, Fès",
            coordinates: { lat: 34.0181, lng: -5.0078 }
        },
        comments: [
            {
                id: 3,
                author: { name: "Amina Tazi", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&q=80", isVerified: true },
                content: "The craftsmanship is incredible! Traditional beauty at its finest",
                createdAt: "2024-04-14T10:15:00Z",
                likes: 15,
            }
        ]
    },
    {
        id: 3,
        "@id": "/api/inspiration_photos/3",
        imagePath: "moroccan_table_setting",
        caption: "Zellige patterned table styling with fresh roses and candles",
        style: "Andalou",
        category: { name: "Catering" },
        city: { name: "Chefchaouen" },
        likes: 156,
        isLiked: false,
        tags: ["#TableDecor", "#Zellige", "#Chefchaouen"],
        photographer: "Blue City Photography",
        location: {
            name: "Riad Akchour, Chefchaouen",
            coordinates: { lat: 35.1714, lng: -5.2697 }
        }
    },
    {
        id: 4,
        "@id": "/api/inspiration_photos/4",
        imagePath: "moroccan_caftan_detail",
        caption: "Handmade Aakad details showcasing traditional Moroccan craftsmanship",
        style: "Traditional",
        category: { name: "Négafa" },
        city: { name: "Marrakech" },
        likes: 203,
        isLiked: false,
        tags: ["#Caftan", "#TraditionalCraft", "#MoroccanArt"],
        photographer: "Artisan Lens",
        location: {
            name: "Souk El Bahia, Marrakech",
            coordinates: { lat: 31.6315, lng: -7.9866 }
        }
    },
    {
        id: 5,
        "@id": "/api/inspiration_photos/5",
        imagePath: "riad_sunset_wedding",
        caption: "Floating candles in the riad pool at golden hour",
        style: "Bohème",
        category: { name: "Salles" },
        city: { name: "Marrakech" },
        likes: 312,
        isLiked: true,
        tags: ["#SunsetWedding", "#Riad", "#GoldenHour"],
        photographer: "Golden Hour Photography",
        location: {
            name: "Riad Kniza, Marrakech",
            coordinates: { lat: 31.6325, lng: -7.9834 }
        },
        comments: [
            {
                id: 4,
                author: { name: "Sara Alaoui", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=40&q=80" },
                content: "This is exactly the kind of intimate setting we're dreaming of! 💫",
                createdAt: "2024-04-13T18:20:00Z",
                likes: 23,
                replies: [
                    {
                        id: 5,
                        author: { name: "Golden Hour Photography", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&q=80", isVerified: true },
                        content: "Thank you! The riad's architecture made this shot possible ✨",
                        createdAt: "2024-04-13T19:00:00Z",
                        likes: 5,
                    }
                ]
            }
        ]
    },
    {
        id: 6,
        "@id": "/api/inspiration_photos/6",
        imagePath: "moroccan_wedding_cake",
        caption: "Arabesque patterned wedding cake with edible gold leaf",
        style: "Modern",
        category: { name: "Catering" },
        city: { name: "Casablanca" },
        likes: 278,
        isLiked: false,
        tags: ["#WeddingCake", "#Arabesque", "#ModernDesign"],
        photographer: "Culinary Arts Photography",
        location: {
            name: "Four Seasons Casablanca",
            coordinates: { lat: 33.5951, lng: -7.6174 }
        }
    },
];

export const mockWeddingStories: MockWeddingStory[] = [
    {
        id: 1,
        coupleNames: "Layla & Mehdi",
        location: "Marrakech",
        vibe: "Boho Chic Riad",
        coverImage: "riad_sunset_wedding",
        description: "An intimate sunset celebration in the heart of the Marrakech Médina. The couple wanted a mix of traditional hospitality and modern bohemian aesthetics.",
        gallery: [
            "riad_sunset_wedding",
            "moroccan_table_setting",
            "moroccan_wedding_cake",
        ],
        vendorCredits: [
            { role: "Venue", name: "El Fenn Marrakech", slug: "el-fenn" },
            { role: "Catering", name: "Gourmet Morocco", slug: "catering-gourmet" },
        ],
        isFeatured: true,
        style: "Bohème",
        season: "Autumn",
        colorPalette: ["#A7D7C5", "#F5F5F5", "#E8472A"],
        celebrationTimeline: [
            {
                time: "16:00",
                event: "Bridal Preparation",
                description: "The Zahra (stylist) begins the intricate hair and makeup in the riad courtyard."
            },
            {
                time: "19:30",
                event: "Initial Reception",
                description: "Guests arrive to the sounds of traditional Dekka Marrakchia and mint tea service."
            },
            {
                time: "21:00",
                event: "The First Entrance",
                description: "The couple enters on the Amaria, heralded by negafa songs and high-energy drumming."
            },
            {
                time: "00:00",
                event: "Dinner Service",
                description: "A traditional three-course Moroccan feast served under the stars."
            },
            {
                time: "02:00",
                event: "Last Dress (Labssa)",
                description: "The bride appears in her final, most grand Lebssa before the couple departs."
            },
        ],
    },
];

// A/B Testing variants
export const AB_TEST_VARIANTS = {
  hero_layout: {
    A: { layout: 'centered', showStats: true },
    B: { layout: 'full_width', showStats: false },
    C: { layout: 'minimal', showStats: true },
  },
  article_cards: {
    A: { showAuthor: true, showReadTime: true, imageAspect: '16/10' },
    B: { showAuthor: false, showReadTime: true, imageAspect: '4/3' },
    C: { showAuthor: true, showReadTime: false, imageAspect: '1/1' },
  },
  photo_grid: {
    A: { columns: 3, gap: 'normal', showOverlay: true },
    B: { columns: 4, gap: 'tight', showOverlay: false },
    C: { columns: 2, gap: 'wide', showOverlay: true },
  },
};

export const getABTestVariant = (testName: keyof typeof AB_TEST_VARIANTS, userId?: string) => {
  if (!MOCK_CONFIG.ENABLE_RANDOM_DATA) return AB_TEST_VARIANTS[testName].A;

  // Simple hash-based variant selection for consistency
  const variants = Object.keys(AB_TEST_VARIANTS[testName]);
  const hash = (userId || 'anonymous').split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const variantIndex = Math.abs(hash) % variants.length;

  return AB_TEST_VARIANTS[testName][variants[variantIndex] as keyof typeof AB_TEST_VARIANTS[typeof testName]];
};

// Performance monitoring utilities
export const performanceMetrics = {
  apiCalls: 0,
  cacheHits: 0,
  averageResponseTime: 0,
  errorRate: 0,
};

export const trackApiCall = (endpoint: string, duration: number, success: boolean) => {
  performanceMetrics.apiCalls++;
  performanceMetrics.averageResponseTime =
    (performanceMetrics.averageResponseTime + duration) / 2;

  if (!success) {
    performanceMetrics.errorRate = (performanceMetrics.errorRate + 1) / performanceMetrics.apiCalls;
  }

  if (process.env.NODE_ENV === 'development') {
    console.log(`[Mock API] ${endpoint}: ${duration}ms ${success ? '✅' : '❌'}`);
  }
};

export const getPerformanceReport = () => ({
  ...performanceMetrics,
  uptime: process.uptime(),
  memoryUsage: process.memoryUsage(),
});

// Analytics simulation
export const simulateAnalytics = (event: string, data: Record<string, unknown>) => {
  if (!MOCK_CONFIG.ENABLE_INTERACTIONS) return;

  console.log(`[Analytics] ${event}:`, data);

  // Simulate sending to analytics service
  return {
    eventId: `evt_${Date.now()}`,
    timestamp: new Date().toISOString(),
    processed: true,
  };
};