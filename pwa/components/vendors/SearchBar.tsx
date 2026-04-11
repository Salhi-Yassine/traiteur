"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Check, ChevronsUpDown, Search, MapPin, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";

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
    const [openCity, setOpenCity] = useState(false);
    const [openPageCity, setOpenPageCity] = useState(false);
    const [openCategory, setOpenCategory] = useState(false);
    const [openPageCategory, setOpenPageCategory] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const [activeSection, setActiveSection] = useState<"where" | "what" | null>(null);
    const capsuleRef = useRef<HTMLDivElement>(null);
    const [dynamicOptions, setDynamicOptions] = useState<{ 
        cities: { name: string, slug: string }[], 
        categories: { name: string, slug: string }[] 
    }>({
        cities: [],
        categories: []
    });

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
                const res = await fetch(`${baseUrl}/api/app_stats`, {
                    headers: {
                        'Accept-Language': router.locale || 'fr'
                    }
                });
                if (res.ok) {
                    const data = await res.json();
                    setDynamicOptions({
                        cities: data.availableCities || [],
                        categories: data.availableCategories || []
                    });
                }
            } catch (err) {
                console.error("Failed to fetch search options:", err);
            }
        };
        fetchOptions();
    }, [router.locale]);

    // Close capsule on outside click
    const handleClickOutside = useCallback((e: MouseEvent) => {
        if (capsuleRef.current && !capsuleRef.current.contains(e.target as Node)) {
            setExpanded(false);
            setActiveSection(null);
        }
    }, []);

    useEffect(() => {
        if (expanded) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [expanded, handleClickOutside]);

    // Close capsule on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setExpanded(false);
                setActiveSection(null);
            }
        };
        if (expanded) {
            document.addEventListener("keydown", handleKeyDown);
            return () => document.removeEventListener("keydown", handleKeyDown);
        }
    }, [expanded]);

    const CITIES = [
        { value: "all", label: t("search_bar.cities.all") },
        ...dynamicOptions.cities.map(c => ({
            value: c.slug,
            label: c.name
        }))
    ];

    const FALLBACK_CITIES = [
        { value: "all", label: t("search_bar.cities.all") },
        { value: "casablanca", label: t("search_bar.cities.casablanca", { defaultValue: "Casablanca" }) },
        { value: "marrakech", label: t("search_bar.cities.marrakech", { defaultValue: "Marrakech" }) },
        { value: "rabat", label: t("search_bar.cities.rabat", { defaultValue: "Rabat" }) },
        { value: "fes", label: t("search_bar.cities.fes", { defaultValue: "Fès" }) },
        { value: "tanger", label: t("search_bar.cities.tanger", { defaultValue: "Tanger" }) },
    ];

    const finalCities = CITIES.length > 1 ? CITIES : FALLBACK_CITIES;

    const CATEGORIES = [
        { value: "all", label: t("search_bar.categories.all") },
        ...dynamicOptions.categories.map(cat => ({
            value: cat.slug,
            label: cat.name
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

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (city && city !== "all") params.set("serviceArea", city);
        if (category && category !== "all") params.set("category", category);
        router.push(`/vendors?${params.toString()}`);
        setExpanded(false);
        setActiveSection(null);
    };

    // For capsule: select city and auto-navigate
    const handleCitySelect = (value: string) => {
        setCity(value);
        setOpenPageCity(false);
        // Auto-search after selecting
        const params = new URLSearchParams();
        if (value && value !== "all") params.set("serviceArea", value);
        if (category && category !== "all") params.set("category", category);
        router.push(`/vendors?${params.toString()}`);
        setExpanded(false);
        setActiveSection(null);
    };

    const handleCategorySelect = (value: string) => {
        setCategory(value);
        setOpenPageCategory(false);
        // Auto-search after selecting
        const params = new URLSearchParams();
        if (city && city !== "all") params.set("serviceArea", city);
        if (value && value !== "all") params.set("category", value);
        router.push(`/vendors?${params.toString()}`);
        setExpanded(false);
        setActiveSection(null);
    };

    const cityLabel = city && city !== "all"
        ? finalCities.find((c) => c.value.toLowerCase() === city.toLowerCase())?.label
        : null;

    const categoryLabel = category && category !== "all"
        ? finalCategories.find((c) => c.value.toLowerCase() === category.toLowerCase())?.label
        : null;

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
                    <Search className="w-4 h-4 text-[#B0B0B0] shrink-0" />
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

                {/* Category select */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#F7F7F7] transition-colors relative">
                    <LayoutGrid className="w-4 h-4 text-[#B0B0B0] shrink-0" />
                    <Popover open={openCategory} onOpenChange={setOpenCategory}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                role="combobox"
                                aria-expanded={openCategory}
                                className="w-[140px] justify-between border-none shadow-none focus:ring-0 bg-transparent px-0 text-[14px] text-[#484848] hover:bg-transparent font-normal h-auto"
                            >
                                <span className="truncate">
                                    {category && category !== "all"
                                        ? finalCategories.find((c) => c.value.toLowerCase() === category.toLowerCase())?.label
                                        : t("search_bar.categories.all")}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder={t("search_bar.cat_label")} />
                                <CommandList>
                                    <CommandEmpty>{t("search_bar.no_results", { defaultValue: "No results found." })}</CommandEmpty>
                                    <CommandGroup>
                                        {finalCategories.map((c) => (
                                            <CommandItem
                                                key={c.value}
                                                value={`${c.value} ${c.label}`}
                                                onSelect={() => {
                                                    setCategory(c.value === category ? "all" : c.value);
                                                    setOpenCategory(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        category.toLowerCase() === c.value.toLowerCase() ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {c.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-[#DDDDDD] self-stretch my-2" />

                {/* City select */}
                <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-[#F7F7F7] transition-colors relative">
                    <MapPin className="w-4 h-4 text-[#B0B0B0] shrink-0" />
                    <Popover open={openCity} onOpenChange={setOpenCity}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                role="combobox"
                                aria-expanded={openCity}
                                className="w-[140px] justify-between border-none shadow-none focus:ring-0 bg-transparent px-0 text-[14px] text-[#484848] hover:bg-transparent font-normal h-auto"
                            >
                                <span className="truncate">
                                    {city && city !== "all"
                                        ? finalCities.find((c) => c.value.toLowerCase() === city.toLowerCase())?.label
                                        : t("search_bar.cities.all")}
                                </span>
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0" align="start">
                            <Command>
                                <CommandInput placeholder={t("search_bar.city_label")} />
                                <CommandList>
                                    <CommandEmpty>{t("search_bar.no_results", { defaultValue: "No results found." })}</CommandEmpty>
                                    <CommandGroup>
                                        {finalCities.map((c) => (
                                            <CommandItem
                                                key={c.value}
                                                value={`${c.value} ${c.label}`}
                                                onSelect={() => {
                                                    setCity(c.value === city ? "all" : c.value);
                                                    setOpenCity(false);
                                                }}
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4",
                                                        city.toLowerCase() === c.value.toLowerCase() ? "opacity-100" : "opacity-0"
                                                    )}
                                                />
                                                {c.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </CommandList>
                            </Command>
                        </PopoverContent>
                    </Popover>
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

    // ─── Page variant — Airbnb-style expandable capsule ──────────────────────
    const summaryParts = [
        cityLabel || t("search_bar.anywhere"),
        categoryLabel || t("search_bar.any_category"),
    ];

    return (
        <div ref={capsuleRef} className="relative w-full max-w-2xl">
            {/* Collapsed capsule */}
            {!expanded && (
                <button
                    type="button"
                    onClick={() => setExpanded(true)}
                    className="w-full flex items-center gap-3 bg-white border border-[#DDDDDD] rounded-full h-12 ps-5 pe-2 shadow-sm hover:shadow-md transition-all duration-200 group"
                    aria-label={t("search_bar.expand_search")}
                    id="search-capsule-collapsed"
                >
                    <Search className="w-4 h-4 text-[#1A1A1A] shrink-0" />
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-[14px] font-semibold text-[#1A1A1A] truncate">
                            {cityLabel || t("search_bar.anywhere")}
                        </span>
                        <span className="w-px h-4 bg-[#DDDDDD] shrink-0" />
                        <span className="text-[14px] text-[#717171] truncate">
                            {categoryLabel || t("search_bar.any_category")}
                        </span>
                    </div>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-[#E8472A] flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                        <Search className="w-3.5 h-3.5 text-white" />
                    </span>
                </button>
            )}

            {/* Expanded capsule */}
            {expanded && (
                <div className="w-full bg-white border border-[#DDDDDD] rounded-2xl shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-200">
                    <div className="flex flex-col sm:flex-row">
                        {/* Where section */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveSection("where");
                                setOpenPageCity(true);
                            }}
                            className={cn(
                                "flex-1 px-5 py-4 text-start transition-colors rounded-s-2xl",
                                activeSection === "where"
                                    ? "bg-white shadow-[inset_0_0_0_1.5px_#1A1A1A] rounded-2xl"
                                    : "hover:bg-[#F7F7F7]"
                            )}
                        >
                            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wide">{t("search_bar.where")}</p>
                            <p className="text-[14px] text-[#717171] mt-0.5 truncate">
                                {cityLabel || t("search_bar.anywhere")}
                            </p>
                        </button>

                        {/* Divider */}
                        <div className="hidden sm:block w-px bg-[#DDDDDD] self-stretch my-3" />
                        <div className="sm:hidden h-px bg-[#DDDDDD] mx-4" />

                        {/* What section */}
                        <button
                            type="button"
                            onClick={() => {
                                setActiveSection("what");
                                setOpenPageCategory(true);
                            }}
                            className={cn(
                                "flex-1 px-5 py-4 text-start transition-colors",
                                activeSection === "what"
                                    ? "bg-white shadow-[inset_0_0_0_1.5px_#1A1A1A] rounded-2xl"
                                    : "hover:bg-[#F7F7F7]"
                            )}
                        >
                            <p className="text-[11px] font-bold text-[#1A1A1A] uppercase tracking-wide">{t("search_bar.what")}</p>
                            <p className="text-[14px] text-[#717171] mt-0.5 truncate">
                                {categoryLabel || t("search_bar.any_category")}
                            </p>
                        </button>

                        {/* Search button */}
                        <div className="flex items-center px-3 py-3">
                            <button
                                type="button"
                                onClick={() => handleSearch()}
                                className="flex items-center gap-2 bg-[#E8472A] hover:bg-[#C43A20] text-white rounded-xl px-5 h-11 text-[14px] font-semibold transition-colors shadow-sm"
                            >
                                <Search className="w-4 h-4" />
                                <span className="hidden sm:inline">{t("search_bar.cta")}</span>
                            </button>
                        </div>
                    </div>

                    {/* City dropdown panel */}
                    {activeSection === "where" && (
                        <div className="border-t border-[#EBEBEB] p-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {finalCities.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => handleCitySelect(c.value)}
                                        className={cn(
                                            "text-start px-4 py-3 rounded-xl text-[14px] transition-all border",
                                            city.toLowerCase() === c.value.toLowerCase()
                                                ? "bg-[#F7F7F7] border-[#1A1A1A] font-medium text-[#1A1A1A]"
                                                : "border-transparent hover:bg-[#F7F7F7] text-[#484848]"
                                        )}
                                    >
                                        <MapPin className="w-3.5 h-3.5 inline-block me-1.5 opacity-50" />
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Category dropdown panel */}
                    {activeSection === "what" && (
                        <div className="border-t border-[#EBEBEB] p-4 animate-in slide-in-from-top-2 duration-200">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                {finalCategories.map((c) => (
                                    <button
                                        key={c.value}
                                        type="button"
                                        onClick={() => handleCategorySelect(c.value)}
                                        className={cn(
                                            "text-start px-4 py-3 rounded-xl text-[14px] transition-all border",
                                            category.toLowerCase() === c.value.toLowerCase()
                                                ? "bg-[#F7F7F7] border-[#1A1A1A] font-medium text-[#1A1A1A]"
                                                : "border-transparent hover:bg-[#F7F7F7] text-[#484848]"
                                        )}
                                    >
                                        <LayoutGrid className="w-3.5 h-3.5 inline-block me-1.5 opacity-50" />
                                        {c.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
