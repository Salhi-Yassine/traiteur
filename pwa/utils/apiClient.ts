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
}

export class ApiError extends Error {
    constructor(public message: string, public data: any) {
        super(message);
        this.name = "ApiError";
    }
}

export const fetchApi = async (path: string, options: RequestOptions = {}) => {
    const token = getAuthToken();
    const headers = new Headers(options.headers || {});

    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }

    if (options.jsonld !== false) {
        if (!headers.has("Accept")) {
            headers.set("Accept", "application/ld+json");
        }
        if (!headers.has("Content-Type") && (options.method === "POST" || options.method === "PATCH" || options.method === "PUT")) {
            headers.set("Content-Type", "application/ld+json");
        }
    } else {
        if (!headers.has("Accept")) {
            headers.set("Accept", "application/json");
        }
        if (!headers.has("Content-Type") && (options.method === "POST" || options.method === "PATCH" || options.method === "PUT")) {
            headers.set("Content-Type", "application/json");
        }
    }

    const response = await fetch(`${ENTRYPOINT}${path}`, {
        ...options,
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
        throw new Error(errorMessage);
    }

    if (response.status === 204) return null;

    return response.json();
};
