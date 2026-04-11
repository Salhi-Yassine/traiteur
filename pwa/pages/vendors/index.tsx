import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { LayoutGrid, List, SlidersHorizontal, ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

import VendorCard, { VendorCardProps } from "../../components/vendors/VendorCard";
import CategoryPills from "../../components/vendors/CategoryPills";
import FilterModal from "../../components/vendors/FilterModal";
import SearchBar from "../../components/vendors/SearchBar";
import { Button } from "../../components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

interface VendorsPageProps {
    vendors: VendorCardProps[];
    total: number;
    page: number;
    serviceArea: string;
    category: { name: string; slug: string } | null;
    sort: string;
    priceRanges: string[];
}

type SortKey = "rating" | "reviews" | "price_asc" | "price_desc";
type ViewMode = "grid" | "list";

// ─── Constants ────────────────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

const PRICE_LABEL_KEY: Record<string, string> = {
    MAD: "budget",
    MADMAD: "standard",
    MADMADMAD: "premium",
    "MADMADMAD+": "exclusif",
};

/** Map front-end sort key → API Platform order param */
function sortToApiParams(sort: string): Record<string, string> {
    switch (sort) {
        case "reviews":    return { "order[reviewCount]": "desc" };
        case "price_asc":  return { "order[priceRange]": "asc" };
        case "price_desc": return { "order[priceRange]": "desc" };
        default:           return { "order[averageRating]": "desc" };
    }
}

// ─── Fallback data ────────────────────────────────────────────────────────────

const FALLBACK_VENDORS: VendorCardProps[] = [
    {
        id: 1, slug: "palais-des-roses-casablanca", businessName: "Palais des Roses",
        tagline: "Un cadre idyllique pour votre mariage de rêve à Casablanca",
        cities: [{ name: "Casablanca", slug: "casablanca" }],
        category: { name: "Salles", slug: "salles" }, priceRange: "MADMADMAD",
        coverImageUrl: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&q=80",
        averageRating: 4.9, reviewCount: 128, isVerified: true,
    },
    {
        id: 2, slug: "traiteur-el-bahia-rabat", businessName: "Traiteur El Bahia",
        tagline: "L'excellence de la gastronomie marocaine traditionnelle",
        cities: [{ name: "Rabat", slug: "rabat" }],
        category: { name: "Catering", slug: "catering" }, priceRange: "MADMAD",
        coverImageUrl: "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
        averageRating: 4.8, reviewCount: 95, isVerified: true,
    },
    {
        id: 3, slug: "negafa-dar-el-makhzen-fes", businessName: "Négafa Dar El Makhzen",
        tagline: "Le raffinement des tenues traditionnelles pour une mariée sublime",
        cities: [{ name: "Fès", slug: "fes" }],
        category: { name: "Négafa", slug: "negafa" }, priceRange: "MADMADMAD+",
        coverImageUrl: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&q=80",
        averageRating: 5.0, reviewCount: 64, isVerified: true,
    },
    {
        id: 4, slug: "studio-atlas-photography", businessName: "Studio Atlas Photography",
        tagline: "Chaque instant mérite d'être immortalisé avec art",
        cities: [{ name: "Marrakech", slug: "marrakech" }],
        category: { name: "Photographes", slug: "photography" }, priceRange: "MADMADMAD",
        coverImageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&q=80",
        averageRating: 4.7, reviewCount: 51, isVerified: false,
    },
    {
        id: 5, slug: "dj-nabil-events", businessName: "DJ Nabil Events",
        tagline: "Ambiance garantie de l'entrée au dernier slow",
        cities: [{ name: "Casablanca", slug: "casablanca" }],
        category: { name: "DJs & Orchestres", slug: "music" }, priceRange: "MADMAD",
        coverImageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80",
        averageRating: 4.6, reviewCount: 38, isVerified: true,
    },
    {
        id: 6, slug: "fleurs-de-jade-deco", businessName: "Fleurs de Jade Décoration",
        tagline: "Créations florales et scénographies uniques pour votre grand jour",
        cities: [{ name: "Casablanca", slug: "casablanca" }, { name: "Rabat", slug: "rabat" }],
        category: { name: "Décoration", slug: "decoration" }, priceRange: "MADMAD",
        coverImageUrl: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800&q=80",
        averageRating: 4.9, reviewCount: 77, isVerified: true,
    },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function VendorsPage({
    vendors,
    total,
    page,
    serviceArea,
    category,
    sort: initialSort,
    priceRanges: initialPriceRanges,
}: VendorsPageProps) {
    const { t } = useTranslation("common");
    const router = useRouter();

    // ── State ──────────────────────────────────────────────────────────────────
    const [activeCategory, setActiveCategory] = useState<string>(category?.slug ?? "");
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(initialPriceRanges);
    const [sort, setSort] = useState<SortKey>((initialSort as SortKey) || "rating");
    const [view, setView] = useState<ViewMode>("grid");
    const [isNavigating, setIsNavigating] = useState(false);
    const [filterModalOpen, setFilterModalOpen] = useState(false);

    // ── Derived ────────────────────────────────────────────────────────────────
    const displayVendors  = vendors.length > 0 ? vendors : FALLBACK_VENDORS;
    const displayTotal    = total > 0 ? total : FALLBACK_VENDORS.length;
    const totalPages      = Math.ceil(displayTotal / ITEMS_PER_PAGE);
    const modalFilterCount = selectedPriceRanges.length + (sort !== "rating" ? 1 : 0);

    // ── Navigation skeleton ───────────────────────────────────────────────────
    useEffect(() => {
        const onStart    = () => setIsNavigating(true);
        const onComplete = () => setIsNavigating(false);
        router.events.on("routeChangeStart",    onStart);
        router.events.on("routeChangeComplete", onComplete);
        router.events.on("routeChangeError",    onComplete);
        return () => {
            router.events.off("routeChangeStart",    onStart);
            router.events.off("routeChangeComplete", onComplete);
            router.events.off("routeChangeError",    onComplete);
        };
    }, [router]);

    // ── Helpers ────────────────────────────────────────────────────────────────
    const pushQuery = (patch: Record<string, string | string[] | undefined>) => {
        const next: Record<string, string | string[] | undefined> = { ...router.query, ...patch, page: "1" };
        Object.keys(next).forEach(k => {
            if (!next[k] || (Array.isArray(next[k]) && (next[k] as string[]).length === 0)) {
                delete next[k];
            }
        });
        router.push({ pathname: "/vendors", query: next }, undefined, { shallow: true });
    };

    // Category tab → single-select, instant apply
    const handleCategorySelect = (slug: string) => {
        setActiveCategory(slug);
        pushQuery({ category: slug || undefined });
    };

    // Price range toggle in modal
    const handlePriceChange = (value: string, checked: boolean) => {
        setSelectedPriceRanges(prev => {
            const next = checked ? [...prev, value] : prev.filter(v => v !== value);
            pushQuery({ priceRange: next.length ? next : undefined });
            return next;
        });
    };

    // Clear price ranges only (modal header button)
    const handleModalClear = () => {
        setSelectedPriceRanges([]);
        setSort("rating");
        pushQuery({ priceRange: undefined, sort: undefined });
    };

    // Full reset
    const handleClearAll = () => {
        setActiveCategory("");
        setSelectedPriceRanges([]);
        setSort("rating");
        router.push("/vendors");
    };

    const handleSortChange = (value: string) => {
        setSort(value as SortKey);
        pushQuery({ sort: value });
    };

    const removePriceFilter = (value: string) => {
        handlePriceChange(value, false);
    };

    const goToPage = (p: number) => {
        router.push({ pathname: "/vendors", query: { ...router.query, page: p } });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // ── SEO strings ───────────────────────────────────────────────────────────
    const activeCategoryName = category?.name;
    const pageTitle = [
        activeCategoryName ?? t("nav.vendors"),
        serviceArea ? `à ${serviceArea}` : "",
        "— Farah.ma",
    ].filter(Boolean).join(" ");

    const metaDescription = serviceArea || activeCategoryName
        ? `Trouvez les meilleurs ${activeCategoryName ?? "prestataires"} pour votre mariage${serviceArea ? ` à ${serviceArea}` : ""} au Maroc. ${displayTotal} prestataires vérifiés sur Farah.ma.`
        : `Découvrez ${displayTotal} prestataires de mariage vérifiés au Maroc. Salles, traiteurs, photographes et plus sur Farah.ma.`;

    // ─────────────────────────────────────────────────────────────────────────

    return (
        <div className="bg-white min-h-screen">
            <Head>
                <title>{pageTitle}</title>
                <meta name="description" content={metaDescription} />
                <meta property="og:title" content={pageTitle} />
                <meta property="og:description" content={metaDescription} />
                <meta property="og:type" content="website" />
                <meta property="og:url" content={`https://farah.ma/vendors${serviceArea ? `?serviceArea=${serviceArea}` : ""}`} />
                <link rel="canonical" href={`https://farah.ma/vendors${serviceArea ? `?serviceArea=${serviceArea}` : ""}`} />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "ItemList",
                            "name": pageTitle,
                            "numberOfItems": displayTotal,
                            "itemListElement": displayVendors.slice(0, 10).map((v, i) => ({
                                "@type": "ListItem",
                                "position": i + 1,
                                "url": `https://farah.ma/vendors/${v.slug}`,
                                "name": v.businessName,
                            })),
                        }),
                    }}
                />
            </Head>

            {/* ── Sticky Search & Filter Header ─────────────────────────────── */}
            <div className="sticky top-0 z-30 bg-white">
                {/* Top row: Breadcrumb + Title + Search Capsule */}
                <div className="border-b border-[#EBEBEB]">
                    <div className="container mx-auto max-w-7xl px-6 pt-20 pb-5">
                        {/* Breadcrumb */}
                        <nav aria-label="Fil d'Ariane" className="flex items-center gap-1.5 text-[13px] text-[#717171] mb-3">
                            <Link href="/" className="hover:text-[#E8472A] transition-colors">Farah.ma</Link>
                            <span>/</span>
                            <Link href="/vendors" className={cn("transition-colors", activeCategoryName ? "hover:text-[#E8472A]" : "text-[#1A1A1A] font-medium")}>
                                {t("nav.vendors")}
                            </Link>
                            {activeCategoryName && (
                                <>
                                    <span>/</span>
                                    <span className="text-[#1A1A1A] font-medium">{activeCategoryName}</span>
                                </>
                            )}
                        </nav>

                        {/* Title + Count */}
                        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-5">
                            <div>
                                <h1 className="font-display text-[28px] md:text-[36px] text-[#1A1A1A] leading-tight">
                                    {serviceArea
                                        ? `${t("search_bar.cta")} à ${serviceArea}`
                                        : activeCategoryName
                                            ? activeCategoryName
                                            : t("search_bar.cities.all")}
                                </h1>
                                <p className="text-[14px] text-[#717171] mt-1">
                                    <span className="font-semibold text-[#1A1A1A]">{displayTotal}</span>{" "}
                                    {t("home.categories.count_suffix")} {t("vendor_card.verified").toLowerCase()} au Maroc
                                </p>
                            </div>
                        </div>

                        {/* Search capsule */}
                        <SearchBar
                            variant="page"
                            initialLocation={serviceArea}
                            initialCategory={category?.slug ?? "all"}
                        />
                    </div>
                </div>

                {/* Category tabs + Filters button row */}
                <div className="border-b border-[#EBEBEB]">
                    <div className="container mx-auto max-w-7xl px-6">
                        <div className="flex items-end gap-4">
                            {/* Category icon tabs */}
                            <div className="flex-1 min-w-0">
                                <CategoryPills
                                    activeCategory={activeCategory}
                                    onSelect={handleCategorySelect}
                                />
                            </div>

                            {/* Separator */}
                            <div className="hidden sm:block w-px h-10 bg-[#DDDDDD] shrink-0 mb-2" />

                            {/* Filtres button */}
                            <button
                                type="button"
                                onClick={() => setFilterModalOpen(true)}
                                className={cn(
                                    "shrink-0 flex items-center gap-2 rounded-xl border h-10 px-4 mb-2 text-[13px] font-medium transition-all duration-200",
                                    modalFilterCount > 0
                                        ? "border-[#1A1A1A] bg-[#F7F7F7]"
                                        : "border-[#DDDDDD] hover:border-[#B0B0B0]"
                                )}
                                id="filter-button"
                            >
                                <SlidersHorizontal className="w-4 h-4" />
                                {t("filters.title")}
                                {modalFilterCount > 0 && (
                                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#1A1A1A] text-white text-[11px] font-bold">
                                        {modalFilterCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Main content ──────────────────────────────────────────────── */}
            <div className="container mx-auto max-w-7xl px-6 py-6 space-y-5">

                {/* ── Active price-range pills ───────────────────── */}
                {selectedPriceRanges.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                        {selectedPriceRanges.map(f => (
                            <FilterPill
                                key={f}
                                label={t(`filters.price_labels.${PRICE_LABEL_KEY[f] ?? f}`, f)}
                                onRemove={() => removePriceFilter(f)}
                            />
                        ))}
                        <button
                            onClick={handleClearAll}
                            className="text-[13px] text-[#717171] hover:text-[#E8472A] transition-colors underline underline-offset-2"
                        >
                            {t("filters.clear_all")}
                        </button>
                    </div>
                )}

                {/* ── Count + View toggle ──────────────── */}
                <div className="flex items-center justify-between">
                    <p className="text-[13px] text-[#717171]">
                        <span className="font-semibold text-[#1A1A1A]">{displayTotal}</span>{" "}
                        {t("home.categories.count_suffix")}
                    </p>

                    {/* View toggle — desktop */}
                    <div className="hidden sm:flex items-center gap-1 border border-[#DDDDDD] rounded-xl p-1">
                        <button
                            onClick={() => setView("grid")}
                            aria-label="Vue grille"
                            className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                view === "grid"
                                    ? "bg-[#1A1A1A] text-white"
                                    : "text-[#717171] hover:text-[#1A1A1A]"
                            )}
                        >
                            <LayoutGrid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setView("list")}
                            aria-label="Vue liste"
                            className={cn(
                                "p-1.5 rounded-lg transition-colors",
                                view === "list"
                                    ? "bg-[#1A1A1A] text-white"
                                    : "text-[#717171] hover:text-[#1A1A1A]"
                            )}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* ── Results ────────────────────────────────────── */}
                {isNavigating ? (
                    <div className={cn(
                        "grid gap-6",
                        "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    )}>
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="rounded-[24px] border border-[#DDDDDD] overflow-hidden animate-pulse">
                                <div className="aspect-[4/3] bg-[#EBEBEB]" />
                                <div className="p-5 space-y-3">
                                    <div className="h-4 bg-[#EBEBEB] rounded w-3/4" />
                                    <div className="h-3 bg-[#EBEBEB] rounded w-1/2" />
                                    <div className="h-3 bg-[#EBEBEB] rounded w-full" />
                                    <div className="h-3 bg-[#EBEBEB] rounded w-5/6" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : displayVendors.length === 0 ? (
                    <EmptyState
                        hasFilters={selectedPriceRanges.length > 0 || !!activeCategory}
                        onClear={handleClearAll}
                        serviceArea={serviceArea}
                    />
                ) : (
                    <div className={cn(
                        "grid gap-6",
                        view === "list"
                            ? "grid-cols-1"
                            : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    )}>
                        {displayVendors.map(vendor => (
                            <VendorCard key={vendor.id} {...vendor} variant={view === "grid" ? "card" : "list"} />
                        ))}
                    </div>
                )}

                {/* ── Pagination ─────────────────────────────────── */}
                {!isNavigating && totalPages > 1 && (
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={goToPage}
                    />
                )}
            </div>

            {/* ── Filter modal ─────────────────────────────────────────────── */}
            <FilterModal
                open={filterModalOpen}
                onOpenChange={setFilterModalOpen}
                selectedPriceRanges={selectedPriceRanges}
                onPriceChange={handlePriceChange}
                onClearAll={handleModalClear}
                total={displayTotal}
                sort={sort}
                onSortChange={handleSortChange}
            />
        </div>
    );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function FilterPill({ label, onRemove }: { label: string; onRemove: () => void }) {
    return (
        <span className="inline-flex items-center gap-1.5 bg-[#FEF0ED] text-[#E8472A] text-[13px] font-medium rounded-full px-3 py-1">
            {label}
            <button
                onClick={onRemove}
                aria-label={`Retirer ${label}`}
                className="hover:text-[#C43A20] transition-colors"
            >
                <X className="w-3.5 h-3.5" />
            </button>
        </span>
    );
}

function EmptyState({
    hasFilters,
    onClear,
    serviceArea,
}: {
    hasFilters: boolean;
    onClear: () => void;
    serviceArea: string;
}) {
    const { t } = useTranslation("common");
    return (
        <div className="py-20 text-center bg-[#F7F7F7] rounded-[24px] border border-[#DDDDDD] flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#DDDDDD] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#B0B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </div>

            <div className="space-y-1">
                <h3 className="text-[20px] font-semibold text-[#1A1A1A]">
                    {t("common.no_vendors_found")}
                </h3>
                <p className="text-[14px] text-[#717171] max-w-sm mx-auto">
                    {hasFilters
                        ? t("common.no_vendors_filters_desc", "Essayez de retirer certains filtres pour élargir votre recherche.")
                        : serviceArea
                            ? t("common.no_vendors_city_desc", `Aucun prestataire trouvé à ${serviceArea} pour l'instant.`)
                            : t("common.no_vendors_desc")}
                </p>
            </div>

            <div className="flex flex-wrap justify-center gap-3 mt-2">
                {hasFilters && (
                    <Button onClick={onClear} variant="default">
                        {t("common.see_all_vendors")}
                    </Button>
                )}
                {serviceArea && (
                    <Button onClick={() => window.location.href = "/vendors"} variant="ghost">
                        {t("common.search_all_morocco", "Chercher dans tout le Maroc")}
                    </Button>
                )}
            </div>
        </div>
    );
}

function Pagination({
    page,
    totalPages,
    onPageChange,
}: {
    page: number;
    totalPages: number;
    onPageChange: (p: number) => void;
}) {
    const getPages = (): (number | "…")[] => {
        if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
        if (page <= 4) return [1, 2, 3, 4, 5, "…", totalPages];
        if (page >= totalPages - 3) return [1, "…", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
        return [1, "…", page - 1, page, page + 1, "…", totalPages];
    };

    return (
        <nav aria-label="Pagination" className="flex justify-center items-center gap-1.5 pt-10">
            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="flex items-center gap-1.5 rounded-xl"
                aria-label="Page précédente"
            >
                <ChevronLeft className="w-4 h-4 rtl:-scale-x-100" />
                <span className="hidden sm:inline">Précédent</span>
            </Button>

            <div className="flex items-center gap-1">
                {getPages().map((p, i) =>
                    p === "…" ? (
                        <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-[#B0B0B0] text-[14px]">
                            …
                        </span>
                    ) : (
                        <button
                            key={p}
                            onClick={() => onPageChange(p as number)}
                            aria-label={`Page ${p}`}
                            aria-current={p === page ? "page" : undefined}
                            className={cn(
                                "w-10 h-10 rounded-xl text-[14px] font-medium transition-all",
                                p === page
                                    ? "bg-[#E8472A] text-white shadow-sm"
                                    : "bg-white border border-[#DDDDDD] text-[#484848] hover:border-[#B0B0B0] hover:bg-[#F7F7F7]"
                            )}
                        >
                            {p}
                        </button>
                    )
                )}
            </div>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="flex items-center gap-1.5 rounded-xl"
                aria-label="Page suivante"
            >
                <span className="hidden sm:inline">Suivant</span>
                <ChevronRight className="w-4 h-4 rtl:-scale-x-100" />
            </Button>
        </nav>
    );
}

// ─── SSR ──────────────────────────────────────────────────────────────────────

export const getServerSideProps: GetServerSideProps<VendorsPageProps> = async ({ query, locale }) => {
    const page        = Number(query.page) || 1;
    const serviceArea = (query.serviceArea as string) || "";
    const category    = (query.category as string) || "";
    const sort        = (query.sort as string) || "rating";
    const priceRanges = query.priceRange
        ? Array.isArray(query.priceRange) ? query.priceRange : [query.priceRange]
        : [];

    try {
        const params = new URLSearchParams({
            page: String(page),
            itemsPerPage: String(ITEMS_PER_PAGE),
        });

        if (serviceArea) params.set("cities.slug", serviceArea);
        if (category)    params.set("category.slug", category);

        priceRanges.forEach(pr => params.append("priceRange[]", pr));

        Object.entries(sortToApiParams(sort)).forEach(([k, v]) => params.set(k, v));

        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
        const res = await fetch(`${baseUrl}/api/vendor_profiles?${params}`, {
            headers: {
                Accept: "application/ld+json",
                "Accept-Language": locale || "fr",
            },
        });

        if (!res.ok) throw new Error("API unavailable");
        const data = await res.json();
        const members: Record<string, unknown>[] = data["hydra:member"] ?? [];
        const total: number = data["hydra:totalItems"] ?? 0;

        const vendors: VendorCardProps[] = members.map(v => ({
            id:            (v.id as number) ?? 0,
            slug:          v.slug as string,
            businessName:  v.businessName as string,
            tagline:       v.tagline as string | undefined,
            cities:        v.cities as { name: string; slug: string }[],
            category:      v.category as { name: string; slug: string },
            priceRange:    v.priceRange as string,
            coverImageUrl: v.coverImageUrl as string | undefined,
            averageRating: v.averageRating ? parseFloat(v.averageRating as string) : undefined,
            reviewCount:   (v.reviewCount as number) ?? 0,
            isVerified:    (v.isVerified as boolean) ?? false,
        }));

        const categoryObj = category
            ? (members.find(m => (m.category as { slug: string })?.slug === category)?.category as { name: string; slug: string } | undefined) ?? null
            : null;

        return {
            props: {
                vendors,
                total,
                page,
                serviceArea,
                category:    categoryObj,
                sort,
                priceRanges,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    } catch {
        return {
            props: {
                vendors:     [],
                total:       0,
                page,
                serviceArea,
                category:    null,
                sort,
                priceRanges,
                ...(await serverSideTranslations(locale || "fr", ["common"])),
            },
        };
    }
};
