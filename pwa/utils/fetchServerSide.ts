/**
 * SSR-safe fetch wrapper for use in getServerSideProps / getStaticProps.
 * Cannot use apiClient (it reads localStorage which is browser-only).
 */

const ENTRYPOINT = process.env.NEXT_PUBLIC_API_URL || "https://localhost";

interface ServerSideOptions {
    locale?: string;
    jsonld?: boolean;
    /** Bearer token for authenticated SSR requests (e.g. forwarded from cookie) */
    token?: string;
}

export async function fetchServerSide<T = unknown>(
    path: string,
    options: ServerSideOptions = {},
): Promise<T> {
    const { locale = "fr", jsonld = true, token } = options;

    const headers: Record<string, string> = {
        "Accept-Language": locale,
        Accept: jsonld ? "application/ld+json" : "application/json",
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${ENTRYPOINT}${path}`, { headers });

    if (!res.ok) {
        throw new Error(`SSR fetch failed: ${res.status} ${path}`);
    }

    return res.json() as Promise<T>;
}
