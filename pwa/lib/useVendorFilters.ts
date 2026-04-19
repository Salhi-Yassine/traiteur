import { useState, useCallback } from "react";
import { useRouter } from "next/router";

export type SortKey = "rating" | "reviews" | "price_asc" | "price_desc";

interface VendorFiltersInit {
    category?: string;
    priceRanges?: string[];
    sort?: SortKey;
    minRating?: number | null;
    isVerified?: boolean;
}

export function useVendorFilters(init: VendorFiltersInit = {}) {
    const router = useRouter();
    const [activeCategory, setActiveCategory] = useState(init.category ?? "");
    const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>(init.priceRanges ?? []);
    const [sort, setSort] = useState<SortKey>(init.sort ?? "rating");
    const [minRating, setMinRating] = useState<number | null>(init.minRating ?? null);
    const [isVerified, setIsVerified] = useState(init.isVerified ?? false);

    const hasActiveFilters = selectedPriceRanges.length > 0 || !!minRating || isVerified;
    const modalFilterCount =
        selectedPriceRanges.length +
        (sort !== "rating" ? 1 : 0) +
        (minRating ? 1 : 0) +
        (isVerified ? 1 : 0);

    const pushQuery = useCallback(
        (patch: Record<string, string | string[] | undefined>) => {
            const next: Record<string, string | string[] | undefined> = {
                ...router.query,
                ...patch,
                page: "1",
            };
            Object.keys(next).forEach(k => {
                if (!next[k] || (Array.isArray(next[k]) && (next[k] as string[]).length === 0)) {
                    delete next[k];
                }
            });
            router.push({ pathname: "/vendors", query: next }, undefined, { shallow: true });
        },
        [router],
    );

    const handlePriceChange = useCallback(
        (value: string, checked: boolean) => {
            setSelectedPriceRanges(prev => {
                const next = checked ? [...prev, value] : prev.filter(v => v !== value);
                pushQuery({ priceRange: next.length ? next : undefined });
                return next;
            });
        },
        [pushQuery],
    );

    const handleSortChange = useCallback(
        (value: string) => {
            setSort(value as SortKey);
            pushQuery({ sort: value });
        },
        [pushQuery],
    );

    const handleRatingChange = useCallback(
        (val: number | null) => {
            setMinRating(val);
            pushQuery({ minRating: val != null ? String(val) : undefined });
        },
        [pushQuery],
    );

    const handleVerifiedChange = useCallback(
        (val: boolean) => {
            setIsVerified(val);
            pushQuery({ isVerified: val ? "true" : undefined });
        },
        [pushQuery],
    );

    const handleModalClear = useCallback(() => {
        setSelectedPriceRanges([]);
        setSort("rating");
        setMinRating(null);
        setIsVerified(false);
        pushQuery({ priceRange: undefined, sort: undefined, minRating: undefined, isVerified: undefined });
    }, [pushQuery]);

    const handleClearAll = useCallback(() => {
        setActiveCategory("");
        setSelectedPriceRanges([]);
        setSort("rating");
        setMinRating(null);
        setIsVerified(false);
        router.push("/vendors");
    }, [router]);

    const removePriceFilter = useCallback(
        (value: string) => {
            handlePriceChange(value, false);
        },
        [handlePriceChange],
    );

    const goToPage = useCallback(
        (p: number) => {
            router.push({ pathname: "/vendors", query: { ...router.query, page: p } });
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        [router],
    );

    return {
        activeCategory,
        setActiveCategory,
        selectedPriceRanges,
        sort,
        minRating,
        isVerified,
        hasActiveFilters,
        modalFilterCount,
        handlePriceChange,
        handleSortChange,
        handleRatingChange,
        handleVerifiedChange,
        handleModalClear,
        handleClearAll,
        removePriceFilter,
        goToPage,
    };
}
