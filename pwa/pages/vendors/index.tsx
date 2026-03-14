import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import VendorCard, { VendorCardProps } from "../../components/vendors/VendorCard";
import FilterSidebar from "../../components/vendors/FilterSidebar";
import SearchBar from "../../components/vendors/SearchBar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { cn } from "@/lib/utils";
import type { GetServerSideProps } from "next";

interface VendorsPageProps {
    vendors: VendorCardProps[];
    total: number;
    page: number;
    serviceArea: string;
    category: string;
}

const ITEMS_PER_PAGE = 12;

const FALLBACK_VENDORS: VendorCardProps[] = [
    {
        id: 1,
        slug: "palais-des-roses-casablanca",
        businessName: "Palais des Roses",
        tagline: "Un cadre idyllique pour votre mariage de rêve à Casablanca",
        serviceArea: "Casablanca",
        category: "Salles",
        priceRange: "MADMADMAD",
        coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
        averageRating: 4.9,
        reviewCount: 128,
        isVerified: true,
    },
    {
        id: 2,
        slug: "traiteur-el-bahia-rabat",
        businessName: "Traiteur El Bahia",
        tagline: "L'excellence de la gastronomie marocaine traditionnelle",
        serviceArea: "Rabat",
        category: "Catering",
        priceRange: "MADMAD",
        coverImageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
        averageRating: 4.8,
        reviewCount: 95,
        isVerified: true,
    },
    {
        id: 3,
        slug: "negafa-dar-el-makhzen-fes",
        businessName: "Négafa Dar El Makhzen",
        tagline: "Le raffinement des tenues traditionnelles pour une mariée sublime",
        serviceArea: "Fès",
        category: "Negrafa",
        priceRange: "MADMADMAD+",
        coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
        averageRating: 5.0,
        reviewCount: 64,
        isVerified: true,
    }
];

const emptyFilters = { category: [] as string[], priceRanges: [] as string[] };

export default function VendorsPage({
    vendors,
    total,
    page,
    serviceArea,
    category,
}: VendorsPageProps) {
    const router = useRouter();
    const [selected, setSelected] = useState({
        category: category ? [category] : [],
        priceRanges: [] as string[]
    });

    const displayVendors = vendors.length > 0 ? vendors : FALLBACK_VENDORS;
    const displayTotal = total > 0 ? total : FALLBACK_VENDORS.length;

    const handleFilterChange = (key: string, value: string, checked: boolean) => {
        setSelected((prev) => {
            const newValues = checked
                ? [...(prev[key as keyof typeof prev] as string[]), value]
                : (prev[key as keyof typeof prev] as string[]).filter((v) => v !== value);
            
            const newFilters = { ...prev, [key]: newValues };
            
            // Update URL query
            const query = { ...router.query };
            if (newFilters.category.length > 0) query.category = newFilters.category;
            else delete query.category;
            
            router.push({ pathname: "/vendors", query }, undefined, { shallow: true });
            
            return newFilters;
        });
    };

    const handleClear = () => {
        setSelected(emptyFilters);
        router.push("/vendors");
    };

    const goToPage = (p: number) => {
        router.push({ pathname: "/vendors", query: { ...router.query, page: p } });
    };

    const totalPages = Math.ceil(displayTotal / ITEMS_PER_PAGE);

    return (
        <div className="bg-background min-h-screen">
            <Head>
                <title>Prestataires de Mariage au Maroc — Farah.ma</title>
                <meta name="description" content="Découvrez les meilleurs prestataires pour votre mariage au Maroc : Salles, Traiteurs, Négafas, Photographes et plus encore." />
            </Head>

            {/* Page header */}
            <div className="bg-primary pt-32 pb-24 relative overflow-hidden">
                {/* Decorative Elements */}
                <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/moroccan-flower.png')]" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-secondary/20 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-secondary/10 rounded-full blur-[120px] pointer-events-none" />
                
                <div className="container mx-auto max-w-7xl px-6 relative z-10">
                    <div className="max-w-3xl">
                        <span className="text-secondary font-black tracking-[0.4em] uppercase text-xs mb-4 block">
                            Catalogue Farah.ma
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                            {serviceArea ? `Prestataires à ${serviceArea}` : "Tous nos Prestataires"}
                        </h1>
                        <p className="text-white/60 font-medium mb-12 text-lg max-w-2xl">
                            {displayTotal} professionnels d'exception sélectionnés pour faire de votre mariage un moment inoubliable.
                        </p>
                    </div>
                    <div className="p-4 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-premium">
                        <SearchBar variant="page" initialLocation={serviceArea} initialCategory={category} />
                    </div>
                </div>
            </div>

            {/* Main grid */}
            <div className="container mx-auto max-w-7xl px-6 py-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* Filter sidebar */}
                    <div className="lg:w-80 shrink-0">
                        <FilterSidebar
                            selected={selected}
                            onChange={handleFilterChange}
                            onClear={handleClear}
                        />
                    </div>

                    {/* Results */}
                    <div className="flex-1 min-w-0 space-y-12">
                        {/* Active filters display */}
                        {(selected.category.length > 0 || selected.priceRanges.length > 0) && (
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mr-2">Filtres Actifs:</span>
                                {[...selected.category, ...selected.priceRanges].map((f) => (
                                    <Badge key={f} variant="secondary" className="pl-4 pr-2 py-1.5 shadow-sm group">
                                        <span className="flex items-center gap-2">
                                            {f}
                                            <button 
                                                onClick={() => {
                                                    const key = selected.category.includes(f) ? "category" : "priceRanges";
                                                    handleFilterChange(key, f, false);
                                                }}
                                                className="hover:text-primary transition-colors bg-white/20 rounded-full p-0.5"
                                            >
                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </span>
                                    </Badge>
                                ))}
                                <Button variant="ghost" size="sm" onClick={handleClear} className="text-[10px] font-black uppercase tracking-widest text-secondary hover:text-secondary-foreground h-auto p-0 ml-4">
                                    Tout Effacer
                                </Button>
                            </div>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                            {displayVendors.map((vendor) => (
                                <VendorCard key={vendor.id} {...vendor} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-4 pt-12">
                                <Button
                                    variant="outline"
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page <= 1}
                                    className="rounded-2xl"
                                >
                                    Précédent
                                </Button>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => goToPage(p)}
                                            className={cn(
                                                "w-12 h-12 rounded-2xl text-[10px] font-black transition-all shadow-sm flex items-center justify-center uppercase tracking-widest",
                                                p === page
                                                    ? "bg-secondary text-white shadow-gold scale-110"
                                                    : "bg-white border border-border text-primary hover:border-secondary/50"
                                            )}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="outline"
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="rounded-2xl"
                                >
                                    Suivant
                                </Button>
                            </div>
                        )}

                        {/* Empty state */}
                        {displayVendors.length === 0 && (
                            <div className="py-24 text-center bg-accent/5 rounded-[3rem] border border-dashed border-border flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mb-6">
                                    <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-display font-black text-primary mb-3">Aucun prestataire trouvé</h3>
                                <p className="text-muted-foreground mb-10 max-w-sm mx-auto">Essayez de modifier vos filtres ou effectuez une nouvelle recherche pour trouver votre bonheur.</p>
                                <Button onClick={handleClear} variant="secondary">
                                    Voir tous les prestataires
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const page = Number(query.page) || 1;
    const serviceArea = (query.serviceArea as string) || "";
    const category = (query.category as string) || "";

    try {
        const params = new URLSearchParams({
            page: String(page),
            itemsPerPage: String(ITEMS_PER_PAGE),
        });
        if (serviceArea) params.set("serviceArea", serviceArea);
        if (category) params.set("category", category);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
        const res = await fetch(`${baseUrl}/api/vendor_profiles?${params}`, {
            headers: { Accept: "application/ld+json" },
        });

        if (!res.ok) throw new Error("API unavailable");
        const data = await res.json();
        const members: Record<string, unknown>[] = data["hydra:member"] ?? [];
        const total: number = data["hydra:totalItems"] ?? 0;

        const vendors: VendorCardProps[] = members.map((v) => ({
            id: (v.id as number) ?? 0,
            slug: v.slug as string,
            businessName: v.businessName as string,
            tagline: v.tagline as string | undefined,
            serviceArea: v.serviceArea as string,
            category: v.category as string,
            priceRange: v.priceRange as string,
            coverImageUrl: v.coverImageUrl as string | undefined,
            averageRating: v.averageRating ? parseFloat(v.averageRating as string) : undefined,
            reviewCount: (v.reviewCount as number) ?? 0,
            isVerified: (v.isVerified as boolean) ?? false,
        }));

        return { props: { vendors, total, page, serviceArea, category } };
    } catch {
        return { props: { vendors: [], total: 0, page, serviceArea, category } };
    }
};
