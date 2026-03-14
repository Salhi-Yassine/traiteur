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
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
    const { t } = useTranslation("common");
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
        <div className="bg-white min-h-screen">
            <Head>
                <title>{t("nav.vendors")} — Farah.ma</title>
                <meta name="description" content={t("home.hero.subtitle")} />
            </Head>

            {/* ── Page header — v3: clean neutral, no burgundy ── */}
            <div className="bg-[#F7F7F7] pt-28 pb-10 border-b border-[#DDDDDD]">
                <div className="container mx-auto max-w-7xl px-6">
                    <div className="space-y-2 mb-6">
                        <p className="text-[13px] text-[#717171]">
                            <span className="text-[#E8472A]">Farah.ma</span> · {t("nav.vendors")}
                        </p>
                        <h1 className="font-display text-[32px] md:text-[44px] text-[#1A1A1A] leading-tight">
                            {serviceArea ? `${t("search_bar.cta")} à ${serviceArea}` : t("search_bar.cities.all")}
                        </h1>
                        <p className="text-[15px] text-[#717171]">
                            {displayTotal} {t("home.categories.count_suffix")} {t("vendor_card.verified")} au Maroc
                        </p>
                    </div>
                    <SearchBar variant="page" initialLocation={serviceArea} initialCategory={category} />
                </div>
            </div>

            {/* ── Main grid ── */}
            <div className="container mx-auto max-w-7xl px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter sidebar — 280px per PRD */}
                    <div className="lg:w-[280px] shrink-0">
                        <FilterSidebar
                            selected={selected}
                            onChange={handleFilterChange}
                            onClear={handleClear}
                        />
                    </div>

                    {/* Results */}
                    <div className="flex-1 min-w-0 space-y-6">
                        {/* Sort bar */}
                        <div className="flex items-center justify-between">
                            <p className="text-[14px] text-[#484848]">
                                <span className="font-semibold text-[#1A1A1A]">{displayTotal}</span> {t("home.categories.count_suffix")} {t("search_bar.cta").toLowerCase()}
                            </p>
                        </div>

                        {/* Active filter pills */}
                        {(selected.category.length > 0 || selected.priceRanges.length > 0) && (
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[13px] text-[#717171]">{t("common.active_filters")}</span>
                                {[...selected.category, ...selected.priceRanges].map((f) => (
                                    <span key={f} className="inline-flex items-center gap-1.5 bg-[#FEF0ED] text-[#E8472A] text-[13px] font-medium rounded-full px-3 py-1">
                                        {f}
                                        <button
                                            onClick={() => {
                                                const key = selected.category.includes(f) ? "category" : "priceRanges";
                                                handleFilterChange(key, f, false);
                                            }}
                                            className="hover:text-[#C43A20] transition-colors"
                                            aria-label={t("filters.clear")}
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </span>
                                ))}
                                <button onClick={handleClear} className="text-[13px] text-[#717171] hover:text-[#E8472A] transition-colors underline underline-offset-2">
                                    {t("common.clear_all")}
                                </button>
                            </div>
                        )}

                        {/* Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-10">
                            {displayVendors.map((vendor) => (
                                <VendorCard key={vendor.id} {...vendor} />
                            ))}
                        </div>

                        {/* Pagination — v3 neutral + terracotta active */}
                        {totalPages > 1 && (
                            <div className="flex justify-center items-center gap-2 pt-10">
                                <Button
                                    variant="ghost"
                                    onClick={() => goToPage(page - 1)}
                                    disabled={page <= 1}
                                >
                                    {t("common.prev")}
                                </Button>
                                <div className="flex items-center gap-1.5">
                                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                                        <button
                                            key={p}
                                            onClick={() => goToPage(p)}
                                            className={cn(
                                                "w-10 h-10 rounded-lg text-[14px] font-medium transition-all",
                                                p === page
                                                    ? "bg-[#E8472A] text-white"
                                                    : "bg-white border border-[#DDDDDD] text-[#484848] hover:border-[#B0B0B0]"
                                            )}
                                            aria-label={`Page ${p}`}
                                            aria-current={p === page ? "page" : undefined}
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                                <Button
                                    variant="ghost"
                                    onClick={() => goToPage(page + 1)}
                                    disabled={page >= totalPages}
                                >
                                    {t("common.next")}
                                </Button>
                            </div>
                        )}

                        {/* Empty state — v3 neutral */}
                        {displayVendors.length === 0 && (
                            <div className="py-20 text-center bg-[#F7F7F7] rounded-[24px] border border-[#DDDDDD] flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-[#DDDDDD] flex items-center justify-center mb-5">
                                    <svg className="w-8 h-8 text-[#B0B0B0]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-[20px] font-semibold text-[#1A1A1A] mb-2">{t("common.no_vendors_found")}</h3>
                                <p className="text-[14px] text-[#717171] mb-8 max-w-sm mx-auto">{t("common.no_vendors_desc")}</p>
                                <Button onClick={handleClear} variant="ghost">
                                    {t("common.see_all_vendors")}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps = async ({ query, locale }) => {
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
            headers: { 
                Accept: "application/ld+json",
                "Accept-Language": locale || "fr"
            },
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

        return { 
            props: { 
                vendors, 
                total, 
                page, 
                serviceArea, 
                category,
                ...(await serverSideTranslations(locale || "fr", ["common"]))
            } 
        };
    } catch {
        return { 
            props: { 
                vendors: [], 
                total: 0, 
                page, 
                serviceArea, 
                category,
                ...(await serverSideTranslations(locale || "fr", ["common"]))
            } 
        };
    }
};
