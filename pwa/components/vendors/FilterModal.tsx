import { useTranslation } from "next-i18next";
import { X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "../ui/dialog";
import FilterSidebar from "./FilterSidebar";

interface FilterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPriceRanges: string[];
    onPriceChange: (value: string, checked: boolean) => void;
    onClearAll: () => void;
    total: number;
    sort: string;
    onSortChange: (value: string) => void;
}

export default function FilterModal({
    open,
    onOpenChange,
    selectedPriceRanges,
    onPriceChange,
    onClearAll,
    total,
    sort,
    onSortChange,
}: FilterModalProps) {
    const { t } = useTranslation("common");
    const hasFilters = selectedPriceRanges.length > 0;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[568px] p-0 gap-0 overflow-hidden rounded-2xl [&>button]:hidden">
                {/* ── Header — Airbnb style: X left, title center, clear right ── */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEBEB]">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
                        aria-label={t("common.close")}
                    >
                        <X className="w-4 h-4 text-[#1A1A1A]" />
                    </button>

                    <DialogTitle className="text-[16px] font-semibold text-[#1A1A1A] text-center">
                        {t("filters.title")}
                    </DialogTitle>

                    {hasFilters ? (
                        <button
                            type="button"
                            onClick={onClearAll}
                            className="text-[13px] font-medium text-[#1A1A1A] underline underline-offset-2 hover:text-[#E8472A] transition-colors"
                        >
                            {t("filters.clear_all")}
                        </button>
                    ) : (
                        <div className="w-16" /> /* Spacer for alignment */
                    )}
                </div>

                {/* ── Body ── */}
                <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
                    <FilterSidebar
                        selectedPriceRanges={selectedPriceRanges}
                        onChange={onPriceChange}
                        sort={sort}
                        onSortChange={onSortChange}
                    />
                </div>

                {/* ── Sticky Footer — Airbnb dark CTA ── */}
                <div className="px-6 py-4 border-t border-[#EBEBEB] bg-white">
                    <button
                        type="button"
                        onClick={() => onOpenChange(false)}
                        className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-xl h-12 text-[15px] font-semibold transition-colors shadow-sm active:scale-[0.98]"
                    >
                        {t("filters.show_results", { count: total })}
                    </button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
