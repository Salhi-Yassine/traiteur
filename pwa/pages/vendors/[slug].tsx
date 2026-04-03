import Head from "next/head";
import Image from "next/image";
import { useState } from "react";
import type { GetServerSideProps } from "next";
import StarRating from "../../components/ui/StarRating";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import PriceRange from "../../components/ui/PriceRange";
import QuoteRequestModal from "../../components/quotes/QuoteRequestModal";
import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

interface MenuItem {
    id: number;
    name: string;
    description?: string;
    pricePerPerson?: string;
    category: string;
}

interface ReviewData {
    id: number;
    rating: number;
    title?: string;
    body: string;
    createdAt: string;
    author?: { firstName: string; lastName: string };
}

interface VendorProfileData {
    id: number;
    slug: string;
    businessName: string;
    tagline?: string;
    description: string;
    category: string;
    cities: { name: string; slug: string }[];
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

interface VendorProfilePageProps {
    vendor: VendorProfileData;
    reviews: ReviewData[];
}

const FALLBACK: VendorProfileData = {
    id: 1,
    slug: "palais-des-roses-casablanca",
    businessName: "Palais des Roses",
    tagline: "Un cadre idyllique pour votre mariage de rêve à Casablanca",
    description: "Le Palais des Roses est une salle de réception d'exception située au cœur de Casablanca. Spécialisés dans les mariages marocains traditionnels et modernes, nous offrons un service complet incluant une décoration raffinée, un service traiteur gastronomique et une équipe dédiée pour faire de votre événement un moment inoubliable.",
    category: "Salles",
    cities: [{ name: "Casablanca", slug: "casablanca" }],
    priceRange: "MADMADMAD",
    coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1600&q=80",
    galleryImages: [
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80",
        "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80",
    ],
    averageRating: "4.90",
    reviewCount: 128,
    isVerified: true,
    minGuests: "100",
    maxGuests: "600",
    menuItems: [
        { id: 1, name: "Menu Royal Traditions", description: "Pastilla de pigeon, Méchoui impérial, et assortiment de pâtisseries fines", pricePerPerson: "650", category: "Pack Complet" },
        { id: 2, name: "Menu Prestige", description: "Sélection de poissons, Tagine d'agneau aux pruneaux, et buffet de desserts", pricePerPerson: "500", category: "Pack Prestige" },
    ],
};

const FALLBACK_REVIEWS: ReviewData[] = [
    { id: 1, rating: 5, title: "Un mariage magique !", body: "Merci à toute l'équipe du Palais des Roses pour avoir fait de notre mariage un rêve éveillé. La salle est magnifique et le service impeccable.", createdAt: "2026-02-14T00:00:00Z", author: { firstName: "Yassine", lastName: "S." } },
    { id: 2, rating: 5, title: "Excellente prestation", body: "Tout était parfait : de l'accueil à la fin de la soirée. La nourriture était délicieuse et les invités ravis.", createdAt: "2026-01-20T00:00:00Z", author: { firstName: "Sara", lastName: "M." } },
];

export default function VendorProfilePage({ vendor, reviews }: VendorProfilePageProps) {
    const { t } = useTranslation("common");
    const [quoteOpen, setQuoteOpen] = useState(false);
    const [activeGallery, setActiveGallery] = useState(0);

    const rating = vendor.averageRating ? parseFloat(vendor.averageRating) : 0;
    const allImages = [vendor.coverImageUrl, ...vendor.galleryImages].filter(Boolean) as string[];

    return (
        <div className="bg-background min-h-screen">
            <Head>
                <title>{vendor.businessName} — Farah.ma</title>
                <meta name="description" content={vendor.tagline ?? vendor.description.slice(0, 160)} />
            </Head>

            {/* Hero & Media Section */}
            <div className="relative h-[75vh] bg-black pt-16">
                {allImages.length > 0 && (
                    <Image
                        src={allImages[activeGallery]}
                        alt={vendor.businessName}
                        fill
                        className="object-cover transition-opacity duration-1000"
                        priority
                        sizes="100vw"
                    />
                )}
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/30 to-transparent opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />

                {/* Overlay content */}
                <div className="absolute bottom-20 left-6 right-6 md:left-12 lg:left-24 max-w-5xl z-10">
                    <div className="flex flex-wrap items-center gap-4 mb-6">
                        <Badge variant="neutral" className="px-4 py-1.5">{vendor.category}</Badge>
                        {vendor.isVerified && (
                             <Badge variant="verified" className="px-4 py-1.5">
                                <span className="flex items-center gap-1.5">
                                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.64.304 1.24.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    {t("vendor_card.verified")}
                                </span>
                             </Badge>
                        )}
                    </div>
                    <h1 className="font-display text-5xl md:text-7xl font-black text-white mb-4 tracking-tight leading-tight">
                        {vendor.businessName}
                    </h1>
                    {vendor.tagline && (
                        <p className="text-secondary text-xl md:text-2xl font-medium tracking-wide italic max-w-3xl border-l-4 border-secondary/40 pl-6 py-2">
                            "{vendor.tagline}"
                        </p>
                    )}
                </div>

                {/* Gallery switchers */}
                {allImages.length > 1 && (
                    <div className="absolute top-1/2 right-12 -translate-y-1/2 z-20 flex flex-col gap-4">
                        {allImages.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveGallery(i)}
                                className={cn(
                                    "w-16 h-16 rounded-2xl overflow-hidden border-2 transition-all duration-300 shadow-2xl",
                                    activeGallery === i ? "border-secondary scale-110" : "border-white/20 opacity-60 hover:opacity-100 hover:scale-105"
                                )}
                            >
                                <Image src={img} alt={`Gallery ${i}`} fill className="object-cover" sizes="64px" />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Main content grid */}
            <div className="container mx-auto max-w-7xl px-6 py-20 -mt-16 relative z-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left column: Information */}
                    <div className="flex-1 space-y-16">
                        {/* Quick bar */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-premium p-10 flex flex-wrap items-center justify-between gap-10 border border-border/50">
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t("vendor_profile.location")}</p>
                                <div className="flex items-center gap-2.5 font-black text-primary uppercase text-xs tracking-widest">
                                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        </svg>
                                    </div>
                                    {vendor.cities.map(c => c.name).join(', ')}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t("vendor_profile.price_range")}</p>
                                <PriceRange value={vendor.priceRange} label className="text-secondary" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t("vendor_profile.reviews_count")}</p>
                                <StarRating rating={rating} reviewCount={vendor.reviewCount} size="md" />
                            </div>
                            {vendor.maxGuests && (
                                <div className="space-y-2">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{t("vendor_profile.capacity")}</p>
                                    <div className="flex items-center gap-2.5 font-black text-primary uppercase text-xs tracking-widest">
                                        <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
                                            <svg className="w-4 h-4 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        {t("vendor_profile.capacity_max", { max: vendor.maxGuests })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* About section */}
                        <div className="space-y-6">
                            <h2 className="font-display text-4xl font-black text-primary">{t("vendor_profile.about_title")}</h2>
                            <div className="prose prose-lg text-muted-foreground max-w-none leading-relaxed italic border-l-4 border-secondary pl-10 py-4 bg-accent/5 rounded-r-[2rem]">
                                {vendor.description}
                            </div>
                        </div>

                        {/* Services / Menu section */}
                        {vendor.menuItems.length > 0 && (
                            <div className="space-y-10">
                                <h2 className="font-display text-4xl font-black text-primary">{t("vendor_profile.services_title")}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    {vendor.menuItems.map((item) => (
                                        <div key={item.id} className="bg-white rounded-[2.5rem] p-10 shadow-premium border border-border/10 hover:border-secondary/30 transition-all group relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/5 rounded-full -mr-12 -mt-12 group-hover:bg-secondary/10 transition-colors" />
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.3em]">{item.category}</span>
                                                    <h3 className="font-display font-black text-2xl text-primary">{item.name}</h3>
                                                </div>
                                                {item.description && (
                                                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{item.description}</p>
                                                )}
                                                {item.pricePerPerson && (
                                                    <div className="pt-6 border-t border-border flex items-baseline gap-2">
                                                        <span className="text-3xl font-black text-primary">{Number(item.pricePerPerson).toLocaleString()}</span>
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("vendor_profile.per_person")}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Reviews section */}
                        <div className="space-y-12">
                            <div className="flex items-center justify-between">
                                <h2 className="font-display text-4xl font-black text-primary">{t("vendor_profile.reviews_title")}</h2>
                                <Button variant="outline" size="sm" className="text-xs uppercase tracking-widest font-black">{t("vendor_profile.write_review")}</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-white rounded-[2.5rem] p-10 border border-border/50 shadow-premium relative">
                                        <div className="absolute -top-4 -left-4 w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-white shadow-gold">
                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14C19.017 11.7909 17.2261 10 15.017 10H14.017V8H15.017C18.3307 8 21.017 10.6863 21.017 14V21H14.017ZM3 21L3 18C3 16.8954 3.89543 16 5 16H8V14C8 11.7909 6.20914 10 4 10H3V8H4C7.31371 8 10 10.6863 10 14V21H3Z" />
                                            </svg>
                                        </div>
                                        <div className="space-y-6 pt-2">
                                            <div className="flex items-center justify-between">
                                                <StarRating rating={review.rating} showCount={false} size="sm" />
                                                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                                                    {new Date(review.createdAt).toLocaleDateString("fr-MA", { month: "long", year: "numeric" })}
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                {review.title && <h4 className="font-bold text-primary italic">"{review.title}"</h4>}
                                                <p className="text-sm text-muted-foreground leading-relaxed italic">"{review.body}"</p>
                                            </div>
                                            {review.author && (
                                                <div className="flex items-center gap-3 pt-6 border-t border-border">
                                                    <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-black uppercase">
                                                        {review.author.firstName[0]}{review.author.lastName[0]}
                                                    </div>
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">
                                                        {review.author.firstName} {review.author.lastName[0]}.
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right column: Sticky Actions */}
                    <div className="lg:w-[28rem] shrink-0">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-primary rounded-[3rem] shadow-2xl p-12 text-white relative overflow-hidden group">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/15 rounded-full -mr-32 -mt-32 blur-[80px] group-hover:bg-secondary/25 transition-colors" />
                                
                                <div className="relative z-10 space-y-10">
                                    <div className="space-y-2">
                                        <span className="text-secondary font-black tracking-[0.4em] uppercase text-[10px]">{t("vendor_profile.booking_label")}</span>
                                        <h3 className="font-display text-4xl font-black leading-tight">{t("vendor_profile.booking_title")}</h3>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <Button
                                            variant="secondary"
                                            size="lg"
                                            onClick={() => setQuoteOpen(true)}
                                            className="w-full text-xs"
                                        >
                                            {t("vendor_profile.get_quote")}
                                        </Button>
                                        <p className="text-[10px] text-center text-white/40 font-bold uppercase tracking-[0.25em]">{t("vendor_profile.no_commitment")}</p>
                                    </div>
                                    
                                    <div className="space-y-5 pt-10 border-t border-white/10">
                                        {[
                                            t("vendor_profile.highlights.response_time"),
                                            t("vendor_profile.highlights.exclusive_rates"),
                                            t("vendor_profile.highlights.concierge"),
                                            t("vendor_profile.highlights.secure_payment")
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/70">
                                                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                                                    <svg className="w-3 h-3 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                {item}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Trust badges */}
                            <div className="bg-white rounded-[2rem] p-8 border border-border/50 flex items-center gap-6 shadow-premium">
                                <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center shrink-0">
                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{t("vendor_profile.guarantee_label")}</p>
                                    <p className="text-sm font-black text-primary uppercase tracking-widest">{t("vendor_profile.guarantee_text")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <QuoteRequestModal
                isOpen={quoteOpen}
                onClose={() => setQuoteOpen(false)}
                vendorProfileId={vendor.id}
                vendorName={vendor.businessName}
            />
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ params, locale }) => {
    const slug = params?.slug as string;

    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";

        // Fetch profile by slug filter
        const profileRes = await fetch(
            `${baseUrl}/api/vendor_profiles?slug=${slug}&itemsPerPage=1`,
            { 
                headers: { 
                    Accept: "application/ld+json",
                    "Accept-Language": locale || "fr"
                } 
            }
        );

        if (!profileRes.ok) throw new Error("API unavailable");
        const profileData = await profileRes.json();
        const members = profileData["hydra:member"] ?? [];
        if (members.length === 0) return { notFound: true };

        const v = members[0];
        const vendor: VendorProfileData = {
            id: v.id,
            slug: v.slug,
            businessName: v.businessName,
            tagline: v.tagline,
            description: v.description,
            category: v.category,
            cities: v.cities ?? [],
            priceRange: v.priceRange,
            coverImageUrl: v.coverImageUrl,
            galleryImages: v.galleryImages ?? [],
            averageRating: v.averageRating,
            reviewCount: v.reviewCount ?? 0,
            isVerified: v.isVerified ?? false,
            minGuests: v.minGuests,
            maxGuests: v.maxGuests,
            menuItems: (v.menuItems ?? []).map((m: Record<string, unknown>) => ({
                id: m.id,
                name: m.name,
                description: m.description,
                pricePerPerson: m.pricePerPerson,
                category: m.category,
            })),
        };

        // Fetch reviews
        const reviewsRes = await fetch(
            `${baseUrl}/api/reviews?vendorProfile=${v.id}&page=1&itemsPerPage=10`,
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

        return { 
            props: { 
                vendor, 
                reviews,
                ...(await serverSideTranslations(locale || "fr", ["common"]))
            } 
        };
    } catch {
        // Return fallback in dev mode
        if (slug === "palais-des-roses-casablanca") {
            return { 
                props: { 
                    vendor: FALLBACK, 
                    reviews: FALLBACK_REVIEWS,
                    ...(await serverSideTranslations(locale || "fr", ["common"]))
                } 
            };
        }
        return { notFound: true };
    }
};
