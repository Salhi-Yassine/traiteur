import { Coffee, Heart, Music, Sparkles, Camera, Clock } from "lucide-react";
import { fr } from "date-fns/locale";

export interface TimelineItem {
    time: string;
    title: string;
    description?: string;
    icon?: string;
}

export interface HoneyFundItem {
    id: string;
    title: string;
    description: string;
    image: string;
    targetAmount: number;
    contributionCount: number;
}

export interface PublicWeddingData {
    slug: string;
    brideName: string;
    groomName: string;
    weddingDate: string;
    weddingCity: string;
    venueName?: string;
    venueAddress?: string;
    coverImage?: string;
    registryUrl?: string;
    accommodationInfo?: string;
    timelineItems?: TimelineItem[];
    ourStory?: string;
    qa?: { question: string; answer: string }[];
    travelInfo?: string;
    selectedTheme?: string;
    themeColor?: string;
    galleryImages?: string[];
    preloadedGuest?: any | null;
    honeyFunds?: HoneyFundItem[];
}

export const FALLBACK_WEDDING: PublicWeddingData = {
    slug: "demo",
    brideName: "Sarah",
    groomName: "Yassine",
    weddingDate: "2026-08-15",
    weddingCity: "Casablanca",
    venueName: "Palais des Roses",
    venueAddress: "Boulevard de la Corniche, Casablanca",
    coverImage: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1920&q=85",
    registryUrl: "https://www.amazon.fr/wedding",
    accommodationInfo: "Nous avons négocié un tarif préférentiel au Four Seasons Casablanca. Mentionnez 'Farah Wedding' lors de votre réservation.",
    timelineItems: [
        { time: "17:00", title: "Accueil & Thé", description: "Réception des invités avec thé à la menthe et pâtisseries marocaines.", icon: "coffee" },
        { time: "18:30", title: "Cérémonie", description: "Échange des vœux et signature de l'acte.", icon: "heart" },
        { time: "20:00", title: "Dîner de Gala", description: "Un festin traditionnel animé par un orchestre andalou.", icon: "music" },
        { time: "23:00", title: "Défilé Negrafa", description: "Présentation des tenues traditionnelles.", icon: "sparkles" },
        { time: "01:00", title: "Gâteau Wedding", description: "Célébration finale et soirée dansante.", icon: "camera" }
    ],
    honeyFunds: [
        {
            id: "1",
            title: "Lune de Miel aux Maldives",
            description: "Aidez-nous à réaliser notre rêve de survoler les atolls en hydravion.",
            image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?w=800&q=80",
            targetAmount: 2500,
            contributionCount: 12
        },
        {
            id: "2",
            title: "Dîner Romantique à Ubud",
            description: "Un dîner aux chandelles au bord de la jungle sacrée de Bali.",
            image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&q=80",
            targetAmount: 300,
            contributionCount: 5
        },
        {
            id: "3",
            title: "Safari d'Exception au Kenya",
            description: "Une journée magique à la rencontre de la faune sauvage.",
            image: "https://images.unsplash.com/photo-1516422213484-21437ef33632?w=800&q=80",
            targetAmount: 800,
            contributionCount: 8
        },
        {
            id: "4",
            title: "Nuit au Royal Mansour",
            description: "Une expérience inoubliable dans le plus beau riad de Marrakech.",
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
            targetAmount: 1200,
            contributionCount: 3
        }
    ]
};

export const ICON_MAP: Record<string, any> = {
    coffee: Coffee,
    heart: Heart,
    music: Music,
    sparkles: Sparkles,
    camera: Camera,
    clock: Clock
};

export const THEME_STYLES: Record<string, any> = {
    modern: {
        fontTitle: "font-display",
        fontSerif: "font-serif",
        primaryColor: "text-primary",
        bgLight: "bg-neutral-50",
        rounded: "rounded-[2rem]"
    },
    romantic: {
        fontTitle: "font-serif",
        fontSerif: "font-serif",
        primaryColor: "text-primary",
        bgLight: "bg-primary/5",
        rounded: "rounded-full"
    },
    dark: {
        fontTitle: "font-display",
        fontSerif: "font-serif",
        primaryColor: "text-primary",
        bgLight: "bg-neutral-900",
        rounded: "rounded-3xl"
    }
};

export const getThemeColorStyle = (color?: string) => {
    return {
        ...(color === "rose" ? { "--primary": "346.8 77.2% 49.8%" } : {}),
        ...(color === "emerald" ? { "--primary": "142.1 76.2% 36.3%" } : {}),
        ...(color === "amber" ? { "--primary": "37.7 92.1% 50.2%" } : {}),
        ...(color === "indigo" ? { "--primary": "226.5 57% 53%" } : {}),
    } as React.CSSProperties;
};
