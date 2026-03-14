"use client";
import { useState } from "react";
import { useRouter } from "next/router";

const EVENT_TYPES = [
    "All Events",
    "Wedding",
    "Corporate",
    "Birthday",
    "Anniversary",
    "Graduation",
];

interface SearchBarProps {
    initialLocation?: string;
    initialEventType?: string;
    variant?: "hero" | "page";
}

export default function SearchBar({
    initialLocation = "",
    initialEventType = "",
    variant = "hero",
}: SearchBarProps) {
    const router = useRouter();
    const [location, setLocation] = useState(initialLocation);
    const [eventType, setEventType] = useState(initialEventType);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (location.trim()) params.set("serviceArea", location.trim());
        if (eventType && eventType !== "All Events") params.set("eventType", eventType);
        router.push(`/caterers?${params.toString()}`);
    };

    if (variant === "hero") {
        return (
            <form
                onSubmit={handleSearch}
                className="w-full max-w-2xl bg-white rounded-2xl shadow-[var(--shadow-card-hover)] p-2 flex flex-col sm:flex-row gap-2"
                role="search"
                aria-label="Search caterers"
            >
                {/* Location input */}
                <div className="flex-1 flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[var(--color-sand-50)] transition-colors">
                    <svg className="w-4 h-4 text-[var(--color-teal-600)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input
                        type="text"
                        id="location-input"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="City or region (e.g. Alger)"
                        className="flex-1 bg-transparent text-[var(--color-charcoal-900)] placeholder:text-[var(--color-charcoal-300)] text-sm outline-none"
                    />
                </div>

                {/* Divider */}
                <div className="hidden sm:block w-px bg-[var(--color-sand-200)] self-stretch my-1" />

                {/* Event type */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-[var(--color-sand-50)] transition-colors">
                    <svg className="w-4 h-4 text-[var(--color-teal-600)] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <select
                        id="event-type-select"
                        value={eventType}
                        onChange={(e) => setEventType(e.target.value)}
                        className="bg-transparent text-sm text-[var(--color-charcoal-700)] outline-none cursor-pointer pr-2"
                    >
                        {EVENT_TYPES.map((t) => (
                            <option key={t} value={t === "All Events" ? "" : t}>
                                {t}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="bg-[var(--color-teal-700)] text-white px-7 py-3 rounded-xl font-semibold text-sm hover:bg-[var(--color-teal-800)] transition-colors shrink-0"
                >
                    Search
                </button>
            </form>
        );
    }

    // Page variant (compact horizontal bar)
    return (
        <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-3 w-full"
            role="search"
        >
            <div className="flex-1 flex items-center gap-2 bg-white border border-[var(--color-sand-200)] rounded-xl px-4 py-3">
                <svg className="w-4 h-4 text-[var(--color-charcoal-400)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Search by city or caterer name…"
                    className="flex-1 bg-transparent text-sm outline-none text-[var(--color-charcoal-900)] placeholder:text-[var(--color-charcoal-300)]"
                />
            </div>
            <select
                value={eventType}
                onChange={(e) => setEventType(e.target.value)}
                className="bg-white border border-[var(--color-sand-200)] rounded-xl px-4 py-3 text-sm text-[var(--color-charcoal-700)] outline-none"
            >
                {EVENT_TYPES.map((t) => (
                    <option key={t} value={t === "All Events" ? "" : t}>{t}</option>
                ))}
            </select>
            <button
                type="submit"
                className="bg-[var(--color-teal-700)] text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-[var(--color-teal-800)] transition-colors"
            >
                Search
            </button>
        </form>
    );
}
