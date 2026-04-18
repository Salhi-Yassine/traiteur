import { ENTRYPOINT } from "../config/entrypoint";

export const getAuthToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
};

export const setAuthToken = (token: string) => {
    localStorage.setItem("token", token);
};

export const removeAuthToken = () => {
    localStorage.removeItem("token");
};

interface RequestOptions extends RequestInit {
    jsonld?: boolean;
    /** Next.js router.locale — sent as Accept-Language to drive Gedmo Translatable on the API */
    locale?: string;
}

export class ApiError extends Error {
    constructor(public message: string, public data: Record<string, unknown>) {
        super(message);
        this.name = "ApiError";
    }
}

export const fetchApi = async <T = unknown>(path: string, options: RequestOptions = {}): Promise<T> => {
    const token = getAuthToken();
    const { locale = "fr", ...restOptions } = options;
    const headers = new Headers(restOptions.headers || {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    // Tell the API which language to serve for translatable fields (businessName, tagline, description).
    // The Symfony LocaleListener reads this and configures Gedmo TranslatableListener.
    if (!headers.has("Accept-Language")) {
        headers.set("Accept-Language", locale);
    }

    if (restOptions.jsonld !== false) {
        if (!headers.has("Accept")) {
            headers.set("Accept", "application/ld+json");
        }
        if (!headers.has("Content-Type") && (restOptions.method === "POST" || restOptions.method === "PATCH" || restOptions.method === "PUT")) {
            headers.set("Content-Type", "application/ld+json");
        }
    } else {
        if (!headers.has("Accept")) {
            headers.set("Accept", "application/json");
        }
        if (!headers.has("Content-Type") && (restOptions.method === "POST" || restOptions.method === "PATCH" || restOptions.method === "PUT")) {
            headers.set("Content-Type", "application/json");
        }
    }

    const response = await fetch(`${ENTRYPOINT}${path}`, {
        ...restOptions,
        headers,
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage =
            errorData["hydra:description"] ||
            errorData.detail ||
            errorData.description ||
            errorData.message ||
            "An error occurred";
        throw new ApiError(errorMessage, errorData);
    }

    if (response.status === 204) return null as T;

    return response.json() as Promise<T>;
};

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
