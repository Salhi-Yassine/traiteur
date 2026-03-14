"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface SearchBarProps {
    initialLocation?: string;
    initialCategory?: string;
    variant?: "hero" | "page";
}

// v3.0 — white-first, clean neutral focus ring, terracotta CTA
export default function SearchBar({
    initialLocation = "",
    initialCategory = "",
    variant = "hero",
}: SearchBarProps) {
    const { t } = useTranslation("common");
    const router = useRouter();
    const [query, setQuery] = useState(initialLocation);
    const [city, setCity] = useState(initialLocation || "all");
    const [category, setCategory] = useState(initialCategory || "all");
    const [dynamicOptions, setDynamicOptions] = useState<{ cities: string[], categories: string[] }>({
        cities: [],
        categories: []
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
                const res = await fetch(`${baseUrl}/api/app_stats`);
                if (res.ok) {
                    const data = await res.json();
                    setDynamicOptions({
                        cities: data.availableCities || [],
                        categories: Object.keys(data.categoryCounts || {})
                    });
                }
            } catch (err) {
                console.error("Failed to fetch search options:", err);
            }
        };
        fetchOptions();
    }, []);

    const CITIES = [
        { value: "all", label: t("search_bar.cities.all") },
        ...dynamicOptions.cities.map(c => ({
            value: c,
            label: t(`search_bar.cities.${c.toLowerCase().replace(/\s+/g, '_')}`, { defaultValue: c })
        }))
    ];

    const FALLBACK_CITIES = [
        { value: "all", label: t("search_bar.cities.all") },
        { value: "Casablanca", label: t("search_bar.cities.casablanca", { defaultValue: "Casablanca" }) },
        { value: "Marrakech", label: t("search_bar.cities.marrakech", { defaultValue: "Marrakech" }) },
        { value: "Rabat", label: t("search_bar.cities.rabat", { defaultValue: "Rabat" }) },
        { value: "Fès", label: t("search_bar.cities.fes", { defaultValue: "Fès" }) },
        { value: "Tanger", label: t("search_bar.cities.tanger", { defaultValue: "Tanger" }) },
    ];

    const finalCities = CITIES.length > 1 ? CITIES : FALLBACK_CITIES;

    const CATEGORIES = [
        { value: "all", label: t("search_bar.categories.all") },
        ...dynamicOptions.categories.map(cat => ({
            value: cat,
            label: t(`search_bar.categories.${cat.toLowerCase()}`, { defaultValue: cat })
        }))
    ];

    const FALLBACK_CATEGORIES = [
        { value: "all", label: t("search_bar.categories.all") },
        { value: "Salles", label: t("search_bar.categories.salles") },
        { value: "Catering", label: t("search_bar.categories.catering") },
        { value: "Negrafa", label: t("search_bar.categories.negrafa") },
        { value: "Photography", label: t("search_bar.categories.photography") },
    ];

    const finalCategories = CATEGORIES.length > 1 ? CATEGORIES : FALLBACK_CATEGORIES;

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (city && city !== "all") params.set("serviceArea", city);
        if (category && category !== "all") params.set("category", category);
        router.push(`/vendors?${params.toString()}`);
    };

    if (variant === "hero") {
        return (
            <form
                onSubmit={handleSearch}
                className="w-full max-w-3xl bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-[0_2px_12px_rgba(0,0,0,0.10)]"
                role="search"
                aria-label={t("search_bar.cat_label")}
            >
                {/* Text input */}
                <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#F7F7F7] transition-colors group">
                    <svg className="w-4 h-4 text-[#B0B0B0] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <Input
                        type="text"
                        id="hero-search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("search_bar.placeholder")}
                        className="flex-1 bg-transparent text-[15px] border-none shadow-none focus-visible:ring-0 px-0 outline-none font-[400] text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                    />
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-[#DDDDDD] self-stretch my-2" />

                {/* City select */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#F7F7F7] transition-colors">
                    <svg className="w-4 h-4 text-[#B0B0B0] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <Select value={city} onValueChange={setCity}>
                        <SelectTrigger id="hero-city-select" aria-label={t("search_bar.city_label")} className="w-[140px] border-none shadow-none focus:ring-0 bg-transparent px-0 text-[14px] text-[#484848] focus:border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-none outline-none">
                            <SelectValue placeholder={t("search_bar.cities.all")} />
                        </SelectTrigger>
                        <SelectContent>
                            {finalCities.map((c) => (
                                <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* CTA */}
                <Button
                    type="submit"
                    className="px-7 py-3 rounded-xl text-[15px] h-auto shrink-0"
                >
                    {t("search_bar.cta")}
                </Button>
            </form>
        );
    }

    // Page variant — compact bar
    return (
        <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 w-full"
            role="search"
        >
            <div className="flex-[2] flex items-center gap-3 bg-white border-[1.5px] border-[#DDDDDD] rounded-lg px-4 h-12 focus-within:border-[#1A1A1A] focus-within:shadow-[0_0_0_3px_rgba(26,26,26,0.08)] transition-all">
                <svg className="w-4 h-4 text-[#B0B0B0] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("search_bar.placeholder")}
                    className="flex-1 bg-transparent text-[15px] border-none shadow-none focus-visible:ring-0 px-0 outline-none font-[400] text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                />
            </div>
            
            <div className="flex-1">
                <Select value={city} onValueChange={setCity}>
                    <SelectTrigger id="page-city-select" aria-label={t("search_bar.city_label")} className="h-12 border-[1.5px] border-[#DDDDDD] rounded-lg px-4 text-[14px] text-[#484848] focus:ring-0 focus:border-[#1A1A1A]">
                        <SelectValue placeholder={t("search_bar.cities.all")} />
                    </SelectTrigger>
                    <SelectContent>
                        {CITIES.map((c) => (
                            <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="flex-1">
                <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="page-category-select" aria-label={t("search_bar.cat_label")} className="h-12 border-[1.5px] border-[#DDDDDD] rounded-lg px-4 text-[14px] text-[#484848] focus:ring-0 focus:border-[#1A1A1A]">
                        <SelectValue placeholder={t("search_bar.categories.all")} />
                    </SelectTrigger>
                    <SelectContent>
                        {finalCategories.map((cat) => (
                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <Button
                type="submit"
                className="px-6 h-12 rounded-lg text-[15px] shrink-0"
            >
                {t("search_bar.cta")}
            </Button>
        </form>
    );
}
