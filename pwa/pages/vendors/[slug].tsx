import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { BadgeCheck, Grid, MapPin, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { Button } from "@/components/ui/button";
import StarRating from "@/components/ui/StarRating";
import PriceRange from "@/components/ui/PriceRange";
import ReservationWidget from "@/components/vendors/ReservationWidget";
import AvailabilityCalendar from "@/components/vendors/AvailabilityCalendar";
import { cn } from "@/lib/utils";
import { fetchServerSide } from "@/utils/fetchServerSide";

// Modular Components
import { VendorProfileData, ReviewData } from "@/components/vendors/profile/ProfileTypes";
import ProfileHeader from "@/components/vendors/profile/ProfileHeader";
import ProfileGallery from "@/components/vendors/profile/ProfileGallery";
import ProfileDescription from "@/components/vendors/profile/ProfileDescription";
import ProfileAmenities from "@/components/vendors/profile/ProfileAmenities";
import ProfileHost from "@/components/vendors/profile/ProfileHost";
import ProfileReviews from "@/components/vendors/profile/ProfileReviews";
import ProfileDetails from "@/components/vendors/profile/ProfileDetails";
import { FALLBACK_VENDOR, BOOKED_DATES } from "@/components/vendors/profile/ProfileConfig";

interface VendorProfilePageProps {
    vendor: VendorProfileData;
    reviews: ReviewData[];
}

export default function VendorProfilePage({ vendor, reviews }: VendorProfilePageProps) {
    const router = useRouter();
    const { t } = useTranslation("common");
    
    // Global/Shared State for Sub-components
    const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
    const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
    const [activeSection, setActiveSection] = useState('photos');
    const [isSaved, setIsSaved] = useState(false);
    const [isHeartAnimating, setIsHeartAnimating] = useState(false);
    const [isNavigating, setIsNavigating] = useState(false);

    const rating = vendor.averageRating ? parseFloat(vendor.averageRating) : 0;
    
    const allMedia = [
        ...(vendor.coverVideoUrl ? [{ type: 'video' as const, url: vendor.coverVideoUrl }] : []),
        ...(vendor.coverImageUrl ? [{ type: 'image' as const, url: vendor.coverImageUrl }] : []),
        ...(vendor.galleryImages || []).map(url => ({ type: 'image' as const, url }))
    ];

    const gridMedia = allMedia.slice(0, 5);

    // Initial Load & Wishlist Check
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
            setIsSaved(saved.includes(vendor.slug));
        }
    }, [vendor.slug]);

    // Navigation Events
    useEffect(() => {
        const handleStart = () => {
            if (typeof window !== 'undefined') window.scrollTo({top: 0});
            setIsNavigating(true);
        };
        const handleComplete = () => setIsNavigating(false);
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
        };
    }, [router]);

    // ScrollSpy Logic
    useEffect(() => {
        const handleScroll = () => {
            const sections = ['photos', 'services', 'avis', 'location'];
            let current = 'photos';
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 200) current = section;
                }
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: vendor.businessName,
                    text: vendor.tagline || t("vendor_profile.share_text", { name: vendor.businessName }),
                    url: window.location.href,
                });
            } catch { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            // eslint-disable-next-line no-alert
            alert(t("vendor_profile.link_copied"));
        }
    };

    const handleSave = () => {
        const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
        if (isSaved) {
            const newSaved = saved.filter((s: string) => s !== vendor.slug);
            localStorage.setItem('wishlist', JSON.stringify(newSaved));
            setIsSaved(false);
        } else {
            saved.push(vendor.slug);
            localStorage.setItem('wishlist', JSON.stringify(saved));
            setIsSaved(true);
            setIsHeartAnimating(true);
            setTimeout(() => setIsHeartAnimating(false), 300);
        }
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    if (isNavigating) {
        return (
            <main className="container mx-auto max-w-7xl px-6 pt-24 pb-20 animate-pulse">
                <div className="mb-8"><div className="h-12 bg-neutral-200 rounded-lg w-1/2" /></div>
                <div className="h-[500px] bg-neutral-200 rounded-2xl mb-12" />
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="flex-1 space-y-8"><div className="h-8 bg-neutral-200 rounded w-1/3" /></div>
                    <div className="lg:w-[400px] h-[400px] bg-neutral-200 rounded-xl" />
                </div>
            </main>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <Head>
                <title>{vendor.businessName} — Farah.ma</title>
                <meta name="description" content={vendor.tagline ?? vendor.description.slice(0, 160)} />
                <meta property="og:title" content={`${vendor.businessName} — Wedding Vendor in ${vendor.cities[0]?.name}`} />
                <meta property="og:image" content={vendor.coverImageUrl} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "LocalBusiness",
                            "name": vendor.businessName,
                            "image": vendor.coverImageUrl,
                            "aggregateRating": vendor.reviewCount > 0 ? {
                                "@type": "AggregateRating",
                                "ratingValue": rating,
                                "reviewCount": vendor.reviewCount
                            } : undefined,
                            "address": {
                                "@type": "PostalAddress",
                                "addressLocality": vendor.cities[0]?.name,
                                "addressCountry": "MA"
                            },
                        })
                    }}
                />
            </Head>

            <main className="container mx-auto max-w-7xl px-6 pt-24 pb-28 lg:pb-20">
                <ProfileHeader 
                    vendor={vendor} 
                    rating={rating} 
                    isSaved={isSaved} 
                    isHeartAnimating={isHeartAnimating}
                    onShare={handleShare}
                    onSave={handleSave}
                />

                <ProfileGallery 
                    vendor={vendor}
                    allMedia={allMedia}
                    gridMedia={gridMedia}
                    galleryIndex={galleryIndex}
                    setGalleryIndex={setGalleryIndex}
                />

                {/* ScrollSpy Navigation */}
                <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 mb-8 py-3 flex gap-6 overflow-x-auto no-scrollbar shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                    {[
                        {id: 'photos', label: t('vendor_profile.nav.photos')}, 
                        {id: 'services', label: t('vendor_profile.nav.services')}, 
                        {id: 'avis', label: t('vendor_profile.nav.reviews')}, 
                        {id: 'location', label: t('vendor_profile.nav.location')}
                    ].map(link => (
                        <button 
                            key={link.id} 
                            onClick={() => scrollToSection(link.id)}
                            className={cn("whitespace-nowrap font-bold text-[13px] uppercase tracking-wider transition-colors border-b-2 pb-1", activeSection === link.id ? "border-neutral-900 text-neutral-900" : "border-transparent text-neutral-500 hover:text-neutral-900")}
                        >
                            {link.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="flex-1 min-w-0">
                        <ProfileDescription vendor={vendor} />
                        <ProfileAmenities />
                        <ProfileHost vendor={vendor} rating={rating} />
                        
                        {/* Services Detail */}
                        {vendor.menuItems.length > 0 && (
                            <div id="services" className="pb-12 border-b border-neutral-200 mb-12 space-y-8 scroll-mt-24">
                                <h3 className="font-display text-3xl font-black text-neutral-900">{t("vendor_profile.services.title")}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {vendor.menuItems.map((item) => (
                                        <div key={item.id} className="p-6 border border-neutral-200 rounded-2xl hover:border-neutral-900 transition-all hover:shadow-lg">
                                            <div className="flex flex-col gap-4 h-full">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase text-secondary/60 tracking-widest">{item.category}</span>
                                                    <h4 className="text-lg font-black text-neutral-900">{item.name}</h4>
                                                </div>
                                                <p className="text-sm text-neutral-500 leading-relaxed italic line-clamp-3">{item.description}</p>
                                                {item.pricePerPerson && (
                                                    <div className="mt-auto pt-4 flex items-baseline gap-1.5">
                                                        <span className="text-xl font-black text-neutral-900">{Number(item.pricePerPerson).toLocaleString()} MAD</span>
                                                        <span className="text-[10px] font-black uppercase text-neutral-400">/ Personne</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <ProfileReviews reviews={reviews} rating={rating} reviewCount={vendor.reviewCount} />
                        
                        {/* Availability Section */}
                        <div className="py-12 border-t border-neutral-200 mt-12">
                            <AvailabilityCalendar 
                                range={dateRange}
                                onRangeSelect={setDateRange}
                                bookedDates={BOOKED_DATES}
                            />
                        </div>

                        <ProfileDetails vendor={vendor} />
                    </div>

                    {/* Right content: Reservation Widget */}
                    <aside id="reservation-widget" className="lg:w-[400px] shrink-0">
                        <div className="sticky top-32">
                            <div className="absolute -top-3 end-4 z-10 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md flex items-center gap-1 border border-green-200 shadow-sm">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                {t("vendor_profile.trust_badge.reactive")}
                            </div>
                            <ReservationWidget 
                                vendorId={vendor.id} 
                                vendorName={vendor.businessName}
                                priceRange={vendor.priceRange}
                                range={dateRange}
                                onRangeChange={setDateRange}
                                bookedDates={BOOKED_DATES}
                            />
                            <div className="mt-8 flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors">
                                 <span className="text-xs font-bold underline underline-offset-2 tracking-tight">
                                    {t("vendor_profile.report_listing")}
                                 </span>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Similar Vendors Section (Simplified for V2 refactor) */}
                <div className="mt-20 pt-12 border-t border-neutral-200">
                    <h3 className="font-display text-4xl font-black text-neutral-900 mb-10 tracking-tight">
                        {t("vendor_profile.similar.title", { city: vendor.cities[0]?.name })}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                         {[1, 2, 3, 4].map((id) => (
                             <div key={id} className="group cursor-pointer space-y-4">
                                 <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
                                     <Image src={`https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&sig=${id}`} alt="Recommandation" fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                 </div>
                                 <div className="space-y-1 px-1">
                                     <h4 className="font-bold text-neutral-900 text-lg">Palais El Bahja</h4>
                                     <p className="text-sm text-neutral-500 font-medium">{vendor.cities[0]?.name}</p>
                                 </div>
                             </div>
                         ))}
                    </div>
                </div>
            </main>

            {/* Mobile Sticky Booking Bar */}
            <div className="fixed bottom-0 start-0 end-0 bg-white border-t border-neutral-200 p-4 flex items-center justify-between lg:hidden z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <div>
                    <div className="font-black text-neutral-900 text-lg">
                         <span className="text-[10px] font-black uppercase text-neutral-500 block -mb-0.5">{t("vendor_card.starting_at")}</span>
                         <PriceRange value={vendor.priceRange} />
                    </div>
                </div>
                <Button className="rounded-xl px-8 h-12 font-bold bg-primary text-white" onClick={() => scrollToSection('reservation-widget')}>
                    {t("vendor_profile.reservation.reserve")}
                </Button>
            </div>

            {/* Floating WhatsApp Bubble */}
            <a 
                href={`https://wa.me/${vendor.whatsapp?.replace(/\D/g, '') || "212600000000"}?text=${encodeURIComponent(`Bonjour, je vous contacte depuis votre profil Farah.ma (${vendor.businessName}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-32 lg:bottom-8 end-6 z-[60] bg-[#25D366] hover:bg-[#1DA851] text-white p-4 rounded-full shadow-lg hover:scale-110 transition-all flex items-center justify-center gap-3"
            >
                <MessageCircle className="w-6 h-6 lg:w-7 lg:h-7" />
                <span className="hidden lg:block font-bold">Contactez-nous</span>
            </a>
        </div>
    );
}

const FALLBACK_REVIEWS: ReviewData[] = [
    { id: 1, rating: 5, body: "Merci à toute l'équipe pour avoir fait de notre mariage un rêve éveillé.", createdAt: "2026-02-14T00:00:00Z", author: { firstName: "Yassine", lastName: "S." } },
    { id: 2, rating: 5, body: "Tout était parfait : de l'accueil à la fin de la soirée.", createdAt: "2026-01-20T00:00:00Z", author: { firstName: "Sara", lastName: "M." } },
];

export const getServerSideProps: GetServerSideProps<VendorProfilePageProps> = async ({ params, locale }) => {
    const slug = params?.slug as string;
    try {
        const data = await fetchServerSide<{ "hydra:member": unknown[] }>(
            `/api/vendor_profiles?slug=${slug}&itemsPerPage=1`,
            { locale: locale || "fr" },
        );
        const members = data["hydra:member"] ?? [];
        if (members.length === 0) return { notFound: true };
        const v = members[0] as Record<string, any>;
        const vendor: VendorProfileData = {
            id: v.id, slug: v.slug, businessName: v.businessName, tagline: v.tagline, description: v.description,
            category: v.category?.name ?? 'Vendor', cities: v.cities ?? [], priceRange: v.priceRange,
            coverImageUrl: v.coverImageUrl, coverVideoUrl: v.coverVideoUrl, galleryImages: v.galleryImages ?? [],
            averageRating: v.averageRating, reviewCount: v.reviewCount ?? 0, isVerified: v.isVerified ?? false,
            minGuests: v.minGuests, maxGuests: v.maxGuests,
            menuItems: (v.menuItems ?? []).map((m: any) => ({
                id: m.id, name: m.name, description: m.description, pricePerPerson: m.pricePerPerson, category: m.category,
            })),
            owner: v.owner ? { id: v.owner.id, firstName: v.owner.firstName, lastName: v.owner.lastName, createdAt: v.owner.createdAt } : FALLBACK_VENDOR.owner,
        };
        const reviews = v.reviews && v.reviews.length > 0 ? v.reviews : FALLBACK_REVIEWS;
        return { props: { ...(await serverSideTranslations(locale || "fr", ["common"])), vendor, reviews } };
    } catch (e) {
        return { props: { ...(await serverSideTranslations(locale || "fr", ["common"])), vendor: FALLBACK_VENDOR, reviews: FALLBACK_REVIEWS } };
    }
};
