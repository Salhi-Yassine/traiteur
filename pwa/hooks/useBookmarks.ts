import { useState, useEffect, useCallback } from "react";

const STORAGE_KEY = "farah_magazine_bookmarks";

export function useBookmarks() {
    const [bookmarks, setBookmarks] = useState<number[]>([]);

    // Hydrate from localStorage on mount (client-side only)
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                setBookmarks(JSON.parse(stored));
            }
        } catch {
            // localStorage may not be available (SSR or private mode)
        }
    }, []);

    const persist = useCallback((ids: number[]) => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
        } catch {
            // ignore
        }
    }, []);

    const addBookmark = useCallback((id: number) => {
        setBookmarks((prev) => {
            if (prev.includes(id)) return prev;
            const next = [...prev, id];
            persist(next);
            return next;
        });
    }, [persist]);

    const removeBookmark = useCallback((id: number) => {
        setBookmarks((prev) => {
            const next = prev.filter((b) => b !== id);
            persist(next);
            return next;
        });
    }, [persist]);

    const toggleBookmark = useCallback((id: number) => {
        setBookmarks((prev) => {
            const exists = prev.includes(id);
            const next = exists ? prev.filter((b) => b !== id) : [...prev, id];
            persist(next);
            return next;
        });
    }, [persist]);

    const isBookmarked = useCallback((id: number) => bookmarks.includes(id), [bookmarks]);

    return { bookmarks, addBookmark, removeBookmark, toggleBookmark, isBookmarked };
}
