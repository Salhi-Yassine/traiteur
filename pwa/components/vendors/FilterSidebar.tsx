import { cn } from "@/lib/utils";
import { useTranslation } from "next-i18next";
import { Star, ShieldCheck } from "lucide-react";

// Airbnb-style visual filter tiles — used inside FilterModal
// Categories are handled by CategoryPills in the directory page

interface FilterSidebarProps {
    selectedPriceRanges: string[];
    onChange: (value: string, checked: boolean) => void;
    sort: string;
    onSortChange: (value: string) => void;
    minRating: number | null;
    onRatingChange: (val: number | null) => void;
    isVerified: boolean;
    onVerifiedChange: (val: boolean) => void;
}

const ALL_PRICE_RANGES = [
    { labelKey: "budget",   value: "MAD",        symbols: 1 },
    { labelKey: "standard", value: "MADMAD",     symbols: 2 },
    { labelKey: "premium",  value: "MADMADMAD",  symbols: 3 },
    { labelKey: "exclusif", value: "MADMADMAD+", symbols: 4 },
];

const SORT_OPTIONS = [
    { value: "rating",     labelKey: "filters.sort.rating" },
    { value: "reviews",    labelKey: "filters.sort.reviews" },
    { value: "price_asc",  labelKey: "filters.sort.price_asc" },
    { value: "price_desc", labelKey: "filters.sort.price_desc" },
];

// Only show meaningful star thresholds (nobody filters for "1+ stars")
const RATING_OPTIONS = [3, 4, 5] as const;

export default function FilterSidebar({
    selectedPriceRanges,
    onChange,
    sort,
    onSortChange,
    minRating,
    onRatingChange,
    isVerified,
    onVerifiedChange,
}: FilterSidebarProps) {
    const { t } = useTranslation("common");

    return (
        <div className="space-y-8">
            {/* ── Sort Section ─────────────────────────────── */}
            <FilterSection title={t("filters.sort_label")}>
                <div className="flex flex-wrap gap-2">
                    {SORT_OPTIONS.map(({ value, labelKey }) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => onSortChange(value)}
                            className={cn(
                                "px-4 py-2.5 rounded-full text-[13px] font-medium border transition-all duration-200",
                                sort === value
                                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                    : "bg-white text-[#484848] border-[#DDDDDD] hover:border-[#1A1A1A]"
                            )}
                        >
                            {t(labelKey, value)}
                        </button>
                    ))}
                </div>
            </FilterSection>

            <div className="border-t border-[#EBEBEB]" />

            {/* ── Price Range Section ──────────────────────── */}
            <FilterSection title={t("filters.price_range")}>
                <div className="grid grid-cols-2 gap-3">
                    {ALL_PRICE_RANGES.map(({ labelKey, value, symbols }) => {
                        const isSelected = selectedPriceRanges.includes(value);
                        return (
                            <button
                                key={value}
                                type="button"
                                onClick={() => onChange(value, !isSelected)}
                                className={cn(
                                    "relative flex flex-col items-start p-4 rounded-xl border-[1.5px] transition-all duration-200 text-start",
                                    isSelected
                                        ? "border-[#E8472A] bg-[#FEF0ED]"
                                        : "border-[#DDDDDD] bg-white hover:border-[#B0B0B0]"
                                )}
                            >
                                {isSelected && (
                                    <span className="absolute top-3 end-3 w-5 h-5 rounded-full bg-[#E8472A] flex items-center justify-center">
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                                            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                    </span>
                                )}
                                <span className="text-[16px] font-semibold tracking-wider mb-1">
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <span
                                            key={i}
                                            className={cn(
                                                "transition-colors",
                                                i < symbols
                                                    ? isSelected ? "text-[#E8472A]" : "text-[#1A1A1A]"
                                                    : "text-[#DDDDDD]"
                                            )}
                                        >
                                            د
                                        </span>
                                    ))}
                                </span>
                                <span className={cn(
                                    "text-[14px] font-medium",
                                    isSelected ? "text-[#E8472A]" : "text-[#1A1A1A]"
                                )}>
                                    {t(`filters.price_labels.${labelKey}`)}
                                </span>
                                <span className="text-[12px] text-[#717171] mt-0.5">
                                    {t(`filters.price_desc_labels.${labelKey}`, "")}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            <div className="border-t border-[#EBEBEB]" />

            {/* ── Minimum Rating Section ───────────────────── */}
            <FilterSection title={t("filters.min_rating")}>
                <div className="flex items-center gap-2">
                    {RATING_OPTIONS.map(star => {
                        const isSelected = minRating === star;
                        return (
                            <button
                                key={star}
                                type="button"
                                onClick={() => onRatingChange(isSelected ? null : star)}
                                aria-label={`${star}+ étoiles`}
                                className={cn(
                                    "flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium border transition-all duration-200",
                                    isSelected
                                        ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                                        : "bg-white text-[#484848] border-[#DDDDDD] hover:border-[#1A1A1A]"
                                )}
                            >
                                <Star
                                    className={cn(
                                        "w-3.5 h-3.5 shrink-0",
                                        isSelected ? "fill-yellow-300 text-yellow-300" : "fill-yellow-400 text-yellow-400"
                                    )}
                                />
                                {star}+
                            </button>
                        );
                    })}
                </div>
            </FilterSection>

            <div className="border-t border-[#EBEBEB]" />

            {/* ── Verified Only ────────────────────────────── */}
            <button
                type="button"
                role="checkbox"
                aria-checked={isVerified}
                onClick={() => onVerifiedChange(!isVerified)}
                className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border-[1.5px] transition-all duration-200 text-start",
                    isVerified
                        ? "border-[#E8472A] bg-[#FEF0ED]"
                        : "border-[#DDDDDD] bg-white hover:border-[#B0B0B0]"
                )}
            >
                <div className="flex items-center gap-3">
                    <ShieldCheck className={cn("w-5 h-5 shrink-0", isVerified ? "text-[#E8472A]" : "text-[#717171]")} />
                    <div className="text-start">
                        <span className={cn("block text-[14px] font-medium", isVerified ? "text-[#E8472A]" : "text-[#1A1A1A]")}>
                            {t("filters.verified_only")}
                        </span>
                        <span className="block text-[12px] text-[#717171] mt-0.5">
                            {t("filters.help_title", "")}
                        </span>
                    </div>
                </div>
                {/* Custom toggle indicator */}
                <div className={cn(
                    "w-5 h-5 rounded-full border-[1.5px] flex items-center justify-center shrink-0 transition-all",
                    isVerified ? "bg-[#E8472A] border-[#E8472A]" : "border-[#DDDDDD]"
                )}>
                    {isVerified && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                            <path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    )}
                </div>
            </button>
        </div>
    );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="space-y-4">
            <h3 className="text-[14px] font-semibold text-[#1A1A1A]">{title}</h3>
            <div>{children}</div>
        </div>
    );
}
