import { useMemo } from "react";
import { useBookmarks } from "@/hooks/useBookmarks";
import { Article } from "@/types/magazine";

/**
 * Scores articles by tag overlap with bookmarked articles.
 * Returns top N articles sorted by relevance, excluding already-bookmarked ones.
 */
export function usePersonalizedFeed(allArticles: Article[], topN = 6): Article[] {
    const { bookmarks } = useBookmarks();

    return useMemo(() => {
        if (bookmarks.length === 0) return [];

        // Build a frequency map: tag → how many times the user has bookmarked it
        const tagFrequency: Record<string, number> = {};
        const bookmarkedArticles = allArticles.filter((a) => bookmarks.includes(a.id));

        for (const article of bookmarkedArticles) {
            for (const tag of article.tags ?? []) {
                tagFrequency[tag] = (tagFrequency[tag] ?? 0) + 1;
            }
        }

        // Score non-bookmarked articles by overlapping tags
        const candidates = allArticles.filter((a) => !bookmarks.includes(a.id));

        const scored = candidates.map((article) => {
            const score = (article.tags ?? []).reduce((acc, tag) => {
                return acc + (tagFrequency[tag] ?? 0);
            }, 0);
            return { article, score };
        });

        return scored
            .filter((s) => s.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, topN)
            .map((s) => s.article);
    }, [bookmarks, allArticles, topN]);
}
