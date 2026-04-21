export interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
    iconSvg?: string;
}

export interface Hotspot {
    x: number;  // left % (0-100)
    y: number;  // top % (0-100)
    label: string;
    vendorSlug: string;
    vendorName: string;
    category?: string;
}

export interface ArticleHotspotImage {
    imageUrl: string;
    alt: string;
    hotspots: Hotspot[];
}

export interface ExpertQA {
    question: string;
    answer: string;
}

export interface ArticleExpert {
    name: string;
    title: string;
    yearsExperience: number;
    avatarUrl: string;
    quote: string;
    qa: ExpertQA[];
}

export interface ArticleSponsor {
    vendorName: string;
    vendorSlug: string;
    tagline: string;
    logoUrl?: string;
    coverImageUrl: string;
    category: string;
    ctaLabel?: string;
}

export interface RelatedVendor {
    id: number;
    slug: string;
    businessName: string;
    category: { name: string; slug: string };
    coverImageUrl: string;
    isVerified: boolean;
    averageRating: number;
}

export interface ArticleAuthor {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

export interface Article {
    id: number;
    slug: string;
    title: string;
    excerpt?: string;
    content: string;
    locale?: "fr" | "ar" | "ary" | "en";
    featuredImage?: string;
    category: ArticleCategory;
    publishedAt?: string;
    createdAt: string;
    tags: string[];
    readingTimeMinutes?: number;
    widgetType?: "hamlau" | "hire_pros" | "shop_the_look" | "expert_qa" | "sponsor" | null;
    isFeatured: boolean;
    featuredOrder?: number;
    author?: ArticleAuthor | null;
    relatedVendors?: RelatedVendor[];
    hotspotImages?: ArticleHotspotImage[];
    expertData?: ArticleExpert;
    sponsorData?: ArticleSponsor;
}

export interface HydraCollection<T> {
    "hydra:member": T[];
    "hydra:totalItems": number;
}
