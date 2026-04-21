import { useState, useEffect } from "react";
import { Article } from "@/types/magazine";

/** Moroccan wedding planning horizons in months */
const PLANNING_PHASES: Array<{
    maxMonths: number;
    label: string;
    badge: string;
    tags: string[];
}> = [
    { maxMonths: 3,  label: "Il vous reste 3 mois",  badge: "Urgent",       tags: ["planning", "dress", "rings", "invitations"] },
    { maxMonths: 6,  label: "Il vous reste 6 mois",  badge: "Prioritaire",  tags: ["catering", "traiteur", "negafa", "flowers"] },
    { maxMonths: 9,  label: "Il vous reste 9 mois",  badge: "En avance",    tags: ["venue", "salles", "honeymoon", "music"] },
    { maxMonths: 18, label: "Plus d'un an",           badge: "Exploration",  tags: ["traditions", "budget", "inspiration"] },
];

/** Reads the wedding date from localStorage — ONLY safe to call client-side */
function getWeddingDate(): Date | null {
    try {
        const raw = localStorage.getItem("farah_wedding_date");
        if (!raw) return null;
        const date = new Date(raw);
        return isNaN(date.getTime()) ? null : date;
    } catch {
        return null;
    }
}

/** Returns months remaining until the wedding date */
function monthsUntil(weddingDate: Date): number {
    const now = new Date();
    const diff =
        (weddingDate.getFullYear() - now.getFullYear()) * 12 +
        (weddingDate.getMonth() - now.getMonth());
    return Math.max(0, diff);
}

function computeTimeline(allArticles: Article[]): PlanningTimeline | null {
    const weddingDate = getWeddingDate();
    if (!weddingDate) return null;

    const months = monthsUntil(weddingDate);
    const phase =
        PLANNING_PHASES.find((p) => months <= p.maxMonths) ??
        PLANNING_PHASES[PLANNING_PHASES.length - 1];

    const relevant = allArticles
        .filter((a) =>
            (a.tags ?? []).some((tag) =>
                phase.tags.some((pt) => tag.toLowerCase().includes(pt))
            )
        )
        .slice(0, 3);

    return {
        monthsLeft: months,
        label: phase.label,
        badge: phase.badge,
        relevantArticles: relevant,
    };
}

export interface PlanningTimeline {
    monthsLeft: number;
    label: string;
    badge: string;
    relevantArticles: Article[];
}

/**
 * Returns null on SSR and on the initial client render (matching server HTML),
 * then resolves to the real planning timeline after hydration via useEffect.
 * This pattern prevents React hydration mismatches caused by localStorage access.
 */
export function usePlanningTimeline(allArticles: Article[]): PlanningTimeline | null {
    const [timeline, setTimeline] = useState<PlanningTimeline | null>(null);

    useEffect(() => {
        setTimeline(computeTimeline(allArticles));
    }, [allArticles]);

    return timeline;
}
