import { useState, useCallback, useEffect } from "react";

export type ReactionType = "love" | "useful" | "wow";

export interface ReactionCounts {
    love: number;
    useful: number;
    wow: number;
}

const STORAGE_KEY = "farah_article_reactions";

interface StoredReactions {
    [articleId: number]: ReactionType | null;
}

/** Simulated base counts so articles don't start at zero */
const BASE_COUNTS: ReactionCounts = { love: 0, useful: 0, wow: 0 };

/** Optimistic mock popularity seeds per reaction so the UI never feels empty */
const SEED_COUNTS: Record<ReactionType, number> = {
    love: 214,
    useful: 87,
    wow: 43,
};

export function useArticleReactions(articleId: number) {
    const [userReaction, setUserReaction] = useState<ReactionType | null>(null);
    const [counts, setCounts] = useState<ReactionCounts>({
        love: SEED_COUNTS.love,
        useful: SEED_COUNTS.useful,
        wow: SEED_COUNTS.wow,
    });

    // Hydrate from localStorage
    useEffect(() => {
        try {
            const stored: StoredReactions = JSON.parse(
                localStorage.getItem(STORAGE_KEY) ?? "{}"
            );
            const reaction = stored[articleId] ?? null;
            setUserReaction(reaction);
            // Apply delta to counts
            if (reaction) {
                setCounts((prev) => ({
                    ...prev,
                    [reaction]: prev[reaction] + 1,
                }));
            }
        } catch {
            // ignore
        }
    }, [articleId]);

    const react = useCallback(
        (type: ReactionType) => {
            try {
                const stored: StoredReactions = JSON.parse(
                    localStorage.getItem(STORAGE_KEY) ?? "{}"
                );
                const previous = stored[articleId] ?? null;

                // Toggle off if same reaction
                if (previous === type) {
                    stored[articleId] = null;
                    setUserReaction(null);
                    setCounts((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));
                } else {
                    // Remove previous reaction from count
                    if (previous) {
                        setCounts((prev) => ({
                            ...prev,
                            [previous]: Math.max(0, prev[previous] - 1),
                        }));
                    }
                    stored[articleId] = type;
                    setUserReaction(type);
                    setCounts((prev) => ({ ...prev, [type]: prev[type] + 1 }));
                }

                localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
            } catch {
                // ignore
            }
        },
        [articleId]
    );

    return { userReaction, counts, react };
}
