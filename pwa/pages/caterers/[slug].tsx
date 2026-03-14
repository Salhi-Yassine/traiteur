import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import type { GetServerSideProps } from "next";
import StarRating from "../../components/ui/StarRating";
import Badge from "../../components/ui/Badge";
import PriceRange from "../../components/ui/PriceRange";
import QuoteRequestModal from "../../components/quotes/QuoteRequestModal";

interface MenuItem {
    id: number;
    name: string;
    description?: string;
    pricePerPerson?: string;
    category: string;
    isVegetarian: boolean;
    isVegan: boolean;
    isGlutenFree: boolean;
}

interface ReviewData {
    id: number;
    rating: number;
    title?: string;
    body: string;
    createdAt: string;
    author?: { firstName: string; lastName: string };
}

interface CatererProfileData {
    id: number;
    slug: string;
    businessName: string;
    tagline?: string;
    description: string;
    cuisineTypes: string[];
    serviceStyles: string[];
    serviceArea: string;
    priceRange: string;
    coverImageUrl?: string;
    galleryImages: string[];
    averageRating?: string;
    reviewCount: number;
    isVerified: boolean;
    minGuests?: string;
    maxGuests?: string;
    menuItems: MenuItem[];
}

interface CatererProfilePageProps {
    caterer: CatererProfileData;
    reviews: ReviewData[];
}

// Fallback for dev / API unavailable
const FALLBACK: CatererProfileData = {
    id: 1,
    slug: "festin-royal-alger",
    businessName: "Festin Royal",
    tagline: "Cuisine algérienne authentique pour vos événements mémorables",
    description: "Festin Royal est un service traiteur haut de gamme basé à Alger, spécialisé dans la cuisine algérienne traditionnelle revisitée. Avec plus de 15 ans d'expérience, nous proposons des menus sur mesure pour mariages, réceptions d'entreprise et célébrations privées. Nos chefs utilisent uniquement des produits frais et locaux pour vous offrir une expérience culinaire authentique.",
    cuisineTypes: ["Algerian", "Mediterranean", "Oriental"],
    serviceStyles: ["Buffet", "Plated", "Family Style"],
    serviceArea: "Alger",
    priceRange: "$$$",
    coverImageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=1600",
    galleryImages: [
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600",
        "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600",
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600",
    ],
    averageRating: "5.00",
    reviewCount: 2,
    isVerified: true,
    minGuests: "50",
    maxGuests: "500",
    menuItems: [
        { id: 1, name: "Salade Mechouia", description: "Poivrons et tomates grillés marinés aux épices", pricePerPerson: "350", category: "Starter", isVegetarian: true, isVegan: false, isGlutenFree: true },
        { id: 2, name: "Chorba Frik", description: "Soupe traditionnelle au blé vert et agneau", pricePerPerson: "500", category: "Starter", isVegetarian: false, isVegan: false, isGlutenFree: false },
        { id: 3, name: "Couscous Royal", description: "Couscous avec merguez, poulet et légumes de saison", pricePerPerson: "1200", category: "Main", isVegetarian: false, isVegan: false, isGlutenFree: false },
        { id: 4, name: "Tajine d'Agneau", description: "Agneau mijoté aux olives et citron confit", pricePerPerson: "1500", category: "Main", isVegetarian: false, isVegan: false, isGlutenFree: false },
        { id: 5, name: "Kalb Ellouz", description: "Gâteau algérien aux amandes et eau de fleur d'oranger", pricePerPerson: "400", category: "Dessert", isVegetarian: false, isVegan: true, isGlutenFree: true },
    ],
};

const FALLBACK_REVIEWS: ReviewData[] = [
    { id: 1, rating: 5, title: "Exceptionnel pour notre mariage!", body: "Le service était irréprochable et les saveurs absolument délicieuses. Nos invités ont encore parlé de la nourriture des semaines après.", createdAt: "2026-01-15T00:00:00Z", author: { firstName: "Amina", lastName: "K." } },
    { id: 2, rating: 5, title: "Parfait de A à Z", body: "Festin Royal a géré notre réception d'entreprise de 200 personnes avec une efficacité remarquable.", createdAt: "2026-02-20T00:00:00Z", author: { firstName: "Mohamed", lastName: "B." } },
];

const CATEGORY_ORDER = ["Starter", "Canapé", "Main", "Dessert", "Drinks"];

export default function CatererProfilePage({ caterer, reviews }: CatererProfilePageProps) {
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [activeGallery, setActiveGallery] = useState(0);

    const rating = caterer.averageRating ? parseFloat(caterer.averageRating) : 0;

    // Group menu items by category
    const menuByCategory = CATEGORY_ORDER.reduce<Record<string, MenuItem[]>>((acc, cat) => {
        const items = caterer.menuItems.filter((m) => m.category === cat);
        if (items.length > 0) acc[cat] = items;
        return acc;
    }, {});

    const allImages = [caterer.coverImageUrl, ...caterer.galleryImages].filter(Boolean) as string[];

    return (
        <>
            <Head>
                <title>{caterer.businessName} — Traiteur</title>
                <meta name="description" content={caterer.tagline ?? caterer.description.slice(0, 160)} />
            </Head>

            {/* Hero image */}
            <div className="relative h-[50vh] md:h-[60vh] bg-[var(--color-sand-200)] pt-16">
                {caterer.coverImageUrl && (
                    <Image
                        src={caterer.coverImageUrl}
                        alt={caterer.businessName}
                        fill
                        className="object-cover"
                        priority
                        sizes="100vw"
                    />
                )}
                <div className="absolute inset-0 hero-overlay" />

                {/* Overlay content */}
                <div className="absolute bottom-6 left-6 right-6 md:left-10 max-w-2xl">
                    {caterer.isVerified && <Badge label="Verified" variant="verified" />}
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-white mt-2 mb-1">
                        {caterer.businessName}
                    </h1>
                    {caterer.tagline && (
                        <p className="text-white/80 text-lg italic">{caterer.tagline}</p>
                    )}
                </div>
            </div>

            {/* Gallery strip */}
            {allImages.length > 1 && (
                <div className="bg-[var(--color-charcoal-900)] py-2 px-4">
                    <div className="container mx-auto max-w-5xl flex gap-2 overflow-x-auto pb-1">
                        {allImages.map((url, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveGallery(i)}
                                className={`relative shrink-0 w-20 h-14 rounded-lg overflow-hidden border-2 transition-all ${activeGallery === i ? "border-[var(--color-gold-500)]" : "border-transparent"
                                    }`}
                            >
                                <Image src={url} alt={`Gallery ${i + 1}`} fill className="object-cover" sizes="80px" />
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Main content */}
            <div className="container mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Left column */}
                    <div className="flex-1 min-w-0 space-y-10">
                        {/* Quick info bar */}
                        <div className="flex flex-wrap gap-6 pb-6 border-b border-[var(--color-sand-200)]">
                            <div className="flex items-center gap-1.5 text-sm text-[var(--color-charcoal-600)]">
                                <svg className="w-4 h-4 text-[var(--color-teal-600)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                {caterer.serviceArea}
                            </div>
                            <div className="flex items-center gap-1.5">
                                <PriceRange value={caterer.priceRange} label />
                            </div>
                            {rating > 0 && (
                                <StarRating rating={rating} reviewCount={caterer.reviewCount} />
                            )}
                            {caterer.minGuests && caterer.maxGuests && (
                                <div className="text-sm text-[var(--color-charcoal-500)]">
                                    {caterer.minGuests}–{caterer.maxGuests} guests
                                </div>
                            )}
                        </div>

                        {/* Cuisine & Style tags */}
                        <div>
                            <h2 className="font-display font-semibold text-xl text-[var(--color-charcoal-900)] mb-3">Specialties</h2>
                            <div className="flex flex-wrap gap-2">
                                {caterer.cuisineTypes.map((c) => <Badge key={c} label={c} variant="cuisine" />)}
                                {caterer.serviceStyles.map((s) => <Badge key={s} label={s} variant="style" />)}
                            </div>
                        </div>

                        {/* About */}
                        <div>
                            <h2 className="font-display font-semibold text-xl text-[var(--color-charcoal-900)] mb-3">About</h2>
                            <p className="text-[var(--color-charcoal-600)] leading-relaxed whitespace-pre-line">
                                {caterer.description}
                            </p>
                        </div>

                        {/* Menu */}
                        {Object.keys(menuByCategory).length > 0 && (
                            <div>
                                <h2 className="font-display font-semibold text-xl text-[var(--color-charcoal-900)] mb-5">Menu</h2>
                                <div className="space-y-8">
                                    {Object.entries(menuByCategory).map(([category, items]) => (
                                        <div key={category}>
                                            <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--color-teal-700)] mb-3 flex items-center gap-2">
                                                <span className="h-px flex-1 bg-[var(--color-teal-100)]" />
                                                {category}
                                                <span className="h-px flex-1 bg-[var(--color-teal-100)]" />
                                            </h3>
                                            <div className="space-y-3">
                                                {items.map((item) => (
                                                    <div key={item.id} className="flex justify-between gap-4 p-3 rounded-xl hover:bg-[var(--color-sand-50)] transition-colors">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-0.5">
                                                                <span className="font-medium text-[var(--color-charcoal-900)]">{item.name}</span>
                                                                {item.isVegetarian && <Badge label="Veg" variant="dietary" />}
                                                                {item.isVegan && <Badge label="Vegan" variant="dietary" />}
                                                                {item.isGlutenFree && <Badge label="GF" variant="dietary" />}
                                                            </div>
                                                            {item.description && (
                                                                <p className="text-sm text-[var(--color-charcoal-500)]">{item.description}</p>
                                                            )}
                                                        </div>
                                                        {item.pricePerPerson && (
                                                            <div className="shrink-0 text-sm font-semibold text-[var(--color-teal-700)]">
                                                                {Number(item.pricePerPerson).toLocaleString()} DZD/pers
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews */}
                        {reviews.length > 0 && (
                            <div>
                                <h2 className="font-display font-semibold text-xl text-[var(--color-charcoal-900)] mb-5">
                                    Reviews ({caterer.reviewCount})
                                </h2>
                                <div className="space-y-4">
                                    {reviews.map((review) => (
                                        <div key={review.id} className="p-5 bg-white rounded-2xl border border-[var(--color-sand-200)]">
                                            <div className="flex items-start justify-between gap-4 mb-2">
                                                <div>
                                                    <StarRating rating={review.rating} showCount={false} size="sm" />
                                                    {review.title && (
                                                        <p className="font-semibold text-[var(--color-charcoal-900)] mt-1">{review.title}</p>
                                                    )}
                                                </div>
                                                <span className="text-xs text-[var(--color-charcoal-400)] shrink-0">
                                                    {new Date(review.createdAt).toLocaleDateString("fr-DZ", { month: "long", year: "numeric" })}
                                                </span>
                                            </div>
                                            <p className="text-[var(--color-charcoal-600)] text-sm leading-relaxed">{review.body}</p>
                                            {review.author && (
                                                <p className="text-xs text-[var(--color-charcoal-400)] mt-2">
                                                    — {review.author.firstName} {review.author.lastName}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right sticky sidebar */}
                    <div className="lg:w-80 shrink-0">
                        <div className="sticky top-24 bg-white rounded-2xl shadow-[var(--shadow-card-hover)] border border-[var(--color-sand-200)] overflow-hidden">
                            {/* Header */}
                            <div className="bg-[var(--color-teal-700)] px-6 py-5 text-white">
                                <div className="font-display font-semibold text-lg mb-1">
                                    Request a Quote
                                </div>
                                <p className="text-[var(--color-teal-200)] text-sm">
                                    Get a personalized proposal within 24 hours
                                </p>
                            </div>

                            <div className="p-6 space-y-4">
                                {/* Highlights */}
                                {[
                                    { icon: "✓", text: `${caterer.serviceArea} service area` },
                                    { icon: "✓", text: caterer.priceRange + " price range" },
                                    ...(caterer.minGuests && caterer.maxGuests ? [{ icon: "✓", text: `${caterer.minGuests}–${caterer.maxGuests} guests` }] : []),
                                    { icon: "✓", text: "Free quote, no commitment" },
                                ].map(({ icon, text }) => (
                                    <div key={text} className="flex items-center gap-2 text-sm text-[var(--color-charcoal-600)]">
                                        <span className="text-[var(--color-teal-600)] font-bold">{icon}</span>
                                        {text}
                                    </div>
                                ))}

                                <button
                                    onClick={() => setQuoteOpen(true)}
                                    id="request-quote-btn"
                                    className="w-full bg-[var(--color-teal-700)] text-white py-3.5 rounded-xl font-semibold hover:bg-[var(--color-teal-800)] transition-colors mt-2"
                                >
                                    Request a Quote
                                </button>

                                <p className="text-xs text-center text-[var(--color-charcoal-400)]">
                                    No payment required · Free to contact
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <QuoteRequestModal
                isOpen={quoteOpen}
                onClose={() => setQuoteOpen(false)}
                catererProfileId={caterer.id}
                catererName={caterer.businessName}
            />
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
    const slug = params?.slug as string;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";

        // Fetch profile by slug filter
        const profileRes = await fetch(
            `${baseUrl}/api/caterer_profiles?slug=${slug}&itemsPerPage=1`,
            { headers: { Accept: "application/ld+json" } }
        );

        if (!profileRes.ok) throw new Error("API unavailable");
        const profileData = await profileRes.json();
        const members = profileData["hydra:member"] ?? [];
        if (members.length === 0) return { notFound: true };

        const c = members[0];
        const caterer: CatererProfileData = {
            id: c.id,
            slug: c.slug,
            businessName: c.businessName,
            tagline: c.tagline,
            description: c.description,
            cuisineTypes: c.cuisineTypes ?? [],
            serviceStyles: c.serviceStyles ?? [],
            serviceArea: c.serviceArea,
            priceRange: c.priceRange,
            coverImageUrl: c.coverImageUrl,
            galleryImages: c.galleryImages ?? [],
            averageRating: c.averageRating,
            reviewCount: c.reviewCount ?? 0,
            isVerified: c.isVerified ?? false,
            minGuests: c.minGuests,
            maxGuests: c.maxGuests,
            menuItems: (c.menuItems ?? []).map((m: Record<string, unknown>) => ({
                id: m.id,
                name: m.name,
                description: m.description,
                pricePerPerson: m.pricePerPerson,
                category: m.category,
                isVegetarian: m.isVegetarian ?? false,
                isVegan: m.isVegan ?? false,
                isGlutenFree: m.isGlutenFree ?? false,
            })),
        };

        // Fetch reviews
        const reviewsRes = await fetch(
            `${baseUrl}/api/reviews?catererProfile=${c.id}&page=1&itemsPerPage=10`,
            { headers: { Accept: "application/ld+json" } }
        );
        let reviews: ReviewData[] = [];
        if (reviewsRes.ok) {
            const reviewData = await reviewsRes.json();
            reviews = (reviewData["hydra:member"] ?? []).map((r: Record<string, unknown>) => {
                const author = r.author as Record<string, unknown> | undefined;
                return {
                    id: r.id as number,
                    rating: r.rating as number,
                    title: r.title as string | undefined,
                    body: r.body as string,
                    createdAt: r.createdAt as string,
                    author: author ? { firstName: author.firstName as string, lastName: author.lastName as string } : undefined,
                };
            });
        }

        return { props: { caterer, reviews } };
    } catch {
        // Return fallback in dev mode
        if (slug === "festin-royal-alger") {
            return { props: { caterer: FALLBACK, reviews: FALLBACK_REVIEWS } };
        }
        return { notFound: true };
    }
};
