import { useEffect, useState } from "react";
import { useTranslation } from "next-i18next";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Drawer, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from "../ui/drawer";
import FilterSidebar from "./FilterSidebar";

// SSR-safe: starts false (Dialog), flips to true on client if viewport is mobile.
// Since the modal always starts closed, the one-frame flash is imperceptible.
function useIsMobile(breakpoint = 640) {
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [breakpoint]);
    return isMobile;
}

interface FilterModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    selectedPriceRanges: string[];
    onPriceChange: (value: string, checked: boolean) => void;
    onClearAll: () => void;
    total: number;
    sort: string;
    onSortChange: (value: string) => void;
    minRating: number | null;
    onRatingChange: (val: number | null) => void;
    isVerified: boolean;
    onVerifiedChange: (val: boolean) => void;
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
    minRating,
    onRatingChange,
    isVerified,
    onVerifiedChange,
}: FilterModalProps) {
    const { t } = useTranslation("common");
    const isMobile = useIsMobile();
    const hasFilters = selectedPriceRanges.length > 0 || !!minRating || isVerified;

    const sidebarProps = {
        selectedPriceRanges,
        onChange: onPriceChange,
        sort,
        onSortChange,
        minRating,
        onRatingChange,
        isVerified,
        onVerifiedChange,
    };

    const header = (
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EBEBEB]">
            <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#F7F7F7] transition-colors"
                aria-label={t("common.close")}
            >
                <X className="w-4 h-4 text-[#1A1A1A]" />
            </button>
            <span className="text-[16px] font-semibold text-[#1A1A1A]">
                {t("filters.title")}
            </span>
            {hasFilters ? (
                <button
                    type="button"
                    onClick={onClearAll}
                    className="text-[13px] font-medium text-[#1A1A1A] underline underline-offset-2 hover:text-[#E8472A] transition-colors"
                >
                    {t("filters.clear_all")}
                </button>
            ) : (
                <div className="w-16" aria-hidden="true" />
            )}
        </div>
    );

    const footer = (
        <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="w-full bg-[#1A1A1A] hover:bg-[#333333] text-white rounded-xl h-12 text-[15px] font-semibold transition-colors shadow-sm active:scale-[0.98]"
        >
            {t("filters.show_results", { count: total })}
        </button>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="max-h-[92dvh] flex flex-col p-0">
                    <DrawerHeader className="p-0 shrink-0">
                        <DrawerTitle className="sr-only">{t("filters.title")}</DrawerTitle>
                        {header}
                    </DrawerHeader>
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        <FilterSidebar {...sidebarProps} />
                    </div>
                    <DrawerFooter className="px-6 py-4 border-t border-[#EBEBEB] bg-white shrink-0">
                        {footer}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[568px] p-0 gap-0 overflow-hidden rounded-2xl [&>button]:hidden flex flex-col">
                <DialogTitle className="sr-only">{t("filters.title")}</DialogTitle>
                {header}
                <div className="px-6 py-6 overflow-y-auto max-h-[60vh]">
                    <FilterSidebar {...sidebarProps} />
                </div>
                <div className="px-6 py-4 border-t border-[#EBEBEB] bg-white shrink-0">
                    {footer}
                </div>
            </DialogContent>
        </Dialog>
    );
}
