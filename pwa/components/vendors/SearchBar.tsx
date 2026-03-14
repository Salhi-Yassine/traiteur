"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

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
    const [city, setCity] = useState(initialLocation);
    const [category, setCategory] = useState(initialCategory);

    const CITIES = [
        { value: "", label: t("search_bar.cities.all") },
        { value: "Casablanca", label: t("search_bar.cities.casablanca", { defaultValue: "Casablanca" }) },
        { value: "Marrakech", label: t("search_bar.cities.marrakech", { defaultValue: "Marrakech" }) },
        { value: "Rabat", label: t("search_bar.cities.rabat", { defaultValue: "Rabat" }) },
        { value: "Fès", label: t("search_bar.cities.fes", { defaultValue: "Fès" }) },
        { value: "Tanger", label: t("search_bar.cities.tanger", { defaultValue: "Tanger" }) },
        { value: "Agadir", label: t("search_bar.cities.agadir", { defaultValue: "Agadir" }) },
        { value: "Meknès", label: t("search_bar.cities.meknes", { defaultValue: "Meknès" }) },
        { value: "Oujda", label: t("search_bar.cities.oujda", { defaultValue: "Oujda" }) },
        { value: "El Jadida", label: t("search_bar.cities.el_jadida", { defaultValue: "El Jadida" }) },
        { value: "Kénitra", label: t("search_bar.cities.kenitra", { defaultValue: "Kénitra" }) },
        { value: "Tétouan", label: t("search_bar.cities.tetouan", { defaultValue: "Tétouan" }) },
        { value: "Laâyoune", label: t("search_bar.cities.laayoune", { defaultValue: "Laâyoune" }) },
    ];

    const CATEGORIES = [
        { value: "", label: t("search_bar.categories.all") },
        { value: "Salles", label: t("search_bar.categories.salles") },
        { value: "Catering", label: t("search_bar.categories.catering") },
        { value: "Negrafa", label: t("search_bar.categories.negrafa") },
        { value: "Photography", label: t("search_bar.categories.photography") },
        { value: "Music", label: t("search_bar.categories.music") },
        { value: "Decoration", label: t("search_bar.categories.decoration") },
        { value: "Beauty", label: t("search_bar.categories.beauty") },
        { value: "Transport", label: t("search_bar.categories.transport") },
    ];

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query.trim()) params.set("q", query.trim());
        if (city) params.set("serviceArea", city);
        if (category) params.set("category", category);
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
                    <input
                        type="text"
                        id="hero-search-input"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t("search_bar.placeholder")}
                        className="flex-1 bg-transparent text-[15px] text-[#1A1A1A] placeholder:text-[#B0B0B0] outline-none font-[400]"
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
                    <select
                        id="hero-city-select"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="bg-transparent text-[14px] text-[#484848] outline-none cursor-pointer appearance-none pr-6 min-w-[140px]"
                        aria-label={t("search_bar.city_label")}
                    >
                        {CITIES.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                    </select>
                </div>

                {/* CTA */}
                <button
                    type="submit"
                    className="bg-[#E8472A] text-white px-7 py-3 rounded-xl text-[15px] font-semibold hover:bg-[#C43A20] transition-colors duration-150 shrink-0 active:scale-[0.98]"
                >
                    {t("search_bar.cta")}
                </button>
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
            <div className="flex-1 flex items-center gap-3 bg-white border-[1.5px] border-[#DDDDDD] rounded-lg px-4 h-12 focus-within:border-[#1A1A1A] focus-within:shadow-[0_0_0_3px_rgba(26,26,26,0.08)] transition-all">
                <svg className="w-4 h-4 text-[#B0B0B0] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={t("search_bar.placeholder")}
                    className="flex-1 bg-transparent text-[15px] text-[#1A1A1A] placeholder:text-[#B0B0B0] outline-none"
                />
            </div>
            <select
                id="page-city-select"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="bg-white border-[1.5px] border-[#DDDDDD] rounded-lg px-4 h-12 text-[14px] text-[#484848] outline-none cursor-pointer hover:border-[#B0B0B0] focus:border-[#1A1A1A] transition-colors appearance-none min-w-[140px]"
                aria-label={t("search_bar.city_label")}
            >
                {CITIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                ))}
            </select>
            <select
                id="page-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border-[1.5px] border-[#DDDDDD] rounded-lg px-4 h-12 text-[14px] text-[#484848] outline-none cursor-pointer hover:border-[#B0B0B0] focus:border-[#1A1A1A] transition-colors appearance-none min-w-[160px]"
                aria-label={t("search_bar.cat_label")}
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            <button
                type="submit"
                className="bg-[#E8472A] text-white px-6 h-12 rounded-lg text-[15px] font-semibold hover:bg-[#C43A20] transition-colors duration-150 shrink-0 active:scale-[0.98]"
            >
                {t("search_bar.cta")}
            </button>
        </form>
    );
}
