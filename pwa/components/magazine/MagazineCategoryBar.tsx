import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import apiClient from "@/utils/apiClient";
import { mockArticleCategories } from "@/lib/mockMagazineData";
import { ArticleCategory, HydraCollection } from "@/types/magazine";

interface MagazineCategoryBarProps {
    activeSlug: string | null;
    onChange: (slug: string | null) => void;
}

export default function MagazineCategoryBar({ activeSlug, onChange }: MagazineCategoryBarProps) {
    const { t } = useTranslation("common");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showStartFade, setShowStartFade] = useState(false);
    const [showEndFade, setShowEndFade] = useState(false);

    const { data } = useQuery({
        queryKey: ["article_categories"],
        queryFn: async () => {
            try {
                return await apiClient.get<HydraCollection<ArticleCategory>>("/api/article_categories");
            } catch (error) {
                console.error("Article Categories API Error, using mocks:", error);
                return { "hydra:member": mockArticleCategories };
            }
        },
        staleTime: 1000 * 60 * 10,
    });

    const categories = data?.["hydra:member"] ?? [];
    const isLoading = !data && categories.length === 0;

    function updateFades() {
        const el = scrollRef.current;
        if (!el) return;
        setShowStartFade(el.scrollLeft > 8);
        setShowEndFade(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    }

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateFades();
        el.addEventListener("scroll", updateFades, { passive: true });
        window.addEventListener("resize", updateFades);
        return () => {
            el.removeEventListener("scroll", updateFades);
            window.removeEventListener("resize", updateFades);
        };
    }, [categories]);

    return (
        <div className="relative bg-white border-b border-[#F0F0F0]">
            {/* Start fade */}
            {showStartFade && (
                <div className="absolute start-0 top-0 bottom-0 w-12 bg-gradient-to-e from-white to-transparent z-10 pointer-events-none" />
            )}
            {/* End fade */}
            {showEndFade && (
                <div className="absolute end-0 top-0 bottom-0 w-12 bg-gradient-to-s from-white to-transparent z-10 pointer-events-none" />
            )}

            {isLoading ? (
                <div className="flex items-center gap-1 overflow-hidden px-4 md:px-8 max-w-7xl mx-auto">
                    {Array.from({ length: 7 }).map((_, i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center gap-1.5 px-4 py-3 shrink-0 animate-pulse"
                        >
                            <div className="w-6 h-6 rounded-full bg-[#E8E8E8]" />
                            <div className="h-2 rounded bg-[#E8E8E8]" style={{ width: `${40 + i * 8}px` }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div
                    ref={scrollRef}
                    className="flex items-center gap-1 overflow-x-auto scrollbar-none px-4 md:px-8 max-w-7xl mx-auto"
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                    {/* "All" pill */}
                    <CategoryPill
                        label={t("magazine.category_bar.all")}
                        isActive={activeSlug === null}
                        onClick={() => onChange(null)}
                    />

                    {/* Wisdom Smart Search */}
                    <div className="relative flex items-center shrink-0 ml-2 mr-6 rtl:ml-6 rtl:mr-2">
                        <div className="absolute left-3 rtl:right-3 rtl:left-auto text-neutral-400">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            placeholder={t("magazine.search_placeholder")}
                            className="bg-neutral-50/50 hover:bg-neutral-50 border border-transparent hover:border-neutral-200 focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10 rounded-full py-2.5 pl-10 pr-4 rtl:pr-10 rtl:pl-4 text-[13px] w-48 focus:w-64 transition-all duration-300 outline-none placeholder:text-neutral-400"
                        />
                    </div>

                    {/* Categories */}
                    <div className="hidden md:block w-px h-8 bg-neutral-200 shrink-0 mx-2" />

                    {categories.map((cat) => (
                        <CategoryPill
                            key={cat.id}
                            label={cat.name}
                            iconSvg={cat.iconSvg}
                            isActive={activeSlug === cat.slug}
                            onClick={() => onChange(cat.slug)}
                        />
                    ))}
                </div>
            )}
        </div>

    );
}

interface CategoryPillProps {
    label: string;
    iconSvg?: string;
    isActive: boolean;
    onClick: () => void;
}

function CategoryPill({ label, iconSvg, isActive, onClick }: CategoryPillProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center gap-1.5 px-4 py-3 shrink-0 transition-all duration-200 relative",
                "text-[12px] font-semibold uppercase tracking-widest whitespace-nowrap",
                isActive ? "text-[#1A1A1A]" : "text-[#717171] hover:text-[#1A1A1A]"
            )}
        >
            {iconSvg ? (
                <span
                    className={cn("w-6 h-6 transition-colors duration-200", isActive ? "text-primary" : "text-[#717171]")}
                    dangerouslySetInnerHTML={{ __html: iconSvg }}
                />
            ) : (
                <span className={cn("w-6 h-6 flex items-center justify-center")}>
                    <span className={cn("w-2 h-2 rounded-full", isActive ? "bg-primary" : "bg-[#D0D0D0]")} />
                </span>
            )}
            {label}
            {isActive && (
                <span className="absolute bottom-0 start-4 end-4 h-[2px] bg-primary rounded-full" />
            )}
        </button>
    );
}
