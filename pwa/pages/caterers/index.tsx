import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/router";
import CatererCard, { CatererCardProps } from "../../components/caterers/CatererCard";
import FilterSidebar from "../../components/caterers/FilterSidebar";
import SearchBar from "../../components/caterers/SearchBar";
import type { GetServerSideProps } from "next";

interface CaterersPageProps {
    caterers: CatererCardProps[];
    total: number;
    page: number;
    serviceArea: string;
    eventType: string;
}

const ITEMS_PER_PAGE = 12;

const FALLBACK_CATERERS: CatererCardProps[] = [
    {
        id: 1,
        slug: "festin-royal-alger",
        businessName: "Festin Royal",
        tagline: "Cuisine algérienne authentique pour vos événements mémorables",
        serviceArea: "Alger",
        cuisineTypes: ["Algerian", "Mediterranean", "Oriental"],
        priceRange: "$$$",
        coverImageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800",
        averageRating: 5,
        reviewCount: 2,
        isVerified: true,
    },
    {
        id: 2,
        slug: "le-jardin-saveurs-oran",
        businessName: "Le Jardin des Saveurs",
        tagline: "La gastronomie méditerranéenne à votre service",
        serviceArea: "Oran",
        cuisineTypes: ["Mediterranean", "French", "Italian"],
        priceRange: "$$$$",
        coverImageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
        averageRating: 4,
        reviewCount: 1,
        isVerified: true,
    },
    {
        id: 3,
        slug: "saveurs-kabyle-tizi-ouzou",
        businessName: "Saveurs Kabyles",
        tagline: "L'authenticité berbère dans chaque bouchée",
        serviceArea: "Tizi Ouzou",
        cuisineTypes: ["Algerian", "Berber", "Traditional"],
        priceRange: "$$",
        coverImageUrl: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
        averageRating: 5,
        reviewCount: 1,
        isVerified: true,
    },
];

const emptyFilters = { cuisineTypes: [] as string[], serviceStyles: [] as string[], priceRanges: [] as string[] };

export default function CaterersPage({
    caterers,
    total,
    page,
    serviceArea,
    eventType,
}: CaterersPageProps) {
    const router = useRouter();
    const [selected, setSelected] = useState(emptyFilters);

    const displayCaterers = caterers.length > 0 ? caterers : FALLBACK_CATERERS;
    const displayTotal = total > 0 ? total : FALLBACK_CATERERS.length;

    const handleFilterChange = (key: string, value: string, checked: boolean) => {
        setSelected((prev) => ({
            ...prev,
            [key]: checked
                ? [...prev[key as keyof typeof prev], value]
                : prev[key as keyof typeof prev].filter((v) => v !== value),
        }));
    };

    const handleClear = () => setSelected(emptyFilters);

    const goToPage = (p: number) => {
        router.push({ pathname: "/caterers", query: { ...router.query, page: p } });
    };

    const totalPages = Math.ceil(displayTotal / ITEMS_PER_PAGE);

    return (
        <>
            <Head>
                <title>Browse Caterers — Traiteur</title>
                <meta name="description" content="Discover the best caterers across Algeria. Filter by cuisine, service style, location, and price range." />
            </Head>

            {/* Page header */}
            <div className="bg-[var(--color-teal-900)] pt-20 pb-10">
                <div className="container mx-auto max-w-7xl px-6">
                    <h1 className="font-display text-3xl md:text-4xl font-bold text-white mb-2">
                        {serviceArea ? `Caterers in ${serviceArea}` : "Browse All Caterers"}
                    </h1>
                    <p className="text-[var(--color-teal-300)] mb-6">
                        {displayTotal} caterers found
                        {eventType ? ` for ${eventType} events` : ""}
                    </p>
                    <SearchBar variant="page" initialLocation={serviceArea} initialEventType={eventType} />
                </div>
            </div>

            {/* Main grid */}
            <div className="container mx-auto max-w-7xl px-6 py-10">
                <div className="flex gap-8">
                    {/* Filter sidebar */}
                    <FilterSidebar
                        filters={emptyFilters}
                        selected={selected}
                        onChange={handleFilterChange}
                        onClear={handleClear}
                    />

                    {/* Results */}
                    <div className="flex-1 min-w-0">
                        {/* Active filters display */}
                        {(selected.cuisineTypes.length > 0 || selected.serviceStyles.length > 0 || selected.priceRanges.length > 0) && (
                            <div className="flex flex-wrap gap-2 mb-5">
                                {[...selected.cuisineTypes, ...selected.serviceStyles, ...selected.priceRanges].map((f) => (
                                    <span key={f} className="flex items-center gap-1.5 bg-[var(--color-teal-50)] text-[var(--color-teal-800)] border border-[var(--color-teal-200)] rounded-full px-3 py-1 text-xs font-medium">
                                        {f}
                                        <button onClick={() => {
                                            const key = selected.cuisineTypes.includes(f) ? "cuisineTypes" : selected.serviceStyles.includes(f) ? "serviceStyles" : "priceRanges";
                                            handleFilterChange(key, f, false);
                                        }}>
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                            {displayCaterers.map((caterer) => (
                                <CatererCard key={caterer.id} {...caterer} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-center gap-2 mt-10">
                                <button
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page <= 1}
                                    className="px-4 py-2 rounded-lg border border-[var(--color-sand-200)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--color-sand-50)] transition-colors"
                                >
                                    ← Prev
                                </button>
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => goToPage(p)}
                                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${p === page
                                                ? "bg-[var(--color-teal-700)] text-white"
                                                : "border border-[var(--color-sand-200)] hover:bg-[var(--color-sand-50)]"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                                <button
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page >= totalPages}
                                    className="px-4 py-2 rounded-lg border border-[var(--color-sand-200)] text-sm font-medium disabled:opacity-40 hover:bg-[var(--color-sand-50)] transition-colors"
                                >
                                    Next →
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
    const page = Number(query.page) || 1;
    const serviceArea = (query.serviceArea as string) || "";
    const eventType = (query.eventType as string) || "";

    try {
        const params = new URLSearchParams({
            page: String(page),
            itemsPerPage: String(ITEMS_PER_PAGE),
        });
        if (serviceArea) params.set("serviceArea", serviceArea);

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
        const res = await fetch(`${baseUrl}/api/caterer_profiles?${params}`, {
            headers: { Accept: "application/ld+json" },
        });

        if (!res.ok) throw new Error("API unavailable");
        const data = await res.json();
        const members: Record<string, unknown>[] = data["hydra:member"] ?? [];
        const total: number = data["hydra:totalItems"] ?? 0;

        const caterers: CatererCardProps[] = members.map((c) => ({
            id: (c.id as number) ?? 0,
            slug: c.slug as string,
            businessName: c.businessName as string,
            tagline: c.tagline as string | undefined,
            serviceArea: c.serviceArea as string,
            cuisineTypes: (c.cuisineTypes as string[]) ?? [],
            priceRange: c.priceRange as string,
            coverImageUrl: c.coverImageUrl as string | undefined,
            averageRating: c.averageRating ? parseFloat(c.averageRating as string) : undefined,
            reviewCount: (c.reviewCount as number) ?? 0,
            isVerified: (c.isVerified as boolean) ?? false,
        }));

        return { props: { caterers, total, page, serviceArea, eventType } };
    } catch {
        return { props: { caterers: [], total: 0, page, serviceArea, eventType } };
    }
};
