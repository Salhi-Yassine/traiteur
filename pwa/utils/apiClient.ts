import { ENTRYPOINT } from "../config/entrypoint";

// ─── Token Storage ────────────────────────────────────────────────────────────

export const getAuthToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

export const setAuthToken = (token: string): void => {
    localStorage.setItem("token", token);
};

export const removeAuthToken = (): void => {
    localStorage.removeItem("token");
};

export const getRefreshToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("refresh_token");
};

export const setRefreshToken = (token: string): void => {
    localStorage.setItem("refresh_token", token);
};

export const removeRefreshToken = (): void => {
    localStorage.removeItem("refresh_token");
};

// ─── Refresh Lock (module singleton) ─────────────────────────────────────────
//
// When the first 401 fires, `refreshPromise` is set to the in-flight refresh
// call. All subsequent concurrent 401s await the same promise instead of each
// racing to call POST /api/token/refresh independently. The lock is reset to
// null once the refresh settles (success or failure).

let refreshPromise: Promise<string | null> | null = null;

function dispatchLogout(): void {
    removeAuthToken();
    removeRefreshToken();
    // AuthProvider listens for this event to update its user state.
    // Using a DOM event avoids a circular import between apiClient ↔ AuthContext.
    if (typeof window !== "undefined") {
        window.dispatchEvent(new Event("auth:logout"));
    }
}

async function attemptRefresh(): Promise<string | null> {
    const storedRefreshToken = getRefreshToken();

    if (!storedRefreshToken) {
        dispatchLogout();
        return null;
    }

    try {
        const response = await fetch(`${ENTRYPOINT}/api/token/refresh`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh_token: storedRefreshToken }),
        });

        if (!response.ok) {
            dispatchLogout();
            return null;
        }

        const data: { token: string; refresh_token?: string } = await response.json();

        setAuthToken(data.token);
        // gesdinet single_use: true → a new refresh token is always issued
        if (data.refresh_token) {
            setRefreshToken(data.refresh_token);
        }

        return data.token;
    } catch {
        dispatchLogout();
        return null;
    }
}

// ─── Error Type ───────────────────────────────────────────────────────────────

export class ApiError extends Error {
    constructor(
        public message: string,
        public data: Record<string, unknown>,
        public status?: number,
    ) {
        super(message);
        this.name = "ApiError";
    }
}

// ─── Request Options ──────────────────────────────────────────────────────────

interface RequestOptions extends RequestInit {
    jsonld?: boolean;
    /** Next.js router.locale — sent as Accept-Language to drive Gedmo Translatable on the API */
    locale?: string;
    /** Internal — prevents infinite retry loop after a successful token refresh */
    _isRetry?: boolean;
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

export const fetchApi = async <T = unknown>(
    path: string,
    options: RequestOptions = {},
): Promise<T> => {
    const { locale = "fr", _isRetry = false, ...restOptions } = options;
    const token = getAuthToken();
    const headers = new Headers(restOptions.headers || {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (!headers.has("Accept-Language")) {
        headers.set("Accept-Language", locale);
    }

    if (restOptions.jsonld !== false) {
        if (!headers.has("Accept")) {
            headers.set("Accept", "application/ld+json");
        }
        if (
            !headers.has("Content-Type") &&
            ["POST", "PATCH", "PUT"].includes(restOptions.method ?? "")
        ) {
            headers.set("Content-Type", "application/ld+json");
        }
    } else {
        if (!headers.has("Accept")) {
            headers.set("Accept", "application/json");
        }
        if (
            !headers.has("Content-Type") &&
            ["POST", "PATCH", "PUT"].includes(restOptions.method ?? "")
        ) {
            headers.set("Content-Type", "application/json");
        }
    }

    const response = await fetch(`${ENTRYPOINT}${path}`, {
        ...restOptions,
        headers,
    });

    // ── Silent refresh on 401 ─────────────────────────────────────────────────
    // Only attempt refresh when the request was authenticated (had a token).
    // A 401 on a public endpoint (e.g. /auth with wrong credentials) means bad
    // credentials — not an expired session — so refresh would be wrong.
    if (response.status === 401 && !_isRetry && !!token) {
        if (!refreshPromise) {
            refreshPromise = attemptRefresh().finally(() => {
                refreshPromise = null;
            });
        }

        const newToken = await refreshPromise;

        if (!newToken) {
            // Refresh failed — user is being logged out via auth:logout event
            throw new ApiError("Session expirée. Veuillez vous reconnecter.", {}, 401);
        }

        // Retry the original request once with the fresh token
        return fetchApi<T>(path, { ...options, _isRetry: true });
    }
    // ─────────────────────────────────────────────────────────────────────────

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})) as Record<string, unknown>;
        const errorMessage =
            (errorData["hydra:description"] as string | undefined) ||
            (errorData.detail as string | undefined) ||
            (errorData.description as string | undefined) ||
            (errorData.message as string | undefined) ||
            "An error occurred";
        throw new ApiError(errorMessage, errorData, response.status);
    }

    if (response.status === 204) return null as T;

    return response.json() as Promise<T>;
};

// ─── Convenience Methods ──────────────────────────────────────────────────────

const apiClient = {
    get: <T = unknown>(path: string, options: RequestOptions = {}) =>
        fetchApi<T>(path, { ...options, method: "GET" }),
    post: <T = unknown>(path: string, data: unknown, options: RequestOptions = {}) =>
        fetchApi<T>(path, { ...options, method: "POST", body: JSON.stringify(data) }),
    patch: <T = unknown>(path: string, data: unknown, options: RequestOptions = {}) =>
        fetchApi<T>(path, { ...options, method: "PATCH", body: JSON.stringify(data) }),
    delete: <T = unknown>(path: string, options: RequestOptions = {}) =>
        fetchApi<T>(path, { ...options, method: "DELETE" }),
};

export default apiClient;
