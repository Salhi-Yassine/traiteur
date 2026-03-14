"use client";
import { useState } from "react";
import { useRouter } from "next/router";

const CATEGORIES = [
    { value: "", label: "Toutes les catégories" },
    { value: "Salles", label: "Salles de Fête" },
    { value: "Catering", label: "Traiteurs" },
    { value: "Negrafa", label: "Négafas" },
    { value: "Photography", label: "Photographes" },
    { value: "Music", label: "Orchestres & DJs" },
    { value: "Decoration", label: "Décoration" },
];

interface SearchBarProps {
    initialLocation?: string;
    initialCategory?: string;
    variant?: "hero" | "page";
}

export default function SearchBar({
    initialLocation = "",
    initialCategory = "",
    variant = "hero",
}: SearchBarProps) {
    const router = useRouter();
    const [location, setLocation] = useState(initialLocation);
    const [category, setCategory] = useState(initialCategory);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (location.trim()) params.set("serviceArea", location.trim());
        if (category) params.set("category", category);
        router.push(`/vendors?${params.toString()}`);
    };

    if (variant === "hero") {
        return (
            <form
                onSubmit={handleSearch}
                className="w-full max-w-4xl bg-white/10 backdrop-blur-2xl rounded-[2.5rem] p-3 flex flex-col sm:flex-row gap-3 shadow-premium border border-white/10"
                role="search"
                aria-label="Rechercher des prestataires"
            >
                {/* Location input */}
                <div className="flex-[1.2] flex items-center gap-4 px-6 py-4 rounded-[2rem] bg-white/5 hover:bg-white/10 transition-all group">
                    <svg className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div className="flex flex-col flex-1">
                        <label htmlFor="location-input" className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Où ?</label>
                        <input
                            type="text"
                            id="location-input"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="Ville ou région"
                            className="bg-transparent text-white placeholder:text-white/30 text-base font-bold outline-none"
                        />
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-white/10 self-stretch my-4" />

                {/* Category select */}
                <div className="flex-1 flex items-center gap-4 px-6 py-4 rounded-[2rem] bg-white/5 hover:bg-white/10 transition-all group">
                    <svg className="w-5 h-5 text-secondary shrink-0 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <div className="flex flex-col flex-1">
                        <label htmlFor="category-select" className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-0.5">Quoi ?</label>
                        <select
                            id="category-select"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="bg-transparent text-white text-base font-bold outline-none cursor-pointer pr-8 appearance-none"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat.value} value={cat.value} className="bg-primary text-white">
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-secondary text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-secondary/90 transition-all shadow-gold hover:-translate-y-0.5 active:scale-95 shrink-0"
                >
                    Explorer
                </button>
            </form>
        );
    }

    // Page variant (compact premium bar)
    return (
        <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-4 w-full"
            role="search"
        >
            <div className="flex-1 flex items-center gap-3 bg-white border border-border rounded-2xl px-6 py-4 shadow-sm focus-within:ring-2 focus-within:ring-secondary/20 transition-all">
                <svg className="w-5 h-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ville ou nom du prestataire..."
                    className="flex-1 bg-transparent text-sm font-medium outline-none text-primary placeholder:text-muted-foreground"
                />
            </div>
            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-white border border-border rounded-2xl px-6 py-4 text-sm text-primary outline-none font-bold shadow-sm cursor-pointer hover:border-secondary/30 transition-all"
            >
                {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
            </select>
            <button
                type="submit"
                className="bg-primary text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary/95 transition-all shadow-premium"
            >
                Filtrer
            </button>
        </form>
    );
}
