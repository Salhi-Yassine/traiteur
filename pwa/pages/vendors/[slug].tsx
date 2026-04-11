import Head from "next/head";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import StarRating from "../../components/ui/StarRating";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import PriceRange from "../../components/ui/PriceRange";
import ReservationWidget from "../../components/vendors/ReservationWidget";
import AvailabilityCalendar from "../../components/vendors/AvailabilityCalendar";
import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { BadgeCheck, Wifi, Car, Wind, Utensils, Sparkles, ShieldCheck, MessageCircle, X, ChevronLeft, ChevronRight, Grid, MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../../components/ui/dialog";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "../../components/ui/drawer";

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

interface VendorProfilePageProps {
    vendor: VendorProfileData;
    reviews: ReviewData[];
}

export default function VendorProfilePage({ vendor, reviews }: VendorProfilePageProps) {
    const router = useRouter();
    const { t } = useTranslation("common");
    const [dateRange, setDateRange] = useState<{ from: string | null; to: string | null }>({ from: null, to: null });
    const [galleryIndex, setGalleryIndex] = useState<number | null>(null);
    const [isNavigating, setIsNavigating] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [isHeartAnimating, setIsHeartAnimating] = useState(false);
    const [activeSection, setActiveSection] = useState('photos');
    const [showAllAmenities, setShowAllAmenities] = useState(false);
    const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
    const [showAllReviews, setShowAllReviews] = useState(false);
    const [kbygDrawer, setKbygDrawer] = useState<'rules' | 'safety' | 'cancellation' | null>(null);

    const rating = vendor.averageRating ? parseFloat(vendor.averageRating) : 0;
    const allMedia = [
        ...(vendor.coverVideoUrl ? [{ type: 'video' as const, url: vendor.coverVideoUrl }] : []),
        ...(vendor.coverImageUrl ? [{ type: 'image' as const, url: vendor.coverImageUrl }] : []),
        ...(vendor.galleryImages || []).map(url => ({ type: 'image' as const, url }))
    ];

    const faqs = [
        { q: "Quelles sont vos conditions de réservation ?", a: `Pour valider la date, nous demandons un acompte de 30% du montant global. Le reste est réglable 1 semaine avant l'événement.` },
        { q: "Est-il possible de faire une dégustation ?", a: `Absolument. Une fois la réservation confirmée, nous organisons une séance de dégustation complète de votre menu.` },
        { q: "Proposez-vous des menus végétariens ou spéciaux ?", a: `Oui, notre chef peut adapter le menu pour inclure des options végétariennes, sans gluten ou selon vos exigences diététiques spécifiques.` },
        { q: "Quelle est votre capacité maximale ?", a: `Notre domaine peut accueillir jusqu'à 600 invités en format dîner assis et 800 personnes en format cocktail.` }
    ];
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqs.map((faq) => ({
            "@type": "Question",
            "name": faq.q,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
            }
        }))
    };

    // Mock booked dates for demo
    const bookedDates = ["2026-04-12", "2026-04-13", "2026-04-25", "2026-05-02", "2026-05-15"];

    // Airbnb-style masonry grid logic (first 5 media)
    const gridMedia = allMedia.slice(0, 5);

    useEffect(() => {
        const handleStart = () => {
            if (typeof window !== 'undefined') window.scrollTo({top: 0});
            setIsNavigating(true);
        };
        const handleComplete = () => setIsNavigating(false);
        router.events.on('routeChangeStart', handleStart);
        router.events.on('routeChangeComplete', handleComplete);
        router.events.on('routeChangeError', handleComplete);

        if (typeof window !== 'undefined') {
            const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
            setIsSaved(saved.includes(vendor.slug));
        }

        const handleScroll = () => {
            const sections = ['photos', 'services', 'avis', 'location'];
            let current = 'photos';
            for (const section of sections) {
                const el = document.getElementById(section);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 200) {
                        current = section;
                    }
                }
            }
            setActiveSection(current);
        };
        window.addEventListener('scroll', handleScroll);

        return () => {
            router.events.off('routeChangeStart', handleStart);
            router.events.off('routeChangeComplete', handleComplete);
            router.events.off('routeChangeError', handleComplete);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [router, vendor.slug]);

    useEffect(() => {
        if (galleryIndex === null) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setGalleryIndex(null);
            if (e.key === 'ArrowRight') setGalleryIndex((prev: number | null) => (prev! + 1) % allMedia.length);
            if (e.key === 'ArrowLeft') setGalleryIndex((prev: number | null) => (prev! - 1 + allMedia.length) % allMedia.length);
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [galleryIndex, allMedia.length]);

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

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: vendor.businessName,
                    text: vendor.tagline || `Découvrez ${vendor.businessName} sur Farah.ma`,
                    url: window.location.href,
                });
            } catch (err) { }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert("Lien copié !");
        }
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <div className="bg-white min-h-screen">
            <Head>
                <title>{vendor.businessName} — Farah.ma</title>
                <meta name="description" content={vendor.tagline ?? vendor.description.slice(0, 160)} />
                
                {/* OpenGraph / Facebook */}
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://farah.ma/vendors/${vendor.slug}`} />
                <meta property="og:title" content={`${vendor.businessName} — Wedding Vendor in ${vendor.cities[0]?.name}`} />
                <meta property="og:description" content={vendor.tagline ?? vendor.description.slice(0, 160)} />
                <meta property="og:image" content={vendor.coverImageUrl} />

                {/* Twitter */}
                <meta property="twitter:card" content="summary_large_image" />
                <meta property="twitter:url" content={`https://farah.ma/vendors/${vendor.slug}`} />
                <meta property="twitter:title" content={`${vendor.businessName} — Farah.ma`} />
                <meta property="twitter:description" content={vendor.tagline ?? vendor.description.slice(0, 160)} />
                <meta property="twitter:image" content={vendor.coverImageUrl} />
                <meta property="twitter:site" content="@farah_ma" />
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
                <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
            </Head>

            {isNavigating ? (
                <main className="container mx-auto max-w-7xl px-6 pt-24 pb-20 animate-pulse">
                    <div className="mb-8">
                        <div className="h-6 bg-neutral-200 rounded-full w-24 mb-4" />
                        <div className="h-12 bg-neutral-200 rounded-lg w-1/2 mb-4" />
                        <div className="h-6 bg-neutral-200 rounded w-1/3" />
                    </div>
                    <div className="h-[300px] md:h-[500px] bg-neutral-200 rounded-xl md:rounded-2xl mb-12" />
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="flex-1 space-y-8">
                            <div className="h-8 bg-neutral-200 rounded w-1/3" />
                            <div className="space-y-4">
                                <div className="h-4 bg-neutral-200 rounded w-full" />
                                <div className="h-4 bg-neutral-200 rounded w-full" />
                                <div className="h-4 bg-neutral-200 rounded w-3/4" />
                            </div>
                        </div>
                        <div className="lg:w-[400px] shrink-0 h-[400px] bg-neutral-200 rounded-xl" />
                    </div>
                </main>
            ) : (
            <main className="container mx-auto max-w-7xl px-6 pt-24 pb-28 lg:pb-20">
                {/* Header: Title & Meta */}
                <div className="mb-8">
                    <div className="mb-4">
                        <Badge variant="category" className="bg-neutral-100 text-[#222222] text-[10px] uppercase tracking-wider font-bold rounded-full px-4 py-1.5 border-0 shadow-sm">
                            {vendor.category}
                        </Badge>
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl font-black text-neutral-900 mb-4 tracking-tight flex items-center gap-3">
                        {vendor.businessName}
                        {vendor.isVerified && (
                             <div className="bg-white text-[#0A7A4B] rounded-full p-1 shadow-sm border border-[#0A7A4B]/20 flex items-center justify-center shrink-0">
                                <BadgeCheck className="w-6 h-6 md:w-8 md:h-8" strokeWidth={2.5} />
                             </div>
                        )}
                    </h1>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-6 text-sm font-bold text-neutral-700">
                             <div className="flex items-center gap-1.5 underline decoration-neutral-300">
                                <StarRating rating={rating} showCount={false} size="sm" />
                                <span>{rating} ({vendor.reviewCount} {t("vendor_profile.reviews_count")})</span>
                             </div>
                             <div className="flex items-center gap-1.5 underline decoration-neutral-300">
                                <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                </svg>
                                <span>{vendor.cities.map(c => t(`search_bar.cities.${c.slug}`, c.name)).join(', ')}</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-2">
                             <Button onClick={handleShare} variant="ghost" size="sm" className="rounded-xl flex items-center gap-2 hover:bg-neutral-100">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                <span className="underline font-bold text-xs">{t("nav.share", "Partager")}</span>
                             </Button>
                             <Button onClick={handleSave} variant="ghost" size="sm" className="rounded-xl flex items-center gap-2 hover:bg-neutral-100">
                                <svg className={cn("w-4 h-4 transition-all duration-300", isSaved ? "fill-[#FF385C] text-[#FF385C]" : "fill-none text-currentColor", isHeartAnimating && "scale-125")} stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSaved ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                                <span className="underline font-bold text-xs">{isSaved ? t("common.saved", "Sauvegardé") : t("common.save")}</span>
                             </Button>
                        </div>
                    </div>
                </div>

                {/* Photo Grid: Airbnb Style */}
                <div id="photos" className="group relative h-[300px] md:h-[500px] flex md:grid grid-cols-4 grid-rows-2 gap-2 overflow-x-auto md:overflow-hidden snap-x snap-mandatory mx-[-1.5rem] px-[1.5rem] md:mx-0 md:px-0 mb-12 scroll-mt-24 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] md:rounded-2xl">
                    {gridMedia.length > 0 && (
                        <>
                            {/* Main large photo */}
                            <div className="shrink-0 w-[90vw] md:w-auto h-full snap-center col-span-4 md:col-span-2 row-span-1 md:row-span-2 relative overflow-hidden bg-neutral-100 group/item cursor-pointer rounded-xl md:rounded-none" onClick={() => setGalleryIndex(0)}>
                                {gridMedia[0].type === 'video' ? (
                                    <video
                                        src={gridMedia[0].url}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover transition-all duration-700 group-hover/item:scale-105"
                                    />
                                ) : (
                                    <Image
                                        src={gridMedia[0].url}
                                        alt={`${vendor.businessName} photo 1`}
                                        fill
                                        className="object-cover transition-all duration-700 group-hover/item:scale-105"
                                        priority
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        placeholder="blur"
                                        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
                                    />
                                )}
                                <div className="absolute inset-0 bg-black/0 group-hover/item:bg-black/10 transition-colors" />
                            </div>
                            
                            {/* Secondary photos (Scrollable on mobile) */}
                            {gridMedia.slice(1, 5).map((media, idx) => (
                                <div key={idx} className={`shrink-0 w-[90vw] md:w-auto h-full snap-center relative overflow-hidden bg-neutral-100 cursor-pointer group/item${idx + 2} rounded-xl md:rounded-none`} onClick={() => setGalleryIndex(idx + 1)}>
                                    {media.type === 'video' ? (
                                        <video src={media.url} autoPlay muted loop playsInline className="w-full h-full object-cover transition-all duration-700 hover:scale-105" />
                                    ) : (
                                        <Image
                                            src={media.url}
                                            alt={`${vendor.businessName} photo ${idx + 2}`}
                                            fill
                                            className="object-cover transition-all duration-700 hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 25vw"
                                            placeholder="blur"
                                            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAoMBgDTD2qgAAAAASUVORK5CYII="
                                        />
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                    
                    {/* Show all photos button */}
                    <button 
                        onClick={() => setGalleryIndex(0)}
                        className="absolute bottom-6 end-6 bg-white border border-neutral-900 rounded-lg px-4 py-2 text-xs font-bold hover:bg-neutral-50 flex items-center gap-2 transition-all shadow-md active:scale-95"
                    >
                        <Grid className="w-4 h-4" />
                        {t("vendor_profile.gallery.show_all")}
                    </button>
                </div>

                {/* Immersive Photo Gallery Lightbox */}
                {galleryIndex !== null && (
                    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in fade-in zoom-in-95 duration-300 backdrop-blur-sm">
                        <div className="absolute top-6 right-6 z-50 flex items-center gap-4">
                            <span className="text-white/60 font-medium tracking-widest text-sm">{galleryIndex + 1} / {allMedia.length}</span>
                            <button onClick={() => setGalleryIndex(null)} className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors active:scale-95">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <button onClick={() => setGalleryIndex((prev: number | null) => (prev! - 1 + allMedia.length) % allMedia.length)} className="absolute start-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 md:block hidden active:scale-90">
                            <ChevronLeft className="w-8 h-8 rtl:rotate-180" />
                        </button>

                        <button onClick={() => setGalleryIndex((prev: number | null) => (prev! + 1) % allMedia.length)} className="absolute end-6 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-50 md:block hidden active:scale-90">
                            <ChevronRight className="w-8 h-8 rtl:rotate-180" />
                        </button>

                        <div className="flex-1 overflow-hidden relative flex items-center justify-center p-4 md:p-12 w-full h-full" onClick={() => setGalleryIndex(null)}>
                            <div className="relative w-full h-full max-w-7xl" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                                {allMedia[galleryIndex].type === 'video' ? (
                                    <video 
                                        src={allMedia[galleryIndex].url}
                                        controls
                                        autoPlay
                                        playsInline
                                        className="w-full h-full object-contain animate-in fade-in duration-500 rounded-xl"
                                    />
                                ) : (
                                    <Image 
                                        src={allMedia[galleryIndex].url} 
                                        alt={`Gallery image`} 
                                        fill 
                                        className="object-contain animate-in fade-in duration-500" 
                                        sizes="100vw"
                                        priority
                                    />
                                )}
                            </div>
                        </div>
                        
                        {/* Mobile Swipe Hints */}
                        <div className="absolute bottom-8 left-0 right-0 flex justify-center md:hidden pointer-events-none">
                            <div className="bg-black/50 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full flex gap-2 items-center">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                                {t("vendor_profile.gallery.tap_hint", "Appuyez sur les côtés pour naviguer")}
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                        
                        {/* Invisible Mobile Tap Zones */}
                        <div className="absolute inset-y-0 start-0 w-1/3 z-40 md:hidden" onClick={() => setGalleryIndex((prev: number | null) => (prev! - 1 + allMedia.length) % allMedia.length)} />
                        <div className="absolute inset-y-0 end-0 w-1/3 z-40 md:hidden" onClick={() => setGalleryIndex((prev: number | null) => (prev! + 1) % allMedia.length)} />
                    </div>
                )}

                {/* ScrollSpy Navigation */}
                <div className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-200 mb-8 py-3 flex gap-6 overflow-x-auto no-scrollbar shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
                    {[
                        {id: 'photos', label: t('vendor_profile.nav.photos', 'Photos')}, 
                        {id: 'services', label: t('vendor_profile.nav.services', 'Services')}, 
                        {id: 'avis', label: t('vendor_profile.nav.reviews', 'Avis')}, 
                        {id: 'location', label: t('vendor_profile.nav.location', 'Localisation')}
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

                {/* Content Grid */}
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Left content: Information */}
                    <div className="flex-1 min-w-0">
                        {/* Summary / Category */}
                        <div className="pb-8 border-b border-neutral-200 mb-8">
                            <div className="flex items-center justify-between mb-2">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-black text-neutral-900 leading-tight">
                                    {vendor.category} {t("common.in", "à")} {t(`search_bar.cities.${vendor.cities[0]?.slug}`, vendor.cities[0]?.name)}
                                </h2>
                                <p className="text-neutral-500 font-medium">
                                    {vendor.maxGuests ? t("vendor_profile.capacity_max", { max: vendor.maxGuests }) : t("vendor_profile.all_events", 'Tous types d\'événements')}
                                </p>
                            </div>
                            <div className="w-14 h-14 bg-neutral-100 rounded-full flex items-center justify-center shrink-0">
                                <svg className="w-7 h-7 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                        </div>
                        </div>

                        {/* Description */}
                        <div className="pb-12 border-b border-neutral-200 mb-12">
                             {vendor.tagline && (
                                <p className="text-xl font-black text-neutral-900 italic mb-6">"{vendor.tagline}"</p>
                             )}
                             <p className="text-neutral-700 leading-relaxed text-lg font-medium whitespace-pre-wrap md:line-clamp-none line-clamp-4">
                                 {vendor.description}
                             </p>
                             <Drawer>
                               <DrawerTrigger asChild>
                                 <button className="mt-4 flex items-center gap-1.5 text-neutral-900 font-black underline underline-offset-4 hover:decoration-2 md:hidden">
                                    {t("common.read_more", "En savoir plus")}
                                    <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                                 </button>
                               </DrawerTrigger>
                               <DrawerContent className="px-6 py-4">
                                 <DrawerHeader className="px-0 pb-4 border-b border-neutral-100">
                                   <DrawerTitle>{t("vendor_profile.about.title", "À propos")}</DrawerTitle>
                                 </DrawerHeader>
                                 <div className="py-6 overflow-y-auto max-h-[60vh] text-neutral-700 leading-relaxed font-medium whitespace-pre-wrap">
                                   {vendor.description}
                                 </div>
                               </DrawerContent>
                             </Drawer>
                        </div>

                        {/* Amenities Section */}
                        <div className="pb-12 border-b border-neutral-200 mb-12">
                            <h3 className="font-display text-3xl font-black text-neutral-900 mb-8 tracking-tight">
                                {t("vendor_profile.amenities.title")}
                            </h3>
                            {(() => {
                                const allAmenities = [
                                    { icon: Wifi, label: t("vendor_profile.amenities.wifi") },
                                    { icon: Wind, label: t("vendor_profile.amenities.ac") },
                                    { icon: Car, label: t("vendor_profile.amenities.parking") },
                                    { icon: Utensils, label: t("vendor_profile.amenities.kitchen") },
                                    { icon: Sparkles, label: t("vendor_profile.amenities.cleaning") },
                                    { icon: ShieldCheck, label: t("vendor_profile.amenities.security") },
                                ];
                                const visible = showAllAmenities ? allAmenities : allAmenities.slice(0, 4);
                                return (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 md:grid-cols-2">
                                        {visible.map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4">
                                                <item.icon className="w-6 h-6 text-neutral-500" strokeWidth={1.5} />
                                                <span className="text-neutral-700 font-medium">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                );
                            })()}

                            {/* Mobile: drawer to show all; Desktop: inline toggle */}
                            <Drawer>
                               <DrawerTrigger asChild>
                                 <Button variant="outline" className="md:hidden mt-8 rounded-xl border-neutral-900 h-12 px-8 font-bold hover:bg-neutral-100 transition-all shadow-sm w-full">
                                    {t("vendor_profile.amenities.show_all")}
                                 </Button>
                               </DrawerTrigger>
                               <DrawerContent className="px-6 py-4">
                                 <DrawerHeader className="px-0 pb-4 border-b border-neutral-100">
                                   <DrawerTitle>{t("vendor_profile.amenities.title")}</DrawerTitle>
                                 </DrawerHeader>
                                 <div className="py-6 overflow-y-auto max-h-[60vh]">
                                    <div className="flex flex-col gap-y-6">
                                       {[
                                           { icon: Wifi, label: t("vendor_profile.amenities.wifi") },
                                           { icon: Wind, label: t("vendor_profile.amenities.ac") },
                                           { icon: Car, label: t("vendor_profile.amenities.parking") },
                                           { icon: Utensils, label: t("vendor_profile.amenities.kitchen") },
                                           { icon: Sparkles, label: t("vendor_profile.amenities.cleaning") },
                                           { icon: ShieldCheck, label: t("vendor_profile.amenities.security") },
                                       ].map((item, idx) => (
                                          <div key={idx} className="flex items-center gap-4">
                                             <item.icon className="w-6 h-6 text-neutral-500" strokeWidth={1.5} />
                                             <span className="text-neutral-700 font-medium">{item.label}</span>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                               </DrawerContent>
                             </Drawer>

                            <Button
                                variant="outline"
                                onClick={() => setShowAllAmenities(prev => !prev)}
                                className="hidden md:flex mt-10 rounded-xl border-neutral-900 h-12 px-8 font-bold hover:bg-neutral-100 transition-all shadow-sm"
                            >
                                {showAllAmenities ? t("vendor_profile.amenities.show_less") : t("vendor_profile.amenities.show_all")}
                            </Button>
                        </div>

                        {/* Meet your Host Section */}
                        <div className="pb-12 border-b border-neutral-200 mb-12">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center font-black text-2xl text-neutral-900 border border-neutral-200 overflow-hidden ring-4 ring-white shadow-md">
                                    {vendor.owner.firstName[0]}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black text-neutral-900 leading-tight">
                                        {t("vendor_profile.host.meet_title", { name: vendor.owner.firstName })}
                                    </h3>
                                    <p className="text-neutral-500 font-medium">
                                        {t("vendor_profile.host.member_since", "Membre depuis")} {new Date(vendor.owner.createdAt).getFullYear()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-8 mb-8">
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-neutral-900" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                    </svg>
                                    <span className="text-sm font-bold text-neutral-900">{rating} {t("vendor_profile.review_label", "Note")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                    </svg>
                                    <span className="text-sm font-bold text-neutral-900">{vendor.reviewCount} {t("vendor_profile.reviews_count")}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <svg className="w-5 h-5 text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-sm font-bold text-neutral-900">{t("vendor_profile.highlights.response_time_short", "Réponse: ~1h")}</span>
                                </div>
                            </div>
                            <p className="text-neutral-700 leading-relaxed font-medium">
                                {vendor.owner.firstName} s'engage à faire de votre événement une réussite totale. 
                                "Nous mettons un point d'honneur à offrir un service personnalisé pour chaque couple, 
                                en veillant aux moindres détails pour que votre grand jour soit parfait."
                            </p>
                            <div className="flex flex-wrap gap-4 mt-8">
                                {vendor.whatsapp ? (
                                    <a
                                        href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Bonjour, je vous contacte depuis votre profil Farah.ma (${vendor.businessName}). J'aimerais avoir plus de détails concernant une réservation.`)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-12 px-8 rounded-xl border border-neutral-900 bg-white hover:bg-neutral-100 text-neutral-900 flex items-center gap-2 font-bold transition-all active:scale-95"
                                    >
                                        {t("vendor_profile.host.contact_label")}
                                    </a>
                                ) : (
                                    <Button variant="outline" className="rounded-xl border-neutral-900 h-12 px-8 font-bold hover:bg-neutral-100 flex items-center gap-2" disabled>
                                        {t("vendor_profile.host.contact_label")}
                                    </Button>
                                )}
                                {vendor.whatsapp && (
                                    <a
                                        href={`https://wa.me/${vendor.whatsapp.replace(/\D/g, '')}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="h-12 px-8 rounded-xl bg-[#25D366] hover:bg-[#20bd5c] text-white flex items-center gap-2 font-bold shadow-md transition-all active:scale-95"
                                    >
                                        <MessageCircle className="w-5 h-5 fill-current" />
                                        {t("vendor_profile.host.contact")}
                                    </a>
                                )}
                            </div>
                        </div>

                        {/* Services Detail */}
                        {vendor.menuItems.length > 0 && (
                            <div id="services" className="pb-12 border-b border-neutral-200 mb-12 space-y-8 scroll-mt-24">
                                <h3 className="font-display text-3xl font-black text-neutral-900">{t("vendor_profile.services.title")}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {vendor.menuItems.map((item) => (
                                        <div key={item.id} className="p-6 border border-neutral-200 rounded-2xl hover:border-neutral-900 transition-all hover:shadow-2">
                                            <div className="flex flex-col gap-4 h-full">
                                                <div className="space-y-1">
                                                    <span className="text-[10px] font-black uppercase text-secondary/60 tracking-widest">{item.category}</span>
                                                    <h4 className="text-lg font-black text-neutral-900">{item.name}</h4>
                                                </div>
                                                <p className="text-sm text-neutral-500 leading-relaxed italic line-clamp-3">
                                                    {item.description}
                                                </p>
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

                        {/* Location Section */}
                        <div id="location" className="pb-12 border-b border-neutral-200 mb-12 scroll-mt-24">
                            <div className="flex items-center justify-between mb-8">
                                <div className="space-y-1">
                                    <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight">
                                        {t("vendor_profile.location.title", "Localisation")}
                                    </h3>
                                    <p className="text-neutral-500 font-medium flex items-center gap-1.5">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        {vendor.cities[0]?.name}, Maroc
                                    </p>
                                </div>
                            </div>
                            
                            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-lg border-4 border-white ring-1 ring-neutral-200">
                                <iframe
                                    className="w-full h-full border-0"
                                    loading="lazy"
                                    allowFullScreen
                                    referrerPolicy="no-referrer-when-downgrade"
                                    src={`https://www.google.com/maps?q=${encodeURIComponent(vendor.businessName + ' ' + (vendor.cities[0]?.name || ''))}&output=embed`}
                                />
                            </div>
                        </div>

                        {/* Reviews (Summary) */}
                        <div id="avis" className="space-y-10 scroll-mt-24">
                            <div className="flex items-center gap-2">
                                 <svg className="w-6 h-6 text-primary fill-primary" viewBox="0 0 24 24">
                                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 6.91-1.01L12 2z" />
                                </svg>
                                <h3 className="font-display text-3xl font-black text-neutral-900">
                                    {rating} · {vendor.reviewCount} {t("vendor_profile.reviews.count", "avis")}
                                </h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                {reviews.slice(0, showAllReviews ? reviews.length : 2).map((review) => (
                                    <div key={review.id} className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center font-black text-neutral-900">
                                                {review.author?.firstName[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold text-neutral-900">{review.author?.firstName} {review.author?.lastName[0]}.</p>
                                                <p className="text-xs text-neutral-500">{new Date(review.createdAt).toLocaleDateString('fr-MA', { month: 'long', year: 'numeric' })}</p>
                                            </div>
                                        </div>
                                        <p className={cn("text-neutral-700 leading-relaxed font-medium", expandedReviews.has(review.id) ? "" : "line-clamp-3")}>"{review.body}"</p>
                                        {!expandedReviews.has(review.id) && (
                                            <button
                                                onClick={() => setExpandedReviews(prev => new Set(prev).add(review.id))}
                                                className="text-sm font-black underline underline-offset-4"
                                            >
                                                {t("common.show_more")}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            {vendor.reviewCount > 2 && (
                                <Button
                                    variant="outline"
                                    onClick={() => setShowAllReviews(prev => !prev)}
                                    className="mt-8 rounded-xl border-neutral-900 h-10 px-6 font-bold hover:bg-neutral-100"
                                >
                                    {showAllReviews
                                        ? t("common.show_less")
                                        : t("vendor_profile.reviews.show_all", { count: vendor.reviewCount })}
                                </Button>
                            )}
                        </div>

                        {/* Availability Section */}
                        <div className="py-12 border-t border-neutral-200 mt-12">
                            <AvailabilityCalendar 
                                range={dateRange}
                                onRangeSelect={setDateRange}
                                bookedDates={bookedDates}
                            />
                        </div>

                        <div className="py-12 border-t border-neutral-200 mt-12">
                             <h3 className="font-display text-3xl font-black text-neutral-900 tracking-tight">
                                {t("vendor_profile.know_before_you_go.title")}
                             </h3>
                             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                                <div className="space-y-4">
                                    <h4 className="font-bold text-neutral-900 uppercase text-[10px] tracking-widest font-black">
                                        {t("vendor_profile.know_before_you_go.house_rules")}
                                    </h4>
                                    <ul className="space-y-3 text-neutral-600 font-medium text-sm">
                                        <li>{t("vendor_profile.rules.check_in")}</li>
                                        <li>{t("vendor_profile.rules.check_out")}</li>
                                        <li>{t("vendor_profile.rules.parties")}</li>
                                        <li>{t("vendor_profile.rules.smoking")}</li>
                                    </ul>
                                    <button
                                        onClick={() => setKbygDrawer('rules')}
                                        className="text-sm font-black underline underline-offset-4 pt-2"
                                    >
                                        {t("common.show_more")}
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-neutral-900 uppercase text-[10px] tracking-widest font-black">
                                        {t("vendor_profile.know_before_you_go.safety")}
                                    </h4>
                                    <ul className="space-y-3 text-neutral-600 font-medium text-sm">
                                        <li>{t("vendor_profile.safety.exits")}</li>
                                        <li>{t("vendor_profile.safety.alarm")}</li>
                                        <li>{t("vendor_profile.safety.capacity")}</li>
                                    </ul>
                                    <button
                                        onClick={() => setKbygDrawer('safety')}
                                        className="text-sm font-black underline underline-offset-4 pt-2"
                                    >
                                        {t("common.show_more")}
                                    </button>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="font-bold text-neutral-900 uppercase text-[10px] tracking-widest font-black">
                                        {t("vendor_profile.know_before_you_go.cancellation")}
                                    </h4>
                                    <p className="text-neutral-600 font-medium text-sm leading-relaxed">
                                        {t("vendor_profile.cancellation.standard_desc")}
                                    </p>
                                    <button
                                        onClick={() => setKbygDrawer('cancellation')}
                                        className="text-sm font-black underline underline-offset-4 pt-2"
                                    >
                                        {t("common.show_more")}
                                    </button>
                                </div>
                             </div>
                        </div>

                        {/* Know Before You Go — detail drawer */}
                        <Drawer open={kbygDrawer !== null} onOpenChange={(open) => { if (!open) setKbygDrawer(null); }}>
                            <DrawerContent className="px-6 py-4">
                                <DrawerHeader className="px-0 pb-4 border-b border-neutral-100">
                                    <DrawerTitle>
                                        {kbygDrawer === 'rules' && t("vendor_profile.know_before_you_go.house_rules")}
                                        {kbygDrawer === 'safety' && t("vendor_profile.know_before_you_go.safety")}
                                        {kbygDrawer === 'cancellation' && t("vendor_profile.know_before_you_go.cancellation")}
                                    </DrawerTitle>
                                </DrawerHeader>
                                <div className="py-6 overflow-y-auto max-h-[60vh]">
                                    {kbygDrawer === 'rules' && (
                                        <ul className="space-y-4 text-neutral-700 font-medium">
                                            <li>{t("vendor_profile.rules.check_in")}</li>
                                            <li>{t("vendor_profile.rules.check_out")}</li>
                                            <li>{t("vendor_profile.rules.parties")}</li>
                                            <li>{t("vendor_profile.rules.smoking")}</li>
                                        </ul>
                                    )}
                                    {kbygDrawer === 'safety' && (
                                        <ul className="space-y-4 text-neutral-700 font-medium">
                                            <li>{t("vendor_profile.safety.exits")}</li>
                                            <li>{t("vendor_profile.safety.alarm")}</li>
                                            <li>{t("vendor_profile.safety.capacity")}</li>
                                        </ul>
                                    )}
                                    {kbygDrawer === 'cancellation' && (
                                        <p className="text-neutral-700 font-medium leading-relaxed">
                                            {t("vendor_profile.cancellation.standard_desc")}
                                        </p>
                                    )}
                                </div>
                            </DrawerContent>
                        </Drawer>

                        {/* Foire Aux Questions (FAQ) */}
                        <div className="py-12 border-t border-neutral-200 mt-12">
                            <h3 className="font-display text-3xl font-black text-neutral-900 mb-8">{t("vendor_profile.faq.title")}</h3>
                            <div className="space-y-4">
                                {faqs.map((faq, idx) => (
                                    <div key={idx} className="border border-neutral-200 rounded-2xl overflow-hidden bg-white hover:border-neutral-300 transition-colors">
                                        <button 
                                            onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                                            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                                        >
                                            <span className="font-bold text-neutral-900 select-none">{faq.q}</span>
                                            <svg className={cn("w-5 h-5 text-neutral-500 shrink-0 transition-transform duration-300", openFaq === idx && "rotate-180")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        <div className={cn("px-6 overflow-hidden transition-all duration-300", openFaq === idx ? "max-h-40 pb-5 opacity-100" : "max-h-0 opacity-0")}>
                                            <p className="text-neutral-600 leading-relaxed">{faq.a}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>


                    </div>

                    {/* Right content: Reservation Widget */}
                    <div id="reservation-widget" className="lg:w-[400px] shrink-0">
                        <div className="sticky top-32 relative">
                            {/* Trust Badge */}
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
                                bookedDates={bookedDates}
                            />

                            {/* Report listing */}
                            <div className="mt-8 flex items-center justify-center gap-2 text-neutral-500 hover:text-neutral-900 cursor-pointer transition-colors">
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                                 </svg>
                                 <span className="text-xs font-bold underline underline-offset-2 tracking-tight">
                                    {t("vendor_profile.report_listing", "Signaler cette annonce")}
                                 </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Similar Vendors Section */}
                <div className="mt-20 pt-12 border-t border-neutral-200">
                    <h3 className="font-display text-4xl font-black text-neutral-900 mb-10 tracking-tight">
                        {t("vendor_profile.similar.title", { city: t(`search_bar.cities.${vendor.cities[0]?.slug}`, vendor.cities[0]?.name) })}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                         {[1, 2, 3, 4].map((id) => (
                             <div key={id} className="group cursor-pointer space-y-4">
                                 <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-sm">
                                     <Image 
                                        src={`https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80&sig=${id}`} 
                                        alt="Recommandation" 
                                        fill 
                                        className="object-cover group-hover:scale-110 transition-transform duration-700" 
                                     />
                                     <div className="absolute top-3 end-3">
                                         <Button variant="ghost" size="icon" className="rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-white hover:text-neutral-900 transition-all border border-white/30">
                                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                             </svg>
                                         </Button>
                                     </div>
                                 </div>
                                 <div className="space-y-1 px-1">
                                     <div className="flex items-center justify-between">
                                         <h4 className="font-bold text-neutral-900 text-lg">Palais El Bahja</h4>
                                         <div className="flex items-center gap-1">
                                             <StarRating rating={4.8} showCount={false} size="sm" />
                                             <span className="text-sm font-bold">4.8</span>
                                         </div>
                                     </div>
                                     <p className="text-sm text-neutral-500 font-medium">
                                         {t(`search_bar.cities.${vendor.cities[0]?.slug}`, vendor.cities[0]?.name)}
                                     </p>
                                     <p className="text-neutral-900 font-black mt-2">
                                        {t("vendor_card.starting_at")} 15,000 {t("common.currency")}
                                     </p>
                                 </div>
                             </div>
                         ))}
                    </div>
                    <div className="mt-12 text-center">
                        <Button variant="outline" className="rounded-xl border-neutral-900 h-14 px-10 font-black text-lg hover:bg-neutral-100 transition-all shadow-premium">
                             {t("vendor_profile.similar.view_all")} {t("common.in", "à")} {t(`search_bar.cities.${vendor.cities[0]?.slug}`, vendor.cities[0]?.name)}
                        </Button>
                    </div>
                </div>
            </main>
            )}

            {/* Mobile Sticky Booking Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-4 flex items-center justify-between lg:hidden z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
                <div>
                    <div className="font-black text-neutral-900 text-lg">
                         <span className="text-[10px] font-black uppercase text-neutral-500 block -mb-0.5">{t("vendor_card.starting_at")}</span>
                         <PriceRange value={vendor.priceRange} />
                    </div>
                    <div className="flex items-center gap-1 mt-1 cursor-pointer" onClick={() => document.getElementById('reservation-widget')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                        <StarRating rating={rating} showCount={false} size="sm" />
                        <span className="text-[11px] font-bold text-neutral-500 underline decoration-neutral-300">({vendor.reviewCount})</span>
                    </div>
                </div>
                <Button
                    className="rounded-xl px-8 h-12 font-bold bg-primary hover:bg-primary-dark text-white active:scale-95 transition-transform"
                    onClick={() => document.getElementById('reservation-widget')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                >
                    {t("vendor_profile.reservation.reserve", "Réserver")}
                </Button>
            </div>

            {/* Floating WhatsApp Bubble */}
            <a 
                href={`https://wa.me/${vendor.whatsapp?.replace(/\D/g, '') || "212600000000"}?text=${encodeURIComponent(`Bonjour, je vous contacte depuis votre profil Farah.ma (${vendor.businessName}). J'aimerais avoir plus de détails concernant une réservation.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-32 lg:bottom-8 end-6 z-[60] bg-[#25D366] hover:bg-[#1DA851] text-white p-3.5 lg:p-4 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-4"
            >
                <svg className="w-6 h-6 lg:w-7 lg:h-7" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
                </svg>
                <span className="hidden lg:block font-bold">Contactez-nous</span>
            </a>
        </div>
    );
}

// Reuse existing fallbacks for SSR if API fails
const FALLBACK: VendorProfileData = {
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
        { id: 2, name: "Menu Prestige", description: "Sélection de poissons, Tagine d'agneau aux pruneaux, et buffet de desserts", pricePerPerson: "500", category: "Pack Prestige" },
    ],
    owner: {
        id: 1,
        firstName: "Yassine",
        lastName: "Belkhayat",
        createdAt: "2024-01-15T00:00:00Z",
    },
};

const FALLBACK_REVIEWS: ReviewData[] = [
    { id: 1, rating: 5, body: "Merci à toute l'équipe du Palais des Roses pour avoir fait de notre mariage un rêve éveillé. La salle est magnifique et le service impeccable.", createdAt: "2026-02-14T00:00:00Z", author: { firstName: "Yassine", lastName: "S." } },
    { id: 2, rating: 5, body: "Tout était parfait : de l'accueil à la fin de la soirée. La nourriture était délicieuse et les invités ravis.", createdAt: "2026-01-20T00:00:00Z", author: { firstName: "Sara", lastName: "M." } },
];

export const getServerSideProps: GetServerSideProps<VendorProfilePageProps> = async ({ params, locale }) => {
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
            category: v.category?.name ?? 'Vendor',
            cities: v.cities ?? [],
            priceRange: v.priceRange,
            coverImageUrl: v.coverImageUrl,
            coverVideoUrl: v.coverVideoUrl,
            galleryImages: v.galleryImages ?? [],
            averageRating: v.averageRating,
            reviewCount: v.reviewCount ?? 0,
            isVerified: v.isVerified ?? false,
            minGuests: v.minGuests,
            maxGuests: v.maxGuests,
            menuItems: (v.menuItems ?? []).map((m: any) => ({
                id: m.id,
                name: m.name,
                description: m.description,
                pricePerPerson: m.pricePerPerson,
                category: m.category,
            })),
            owner: v.owner ? {
                id: v.owner.id,
                firstName: v.owner.firstName,
                lastName: v.owner.lastName,
                createdAt: v.owner.createdAt,
            } : FALLBACK.owner,
        };

        // For V1, we'll use fallback reviews if none exist in the response
        const reviews = v.reviews && v.reviews.length > 0 ? v.reviews : FALLBACK_REVIEWS;

        return {
            props: {
                ...(await serverSideTranslations(locale || "fr", ["common"])),
                vendor,
                reviews,
            },
        };
    } catch (e) {
        console.error(e);
        // Fallback to static data for demo/storybook purposes if API is down
        return {
            props: {
                ...(await serverSideTranslations(locale || "fr", ["common"])),
                vendor: FALLBACK,
                reviews: FALLBACK_REVIEWS,
            },
        };
    }
};
