export interface MenuItem {
    id: number;
    name: string;
    description?: string;
    pricePerPerson?: string;
    category: string;
}

export interface ReviewData {
    id: number;
    rating: number;
    title?: string;
    body: string;
    createdAt: string;
    author?: { firstName: string; lastName: string };
}

export interface VendorProfileData {
    id: number;
    slug: string;
    businessName: string;
    tagline?: string;
    description: string;
    category: string;
    cities: { name: string; slug: string }[];
    priceRange: string;
    coverImageUrl?: string;
    coverVideoUrl?: string;
    galleryImages: string[];
    averageRating?: string;
    reviewCount: number;
    isVerified: boolean;
    whatsapp?: string;
    minGuests?: string;
    maxGuests?: string;
    menuItems: MenuItem[];
    owner: {
        id: number;
        firstName: string;
        lastName: string;
        createdAt: string;
    };
}
