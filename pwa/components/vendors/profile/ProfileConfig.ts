import { VendorProfileData } from "./ProfileTypes";

export const FALLBACK_VENDOR: VendorProfileData = {
    id: 1,
    slug: "palais-des-roses-casablanca",
    businessName: "Palais des Roses",
    tagline: "Un cadre idyllique pour votre mariage de rêve à Casablanca",
    description: "Le Palais des Roses est une salle de réception d'exception située au cœur de Casablanca. Spécialisés dans les mariages marocains traditionnels et modernes, nous offrons un service complet incluant une décoration raffinée, un service traiteur gastronomique et une équipe dédiée pour faire de votre événement un moment inoubliable.",
    category: "Salles",
    cities: [{ name: "Casablanca", slug: "casablanca" }],
    priceRange: "MADMAD",
    coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80",
    coverVideoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
    galleryImages: [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=1200&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80",
        "https://images.unsplash.com/photo-151285560929-80b456fea0bc?w=1200&q=80",
        "https://images.unsplash.com/photo-1555244162-803834f70033?w=1200&q=80"
    ],
    averageRating: "4.90",
    reviewCount: 128,
    isVerified: true,
    whatsapp: "212600000000",
    minGuests: "100",
    maxGuests: "600",
    menuItems: [
        { id: 1, name: "Menu Royal Traditions", description: "Pastilla de pigeon, Méchoui impérial, et assortiment de pâtisseries fines", pricePerPerson: "650", category: "Pack Complet" },
        { id: 2, name: "Cocktail Dînatoire Chic", description: "Verrines gourmandes, mini-pastillas, et buffet de jus frais pressés", pricePerPerson: "350", category: "Cocktail" },
        { id: 3, name: "Décoration Florale Premium", description: "Arches de fleurs fraîches, centres de table artistiques et décoration de l'espace henné", category: "Décoration" }
    ],
    owner: {
        id: 1,
        firstName: "Yassine",
        lastName: "Salhi",
        createdAt: "2024-01-15T10:00:00Z"
    }
};

export const BOOKED_DATES = ["2026-04-12", "2026-04-13", "2026-04-25", "2026-05-02", "2026-05-15"];
