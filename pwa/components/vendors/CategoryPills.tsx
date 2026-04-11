import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";
import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
    Building2,
    Camera,
    Car,
    Gem,
    Music2,
    Palette,
    Sparkles,
    UtensilsCrossed,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Category {
    value: string;
    labelKey: string;
    Icon: LucideIcon | null;
}

const CATEGORIES: Category[] = [
    { value: "all",         labelKey: "search_bar.categories.all",         Icon: null },
    { value: "salles",      labelKey: "search_bar.categories.salles",      Icon: Building2 },
    { value: "catering",    labelKey: "search_bar.categories.catering",    Icon: UtensilsCrossed },
    { value: "negafa",      labelKey: "search_bar.categories.negrafa",     Icon: Gem },
    { value: "photography", labelKey: "search_bar.categories.photography", Icon: Camera },
    { value: "music",       labelKey: "search_bar.categories.music",       Icon: Music2 },
    { value: "decoration",  labelKey: "search_bar.categories.decoration",  Icon: Palette },
    { value: "beauty",      labelKey: "search_bar.categories.beauty",      Icon: Sparkles },
    { value: "transport",   labelKey: "search_bar.categories.transport",   Icon: Car },
];

interface CategoryPillsProps {
    activeCategory: string; // "" means "all"
    onSelect: (slug: string) => void; // "" to deselect back to all
}

export default function CategoryPills({ activeCategory, onSelect }: CategoryPillsProps) {
    const { t } = useTranslation("common");
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const checkOverflow = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 4);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
    }, []);

    useEffect(() => {
        checkOverflow();
        const el = scrollRef.current;
        if (!el) return;
        el.addEventListener("scroll", checkOverflow, { passive: true });
        window.addEventListener("resize", checkOverflow);
        return () => {
            el.removeEventListener("scroll", checkOverflow);
            window.removeEventListener("resize", checkOverflow);
        };
    }, [checkOverflow]);

    const scroll = (dir: "left" | "right") => {
        const el = scrollRef.current;
        if (!el) return;
        const amount = el.clientWidth * 0.6;
        el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
    };

    const handleClick = (value: string) => {
        if (value === "all") {
            onSelect("");
        } else {
            onSelect(activeCategory === value ? "" : value);
        }
    };

    return (
        <div className="relative">
            {/* Left fade + arrow */}
            {canScrollLeft && (
                <div className="absolute start-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="w-12 h-full bg-gradient-to-e from-white to-transparent absolute start-0 pointer-events-none" />
                    <button
                        type="button"
                        onClick={() => scroll("left")}
                        className="relative z-20 w-7 h-7 rounded-full border border-[#DDDDDD] bg-white shadow-sm flex items-center justify-center ms-1 hover:shadow-md hover:scale-105 transition-all"
                        aria-label="Scroll left"
                    >
                        <ChevronLeft className="w-3.5 h-3.5 text-[#1A1A1A] rtl:-scale-x-100" />
                    </button>
                </div>
            )}

            {/* Scrollable tabs */}
            <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-1"
            >
                {CATEGORIES.map(({ value, labelKey, Icon }) => {
                    const isActive = value === "all" ? activeCategory === "" : activeCategory === value;
                    return (
                        <button
                            key={value}
                            type="button"
                            onClick={() => handleClick(value)}
                            className={cn(
                                "group flex flex-col items-center gap-1.5 pb-3 pt-1 shrink-0 border-b-2 transition-all duration-200 min-w-[56px]",
                                isActive
                                    ? "border-[#1A1A1A] text-[#1A1A1A]"
                                    : "border-transparent text-[#717171] hover:text-[#1A1A1A] hover:border-[#DDDDDD]"
                            )}
                        >
                            <span
                                className={cn(
                                    "w-6 h-6 flex items-center justify-center transition-opacity",
                                    isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                                )}
                            >
                                {Icon ? (
                                    <Icon size={24} strokeWidth={1.5} />
                                ) : (
                                    /* "All" icon — a simple grid */
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                                    </svg>
                                )}
                            </span>
                            <span className={cn(
                                "text-[12px] font-medium whitespace-nowrap leading-none",
                                isActive ? "font-semibold" : ""
                            )}>
                                {t(labelKey)}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Right fade + arrow */}
            {canScrollRight && (
                <div className="absolute end-0 top-0 bottom-0 z-10 flex items-center">
                    <div className="w-12 h-full bg-gradient-to-s from-white to-transparent absolute end-0 pointer-events-none" />
                    <button
                        type="button"
                        onClick={() => scroll("right")}
                        className="relative z-20 w-7 h-7 rounded-full border border-[#DDDDDD] bg-white shadow-sm flex items-center justify-center me-1 hover:shadow-md hover:scale-105 transition-all"
                        aria-label="Scroll right"
                    >
                        <ChevronRight className="w-3.5 h-3.5 text-[#1A1A1A] rtl:-scale-x-100" />
                    </button>
                </div>
            )}
        </div>
    );
}
