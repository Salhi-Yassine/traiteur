import { useRef, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "next-i18next";
import { cn } from "@/lib/utils";
import apiClient from "@/utils/apiClient";

interface ArticleCategory {
    id: number;
    name: string;
    slug: string;
    iconSvg?: string;
}

interface HydraCollection<T> {
    "hydra:member": T[];
}

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
        queryFn: () => apiClient.get<HydraCollection<ArticleCategory>>("/api/article_categories"),
        staleTime: 1000 * 60 * 10,
    });

    const categories = data?.["hydra:member"] ?? [];
    const isLoading = !data;

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
