import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { ReactNode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { NextRouter } from "next/router";
import { AuthProvider } from "@/context/AuthContext";
import { useSavedVendors } from "@/lib/useSavedVendors";

// ── Fixtures ──────────────────────────────────────────────────────────────────

const ME = {
    id: "1",
    email: "couple@example.com",
    firstName: "Amina",
    lastName: "B",
    userType: "couple",
    weddingProfile: { id: 1 },
    vendorProfile: null,
};

const SAVED_ENTRY = {
    "@id": "/api/saved_vendors/10",
    "@type": "SavedVendor",
    id: 10,
    vendorProfile: { id: 42, businessName: "Festin Royal", slug: "festin-royal" },
    createdAt: "2026-07-22T10:00:00+00:00",
};

function jsonResponse(status: number, body: unknown) {
    return {
        ok: status < 400,
        status,
        json: () => Promise.resolve(body),
    };
}

interface FetchStub {
    calls: { method: string; url: string }[];
    /** Settle the pending POST /api/saved_vendors with the given status */
    resolvePost: (status: number) => void;
    /** Settle the pending DELETE with a 204 */
    resolveDelete: () => void;
}

/**
 * fetch stub routing on method + path. Mutating requests (POST/DELETE) stay
 * pending until resolved from the test, so optimistic cache state can be
 * asserted deterministically before the server "responds".
 */
function stubFetch(options: { saved: unknown[] }): FetchStub {
    const calls: { method: string; url: string }[] = [];
    let postResolve: ((r: unknown) => void) | null = null;
    let deleteResolve: ((r: unknown) => void) | null = null;

    const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        const method = init?.method ?? "GET";
        calls.push({ method, url });

        if (url.endsWith("/api/me")) {
            return Promise.resolve(jsonResponse(200, ME));
        }
        if (url.endsWith("/api/saved_vendors") && method === "GET") {
            return Promise.resolve(jsonResponse(200, { member: options.saved }));
        }
        if (url.endsWith("/api/saved_vendors") && method === "POST") {
            return new Promise((resolve) => {
                postResolve = resolve;
            });
        }
        if (method === "DELETE") {
            return new Promise((resolve) => {
                deleteResolve = resolve;
            });
        }
        return Promise.resolve(jsonResponse(404, {}));
    });
    vi.stubGlobal("fetch", fetchMock);

    return {
        calls,
        resolvePost: (status: number) =>
            postResolve?.(
                jsonResponse(
                    status,
                    status < 400 ? SAVED_ENTRY : { detail: "already saved" },
                ),
            ),
        resolveDelete: () =>
            deleteResolve?.({ ok: true, status: 204, json: () => Promise.resolve(null) }),
    };
}

// ── Wrapper ───────────────────────────────────────────────────────────────────

const routerPush = vi.fn();

const mockRouter = {
    push: routerPush,
    locale: "fr",
    events: { on: vi.fn(), off: vi.fn(), emit: vi.fn() },
    pathname: "/",
    route: "/",
    asPath: "/",
    query: {},
    replace: vi.fn(),
    prefetch: vi.fn().mockResolvedValue(undefined),
    back: vi.fn(),
    reload: vi.fn(),
} as unknown as NextRouter;

function createWrapper() {
    const queryClient = new QueryClient({
        defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
    });
    return function Wrapper({ children }: { children: ReactNode }) {
        return (
            <RouterContext.Provider value={mockRouter}>
                <AuthProvider>
                    <QueryClientProvider client={queryClient}>
                        {children}
                    </QueryClientProvider>
                </AuthProvider>
            </RouterContext.Provider>
        );
    };
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe("useSavedVendors", () => {
    beforeEach(() => {
        localStorage.clear();
        routerPush.mockClear();
    });

    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it("redirects logged-out users to login on toggleSave without calling the API", () => {
        const { calls } = stubFetch({ saved: [] });
        const { result } = renderHook(() => useSavedVendors(), {
            wrapper: createWrapper(),
        });

        act(() => result.current.toggleSave(42));

        expect(routerPush).toHaveBeenCalledWith("/auth/login");
        expect(calls.filter((c) => c.method === "POST")).toHaveLength(0);
    });

    it("reports saved state from the fetched collection", async () => {
        stubFetch({ saved: [SAVED_ENTRY] });
        localStorage.setItem("token", "jwt");

        const { result } = renderHook(() => useSavedVendors(), {
            wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSaved(42)).toBe(true));
        expect(result.current.isSaved(7)).toBe(false);
        expect(result.current.savedVendors).toHaveLength(1);
    });

    /** The saved_vendors GET only fires once /api/me resolved and the query is enabled */
    async function waitForCollectionFetch(stub: FetchStub) {
        await waitFor(() =>
            expect(
                stub.calls.filter(
                    (c) => c.method === "GET" && c.url.endsWith("/api/saved_vendors"),
                ).length,
            ).toBeGreaterThan(0),
        );
    }

    it("optimistically saves, then persists via POST", async () => {
        const stub = stubFetch({ saved: [] });
        localStorage.setItem("token", "jwt");

        const { result } = renderHook(() => useSavedVendors(), {
            wrapper: createWrapper(),
        });
        await waitForCollectionFetch(stub);
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => result.current.toggleSave(42));

        // Optimistic: saved while the POST is still pending
        await waitFor(() => expect(result.current.isSaved(42)).toBe(true));
        expect(
            stub.calls.filter(
                (c) => c.method === "POST" && c.url.endsWith("/api/saved_vendors"),
            ),
        ).toHaveLength(1);

        act(() => stub.resolvePost(201));
    });

    it("unsaves an already-saved vendor via DELETE", async () => {
        const stub = stubFetch({ saved: [SAVED_ENTRY] });
        localStorage.setItem("token", "jwt");

        const { result } = renderHook(() => useSavedVendors(), {
            wrapper: createWrapper(),
        });
        await waitFor(() => expect(result.current.isSaved(42)).toBe(true));

        act(() => result.current.toggleSave(42));

        // Optimistic removal while the DELETE is still pending
        await waitFor(() => expect(result.current.isSaved(42)).toBe(false));
        expect(
            stub.calls.filter(
                (c) =>
                    c.method === "DELETE" && c.url.endsWith("/api/saved_vendors/10"),
            ),
        ).toHaveLength(1);

        act(() => stub.resolveDelete());
    });

    it("rolls back the optimistic save when the POST fails", async () => {
        const stub = stubFetch({ saved: [] });
        localStorage.setItem("token", "jwt");

        const { result } = renderHook(() => useSavedVendors(), {
            wrapper: createWrapper(),
        });
        await waitForCollectionFetch(stub);
        await waitFor(() => expect(result.current.isLoading).toBe(false));

        act(() => result.current.toggleSave(42));
        await waitFor(() => expect(result.current.isSaved(42)).toBe(true));

        act(() => stub.resolvePost(422));

        await waitFor(() => expect(result.current.isSaved(42)).toBe(false));
    });
});
