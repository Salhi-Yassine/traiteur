"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
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

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (city && city !== "all") params.set("cities.slug", city);
        if (category && category !== "all") params.set("category.slug", category);
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

    // Page variant — compact bar
    return (
        <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 w-full"
            role="search"
        >
            <div className="flex-[2] flex items-center gap-3 bg-white border-[1.5px] border-[#DDDDDD] rounded-lg px-4 h-12 focus-within:border-[#1A1A1A] focus-within:shadow-[0_0_0_3px_rgba(26,26,26,0.08)] transition-all">
                <Search className="w-4 h-4 text-[#B0B0B0] shrink-0" />
                <Input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("search_bar.placeholder")}
                    className="flex-1 bg-transparent text-[15px] border-none shadow-none focus-visible:ring-0 px-0 outline-none font-[400] text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                />
            </div>

            <div className="flex-1">
                <Popover open={openPageCity} onOpenChange={setOpenPageCity}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPageCity}
                            className="w-full h-12 justify-between border-[1.5px] border-[#DDDDDD] rounded-lg px-4 text-[14px] text-[#484848] font-normal"
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
                                                setOpenPageCity(false);
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

            <div className="flex-1">
                <Popover open={openPageCategory} onOpenChange={setOpenPageCategory}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openPageCategory}
                            className="w-full h-12 justify-between border-[1.5px] border-[#DDDDDD] rounded-lg px-4 text-[14px] text-[#484848] font-normal"
                        >
                            <span className="truncate">
                                {category && category !== "all"
                                    ? finalCategories.find((cat) => cat.value.toLowerCase() === category.toLowerCase())?.label
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
                                    {finalCategories.map((cat) => (
                                        <CommandItem
                                            key={cat.value}
                                            value={`${cat.value} ${cat.label}`}
                                            onSelect={() => {
                                                setCategory(cat.value === category ? "all" : cat.value);
                                                setOpenPageCategory(false);
                                            }}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    category.toLowerCase() === cat.value.toLowerCase() ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {cat.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </PopoverContent>
                </Popover>
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
