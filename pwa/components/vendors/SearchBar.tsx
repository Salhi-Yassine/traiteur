"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Search, MapPin, LayoutGrid, X, Building2, Camera, Car, Gem, Music2, Palette, Sparkles, UtensilsCrossed } from "lucide-react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "../ui/drawer";
import { cn } from "@/lib/utils";

interface SearchBarProps {
    initialLocation?: string;
    initialCategory?: string;
    variant?: "hero" | "page";
}

const CATEGORY_ICON_MAP: Record<string, React.ElementType> = {
    salles:      Building2,
    catering:    UtensilsCrossed,
    negafa:      Gem,
    photography: Camera,
    music:       Music2,
    decoration:  Palette,
    beauty:      Sparkles,
    transport:   Car,
};

export default function SearchBar({
    initialLocation = "",
    initialCategory = "",
    variant = "hero",
}: SearchBarProps) {
    const { t } = useTranslation("common");
    const router = useRouter();

    const [query, setQuery] = useState("");
    const [city, setCity] = useState(initialLocation || "all");
    const [category, setCategory] = useState(initialCategory || "all");
    const [activeSection, setActiveSection] = useState<"search" | "where" | "what" | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [cityFilter, setCityFilter] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("");
    const [mounted, setMounted] = useState(false);

    // Panel position (set from getBoundingClientRect when a section opens)
    const [panelCoords, setPanelCoords] = useState<{
        top: number;
        whereLeft: number;
        whatRight: number;
    }>({ top: 0, whereLeft: 0, whatRight: 0 });

    // Refs
    const capsuleRef       = useRef<HTMLDivElement>(null);
    const queryInputRef    = useRef<HTMLInputElement>(null);
    const cityFilterRef    = useRef<HTMLInputElement>(null);
    const categoryFilterRef = useRef<HTMLInputElement>(null);
    const whereSectionRef  = useRef<HTMLButtonElement>(null);
    const whatSectionRef   = useRef<HTMLButtonElement>(null);
    const wherePanelRef    = useRef<HTMLDivElement>(null);
    const whatPanelRef     = useRef<HTMLDivElement>(null);

    const [dynamicOptions, setDynamicOptions] = useState<{
        cities: { name: string; slug: string }[];
        categories: { name: string; slug: string }[];
    }>({ cities: [], categories: [] });

    // Portal mount guard (SSR safety)
    useEffect(() => { setMounted(true); }, []);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://localhost";
                const res = await fetch(`${baseUrl}/api/app_stats`, {
                    headers: { "Accept-Language": router.locale || "fr" },
                });
                if (res.ok) {
                    const data = await res.json();
                    setDynamicOptions({
                        cities: data.availableCities || [],
                        categories: data.availableCategories || [],
                    });
                }
            } catch {
                // falls back to static lists
            }
        };
        fetchOptions();
    }, [router.locale]);

    // Recalculate panel pixel coords whenever a section opens
    useEffect(() => {
        if (!capsuleRef.current) return;
        const pillRect = capsuleRef.current.getBoundingClientRect();
        const top = pillRect.bottom + 10;
        const whereLeft = whereSectionRef.current
            ? whereSectionRef.current.getBoundingClientRect().left
            : pillRect.left + pillRect.width * 0.38;
        const whatRight = whatSectionRef.current
            ? window.innerWidth - whatSectionRef.current.getBoundingClientRect().right
            : window.innerWidth - pillRect.right;
        setPanelCoords({ top, whereLeft, whatRight });
    }, [activeSection]);

    const closeAll = useCallback(() => {
        setActiveSection(null);
        setCityFilter("");
        setCategoryFilter("");
    }, []);

    // Outside click — must also exclude the portaled panel divs
    const handleClickOutside = useCallback(
        (e: MouseEvent) => {
            const target = e.target as Node;
            if (
                !capsuleRef.current?.contains(target) &&
                !wherePanelRef.current?.contains(target) &&
                !whatPanelRef.current?.contains(target)
            ) {
                closeAll();
            }
        },
        [closeAll]
    );

    useEffect(() => {
        if (activeSection !== null) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }
    }, [activeSection, handleClickOutside]);

    // Escape key
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeAll(); };
        if (activeSection !== null) {
            document.addEventListener("keydown", onKey);
            return () => document.removeEventListener("keydown", onKey);
        }
    }, [activeSection, closeAll]);

    // Close panel on scroll (especially important for hero variant)
    useEffect(() => {
        if (activeSection !== null) {
            const onScroll = () => closeAll();
            window.addEventListener("scroll", onScroll, { passive: true });
            return () => window.removeEventListener("scroll", onScroll);
        }
    }, [activeSection, closeAll]);

    // Focus the right input when a section opens
    useEffect(() => {
        if (activeSection === "search") queryInputRef.current?.focus();
        if (activeSection === "where") cityFilterRef.current?.focus();
        if (activeSection === "what") categoryFilterRef.current?.focus();
    }, [activeSection]);

    // ── Static lists ──────────────────────────────────────────────────────────
    const CITIES = [
        { value: "all", label: t("search_bar.cities.all") },
        ...dynamicOptions.cities.map((c) => ({ value: c.slug, label: c.name })),
    ];
    const FALLBACK_CITIES = [
        { value: "all",        label: t("search_bar.cities.all")                                        },
        { value: "casablanca", label: t("search_bar.cities.casablanca", { defaultValue: "Casablanca" }) },
        { value: "marrakech",  label: t("search_bar.cities.marrakech",  { defaultValue: "Marrakech"  }) },
        { value: "rabat",      label: t("search_bar.cities.rabat",      { defaultValue: "Rabat"      }) },
        { value: "fes",        label: t("search_bar.cities.fes",        { defaultValue: "Fès"        }) },
        { value: "tanger",     label: t("search_bar.cities.tanger",     { defaultValue: "Tanger"     }) },
    ];
    const finalCities = CITIES.length > 1 ? CITIES : FALLBACK_CITIES;

    const CATEGORIES = [
        { value: "all", label: t("search_bar.categories.all") },
        ...dynamicOptions.categories.map((c) => ({ value: c.slug, label: c.name })),
    ];
    const FALLBACK_CATEGORIES = [
        { value: "all",         label: t("search_bar.categories.all")         },
        { value: "Salles",      label: t("search_bar.categories.salles")      },
        { value: "Catering",    label: t("search_bar.categories.catering")    },
        { value: "Negrafa",     label: t("search_bar.categories.negrafa")     },
        { value: "Photography", label: t("search_bar.categories.photography") },
    ];
    const finalCategories = CATEGORIES.length > 1 ? CATEGORIES : FALLBACK_CATEGORIES;

    const filteredCities = cityFilter.trim()
        ? finalCities.filter((c) => c.label.toLowerCase().includes(cityFilter.toLowerCase()))
        : finalCities;
    const filteredCategories = categoryFilter.trim()
        ? finalCategories.filter((c) => c.label.toLowerCase().includes(categoryFilter.toLowerCase()))
        : finalCategories;

    // ── Handlers ─────────────────────────────────────────────────────────────
    const buildParams = (overrides: { q?: string; city?: string; cat?: string }) => {
        const params = new URLSearchParams();
        const q   = "q"    in overrides ? overrides.q    : query;
        const c   = "city" in overrides ? overrides.city : city;
        const cat = "cat"  in overrides ? overrides.cat  : category;
        if (q?.trim())            params.set("q",           q.trim());
        if (c && c !== "all")     params.set("serviceArea", c);
        if (cat && cat !== "all") params.set("category",    cat);
        return params;
    };

    const handleSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        router.push(`/vendors?${buildParams({}).toString()}`);
        closeAll();
    };

    const handleCitySelect = (value: string) => {
        setCity(value);
        router.push(`/vendors?${buildParams({ city: value }).toString()}`);
        closeAll();
        setDrawerOpen(false);
    };

    const handleCategorySelect = (value: string) => {
        setCategory(value);
        router.push(`/vendors?${buildParams({ cat: value }).toString()}`);
        closeAll();
        setDrawerOpen(false);
    };

    const cityLabel = city && city !== "all"
        ? finalCities.find((c) => c.value.toLowerCase() === city.toLowerCase())?.label ?? null
        : null;
    const categoryLabel = category && category !== "all"
        ? finalCategories.find((c) => c.value.toLowerCase() === category.toLowerCase())?.label ?? null
        : null;

    // ── Shared pill state ─────────────────────────────────────────────────────
    const anyActive = activeSection !== null;
    const d1Hidden  = activeSection === "search" || activeSection === "where";
    const d2Hidden  = activeSection === "where"  || activeSection === "what";

    const sectionBg = (section: "search" | "where" | "what") => {
        if (activeSection === section) return "bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)]";
        if (anyActive)                 return "hover:bg-[#DEDEDE]";
        return variant === "hero" ? "hover:bg-white/50" : "hover:bg-[#F0F0F0]";
    };

    const pillHeight    = variant === "hero" ? "h-16"  : "h-14";
    const inputTextSize = variant === "hero" ? "text-[15px]" : "text-[14px]";
    const labelSize     = variant === "hero" ? "text-[11px]" : "text-[10px]";
    const valueSize     = variant === "hero" ? "text-[14px]" : "text-[13px]";

    // ── Pill JSX (shared) ────────────────────────────────────────────────────
    const pill = (
        <div className={cn(
            "flex items-center rounded-full p-1.5 transition-all duration-200",
            pillHeight,
            anyActive
                ? "bg-[#EBEBEB] shadow-[0_6px_20px_rgba(0,0,0,0.12)]"
                : variant === "hero"
                    ? "bg-white/80 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/90"
                    : "bg-white border border-[#DDDDDD] shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_14px_rgba(0,0,0,0.12)]"
        )}>
            {/* SEARCH section */}
            <div
                className={cn(
                    "flex items-center gap-2.5 flex-[2] h-full rounded-full px-4 cursor-text transition-all duration-150",
                    sectionBg("search")
                )}
                onClick={() => setActiveSection("search")}
            >
                <Search className={cn("text-[#717171] shrink-0", variant === "hero" ? "w-5 h-5" : "w-4 h-4")} />
                <input
                    ref={queryInputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => setActiveSection("search")}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={t("search_bar.placeholder")}
                    className={cn(
                        "flex-1 min-w-0 bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#717171]",
                        inputTextSize
                    )}
                />
                {query && (
                    <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); setQuery(""); queryInputRef.current?.focus(); }}
                        className="w-5 h-5 rounded-full bg-[#717171] hover:bg-[#1A1A1A] flex items-center justify-center shrink-0 transition-colors"
                        aria-label="Effacer"
                    >
                        <X className="w-2.5 h-2.5 text-white" />
                    </button>
                )}
            </div>

            <span aria-hidden className={cn("w-px h-5 shrink-0 bg-[#C8C8C8] transition-opacity duration-150 mx-0.5", d1Hidden && "opacity-0")} />

            {/* WHERE section */}
            <button
                ref={whereSectionRef}
                type="button"
                onClick={() => setActiveSection(activeSection === "where" ? null : "where")}
                className={cn(
                    "flex flex-col justify-center items-start flex-1 min-w-[120px] h-full rounded-full px-4 transition-all duration-150",
                    sectionBg("where")
                )}
            >
                <span className={cn("font-bold text-[#1A1A1A] tracking-widest uppercase leading-none", labelSize)}>
                    {t("search_bar.where")}
                </span>
                <span className={cn("mt-0.5 truncate w-full", valueSize, cityLabel ? "text-[#1A1A1A] font-medium" : "text-[#717171]")}>
                    {cityLabel ?? t("search_bar.anywhere")}
                </span>
            </button>

            <span aria-hidden className={cn("w-px h-5 shrink-0 bg-[#C8C8C8] transition-opacity duration-150 mx-0.5", d2Hidden && "opacity-0")} />

            {/* WHAT section */}
            <button
                ref={whatSectionRef}
                type="button"
                onClick={() => setActiveSection(activeSection === "what" ? null : "what")}
                className={cn(
                    "flex flex-col justify-center items-start flex-1 min-w-[120px] h-full rounded-full px-4 transition-all duration-150",
                    sectionBg("what")
                )}
            >
                <span className={cn("font-bold text-[#1A1A1A] tracking-widest uppercase leading-none", labelSize)}>
                    {t("search_bar.what")}
                </span>
                <span className={cn("mt-0.5 truncate w-full", valueSize, categoryLabel ? "text-[#1A1A1A] font-medium" : "text-[#717171]")}>
                    {categoryLabel ?? t("search_bar.any_category")}
                </span>
            </button>

            {/* Search button */}
            <button
                type="button"
                onClick={() => handleSearch()}
                aria-label={t("search_bar.cta")}
                className={cn(
                    "shrink-0 rounded-full flex items-center justify-center bg-[#E8472A] hover:bg-[#C43A20] active:scale-95 transition-all duration-200 ms-1.5",
                    anyActive
                        ? "h-[42px] px-4 gap-2"
                        : variant === "hero" ? "w-[46px] h-[46px]" : "w-[42px] h-[42px]"
                )}
            >
                <Search className="w-4 h-4 text-white shrink-0" />
                {anyActive && (
                    <span className="text-white text-[13px] font-semibold whitespace-nowrap">
                        {t("search_bar.cta")}
                    </span>
                )}
            </button>
        </div>
    );

    // ── Portaled dropdown panels ──────────────────────────────────────────────
    // Rendered at document.body so they escape every stacking context.
    const wherePanel = mounted && activeSection === "where" && createPortal(
        <div
            ref={wherePanelRef}
            style={{
                position: "fixed",
                top: panelCoords.top,
                left: panelCoords.whereLeft,
                zIndex: 9999,
                width: 360,
                maxWidth: "calc(100vw - 32px)",
            }}
            className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.14)] border border-[#EBEBEB] p-5 animate-in fade-in-0 slide-in-from-top-1 duration-150"
        >
            <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-3 py-2.5 mb-4">
                <Search className="w-3.5 h-3.5 text-[#717171] shrink-0" />
                <input
                    ref={cityFilterRef}
                    type="text"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    placeholder={t("search_bar.city_label")}
                    className="text-[13px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#B0B0B0] flex-1"
                />
                {cityFilter && (
                    <button type="button" onClick={() => setCityFilter("")}
                        className="w-4 h-4 rounded-full bg-[#B0B0B0] hover:bg-[#717171] flex items-center justify-center transition-colors">
                        <X className="w-2.5 h-2.5 text-white" />
                    </button>
                )}
            </div>
            {filteredCities.length > 0 ? (
                <div className="overflow-y-auto max-h-[220px] pr-0.5">
                    <div className="grid grid-cols-2 gap-2">
                        {filteredCities.map((c) => (
                            <button key={c.value} type="button" onClick={() => handleCitySelect(c.value)}
                                className={cn(
                                    "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-start transition-all duration-100",
                                    city.toLowerCase() === c.value.toLowerCase()
                                        ? "bg-[#FEF0ED] border-[#E8472A] text-[#E8472A]"
                                        : "border-[#EBEBEB] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F7F7F7]"
                                )}>
                                <MapPin className="w-3.5 h-3.5 shrink-0 opacity-50" />
                                <span className="text-[13px] font-medium truncate">{c.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-center text-[13px] text-[#717171] py-3">
                    {t("search_bar.no_results", { defaultValue: "Aucun résultat" })}
                </p>
            )}
            {cityLabel && (
                <button type="button" onClick={() => handleCitySelect("all")}
                    className="mt-3 w-full text-center text-[12px] text-[#717171] hover:text-[#1A1A1A] underline underline-offset-2 transition-colors">
                    {t("filters.clear")}
                </button>
            )}
        </div>,
        document.body
    );

    const whatPanel = mounted && activeSection === "what" && createPortal(
        <div
            ref={whatPanelRef}
            style={{
                position: "fixed",
                top: panelCoords.top,
                right: panelCoords.whatRight,
                zIndex: 9999,
                width: 440,
                maxWidth: "calc(100vw - 32px)",
            }}
            className="bg-white rounded-3xl shadow-[0_8px_28px_rgba(0,0,0,0.14)] border border-[#EBEBEB] p-5 animate-in fade-in-0 slide-in-from-top-1 duration-150"
        >
            <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-3 py-2.5 mb-4">
                <Search className="w-3.5 h-3.5 text-[#717171] shrink-0" />
                <input
                    ref={categoryFilterRef}
                    type="text"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    placeholder={t("search_bar.cat_label")}
                    className="text-[13px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#B0B0B0] flex-1"
                />
                {categoryFilter && (
                    <button type="button" onClick={() => setCategoryFilter("")}
                        className="w-4 h-4 rounded-full bg-[#B0B0B0] hover:bg-[#717171] flex items-center justify-center transition-colors">
                        <X className="w-2.5 h-2.5 text-white" />
                    </button>
                )}
            </div>
            {filteredCategories.length > 0 ? (
                <div className="overflow-y-auto max-h-[260px] pr-0.5">
                    <div className="grid grid-cols-3 gap-2">
                        {filteredCategories.map((c) => {
                            const CatIcon = CATEGORY_ICON_MAP[c.value] ?? LayoutGrid;
                            return (
                                <button key={c.value} type="button" onClick={() => handleCategorySelect(c.value)}
                                    className={cn(
                                        "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-100",
                                        category.toLowerCase() === c.value.toLowerCase()
                                            ? "bg-[#FEF0ED] border-[#E8472A] text-[#E8472A]"
                                            : "border-[#EBEBEB] text-[#1A1A1A] hover:border-[#1A1A1A] hover:bg-[#F7F7F7]"
                                    )}>
                                    <CatIcon className="w-5 h-5" strokeWidth={1.5} />
                                    <span className="text-[11px] font-medium leading-tight text-center">{c.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <p className="text-center text-[13px] text-[#717171] py-3">
                    {t("search_bar.no_results", { defaultValue: "Aucun résultat" })}
                </p>
            )}
            {categoryLabel && (
                <button type="button" onClick={() => handleCategorySelect("all")}
                    className="mt-3 w-full text-center text-[12px] text-[#717171] hover:text-[#1A1A1A] underline underline-offset-2 transition-colors">
                    {t("filters.clear")}
                </button>
            )}
        </div>,
        document.body
    );

    // ── Hero variant ─────────────────────────────────────────────────────────
    if (variant === "hero") {
        return (
            <div ref={capsuleRef} className="relative w-full max-w-3xl mx-auto">
                {/* Desktop pill */}
                <div className="hidden sm:block">
                    {pill}
                </div>

                {/* Portaled panels — rendered at document.body */}
                {wherePanel}
                {whatPanel}

                {/* Mobile: compact Airbnb-style capsule */}
                <button
                    type="button"
                    onClick={() => setDrawerOpen(true)}
                    aria-label={t("search_bar.expand_search")}
                    className="sm:hidden flex items-center gap-3 w-full bg-white/80 backdrop-blur-md border border-white/50 rounded-full h-14 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:bg-white/90 transition-all duration-200"
                >
                    <span className="w-9 h-9 rounded-full bg-[#E8472A] flex items-center justify-center shrink-0 shadow-sm">
                        <Search className="w-4 h-4 text-white" />
                    </span>
                    <div className="flex flex-col flex-1 min-w-0 text-start">
                        <span className="text-[14px] font-semibold text-[#1A1A1A] truncate leading-none">
                            {query || t("search_bar.placeholder")}
                        </span>
                        <span className="text-[12px] text-[#717171] truncate leading-none mt-1">
                            {[cityLabel, categoryLabel].filter(Boolean).join(" · ") || t("search_bar.anywhere")}
                        </span>
                    </div>
                </button>

                {/* Mobile: bottom drawer (shared with page variant) */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerContent className="px-0 pb-0 max-h-[90vh]">
                        <DrawerHeader className="px-5 pt-4 pb-3 border-b border-[#EBEBEB] text-start">
                            <DrawerTitle className="text-[17px] font-semibold text-[#1A1A1A] font-sans">
                                {t("search_bar.expand_search")}
                            </DrawerTitle>
                        </DrawerHeader>

                        <div className="overflow-y-auto">
                            {/* Text search */}
                            <div className="px-5 py-4 border-b border-[#EBEBEB]">
                                <p className="text-[10px] font-bold text-[#717171] tracking-widest uppercase mb-2">
                                    {t("search_bar.cta")}
                                </p>
                                <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-4 py-3">
                                    <Search className="w-4 h-4 text-[#717171] shrink-0" />
                                    <input
                                        type="text"
                                        value={query}
                                        onChange={(e) => setQuery(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                        placeholder={t("search_bar.placeholder")}
                                        className="flex-1 text-[14px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                                    />
                                    {query && (
                                        <button type="button" onClick={() => setQuery("")}
                                            className="w-5 h-5 rounded-full bg-[#B0B0B0] hover:bg-[#717171] flex items-center justify-center shrink-0 transition-colors">
                                            <X className="w-3 h-3 text-white" />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* City picker */}
                            <div className="px-5 py-4 border-b border-[#EBEBEB]">
                                <p className="text-[10px] font-bold text-[#717171] tracking-widest uppercase mb-2">
                                    {t("search_bar.where")}
                                </p>
                                <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-3 py-2.5 mb-3">
                                    <Search className="w-3.5 h-3.5 text-[#717171] shrink-0" />
                                    <input
                                        type="text"
                                        value={cityFilter}
                                        onChange={(e) => setCityFilter(e.target.value)}
                                        placeholder={t("search_bar.city_label")}
                                        className="flex-1 text-[13px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {(cityFilter.trim()
                                        ? finalCities.filter((c) => c.label.toLowerCase().includes(cityFilter.toLowerCase()))
                                        : finalCities
                                    ).map((c) => (
                                        <button key={c.value} type="button" onClick={() => handleCitySelect(c.value)}
                                            className={cn(
                                                "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-start transition-all",
                                                city.toLowerCase() === c.value.toLowerCase()
                                                    ? "bg-[#FEF0ED] border-[#E8472A] text-[#E8472A]"
                                                    : "border-[#EBEBEB] text-[#1A1A1A] hover:border-[#1A1A1A]"
                                            )}>
                                            <MapPin className="w-3.5 h-3.5 shrink-0 opacity-50" />
                                            <span className="text-[13px] font-medium truncate">{c.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category picker */}
                            <div className="px-5 py-4">
                                <p className="text-[10px] font-bold text-[#717171] tracking-widest uppercase mb-2">
                                    {t("search_bar.what")}
                                </p>
                                <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-3 py-2.5 mb-3">
                                    <Search className="w-3.5 h-3.5 text-[#717171] shrink-0" />
                                    <input
                                        type="text"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                        placeholder={t("search_bar.cat_label")}
                                        className="flex-1 text-[13px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {(categoryFilter.trim()
                                        ? finalCategories.filter((c) => c.label.toLowerCase().includes(categoryFilter.toLowerCase()))
                                        : finalCategories
                                    ).map((c) => {
                                        const CatIcon = CATEGORY_ICON_MAP[c.value] ?? LayoutGrid;
                                        return (
                                            <button key={c.value} type="button" onClick={() => handleCategorySelect(c.value)}
                                                className={cn(
                                                    "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                                                    category.toLowerCase() === c.value.toLowerCase()
                                                        ? "bg-[#FEF0ED] border-[#E8472A] text-[#E8472A]"
                                                        : "border-[#EBEBEB] text-[#1A1A1A] hover:border-[#1A1A1A]"
                                                )}>
                                                <CatIcon className="w-5 h-5" strokeWidth={1.5} />
                                                <span className="text-[11px] font-medium leading-tight text-center">{c.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        <DrawerFooter className="px-5 pt-3 pb-5 border-t border-[#EBEBEB]">
                            <button type="button"
                                onClick={() => { handleSearch(); setDrawerOpen(false); }}
                                className="w-full bg-[#E8472A] hover:bg-[#C43A20] text-white rounded-full h-12 text-[15px] font-semibold transition-colors flex items-center justify-center gap-2">
                                <Search className="w-4 h-4" />
                                {t("search_bar.cta")}
                            </button>
                        </DrawerFooter>
                    </DrawerContent>
                </Drawer>
            </div>
        );
    }

    // ── Page variant ─────────────────────────────────────────────────────────
    return (
        <div ref={capsuleRef} className="relative w-full max-w-3xl mx-auto">

            {/* Desktop pill */}
            <div className="hidden sm:block">
                {pill}
            </div>

            {/* Portaled panels — rendered at document.body */}
            {wherePanel}
            {whatPanel}

            {/* Mobile: summary pill */}
            <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                aria-label={t("search_bar.expand_search")}
                className="sm:hidden flex items-center gap-3 w-full bg-white border border-[#DDDDDD] rounded-full h-[52px] px-4 shadow-[0_2px_10px_rgba(0,0,0,0.08)] hover:shadow-[0_2px_14px_rgba(0,0,0,0.12)] transition-shadow duration-200"
            >
                <span className="w-8 h-8 rounded-full bg-[#E8472A] flex items-center justify-center shrink-0">
                    <Search className="w-3.5 h-3.5 text-white" />
                </span>
                <div className="flex flex-col flex-1 min-w-0 text-start">
                    <span className="text-[13px] font-semibold text-[#1A1A1A] truncate leading-none">
                        {query || t("search_bar.placeholder")}
                    </span>
                    <span className="text-[11px] text-[#717171] truncate leading-none mt-0.5">
                        {[cityLabel, categoryLabel].filter(Boolean).join(" · ") || t("search_bar.anywhere")}
                    </span>
                </div>
            </button>

            {/* Mobile: bottom drawer */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                <DrawerContent className="px-0 pb-0 max-h-[90vh]">
                    <DrawerHeader className="px-5 pt-4 pb-3 border-b border-[#EBEBEB] text-start">
                        <DrawerTitle className="text-[17px] font-semibold text-[#1A1A1A] font-sans">
                            {t("search_bar.expand_search")}
                        </DrawerTitle>
                    </DrawerHeader>

                    <div className="overflow-y-auto">
                        {/* Text search */}
                        <div className="px-5 py-4 border-b border-[#EBEBEB]">
                            <p className="text-[10px] font-bold text-[#717171] tracking-widest uppercase mb-2">
                                {t("search_bar.cta")}
                            </p>
                            <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-4 py-3">
                                <Search className="w-4 h-4 text-[#717171] shrink-0" />
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                    placeholder={t("search_bar.placeholder")}
                                    className="flex-1 text-[14px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                                />
                                {query && (
                                    <button type="button" onClick={() => setQuery("")}
                                        className="w-5 h-5 rounded-full bg-[#B0B0B0] hover:bg-[#717171] flex items-center justify-center shrink-0 transition-colors">
                                        <X className="w-3 h-3 text-white" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* City picker */}
                        <div className="px-5 py-4 border-b border-[#EBEBEB]">
                            <p className="text-[10px] font-bold text-[#717171] tracking-widest uppercase mb-2">
                                {t("search_bar.where")}
                            </p>
                            <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-3 py-2.5 mb-3">
                                <Search className="w-3.5 h-3.5 text-[#717171] shrink-0" />
                                <input
                                    type="text"
                                    value={cityFilter}
                                    onChange={(e) => setCityFilter(e.target.value)}
                                    placeholder={t("search_bar.city_label")}
                                    className="flex-1 text-[13px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                {(cityFilter.trim()
                                    ? finalCities.filter((c) => c.label.toLowerCase().includes(cityFilter.toLowerCase()))
                                    : finalCities
                                ).map((c) => (
                                    <button key={c.value} type="button" onClick={() => handleCitySelect(c.value)}
                                        className={cn(
                                            "flex items-center gap-2 px-3 py-2.5 rounded-xl border text-start transition-all",
                                            city.toLowerCase() === c.value.toLowerCase()
                                                ? "bg-[#FEF0ED] border-[#E8472A] text-[#E8472A]"
                                                : "border-[#EBEBEB] text-[#1A1A1A] hover:border-[#1A1A1A]"
                                        )}>
                                        <MapPin className="w-3.5 h-3.5 shrink-0 opacity-50" />
                                        <span className="text-[13px] font-medium truncate">{c.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category picker */}
                        <div className="px-5 py-4">
                            <p className="text-[10px] font-bold text-[#717171] tracking-widest uppercase mb-2">
                                {t("search_bar.what")}
                            </p>
                            <div className="flex items-center gap-2 bg-[#F7F7F7] rounded-xl px-3 py-2.5 mb-3">
                                <Search className="w-3.5 h-3.5 text-[#717171] shrink-0" />
                                <input
                                    type="text"
                                    value={categoryFilter}
                                    onChange={(e) => setCategoryFilter(e.target.value)}
                                    placeholder={t("search_bar.cat_label")}
                                    className="flex-1 text-[13px] bg-transparent border-0 outline-none focus:outline-none focus:ring-0 text-[#1A1A1A] placeholder:text-[#B0B0B0]"
                                />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                                {(categoryFilter.trim()
                                    ? finalCategories.filter((c) => c.label.toLowerCase().includes(categoryFilter.toLowerCase()))
                                    : finalCategories
                                ).map((c) => {
                                    const CatIcon = CATEGORY_ICON_MAP[c.value] ?? LayoutGrid;
                                    return (
                                        <button key={c.value} type="button" onClick={() => handleCategorySelect(c.value)}
                                            className={cn(
                                                "flex flex-col items-center gap-1.5 p-3 rounded-xl border transition-all",
                                                category.toLowerCase() === c.value.toLowerCase()
                                                    ? "bg-[#FEF0ED] border-[#E8472A] text-[#E8472A]"
                                                    : "border-[#EBEBEB] text-[#1A1A1A] hover:border-[#1A1A1A]"
                                            )}>
                                            <CatIcon className="w-5 h-5" strokeWidth={1.5} />
                                            <span className="text-[11px] font-medium leading-tight text-center">{c.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    <DrawerFooter className="px-5 pt-3 pb-5 border-t border-[#EBEBEB]">
                        <button type="button"
                            onClick={() => { handleSearch(); setDrawerOpen(false); }}
                            className="w-full bg-[#E8472A] hover:bg-[#C43A20] text-white rounded-full h-12 text-[15px] font-semibold transition-colors flex items-center justify-center gap-2">
                            <Search className="w-4 h-4" />
                            {t("search_bar.cta")}
                        </button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>

        </div>
    );
}
